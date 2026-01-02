import { Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { ToolkitCleaner } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('ToolkitCleaner', () => {
  new ToolkitCleaner(stack, 'ToolkitCleaner');

  // Verify Lambda function exists with correct environment
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: Match.objectLike({
        RUN: 'true',
        BUCKET_NAME: Match.anyValue(),
        REPOSITORY_NAME: Match.anyValue(),
        DOCKER_IMAGE_ASSET_HASH: Match.anyValue(),
      }),
    },
    Timeout: 30,
    DurableConfig: {
      ExecutionTimeout: 1800,
    },
  });

  // Verify EventBridge Scheduler instead of Events Rule
  Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
    ScheduleExpression: 'rate(1 day)',
    State: 'ENABLED',
  });

  // Verify no Step Functions state machine
  Template.fromStack(stack).resourceCountIs('AWS::StepFunctions::StateMachine', 0);
});

test('with dry run', () => {
  new ToolkitCleaner(stack, 'ToolkitCleaner', {
    dryRun: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: Match.objectLike({
        RUN: Match.absent(),
      }),
    },
  });
});

test('with retainAssetsNewerThan', () => {
  new ToolkitCleaner(stack, 'ToolkitCleaner', {
    retainAssetsNewerThan: Duration.days(90),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: Match.objectLike({
        RETAIN_MILLISECONDS: '7776000000',
      }),
    },
  });
});

test('with scheduleEnabled set to false', () => {
  new ToolkitCleaner(stack, 'ToolkitCleaner', {
    scheduleEnabled: false,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Scheduler::Schedule', {
    State: 'DISABLED',
  });
});
