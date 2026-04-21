import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SIPToastProps {
  amount: number;
  reason: string;
  id: string;
  onDismiss: (id: string) => void;
}

const SIPToast: React.FC<SIPToastProps> = ({ amount, reason, id, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg"
      style={{
        background: '#1A1A1F',
        border: '1px solid #FFC107',
        borderRadius: 8,
        minWidth: 220,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Gem icon */}
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <polygon points="8,1 15,6 12,15 4,15 1,6" fill="url(#sipGem)" stroke="#FFC107" strokeWidth={1} />
        <defs>
          <linearGradient id="sipGem" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC107" />
            <stop offset="1" stopColor="#FF5F1F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <span className="text-[13px] font-mono font-bold" style={{ color: '#FFC107' }}>
          +{amount} SIP EARNED
        </span>
        <span className="text-[10px] font-mono" style={{ color: '#7A7A8C', letterSpacing: '0.08em' }}>
          {reason.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Toast System ─────────────────────────────────────────────────────────────

interface Toast { id: string; amount: number; reason: string; }

interface SIPToastSystemProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const SIPToastSystem: React.FC<SIPToastSystemProps> = ({ toasts, onDismiss }) => (
  <div
    className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    aria-live="polite"
    aria-atomic="false"
  >
    <AnimatePresence>
      {toasts.slice(-3).map(t => (
        <SIPToast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);

export default SIPToast;
