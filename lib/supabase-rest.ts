export type InsertResult = { ok: true } | { ok: false; error: string };

/**
 * Insert one row into a Supabase table via the REST API with the public key.
 * RLS on every table we write to allows INSERT only.
 * A unique-constraint conflict (HTTP 409) counts as success.
 */
export async function insertRow(
  table: string,
  row: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
  opts: { keepalive?: boolean } = {}
): Promise<InsertResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, error: 'This form is not available right now. Please try again later.' };

  try {
    const res = await fetchImpl(`${url}/rest/v1/${table}`, {
      method: 'POST',
      keepalive: opts.keepalive,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    });
    if (res.ok || res.status === 409) return { ok: true };
    return { ok: false, error: 'Something went wrong. Try again in a minute.' };
  } catch {
    return { ok: false, error: 'No connection. Try again.' };
  }
}
