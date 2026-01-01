import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SslServerTest } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SslServerTest', () => {
  new SslServerTest(stack, 'SslServerTest', {
    registrationEmail: 'jdoe@someoraganizationemail.com',
    host: 'host',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
    ScheduleExpression: 'rate(1 day)',
    Target: {
      Arn: { 'Fn::GetAtt': ['SslServerTestAnalyzeFunction376D3549', 'Arn'] },
      RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget00815793E62A85', 'Arn'] },
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {});

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: { Ref: 'SslServerTestAlarmTopicE0FFB32B' },
        },
      ],
      Version: '2012-10-17',
    },
  });
});
