import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CalibrationState = 'idle' | 'scanning' | 'analyzing' | 'complete' | 'already_done';

export const BiometricCalibration: React.FC = () => {
  const [state, setState] = useState<CalibrationState>('idle');
  const pointsEarned = 50;

  const startCalibration = () => {
    setState('scanning');
    setTimeout(() => setState('analyzing'), 1600);
    setTimeout(() => setState('complete'), 3200);
  };

  return (
    <div 
      className="relative w-full h-40 rounded-2xl overflow-hidden bg-observatory-surface border border-white/[0.06] cursor-pointer"
      onClick={state === 'idle' ? startCalibration : undefined}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && <IdleState key="idle" />}
        {state === 'scanning' && <ScanningState key="scanning" />}
        {state === 'analyzing' && <AnalyzingState key="analyzing" />}
        {state === 'complete' && <CompleteState points={pointsEarned} key="complete" />}
      </AnimatePresence>
    </div>
  );
};

const IdleState = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
  >
    <div className="w-12 h-12 rounded-full border border-cyan-400/20 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 40 40" className="text-cyan-400">
        <path d="M20 35 Q8 20 20 8" stroke="currentColor" fill="none" strokeWidth="2"/>
        <path d="M20 31 Q11 20 20 12" stroke="currentColor" fill="none" strokeWidth="2"/>
        <path d="M20 27 Q14 20 20 16" stroke="currentColor" fill="none" strokeWidth="2"/>
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    </div>
    <div className="text-center">
      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">Tap to Begin Neural Sync</span>
      <span className="text-[9px] font-mono text-slate-600 uppercase mt-1 block">Biometric Authorization Required</span>
    </div>
  </motion.div>
);

const ScanningState = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0"
  >
    <div className="absolute inset-0 bg-cyan-400/5" />
    <motion.div
      className="absolute left-0 right-0 h-0.5 bg-cyan-400 z-10"
      style={{ boxShadow: '0 0 20px 2px rgba(34,211,238,0.8)' }}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
    />
    <div className="absolute inset-0 opacity-10"
         style={{
           backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(34,211,238,0.3) 8px, rgba(34,211,238,0.3) 9px)',
         }}
    />
    <div className="absolute bottom-6 left-0 right-0 text-center">
      <span className="text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase animate-pulse">
        Scanning Neural Pathway...
      </span>
    </div>
  </motion.div>
);

const AnalyzingState = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col justify-center px-8 gap-4"
  >
    {[
      'STREAK INTEGRITY',
      'DOMAIN COVERAGE',
      'TRAJECTORY VECTOR',
      'SILICON ALIGNMENT',
    ].map((m, i) => (
      <div key={m} className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          <span>{m}</span>
          <span className="text-cyan-400">Processing</span>
        </div>
        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: `${70 + Math.random() * 30}%` }}
            transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    ))}
  </motion.div>
);

const CompleteState = ({ points }: { points: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute inset-0 flex items-center justify-between px-8"
  >
    <div className="space-y-1">
      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Sync Complete</div>
      <div className="text-3xl font-bold text-white font-mono">+{points} XP</div>
      <div className="text-[10px] font-mono text-slate-500 uppercase mt-1">Streak Restored: 12 Days 🔥</div>
    </div>
    <div className="w-16 h-16 rounded-full border-2 border-cyan-400/20 flex items-center justify-center text-cyan-400">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  </motion.div>
);
