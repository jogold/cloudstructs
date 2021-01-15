import * as fs from 'fs';
import * as path from 'path';

let cfHeaders: AWSLambda.CloudFrontHeaders | undefined;

function readHeaders() {
  // Convert JSON headers to CF headers format
  const headers: { [key: string]: string } = JSON.parse(fs.readFileSync(path.join(__dirname, 'headers.json'), 'utf8'));
  cfHeaders = {};
  for (const [key, value] of Object.entries(headers)) {
    cfHeaders[key.toLowerCase()] = [{ key, value }];
  }
}


export async function handler(event: AWSLambda.CloudFrontResponseEvent) {
  if (!cfHeaders) {
    readHeaders();
  }

  const { response } = event.Records[0].cf;

  response.headers = { ...response.headers, ...cfHeaders };

  return response;
};
