import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

const PHASE_STOPS: Array<{ pct: number; color: string }> = [
  { pct: 0,    color: '#00D4FF' },
  { pct: 0.15, color: '#A855F7' },
  { pct: 0.35, color: '#3B82F6' },
  { pct: 0.50, color: '#22C55E' },
  { pct: 0.70, color: '#FFC107' },
  { pct: 0.85, color: '#FF5F1F' },
  { pct: 1,    color: '#FF5F1F' },
];

function colorAtProgress(p: number): string {
  for (let i = 0; i < PHASE_STOPS.length - 1; i++) {
    const a = PHASE_STOPS[i];
    const b = PHASE_STOPS[i + 1];
    if (p >= a.pct && p <= b.pct) return b.color;
  }
  return '#FF5F1F';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const pct = total > 0 ? current / total : 0;
  const barColor = colorAtProgress(pct);

  return (
    <div
      className="fixed top-0 left-0 w-full z-[999] flex items-center"
      style={{ height: 3 }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Module progress: scene ${current + 1} of ${total}`}
    >
      <motion.div
        className="h-full"
        style={{ backgroundColor: barColor }}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <div
        className="fixed top-1 right-2 text-[10px] font-mono"
        style={{ color: barColor, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.06em' }}
      >
        SCENE {current + 1} / {total}
      </div>
    </div>
  );
};

export default ProgressBar;
