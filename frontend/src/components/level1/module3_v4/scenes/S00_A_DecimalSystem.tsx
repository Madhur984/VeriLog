import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';
import { GridCountingSystem } from '../components/GridCountingSystem';

interface Props { isActive: boolean; isDarkMode: boolean; }

const T = {
  bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
  text: '#E5E7EB', muted: '#64748B', accent: '#F59E0B',
  mono: "'JetBrains Mono', monospace",
};

const WEIGHTS = [1000, 100, 10, 1];
const EXAMPLE = [2, 0, 0, 9];

export const S00_A_DecimalSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const systemTemperature = useBinaryStore(state => state.systemTemperature);
  const recordAction = useBinaryStore(state => state.recordAction);
  const [digits, setDigits] = useState<number[]>([1, 2, 3, 4]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-amber-400' : 'text-amber-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';
  
  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  const total = digits.reduce((acc, d, i) => acc + d * WEIGHTS[i], 0);

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
        >
          Number Systems - Chapter 1.1
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Decimal System</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          Base 10 - the system your brain grew up with. But <em>why</em> does it work?
          Every digit's value depends entirely on <strong>its position</strong>.
        </p>
      </section>

      {/* Positional Formula */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border text-center ${cardBg}`}
      >
        <p className={`font-mono text-xs uppercase tracking-widest mb-4 ${subTextColor}`}>General Positional Notation</p>
        <div className={`text-xl md:text-2xl font-black font-mono ${textColor}`}>
          (a₅a₄a₃a₂a₁a₀)ᵣ = a₅×r⁵ + a₄×r⁴ + a₃×r³ + a₂×r² + a₁×r¹ + a₀×r⁰
        </div>
        <p className={`mt-4 text-sm opacity-60 ${textColor}`}>
          Here <strong>r is the base (also called the radix)</strong> and each <strong>aᵢ</strong> is a digit multiplied by a power of the base.
        </p>
      </motion.div>

      {/* Worked Example: 2009 */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          Worked Example: (2009)₁₀
        </h3>
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {EXAMPLE.map((d, i) => (
            <motion.div
              key={i} initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all
                ${d > 0 ? (isDarkMode ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-700')
                        : (isDarkMode ? 'bg-white/5 border-white/10 text-white/30' : 'bg-gray-50 border-gray-200 text-gray-300')}`}
              >
                {d}
              </div>
              <span className={`font-mono text-[10px] font-bold ${subTextColor} opacity-70`}>× 10{'³²¹⁰'[i]}</span>
              <span className={`font-mono text-xs font-black ${textColor}`}>= {d * WEIGHTS[i]}</span>
            </motion.div>
          ))}
        </div>
        <div className={`text-center font-mono text-sm p-4 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-amber-50/50 border border-amber-100'}`}>
          <span className={`opacity-60 ${textColor}`}>2×1000 + 0×100 + 0×10 + 9×1 = </span>
          <span className="text-amber-500 font-black text-lg">2009</span>
        </div>
      </div>

      {/* Interactive Builder */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-2 text-center ${subTextColor}`}>
          Interactive Builder - Adjust Each Digit
        </h3>
        <p className={`text-xs text-center opacity-50 mb-8 ${textColor}`}>Click the arrows to change any digit and watch the value update live.</p>
        <div className="flex justify-center gap-6 flex-wrap mb-8">
          {digits.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className={`font-mono text-[10px] opacity-40 uppercase ${textColor}`}>10{'³²¹⁰'[i]}</span>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setDigits(prev => prev.map((v, idx) => idx === i ? Math.min(9, v + 1) : v))}
                  className={`text-lg font-black w-10 h-8 rounded-lg transition-all ${isDarkMode ? 'hover:bg-amber-500/20 text-white/40 hover:text-amber-400' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-600'}`}
                >[^]</button>
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all cursor-pointer
                  ${d > 0 ? (isDarkMode ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700')
                          : (isDarkMode ? 'bg-white/5 border-white/10 text-white/20' : 'bg-gray-50 border-gray-200 text-gray-300')}`}
                >
                  {d}
                </div>
                <button
                  onClick={() => setDigits(prev => prev.map((v, idx) => idx === i ? Math.max(0, v - 1) : v))}
                  className={`text-lg font-black w-10 h-8 rounded-lg transition-all ${isDarkMode ? 'hover:bg-amber-500/20 text-white/40 hover:text-amber-400' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-600'}`}
                >[v]</button>
              </div>
              <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-amber-400/70' : 'text-amber-600/70'}`}>× {WEIGHTS[i]}</span>
              <span className={`font-mono text-[10px] ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>= {d * WEIGHTS[i]}</span>
            </div>
          ))}
        </div>
        <div className={`text-center p-6 rounded-2xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
          <p className={`font-mono text-xs uppercase tracking-widest opacity-60 mb-2 ${textColor}`}>Total Value</p>
          <div className="text-5xl font-black text-amber-500">{total}</div>
          <p className={`font-mono text-[10px] mt-2 opacity-40 ${textColor}`}>
            {digits.map((d, i) => `${d}×${WEIGHTS[i]}`).join(' + ')} = {total}
          </p>
        </div>
      </div>

      {/* Grid */}
      <GridCountingSystem
        base={10}
        highlightIllegal={false}
        title="All Valid Decimal Digits (0-9)"
        description="In base 10, only 10 symbols (0 through 9) are valid. Every number is built by combining these in different positions."
        isDarkMode={isDarkMode}
      />

      {/* With fractions */}
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Fractional Extension</h3>
        <div className={`font-mono text-sm leading-loose ${textColor}`}>
          <div className="opacity-60 mb-2">Decimal fractions use negative powers:</div>
          <div className={`p-4 rounded-xl text-base ${isDarkMode ? 'bg-black/40' : 'bg-white border border-gray-100'}`}>
            (123.24)₁₀ = 1×10² + 2×10¹ + 3×10⁰ + <span className="text-amber-500">2×10⁻¹</span> + <span className="text-amber-500">4×10⁻²</span>
            <br />= 100 + 20 + 3 + 0.2 + 0.04 = <strong className="text-amber-400">123.24</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
