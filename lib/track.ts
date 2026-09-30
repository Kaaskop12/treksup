import { insertRow } from './supabase-rest';

export type EventName = 'page_view' | 'cta_click' | 'form_submit';

type Utm = { utm_source: string | null; utm_campaign: string | null };

const clip = (v: string | null | undefined, max: number) => (v ? v.slice(0, max) : null);

/** Pull utm_source / utm_campaign out of a query string. */
export function parseUtm(search: string): Utm {
  const q = new URLSearchParams(search);
  return { utm_source: clip(q.get('utm_source'), 60), utm_campaign: clip(q.get('utm_campaign'), 80) };
}

/** Hostname of an external referrer, or null for same-site / missing / invalid. */
export function referrerHost(referrer: string, ownHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    return host && host !== ownHost ? clip(host, 100) : null;
  } catch {
    return null;
  }
}

/**
 * Campaign tags for this visit, kept in memory only (nothing stored on the device).
 * The latest URL that carries UTM tags wins; pages without tags keep the last known ones.
 * Survives client-side navigation, resets on a full reload.
 */
export function createUtmMemory() {
  let current: Utm = { utm_source: null, utm_campaign: null };
  return (search: string): Utm => {
    const fresh = parseUtm(search);
    if (fresh.utm_source || fresh.utm_campaign) current = fresh;
    return current;
  };
}

const utmForVisit = createUtmMemory();

export function buildEvent(
  name: EventName,
  label: string | undefined,
  ctx: { path: string; search: string; referrer: string; host: string; utm: Utm }
) {
  return {
    name,
    path: clip(ctx.path, 200),
    label: clip(label, 80),
    referrer_host: referrerHost(ctx.referrer, ctx.host),
    utm_source: ctx.utm.utm_source,
    utm_campaign: ctx.utm.utm_campaign
  };
}

/** Fire-and-forget anonymous funnel event. No cookies, no device storage, no user id. */
export function track(name: EventName, label?: string): void {
  if (typeof window === 'undefined') return;
  const utm = utmForVisit(window.location.search);
  const row = buildEvent(name, label, {
    path: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    host: window.location.hostname,
    utm
  });
  void insertRow('events', row, fetch, { keepalive: true });
}
