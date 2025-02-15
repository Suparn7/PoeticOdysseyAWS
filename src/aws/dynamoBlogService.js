import { PutCommand, GetCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dynamoDocClient from "./awsConfig";
import awsConf from "./awsConf";
import { v4 as uuidv4 } from 'uuid';

class DynamoBlogService {

}


const dynamoBlogService = new DynamoBlogService();
export default dynamoBlogService;