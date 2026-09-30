import { describe, expect, it } from 'vitest';
import { scanSource } from './check-credibility.mjs';

const rules = (src: string) => scanSource(src).map((f: { rule: string }) => f.rule);

describe('credibility check', () => {
  it('flags hard-coded social proof', () => {
    expect(rules('    rating: 4.9,')).toContain('hardcoded-rating');
    expect(rules('    reviewCount: 2140,')).toContain('hardcoded-review-count');
    expect(rules("    reviews: [\n      { name: 'Marta H.' }")).toContain('hardcoded-reviews');
    expect(rules('<span>★★★★★</span>')).toContain('star-string');
    expect(rules('Join 2,140 hikers today')).toContain('invented-count');
    expect(rules('10k+ users love it')).toContain('invented-count');
    expect(rules('500+ walkers')).toContain('invented-count');
    expect(rules('Loved by 2,140 happy hikers')).toContain('invented-count');
  });

  it('flags JSX and camelCase variants of fake ratings', () => {
    expect(rules('<Stars rating={4.9} />')).toContain('hardcoded-rating');
    expect(rules("  avgRating: '4.8',")).toContain('hardcoded-rating');
    expect(rules("  'reviewCount': 3860,")).toContain('hardcoded-review-count');
    expect(rules("{'★'.repeat(5)}")).toContain('star-string');
    expect(rules("const testimonials = [\n  { name: 'A.' }\n]")).toContain('hardcoded-reviews');
  });

  it('checks published copy (markdown) too, without the button rule', () => {
    const md = (src: string) => scanSource(src, { markdown: true }).map((f: { rule: string }) => f.rule);
    expect(md('Join 5,000 trekkers who planned with us')).toContain('invented-count');
    expect(md('<button>Buy</button>')).toEqual([]);
    expect(md('About 80,000 hikers walk it each year <!-- credibility-ok: euronews.com 2026-08-15 -->')).toEqual([]);
  });

  it('flags AI capability claims', () => {
    expect(rules("{open ? 'Tap to close' : \"Trained on this route's terrain\"}")).toContain('ai-capability-claim');
  });

  it('flags buttons that do nothing, but not real ones', () => {
    expect(rules('<button className="x">\n  Start planning\n</button>')).toContain('dead-button');
    expect(rules('<button onClick={() => go()} className="x">Go</button>')).toEqual([]);
    expect(rules('<button type="submit">Join</button>')).toEqual([]);
    expect(rules('<button disabled className="x">Soon</button>')).toEqual([]);
  });

  it('allows sourced data with an explicit credibility-ok comment', () => {
    expect(rules('    rating: 4.6, // credibility-ok: avg of 12 real reviews in public.posts')).toEqual([]);
    expect(rules('// credibility-ok: https://example.org/stats\nJoin 300 hikers')).toEqual([]);
    expect(rules('// credibility-ok:\nJoin 300 hikers')).toContain('invented-count'); // empty reason does not count
  });

  it('ignores ordinary data fields', () => {
    expect(rules("  difficulty: 'Hard',\n  distanceKm: 62,\n  ascentM: 3240,")).toEqual([]);
    expect(rules('rating IS NULL OR rating >= 1')).toEqual([]);
    expect(rules('TMB 2027 bookings open on 15 October')).toEqual([]);
    expect(rules('rating: number;')).toEqual([]);
  });
});
