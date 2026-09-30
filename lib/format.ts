const nf = new Intl.NumberFormat('en-GB');

/** Locale-independent number formatting so server and client render the same text. */
export function formatNumber(n: number): string {
  return nf.format(n);
}
