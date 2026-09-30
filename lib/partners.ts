import { insertRow, type InsertResult } from './supabase-rest';
import { isValidEmail, normalizeEmail } from './waitlist';

export type PartnerLeadInput = {
  company: string;
  email: string;
  routes?: string;
  note?: string;
  source?: string;
};

/** Validate and store a tour-operator request in `partner_leads`. */
export async function submitPartnerLead(
  input: PartnerLeadInput,
  fetchImpl: typeof fetch = fetch
): Promise<InsertResult> {
  const company = input.company.trim();
  if (!company) return { ok: false, error: 'Enter your company name.' };
  if (company.length > 120) return { ok: false, error: 'Company name is too long.' };
  if (!isValidEmail(input.email)) return { ok: false, error: 'Enter a valid email address.' };
  const routes = input.routes?.trim() || null;
  if (!routes) return { ok: false, error: 'Tell us which routes you run.' };
  const note = input.note?.trim() || null;
  if (routes && routes.length > 300) return { ok: false, error: 'Route list is too long.' };
  if (note && note.length > 1000) return { ok: false, error: 'Message is too long.' };

  return insertRow(
    'partner_leads',
    { company, email: normalizeEmail(input.email), routes, note, source: input.source ?? 'partners-page' },
    fetchImpl
  );
}
