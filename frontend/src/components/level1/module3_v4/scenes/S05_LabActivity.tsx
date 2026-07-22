/**
 * S05_LabActivity.tsx -- Binary Awakening (Polished & Smooth)
 * 
 * Heavily upgraded: smooth animations, particle effects, keyboard controls,
 * glowing responsive UI, and Pro-mode engineering insights.
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
} from 'framer-motion';
import { TryItYourself } from '../../../ui/TryItYourself';

// 
// TYPES
// 

interface SceneProps {
  isActive: boolean;
  proMode: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  onAdvance?: () => void;
}

type Mode = 'simple' | 'pro';

// 
// CONSTANTS
// 

const C = {
  bg:        '#050505',
  surface:   '#0C0D12',
  surfaceTop:'#1A1C23',
  border:    '#252835',
  borderLite:'#3A3F58',
  cyan:      '#0EA5E9',
  cyanDim:   '#0284C7',
  cyanGlow:  'rgba(14, 165, 233, 0.4)',
  copper:    '#F97316',
  text:      '#F1F5F9',
  muted:     '#64748B',
  mono:      '"IBM Plex Mono", "Courier New", monospace',
  sans:      '"Inter", system-ui, sans-serif',
} as const;

const SLIDE_COUNT = 8;

// 
// WEB AUDIO HOOK (Polished smooth synths)
// 

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
      if (now - lastRef.current < 80) return; // tight cooldown
      lastRef.current = now;
      resume();
      const ctx = ctxRef.current!;
      const t   = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const configs: Record<string, { freqs: number[]; dur: number; type: OscillatorType }> = {
        toggle:  { freqs: [880],           dur: 0.1,  type: 'sine' },
        snap:    { freqs: [650, 1300],     dur: 0.1,  type: 'sine' },
        success: { freqs: [523.25, 659.25, 1046.5], dur: 0.4, type: 'triangle' },
        error:   { freqs: [220, 233.08],   dur: 0.25, type: 'sawtooth' },
      };
      
      const cfg = configs[type];
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);

      cfg.freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = cfg.type;
        osc.frequency.setValueAtTime(f, t);
        if (type === 'error') {
            osc.frequency.exponentialRampToValueAtTime(f * 0.8, t + cfg.dur);
        } else if (type === 'success') {
            osc.frequency.exponentialRampToValueAtTime(f * 1.05, t + cfg.dur);
        }
        
        osc.connect(gain);
        osc.start(t + i * 0.05);
        osc.stop(t + cfg.dur + i * 0.05);
      });
    },
    [muted, resume]
  );

  return { play, resume };
};

// 
// HELPERS
// 

const bitsToDecimal = (bits: number[]) =>
  bits.reduce((acc, b, i) => acc + b * Math.pow(2, bits.length - 1 - i), 0);

// 
// SHARED COMPONENTS
// 

const Hud: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: boolean }> = ({
  children,
  style,
  glow
}) => (
  <div
    style={{
      fontFamily: C.mono,
      fontSize: 11,
      color: glow ? C.cyan : C.muted,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      textShadow: glow ? `0 0 10px ${C.cyanGlow}` : 'none',
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
        initial={{ opacity: 0, height: 0, y: 10 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden', width: '100%', maxWidth: 600, margin: '0 auto' }}
      >
        <div
          style={{
            marginTop: 32,
            padding: '20px 24px',
            borderRadius: 16,
            border: `1px solid ${C.borderLite}`,
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0.02) 100%)',
            fontFamily: C.mono,
            fontSize: 12,
            color: '#94A3B8',
            lineHeight: 1.8,
            textAlign: 'left',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background: C.cyan, boxShadow:`0 0 8px ${C.cyan}` }} />
            <span style={{ color: C.text, fontWeight: 700, letterSpacing: '0.1em' }}>ENGINEERING INSIGHT</span>
          </div>
          {children}
        </div>
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
      maxWidth: 900,
      width: '100%',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: align === 'center' ? 'center' : 'flex-start' }}>
      <motion.h2
        key={title}
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          fontFamily: C.sans,
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 900,
          fontStyle: 'italic',
          color: C.text,
          letterSpacing: '-0.02em',
          margin: 0,
          background: `linear-gradient(to right, #FFF, ${C.muted})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </motion.h2>
      <motion.p
        key={micro}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontFamily: C.mono,
          fontSize: 14,
          color: C.cyanDim,
          margin: 0,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {micro}
      </motion.p>
    </div>
    {children}
  </div>
);

// 
// SCENE 1 : Analog to Digital Automaton
// 

const Scene1: React.FC<SceneProps> = ({ proMode }) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let frame: number;
    const update = () => { setTime(curr => curr + 0.015); frame = requestAnimationFrame(update); };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Compute oscillating morph value between 0 and 1
  const morph = (Math.sin(time) + 1) / 2; 
  const quantLevels = Math.max(1, Math.round(morph * 6) + 1);
  const W = 600; const H = 160;
  
  const pts = Array.from({ length: W }, (_, x) => {
    const raw = Math.sin((x / W) * Math.PI * 4 + time * 2) * 0.4 + 0.5;
    const q   = Math.floor(raw * quantLevels) / quantLevels;
    const blended = morph > 0.8 ? q : raw * morph + raw * (1 - morph);
    const y   = H / 2 - blended * H * 0.8;
    return `${x},${y}`;
  }).join(' ');

  const colour = morph > 0.8 ? C.cyan : `hsl(${30 + morph * 168}, 100%, 60%)`;
  const isBinary = morph > 0.8;

  return (
    <SceneShell title="Continuum Collapse" micro="Signal compression into absolute states.">
      <div style={{ width: '100%', background: `linear-gradient(180deg, ${C.surfaceTop} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 24, padding: '40px 32px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 160 }}>
          {proMode && (
            <g opacity={0.2}>
              {Array.from({length: quantLevels}).map((_, i) => (
                 <line key={i} x1={0} x2={W} y1={H/2 - (i/quantLevels)*H*0.8} y2={H/2 - (i/quantLevels)*H*0.8} stroke={C.cyan} strokeDasharray="4 4" />
              ))}
            </g>
          )}
          <motion.polyline points={pts} fill="none" stroke={colour} strokeWidth={3} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${colour})` }} />
        </svg>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Hud glow={!isBinary}>ANALOG WAVE</Hud>
            <div style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${isBinary ? C.cyan : C.border}`, color: isBinary ? C.cyan : C.muted, fontFamily: C.mono, fontSize: 12, transition: 'all 0.3s' }}>
                States: {quantLevels}
            </div>
            <Hud glow={isBinary}>DISCRETE SIGNAL</Hud>
        </div>
      </div>
      <ProPanel visible={proMode}>
        In the physical world, voltage is an analog continuum. A wire doesn't natively carry a "1" or "0", it carries 3.3V or 0.1V. We mathematically force this continuous wave into discrete buckets (quantization) to eliminate ambiguity. As states reduce to exactly 2, we achieve perfect statistical noise immunity.
      </ProPanel>
    </SceneShell>
  );
};

// 
// SCENE 2 : Noise Margin Exploration
// 

const Scene2: React.FC<SceneProps> = ({ proMode }) => {
  const [levels, setLevels] = useState(8);
  const W = 600; const H = 160;
  
  const stability = 1 - (levels - 2) / 6; // 2 levels = 1.0 stability, 8 levels = 0.0

  const pts = Array.from({ length: W }, (_, x) => {
    const raw  = Math.sin((x / W) * Math.PI * 6) * 0.4 + 0.5;
    // Inject noise based on stability inversely
    const noise = (Math.random() - 0.5) * (1 - stability) * 0.1;
    const noisyRaw = Math.max(0, Math.min(1, raw + noise));
    const q    = Math.floor(noisyRaw * levels) / levels;
    const y    = H / 2 - q * H * 0.8;
    return `${x},${y}`;
  }).join(' ');

  const color = `hsl(${stability * 190 + 10}, 100%, 55%)`;

  return (
    <SceneShell title="The Noise Threshold." micro="Slide to reduce voltage states.">
      <div style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: '32px 24px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 160 }}>
          <polyline points={pts} fill="none" stroke={color} strokeWidth={2} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          {proMode && (
            <g opacity={0.3}>
                <rect x={0} y={H*0.1} width={W} height={H*0.3} fill="rgba(255, 95, 31, 0.1)" />
                <rect x={0} y={H*0.6} width={W} height={H*0.3} fill="rgba(0, 212, 255, 0.1)" />
                <text x={10} y={H*0.25} fill={C.copper} fontSize={10} fontFamily={C.mono}>HIGH MARGIN</text>
                <text x={10} y={H*0.75} fill={C.cyan} fontSize={10} fontFamily={C.mono}>LOW MARGIN</text>
            </g>
          )}
        </svg>
      </div>
      <div style={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Hud>Resolving States: {levels}</Hud>
          <Hud style={{ color: stability > 0.8 ? C.cyan : C.copper }}>{stability > 0.8 ? 'OPTIMAL PROTOCOL' : 'CORRUPTED INTEGRITY'}</Hud>
        </div>
        <input 
            type="range" min={2} max={8} step={1} value={levels} 
            onChange={e => setLevels(Number(e.target.value))} 
            style={{ width: '100%', accentColor: C.cyan, cursor: 'grab' }} 
        />
      </div>
      <ProPanel visible={proMode}>
        Why not Base-10? If a wire operated between 0V and 5V, Base-10 logic requires distinguishing 0.5V increments. A slight electromagnetic interference (noise) could easily flip a 3 into a 4. Base-2 (Binary) splits the range into two massive thresholds. Anything above 2.5V is a 1. Anything below is a 0. Supreme fault tolerance.
      </ProPanel>
    </SceneShell>
  );
};

// 
// SCENE 3 : Positional Weight Discovery
// 

const Scene3: React.FC<SceneProps> = ({ proMode, onSuccess }) => {
  const [revealed, setRevealed] = useState(1);
  const positions = [8, 4, 2, 1];
  
  const handleClick = (idx: number) => {
      const next = Math.min(4, revealed === idx + 1 ? revealed + 1 : idx + 1);
      setRevealed(next);
      if (onSuccess && next === 4) onSuccess();
  };

  return (
    <SceneShell title="Positional Escalation." micro="Tap leftwards to unlock higher bases.">
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {positions.map((val, idx) => {
          const isVisible = idx < revealed;
          return (
            <motion.div 
                key={val} 
                onClick={() => handleClick(idx)} 
                whileHover={{ scale: isVisible ? 1.05 : 1.1, translateY: -5 }} 
                whileTap={{ scale: 0.95 }}
                animate={{
                    borderColor: isVisible ? C.cyan : C.border,
                    backgroundColor: isVisible ? 'rgba(14, 165, 233, 0.05)' : C.surfaceTop,
                    boxShadow: isVisible ? `0 10px 30px ${C.cyanGlow}` : '0 4px 10px rgba(0,0,0,0.5)'
                }}
                transition={{ duration: 0.3 }}
                style={{ 
                    width: 120, height: 160, borderRadius: 24, border: '2px solid', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                    gap: 12, cursor: 'pointer', position: 'relative', overflow: 'hidden'
                }}
            >
              {isVisible && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: C.cyan, filter: 'blur(40px)', opacity: 0.3, borderRadius: '50%' }}
                  />
              )}  
              {proMode && <Hud style={{ color: C.cyanDim, zIndex: 10 }}>2^{3 - idx}</Hud>}
              <span style={{ fontFamily: C.mono, fontSize: 48, fontWeight: 900, color: isVisible ? C.cyan : C.borderLite, zIndex: 10 }}>
                  {isVisible ? val : '?'}
              </span>
            </motion.div>
          );
        })}
      </div>
      <ProPanel visible={proMode}>
        In decimal, you parse columns as 1s, 10s, 100s ($10^n$). Binary works exactly the same, but the multiplier is simply 2 ($2^n$). Therefore, columns from right to left are worth 1, 2, 4, 8, 16... Every shift left doubles the capacity of that single wire.
      </ProPanel>
    </SceneShell>
  );
};

// 
// SCENE 4 : The Bit Builder
// 

const BitBlock: React.FC<{ value: number; weight: number; proMode: boolean; onToggle: () => void }> = ({ value, weight, proMode, onToggle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <Hud style={{ color: value ? C.cyan : C.muted }}>Weight: {weight}</Hud>
    <motion.button 
        onClick={onToggle} 
        animate={{ 
            backgroundColor: value ? C.cyan : C.surfaceTop, 
            borderColor: value ? '#fff' : C.borderLite, 
            color: value ? '#000' : C.muted,
            y: value ? -4 : 0,
            boxShadow: value ? `0 12px 24px ${C.cyanGlow}` : '0 4px 8px rgba(0,0,0,0.3)'
        }} 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ 
            width: 88, height: 110, border: '2px solid', borderRadius: 20, 
            cursor: 'pointer', fontFamily: C.mono, fontSize: 44, fontWeight: 900, outline: 'none' 
        }}
    >
      {value}
    </motion.button>
    {proMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: value ? 1 : 0.3 }} style={{ fontSize: 11, fontFamily: C.mono, color: value ? C.text: C.muted}}>
            {value ? `+${weight}` : '+0'}
        </motion.div>
    )}
  </div>
);

const Scene4: React.FC<SceneProps & { bits: number[], onToggle: (i: number) => void }> = ({ proMode, bits, onToggle }) => {
  const decimal = bitsToDecimal(bits);
  const weights = [8, 4, 2, 1];
  return (
    <SceneShell title="Building." micro="Trigger bits. Watch the decimal accumulation.">
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        {bits.map((b, i) => (
          <BitBlock key={i} value={b} weight={weights[i]} proMode={proMode} onToggle={() => onToggle(i)} />
        ))}
      </div>
      <div style={{ textAlign: 'center', background: C.surface, padding: '24px 64px', borderRadius: 24, border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: C.mono, fontSize: 80, fontWeight: 900, color: C.text, textShadow: `0 0 20px rgba(255,255,255,0.1)` }}>
            {decimal}
        </div>
        <Hud>Decimal Output</Hud>
      </div>
      <ProPanel visible={proMode}>
        Notice the cascading math. 8 + 4 + 2 + 1 = 15. With 4 bits (a nibble), you can represent exactly 16 distinct states (0 through 15). Adding a 5th bit (position 16) instantly doubles your total vocabulary to 32 states.
      </ProPanel>
    </SceneShell>
  );
};

// 
// SCENE 5 : Read Protocol
// 

const Scene5: React.FC<SceneProps & { onSuccess: () => void, onError: () => void }> = ({ proMode, onSuccess, onError }) => {
  const [target, setTarget] = useState<number[]>([1, 0, 1, 1]); // 8+2+1 = 11
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const actual = bitsToDecimal(target);

  const check = () => {
      if (parseInt(guess) === actual) {
          setStatus('correct');
          onSuccess();
          // Generate new challenge after delay
          setTimeout(() => {
              setStatus('idle');
              setGuess('');
              setTarget(Array.from({length:4}, () => Math.random() > 0.5 ? 1 : 0));
          }, 2000);
      } else {
          setStatus('wrong');
          onError();
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') check();
  };

  return (
    <SceneShell title="Decryption Matrix." micro="Translate the binary payload.">
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {target.map((b, i) => (
          <motion.div 
            key={i} 
            animate={{
                borderColor: b ? C.cyan : C.border,
                color: b ? C.cyan : C.borderLite,
                boxShadow: b ? `inset 0 0 20px ${C.cyanGlow}` : 'none'
            }}
            style={{ width: 72, height: 90, background: C.surfaceTop, border: `2px solid`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, fontSize: 36, fontWeight: 900 }}
           >
            {b}
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 340 }}>
        <input 
            value={guess} 
            onChange={e => setGuess(e.target.value)} 
            onKeyDown={handleKeyDown}
            type="number" 
            placeholder="Decimal?"
            autoFocus
            style={{ 
                width: '100%', background: C.surfaceTop, border: `2px solid ${status === 'wrong' ? '#EF4444' : status === 'correct' ? '#10B981' : C.borderLite}`, 
                borderRadius: 16, padding: '20px', fontFamily: C.mono, fontSize: 32, color: C.text, textAlign: 'center',
                outline: 'none', transition: 'all 0.3s', boxShadow: status === 'correct' ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
            }} 
        />
        <motion.button 
            onClick={check} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
                width: '100%', padding: '18px', background: status === 'correct' ? '#10B981' : C.cyan, 
                color: '#000', borderRadius: 16, fontWeight: 900, fontFamily: C.sans, letterSpacing: '0.1em', cursor: 'pointer', border: 'none' 
            }}
        >
            {status === 'correct' ? 'DECRYPTED' : 'SUBMIT PING'}
        </motion.button>
      </div>
      <ProPanel visible={proMode}>
        Reading binary quickly is a matter of muscle memory. Memorize the powers of 2 (1, 2, 4, 8, 16...). When reading 1011, your brain should immediately isolate the 1s: 8 + 2 + 1 = 11. Over time, byte shapes become instantly recognizable signatures, much like reading standard numeric digits.
      </ProPanel>
    </SceneShell>
  );
};

// 
// SCENE 6 : Physical Address Map
// 

const Scene6: React.FC<SceneProps & { onAdvance: () => void }> = ({ onAdvance }) => {
    const [switches, setSwitches] = useState([0, 0, 0]);
    // 0 = right, 1 = left (visually flipped for switches)
    
    return (
        <SceneShell title="Memory Routing." micro="Toggle the DIP switches to route the signal.">
            <div style={{ display: 'flex', gap: 32, background: C.surfaceTop, padding: '40px 60px', borderRadius: 24, border: `1px solid ${C.border}` }}>
                {switches.map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                        <Hud>{4 >> i}</Hud>
                        <motion.div 
                            onClick={() => setSwitches(prev => prev.map((v, idx) => idx===i ? 1-v : v))} 
                            style={{ 
                                width: 64, height: 120, background: s ? C.cyan : '#1E293B', 
                                border: `2px solid ${s ? '#fff' : '#0F172A'}`, borderRadius: 32, cursor: 'pointer', 
                                display: 'flex', alignItems: s ? 'flex-start' : 'flex-end', padding: 8,
                                boxShadow: s ? `0 10px 30px ${C.cyanGlow}` : 'inset 0 10px 20px rgba(0,0,0,0.5)'
                            }}
                        >
                            <motion.div layout style={{ width: 44, height: 44, background: s ? '#000' : C.muted, borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                        </motion.div>
                         <Hud style={{ color: s ? C.cyan : C.borderLite, fontSize: 16, fontWeight: 900 }}>{s}</Hud>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Hud>Addressed Sector:</Hud>
                <div style={{ padding: '8px 24px', background: C.cyan, color: '#000', fontFamily: C.mono, fontSize: 24, fontWeight: 900, borderRadius: 12 }}>
                    0x0{bitsToDecimal(switches)}
                </div>
            </div>
        </SceneShell>
    );
};

// 
// SCENE 7 : Mastery Challenge
// 

const Scene7: React.FC<SceneProps & { onSuccess: () => void, onAdvance: () => void }> = ({ onSuccess, onAdvance }) => {
    const [bits, setBits] = useState([0, 0, 0, 0, 0]);
    const target = 21; // 16 + 4 + 1
    const current = bitsToDecimal(bits);
    const isMatched = current === target;

    useEffect(() => { 
        if(isMatched) onSuccess(); 
    }, [isMatched, onSuccess]);

    return (
        <SceneShell title={`Protocol Override: ${target}`} micro="Assemble the exact voltage sequence to proceed.">
             <div style={{ display: 'flex', gap: 16, background: isMatched ? 'rgba(16, 185, 129, 0.05)' : C.surfaceTop, padding: '32px', borderRadius: 24, border: `1px solid ${isMatched ? '#10B981' : C.border}` }}>
                {bits.map((b, i) => (
                    <motion.button 
                        key={i} 
                        onClick={() => setBits(p => p.map((v,idx)=>idx===i ? 1-v : v))} 
                        animate={{
                            backgroundColor: b ? (isMatched ? '#10B981' : C.cyan) : C.bg,
                            color: b ? '#000' : C.muted,
                            borderColor: b ? (isMatched ? '#10B981' : C.cyan) : C.borderLite,
                            y: b ? -4 : 0
                        }}
                        style={{ 
                            width: 80, height: 100, border: `2px solid`, borderRadius: 16, fontSize: 44, fontWeight: 900, fontFamily: C.mono, cursor: 'pointer', outline: 'none'
                        }}
                    >
                        {b}
                    </motion.button>
                ))}
            </div>
            {isMatched && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={onAdvance}
                    style={{ padding: '16px 48px', background: '#10B981', color: '#000', border: 'none', borderRadius: 30, fontSize: 14, fontWeight: 900, fontFamily: C.sans, letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                >
                    INITIALISE BRIDGE
                </motion.button>
            )}
        </SceneShell>
    );
};

// 
// SCENE 8 : Epilogue
// 

const Scene8: React.FC<SceneProps> = () => (
    <SceneShell title="Binary Awakened" micro="The fabric of logic is now yours.">
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} 
                style={{ width: 140, height: 140, border: `2px dashed ${C.cyanDim}`, borderRadius: '50%', position: 'absolute' }} 
            />
             <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }} 
                style={{ width: 100, height: 100, border: `2px solid ${C.cyan}`, borderRadius: '50%', position: 'absolute' }} 
            />
            <div style={{ width: 40, height: 40, background: C.cyan, borderRadius: '50%', boxShadow: `0 0 40px ${C.cyan}` }} />
        </div>
        <p style={{ maxWidth: 400, textAlign: 'center', lineHeight: 1.8, color: C.muted, marginTop: 24 }}>
            You have successfully deconstructed the analog wave into discrete Boolean certainty. Continue scrolling to observe how these values combine to command hardware.
        </p>
    </SceneShell>
);

// 
// MAIN INTEGRATED LABORATORY WRAPPER
// 

export const S05_LabActivity: React.FC<{ isActive: boolean; isDarkMode: boolean }> = ({ isActive }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mode, setMode]   = useState<Mode>('simple');
  const [muted, setMuted] = useState(true);
  const [globalBits, setGlobalBits] = useState<number[]>([0, 0, 0, 0]);

  const { play, resume } = useAudio(muted);
  const proMode = mode === 'pro';

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
    if (clamped !== slideIndex) { 
        setSlideIndex(clamped); 
        play('snap'); 
    }
  }, [slideIndex, play]);

  // Keyboard Navigation
  useEffect(() => {
      if (!isActive) return;
      const handleGlobalKey = (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight') goTo(slideIndex + 1);
          if (e.key === 'ArrowLeft') goTo(slideIndex - 1);
      };
      window.addEventListener('keydown', handleGlobalKey);
      return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isActive, slideIndex, goTo]);

  const handleBitToggle = (i: number) => {
    setGlobalBits(b => b.map((v, idx) => idx === i ? 1 - v : v));
    play('toggle');
  };

  const advanceHandler = () => goTo(slideIndex + 1);

  const scenes: React.FC<SceneProps>[] = [
    (p) => <Scene1 {...p} />,
    (p) => <Scene2 {...p} />,
    (p) => <Scene3 {...p} onSuccess={() => play('success')} />,
    (p) => <Scene4 {...p} bits={globalBits} onToggle={handleBitToggle} />,
    (p) => <Scene5 {...p} onSuccess={() => play('success')} onError={() => play('error')} />,
    (p) => <Scene6 {...p} onAdvance={advanceHandler} />,
    (p) => <Scene7 {...p} onSuccess={() => play('success')} onAdvance={advanceHandler} />,
    (p) => <Scene8 {...p} />,
  ];

  const LABELS = ['Signal', 'States', 'Positions', 'Building', 'Decrypt', 'Routers', 'Override', 'Core'];

  return (
    <div onClick={resume} className="w-full flex flex-col items-center gap-4 py-20 px-4">
      <TryItYourself />
      <div
        style={{
            width: '100%', maxWidth: 1100, height: 740,
            background: C.bg, color: C.text, fontFamily: C.sans, 
            position: 'relative', overflow: 'hidden', borderRadius: 32, 
            border: `1px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.8)' 
        }}
      >
        {/* Header HUD */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'linear-gradient(180deg, #000 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Hud>Interactive Laboratory</Hud>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, background: slideIndex === SLIDE_COUNT - 1 ? '#10B981' : C.cyan, borderRadius: '50%', boxShadow: `0 0 10px ${slideIndex === SLIDE_COUNT - 1 ? '#10B981' : C.cyan}` }} />
                    <span style={{ fontFamily: C.sans, fontSize: 16, fontWeight: 700, color: '#FFF' }}>S03: Binary Awakening</span>
                </div>
            </div>
            
            <Hud style={{ color: C.text, background: C.surfaceTop, padding: '8px 16px', borderRadius: 20, border: `1px solid ${C.borderLite}` }}>
                Step {slideIndex + 1} / {SLIDE_COUNT} <span style={{ color: C.muted, margin: '0 8px' }}>--</span> <span style={{ color: C.cyan }}>{LABELS[slideIndex]}</span>
            </Hud>

            <div style={{ display: 'flex', gap: 12 }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMuted(!muted)} style={{ background: muted ? C.surfaceTop : 'rgba(249, 115, 22, 0.1)', border: `1px solid ${muted ? C.borderLite : 'rgba(249, 115, 22, 0.5)'}`, borderRadius: 12, padding: '8px 16px', fontSize: 11, fontFamily: C.mono, color: muted ? C.muted : C.copper, fontWeight: 700, cursor: 'pointer' }}>
                    {muted ? 'AUDIO: OFF' : 'AUDIO: ON'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode(mode === 'simple' ? 'pro' : 'simple')} style={{ background: proMode ? 'rgba(14, 165, 233, 0.1)' : C.surfaceTop, border: `1px solid ${proMode ? C.cyanDim : C.borderLite}`, borderRadius: 12, padding: '8px 16px', fontSize: 11, fontFamily: C.mono, color: proMode ? C.cyan : C.muted, fontWeight: 700, cursor: 'pointer' }}>
                    {proMode ? 'MODE: PRO' : 'MODE: SIMPLE'}
                </motion.button>
            </div>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)', zIndex: 30 }}>
            <motion.div animate={{ width: `${((slideIndex + 1) / SLIDE_COUNT) * 100}%` }} transition={{ duration: 0.5, ease: 'circOut' }} style={{ height: '100%', background: C.cyan, boxShadow: `0 0 10px ${C.cyanGlow}` }} />
        </div>

        {/* Scene Container */}
        <AnimatePresence mode="wait">
            <motion.div 
                key={slideIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 60px' }}
            >
                {scenes[slideIndex]({ isActive, proMode })}
            </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }}
            onClick={() => goTo(slideIndex-1)} disabled={slideIndex===0} 
            style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: '#111111', border: `1px solid ${C.borderLite}`, borderRadius: 16, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slideIndex===0?'transparent':C.text, zIndex: 20, cursor: slideIndex===0?'default':'pointer', pointerEvents: slideIndex===0?'none':'auto' }}
        >
            
        </motion.button>

        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }}
            onClick={() => goTo(slideIndex+1)} disabled={slideIndex===SLIDE_COUNT-1} 
            style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: '#111111', border: `1px solid ${C.borderLite}`, borderRadius: 16, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slideIndex===SLIDE_COUNT-1?'transparent':C.text, zIndex: 20, cursor: slideIndex===SLIDE_COUNT-1?'default':'pointer', pointerEvents: slideIndex===SLIDE_COUNT-1?'none':'auto' }}
        >
            
        </motion.button>
        </div>
    </div>
  );
};
