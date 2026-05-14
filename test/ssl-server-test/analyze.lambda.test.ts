// Environment variables must be set before any imports that use getEnv
process.env.REGISTRATION_EMAIL = 'test@example.com';
process.env.HOST = 'example.com';
process.env.MINIMUM_GRADE = 'A';
process.env.ALARM_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:test-topic';

import 'aws-sdk-client-mock-jest';
import { LocalDurableTestRunner } from '@aws/durable-execution-sdk-js-testing';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/ssl-server-test/analyze.lambda';
import { AnalyzeResponse, AnalyzeStatus, SslServerTestGrade } from '../../src/ssl-server-test/types';

const snsClientMock = mockClient(SNSClient);

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

// Helper to queue SSL Labs API responses: first call is start-analysis, the rest are polls.
function mockSslLabsApi(startResponse: Partial<AnalyzeResponse>, ...pollResponses: Partial<AnalyzeResponse>[]) {
  for (const body of [startResponse, ...pollResponses]) {
    fetchMock.mockImplementationOnce((url: URL) => {
      expect(url.toString()).toContain('https://api.ssllabs.com/api/v4/analyze');
      expect(url.searchParams.get('host')).toBe('example.com');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body),
      });
    });
  }
}

describe('SSL Server Test Lambda', () => {
  let runner: LocalDurableTestRunner;

  beforeAll(async () => {
    await LocalDurableTestRunner.setupTestEnvironment({ skipTime: true });
  });

  afterAll(async () => {
    await LocalDurableTestRunner.teardownTestEnvironment();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    snsClientMock.reset();
    snsClientMock.on(PublishCommand).resolves({});
    runner = new LocalDurableTestRunner({ handlerFunction: handler });
  });

  test('completes analysis with good grade and does not send notification', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      { status: AnalyzeStatus.READY, endpoints: [{ grade: SslServerTestGrade.A_PLUS }] },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(snsClientMock).not.toHaveReceivedCommand(PublishCommand);
  });

  test('completes analysis with bad grade and sends notification', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      { status: AnalyzeStatus.READY, endpoints: [{ grade: SslServerTestGrade.B }] },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(snsClientMock).toHaveReceivedCommandWith(PublishCommand, {
      TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
      Subject: 'SSL grade for example.com is below minimum grade (B < A)',
    });
  });

  test('throws error when analysis fails', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      { status: AnalyzeStatus.ERROR, statusMessage: 'Unable to resolve domain', endpoints: [] },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('FAILED');
  });

  test('throws error when no grade found in result', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      { status: AnalyzeStatus.READY, endpoints: [] },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('FAILED');
  });

  test('polls until analysis is ready', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      { status: AnalyzeStatus.IN_PROGRESS, endpoints: [] },
      { status: AnalyzeStatus.READY, endpoints: [{ grade: SslServerTestGrade.A }] },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
  });

  test('uses best grade from multiple endpoints for comparison', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      {
        status: AnalyzeStatus.READY,
        endpoints: [
          { grade: SslServerTestGrade.A_PLUS },
          { grade: SslServerTestGrade.B },
          { grade: SslServerTestGrade.A },
        ],
      },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    // Best grade is A+ which is >= A minimum, so no notification
    expect(snsClientMock).not.toHaveReceivedCommand(PublishCommand);
  });

  test('sends notification when best grade among multiple endpoints is below minimum', async () => {
    mockSslLabsApi(
      { status: AnalyzeStatus.DNS },
      {
        status: AnalyzeStatus.READY,
        endpoints: [{ grade: SslServerTestGrade.B }, { grade: SslServerTestGrade.C }],
      },
    );

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    // Best grade is B which is below A minimum, so notification sent
    expect(snsClientMock).toHaveReceivedCommand(PublishCommand);
  });
});
