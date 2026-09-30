'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

/** Logs one anonymous page_view per route change. */
export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    track('page_view');
  }, [pathname]);
  return null;
}
