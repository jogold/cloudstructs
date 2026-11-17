import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

// Read once per container. Unset: links redirect until their object expires.
const linkTtlSeconds = process.env.LINK_TTL_SECONDS ? Number(process.env.LINK_TTL_SECONDS) : undefined;
const expiredRedirectQueryParameter = process.env.EXPIRED_REDIRECT_QUERY_PARAMETER;

export async function handler(event: AWSLambda.LambdaFunctionURLEvent): Promise<AWSLambda.LambdaFunctionURLResult> {
  try {
    const key = event.rawPath.substring(1); // remove first slash

    const data = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    }));

    if (!data.Body) {
      throw new Error('No body');
    }

    const redirect = JSON.parse(await data.Body.transformToString());

    if (!redirect.url) {
      throw new Error('Redirect object in S3 is missing a `url` property.');
    }

    if (linkTtlSeconds === undefined) {
      return {
        statusCode: 301,
        headers: {
          Location: redirect.url,
        },
      };
    }

    if (!data.LastModified || Date.now() > data.LastModified.getTime() + linkTtlSeconds * 1000) {
      return expired(redirect.url);
    }

    // Neither CloudFront nor the browser may keep a redirect that stops at a set time
    return {
      statusCode: 302,
      headers: {
        'Location': redirect.url,
        'Cache-Control': 'no-store',
      },
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 404 };
  }
}

/**
 * The answer for a link past its time to live: a 404, or when a query parameter is
 * configured, a redirect to the target without its credentials, query string and hash,
 * so that the target page can tell the link expired without receiving what they carried.
 */
function expired(url: string): AWSLambda.LambdaFunctionURLResult {
  if (!expiredRedirectQueryParameter) {
    return { statusCode: 404 };
  }

  const target = new URL(url);
  target.username = '';
  target.password = '';
  target.search = '';
  target.hash = '';
  target.searchParams.set(expiredRedirectQueryParameter, '1');

  return {
    statusCode: 302,
    headers: {
      'Location': target.toString(),
      'Cache-Control': 'no-store',
    },
  };
}
