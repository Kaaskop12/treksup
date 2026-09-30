import type { Metadata } from 'next';
import PartnerForm from '@/components/PartnerForm';

export const metadata: Metadata = {
  title: 'For walking-holiday operators: a Friday conditions page for your walkers',
  description:
    'Every Friday of your season, one page per route with your name on it: closures, notices and forecasts. Plus a year of Treksup Premium for each of your walkers. €490 per route per season.',
  alternates: { canonical: '/partners' },
  openGraph: {
    title: 'For walking-holiday operators | Treksup',
    description: 'A Friday conditions page per route for your walkers. €490 per route per season.',
    siteName: 'Treksup',
    type: 'website'
  }
};

const points = [
  {
    title: 'A Friday page per route, with your name on it',
    text: 'Every Friday of your season we read the official notices, closures and forecasts for your routes and turn them into one clear page you can forward to your walkers.'
  },
  {
    title: 'Treksup Premium for every walker you send',
    text: 'Each of your walkers gets a year of Treksup Premium at no extra cost.'
  },
  {
    title: '€490 per route for the whole season',
    text: 'However many walkers you send. One invoice.'
  }
];

const covered = ['Tour du Mont Blanc', "Walker's Haute Route", 'Alta Via 1', 'West Highland Way', 'GR20', "Fishermen's Trail"];

export default function PartnersPage() {
  return (
    <div>
      <div className="px-5 pt-16 pb-6" style={{ background: 'linear-gradient(180deg,#243F2D 0%, #F7F3EA 100%)' }}>
        <p className="text-white/70 text-[11px] font-bold uppercase tracking-wide mb-2">For walking-holiday operators</p>
        <h1 className="text-white text-[26px] font-extrabold leading-tight mb-2">
          Your walkers get this week&apos;s route conditions, every Friday
        </h1>
        <p className="text-white/80 text-[13.5px] font-medium leading-relaxed">
          Treksup is a small app from Belgium that helps people plan their first multi-day walk and get home safely.
          We already check the notices for these routes every week. You can hand that work to your walkers.
        </p>
      </div>

      <div className="px-5 pt-5 pb-8 flex flex-col gap-3">
        {points.map((p) => (
          <div key={p.title} className="bg-paper rounded-2xl shadow-card border border-forest/5 p-4">
            <p className="text-[14px] font-extrabold text-ink mb-1">{p.title}</p>
            <p className="text-[12.5px] text-inkSoft font-medium leading-relaxed">{p.text}</p>
          </div>
        ))}

        <div className="bg-paper rounded-2xl shadow-card border border-forest/5 p-4">
          <p className="text-[14px] font-extrabold text-ink mb-2">Routes we check now</p>
          <div className="flex flex-wrap gap-1.5">
            {covered.map((r) => (
              <span key={r} className="text-[11.5px] font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-md">{r}</span>
            ))}
          </div>
          <p className="text-[11.5px] text-inkSoft font-medium mt-2">Running a different route? Ask. We add routes on request.</p>
        </div>

        <p className="text-[13px] text-ink font-semibold leading-relaxed mt-2">
          Tell us which routes you&apos;ll run in 2027 and we&apos;ll send you next Friday&apos;s page for them, free, so
          you can see it before deciding. If it isn&apos;t useful, a simple no is fine.
        </p>

        <PartnerForm />

        <p className="text-[10.5px] text-inkSoft font-medium leading-relaxed mt-4">
          Treksup · Belgium · company no. 1029.205.038 · Aarschotstraat 5, 1820 Steenokkerzeel.
          We use what you send only to reply to you about this offer. See our{' '}
          <a href="/privacy" className="underline">privacy notice</a>.
        </p>
      </div>
    </div>
  );
}
