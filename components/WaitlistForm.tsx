'use client';

import { useState } from 'react';
import { joinWaitlist } from '@/lib/waitlist';
import { track } from '@/lib/track';
import Link from 'next/link';
import Honeypot from '@/components/Honeypot';

export default function WaitlistForm({
  routeId,
  source,
  title,
  blurb,
  cta = 'Notify me'
}: {
  routeId?: string;
  source: string;
  title: string;
  blurb: string;
  cta?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [trap, setTrap] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    if (trap) {
      setStatus('done');
      return;
    }
    const result = await joinWaitlist({ email, routeId, source });
    if (result.ok) {
      track('form_submit', `waitlist:${source}`);
      setStatus('done');
    } else {
      setStatus('idle');
      setError(result.error);
    }
  }

  return (
    <div className="bg-paper rounded-2xl shadow-card border border-forest/5 p-4">
      <p className="text-[14px] font-extrabold text-ink mb-1">{title}</p>
      <p className="text-[12.5px] text-inkSoft font-medium leading-relaxed mb-3">{blurb}</p>
      {status === 'done' ? (
        <p className="text-[13px] font-bold text-forest">You're on the list. We'll email you.</p>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2 relative">
          <Honeypot value={trap} onChange={setTrap} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 min-w-0 bg-offwhite rounded-full px-4 py-3 text-[13.5px] font-medium outline-none border border-forest/10"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-forest text-white font-bold text-[13.5px] rounded-full px-5 disabled:opacity-60"
          >
            {status === 'sending' ? '…' : cta}
          </button>
        </form>
      )}
      {error && <p className="text-[12px] font-semibold text-red-700 mt-2">{error}</p>}
      {status !== 'done' && (
        <p className="text-[10.5px] text-inkSoft font-medium mt-2">
          We only use your email for this. <Link href="/privacy" className="underline">Privacy</Link>
        </p>
      )}
    </div>
  );
}
