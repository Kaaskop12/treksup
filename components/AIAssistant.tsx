'use client';

import { useState } from 'react';
import { Route } from '@/lib/routes';

type Message = { who: 'bot' | 'user'; text: string };

function answerFor(route: Route, question: string): string {
  const q = question.toLowerCase();
  if (q.includes('gear') || q.includes('ferrata') || q.includes('equipment')) {
    return `For ${route.name}, the key items are: ${route.packingList
      .slice(0, 4)
      .map((i) => i.label.toLowerCase())
      .join(', ')}. Huts along the route can often rent technical gear if you'd rather not carry it.`;
  }
  if (q.includes('safe') || q.includes('height') || q.includes('difficult') || q.includes('beginner')) {
    return `This route is rated ${route.difficulty}. With ${route.ascentM.toLocaleString()} m of ascent over ${route.days} day(s), pace yourself on the first day and check the reviews below for section-specific warnings from other hikers.`;
  }
  if (q.includes('weather') || q.includes('rain') || q.includes('snow')) {
    return `Live weather isn't wired up in this MVP yet, but the packing list already accounts for typical conditions on ${route.name}. A real deployment would pull this from a weather API using the route's coordinates.`;
  }
  if (q.includes('sleep') || q.includes('hut') || q.includes('camp')) {
    return route.huts.length
      ? `There are ${route.huts.length} huts listed for this route, starting at €${Math.min(
          ...route.huts.map((h) => h.pricePerNight)
        )}/night. Book ahead in peak season, they fill up fast.`
      : `This is a day route, so no huts are listed — check the transport section for getting back before dark.`;
  }
  return `Good question about ${route.name}. Ask me about gear, safety, weather, or where to sleep and I'll get specific.`;
}

export default function AIAssistant({ route }: { route: Route }) {
  const [messages, setMessages] = useState<Message[]>([
    { who: 'bot', text: `Hi, I've read the route brief for ${route.name}. Ask me about gear, weather, safety or huts.` }
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  function ask(question: string) {
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { who: 'user', text: question }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { who: 'bot', text: answerFor(route, question) }]);
    }, 350);
  }

  const suggestions = ['What gear do I need?', 'Is this safe for a beginner?', 'Where do I sleep?'];

  return (
    <div className="rounded-xl3 p-5 shadow-lg" style={{ background: 'radial-gradient(120% 140% at 20% 0%, #2A5240 0%, #16281E 60%, #101E17 100%)' }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3.5 text-left">
        <span className="orb w-12 h-12 flex-shrink-0 block" />
        <span>
          <span className="block text-[15px] font-extrabold text-white">Trek Assistant</span>
          <span className="block text-[12px] text-white/60 font-medium">
            {open ? 'Tap to close' : "Trained on this route's terrain and weather"}
          </span>
        </span>
      </button>

      {open && (
        <div className="mt-4">
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto mb-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-[13px] leading-relaxed font-medium rounded-2xl px-3.5 py-2.5 max-w-[85%] ${
                  m.who === 'bot'
                    ? 'bg-white/10 text-white self-start'
                    : 'bg-white text-forest self-end'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="text-[11.5px] font-bold text-white bg-white/10 border border-white/15 px-3 py-1.5 rounded-full"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder="Ask about gear, safety, weather..."
              className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-full px-4 py-2.5 text-[13px] outline-none"
            />
            <button
              onClick={() => ask(input)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1E3A2B" strokeWidth="2.3">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
