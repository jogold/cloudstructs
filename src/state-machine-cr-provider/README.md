# StateMachineCustomResourceProvider

Implement custom resources with AWS Step Functions state machines.

The `StateMachineCustomResourceProvider` allows to create complex custom resources calling
various AWS services and running long processes. This with minimal runtime code.

For example, it can be used to run a Fargate task to provision a RDS database.

## Usage

Define a `StateMachineCustomResourceProvider` and pass its `serviceToken` to a
a `cdk.CustomResource`.

```ts
import { CustomResource, Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define a provider
    const provider = new cloudstructs.StateMachineCustomResourceProvider(this, 'Provider', {
      stateMachine: myStateMachine,
    });

    // Use the provider as a custom resource
    new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: {
        Key: 'value',
      },
    });
  }
}
```

The provider will start an execution of `myStateMachine` with the [custom resource request
object](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html).

The provider automatically sends back a response to CloudFormation and handles errors in case
of failures or timeouts. This prevent deployments from being blocked.

The following fields can be specified in the execution output of `myStateMachine`:

* `PhysicalResourceId`: The allocated/assigned physical ID of the resource. If omitted for `Create`
  events, the event's `RequestId` will be used. For `Update`, the current physical ID will be used.
  If a different value is returned, CloudFormation will follow with a subsequent `Delete` for the previous ID (resource replacement). For `Delete`, it will always return the current physical
  resource ID.

* `Data`: Resource attributes, which can later be retrieved through `Fn::GetAtt` on the custom
  resource object.

* `NoEcho`: Indicates whether to mask the output of the custom resource when retrieved by using
  the `Fn::GetAtt` function. The default value is `false`.
