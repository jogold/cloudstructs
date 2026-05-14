import 'aws-sdk-client-mock-jest';
import { DetectDocumentTextCommand, TextractClient } from '@aws-sdk/client-textract';
import { FilesInfoResponse, WebClient } from '@slack/web-api';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/slack-textract/detect.lambda';

process.env.SLACK_TOKEN = 'token';

jest.mock('@slack/web-api');

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const textractClientMock = mockClient(TextractClient);

beforeEach(() => {
  fetchMock.mockReset();
  textractClientMock.reset();
});

test('handler', async () => {
  const fileInfo: FilesInfoResponse = {
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

  fetchMock.mockResolvedValue({
    ok: true,
    arrayBuffer: () => Promise.resolve(Buffer.from('image-buffer')),
  });

  textractClientMock.on(DetectDocumentTextCommand).resolves({
    Blocks: [
      {
        BlockType: 'LINE',
        Text: 'Hello',
      },
      {
        BlockType: 'CELL',
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

  expect(fetchMock).toHaveBeenCalledWith('url-private', {
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
