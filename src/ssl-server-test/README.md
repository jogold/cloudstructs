# SslServerTest

Test a server/host for SSL/TLS on schedule and get notified when the overall
rating is not satisfactory.

This construct uses the [Qualys SSL Labs API](https://www.ssllabs.com).

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
      registrationEmail: 'jdoe@someoraganizationemail.com',
      host: 'my.host'
    });
  }
}
```

This will create a durable Lambda function that will run a SSL server test everyday. By default, a SNS
topic is created and a notification is sent to this topic if the [grade](https://github.com/ssllabs/research/wiki/SSL-Server-Rating-Guide)
of the test is below `A+`. The content of the notification is the
[test result returned by the API](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v4.md#response-objects).

A [free registration](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v4.md#register-for-scan-api-initiation-and-result-fetching) is required to use the the SSL Labs API.

```ts
const myTest = new SslServerTest(this, 'MyTest', {
  registrationEmail: 'jdoe@someoraganizationemail.com',
  host: 'my.host',
});

myTest.alarmTopic.addSubscription(/* your subscription here */)
```

Use the `minimumGrade`, `alarmTopic` or `scheduleExpression` props to customize the
behavior of the construct.
