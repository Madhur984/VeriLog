import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

const SCENES = [
  "ENTRY", "IDENTITY", "SIGNAL", "TIME", "ENERGY",
  "FREQ", "SHAPE", "NOISE", "CONTROL", "INTERACT",
  "REAL", "LAB", "END"
];

export const FloatingSidebar: React.FC = () => {
  const currentScene = useSignalStore((s) => s.scene);
  const goToScene = useSignalStore((s) => s.goToScene);

  return (
    <div className="v3-sidebar z-50 pointer-events-auto">
      {SCENES.map((name, i) => {
        const isActive = currentScene === i;
        const isCompleted = currentScene > i;

        return (
          <motion.div
            key={i}
            className={`v3-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            title={name}
            onClick={() => goToScene(i)}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.5, opacity: 1 }}
          />
        );
      })}
    </div>
  );
};

