import * as crypto from 'crypto';
import { verifyRequestSignature } from '../../src/slack-events/signature';

console.error = jest.fn();

test('with valid signature', () => {
  expect(verifyRequestSignature({
    body: 'hello',
    requestSignature: 'v0=495018ea2506b8ab02682a3aa5237aa029f37f0589cf7bb6309a35178975e18c',
    requestTimestamp: 9999999999,
    signingSecret: 'secret',
  })).toBe(true);
});

test('invalid signature', () => {
  expect(verifyRequestSignature({
    body: 'hello',
    requestSignature: 'v0=invalid',
    requestTimestamp: 9999999999,
    signingSecret: 'secret',
  })).toBe(false);
});

test('outdated signature', () => {
  const createHmacSpy = jest.spyOn(crypto, 'createHmac');

  expect(verifyRequestSignature({
    body: 'hello',
    requestSignature: 'v0=495018ea2506b8ab02682a3aa5237aa029f37f0589cf7bb6309a35178975e18c',
    requestTimestamp: 100,
    signingSecret: 'secret',
  })).toBe(false);

  expect(createHmacSpy).not.toHaveBeenCalled();

  createHmacSpy.mockRestore();
});
