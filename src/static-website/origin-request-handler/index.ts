import * as path from 'path';

export async function handler(event: AWSLambda.CloudFrontRequestEvent): Promise<AWSLambda.CloudFrontRequest> {
  const request = event.Records[0].cf.request;

  if (!path.extname(request.uri)) request.uri = '/index.html';

  return request;
}
