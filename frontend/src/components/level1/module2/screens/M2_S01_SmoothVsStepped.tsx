import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { InteractiveWaveform } from '../shared/UltimateComponents';
import { Waves, Square } from 'lucide-react';

export const M2_S01_SmoothVsStepped: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [waveType, setWaveType] = useState<'analog' | 'digital'>('analog');

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-12 px-6">

      {/* 🚀 ULTIMATE HEADER */}
      <div className="text-center space-y-4">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.4em] text-[#00D4FF] uppercase"
        >
          Phase I // Pattern Recognition
        </motion.p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
          One flows. <span className="text-[#FF5F1F]">One jumps.</span>
        </h2>
        <p className="font-mono text-sm text-[#8A8A99] max-w-2xl mx-auto">
          The natural world is <span className="text-[#00D4FF]">Analog</span>-a smooth, unbroken stream.
          Information machines are <span className="text-[#FF5F1F]">Digital</span>-captured in discrete steps.
        </p>
      </div>

      {/* 🔬 WAVEFORM LAB */}
      <div className="w-full bg-[#121215] border border-[#2A2A35] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${waveType === 'analog' ? 'bg-[#00D4FF]' : 'bg-[#FF5F1F]'}`} />
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">Signal Monitor v2.1</span>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { setWaveType('analog'); triggerHaptic('light'); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs uppercase transition-all ${
                waveType === 'analog' ? 'bg-[#00D4FF] text-black font-bold' : 'text-[#8A8A99] hover:text-white'
              }`}
            >
              <Waves size={14} /> Analog
            </button>
            <button
              onClick={() => { setWaveType('digital'); triggerHaptic('light'); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs uppercase transition-all ${
                waveType === 'digital' ? 'bg-[#FF5F1F] text-black font-bold' : 'text-[#8A8A99] hover:text-white'
              }`}
            >
              <Square size={14} /> Digital
            </button>
          </div>
        </div>

        <InteractiveWaveform type={waveType} frequency={2} amplitude={70} />

        <div className="mt-8 grid md:grid-cols-2 gap-8 text-sm">
          <div className={`p-4 rounded-2xl border transition-all ${waveType === 'analog' ? 'border-[#00D4FF]/30 bg-[#00D4FF]/5' : 'border-[#2A2A35] opacity-40'}`}>
            <h4 className="font-bold text-[#00D4FF] uppercase text-xs mb-2">Analog Stream</h4>
            <p className="text-[#8A8A99] text-xs leading-relaxed">
              Continuous movement. Infinite precision. It represents voltage exactly as it flows through time.
            </p>
          </div>
          <div className={`p-4 rounded-2xl border transition-all ${waveType === 'digital' ? 'border-[#FF5F1F]/30 bg-[#FF5F1F]/5' : 'border-[#2A2A35] opacity-40'}`}>
            <h4 className="font-bold text-[#FF5F1F] uppercase text-xs mb-2">Digital Steps</h4>
            <p className="text-[#8A8A99] text-xs leading-relaxed">
              Discrete snapshots. Quantized logic. It chops the world into 0s and 1s for the machine to understand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
