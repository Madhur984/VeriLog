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

// Placeholder scenes for the rest (no longer needed, but keeping for reference if any others added)
const S_Placeholder: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <h2 className="text-5xl font-black italic tracking-tighter text-white/50">{title}</h2>
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 mb-4">Architecture Refactor in Progress</p>
            <p className="text-sm text-white/30 max-w-sm text-center italic">"{desc}"</p>
        </div>
    </div>
);

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
    <div className={`flex h-screen w-full font-sans transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-[#030100]' : 'bg-white'}`}>
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
        <header className="absolute top-0 left-0 right-0 z-20 px-12 py-8 flex justify-between items-center pointer-events-none">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl pointer-events-auto"
            >
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                <span className="text-[10px] font-mono font-black text-white/50">M02</span>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-500 uppercase font-black">{SECTIONS[activeScreenIndex].label}</span>
            </motion.div>

            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl pointer-events-auto"
            >
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">Instrument Status:</span>
                <span className="text-[9px] font-mono text-cyan-500 uppercase ml-3 font-bold tracking-[0.2em]">Ready</span>
            </motion.div>
        </header>

        <SceneManager 
            scenes={scenes} 
            activeScene={activeScreenIndex}
            onSceneChange={handleSceneChange}
            time={time}
        />
      </main>
    </div>
  );
};
