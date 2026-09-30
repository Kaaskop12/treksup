-- Email waitlist. Anyone (anon) may INSERT; nobody may read via the API.
-- Read the list from the Supabase dashboard / service role only.
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  route_id text,
  source text not null default 'web',
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (
    char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  constraint waitlist_route_id_len check (route_id is null or char_length(route_id) <= 80),
  constraint waitlist_source_len check (char_length(source) <= 40)
);

-- One signup per email per route (route_id null = general list).
create unique index waitlist_email_route_key
  on public.waitlist (lower(email), coalesce(route_id, ''));

alter table public.waitlist enable row level security;

create policy "anyone can join the waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (char_length(email) <= 254);
