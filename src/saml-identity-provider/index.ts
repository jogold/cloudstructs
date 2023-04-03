import { CreateSAMLProviderCommandInput, UpdateSAMLProviderCommandInput, DeleteSAMLProviderCommandInput } from '@aws-sdk/client-iam'; // eslint-disable-line import/no-extraneous-dependencies
import { Names, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

/**
 * Properties for a SamlProvider
 *
 * @deprecated use `SamlProviderProps` from `aws-cdk-lib/aws-iam`
 */
export interface SamlIdentityProviderProps {
  /**
   * A name for the SAML identity provider
   *
   * @default - derived for the node's unique id
   */
  readonly name?: string;

  /**
   * An XML document generated by an identity provider (IdP) that supports SAML 2.0.
   *
   * The document includes the issuer's name, expiration information, and keys that
   * can be used to validate the SAML authentication response (assertions) that are
   * received from the IdP. You must generate the metadata document using the identity
   * management software that is used as your organization's IdP.
   */
  readonly metadataDocument: string;
}

/**
 * Create a SAML identity provider
 *
 * @deprecated use `SamlProvider` from `aws-cdk-lib/aws-iam`
 */
export class SamlIdentityProvider extends Construct {
  /**
   * The ARN of the SAML identity provider
   */
  public readonly samlIdentityProviderArn: string;

  constructor(scope: Construct, id: string, props: SamlIdentityProviderProps) {
    super(scope, id);

    const name = props.name ?? `${Names.uniqueId(this)}IdentityProvider`;

    const arn = Stack.of(this).formatArn({
      service: 'iam',
      region: '',
      resource: 'saml-provider',
      resourceName: name,
    });

    const idp = new cr.AwsCustomResource(this, 'Resource', {
      resourceType: 'Custom::SamlIdentityProvider',
      onCreate: {
        service: 'IAM',
        action: 'createSAMLProvider',
        parameters: {
          Name: name,
          SAMLMetadataDocument: props.metadataDocument,
        } as CreateSAMLProviderCommandInput,
        physicalResourceId: cr.PhysicalResourceId.fromResponse('SAMLProviderArn'),
      },
      onUpdate: {
        service: 'IAM',
        action: 'updateSAMLProvider',
        parameters: {
          SAMLProviderArn: new cr.PhysicalResourceIdReference().toJSON(),
          SAMLMetadataDocument: props.metadataDocument,
        } as UpdateSAMLProviderCommandInput,
        physicalResourceId: cr.PhysicalResourceId.fromResponse('SAMLProviderArn'),
      },
      onDelete: {
        service: 'IAM',
        action: 'deleteSAMLProvider',
        parameters: {
          SAMLProviderArn: new cr.PhysicalResourceIdReference().toJSON(),
        } as DeleteSAMLProviderCommandInput,
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: [
            'iam:createSAMLProvider',
            'iam:updateSAMLProvider',
            'iam:deleteSAMLProvider',
          ],
          resources: [arn],
        }),
      ]),
    });

    this.samlIdentityProviderArn = idp.getResponseField('SAMLProviderArn');
  }
}

/**
 * Principal entity that represents a SAML federated identity provider.
 *
 * @deprecated use `SamlPrincipal` from `aws-cdk-lib/aws-iam`
 */
export class SamlFederatedPrincipal extends iam.FederatedPrincipal {
  constructor(identityProvider: SamlIdentityProvider) {
    super(
      identityProvider.samlIdentityProviderArn,
      {
        StringEquals: {
          'SAML:aud': 'https://signin.aws.amazon.com/saml',
        },
      },
      'sts:AssumeRoleWithSAML',
    );
  }
}
