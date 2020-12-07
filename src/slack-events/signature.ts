import * as crypto from 'crypto';

export interface VerifyRequestSignatureOptions {
  readonly body: string;
  readonly requestSignature: string;
  readonly requestTimestamp: number;
  readonly signingSecret: string;
}

export function verifyRequestSignature(options: VerifyRequestSignatureOptions): boolean {
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);

  if (options.requestTimestamp < fiveMinutesAgo) {
    console.error('Slack request signing verification outdated');
    return false;
  }

  const hmac = crypto.createHmac('sha256', options.signingSecret);
  const [version, hash] = options.requestSignature.split('=');
  hmac.update(`${version}:${options.requestTimestamp}:${options.body}`);
  const hex = hmac.digest('hex');

  if (hash.length !== hex.length ||
      !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hex))) {
    console.error('Slack request signing verification failed');
    return false;
  }

  return true;
}
