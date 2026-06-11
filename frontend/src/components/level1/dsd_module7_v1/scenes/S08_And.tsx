import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircuitBoard, MousePointerClick, BadgeCheck, Box, Sigma, Table2 } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';

export const S08_And: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const woodStroke = isDarkMode ? '#c4956c' : '#8b5e3c';
  const woodFill   = isDarkMode ? '#5b3d2a33' : '#a9826033';
  const rowBg      = isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50';

  const [aOn, setAOn] = useState(false);
  const [bOn, setBOn] = useState(false);
  const cOn = aOn && bOn;

  const wireFor = (on: boolean, accent: string) => (on ? accent : idle);
  const glowFor = (on: boolean, accent: string) => (on ? `drop-shadow(0 0 5px ${accent})` : 'none');

  const activeRow = (aOn ? 2 : 0) + (bOn ? 1 : 0);
  const miniRows: Array<[number, number, number]> = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ];

  const pairRows = [
    { a: 0, b: 0, s: 0, c: 0 },
    { a: 0, b: 1, s: 1, c: 0 },
    { a: 1, b: 0, s: 1, c: 0 },
    { a: 1, b: 1, s: 0, c: 1 },
  ];

  const matrixRows = [
    { analogy: 'Single item in the bowl', math: '1 + 0 = 1', hardware: 'XOR triggers the Sum wire', accent: CYAN },
    { analogy: 'Overflow into the tray', math: '1 + 1 = 10', hardware: 'AND triggers the Carry wire', accent: EMERALD },
  ];

  const toggleStyle = (on: boolean) => ({
    borderColor: EMERALD,
    color: on ? '#000' : EMERALD,
    backgroundColor: on ? EMERALD : 'transparent',
    boxShadow: on ? `0 0 25px ${EMERALD}55` : 'none',
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── header ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <CircuitBoard size={14} /> Chapter 07 · The Carry Wire: AND
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          AND asks one question: did BOTH arrive?
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          XOR already answered the Sum. One wire in the box is still dark: the overflow. The
          <strong style={{ color: EMERALD }}> AND gate</strong> - a logic gate that outputs a 1 ONLY
          if both Input A AND Input B are active simultaneously - watches for the single event that
          can flood the bowl. Press the buttons and try to overwhelm it.
        </p>
      </section>

      {/* ── interactive playground ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg} space-y-6`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
            <CircuitBoard size={13} /> Gate Playground
          </div>
          <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                style={{ borderColor: `${EMERALD}55`, color: EMERALD, background: `${EMERALD}10` }}>
            AND · THE CARRY WIRE
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.6fr,1fr] gap-6 items-center">
          {/* the machine */}
          <div className="space-y-4">
            <svg viewBox="0 0 500 250" className="w-full h-auto">
              <defs>
                <radialGradient id="s08AndMarble" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </radialGradient>
              </defs>

              {/* input pad A */}
              <rect x="16" y="42" width="52" height="44" rx="10"
                    fill={aOn ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2.5"
                    style={{ filter: aOn ? `drop-shadow(0 0 10px ${EMERALD})` : 'none' }} />
              <text x="42" y="60" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={aOn ? '#000' : EMERALD}>A</text>
              <text x="42" y="78" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={aOn ? '#000' : EMERALD}>{aOn ? 1 : 0}</text>

              {/* input pad B */}
              <rect x="16" y="156" width="52" height="44" rx="10"
                    fill={bOn ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2.5"
                    style={{ filter: bOn ? `drop-shadow(0 0 10px ${EMERALD})` : 'none' }} />
              <text x="42" y="174" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={bOn ? '#000' : EMERALD}>B</text>
              <text x="42" y="192" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={bOn ? '#000' : EMERALD}>{bOn ? 1 : 0}</text>

              {/* wire from A */}
              <polyline points="68,64 120,64 120,105 210,105" fill="none"
                        stroke={wireFor(aOn, EMERALD)} strokeWidth="3"
                        style={{ filter: glowFor(aOn, EMERALD) }} />
              {/* wire from B */}
              <polyline points="68,178 120,178 120,145 210,145" fill="none"
                        stroke={wireFor(bOn, EMERALD)} strokeWidth="3"
                        style={{ filter: glowFor(bOn, EMERALD) }} />

              {/* AND gate · D-shaped symbol */}
              <path d="M 210 85 L 255 85 A 40 40 0 0 1 255 165 L 210 165 Z"
                    fill={boxFill} stroke={EMERALD} strokeWidth="2.5"
                    style={{ filter: cOn ? `drop-shadow(0 0 10px ${EMERALD}88)` : 'none' }} />
              <text x="247" y="121" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>AND</text>
              <text x="247" y="138" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={EMERALD} opacity="0.6">both or nothing</text>

              {/* output wire */}
              <line x1="295" y1="125" x2="370" y2="125"
                    stroke={wireFor(cOn, AMBER)} strokeWidth="3"
                    style={{ filter: glowFor(cOn, AMBER) }} />

              {/* output lamp C */}
              <circle cx="392" cy="125" r="20" fill="none" stroke={AMBER} strokeWidth="2.5"
                      opacity={cOn ? 1 : 0.55}
                      style={{ filter: cOn ? `drop-shadow(0 0 16px ${AMBER})` : 'none' }} />
              {cOn && (
                <motion.circle
                  key="carry-marble"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  cx="392" cy="125" r="15" fill="url(#s08AndMarble)"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              )}
              <text x="392" y="170" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={AMBER} opacity={cOn ? 1 : 0.7}>
                C = {cOn ? 1 : 0}
              </text>
              <text x="392" y="184" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER} opacity="0.6">CARRY</text>
              {cOn && (
                <motion.text
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  x="392" y="92" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}
                >
                  OVERFLOW
                </motion.text>
              )}
            </svg>

            <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
              <MousePointerClick size={12} /> Toggle the inputs · the carry marble appears only on 1 AND 1
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setAOn(v => !v)}
                className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[120px] active:scale-95"
                style={toggleStyle(aOn)}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-80">Input A</span>
                <span className="text-lg">A = {aOn ? 1 : 0}</span>
              </button>
              <button
                onClick={() => setBOn(v => !v)}
                className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[120px] active:scale-95"
                style={toggleStyle(bOn)}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-80">Input B</span>
                <span className="text-lg">B = {bOn ? 1 : 0}</span>
              </button>
            </div>
          </div>

          {/* live mini truth table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
              <Table2 size={13} /> Live Truth Table
            </div>
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <div className={`grid grid-cols-3 text-center font-mono text-[10px] uppercase tracking-widest py-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span style={{ color: EMERALD }}>A</span>
                <span style={{ color: EMERALD }}>B</span>
                <span style={{ color: AMBER }}>C</span>
              </div>
              {miniRows.map(([a, b, c], i) => {
                const active = i === activeRow;
                return (
                  <div
                    key={`${a}${b}`}
                    className="grid grid-cols-3 text-center font-mono text-sm font-bold py-2 border-t transition-colors"
                    style={{
                      borderColor: isDarkMode ? '#ffffff1a' : '#e2e8f0',
                      background: active ? (c ? `${AMBER}1f` : `${EMERALD}1f`) : 'transparent',
                      boxShadow: active ? `inset 3px 0 0 ${c ? AMBER : EMERALD}` : 'none',
                    }}
                  >
                    <span className={active ? textColor : subText}>{a}</span>
                    <span className={active ? textColor : subText}>{b}</span>
                    <span style={{ color: c ? AMBER : undefined }} className={c ? '' : (active ? textColor : subText)}>{c}</span>
                  </div>
                );
              })}
            </div>
            <p className={`text-xs ${subText}`}>
              Three rows stay silent. Only the 1,1 row - the overflow state - lights the carry.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── rule · analogy · formula ── */}
      <div className="grid md:grid-cols-3 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border ${cardBg} flex flex-col gap-3`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
            <BadgeCheck size={13} /> The Rule
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            AND outputs a 1 <strong style={{ color: EMERALD }}>ONLY when both A and B are active
            simultaneously</strong>. One input alone is not enough. Zero inputs, nothing. It ignores
            every situation except total agreement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl border ${cardBg} flex flex-col gap-3`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: AMBER }}>
            <Box size={13} /> The Analogy
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            AND is the <strong style={{ color: AMBER }}>overflow tray</strong> of the wooden box: it
            only receives a sphere when the system is overwhelmed by receiving both inputs at the
            exact same time.
          </p>
          <svg viewBox="0 0 220 90" className="w-full h-auto mt-auto">
            <defs>
              <radialGradient id="s08TrayMarble" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>
            {/* slide-out wooden carry tray */}
            <path d="M 34 38 L 34 70 L 186 70 L 186 38" fill={woodFill} stroke={woodStroke} strokeWidth="3" strokeLinejoin="round" />
            {/* tray handle */}
            <rect x="98" y="74" width="24" height="5" rx="2.5" fill={woodStroke} opacity="0.7" />
            {/* the carried marble */}
            <circle cx="110" cy="52" r="13" fill="url(#s08TrayMarble)" style={{ filter: `drop-shadow(0 0 6px ${AMBER}66)` }} />
            <text x="110" y="22" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={woodStroke} letterSpacing="2">CARRY TRAY</text>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border ${cardBg} flex flex-col gap-3`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
            <Sigma size={13} /> The Formula
          </div>
          <div className="px-4 py-5 rounded-2xl border-2 text-center"
               style={{ borderColor: `${EMERALD}55`, background: `${EMERALD}10` }}>
            <span className="font-mono text-2xl font-black" style={{ color: EMERALD }}>C = A · B</span>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            The dot is Boolean AND - multiply the bits. Engineers often drop the dot and simply
            write <span className="font-mono font-bold" style={{ color: EMERALD }}>AB</span>. Either
            way: only 1 · 1 gives 1.
          </p>
        </motion.div>
      </div>

      {/* ── pairing · two gates, one box ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Table2 size={14} /> Two Gates, One Box
        </div>
        <div className={`p-6 md:p-8 rounded-3xl border ${cardBg} space-y-6`}>
          <p className={`text-sm max-w-3xl ${subText}`}>
            Look at the full truth table of the box one more time. It has two answer columns - and
            each column now belongs to exactly one gate.
          </p>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* split-ownership truth table */}
            <div className="space-y-3">
              <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className={`grid grid-cols-4 text-center font-mono text-[10px] uppercase tracking-widest py-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <span className={subText}>A</span>
                  <span className={subText}>B</span>
                  <span style={{ color: CYAN }}>Sum</span>
                  <span style={{ color: EMERALD }}>Cout</span>
                </div>
                {pairRows.map(({ a, b, s, c }) => (
                  <div key={`p${a}${b}`}
                       className="grid grid-cols-4 text-center font-mono text-sm font-bold py-2 border-t"
                       style={{ borderColor: isDarkMode ? '#ffffff1a' : '#e2e8f0' }}>
                    <span className={subText}>{a}</span>
                    <span className={subText}>{b}</span>
                    <span style={{ color: CYAN, background: `${CYAN}0d` }}>{s}</span>
                    <span style={{ color: EMERALD, background: `${EMERALD}0d` }}>{c}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                      style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
                  SUM COLUMN · S = A ⊕ B · XOR
                </span>
                <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                      style={{ borderColor: `${EMERALD}55`, color: EMERALD, background: `${EMERALD}10` }}>
                  COUT COLUMN · C = A · B · AND
                </span>
              </div>
            </div>

            {/* translation matrix */}
            <div className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: AMBER }}>
                Translation Matrix
              </div>
              <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className={`grid grid-cols-3 text-center font-mono text-[10px] uppercase tracking-widest py-2 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <span style={{ color: AMBER }}>Analogy</span>
                  <span className={subText}>Math</span>
                  <span style={{ color: EMERALD }}>Hardware</span>
                </div>
                {matrixRows.map(({ analogy, math, hardware, accent }) => (
                  <div key={analogy}
                       className="grid grid-cols-3 text-center items-center py-3 px-2 border-t gap-1"
                       style={{ borderColor: isDarkMode ? '#ffffff1a' : '#e2e8f0' }}>
                    <span className={`text-xs ${subText}`}>{analogy}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: accent }}>{math}</span>
                    <span className={`text-xs font-bold ${textColor}`}>{hardware}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${subText}`}>
                Gravity and glass on the left, binary arithmetic in the middle, electricity on the
                right - three languages, one identical behavior.
              </p>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border ${rowBg}`}>
            <span className="shrink-0 px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest self-start sm:self-auto"
                  style={{ borderColor: `${AMBER}55`, color: AMBER, background: `${AMBER}10` }}>
              FULLY TRANSLATED
            </span>
            <p className={`text-sm font-bold ${textColor}`}>
              Two gates, two questions, one box fully translated. XOR watches the bowl; AND watches
              the tray. Next: wire them together.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
