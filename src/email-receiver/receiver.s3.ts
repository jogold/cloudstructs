/* eslint-disable no-console */
import { SESMessage } from './types';

export async function handler(event: AWSLambda.SNSEvent): Promise<SESMessage> {
  console.log('Event: %j', event);

  const message = JSON.parse(event.Records[0].Sns.Message) as SESMessage;

  return message;
}
