# SamlIdentityProvider

Custom resource to create a SAML identity provider

## Usage

Define a `SamlIdentityProvider`:

```ts
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';
import * as fs from 'fs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const metadataDocument = fs.readFileSync('./my-document.xml', 'utf-8');

    new cloudstructs.SamlIdentityProvider(this, 'IdentityProvider', { metadataDocument });
  }
}
```

The ARN of the identity provider is exposed via the `samlIdentityProviderArn` property.

Use the `SamlFederatedPrincipal` principal to create a `iam.Role` assumed by the identity
provider:

```ts
new iam.Role(this, 'Role', {
  assumedBy: new SamlFederatedPrincipal(identityProvider),
})
```
