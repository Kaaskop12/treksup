#!/usr/bin/env bash
# PreToolUse hook (Bash): block `git commit` when the fast checks fail.
# Exit 2 = block, stderr is shown to Claude as the reason. Anything else lets the command through.
input=$(cat 2> /dev/null || true)
# Parse with node (always present in this repo) so a missing jq can't silently open the gate.
cmd=$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{try{process.stdout.write(String(JSON.parse(s).tool_input.command||""))}catch{process.stdout.write(s)}})' 2> /dev/null || printf '%s' "$input")

# Any git commit, including `git -C <dir> commit` and commits chained after other commands.
if ! grep -qE '(^|[;&|[:space:]])git([[:space:]]+-[cC][[:space:]]+[^[:space:]]+)*[[:space:]]+commit([[:space:]]|$)' <<< "$cmd"; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
if out=$(bash scripts/verify.sh --fast 2>&1); then
  exit 0
fi
{
  echo "Commit blocked: fast checks failed. Fix the code (do not weaken the check), then commit again."
  printf '%s\n' "$out" | head -n 40
} >&2
exit 2
