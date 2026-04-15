import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Binary } from 'lucide-react';
import { GridCountingSystem } from '../components/GridCountingSystem';

interface Props { isActive: boolean; isDarkMode: boolean; }

const weights8 = [128, 64, 32, 16, 8, 4, 2, 1];

// Interactive binary-to-decimal converter
const BinaryConverter: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [bits, setBits] = useState<number[]>([1, 1, 0, 1, 0, 0, 1, 0]);
  const decimal = bits.reduce((acc, b, i) => acc + b * weights8[i], 0);
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-xl'}`}>
      <h3 className={`font-mono text-xs uppercase tracking-widest mb-2 text-center ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
        Interactive Converter — Click Bits to Toggle
      </h3>
      <p className={`text-[10px] text-center opacity-50 mb-6 ${textColor}`}>Each bit = ON (1) or OFF (0). Sum the weights of all ON bits.</p>

      {/* Bit Grid */}
      <div className="grid grid-cols-8 gap-2 mb-6">
        {bits.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className={`font-mono text-[8px] opacity-40`}>2^{7-i}</span>
            <motion.button
              onClick={() => setBits(prev => prev.map((v, idx) => idx === i ? 1 - v : v))}
              animate={{
                backgroundColor: b ? '#0ea5e9' : (isDarkMode ? '#1a1d24' : '#f1f5f9'),
                boxShadow: b ? '0 0 15px rgba(14,165,233,0.5)' : 'none',
                y: b ? -3 : 0,
              }}
              className="w-full aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-black cursor-pointer transition-colors"
              style={{ borderColor: b ? '#0ea5e9' : (isDarkMode ? '#2d3139' : '#e2e8f0'), color: b ? '#fff' : (isDarkMode ? '#4b5563' : '#9ca3af') }}
            >
              {b}
            </motion.button>
            <span className={`font-mono text-[9px] ${b ? (isDarkMode ? 'text-sky-400' : 'text-sky-600') : 'opacity-30'}`}>{weights8[i]}</span>
          </div>
        ))}
      </div>

      {/* Calculation */}
      <div className={`p-4 rounded-2xl font-mono text-xs leading-loose ${isDarkMode ? 'bg-black/40' : 'bg-white/80 border border-sky-100'}`}>
        <div className={`opacity-60 mb-2 text-[10px] uppercase tracking-widest ${textColor}`}>Calculation:</div>
        <div className={textColor}>
          {bits.map((b, i) => b ? `${weights8[i]}` : null).filter(Boolean).join(' + ') || '0'} = <strong className="text-sky-400 text-base">{decimal}</strong>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: '11001', val: 25 }, { label: '1100001', val: 97 },
          { label: '0.101', val: '0.625' }, { label: '11.001', val: '3.125' },
        ].map((ex, i) => (
          <div key={i} className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-white/5' : 'bg-white border border-gray-100'}`}>
            <div className="font-mono text-sky-400 text-xs font-black">{ex.label}₂</div>
            <div className={`font-mono text-sm font-black mt-1 ${textColor}`}>{ex.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const S00_B_BinarySystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
        >
          Number Systems — Chapter 1.4 / 1.5
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Binary System</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          Base 2 — only <strong>0 and 1</strong>. Your processor speaks nothing else.
          Each digit is called a <strong>bit</strong> (Binary Digit).
        </p>
      </section>

      {/* Grid */}
      <GridCountingSystem
        base={2}
        highlightIllegal={true}
        title="Binary: Only 0 and 1 Are Legal"
        description="In binary, only two symbols exist. Numbers like 2, 5, or 9 are ILLEGAL. Only 0 and 1 can appear in each position."
        isDarkMode={isDarkMode}
      />

      {/* Power Grid */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          The Power Grid — Binary Weights (2^n)
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {weights8.map((w, i) => (
            <motion.div
              key={w} initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center group"
            >
              <div className={`w-full aspect-square rounded-2xl border flex items-center justify-center font-black text-lg mb-3 transition-all group-hover:scale-105
                ${isDarkMode ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 group-hover:bg-sky-500/20' : 'bg-sky-50 border-sky-200 text-sky-700'}`}
              >
                {w}
              </div>
              <span className="font-mono text-[9px] opacity-40 uppercase">2^{7 - i}</span>
            </motion.div>
          ))}
        </div>
        <p className={`text-center text-xs opacity-50 mt-6 ${textColor}`}>
          Weights: 128, 64, 32, 16, 8, 4, 2, 1 — Each position is exactly <strong>double</strong> the one to its right.
        </p>
      </div>

      {/* Interactive Converter */}
      <BinaryConverter isDarkMode={isDarkMode} />

      {/* Worked Example 1101 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20 shadow-2xl shadow-sky-900/10' : 'bg-sky-50 border-sky-100 shadow-xl'}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <Binary size={18} className="text-sky-500" />
            <h4 className={`font-black uppercase tracking-widest text-sm ${textColor}`}>Decomposition: (1101)₂</h4>
          </div>
          <div className="flex justify-between gap-2 mb-8">
            {['1', '1', '0', '1'].map((bit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-12 h-16 rounded-xl flex items-center justify-center text-2xl font-black
                  ${bit === '1' ? 'bg-sky-500 text-white shadow-[0_0_15px_#0ea5e9]' : 'bg-slate-200/20 text-slate-400'}`}>
                  {bit}
                </div>
                <span className="mt-2 font-mono text-[10px] font-bold opacity-60">× {Math.pow(2, 3 - i)}</span>
              </div>
            ))}
          </div>
          <pre className={`font-mono text-[11px] leading-relaxed p-5 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white/70 border border-sky-100'} ${textColor}`}>
{`  (1 × 2³) = 8
+ (1 × 2²) = 4
+ (0 × 2¹) = 0
+ (1 × 2⁰) = 1
─────────────
  Result: 13₁₀`}
          </pre>
        </motion.div>

        <div className="space-y-6">
          <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`font-bold mb-4 flex items-center gap-2 ${textColor}`}>
              <Zap size={16} className="text-amber-500" />
              What is a Bit?
            </h4>
            <p className="text-sm opacity-70 leading-relaxed">
              A <span className={subTextColor}>Bit</span> (Binary Digit) is the smallest unit of digital information.
              It is exactly 0 or 1. 8 bits = 1 byte = 256 possible values (0–255).
            </p>
          </div>

          {/* Fractional Binary */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`font-bold mb-4 ${textColor}`}>Fractional Binary (from PDF p.5–6)</h4>
            <div className={`font-mono text-xs leading-loose p-4 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white border border-gray-100'}`}>
              <div className="opacity-60 mb-2">Negative powers of 2:</div>
              <div>2⁻¹ = <span className="text-sky-400">0.5</span></div>
              <div>2⁻² = <span className="text-sky-400">0.25</span></div>
              <div>2⁻³ = <span className="text-sky-400">0.125</span></div>
              <div className="mt-3 opacity-60">Example:</div>
              <div>(0.101)₂ = 0.5 + 0.125 = <span className="text-sky-400 font-black">0.625</span></div>
              <div>(11.001)₂ = 2+1+0.125 = <span className="text-sky-400 font-black">3.125</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Callout */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/10 to-transparent border text-center
          ${isDarkMode ? 'border-sky-500/20' : 'border-sky-100'}`}
      >
        <p className={`text-xl font-black leading-tight ${textColor}`}>
          Binary Value = <span className="text-sky-500">Σ (bit × 2^position)</span>
        </p>
        <p className={`text-sm opacity-50 mt-3 font-mono ${textColor}`}>sum of all active bit weights from MSB (left) to LSB (right)</p>
      </motion.div>
    </div>
  );
};
