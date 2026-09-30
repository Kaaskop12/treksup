import { describe, expect, it } from 'vitest';
import { buildEvent, createUtmMemory, parseUtm, referrerHost } from './track';

describe('parseUtm', () => {
  it('reads source and campaign', () => {
    expect(parseUtm('?utm_source=email&utm_campaign=operators-b')).toEqual({
      utm_source: 'email',
      utm_campaign: 'operators-b'
    });
  });
  it('returns nulls when absent and clips long values', () => {
    expect(parseUtm('')).toEqual({ utm_source: null, utm_campaign: null });
    expect(parseUtm('?utm_source=' + 'x'.repeat(100)).utm_source).toHaveLength(60);
  });
});

describe('referrerHost', () => {
  it('keeps external hosts only', () => {
    expect(referrerHost('https://www.google.com/search?q=x', 'treksup.com')).toBe('www.google.com');
    expect(referrerHost('https://treksup.com/route/x', 'treksup.com')).toBeNull();
    expect(referrerHost('', 'treksup.com')).toBeNull();
    expect(referrerHost('not a url', 'treksup.com')).toBeNull();
  });
});

describe('createUtmMemory', () => {
  it('keeps the campaign for later pages in the visit', () => {
    const utm = createUtmMemory();
    utm('?utm_source=email&utm_campaign=wave-b');
    expect(utm('')).toEqual({ utm_source: 'email', utm_campaign: 'wave-b' });
  });
  it('switches to a newer tagged link', () => {
    const utm = createUtmMemory();
    utm('?utm_source=email&utm_campaign=wave-a');
    expect(utm('?utm_source=newsletter')).toEqual({ utm_source: 'newsletter', utm_campaign: null });
  });
  it('starts empty', () => {
    expect(createUtmMemory()('')).toEqual({ utm_source: null, utm_campaign: null });
  });
});

describe('buildEvent', () => {
  it('builds a row that fits the events table', () => {
    const row = buildEvent('cta_click', 'buy:tmb-2027-plan', {
      path: '/route/tour-du-mont-blanc',
      search: '',
      referrer: 'https://mail.google.com/',
      host: 'treksup.com',
      utm: { utm_source: 'email', utm_campaign: null }
    });
    expect(row).toEqual({
      name: 'cta_click',
      path: '/route/tour-du-mont-blanc',
      label: 'buy:tmb-2027-plan',
      referrer_host: 'mail.google.com',
      utm_source: 'email',
      utm_campaign: null
    });
  });
});
