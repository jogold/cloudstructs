import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

export async function handler(event: AWSLambda.CloudFrontRequestEvent): Promise<AWSLambda.CloudFrontRequestResult> {
  const request = event.Records[0].cf.request;

  try {
    const s3Origin = request.origin?.s3;

    if (!s3Origin) {
      throw new Error('No S3 origin');
    }

    const bucket = s3Origin.domainName.replace(new RegExp(`.s3.${s3Origin.region}.amazonaws.com$`), '');
    const key = request.uri.substring(1); // remove first slash

    const data = await s3Client.send(new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }));

    if (!data.Body) {
      throw new Error('No body');
    }

    const redirect = JSON.parse(data.Body.toString());

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
