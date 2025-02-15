import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import awsConf from './awsConf';

const dynamoClient = new DynamoDBClient({
    region: awsConf.awsRegion,
    credentials: {
        accessKeyId: awsConf.awsAccessKeyId,
        secretAccessKey: awsConf.awsSecretAccessKey,
    },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export default dynamoDocClient;