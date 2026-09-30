#!/usr/bin/env bash
# PreToolUse hook (Bash, if "git commit *"): block the commit when the fast checks fail.
# Exit 2 = block, stderr is shown to Claude as the reason. Anything else lets the commit through.
input=$(cat 2> /dev/null || true)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2> /dev/null)
# Defensive: only gate real commits even if the hook's "if" filter is ignored by an older version.
case "$cmd" in *"git commit"*) ;; *) exit 0 ;; esac

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
if out=$(bash scripts/verify.sh --fast 2>&1); then
  exit 0
fi
{
  echo "Commit blocked: fast checks failed. Fix the code (do not weaken the check), then commit again."
  printf '%s\n' "$out" | head -n 40
} >&2
exit 2
