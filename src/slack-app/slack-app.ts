import * as fs from 'fs';
import { CustomResource } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct, IConstruct } from 'constructs';
import { SlackAppManifest, SlackAppManifestProps } from './manifest';
import { SlackAppProvider } from './provider';

/**
 * Properties for a SlackApp
 */
export interface SlackAppProps {
  /**
   * The definition of the app manifest
   *
   * @see https://api.slack.com/reference/manifests
   */
  readonly manifest: SlackAppManifestDefinition;

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
 * A Slack app manifest definition
 */
export abstract class SlackAppManifestDefinition {
  /**
   * Create a Slack app manifest from a JSON app manifest encoded as a string
   */
  public static fromString(manifest: string): SlackAppManifestDefinition {
    return new StringManifest(manifest);
  }

  /**
   * Creates a Slack app manifest from a file containg a JSON app manifest
   */
  public static fromFile(file: string): SlackAppManifestDefinition {
    return new FileManifest(file);
  }

  /**
   * Creates a Slack app manifest by specifying properties
   */
  public static fromManifest(props: SlackAppManifestProps): SlackAppManifestDefinition {
    return new SlackAppManifest(props);
  }

  /**
   * Renders the JSON app manifest encoded as a string
   */
  public abstract render(construct: IConstruct): string;
}

class StringManifest extends SlackAppManifestDefinition {
  constructor(private readonly manifest: string) {
    super();
  }

  public render(_construct: IConstruct): string {
    return this.manifest;
  }
}

class FileManifest extends SlackAppManifestDefinition {
  constructor(private readonly file: string) {
    super();
  }

  public render(_construct: IConstruct): string {
    return fs.readFileSync(this.file, 'utf8');
  }
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
        manifest: props.manifest.render(this),
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
