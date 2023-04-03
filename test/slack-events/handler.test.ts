import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/slack-events/events.lambda';
import * as signature from '../../src/slack-events/signature';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

process.env.SLACK_SIGNING_SECRET = 'secret';

console.log = jest.fn();

const eventBridgeClientMock = mockClient(EventBridgeClient);

beforeEach(() => {
  eventBridgeClientMock.restore();
});

test('returns 403 on invalid signature', async () => {
  jest.spyOn(signature, 'verifyRequestSignature').mockReturnValueOnce(false);

  const response = await handler({
    body: '{}',
    headers: {
      'X-Slack-Signature': 'signature',
      'X-Slack-Request-Timestamp': '1000',
    },
  } as unknown as AWSLambda.APIGatewayProxyEvent);

  expect(response).toEqual<AWSLambda.APIGatewayProxyResult>({
    body: '',
    statusCode: 403,
  });
});

test('url verification', async () => {
  jest.spyOn(signature, 'verifyRequestSignature').mockReturnValueOnce(true);

  const response = await handler({
    body: JSON.stringify({
      type: 'url_verification',
      challenge: 'challenge',
    }),
    headers: {
      'X-Slack-Signature': 'signature',
      'X-Slack-Request-Timestamp': '1000',
    },
  } as unknown as AWSLambda.APIGatewayProxyEvent);

  expect(response).toEqual<AWSLambda.APIGatewayProxyResult>({
    body: JSON.stringify({ challenge: 'challenge' }),
    statusCode: 200,
  });
});

test('puts events', async () => {
  jest.spyOn(signature, 'verifyRequestSignature').mockReturnValueOnce(true);

  const body = JSON.stringify({
    type: 'event',
    api_app_id: 'app-id',
    event_time: '2020-12-01T12:00:00.000Z',
  });

  const response = await handler({
    body,
    headers: {
      'X-Slack-Signature': 'signature',
      'X-Slack-Request-Timestamp': '1000',
    },
  } as unknown as AWSLambda.APIGatewayProxyEvent);

  expect(eventBridgeClientMock).toHaveReceivedCommandWith(PutEventsCommand, {
    Entries: [
      {
        Detail: body,
        DetailType: 'Slack Event',
        Source: 'slack',
        Resources: ['app-id'],
        EventBusName: undefined,
        Time: new Date('2020-12-01T12:00:00.000Z'),
      },
    ],
  });

  expect(response).toEqual<AWSLambda.APIGatewayProxyResult>({
    body: '',
    statusCode: 200,
  });
});
