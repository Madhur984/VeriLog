import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Play, Pause, StepForward, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

// Kogge-Stone merge distances for an 8-bit example tree (3 levels = log2 8)
const LEVELS = [
  { dist: 1, nodes: [1, 2, 3, 4, 5, 6, 7] },
  { dist: 2, nodes: [2, 3, 4, 5, 6, 7] },
  { dist: 4, nodes: [4, 5, 6, 7] },
];
const COLS = 8;
const WIDTHS = [8, 16, 32, 64];

export const S04_Tree: React.FC<Props> = ({ isDarkMode }) => {
  const [step, setStep] = useState(0); // levels completed (0..3)
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(16);

  const maxStep = LEVELS.length;
  const done = step >= maxStep;
  const levelsNeeded = Math.log2(width);

  useEffect(() => {
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    const id = window.setTimeout(() => setStep((s) => Math.min(maxStep, s + 1)), 1100);
    return () => window.clearTimeout(id);
  }, [playing, step, done, maxStep]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const grey      = isDarkMode ? '#334155' : '#cbd5e1';

  const colX = (c: number) => 34 + c * 56;
  const rowY = (r: number) => 34 + r * 52;
  const span = Math.pow(2, step); // span each node knows after `step` levels

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Network size={14} /> Chapter 05 · The Prefix Network
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The tree that doubles its reach each level</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Watch the carries get computed for 8 columns. At each level, every node merges with one a
          fixed distance away, so the span it knows about doubles: 1, 2, 4. After log₂8 = 3 levels,
          every column knows its full carry. Step through it, then change the width to see the levels barely grow.
        </p>
      </motion.section>

      {/* the tree */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border overflow-x-auto ${cardBg}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: INDIGO }}>8-bit prefix tree (Kogge-Stone)</span>
          <span className="font-mono text-xs" style={{ color: done ? EMERALD : INDIGO }}>
            {done ? 'all carries ready' : `each node knows a span of ${span}`}
          </span>
        </div>
        <svg viewBox="0 0 480 210" className="w-full h-auto min-w-[460px]">
          {/* bit labels */}
          {Array.from({ length: COLS }).map((_, c) => (
            <text key={c} x={colX(c)} y={18} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>b{c}</text>
          ))}
          {/* carry-through vertical lines + merge diagonals */}
          {LEVELS.map((lv, li) => {
            const r = li + 1;
            const active = r === step;
            const doneL = r <= step;
            const stroke = doneL ? (active ? INDIGO : EMERALD) : grey;
            return (
              <g key={li}>
                {Array.from({ length: COLS }).map((_, c) => (
                  <line key={`v${c}`} x1={colX(c)} y1={rowY(r - 1)} x2={colX(c)} y2={rowY(r)} stroke={doneL ? stroke : grey} strokeWidth={doneL ? 2 : 1} opacity={doneL ? 1 : 0.4} />
                ))}
                {lv.nodes.map((i) => (
                  <line key={`d${i}`} x1={colX(i - lv.dist)} y1={rowY(r - 1)} x2={colX(i)} y2={rowY(r)} stroke={doneL ? stroke : grey} strokeWidth={doneL ? 2.4 : 1} opacity={doneL ? 1 : 0.35} />
                ))}
              </g>
            );
          })}
          {/* nodes */}
          {Array.from({ length: LEVELS.length + 1 }).map((_, r) => (
            <g key={r}>
              {Array.from({ length: COLS }).map((_, c) => {
                const isMerge = r > 0 && LEVELS[r - 1].nodes.includes(c);
                const active = r === step && isMerge;
                const reached = r <= step;
                const fill = r === 0 ? (isDarkMode ? '#1e293b' : '#e2e8f0')
                  : active ? INDIGO : reached ? EMERALD : (isDarkMode ? '#1e293b' : '#e2e8f0');
                return (
                  <circle key={c} cx={colX(c)} cy={rowY(r)} r={r === 0 ? 6 : isMerge ? 9 : 5}
                          fill={fill} stroke={r === 0 ? (isDarkMode ? '#475569' : '#94a3b8') : 'none'} strokeWidth="1" />
                );
              })}
            </g>
          ))}
          {/* level labels */}
          <text x={4} y={rowY(0) + 3} fontSize="8" fontFamily="monospace" fill={isDarkMode ? '#64748b' : '#94a3b8'}>G,P</text>
          {LEVELS.map((lv, li) => (
            <text key={li} x={4} y={rowY(li + 1) + 3} fontSize="8" fontFamily="monospace"
                  fill={li + 1 === step ? INDIGO : li + 1 < step ? EMERALD : (isDarkMode ? '#475569' : '#cbd5e1')}>L{li + 1}</text>
          ))}
        </svg>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button onClick={() => { setStep(0); setPlaying(false); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-black uppercase tracking-widest ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} ${textColor}`}><RotateCcw size={14} /> Reset</button>
          <button onClick={() => setPlaying((p) => !p)} disabled={done} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-white disabled:opacity-40" style={{ background: INDIGO }}>{playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}</button>
          <button onClick={() => { setPlaying(false); setStep((s) => Math.min(maxStep, s + 1)); }} disabled={done} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-black disabled:opacity-40" style={{ background: EMERALD }}><StepForward size={14} /> Next level</button>
          <span className={`font-mono text-xs ${subText}`}>{done ? `done in ${maxStep} levels` : `level ${step} of ${maxStep}`}</span>
        </div>
      </motion.div>

      {/* width scaling */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: INDIGO }}>Levels needed as the adder gets wider</span>
          <div className="flex gap-2">
            {WIDTHS.map((w) => (
              <button key={w} onClick={() => setWidth(w)} className="px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 transition-all active:scale-95"
                style={{ borderColor: width === w ? INDIGO : `${INDIGO}44`, background: width === w ? `${INDIGO}22` : 'transparent', color: width === w ? INDIGO : `${INDIGO}aa` }}>{w}-bit</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-3xl font-black" style={{ color: ROSE }}>{width}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: ROSE }}>ripple stages</div>
          </div>
          <div className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-3xl font-black" style={{ color: INDIGO }}>{levelsNeeded}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: INDIGO }}>prefix levels (log₂{width})</div>
          </div>
        </div>
        <p className={`mt-4 text-center text-sm ${subText}`}>
          Doubling the width adds a whole ripple stage for every bit, but only <strong style={{ color: INDIGO }}>one
          extra level</strong> to the prefix tree. That is the logarithm at work.
        </p>
      </motion.div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl border-2 text-center" style={{ borderColor: `${EMERALD}80`, background: `${EMERALD}12` }}>
          <CheckCircle2 size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
          <h4 className={`text-lg font-black ${textColor}`}>Every carry, in log₂N levels.</h4>
          <p className={`mt-1 text-sm max-w-2xl mx-auto ${subText}`}>
            Once the prefixes are known, the sum is one more XOR: Sᵢ = Pᵢ ⊕ Cᵢ. Three levels for 8
            bits, six for 64 - the carries never ripple, they cascade down a shallow tree.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default S04_Tree;
