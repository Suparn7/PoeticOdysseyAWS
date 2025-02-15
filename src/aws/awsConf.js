const awsConf = {
    awsRegion: import.meta.env.VITE_AWS_REGION,
    awsAccessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    dynamoDbTableBlogs: import.meta.env.VITE_DYNAMODB_TABLE_BLOGS,
    dynamoDbTableChats: import.meta.env.VITE_DYNAMODB_TABLE_CHATS,
    dynamoDbTableMessages: import.meta.env.VITE_DYNAMODB_TABLE_MESSAGES,
    dynamoDbTableUserInformation: import.meta.env.VITE_DYNAMODB_TABLE_USER_INFORMATION,
    dynamoDbTableComments: import.meta.env.VITE_DYNAMODB_TABLE_COMMENTS,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    clientId: import.meta.env.VITE_CLIENT_ID,
    chatBucketName: import.meta.env.VITE_CHAT_BUCKET_NAME
};

export default awsConf;
