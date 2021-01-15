import * as fs from 'fs';
import * as path from 'path';
import { handler } from '../../src/static-website/origin-response-handler';

const headersJsonPath = path.join(__dirname, '../../src/static-website/origin-response-handler', 'headers.json');

afterEach(() => {
  if (fs.existsSync(headersJsonPath)) {
    fs.unlinkSync(headersJsonPath);
  }
});

test('adds headers', async () => {
  fs.writeFileSync(path.join(headersJsonPath), JSON.stringify({
    'X-Frame-Options': 'DENY',
  }));

  const response = await handler({
    Records: [
      {
        cf: {
          response: {
            headers: {
              'content-type': [{ key: 'Content-Type', value: 'text/html' }],
            },
          },
        },
      },
    ],
  } as unknown as AWSLambda.CloudFrontResponseEvent);

  expect(response.headers).toEqual({
    'content-type': [{ key: 'Content-Type', value: 'text/html' }],
    'x-frame-options': [{ key: 'X-Frame-Options', value: 'DENY' }],
  });
});
