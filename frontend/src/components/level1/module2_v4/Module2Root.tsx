import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { SceneManager } from './SceneManager';
import { useColorScheme } from '../../../hooks/useColorScheme';

// Scenes
import { S00_Intro } from './scenes/S00_Intro';
import { S01_AnalogVsDigital } from './scenes/S01_AnalogVsDigital';
import { S02_Sampling } from './scenes/S02_Sampling';
import { S03_Aliasing } from './scenes/S03_Aliasing';
import { S04_Quantization } from './scenes/S04_Quantization';
import { S05_Dither } from './scenes/S05_Dither';
import { S06_Reconstruction } from './scenes/S06_Reconstruction';
import { S07_ADCArchitecture } from './scenes/S07_ADCArchitecture';
import { S08_Lab } from './scenes/S08_Lab';
import { S09_KnowledgeGate } from './scenes/S09_KnowledgeGate';

// All scenes implemented.

const SECTIONS = [
  { id: 'intro', label: 'The Sense of Flow' },
  { id: 'analog-vs-digital', label: 'The Great Divide' },
  { id: 'sampling', label: 'The Temporal Blink' },
  { id: 'aliasing', label: 'Frequency Ghosts' },
  { id: 'quantization', label: 'Depth Paradox' },
  { id: 'dither', label: 'The Noise Cure' },
  { id: 'reconstruction', label: 'Materialization' },
  { id: 'adc-arch', label: 'Physical Reality' },
  { id: 'lab', label: 'Signal Forge v3.0' },
  { id: 'questions', label: 'The Final Gate' },
];

export const Module2Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [time, setTime] = useState(0);

  // Unified Animation Clock: Single RAF loop for the entire module
  useEffect(() => {
    let raf: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scenes = [
    S00_Intro,
    S01_AnalogVsDigital,
    S02_Sampling,
    S03_Aliasing,
    S04_Quantization,
    S05_Dither,
    S06_Reconstruction,
    S07_ADCArchitecture,
    S08_Lab,
    S09_KnowledgeGate
  ];

  const handleSceneChange = (index: number) => {
    setActiveScreenIndex(index);
  };

  const scrollToScene = (id: string) => {
    const el = document.getElementById(`scene-${SECTIONS.findIndex(s => s.id === id)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const progress = ((activeScreenIndex + 1) / scenes.length) * 100;

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-[#030100]' : 'bg-gray-50'}`}>
      <Sidebar 
        sections={SECTIONS}
        activeSection={SECTIONS[activeScreenIndex].id}
        onSectionClick={scrollToScene}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        progress={progress}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Floating HUD */}
        <header className="absolute top-0 left-0 right-0 z-20 px-12 py-10 flex justify-between items-center pointer-events-none">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex items-center gap-5 backdrop-blur-2xl border px-8 py-4 rounded-[2rem] pointer-events-auto shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-black/60 border-white/10 shadow-black' : 'bg-white/90 border-gray-200 shadow-orange-500/10'}`}
            >
                <div className={`w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_#f97316]`} />
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono font-black tracking-tighter ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>CORE_NODE::V-02</span>
                    <span className={`text-xs font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>{SECTIONS[activeScreenIndex].label}</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col items-end backdrop-blur-2xl border px-8 py-4 rounded-[2rem] pointer-events-auto transition-all duration-500 ${isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white/90 border-gray-100 shadow-sm'}`}
            >
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Status:</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] animate-pulse ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>Synchro Active</span>
            </motion.div>
        </header>

        <SceneManager 
            scenes={scenes} 
            activeScene={activeScreenIndex}
            onSceneChange={handleSceneChange}
            time={time}
            isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
};
