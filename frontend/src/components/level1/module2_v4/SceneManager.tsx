import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SceneManagerProps {
  scenes: React.FC<any>[];
  activeScene: number;
  onSceneChange: (index: number) => void;
  time: number;
  isDarkMode: boolean;
}

/**
 * SceneManager
 * Coordinates the display and transition between pedagogical scenes.
 * Matches Module 1's architectural discipline.
 * 
 * NOTE: Windowing was removed to ensure the "blank screen on scroll" bug 
 * is fully resolved. All scenes are mounted to provide instant frame feedback.
 */
export const SceneManager: React.FC<SceneManagerProps> = ({ 
    scenes, 
    activeScene, 
    onSceneChange, 
    time,
    isDarkMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for scroll-based scene detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-scene-index') || '0');
            onSceneChange(index);
          }
        });
      },
      { 
        root: null,
        rootMargin: '-20% 0px -20% 0px', 
        threshold: 0 
      }
    );

    const sceneElements = document.querySelectorAll('[data-scene-index]');
    sceneElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [onSceneChange]);

  return (
    <div ref={containerRef} className={`flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory transition-colors duration-500 ${isDarkMode ? 'bg-[#030100]' : 'bg-white'}`}>
      {scenes.map((Scene, index) => {
        return (
          <section 
            key={index} 
            id={`scene-${index}`}
            data-scene-index={index}
            className="min-h-screen snap-start relative flex flex-col justify-center px-8 md:px-24 py-20"
          >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full flex flex-col justify-center"
            >
                <Scene 
                    index={index} 
                    time={time} 
                    isActive={activeScene === index}
                    isDarkMode={isDarkMode}
                />
            </motion.div>
          </section>
        );
      })}
    </div>
  );
};
