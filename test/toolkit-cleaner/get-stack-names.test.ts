import 'aws-sdk-client-mock-jest';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/get-stack-names.lambda';

const cloudFormationClientMock = mockClient(CloudFormationClient);
cloudFormationClientMock.on(DescribeStacksCommand)
  .resolvesOnce({
    Stacks: [
      { StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
      { StackName: 'stack2', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
    ],
    NextToken: 'token',
  })
  .resolvesOnce({
    Stacks: [{ StackName: 'stack3', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
  });

test('returns a list of stack names', async () => {

  const response = await handler();

  expect(response).toEqual(['stack1', 'stack2', 'stack3']);
});
