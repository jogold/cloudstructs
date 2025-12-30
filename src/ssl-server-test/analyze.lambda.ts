import { DurableContext, withDurableExecution } from '@aws/durable-execution-sdk-js';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import got from 'got';
import { AnalyzeResponse, AnalyzeStatus, SslServerTestGrade } from './types';

const sslLabsClient = got.extend({
  prefixUrl: 'https://api.ssllabs.com/api/v4',
  headers: { email: process.env.REGISTRATION_EMAIL },
  searchParams: {
    host: process.env.HOST,
  },
});

const snsClient = new SNSClient({});

export const handler = withDurableExecution(async (_, context: DurableContext) => {
  // Start analysis
  await context.step('start-analysis', async () => {
    const response = await sslLabsClient('analyze', {
      searchParams: { startNew: 'on' },
    }).json();
    context.logger.info('Started SSL analysis', response);
  });

  // Wait for analysis to complete
  const analysis = await context.waitForCondition<AnalyzeResponse>('wait-for-completion', async (_state, waitContext) => {
    const response = await sslLabsClient('analyze').json<AnalyzeResponse>();
    waitContext.logger.info('Current analysis status', response);
    return response;
  }, {
    initialState: { status: AnalyzeStatus.DNS, endpoints: [] },
    waitStrategy: (state) => {
      if (state.status === AnalyzeStatus.READY || state.status === AnalyzeStatus.ERROR) {
        return { shouldContinue: false };
      }
      return { shouldContinue: true, delay: { seconds: 30 } };
    },
  });

  if (analysis.status === AnalyzeStatus.ERROR) {
    throw new Error(`Analysis failed: ${analysis.statusMessage}`);
  }

  const grades = Object.values(SslServerTestGrade);
  const grade = analysis.endpoints
    .map(e => e.grade)
    .sort((a, b) => grades.indexOf(b as SslServerTestGrade) - grades.indexOf(a as SslServerTestGrade)).pop();

  if (!grade) {
    throw new Error('No grade found in analysis result');
  }

  if (grades.indexOf(grade as SslServerTestGrade) > grades.indexOf(process.env.MINIMUM_GRADE as SslServerTestGrade)) {
    await context.step('notify', async () => {
      await snsClient.send(new PublishCommand({
        TopicArn: process.env.ALARM_TOPIC_ARN,
        Message: JSON.stringify(analysis),
        Subject: `SSL grade for ${process.env.HOST} is below minimum grade (${grade} < ${process.env.MINIMUM_GRADE})`,
      }));
    });
  }

  context.logger.info('SSL analysis completed successfully', analysis);
});
