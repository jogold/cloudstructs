const s3ClientMock = {
  putObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

const documentClientMock = {
  update: jest.fn().mockReturnValue({
    promise: () => ({
      Attributes: {
        value: 1000,
      },
    }),
  }),
};

import { handler } from '../../src/url-shortener/shortener.lambda';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => s3ClientMock),
    DynamoDB: {
      DocumentClient: jest.fn(() => documentClientMock),
    },
  };
});

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

  expect(documentClientMock.update).toHaveBeenCalledWith({
    TableName: 'my-table',
    Key: { key: 'counter' },
    UpdateExpression: 'ADD #value :incr',
    ExpressionAttributeNames: { '#value': 'value' },
    ExpressionAttributeValues: { ':incr': 1 },
    ReturnValues: 'UPDATED_NEW',
  });

  expect(s3ClientMock.putObject).toHaveBeenCalledWith({
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

  expect(s3ClientMock.putObject).not.toHaveBeenCalled();
});
