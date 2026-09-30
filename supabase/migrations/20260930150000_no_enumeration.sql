-- A unique index made duplicate signups return 409 instead of 201, which let anyone test
-- whether an address is on the list. Allow duplicates; count distinct emails when reading.
drop index if exists public.waitlist_email_route_key;

-- Public roles keep INSERT only on the capture tables.
revoke truncate, trigger, references on public.events, public.partner_leads, public.waitlist from anon, authenticated;
