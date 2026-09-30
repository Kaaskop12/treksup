import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isValidEmail, joinWaitlist, normalizeEmail } from './waitlist';

describe('email validation', () => {
  it('accepts normal addresses and trims/lowercases', () => {
    expect(isValidEmail('  Sebbe@Example.com ')).toBe(true);
    expect(normalizeEmail('  Sebbe@Example.com ')).toBe('sebbe@example.com');
  });
  it('rejects junk', () => {
    for (const bad of ['', 'nope', 'a@b', '@x.com', 'a b@x.com', 'a@@x.com']) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });
  it('rejects over-long addresses', () => {
    expect(isValidEmail('a'.repeat(250) + '@x.com')).toBe(false);
  });
});

describe('joinWaitlist', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key';
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  const respond = (status: number) =>
    vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status }) as unknown as typeof fetch;

  it('posts normalized payload to the waitlist table', async () => {
    const f = respond(201);
    const r = await joinWaitlist({ email: ' A@B.com ', routeId: 'alta-via-1', source: 'route-gpx' }, f);
    expect(r).toEqual({ ok: true });
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://x.supabase.co/rest/v1/waitlist');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.com', route_id: 'alta-via-1', source: 'route-gpx' });
    expect(init.headers.apikey).toBe('key');
  });

  it('treats a duplicate signup (409) as success', async () => {
    expect(await joinWaitlist({ email: 'a@b.com' }, respond(409))).toEqual({ ok: true });
  });

  it('reports server errors', async () => {
    const r = await joinWaitlist({ email: 'a@b.com' }, respond(500));
    expect(r.ok).toBe(false);
  });

  it('reports network failure', async () => {
    const f = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    expect((await joinWaitlist({ email: 'a@b.com' }, f)).ok).toBe(false);
  });

  it('does not call the network for an invalid email', async () => {
    const f = respond(201);
    expect((await joinWaitlist({ email: 'nope' }, f)).ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it('fails cleanly when env is missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const f = respond(201);
    expect((await joinWaitlist({ email: 'a@b.com' }, f)).ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });
});
