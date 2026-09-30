#!/usr/bin/env bash
# The one check that says "this works". Prints one PASS/ERROR line per check; full output in .logs/.
#   bash scripts/verify.sh          typecheck, unit tests, credibility, integrity, build, HTTP smoke test
#   bash scripts/verify.sh --fast   typecheck, unit tests, credibility, integrity (used by the commit gate)
# Exit 0 only if every check passed. Never edit a check to make it pass; fix the code or say why the check is wrong.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
mkdir -p .logs
fail=0

run() {
  local name=$1; shift
  if "$@" > ".logs/$name.log" 2>&1; then
    echo "PASS $name"
  else
    echo "ERROR $name (full log: .logs/$name.log)"
    tail -n 20 ".logs/$name.log" | sed 's/^/    /'
    fail=1
  fi
}

# Catches the usual ways to get green without working code.
integrity() {
  local bad=0
  if grep -rnE '\b(it|test|describe)\.(only|skip)\(|test\.fixme' --include='*.test.*' --include='*.spec.*' app components lib scripts 2> /dev/null; then
    echo "focused/skipped tests found"; bad=1
  fi
  if grep -nE 'ignoreBuildErrors|ignoreDuringBuilds' next.config.* 2> /dev/null; then echo "build checks disabled in next.config"; bad=1; fi
  if ! grep -qE '"strict":\s*true' tsconfig.json; then echo "tsconfig strict mode is off"; bad=1; fi
  [ "$bad" = 0 ]
}

smoke() {
  local port=3107 pid ok=1
  # A leftover server on this port would be testing an old build: refuse instead of passing falsely.
  if curl -s -o /dev/null "http://localhost:$port/"; then echo "port $port already in use (stale server?)"; return 1; fi
  # Own process group, so the cleanup below also kills the next-server child that npx spawns.
  setsid npx next start -p "$port" > .logs/smoke-server.log 2>&1 &
  pid=$!
  for _ in $(seq 1 30); do curl -sf "http://localhost:$port/" > /dev/null && break; sleep 1; done
  # path | text that must appear in the server-rendered HTML
  while IFS='|' read -r path expect; do
    body=$(curl -s "http://localhost:$port$path")
    if grep -qF "$expect" <<< "$body"; then echo "  ok $path"; else echo "  missing '$expect' on $path"; ok=0; fi
  done <<'EOF'
/|Where to next?
/route/alta-via-1|Alta Via 1
/route/tour-du-mont-blanc|Tour du Mont Blanc
/trips|Your trips
/profile|Profile
/route/does-not-exist|Route not found
EOF
  kill -- "-$pid" 2> /dev/null; wait "$pid" 2> /dev/null
  [ "$ok" = 1 ]
}

run typecheck npx tsc --noEmit
run unit npx vitest run
run credibility node scripts/check-credibility.mjs
run integrity integrity
if [ "${1:-}" != "--fast" ]; then
  run build npx next build
  if [ "$fail" = 0 ]; then run smoke smoke; else echo "SKIP smoke (earlier check failed)"; fi
fi
exit "$fail"
