'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Discover' },
  { href: '/trips', label: 'Trips' },
  { href: '/profile', label: 'Profile' }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="absolute left-0 right-0 bottom-0 h-20 glass border-t border-forest/10 flex px-2 pt-2 pb-5 z-50">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1"
          >
            <span
              className={`w-2 h-2 rounded-full ${active ? 'bg-forest' : 'bg-transparent'}`}
            />
            <span
              className={`text-[11px] font-semibold ${active ? 'text-forest' : 'text-inkSoft'}`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
