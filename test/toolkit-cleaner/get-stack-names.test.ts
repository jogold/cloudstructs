import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/get-stack-names.lambda';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

const cloudFormationClientMock = mockClient(CloudFormationClient);
cloudFormationClientMock.on(DescribeStacksCommand)
  .resolvesOnce({
    Stacks: [
      { StackName: 'stack1', CreationTime: new Date(), StackStatus: 'status' },
      { StackName: 'stack2', CreationTime: new Date(), StackStatus: 'status' }
    ],
    NextToken: 'token',
  })
  .resolvesOnce({
    Stacks: [{ StackName: 'stack3', CreationTime: new Date(), StackStatus: 'status' }],
  })

test('returns a list of stack names', async () => {

  const response = await handler();

  expect(response).toEqual(['stack1', 'stack2', 'stack3']);
});
