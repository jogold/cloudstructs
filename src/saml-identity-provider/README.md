# SamlIdentityProvider

Custom resource to create a SAML identity provider

## Usage

Define a `SamlIdentityProvider`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';
import * as fs from 'fs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
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
