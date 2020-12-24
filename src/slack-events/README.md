# SlackEvents

Send Slack events to Amazon EventBridge.

## Installation

### 1. Create a Slack app

Create a new [Slack app](https://api.slack.com/apps) in your workspace, install it and
save its signing secret in a [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
secret.

This can be done with the [AWS CLI](https://aws.amazon.com/cli/):

```
aws secretsmanager create-secret --name my-slack-app --secret-string <signing secret>
```

### 2. Add the SlackEvents construct

Define a `SlackEvents` in your `Stack` and deploy it:

```ts
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cloudstructs.SlackEvents(this, 'SlackEvents', {
      signingSecret: cdk.SecretValue.secretsManager('my-slack-app'),
    });
  }
}
```

### 3. Connect your Slack app to the deployed API

Look for the API endoint in your stack outputs and use it to enable event subscriptions
in your Slack app. At this point you can also finish configuring the scopes of your Slack
app and add it to the channels where you want to listen for events.

### 4. Intercept Slack events

You can now intercept [Slack events](https://api.slack.com/events) using a `events.Rule`:

```ts
const fileSharedRule = new events.Rule(this, 'SlackEventsRule', {
  eventPattern: {
    detail: {
      event: {
        type: ['file_shared'],
      },
    },
    resources: ['<your app id>'],
    source: ['slack'],
  },
});

fileSharedRule.addTarget(new targets.LambdaFunction(myLambda, {
  event: events.RuleTargetInput.fromEventPath('$.detail.event'),
}));
```

## Use a custom event bus
By default events are sent to your default event bus, which receives events emitted
by AWS services.

Set the `customEventBus` to `true` to create and send events to a
[custom event bus](https://docs.aws.amazon.com/eventbridge/latest/userguide/create-event-bus.html)

```ts
const slackEvents = new cloudstructs.SlackEvents(this, 'SlackEvents', {
  signingSecret: cdk.SecretValue.secretsManager('my-slack-app'),
  customEventBus: true,
});

const fileSharedRule = new events.Rule(this, 'SlackEventsRule', {
  eventBus: slackEvents.eventBus,
  eventPattern: {
    detail: {
      event: {
        type: ['file_shared'],
      },
    },
    resources: ['<your app id>'],
    source: ['slack'],
  },
});
```
