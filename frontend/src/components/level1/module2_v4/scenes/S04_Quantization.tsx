import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Binary, AlertTriangle, Cpu, Ruler, Activity, Zap, Terminal, Sliders, Volume2, Maximize2 } from 'lucide-react';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { useModule2Audio } from '../hooks/useModule2Audio';

/**
 * S04_Quantization: THE RUNG PARADOX (ELITE VERSION)
 * Focus: Vertical precision and the SNR Law.
 * Features: Mouse-controlled Bit Depth, Live SNR Meter, Quantization Audio, Floating Data Planes.
 */
export const S04_Quantization: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Interaction State ---
  const [targetParams, setTargetParams] = useState({ bitDepthFactor: 0.3 });
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Audio State (Quantization Noise Layer) ---
  const { createOscillator, createGain, updateGain } = useModule2Audio();

  const initAudio = () => {
    createOscillator('noise-s04', 'sawtooth', 55).connect(createGain('gain-s04', 0));
  };

  // Physics
  const springBits = useSpring(0.3, { stiffness: 45, damping: 20 });
  useEffect(() => {
    springBits.set(targetParams.bitDepthFactor);
  }, [targetParams, springBits]);

  const resetIdleTimer = () => {
    setIsIdle(false);
    initAudio();
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1500);
  };

  const currentBitsFactor = springBits.get();
  const bitDepth = Math.max(1, Math.floor(1 + currentBitsFactor * 11)); // 1 to 12 bits

  const config = useMemo((): SignalConfig => ({
    frequency: 1,
    amplitude: 60,
    sampleRate: 64, // High sample rate to focus on vertical precision
    bitDepth: bitDepth,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  }), [bitDepth]);

  const { analogPoints, reconstructedPoints } = SignalEngine(config, time, 600, 250);

  // Scientific SNR Calculation (6.02N + 1.76 dB)
  const snr = useMemo(() => (6.02 * bitDepth + 1.76).toFixed(1), [bitDepth]);
  const levels = Math.pow(2, bitDepth);
  const gridLines = useMemo(() => {
    if (levels > 64) return []; // Don't draw too many lines
    return Array.from({ length: levels }, (_, i) => (i / (levels - 1)) * 200 + 25);
  }, [levels]);

  // Sync Audio Gain to Bit Depth (Higher bits -> Lower noise)
  useEffect(() => {
    const baseGain = isIdle ? 0 : (1.2 - (bitDepth / 12)) * 0.05;
    updateGain('gain-s04', baseGain);
  }, [bitDepth, isIdle, updateGain]);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const canvasBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-gray-50 border-gray-200';

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
            Level 02.04 // The Rung Paradox
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          Vertical <span className={accentColor}>Resolution</span>
        </h2>
        <p className={`text-xl leading-relaxed font-medium max-w-2xl ${subTextColor}`}>
            Quantization means rounding the measured value to the nearest allowed level. 
            A computer is a ladder; quantization is the act of rounding reality to the nearest available rung.
        </p>
      </header>

      <div className="relative group">
            {/* Interaction Instruction */}
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute -top-10 left-0 right-0 text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${subTextColor}`}>
                           Move Vertical: Bit-Depth Resolution
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className={`relative h-[580px] w-full rounded-[4rem] border overflow-hidden shadow-2xl transition-all duration-700 ${isIdle ? 'cursor-default' : 'cursor-grabbing'} ${canvasBg}`}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTargetParams({ 
                        bitDepthFactor: 1 - (e.clientY - rect.top) / rect.height
                    });
                    resetIdleTimer();
                }}
            >
                {/* Accessible Hidden Input */}
                <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={targetParams.bitDepthFactor} 
                    onChange={(e) => setTargetParams({ bitDepthFactor: parseFloat(e.target.value) })}
                    className="sr-only" aria-label="Adjust Bit Depth"
                />
                {/* FLOATING DATA PLANES (Grid Lines) */}
                <div className="absolute inset-x-0 top-[15%] bottom-[15%] pointer-events-none opacity-[0.08]">
                    {gridLines.map((y, i) => (
                        <motion.div 
                            key={i} 
                            style={{ top: `${(y / 250) * 100}%` }}
                            className={`absolute w-full h-[1px] ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        />
                    ))}
                </div>

                {/* CLIPPING BOUNDARIES */}
                <div className="absolute inset-x-0 h-4 top-0 bg-red-500/5 border-b border-red-500/10 pointer-events-none" />
                <div className="absolute inset-x-0 h-4 bottom-0 bg-red-500/5 border-t border-red-500/10 pointer-events-none" />

                {/* LIVE SNR GAUGE */}
                <div className={`absolute top-10 left-10 z-20 p-8 rounded-[2.5rem] border backdrop-blur-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-2xl' : 'bg-white/80 border-gray-100 shadow-xl'}`}>
                    <div className="space-y-6">
                        <div className="space-y-1" aria-live="polite">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Signal-to-Noise Ratio</span>
                            <div className={`text-4xl font-black italic tracking-tighter ${accentColor}`}>
                                {snr}<span className="text-xs not-italic opacity-30 font-mono ml-2">dB</span>
                            </div>
                        </div>
                        <div className="flex gap-10">
                            <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Bit Horizon</span>
                                <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{bitDepth} <span className="text-xs not-italic opacity-30 font-mono">bit</span></div>
                            </div>
                            <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Resolution</span>
                                <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{levels.toLocaleString()} <span className="text-xs not-italic opacity-30 font-mono">levels</span></div>
                            </div>
                        </div>

                        {/* SNR GROWTH THERMOMETER */}
                        <div className="pt-6 flex items-end gap-3 h-20">
                             {Array.from({ length: 12 }).map((_, i) => (
                                 <motion.div 
                                    key={i}
                                    className={`w-2 rounded-t-sm transition-colors ${i < bitDepth ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-white/5'}`}
                                    animate={{ height: `${(i + 1) * 8}%` }}
                                 />
                             ))}
                             <div className="flex flex-col justify-between h-full py-1">
                                 <span className={`text-[7px] font-mono ${accentColor}`}>96dB</span>
                                 <span className={`text-[7px] font-mono ${subTextColor}`}>6dB</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* THE QUANTIZATION CANVAS */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="100%" height="70%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        {/* ERROR GAP Visualization */}
                        <path 
                             d={analogPoints.map((p, i) => {
                                 const rp = reconstructedPoints[i];
                                 return `M${p.x},${p.y} L${rp.x},${rp.y}`;
                             }).join(' ')}
                             stroke="#ef4444"
                             strokeWidth="1"
                             strokeOpacity={Math.max(0, 0.4 - (bitDepth / 16))}
                        />

                        {/* Analog Ghost */}
                        <path d={analogPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="1" strokeOpacity="0.05" strokeDasharray="4 4" />
                        
                        {/* Digital Staircase */}
                        <motion.path 
                            d={reconstructedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
                            style={{ filter: isDarkMode ? `drop-shadow(0 0 20px ${strokeColor}44)` : 'none' }}
                            animate={{ opacity: [1, 0.8, 1], strokeWidth: [5, 6, 5] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                    </svg>
                </div>

                {/* ELITE CUSTOM CURSOR (Axe Grip) */}
                <motion.div 
                    className="absolute w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
                    style={{ 
                        left: '50%', 
                        top: (1 - currentBitsFactor) * 100 + '%',
                        y: '-50%',
                        x: '-50%'
                    }}
                >
                    <div className="absolute inset-x-[-100vw] h-[1px] bg-orange-500/10 border-t border-dashed border-orange-500/20" />
                    <div className="w-10 h-10 border border-orange-500/40 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md">
                         <Ruler size={16} className="text-orange-500" />
                    </div>
                    {/* Audio visualizer hint */}
                    <div className="absolute top-12 flex gap-0.5 items-end h-4">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div 
                                key={i} className="w-1 bg-orange-500/40 rounded-full" 
                                animate={{ height: isIdle ? 2 : Math.random() * 12 }} 
                            />
                        ))}
                    </div>
                </motion.div>

                {/* STATE LABEL */}
                <div className={`absolute bottom-10 left-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={accentColor} />
                    <span className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}>
                        DYNAMIC_RANGE: {snr} dB | RESOLUTION_FLOOR: {(1/levels).toFixed(6)} V
                    </span>
                </div>
            </motion.div>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
            <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The 6dB Golden Rule</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    Every single bit you add doubles the number of available rungs. Each extra bit improves the signal‑to‑noise ratio (SNR) by about 6 dB. This is the **6.02 dB per bit rule**.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-orange-100'}`}>
                 <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Aha! Moment</h4>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "A ruler with only centimetre marks is coarse. A ruler with millimetre marks is precise. Both are digital approximations of a smooth length."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Rung Paradox: Quantization means rounding the measured value to the nearest allowed level. The number of levels is 2^N, where N is the bit depth.",
              physical: "The 6dB Rule: More bits mean smaller steps, so the error is smaller. Each extra bit improves the signal‑to‑noise ratio (SNR) by about 6 dB.",
              formal: "Quantization Error: The difference between the analog value and the rounded digital value. This rounding creates 'Quantization Noise'.",
              insight: "The Danger of Clipping: If a signal is too loud (exceeds the full scale), the quantizer hits the maximum level and stays there. This is clipping – it sounds terrible and must be avoided.",
              advanced: [
                  {
                      title: "Differential Nonlinearity (DNL)",
                      content: "In real silicon, the rungs aren't perfectly spaced. DNL measures the deviation between adjacent levels. If a rung is missing entirely, it's called a 'missing code'—a catastrophic ADC failure."
                  },
                  {
                      title: "Dynamic Range vs. S/N",
                      content: "Bit depth defines the dynamic range: the distance between the loudest possible signal and the quietest floor. 24-bit audio allows for a range of 144dB—wider than the difference between a whisper and a jet engine."
                  }
              ]
          }}
      />
    </div>
  );
};
