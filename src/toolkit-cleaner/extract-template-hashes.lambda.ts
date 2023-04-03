import { CloudFormationClient, GetTemplateCommand } from '@aws-sdk/client-cloudformation';

const cloudFormationClient = new CloudFormationClient({});

export async function handler(stackName: string) {
  const template = await cloudFormationClient.send(new GetTemplateCommand({
    StackName: stackName,
  }));

  if (!template.TemplateBody) {
    return [];
  }

  const hashes = template.TemplateBody.match(/[a-f0-9]{64}/g);

  return [...new Set(hashes)];
}
