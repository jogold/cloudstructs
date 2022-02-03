import { handler } from '../../src/email-receiver/s3.lambda';

console.log = jest.fn();

test('it extracts the message', async () => {
  const response = await handler({
    Records: [
      {
        EventSource: 'sns',
        EventSubscriptionArn: 'arn',
        EventVersion: '1.0',
        Sns: {
          Message: '{"key":"value"}',
          MessageAttributes: {},
          MessageId: 'id',
          Signature: 'signature',
          SignatureVersion: '1.0',
          SigningCertUrl: 'url',
          Subject: 'subject',
          Timestamp: 'timestamp',
          TopicArn: 'arn',
          Type: 'type',
          UnsubscribeUrl: 'url',
        },
      },
    ],
  });
  expect(response).toEqual({ key: 'value' });
});
