import * as assert from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SamlIdentityProvider } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('EmailReceiver', () => {
  new SamlIdentityProvider(stack, 'IdentityProvider', {
    metadataDocument: '<?xml version="1.0" encoding="utf-8"?><EntityDescriptor ID="ID" entityID="ID"</EntityDescriptor>',
  });

  expect(assert.SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
