import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// ─── Full-adder step visualiser ───────────────────────────────
const BITS = 4;

const addBinary = (a: number[], b: number[]) => {
  const result: number[] = new Array(BITS).fill(0);
  const carries: number[] = new Array(BITS + 1).fill(0);
  for (let i = BITS - 1; i >= 0; i--) {
    const sum = a[i] + b[i] + carries[i + 1];
    result[i] = sum % 2;
    carries[i] = Math.floor(sum / 2);
  }
  return { result, carries };
};

const BitCell: React.FC<{ val: number; color?: string; isDarkMode: boolean; onClick?: () => void }> = ({
  val, color = '#0EA5E9', isDarkMode, onClick,
}) => (
  <motion.button
    onClick={onClick}
    animate={{
      backgroundColor: val ? `${color}22` : (isDarkMode ? '#0D0F16' : '#F1F5F9'),
      borderColor: val ? color : (isDarkMode ? '#2D3139' : '#D1D5DB'),
      color: val ? color : (isDarkMode ? '#475569' : '#9CA3AF'),
      scale: val ? 1.05 : 1,
      boxShadow: val ? `0 0 14px ${color}55` : 'none',
    }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    style={{
      width: 56, height: 64, border: '2px solid', borderRadius: 12,
      fontFamily: '"IBM Plex Mono", monospace', fontSize: 24, fontWeight: 900,
      cursor: onClick ? 'pointer' : 'default', outline: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    {val}
  </motion.button>
);

export const S10_BinaryArithmetic: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [bitsA, setBitsA] = useState([0, 1, 0, 1]); // 5
  const [bitsB, setBitsB] = useState([0, 1, 1, 0]); // 6

  const { result, carries } = addBinary(bitsA, bitsB);
  const decA = bitsA.reduce((acc, b, i) => acc + b * Math.pow(2, BITS - 1 - i), 0);
  const decB = bitsB.reduce((acc, b, i) => acc + b * Math.pow(2, BITS - 1 - i), 0);
  const decR = result.reduce((acc, b, i) => acc + b * Math.pow(2, BITS - 1 - i), 0) + carries[0] * 16;

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase block mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
        >
          Binary Arithmetic — Chapter 3.1
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Binary Addition</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          The <strong>Full Adder</strong> combines two bits plus a carry-in, producing a sum bit and a carry-out.
          Click the bits below to explore how carry propagates.
        </p>
      </section>

      {/* Addition Rules Card */}
      <div className={`p-8 rounded-3xl border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
          Addition Rules
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { a: 0, b: 0, carry: 0, sum: 0 },
            { a: 0, b: 1, carry: 0, sum: 1 },
            { a: 1, b: 0, carry: 0, sum: 1 },
            { a: 1, b: 1, carry: 1, sum: 0 },
          ].map((r, i) => (
            <div key={i} className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="font-mono text-2xl font-black text-sky-400">{r.a} + {r.b}</div>
              <div className={`font-mono text-sm mt-2 opacity-60 ${textColor}`}>
                = <span className="text-green-400 font-black">{r.sum}</span>
                {r.carry ? <span className="text-amber-400"> carry <strong>1</strong></span> : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Adder */}
      <div className={`p-8 md:p-12 rounded-[2rem] border relative overflow-hidden ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-200 shadow-2xl'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-10 text-center ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
          Click Bits to Toggle — Live Ripple Carry Adder
        </h3>

        {/* Carry row */}
        <div className="flex justify-end gap-3 mb-2 pr-1" style={{ paddingLeft: '3rem' }}>
          {carries.slice(0, BITS).map((c, i) => (
            <div key={i} className="w-[56px] flex flex-col items-center gap-1">
              <span className="font-mono text-[9px] uppercase opacity-40">C{BITS - i}</span>
              <motion.div
                animate={{ color: c ? '#F59E0B' : (isDarkMode ? '#2D3139' : '#D1D5DB') }}
                className="font-mono text-lg font-black"
              >
                {c}
              </motion.div>
            </div>
          ))}
          <div className="w-[56px]" />
        </div>

        {/* Operand A */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-mono font-black text-lg w-8 text-right ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>A</span>
          <div className="flex gap-3">
            {bitsA.map((b, i) => (
              <BitCell key={i} val={b} isDarkMode={isDarkMode} onClick={() => setBitsA(prev => prev.map((v, idx) => idx === i ? 1 - v : v))} />
            ))}
          </div>
          <span className={`font-mono text-sm opacity-60 ml-2 ${textColor}`}>= {decA}</span>
        </div>

        {/* Operand B */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`font-mono font-black text-lg w-8 text-right ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>B</span>
          <div className="flex gap-3">
            {bitsB.map((b, i) => (
              <BitCell key={i} val={b} isDarkMode={isDarkMode} onClick={() => setBitsB(prev => prev.map((v, idx) => idx === i ? 1 - v : v))} />
            ))}
          </div>
          <span className={`font-mono text-sm opacity-60 ml-2 ${textColor}`}>= {decB}</span>
        </div>

        {/* Divider */}
        <div className={`flex items-center gap-3 mb-3`}>
          <span className={`font-mono font-black text-lg w-8 text-right ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}><Plus size={18} /></span>
          <div className={`h-0.5 flex-1 ${isDarkMode ? 'bg-sky-500/30' : 'bg-sky-300'}`} style={{ maxWidth: BITS * 56 + (BITS - 1) * 12 }} />
        </div>

        {/* Result */}
        <div className="flex items-center gap-3">
          <span className={`font-mono font-black text-lg w-8 text-right ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>=</span>
          <div className="flex gap-3">
            {carries[0] === 1 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-end pb-1"
              >
                <div className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black font-mono border-amber-400 text-amber-400`}
                  style={{ boxShadow: '0 0 14px rgba(245,158,11,0.4)' }}
                >
                  1
                </div>
              </motion.div>
            )}
            {result.map((b, i) => (
              <BitCell key={i} val={b} color="#10B981" isDarkMode={isDarkMode} />
            ))}
          </div>
          <span className={`font-mono text-sm ml-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'} font-black`}>= {decR}</span>
        </div>

        {/* Check */}
        <div className={`mt-8 p-4 rounded-2xl text-center font-mono text-sm ${isDarkMode ? 'bg-black/40' : 'bg-white/70 border border-sky-100'} ${textColor}`}>
          {decA} + {decB} = <span className="text-green-400 font-black">{decR}</span>
          <span className={`ml-4 text-xs opacity-50`}>{decA + decB === decR ? '✓ Correct' : '⚠ Overflow'}</span>
        </div>
      </div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-10 rounded-[2.5rem] border text-center bg-gradient-to-br from-amber-500/10 to-transparent ${isDarkMode ? 'border-amber-500/20' : 'border-amber-200'}`}
      >
        <Zap size={24} className="text-amber-500 mx-auto mb-4" />
        <p className={`text-lg font-black leading-tight ${textColor}`}>
          A <span className="text-amber-500">ripple carry adder</span> chains multiple full adders —<br />
          the carry-out of each bit becomes the carry-in of the next.
        </p>
        <p className={`text-sm opacity-50 mt-3 font-mono ${textColor}`}>1+1=10₂  (sum=0, carry=1 propagates left)</p>
      </motion.div>
    </div>
  );
};
