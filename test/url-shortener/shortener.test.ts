const documentClientMock = {
  update: jest.fn().mockReturnValue({
    promise: () => ({
      Attributes: {
        value: 1000,
      },
    }),
  }),
};

import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/url-shortener/shortener.lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const s3ClientMock = mockClient(S3Client);
const dynamodbMockClient = mockClient(DynamoDBClient);

beforeEach(() => {
  s3ClientMock.reset();
  dynamodbMockClient.reset();
})

process.env.TABLE_NAME = 'my-table';
process.env.DOMAIN_NAME = 'short.com';
process.env.BUCKET_NAME = 'bucket';

test('returns 201 with short url', async () => {
  const response = await handler({
    body: JSON.stringify({
      url: 'https://www.url.com/very/long',
    }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response).toEqual({
    statusCode: 201,
    body: JSON.stringify({
      url: 'https://www.url.com/very/long',
      shortUrl: 'https://short.com/QI',
    }),
  });

  expect(dynamodbMockClient).toHaveBeenCalledWith(UpdateItemCommand, {
    TableName: 'my-table',
    Key: { key: 'counter' },
    UpdateExpression: 'ADD #value :incr',
    ExpressionAttributeNames: { '#value': 'value' },
    ExpressionAttributeValues: { ':incr': 1 },
    ReturnValues: 'UPDATED_NEW',
  });

  expect(s3ClientMock).toHaveReceivedCommandWith(PutObjectCommand, {
    Bucket: 'bucket',
    Key: 'QI',
    ContentType: 'application/json',
    Body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  });
});

test('returns 400 with invalid url', async () => {
  const response = await handler({
    body: JSON.stringify({
      url: 'hello',
    }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response).toEqual({
    statusCode: 400,
    body: '',
  });

  expect(documentClientMock.update). not.toHaveBeenCalled();

  expect(s3ClientMock).not.toHaveReceivedCommand(PutObjectCommand);
});
