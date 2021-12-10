# EcsServiceRoller

Roll your ECS service tasks on schedule or with a rule

## Usage

Define a `EcsServiceRoller`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // code that defines or imports a cluster and a service

    // Roll tasks of myFirstService everyday at midnight
    new cloudstructs.EcsServiceRoller(this, 'MyFirstRoller', {
      cluster: myCluster,
      service: myFirstService,
    });

    // Roll tasks of mySecondService every 5 hours
    new cloudstructs.EcsServiceRoller(this, 'MySecondRoller', {
      cluster: myCluster,
      service: mySecondService,
      trigger: cloudstructs.RollTrigger.fromSchedule(events.Schedule.rate(cdk.Duration.hours(5))),
    });

    // Roll tasks of myThirdService with a rule
    new cloudstructs.EcsServiceRoller(this, 'MyThirdRoller', {
      cluster: myCluster,
      service: myThirdService,
      trigger: cloudstructs.RollTrigger.fromRule(rule),
    });
  }
}
```
