import React from 'react';
import { M2ScreenProps } from '../types';
import { InteractiveQuiz } from '../shared/UltimateComponents';

export const M2_S17_FinalCheckpoint: React.FC<M2ScreenProps> = () => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-12 px-6">
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
          Mastery Verification
        </h2>
        <p className="font-mono text-sm text-[#8A8A99] max-w-2xl mx-auto">
          Confirm your understanding of the <span className="text-[#00D4FF]">Analog-Digital Bridge</span> before 
          moving to secondary signal processing.
        </p>
      </div>

      <InteractiveQuiz />

      <div className="text-center p-6 border border-[#2A2A35] rounded-2xl bg-[#121215]/50 w-full">
        <p className="text-[10px] uppercase tracking-widest text-[#8A8A99] font-mono mb-2">Completion Protocol</p>
        <p className="text-xs text-white/40">Achieving 5/5 score unlocks the 'Signal Architect' achievement badge.</p>
      </div>
    </div>
  );
};
