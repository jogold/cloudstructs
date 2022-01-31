# ToolkitCleaner

Clean unused S3 and ECR assets from your CDK Toolkit.

## Usage

Define a `ToolkitCleaner`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ToolkitCleaner(this, 'ToolkitCleaner');
  }
}
```

The `ToolkitCleaner` construct creates a state machine that runs every day
and removes unused S3 and ECR assets from your CDK Toolkit.

The running frequency can be customized using the `schedule` prop.
