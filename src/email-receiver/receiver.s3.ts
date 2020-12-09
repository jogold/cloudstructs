/* eslint-disable no-console */
export async function handler(event: AWSLambda.SNSEvent): Promise<AWSLambda.SESMessage> {
  console.log('Event: %j', event);

  const message = JSON.parse(event.Records[0].Sns.Message) as AWSLambda.SESMessage;

  return message;
}
