export default function ProfilePage() {
  const rows = [
    { label: 'Saved routes' },
    { label: 'Downloaded GPX files' },
    { label: 'Settings' }
  ];

  return (
    <div className="px-5 pt-16">
      <p className="text-[24px] font-extrabold text-ink mb-5">Profile</p>

      <div className="flex items-center gap-3.5 bg-paper rounded-xl2 shadow-card border border-forest/5 p-4 mb-5">
        <span className="w-13 h-13 rounded-full flex-shrink-0" style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#5C89A8,#1E3A2B)' }} />
        <div>
          <p className="text-[15px] font-extrabold text-ink">Your account</p>
          <p className="text-[12px] text-inkSoft font-medium">Sign-in isn't wired up in this MVP yet</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 bg-paper rounded-2xl shadow-card border border-forest/5 px-4 py-3.5">
            <span className="text-[13px] font-bold text-ink flex-1">{row.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6058" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
