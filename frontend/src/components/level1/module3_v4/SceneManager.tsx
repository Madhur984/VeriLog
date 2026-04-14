import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SceneManagerProps {
  scenes: React.FC<any>[];
  activeScene: number;
  onSceneChange: (index: number) => void;
  time: number;
  isDarkMode: boolean;
  extraProps?: Record<string, any>;
}

/**
 * Module 3 SceneManager
 * Coordinates the display and transition between pedagogical scenes.
 * Aligned with Module 2's scrollytelling architecture.
 */
export const SceneManager: React.FC<SceneManagerProps> = ({ 
    scenes, 
    activeScene, 
    onSceneChange, 
    time,
    isDarkMode,
    extraProps
}) => {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set([0]));
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-based scene detection & visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-scene-index') || '0');
          if (entry.isIntersecting) {
            onSceneChange(index);
            setVisibleIndices(prev => new Set(prev).add(index));
          } else {
            setVisibleIndices(prev => {
                const next = new Set(prev);
                next.delete(index);
                return next;
            });
          }
        });
      },
      { 
        root: containerRef.current,
        rootMargin: '-10% 0px -10% 0px', 
        threshold: 0 
      }
    );

    const sceneElements = document.querySelectorAll('[data-scene-index]');
    sceneElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [onSceneChange]);

  return (
    <div ref={containerRef} className={`flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory transition-colors duration-500 ${isDarkMode ? 'bg-[#040b15]' : 'bg-white'}`}>
      {scenes.map((Scene, index) => (
        <section 
          key={index} 
          id={`scene-${index}`}
          data-scene-index={index}
          className="min-h-screen snap-start relative flex flex-col justify-center px-8 md:px-24 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col justify-center"
          >
            <Scene 
                index={index} 
                time={visibleIndices.has(index) ? time : 0} 
                isActive={activeScene === index}
                isDarkMode={isDarkMode}
                {...extraProps}
            />
          </motion.div>
        </section>
      ))}
    </div>
  );
};
