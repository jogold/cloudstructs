export async function handler(event: AWSLambda.CloudFrontResponseEvent): Promise<AWSLambda.CloudFrontResponseResult> {
  const response = event.Records[0].cf.response;

  if (!response.headers['x-amz-website-redirect-location']?.[0]?.value) {
    return response;
  }

  return {
    status: '301',
    statusDescription: 'Moved Permanently',
    body: '',
    headers: {
      location: [{
        key: 'Location',
        value: response.headers['x-amz-website-redirect-location'][0].value,
      }],
    },
  };
}
