import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';
import { GridCountingSystem } from '../components/GridCountingSystem';

interface Props { isActive: boolean; isDarkMode: boolean; }

const OCTAL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7];

// Decimal to Octal converter via repeated division
const decToOctal = (n: number): { steps: { dividend: number; quotient: number; remainder: number }[]; result: string } => {
  const steps = [];
  let num = n;
  while (num > 0) {
    steps.push({ dividend: num, quotient: Math.floor(num / 8), remainder: num % 8 });
    num = Math.floor(num / 8);
  }
  const result = steps.map(s => s.remainder).reverse().join('');
  return { steps, result: result || '0' };
};

export const S00_C_OctalSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const systemTemperature = useBinaryStore(state => state.systemTemperature);
  const recordAction = useBinaryStore(state => state.recordAction);
  const [inputVal, setInputVal] = useState(153);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  const { steps, result } = decToOctal(inputVal);
  const EXAMPLE_WEIGHTS = [512, 64, 8, 1];
  const EXAMPLE_DIGITS = [2, 0, 0, 7];
  const exampleTotal = EXAMPLE_DIGITS.reduce((acc, d, i) => acc + d * EXAMPLE_WEIGHTS[i], 0);

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 transition-all duration-1000" style={{
        filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, ${glowOpacity}))` : 'none'
    }}>
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
        >
          Number Systems - Chapter 1.3
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Octal System</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          Base 8 - only digits <strong>0 through 7</strong>. No 8, no 9.
          Each octal digit maps perfectly to <strong>3 binary bits</strong>.
        </p>
      </section>

      {/* Valid Digits */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          Octal Valid Digits (0-7) with 3-bit Binary Equivalents
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {OCTAL_DIGITS.map((d, i) => (
            <motion.div
              key={d} initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all hover:scale-105
                ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
              >
                {d}
              </div>
              <span className={`font-mono text-[9px] font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                {d.toString(2).padStart(3, '0')}
              </span>
            </motion.div>
          ))}
        </div>
        <div className={`mt-6 p-4 rounded-xl text-center text-xs text-red-400 font-mono border ${isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200 text-red-600'}`}>
           Digits 8 and 9 are ILLEGAL in octal - they don't exist in this system.
        </div>
      </div>

      {/* Worked Example: 2007_8 */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          Worked Example: (2007)_8 -{'>'} Decimal
        </h3>
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {EXAMPLE_DIGITS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black
                ${d > 0 ? (isDarkMode ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-emerald-50 border-amber-300 text-emerald-700')
                        : (isDarkMode ? 'bg-white/5 border-white/10 text-white/20' : 'bg-gray-50 border-gray-200 text-gray-300')}`}
              >
                {d}
              </div>
              <span className={`font-mono text-[10px] ${subTextColor} opacity-70`}>* 8^{3 - i}</span>
              <span className={`font-mono text-xs font-black ${textColor}`}>= {d * EXAMPLE_WEIGHTS[i]}</span>
            </div>
          ))}
        </div>
        <div className={`font-mono text-sm p-5 rounded-2xl text-center ${isDarkMode ? 'bg-black/40' : 'bg-emerald-50/50 border border-emerald-100'}`}>
          <span className={`opacity-60 ${textColor}`}>2*512 + 0*64 + 0*8 + 7*1 = 1024 + 7 = </span>
          <span className="text-emerald-400 font-black text-lg">1031_10</span>
        </div>
      </div>

      {/* Interactive Decimal -> Octal Converter */}
      <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100 shadow-xl'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-2 text-center ${subTextColor}`}>
          Successive Division - Decimal -{'>'} Octal
        </h3>
        <p className={`text-xs text-center opacity-50 mb-8 ${textColor}`}>
          Repeatedly divide by 8. Read remainders from bottom to top (last remainder = MSB).
        </p>

        {/* Input */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <label className={`font-mono text-xs uppercase opacity-60 ${textColor}`}>Decimal Input:</label>
            <input
              type="number" min={0} max={4095} value={inputVal}
              onChange={e => setInputVal(Math.max(0, Math.min(4095, parseInt(e.target.value) || 0)))}
              className={`w-28 text-center text-xl font-black font-mono rounded-xl border-2 p-3 outline-none transition-all
                ${isDarkMode ? 'bg-black/40 border-emerald-500/30 text-emerald-400 focus:border-emerald-400' : 'bg-white border-emerald-300 text-emerald-700 focus:border-emerald-500'}`}
            />
          </div>
        </div>

        {/* Division Steps */}
        <div className="max-w-md mx-auto space-y-2 mb-6">
          {steps.length === 0 && (
            <div className={`text-center font-mono text-sm opacity-40 ${textColor}`}>Enter a number above</div>
          )}
          {steps.map((s, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white border border-emerald-100'}`}
            >
              <span className={`font-mono text-sm ${textColor}`}>{s.dividend} / 8 = {s.quotient}</span>
              <span className={`font-mono text-sm font-black px-3 py-1 rounded-lg
                ${i === steps.length - 1 ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDarkMode ? 'text-emerald-300' : 'text-emerald-600')}`}
              >
                rem {s.remainder} {i === steps.length - 1 ? '<- MSB' : (i === 0 ? '<- LSB' : '')}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Result */}
        <div className={`p-6 rounded-2xl text-center ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white border border-emerald-200'}`}>
          <p className={`font-mono text-xs uppercase tracking-widest opacity-60 mb-2 ${textColor}`}>Result (read bottom -{'>'} top)</p>
          <div className="text-4xl font-black text-emerald-400">({result})_8</div>
          <p className={`font-mono text-xs mt-2 opacity-40 ${textColor}`}>= {inputVal}_10</p>
        </div>
      </div>

      <GridCountingSystem
        base={8}
        highlightIllegal={true}
        title="Octal Grid (0-7 are valid, 8-9 are illegal)"
        description="Only digits 0 through 7 exist in octal. The digit 8 does not exist - that's what makes it base 8."
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
