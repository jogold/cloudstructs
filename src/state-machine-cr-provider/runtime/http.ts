export const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::StateMachineProvider::MISSING_PHYSICAL_ID';

interface CloudFormationResponse {
  StackId: string;
  RequestId: string;
  PhysicalResourceId?: string;
  LogicalResourceId: string;
  ResponseURL: string;
  Data?: any;
  NoEcho?: boolean;
  Reason?: string;
}

export async function respond(status: 'SUCCESS' | 'FAILED', event: CloudFormationResponse) {
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: event.Reason ?? status,
    PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: event.NoEcho ?? false,
    Data: event.Data,
  };

  console.log('Responding: %j', json); // tslint:disable-line no-console

  const responseBody = JSON.stringify(json);

  await fetch(event.ResponseURL, {
    method: 'PUT',
    headers: { 'content-type': '' },
    body: responseBody,
  });
}
