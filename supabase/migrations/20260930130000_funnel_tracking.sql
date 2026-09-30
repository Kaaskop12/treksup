-- Partner leads (tour operators) + anonymous funnel events. Anon may INSERT only.

create table public.partner_leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  email text not null,
  routes text,
  note text,
  source text not null default 'partners-page',
  created_at timestamptz not null default now(),
  constraint partner_leads_company_len check (char_length(company) between 1 and 120),
  constraint partner_leads_email_format check (
    char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  constraint partner_leads_routes_len check (routes is null or char_length(routes) <= 300),
  constraint partner_leads_note_len check (note is null or char_length(note) <= 1000),
  constraint partner_leads_source_len check (char_length(source) <= 40)
);
alter table public.partner_leads enable row level security;
create policy "anyone can request a partner sample"
  on public.partner_leads for insert to anon, authenticated
  with check (char_length(company) <= 120);

-- No user id, no cookies: just counts per page/label/campaign.
create table public.events (
  id bigint generated always as identity primary key,
  name text not null,
  path text,
  label text,
  referrer_host text,
  utm_source text,
  utm_campaign text,
  created_at timestamptz not null default now(),
  constraint events_name check (name in ('page_view', 'cta_click', 'form_submit')),
  constraint events_path_len check (path is null or char_length(path) <= 200),
  constraint events_label_len check (label is null or char_length(label) <= 80),
  constraint events_ref_len check (referrer_host is null or char_length(referrer_host) <= 100),
  constraint events_utm_source_len check (utm_source is null or char_length(utm_source) <= 60),
  constraint events_utm_campaign_len check (utm_campaign is null or char_length(utm_campaign) <= 80)
);
alter table public.events enable row level security;
create policy "anyone can log an event"
  on public.events for insert to anon, authenticated
  with check (name in ('page_view', 'cta_click', 'form_submit'));
create index events_created_idx on public.events (created_at);

-- Read from the dashboard / service role only.
create view public.funnel_daily with (security_invoker = true) as
  select date_trunc('day', created_at)::date as day,
         name, path, label, coalesce(utm_campaign, '-') as campaign,
         count(*) as n
  from public.events
  group by 1, 2, 3, 4, 5;
revoke all on public.funnel_daily from anon, authenticated;

-- Private outreach tracker (no policies => API cannot read or write it).
create table public.partner_prospects (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  organisation text,
  kind text not null default 'operator',
  wave text,
  contacted_on date,
  status text not null default 'sent',
  note text,
  updated_at timestamptz not null default now(),
  constraint partner_prospects_status check (
    status in ('sent', 'auto_reply', 'bounced', 'declined', 'replied', 'sample_sent', 'won', 'lost')
  )
);
alter table public.partner_prospects enable row level security;
