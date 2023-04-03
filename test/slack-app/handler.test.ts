import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { GetSecretValueCommand, PutSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const getResponseMock = jest.fn().mockResolvedValue({});
const getMock = jest.fn().mockImplementation(() => ({
  json: getResponseMock,
}));

const postResponseMock = jest.fn().mockResolvedValue({});
const postMock = jest.fn().mockImplementation(() => ({
  json: postResponseMock,
}));

const extendMock = jest.fn().mockImplementation(() => {
  return {
    get: getMock,
    post: postMock,
  };
});

jest.mock('got', () => {
  return {
    extend: extendMock,
  };
});

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
  secretsManagerClientMock.reset()
  secretsManagerClientMock.on(GetSecretValueCommand).resolves({
    SecretString: JSON.stringify({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      exp: Date.now() / 1000 + 3600,
    }),
  })

  postResponseMock.mockResolvedValue({
    ok: true,
    app_id: 'app-id',
    credentials,
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

  expect(postMock).toHaveBeenCalledWith('apps.manifest.create', {
    headers: { Authorization: 'Bearer access-token' },
    json: { manifest: 'manifest' },
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
  getResponseMock.mockResolvedValue({
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

  expect(postMock).toHaveBeenCalledWith('apps.manifest.create', {
    headers: { Authorization: 'Bearer new-access-token' },
    json: { manifest: 'manifest' },
  });
});

test('update request', async () => {
  postResponseMock.mockResolvedValue({
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

  expect(postMock).toHaveBeenCalledWith('apps.manifest.update', {
    headers: { Authorization: 'Bearer access-token' },
    json: { app_id: 'app-id', manifest: 'manifest' },
  });

  expect(secretsManagerClientMock).not.toHaveReceivedCommand(PutSecretValueCommand);
});

test('delete request', async () => {
  postResponseMock.mockResolvedValue({
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

  expect(postMock).toHaveBeenCalledWith('apps.manifest.delete', {
    headers: { Authorization: 'Bearer access-token' },
    json: { app_id: 'app-id' },
  });

  expect(secretsManagerClientMock).not.toHaveReceivedCommand(PutSecretValueCommand);
});
