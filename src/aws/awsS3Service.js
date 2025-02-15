import { PutCommand, GetCommand, UpdateCommand, QueryCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"; // Import the S3Client and PutObjectCommand
import dynamoDocClient from "./awsConfig";
import awsConf from "./awsConf";
import axios from "axios";

class AwsS3Service{
    async uploadFileToS3({ bucketName, fileName, fileBody, contentType }) {
        const s3Client = new S3Client({ 
            region: awsConf.awsRegion ,
            credentials: {
                accessKeyId: awsConf.awsAccessKeyId,
                secretAccessKey: awsConf.awsSecretAccessKey,
            },
        }); // Create a new S3Client instance

        const fileBodyBuffer = await fileBody.arrayBuffer();  // Convert Blob to Buffer
        const s3Params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBodyBuffer,
            ContentType: contentType,
        };

        try {
            const command = new PutObjectCommand(s3Params); // Create a PutObjectCommand with parameters
            const result = await s3Client.send(command); // Send the command to S3
            return `https://${bucketName}.s3.${awsConf.awsRegion}.amazonaws.com/${fileName}`; // Return the public URL of the uploaded file
        } catch (error) {
            console.error("Error uploading file to S3:", error);
            return false;
        }
    }

    async deleteFileFromS3({ bucketName, fileName}) {
        const s3Client = new S3Client({ 
            region: awsConf.awsRegion,
            credentials: {
                accessKeyId: awsConf.awsAccessKeyId,
                secretAccessKey: awsConf.awsSecretAccessKey,
            },
        }); // Create a new S3Client instance

        const s3Params = {
            Bucket: bucketName,
            Key: fileName
        };

        try {
            const command = new DeleteObjectCommand(s3Params); // Create a PutObjectCommand with parameters
            await s3Client.send(command); // Send the command to S3
            
            
        } catch (error) {
            console.error("Error uploading file to S3:", error);
            return false;
        }
    }

     // Upload file from a URL (e.g., Pexels image)
     async uploadFileFromUrl({url, bucketName, fileName, contentType }) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const fileBlob = new Blob([response.data], { type: 'image/jpeg' });
            const fileBody = new File([fileBlob], fileName, { type: 'image/jpeg' });

            await this.uploadFileToS3({bucketName, fileName, fileBody, contentType}); // Reuse the existing uploadFile method
        } catch (error) {
            console.error("AWS service :: uploadFileFromUrl() :: ", error);
            return false;
        }
    }

    // Upload file from a Blob (e.g., from a base64 URL or Blob URL)
    async uploadFileFromBlob({blob, bucketName, fileName, contentType }) {
        try {
            const fileBody = new File([blob], fileName, { type: 'image/jpeg' });
            return this.uploadFileToS3({bucketName, fileName, fileBody, contentType }); // Reuse the existing uploadFile method
        } catch (error) {
            console.error("AWS service :: uploadFileFromBlob() :: ", error);
            return false;
        }
    }
}

const awsS3Service = new AwsS3Service();
export default awsS3Service;