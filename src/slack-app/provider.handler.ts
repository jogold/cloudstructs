/* eslint-disable no-console */
import { OnEventRequest, OnEventResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import { SecretsManager } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import got from 'got';

interface SlackSecret {
  accessToken?: string;
  refreshToken?: string;
  exp?: number;
}

interface RotateResponse {
  ok: boolean;
  error?: string;
  token: string;
  refresh_token: string;
  team_id: string;
  user_id: string;
  iat: number;
  exp: number;
}

interface ManifestCreateRequest {
  manifest: string;
}

interface ManifestUpdateRequest extends ManifestCreateRequest {
  app_id: string;
}

interface ManifestDeleteRequest {
  app_id: string;
}

type ManifestRequest = ManifestCreateRequest | ManifestUpdateRequest | ManifestDeleteRequest;

interface ManifestResponse {
  ok: boolean;
  error?: string;
  errors?: {
    message: string;
    pointer: string;
  }[];
  app_id?: string;
  credentials?: {
    client_id: string;
    client_secret: string;
    verification_token: string;
    signing_secret: string;
  };
}

const secretsmanager = new SecretsManager({ apiVersion: '2017-10-17' });

const slackClient = got.extend({
  prefixUrl: 'https://slack.com/api',
});

export async function handler(event: OnEventRequest): Promise<OnEventResponse> {
  console.log('Event: %j', event);

  const data = await secretsmanager.getSecretValue({
    SecretId: event.ResourceProperties.configurationTokenSecretArn,
  }).promise();

  if (!data.SecretString) {
    throw new Error('No secret string found in configuration token secret');
  }

  const secret: SlackSecret = JSON.parse(data.SecretString);

  let accessToken = secret.accessToken;

  if (!accessToken || isExpired(secret.exp ?? 0)) {
    if (!secret.refreshToken) {
      throw new Error('No refresh token found in configuration token secret');
    }

    console.log('Refreshing access token');
    const rotate = await slackClient.get('tooling.tokens.rotate', {
      searchParams: { refresh_token: secret.refreshToken },
    }).json<RotateResponse>();

    if (!rotate.ok) {
      throw new Error(`Failed to refresh access token: ${rotate.error}`);
    }
    console.log('Access token refreshed');

    accessToken = rotate.token;

    console.log('Saving access token');
    const putSecretValue = await secretsmanager.putSecretValue({
      SecretId: event.ResourceProperties.configurationTokenSecretArn,
      SecretString: JSON.stringify({
        accessToken,
        refreshToken: rotate.refresh_token,
        exp: rotate.exp,
      }),
    }).promise();
    console.log(`Successfully saved access token in secret ${putSecretValue.ARN}`);
  }

  const operation = event.RequestType.toLowerCase();
  const request = getManifestRequest(event);

  console.log(`Calling ${operation} manifest API: %j`, request);
  const response = await slackClient.post(`apps.manifest.${operation}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: request,
  }).json<ManifestResponse>();

  if (!response.ok) {
    const errors = response.errors
      ? response.errors.map((err) => `${err.message} at ${err.pointer}`).join('\n')
      : '';
    throw new Error(`Failed to ${operation} manifest: ${response.error}.${errors ? `\n${errors}}` : ''}`);
  }

  console.log(`Successfully ${operation}d Slack app ${event.PhysicalResourceId ?? response.app_id}`);

  if (event.RequestType === 'Create' && response.credentials) {
    console.log('Saving app credentials');
    const putSecretValue = await secretsmanager.putSecretValue({
      SecretId: event.ResourceProperties.credentialsSecretArn,
      SecretString: JSON.stringify({
        appId: response.app_id,
        clientId: response.credentials.client_id,
        clientSecret: response.credentials.client_secret,
        verificationToken: response.credentials.verification_token,
        signingSecret: response.credentials.signing_secret,
      }),
    }).promise();
    console.log(`Successfully saved app credentials in secret ${putSecretValue.ARN}`);
  }

  return {
    PhysicalResourceId: response.app_id,
    Data: {
      appId: response.app_id,
    },
  };
}

function isExpired(iat: number) {
  return (iat - (Date.now() / 1000)) < 0;
}

function getManifestRequest(event: OnEventRequest): ManifestRequest {
  switch (event.RequestType) {
    case 'Create':
      return {
        manifest: event.ResourceProperties.manifest,
      };
    case 'Update':
      return {
        app_id: event.PhysicalResourceId,
        manifest: event.ResourceProperties.manifest,
      };
    case 'Delete':
      return {
        app_id: event.PhysicalResourceId!,
      };
  }
}
