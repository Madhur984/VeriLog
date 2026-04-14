import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
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

interface Module3RootProps {
  onUnlockBinary?: () => void;
  onClose?: () => void;
}

type Mode = 'simple' | 'pro';

interface SceneProps {
  isActive: boolean;
  proMode: boolean;
  progressOffset: number; // -1 -> 0 -> 1 (0 = centred)
}

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
// DECIMAL <> BITS HELPERS
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
      <Hud style={{ color: C.cyan, opacity: 0.8 }}>{micro}</Hud>
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.03em',
          color: C.text,
        }}
      >
        {title}
      </h1>
    </div>

    <div style={{ width: '100%', display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SCENE 1 — Signal to Value
// ─────────────────────────────────────────────────────────────

const Scene1: React.FC<SceneProps> = ({ proMode }) => {
  const [levels, setLevels] = useState(8);

  const W = 480; const H = 140;
  const pts = Array.from({ length: W }, (_, x) => {
    const freq = 0.015;
    const amp  = (H - 40) / 2;
    const raw  = Math.sin(x * freq) * amp + H/2;
    // Quantize
    const stepSize = H / (levels - 1);
    const quantized = Math.round((raw - 20) / stepSize) * stepSize + 20;
    return { x, raw, q: quantized };
  });

  return (
    <SceneShell
      title="Computation begins with resolution."
      micro="Continuous -> Discrete"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: W, height: H }}>
          <svg width={W} height={H} style={{ overflow: 'visible' }}>
            <path
              d={`M ${pts.map(p => `${p.x},${p.raw}`).join(' L ')}`}
              fill="none"
              stroke={C.border}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <path
              d={`M ${pts.map(p => `${p.x},${p.q}`).join(' L ')}`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={2}
            />
          </svg>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {[2, 4, 8, 16].map(n => (
            <button
              key={n}
              onClick={() => setLevels(n)}
              style={{
                background: levels === n ? C.cyan : 'none',
                border: `1px solid ${levels === n ? C.cyan : C.border}`,
                color: levels === n ? C.bg : C.muted,
                padding: '6px 14px',
                borderRadius: 8,
                fontFamily: C.mono,
                fontSize: 10,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {n} LEVELS
            </button>
          ))}
        </div>

        <ProPanel visible={proMode}>
          <span style={{ color: C.cyan }}>// AD_CONVERSION_LOGIC</span>
          <br />
          Higher resolution (more levels) means more precision but higher cost.
          Binary simplifies this to the absolute minimum: <span style={{ color: C.text }}>2 Levels</span>.
        </ProPanel>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 2 — Why Only Two States
// ─────────────────────────────────────────────────────────────

const Scene2: React.FC<SceneProps> = ({ proMode }) => {
  const [noise, setNoise] = useState(0.2);

  return (
    <SceneShell
      title="Binary is chosen for reliability."
      micro="Voltage Margins"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%' }}>
        <div style={{
          width: 480,
          height: 180,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          position: 'relative',
          background: C.surface,
          overflow: 'hidden'
        }}>
          {/* Voltage Zones */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'rgba(0,212,255,0.05)', borderTop: `1px solid ${C.cyanDim}` }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'rgba(0,212,255,0.05)', borderBottom: `1px solid ${C.cyanDim}` }} />

          <Hud style={{ position: 'absolute', top: 15, left: 15 }}>LOGIC_HIGH (1)</Hud>
          <Hud style={{ position: 'absolute', bottom: 15, left: 15 }}>LOGIC_LOW (0)</Hud>

          {/* Signal with Noise */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
             <motion.path
               animate={{ d: `M 0,${90 + (Math.random()-0.5)*noise*200} L 480,${90 + (Math.random()-0.5)*noise*200}` }}
               stroke={C.cyan}
               strokeWidth={2}
               fill="none"
             />
          </svg>
        </div>

        <input
          type="range"
          min="0" max="1" step="0.01"
          value={noise}
          onChange={(e) => setNoise(parseFloat(e.target.value))}
          style={{ width: 200, accentColor: C.cyan }}
        />
        <Hud>Interference Level: {Math.round(noise * 100)}%</Hud>

        <ProPanel visible={proMode}>
          With only two states, the "gap" between 0 and 1 is huge.
          Hardware can tolerate massive electrical noise and still tell the difference.
        </ProPanel>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 3 — Positions
// ─────────────────────────────────────────────────────────────

const Scene3: React.FC<SceneProps> = () => (
  <SceneShell title="Value is defined by position." micro="Positional Notation">
    <div style={{ display: 'flex', gap: 20 }}>
      {[8, 4, 2, 1].map((weight, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{
            width: 80,
            height: 100,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontFamily: C.mono,
            color: C.cyan,
            marginBottom: 12,
            background: C.surface,
          }}>
            ?
          </div>
          <Hud>2^{3-i}</Hud>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginTop: 4 }}>{weight}</div>
        </div>
      ))}
    </div>
  </SceneShell>
);

// ─────────────────────────────────────────────────────────────
// SCENE 4 — Binary Builder
// ─────────────────────────────────────────────────────────────

interface BuilderProps extends SceneProps {
  bits: number[];
  onToggle: (i: number) => void;
}

const Scene4: React.FC<BuilderProps> = ({ bits, onToggle, proMode }) => {
  const sum = bitsToDecimal(bits);
  return (
    <SceneShell title="Constructing values from bits." micro="4-bit Register">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {bits.map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <motion.button
                onClick={() => onToggle(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 80,
                  height: 120,
                  background: b ? C.cyan : 'none',
                  border: `2px solid ${b ? C.cyan : C.border}`,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontFamily: C.mono,
                  fontWeight: 800,
                  color: b ? C.bg : C.muted,
                  cursor: 'pointer',
                  boxShadow: b ? `0 0 30px ${C.cyan}44` : 'none',
                  transition: 'background 0.2s, color 0.2s, border 0.2s',
                }}
              >
                {b}
              </motion.button>
              <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 12, color: C.muted }}>
                {Math.pow(2, 3 - i)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 48, fontWeight: 800, color: C.text }}>
           {sum} <span style={{ fontSize: 18, color: C.muted, fontWeight: 400 }}>decimal</span>
        </div>

        <ProPanel visible={proMode}>
           Total possible states: 2^4 = 16 (0 to 15).
           Each bit represents an exponent of 2.
        </ProPanel>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 5 — Reading
// ─────────────────────────────────────────────────────────────

const Scene5: React.FC<SceneProps> = ({ proMode }) => {
  const [revealed, setRevealed] = useState(1);

  return (
    <SceneShell title="The flow of carrying logic." micro="Ripple System">
       <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16 }}>
             {[8,4,2,1].map((n, i) => {
               const active = revealed > i;
               return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <motion.div
                     animate={{
                       borderColor: active ? C.cyan : C.border,
                       background: active ? 'rgba(0,212,255,0.05)' : 'rgba(0,0,0,0)'
                     }}
                     style={{
                       width: 60, height: 60, border: '1px solid', borderRadius: 8,
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontFamily: C.mono, color: active ? C.text : C.muted
                     }}
                   >
                     {active ? 1 : 0}
                   </motion.div>
                   <Hud style={{ marginTop: 8 }}>{n}</Hud>
                 </div>
               );
             })}
          </div>
          <button
            onClick={() => setRevealed(r => r === 4 ? 1 : r + 1)}
            style={{
              background: C.surface, border: `1px solid ${C.border}`,
              color: C.cyan, padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
              fontFamily: C.mono, fontSize: 11
            }}
          >
            PULSE NEXT BIT
          </button>

          <ProPanel visible={proMode}>
             In hardware, flipping a bit creates a ripple.
             When a bit goes from 1 to 0, it sends a 'carry' pulse to the left.
          </ProPanel>
       </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 6 — System View
// ─────────────────────────────────────────────────────────────

const Scene6: React.FC<SceneProps> = () => (
  <SceneShell title="From silicon to software." micro="Architecture View">
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      width: '100%',
      maxWidth: 600
    }}>
      {[
        { t: 'Voltage', d: 'Physical Reality' },
        { t: 'Bit', d: 'Logical Unit' },
        { t: 'Byte', d: 'Data Packet' },
        { t: 'Register', d: 'Working Memory' },
        { t: 'ALU', d: 'Math Engine' },
        { t: 'Instruction', d: 'Code' },
      ].map((item, i) => (
        <div key={i} style={{
          padding: 20,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12
        }}>
          <div style={{ color: C.cyan, fontWeight: 700, marginBottom: 4 }}>{item.t}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{item.d}</div>
        </div>
      ))}
    </div>
  </SceneShell>
);

// ─────────────────────────────────────────────────────────────
// SCENE 7 — Challenge (Unlock)
// ─────────────────────────────────────────────────────────────

const TARGETS = [5, 9, 12, 14, 7];

const Scene7: React.FC<SceneProps & { onUnlock: () => void }> = ({ onUnlock, proMode }) => {
  const [target] = useState(() => TARGETS[Math.floor(Math.random() * TARGETS.length)]);
  const [guess, setGuess]   = useState([0, 0, 0, 0]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const toggle = (i: number) => {
    const next = [...guess];
    next[i] = 1 - next[i];
    setGuess(next);
    setStatus('idle');
  };

  const check = () => {
    const ok = bitsToDecimal(guess) === target;
    if (ok) {
      setStatus('correct');
      onUnlock();
    } else {
      setStatus('wrong');
    }
  };

  return (
    <SceneShell title="Access the logic core." micro="Security Handshake">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Hud>Target:</Hud>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontFamily: C.mono, color: C.text, fontSize: 18 }}>{target}</span>
          </div>
          <Hud style={{ color: C.text }}>decimal</Hud>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {guess.map((b, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                width: 60, height: 80, background: b ? C.cyan : 'none',
                border: `1px solid ${b ? C.cyan : C.border}`,
                borderRadius: 8, cursor: 'pointer', fontSize: 24,
                fontFamily: C.mono, color: b ? C.bg : C.muted
              }}
            >
              {b}
            </button>
          ))}
        </div>

        <button
          onClick={check}
          style={{
            background: status === 'correct' ? C.cyan : 'none',
            border: `1px solid ${status === 'wrong' ? C.copper : C.cyan}`,
            color: status === 'correct' ? C.bg : (status === 'wrong' ? C.copper : C.cyan),
            padding: '12px 32px', borderRadius: 12, cursor: 'pointer',
            fontFamily: C.mono, fontWeight: 700, letterSpacing: '0.1em'
          }}
        >
          {status === 'correct' ? 'ACCESS GRANTED' : 'SUBMIT SEQUENCE'}
        </button>

        <ProPanel visible={proMode}>
          The bitstream is the raw material of every program ever written.
          Master the stream, master the machine.
        </ProPanel>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────
// SCENE 8 — Bridge to Module 4
// ─────────────────────────────────────────────────────────────

const Scene8: React.FC<SceneProps> = ({ proMode }) => (
  <SceneShell
    title="You can represent numbers."
    micro="Now — how are they used?"
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

// ─────────────────────────────────────────────────────────────
// DOT GRID BACKGROUND
// ─────────────────────────────────────────────────────────────

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

const SlideDots: React.FC<{ total: number; current: number; onGo: (i: number) => void }> = ({
  total,
  current,
  onGo,
}) => (
  <div
    style={{
      position: 'fixed',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 12,
      zIndex: 200,
    }}
  >
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onGo(i)}
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          border: 'none',
          background: i === current ? C.cyan : C.border,
          cursor: 'pointer',
          padding: 0,
          boxShadow: i === current ? `0 0 10px ${C.cyan}` : 'none',
          transition: 'all 0.3s',
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export const M3Activities: React.FC<Module3RootProps> = ({ onUnlockBinary, onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [proMode, setMode]   = useState<Mode>('simple');
  const [muted, setMuted] = useState(false);
  const { play, resume } = useAudio(muted);
  const [bits, setBits]   = useState<number[]>([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState(false);

  // Persistence
  useEffect(() => {
    const savedSlide = localStorage.getItem(STORAGE_KEY);
    if (savedSlide) setSlideIndex(Number(savedSlide));
    const savedMute = localStorage.getItem(MUTE_KEY) === 'true';
    setMuted(savedMute);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(slideIndex));
  }, [slideIndex]);

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
      if (e.key === 'Escape')     onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

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

  // Bit toggle
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

  // Scenes
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
    'Signal → Value',
    'Two States',
    'Positions',
    'Builder',
    'Reading',
    'System View',
    'Challenge',
    'Next →',
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

      {/* TOP HUD */}
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
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              color: C.muted,
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: C.mono,
              fontSize: 10,
              letterSpacing: '0.1em',
            }}
          >
            ← EXIT LAB
          </button>
          <Hud>
            Lab /&nbsp;
            <span style={{ color: C.cyan }}>{LABELS[slideIndex]}</span>
          </Hud>
        </div>

        <Hud style={{ color: C.muted }}>
          {slideIndex + 1} / {SLIDE_COUNT}
        </Hud>

        <div style={{ display: 'flex', gap: 12 }}>
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
            }}
          >
            {muted ? 'MUTED' : 'SOUND ON'}
          </button>
          <button
            onClick={() => setMode(m => m === 'simple' ? 'pro' : 'simple')}
            style={{
              background: proMode === 'pro' ? 'rgba(0,212,255,0.1)' : 'none',
              border: `1px solid ${proMode === 'pro' ? C.cyan : C.border}`,
              borderRadius: 8,
              padding: '4px 14px',
              cursor: 'pointer',
              fontFamily: C.mono,
              fontSize: 10,
              color: proMode === 'pro' ? C.cyan : C.muted,
            }}
          >
            {proMode === 'pro' ? 'PRO' : 'SIMPLE'}
          </button>
        </div>
      </div>

      {/* Slide Track */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        animate={{ x: `-${slideIndex * 100}vw` }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        style={{
          display: 'flex',
          width: `${SLIDE_COUNT * 100}vw`,
          height: '100vh',
        }}
      >
        {scenes.map((SceneComponent, i) => (
          <div
            key={i}
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 40px',
            }}
          >
            <SceneComponent
              isActive={i === slideIndex}
              proMode={proMode === 'pro'}
              progressOffset={i - slideIndex}
            />
          </div>
        ))}
      </motion.div>

      <SlideDots total={SLIDE_COUNT} current={slideIndex} onGo={goTo} />
    </div>
  );
};
