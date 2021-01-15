import { handler } from '../../src/static-website/origin-request-handler';

test('without extension', async () => {
  const request = await handler({
    Records: [
      {
        cf: {
          request: {
            uri: '/my-uri',
          },
        },
      },
    ],
  } as AWSLambda.CloudFrontRequestEvent);

  expect(request.uri).toBe('/index.html');
});

test('with extension', async () => {
  const request = await handler({
    Records: [
      {
        cf: {
          request: {
            uri: '/style/cool.css',
          },
        },
      },
    ],
  } as AWSLambda.CloudFrontRequestEvent);

  expect(request.uri).toBe('/style/cool.css');
});
