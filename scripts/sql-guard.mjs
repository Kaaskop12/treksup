#!/usr/bin/env node
// PreToolUse hook for the Supabase execute_sql tool. Reads, and writes inside schema `ops`, pass silently.
// Anything that writes or changes structure elsewhere (the live app's tables) needs the owner's approval:
// we answer "ask", which prompts in an interactive session and blocks in an unattended one.
import { fileURLToPath } from 'node:url';

const WRITE_TARGET =
  /\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?|merge\s+into|alter\s+(?:table|view|function|schema|type|policy|index|sequence)|drop\s+(?:table|view|function|schema|type|policy|index|sequence|trigger|extension)(?:\s+if\s+exists)?|create\s+(?:or\s+replace\s+)?(?:unique\s+)?(?:table|view|function|schema|type|policy|index|sequence|trigger|extension)(?:\s+if\s+not\s+exists)?)\s+(?:only\s+)?("?[\w$]+"?(?:\s*\.\s*"?[\w$]+"?)?)/gi;
const ALWAYS_ASK = /\b(grant|revoke|copy|call|vacuum|reindex|cluster|security\s+definer|set\s+role|reset\s+role|alter\s+role|create\s+role|drop\s+role)\b|\b(do)\s+\$/i;

/** Returns null when the SQL is fine to run unattended, or a reason string when the owner must approve. */
export function review(sql) {
  const clean = String(sql || '')
    .replace(/--[^\n]*/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/'(?:[^']|'')*'/g, "''");
  const always = clean.match(ALWAYS_ASK);
  if (always) return `uses "${always[1] || always[2]}"`;
  const outside = [];
  for (const m of clean.matchAll(WRITE_TARGET)) {
    const target = m[1].replace(/"/g, '').replace(/\s+/g, '').toLowerCase();
    // `create schema ops` / `drop schema ops` target the schema name itself.
    if (target === 'ops' || target.startsWith('ops.')) continue;
    outside.push(target);
  }
  return outside.length ? `writes outside schema ops: ${[...new Set(outside)].join(', ')}` : null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let input = '';
  process.stdin.on('data', (c) => (input += c));
  process.stdin.on('end', () => {
    let query = '';
    try {
      query = JSON.parse(input || '{}')?.tool_input?.query ?? '';
    } catch {
      query = input; // unparseable input: review the raw text rather than letting it through
    }
    const reason = review(query);
    if (!reason) process.exit(0);
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason: `SQL ${reason}. This is the live app's database: the owner must approve (CLAUDE.md > hard stops).`
        }
      })
    );
    process.exit(0);
  });
}
