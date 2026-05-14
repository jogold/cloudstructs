import { DurableContext, withDurableExecution } from '@aws/durable-execution-sdk-js';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getEnv } from '../utils';
import { AnalyzeResponse, AnalyzeStatus, SslServerTestGrade } from './types';

const SSL_LABS_BASE = 'https://api.ssllabs.com/api/v4';

async function sslLabsAnalyze<T>(extraParams: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${SSL_LABS_BASE}/analyze`);
  url.searchParams.set('host', getEnv('HOST'));
  for (const [key, value] of Object.entries(extraParams)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    headers: { email: getEnv('REGISTRATION_EMAIL') },
  });
  if (!response.ok) {
    throw new Error(`SSL Labs request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

const snsClient = new SNSClient({});

export const handler = withDurableExecution(async (_, context: DurableContext) => {
  // Start analysis
  await context.step('start-analysis', async () => {
    const response = await sslLabsAnalyze({ startNew: 'on' });
    context.logger.info('Started SSL analysis', response);
  });

  // Wait for analysis to complete
  const analysis = await context.waitForCondition<AnalyzeResponse>('wait-for-completion', async (_state, waitContext) => {
    const response = await sslLabsAnalyze<AnalyzeResponse>();
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

  const grades = Object.values(SslServerTestGrade).reverse();

  const gradeIndices = analysis.endpoints
    .map(e => grades.indexOf(e.grade as SslServerTestGrade))
    .filter(index => index !== -1);

  if (gradeIndices.length === 0) {
    throw new Error('No valid grade found in analysis result');
  }

  const bestGradeIndex = Math.max(...gradeIndices);
  const bestGrade = grades[bestGradeIndex];

  if (bestGradeIndex < grades.indexOf(getEnv('MINIMUM_GRADE') as SslServerTestGrade)) {
    await context.step('notify', async () => {
      await snsClient.send(new PublishCommand({
        TopicArn: getEnv('ALARM_TOPIC_ARN'),
        Message: JSON.stringify(analysis),
        Subject: `SSL grade for ${getEnv('HOST')} is below minimum grade (${bestGrade} < ${getEnv('MINIMUM_GRADE')})`,
      }));
    });
  }

  context.logger.info('SSL analysis completed successfully', analysis);
});
