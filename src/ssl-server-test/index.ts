import { Duration } from 'aws-cdk-lib';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Choice, Condition, Fail, JsonPath, Pass, StateMachine, TaskInput, Wait, WaitTime } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke, SnsPublish } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { AnalyzeFunction } from './analyze-function';
import { ExtractGradeFunction } from './extract-grade-function';

/**
 * Properties for a SslServerTest
 */
export interface SslServerTestProps {
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
  readonly schedule?: Schedule;
}

/**
 * SSL Server test grade
 */
export enum SslServerTestGrade {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
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

    const analyzeFunction = new AnalyzeFunction(this, 'AnalyzeFunction');

    const startAnalysis = new LambdaInvoke(this, 'Start Analysis', {
      lambdaFunction: analyzeFunction,
      payload: TaskInput.fromObject({
        host: JsonPath.stringAt('$.host'),
        startNew: 'on',
      }),
      payloadResponseOnly: true,
    });

    const wait = new Wait(this, 'Wait', {
      time: WaitTime.duration(Duration.seconds(10)),
    });

    const pollAnalysis = new LambdaInvoke(this, 'Poll Analysis', {
      lambdaFunction: analyzeFunction,
      payload: TaskInput.fromObject({
        host: JsonPath.stringAt('$.host'),
      }),
      payloadResponseOnly: true,
    });

    const extractGradeFunction = new ExtractGradeFunction(this, 'ExtractGradeFunction');
    const extractGrade = new LambdaInvoke(this, 'Extract Grade', {
      lambdaFunction: extractGradeFunction,
      payloadResponseOnly: true,
      resultPath: '$.grade',
    });

    this.alarmTopic = props.alarmTopic ?? new Topic(this, 'AlarmTopic');
    const notify = new SnsPublish(this, 'Notify', {
      topic: this.alarmTopic,
      message: TaskInput.fromJsonPathAt('States.JsonToString($)'),
    });

    const fail = new Fail(this, 'Fail');

    const stateMachine = new StateMachine(this, 'StateMachine', {
      definition: startAnalysis
        .next(wait)
        .next(pollAnalysis)
        .next(new Choice(this, 'Is Ready ?')
          .when(Condition.stringEquals('$.status', 'READY'), extractGrade.next(
            new Choice(this, 'Is Grade Below Minimum?')
              .when(Condition.stringLessThanJsonPath('$$.Execution.Input.minimumGrade', '$.grade'), notify)
              .otherwise(new Pass(this, 'Pass')),
          ))
          .when(Condition.stringEquals('$.status', 'ERROR'), fail)
          .otherwise(wait),
        ),
      timeout: Duration.minutes(30),
    });

    const rule = new Rule(this, 'Rule', {
      schedule: props.schedule ?? Schedule.rate(Duration.days(1)),
    });
    rule.addTarget(new SfnStateMachine(stateMachine, {
      input: RuleTargetInput.fromObject({
        host: props.host,
        minimumGrade: props.minimumGrade ?? SslServerTestGrade.A_PLUS,
      }),
    }));
  }
}
