import { CloudFormationClient, GetTemplateCommand } from '@aws-sdk/client-cloudformation';

const cloudFormationClient = new CloudFormationClient({});

export async function handler(stackName: string) {
  const template = await cloudFormationClient.send(new GetTemplateCommand({
    StackName: stackName,
  }));

  if (!template.TemplateBody) {
    return [];
  }

  if (!process.env.DOCKER_IMAGE_ASSET_HASH) {
    throw new Error('Missing DOCKER_IMAGE_ASSET_HASH environment variable');
  }
  const dockerTagPrefix = findDockerTagPrefix(process.env.DOCKER_IMAGE_ASSET_HASH);

  const regexp = new RegExp(`(${dockerTagPrefix})?[a-f0-9]{64}`, 'g');
  const hashes = template.TemplateBody.match(regexp);

  return [...new Set(hashes)];
}

function findDockerTagPrefix(hash: string): string {
  if (hash.length === 64) {
    return '';
  }

  return hash.substring(0, hash.length - 64);
}
