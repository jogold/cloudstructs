import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function handler(event: AWSLambda.CloudFrontRequestEvent): Promise<AWSLambda.CloudFrontRequestResult> {
  const request = event.Records[0].cf.request;

  try {
    const s3Origin = request.origin?.s3;

    if (!s3Origin) {
      throw new Error('No S3 origin');
    }

    const s3details = extractS3Details(s3Origin.domainName);
    if (!s3details) {
      throw new Error('No S3 details');
    }

    const s3Client = new S3Client({ region: s3details.region });
    const key = request.uri.substring(1); // remove first slash

    const data = await s3Client.send(new GetObjectCommand({
      Bucket: s3details.bucket,
      Key: key,
    }));

    if (!data.Body) {
      throw new Error('No body');
    }

    const redirect = JSON.parse(await data.Body.transformToString());

    return {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: redirect.url,
        }],
      },
    };
  } catch (err) {
    console.log(err);

    return {
      status: '404',
      statusDescription: 'Not Found',
    };
  }
}

const S3_HOSTNAME_REGEX = /^(.*)\.s3\.(.*)\.amazonaws\.com$/;

function extractS3Details(hostname: string): { bucket: string; region: string } | undefined {
  const match = hostname.match(S3_HOSTNAME_REGEX);

  if (match) {
    const [, bucket, region] = match;
    return { bucket, region };
  }

  return undefined;
}
