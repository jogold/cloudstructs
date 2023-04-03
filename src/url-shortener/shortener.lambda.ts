/* eslint-disable no-console */
import { URL } from 'url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

function base62Encode(int: number): string {
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (int === 0) return '0';
  let s = '';
  while (int > 0) {
    s = characterSet[int % 62] + s;
    int = Math.floor(int / 62);
  }
  return s;
};

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`The environment variable ${name} is not defined`);
  }

  return value;
}

function isUrlValid(url?: string): boolean {
  if (!url) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

const dynamoDBClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

const s3Client = new S3Client({});

export async function handler(event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  console.log('Event: %j', event);

  const response: AWSLambda.APIGatewayProxyResult = {
    statusCode: 201,
    body: '',
    headers: process.env.CORS_ALLOW_ORIGINS
      ? { 'Access-Control-Allow-Origin': process.env.CORS_ALLOW_ORIGINS }
      : undefined,
  };

  try {
    const body = JSON.parse(event.body ?? '{}');

    if (!isUrlValid(body.url)) {
      return {
        ...response,
        statusCode: 400,
      };
    }

    // Get next counter value
    const update = await documentClient.send(new UpdateCommand({
      TableName: getEnv('TABLE_NAME'),
      Key: { key: 'counter' },
      UpdateExpression: 'ADD #value :incr',
      ExpressionAttributeNames: { '#value': 'value' },
      ExpressionAttributeValues: { ':incr': 1 },
      ReturnValues: 'UPDATED_NEW',
    }));

    const value = update.Attributes?.value;

    if (!value) {
      throw new Error('Cannot get next counter value');
    }

    const key = base62Encode(value);
    console.log('Key: %j', key);

    const putObject = await s3Client.send(new PutObjectCommand({
      Bucket: getEnv('BUCKET_NAME'),
      Key: key,
      ContentType: 'application/json',
      Body: JSON.stringify({ url: body.url }),
    }));
    console.log('Put object: %j', putObject);

    // Return short url
    return {
      ...response,
      body: JSON.stringify({
        url: body.url,
        shortUrl: `https://${getEnv('DOMAIN_NAME')}/${key}`,
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      ...response,
      statusCode: 500,
    };
  }
}
