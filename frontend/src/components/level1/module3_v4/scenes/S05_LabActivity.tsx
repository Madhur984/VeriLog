/**
 * S05_LabActivity.tsx — Binary Awakening (Full Port from m_3 branch)
 * ─────────────────────────────────────────────────────────────
 * Complete, self-contained implementation of Module 3 Lab Activity.
 * 8 slides · Horizontal slider · Web Audio · Pro Mode · integrated flow.
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

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface SceneProps {
  isActive: boolean;
  proMode: boolean;
  progressOffset: number; // -1 → 0 → 1 (0 = centred)
}

type Mode = 'simple' | 'pro';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// WEB AUDIO HOOK
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const bitsToDecimal = (bits: number[]) =>
  bits.reduce((acc, b, i) => acc + b * Math.pow(2, bits.length - 1 - i), 0);

const decimalToBits = (n: number, len = 4) =>
  Array.from({ length: len }, (_, i) => (n >> (len - 1 - i)) & 1);

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// SCENE 1
// ─────────────────────────────────────────────────────────────

const Scene1: React.FC<SceneProps> = ({ progressOffset }) => {
  const morph = Math.max(0, Math.min(1, 0.5 - progressOffset * 0.8));
  const quantLevels = Math.max(1, Math.round(morph * 4) + 1);
  const W = 560; const H = 120;
  const pts = Array.from({ length: W }, (_, x) => {
    const raw = Math.sin((x / W) * Math.PI * 4) * 0.5 + 0.5;
    const q   = Math.floor(raw * quantLevels) / quantLevels;
    const y   = H / 2 - (morph > 0.7 ? q : raw * morph + raw * (1 - morph)) * H * 0.8;
    return `${x},${y}`;
  }).join(' ');
  const colour = `hsl(${30 + morph * 168}, 100%, 60%)`;

  return (
    <SceneShell title="A signal becomes a value." micro="Continuous energy. Discrete decision.">
      <div style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120 }}>
          <motion.polyline points={pts} fill="none" stroke={colour} strokeWidth={2} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${colour})` }} />
        </svg>
        <Hud style={{ marginTop: 12, textAlign: 'center' }}>
          {morph < 0.3 ? 'ANALOG — CONTINUOUS' : morph < 0.7 ? 'QUANTIZING...' : 'BINARY — DISCRETE'}
        </Hud>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 2
// ─────────────────────────────────────────────────────────────

const Scene2: React.FC<SceneProps> = ({ proMode }) => {
  const [levels, setLevels] = useState(8);
  const W = 480; const H = 140;
  const pts = Array.from({ length: W }, (_, x) => {
    const raw  = Math.sin((x / W) * Math.PI * 5) * 0.5 + 0.5;
    const q    = Math.floor(raw * levels) / levels;
    const y    = H / 2 - q * H * 0.85;
    return `${x},${y}`;
  }).join(' ');
  const stability = 1 - (levels - 2) / 6;

  return (
    <SceneShell title="Systems keep only what is reliable." micro="Fewer states → less confusion.">
      <div style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px 24px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140 }}>
          <polyline points={pts} fill="none" stroke={`hsl(${stability * 180 + 0}, 100%, 55%)`} strokeWidth={2} />
          {proMode && (
            <>
              <line x1={0} y1={H * 0.3} x2={W} y2={H * 0.3} stroke={C.copper} strokeDasharray="4 4" strokeWidth={1} />
              <line x1={0} y1={H * 0.7} x2={W} y2={H * 0.7} stroke={C.cyanDim} strokeDasharray="4 4" strokeWidth={1} />
            </>
          )}
        </svg>
      </div>
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Hud>States: {levels}</Hud>
          <Hud style={{ color: stability > 0.8 ? C.cyan : C.muted }}>{stability > 0.8 ? 'STABLE' : 'NOISY'}</Hud>
        </div>
        <input type="range" min={2} max={8} step={1} value={levels} onChange={e => setLevels(Number(e.target.value))} style={{ width: '100%', accentColor: C.cyan }} />
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 3
// ─────────────────────────────────────────────────────────────

const Scene3: React.FC<SceneProps> = ({ proMode }) => {
  const [revealed, setRevealed] = useState(1);
  const positions = [8, 4, 2, 1];
  return (
    <SceneShell title="Each position doubles the value." micro="Tap a position to reveal its weight.">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {positions.map((val, idx) => {
          const isVisible = idx < revealed;
          return (
            <motion.div key={val} onClick={() => setRevealed(v => Math.min(4, v === idx + 1 ? v + 1 : idx + 1))} whileHover={{ scale: 1.06 }} style={{ width: 110, height: 140, background: isVisible ? 'rgba(0,212,255,0.07)' : C.surface, border: `2px solid ${isVisible ? C.cyan : C.border}`, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
              {proMode && <Hud style={{ color: C.cyanDim }}>2^{3 - idx}</Hud>}
              <span style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 700, color: isVisible ? C.cyan : C.border }}>{val}</span>
            </motion.div>
          );
        })}
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 4
// ─────────────────────────────────────────────────────────────

const BitBlock: React.FC<{ value: number; weight: number; proMode: boolean; onToggle: () => void; ripple: boolean }> = ({ value, weight, proMode, onToggle, ripple }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    {proMode && <Hud style={{ color: C.cyanDim }}>{weight}</Hud>}
    <motion.button onClick={onToggle} animate={{ backgroundColor: value ? C.cyan : C.surface, borderColor: value ? C.cyan : C.border, scale: ripple ? [1, 1.18, 1] : 1 }} style={{ width: 80, height: 100, border: '2px solid', borderRadius: 16, cursor: 'pointer', fontFamily: C.mono, fontSize: 40, fontWeight: 700, color: value ? '#000' : C.muted, outline: 'none' }}>
      {value}
    </motion.button>
  </div>
);

const Scene4: React.FC<SceneProps & { bits: number[], onToggle: (i: number) => void }> = ({ proMode, bits, onToggle }) => {
  const decimal = bitsToDecimal(bits);
  const weights = [8, 4, 2, 1];
  return (
    <SceneShell title="Turn bits on. Build numbers." micro="Click a block to toggle it.">
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {bits.map((b, i) => (
          <BitBlock key={i} value={b} weight={weights[i]} proMode={proMode} onToggle={() => onToggle(i)} ripple={false} />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: C.mono, fontSize: 80, fontWeight: 700, color: C.text }}>{decimal}</div>
        <Hud>decimal value</Hud>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 5
// ─────────────────────────────────────────────────────────────

const Scene5: React.FC<SceneProps> = ({ proMode }) => {
  const [target, setTarget] = useState<number[]>([1, 0, 1, 0, 1]);
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const check = () => setStatus(parseInt(guess) === bitsToDecimal(target) ? 'correct' : 'wrong');
  return (
    <SceneShell title="Read active positions. Add them." micro="What decimal number is shown?">
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {target.map((b, i) => (
          <div key={i} style={{ width: 64, height: 80, background: b ? 'rgba(0,212,255,0.1)' : C.surface, border: `2px solid ${b ? C.cyan : C.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, fontSize: 32, fontWeight: 700, color: b ? C.cyan : C.muted }}>{b}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
        <input value={guess} onChange={e => setGuess(e.target.value)} type="number" style={{ width: '100%', background: C.surface, border: `2px solid ${C.border}`, borderRadius: 14, padding: 16, fontFamily: C.mono, fontSize: 24, color: C.text, textAlign: 'center' }} />
        <button onClick={check} style={{ width: '100%', padding: 14, background: C.cyan, color: '#000', borderRadius: 12, fontWeight: 700 }}>VERIFY</button>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 6
// ─────────────────────────────────────────────────────────────

const Scene6: React.FC<SceneProps> = () => {
    const [switches, setSwitches] = useState([0, 0, 0, 0]);
    return (
        <SceneShell title="System View." micro="Switches mapped to memory addresses.">
            <div style={{ display: 'flex', gap: 20 }}>
                {switches.map((s, i) => (
                    <motion.div key={i} onClick={() => setSwitches(prev => prev.map((v, idx) => idx===i ? 1-v : v))} style={{ width: 56, height: 100, background: s ? C.cyan : C.surface, border: `2px solid ${s ? C.cyan : C.border}`, borderRadius: 28, cursor: 'pointer', display: 'flex', alignItems: s ? 'flex-start' : 'flex-end', padding: 6 }}>
                        <div style={{ width: 36, height: 36, background: s ? '#000' : C.muted, borderRadius: '50%' }} />
                    </motion.div>
                ))}
            </div>
            <Hud>Value: {bitsToDecimal(switches)}</Hud>
        </SceneShell>
    );
};

// ─────────────────────────────────────────────────────────────
// SCENE 7
// ─────────────────────────────────────────────────────────────

const Scene7: React.FC<SceneProps & { onUnlock: () => void }> = ({ onUnlock }) => {
    const [bits, setBits] = useState([0, 0, 0, 0]);
    const target = 11;
    useEffect(() => { if(bitsToDecimal(bits) === target) onUnlock(); }, [bits, onUnlock]);
    return (
        <SceneShell title={`Build the number ${target}.`} micro="Mastery handshake protocol.">
             <div style={{ display: 'flex', gap: 16 }}>
                {bits.map((b, i) => (
                    <button key={i} onClick={() => setBits(p => p.map((v,idx)=>idx===i ? 1-v : v))} style={{ width: 84, height: 108, background: b ? C.cyan : C.surface, border: `2px solid ${b ? C.cyan : C.border}`, borderRadius: 18, fontSize: 44, fontWeight: 700, color: b ? '#000' : C.muted }}>{b}</button>
                ))}
            </div>
        </SceneShell>
    );
};

// ─────────────────────────────────────────────────────────────
// SCENE 8
// ─────────────────────────────────────────────────────────────

const Scene8: React.FC<SceneProps> = () => (
    <SceneShell title="You are ready." micro="The grammar of computation awaits.">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} style={{ width: 60, height: 60, border: `2px solid ${C.cyan}`, borderRadius: '0 30px 30px 0' }} />
    </SceneShell>
);

// ─────────────────────────────────────────────────────────────
// MAIN INTEGRATED LABORATORY
// ─────────────────────────────────────────────────────────────

export const S05_LabActivity: React.FC<{ isActive: boolean; isDarkMode: boolean }> = ({ isActive }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mode, setMode]   = useState<Mode>('simple');
  const [muted, setMuted] = useState(true);
  const [bits, setBits]   = useState<number[]>([0, 0, 0, 0]);

  const { play, resume } = useAudio(muted);
  const proMode = mode === 'pro';

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
    if (clamped !== slideIndex) { setSlideIndex(clamped); play('snap'); }
  };

  const handleBitToggle = (i: number) => {
    setBits(b => b.map((v, idx) => idx === i ? 1 - v : v));
    play('toggle');
  };

  const scenes: React.FC<SceneProps>[] = [
    (p) => <Scene1 {...p} />,
    (p) => <Scene2 {...p} />,
    (p) => <Scene3 {...p} />,
    (p) => <Scene4 {...p} bits={bits} onToggle={handleBitToggle} />,
    (p) => <Scene5 {...p} />,
    (p) => <Scene6 {...p} />,
    (p) => <Scene7 {...p} onUnlock={() => play('success')} />,
    (p) => <Scene8 {...p} />,
  ];

  const LABELS = ['Signal', 'States', 'Positions', 'Builder', 'Reading', 'System', 'Challenge', 'Final'];

  return (
    <div onClick={resume} style={{ width: '100%', height: '700px', background: C.bg, color: C.text, fontFamily: C.sans, position: 'relative', overflow: 'hidden', borderRadius: 40, border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px' }}>
        <Hud>Labs / <span style={{ color: C.cyan }}>Binary Awakening</span></Hud>
        <Hud style={{ color: C.muted }}>Step {slideIndex + 1} / {SLIDE_COUNT} · {LABELS[slideIndex]}</Hud>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setMuted(!muted)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '4px 10px', fontSize: 10, color: muted ? C.copper : C.muted }}>{muted ? 'MUTED' : 'LIVE'}</button>
          <button onClick={() => setMode(mode === 'simple' ? 'pro' : 'simple')} style={{ background: proMode ? 'rgba(0,212,255,0.1)' : 'none', border: `1px solid ${proMode ? C.cyan : C.border}`, borderRadius: 8, padding: '4px 14px', fontSize: 10, color: proMode ? C.cyan : C.muted }}>{proMode ? 'PRO' : 'SIMPLE'}</button>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: C.border, zIndex: 300 }}>
        <motion.div animate={{ width: `${((slideIndex + 1) / SLIDE_COUNT) * 100}%` }} style={{ height: '100%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />
      </div>

      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px' }}>
        {scenes[slideIndex]({ isActive, proMode, progressOffset: 0 })}
      </div>

      <button onClick={() => goTo(slideIndex-1)} disabled={slideIndex===0} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, color: C.muted, zIndex: 200, opacity: slideIndex===0?0.3:1 }}>←</button>
      <button onClick={() => goTo(slideIndex+1)} disabled={slideIndex===SLIDE_COUNT-1} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, color: C.muted, zIndex: 200, opacity: slideIndex===SLIDE_COUNT-1?0.3:1 }}>→</button>
    </div>
  );
};
