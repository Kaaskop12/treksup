-- Shared state for Claude sessions (cloud, local, autopilot): one task queue with atomic claims,
-- one append-only log, and a single list of what is waiting on the owner.
-- Private: not exposed through the API (schema not in PostgREST's exposed list, and anon/authenticated
-- have no privileges). Read and write it through the Supabase MCP connector only.
-- Data is inserted through MCP, never committed: this repo is public.

create schema if not exists ops;
revoke all on schema ops from public;
revoke all on schema ops from anon, authenticated;

create table ops.tasks (
  id bigint generated always as identity primary key,
  title text not null unique check (char_length(title) between 3 and 200),
  -- For owner = 'owner': WHAT / WHY / EXACTLY (clicks or commands) / UNBLOCKS.
  detail text not null default '' check (char_length(detail) <= 4000),
  -- Revenue ladder from CLAUDE.md: 1 path to payment ... 9 everything else.
  tier smallint not null check (tier between 1 and 9),
  -- Within a tier: P(success) x revenue impact / effort, plus a bonus for unblocking others. Higher first.
  score numeric(6, 2) not null default 0,
  owner text not null default 'claude' check (owner in ('claude', 'owner')),
  status text not null default 'todo' check (status in ('todo', 'doing', 'blocked', 'done', 'dropped')),
  claimed_by text,
  -- When another task must finish first; ops.next_up releases this task once that one is done.
  blocked_by bigint references ops.tasks (id),
  blocked_on text,
  done_criteria text not null default '',
  evidence text,
  source text,
  -- Re-check date for blocked items and experiments; ops.stale lists it once passed.
  review_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_doing_needs_claim check (status <> 'doing' or claimed_by is not null),
  constraint tasks_done_needs_evidence check (status <> 'done' or coalesce(evidence, '') <> ''),
  constraint tasks_blocked_needs_reason check (status <> 'blocked' or coalesce(blocked_on, '') <> '' or blocked_by is not null)
);

create table ops.log (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('DECISION', 'EXPERIMENT', 'METRIC', 'LESSON', 'BLOCKER', 'HANDOFF', 'AUDIT')),
  title text not null check (char_length(title) between 3 and 200),
  body text not null default '' check (char_length(body) <= 8000),
  task_id bigint references ops.tasks (id),
  -- CLAUDE_CODE_REMOTE_SESSION_ID for cloud sessions, 'local:<session id>' otherwise.
  session text,
  -- METRIC values ('not_checked' when a source was unavailable), EXPERIMENT hypothesis/threshold/kill,
  -- AUDIT scores. Aggregates only, never personal data.
  data jsonb,
  -- Local sessions copy DECISION/LESSON rows into the Obsidian vault and set this to true.
  vault_synced boolean not null default false,
  created_at timestamptz not null default now()
);

create index tasks_queue_idx on ops.tasks (owner, status, tier, score desc);
create index log_created_idx on ops.log (created_at desc);

alter table ops.tasks enable row level security;
alter table ops.log enable row level security;
revoke all on all tables in schema ops from public, anon, authenticated;
revoke all on all sequences in schema ops from public, anon, authenticated;

create function ops.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function ops.touch_updated_at() from public, anon, authenticated;

create trigger tasks_touch_updated_at
  before update on ops.tasks
  for each row execute function ops.touch_updated_at();

-- What Claude should pick next: open tasks, plus blocked tasks whose blocking task is done.
create view ops.next_up with (security_invoker = true) as
  select t.id, t.tier, t.score, t.title, t.done_criteria, t.status, t.source
  from ops.tasks t
  where t.owner = 'claude'
    and (t.status = 'todo'
         or (t.status = 'blocked' and t.blocked_by is not null
             and exists (select 1 from ops.tasks b where b.id = t.blocked_by and b.status = 'done')))
  order by t.tier, t.score desc, t.id;

-- The one list of things only the owner can do.
create view ops.waiting_on_owner with (security_invoker = true) as
  select id, tier, title, detail, status, blocked_on, created_at
  from ops.tasks
  where owner = 'owner' and status in ('todo', 'doing', 'blocked')
  order by tier, score desc, id;

-- Claims nobody finished, re-checks that are due, and blocked tasks nobody will ever look at again.
create view ops.stale with (security_invoker = true) as
  select id, 'claim older than 24h'::text as reason, title, claimed_by as detail, updated_at as since
  from ops.tasks
  where status = 'doing' and updated_at < now() - interval '24 hours'
  union all
  select id, 'due for re-check'::text, title, coalesce(blocked_on, ''), review_at
  from ops.tasks
  where status in ('todo', 'doing', 'blocked') and review_at is not null and review_at < now()
  union all
  select id, 'blocked with no re-check date'::text, title, coalesce(blocked_on, ''), updated_at
  from ops.tasks
  where status = 'blocked' and review_at is null and blocked_by is null;

revoke all on ops.next_up, ops.waiting_on_owner, ops.stale from public, anon, authenticated;
