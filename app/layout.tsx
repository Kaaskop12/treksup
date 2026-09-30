import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import Analytics from '@/components/Analytics';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Treksup: plan your first multi-day hike', template: '%s | Treksup' },
  description: 'Plan multi-day hiking adventures from start to finish: routes, huts, transport and packing lists.',
  openGraph: { siteName: 'Treksup', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center min-h-screen py-10 px-4">
          <div className="w-full max-w-[430px] bg-offwhite min-h-[850px] rounded-[36px] shadow-2xl overflow-hidden relative flex flex-col">
            <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>
              {children}
            </div>
            <BottomNav />
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
}
