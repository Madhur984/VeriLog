import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const SKY = '#38bdf8';
const ROSE = '#fb7185';

const PRESETS: Array<{ a: number; b: number }> = [
  { a: 0b1011, b: 0b0110 },
  { a: 0b0111, b: 0b0001 },
  { a: 0b1111, b: 0b1111 },
];

export const S04_Carries: React.FC<Props> = ({ isDarkMode }) => {
  const [preset, setPreset] = useState(0);
  const [c0, setC0] = useState(0);
  const { a: A, b: B } = PRESETS[preset];

  const g = [0, 1, 2, 3].map(i => ((A >> i) & 1) & ((B >> i) & 1));
  const p = [0, 1, 2, 3].map(i => ((A >> i) & 1) ^ ((B >> i) & 1));
  // carries into each bit position: c[0]=c0, c[i+1]=g[i] | (p[i]&c[i])
  const c = [c0];
  for (let i = 0; i < 4; i++) c[i + 1] = g[i] | (p[i] & c[i]);
  const sum = [0, 1, 2, 3].map(i => p[i] ^ c[i]);
  const result = sum.reduce((v, b, i) => v + (b << i), 0) + (c[4] << 4);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const EQ: Array<{ label: string; terms: string; val: number }> = [
    { label: 'C1', terms: 'G0 + P0·C0', val: c[1] },
    { label: 'C2', terms: 'G1 + P1·G0 + P1·P0·C0', val: c[2] },
    { label: 'C3', terms: 'G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0', val: c[3] },
    { label: 'C4', terms: 'G3 + P3·G2 + P3·P2·G1 + P3·P2·P1·G0 + P3·P2·P1·P0·C0', val: c[4] },
  ];

  const Pill: React.FC<{ v: number; color: string; label: string }> = ({ v, color, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-9 h-9 rounded-lg border-2 flex items-center justify-center font-mono text-base font-black"
           style={{ borderColor: v ? color : `${color}55`, background: v ? `${color}22` : 'transparent', color: v ? color : `${color}99` }}>{v}</div>
      <span className="mt-0.5 font-mono text-[9px]" style={{ color }}>{label}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Zap size={14} /> Chapter 05 · Predicting Every Carry
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Every carry, written from the inputs</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Here is the trick in full. Each carry equation is expanded until it contains only G's, P's
          and the carry-in C0 - never another carry. So none of them waits, and the look-ahead block
          resolves them all in the same few gate delays. Pick operands and watch all four light up
          together.
        </p>
      </motion.section>

      {/* operands */}
      <TryItYourself />
      <div className={`p-5 rounded-3xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Operands</span>
          {PRESETS.map((pp, i) => (
            <button key={i} onClick={() => setPreset(i)} className="px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 transition-all active:scale-95"
              style={{ borderColor: preset === i ? ORANGE : `${ORANGE}44`, background: preset === i ? `${ORANGE}22` : 'transparent', color: preset === i ? ORANGE : `${ORANGE}aa` }}>
              {pp.a}+{pp.b}
            </button>
          ))}
          <button onClick={() => setC0(c0 ^ 1)} className="ml-2 px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 transition-all active:scale-95"
            style={{ borderColor: SKY, background: c0 ? `${SKY}22` : 'transparent', color: SKY }}>C0 = {c0}</button>
        </div>
        <div className={`font-mono text-sm ${textColor}`}>
          {A} + {B}{c0 ? ' + 1' : ''} = <strong style={{ color: EMERALD }}>{result}</strong>
        </div>
      </div>

      {/* G/P row */}
      <div className={`p-5 rounded-3xl border ${cardBg}`}>
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${subText}`}>Step 1 · Generate and Propagate (one gate delay, all at once)</div>
        <div className="flex justify-center gap-6">
          {[3, 2, 1, 0].map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px]" style={{ color: subHex(isDarkMode) }}>bit {i}</span>
              <div className="flex gap-1.5">
                <Pill v={g[i]} color={EMERALD} label={`G${i}`} />
                <Pill v={p[i]} color={SKY} label={`P${i}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* carry equations */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-4 ${subText}`}>Step 2 · All carries, in parallel (no carry depends on another)</div>
        <div className="space-y-2">
          {EQ.map((e) => (
            <div key={e.label} className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-black shrink-0"
                   style={{ background: e.val ? `${ORANGE}22` : 'transparent', border: `2px solid ${e.val ? ORANGE : ORANGE + '55'}`, color: e.val ? ORANGE : ORANGE + '99' }}>{e.val}</div>
              <div className="font-mono text-[12px] md:text-sm min-w-0">
                <span style={{ color: ORANGE }}>{e.label}</span> <span className={subText}>=</span>{' '}
                <span className={textColor}>{e.terms}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center items-end gap-2">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText} self-center mr-1`}>Step 3 · Sum = P ⊕ C</span>
          <Pill v={c[4]} color={EMERALD} label="Cout" />
          {[3, 2, 1, 0].map(i => <Pill key={i} v={sum[i]} color={EMERALD} label={`S${i}`} />)}
          <span className={`font-mono text-sm self-center ml-2 ${textColor}`}>= {result}</span>
        </div>
      </motion.div>

      {/* delay race */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4"><Clock size={15} style={{ color: ORANGE }} /><span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ORANGE }}>The same 4-bit add, two delays</span></div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1"><span className="font-mono text-xs" style={{ color: ROSE }}>Ripple · sequential</span><span className="font-mono text-xs" style={{ color: ROSE }}>~8·ΔG</span></div>
            <div className="flex gap-1">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="flex-1 h-5 rounded" style={{ background: `${ROSE}${i % 2 ? '55' : '88'}` }} />)}</div>
            <p className={`mt-1 text-[11px] font-mono ${subText}`}>C1 then C2 then C3 then C4 - each waits for the last</p>
          </div>
          <div>
            <div className="flex justify-between mb-1"><span className="font-mono text-xs" style={{ color: EMERALD }}>Look-ahead · parallel</span><span className="font-mono text-xs" style={{ color: EMERALD }}>~3·ΔG</span></div>
            <div className="flex gap-1">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="flex-1 h-5 rounded" style={{ background: i < 3 ? EMERALD : (isDarkMode ? '#1e293b' : '#e2e8f0') }} />)}</div>
            <p className={`mt-1 text-[11px] font-mono ${subText}`}>G/P (1ΔG), then all carries together (2ΔG) - and it barely grows with width</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function subHex(dark: boolean) { return dark ? '#94a3b8' : '#64748b'; }

export default S04_Carries;
