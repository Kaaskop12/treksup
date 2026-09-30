'use client';

import { useState } from 'react';
import { submitPartnerLead } from '@/lib/partners';
import { track } from '@/lib/track';
import Link from 'next/link';
import Honeypot from '@/components/Honeypot';

export default function PartnerForm() {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [routes, setRoutes] = useState('');
  const [note, setNote] = useState('');
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
    const r = await submitPartnerLead({ company, email, routes, note });
    if (r.ok) {
      track('form_submit', 'partner-lead');
      setStatus('done');
    } else {
      setStatus('idle');
      setError(r.error);
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-paper rounded-xl2 shadow-card border border-forest/10 p-5">
        <p className="text-[15px] font-extrabold text-forest mb-1">Thanks, we have it.</p>
        <p className="text-[13px] text-inkSoft font-medium leading-relaxed">
          We&apos;ll send next Friday&apos;s page for your routes to {email.trim()}, free and with no obligation.
        </p>
      </div>
    );
  }

  const input =
    'w-full bg-offwhite rounded-2xl px-4 py-3 text-[13.5px] font-medium outline-none border border-forest/10';

  return (
    <form onSubmit={onSubmit} className="bg-paper rounded-xl2 shadow-card border border-forest/10 p-5 flex flex-col gap-3 relative">
      <Honeypot value={trap} onChange={setTrap} />
      <p className="text-[15px] font-extrabold text-ink">Get a free sample page</p>
      <input className={input} required maxLength={120} placeholder="Company" aria-label="Company"
        value={company} onChange={(e) => setCompany(e.target.value)} />
      <input className={input} required type="email" maxLength={254} placeholder="Work email" aria-label="Work email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={input} required maxLength={300} placeholder="Routes you run in 2027 (e.g. TMB, Alta Via 1)"
        aria-label="Routes you run in 2027" value={routes} onChange={(e) => setRoutes(e.target.value)} />
      <textarea className={`${input} min-h-[80px]`} maxLength={1000} placeholder="Anything we should know (optional)"
        aria-label="Message" value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="submit" disabled={status === 'sending'}
        className="bg-forest text-white font-bold text-[14.5px] rounded-full py-3.5 disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send me next Friday’s page'}
      </button>
      {error && <p className="text-[12px] font-semibold text-red-700">{error}</p>}
      <p className="text-[10.5px] text-inkSoft font-medium">
        We only use this to reply about the offer. <Link href="/privacy" className="underline">Privacy</Link>
      </p>
    </form>
  );
}
