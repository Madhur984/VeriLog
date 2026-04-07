import React from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

// Strict scene mapping for navigation
const SCENE_COUNT = 12;

export const FloatingSidebar: React.FC = () => {
  const currentScene = useSignalStore((s) => s.scene);
  const maxUnlocked = useSignalStore((s) => s.maxUnlockedScene);
  const goToScene = useSignalStore((s) => s.goToScene);

  // ZERO UI Rule: Hide during entry (0) and conclusion (12)
  const isHidden = currentScene === 0 || currentScene === 12;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isHidden ? 0 : 1 }}
      className="v3-sidebar z-50"
    >
      {[...Array(SCENE_COUNT)].map((_, i) => {
        const sceneIdx = i + 1;
        const isActive = currentScene === sceneIdx;
        const isUnlocked = sceneIdx <= maxUnlocked;

        return (
          <motion.button
            key={sceneIdx}
            onClick={() => isUnlocked && goToScene(sceneIdx)}
            className={`v3-dot ${isActive ? 'active' : ''}`}
            style={{ 
              cursor: isUnlocked ? 'pointer' : 'default',
              opacity: isActive ? 1 : isUnlocked ? 0.3 : 0.05
            }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </motion.div>
  );
};
