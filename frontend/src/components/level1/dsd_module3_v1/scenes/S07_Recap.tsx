import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BadgeCheck, MousePointerClick, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bit = 0 | 1;

const COL_TO_BIN = [0, 1, 3, 2];

export const S07_Recap: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Synced inputs across all 4 representations
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(1);
  const bc: Bit = ((b && c) ? 1 : 0) as Bit;
  const f:  Bit = ((a || bc) ? 1 : 0) as Bit;
  const currentRow = (a << 2) | (b << 1) | c;

  const wire = (v: Bit) => v === 1 ? '#22c55e' : (isDarkMode ? '#475569' : '#cbd5e1');
  const glow = (v: Bit) => v === 1 ? 'drop-shadow(0 0 4px rgba(34,197,94,0.7))' : 'none';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <BadgeCheck size={14} /> Closing · System Status
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One truth · four faces.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The same Boolean function lives in four equivalent forms. Toggle the inputs below and
          watch the row, the equation, the K-Map cell, and the schematic <strong className="text-emerald-300">all update in lockstep</strong>.
          When you can move freely between any two forms, you have mastered combinational design.
        </p>
      </section>

      {/* Sync controller */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className={`flex items-center gap-2 text-xs font-mono ${subText} mb-4`}>
          <MousePointerClick size={12} /> Master inputs · drives every panel below
        </div>
        <div className="flex gap-3 flex-wrap">
          {([
            { k: 'A', v: a, set: setA, color: '#fb923c', label: 'Retinal' },
            { k: 'B', v: b, set: setB, color: '#22d3ee', label: 'Keycard' },
            { k: 'C', v: c, set: setC, color: '#f59e0b', label: 'Override' },
          ] as const).map((p) => (
            <motion.button
              key={p.k}
              onClick={() => p.set(p.v === 1 ? 0 : 1)}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 rounded-2xl border-2 font-mono font-black transition-all flex flex-col items-start gap-1 min-w-[140px]"
              style={{
                borderColor: p.color,
                color: p.v ? '#000' : p.color,
                backgroundColor: p.v ? p.color : 'transparent',
                boxShadow: p.v ? `0 0 30px ${p.color}66` : 'none',
              }}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-80">{p.label}</span>
              <span className="text-2xl">{p.k} = {p.v}</span>
            </motion.button>
          ))}
          <div className="flex-1" />
          <motion.div
            animate={{
              borderColor: f ? '#22c55e' : '#ef4444',
              background: f ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.10)',
              boxShadow: f ? '0 0 30px rgba(34,197,94,0.45)' : 'none',
            }}
            className="px-6 py-4 rounded-2xl border-2 font-mono font-black flex flex-col items-start gap-1 min-w-[140px]"
            style={{ color: f ? '#22c55e' : '#ef4444' }}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-80">Output</span>
            <span className="text-2xl">F = {f}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* The four faces - synchronized */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-4"
      >
        {/* Face 1 - Truth table */}
        <div className={`p-5 rounded-2xl border-2 border-orange-400/40 bg-orange-500/5`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-3 flex items-center justify-between">
            <span>① Truth table</span>
            <span className="opacity-60">m{currentRow} highlighted</span>
          </div>
          <div className="font-mono text-[11px] space-y-0.5">
            <div className="grid grid-cols-5 opacity-50 border-b border-white/5 pb-1 mb-1">
              <span className="text-center">#</span>
              <span className="text-center">A</span>
              <span className="text-center">B</span>
              <span className="text-center">C</span>
              <span className="text-center">F</span>
            </div>
            {Array.from({ length: 8 }, (_, i) => {
              const ra = (i >> 2) & 1;
              const rb = (i >> 1) & 1;
              const rc = i & 1;
              const rf = (ra || (rb && rc)) ? 1 : 0;
              const isCurrent = i === currentRow;
              return (
                <motion.div
                  key={i}
                  animate={{
                    background: isCurrent ? 'rgba(251,146,60,0.30)' : 'transparent',
                    scale: isCurrent ? 1.03 : 1,
                  }}
                  className={`grid grid-cols-5 px-1 py-0.5 rounded ${
                    rf === 1 && !isCurrent ? 'text-emerald-300 font-black' : ''
                  }`}
                  style={{
                    boxShadow: isCurrent ? '0 0 10px rgba(251,146,60,0.6)' : 'none',
                  }}
                >
                  <span className={`text-center ${isCurrent ? 'text-orange-200 font-black' : subText}`}>m{i}</span>
                  <span className="text-center">{ra}</span>
                  <span className="text-center">{rb}</span>
                  <span className="text-center">{rc}</span>
                  <span className={`text-center font-black ${rf ? (isCurrent ? 'text-orange-100' : 'text-emerald-300') : 'opacity-50'}`}>{rf}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Face 2 - Algebra (live evaluation) */}
        <div className={`p-5 rounded-2xl border-2 border-amber-400/40 bg-amber-500/5`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-3">② Algebra · live</div>
          <div className={`font-mono text-base space-y-3`}>
            <div className={textColor}>F(A,B,C) = A + B·C</div>
            <div className="h-px bg-white/10" />
            <div className={`text-xs ${subText}`}>Substitute current inputs:</div>
            <div className={`text-xl font-black ${textColor}`}>
              F = <span style={{ color: a ? '#22c55e' : '#ef4444' }}>{a}</span>
              {' + '}
              <span style={{ color: b ? '#22c55e' : '#ef4444' }}>{b}</span>
              ·
              <span style={{ color: c ? '#22c55e' : '#ef4444' }}>{c}</span>
            </div>
            <div className={`text-xl font-black ${textColor}`}>
              = <span style={{ color: a ? '#22c55e' : '#ef4444' }}>{a}</span>
              {' + '}
              <span style={{ color: bc ? '#22c55e' : '#ef4444' }}>{bc}</span>
            </div>
            <motion.div
              key={f}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-black`}
              style={{ color: f ? '#22c55e' : '#ef4444' }}
            >
              = {f}
            </motion.div>
          </div>
        </div>

        {/* Face 3 - K-Map with live cell highlight */}
        <div className={`p-5 rounded-2xl border-2 border-violet-400/40 bg-violet-500/5`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-3 flex items-center justify-between">
            <span>③ K-Map · live cell</span>
            <span className="opacity-60">F = A + BC</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
            <span></span>
            {['00', '01', '11', '10'].map((g) => (
              <span key={g} className="text-center text-violet-300">{g}</span>
            ))}
            {[0, 1].map((row) => (
              <React.Fragment key={row}>
                <span className="text-violet-300 self-center">A={row}</span>
                {COL_TO_BIN.map((bcBin, col) => {
                  const m = row * 4 + bcBin;
                  const isOne = m === 3 || m === 4 || m === 5 || m === 6 || m === 7;
                  const isCurrent = m === currentRow;
                  return (
                    <motion.div
                      key={col}
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        background: isCurrent
                          ? 'rgba(167,139,250,0.40)'
                          : isOne ? 'rgba(34,197,94,0.20)' : 'rgba(0,0,0,0.20)',
                        borderColor: isCurrent
                          ? '#a78bfa'
                          : isOne ? 'rgba(34,197,94,0.6)' : 'rgba(255,255,255,0.10)',
                        boxShadow: isCurrent ? '0 0 15px rgba(167,139,250,0.7)' : 'none',
                      }}
                      className="text-center py-2 rounded border-2 font-black"
                    >
                      <span className={isOne ? 'text-emerald-300' : 'opacity-50'}>{isOne ? 1 : 0}</span>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className={`mt-3 font-mono text-xs text-center ${subText}`}>
            Cell <strong className="text-violet-300">m{currentRow}</strong> ↔ row m{currentRow} ↔ ({a},{b},{c})
          </div>
        </div>

        {/* Face 4 - Live schematic */}
        <div className={`p-5 rounded-2xl border-2 border-rose-400/40 bg-rose-500/5`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-3">④ Schematic · live signal flow</div>
          <svg viewBox="0 0 280 160" className="w-full h-auto">
            {/* A direct */}
            <line x1="20" y1="30" x2="170" y2="50" stroke={wire(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <text x="6" y="34" fontSize="11" fontFamily="monospace" fill="#fb923c" fontWeight="bold">A={a}</text>

            {/* B and C into AND */}
            <line x1="20" y1="80" x2="80" y2="85" stroke={wire(b)} strokeWidth="2" style={{ filter: glow(b) }} />
            <line x1="20" y1="110" x2="80" y2="105" stroke={wire(c)} strokeWidth="2" style={{ filter: glow(c) }} />
            <text x="6" y="84" fontSize="11" fontFamily="monospace" fill="#22d3ee" fontWeight="bold">B={b}</text>
            <text x="6" y="114" fontSize="11" fontFamily="monospace" fill="#f59e0b" fontWeight="bold">C={c}</text>

            <path d="M 80 78 L 100 78 A 14 14 0 0 1 100 110 L 80 110 Z" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#fcd34d" strokeWidth="2" />
            <text x="84" y="98" fontSize="9" fontFamily="monospace" fill="#fcd34d">AND</text>

            <line x1="115" y1="94" x2="170" y2="80" stroke={wire(bc)} strokeWidth="2.5" style={{ filter: glow(bc) }} />
            <text x="120" y="76" fontSize="9" fontFamily="monospace" fill="#fcd34d">BC={bc}</text>

            <path d="M 170 30 Q 185 70 170 110 Q 220 100 240 70 Q 220 40 170 30 Z" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#22c55e" strokeWidth="2" />
            <text x="186" y="74" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#22c55e">OR</text>

            <line x1="240" y1="70" x2="270" y2="70" stroke={wire(f)} strokeWidth="3" style={{ filter: glow(f) }} />
            <motion.rect
              x="245" y="55" width="30" height="30" rx="4"
              animate={{
                fill: f ? '#22c55e' : (isDarkMode ? '#0a0e1a' : '#fff'),
                filter: f ? 'drop-shadow(0 0 12px rgba(34,197,94,0.8))' : 'none',
              }}
              stroke="#22c55e" strokeWidth="2"
            />
            <text x="250" y="76" fontSize="13" fontFamily="monospace" fontWeight="bold"
                  fill={f ? '#000' : '#22c55e'}>F={f}</text>
          </svg>
          <div className={`mt-2 font-mono text-[10px] text-center ${subText}`}>
            2 gates · 3 literals · all four panels show {f === 1 ? 'UNLOCK' : 'LOCK'}
          </div>
        </div>
      </motion.div>

      {/* Sync indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Sparkles className="text-emerald-300 mt-0.5 shrink-0" size={18} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-emerald-300">All four panels reading the same state right now.</strong>{' '}
          Truth table row m{currentRow}, algebra evaluating to F={f}, K-Map cell m{currentRow}{' '}
          highlighted, and the schematic output box {f ? 'lit green' : 'dark'}. They cannot
          disagree - they are the same function under four different lenses.
        </p>
      </motion.div>

      {/* Pipeline takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            Architect's takeaway
          </span>
        </div>
        <p className={`text-base ${subText} mb-6 max-w-3xl`}>
          Digital logic design fuses the rigorous truth of mathematics with the practical
          constraints of physical engineering. By mastering the four-stage pipeline, you transform
          raw binary requirements into elegant, unyielding hardware.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { n: '1', t: 'Define',   d: 'Enumerate every input combination · 2ⁿ rows.', accent: '#fb923c' },
            { n: '2', t: 'Extract',  d: 'Each F=1 row → minterm · OR them all → SOP.',   accent: '#fbbf24' },
            { n: '3', t: 'Optimise', d: 'Plot K-Map · group adjacent 1s · drop variables that vary.', accent: '#a78bfa' },
            { n: '4', t: 'Build',    d: 'Map operators to AND/OR/NOT · wire the schematic.', accent: '#fb7185' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.08, type: 'spring' }}
              className="p-4 rounded-2xl border-2 flex flex-col gap-2"
              style={{ borderColor: `${s.accent}55`, background: `${s.accent}10` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg grid place-items-center font-mono font-black text-xs"
                  style={{ background: s.accent, color: '#000' }}
                >
                  {s.n}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: s.accent }}>
                  Stage {s.n}
                </span>
              </div>
              <h4 className={`text-sm font-black ${textColor}`}>{s.t}</h4>
              <p className={`text-xs ${subText} leading-relaxed`}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Methodology complete · Blueprint archived
      </motion.div>
    </div>
  );
};
