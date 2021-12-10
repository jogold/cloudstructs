import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SamlFederatedPrincipal, SamlIdentityProvider } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SamlIdentityProvider', () => {
  const identityProvider = new SamlIdentityProvider(stack, 'IdentityProvider', {
    metadataDocument: '<?xml version="1.0" encoding="utf-8"?><EntityDescriptor ID="ID" entityID="ID"</EntityDescriptor>',
  });

  new iam.Role(stack, 'Role', {
    assumedBy: new SamlFederatedPrincipal(identityProvider),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
