import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from './store/signalStore';
import { SignalCanvas } from './components/SignalCanvas';
import { SceneManager } from './SceneManager';
import { FloatingSidebar } from './components/FloatingSidebar';
import { TheoryOverlay } from './components/TheoryOverlay';
import { ProceedButton } from './components/ProceedButton';
import { VideoIntro } from './components/VideoIntro';
import './v3-style.css';

/**
 * Module1Root — Cinematic shell → Interactive laboratory.
 * Layer stack: Video(4) > UI(3) > Canvas(2) > Background(0)
 */
export const Module1Root: React.FC = () => {
  const [introDone, setIntroDone] = useState(false);
  const theoryMode       = useSignalStore((s) => s.theoryMode);
  const toggleTheoryMode = useSignalStore((s) => s.toggleTheoryMode);
  const setPhase         = useSignalStore((s) => s.setPhase);

  const handleVideoComplete = () => {
    setIntroDone(true);
    setPhase('ACTIVE');
  };

  return (
    <div
      className="module1-v3-root fixed inset-0 overflow-hidden select-none"
      style={{ background: 'var(--bg-void)', filter: 'contrast(1.06) brightness(1.02)' }}
    >
      {/* ── z-4: VIDEO INTRO (removed from DOM after done) ── */}
      {!introDone && (
        <div className="fixed inset-0" style={{ zIndex: 4 }}>
          <VideoIntro onComplete={handleVideoComplete} />
        </div>
      )}

      {/* ── z-2: SIGNAL CANVAS ── */}
      <motion.div
        className="canvas-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SignalCanvas />
      </motion.div>

      {/* ── z-3: SCENE CONTENT ── */}
      <motion.div
        className="ui-layer w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <SceneManager />
      </motion.div>

      {/* ── z-100: GLOBAL PERSISTENT CONTROLS ── */}
      <FloatingSidebar />
      <ProceedButton />

      {/* ── THEORY TOGGLE (top-right) ── */}
      <div className="fixed top-8 right-8 pointer-events-auto" style={{ zIndex: 120 }}>
        <button
          onClick={toggleTheoryMode}
          className={`theory-btn ${theoryMode ? 'active' : ''}`}
        >
          {theoryMode ? '[ THEORY ON ]' : '[ THEORY ]'}
        </button>
      </div>

      {/* ── z-200: THEORY OVERLAY ── */}
      <TheoryOverlay />
    </div>
  );
};
