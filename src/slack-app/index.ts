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
   * @see https://api.slack.com/reference/manifests#fields
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
}

/**
 * A Slack application deployed with a manifest
 *
 * @see https://api.slack.com/reference/manifests
 */
export class SlackApp extends Construct {
  /**
   * The application id
   */
  public readonly appId: string;

  /**
   * The client id of the app
   */
  public readonly clientId: string;

  /**
   * The clien secret of the app
   */
  public readonly clientSecret: string;

  /**
   * The verification token of the app
   */
  public readonly verificationToken: string;

  /**
   * The signing secret of the app
   */
  public readonly signingSecret: string;

  constructor(scope: Construct, id: string, props: SlackAppProps) {
    super(scope, id);

    const provider = SlackAppProvider.getOrCreate(this);
    props.configurationTokenSecret.grantRead(provider.handler);
    props.configurationTokenSecret.grantWrite(provider.handler);

    const resource = new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::SlackApp',
      properties: {
        manifest: props.manifest,
        configurationTokenSecretArn: props.configurationTokenSecret.secretArn,
      },
    });

    this.appId = resource.getAttString('app_id');
    this.clientId = resource.getAttString('client_id');
    this.clientSecret = resource.getAttString('client_secret');
    this.verificationToken = resource.getAttString('verification_token');
    this.signingSecret = resource.getAttString('signing_secret');
  }
}
