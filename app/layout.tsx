import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Treksup',
  description: 'Plan multi-day hiking adventures from start to finish.'
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
          </div>
        </div>
      </body>
    </html>
  );
}
