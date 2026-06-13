import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Clipboard, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

const Bit: React.FC<{ value: number; color: string; onClick?: () => void; label?: string }> = ({ value, color, onClick, label }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`relative w-12 h-12 rounded-xl font-mono text-xl font-black border-2 transition-all ${onClick ? 'active:scale-90 cursor-pointer' : 'cursor-default'}`}
    style={{
      borderColor: value ? color : `${color}55`,
      background: value ? `${color}26` : 'transparent',
      color: value ? color : `${color}99`,
    }}
    aria-label={label}
  >
    {value}
  </button>
);

export const S03_Architecture: React.FC<Props> = ({ isDarkMode }) => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [cin, setCin] = useState(0);

  const sum = a ^ b ^ cin;
  const cout = (a & b) | (b & cin) | (a & cin);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const wire      = isDarkMode ? '#475569' : '#94a3b8';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Cpu size={14} /> Chapter 04 · The Datapath
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One booth, one clipboard, a carry loop</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Strip the plaza down to its wires. Two shift registers feed one full adder, lowest bit
          first. The Sum shifts into the result. The Carry-out goes into a D flip-flop, and the
          flip-flop hands it straight back as the next cycle's Carry-in. Toggle the three inputs
          below to see the booth's logic, then trace where each output goes.
        </p>
      </motion.section>

      {/* interactive booth */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* inputs + outputs */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: SKY }}>The three inputs this cycle</div>
            <div className="flex flex-wrap items-end gap-5">
              <div className="text-center">
                <Bit value={a} color={SKY} onClick={() => setA(a ^ 1)} label="toggle A" />
                <div className={`mt-1 font-mono text-[10px] ${subText}`}>A bit</div>
              </div>
              <div className="text-center">
                <Bit value={b} color={SKY} onClick={() => setB(b ^ 1)} label="toggle B" />
                <div className={`mt-1 font-mono text-[10px] ${subText}`}>B bit</div>
              </div>
              <div className="text-center">
                <Bit value={cin} color={AMBER} onClick={() => setCin(cin ^ 1)} label="toggle Cin" />
                <div className="mt-1 font-mono text-[10px]" style={{ color: AMBER }}>Cin (from flip-flop)</div>
              </div>
              <div className={`px-3 self-center font-mono text-2xl ${subText}`}>→</div>
              <div className="text-center">
                <Bit value={sum} color={EMERALD} />
                <div className="mt-1 font-mono text-[10px]" style={{ color: EMERALD }}>Sum</div>
              </div>
              <div className="text-center">
                <Bit value={cout} color={AMBER} />
                <div className="mt-1 font-mono text-[10px]" style={{ color: AMBER }}>Cout → flip-flop</div>
              </div>
            </div>

            <div className={`mt-6 space-y-2 font-mono text-[13px] ${textColor}`}>
              <div>
                <span style={{ color: EMERALD }}>Sum</span> = A ⊕ B ⊕ Cin ={' '}
                <span className="opacity-70">{a} ⊕ {b} ⊕ {cin}</span> = <strong style={{ color: EMERALD }}>{sum}</strong>
              </div>
              <div>
                <span style={{ color: AMBER }}>Cout</span> = AB + BCin + ACin ={' '}
                <span className="opacity-70">maj({a},{b},{cin})</span> = <strong style={{ color: AMBER }}>{cout}</strong>
              </div>
              <div className={`text-[12px] ${subText}`}>
                {a}+{b}+{cin} = {a + b + cin}, written {cout}{sum} in binary - low bit stays as Sum, high bit ships as the carry.
              </div>
            </div>
          </div>

          {/* datapath svg */}
          <div className={`rounded-2xl border p-4 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <svg viewBox="0 0 360 240" className="w-full h-auto">
              {/* register A */}
              <rect x={10} y={40} width={110} height={24} rx={5} fill={boxFill} stroke={SKY} strokeWidth="1.8" />
              <text x={65} y={33} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY} fontWeight="bold">SHIFT REG A</text>
              {/* register B */}
              <rect x={10} y={92} width={110} height={24} rx={5} fill={boxFill} stroke={SKY} strokeWidth="1.8" />
              <text x={65} y={130} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY} fontWeight="bold">SHIFT REG B</text>

              {/* wires into FA, carrying current values */}
              <line x1={120} y1={52} x2={180} y2={70} stroke={a ? SKY : wire} strokeWidth={a ? 2.6 : 1.6} />
              <line x1={120} y1={104} x2={180} y2={92} stroke={b ? SKY : wire} strokeWidth={b ? 2.6 : 1.6} />
              <text x={150} y={48} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={SKY}>{a}</text>
              <text x={150} y={118} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={SKY}>{b}</text>

              {/* full adder */}
              <rect x={180} y={56} width={86} height={50} rx={10} fill={boxFill} stroke={VIOLET} strokeWidth="2.4" />
              <text x={223} y={78} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="900" fill={VIOLET}>FULL</text>
              <text x={223} y={92} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="900" fill={VIOLET}>ADDER</text>

              {/* sum out */}
              <line x1={266} y1={70} x2={330} y2={70} stroke={sum ? EMERALD : wire} strokeWidth={sum ? 2.6 : 1.6} />
              <polygon points="330,65 340,70 330,75" fill={sum ? EMERALD : wire} />
              <text x={300} y={62} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>Sum {sum}</text>

              {/* cout down to FF */}
              <line x1={266} y1={92} x2={300} y2={92} stroke={cout ? AMBER : wire} strokeWidth={cout ? 2.6 : 1.6} />
              <line x1={300} y1={92} x2={300} y2={150} stroke={cout ? AMBER : wire} strokeWidth={cout ? 2.6 : 1.6} />
              <text x={284} y={86} fontSize="9" fontFamily="monospace" fill={AMBER}>Cout {cout}</text>

              {/* D flip-flop */}
              <rect x={262} y={150} width={76} height={46} rx={8} fill={boxFill} stroke={AMBER} strokeWidth="2.2" />
              <text x={300} y={170} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>CARRY</text>
              <text x={300} y={182} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>FLIP-FLOP</text>
              <text x={300} y={214} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ink} opacity="0.6">▲ CLK</text>

              {/* loop back to Cin */}
              <path d="M 262 173 L 150 173 L 150 92 L 180 92" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="5 4" />
              <polygon points="175,87 185,92 175,97" fill={AMBER} />
              <text x={150} y={188} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>Cin next cycle</text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* the three jobs */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: ArrowRight, color: SKY, title: 'The shift registers feed it', body: 'Register A and Register B each shift right by one bit per clock, so the booth always sees the next-lowest pair of bits.' },
          { Icon: Cpu, color: VIOLET, title: 'The full adder does the math', body: 'The same single adder computes Sum = A ⊕ B ⊕ Cin and Cout = majority every cycle. It is the only arithmetic in the whole circuit.' },
          { Icon: Clipboard, color: AMBER, title: 'The flip-flop carries the carry', body: 'Cout is clocked into the D flip-flop and reappears as next cycle\'s Cin. This loop is what turns one full adder into an any-width adder.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-[15px] font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-[13px] leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      {/* reset note */}
      <p className={`text-center text-xs font-mono ${subText}`}>
        One detail the diagram hides: before a new addition starts, the carry flip-flop must be
        cleared to 0, exactly like a fresh full adder with Cin = 0 on its lowest bit.
      </p>
    </div>
  );
};

export default S03_Architecture;
