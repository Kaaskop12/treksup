'use client';

import { useState } from 'react';
import type { RouteGuide } from '@/lib/routes';
import { paylinkFor } from '@/lib/paylinks';
import { track } from '@/lib/track';
import WaitlistForm from '@/components/WaitlistForm';

export default function GuideOffer({ guide }: { guide: RouteGuide }) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const paylink = paylinkFor(guide.id);

  function onBuy() {
    track('cta_click', `buy:${guide.id}`);
    if (paylink) {
      window.location.href = paylink;
    } else {
      setShowWaitlist(true);
    }
  }

  return (
    <div className="bg-paper rounded-xl2 shadow-card border border-forest/10 p-4">
      {!paylink && (
        <span className="inline-block text-[10.5px] font-bold uppercase tracking-wide text-alpine bg-alpine/10 px-2 py-0.5 rounded-md mb-2">
          Launching soon
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <p className="text-[15px] font-extrabold text-ink">{guide.name}</p>
        <p className="text-[15px] font-extrabold text-forest">€{guide.priceEur}</p>
      </div>
      <ul className="mb-4 flex flex-col gap-1.5">
        {guide.bullets.map((b) => (
          <li key={b} className="text-[12.5px] text-inkSoft font-medium leading-snug flex gap-2">
            <span className="text-forest">✓</span>
            {b}
          </li>
        ))}
      </ul>
      {showWaitlist ? (
        <WaitlistForm
          routeId={guide.id}
          source={`guide:${guide.id}`}
          title="Checkout opens soon"
          blurb="We're finishing the 2027 plan. Leave your email and we'll send you the checkout link first. Nothing is charged now."
          cta="Send me the link"
        />
      ) : (
        <button onClick={onBuy} className="w-full bg-forest text-white font-bold text-[14.5px] rounded-full py-3.5">
          {paylink ? `Get the plan · €${guide.priceEur}` : `I want this · €${guide.priceEur}`}
        </button>
      )}
      <p className="text-[11px] text-inkSoft font-medium mt-2 text-center">
        {paylink
          ? 'Digital download, one-time payment. Sold by Treksup, Belgium (BE 1029.205.038).'
          : 'Launching soon. Nothing is charged now; we’ll email you the checkout link.'}
      </p>
    </div>
  );
}
