import 'aws-sdk-client-mock-jest';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/url-shortener/shortener.lambda';

const s3ClientMock = mockClient(S3Client);

beforeEach(() => {
  s3ClientMock.reset();
  s3ClientMock.on(PutObjectCommand).resolves({});
});

process.env.DOMAIN_NAME = 'short.com';
process.env.BUCKET_NAME = 'bucket';

function s3Error(httpStatusCode: number) {
  return Object.assign(new Error(`S3 error ${httpStatusCode}`), { $metadata: { httpStatusCode } });
}

test('returns 201 with short url under a random key', async () => {
  const response = await handler({
    body: JSON.stringify({
      url: 'https://www.url.com/very/long',
    }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(201);
  const { url, shortUrl } = JSON.parse(response.body);
  expect(url).toBe('https://www.url.com/very/long');
  expect(shortUrl).toMatch(/^https:\/\/short\.com\/[\w-]{22}$/);

  const key = shortUrl.split('/').pop();
  expect(s3ClientMock).toHaveReceivedCommandWith(PutObjectCommand, {
    Bucket: 'bucket',
    Key: key,
    ContentType: 'application/json',
    Body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
    IfNoneMatch: '*',
  });
});

test('keys differ between links', async () => {
  const shorten = async () => JSON.parse((await handler({
    body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  } as AWSLambda.APIGatewayProxyEvent)).body).shortUrl;

  expect(await shorten()).not.toBe(await shorten());
});

test('retries with a new key when the key exists', async () => {
  s3ClientMock.on(PutObjectCommand).rejectsOnce(s3Error(412)).resolves({});

  const response = await handler({
    body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(201);
  const keys = s3ClientMock.commandCalls(PutObjectCommand).map((call) => call.args[0].input.Key);
  expect(keys).toHaveLength(2);
  expect(keys[0]).not.toBe(keys[1]);
});

test('retries with a new key on a conflicting write', async () => {
  s3ClientMock.on(PutObjectCommand).rejectsOnce(s3Error(409)).resolves({});

  const response = await handler({
    body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(201);
  expect(s3ClientMock).toHaveReceivedCommandTimes(PutObjectCommand, 2);
});

test('returns 500 after three taken keys', async () => {
  s3ClientMock.on(PutObjectCommand).rejects(s3Error(412));

  const response = await handler({
    body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(500);
  expect(s3ClientMock).toHaveReceivedCommandTimes(PutObjectCommand, 3);
});

test('does not retry other errors', async () => {
  s3ClientMock.on(PutObjectCommand).rejects(s3Error(403));

  const response = await handler({
    body: JSON.stringify({ url: 'https://www.url.com/very/long' }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(500);
  expect(s3ClientMock).toHaveReceivedCommandTimes(PutObjectCommand, 1);
});

test('returns 400 when url is not a string', async () => {
  const response = await handler({
    body: JSON.stringify({
      url: ['https://www.url.com/very/long', 'https://other.com'],
    }),
  } as AWSLambda.APIGatewayProxyEvent);

  expect(response.statusCode).toBe(400);
  expect(s3ClientMock).not.toHaveReceivedCommand(PutObjectCommand);
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

  expect(s3ClientMock).not.toHaveReceivedCommand(PutObjectCommand);
});

describe('with allowed url patterns', () => {
  // The patterns are read when the module loads, so this block loads its own copy,
  // with its own S3 client to mock.
  let allowedHandler: typeof handler;
  let isolatedS3ClientMock: ReturnType<typeof mockClient>;
  let IsolatedPutObjectCommand: typeof PutObjectCommand;

  beforeAll(() => {
    process.env.ALLOWED_URL_PATTERNS = JSON.stringify(['^https://www\\.url\\.com/', '^https://other\\.com/']);
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const s3 = require('@aws-sdk/client-s3');
      isolatedS3ClientMock = mockClient(s3.S3Client);
      IsolatedPutObjectCommand = s3.PutObjectCommand;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      allowedHandler = require('../../src/url-shortener/shortener.lambda').handler;
    });
  });

  beforeEach(() => {
    isolatedS3ClientMock.reset();
    isolatedS3ClientMock.on(IsolatedPutObjectCommand).resolves({});
  });

  afterAll(() => {
    delete process.env.ALLOWED_URL_PATTERNS;
  });

  test('shortens a url matching a pattern', async () => {
    const response = await allowedHandler({
      body: JSON.stringify({ url: 'https://other.com/path' }),
    } as AWSLambda.APIGatewayProxyEvent);

    expect(response.statusCode).toBe(201);
    expect(isolatedS3ClientMock.commandCalls(IsolatedPutObjectCommand)).toHaveLength(1);
  });

  test('returns 400 for a url matching no pattern', async () => {
    const response = await allowedHandler({
      body: JSON.stringify({ url: 'https://www.url.com.evil.com/path' }),
    } as AWSLambda.APIGatewayProxyEvent);

    expect(response.statusCode).toBe(400);
    expect(isolatedS3ClientMock.commandCalls(IsolatedPutObjectCommand)).toHaveLength(0);
  });
});
