# UrlShortener

Deploy an URL shortener API.

Uses a DynamoDB table to increment a counter. The value of the counter is base62
encoded and then a zero-byte object with redirection is stored in S3.

## Usage

Define a `UrlShortener`:

```ts
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The hosted zone for the domain of the short urls
    const hostedZone = new route53.HostedZone(this, 'HostedZone', { zoneName: 'short.com' });

    new cloudstructs.UrlShortener(this, 'UrlShortener', { hostedZone });
  }
}
```

The deployed API expects the following JSON body:

```json
{
  "url": "https://www.mylongurl.com/very/long/path"
}
```

and replies with:

```json
{
  "url": "https://www.mylongurl.com/very/long/path",
  "shortUrl": "https://short.com/trBkV"
}
```

By default, the API is public. It can be made private by specifying
the `apiGatewayEndpoint` prop.
