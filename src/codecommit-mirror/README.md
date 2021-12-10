# CodeCommitMirror

Mirror a repository to AWS CodeCommit on schedule.

## Usage

Define a `CodeCommitMirror`:

```ts
import * as events from 'aws-cdk-lib/aws-events';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // code that defines or imports a cluster where the Fargate tasks will run the mirroring
    // operations

    // Mirror a public GitHub repository everyday at midnight
    new cloudstructs.CodeCommitMirror(this, 'Public', {
      cluster: myCluster,
      repository: cloudstructs.CodeCommitMirrorSourceRepository.gitHub('jogold', 'cloudstructs')
    });

    // Mirror a private GitHub repository every 6 hours.
    // The `private-repo-url` secret contains `https://TOKEN@github.com/owner/my-private-github-repo`
    const urlSecret = secretsmanager.Secret.fromSecretNameV2(this, 'Secret', 'private-repo-url');
    new cloudstructs.CodeCommitMirror(this, 'Private', {
      cluster: myCluster,
      repository: cloudstructs.CodeCommitMirrorSourceRepository.private('private', ecs.Secret.fromSecretsManager(urlSecret)),
      schedule: events.Schedule.rate(cdk.Duration.hours(6)),
    });
  }
}
```
