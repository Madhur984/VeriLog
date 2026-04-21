import React from 'react';
import { motion } from 'framer-motion';

interface ModuleRefProps {
  label: string;
  color?: 'amber' | 'cyan' | 'green';
  onClick?: () => void;
}

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  amber:  { border: '#FFC107', text: '#FFC107', bg: 'rgba(255,193,7,0.1)' },
  orange: { border: '#FF5F1F', text: '#FF5F1F', bg: 'rgba(255,95,31,0.1)' },
  cyan:   { border: '#00D4FF', text: '#00D4FF', bg: 'rgba(0,212,255,0.1)' },
  green:  { border: '#22C55E', text: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  indigo: { border: '#06B6D4', text: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  rose:   { border: '#FF3366', text: '#FF3366', bg: 'rgba(255,51,102,0.1)' },
};

const ModuleRef: React.FC<ModuleRefProps> = ({ label, color = 'amber', onClick }) => {
  const c = colorMap[color] || colorMap.amber;
  return (
    <motion.button
      whileHover={{ scale: 1.02, background: c.bg }}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] transition-colors focus:outline-none focus:ring-2"
      style={{
        border: `1px solid ${c.border}`,
        color: c.text,
        fontFamily: 'IBM Plex Mono, monospace',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        background: 'transparent',
        focusRingColor: c.border,
      }}
      aria-label={`Reference: ${label}`}
    >
      ↗ {label}
    </motion.button>
  );
};

export default ModuleRef;

