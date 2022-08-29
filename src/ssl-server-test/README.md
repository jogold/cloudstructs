# SslServerTest

Test a server/host for SSL/TLS on schedule and get notified when the overall
rating is not satisfactory.

This construct is using the [Qualys SSL Labs API](https://www.ssllabs.com).

## Usage

Define a `SslServerTest`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { SslServerTest } from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new SslServerTest(this, 'TestMyHost', {
      host: 'my.host'
    });
  }
}
```

This will run a SSL server test everyday. By default, a SNS topic is created and a notification
is sent to this topic if the [grade](https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide)
of the test is below A+. The content of the notification is the
[test result returned by the API](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#response-objects).

```ts
const myTest = new SslServerTest(this, 'MyTest', {
  host: 'my.host',
});

myTest.alarmTopic.addSubscription(/* your subscription here */)
```

Use the `minimumGrade`, `alarmTopic` or `schedule` props to customize the
behavior of the construct.
