import * as http from '../../src/state-machine-cr-provider/runtime/http';

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true });
});

test('respond', async () => {
  await http.respond('SUCCESS', {
    LogicalResourceId: 'logical-resource-id',
    RequestId: 'request-id',
    ResponseURL: 'https://localhost',
    StackId: 'stack-id',
    PhysicalResourceId: 'physical-resource-id',
    Data: {
      Key: 'Value',
    },
  });

  expect(fetchMock).toHaveBeenCalledWith('https://localhost', {
    method: 'PUT',
    headers: { 'content-type': '' },
    body: JSON.stringify({
      Status: 'SUCCESS',
      Reason: 'SUCCESS',
      PhysicalResourceId: 'physical-resource-id',
      StackId: 'stack-id',
      RequestId: 'request-id',
      LogicalResourceId: 'logical-resource-id',
      NoEcho: false,
      Data: { Key: 'Value' },
    }),
  });
});

test('respond without physical resource id', async () => {
  await http.respond('SUCCESS', {
    LogicalResourceId: 'logical-resource-id',
    RequestId: 'request-id',
    ResponseURL: 'https://localhost',
    StackId: 'stack-id',
  });

  expect(fetchMock).toHaveBeenCalledWith('https://localhost', {
    method: 'PUT',
    headers: { 'content-type': '' },
    body: JSON.stringify({
      Status: 'SUCCESS',
      Reason: 'SUCCESS',
      PhysicalResourceId: http.MISSING_PHYSICAL_ID_MARKER,
      StackId: 'stack-id',
      RequestId: 'request-id',
      LogicalResourceId: 'logical-resource-id',
      NoEcho: false,
    }),
  });
});
