import got from 'got';

const sslLabsClient = got.extend({
  prefixUrl: 'https://api.ssllabs.com/api/v3',
});

export async function handler(event: Record<string, string>) {
  const response = await sslLabsClient('analyze', {
    searchParams: event,
  }).json();

  return response;
}
