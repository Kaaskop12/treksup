'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getRoute } from '@/lib/routes';
import { getFavorites, toggleFavorite } from '@/lib/storage';
import ElevationChart from '@/components/ElevationChart';
import PackingList from '@/components/PackingList';
import AIAssistant from '@/components/AIAssistant';

export default function RouteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const route = getRoute(params.id);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (route) setIsFavorite(getFavorites().includes(route.id));
  }, [route]);

  if (!route) {
    return <div className="p-8 text-center text-inkSoft">Route not found.</div>;
  }

  function onFavorite() {
    const next = toggleFavorite(route.id);
    setIsFavorite(next.includes(route.id));
  }

  return (
    <div>
      <div className="relative h-[420px]">
        <Image src={route.hero} alt={route.name} fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,20,14,0.05) 0%, rgba(10,20,14,0.15) 45%, rgba(8,16,11,0.86) 100%)' }}
        />
        <div className="absolute top-14 left-5 right-5 flex justify-between">
          <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E3A2B" strokeWidth="2.2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button onClick={onFavorite} className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? '#F4C56A' : 'none'} stroke={isFavorite ? '#F4C56A' : '#1E3A2B'} strokeWidth="2.2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FD9B0]" /> {route.eyebrow}
          </span>
          <h1 className="text-[30px] font-extrabold leading-tight mb-1">{route.name}</h1>
          <p className="text-[14px] font-medium opacity-90">
            {route.country} · <span className="text-[#F4C56A]">★★★★★</span> {route.rating} · {route.reviewCount.toLocaleString()} hikers
          </p>
        </div>
      </div>

      <div className="relative -mt-8 bg-offwhite rounded-t-[28px] px-5 pt-6 pb-4">
        <div className="w-10 h-1.5 bg-forest/15 rounded-full mx-auto mb-5" />

        <div className="grid grid-cols-4 glass rounded-xl2 shadow-card py-4 mb-6">
          {[
            { label: 'Distance', value: `${route.distanceKm} km` },
            { label: 'Ascent', value: `${route.ascentM.toLocaleString()} m` },
            { label: 'Difficulty', value: route.difficulty },
            { label: 'Duration', value: `${route.days} ${route.days === 1 ? 'day' : 'days'}` }
          ].map((s, i) => (
            <div key={s.label} className={`text-center ${i < 3 ? 'border-r border-forest/10' : ''}`}>
              <p className="text-[16px] font-bold text-forest">{s.value}</p>
              <p className="text-[10px] text-inkSoft font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-7">
          <button className="flex-[1.4] bg-forest text-white font-bold text-[15px] rounded-full py-4">
            Start planning
          </button>
          <button className="flex-1 glass text-forest font-bold text-[14px] rounded-full py-4">
            Download GPX
          </button>
        </div>

        <Section title="Elevation profile">
          <ElevationChart ascentM={route.ascentM} descentM={route.descentM} />
        </Section>

        {route.huts.length > 0 && (
          <Section title="Accommodation">
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {route.huts.map((hut) => (
                <div key={hut.name} className="flex-shrink-0 w-[180px] bg-paper rounded-xl2 shadow-card overflow-hidden border border-forest/5">
                  <div className="relative h-[100px]">
                    <Image src={hut.image} alt={hut.name} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-[13.5px] font-bold text-ink">{hut.name}</p>
                    <p className="text-[11.5px] text-inkSoft font-medium">Night {hut.night}</p>
                    <p className="text-[12.5px] font-extrabold text-forest mt-1.5">€{hut.pricePerNight} / night</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Getting there">
          <div className="flex flex-col gap-2.5">
            {route.transport.map((t) => (
              <div key={t.label} className="bg-paper rounded-2xl shadow-card border border-forest/5 px-4 py-3.5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-alpine/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C89A8" strokeWidth="2">
                    <path d="M3 12l18-9-9 18-2-7-7-2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13.5px] font-bold text-ink">{t.label}</p>
                  <p className="text-[11.5px] text-inkSoft font-medium">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Packing list">
          <PackingList routeId={route.id} items={route.packingList} />
        </Section>

        <Section title="">
          <AIAssistant route={route} />
        </Section>

        <Section title="Reviews">
          <div className="flex flex-col gap-2.5">
            {route.reviews.map((r) => (
              <div key={r.name} className="bg-paper rounded-2xl shadow-card border border-forest/5 p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg,#5C89A8,#1E3A2B)' }} />
                  <div>
                    <p className="text-[13px] font-bold text-ink">{r.name}</p>
                    <p className="text-[10.5px] text-inkSoft font-medium">Hiked {r.date}</p>
                  </div>
                  <span className="ml-auto text-[#F4C56A] text-[11px]">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-[12.5px] text-inkSoft font-medium leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      {title && <p className="text-[18px] font-extrabold text-ink mb-3">{title}</p>}
      {children}
    </div>
  );
}
