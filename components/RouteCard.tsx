'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Route } from '@/lib/routes';

export default function RouteCard({
  route,
  isFavorite,
  onToggleFavorite
}: {
  route: Route;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <Link
      href={`/route/${route.id}`}
      className="flex gap-3.5 bg-paper rounded-xl2 p-3 shadow-card border border-forest/5"
    >
      <div className="relative w-[88px] h-[88px] flex-shrink-0 rounded-2xl overflow-hidden">
        <Image src={route.thumb} alt={route.name} fill className="object-cover" />
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(route.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/35 flex items-center justify-center"
          aria-label="Save route"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#F4C56A' : 'none'}
            stroke={isFavorite ? '#F4C56A' : '#fff'}
            strokeWidth="2.2"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[14.5px] font-bold text-ink mb-0.5">{route.name}</p>
        <p className="text-[12px] text-inkSoft font-medium mb-2">
          {route.country} · {route.days} {route.days === 1 ? 'day' : 'days'}
        </p>
        <div className="flex gap-1.5">
          <span className="text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-md">
            {route.difficulty}
          </span>
          <span className="text-[11px] font-bold text-alpine bg-alpine/10 px-2 py-0.5 rounded-md">
            {route.distanceKm} km
          </span>
        </div>
      </div>
    </Link>
  );
}
