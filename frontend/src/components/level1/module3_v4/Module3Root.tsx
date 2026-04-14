import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { SceneManager } from './SceneManager';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useBinaryStore } from '../../../stores/binaryStore';

import { S00_Intro } from './scenes/S00_Intro';
import { S01_WhyBinary } from './scenes/S01_WhyBinary';
import { S02_InteractionGates } from './scenes/S02_InteractionGates';
import { S03_TheCarryChain } from './scenes/S03_TheCarryChain';
import { S04_SiliconPersistence } from './scenes/S04_SiliconPersistence';
import { S05_ArithmeticSynthesis } from './scenes/S05_ArithmeticSynthesis';
import { S06_LogicBridge } from './scenes/S06_LogicBridge';
import { S08_KnowledgeGate } from './scenes/S08_KnowledgeGate';
import { S07_Conclusion } from './scenes/S07_Conclusion';

const SECTIONS = [
  { id: 'intro', label: 'The Pulse of Logic' },
  { id: 'binary-choice', label: 'The Engineering Choice' },
  { id: 'interaction', label: 'Interaction Gates' },
  { id: 'carry-chain', label: 'The Carry Chain' },
  { id: 'persistence', label: 'Silicon Persistence' },
  { id: 'arithmetic', label: 'Arithmetic Synthesis' },
  { id: 'logic-bridge', label: 'The Logic Bridge' },
  { id: 'knowledge-gate', label: 'The Knowledge Gate' },
  { id: 'discovery-end', label: 'Binary Awakened' },
];

export const Module3Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  
  const activeSceneStr = useBinaryStore(s => s.activeScene);
  const setSceneStr = useBinaryStore(s => s.goToScene);
  const SCENE_NAMES: any[] = ['intro', 'whybinary', 'switch', 'counter', 'register', 'arithmetic', 'bridge', 'complete', 'complete']; // Approximate mapping
  
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [time, setTime] = useState(0);

  // Sync index to store
  useEffect(() => {
    const idx = Math.min(activeScreenIndex, SCENE_NAMES.length - 1);
    setSceneStr(SCENE_NAMES[idx]);
  }, [activeScreenIndex, setSceneStr]);

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

  const scenes = React.useMemo(() => [
    S00_Intro,
    S01_WhyBinary,
    S02_InteractionGates,
    S03_TheCarryChain,
    S04_SiliconPersistence,
    S05_ArithmeticSynthesis,
    S06_LogicBridge,
    S08_KnowledgeGate,
    S07_Conclusion
  ], []);

  const handleSceneChange = useCallback((index: number) => {
    setActiveScreenIndex(index);
  }, []);

  const scrollToScene = useCallback((id: string) => {
    const el = document.getElementById(`scene-${SECTIONS.findIndex(s => s.id === id)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const progress = ((activeScreenIndex + 1) / scenes.length) * 100;

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-[#040b15]' : 'bg-gray-50'}`}>
      <Sidebar 
        sections={SECTIONS}
        activeSection={SECTIONS[activeScreenIndex].id}
        onSectionClick={scrollToScene}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        progress={progress}
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Floating HUD (Mirrored from Module 2) */}
        <header className="absolute top-0 left-0 right-0 z-20 px-12 py-10 flex justify-between items-center pointer-events-none">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex items-center gap-5 backdrop-blur-2xl border px-8 py-4 rounded-[2rem] pointer-events-auto shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-black/60 border-white/10 shadow-black' : 'bg-white/90 border-gray-200 shadow-sky-500/10'}`}
            >
                <div className={`w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_15px_#0ea5e9]`} />
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono font-black tracking-tighter ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>CORE_NODE::V-03</span>
                    <span className={`text-xs font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-sky-500' : 'text-sky-600'}`}>{SECTIONS[activeScreenIndex].label}</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col items-end backdrop-blur-2xl border px-8 py-4 rounded-[2rem] pointer-events-auto transition-all duration-500 ${isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white/90 border-gray-100 shadow-sm'}`}
            >
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Engine:</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] animate-pulse ${isDarkMode ? 'text-sky-500' : 'text-sky-600'}`}>Boolean Active</span>
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
