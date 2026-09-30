/**
 * Stripe Payment Links per paid guide. Env vars must be referenced literally so
 * Next.js can inline them at build time.
 */
const RAW: Record<string, string | undefined> = {
  'tmb-2027-plan': process.env.NEXT_PUBLIC_PAYLINK_TMB_2027_PLAN
};

/**
 * Returns a usable checkout URL or null (null => show the "checkout opens soon"
 * email capture instead). Stripe test-mode links are ignored unless explicitly
 * allowed, so a sandbox link can never end up in front of real visitors by mistake.
 */
export function resolvePaylink(
  raw: string | undefined,
  allowTest = process.env.NEXT_PUBLIC_ALLOW_TEST_PAYLINKS === '1'
): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com') return null;
  if (url.pathname.startsWith('/test_') && !allowTest) return null;
  return url.toString();
}

export function paylinkFor(guideId: string): string | null {
  return resolvePaylink(RAW[guideId]);
}
