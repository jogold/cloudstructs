const ServiceMock = {
  describeStacks: jest.fn()
    .mockImplementationOnce(() => ({
      promise: jest.fn().mockResolvedValue({
        Stacks: [{ StackName: 'stack1' }, { StackName: 'stack2' }],
        NextToken: 'token',
      }),
    })).mockImplementationOnce(() => ({
      promise: jest.fn().mockResolvedValue({
        Stacks: [{ StackName: 'stack3' }],
      }),
    })),
};

jest.mock('aws-sdk', () => {
  return {
    CloudFormation: jest.fn(() => ServiceMock),
  };
});

import { handler } from '../../src/toolkit-cleaner/get-stack-names.lambda';

test('returns a list of stack names', async () => {

  const response = await handler();

  expect(response).toEqual(['stack1', 'stack2', 'stack3']);
});
