import nock from 'nock';
import { handler } from '../../src/ssl-server-test/analyze.lambda';

test('calls SSL Labs API', async () => {
  const scope = nock('https://api.ssllabs.com/api/v3')
    .get('/analyze')
    .query({ key: 'value' })
    .reply(200, { response: 'body' });

  const response = await handler({ key: 'value' });
  expect(scope.isDone()).toBeTruthy();
  expect(response).toEqual({ response: 'body' });
});