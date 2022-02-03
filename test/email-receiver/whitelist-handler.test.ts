import { handler } from '../../src/email-receiver/whitelist.lambda';

console.log = jest.fn();

const sesEvent: AWSLambda.SESEvent = {
  Records: [
    {
      eventSource: 'ses',
      eventVersion: '1.0',
      ses: {
        mail: {
          commonHeaders: {
            date: 'date',
            messageId: 'id',
            returnPath: 'path',
          },
          destination: ['a', 'b'],
          headers: [],
          headersTruncated: false,
          messageId: 'id',
          source: 'info@help.com',
          timestamp: 'timestamp',
        },
        receipt: {
          action: {
            type: 'Lambda',
            functionArn: 'arn',
            invocationType: 'RequestResponse',
          },
          timestamp: 'timestamp',
          dkimVerdict: {
            status: 'PASS',
          },
          dmarcVerdict: {
            status: 'PASS',
          },
          processingTimeMillis: 123,
          recipients: [
            'hello@abc.com',
          ],
          spamVerdict: {
            status: 'PASS',
          },
          spfVerdict: {
            status: 'PASS',
          },
          virusVerdict: {
            status: 'PASS',
          },
          dmarcPolicy: 'none',
        },
      },
    },
  ],
};

test('stops messages that do not sastify the whitelist', async () => {
  process.env.SOURCE_WHITELIST = '@constructs.com$';

  const response = await handler(sesEvent);

  expect(response).toEqual({ disposition: 'STOP_RULE' });
});

test('processes messages that satisfies the whitelist', async () => {
  process.env.SOURCE_WHITELIST = '@constructs.com$';

  const response = await handler({
    Records: [
      {
        ...sesEvent.Records[0],
        ses: {
          ...sesEvent.Records[0].ses,
          mail: {
            ...sesEvent.Records[0].ses.mail,
            source: 'hello@constructs.com',
          },
        },
      },
    ],
  });

  expect(response).toEqual({ disposition: 'CONTINUE' });
});

test('stops messages when SOURCE_WHITELIST is not defined', async () => {
  delete process.env.SOURCE_WHITELIST;

  const response = await handler(sesEvent);

  expect(response).toEqual({ disposition: 'STOP_RULE' });
});
