import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SceneWrapperProps {
  sceneIndex: number;
  currentScene: number;
  phaseColor: string;
  children: React.ReactNode;
  className?: string;
}

const SceneWrapper: React.FC<SceneWrapperProps> = ({
  sceneIndex,
  currentScene,
  phaseColor,
  children,
  className = '',
}) => {
  const isActive = currentScene === sceneIndex;

  return (
    <section
      data-scene-id={sceneIndex}
      className={`relative flex flex-col items-center justify-center w-full will-change-transform ${className}`}
      style={{
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
      aria-current={isActive ? 'true' : undefined}
    >
      {/* Scene-reactive radial glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow"
            className="pointer-events-none absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
            style={{
              background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${phaseColor}18 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        {children}
      </div>
    </section>
  );
};

export default SceneWrapper;
