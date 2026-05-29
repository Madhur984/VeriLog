import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, AlertCircle, RefreshCw, Radio, HardDrive } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S13_E_ErrorCorrection: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [dataBits, setDataBits] = useState<number[]>([1, 0, 1, 1]); // Original 4 bits
  const [noiseIdx, setNoiseIdx] = useState<number | null>(null); // Injected bit flip index (0-6)
  
  const systemTemperature = useBinaryStore(s => s.systemTemperature);
  const recordAction = useBinaryStore(s => s.recordAction);

  // Hamming (7, 4) Logic
  // Bits: d1, d2, d3, d4
  // Codeword positions: p1, p2, d1, p3, d2, d3, d4
  // Indices (1-based): 1, 2, 3, 4, 5, 6, 7
  
  const encodeHamming = (d: number[]) => {
      const p1 = (d[0] + d[1] + d[3]) % 2;
      const p2 = (d[0] + d[2] + d[3]) % 2;
      const p3 = (d[1] + d[2] + d[3]) % 2;
      return [p1, p2, d[0], p3, d[1], d[2], d[3]];
  };

  const codeword = useMemo(() => encodeHamming(dataBits), [dataBits]);
  
  const receivedCodeword = useMemo(() => {
    if (noiseIdx === null) return [...codeword];
    const newCw = [...codeword];
    newCw[noiseIdx] = 1 - newCw[noiseIdx];
    return newCw;
  }, [codeword, noiseIdx]);

  const syndrome = useMemo(() => {
    const c = receivedCodeword;
    const s1 = (c[0] + c[2] + c[4] + c[6]) % 2;
    const s2 = (c[1] + c[2] + c[5] + c[6]) % 2;
    const s3 = (c[3] + c[4] + c[5] + c[6]) % 2;
    return [s1, s2, s3];
  }, [receivedCodeword]);

  const errorPos = useMemo(() => {
    return syndrome[0] * 1 + syndrome[1] * 2 + syndrome[2] * 4;
  }, [syndrome]);

  const toggleDataBit = (i: number) => {
      setDataBits(prev => {
          const next = [...prev];
          next[i] = 1 - next[i];
          return next;
      });
      playBitTone(7-i, dataBits[i] === 0 ? 'high' : 'low');
      recordAction('interactions');
  };

  const toggleNoise = (i: number) => {
      if (noiseIdx === i) setNoiseIdx(null);
      else setNoiseIdx(i);
      playBitTone(4, 'low');
      recordAction('interactions');
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  const COLORS = {
      parity: '#F59E0B', // Amber
      data: '#0EA5E9',   // Sky
      error: '#EF4444'   // Red
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
          Engineering Deep Dive - Data Integrity
        </motion.span>
        <h2 className={`text-4xl md:text-5xl font-black ${textColor}`}>Error Correction</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
            Binary data is fragile. Learn how **Hamming(7,4)** uses parity algebra to not only detect errors but automatically heal them.
        </p>
      </section>

      {/* Mission Protocol Card */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'} max-w-4xl mx-auto grid md:grid-cols-3 gap-6`}>
          <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Pedagogy</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Linear block coding using P-bit algebra to detect and isolate hardware corruption.</p>
          </div>
          <div className="space-y-1 border-l border-sky-500/20 pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Protocol</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Set a 4-bit nibble, then flip any bit in the noise channel to trigger the healer.</p>
          </div>
          <div className="space-y-1 border-l border-sky-500/20 pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Objective</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Observe the Syndrome Decoder isolate exactly which bit is faulty and revert it.</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Encoder Side */}
          <div className="space-y-6">
              <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-8">
                      <Radio className="text-sky-500" size={20} />
                      <h3 className={`font-mono text-xs uppercase tracking-widest ${textColor}`}>System Transmission</h3>
                  </div>

                  {/* Input Data (4 bits) */}
                  <div className="mb-10 text-center">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-4">Target Nibble (4-Bit)</label>
                      <div className="flex justify-center gap-4">
                          {dataBits.map((b, i) => (
                              <motion.button
                                key={i}
                                onClick={() => toggleDataBit(i)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all
                                    ${b ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                              >
                                  {b}
                              </motion.button>
                          ))}
                      </div>
                  </div>

                  {/* Codeword Generation */}
                  <div className="space-y-4">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                          <span>Hamming Word Generated</span>
                          <span className="text-amber-500">Parity: P1 P2 P3</span>
                      </div>
                      <div className="flex justify-center gap-1">
                          {codeword.map((b, i) => {
                              const isParity = [0, 1, 3].includes(i);
                              return (
                                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                      <div className={`w-full py-2 rounded-lg text-center font-mono text-xs font-black border
                                          ${isParity ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-sky-500/10 border-sky-500/30 text-sky-500'}`}>
                                          {b}
                                      </div>
                                      <span className="text-[7px] font-bold opacity-30">{isParity ? `P${[0, 1, 3].indexOf(i)+1}` : `D${[2, 4, 5, 6].indexOf(i)+1}`}</span>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>

              {/* Noise Channel */}
              <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                          <Zap className="text-red-500" size={18} />
                          <h3 className={`font-mono text-xs uppercase tracking-widest ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Noise Interaction</h3>
                      </div>
                      <button onClick={() => setNoiseIdx(null)} className="text-[9px] font-black uppercase text-red-500 hover:scale-105 transition-transform">Clear Faults</button>
                  </div>
                  <p className={`text-xs opacity-60 mb-6 leading-relaxed ${textColor}`}>
                      Click any bit below to manually "corrupt" the transmission. The Hamming decoder will attempt to locate it.
                  </p>
                  <div className="flex justify-center gap-1">
                      {receivedCodeword.map((b, i) => (
                          <motion.button
                            key={i}
                            onClick={() => toggleNoise(i)}
                            whileTap={{ scale: 0.9 }}
                            className={`flex-1 py-4 rounded-xl border-2 font-mono text-sm font-black transition-all
                                ${noiseIdx === i 
                                    ? 'bg-red-500 border-red-400 text-white animate-pulse' 
                                    : 'bg-black/10 border-white/5 text-white/40 hover:border-red-500/30'}`}
                          >
                              {b}
                          </motion.button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Decoder Visualizer */}
          <div className="space-y-6">
              <div className={`p-8 rounded-[2.5rem] border flex flex-col h-full ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-900 border-slate-800 shadow-2xl'}`}>
                  <div className="flex items-center gap-3 mb-10">
                      <ShieldCheck className="text-green-500" size={24} />
                      <h3 className="text-white font-bold tracking-tight">Real-time Syndrome Decoder</h3>
                  </div>

                  {/* Syndromes */}
                  <div className="grid grid-cols-3 gap-4 mb-12">
                      {syndrome.map((s, i) => (
                          <div key={i} className={`p-4 rounded-2xl border text-center transition-all ${s ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-green-500/10 border-green-500/30'}`}>
                              <div className={`text-[8px] font-black uppercase mb-1 ${s ? 'text-red-400' : 'text-green-400'}`}>Syndrome S{i+1}</div>
                              <div className={`text-2xl font-black font-mono ${s ? 'text-white' : 'text-green-500'}`}>{s}</div>
                          </div>
                      ))}
                  </div>

                  {/* Diagnosis */}
                  <div className={`flex-1 p-8 rounded-3xl border flex flex-col items-center justify-center text-center transition-all
                      ${errorPos > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                      <AnimatePresence mode="wait">
                          {errorPos === 0 ? (
                              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                  <ShieldCheck size={48} className="text-green-500 mx-auto" />
                                  <h4 className="text-green-500 font-black text-xl">Integrity Verified</h4>
                                  <p className="text-xs text-white/40 font-mono">No bit errors detected in codeword.</p>
                              </motion.div>
                          ) : (
                              <motion.div key="err" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                  <AlertCircle size={48} className="text-red-500 mx-auto animate-bounce" />
                                  <h4 className="text-red-500 font-black text-xl">Error Localized</h4>
                                  <div className="inline-block px-6 py-2 rounded-xl bg-red-500 text-white font-black font-mono text-2xl">
                                      POS: {errorPos}
                                  </div>
                                  <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                                      Corruption at bit index {errorPos} (Binary {errorPos.toString(2).padStart(3, '0')}).<br/>
                                      <span className="text-green-400">State Healed Automatically: {receivedCodeword[errorPos-1] === 0 ? '0' : '1'} -{'>'} {receivedCodeword[errorPos-1] === 1 ? '0' : '1'}</span>
                                  </p>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>

                  {/* Explainer */}
                  <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                       <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Mathematical Basis</div>
                       <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                          Hamming distance allows us to map 4 data bits into a 128-state space where each valid point is surrounded by invalid "buffer" zones. One flip can only drive the signal into a buffer zone linked back to the original point.
                       </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
