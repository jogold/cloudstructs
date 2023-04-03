import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import * as runtime from '../../src/state-machine-cr-provider/runtime';
import * as http from '../../src/state-machine-cr-provider/runtime/http';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

jest.mock('../../src/state-machine-cr-provider/runtime/http');

console.log = jest.fn();

const sfnClientMock = mockClient(SFNClient);

beforeEach(() => {
  sfnClientMock.reset();
  jest.clearAllMocks();
  process.env.STATE_MACHINE_ARN = 'state-machine-arn';
});

const cfEvent: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string } = {
  RequestType: 'Create',
  ServiceToken: 'service-token',
  ResponseURL: 'response-url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::StateMachine',
  ResourceProperties: {
    ServiceToken: 'service-token',
    PropKey: 'PropValue',
  },
};

test('cfnResponseSuccess with CREATE', async () => {
  await runtime.cfnResponseSuccess({
    ExecutionArn: 'execution-arn',
    Input: cfEvent,
    Name: 'execution-name',
    Output: {
      PhysicalResourceId: 'physical-resource-id',
      Data: {
        DataKey: 'DataValue',
      },
    },
    StartDate: 12345678,
    StateMachineArn: 'state-machine-arn',
    Status: 'SUCCEEDED',
    StopDate: 12345679,
  });

  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.objectContaining({
    Data: {
      DataKey: 'DataValue',
    },
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: 'physical-resource-id',
    RequestId: 'request-id',
    RequestType: 'Create',
    ResponseURL: 'response-url',
  }));
});

test('cfnResponseSuccess with Create and no physical resource id', async () => {
  await runtime.cfnResponseSuccess({
    ExecutionArn: 'execution-arn',
    Input: cfEvent,
    Name: 'execution-name',
    Output: {
      Data: {
        DataKey: 'DataValue',
      },
    },
    StartDate: 12345678,
    StateMachineArn: 'state-machine-arn',
    Status: 'SUCCEEDED',
    StopDate: 12345679,
  });

  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.objectContaining({
    PhysicalResourceId: 'request-id',
  }));
});

test('cfnResponseFailed with Create', async () => {
  const cause = {
    Input: JSON.stringify(cfEvent),
  };
  await runtime.cfnResponseFailed({
    Cause: JSON.stringify(cause),
    Error: 'CreateError',
  });

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: runtime.CREATE_FAILED_PHYSICAL_ID_MARKER,
    RequestId: 'request-id',
    RequestType: 'Create',
    ResponseURL: 'response-url',
    Reason: expect.stringMatching(/^CreateError:/),
  }));
});

test('cfnResponseFailed with Update', async () => {
  const cause = {
    Input: JSON.stringify({
      ...cfEvent,
      RequestType: 'Update',
      PhysicalResourceId: 'physical-resource-id',
    }),
  };
  await runtime.cfnResponseFailed({
    Cause: JSON.stringify(cause),
    Error: 'UpdateError',
  });

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    LogicalResourceId: 'logical-resource-id',
    PhysicalResourceId: 'physical-resource-id',
    RequestId: 'request-id',
    RequestType: 'Update',
    ResponseURL: 'response-url',
    Reason: expect.stringMatching(/^UpdateError:/),
  }));
});

test('startExecution with Create', async () => {
  await runtime.startExecution(cfEvent);

  expect(sfnClientMock).toHaveReceivedCommandWith(StartExecutionCommand, {
    stateMachineArn: 'state-machine-arn',
    input: JSON.stringify(cfEvent),
  });
});

test('startExecution with Delete after failed Create', async () => {
  await runtime.startExecution({
    ...cfEvent,
    RequestType: 'Delete',
    PhysicalResourceId: runtime.CREATE_FAILED_PHYSICAL_ID_MARKER,
  });

  expect(sfnClientMock).not.toHaveReceivedCommand(StartExecutionCommand);
  expect(http.respond).toHaveBeenCalledWith('SUCCESS', expect.anything());
});

test('startExecution with error', async () => {
  sfnClientMock.on(StartExecutionCommand).rejects(new Error('UnknownError'));

  await runtime.startExecution(cfEvent);

  expect(http.respond).toHaveBeenCalledWith('FAILED', expect.objectContaining({
    Reason: 'UnknownError',
  }));
});
