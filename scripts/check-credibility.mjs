#!/usr/bin/env node
// Fails when user-facing code ships claims we can't back up: hard-coded ratings, reviews,
// review/user counts, AI capability claims, or buttons that do nothing.
// Real, sourced data is allowed: put `credibility-ok: <source URL or reason>` in a comment
// on the same line or the line above.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULES = [
  { id: 'hardcoded-rating', re: /\brating\s*:\s*\d/, why: 'hard-coded rating; ratings must come from real reviews' },
  { id: 'hardcoded-review-count', re: /\breviewCount\s*:\s*\d/, why: 'hard-coded review count' },
  { id: 'hardcoded-reviews', re: /\breviews\s*:\s*\[\s*\{/g, multiline: true, why: 'hard-coded review list; reviews must come from real users' },
  { id: 'star-string', re: /★★★★★/, why: 'hard-coded five-star display' },
  { id: 'invented-count', re: /\b\d[\d,.]*\+?\s*(hikers|walkers|users|customers|downloads|members)\b/i, why: 'user/customer count without a source' },
  { id: 'ai-capability-claim', re: /\btrained on\b/i, why: 'claims AI training the product does not have' }
];

const SUPPRESS = /credibility-ok:\s*\S/;

/** Returns [{ line, rule, why, text }] for one file's source text. */
export function scanSource(text) {
  const lines = text.split('\n');
  const suppressed = (lineNo) => SUPPRESS.test(lines[lineNo - 1]) || (lineNo > 1 && SUPPRESS.test(lines[lineNo - 2]));
  const lineOf = (index) => text.slice(0, index).split('\n').length;
  const findings = [];
  lines.forEach((line, i) => {
    if (suppressed(i + 1)) return;
    for (const rule of RULES) {
      if (!rule.multiline && rule.re.test(line)) findings.push({ line: i + 1, rule: rule.id, why: rule.why, text: line.trim() });
    }
  });
  for (const rule of RULES.filter((r) => r.multiline)) {
    for (const m of text.matchAll(rule.re)) {
      const lineNo = lineOf(m.index);
      if (!suppressed(lineNo)) findings.push({ line: lineNo, rule: rule.id, why: rule.why, text: lines[lineNo - 1].trim() });
    }
  }
  // A <button> with no onClick, no type="submit" and not disabled does nothing when tapped.
  for (const m of text.matchAll(/<button\b([^>]*)>/g)) {
    if (/onClick|type=["']submit["']|disabled/.test(m[1])) continue;
    const lineNo = lineOf(m.index);
    if (!suppressed(lineNo)) findings.push({ line: lineNo, rule: 'dead-button', why: 'button has no action (placeholder CTA)', text: lines[lineNo - 1].trim() });
  }
  return findings;
}

const SCAN_DIRS = ['app', 'components', 'lib'];
const EXT = /\.(ts|tsx|js|jsx)$/;
const SKIP = /\.(test|spec)\.[jt]sx?$/;

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name) && !SKIP.test(name)) out.push(p);
  }
  return out;
}

export function scanRepo(root) {
  const files = SCAN_DIRS.flatMap((d) => {
    try {
      return walk(join(root, d), []);
    } catch {
      return [];
    }
  });
  const findings = files.flatMap((f) =>
    scanSource(readFileSync(f, 'utf8')).map((x) => ({ file: relative(root, f), ...x }))
  );
  return { files: files.length, findings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
  const { files, findings } = scanRepo(root);
  for (const f of findings) console.log(`ERROR credibility ${f.file}:${f.line} [${f.rule}] ${f.why} :: ${f.text.slice(0, 120)}`);
  if (findings.length) {
    console.log(`FAIL credibility: ${findings.length} finding(s) in ${files} files`);
    process.exit(1);
  }
  console.log(`PASS credibility (${files} files)`);
}
