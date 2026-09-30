export type WaitlistResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(input: string): boolean {
  const email = normalizeEmail(input);
  return email.length <= 254 && EMAIL_RE.test(email);
}

/**
 * Insert a row into the Supabase `waitlist` table via the REST API.
 * Uses the public publishable key; RLS only allows INSERT.
 * A duplicate signup (HTTP 409 / Postgres 23505) counts as success.
 */
export async function joinWaitlist(
  input: { email: string; routeId?: string; source?: string },
  fetchImpl: typeof fetch = fetch
): Promise<WaitlistResult> {
  if (!isValidEmail(input.email)) return { ok: false, error: 'Enter a valid email address.' };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, error: 'Signup is not configured yet.' };

  try {
    const res = await fetchImpl(`${url}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email: normalizeEmail(input.email),
        route_id: input.routeId ?? null,
        source: input.source ?? 'web'
      })
    });
    if (res.ok || res.status === 409) return { ok: true };
    return { ok: false, error: 'Something went wrong. Try again in a minute.' };
  } catch {
    return { ok: false, error: 'No connection. Try again.' };
  }
}
