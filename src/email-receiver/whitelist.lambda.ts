/* eslint-disable no-console */
export async function handler(event: AWSLambda.SESEvent): Promise<{ disposition: string }> {
  console.log('Event: %j', event);

  const sesNotification = event.Records[0].ses;

  if (!process.env.SOURCE_WHITELIST) {
    console.log('Missing SOURCE_WHITELIST');
    return { disposition: 'STOP_RULE' };
  }

  if (!new RegExp(process.env.SOURCE_WHITELIST).test(sesNotification.mail.source)) {
    console.log(`${sesNotification.mail.source} does not match /${process.env.SOURCE_WHITELIST}/`);
    return { disposition: 'STOP_RULE' };
  }

  return { disposition: 'CONTINUE' };
}
