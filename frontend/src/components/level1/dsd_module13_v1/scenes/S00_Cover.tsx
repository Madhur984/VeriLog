import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Cpu } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const AMBER = '#f59e0b';

const FACTS: Array<[string, string]> = [
  ['1', 'full adder does all the work, reused every cycle'],
  ['1', 'D flip-flop remembers the carry between cycles'],
  ['N', 'clock cycles to add two N-bit numbers'],
  ['2', 'shift registers feed the bits in, one pair at a time'],
];

const JOURNEY = ['The choice', 'The highway', 'The datapath', 'Step the clock', 'Time vs space', 'Prove it'];

export const S00_Cover: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Title block ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          Trade <span style={{ color: SKY }}>time</span> for <span style={{ color: EMERALD }}>space.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          A parallel adder throws hardware at the problem: one full adder per bit, all firing at
          once. The serial adder asks a different question. What if a single full adder added the
          numbers one bit at a time, remembering the carry as it goes? You spend more clock cycles,
          but the circuit shrinks to almost nothing. That bargain is the whole module.
        </p>
      </motion.section>

      {/* ── facts strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-3xl font-black" style={{ color: SKY }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── the datapath at a glance ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 520 210" className="w-full max-w-2xl mx-auto h-auto">
          {/* shift register A */}
          <rect x={20} y={30} width={150} height={26} rx={6} fill={boxFill} stroke={SKY} strokeWidth="2" />
          {[0,1,2,3,4].map(i => <line key={i} x1={20+30*(i+1)} y1={30} x2={20+30*(i+1)} y2={56} stroke={SKY} strokeWidth="1" opacity="0.5" />)}
          <text x={95} y={22} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={SKY} fontWeight="bold">REGISTER A</text>
          {/* shift register B */}
          <rect x={20} y={86} width={150} height={26} rx={6} fill={boxFill} stroke={SKY} strokeWidth="2" />
          {[0,1,2,3,4].map(i => <line key={i} x1={20+30*(i+1)} y1={86} x2={20+30*(i+1)} y2={112} stroke={SKY} strokeWidth="1" opacity="0.5" />)}
          <text x={95} y={128} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={SKY} fontWeight="bold">REGISTER B</text>

          {/* wires into FA */}
          <line x1={170} y1={43} x2={250} y2={56} stroke={ink} strokeWidth="2" />
          <line x1={170} y1={99} x2={250} y2={88} stroke={ink} strokeWidth="2" />

          {/* full adder */}
          <rect x={250} y={48} width={100} height={56} rx={12} fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
          <text x={300} y={80} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="900" fill={VIOLET}>FULL ADDER</text>

          {/* sum out -> result register */}
          <line x1={350} y1={66} x2={430} y2={66} stroke={EMERALD} strokeWidth="2.5" />
          <polygon points="430,61 440,66 430,71" fill={EMERALD} />
          <rect x={440} y={53} width={60} height={26} rx={6} fill={boxFill} stroke={EMERALD} strokeWidth="2" />
          <text x={470} y={45} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD} fontWeight="bold">SUM</text>
          <text x={392} y={60} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>S</text>

          {/* cout -> D flip-flop -> back to cin */}
          <line x1={350} y1={92} x2={380} y2={92} stroke={AMBER} strokeWidth="2.5" />
          <text x={365} y={86} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>Cout</text>
          <rect x={380} y={120} width={70} height={40} rx={8} fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
          <text x={415} y={138} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>D  FLIP</text>
          <text x={415} y={150} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>FLOP</text>
          {/* cout down into FF */}
          <line x1={380} y1={92} x2={380} y2={120} stroke={AMBER} strokeWidth="2.5" />
          {/* FF back to FA Cin (loop under) */}
          <path d={`M 380 160 L 220 160 L 220 96 L 250 96`} fill="none" stroke={AMBER} strokeWidth="2.5" strokeDasharray="5 4" />
          <polygon points="245,91 255,96 245,101" fill={AMBER} />
          <text x={300} y={175} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>carry fed back as Cin next cycle</text>

          {/* clock */}
          <text x={415} y={196} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={ink} opacity="0.6">▲ CLK</text>
        </svg>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-3 ${subText}`}>
          The entire machine: two shift registers stream their bits, lowest first, into one full
          adder. The Sum bit shifts into the result; the Carry-out is parked in a
          <span className="font-mono font-bold" style={{ color: AMBER }}> D flip-flop</span> and
          handed back as the next cycle's Carry-in. After
          <span className="font-mono font-bold" style={{ color: SKY }}> N</span> clock ticks, the
          answer is complete.
        </p>
      </motion.div>

      {/* ── what you get ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid md:grid-cols-2 gap-4">
        {[
          { Icon: Cpu, color: EMERALD, title: 'A real picture, not just a formula', body: 'You will step an actual addition through the datapath, clock tick by clock tick, and watch the carry survive in the flip-flop between cycles.' },
          { Icon: Clock, color: SKY, title: 'The trade-off, made concrete', body: 'Parallel is fast and huge; serial is small and slow. You will see exactly where each one wins, and why your smartwatch quietly prefers serial.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Journey strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: SKY }}>
          The route through this module
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{
                      borderColor: i === JOURNEY.length - 1 ? `${VIOLET}88` : `${SKY}44`,
                      color: i === JOURNEY.length - 1 ? VIOLET : SKY,
                      background: i === JOURNEY.length - 1 ? `${VIOLET}10` : `${SKY}08`,
                    }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-center font-mono" style={{ color: EMERALD }}>
          Builds on Module 08 (the full adder) and Module 06 (shift registers, flip-flops, the clock).
        </p>
      </motion.div>
    </div>
  );
};

export default S00_Cover;
