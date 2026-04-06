import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { AudioEngine } from '../engine/audioEngine';

const LABELS = [
  'identity', 'signal', 'time', 'energy', 'frequency',
  'shape', 'noise', 'control', 'interaction', 'real world', 'lab', 'conclusion',
];

const SPRING = { type: 'spring', stiffness: 200, damping: 22 };
const audio = new AudioEngine();

export const FloatingSidebar: React.FC = () => {
  const scene = useSignalStore((s) => s.scene);
  const maxUnlocked = useSignalStore((s) => s.maxUnlockedScene);
  const goToScene = useSignalStore((s) => s.goToScene);

  return (
    <div
      className="fixed left-6 top-1/2 z-50 flex flex-col gap-3"
      style={{ transform: 'translateY(-50%)' }}
    >
      {LABELS.map((label, i) => {
        const sceneIdx = i + 1; // scene 0 = entry, skip from sidebar
        const isActive = scene === sceneIdx;
        const isUnlocked = sceneIdx <= maxUnlocked;

        return (
          <motion.button
            key={label}
            onClick={() => {
              if (isUnlocked) {
                goToScene(sceneIdx);
                audio.tick();
              }
            }}
            onMouseEnter={() => isUnlocked && audio.hover()}
            whileHover={isUnlocked ? { x: 5 } : {}}
            transition={SPRING}
            title={isUnlocked ? label.toUpperCase() : ''}
            style={{ cursor: isUnlocked ? 'pointer' : 'default' }}
            className="group relative flex items-center gap-2"
          >
            {/* Dot */}
            <motion.div
              animate={{
                width: isActive ? 18 : 6,
                height: isActive ? 2 : 6,
                borderRadius: isActive ? 1 : 3,
                backgroundColor: isActive
                  ? '#00E5FF'
                  : isUnlocked
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.1)',
              }}
              transition={{ duration: 0.25 }}
            />
            {/* Label — appears on active only */}
            <motion.span
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              className="text-[9px] font-mono tracking-[0.18em] uppercase text-[#00E5FF] whitespace-nowrap pointer-events-none select-none"
            >
              {label}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
};
