import { formatNumber } from '@/lib/format';

export default function ElevationChart({ ascentM, descentM }: { ascentM: number; descentM: number }) {
  return (
    <div className="rounded-xl2 p-5 pb-3.5 shadow-card text-white" style={{ background: 'linear-gradient(165deg,#1E3A2B 0%, #142A1F 100%)' }}>
      <div className="flex justify-between mb-1">
        <div>
          <p className="text-2xl font-extrabold">{formatNumber(ascentM)} m</p>
          <p className="text-[10.5px] opacity-65 font-semibold uppercase tracking-wide mt-0.5">Total ascent</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold">{formatNumber(descentM)} m</p>
          <p className="text-[10.5px] opacity-65 font-semibold uppercase tracking-wide mt-0.5">Total descent</p>
        </div>
      </div>
      <svg viewBox="0 0 320 90" preserveAspectRatio="none" className="w-full h-[100px] mt-1.5">
        <defs>
          <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FD9B0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8FD9B0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,70 C20,60 35,20 55,25 C75,30 85,55 105,50 C125,45 140,10 165,12 C185,14 200,45 225,42 C250,39 265,15 285,18 C300,20 310,40 320,45 L320,90 L0,90 Z"
          fill="url(#elevFill)"
        />
        <path
          d="M0,70 C20,60 35,20 55,25 C75,30 85,55 105,50 C125,45 140,10 165,12 C185,14 200,45 225,42 C250,39 265,15 285,18 C300,20 310,40 320,45"
          fill="none"
          stroke="#8FD9B0"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-[10px] opacity-55 font-medium mt-1">Profile shape is illustrative; totals come from the route brief.</p>
    </div>
  );
}
