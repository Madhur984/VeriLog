import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, MousePointerClick, RotateCcw, Zap, Database } from 'lucide-react';

interface Props { isDarkMode: boolean; }

const CYAN = '#22d3ee';
const EMERALD = '#34d399';

export const S02_TwoFlavors: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  const wireFor = (on: boolean, accent: string) => (on ? accent : idle);
  const glowFor = (on: boolean, accent: string) => (on ? `drop-shadow(0 0 5px ${accent})` : 'none');

  // Top machine · combinational straight pipe
  const [inOn, setInOn] = useState(false);
  const [combPulse, setCombPulse] = useState(0);

  // Bottom machine · sequential pipe with a loop
  const [seqPulse, setSeqPulse] = useState(0);
  const [count, setCount] = useState(0);

  const held = count > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <GitBranch size={14} /> Chapter 02 · Two Flavors of Logic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Same pipe. One has a loop.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Click both machines. The top one reacts and forgets. The bottom one reacts and remembers.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* ── REACT TO NOW · combinational ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
              <Zap size={13} /> React to NOW
            </div>
            <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                  style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
              COMBINATIONAL
            </span>
          </div>

          <svg viewBox="0 0 460 230" className="w-full h-auto">
            {/* IN pad */}
            <rect x="14" y="53" width="52" height="44" rx="10"
                  fill={inOn ? CYAN : 'none'} stroke={CYAN} strokeWidth="2.5"
                  style={{ filter: inOn ? `drop-shadow(0 0 10px ${CYAN})` : 'none' }} />
            <text x="40" y="71" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={inOn ? '#000' : CYAN}>IN</text>
            <text x="40" y="88" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={inOn ? '#000' : CYAN}>{inOn ? 1 : 0}</text>

            {/* straight pipe */}
            <line x1="66" y1="75" x2="180" y2="75" stroke={wireFor(inOn, CYAN)} strokeWidth="3" style={{ filter: glowFor(inOn, CYAN) }} />
            <rect x="180" y="45" width="100" height="60" rx="10" fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
            <text x="230" y="71" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>LOGIC</text>
            <text x="230" y="88" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={CYAN} opacity="0.6">gates only</text>
            <line x1="280" y1="75" x2="399" y2="75" stroke={wireFor(inOn, CYAN)} strokeWidth="3" style={{ filter: glowFor(inOn, CYAN) }} />

            {/* output lamp */}
            <circle cx="415" cy="75" r="16" fill={inOn ? CYAN : 'none'} stroke={CYAN} strokeWidth="2.5"
                    style={{ filter: inOn ? `drop-shadow(0 0 14px ${CYAN})` : 'none' }} />
            <text x="415" y="112" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN} opacity="0.7">OUT = {inOn ? 1 : 0}</text>

            {/* ghost: where memory WOULD live · deliberately empty */}
            <rect x="205" y="142" width="130" height="58" rx="10" fill="none"
                  stroke={idle} strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
            <text x="270" y="176" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={idle}>no storage here</text>

            {/* travelling pulse */}
            {combPulse > 0 && (
              <motion.g
                key={`cp-${combPulse}`}
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 349, opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <circle cx="66" cy="75" r="6" fill={CYAN} style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />
              </motion.g>
            )}
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Toggle the input · the pulse shoots straight through
          </div>
          <button
            onClick={() => { setInOn(v => !v); setCombPulse(k => k + 1); }}
            className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 self-start min-w-[140px] active:scale-95"
            style={{
              borderColor: CYAN,
              color: inOn ? '#000' : CYAN,
              backgroundColor: inOn ? CYAN : 'transparent',
              boxShadow: inOn ? `0 0 25px ${CYAN}55` : 'none',
            }}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-80">Input</span>
            <span className="text-lg">IN = {inOn ? 1 : 0}</span>
          </button>

          <p className={`text-sm ${subText} mt-auto`}>
            <strong style={{ color: CYAN }}>Memoryless:</strong> Out copies In the instant it changes.
            Switch off, and it is as if nothing ever happened.
          </p>
        </motion.div>

        {/* ── REMEMBER THEN · sequential ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
              <Database size={13} /> Remember THEN
            </div>
            <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                  style={{ borderColor: `${EMERALD}55`, color: EMERALD, background: `${EMERALD}10` }}>
              SEQUENTIAL
            </span>
          </div>

          <svg viewBox="0 0 460 230" className="w-full h-auto">
            {/* IN pad */}
            <rect x="14" y="53" width="52" height="44" rx="10" fill="none" stroke={EMERALD} strokeWidth="2.5" />
            <text x="40" y="71" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>IN</text>
            <text x="40" y="88" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>+1</text>

            {/* pipe into logic */}
            <line x1="66" y1="75" x2="180" y2="75" stroke={idle} strokeWidth="3" />
            <rect x="180" y="45" width="100" height="60" rx="10" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
            <text x="230" y="71" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>LOGIC</text>
            <text x="230" y="88" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={EMERALD} opacity="0.6">new + stored</text>

            {/* out wire + junction */}
            <line x1="280" y1="75" x2="399" y2="75" stroke={wireFor(held, EMERALD)} strokeWidth="3" style={{ filter: glowFor(held, EMERALD) }} />
            <circle cx="330" cy="75" r="3.5" fill={wireFor(held, EMERALD)} />

            {/* output lamp */}
            <circle cx="415" cy="75" r="16" fill={held ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2.5"
                    style={{ filter: held ? `drop-shadow(0 0 14px ${EMERALD})` : 'none' }} />
            <text x="415" y="112" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD} opacity="0.8">OUT = {count}</text>

            {/* feedback loop · down into storage, back up into logic */}
            <line x1="330" y1="75" x2="330" y2="142" stroke={wireFor(held, EMERALD)} strokeWidth="2.5" style={{ filter: glowFor(held, EMERALD) }} />
            <polygon points="324,130 336,130 330,140" fill={wireFor(held, EMERALD)} />

            <rect x="205" y="142" width="130" height="58" rx="10" fill={boxFill} stroke={EMERALD} strokeWidth="2.5"
                  style={{ filter: held ? `drop-shadow(0 0 8px ${EMERALD}66)` : 'none' }} />
            <text x="270" y="160" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD} opacity="0.8">STORAGE</text>
            <motion.text
              key={count}
              initial={{ opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              x="270" y="188" textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="bold"
              fill={EMERALD}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              {count}
            </motion.text>

            <line x1="205" y1="171" x2="140" y2="171" stroke={wireFor(held, EMERALD)} strokeWidth="2.5" style={{ filter: glowFor(held, EMERALD) }} />
            <line x1="140" y1="171" x2="140" y2="90" stroke={wireFor(held, EMERALD)} strokeWidth="2.5" style={{ filter: glowFor(held, EMERALD) }} />
            <line x1="140" y1="90" x2="180" y2="90" stroke={wireFor(held, EMERALD)} strokeWidth="2.5" style={{ filter: glowFor(held, EMERALD) }} />
            <polygon points="170,84 170,96 180,90" fill={wireFor(held, EMERALD)} />
            <text x="120" y="135" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD} opacity="0.6">fed back</text>

            {/* travelling pulse · into the storage box */}
            {seqPulse > 0 && (
              <motion.g
                key={`sp-${seqPulse}`}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: [0, 264, 264, 204], y: [0, 0, 96, 96], opacity: [1, 1, 1, 0] }}
                transition={{ duration: 1, times: [0, 0.45, 0.75, 1], ease: 'easeInOut' }}
              >
                <circle cx="66" cy="75" r="6" fill={EMERALD} style={{ filter: `drop-shadow(0 0 6px ${EMERALD})` }} />
              </motion.g>
            )}
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Send pulses · the box keeps the running total
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSeqPulse(k => k + 1); setCount(c => c + 1); }}
              className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[140px] active:scale-95"
              style={{ borderColor: EMERALD, color: EMERALD, boxShadow: held ? `0 0 25px ${EMERALD}33` : 'none' }}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-80">Input</span>
              <span className="text-lg">SEND +1</span>
            </button>
            <button
              onClick={() => setCount(0)}
              className={`px-4 py-3 rounded-xl border-2 font-mono text-xs font-black transition-all flex items-center gap-2 active:scale-95 ${subText}`}
              style={{ borderColor: idle }}
            >
              <RotateCcw size={13} /> CLEAR
            </button>
          </div>

          <p className={`text-sm ${subText} mt-auto`}>
            <strong style={{ color: EMERALD }}>Stored memory:</strong> each pulse lands on top of the total
            already in the box. The past changes the answer.
          </p>
        </motion.div>
      </div>

      {/* ── the two one-liners ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="p-5 rounded-2xl border-2" style={{ borderColor: `${CYAN}55`, background: `${CYAN}10` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: CYAN }}>
            Combinational
          </div>
          <p className={`text-sm font-bold ${textColor}`}>
            No memory. A straight pipe. Output depends on NOW only.
          </p>
        </div>
        <div className="p-5 rounded-2xl border-2" style={{ borderColor: `${EMERALD}55`, background: `${EMERALD}10` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: EMERALD }}>
            Sequential
          </div>
          <p className={`text-sm font-bold ${textColor}`}>
            Stored memory. A pipe with a loop. Output depends on NOW plus THEN.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
