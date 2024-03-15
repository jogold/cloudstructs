import { Duration, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { ToolkitCleaner } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('ToolkitCleaner', () => {
  new ToolkitCleaner(stack, 'ToolkitCleaner');

  Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
    RoleArn: {
      'Fn::GetAtt': [
        'ToolkitCleanerRole794E8158',
        'Arn',
      ],
    },
    DefinitionString: {
      'Fn::Join': [
        '',
        [
          '{"StartAt":"GetStackNames","States":{"GetStackNames":{"Next":"StacksMap","Retry":[{"ErrorEquals":["Lambda.ClientExecutionTimeoutException","Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2}],"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ToolkitCleanerGetStackNamesFunction362F31B8',
              'Arn',
            ],
          },
          '"},"StacksMap":{"Type":"Map","Next":"FlattenHashes","ResultSelector":{"AssetHashes.$":"$"},"ItemProcessor":{"ProcessorConfig":{"Mode":"INLINE"},"StartAt":"ExtractTemplateHashes","States":{"ExtractTemplateHashes":{"End":true,"Retry":[{"ErrorEquals":["Lambda.ClientExecutionTimeoutException","Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2},{"ErrorEquals":["Throttling"]}],"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ToolkitCleanerExtractTemplateHashesFunctionFFDFB6D1',
              'Arn',
            ],
          },
          '"}}},"MaxConcurrency":1},"FlattenHashes":{"Next":"Clean","Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'Eval41256dc5445742738ed917bc818694e54EB1134F',
              'Arn',
            ],
          },
          '","Parameters":{"expression":"[...new Set(($.AssetHashes).flat())]","expressionAttributeValues":{"$.AssetHashes.$":"$.AssetHashes"}}},"Clean":{"Type":"Parallel","Next":"SumReclaimed","Branches":[{"StartAt":"CleanObjects","States":{"CleanObjects":{"End":true,"Retry":[{"ErrorEquals":["Lambda.ClientExecutionTimeoutException","Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2}],"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ToolkitCleanerCleanObjectsFunction23A18EAE',
              'Arn',
            ],
          },
          '"}}},{"StartAt":"CleanImages","States":{"CleanImages":{"End":true,"Retry":[{"ErrorEquals":["Lambda.ClientExecutionTimeoutException","Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2}],"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'ToolkitCleanerCleanImagesFunction96CABD19',
              'Arn',
            ],
          },
          '"}}}]},"SumReclaimed":{"End":true,"Type":"Task","Resource":"',
          {
            'Fn::GetAtt': [
              'Eval41256dc5445742738ed917bc818694e54EB1134F',
              'Arn',
            ],
          },
          '","Parameters":{"expression":"({ Deleted: $[0].Deleted + $[1].Deleted, Reclaimed: $[0].Reclaimed + $[1].Reclaimed })","expressionAttributeValues":{"$[0].Deleted.$":"$[0].Deleted","$[1].Deleted.$":"$[1].Deleted","$[0].Reclaimed.$":"$[0].Reclaimed","$[1].Reclaimed.$":"$[1].Reclaimed"}}}}}',
        ],
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: Match.objectLike({
        RUN: 'true',
      }),
    },
    Timeout: 300,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          Ref: 'ToolkitCleanerC02E18EA',
        },
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'ToolkitCleanerEventsRole16CFA1D4',
            'Arn',
          ],
        },
      },
    ],
  });
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

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    State: 'DISABLED',
  });
});
