import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DraftingCompass, ChevronLeft, ChevronRight, Box, Hammer } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const CYAN = '#22d3ee';

const STEPS = [
  { title: 'Place the inputs',  desc: 'Two bits arrive from outside: A and B. In hardware these are just two wires that are either high (1) or low (0).' },
  { title: 'The Sum wire: XOR', desc: 'Wire A and B into an XOR gate. Its output answers "exactly one?" - that is the Sum.' },
  { title: 'The Carry wire: AND', desc: 'The SAME A and B fan out into an AND gate too - see the junction dots where the wires split. Its output answers "both?" - that is the Carry.' },
  { title: 'Test the blueprint', desc: 'The finished half adder. Toggle A and B - both gates read the same inputs at the same time and compute in parallel.' },
];

export const S09_Blueprint: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle    = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ink     = isDarkMode ? '#e2e8f0' : '#0f172a';

  const [step, setStep] = useState(0);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const live = step >= 3;          // toggles only on the last step
  const va = live ? a : true;      // during build steps show static example signals
  const vb = live ? b : false;
  const s = va !== vb;
  const c = va && vb;

  const showXor = step >= 1;
  const showAnd = step >= 2;

  const wire = (on: boolean, base: string) => (live ? (on ? base : idle) : base);
  const glow = (on: boolean, base: string) => (live && on ? `drop-shadow(0 0 6px ${base})` : 'none');

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <DraftingCompass size={14} /> Chapter 08 · Wiring the Blueprint
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Two gates. Four wires in. <span style={{ color: EMERALD }}>One adder.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Assemble the half adder one step at a time. This exact diagram is what you will
          build for real in the final chapter.
        </p>
      </section>

      {/* ── builder ── */}
      <div><TryItYourself /></div>
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        {/* step header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(v => Math.max(0, v - 1))} disabled={step === 0}
              className={`p-2 rounded-xl border transition-all ${step === 0 ? 'opacity-30' : 'hover:scale-105'} ${isDarkMode ? 'border-white/15' : 'border-slate-300'}`}>
              <ChevronLeft size={16} className={textColor} />
            </button>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => setStep(i)}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ background: i <= step ? EMERALD : idle, transform: i === step ? 'scale(1.4)' : 'none' }} />
              ))}
            </div>
            <button onClick={() => setStep(v => Math.min(STEPS.length - 1, v + 1))} disabled={step === STEPS.length - 1}
              className={`p-2 rounded-xl border transition-all ${step === STEPS.length - 1 ? 'opacity-30' : 'hover:scale-105'} ${isDarkMode ? 'border-white/15' : 'border-slate-300'}`}>
              <ChevronRight size={16} className={textColor} />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <span className="font-mono text-[10px] uppercase tracking-widest mr-2" style={{ color: EMERALD }}>
                Step {step + 1} / {STEPS.length}
              </span>
              <span className={`font-bold ${textColor}`}>{STEPS[step].title}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* schematic / black box */}
        {!collapsed ? (
          <svg viewBox="0 0 520 250" className="w-full max-w-3xl mx-auto h-auto">
            {/* inputs */}
            {([['A', va, 70], ['B', vb, 180]] as const).map(([label, on, y]) => (
              <g key={label} style={{ cursor: live ? 'pointer' : 'default' }}
                 onClick={() => live && (label === 'A' ? setA(v => !v) : setB(v => !v))}>
                <rect x={14} y={y - 19} width={48} height={38} rx={9}
                      fill={live && on ? EMERALD : 'none'} stroke={live ? EMERALD : ink} strokeWidth="2.5"
                      style={{ filter: live && on ? `drop-shadow(0 0 9px ${EMERALD})` : 'none' }} />
                <text x={38} y={y - 1} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold"
                      fill={live ? (on ? '#000' : EMERALD) : ink}>{label}</text>
                <text x={38} y={y + 12} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
                      fill={live ? (on ? '#000' : EMERALD) : ink}>{live ? (on ? 1 : 0) : ''}</text>
              </g>
            ))}

            {/* A wires: to XOR and (via junction) to AND */}
            {showXor && (
              <>
                <line x1={62} y1={70} x2={196} y2={70} stroke={wire(va, CYAN)} strokeWidth="3" style={{ filter: glow(va, CYAN) }} />
                <line x1={62} y1={180} x2={196} y2={180} stroke={wire(vb, CYAN)} strokeWidth="3" style={{ filter: glow(vb, CYAN) }} />
                <line x1={196} y1={70} x2={196} y2={60} stroke={wire(va, CYAN)} strokeWidth="3" style={{ filter: glow(va, CYAN) }} />
                <line x1={196} y1={60} x2={222} y2={60} stroke={wire(va, CYAN)} strokeWidth="3" style={{ filter: glow(va, CYAN) }} />
                <line x1={196} y1={180} x2={196} y2={88} stroke={wire(vb, CYAN)} strokeWidth="3" style={{ filter: glow(vb, CYAN) }} />
                <line x1={196} y1={88} x2={222} y2={88} stroke={wire(vb, CYAN)} strokeWidth="3" style={{ filter: glow(vb, CYAN) }} />
              </>
            )}
            {showAnd && (
              <>
                {/* junction dots: the fan-out */}
                <circle cx={120} cy={70} r={4.5} fill={wire(va, AMBER)} />
                <circle cx={150} cy={180} r={4.5} fill={wire(vb, AMBER)} />
                <line x1={120} y1={70} x2={120} y2={152} stroke={wire(va, AMBER)} strokeWidth="3" style={{ filter: glow(va, AMBER) }} />
                <line x1={120} y1={152} x2={222} y2={152} stroke={wire(va, AMBER)} strokeWidth="3" style={{ filter: glow(va, AMBER) }} />
                <line x1={150} y1={180} x2={222} y2={180} stroke={wire(vb, AMBER)} strokeWidth="3" style={{ filter: glow(vb, AMBER) }} />
              </>
            )}

            {/* XOR gate */}
            {showXor && (
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                <path d="M 216 48 Q 232 74 216 100" fill="none" stroke={CYAN} strokeWidth="2.5" />
                <path d="M 224 48 Q 240 74 224 100 Q 258 100 280 74 Q 258 48 224 48 Z"
                      fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
                <text x={247} y={78} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={CYAN}>XOR</text>
                <line x1={280} y1={74} x2={400} y2={74} stroke={wire(s, CYAN)} strokeWidth="3" style={{ filter: glow(s, CYAN) }} />
                <circle cx={418} cy={74} r={14} fill={live && s ? CYAN : 'none'} stroke={live ? CYAN : ink} strokeWidth="2.5"
                        style={{ filter: live && s ? `drop-shadow(0 0 12px ${CYAN})` : 'none' }} />
                <text x={448} y={70} fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Sum</text>
                <text x={448} y={84} fontSize="11" fontFamily="monospace" fill={CYAN}>{live ? `= ${s ? 1 : 0}` : ''}</text>
              </motion.g>
            )}

            {/* AND gate */}
            {showAnd && (
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                <path d="M 222 138 L 222 194 L 248 194 Q 282 194 282 166 Q 282 138 248 138 Z"
                      fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
                <text x={249} y={170} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={AMBER}>AND</text>
                <line x1={282} y1={166} x2={400} y2={166} stroke={wire(c, AMBER)} strokeWidth="3" style={{ filter: glow(c, AMBER) }} />
                <circle cx={418} cy={166} r={14} fill={live && c ? AMBER : 'none'} stroke={live ? AMBER : ink} strokeWidth="2.5"
                        style={{ filter: live && c ? `drop-shadow(0 0 12px ${AMBER})` : 'none' }} />
                <text x={448} y={162} fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>Cout</text>
                <text x={448} y={176} fontSize="11" fontFamily="monospace" fill={AMBER}>{live ? `= ${c ? 1 : 0}` : ''}</text>
              </motion.g>
            )}
          </svg>
        ) : (
          /* black box view */
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
            <svg viewBox="0 0 520 180" className="w-full max-w-2xl mx-auto h-auto">
              <line x1={60} y1={70} x2={185} y2={70} stroke={ink} strokeWidth="3" />
              <line x1={60} y1={110} x2={185} y2={110} stroke={ink} strokeWidth="3" />
              <text x={48} y={74} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>A</text>
              <text x={48} y={114} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>B</text>
              <rect x={185} y={36} width={150} height={110} rx={16} fill={boxFill} stroke={EMERALD} strokeWidth="3"
                    style={{ filter: `drop-shadow(0 0 14px ${EMERALD}44)` }} />
              <text x={260} y={98} textAnchor="middle" fontSize="30" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>HA</text>
              <line x1={335} y1={70} x2={460} y2={70} stroke={ink} strokeWidth="3" />
              <line x1={335} y1={110} x2={460} y2={110} stroke={ink} strokeWidth="3" />
              <text x={470} y={74} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Sum</text>
              <text x={470} y={114} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Cout</text>
            </svg>
          </motion.div>
        )}

        {/* step caption + live controls */}
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`text-sm text-center max-w-2xl mx-auto mt-2 ${subText}`}>
            {STEPS[step].desc}
          </motion.p>
        </AnimatePresence>
        {live && !collapsed && (
          <p className="text-center text-xs font-mono mt-2" style={{ color: EMERALD }}>
            click the A / B pads on the diagram to toggle them
          </p>
        )}
      </div>

      {/* ── fan-out note + black box ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>
            The fan-out trick
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Notice the junction dots: input A feeds <strong className={textColor}>both gates at
            once</strong>, and so does B. Electrical signals copy for free - a wire can split and
            deliver the same bit to as many gates as you like. The XOR and the AND read the
            same question paper simultaneously and answer different questions about it.
          </p>
        </div>
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${EMERALD}44`, background: `${EMERALD}08` }}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: EMERALD }}>
            <Box size={13} /> The black box move
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Once the physical rules are engineered correctly, we wrap the wiring in a block
            stamped <strong style={{ color: EMERALD }}>HA</strong> and stop thinking about the gates inside -
            "we just trust the block does the addition." That trust has a name:
            <strong className={textColor}> abstraction</strong>, the most important idea in hardware design.
          </p>
          <button onClick={() => setCollapsed(v => !v)}
            className="mt-3 px-4 py-2 rounded-xl border-2 font-mono text-[11px] font-black transition-all active:scale-95"
            style={{ borderColor: EMERALD, color: collapsed ? '#000' : EMERALD, background: collapsed ? EMERALD : 'transparent' }}>
            {collapsed ? 'Show the wiring again' : 'Collapse into the black box'}
          </button>
        </div>
      </div>

      <p className={`text-sm text-center ${subText}`}>
        <Hammer size={13} className="inline mr-1 -mt-0.5" style={{ color: AMBER }} />
        Keep this diagram in your head: in the final chapter you will rebuild it gate by gate,
        wire by wire, in the live workbench.
      </p>
    </div>
  );
};
