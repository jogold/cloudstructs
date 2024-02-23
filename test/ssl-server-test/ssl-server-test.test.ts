import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SslServerTest } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SslServerTest', () => {
  new SslServerTest(stack, 'SslServerTest', {
    host: 'host',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
    Targets: [
      {
        Arn: {
          Ref: 'cloudstructssslservertestStateMachine4198892D',
        },
        Id: 'Target0',
        Input: {
          'Fn::Join': [
            '',
            [
              '{"host":"host","minimumGrade":"A+","alarmTopicArn":"',
              {
                Ref: 'SslServerTestAlarmTopicE0FFB32B',
              },
              '"}',
            ],
          ],
        },
        RoleArn: {
          'Fn::GetAtt': [
            'cloudstructssslservertestStateMachineEventsRole42C7B797',
            'Arn',
          ],
        },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {});

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'cloudstructssslservertestStateMachineAnalyzeFunction5F4E0EC3',
                'Arn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'cloudstructssslservertestStateMachineAnalyzeFunction5F4E0EC3',
                      'Arn',
                    ],
                  },
                  ':*',
                ],
              ],
            },
          ],
        },
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'cloudstructssslservertestStateMachineExtractGradeFunction1D1F524D',
                'Arn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'cloudstructssslservertestStateMachineExtractGradeFunction1D1F524D',
                      'Arn',
                    ],
                  },
                  ':*',
                ],
              ],
            },
          ],
        },
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: {
            Ref: 'SslServerTestAlarmTopicE0FFB32B',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('Singleton state machine', () => {
  new SslServerTest(stack, 'SslServerTest1', {
    host: 'host1',
  });

  new SslServerTest(stack, 'SslServerTest2', {
    host: 'host2',
  });

  Template.fromStack(stack).resourceCountIs('AWS::StepFunctions::StateMachine', 1);
});
