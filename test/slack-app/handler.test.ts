const rotateResponseMock = jest.fn().mockResolvedValue({});
const manifestResponseMock = jest.fn().mockResolvedValue({});

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

import 'aws-sdk-client-mock-jest';
import { GetSecretValueCommand, PutSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/slack-app/provider.lambda';

const event: AWSLambda.CloudFormationCustomResourceEvent & { PhysicalResourceId?: string } = {
  RequestType: 'Create',
  ServiceToken: 'service-token',
  ResponseURL: 'response-url',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::SlackApp',
  ResourceProperties: {
    ServiceToken: 'service-token',
    manifest: 'manifest',
    configurationTokenSecretArn: 'conf-secret-arn',
    credentialsSecretArn: 'creds-secret-arn',
  },
};

const credentials = {
  client_id: 'client-id',
  client_secret: 'client-secret',
  verification_token: 'verification-token',
  signing_secret: 'signing_secret',
};

const secretsManagerClientMock = mockClient(SecretsManagerClient);

beforeEach(() => {
  jest.clearAllMocks();
  secretsManagerClientMock.reset();
  secretsManagerClientMock.on(GetSecretValueCommand).resolves({
    SecretString: JSON.stringify({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      exp: Date.now() / 1000 + 3600,
    }),
  });
  secretsManagerClientMock.on(PutSecretValueCommand).resolves({
    ARN: 'arn',
  });

  manifestResponseMock.mockResolvedValue({
    ok: true,
    app_id: 'app-id',
    credentials,
  });

  fetchMock.mockImplementation((_url: unknown, init?: { method?: string }) => {
    if (init?.method === 'POST') {
      return Promise.resolve({ ok: true, json: manifestResponseMock });
    }
    return Promise.resolve({ ok: true, json: rotateResponseMock });
  });
});

test('create request', async () => {
  const response = await handler(event);

  expect(response).toEqual({
    PhysicalResourceId: 'app-id',
    Data: {
      appId: 'app-id',
    },
  });

  expect(secretsManagerClientMock).toHaveReceivedCommandWith(GetSecretValueCommand, {
    SecretId: 'conf-secret-arn',
  });

  expect(fetchMock).toHaveBeenCalledWith('https://slack.com/api/apps.manifest.create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer access-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ manifest: 'manifest' }),
  });

  expect(secretsManagerClientMock).toHaveReceivedCommandWith(PutSecretValueCommand, {
    SecretId: 'creds-secret-arn',
    SecretString: JSON.stringify({
      appId: 'app-id',
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      verificationToken: credentials.verification_token,
      signingSecret: credentials.signing_secret,
    }),
  });
});

test('refreshes the token', async () => {
  secretsManagerClientMock.on(GetSecretValueCommand).resolvesOnce({
    SecretString: JSON.stringify({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      exp: 0, // expired
    }),
  });

  const exp = (Date.now() / 1000) + 12 * 3600;
  rotateResponseMock.mockResolvedValue({
    ok: true,
    token: 'new-access-token',
    refresh_token: 'new-refresh-token',
    exp,
  });

  const response = await handler(event);

  expect(response).toEqual({
    PhysicalResourceId: 'app-id',
    Data: {
      appId: 'app-id',
    },
  });

  expect(secretsManagerClientMock).toHaveReceivedCommandWith(GetSecretValueCommand, {
    SecretId: 'conf-secret-arn',
  });

  expect(secretsManagerClientMock).toHaveReceivedCommandWith(PutSecretValueCommand, {
    SecretId: 'conf-secret-arn',
    SecretString: JSON.stringify({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      exp,
    }),
  });

  const rotateUrl = new URL('https://slack.com/api/tooling.tokens.rotate');
  rotateUrl.searchParams.set('refresh_token', 'refresh-token');
  expect(fetchMock).toHaveBeenCalledWith(rotateUrl);

  expect(fetchMock).toHaveBeenCalledWith('https://slack.com/api/apps.manifest.create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer new-access-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ manifest: 'manifest' }),
  });
});

test('update request', async () => {
  manifestResponseMock.mockResolvedValue({
    ok: true,
    app_id: 'app-id',
  });

  const response = await handler({
    ...event,
    PhysicalResourceId: 'app-id',
    RequestType: 'Update',
  });

  expect(response).toEqual({
    PhysicalResourceId: 'app-id',
    Data: {
      appId: 'app-id',
    },
  });

  expect(fetchMock).toHaveBeenCalledWith('https://slack.com/api/apps.manifest.update', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer access-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ app_id: 'app-id', manifest: 'manifest' }),
  });

  expect(secretsManagerClientMock).not.toHaveReceivedCommand(PutSecretValueCommand);
});

test('delete request', async () => {
  manifestResponseMock.mockResolvedValue({
    ok: true,
  });

  const response = await handler({
    ...event,
    PhysicalResourceId: 'app-id',
    RequestType: 'Delete',
  });

  expect(response).toEqual({
    PhysicalResourceId: undefined,
    Data: {
      appId: undefined,
    },
  });

  expect(fetchMock).toHaveBeenCalledWith('https://slack.com/api/apps.manifest.delete', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer access-token',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ app_id: 'app-id' }),
  });

  expect(secretsManagerClientMock).not.toHaveReceivedCommand(PutSecretValueCommand);
});
