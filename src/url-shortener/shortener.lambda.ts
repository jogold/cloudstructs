/* eslint-disable no-console */
import { randomBytes } from 'crypto';
import { URL } from 'url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Random bytes in a key. A short link often stands in for a URL that carries a
 * credential (a presigned URL for example), so a key must not be guessable from
 * the keys around it: 128 bits make that impossible.
 */
const KEY_BYTES = 16;

/**
 * Attempts at writing a redirect under a fresh key. Two random 128-bit keys never
 * collide in practice; the conditional write makes sure a collision could never
 * overwrite another link, and a retry draws a new key.
 */
const MAX_KEY_ATTEMPTS = 3;

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`The environment variable ${name} is not defined`);
  }

  return value;
}

function isUrlValid(url: unknown): url is string {
  if (typeof url !== 'string' || !url) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

// Compiled once per container rather than per request
const allowedUrlPatterns: RegExp[] | undefined = process.env.ALLOWED_URL_PATTERNS
  ? (JSON.parse(process.env.ALLOWED_URL_PATTERNS) as string[]).map((pattern) => new RegExp(pattern))
  : undefined;

function isUrlAllowed(url: string): boolean {
  return !allowedUrlPatterns || allowedUrlPatterns.some((pattern) => pattern.test(url));
}

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

    if (!isUrlValid(body.url) || !isUrlAllowed(body.url)) {
      return {
        ...response,
        statusCode: 400,
      };
    }

    const key = await putRedirect(body.url);
    console.log('Key: %j', key);

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

/**
 * Saves the redirect under a new random key and returns the key
 */
async function putRedirect(url: string): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    const key = randomBytes(KEY_BYTES).toString('base64url');
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: getEnv('BUCKET_NAME'),
        Key: key,
        ContentType: 'application/json',
        Body: JSON.stringify({ url }),
        IfNoneMatch: '*', // never overwrite an existing link
      }));
      return key;
    } catch (err) {
      // 412: the key exists, 409: a concurrent write to the same key
      const statusCode = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      if ((statusCode !== 412 && statusCode !== 409) || attempt >= MAX_KEY_ATTEMPTS) {
        throw err;
      }
    }
  }
}
