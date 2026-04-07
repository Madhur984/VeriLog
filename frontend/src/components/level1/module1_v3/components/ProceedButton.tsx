import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const ProceedButton: React.FC = () => {
  const canProceed = useSignalStore((s) => s.canProceed);
  const nextScene = useSignalStore((s) => s.nextScene);
  const scene = useSignalStore((s) => s.scene);

  const getButtonText = () => {
    if (scene === 11) return "STABILIZED → CONTINUE";
    if (scene === 12) return "NEXT";
    return "PROCEED →";
  };

  return (
    <AnimatePresence>
      <button
        onClick={nextScene}
        className={`proceed-btn pointer-events-auto ${canProceed ? 'active' : ''}`}
      >
        {getButtonText()}
      </button>
    </AnimatePresence>
  );
};
