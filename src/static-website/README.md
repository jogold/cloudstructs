# StaticWebsite

A CloudFront static website hosted on S3 with HTTPS redirect, SPA redirect,
HTTP security headers and backend configuration saved to the bucket.

## Usage

Define a `StaticWebsite`:

```ts
import { CustomResource, Stack, StackProps } from 'aws-cdk-lib';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const staticWebsite = new cloudstructs.StaticWebsite(this, 'StaticWebsite', {
      domainName: 'www.my-site.com',
      hostedZone: myHostedZone,
      backendConfiguration: { // Saved to `config.json` in the bucket
        stage: 'prod',
        apiUrl: 'https://www.my-api.com/api',
      },
    });

    // Use the website to add a deployment
    new deployment.BucketDeployment(this, 'Deployment', {
      destinationBucket: staticWebSite.bucket,
      sources: [deployment.Source.asset(sourcePath)],
      cacheControl: [deployment.CacheControl.fromString('public, max-age=31536000, immutable')],
    });
  }
}
```

The `backendConfiguration` will be saved as `config.json` in the S3 bucket of the
static website. This allows the frontend to `fetch('/config.json')` to get its
configuration. Deploy time values can be used:

```ts
const myApi = new apigateway.LambdaRestApi(this, 'Api', { ... });
const myUserPool = new cognito.UserPool(this, 'UserPool');

const staticWebsite = new cloudstructs.StaticWebsite(this, 'StaticWebsite', {
  domainName: 'www.my-site.com',
  hostedZone: myHostedZone,
  backendConfiguration: {
    apiUrl: myApi.url,
    userPoolId: myUserPool.userPoolId,
  },
});
```

By default a HTTPS redirect will be created from the domain name of the hosted
zone to the domain name of the static website. This can be changed by specifying
the `redirects` prop:

```ts
const staticWebsite = new cloudstructs.StaticWebsite(this, 'StaticWebsite', {
  domainName: 'www.my-site.com',
  hostedZone: myHostedZone,
  redirects: ['my-site.com', 'hello.my-site.com'],
});
```
