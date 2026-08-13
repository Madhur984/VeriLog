import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Calculator, Percent, FastForward } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S13_B_FloatingPoint: React.FC<Props> = ({ isActive, isDarkMode }) => {
  // IEEE 754 Half Precision (16-bit)
  // 1 sign, 5 exponent, 10 mantissa
  const [bits, setBits] = useState<number[]>(new Array(16).fill(0));

  const systemTemperature = useBinaryStore(s => s.systemTemperature);
  const recordAction = useBinaryStore(s => s.recordAction);

  // Calculation logic
  const result = useMemo(() => {
    const s = bits[0];
    const eBits = bits.slice(1, 6);
    const mBits = bits.slice(6);

    const exp = eBits.reduce((acc, b, i) => acc + b * Math.pow(2, 4 - i), 0);
    const mantissaValue = mBits.reduce((acc, b, i) => acc + b * Math.pow(2, -(i + 1)), 0);

    const bias = 15;
    
    // Special cases
    if (exp === 0) {
        if (mantissaValue === 0) return { val: s ? -0 : 0, type: 'zero', formula: '+/-0' };
        // Subnormal
        const val = Math.pow(-1, s) * Math.pow(2, 1 - bias) * mantissaValue;
        return { val, type: 'subnormal', formula: `(-1)^${s} * 2^-14 * ${mantissaValue.toFixed(4)}` };
    }
    if (exp === 31) {
        if (mantissaValue === 0) return { val: s ? -Infinity : Infinity, type: 'infinity', formula: s ? '-Inf' : '+Inf' };
        return { val: NaN, type: 'nan', formula: 'NaN' };
    }

    // Normal
    const realExp = exp - bias;
    const fraction = 1 + mantissaValue;
    const val = Math.pow(-1, s) * Math.pow(2, realExp) * fraction;

    return { 
        val, 
        type: 'normal', 
        sign: s,
        exp: realExp, 
        frac: fraction,
        formula: `(-1)^${s} * 2^${realExp} * ${fraction.toFixed(4)}`
    };
  }, [bits]);

  const toggleBit = (i: number) => {
    setBits(prev => {
      const next = [...prev];
      next[i] = 1 - next[i];
      return next;
    });
    playBitTone(15-i, bits[i] === 0 ? 'high' : 'low');
    recordAction('interactions');
  };

  const setPreset = (preset: number[]) => {
      setBits(preset);
      recordAction('interactions');
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  const COLORS = {
      sign: '#FB7185', // Rose
      exp: '#F59E0B',  // Amber
      mant: '#0EA5E9'  // Sky
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 transition-all duration-1000" style={{
        filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, ${glowOpacity}))` : 'none'
    }}>
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[11px] tracking-[0.4em] uppercase block mb-4 ${subTextColor}`}
        >
          Engineering Deep Dive - Precision Computing
        </motion.span>
        <h2 className={`text-4xl md:text-5xl font-black ${textColor}`}>Floating Point</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
            How computers handle fractions and massive numbers. Explore the IEEE 754 16-bit Half-Precision format.
        </p>
      </section>

      {/* Mission Protocol Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'} max-w-4xl mx-auto grid md:grid-cols-3 gap-6`}>
          <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Pedagogy</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Floating-point logic using dynamic binary-point shifting for scale and precision.</p>
          </div>
          <div className="space-y-1 md:border-l md:border-sky-500/20 md:pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Protocol</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Toggle Sign (1), Exponent (5), and Mantissa (10) bits to update the scientific formula.</p>
          </div>
          <div className="space-y-1 md:border-l md:border-sky-500/20 md:pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Objective</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Understand how fixed-width registers represent near-infinite numerical ranges.</p>
          </div>
      </div>

      {/* Main Register */}
      <TryItYourself />
      <div className={`p-5 sm:p-10 rounded-[2.5rem] border ${cardBg}`}>
          <div className="flex flex-col items-center gap-10">
              
              {/* Bit Blocks */}
              <div className="w-full overflow-x-auto sm:overflow-x-visible -mx-5 px-5 sm:mx-0 sm:px-0">
              <div className="w-max min-w-full mx-auto flex justify-center gap-1 flex-nowrap sm:flex-wrap">
                  {bits.map((b, i) => {
                      const section = i === 0 ? 'sign' : (i < 6 ? 'exp' : 'mant');
                      const color = COLORS[section];
                      return (
                          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                              <span className="font-mono text-[8px] opacity-30 font-bold">{15-i}</span>
                              <motion.button
                                onClick={() => toggleBit(i)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ 
                                    backgroundColor: b ? color : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                                    borderColor: b ? color : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                    color: b ? '#fff' : (isDarkMode ? '#475569' : '#94A3B8'),
                                    boxShadow: b ? `0 0 15px ${color}33` : 'none'
                                }}
                                className="w-7 h-10 sm:w-9 sm:h-12 flex-shrink-0 rounded-lg border-2 font-mono font-black text-base sm:text-lg transition-all"
                              >
                                  {b}
                              </motion.button>
                              {/* Label groups */}
                              {i === 0 && <span className="text-[7px] font-black uppercase tracking-tighter" style={{ color: COLORS.sign }}>Sign</span>}
                              {i === 1 && <span className="text-[7px] font-black uppercase tracking-tighter" style={{ color: COLORS.exp }}>Exponent (5)</span>}
                              {i === 6 && <span className="text-[7px] font-black uppercase tracking-tighter" style={{ color: COLORS.mant }}>Mantissa (10)</span>}
                          </div>
                      );
                  })}
              </div>
              </div>

              {/* Live Result Display */}
              <div className={`w-full grid md:grid-cols-2 gap-8 items-center border-t pt-10 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                  <div className="space-y-4">
                      <div className="flex items-center gap-2">
                          <Calculator size={16} className="text-sky-500" />
                          <h4 className="font-mono text-xs uppercase tracking-widest opacity-50">Scientific Result</h4>
                      </div>
                      <div className="flex flex-col gap-1">
                          <motion.div 
                            key={result.val}
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className={`text-3xl sm:text-5xl font-black font-mono break-all ${textColor}`}
                          >
                              {result.val === 0 && bits[0] ? '-0.0' : result.val}
                          </motion.div>
                          <div className={`text-xs font-mono px-3 py-1.5 rounded-lg inline-block self-start bg-sky-400/10 text-sky-400`}>
                              Type: {result.type.toUpperCase()}
                          </div>
                      </div>
                  </div>

                  <div className={`space-y-4 p-4 sm:p-6 rounded-2xl border font-mono ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                      <div className="flex items-center gap-2 opacity-40 text-[10px] uppercase tracking-widest">
                          <Percent size={12} /> Live Formula
                      </div>
                      <div className={`text-sm leading-relaxed break-words ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>
                          Value = <span style={{ color: COLORS.sign }}>(-1)^{bits[0]}</span> x 
                          <span style={{ color: COLORS.exp }}> 2^({result.type === 'normal' ? `${(bits.slice(1,6).reduce((a,b,i)=>a+b*Math.pow(2,4-i),0))} - 15` : (result.type === 'subnormal' ? '-14' : '...')})</span> x 
                          <span style={{ color: COLORS.mant }}> ({result.type === 'normal' ? (1 + bits.slice(6).reduce((a,b,i)=>a+b*Math.pow(2,-(i+1)),0)).toFixed(4) : (bits.slice(6).reduce((a,b,i)=>a+b*Math.pow(2,-(i+1)),0)).toFixed(4)})</span>
                      </div>
                      <div className={`text-[10px] opacity-30 mt-2 border-t pt-2 italic ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                          Standard: IEEE 754-2008 Half-Precision
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Preset Buttons */}
          <div className={`p-5 sm:p-8 rounded-3xl border ${cardBg} space-y-4`}>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                    <FastForward size={14} /> Quick Presets
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Value 1.0', p: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                        { label: 'Value 0.5', p: [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                        { label: 'Value 2.0', p: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                        { label: 'Pi (approx)', p: [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0] },
                        { label: '+Infinity', p: [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                        { label: 'NaN', p: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
                    ].map(btn => (
                        <button 
                            key={btn.label}
                            onClick={() => setPreset(btn.p)}
                            className={`p-3.5 sm:p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all
                                ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-sky-500/20 hover:border-sky-500 hover:text-sky-400' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-sky-50 hover:border-sky-200'}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
          </div>

          {/* Educational Insights */}
          <div className={`p-5 sm:p-8 rounded-3xl border ${cardBg} space-y-4 lg:col-span-2`}>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                    <Info size={14} /> Why Floating Point?
                </div>
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 text-sm opacity-70 leading-relaxed">
                    <div className="space-y-3">
                        <p className="font-bold">1. The Dynamic Range</p>
                        <p>Fixed-point math (integers) can't easily handle numbers across different scales. Floating point moves the binary point, allowing a single 16-bit register to represent anything from 0.00000006 to 65,504.</p>
                    </div>
                    <div className="space-y-3">
                        <p className="font-bold">2. The Precision Trade-off</p>
                        <p>More bits in the "mantissa" means more accuracy. More bits in the "exponent" means a wider range of values. IEEE 754 balances these based on application (16-bit for AI/Graphics, 64-bit for Science).</p>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
};
