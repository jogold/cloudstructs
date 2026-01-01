import { Duration } from 'aws-cdk-lib';
import { Schedule, ScheduleExpression } from 'aws-cdk-lib/aws-scheduler';
import { LambdaInvoke } from 'aws-cdk-lib/aws-scheduler-targets';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { AnalyzeFunction } from './analyze-function';
import { SslServerTestGrade } from './types';
export { SslServerTestGrade } from './types';

/**
 * Properties for a SslServerTest
 */
export interface SslServerTestProps {
  /**
   * The email registered with SSL Labs API
   *
   * @see https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v4.md#register-for-scan-api-initiation-and-result-fetching
   */
  readonly registrationEmail: string;

  /**
   * The hostname to test
   */
  readonly host: string;

  /**
   * Minimum grade for the test. The grade is calculated
   * using the worst grade of all endpoints.
   *
   * Used to send the results to an alarm SNS topic.
   *
   * @default SslServerTestGrade.A_PLUS
   */
  readonly minimumGrade?: SslServerTestGrade;

  /**
   * The topic to which the results must be sent when the
   * grade is below the minimum grade.
   *
   * @default - a new topic is created
   */
  readonly alarmTopic?: ITopic;

  /**
   * The schedule for the test
   *
   * @default - every day
   */
  readonly scheduleExpression?: ScheduleExpression;
}

/**
 * Perform SSL server test for a hostname
 */
export class SslServerTest extends Construct {
  /**
   * The topic to which the SSL test results are sent when the grade is
   * below the minimum grade
   */
  public readonly alarmTopic: ITopic;

  constructor(scope: Construct, id: string, props: SslServerTestProps) {
    super(scope, id);

    this.alarmTopic = props.alarmTopic ?? new Topic(this, 'AlarmTopic');

    const analyzeFunction = new AnalyzeFunction(this, 'AnalyzeFunction', {
      timeout: Duration.seconds(30),
      durableConfig: {
        executionTimeout: Duration.hours(1),
      },
      environment: {
        REGISTRATION_EMAIL: props.registrationEmail,
        HOST: props.host,
        ALARM_TOPIC_ARN: this.alarmTopic.topicArn,
        MINIMUM_GRADE: props.minimumGrade ?? SslServerTestGrade.A_PLUS,
      },
    });
    this.alarmTopic.grantPublish(analyzeFunction);

    new Schedule(this, 'Schedule', {
      schedule: props.scheduleExpression ?? ScheduleExpression.rate(Duration.days(1)),
      target: new LambdaInvoke(analyzeFunction, {}),
    });
  }
}
