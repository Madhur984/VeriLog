import { motion } from 'framer-motion';
import { MousePointerClick, Activity, Boxes } from 'lucide-react';

const STEPS = [
  {
    n: '01', accent: '#22D3EE', Icon: MousePointerClick, title: 'Interact',
    body: 'Every concept starts with an action. Toggle a bit, drag a gate, change a value. Understanding follows.',
  },
  {
    n: '02', accent: '#F59E0B', Icon: Activity, title: 'See',
    body: 'The system responds in real time. Signals light up, truth tables highlight, circuits change. You see exactly why.',
  },
  {
    n: '03', accent: '#10B981', Icon: Boxes, title: 'Build',
    body: "By the end of each module you've built a mental model — not memorised a formula. It follows you into every exam and interview.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="w-full" style={{ background: '#0B1220' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#22D3EE' }}>
            The method
          </span>
          <h2 className="mt-3 font-extrabold tracking-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            You learn by doing.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#94A3B8' }}>
            Not passive lectures. Three moves, repeated until the silicon makes sense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-2xl p-7"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${s.accent}1A`, color: s.accent }}>
                  <s.Icon size={22} strokeWidth={2} />
                </div>
                <span className="font-mono text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.12)' }}>{s.n}</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#F8FAFC' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
