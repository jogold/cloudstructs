import * as assert from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { SamlFederatedPrincipal, SamlIdentityProvider } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('SamlIdentityProvider', () => {
  const identityProvider = new SamlIdentityProvider(stack, 'IdentityProvider', {
    metadataDocument: '<?xml version="1.0" encoding="utf-8"?><EntityDescriptor ID="ID" entityID="ID"</EntityDescriptor>',
  });

  new iam.Role(stack, 'Role', {
    assumedBy: new SamlFederatedPrincipal(identityProvider),
  });

  expect(assert.SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
