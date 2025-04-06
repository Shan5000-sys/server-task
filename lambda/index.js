const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const TABLE_NAME = process.env.TASKS_TABLE;
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event) => {
  const { httpMethod, resource, pathParameters } = event;

  const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
  };

  try {
    // === /tasks GET ===
    if (httpMethod === 'GET' && resource === '/tasks') {
      const data = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
      return { statusCode: 200, headers, body: JSON.stringify(data.Items) };
    }

    // === /tasks POST ===
    if (httpMethod === 'POST' && resource === '/tasks') {
      const body = JSON.parse(event.body);
      const { taskId, userId, title, status } = body;

      await dynamodb.put({
        TableName: TABLE_NAME,
        Item: { taskId, userId, title, status },
      }).promise();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Task created' }),
      };
    }

    // === /upload-url POST ===
    if (httpMethod === 'POST' && resource === '/upload-url') {
      const body = JSON.parse(event.body);
      const { key, contentType } = body;

      const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Expires: 300, // 5 minutes
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ uploadUrl }),
      };
    }

    // === /analyze POST ===
    if (httpMethod === 'POST' && resource === '/analyze') {
      const body = JSON.parse(event.body);
      const { imageKey } = body;

      const result = await rekognition.detectLabels({
        Image: {
          S3Object: {
            Bucket: BUCKET_NAME,
            Name: imageKey,
          },
        },
        MaxLabels: 5,
        MinConfidence: 75,
      }).promise();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ labels: result.Labels }),
      };
    }

    // === /tasks/{taskId}/process-image POST ===
    if (httpMethod === 'POST' && resource === '/tasks/{taskId}/process-image') {
      const taskId = pathParameters?.taskId;
      const body = JSON.parse(event.body);
      const imageKey = body.imageKey;

      let labels = [];
      try {
        const rekognitionResult = await rekognition.detectLabels({
          Image: {
            S3Object: {
              Bucket: BUCKET_NAME,
              Name: imageKey,
            },
          },
          MaxLabels: 5,
          MinConfidence: 80,
        }).promise();

        labels = rekognitionResult.Labels;
      } catch (rekErr) {
        console.warn(`Rekognition failed for task ${taskId}:`, rekErr);
        // continue without throwing
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ taskId, labels }),
      };
    }

    // === Fallback ===
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not handled' }),
    };

  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};