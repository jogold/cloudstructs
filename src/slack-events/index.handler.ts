/* eslint-disable no-console */
import * as crypto from 'crypto';
import { EventBridge } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const eventBridge = new EventBridge({ apiVersion: '2015-10-07' });

// Base API gateway response
const response: AWSLambda.APIGatewayProxyResult = {
  statusCode: 200,
  body: '',
};

/**
 * Handle Slack events
 */
export async function handler(event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  console.log('Event: %j', event);

  try {
    if (!process.env.SLACK_SIGNING_SECRET) throw new Error('The environment variable SLACK_SIGNING_SECRET is not defined');

    if (!event.body) throw new Error('Missing body');

    if (!verifyRequestSignature({
      body: event.body,
      requestSignature: event.headers['X-Slack-Signature'],
      requestTimestamp: parseInt(event.headers['X-Slack-Request-Timestamp'], 10),
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    })) {
      response.statusCode = 403;
      return response;
    }

    const body = JSON.parse(event.body);
    console.log('Body: %j', body);

    if (body.type === 'url_verification') { // Slack URL verification, respond with challenge
      console.log('URL verification');
      response.body = JSON.stringify({ challenge: body.challenge });
      return response;
    }

    const putEvents = await eventBridge.putEvents({
      Entries: [
        {
          Detail: event.body,
          DetailType: 'Slack Event',
          Source: 'slack',
          Resources: [body.api_app_id],
          EventBusName: process.env.EVENT_BUS_NAME,
          Time: new Date(body.event_time),
        },
      ],
    }).promise();
    console.log('Put events: %j', putEvents);
  } catch (err) {
    console.log(err);
    response.statusCode = 500;
    return response;
  }

  return response;
}

interface VerifyRequestSignatureOptions {
  readonly body: string;
  readonly requestSignature: string;
  readonly requestTimestamp: number;
  readonly signingSecret: string;
}

function verifyRequestSignature(options: VerifyRequestSignatureOptions): boolean {
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);

  if (options.requestTimestamp < fiveMinutesAgo) {
    throw new Error('Slack request signing verification outdated');
  }

  const hmac = crypto.createHmac('sha256', options.signingSecret);
  const [version, hash] = options.requestSignature.split('=');
  hmac.update(`${version}:${options.requestTimestamp}:${options.body}`);
  const hex = hmac.digest('hex');

  if (hash.length !== hex.length ||
      !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac.digest('hex')))) {
    throw new Error('Slack request signing verification failed');
  }

  return true;
}
