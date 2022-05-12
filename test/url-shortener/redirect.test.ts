import { handler } from '../../src/url-shortener/redirect.edge-lambda';

const cfEvent: AWSLambda.CloudFrontResponseEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'name',
          distributionId: 'id',
          eventType: 'origin-response',
          requestId: 'id',
        },
        request: {
          clientIp: 'ip',
          headers: {},
          method: 'GET',
          querystring: 'qs',
          uri: 'uri',
        },
        response: {
          status: '200',
          statusDescription: 'OK',
          headers: {
            'x-amz-website-redirect-location': [{
              value: 'https://www.example.com',
            }],
          },
        },
      },
    },
  ],
};

test('redirect to x-amz-website-redirect-location header', async () => {
  const response = await handler(cfEvent);

  expect(response).toEqual<AWSLambda.CloudFrontResponseResult>({
    status: '301',
    statusDescription: 'Moved Permanently',
    body: '',
    headers: {
      location: [{
        key: 'Location',
        value: 'https://www.example.com',
      }],
    },
  });
});

test('returns response as is if no x-amz-website-redirect-location header is present', async () => {
  const noHeaderCfEvent: AWSLambda.CloudFrontResponseEvent = {
    Records: [{
      cf: {
        ...cfEvent.Records[0].cf,
        response: {
          ...cfEvent.Records[0].cf.response,
          headers: {},
        },
      },
    }],
  };
  const response = await handler(noHeaderCfEvent);

  expect(response).toEqual<AWSLambda.CloudFrontResponseResult>(noHeaderCfEvent.Records[0].cf.response);
});
