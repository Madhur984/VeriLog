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
  { id: 'intro', label: 'The Sense of Flow', act: 'Act 1 // Transition' },
  { id: 'analog-vs-digital', label: 'The Great Divide', act: 'Act 1 // Transition' },
  { id: 'sampling', label: 'The Temporal Blink', act: 'Act 2 // Temporal' },
  { id: 'aliasing', label: 'Frequency Ghosts', act: 'Act 2 // Temporal' },
  { id: 'quantization', label: 'The Rung Paradox', act: 'Act 3 // Amplitude' },
  { id: 'dither', label: 'The Noise Cure', act: 'Act 3 // Amplitude' },
  { id: 'reconstruction', label: 'Recovering Reality', act: 'Act 4 // Materialization' },
  { id: 'adc-arch', label: 'Physical Silicon', act: 'Act 4 // Materialization' },
  { id: 'lab', label: 'Signal Forge v4.0', act: 'Act 5 // Mastery' },
  { id: 'questions', label: 'The Final Gate', act: 'Act 5 // Mastery' },
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

  // SEO & Global Identity: Dynamic Metadata Management
  useEffect(() => {
    const currentSection = SECTIONS[activeScreenIndex];
    if (currentSection) {
      document.title = `${currentSection.label} | Module 2: The Digital Bridge | VeriLog`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Master the engineering principles of ${currentSection.label} in Module 2 of VeriLog. Explore analog-to-digital conversion, Nyquist sampling, and high-fidelity signal reconstruction.`);
    }
  }, [activeScreenIndex]);

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

  const handleSceneChange = React.useCallback((index: number) => {
    setActiveScreenIndex(index);
  }, []);

  const scrollToScene = React.useCallback((id: string) => {
    const el = document.getElementById(`scene-${SECTIONS.findIndex(s => s.id === id)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const progress = ((activeScreenIndex + 1) / scenes.length) * 100;

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-500 overflow-hidden ${isDarkMode ? 'bg-[#030100]' : 'bg-gray-50'}`}>
      <Sidebar 
        sections={SECTIONS}
        activeSection={SECTIONS[activeScreenIndex]?.id || SECTIONS[0].id}
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
                    <h1 className={`text-xs font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>{SECTIONS[activeScreenIndex]?.label || 'Loading...'}</h1>
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

        {/* SEMANTIC BRAND STORY (SEO LAYER - Visualy Hidden) */}
        <article className="sr-only" aria-hidden="true">
            <h1>Module 2: The Digital Bridge - Signal Processing Excellence</h1>
            <p>
                VeriLog's Digital Bridge module is a high-fidelity pedagogical journey through the core of Electronic and Communication Engineering (ECE). 
                From the fluid nature of analog waves to the precise discretization of the digital domain, students explore the Nyquist-Shannon sampling theorem, 
                quantization error, dither linearization, and sinc-pulse reconstruction. 
            </p>
            <p>
                The module features the Signal Forge v4.0, a real-time laboratory for testing Signal-to-Noise Ratio (SNR), Effective Number of Bits (ENOB), 
                and Total Harmonic Distortion plus Noise (THD+N). Mastery of these principles is critical for 5G telecommunications, medical imaging, 
                and professional audio engineering.
            </p>
            <ul>
                {SECTIONS.map(s => <li key={s.id}>{s.label}: {s.act}</li>)}
            </ul>
        </article>
      </main>
    </div>
  );
};
