import React from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleY, transformOrigin: 'top' }}
      className="fixed right-0 top-0 w-0.5 h-full z-50
                 bg-gradient-to-b from-cyan-400 via-amber-400 to-orange-500"
    />
  );
};
