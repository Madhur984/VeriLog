/**
 * Module3Root.tsx ΓÇö Binary Awakening
 * ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
 * Complete, self-contained implementation of Module 3.
 * 8 slides ┬╖ Horizontal slider ┬╖ Web Audio ┬╖ Pro Mode ┬╖ Skill-tree callback
 *
 * Color system (ECE Signature palette):
 *   #0A0A0B  Matte Obsidian     (background)
 *   #121215  Solder Mask        (cards / surfaces)
 *   #2A2A35  Ghost Trace        (borders)
 *   #00D4FF  Plasma Cyan        (primary accent)
 *   #0088AA  Cyan Mist          (dim/disabled)
 *   #FF5F1F  Burnished Copper   (error / carry)
 *   #E6E6ED  Oscilloscope Trace (primary text)
 *   #8A8A99  Grid Line          (HUD / subtitles)
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  motion,
  AnimatePresence,
  PanInfo,
} from 'framer-motion';

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// TYPES
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

interface Module3Props {
  onUnlockBinary?: () => void;
}

type Mode = 'simple' | 'pro';

interface SceneProps {
  isActive: boolean;
  proMode: boolean;
  progressOffset: number; // -1 ΓåÆ 0 ΓåÆ 1 (0 = centred)
}

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// CONSTANTS
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const C = {
  bg:        '#0A0A0B',
  surface:   '#121215',
  border:    '#2A2A35',
  cyan:      '#00D4FF',
  cyanDim:   '#0088AA',
  copper:    '#FF5F1F',
  text:      '#E6E6ED',
  muted:     '#8A8A99',
  mono:      '"IBM Plex Mono", "Courier New", monospace',
  sans:      '"Inter", system-ui, sans-serif',
} as const;

const SLIDE_COUNT = 8;
const STORAGE_KEY = 'm3_slide_v2';
const MUTE_KEY    = 'm3_mute_v1';

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// WEB AUDIO HOOK
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const useAudio = (muted: boolean) => {
  const ctxRef  = useRef<AudioContext | null>(null);
  const lastRef = useRef<number>(0);

  const resume = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
  }, []);

  const play = useCallback(
    (type: 'toggle' | 'success' | 'error' | 'snap') => {
      if (muted) return;
      const now = Date.now();
      if (now - lastRef.current < 300) return; // cooldown
      lastRef.current = now;
      resume();
      const ctx = ctxRef.current!;
      const t   = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const configs: Record<string, { freqs: number[]; dur: number }> = {
        toggle:  { freqs: [880],           dur: 0.1  },
        snap:    { freqs: [650],           dur: 0.15 },
        success: { freqs: [523.25, 659.25], dur: 0.35 },
        error:   { freqs: [220],           dur: 0.25 },
      };
      const cfg = configs[type];
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);

      cfg.freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = type === 'error' ? 'sawtooth' : 'sine';
        osc.frequency.value = f;
        osc.connect(gain);
        osc.start(t + i * 0.1);
        osc.stop(t + cfg.dur + i * 0.1);
      });
    },
    [muted, resume]
  );

  return { play, resume };
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// DECIMAL Γåö BITS HELPERS
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const bitsToDecimal = (bits: number[]) =>
  bits.reduce((acc, b, i) => acc + b * Math.pow(2, bits.length - 1 - i), 0);

const decimalToBits = (n: number, len = 4) =>
  Array.from({ length: len }, (_, i) => (n >> (len - 1 - i)) & 1);

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SHARED COMPONENTS
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Hud: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: C.mono,
      fontSize: 10,
      color: C.muted,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

const ProPanel: React.FC<{ visible: boolean; children: React.ReactNode }> = ({
  visible,
  children,
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.25 }}
        style={{
          marginTop: 24,
          padding: '16px 20px',
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          background: 'rgba(0,212,255,0.04)',
          fontFamily: C.mono,
          fontSize: 11,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 480,
          textAlign: 'left',
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const SceneShell: React.FC<{
  title: string;
  micro: string;
  children: React.ReactNode;
  align?: 'center' | 'left';
}> = ({ title, micro, children, align = 'center' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: 40,
      textAlign: align,
      maxWidth: 860,
      width: '100%',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: C.sans,
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 800,
          fontStyle: 'italic',
          color: C.text,
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          fontFamily: C.sans,
          fontSize: 16,
          color: C.muted,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {micro}
      </motion.p>
    </div>
    {children}
  </div>
);

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 1 ΓÇö Signal ΓåÆ Value
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene1: React.FC<SceneProps> = ({ proMode, progressOffset }) => {
  // progressOffset: -1 (entry from left) ΓåÆ 0 (active) ΓåÆ 1 (exit right)
  // morph: 0 = smooth analog, 1 = binary blocks
  const morph = Math.max(0, Math.min(1, 0.5 - progressOffset * 0.8));
  const quantLevels = Math.max(1, Math.round(morph * 4) + 1);
  const W = 560; const H = 120;
  const pts = Array.from({ length: W }, (_, x) => {
    const raw = Math.sin((x / W) * Math.PI * 4) * 0.5 + 0.5;
    const q   = Math.floor(raw * quantLevels) / quantLevels;
    const y   = H / 2 - (morph > 0.7 ? q : raw * morph + raw * (1 - morph)) * H * 0.8;
    return `${x},${y}`;
  }).join(' ');
  const colour = `hsl(${30 + morph * 168}, 100%, 60%)`; // orange ΓåÆ cyan

  return (
    <SceneShell title="A signal becomes a value." micro="Continuous energy. Discrete decision.">
      <div
        style={{
          width: '100%',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: '32px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120 }}>
          <motion.polyline
            points={pts}
            fill="none"
            stroke={colour}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${colour})` }}
          />
        </svg>
        <Hud style={{ marginTop: 12, textAlign: 'center' }}>
          {morph < 0.3
            ? 'ANALOG ΓÇö CONTINUOUS'
            : morph < 0.7
            ? 'QUANTIZINGΓÇª'
            : 'BINARY ΓÇö DISCRETE'}
        </Hud>
      </div>

      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Pro Mode</span>
        <br />
        Threshold Vth = 2.5V ΓÇö signals above = 1, below = 0
        <br />
        Quantization levels: {Math.pow(2, quantLevels)} ΓåÆ eventually 2
        <br />
        <span style={{ color: C.text }}>Concept: continuous space ΓåÆ finite decisions</span>
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 2 ΓÇö Why Only Two States
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene2: React.FC<SceneProps> = ({ proMode }) => {
  const [levels, setLevels] = useState(8);
  const W = 480; const H = 140;
  const pts = Array.from({ length: W }, (_, x) => {
    const raw  = Math.sin((x / W) * Math.PI * 5) * 0.5 + 0.5;
    const q    = Math.floor(raw * levels) / levels;
    const y    = H / 2 - q * H * 0.85;
    return `${x},${y}`;
  }).join(' ');
  const stability = 1 - (levels - 2) / 6; // 0 ΓåÆ 1 as levels drop to 2

  return (
    <SceneShell title="Systems keep only what is reliable." micro="Fewer states ΓåÆ less confusion.">
      {/* Waveform */}
      <div
        style={{
          width: '100%',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: '28px 24px',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140 }}>
          <polyline
            points={pts}
            fill="none"
            stroke={`hsl(${stability * 180 + 0}, 100%, 55%)`}
            strokeWidth={2}
          />
          {proMode && (
            <>
              {/* VIH_min */}
              <line x1={0} y1={H * 0.3} x2={W} y2={H * 0.3} stroke={C.copper} strokeDasharray="4 4" strokeWidth={1} />
              {/* VIL_max */}
              <line x1={0} y1={H * 0.7} x2={W} y2={H * 0.7} stroke={C.cyanDim} strokeDasharray="4 4" strokeWidth={1} />
            </>
          )}
        </svg>
        {proMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Hud>VIH min = 2.0V Γåæ</Hud>
            <Hud>VIL max = 0.8V Γåô</Hud>
          </div>
        )}
      </div>

      {/* Slider */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Hud>States: {levels}</Hud>
          <Hud style={{ color: stability > 0.8 ? C.cyan : C.muted }}>
            {stability > 0.8 ? 'STABLE' : 'NOISY'}
          </Hud>
        </div>
        <input
          type="range"
          min={2}
          max={8}
          step={1}
          value={levels}
          onChange={e => setLevels(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.cyan }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Hud>Many levels (unstable)</Hud>
          <Hud>2 levels (reliable)</Hud>
        </div>
      </div>

      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Noise Margin</span>
        <br />
        NM_H = VOH_min ΓêÆ VIH_min &nbsp;|&nbsp; NM_L = VIL_max ΓêÆ VOL_max
        <br />
        More states ΓåÆ smaller noise margin ΓåÆ unreliable at scale
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 3 ΓÇö Power of Positions
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene3: React.FC<SceneProps> = ({ proMode }) => {
  const [revealed, setRevealed] = useState(1);
  const positions = [8, 4, 2, 1];

  return (
    <SceneShell title="Each position doubles the value." micro="Tap a position to reveal its weight.">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {positions.slice(0, 4).map((val, idx) => {
          const isVisible = idx < revealed;
          return (
            <motion.div
              key={val}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isVisible ? 1 : 0.15, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setRevealed(v => Math.min(4, v === idx + 1 ? v + 1 : idx + 1))}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 110,
                height: 140,
                background: isVisible ? 'rgba(0,212,255,0.07)' : C.surface,
                border: `2px solid ${isVisible ? C.cyan : C.border}`,
                borderRadius: 18,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: isVisible ? `0 0 18px ${C.cyan}33` : 'none',
              }}
            >
              {proMode && (
                <Hud style={{ color: C.cyanDim }}>2^{3 - idx}</Hud>
              )}
              <span
                style={{
                  fontFamily: C.mono,
                  fontSize: 40,
                  fontWeight: 700,
                  color: isVisible ? C.cyan : C.border,
                }}
              >
                {val}
              </span>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}
                >
                  position {3 - idx}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Doubling animation row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {[1, 2, 4, 8].map((v, i) => (
          <React.Fragment key={v}>
            <motion.span
              animate={{ opacity: i < revealed ? 1 : 0.2 }}
              style={{ fontFamily: C.mono, fontSize: 24, color: C.cyan }}
            >
              {v}
            </motion.span>
            {i < 3 && (
              <span style={{ color: C.muted, fontFamily: C.mono }}>ΓåÆ</span>
            )}
          </React.Fragment>
        ))}
        <span style={{ fontFamily: C.mono, fontSize: 14, color: C.muted, marginLeft: 8 }}>
          ├ù2 each step
        </span>
      </div>

      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Positional Notation</span>
        <br />
        Bit value = bit ├ù 2^position
        <br />
        Total = ╬ú bitß╡ó ├ù 2Γü▒ &nbsp;for i = 0 ΓÇª nΓêÆ1
        <br />
        <span style={{ color: C.text }}>Max 4-bit value = 8+4+2+1 = 15</span>
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 4 ΓÇö Binary Builder (CORE)
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const BitBlock: React.FC<{
  value: number;
  weight: number;
  proMode: boolean;
  onToggle: () => void;
  ripple: boolean;
}> = ({ value, weight, proMode, onToggle, ripple }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    {proMode && (
      <Hud style={{ color: C.cyanDim }}>{weight}</Hud>
    )}
    <motion.button
      onClick={onToggle}
      animate={{
        backgroundColor: value ? C.cyan : C.surface,
        borderColor:     value ? C.cyan : C.border,
        scale: ripple ? [1, 1.18, 1] : 1,
        boxShadow: value
          ? [`0 0 0px ${C.cyan}`, `0 0 24px ${C.cyan}55`, `0 0 12px ${C.cyan}33`]
          : `0 0 0px transparent`,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        width: 80,
        height: 100,
        border: '2px solid',
        borderRadius: 16,
        cursor: 'pointer',
        fontFamily: C.mono,
        fontSize: 40,
        fontWeight: 700,
        color: value ? '#000' : C.muted,
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <motion.span
        key={value}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.14 }}
      >
        {value}
      </motion.span>
    </motion.button>
    {proMode && (
      <Hud style={{ color: value ? C.cyan : C.border }}>
        {value ? `+${weight}` : 'off'}
      </Hud>
    )}
  </div>
);

const Scene4: React.FC<SceneProps & { bits: number[]; onToggle: (i: number) => void }> = ({
  proMode,
  bits,
  onToggle,
}) => {
  const [rippleIdx, setRippleIdx] = useState<number | null>(null);
  const decimal = bitsToDecimal(bits);
  const weights = [8, 4, 2, 1];

  const handleToggle = (i: number) => {
    onToggle(i);
    setRippleIdx(i);
    setTimeout(() => setRippleIdx(null), 350);
  };

  const breakdown =
    bits
      .map((b, i) => (b ? `${weights[i]}` : null))
      .filter(Boolean)
      .join(' + ') || '0';

  return (
    <SceneShell title="Turn bits on. Build numbers." micro="Click a block to toggle it.">
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        {bits.map((b, i) => (
          <BitBlock
            key={i}
            value={b}
            weight={weights[i]}
            proMode={proMode}
            onToggle={() => handleToggle(i)}
            ripple={rippleIdx === i}
          />
        ))}
      </div>

      {/* Decimal readout */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          key={decimal}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            fontFamily: C.mono,
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 700,
            color: C.text,
            letterSpacing: '-0.02em',
          }}
        >
          {decimal}
        </motion.div>
        {proMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: C.mono, fontSize: 13, color: C.cyanDim, marginTop: 8 }}
          >
            {breakdown} = {decimal}
          </motion.div>
        )}
        <Hud style={{ marginTop: 6 }}>decimal value</Hud>
      </div>

      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Weighted Sum</span>
        <br />
        Each active bit contributes its positional weight.
        <br />
        <span style={{ color: C.text }}>
          {bits.map((b, i) => `${weights[i]}┬╖${b}`).join(' + ')} = {decimal}
        </span>
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 5 ΓÇö Reading Binary
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene5: React.FC<SceneProps> = ({ proMode }) => {
  const [target, setTarget] = useState<number[]>([1, 0, 1, 0, 1]);
  const [guess, setGuess]   = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const weights = [16, 8, 4, 2, 1];
  const correct = bitsToDecimal(target);

  const generate = () => {
    setTarget(Array.from({ length: 5 }, () => Math.round(Math.random())));
    setGuess('');
    setStatus('idle');
  };

  const check = () => {
    if (parseInt(guess, 10) === correct) {
      setStatus('correct');
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  const borderColor =
    status === 'correct' ? C.cyan :
    status === 'wrong'   ? C.copper : C.border;

  return (
    <SceneShell title="Read active positions. Add them." micro="What decimal number is shown?">
      {/* Bit display */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {target.map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            {proMode && <Hud style={{ color: C.cyanDim }}>{weights[i]}</Hud>}
            <div
              style={{
                width: 64,
                height: 80,
                background: b ? 'rgba(0,212,255,0.12)' : C.surface,
                border: `2px solid ${b ? C.cyan : C.border}`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: C.mono,
                fontSize: 32,
                fontWeight: 700,
                color: b ? C.cyan : C.muted,
                boxShadow: b ? `0 0 12px ${C.cyan}33` : 'none',
              }}
            >
              {b}
            </div>
            {proMode && (
              <Hud style={{ color: b ? C.cyan : C.border }}>
                {b ? `+${weights[i]}` : 'ΓÇö'}
              </Hud>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 320 }}>
        <motion.input
          animate={{ borderColor }}
          value={guess}
          onChange={e => { setGuess(e.target.value); setStatus('idle'); }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="decimalΓÇª"
          type="number"
          style={{
            width: '100%',
            background: C.surface,
            border: `2px solid ${borderColor}`,
            borderRadius: 14,
            padding: '16px 20px',
            fontFamily: C.mono,
            fontSize: 28,
            color: C.text,
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            onClick={check}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 12,
              background: C.cyan,
              color: '#000',
              fontFamily: C.sans,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Confirm
          </button>
          <button
            onClick={generate}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 12,
              background: C.surface,
              color: C.muted,
              fontFamily: C.sans,
              fontWeight: 600,
              fontSize: 13,
              border: `1px solid ${C.border}`,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            New
          </button>
        </div>
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: C.mono,
                fontSize: 13,
                color: status === 'correct' ? C.cyan : C.copper,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {status === 'correct' ? 'Γ£ô correct' : 'Γ£ù try again'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Breakdown</span>
        <br />
        {target.map((b, i) => `${weights[i]}┬╖${b}`).join(' + ')}{' = '}{correct}
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 6 ΓÇö System View (Switches ΓåÆ Bits)
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene6: React.FC<SceneProps> = ({ proMode }) => {
  const [switches, setSwitches] = useState([0, 0, 0, 0]);
  const decimal = bitsToDecimal(switches);

  const toggleSwitch = (i: number) => {
    setSwitches(s => s.map((v, idx) => idx === i ? 1 - v : v));
  };

  return (
    <SceneShell title="A system of switches becomes information." micro="Flip a switch. Change a bit.">
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {switches.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Hud>SW {i}</Hud>
            {/* Physical toggle switch */}
            <motion.div
              onClick={() => toggleSwitch(i)}
              style={{
                width: 56,
                height: 100,
                background: s ? 'rgba(0,212,255,0.1)' : C.surface,
                border: `2px solid ${s ? C.cyan : C.border}`,
                borderRadius: 28,
                cursor: 'pointer',
                display: 'flex',
                alignItems: s ? 'flex-start' : 'flex-end',
                justifyContent: 'center',
                padding: 6,
                boxShadow: s ? `0 0 16px ${C.cyan}44` : 'none',
                transition: 'all 0.2s',
              }}
            >
              <motion.div
                animate={{ y: s ? 0 : 0, backgroundColor: s ? C.cyan : C.muted }}
                style={{ width: 36, height: 36, borderRadius: '50%', transition: 'all 0.2s' }}
              />
            </motion.div>
            <Hud style={{ color: s ? C.cyan : C.border }}>BIT {3 - i}</Hud>
            <div
              style={{
                width: 36,
                height: 44,
                background: s ? 'rgba(0,212,255,0.12)' : C.surface,
                border: `2px solid ${s ? C.cyan : C.border}`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: C.mono,
                fontSize: 22,
                fontWeight: 700,
                color: s ? C.cyan : C.muted,
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      {/* Signal flow (Pro Mode) */}
      <AnimatePresence>
        {proMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {['Voltage', 'Logic Level', 'Bit', 'Weighted Sum', 'Number'].map((label, i, arr) => (
              <React.Fragment key={label}>
                <Hud
                  style={{
                    color: i === arr.length - 1 ? C.cyan : C.muted,
                    padding: '4px 10px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                  }}
                >
                  {label}
                </Hud>
                {i < arr.length - 1 && (
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    style={{ color: C.cyanDim, fontFamily: C.mono }}
                  >
                    ΓåÆ
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decimal readout */}
      <div style={{ textAlign: 'center' }}>
        <motion.span
          key={decimal}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            display: 'block',
            fontFamily: C.mono,
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 700,
            color: C.text,
          }}
        >
          {decimal}
        </motion.span>
        <Hud style={{ marginTop: 4 }}>decimal ┬╖ {switches.join('')} binary</Hud>
      </div>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 7 ΓÇö Mastery Challenge
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const TARGETS = [13, 7, 11, 5, 14, 9, 6, 3];

const Scene7: React.FC<SceneProps & { onUnlock: () => void }> = ({
  proMode,
  onUnlock,
}) => {
  const [bits, setBits]         = useState([0, 0, 0, 0]);
  const [target]                = useState(() => TARGETS[Math.floor(Math.random() * TARGETS.length)]);
  const [unlocked, setUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [rippleIdx, setRippleIdx] = useState<number | null>(null);
  const weights = [8, 4, 2, 1];
  const decimal = bitsToDecimal(bits);

  const toggle = (i: number) => {
    if (unlocked) return;
    setBits(b => b.map((v, idx) => idx === i ? 1 - v : v));
    setRippleIdx(i);
    setTimeout(() => setRippleIdx(null), 300);
    setAttempts(a => a + 1);
  };

  useEffect(() => {
    if (!unlocked && decimal === target) {
      setUnlocked(true);
      onUnlock();
    }
  }, [decimal, target, unlocked, onUnlock]);

  return (
    <SceneShell title={`Build the number ${target}.`} micro={proMode ? 'No labels. Pure logic.' : 'Build the number.'}>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {bits.map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {/* In simple mode, no weight labels ΓÇö pure mastery */}
            {proMode && <Hud style={{ color: C.cyanDim }}>{weights[i]}</Hud>}
            <motion.button
              onClick={() => toggle(i)}
              animate={{
                backgroundColor: b ? C.cyan : C.surface,
                borderColor: b ? C.cyan : C.border,
                scale: rippleIdx === i ? [1, 1.15, 1] : (unlocked ? [1, 1.03, 1] : 1),
                boxShadow: unlocked
                  ? [`0 0 0px ${C.cyan}`, `0 0 48px ${C.cyan}88`, `0 0 24px ${C.cyan}44`]
                  : b ? `0 0 12px ${C.cyan}44` : 'none',
              }}
              transition={{ duration: 0.18 }}
              style={{
                width: 84,
                height: 108,
                border: '2px solid',
                borderRadius: 18,
                cursor: unlocked ? 'default' : 'pointer',
                fontFamily: C.mono,
                fontSize: 44,
                fontWeight: 700,
                color: b ? '#000' : C.muted,
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {b}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Progress bar toward target */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 4, background: C.surface, borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${(decimal / target) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              height: '100%',
              background: decimal === target ? C.cyan : C.cyanDim,
              borderRadius: 99,
              boxShadow: decimal === target ? `0 0 12px ${C.cyan}` : 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Hud style={{ color: decimal === target ? C.cyan : C.muted }}>
            {decimal} / {target}
          </Hud>
          <Hud>{attempts > 0 ? `${attempts} toggle${attempts !== 1 ? 's' : ''}` : 'start toggling'}</Hud>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ boxShadow: [`0 0 0px ${C.cyan}`, `0 0 120px ${C.cyan}44`, `0 0 60px ${C.cyan}22`] }}
              transition={{ duration: 1.2, repeat: 2 }}
              style={{
                padding: '40px 64px',
                background: 'rgba(10,10,11,0.92)',
                border: `2px solid ${C.cyan}`,
                borderRadius: 24,
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ fontFamily: C.mono, fontSize: 13, color: C.cyan, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Locked In
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 28, fontWeight: 800, color: C.text, marginTop: 8 }}>
                {target} = {decimalToBits(target, 4).join('')} Γ£ô
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, marginTop: 12 }}>
                You didn't memorise this. You built it.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Mode hint after 3 failed relevant attempts */}
      <ProPanel visible={proMode && attempts > 6 && !unlocked}>
        <span style={{ color: C.copper }}>// Hint (Pro Mode)</span>
        <br />
        {target} = {decimalToBits(target, 4).map((b, i) => `${weights[i]}┬╖${b}`).filter((_, i) => decimalToBits(target, 4)[i]).join(' + ')}
        <br />
        Bits: {decimalToBits(target, 4).join(' ')}
      </ProPanel>
    </SceneShell>
  );
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SCENE 8 ΓÇö Bridge to Module 4
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const Scene8: React.FC<SceneProps> = ({ proMode }) => (
  <SceneShell
    title="You can represent numbers."
    micro="Now ΓÇö how are they used?"
  >
    <div style={{ position: 'relative', width: 320, height: 200 }}>
      {/* Flowing bits */}
      {[0, 1, 1, 0, 1, 0, 1, 1].map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 280], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 40 + (i % 4) * 36,
            left: 0,
            fontFamily: C.mono,
            fontSize: 18,
            fontWeight: 700,
            color: b ? C.cyan : C.border,
          }}
        >
          {b}
        </motion.div>
      ))}
      {/* Abstract gate symbol */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 60,
          height: 60,
          border: `2px solid ${C.border}`,
          borderRadius: '0 30px 30px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: C.mono,
          fontSize: 10,
          color: C.muted,
          letterSpacing: '0.15em',
        }}
      >
        NEXT
      </motion.div>
    </div>

    <div
      style={{
        fontFamily: C.sans,
        fontSize: 18,
        color: C.muted,
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 400,
      }}
    >
      Binary is the{' '}
      <span style={{ color: C.cyan, fontWeight: 700 }}>language</span>.<br />
      Module 4 introduces the{' '}
      <span style={{ color: C.text, fontWeight: 700 }}>rules</span>.
    </div>

    <ProPanel visible={proMode}>
      <span style={{ color: C.cyan }}>// Coming Next</span>
      <br />
      Logic gates: AND, OR, NOT, XOR
      <br />
      Adders, multiplexers, and computation
      <br />
      <span style={{ color: C.text }}>Binary is the alphabet. Gates are the grammar.</span>
    </ProPanel>
  </SceneShell>
);

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// DOT GRID BACKGROUND
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const DotGrid: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      backgroundImage: `
        radial-gradient(circle, ${C.border} 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      opacity: 0.18,
    }}
  />
);

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// SLIDE DOTS NAVIGATION
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const SlideDots: React.FC<{ total: number; current: number; onGo: (i: number) => void }> = ({
  total,
  current,
  onGo,
}) => (
  <div
    style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 10,
      zIndex: 200,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <motion.button
        key={i}
        onClick={() => onGo(i)}
        animate={{
          width: i === current ? 24 : 8,
          backgroundColor: i === current ? C.cyan : C.border,
          opacity: i === current ? 1 : 0.5,
        }}
        style={{
          height: 8,
          borderRadius: 99,
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
        }}
        title={`Slide ${i + 1}`}
      />
    ))}
  </div>
);

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// MAIN MODULE3ROOT
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export const Module3Root: React.FC<Module3Props> = ({ onUnlockBinary }) => {
  // Persistence
  const savedIdx = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
  const savedMute = localStorage.getItem(MUTE_KEY) === 'true';

  const [slideIndex, setSlideIndex] = useState<number>(
    isNaN(savedIdx) ? 0 : Math.min(savedIdx, SLIDE_COUNT - 1)
  );
  const [mode, setMode]   = useState<Mode>('simple');
  const [muted, setMuted] = useState(savedMute);
  const [bits, setBits]   = useState<number[]>([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);


  const proMode   = mode === 'pro';
  const { play, resume } = useAudio(muted);

  // Persist slide
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(slideIndex));
  }, [slideIndex]);

  // Persist mute
  useEffect(() => {
    localStorage.setItem(MUTE_KEY, String(muted));
  }, [muted]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
      if (clamped !== slideIndex) {
        setSlideIndex(clamped);
        play('snap');
      }
    },
    [slideIndex, play]
  );

  const goNext = useCallback(() => goTo(slideIndex + 1), [slideIndex, goTo]);
  const goPrev = useCallback(() => goTo(slideIndex - 1), [slideIndex, goTo]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Wheel
  const wheelLock = useRef(false);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelLock.current) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 40) {
        const dir = e.deltaX > 10 || e.deltaY > 10 ? 1 : -1;
        goTo(slideIndex + dir);
        wheelLock.current = true;
        setTimeout(() => { wheelLock.current = false; }, 700);
      }
    },
    [slideIndex, goTo]
  );

  // Drag
  const onDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      resume();
      if (info.offset.x < -60) goNext();
      else if (info.offset.x > 60) goPrev();
    },
    [goNext, goPrev, resume]
  );

  // Bit toggle for Scene 4 (global bits shared with challenge)
  const handleBitToggle = useCallback((i: number) => {
    play('toggle');
    setBits(b => b.map((v, idx) => idx === i ? 1 - v : v));
  }, [play]);

  const handleUnlock = useCallback(() => {
    if (!unlocked) {
      setUnlocked(true);
      play('success');
      onUnlockBinary?.();
    }
  }, [unlocked, play, onUnlockBinary]);

  // Scenes array
  const scenes: React.FC<SceneProps>[] = [
    (p) => <Scene1 {...p} />,
    (p) => <Scene2 {...p} />,
    (p) => <Scene3 {...p} />,
    (p) => <Scene4 {...p} bits={bits} onToggle={handleBitToggle} />,
    (p) => <Scene5 {...p} />,
    (p) => <Scene6 {...p} />,
    (p) => <Scene7 {...p} onUnlock={handleUnlock} />,
    (p) => <Scene8 {...p} />,
  ];

  const LABELS = [
    'Signal ΓåÆ Value',
    'Two States',
    'Positions',
    'Builder',
    'Reading',
    'System View',
    'Challenge',
    'Next ΓåÆ',
  ];

  return (
    <div
      onWheel={handleWheel}
      onClick={resume}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: C.bg,
        color: C.text,
        fontFamily: C.sans,
        position: 'relative',
      }}
    >
      <DotGrid />

      {/* ΓöÇΓöÇ TOP HUD ΓöÇΓöÇ */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px 0',
        }}
      >
        {/* Breadcrumb */}
        <Hud>
          Home /&nbsp;
          <span style={{ color: C.muted }}>Modules /&nbsp;</span>
          <span style={{ color: C.cyan }}>Binary Awakening</span>
        </Hud>

        {/* Progress */}
        <Hud style={{ color: C.muted }}>
          {slideIndex + 1} / {SLIDE_COUNT} &nbsp;┬╖&nbsp; {LABELS[slideIndex]}
        </Hud>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setMuted(m => !m)}
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: C.mono,
              fontSize: 10,
              color: muted ? C.copper : C.muted,
              letterSpacing: '0.15em',
            }}
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button
            onClick={() => setMode(m => m === 'simple' ? 'pro' : 'simple')}
            style={{
              background: proMode ? 'rgba(0,212,255,0.1)' : 'none',
              border: `1px solid ${proMode ? C.cyan : C.border}`,
              borderRadius: 8,
              padding: '4px 14px',
              cursor: 'pointer',
              fontFamily: C.mono,
              fontSize: 10,
              color: proMode ? C.cyan : C.muted,
              letterSpacing: '0.15em',
              transition: 'all 0.2s',
            }}
          >
            {proMode ? 'PRO' : 'SIMPLE'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: C.border,
          zIndex: 300,
        }}
      >
        <motion.div
          animate={{ width: `${((slideIndex + 1) / SLIDE_COUNT) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            height: '100%',
            background: C.cyan,
            boxShadow: `0 0 8px ${C.cyan}`,
          }}
        />
      </div>

      {/* ΓöÇΓöÇ SLIDE TRACK ΓöÇΓöÇ */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={onDragEnd}
        animate={{ x: `-${slideIndex * 100}vw` }}
        transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
        style={{
          display: 'flex',
          width: `${SLIDE_COUNT * 100}vw`,
          height: '100vh',
          cursor: 'grab',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {scenes.map((SceneComponent, i) => {
          const offset = i - slideIndex;
          return (
            <div
              key={i}
              style={{
                width: '100vw',
                height: '100vh',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 40px 80px',
                boxSizing: 'border-box',
              }}
            >
              <SceneComponent
                isActive={i === slideIndex}
                proMode={proMode}
                progressOffset={offset}
              />
            </div>
          );
        })}
      </motion.div>

      {/* ΓöÇΓöÇ ARROW KEYS ΓöÇΓöÇ */}
      <button
        onClick={goPrev}
        disabled={slideIndex === 0}
        style={{
          position: 'fixed',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: `1px solid ${slideIndex === 0 ? C.border : C.border}`,
          borderRadius: 12,
          padding: '12px 14px',
          cursor: slideIndex === 0 ? 'not-allowed' : 'pointer',
          color: slideIndex === 0 ? C.border : C.muted,
          fontFamily: C.mono,
          fontSize: 18,
          zIndex: 200,
          opacity: slideIndex === 0 ? 0.3 : 0.8,
          transition: 'all 0.2s',
        }}
      >
        ΓåÉ
      </button>
      <button
        onClick={goNext}
        disabled={slideIndex === SLIDE_COUNT - 1}
        style={{
          position: 'fixed',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '12px 14px',
          cursor: slideIndex === SLIDE_COUNT - 1 ? 'not-allowed' : 'pointer',
          color: slideIndex === SLIDE_COUNT - 1 ? C.border : C.muted,
          fontFamily: C.mono,
          fontSize: 18,
          zIndex: 200,
          opacity: slideIndex === SLIDE_COUNT - 1 ? 0.3 : 0.8,
          transition: 'all 0.2s',
        }}
      >
        ΓåÆ
      </button>

      {/* ΓöÇΓöÇ SLIDE DOTS ΓöÇΓöÇ */}
      <SlideDots total={SLIDE_COUNT} current={slideIndex} onGo={goTo} />
    </div>
  );
};

export default Module3Root;
