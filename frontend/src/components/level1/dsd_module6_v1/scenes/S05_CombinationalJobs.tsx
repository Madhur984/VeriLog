import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, BookOpen, Boxes, Lightbulb, MousePointerClick, Shuffle, Sigma } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

type Bit = 0 | 1;

interface Props { isActive?: boolean; isDarkMode: boolean; }

const CYAN = '#22d3ee';
const AMBER = '#fbbf24';
const EMERALD = '#34d399';
const LANE_A = '#22d3ee';
const LANE_B = '#f472b6';

const BitBtn: React.FC<{ label: string; v: Bit; color: string; onClick: () => void }> = ({ label, v, color, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-2.5 rounded-xl border-2 font-mono font-black text-sm transition-all active:scale-95 min-w-[58px]"
    style={{
      borderColor: color,
      color: v ? '#000' : color,
      backgroundColor: v ? color : 'transparent',
      boxShadow: v ? `0 0 16px ${color}55` : 'none',
    }}
  >
    {label}={v}
  </button>
);

export const S05_CombinationalJobs: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const defBg     = isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200';
  const dimWire   = isDarkMode ? '#475569' : '#cbd5e1';
  const panelFill = isDarkMode ? '#0a0e1a' : '#fff';

  const TermChip: React.FC<{ t: string; color: string }> = ({ t, color }) => (
    <span className="font-mono text-[10px] font-bold px-3 py-1.5 rounded-full border"
          style={{ borderColor: `${color}55`, color, background: `${color}0d` }}>
      {t}
    </span>
  );

  // ── ADDER state ──
  const [a1, setA1] = useState<Bit>(0);
  const [a0, setA0] = useState<Bit>(1);
  const [b1, setB1] = useState<Bit>(1);
  const [b0, setB0] = useState<Bit>(0);
  const aVal = a1 * 2 + a0;
  const bVal = b1 * 2 + b0;
  const sum = aVal + bVal;
  const sumBits: Bit[] = [((sum >> 2) & 1) as Bit, ((sum >> 1) & 1) as Bit, (sum & 1) as Bit];

  // ── MUX state ──
  const [sel, setSel] = useState<Bit>(0);
  const outColor = sel === 0 ? LANE_A : LANE_B;

  // ── DECODER state ──
  const [d1, setD1] = useState<Bit>(1);
  const [d0, setD0] = useState<Bit>(0);
  const line = d1 * 2 + d0;

  const flow = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isActive ? { opacity: 1, y: 0 } : {},
    transition: { delay: 0.1 + i * 0.1 },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: CYAN }}>
          <Boxes size={14} /> Chapter 05 · Real Combinational Jobs
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Adders, MUX and friends.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three workers, zero memory. Flip an input and watch each one answer instantly.
        </p>
      </section>

      {/* ── JOB 01 · ADDER ───────────────────────────────────────── */}
      <TryItYourself />
      <motion.div {...flow(0)} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: CYAN }}>
          <Sigma size={13} /> Job 01 · Adder · math the instant you flip a bit
        </div>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mt-4">
          {/* Inputs */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black w-14" style={{ color: CYAN }}>A = {aVal}</span>
              <BitBtn label="A₁" v={a1} color={CYAN} onClick={() => setA1(a1 ? 0 : 1)} />
              <BitBtn label="A₀" v={a0} color={CYAN} onClick={() => setA0(a0 ? 0 : 1)} />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black w-14" style={{ color: CYAN }}>B = {bVal}</span>
              <BitBtn label="B₁" v={b1} color={CYAN} onClick={() => setB1(b1 ? 0 : 1)} />
              <BitBtn label="B₀" v={b0} color={CYAN} onClick={() => setB0(b0 ? 0 : 1)} />
            </div>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${subText}`}>
              <MousePointerClick size={11} /> two 2-bit numbers, 0 to 3 each
            </div>
          </div>

          {/* Sigma core */}
          <motion.div
            key={sum}
            initial={{ scale: 0.85 }} animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl border-2 grid place-items-center font-black text-3xl mx-auto"
            style={{ borderColor: CYAN, color: CYAN, background: `${CYAN}10`, boxShadow: `0 0 30px ${CYAN}33` }}
          >
            +
          </motion.div>

          {/* Sum lamps */}
          <div>
            <div className="flex items-end gap-3 justify-center md:justify-start">
              {sumBits.map((bit, i) => {
                const w = ['2²', '2¹', '2⁰'][i];
                return (
                  <div key={w} className="flex flex-col items-center gap-1.5">
                    <span className="font-mono text-[10px] opacity-50">{w}</span>
                    <motion.div
                      animate={{
                        backgroundColor: bit ? CYAN : 'transparent',
                        boxShadow: bit ? `0 0 22px ${CYAN}88` : '0 0 0px transparent',
                      }}
                      className="w-12 h-12 rounded-xl border-2 grid place-items-center font-mono font-black text-lg"
                      style={{ borderColor: bit ? CYAN : dimWire, color: bit ? '#000' : dimWire }}
                    >
                      {bit}
                    </motion.div>
                  </div>
                );
              })}
              <motion.div key={`d${sum}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`font-black text-4xl ml-2 ${textColor}`}>
                = {sum}
              </motion.div>
            </div>
            <div className="font-mono text-[11px] mt-3 text-center md:text-left" style={{ color: CYAN }}>
              {a1}{a0} + {b1}{b0} = {sumBits.join('')} &nbsp;·&nbsp; {aVal} + {bVal} = {sum}
            </div>
          </div>
        </div>

        {/* Standard text · half adder and full adder */}
        <div className={`mt-6 p-4 md:p-5 rounded-2xl border ${defBg}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
            <BookOpen size={12} /> Standard text · half adder and full adder
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <TermChip t="Sum = A XOR B" color={CYAN} />
            <TermChip t="Carry = A AND B" color={CYAN} />
            <TermChip t="carry-in = full adder" color={CYAN} />
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            A <span className={`font-semibold ${textColor}`}>half adder</span> is the smallest adding circuit: it adds two
            single bits and produces a Sum bit (A XOR B) and a Carry bit (A AND B). A{' '}
            <span className={`font-semibold ${textColor}`}>full adder</span> takes one extra input, a carry-in from the
            column to its right, so it can add three bits at once. Chain full adders end to end, feeding each stage's
            carry-out into the next stage's carry-in, and you can add whole multi-bit numbers - that chain is exactly
            what is doing the math in the demo above.
          </p>
        </div>
      </motion.div>

      {/* ── JOB 02 · MUX · the star ──────────────────────────────── */}
      <TryItYourself />
      <motion.div {...flow(1)} className={`p-6 md:p-8 rounded-3xl border-2 ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-xl'}`}
        style={{ borderColor: `${AMBER}55` }}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>
          <Shuffle size={13} /> Job 02 · Multiplexer · routing based on a select signal
        </div>
        <svg viewBox="0 0 680 280" className="w-full h-auto mt-2">
          {/* Lane A */}
          <text x="8" y="85" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={LANE_A}>A</text>
          <line x1="28" y1="80" x2="300" y2="80" stroke={sel === 0 ? LANE_A : dimWire} strokeWidth="3"
                style={{ opacity: sel === 0 ? 1 : 0.4, filter: sel === 0 ? `drop-shadow(0 0 5px ${LANE_A})` : 'none' }} />
          {[0, 0.55, 1.1].map((d) => (
            <motion.circle key={`pa${d}`} cy={80} r={5} fill={LANE_A}
              animate={{ cx: [30, 56, 272, 296], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.7, delay: d, repeat: Infinity, ease: 'linear', times: [0, 0.08, 0.85, 1] }}
            />
          ))}

          {/* Lane B */}
          <text x="8" y="205" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={LANE_B}>B</text>
          <line x1="28" y1="200" x2="300" y2="200" stroke={sel === 1 ? LANE_B : dimWire} strokeWidth="3"
                style={{ opacity: sel === 1 ? 1 : 0.4, filter: sel === 1 ? `drop-shadow(0 0 5px ${LANE_B})` : 'none' }} />
          {[0.25, 0.8, 1.35].map((d) => (
            <motion.circle key={`pb${d}`} cy={200} r={5} fill={LANE_B}
              animate={{ cx: [30, 56, 272, 296], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.7, delay: d, repeat: Infinity, ease: 'linear', times: [0, 0.08, 0.85, 1] }}
            />
          ))}

          {/* MUX body */}
          <path d="M 300 50 L 380 92 L 380 188 L 300 230 Z" fill={panelFill} stroke={AMBER} strokeWidth="3" />
          <text x="340" y="145" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={AMBER}>MUX</text>
          {/* Internal flap · swings to the selected lane */}
          <motion.line
            x1={306} x2={374} y2={140}
            animate={{ y1: sel === 0 ? 84 : 196, stroke: outColor }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            strokeWidth="3.5" strokeLinecap="round" strokeDasharray="6 5"
          />
          <circle cx="374" cy="140" r="4" fill={AMBER} />

          {/* Select wire */}
          <line x1="340" y1="258" x2="340" y2="212" stroke={AMBER} strokeWidth="2.5" />
          <text x="352" y="252" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={AMBER}>S = {sel}</text>

          {/* Output wire */}
          <motion.line x1="380" y1="140" x2="600" y2="140" strokeWidth="3"
            animate={{ stroke: outColor }} style={{ filter: `drop-shadow(0 0 5px ${outColor})` }} />
          {[0, 0.55, 1.1].map((d) => (
            <motion.circle key={`po${d}-${sel}`} cy={140} r={5} fill={outColor}
              animate={{ cx: [384, 408, 576, 598], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.7, delay: d, repeat: Infinity, ease: 'linear', times: [0, 0.08, 0.85, 1] }}
            />
          ))}
          <rect x="600" y="116" width="72" height="48" rx="8" fill={panelFill} stroke={outColor} strokeWidth="3"
                style={{ filter: `drop-shadow(0 0 10px ${outColor}66)` }} />
          <text x="636" y="146" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={outColor}>
            OUT={sel === 0 ? 'A' : 'B'}
          </text>
        </svg>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className={`font-mono text-[11px] ${subText}`}>one switch picks the lane</span>
          <button
            onClick={() => setSel(sel ? 0 : 1)}
            className="px-6 py-3 rounded-2xl border-2 font-mono font-black transition-all active:scale-95"
            style={{ borderColor: AMBER, color: '#000', backgroundColor: AMBER, boxShadow: `0 0 22px ${AMBER}55` }}
          >
            SELECT = {sel} · flip
          </button>
        </div>

        {/* Standard text · multiplexer */}
        <div className={`mt-5 p-4 md:p-5 rounded-2xl border ${defBg}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: AMBER }}>
            <BookOpen size={12} /> Standard text · multiplexer (MUX)
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <TermChip t="2ⁿ data inputs" color={AMBER} />
            <TermChip t="n select lines" color={AMBER} />
            <TermChip t="1 output" color={AMBER} />
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            A <span className={`font-semibold ${textColor}`}>multiplexer</span>, or MUX, is a data selector: a 2ⁿ-to-1
            MUX uses n select lines to route exactly one of its 2ⁿ data inputs to its single output. The demo above is
            the smallest case, a 2-to-1 MUX, where one select bit (n = 1) chooses between 2¹ = 2 inputs. Think of it as
            a digital rotary switch: the select code is the knob position, and only the chosen lane gets through.
          </p>
        </div>
      </motion.div>

      {/* ── JOB 03 · DECODER ─────────────────────────────────────── */}
      <TryItYourself />
      <motion.div {...flow(2)} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: EMERALD }}>
          <Lightbulb size={13} /> Job 03 · Decoder · binary code in, exactly one line on
        </div>
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center mt-3">
          <div className="space-y-3">
            <div className="flex gap-3">
              <BitBtn label="D₁" v={d1} color={EMERALD} onClick={() => setD1(d1 ? 0 : 1)} />
              <BitBtn label="D₀" v={d0} color={EMERALD} onClick={() => setD0(d0 ? 0 : 1)} />
            </div>
            <div className="font-mono text-[11px]" style={{ color: EMERALD }}>
              code {d1}{d0} → only Y{line} is on
            </div>
          </div>

          <svg viewBox="0 0 620 240" className="w-full h-auto">
            {/* Input wires */}
            <text x="6" y="90" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>D₁={d1}</text>
            <text x="6" y="160" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>D₀={d0}</text>
            <line x1="56" y1="86" x2="180" y2="100" stroke={d1 ? EMERALD : dimWire} strokeWidth="2.5"
                  style={{ filter: d1 ? `drop-shadow(0 0 4px ${EMERALD})` : 'none' }} />
            <line x1="56" y1="156" x2="180" y2="140" stroke={d0 ? EMERALD : dimWire} strokeWidth="2.5"
                  style={{ filter: d0 ? `drop-shadow(0 0 4px ${EMERALD})` : 'none' }} />

            {/* Decoder box */}
            <rect x="180" y="40" width="130" height="160" rx="14" fill={panelFill} stroke={EMERALD} strokeWidth="3" />
            <text x="245" y="112" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>2-to-4</text>
            <text x="245" y="130" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>DECODER</text>

            {/* Output lines + lamps */}
            {[0, 1, 2, 3].map((i) => {
              const y = 62 + i * 40;
              const on = line === i;
              return (
                <g key={`y${i}`}>
                  <line x1="310" y1={y} x2="470" y2={y} stroke={on ? EMERALD : dimWire} strokeWidth={on ? 3 : 2}
                        style={{ opacity: on ? 1 : 0.45, filter: on ? `drop-shadow(0 0 5px ${EMERALD})` : 'none' }} />
                  <motion.circle
                    cx="490" cy={y} r="14"
                    animate={on
                      ? { fill: EMERALD, opacity: [1, 0.65, 1] }
                      : { fill: 'rgba(0,0,0,0)', opacity: 1 }}
                    transition={on ? { opacity: { duration: 1.1, repeat: Infinity } } : { duration: 0.2 }}
                    stroke={on ? EMERALD : dimWire} strokeWidth="2.5"
                    style={{ filter: on ? `drop-shadow(0 0 12px ${EMERALD})` : 'none' }}
                  />
                  <text x="516" y={y + 4} fontSize="12" fontFamily="monospace" fontWeight="bold"
                        fill={on ? EMERALD : dimWire}>Y{i}</text>
                  <text x="548" y={y + 4} fontSize="10" fontFamily="monospace"
                        fill={on ? EMERALD : dimWire} opacity={on ? 0.9 : 0.5}>
                    {Math.floor(i / 2)}{i % 2}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Standard text · decoder */}
        <div className={`mt-5 p-4 md:p-5 rounded-2xl border ${defBg}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: EMERALD }}>
            <BookOpen size={12} /> Standard text · decoder
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <TermChip t="n inputs → 2ⁿ outputs" color={EMERALD} />
            <TermChip t="exactly one line high" color={EMERALD} />
            <TermChip t="3-to-8 = one of 8 lines" color={EMERALD} />
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            An <span className={`font-semibold ${textColor}`}>n-to-2ⁿ decoder</span> reads an n-bit binary code and
            activates exactly one of its 2ⁿ output lines - the one whose number matches the code. The circuit above is
            a 2-to-4 decoder: 2 input bits light one of 2² = 4 lamps, and a 3-to-8 decoder likewise turns on one of 8
            lines. This pattern, where exactly one wire is high at a time, is called one-hot, and it is how a processor
            picks out a single memory chip or register from an address.
          </p>
        </div>
      </motion.div>

      {/* ── Three job families ───────────────────────────────────── */}
      <motion.div {...flow(3)} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: CYAN }}>
          <Boxes size={13} /> Big picture · three job families
        </div>
        <h3 className={`text-xl md:text-2xl font-black mt-1 ${textColor}`}>
          Every combinational block belongs to one of three families.
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {[
            {
              Icon: Sigma, color: CYAN, name: 'Arithmetic',
              members: 'adders, subtractors, comparators',
              line: 'Circuits that compute with numbers: add them, subtract them, or report which of two numbers is bigger.',
            },
            {
              Icon: Shuffle, color: AMBER, name: 'Data routing',
              members: 'multiplexers, demultiplexers',
              line: 'Circuits that steer data: a multiplexer picks one of many inputs, and a demultiplexer sends one input to one of many outputs.',
            },
            {
              Icon: Binary, color: EMERALD, name: 'Code conversion',
              members: 'decoders, encoders',
              line: 'Circuits that translate between codes: a decoder expands a compact binary code into one-of-many lines, and an encoder compresses it back.',
            },
          ].map(({ Icon, color, name, members, line }) => (
            <div key={name} className={`p-4 rounded-2xl border ${defBg}`}>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>
                <Icon size={12} /> {name}
              </div>
              <div className="font-mono text-[10px] mt-1.5" style={{ color, opacity: 0.75 }}>{members}</div>
              <p className={`text-xs leading-relaxed mt-2 ${subText}`}>{line}</p>
            </div>
          ))}
        </div>
        <p className={`text-sm text-center mt-5 font-semibold ${textColor}`}>
          Every one of them is pure combinational logic - truth table in, gates out, nothing remembered.
        </p>
      </motion.div>

      {/* ── Common thread ────────────────────────────────────────── */}
      <motion.div {...flow(4)} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['no memory', 'no clock input of its own', 'Output = F(inputs right now)'].map((t) => (
            <span key={t} className="font-mono text-[11px] font-black px-4 py-2 rounded-full border-2"
                  style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
              {t}
            </span>
          ))}
        </div>
        <p className={`text-xs text-center mt-4 ${subText}`}>
          All three answer the moment you flip an input. Let go of the inputs and the answer is gone.
        </p>
      </motion.div>
    </div>
  );
};
