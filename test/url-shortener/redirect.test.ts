import { mockClient } from 'aws-sdk-client-mock';

const TARGET = 'https://www.url.com/very/long?token=secret#part';

/**
 * Loads the handler with the given environment. The time to live is read when the
 * module loads, so each case loads its own copy, with its own S3 client to mock.
 */
function loadHandler(env: Record<string, string>, object: { url?: string; ageSeconds?: number }) {
  process.env.BUCKET_NAME = 'bucket';
  delete process.env.LINK_TTL_SECONDS;
  delete process.env.EXPIRED_REDIRECT_QUERY_PARAMETER;
  Object.assign(process.env, env);

  let handler: (event: AWSLambda.LambdaFunctionURLEvent) => Promise<AWSLambda.LambdaFunctionURLResult>;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const s3 = require('@aws-sdk/client-s3');
    mockClient(s3.S3Client).on(s3.GetObjectCommand).resolves({
      Body: { transformToString: async () => JSON.stringify({ url: object.url }) },
      LastModified: object.ageSeconds === undefined ? undefined : new Date(Date.now() - object.ageSeconds * 1000),
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    handler = require('../../src/url-shortener/redirect.lambda').handler;
  });
  return (path: string) => handler({ rawPath: path } as AWSLambda.LambdaFunctionURLEvent);
}

test('redirects with a 301 without a time to live', async () => {
  const redirect = loadHandler({}, { url: TARGET, ageSeconds: 10 * 86400 });

  expect(await redirect('/abc')).toEqual({
    statusCode: 301,
    headers: { Location: TARGET },
  });
});

test('redirects with an uncacheable 302 within the time to live', async () => {
  const redirect = loadHandler({ LINK_TTL_SECONDS: '900' }, { url: TARGET, ageSeconds: 60 });

  expect(await redirect('/abc')).toEqual({
    statusCode: 302,
    headers: { 'Location': TARGET, 'Cache-Control': 'no-store' },
  });
});

test('returns 404 past the time to live', async () => {
  const redirect = loadHandler({ LINK_TTL_SECONDS: '900' }, { url: TARGET, ageSeconds: 901 });

  expect(await redirect('/abc')).toEqual({ statusCode: 404 });
});

test('returns 404 when the object has no last modified date', async () => {
  const redirect = loadHandler({ LINK_TTL_SECONDS: '900' }, { url: TARGET });

  expect(await redirect('/abc')).toEqual({ statusCode: 404 });
});

test('redirects an expired link to its target without query string and hash', async () => {
  const redirect = loadHandler(
    { LINK_TTL_SECONDS: '900', EXPIRED_REDIRECT_QUERY_PARAMETER: 'expired' },
    { url: TARGET, ageSeconds: 901 },
  );

  expect(await redirect('/abc')).toEqual({
    statusCode: 302,
    headers: { 'Location': 'https://www.url.com/very/long?expired=1', 'Cache-Control': 'no-store' },
  });
});

test('drops credentials from the target of an expired link', async () => {
  const redirect = loadHandler(
    { LINK_TTL_SECONDS: '900', EXPIRED_REDIRECT_QUERY_PARAMETER: 'expired' },
    { url: 'https://user:secret@www.url.com/very/long?token=secret', ageSeconds: 901 },
  );

  expect(await redirect('/abc')).toEqual({
    statusCode: 302,
    headers: { 'Location': 'https://www.url.com/very/long?expired=1', 'Cache-Control': 'no-store' },
  });
});

test('returns 404 for an object without url', async () => {
  const redirect = loadHandler({}, { ageSeconds: 10 });

  expect(await redirect('/abc')).toEqual({ statusCode: 404 });
});
