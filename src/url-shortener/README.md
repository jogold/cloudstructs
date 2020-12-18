# UrlShortener

...

## Usage

Define a `UrlShortener`:

```ts
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new UrlShortener(this, 'UrlShortener');
  }
}
```
