import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export async function handler(event: AWSLambda.LambdaFunctionURLEvent): Promise<AWSLambda.LambdaFunctionURLResult> {
  try {
    const key = event.rawPath.substring(1); // remove first slash

    const data = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.BUCKT_NAME,
      Key: key,
    }));

    if (!data.Body) {
      throw new Error('No body');
    }

    const redirect = JSON.parse(await data.Body.transformToString());

    if (!redirect.url) {
      throw new Error('Redirect object in S3 is missing a `url` property.');
    }

    return {
      statusCode: 301,
      headers: {
        Location: redirect.url,
      },
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 404 };
  }
}
