#!/usr/bin/env bash
# SessionStart hook (startup | resume | compact). Plain stdout is added to Claude's context, so keep it short.
# In cloud sessions it also installs dependencies once; install output goes to stderr only.
input=$(cat 2> /dev/null || true)
src=$(printf '%s' "$input" | jq -r '.source // "startup"' 2> /dev/null || echo startup)
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] && [ "$src" != "compact" ] && [ ! -d node_modules ]; then
  { npm ci --no-audit --no-fund || npm install --no-audit --no-fund; } 1>&2 2>&1 || echo "WARN npm install failed; run it manually" >&2
fi

# Claim identity for ops.tasks.claimed_by: unique per session, printed again after every compaction.
sid=$(printf '%s' "$input" | jq -r '.session_id // empty' 2> /dev/null)
me=${CLAUDE_CODE_REMOTE_SESSION_ID:-local:${sid:-unknown}}

echo "== Treksup session context (source: $src) =="
echo "ME=$me   (use this as claimed_by / session in ops rows; subagents never claim tasks)"
echo "Branch: $(git branch --show-current 2> /dev/null)"
echo "Recent commits:"
git log --oneline -5 2> /dev/null | sed 's/^/  /'
changes=$(git status --short 2> /dev/null | head -n 10)
[ -n "$changes" ] && { echo "Uncommitted:"; printf '%s\n' "$changes" | sed 's/^/  /'; }
echo "Next step: run /ops-loop. Step 1 reads ops.next_up, ops.stale and your own 'doing' claims from Supabase (schema ops)."
echo "Before anything goes online (push to shared branches, DB writes, routines, publishing, email): check for overlapping sessions first (CLAUDE.md > Coordination)."
exit 0
