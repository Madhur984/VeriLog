import React from 'react';
import { M2ScreenProps } from '../types';
import { ADCSimulator } from '../shared/UltimateComponents';

export const M2_S14_Quantization: React.FC<M2ScreenProps> = () => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-12 px-6">
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
          The Conversion Bridge
        </h2>
        <p className="font-mono text-sm text-[#8A8A99] max-w-2xl mx-auto">
          How does a machine "see" voltage? It <span className="text-[#00D4FF]">samples</span> the signal 
          and <span className="text-[#FF5F1F]">quantizes</span> the intensity into a number.
        </p>
      </div>

      <ADCSimulator />

      <div className="grid md:grid-cols-3 gap-4 w-full text-center">
        <div className="p-4 rounded-xl bg-black/40 border border-[#2A2A35]">
          <div className="text-[10px] uppercase text-[#8A8A99] font-mono mb-1">Step 1</div>
          <div className="text-xs font-bold font-mono text-[#00D4FF]">Input Analog</div>
        </div>
        <div className="p-4 rounded-xl bg-black/40 border border-[#2A2A35]">
          <div className="text-[10px] uppercase text-[#8A8A99] font-mono mb-1">Step 2</div>
          <div className="text-xs font-bold font-mono text-white/80">Sample & Hold</div>
        </div>
        <div className="p-4 rounded-xl bg-black/40 border border-[#2A2A35]">
          <div className="text-[10px] uppercase text-[#8A8A99] font-mono mb-1">Step 3</div>
          <div className="text-xs font-bold font-mono text-[#FF5F1F]">Binary Output</div>
        </div>
      </div>
    </div>
  );
};
