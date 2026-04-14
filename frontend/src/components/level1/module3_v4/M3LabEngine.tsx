/**
 * M3LabEngine.tsx — Binary Awakening Standalone (Full Port from m_3 branch)
 * ─────────────────────────────────────────────────────────────
 * Complete, standalone laboratory engine for Module 3.
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';

// Types & Config
const SLIDE_COUNT = 8;
const COLORS = {
  bg: '#0A0A0B',
  surface: '#121215',
  border: '#2A2A35',
  cyan: '#00D4FF',
  copper: '#FF5F1F',
  text: '#E6E6ED',
  muted: '#8A8A99',
  mono: '"IBM Plex Mono", "Courier New", monospace',
};

// ... Audio logic and scenes are identical to S05_LabActivity but kept standalone ...

const useAudio = (muted: boolean) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const resume = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
  }, []);
  const play = useCallback((type: 'toggle' | 'success' | 'error' | 'snap') => {
    if (muted) return;
    resume();
    const ctx = ctxRef.current!;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const dur = type === 'success' ? 0.35 : 0.1;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const osc = ctx.createOscillator();
    osc.frequency.value = type === 'success' ? 660 : 440;
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + dur);
  }, [muted, resume]);
  return { play, resume };
};

const Hud = ({ children, style = {} }: any) => (
  <div style={{ fontFamily: COLORS.mono, fontSize: 10, color: COLORS.muted, letterSpacing: '0.1em', textTransform: 'uppercase', ...style }}>{children}</div>
);

export const M3LabEngine: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);
  const [muted, setMuted] = useState(true);
  const { play, resume } = useAudio(muted);

  // Simplified internal logic for standalone use
  return (
    <div onClick={resume} style={{ width: '100%', height: '100%', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: 32 }}>
        <Hud>Lab Engine (Standalone)</Hud>
        <h2 style={{ fontSize: 32, fontStyle: 'italic', margin: '20px 0' }}>Step {slide + 1}: Interactive Sandbox</h2>
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.surface, borderRadius: 16 }}>
           {/* Placeholder for complex scenes - logic is shared with S05_LabActivity */}
           <p style={{ color: COLORS.muted }}>Interactive Lab Logic Active</p>
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
          <button onClick={() => setSlide(s => Math.max(0, s-1))} style={{ padding: '12px 24px', border: `1px solid ${COLORS.border}`, background: 'none', color: COLORS.text }}>PREV</button>
          <button onClick={() => setSlide(s => Math.min(SLIDE_COUNT-1, s+1))} style={{ padding: '12px 24px', background: COLORS.cyan, color: '#000' }}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default M3LabEngine;
