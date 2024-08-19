/* eslint-disable no-console */
import { DetectDocumentTextCommand, TextractClient } from '@aws-sdk/client-textract';
import { WebClient } from '@slack/web-api';
import got from 'got';

export interface SlackEvent {
  channel_id: string;
  file_id: string;
}

const textractClient = new TextractClient({});

export async function handler(event: SlackEvent): Promise<void> {
  console.log('Event: %j', event);

  const slackClient = new WebClient(process.env.SLACK_TOKEN);

  // Get file info
  const info = await slackClient.files.info({
    file: event.file_id,
  });
  console.log('File info: %j', info);

  if (!info.file) {
    console.log('No file');
    return;
  }

  if (!info.file.mimetype?.startsWith('image')) {
    console.log('Not an image');
    return;
  }

  if (!info.file.url_private) {
    console.log('No private URL');
    return;
  }

  // Get file
  const file = await got(info.file.url_private, {
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
  }).buffer();

  // Detect text with Textract
  const data = await textractClient.send(new DetectDocumentTextCommand({
    Document: { Bytes: file },
  }));

  if (!data.Blocks) {
    console.log('No text detected');
    return;
  }

  // Add detected text in image thread
  const postMessage = await slackClient.chat.postMessage({
    channel: event.channel_id,
    text: data.Blocks.filter((b) => b.BlockType === 'LINE').map((b) => b.Text).join('\n'),
    thread_ts: info.file.shares?.public?.[event.channel_id][0].ts,
  });
  console.log('Post message: %j', postMessage);
}
