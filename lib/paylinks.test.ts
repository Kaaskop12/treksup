import { describe, expect, it } from 'vitest';
import { resolvePaylink } from './paylinks';

describe('resolvePaylink', () => {
  it('accepts live Stripe payment links', () => {
    expect(resolvePaylink('https://buy.stripe.com/abc123', false)).toBe('https://buy.stripe.com/abc123');
  });
  it('ignores test-mode links unless allowed', () => {
    expect(resolvePaylink('https://buy.stripe.com/test_abc', false)).toBeNull();
    expect(resolvePaylink('https://buy.stripe.com/test_abc', true)).toBe('https://buy.stripe.com/test_abc');
  });
  it('rejects empty, malformed, non-https and non-Stripe URLs', () => {
    for (const bad of [undefined, '', 'nope', 'http://buy.stripe.com/abc', 'https://evil.com/abc']) {
      expect(resolvePaylink(bad, true)).toBeNull();
    }
  });
});
