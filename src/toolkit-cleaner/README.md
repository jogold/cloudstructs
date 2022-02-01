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

    new cloudstructs.ToolkitCleaner(this, 'ToolkitCleaner');
  }
}
```

The `ToolkitCleaner` construct creates a state machine that runs every day
and removes unused S3 and ECR assets from your CDK Toolkit. The state machine
outputs the number of deleted assets and the total reclaimed size in bytes.

The running frequency can be customized using the `schedule` prop.

By default all unused assets are removed. If you wish to retain assets that
were created recently, specify the `retainAssetsNewerThan` prop:

```ts
new ToolkitCleaner(this, 'ToolkitCleaner', {
  // Do not delete assets created in the last 30 days even if unused
  retainAssetsNewerThan: Duration.days(30),
});
```

Use the `dryRun` prop to only output the number of assets and total size that
would be deleted but without actually deleting assets.
