# UrlShortener

Deploy an URL shortener API.

Each short URL gets a random 128-bit key, under which an object holding the
redirection is stored in S3. Keys cannot be guessed from one another.

## Usage

Define a `UrlShortener`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The hosted zone for the domain of the short urls
    const hostedZone = new route53.HostedZone(this, 'HostedZone', { zoneName: 'short.com' });

    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop');

    new cloudstructs.UrlShortener(this, 'UrlShortener', { hostedZone, certificate });
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
  "shortUrl": "https://short.com/4Ma3mLc7PbZW9fHnQx1tGg"
}
```

By default, the API is public. It can be made private by specifying
the `apiGatewayEndpoint` prop.

An authorizer can be added to the API by specifying the `apiGatewayAuthorizer`
prop.

Enable CORS by passing the `corsAllowOrigins` prop.

Restrict the URLs that can be shortened with the `allowedUrlPatterns` prop, a
list of regular expressions tested against the whole URL. A URL matching none
of them is refused with a 400. Anchor each pattern up to the `/` after the
host (`^https://www\.example\.com/`), or a URL on another host can match
it. Without the prop, the short domain redirects to any URL its callers send.

Make short URLs stop redirecting after a set time with the `linkTtl` prop:

```ts
new cloudstructs.UrlShortener(this, 'UrlShortener', {
  hostedZone,
  certificate,
  allowedUrlPatterns: ['^https://www\\.example\\.com/upload\\?'],
  linkTtl: Duration.minutes(15),
  expiredRedirectQueryParameter: 'expired',
});
```

With `linkTtl`, the redirection is a 302 with `Cache-Control: no-store` and
CloudFront does not cache it, so that no cache keeps it past its time, and an
expired short URL answers a 404. Short URLs created before `linkTtl` is turned
on expire as well once older than it. With `expiredRedirectQueryParameter` it redirects instead to its
target without the query string and hash, with that parameter set to `1`
(`https://www.example.com/upload?expired=1`), so the target page can explain
that the link expired. The objects in S3 then expire one day after `linkTtl`
rounded up to days, unless `expiration` is set.
