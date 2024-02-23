import { Duration, Stack } from 'aws-cdk-lib';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Choice, Condition, DefinitionBody, Fail, FieldUtils, JsonPath, Pass, StateMachine, TaskInput, TaskMetricsConfig, TaskStateBase, TaskStateBaseProps, Wait, WaitTime } from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
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

    this.alarmTopic = props.alarmTopic ?? new Topic(this, 'AlarmTopic');

    const stateMachine = SslServerTestStateMachine.getOrCreate(this);
    this.alarmTopic.grantPublish(stateMachine);

    const rule = new Rule(this, 'Rule', {
      schedule: props.schedule ?? Schedule.rate(Duration.days(1)),
    });

    rule.addTarget(new SfnStateMachine(stateMachine, {
      input: RuleTargetInput.fromObject({
        host: props.host,
        minimumGrade: props.minimumGrade ?? SslServerTestGrade.A_PLUS,
        alarmTopicArn: this.alarmTopic.topicArn,
      }),
    }));
  }
}

class SslServerTestStateMachine extends Construct {
  public static getOrCreate(scope: Construct): StateMachine {
    const stack = Stack.of(scope);
    const uid = 'cloudstructs/ssl-server-test.StateMachine';
    const construct = stack.node.tryFindChild(uid) as SslServerTestStateMachine ?? new SslServerTestStateMachine(stack, uid);
    return construct.stateMachine;
  }

  private readonly stateMachine: StateMachine;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const analyzeFunction = new AnalyzeFunction(this, 'AnalyzeFunction', {
      timeout: Duration.seconds(30),
    });

    const startAnalysis = new LambdaInvoke(this, 'Start Analysis', {
      lambdaFunction: analyzeFunction,
      payload: TaskInput.fromObject({
        host: JsonPath.stringAt('$.host'),
        startNew: 'on',
      }),
      payloadResponseOnly: true,
    }).addRetry({
      interval: Duration.seconds(2),
      errors: ['Lambda.Unknown'],
    });

    const wait = new Wait(this, 'Wait', {
      time: WaitTime.duration(Duration.seconds(30)),
    });

    const pollAnalysis = new LambdaInvoke(this, 'Poll Analysis', {
      lambdaFunction: analyzeFunction,
      payload: TaskInput.fromObject({
        host: JsonPath.stringAt('$.host'),
      }),
      payloadResponseOnly: true,
    }).addRetry({
      interval: Duration.seconds(2),
      errors: ['Lambda.Unknown'],
    });;

    const extractGradeFunction = new ExtractGradeFunction(this, 'ExtractGradeFunction');
    const extractGrade = new LambdaInvoke(this, 'Extract Grade', {
      lambdaFunction: extractGradeFunction,
      payloadResponseOnly: true,
      resultPath: '$.grade',
    });

    const notify = new SnsPublishToTopicAtPath(this, 'Notify', {
      path: '$$.Execution.Input.alarmTopicArn',
      message: TaskInput.fromJsonPathAt('States.JsonToString($)'),
      subject: JsonPath.stringAt("States.Format('SSL grade for {} is below minimum grade ({} < {})', $.host, $.grade, $$.Execution.Input.minimumGrade)"),
    });

    const fail = new Fail(this, 'Fail');

    this.stateMachine = new StateMachine(this, 'StateMachine', {
      definitionBody: DefinitionBody.fromChainable(
        startAnalysis
          .next(wait)
          .next(pollAnalysis)
          .next(new Choice(this, 'Is Ready ?')
            .when(Condition.stringEquals('$.status', 'READY'), extractGrade.next(
              new Choice(this, 'Is Grade Below Minimum?')
                .when(Condition.stringLessThanJsonPath('$$.Execution.Input.minimumGrade', '$.grade'), notify)
                .otherwise(new Pass(this, 'Pass')),
            ))
            .when(Condition.stringEquals('$.status', 'ERROR'), fail)
            .otherwise(wait)),
      ),
      timeout: Duration.hours(1),
    });
  }
}

interface SnsPublishToTopicAtPathProps extends TaskStateBaseProps {
  readonly path: string;
  readonly message: TaskInput;
  readonly subject?: string;
}

class SnsPublishToTopicAtPath extends TaskStateBase {
  protected readonly taskMetrics: TaskMetricsConfig | undefined;
  protected readonly taskPolicies: PolicyStatement[] | undefined;

  constructor(scope: Construct, id: string, private readonly props: SnsPublishToTopicAtPathProps) {
    super(scope, id, props);
  }

  public _renderTask(): any {
    return {
      Resource: `arn:${Stack.of(this).partition}:states:::sns:publish`,
      Parameters: FieldUtils.renderObject({
        TopicArn: JsonPath.stringAt(this.props.path),
        Message: this.props.message.value,
        Subject: this.props.subject,
      }),
    };
  }
}
