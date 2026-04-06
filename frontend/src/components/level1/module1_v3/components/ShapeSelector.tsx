import React from 'react';
import { motion } from 'framer-motion';
import { WaveType, useSignalStore } from '../store/signalStore';
import { AudioEngine } from '../engine/audioEngine';

const SPRING = { type: 'spring', stiffness: 160, damping: 22 };
const audio = new AudioEngine();
const SHAPES: { id: WaveType; label: string }[] = [
  { id: 'sine',     label: 'smooth' },
  { id: 'square',   label: 'square' },
  { id: 'triangle', label: 'pulse'  },
];

export const ShapeSelector: React.FC = () => {
  const waveType = useSignalStore((s) => s.waveType);
  const setWaveType = useSignalStore((s) => s.setWaveType);

  const handleClick = (id: WaveType) => {
    setWaveType(id);
    audio.tick();
  };

  return (
    <div className="flex v3-gap-4 items-center">
      {SHAPES.map(({ id, label }) => {
        const isActive = waveType === id;
        return (
          <motion.button
            key={id}
            onClick={() => handleClick(id)}
            animate={{
              y: isActive ? 0 : 6,
              opacity: isActive ? 1 : 0.35,
            }}
            whileHover={{ y: isActive ? 0 : 3, opacity: 0.7 }}
            transition={SPRING}
            className="flex flex-col items-center v3-gap-1 cursor-pointer"
          >
            <span
              className="v3-small tracking-[0.3em]"
              style={{ color: isActive ? '#00E5FF' : 'white' }}
            >
              {label}
            </span>
            {isActive && (
              <motion.div
                layoutId="shape-underline"
                className="h-px w-full bg-[#00E5FF]"
                transition={SPRING}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
