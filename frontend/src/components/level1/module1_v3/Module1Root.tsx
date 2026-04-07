import React from 'react';
import { SignalScene } from './components/3d/SignalScene';
import { SceneManager } from './SceneManager';
import { FloatingSidebar } from './components/FloatingSidebar';
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
      {/* 🌌 BACKGROUND: 3D SIGNAL ENGINE */}
      <div className="absolute inset-0 z-0">
        <SignalScene />
      </div>

      {/* 🧱 INTERFACE: DYNAMIC LAYOUT */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <SceneManager />
      </div>

      {/* 🧪 THEORY TOGGLE */}
      <div className="absolute bottom-12 right-12 z-[100]">
        <button 
          onClick={toggleTheoryMode}
          className={`v3-micro px-4 py-2 border transition-all duration-300 pointer-events-auto ${
            theoryMode 
              ? 'bg-v3-cyan/10 border-v3-cyan/40 text-v3-cyan glow-sm' 
              : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
          }`}
        >
          {theoryMode ? '[ THEORY ON ]' : '[ + THEORY ]'}
        </button>
      </div>

      <FloatingSidebar />
    </div>
  );
};
