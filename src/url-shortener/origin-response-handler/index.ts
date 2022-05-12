export async function handler(event: AWSLambda.CloudFrontResponseEvent): Promise<AWSLambda.CloudFrontResponse> {
  const response = event.Records[0].cf.response;

  if (!response.headers['x-amz-website-redirect-location']?.[0]?.value) {
    return response;
  }

  return {
    status: '301',
    statusDescription: 'Moved Permanently',
    headers: {
      location: [{
        key: 'Location',
        value: response.headers['x-amz-website-redirect-location'][0].value,
      }],
    },
  };
}
