import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

const HEX_CHARS = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
const HEX_VALS  = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

const hexToDecimal = (hex: string): number => {
  return parseInt(hex || '0', 16);
};

const decToHex = (n: number): string => {
  if (n <= 0) return '0';
  return n.toString(16).toUpperCase();
};

export const S00_D_HexSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const systemTemperature = useBinaryStore(state => state.systemTemperature);
  const recordAction = useBinaryStore(state => state.recordAction);
  const [hexInput, setHexInput] = useState('2BC9');
  const [decInput, setDecInput] = useState(255);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-violet-400' : 'text-violet-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  const hexDecResult = hexToDecimal(hexInput.replace(/[^0-9A-Fa-f]/g, ''));
  const decHexResult = decToHex(decInput);

  // Worked example: 2BC9
  const EXAMPLE_DIGITS = [2, 11, 12, 9]; // 2, B, C, 9
  const EXAMPLE_LABELS = ['2', 'B', 'C', '9'];
  const EXAMPLE_WEIGHTS = [4096, 256, 16, 1];
  const exampleTotal = EXAMPLE_DIGITS.reduce((acc, d, i) => acc + d * EXAMPLE_WEIGHTS[i], 0);

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
        >
          Number Systems - Chapter 1.4
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Hexadecimal</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          Base 16 - digits 0-9, then <strong>A=10, B=11, C=12, D=13, E=14, F=15</strong>.
          One hex digit = exactly <strong>4 binary bits</strong>.
        </p>
      </section>

      {/* Symbol Table */}
      <div className={`p-8 rounded-[2rem] border ${cardBg}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          Hex Symbols & Decimal Equivalents
        </h3>
        <div className="grid grid-cols-8 md:grid-cols-16 gap-2">
          {HEX_CHARS.map((c, i) => (
            <motion.div
              key={c} initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.03 }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all hover:scale-105
                ${i >= 10 ? (isDarkMode ? 'bg-violet-500/15 border-violet-500/40' : 'bg-violet-50 border-violet-200')
                          : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200')}`}
            >
              <span className={`text-xl font-black ${i >= 10 ? (isDarkMode ? 'text-violet-400' : 'text-violet-600') : textColor}`}>{c}</span>
              <span className={`font-mono text-[9px] opacity-40`}>{HEX_VALS[i]}</span>
            </motion.div>
          ))}
        </div>
        <div className={`mt-4 p-3 rounded-xl text-center text-xs font-mono ${isDarkMode ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300' : 'bg-violet-50 border border-violet-200 text-violet-700'}`}>
          Letters A-F (highlighted) represent decimal values 10-15 using a single character.
        </div>
      </div>

      {/* Worked Example: 2BC9 */}
      <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-violet-500/5 border-violet-500/20' : 'bg-violet-50 border-violet-100 shadow-xl'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 text-center ${subTextColor}`}>
          Worked Example: (2BC9)_16 -{'>'} Decimal
        </h3>
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {EXAMPLE_LABELS.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black
                ${i >= 1 && i <= 2 ? (isDarkMode ? 'bg-violet-500/20 border-violet-500/50 text-violet-400' : 'bg-violet-100 border-violet-300 text-violet-700')
                                   : (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-700')}`}
              >
                {label}
              </div>
              <span className={`font-mono text-[10px] ${subTextColor} opacity-70`}>= {EXAMPLE_DIGITS[i]}_10</span>
              <span className={`font-mono text-[10px] opacity-50 ${textColor}`}>* {EXAMPLE_WEIGHTS[i].toLocaleString()}</span>
              <span className={`font-mono text-sm font-black ${textColor}`}>{(EXAMPLE_DIGITS[i] * EXAMPLE_WEIGHTS[i]).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className={`font-mono text-sm p-5 rounded-2xl text-center ${isDarkMode ? 'bg-black/40' : 'bg-white/80 border border-violet-100'}`}>
          <span className={`opacity-60 text-xs ${textColor}`}>
            2*4096 + 11*256 + 12*16 + 9*1 = 8192 + 2816 + 192 + 9 =
          </span>
          <span className="text-violet-400 font-black text-2xl ml-2">{exampleTotal.toLocaleString()}_10</span>
        </div>
      </div>

      {/* Dual Interactive Converter */}
      <TryItYourself />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hex -> Decimal */}
        <div className={`p-8 rounded-3xl border ${cardBg}`}>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Hex -{'>'} Decimal</h3>
          <input
            type="text" value={hexInput} maxLength={6}
            onChange={e => setHexInput(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
            placeholder="2BC9"
            className={`w-full text-center text-3xl font-black font-mono rounded-2xl border-2 p-4 outline-none mb-6 transition-all
              ${isDarkMode ? 'bg-black/40 border-violet-500/30 text-violet-400 focus:border-violet-400' : 'bg-white border-violet-300 text-violet-700 focus:border-violet-500'}`}
          />
          <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
            <div className={`text-xs font-mono opacity-50 mb-1 ${textColor}`}>= (decimal)</div>
            <div className="text-4xl font-black text-violet-400">{hexDecResult.toLocaleString()}</div>
          </div>
        </div>

        {/* Decimal -> Hex */}
        <div className={`p-8 rounded-3xl border ${cardBg}`}>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Decimal -{'>'} Hex</h3>
          <input
            type="number" min={0} max={16777215} value={decInput}
            onChange={e => setDecInput(Math.max(0, Math.min(16777215, parseInt(e.target.value) || 0)))}
            className={`w-full text-center text-3xl font-black font-mono rounded-2xl border-2 p-4 outline-none mb-6 transition-all
              ${isDarkMode ? 'bg-black/40 border-violet-500/30 text-white focus:border-violet-400' : 'bg-white border-violet-300 text-gray-800 focus:border-violet-500'}`}
          />
          <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
            <div className={`text-xs font-mono opacity-50 mb-1 ${textColor}`}>= (hex)</div>
            <div className="text-4xl font-black text-violet-400">0x{decHexResult}</div>
          </div>
        </div>
      </div>

      {/* Why Hex Matters */}
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>Why Does Hex Matter?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            { title: 'Memory Addresses', body: 'RAM addresses like 0x7FFE are far shorter than full binary. 4 hex digits = 16 binary digits.', color: 'text-violet-400' },
            { title: 'RGB Colors', body: '#FF5733 is hex shorthand for red=255, green=87, blue=51 - 1 byte per channel.', color: 'text-rose-400' },
            { title: 'Machine Code', body: 'CPU opcodes like 0xB8 are more readable than 10111000. Programmers use hex constantly.', color: 'text-sky-400' },
          ].map((item, i) => (
            <div key={i} className={`p-5 rounded-2xl ${isDarkMode ? 'bg-black/30' : 'bg-white border border-gray-100'}`}>
              <div className={`font-black text-sm mb-2 ${item.color}`}>{item.title}</div>
              <div className={`text-xs opacity-70 leading-relaxed ${textColor}`}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
