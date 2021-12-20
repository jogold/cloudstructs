import { CustomResource } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { SlackAppProvider } from './provider';

/**
 * Properties for a SlackApp
 */
export interface SlackAppProps {
  /**
   * The JSON app manifest encoded as a string
   *
   * @see https://api.slack.com/reference/manifests
   */
  readonly manifest: string;

  /**
   * An AWS Secrets Manager secret containing the app configuration token
   *
   * Must use the following JSON format:
   *
   * ```
   * {
   *   "refreshToken": "<token>"
   * }
   * ```
   */
  readonly configurationTokenSecret: secretsmanager.ISecret;

  /**
   * The AWS Secrets Manager secret where to store the app credentials
   *
   * @default - a new secret is created
   */
  readonly credentialsSecret?: secretsmanager.ISecret;
}

/**
 * A Slack application deployed with a manifest
 *
 * @see https://api.slack.com/reference/manifests
 */
export class SlackApp extends Construct {
  /**
   * The ID of the application
   */
  public readonly appId: string;

  /**
   * An AWS Secrets Manager secret containing the credentials of the application.
   *
   * ```
   * {
   *   "appId": "...",
   *   "clientId": "...",
   *   "clientSecret": "...",
   *   "verificationToken": "...",
   *   "signingSecret": "..."
   * }
   * ```
   */
  public readonly credentials: secretsmanager.ISecret;

  /**
   * A dynamic reference to the client ID of the app
   */
  public readonly clientId: string;

  /**
   * A dynamic reference to the client secret of the app
   */
  public readonly clientSecret: string;

  /**
   * A dynamic reference to the verification token of the app
   */
  public readonly verificationToken: string;

  /**
   * A dynamic reference to the signing secret of the app
   */
  public readonly signingSecret: string;

  constructor(scope: Construct, id: string, props: SlackAppProps) {
    super(scope, id);

    const provider = SlackAppProvider.getOrCreate(this);
    props.configurationTokenSecret.grantRead(provider.handler);
    props.configurationTokenSecret.grantWrite(provider.handler);

    this.credentials = props.credentialsSecret ?? new secretsmanager.Secret(this, 'Credentials', {
      description: `Credentials for Slack App ${this.node.id}`,
    });
    this.credentials.grantWrite(provider.handler);

    const resource = new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::SlackApp',
      properties: {
        manifest: props.manifest,
        configurationTokenSecretArn: props.configurationTokenSecret.secretArn,
        credentialsSecretArn: this.credentials.secretArn,
      },
    });

    this.appId = resource.getAttString('appId');
    this.clientId = this.credentials.secretValueFromJson('clientId').toString();
    this.clientSecret = this.credentials.secretValueFromJson('clientSecret').toString();
    this.verificationToken = this.credentials.secretValueFromJson('verificationToken').toString();
    this.signingSecret = this.credentials.secretValueFromJson('signingSecret').toString();
  }
}
