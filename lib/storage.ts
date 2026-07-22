'use client';

const FAVORITES_KEY = 'treksup:favorites';
const PACKING_KEY = 'treksup:packing';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleFavorite(routeId: string): string[] {
  const current = getFavorites();
  const next = current.includes(routeId)
    ? current.filter((id) => id !== routeId)
    : [...current, routeId];
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

export function getPackingState(routeId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const all = JSON.parse(window.localStorage.getItem(PACKING_KEY) || '{}');
    return all[routeId] || {};
  } catch {
    return {};
  }
}

export function setPackingItem(routeId: string, itemId: string, checked: boolean) {
  const all = JSON.parse(window.localStorage.getItem(PACKING_KEY) || '{}');
  all[routeId] = { ...(all[routeId] || {}), [itemId]: checked };
  window.localStorage.setItem(PACKING_KEY, JSON.stringify(all));
}
