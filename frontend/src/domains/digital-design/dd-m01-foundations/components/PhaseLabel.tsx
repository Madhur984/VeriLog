import React from 'react';
import { motion } from 'framer-motion';

interface PhaseLabelProps {
  phase: string;
  name: string;
  color: string;
}

const PhaseLabel: React.FC<PhaseLabelProps> = ({ phase, name, color }) => (
  <motion.div
    initial={{ x: -30, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="absolute top-6 left-6 z-20"
    style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color, letterSpacing: '0.12em', textTransform: 'uppercase' }}
  >
    PHASE_{phase} // {name}
  </motion.div>
);

export default PhaseLabel;
