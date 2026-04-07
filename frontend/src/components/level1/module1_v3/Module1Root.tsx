import React from 'react';
import { SignalCanvas } from './components/SignalCanvas';
import { SignalScene as WebGLLayer } from './components/3d/SignalScene';
import { SceneManager } from './SceneManager';
import { FloatingSidebar } from './components/FloatingSidebar';
import { TheoryOverlay } from './components/TheoryOverlay';
import { ProceedButton } from './components/ProceedButton';
import { useSignalStore } from './store/signalStore';
import './v3-style.css';

/**
 * Module1Root — The persistent premium shell.
 */
export const Module1Root: React.FC = () => {
  const theoryMode = useSignalStore((s) => s.theoryMode);
  const toggleTheoryMode = useSignalStore((s) => s.toggleTheoryMode);

  return (
    <div className="module1-v3-root fixed inset-0 w-full h-full overflow-hidden select-none bg-black z-0">
      
      {/* 🌌 BACKGROUND LAYER 0: WEBGL (DEPTH) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <WebGLLayer />
      </div>

      {/* 🌊 BACKGROUND LAYER 1: PURE CANVAS (SIGNAL) */}
      <SignalCanvas className="z-10" />

      {/* 🧱 INTERFACE: DYNAMIC SCENE CONTENT */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        <SceneManager />
      </div>

      {/* 🔘 GLOBAL UI ELEMENTS */}
      <FloatingSidebar />
      <ProceedButton />

      {/* 🧪 THEORY TOGGLE (TOP RIGHT) */}
      <div className="absolute top-8 right-8 z-[100]">
        <button 
          onClick={toggleTheoryMode}
          className={`micro-text px-4 py-2 border transition-all duration-300 pointer-events-auto ${
            theoryMode 
              ? 'bg-v3-cyan/10 border-v3-cyan/40 text-v3-cyan' 
              : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
          }`}
        >
          {theoryMode ? '[ THEORY ON ]' : '[ THEORY ]'}
        </button>
      </div>

      {/* 📖 FULLSCREEN THEORY */}
      <TheoryOverlay />
    </div>
  );
};
