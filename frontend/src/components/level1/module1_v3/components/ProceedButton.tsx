import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const ProceedButton: React.FC = () => {
  const canProceed = useSignalStore((s) => s.canProceed);
  const showContinue = useSignalStore((s) => s.showContinue);
  const nextScene = useSignalStore((s) => s.nextScene);
  const scene = useSignalStore((s) => s.scene);

  const isActive = canProceed || (showContinue && scene < 13);
  const isSmartAssist = !canProceed && showContinue;

  const getButtonText = () => {
    if (scene === 11) return "STABILIZED → CONTINUE";
    if (scene === 12) return "ENTER MASTER LAB";
    if (scene === 13) return "LAB COMPLETE";
    return isSmartAssist ? "SKIP GUIDANCE" : "ADVANCE";
  };

  if (!isActive && scene !== 13) return null;

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center">
      {isSmartAssist && (
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          className="micro-text text-[10px] uppercase tracking-[0.3em] mb-4"
        >
          Guidance required?
        </motion.span>
      )}
      <button
        onClick={nextScene}
        disabled={scene === 13}
        className={`px-8 py-3 border transition-all duration-300 tracking-[0.4em] uppercase text-xs 
          ${isSmartAssist ? 'border-white/10 text-white/30 bg-transparent' : 'border-v3-cyan text-v3-cyan bg-v3-cyan/5 shadow-[0_0_20px_rgba(0,229,255,0.1)]'}
          ${scene === 13 ? 'opacity-0' : 'opacity-100'} 
          hover:scale-105 active:scale-95`}
        style={{
          textShadow: '0 0 8px rgba(0, 229, 255, 0.2)'
        }}
      >
        {getButtonText()}
      </button>
    </div>
  );
};
