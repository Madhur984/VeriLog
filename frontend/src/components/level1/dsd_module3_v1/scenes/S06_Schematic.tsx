import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MousePointerClick } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

export const S06_Schematic: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(1);

  const bc = useMemo(() => ((b && c) ? 1 : 0) as Bit, [b, c]);
  const f  = useMemo(() => ((a || bc) ? 1 : 0) as Bit, [a, bc]);

  const wireColor = (v: Bit) => v === 1 ? '#fb7185' : '#475569';
  const wireGlow  = (v: Bit) => v === 1 ? 'drop-shadow(0 0 4px rgba(251,113,133,0.7))' : 'none';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-300">
          <Cpu size={14} /> Step 5 · Wire the Schematic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Two product terms · two gates · one OR.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The minimised SOP is <strong className="text-emerald-300">F = A + BC</strong>. We map
          each operator onto a physical cell from the gate library. The product term{' '}
          <strong>BC</strong> needs one AND. The sum needs one OR. <strong>A</strong> goes
          straight in. Total: <strong className="text-emerald-300">2 gates</strong>.
        </p>
      </section>

      {/* Mapping recipe */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { sym: '·', name: 'Product (·)', detail: 'Each AND gate becomes a series circuit - every input must be 1.', accent: '#fbbf24' },
            { sym: '+', name: 'Sum (+)',     detail: 'Each OR gate is a parallel circuit - any input being 1 is enough.', accent: '#22c55e' },
            { sym: '′', name: 'Prime (′)',   detail: 'Each NOT gate inverts a signal. We need none here - A, B, C are unprimed.', accent: '#fb7185' },
          ].map((m) => (
            <div
              key={m.name}
              className="p-5 rounded-2xl border-2"
              style={{ borderColor: `${m.accent}55`, background: `${m.accent}10` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center font-mono font-black text-2xl"
                  style={{ background: `${m.accent}30`, color: m.accent }}
                >
                  {m.sym}
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: m.accent }}>{m.name}</div>
                </div>
              </div>
              <p className={`text-xs ${subText} leading-relaxed`}>{m.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live circuit */}
      <TryItYourself />
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-300 mb-1">Live circuit</div>
            <h3 className={`text-xl font-black ${textColor}`}>F = A + BC</h3>
          </div>
          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Toggle inputs ↓
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {([
            { k: 'A', label: 'Retinal',  v: a, set: setA, color: '#0ea5e9' },
            { k: 'B', label: 'Keycard',  v: b, set: setB, color: '#22d3ee' },
            { k: 'C', label: 'Override', v: c, set: setC, color: '#f59e0b' },
          ] as const).map((d) => (
            <button
              key={d.k}
              onClick={() => d.set(d.v === 1 ? 0 : 1)}
              className="px-5 py-3 rounded-2xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
              style={{
                borderColor: d.color,
                color: d.v ? '#000' : d.color,
                backgroundColor: d.v ? d.color : 'transparent',
                boxShadow: d.v ? `0 0 25px ${d.color}55` : 'none',
              }}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-80">{d.label}</span>
              <span className="text-base">{d.k} = {d.v}</span>
            </button>
          ))}
        </div>

        {/* SVG schematic - F = A + BC */}
        <svg viewBox="0 0 760 280" className="w-full h-auto">
          {/* Input rail labels */}
          <g fontFamily="monospace" fontSize="14" fontWeight="bold">
            <text x="14"  y="58"  fill="#0ea5e9">A</text>
            <text x="14"  y="158" fill="#22d3ee">B</text>
            <text x="14"  y="218" fill="#f59e0b">C</text>
          </g>

          {/* A → straight to OR */}
          <line x1="40" y1="54" x2="450" y2="120" stroke={wireColor(a)} strokeWidth="3" style={{ filter: wireGlow(a) }} />

          {/* B and C into AND */}
          <line x1="40" y1="154" x2="240" y2="170" stroke={wireColor(b)} strokeWidth="2.5" style={{ filter: wireGlow(b) }} />
          <line x1="40" y1="214" x2="240" y2="210" stroke={wireColor(c)} strokeWidth="2.5" style={{ filter: wireGlow(c) }} />

          {/* AND gate */}
          <path d="M 240 160 L 280 160 A 25 25 0 0 1 280 220 L 240 220 Z"
                fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#fcd34d" strokeWidth="2.5" />
          <text x="247" y="195" fontSize="11" fontFamily="monospace" fill="#fcd34d">AND</text>

          {/* AND output → OR */}
          <line x1="305" y1="190" x2="450" y2="190" stroke={wireColor(bc)} strokeWidth="3" style={{ filter: wireGlow(bc) }} />
          <text x="320" y="180" fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#fcd34d">B·C = {bc}</text>

          {/* OR gate */}
          <path d="M 450 95 Q 475 155 450 215 Q 545 200 580 155 Q 545 110 450 95 Z"
                fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#22c55e" strokeWidth="3" />
          <text x="475" y="160" fontSize="14" fontFamily="monospace" fontWeight="bold" fill="#22c55e">OR</text>

          {/* Output line */}
          <line x1="580" y1="155" x2="700" y2="155" stroke={wireColor(f)} strokeWidth="4" style={{ filter: wireGlow(f) }} />

          {/* Output box */}
          <rect x="700" y="125" width="50" height="60" rx="6"
                fill={f ? '#22c55e' : 'none'}
                stroke="#22c55e" strokeWidth="3"
                style={{ filter: f ? 'drop-shadow(0 0 18px rgba(34,197,94,0.7))' : 'none' }} />
          <text x="708" y="170" fontSize="20" fontFamily="monospace" fontWeight="bold"
                fill={f ? '#000' : '#22c55e'}>F={f}</text>

          {/* Equation overlay */}
          <text x="290" y="40" fontSize="22" fontFamily="monospace" fontWeight="bold"
                fill={isDarkMode ? '#fff' : '#0f172a'}>F = A + BC</text>
        </svg>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">AND output</div>
            <div className={`font-mono text-sm ${textColor}`}>B · C = {b} · {c} = <strong>{bc}</strong></div>
          </div>
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-sky-300 mb-1">A direct</div>
            <div className={`font-mono text-sm ${textColor}`}>A = <strong>{a}</strong></div>
          </div>
          <div className={`p-4 rounded-xl border ${f ? 'border-emerald-400/60 bg-emerald-500/10' : isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">Vault</div>
            <div className={`font-mono text-sm ${f ? 'text-emerald-300' : textColor}`}>
              F = {a} + {bc} = <strong>{f}</strong> · {f ? 'UNLOCK' : 'LOCK'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
