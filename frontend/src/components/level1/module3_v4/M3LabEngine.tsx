/**
 * M3LabEngine.tsx — Monolithic Engineering Lab (Full m_3 Port)
 * ─────────────────────────────────────────────────────────────
 * This is the isolation layer for the high-fidelity binary simulation.
 * It is a pixel-perfect "ditto" of the m_3 branch implementation,
 * provided as an embedded instrument for Module 3.
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
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────

interface LabProps {
  onClose: () => void;
  onUnlockBinary?: () => void;
}

type Mode = 'simple' | 'pro';

interface SceneProps {
  isActive: boolean;
  proMode: boolean;
  progressOffset: number;
}

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
const STORAGE_KEY = 'm3_lab_slide_v1';
const MUTE_KEY    = 'm3_lab_mute_v1';

// ─────────────────────────────────────────────────────────────
// AUDIO SYSTEM (PROCEDURAL)
// ─────────────────────────────────────────────────────────────

const useAudio = (muted: boolean) => {
  const ctxRef  = useRef<AudioContext | null>(null);
  const lastRef = useRef<number>(0);

  const resume = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
  }, []);

  const play = useCallback(
    (type: 'toggle' | 'success' | 'error' | 'snap') => {
      if (muted) return;
      const now = Date.now();
      if (now - lastRef.current < 200) return; 
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
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);

      cfg.freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = type === 'error' ? 'sawtooth' : 'sine';
        osc.frequency.value = f;
        osc.connect(gain);
        osc.start(t + i * 0.08);
        osc.stop(t + cfg.dur + i * 0.08);
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
// MONOLITHIC COMPONENTS
// ─────────────────────────────────────────────────────────────

const Hud: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', ...style }}>
    {children}
  </div>
);

const ProPanel: React.FC<{ visible: boolean; children: React.ReactNode }> = ({ visible, children }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        style={{
          marginTop: 24, padding: '16px 20px', borderRadius: 12, border: `1px solid ${C.border}`,
          background: 'rgba(0,212,255,0.04)', fontFamily: C.mono, fontSize: 11, color: C.muted,
          lineHeight: 1.7, maxWidth: 480, textAlign: 'left',
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const SceneShell: React.FC<{ title: string; micro: string; children: React.ReactNode; align?: 'center' | 'left' }> = ({ title, micro, children, align = 'center' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 40, textAlign: align, maxWidth: 860, width: '100%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, fontStyle: 'italic', color: C.text, letterSpacing: '-0.02em', margin: 0 }}>
        {title}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, margin: 0, lineHeight: 1.6 }}>
        {micro}
      </motion.p>
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SCENES 1-8 (DITTO FROM m_3)
// ─────────────────────────────────────────────────────────────

const Scene1: React.FC<SceneProps> = ({ proMode, progressOffset }) => {
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
        <Hud style={{ marginTop: 12, textAlign: 'center' }}>{morph < 0.3 ? 'ANALOG — CONTINUOUS' : morph < 0.7 ? 'QUANTIZING...' : 'BINARY — DISCRETE'}</Hud>
      </div>
      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Pro Mode Diagnostics</span><br />
        Threshold Vth = 2.5V | Quantization: {Math.pow(2, quantLevels)} levels<br />
        <span style={{ color: C.text }}>Physical energy mapped to abstract states.</span>
      </ProPanel>
    </SceneShell>
  );
};

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
    <SceneShell title="Reliability through limitation." micro="Fewer states → wider noise margins.">
      <div style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px 24px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140 }}>
          <polyline points={pts} fill="none" stroke={`hsl(${stability * 180}, 100%, 55%)`} strokeWidth={2} />
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
          <Hud style={{ color: stability > 0.8 ? C.cyan : C.muted }}>{stability > 0.8 ? 'STABLE' : 'UNSTABLE'}</Hud>
        </div>
        <input type="range" min={2} max={8} step={1} value={levels} onChange={e => setLevels(Number(e.target.value))} style={{ width: '100%', accentColor: C.cyan }} />
      </div>
      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Noise Margin Analysis</span><br />
        NM_H = VOH_min - VIH_min | Ideal logic levels require max separation.
      </ProPanel>
    </SceneShell>
  );
};

const Scene3: React.FC<SceneProps> = ({ proMode }) => {
  const [revealed, setRevealed] = useState(1);
  const positions = [8, 4, 2, 1];
  return (
    <SceneShell title="Positional Power." micro="Doubling the weight at each step.">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {positions.map((val, idx) => {
          const isVisible = idx < revealed;
          return (
            <motion.div key={val} onClick={() => setRevealed(v => Math.min(4, idx + 1))} whileHover={{ scale: 1.06 }} style={{ width: 110, height: 140, background: isVisible ? 'rgba(0,212,255,0.07)' : C.surface, border: `2px solid ${isVisible ? C.cyan : C.border}`, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {proMode && <Hud style={{ color: C.cyanDim }}>2^{3 - idx}</Hud>}
              <span style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 700, color: isVisible ? C.cyan : C.border }}>{val}</span>
            </motion.div>
          );
        })}
      </div>
      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Base-2 Exponentiation</span><br />
        Total = Σ bit_i * 2^i | Maximum 4-bit capacity = 15.
      </ProPanel>
    </SceneShell>
  );
};

const Scene4: React.FC<SceneProps & { bits: number[], onToggle: (i: number) => void }> = ({ proMode, bits, onToggle }) => {
  const decimal = bitsToDecimal(bits);
  const weights = [8, 4, 2, 1];
  return (
    <SceneShell title="Binary Constructor." micro="Toggle bits to compute decimal values.">
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {bits.map((b, i) => (
          <motion.button key={i} onClick={() => onToggle(i)} animate={{ backgroundColor: b ? C.cyan : C.surface, borderColor: b ? C.cyan : C.border }} style={{ width: 80, height: 100, border: '2px solid', borderRadius: 16, cursor: 'pointer', fontFamily: C.mono, fontSize: 40, fontWeight: 700, color: b ? '#000' : C.muted, outline: 'none' }}>
            {b}
          </motion.button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: C.mono, fontSize: 72, fontWeight: 700, color: C.text }}>{decimal}</div>
        <Hud>Decimal Equivalent</Hud>
      </div>
      <ProPanel visible={proMode}>
        <span style={{ color: C.cyan }}>// Memory Mapping</span><br />
        State: {bits.join('')} | Mapping binary vector to integer space.
      </ProPanel>
    </SceneShell>
  );
};

const Scene5: React.FC<SceneProps> = ({ proMode }) => {
  const [target, setTarget] = useState([1, 0, 1, 1, 0]);
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const check = () => setStatus(parseInt(guess) === bitsToDecimal(target) ? 'correct' : 'wrong');
  const gen = () => { setTarget(Array.from({ length: 5 }, () => Math.round(Math.random()))); setStatus('idle'); setGuess(''); };
  return (
    <SceneShell title="Translation Protocol." micro="Parse the bits. Sum the weights.">
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {target.map((b, i) => (
          <div key={i} style={{ width: 60, height: 74, background: b ? 'rgba(0,212,255,0.1)' : C.surface, border: `2px solid ${b ? C.cyan : C.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, fontSize: 24, fontWeight: 700, color: b ? C.cyan : C.muted }}>{b}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
        <input type="number" value={guess} onChange={e => setGuess(e.target.value)} placeholder="?" style={{ width: '100%', background: C.surface, border: `2px solid ${status === 'correct' ? C.cyan : status === 'wrong' ? C.copper : C.border}`, borderRadius: 12, padding: 16, fontFamily: C.mono, fontSize: 24, color: C.text, textAlign: 'center', outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={check} style={{ flex: 1, padding: 12, background: C.cyan, color: '#000', borderRadius: 8, fontWeight: 700 }}>VERIFY</button>
            <button onClick={gen} style={{ flex: 1, padding: 12, background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8 }}>NEXT</button>
        </div>
      </div>
    </SceneShell>
  );
};

const Scene6: React.FC<SceneProps> = ({ proMode }) => {
  const [active, setActive] = useState([0,0,0,0]);
  return (
    <SceneShell title="Switches to Data." micro="Physical inputs mapped to logical registers.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {active.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <motion.div onClick={() => setActive(prev => prev.map((v, idx) => idx===i ? 1-v : v))} style={{ width: 50, height: 80, background: s ? C.cyan : C.surface, border: `2px solid ${s ? C.cyan : C.border}`, borderRadius: 25, cursor: 'pointer', display: 'flex', alignItems: s ? 'flex-start' : 'flex-end', padding: 4 }}>
                    <div style={{ width: 42, height: 42, background: s ? '#000' : C.border, borderRadius: '50%' }} />
                </motion.div>
                <Hud>BIT {3-i}</Hud>
            </div>
          ))}
        </div>
        {proMode && <ProPanel visible={true}>Bus mapping: SW[3:0] -&gt; REG_A[3:0]</ProPanel>}
    </SceneShell>
  );
};

const Scene7: React.FC<SceneProps & { onUnlock: () => void }> = ({ onUnlock }) => {
  const [bits, setBits] = useState([0,0,0,0]);
  const target = 11;
  const current = bitsToDecimal(bits);
  useEffect(() => { if(current === target) onUnlock(); }, [current, onUnlock]);
  return (
    <SceneShell title="Mastery Handshake." micro="Build exactly 1011 (Decimal 11).">
        <div style={{ display: 'flex', gap: 12 }}>
            {bits.map((b,i) => (
                <button key={i} onClick={() => setBits(p => p.map((v,idx)=>idx===i?1-v:v))} style={{ width: 70, height: 90, background: b ? C.cyan : C.surface, border: `2px solid ${b ? C.cyan : C.border}`, borderRadius: 12, fontSize: 32, fontWeight: 700, color: b ? '#000' : C.muted }}>{b}</button>
            ))}
        </div>
        <Hud style={{ color: current === target ? C.cyan : C.muted }}>Value: {current} / {target}</Hud>
    </SceneShell>
  );
};

const Scene8: React.FC<SceneProps> = () => (
    <SceneShell title="System Ready." micro="Binary mastered. Proceed to Logic Gates.">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} style={{ width: 120, height: 120, border: `4px dashed ${C.cyan}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: C.cyan, fontSize: 12, fontWeight: 800 }}>READY</span>
        </motion.div>
    </SceneShell>
);

// ─────────────────────────────────────────────────────────────
// UI DECORATION
// ─────────────────────────────────────────────────────────────

const DotGrid: React.FC = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `radial-gradient(circle, ${C.border} 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: 0.18 }} />
);

const SlideDots: React.FC<{ total: number; current: number; onGo: (i: number) => void }> = ({ total, current, onGo }) => (
  <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 200 }}>
    {Array.from({ length: total }).map((_, i) => (
      <motion.button key={i} onClick={() => onGo(i)} animate={{ width: i === current ? 24 : 8, backgroundColor: i === current ? C.cyan : C.border, opacity: i === current ? 1 : 0.5 }} style={{ height: 8, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0, outline: 'none' }} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN LAB ENGINE
// ─────────────────────────────────────────────────────────────

export const M3LabEngine: React.FC<LabProps> = ({ onClose, onUnlockBinary }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mode, setMode]   = useState<Mode>('simple');
  const [muted, setMuted] = useState(false);
  const [bits, setBits]   = useState<number[]>([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);

  const { play, resume } = useAudio(muted);
  const proMode = mode === 'pro';

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
    if (clamped !== slideIndex) { setSlideIndex(clamped); play('snap'); }
  };

  const handleBitToggle = (i: number) => {
    setBits(prev => prev.map((v, idx) => idx === i ? 1 - v : v));
    play('toggle');
  };

  const scenes: React.FC<SceneProps>[] = [
    (p) => <Scene1 {...p} />,
    (p) => <Scene2 {...p} />,
    (p) => <Scene3 {...p} />,
    (p) => <Scene4 {...p} bits={bits} onToggle={handleBitToggle} />,
    (p) => <Scene5 {...p} />,
    (p) => <Scene6 {...p} />,
    (p) => <Scene7 {...p} onUnlock={() => { if(!unlocked) { setUnlocked(true); play('success'); onUnlockBinary?.(); } }} />,
    (p) => <Scene8 {...p} />,
  ];

  const LABELS = ['Signal', 'States', 'Positions', 'Builder', 'Reading', 'System', 'Mastery', 'Final'];

  return (
    <div onClick={resume} style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: C.bg, color: C.text, fontFamily: C.sans, position: 'relative' }}>
        <DotGrid />

        {/* HUD */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px' }}>
            <Hud>
                <button onClick={onClose} style={{ color: C.copper, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.mono, marginRight: 20 }}>[ EXIT LABS ]</button>
                Core_Console / <span style={{ color: C.cyan }}>Binary_Awakening</span>
            </Hud>

            <Hud style={{ color: C.muted }}>Scene {slideIndex+1} / {SLIDE_COUNT} · {LABELS[slideIndex]}</Hud>

            <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setMuted(!muted)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: C.mono, fontSize: 10, color: muted ? C.copper : C.muted }}>{muted ? 'MUTED' : 'UNMUTED'}</button>
                <button onClick={() => setMode(mode === 'simple' ? 'pro' : 'simple')} style={{ background: proMode ? 'rgba(0,212,255,0.1)' : 'none', border: `1px solid ${proMode ? C.cyan : C.border}`, borderRadius: 8, padding: '4px 14px', cursor: 'pointer', fontFamily: C.mono, fontSize: 10, color: proMode ? C.cyan : C.muted }}>{proMode ? 'PRO' : 'SIMPLE'}</button>
            </div>
        </div>

        {/* PROGRESS */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: C.border, zIndex: 300 }}>
            <motion.div animate={{ width: `${((slideIndex + 1) / SLIDE_COUNT) * 100}%` }} style={{ height: '100%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />
        </div>

        {/* TRACK */}
        <motion.div
            drag="x" 
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.05}
            onDragEnd={(_, info) => { 
                if (info.offset.x < -60) goTo(slideIndex + 1); 
                else if (info.offset.x > 60) goTo(slideIndex - 1); 
            }}
            animate={{ x: `-${slideIndex * 100}vw` }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            style={{ 
                display: 'flex', 
                width: `${SLIDE_COUNT * 100}vw`, 
                height: '100vh', 
                cursor: 'grab',
                position: 'relative',
                zIndex: 10
            }}
        >
            {scenes.map((SceneComp, i) => (
                <div key={i} style={{ width: '100vw', height: '100vh', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px' }}>
                    <SceneComp isActive={i === slideIndex} proMode={proMode} progressOffset={i - slideIndex} />
                </div>
            ))}
        </motion.div>

        {/* ARROWS */}
        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,212,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo(slideIndex - 1)} 
            disabled={slideIndex === 0} 
            style={{ 
                position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 12, 
                padding: '16px 20px', color: C.cyan, zIndex: 500, opacity: slideIndex === 0 ? 0.1 : 1,
                cursor: slideIndex === 0 ? 'default' : 'pointer'
            }}
        >
            ←
        </motion.button>
        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,212,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo(slideIndex + 1)} 
            disabled={slideIndex === SLIDE_COUNT - 1} 
            style={{ 
                position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 12, 
                padding: '16px 20px', color: C.cyan, zIndex: 500, opacity: slideIndex === SLIDE_COUNT - 1 ? 0.1 : 1,
                cursor: slideIndex === SLIDE_COUNT - 1 ? 'default' : 'pointer'
            }}
        >
            →
        </motion.button>

        <SlideDots total={SLIDE_COUNT} current={slideIndex} onGo={goTo} />
    </div>
  );
};
