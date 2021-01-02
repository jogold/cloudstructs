# CodeCommitMirror

Mirror a repository to AWS CodeCommit on schedule.

## Usage

Define a `CodeCommitMirror`:

```ts
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
