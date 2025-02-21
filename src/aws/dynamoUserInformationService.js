import { PutCommand, GetCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dynamoDocClient from "./awsConfig";
import awsConf from "./awsConf";
import { v4 as uuidv4 } from 'uuid';

class DynamoUserInformationService {
    // Get user info by email
    async getUserInfoByUserNameId(userNameId) {
        const params = {
            TableName: awsConf.dynamoDbTableUserInformation,
            Key: { userId: userNameId }, // assuming email as unique key
        };

        try {
            const result = await dynamoDocClient.send(new GetCommand(params));
            return result.Item || null;
        } catch (error) {
            console.error("Error fetching user info:", error);
            return false;
        }
    }

    async getPeerDetailsByUserId(userId) {
        const params = {
            TableName: 'realtimeUserConnections', // Replace with your actual table name
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        try {
            const result = await dynamoDocClient.send(new QueryCommand(params));
            if (result.Items && result.Items.length > 0) {
                // Assuming the latest connection is the one we want
                const latestConnection = result.Items[0];
                return latestConnection || null;
            }
            return null;
        } catch (error) {
            console.error("Error fetching peerId:", error);
            return null;
        }
    }
    async getUsers() {
        const params = {
            TableName: awsConf.dynamoDbTableUserInformation
        };
    
        try {
            const result = await dynamoDocClient.send(new ScanCommand(params));
            return {
                users: result.Items,
            };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return false;
        }
    }

    // Create a new user in the UserInformation table
    async createUser({ userSub, email, name, bio, phoneNumber, profilePicUrl, likedPosts, savedPosts, postsCreated, following, followers}) { 
        const params = {
            TableName: awsConf.dynamoDbTableUserInformation,
            Item: {
                userId: userSub, // Use email as userId
                email,
                name,
                bio: bio || "",
                phoneNumber: phoneNumber || "",
                profilePicUrl: profilePicUrl || "",
                likedPosts: likedPosts || [],
                savedPosts: savedPosts || [],
                postsCreated: postsCreated || [],
                following: following || [],
                followers: followers || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };

        try {
            await dynamoDocClient.send(new PutCommand(params));
            return { success: true, message: "User created successfully" };
        } catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
    }

    // Update user info
    async updateUserInfo(userId, updateData) {
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        // Dynamically construct the update expression
        for (const [key, value] of Object.entries(filteredData)) {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeNames[`#${key}`] = key;
            expressionAttributeValues[`:${key}`] = value;
        }

        const params = {
            TableName: awsConf.dynamoDbTableUserInformation,
            Key: { userId },
            UpdateExpression: `SET ${updateExpression.join(", ")}, updatedAt = :updatedAt`,
            ExpressionAttributeNames: {
                ...expressionAttributeNames,
            },
            ExpressionAttributeValues: {
                ...expressionAttributeValues,
                ":updatedAt": new Date().toISOString(),
            },
            ReturnValues: "ALL_NEW",
        };

        try {
            const result = await dynamoDocClient.send(new UpdateCommand(params));
            return result.Attributes;
        } catch (error) {
            console.error("Error updating user info:", error);
            return false;
        }
    }

    // Upload profile picture to S3 and return the URL
    async uploadProfilePicToS3({ bucketName, fileName, fileBody, contentType }) {
        const s3Client = new S3Client({
            region: awsConf.awsRegion,
            credentials: {
                accessKeyId: awsConf.awsAccessKeyId,
                secretAccessKey: awsConf.awsSecretAccessKey,
            },
        });

        const fileBodyBuffer = await fileBody.arrayBuffer(); // Convert Blob to Buffer
        const s3Params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBodyBuffer,
            ContentType: contentType,
        };

        try {
            const command = new PutObjectCommand(s3Params);
            await s3Client.send(command);
            return `https://${bucketName}.s3.${awsConf.awsRegion}.amazonaws.com/${fileName}`;
        } catch (error) {
            console.error("Error uploading profile picture to S3:", error);
            return false;
        }
    }

    // Like a post
    async likePost(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            const likedPosts = [...new Set([...(user.likedPosts || []), postId])];
            await this.updateUserInfo(userId, { likedPosts });

            return true;
        } catch (error) {
            console.error("Error liking post:", error);
            return false;
        }
    }

    // Save a post
    async savePost(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            const savedPosts = [...new Set([...(user.savedPosts || []), postId])];
            await this.updateUserInfo(userId, { savedPosts });

            return true;
        } catch (error) {
            console.error("Error saving post:", error);
            return false;
        }
    }

    // Unlike a post
    async unlikePost(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            // Remove the postId from likedPosts
            const likedPosts = (user.likedPosts || []).filter(id => id !== postId);
            await this.updateUserInfo(userId, { likedPosts });

            return true;
        } catch (error) {
            console.error("Error unliking post:", error);
            return false;
        }
    }

    // Unsave a post
    async unsavePost(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            // Remove the postId from savedPosts
            const savedPosts = (user.savedPosts || []).filter(id => id !== postId);
            await this.updateUserInfo(userId, { savedPosts });

            return true;
        } catch (error) {
            console.error("Error unsaving post:", error);
            return false;
        }
    }

    // Get liked posts
    async getLikedPosts(userId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            return user?.likedPosts || [];
        } catch (error) {
            console.error("Error fetching liked posts:", error);
            return [];
        }
    }

    // Get saved posts
    async getSavedPosts(userId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            return user?.savedPosts || [];
        } catch (error) {
            console.error("Error fetching saved posts:", error);
            return [];
        }
    }

    // Add a created post
    async addPostCreated(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            const postsCreated = [...new Set([...(user.postsCreated || []), postId])];
            await this.updateUserInfo(userId, { postsCreated });

            return true;
        } catch (error) {
            console.error("Error adding created post:", error);
            return false;
        }
    }

    // Remove a created post
    async removePostCreated(userId, postId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            if (!user) return false;

            // Filter out the postId from postsCreated
            const postsCreated = (user.postsCreated || []).filter(id => id !== postId);
            await this.updateUserInfo(userId, { postsCreated });

            return true;
        } catch (error) {
            console.error("Error removing created post:", error);
            return false;
        }
    }


    // Get created posts
    async getPostsCreated(userId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            return user?.postsCreated || [];
        } catch (error) {
            console.error("Error fetching created posts:", error);
            return [];
        }
    }

    //FOLLWOING SECTION

    // Follow a user (add to following and followers)
    async followUser(currentUserId, targetUserId, dispatch) {
        try {
            // Fetch the current user
            const currentUser = await this.getUserInfoByUserNameId(currentUserId);

            // Fetch the target user
            const targetUser = await this.getUserInfoByUserNameId(targetUserId);

            // Ensure the user is not already following the target user
            if (!currentUser.following.includes(targetUserId)) {
                // Add targetUserId to the current user's following array
                currentUser.following.push(targetUserId);

                // Add currentUserId to the target user's followers array
                targetUser.followers.push(currentUserId);

                // Update both users in the database
                await this.updateUserInfo(currentUserId, { following: currentUser.following });
                await this.updateUserInfo(targetUserId, { followers: targetUser.followers });

                // Create a follow notification for the target user
                // const notificationMessages = [
                //     {
                //         text: `${currentUser.name} started following you!`,
                //         read: false,
                //         createdAt: new Date().toISOString()
                //     }
                // ];

                // // Call the method to create the notification for the target user
                // await this.createNotification({
                //     toUserId: targetUserId,
                //     name: targetUser.name,
                //     email: targetUser.email,
                //     postId: null, // As this is a follow notification, no post is involved
                //     notificationMessages,
                //     fromUserId: currentUserId
                // }, dispatch);

                return true;
            } else {
                //console.log(`${currentUserId} is already following ${targetUserId}`);
                return false; // Already following
            }
        } catch (error) {
            console.log('Error following user:', error);
            return false;
        }
    }

    // Unfollow a user (remove from following and followers)
    async unfollowUser(currentUserId, targetUserId) {
        try {
            // Fetch the current user
            const currentUser = await this.getUserInfoByUserNameId(currentUserId);

            // Fetch the target user
            const targetUser = await this.getUserInfoByUserNameId(targetUserId);

            // Remove targetUserId from the current user's following array
            currentUser.following = currentUser.following.filter(id => id !== targetUserId);

            // Remove currentUserId from the target user's followers array
            targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);

            // Update both users in the database
            await this.updateUserInfo(currentUserId, { following: currentUser.following });
            await this.updateUserInfo(targetUserId, { followers: targetUser.followers });

            //console.log(`${currentUserId} has unfollowed ${targetUserId}`);
            return true;
        } catch (error) {
            console.log('Error unfollowing user:', error);
            return false;
        }
    }

    // Get a user's followers
    async getFollowers(userId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            const followers = user.followers || [];
            return followers; // Return an array of user IDs who follow the specified user
        } catch (error) {
            console.log('Error fetching followers:', error);
            return []; // Return an empty array in case of error
        }
    }

    // Get a user's following list
    async getFollowing(userId) {
        try {
            const user = await this.getUserInfoByUserNameId(userId);
            const following = user.following || [];
            return following; // Return an array of user IDs that the specified user is following
        } catch (error) {
            console.log('Error fetching following list:', error);
            return []; // Return an empty array in case of error
        }
    }

    // Check if a user is following another user
    async isFollowing(currentUserId, targetUserId) {
        try {
            const currentUser = await this.getUserInfoByUserNameId(currentUserId);
            return currentUser.following.includes(targetUserId); // Return true if the current user is following the target user
        } catch (error) {
            console.log('Error checking if user is following:', error);
            return false;
        }
    }
}

const dynamoUserInformationService = new DynamoUserInformationService();
export default dynamoUserInformationService;
