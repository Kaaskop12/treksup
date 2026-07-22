'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { getFavorites } from '@/lib/storage';

export default function TripsPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
  }, []);

  const savedRoutes = routes.filter((r) => favoriteIds.includes(r.id));

  return (
    <div className="px-5 pt-16">
      <p className="text-[24px] font-extrabold text-ink mb-5">Your trips</p>

      {savedRoutes.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3.5 pt-14 px-6">
          <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E3A2B" strokeWidth="2">
              <path d="M3 12l18-9-9 18-2-7-7-2z" />
            </svg>
          </div>
          <p className="text-[16px] font-extrabold text-ink">Plan your next adventure</p>
          <p className="text-[12.5px] text-inkSoft font-medium leading-relaxed">
            Save a route from Discover and it will show up here with huts, transport and gear in one place.
          </p>
          <Link href="/" className="text-[13px] font-bold text-forest mt-1">
            Browse routes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {savedRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/route/${route.id}`}
              className="flex gap-3.5 bg-paper rounded-xl2 p-3 shadow-card border border-forest/5"
            >
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <Image src={route.thumb} alt={route.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-bold text-ink mb-0.5">{route.name}</p>
                <p className="text-[11.5px] text-inkSoft font-medium">
                  {route.days} {route.days === 1 ? 'day' : 'days'} · {route.huts.length} huts saved
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
