import { v4 as uuidv4 } from 'uuid';
import { PutCommand, GetCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dynamoDocClient from "./awsConfig";
import awsConf from "./awsConf";
import axios from "axios";

class AwsChatService {
  constructor() {
    this.chatsTable = 'Chats';
    this.messagesTable = 'Messages';
  }

  async uploadChatFile(file) {
    const s3Client = new S3Client({ 
      region: awsConf.awsRegion,
      credentials: {
        accessKeyId: awsConf.awsAccessKeyId,
        secretAccessKey: awsConf.awsSecretAccessKey,
      },
    });

    const fileBodyBuffer = await file.arrayBuffer();
    const s3Params = {
      Bucket: awsConf.chatBucketName,
      Key: file.name,
      Body: fileBodyBuffer,
      ContentType: file.type,
    };

    try {
      const command = new PutObjectCommand(s3Params);
      const result = await s3Client.send(command);
      return `https://${awsConf.chatBucketName}.s3.${awsConf.awsRegion}.amazonaws.com/${file.name}`;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      return false;
    }
  }

  async getChatsByUser(userId) {
    const params = {
      TableName: this.chatsTable,
      FilterExpression: 'contains(participants, :userId)',
      ExpressionAttributeValues: { ':userId': userId }
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamoDocClient.send(command);
      return data.Items;
    } catch (error) {
      console.error('AwsChatService :: getChatsByUser() :: ', error);
      return [];
    }
  }

  async sendMessage({ chatId, senderId, receiverId, messageContent, messageType, imageURL }) {
    const messageId = uuidv4();
    const messageDocument = {
      messageId: messageId,
      chatId,
      senderId,
      receiverId,
      messageContent,
      timestamp: new Date().toISOString(),
      isEdited: false,
      msgType: messageType,
      status: 'sent',
      msgImg: messageType === 'image' ? imageURL : undefined
    };

    const params = {
      TableName: this.messagesTable,
      Item: messageDocument
    };

    try {
      const command = new PutCommand(params);
      await dynamoDocClient.send(command);
      return messageDocument;
    } catch (error) {
      console.error('AwsChatService :: sendMessage() :: ', error);
      return null;
    }
  }

  async getChatBetweenUsers(userId, selectedUserId) {
    const params = {
      TableName: this.chatsTable,
      FilterExpression: 'contains(participants, :userId) AND contains(participants, :selectedUserId)',
      ExpressionAttributeValues: { ':userId': userId, ':selectedUserId': selectedUserId }
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamoDocClient.send(command);
      if (data.Items.length > 0) {
        return data.Items[0];
      }
      return null;
    } catch (error) {
      console.error('AwsChatService :: getChatBetweenUsers() :: ', error);
      return null;
    }
  }

  async createChat(userId, selectedUserId, selectedUserName) {
    const chatId = uuidv4();
    const chatDocument = {
      chatId,
      participants: [userId, selectedUserId],
      createdAt: new Date().toISOString(),
      chatName: selectedUserName,
    };

    const params = {
      TableName: this.chatsTable,
      Item: chatDocument
    };

    try {
      const command = new PutCommand(params);
      await dynamoDocClient.send(command);
      return chatDocument;
    } catch (error) {
      console.error('AwsChatService :: createChat() :: ', error);
      return null;
    }
  }

  async editMessage(messageId, newContent) {
    const params = {
      TableName: this.messagesTable,
      Key: { messageId: messageId },
      UpdateExpression: 'set messageContent = :newContent, isEdited = :isEdited',
      ExpressionAttributeValues: {
        ':newContent': newContent,
        ':isEdited': true
      },
      ReturnValues: 'UPDATED_NEW'
    };

    try {
      const command = new UpdateCommand(params);
      const result = await dynamoDocClient.send(command);
      return result.Attributes;
    } catch (error) {
      console.error('AwsChatService :: editMessage() :: ', error);
      return false;
    }
  }

  async deleteMessage(messageId) {
    const params = {
      TableName: this.messagesTable,
      Key: { messageId: messageId }
    };

    try {
      const command = new DeleteCommand(params);
      await dynamoDocClient.send(command);
      return true;
    } catch (error) {
      console.error('AwsChatService :: deleteMessage() :: ', error);
      return false;
    }
  }

  async getMessagesByChat(chatId) {
    const params = {
      TableName: this.messagesTable,
      FilterExpression: 'chatId = :chatId',
      ExpressionAttributeValues: { ':chatId': chatId }
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamoDocClient.send(command);
      const sortedMessages = data.Items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return sortedMessages.map((msg) => ({
        ...msg,
        reactions: msg.reactions || [],
      }));
    } catch (error) {
      console.error('AwsChatService :: getMessagesByChat() :: ', error);
      return [];
    }
  }

  async addReaction(messageId, userId, reactionType) {
    try {
      const message = await this.getMessageById(messageId);
      const currentReactions = message.reactions || [];
      const newReaction = `${messageId}+${userId}+${reactionType}`;
      const existingReactionIndex = currentReactions.findIndex(
        (reaction) => reaction.startsWith(`${messageId}+${userId}+`)
      );

      if (existingReactionIndex !== -1) {
        currentReactions.splice(existingReactionIndex, 1);
      }

      currentReactions.push(newReaction);

      const params = {
        TableName: this.messagesTable,
        Key: { messageId: messageId },
        UpdateExpression: 'set reactions = :reactions',
        ExpressionAttributeValues: { ':reactions': currentReactions },
        ReturnValues: 'UPDATED_NEW'
      };

      const command = new UpdateCommand(params);
      await dynamoDocClient.send(command);
      return currentReactions;
    } catch (error) {
      console.error('AwsChatService :: addReaction() :: ', error);
      return null;
    }
  }

  async removeReaction(messageId, userId, reactionType) {
    try {
      const message = await this.getMessageById(messageId);
      const currentReactions = message.reactions || [];
      const updatedReactions = currentReactions.filter(
        (reaction) => !(reaction === `${messageId}+${userId}+${reactionType}`)
      );

      const params = {
        TableName: this.messagesTable,
        Key: { messageId: messageId },
        UpdateExpression: 'set reactions = :reactions',
        ExpressionAttributeValues: { ':reactions': updatedReactions },
        ReturnValues: 'UPDATED_NEW'
      };

      const command = new UpdateCommand(params);
      await dynamoDocClient.send(command);
      return updatedReactions;
    } catch (error) {
      console.error('AwsChatService :: removeReaction() :: ', error);
      return false;
    }
  }

  async getMessageById(messageId) {
    const params = {
      TableName: this.messagesTable,
      Key: { messageId: messageId }
    };

    try {
      const command = new GetCommand(params);
      const data = await dynamoDocClient.send(command);
      return data.Item;
    } catch (error) {
      console.error('AwsChatService :: getMessageById() :: ', error);
      return null;
    }
  }
}

const awsChatService = new AwsChatService();
export default awsChatService;