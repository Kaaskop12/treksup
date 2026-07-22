'use client';

import { useEffect, useState } from 'react';
import { PackItem } from '@/lib/routes';
import { getPackingState, setPackingItem } from '@/lib/storage';

export default function PackingList({ routeId, items }: { routeId: string; items: PackItem[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(getPackingState(routeId));
  }, [routeId]);

  function toggle(itemId: string) {
    const next = !checked[itemId];
    setChecked((prev) => ({ ...prev, [itemId]: next }));
    setPackingItem(routeId, itemId, next);
  }

  const doneCount = items.filter((i) => checked[i.id]).length;

  return (
    <div className="bg-paper rounded-xl2 p-4 shadow-card border border-forest/5">
      <p className="text-[12px] text-inkSoft font-semibold mb-2">
        {doneCount} / {items.length} packed
      </p>
      {items.map((item) => {
        const done = !!checked[item.id];
        return (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-3 py-2.5 border-b border-forest/10 last:border-b-0 text-left"
          >
            <span
              className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                done ? 'bg-forest border-forest' : 'border-forest/25'
              }`}
              style={{ width: 22, height: 22 }}
            >
              {done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </span>
            <span className={`text-[13.5px] font-semibold flex-1 ${done ? 'text-inkSoft line-through' : 'text-ink'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
