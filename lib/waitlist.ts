import { insertRow, type InsertResult } from './supabase-rest';

export type WaitlistResult = InsertResult;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(input: string): boolean {
  const email = normalizeEmail(input);
  return email.length <= 254 && EMAIL_RE.test(email);
}

/** Add an email to the Supabase `waitlist` table (optionally for one route). */
export async function joinWaitlist(
  input: { email: string; routeId?: string; source?: string },
  fetchImpl: typeof fetch = fetch
): Promise<WaitlistResult> {
  if (!isValidEmail(input.email)) return { ok: false, error: 'Enter a valid email address.' };
  return insertRow(
    'waitlist',
    {
      email: normalizeEmail(input.email),
      route_id: input.routeId ?? null,
      source: input.source ?? 'web'
    },
    fetchImpl
  );
}
