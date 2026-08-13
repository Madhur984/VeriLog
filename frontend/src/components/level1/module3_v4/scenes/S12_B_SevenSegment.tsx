import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Power, Hash } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Segment mappings for 0-F (BCD to 7-Segment)
// a, b, c, d, e, f, g
const SEG_MAP: Record<number, number[]> = {
  0: [1, 1, 1, 1, 1, 1, 0],
  1: [0, 1, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1],
  3: [1, 1, 1, 1, 0, 0, 1],
  4: [0, 1, 1, 0, 0, 1, 1],
  5: [1, 0, 1, 1, 0, 1, 1],
  6: [1, 0, 1, 1, 1, 1, 1],
  7: [1, 1, 1, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1],
  9: [1, 1, 1, 1, 0, 1, 1],
  10: [1, 1, 1, 0, 1, 1, 1], // A
  11: [0, 0, 1, 1, 1, 1, 1], // b
  12: [1, 0, 0, 1, 1, 1, 0], // C
  13: [0, 1, 1, 1, 1, 0, 1], // d
  14: [1, 0, 0, 1, 1, 1, 1], // E
  15: [1, 0, 0, 0, 1, 1, 1], // F
};

const SEG_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

export const S12_B_SevenSegment: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0]); // 4-bit BCD
  const [isManual, setIsManual] = useState(false);
  const [manualSegs, setManualSegs] = useState<number[]>(new Array(7).fill(0));

  const systemTemperature = useBinaryStore(s => s.systemTemperature);
  const recordAction = useBinaryStore(s => s.recordAction);

  const value = useMemo(() => {
    return bits.reduce((acc, b, i) => acc + b * Math.pow(2, 3 - i), 0);
  }, [bits]);

  const activeSegs = isManual ? manualSegs : (SEG_MAP[value] || new Array(7).fill(0));

  const toggleBit = (i: number) => {
    setBits(prev => {
        const next = [...prev];
        next[i] = 1 - next[i];
        return next;
    });
    playBitTone(3 - i, bits[i] === 0 ? 'high' : 'low');
    recordAction('interactions');
  };

  const toggleSegManually = (i: number) => {
      if (!isManual) return;
      setManualSegs(prev => {
          const next = [...prev];
          next[i] = 1 - next[i];
          return next;
      });
      playBitTone(i, manualSegs[i] === 0 ? 'high' : 'low');
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = isDarkMode ? '#0EA5E9' : '#0284C7';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12 transition-all duration-1000" style={{
        filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, ${glowOpacity}))` : 'none'
    }}>
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[11px] tracking-[0.4em] uppercase block mb-4 ${subTextColor}`}
        >
          Engineering Deep Dive - BCD Decoder
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>7-Segment Logic</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
            How logic flows into hardware. Convert binary codes into visual shapes via a fixed decoder network.
        </p>
      </section>

      {/* Mission Protocol Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'} max-w-4xl mx-auto grid md:grid-cols-3 gap-6`}>
          <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Pedagogy</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Hardware translation of binary nibbles into physical LED segment triggers.</p>
          </div>
          <div className="space-y-1 md:border-l md:border-sky-500/20 md:pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Protocol</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Toggle 4-bit BCD inputs to observe signal propagation through the decoder.</p>
          </div>
          <div className="space-y-1 md:border-l md:border-sky-500/20 md:pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Objective</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Map binary values 0-F to their equivalent hardware-defined visual patterns.</p>
          </div>
      </div>

      <TryItYourself />
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Controls & BCD Mapping */}
          <div className="space-y-6">
              <div className={`p-5 sm:p-8 rounded-[2rem] border ${cardBg}`}>
                  <div className="flex flex-wrap items-center gap-3 justify-between mb-8">
                      <div className="flex items-center gap-3">
                          <Cpu className="text-sky-500" size={20} />
                          <h3 className={`font-mono text-xs uppercase tracking-widest ${textColor}`}>BCD Input Decoder</h3>
                      </div>
                      <button 
                        onClick={() => setIsManual(!isManual)}
                        className={`px-4 py-2.5 sm:py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all
                            ${isManual 
                                ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                                : `${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} text-slate-500 hover:border-${accent}`}`}
                      >
                          {isManual ? 'Manual Override ON' : 'Auto Decode Mode'}
                      </button>
                  </div>

                  {/* 4-Bit BCD Switcher */}
                  <div className={`mb-10 transition-opacity duration-300 ${isManual ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
                      <div className="flex justify-center gap-3 sm:gap-4 mb-4">
                          {bits.map((b, i) => (
                              <div key={i} className="flex flex-col items-center gap-2">
                                  <span className="font-mono text-[10px] opacity-40 uppercase tracking-tighter">2^{3-i}</span>
                                  <motion.button
                                    onClick={() => toggleBit(i)}
                                    whileTap={{ scale: 0.9 }}
                                    animate={{ 
                                        backgroundColor: b ? accent : (isDarkMode ? '#1a1d24' : '#f1f5f9'),
                                        boxShadow: b ? `0 0 20px ${accent}44` : 'none'
                                    }}
                                    className="w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl font-black transition-colors"
                                    style={{ borderColor: b ? accent : (isDarkMode ? '#2d3139' : '#e2e8f0'), color: b ? '#fff' : (isDarkMode ? '#4b5563' : '#9ca3af') }}
                                  >
                                      {b}
                                  </motion.button>
                              </div>
                          ))}
                      </div>
                      <div className="text-center font-mono text-sm">
                          <span className="opacity-40">Value: </span>
                          <span className={`font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{value.toString(10).toUpperCase()}_10 / {value.toString(16).toUpperCase()}_16</span>
                      </div>
                  </div>

                  {/* Segment Logic Trace */}
                  <div className="space-y-2">
                       <h4 className={`font-mono text-[10px] uppercase tracking-widest mb-4 opacity-40 text-center ${textColor}`}>Decoder Trace</h4>
                       <div className="grid grid-cols-7 gap-1 min-w-0">
                           {SEG_LABELS.map((label, i) => (
                               <motion.div 
                                    key={label}
                                    onClick={() => toggleSegManually(i)}
                                    animate={{ 
                                        opacity: activeSegs[i] ? 1 : 0.2,
                                        color: activeSegs[i] ? accent : (isDarkMode ? '#475569' : '#94A3B8'),
                                        borderColor: activeSegs[i] ? accent : 'transparent',
                                        background: activeSegs[i] ? `${accent}11` : 'transparent'
                                    }}
                                    className={`py-2 border rounded-lg text-center font-mono text-sm font-black transition-all ${isManual ? 'cursor-pointer' : 'cursor-default'}`}
                               >
                                   {label}
                                   <div className={`text-[8px] font-bold mt-0.5 ${activeSegs[i] ? 'text-green-400' : 'text-slate-500'}`}>
                                       {activeSegs[i] ? 'HI' : 'LO'}
                                   </div>
                               </motion.div>
                           ))}
                       </div>
                  </div>
              </div>

              {/* Truth Table Insight */}
              <div className={`p-5 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                  <h4 className={`font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                      <Hash size={14} /> Truth Table Logic
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1">
                          <p className="opacity-60 uppercase text-[9px]">Inputs BCD</p>
                          <p className={textColor}>A B C D = {bits.join(' ')}</p>
                      </div>
                      <div className="space-y-1">
                          <p className="opacity-60 uppercase text-[9px]">Boolean EQ (Segment 'a')</p>
                          <p className={isDarkMode ? 'text-amber-300' : 'text-amber-800'}>a = A + C + BD + B'D'</p>
                      </div>
                  </div>
                  <p className={`mt-4 text-[11px] leading-relaxed opacity-60 ${textColor}`}>
                      A 7-segment decoder is essentially 7 independent logic functions (one per segment) sharing the same 4 binary inputs.
                  </p>
              </div>
          </div>

          {/* Visualization: SVG LED Display */}
          <div className={`p-5 sm:p-8 rounded-[2rem] border flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-900 border-slate-900 shadow-2xl'}`}>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />
              
              <div className="relative mb-10">
                 <svg viewBox="0 0 180 300" className="w-full max-w-[180px] h-auto drop-shadow-2xl">
                    {/* Standard 7 Segment segments */}
                    {/* a */}
                    <Seg part="a" active={!!activeSegs[0]} color={accent} x={30} y={20} rotation={0} />
                    {/* b */}
                    <Seg part="b" active={!!activeSegs[1]} color={accent} x={145} y={35} rotation={90} />
                    {/* c */}
                    <Seg part="c" active={!!activeSegs[2]} color={accent} x={145} y={160} rotation={90} />
                    {/* d */}
                    <Seg part="d" active={!!activeSegs[3]} color={accent} x={30} y={260} rotation={0} />
                    {/* e */}
                    <Seg part="e" active={!!activeSegs[4]} color={accent} x={20} y={160} rotation={90} />
                    {/* f */}
                    <Seg part="f" active={!!activeSegs[5]} color={accent} x={20} y={35} rotation={90} />
                    {/* g */}
                    <Seg part="g" active={!!activeSegs[6]} color={accent} x={30} y={140} rotation={0} />
                 </svg>
              </div>

              <Hud value={value} isDarkMode={isDarkMode} />
          </div>
      </div>
    </div>
  );
};

// Internal Helper Components
const Seg: React.FC<{ part: string; active: boolean; color: string; x: number; y: number; rotation: number }> = ({ active, color, x, y, rotation }) => {
    return (
        <motion.path
            d="M 10 0 L 110 0 L 120 10 L 110 20 L 10 20 L 0 10 Z"
            transform={`translate(${x}, ${y}) rotate(${rotation})`}
            animate={{ 
                fill: active ? color : 'rgba(255,255,255,0.03)',
                stroke: active ? color : 'rgba(255,255,255,0.05)',
                strokeWidth: 1,
            }}
            transition={{ duration: 0.2 }}
            style={{ filter: active ? `drop-shadow(0 0 10px ${color})` : 'none' }}
        />
    );
};

const Hud: React.FC<{ value: number; isDarkMode: boolean }> = ({ value, isDarkMode }) => (
    <div className="flex flex-col items-center gap-2 relative z-10">
        <div className={`font-mono text-[9px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-sky-500' : 'text-sky-400'}`}>Digit Decoder Output</div>
        <div className="flex items-baseline gap-2">
            <span className="text-white text-4xl sm:text-5xl font-black font-mono">{value.toString(16).toUpperCase()}</span>
            <span className="text-sky-500/50 font-mono text-sm">base_16</span>
        </div>
    </div>
);
