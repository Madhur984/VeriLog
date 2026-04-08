import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

const SCENES = [
  "ENTRY", "IDENTITY", "SIGNAL", "TIME", "ENERGY",
  "FREQ", "SHAPE", "NOISE", "CONTROL", "INTERACT",
  "REAL", "LAB_S11", "END", "MASTER_LAB"
];

export const FloatingSidebar: React.FC = () => {
  const currentScene = useSignalStore((s) => s.scene);
  const goToScene = useSignalStore((s) => s.goToScene);

  return (
    <div className="sidebar-container fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
      {SCENES.map((name, i) => {
        const isActive = currentScene === i;
        const isCompleted = currentScene > i;

        return (
          <motion.div
            key={i}
            className={`v3-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            title={name}
            onClick={() => goToScene(i)}
            style={{ 
              cursor: 'pointer',
              boxShadow: '0 0 4px rgba(0,0,0,0.4)' 
            }}
            whileHover={{ scale: 1.5, opacity: 1 }}
          />
        );
      })}
    </div>
  );
};

