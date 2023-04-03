import 'aws-sdk-client-mock-jest';
import { DetectDocumentTextCommand, TextractClient } from '@aws-sdk/client-textract';
import { WebClient } from '@slack/web-api';
import { mockClient } from 'aws-sdk-client-mock';
import got from 'got';
import { handler, FilesInfoResult } from '../../src/slack-textract/detect.lambda';

process.env.SLACK_TOKEN = 'token';

jest.mock('@slack/web-api');
jest.mock('got');

const gotMock = got as unknown as jest.Mock;
const textractClientMock = mockClient(TextractClient);

beforeEach(() => {
  textractClientMock.reset();
});

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

  textractClientMock.on(DetectDocumentTextCommand).resolves({
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

  expect(textractClientMock).toHaveReceivedCommandWith(DetectDocumentTextCommand, {
    Document: { Bytes: Buffer.from('image-buffer') },
  });

  expect(postMessageMock).toHaveBeenLastCalledWith({
    channel: 'C12345XYZ',
    text: 'Hello\nWorld!',
    thread_ts: 'ts',
  });
});
