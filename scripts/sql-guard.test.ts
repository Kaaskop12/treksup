import { describe, expect, it } from 'vitest';
import { review } from './sql-guard.mjs';

describe('sql guard', () => {
  it('lets reads through', () => {
    expect(review('select count(*) from public.waitlist')).toBeNull();
    expect(review("select * from ops.next_up; select status, count(*) from public.partner_prospects group by status")).toBeNull();
    expect(review('with x as (select 1) select * from x')).toBeNull();
  });

  it('lets writes inside schema ops through', () => {
    expect(review("update ops.tasks set status = 'doing', claimed_by = 'me' where id = 3 and status = 'todo' returning id")).toBeNull();
    expect(review("insert into ops.log (kind, title) values ('HANDOFF', 'x')")).toBeNull();
    expect(review('create schema if not exists ops; create table ops.tasks (id bigint)')).toBeNull();
    expect(review('insert into "ops"."log" (kind, title) values (1, 2)')).toBeNull();
  });

  it('asks before writing to the app tables', () => {
    expect(review('delete from public.profiles')).toMatch(/public\.profiles/);
    expect(review("update partner_prospects set status = 'won'")).toMatch(/partner_prospects/);
    expect(review('truncate table public.events')).toMatch(/public\.events/);
    expect(review('drop table if exists public.waitlist')).toMatch(/public\.waitlist/);
    expect(review('alter table public.posts add column x int')).toMatch(/public\.posts/);
    expect(review("with t as (select 1) insert into public.waitlist(email) values ('a@b.co')")).toMatch(/public\.waitlist/);
  });

  it('asks for privilege and role changes even inside ops', () => {
    expect(review('grant select on ops.tasks to anon')).toMatch(/grant/);
    expect(review('revoke execute on function public.is_admin() from anon')).toMatch(/revoke/);
    expect(review('do $$ begin perform 1; end $$')).toMatch(/do/);
  });

  it('is not fooled by keywords inside strings or comments', () => {
    expect(review("insert into ops.log (kind, title, body) values ('LESSON', 'x', 'we ran delete from public.profiles by mistake')")).toBeNull();
    expect(review('select 1 -- drop table public.posts')).toBeNull();
    expect(review("insert into ops.log(kind,title) values ('HANDOFF','x'); delete from public.events")).toMatch(/public\.events/);
  });
});
