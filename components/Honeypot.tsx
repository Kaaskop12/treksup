/** Hidden field that people never see or fill; simple bots do. */
export default function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
    />
  );
}
