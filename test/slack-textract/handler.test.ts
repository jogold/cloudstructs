import { WebClient } from '@slack/web-api';
import { Textract } from 'aws-sdk';
import got from 'got';
import { handler, FilesInfoResult } from '../../src/slack-textract/index.handler';

process.env.SLACK_TOKEN = 'token';
console.log = jest.fn();

jest.mock('@slack/web-api');
jest.mock('got');
jest.mock('aws-sdk');

const gotMock = got as unknown as jest.Mock;

test('handler', async () => {
  const fileInfo: FilesInfoResult = {
    ok: true,
    file: {
      mimetype: 'image/jpg',
      filetype: 'image',
      url_private: 'url-private',
      shares: {
        public: {
          C12345XYZ: [{
            ts: 'ts',
          }],
        },
      },
    },
  };
  const filesInfoMock = jest.fn().mockResolvedValue(fileInfo);
  const postMessageMock = jest.fn().mockResolvedValue({ ok: true });
  (WebClient as unknown as jest.Mock).mockImplementation(() => {
    return {
      files: { info: filesInfoMock },
      chat: { postMessage: postMessageMock },
    };
  });

  gotMock.mockImplementation(() => {
    return { buffer: () => Buffer.from('image-buffer') };
  });

  const detected: Textract.DetectDocumentTextResponse = {
    Blocks: [
      {
        BlockType: 'LINE',
        Text: 'Hello',
      },
      {
        BlockType: 'ZZZ',
        Text: 'Not',
      },
      {
        BlockType: 'LINE',
        Text: 'World!',
      },
    ],
  };
  const detectDocumentTextMock = jest.fn(() => {
    return { promise: () => detected };
  });
  (Textract as unknown as jest.Mock).mockImplementation(() => {
    return { detectDocumentText: detectDocumentTextMock };
  });

  await handler({
    channel_id: 'C12345XYZ',
    file_id: 'F1234567XYZ',
  });

  expect(filesInfoMock).toHaveBeenCalledWith({
    file: 'F1234567XYZ',
  });

  expect(gotMock).toHaveBeenCalledWith('url-private', {
    headers: {
      Authorization: 'Bearer token',
    },
  });

  expect(detectDocumentTextMock).toHaveBeenLastCalledWith({
    Document: { Bytes: Buffer.from('image-buffer') },
  });

  expect(postMessageMock).toHaveBeenLastCalledWith({
    channel: 'C12345XYZ',
    text: 'Hello\nWorld!',
    thread_ts: 'ts',
  });
});
