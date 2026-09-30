import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitPartnerLead } from './partners';

const respond = (status: number) =>
  vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status }) as unknown as typeof fetch;

describe('submitPartnerLead', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key';
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('posts a trimmed, normalized lead to partner_leads', async () => {
    const f = respond(201);
    const r = await submitPartnerLead(
      { company: '  Alpine Co ', email: ' Ops@Alpine.CO ', routes: ' TMB, AV1 ', note: '' },
      f
    );
    expect(r).toEqual({ ok: true });
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://x.supabase.co/rest/v1/partner_leads');
    expect(JSON.parse(init.body)).toEqual({
      company: 'Alpine Co',
      email: 'ops@alpine.co',
      routes: 'TMB, AV1',
      note: null,
      source: 'partners-page'
    });
  });

  it('rejects missing company, bad email or no routes without calling the network', async () => {
    const f = respond(201);
    expect((await submitPartnerLead({ company: ' ', email: 'a@b.co', routes: 'TMB' }, f)).ok).toBe(false);
    expect((await submitPartnerLead({ company: 'X', email: 'nope', routes: 'TMB' }, f)).ok).toBe(false);
    expect((await submitPartnerLead({ company: 'X', email: 'a@b.co', routes: '  ' }, f)).ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it('rejects over-long fields', async () => {
    const f = respond(201);
    expect((await submitPartnerLead({ company: 'x'.repeat(121), email: 'a@b.co', routes: 'TMB' }, f)).ok).toBe(false);
    expect((await submitPartnerLead({ company: 'X', email: 'a@b.co', routes: 'TMB', note: 'x'.repeat(1001) }, f)).ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it('surfaces server errors', async () => {
    expect((await submitPartnerLead({ company: 'X', email: 'a@b.co', routes: 'TMB' }, respond(500))).ok).toBe(false);
  });
});
