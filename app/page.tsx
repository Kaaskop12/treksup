'use client';

import { useEffect, useMemo, useState } from 'react';
import { routes } from '@/lib/routes';
import { getFavorites, toggleFavorite } from '@/lib/storage';
import RouteCard from '@/components/RouteCard';
import WaitlistForm from '@/components/WaitlistForm';

const filters = ['All', 'Easy', 'Moderate', 'Hard'];

export default function DiscoverPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function onToggleFavorite(id: string) {
    setFavorites(toggleFavorite(id));
  }

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      const matchesFilter = filter === 'All' || r.difficulty === filter;
      const matchesQuery =
        query.trim() === '' ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.country.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div>
      <div className="px-5 pt-16 pb-5" style={{ background: 'linear-gradient(180deg,#243F2D 0%, #F7F3EA 100%)' }}>
        <p className="text-white text-[22px] font-extrabold mt-2 mb-1">Where to next?</p>
        <p className="text-white/70 text-[13px] font-medium mb-4">
          {routes.length} curated multi-day routes to start with
        </p>
        <div className="flex items-center gap-2.5 glass rounded-full px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6058" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search routes, regions, huts"
            className="bg-transparent outline-none text-[13.5px] font-medium w-full"
          />
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto px-5 pt-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] font-bold border ${
              filter === f ? 'bg-forest text-white border-forest' : 'bg-paper text-inkSoft border-forest/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-5 pt-3 pb-6">
        <p className="text-[18px] font-extrabold text-ink mb-3">Curated for you</p>
        <div className="flex flex-col gap-3.5">
          {filtered.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isFavorite={favorites.includes(route.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-[13px] text-inkSoft font-medium text-center py-8">
              No routes match that search yet.
            </p>
          )}
        </div>
        <div className="mt-6">
          <WaitlistForm
            source="home"
            title="Be first to know"
            blurb="GPX downloads, more routes and hut booking are coming. Get one email when they land."
            cta="Join"
          />
        </div>
      </div>
    </div>
  );
}
