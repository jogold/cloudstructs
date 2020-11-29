/* eslint-disable no-console */
import { EventBridge } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { verifyRequestSignature } from './signature';

/**
 * Handle Slack events
 */
export async function handler(event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  console.log('Event: %j', event);

  // Base API gateway response
  const response: AWSLambda.APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

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

    const eventBridge = new EventBridge({ apiVersion: '2015-10-07' });

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

    return response;
  } catch (err) {
    console.log(err);
    response.statusCode = 500;
    return response;
  }
}
