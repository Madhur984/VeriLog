import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const ProceedButton: React.FC = () => {
  const canProceed   = useSignalStore((s) => s.canProceed);
  const showContinue = useSignalStore((s) => s.showContinue);
  const nextScene    = useSignalStore((s) => s.nextScene);
  const scene        = useSignalStore((s) => s.scene);

  const isActive      = canProceed || (showContinue && scene < 13);
  const isSmartAssist = !canProceed && showContinue;

  const label = () => {
    if (scene === 11) return 'STABILIZED → CONTINUE';
    if (scene === 12) return 'ENTER MASTER LAB';
    if (scene === 13) return 'LAB COMPLETE';
    return isSmartAssist ? 'SKIP GUIDANCE' : 'ADVANCE';
  };

  if (!isActive && scene !== 13) return null;

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center z-[100]">
      {isSmartAssist && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="micro-text text-[10px] tracking-[0.3em] mb-4"
        >
          Guidance required?
        </motion.span>
      )}
      <motion.button
        onClick={nextScene}
        disabled={scene === 13}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: scene === 13 ? 0 : 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`proceed-btn ${isActive && !isSmartAssist ? 'active' : ''}`}
      >
        {label()}
      </motion.button>
    </div>
  );
};
