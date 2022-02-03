/* eslint-disable no-console */
import { WebClient, WebAPICallResult } from '@slack/web-api';
import { Textract } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import got from 'got';

export interface SlackEvent {
  channel_id: string;
  file_id: string;
}

export interface FilesInfoResult extends WebAPICallResult {
  file: {
    mimetype: string;
    filetype: string;
    url_private: string;
    shares: {
      public: {
        [channel: string]: [{
          ts: string;
        }];
      };
    };
  };
}


export async function handler(event: SlackEvent): Promise<void> {
  console.log('Event: %j', event);

  const slackClient = new WebClient(process.env.SLACK_TOKEN);

  // Get file info
  const info = await slackClient.files.info({
    file: event.file_id,
  }) as FilesInfoResult;
  console.log('File info: %j', info);

  if (!info.file.mimetype.startsWith('image')) {
    console.log('Not an image');
    return;
  }

  // Get file
  const file = await got(info.file.url_private, {
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
  }).buffer();

  // Detect text with Textract
  const textract = new Textract({ apiVersion: '2018-06-27' });

  const data = await textract.detectDocumentText({
    Document: { Bytes: file },
  }).promise();

  if (!data.Blocks) {
    console.log('No text detected');
    return;
  }

  // Add detected text in image thread
  const postMessage = await slackClient.chat.postMessage({
    channel: event.channel_id,
    text: data.Blocks.filter((b) => b.BlockType === 'LINE').map((b) => b.Text).join('\n'),
    thread_ts: info.file.shares.public[event.channel_id][0].ts,
  });
  console.log('Post message: %j', postMessage);
}
