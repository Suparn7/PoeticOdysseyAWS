import { PutCommand, GetCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand, BatchGetCommand} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Import the S3Client and PutObjectCommand
import dynamoDocClient from "./awsConfig";
import { v4 as uuidv4 } from "uuid";
import awsConf from "./awsConf";
import * as fs from 'fs';

class DynamoService {

    // Get a single post by slug
    async getPost(slug) {
        const params = {
            TableName: awsConf.dynamoDbTableBlogs,
            Key: { blogId: slug },
        };

        try {
            const result = await dynamoDocClient.send(new GetCommand(params));
            return result.Item || null;
        } catch (error) {
            console.error("Error fetching post:", error);
            return false;
        }
    }

    // Get all posts with optional filters
    async getPosts() {
        const params = {
            TableName: awsConf.dynamoDbTableBlogs,
        };
    
        try {
            const result = await dynamoDocClient.send(new ScanCommand(params));
            return {
                posts: result.Items,
                lastEvaluatedKey: result.LastEvaluatedKey,
            };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return false;
        }
    }

    async getPostsByIds(postIds) {
        const params = {
            RequestItems: {
                [awsConf.dynamoDbTableBlogs]: {
                    Keys: postIds.map((postId) => ({ blogId: postId })),
                },
            },
        };
    
        try {
            const result = await dynamoDocClient.send(new BatchGetCommand(params));
            return result.Responses[awsConf.dynamoDbTableBlogs] || [];
        } catch (error) {
            console.error("Error fetching posts by IDs:", error);
            return false;
        }
    }
    
    

    // Create a new post
    async createPost({ slug, title, content, featuredImage, status, userId, author }) {
        const currTime = new Date().toISOString()
        const params = {
            TableName: awsConf.dynamoDbTableBlogs,
            Item: {
                blogId: slug,
                title,
                content,
                featuredImage,
                status,
                userId,
                author,
                likedBy: [],
                savedBy: [],
                createdAt: currTime,
            },
        };

        try {
            await dynamoDocClient.send(new PutCommand(params));
            return { 
                success: true,
                userId, 
                author,
                blogId: slug,
                title,
                content,
                featuredImage,
                status,
                likedBy: [],
                savedBy: [],
                createdAt: currTime
                };
        } catch (error) {
            console.error("Error creating post:", error);
            return false;
        }
    }

    // Update an existing post
    async updatePost(slug, { title, content, featuredImage, status, likedBy, savedBy, author }) {
        // Filter out undefined values
        const updateData = { title, content, featuredImage, status, likedBy, savedBy, author };
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        // Dynamically construct update expressions
        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        for (const [key, value] of Object.entries(filteredData)) {
            updateExpression.push(`${key === "status" ? "#status" : key} = :${key}`);
            expressionAttributeValues[`:${key}`] = value;
            if (key === "status") {
                expressionAttributeNames[`#status`] = "status";
            }
        }

        const params = {
            TableName: awsConf.dynamoDbTableBlogs,
            Key: { blogId: slug },
            UpdateExpression: `set ${updateExpression.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            ReturnValues: "ALL_NEW",
        };

        try {
            const result = await dynamoDocClient.send(new UpdateCommand(params));
            return result.Attributes;
        } catch (error) {
            console.error("Error updating post:", error);
            return false;
        }
    }


    // Delete a post by slug
    async deletePost(slug) {
        const params = {
            TableName: awsConf.dynamoDbTableBlogs,
            Key: { blogId: slug },
        };

        try {
            await dynamoDocClient.send(new DeleteCommand(params));
            return { success: true, message: "Post deleted successfully" };
        } catch (error) {
            console.error("Error deleting post:", error);
            return false;
        }
    }

    // Add a comment
    async addComment(postId, userId, userName, text) {
        const newComment = {
            commentId: uuidv4(), // Generate a unique ID for the comment
            postId,
            userId,
            userName,
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: [],
            replies: []
        };

        const params = {
            TableName: awsConf.dynamoDbTableComments,
            Item: newComment
        };

        try {
            await dynamoDocClient.send(new PutCommand(params));
            return newComment; // Return the newly created comment
        } catch (error) {
            console.error("Error adding comment:", error);
            return false;
        }
    }

    // Get comments by post ID
    // Get comments by post ID
    async getCommentsByPostId(postId) {
        const params = {
            TableName: awsConf.dynamoDbTableComments,
            KeyConditionExpression: 'postId = :postId',
            ExpressionAttributeValues: {
                ':postId': postId
            }
        };

        try {
            const result = await dynamoDocClient.send(new QueryCommand(params));
            return result.Items || []; // Return an array of comments
        } catch (error) {
            console.error("Error fetching comments:", error);
            return false;
        }
    }


    // Update a comment
    async updateComment(commentId, updatedText) {
        const params = {
            TableName: awsConf.dynamoDbTableComments,
            Key: { commentId },
            UpdateExpression: 'set text = :text, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':text': updatedText,
                ':updatedAt': new Date().toISOString()
            }
        };

        try {
            await dynamoDocClient.send(new UpdateCommand(params));
            return { success: true }; // Indicate success
        } catch (error) {
            console.error("Error updating comment:", error);
            return false;
        }
    }

    // Delete a comment
    async deleteComment(commentId, postId) {
        const params = {
            TableName: awsConf.dynamoDbTableComments,
            Key: { commentId, postId }
        };
        try {
            await dynamoDocClient.send(new DeleteCommand(params));
            return { success: true, message: "Comment deleted successfully", commentId, postId };
        } catch (error) {
            console.error("Error deleting comment:", error);
            return false;
        }
    }

    // Like a comment
    async likeComment(commentId, userId) {
        const comment = await this.getCommentById(commentId); // Assume this method exists to fetch a single comment

        if (comment && !comment.likes.includes(userId)) {
            const updatedLikes = [...new Set([...comment.likes, userId])]; // Avoid duplicates

            const params = {
                TableName: awsConf.dynamoDbTableComments,
                Key: { commentId },
                UpdateExpression: 'set likes = :likes',
                ExpressionAttributeValues: {
                    ':likes': updatedLikes
                }
            };

            try {
                await dynamoDocClient.send(new UpdateCommand(params));
                return { success: true };
            } catch (error) {
                console.error("Error liking comment:", error);
                return false;
            }
        }
        
        return { success: false, message: "Comment not found or already liked" };
    }

    // Get a single comment by ID (helper function for liking)
    async getCommentById(commentId) {
        const params = {
            TableName: awsConf.dynamoDbTableComments,
            Key: { commentId }
        };

        try {
            const result = await dynamoDocClient.send(new GetCommand(params));
            return result.Item || null; // Return the found comment or null
        } catch (error) {
            console.error("Error fetching comment:", error);
            return false;
        }
    }

    async fetchNotifications(userId) {
        const notificationsResponse = await dynamoDocClient.send(new QueryCommand({
            TableName: "Notifications",
            IndexName: 'receiverId-index', // Replace with your actual GSI name
            KeyConditionExpression: 'receiverId = :receiverId',
            ExpressionAttributeValues: {
              ':receiverId': userId,
            },
          }));
          return notificationsResponse?.Items;
    }

    // Assuming dynamoDocClient is already initialized
    async deleteNotification(userId, notificationId) {
        try {
            // Define the parameters for the delete operation
            const params = {
                TableName: "Notifications",
                Key: {
                    notificationId: notificationId, // Partition key
                    //userId: userId // Sort key
                }
            };

            // Execute the delete command
            await dynamoDocClient.send(new DeleteCommand(params));
            return true;
        } catch (error) {
            console.error("Error deleting notification:", error);
            return false;
        }
    }

    
}

const dynamoService = new DynamoService();
export default dynamoService;
