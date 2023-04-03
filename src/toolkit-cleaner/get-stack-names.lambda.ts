import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

const cloudFormationClient = new CloudFormationClient({});

export async function handler() {
  const res: string[] = [];

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await cloudFormationClient.send(new DescribeStacksCommand({ NextToken: nextToken }));

    for (const stack of (response.Stacks ?? [])) {
      if (stack.StackName) {
        res.push(stack.StackName);
      }
    }

    nextToken = response.NextToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }

  return res;
}
