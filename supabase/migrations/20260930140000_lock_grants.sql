-- Belt and braces on top of RLS: public roles can only INSERT into the capture tables
-- and cannot touch the private outreach tracker at all.
revoke all on public.partner_prospects from anon, authenticated;
revoke select, update, delete on public.events, public.partner_leads, public.waitlist from anon, authenticated;
