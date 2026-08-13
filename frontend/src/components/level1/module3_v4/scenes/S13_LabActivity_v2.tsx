/**
 * S13_LabActivity_v2.tsx - Digital Electronics Mega Lab
 * ──────────────────────────────────────────────────────
 * Activities:
 *   1. Binary Converter Drill (binary ↔ decimal ↔ hex)
 *   2. Ripple Carry & Add One Lab
 *   3. Complement Calculator (1s, 2s, 9s, 10s)
 *   4. Boolean Gate Puzzle
 *   5. SOP Builder from Truth Table
 *   6. Hex RGB Decoder (Real-world Hex)
 *   7. De Morgan Matcher
 *   8. Mastery Badge
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TryItYourself } from '../../../ui/TryItYourself';

// ── Constants ─────────────────────────────────────────────────
const C = {
  bg: '#050508',
  surface: '#0C0D14',
  surfaceTop: '#161821',
  border: '#1E2130',
  borderLite: '#2D3250',
  cyan: '#00D4FF',
  cyanDim: '#0099BB',
  cyanGlow: 'rgba(0,212,255,0.35)',
  green: '#10B981',
  amber: '#F59E0B',
  orange: '#F97316',
  rose: '#F43F5E',
  purple: '#A855F7',
  text: '#F1F5F9',
  muted: '#475569',
  mono: '"IBM Plex Mono","Courier New",monospace',
  sans: '"Inter",system-ui,sans-serif',
} as const;

const TOTAL_SLIDES = 8;

// ── Audio ─────────────────────────────────────────────────────
const useAudio = (muted: boolean) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const play = useCallback((type: 'toggle' | 'success' | 'error' | 'snap') => {
    if (muted) return;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    const ctx = ctxRef.current;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(ctx.destination);
    const cfgs: any = {
      toggle: { f: [660], dur: 0.08, type: 'sine' },
      snap:   { f: [550, 1100], dur: 0.12, type: 'sine' },
      success: { f: [523, 659, 784, 1047], dur: 0.5, type: 'triangle' },
      error:   { f: [220, 200], dur: 0.3, type: 'sawtooth' },
    };
    const c = cfgs[type];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + c.dur);
    c.f.forEach((f: number, i: number) => {
      const o = ctx.createOscillator();
      o.type = c.type;
      o.frequency.setValueAtTime(f, t);
      o.connect(g);
      o.start(t + i * 0.04);
      o.stop(t + c.dur + i * 0.04);
    });
  }, [muted]);
  return play;
};

// ── Helpers ───────────────────────────────────────────────────
const bitsToNum = (bits: number[]) =>
  bits.reduce((acc, b, i) => acc + b * Math.pow(2, bits.length - 1 - i), 0);

const numToBits = (n: number, len: number) =>
  Array.from({ length: len }, (_, i) => (n >> (len - 1 - i)) & 1);

const onesC = (bits: number[]) => bits.map(b => 1 - b);
const twosC = (bits: number[]) => {
  const o = onesC(bits);
  let carry = 1;
  for (let i = o.length - 1; i >= 0; i--) {
    const s = o[i] + carry;
    o[i] = s % 2;
    carry = Math.floor(s / 2);
  }
  return o;
};

// ── Shared UI ─────────────────────────────────────────────────
const Hud: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: boolean }> = ({ children, style, glow }) => (
  <div style={{ fontFamily: C.mono, fontSize: 10, color: glow ? C.cyan : C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: glow ? `0 0 8px ${C.cyanGlow}` : 'none', ...style }}>
    {children}
  </div>
);

const BitBtn: React.FC<{ val: number; color?: string; size?: number; onClick?: () => void; label?: string }> = ({ val, color = C.cyan, size = 56, onClick, label }) => (
  <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    {label && <Hud style={{ fontSize: 9 }}>{label}</Hud>}
    <motion.button
      onClick={onClick}
      animate={{ backgroundColor: val ? `${color}20` : C.surfaceTop, borderColor: val ? color : C.borderLite, color: val ? color : C.muted, boxShadow: val ? `0 0 16px ${color}55` : 'none', y: val ? -3 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{ width: size, height: size + 8, border: '2px solid', borderRadius: 12, fontFamily: C.mono, fontSize: size * 0.4, fontWeight: 900, cursor: onClick ? 'pointer' : 'default', outline: 'none' }}
    >
      {val}
    </motion.button>
  </motion.div>
);

// ── SLIDE 1: Binary Converter Drill ───────────────────────────
const generateChallenge = () => {
  const type = Math.random() > 0.5 ? 'binary-to-decimal' : 'decimal-to-binary';
  if (type === 'binary-to-decimal') {
    const num = Math.floor(Math.random() * 240) + 1;
    const bits = numToBits(num, 8);
    return { type, question: bits.join(''), answer: String(num), display: `(${bits.join('')})₂ = ?₁₀` };
  } else {
    const num = Math.floor(Math.random() * 240) + 1;
    const bits = numToBits(num, 8);
    return { type, question: String(num), answer: bits.join(''), display: `(${num})₁₀ = ?₂` };
  }
};

const Slide1: React.FC<{ play: any }> = ({ play }) => {
  const [challenge, setChallenge] = useState(generateChallenge);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    const correct = userInput.trim() === challenge.answer;
    setStatus(correct ? 'correct' : 'wrong');
    setAttempts(a => a + 1);
    if (correct) { play('success'); setStreak(s => s + 1); setTimeout(next, 1500); }
    else { play('error'); setStreak(0); }
  };

  const next = () => { setChallenge(generateChallenge()); setUserInput(''); setStatus('idle'); };

  const statusColor = status === 'correct' ? C.green : status === 'wrong' ? C.rose : C.borderLite;

  return (
    <div className="gap-6 sm:gap-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 700, width: '100%' }}>
      <div>
        <motion.h2 key="slide1-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: C.text, margin: 0 }}>
          Converter Drill
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Translate the number</Hud>
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.muted }}>
          STREAK <span style={{ color: streak > 0 ? C.green : C.muted, fontSize: 20, fontWeight: 900 }}>{streak}</span>
        </div>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.muted }}>
          ACCURACY <span style={{ color: C.cyan, fontSize: 20, fontWeight: 900 }}>{attempts > 0 ? Math.round(((attempts - (attempts - streak)) / attempts) * 100) : 100}%</span>
        </div>
      </div>

      {/* Question */}
      <motion.div key={challenge.question} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="px-5 py-8 sm:px-[60px] sm:py-10 max-w-full" style={{ background: C.surface, border: `2px solid ${C.borderLite}`, borderRadius: 24 }}
      >
        <div className="break-all tracking-[2px] sm:tracking-[4px]" style={{ fontFamily: C.mono, fontSize: 'clamp(20px,4vw,40px)', fontWeight: 900, color: C.cyan }}>
          {challenge.display}
        </div>
      </motion.div>

      {/* Input */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          value={userInput}
          onChange={e => { setUserInput(e.target.value); setStatus('idle'); }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder={challenge.type === 'binary-to-decimal' ? 'Enter decimal…' : 'Enter binary (e.g. 01001101)…'}
          autoFocus
          style={{ width: '100%', background: C.surfaceTop, border: `2px solid ${statusColor}`, borderRadius: 16, padding: '16px 20px', fontFamily: C.mono, fontSize: 20, color: C.text, textAlign: 'center', outline: 'none', transition: 'border-color 0.3s', boxShadow: status !== 'idle' ? `0 0 20px ${statusColor}55` : 'none' }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={check}
            style={{ flex: 1, padding: '14px', background: C.cyan, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontFamily: C.sans, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}
          >
            CHECK
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={next}
            style={{ padding: '14px 20px', background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 14, fontFamily: C.mono, fontSize: 11, cursor: 'pointer', letterSpacing: '0.1em' }}
          >
            SKIP
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontFamily: C.mono, fontSize: 14, color: status === 'correct' ? C.green : C.rose, fontWeight: 700 }}
          >
            {status === 'correct' ? '✓ Correct!' : `✗ Answer: ${challenge.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── SLIDE 2: Ripple Carry & Adder Lab ───────────────────────
const Slide2: React.FC<{ play: any }> = ({ play }) => {
  const BITS = 6;
  const [bitsA, setBitsA] = useState([0, 1, 0, 1, 1, 0]);
  const [bitsB, setBitsB] = useState([0, 0, 1, 1, 0, 1]);
  const [mode, setMode] = useState<'add' | 'sub'>('add');

  const { result, carries, effectiveB } = React.useMemo(() => {
    let targetB = [...bitsB];
    if (mode === 'sub') {
      // 2's complement subtraction: A + (~B + 1)
      const inverted = bitsB.map(b => 1 - b);
      let carryIn = 1;
      for (let i = BITS - 1; i >= 0; i--) {
        const sum = inverted[i] + carryIn;
        inverted[i] = sum % 2;
        carryIn = Math.floor(sum / 2);
      }
      targetB = inverted;
    }

    const res = new Array(BITS).fill(0);
    const crs = new Array(BITS + 1).fill(0);
    for (let i = BITS - 1; i >= 0; i--) {
      const sum = bitsA[i] + targetB[i] + crs[i + 1];
      res[i] = sum % 2;
      crs[i] = Math.floor(sum / 2);
    }
    return { result: res, carries: crs, effectiveB: targetB };
  }, [bitsA, bitsB, mode]);

  const decA = bitsToNum(bitsA);
  const decB = bitsToNum(bitsB);
  const decR = (carries[0] * Math.pow(2, BITS)) + result.reduce((acc, b, i) => acc + b * Math.pow(2, BITS - 1 - i), 0);

  return (
    <div className="gap-6 sm:gap-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 800, width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: C.text, margin: 0 }}>
          Engineering Adder
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Click bits to toggle - observe carry propagation</Hud>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {(['add', 'sub'] as const).map(m => (
          <motion.button key={m} onClick={() => { setMode(m); play('snap'); }}
            animate={{ background: mode === m ? `${C.cyan}22` : C.surfaceTop, borderColor: mode === m ? C.cyan : C.borderLite, color: mode === m ? C.cyan : C.muted }}
            style={{ padding: '10px 20px', border: '2px solid', borderRadius: 30, fontFamily: C.mono, fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.15em' }}
          >
            {m === 'add' ? 'A + B (ADD)' : 'A - B (SUB)'}
          </motion.button>
        ))}
      </div>

      <div className="p-4 sm:p-8" style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 8, paddingRight: 0 }}>
          <Hud style={{ width: 80, textAlign: 'right', paddingRight: 10 }}>Cout</Hud>
          {carries.slice(0, BITS).map((c, i) => (
            <div key={i} style={{ width: 52, textAlign: 'center' }}>
              <motion.div animate={{ color: c ? C.amber : C.border, fontSize: c ? 16 : 12 }}
                style={{ fontFamily: C.mono, fontWeight: 900, transition: 'all 0.2s' }}>
                {c}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Row A */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 900, color: C.cyan, width: 80, textAlign: 'right' }}>A = {decA}</span>
          {bitsA.map((b, i) => (
            <BitBtn key={i} val={b} color={C.cyan} size={48} onClick={() => { setBitsA(p => p.map((v, idx) => idx === i ? 1 - v : v)); play('toggle'); }} />
          ))}
        </div>

        {/* Row B */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 900, color: C.cyanDim, width: 80, textAlign: 'right' }}>
            B = {decB}
          </span>
          {effectiveB.map((b, i) => (
            <BitBtn key={i} val={b} color={C.cyanDim} size={48} onClick={() => { setBitsB(p => p.map((v, idx) => idx === i ? 1 - v : v)); play('toggle'); }} />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${C.cyan}55, transparent)`, marginBottom: 16 }} />

        {/* Result */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 900, color: C.green, width: 80, textAlign: 'right' }}>= {decR}</span>
          {carries[0] === 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ width: 52, height: 56, border: `2px solid ${C.amber}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, fontSize: 20, fontWeight: 900, color: C.amber, background: `${C.amber}11` }}>
              1
            </motion.div>
          )}
          {result.map((b, i) => (
            <BitBtn key={i} val={b} color={C.green} size={48} />
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="px-4 py-5 sm:px-7" style={{ width: '100%', background: `${C.cyan}08`, border: `1px solid ${C.cyan}22`, borderRadius: 20, fontFamily: C.mono, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
        <span style={{ color: C.cyan, fontWeight: 900 }}>A + 1 = Increment</span> - the simplest counter operation. Every flip-flop counter uses this.{' '}
        Overflow = when the carry ripples past the MSB - your result wraps around!
      </div>
    </div>
  );
};

// ── SLIDE 3: Complement Calculator ────────────────────────────
const Slide3: React.FC<{ play: any }> = ({ play }) => {
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 1, 0, 0]);
  const BITS = 8;
  const decVal = bitsToNum(bits);

  const ones = onesC(bits);
  const twos = twosC(bits);

  const subtractDemo = {
    a: 13, b: 5,
    aBits: numToBits(13, BITS),
    bComp: twosC(numToBits(5, BITS)),
    result: 8,
  };

  return (
    <div className="gap-6 sm:gap-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 800, width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: C.text, margin: 0 }}>
          Complement Calculator
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Toggle bits • See 1's and 2's complement live</Hud>
      </div>

      {/* Input bits */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: '28px 32px' }}>
        <Hud style={{ marginBottom: 16, textAlign: 'center' }}>Input N (click to toggle)  = {decVal}₁₀</Hud>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {bits.map((b, i) => (
            <BitBtn key={i} val={b} size={52} label={`2^${BITS-1-i}`} onClick={() => { setBits(p => p.map((v, idx) => idx === i ? 1 - v : v)); play('toggle'); }} />
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[{ label: "1's Complement", bits: ones, color: C.cyan, formula: 'Flip all bits' },
          { label: "2's Complement", bits: twos, color: C.green, formula: "1's comp + 1" }
        ].map(({ label, bits: b, color, formula }) => (
          <div key={label} style={{ background: `${color}08`, border: `1px solid ${color}33`, borderRadius: 20, padding: 24 }}>
            <div style={{ fontFamily: C.mono, fontSize: 11, color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formula}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {b.map((bit, i) => (
                <div key={i} style={{ width: 36, height: 40, borderRadius: 9, border: `2px solid ${bit ? color : C.borderLite}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.mono, fontSize: 18, fontWeight: 900, color: bit ? color : C.muted, background: bit ? `${color}15` : C.surfaceTop, boxShadow: bit ? `0 0 10px ${color}44` : 'none' }}>
                  {bit}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 13, color, fontWeight: 900 }}>
              = {bitsToNum(b)}₁₀
            </div>
          </div>
        ))}
      </div>

      {/* Subtraction demo */}
      <div style={{ width: '100%', background: `${C.green}08`, border: `1px solid ${C.green}33`, borderRadius: 20, padding: '24px 28px' }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.green, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>Subtraction via 2's Complement: 13 − 5</div>
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.muted, lineHeight: 2 }}>
          <div>A = 13 = <span style={{ color: C.cyan }}>{subtractDemo.aBits.join('')}</span></div>
          <div>B = 5  → 2's comp = <span style={{ color: C.green }}>{subtractDemo.bComp.join('')}</span></div>
          <div>─────────────────────</div>
          <div>Sum = {subtractDemo.aBits.join('')} + {subtractDemo.bComp.join('')} = 1<span style={{ color: C.green }}>00001000</span></div>
          <div>Drop carry → <span style={{ color: C.green, fontWeight: 900, fontSize: 16 }}>00001000 = 8 ✓</span></div>
        </div>
      </div>
    </div>
  );
};

// ── SLIDE 4: Boolean Gate Puzzle ──────────────────────────────
type Gate = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'NOT';
const GATE_PUZZLES = [
  { a: 1, b: 1, target: 0, hint: 'Output is 0 only when both inputs are 1', answer: 'NAND' as Gate },
  { a: 1, b: 0, target: 1, hint: 'Output is 1 when exactly one input is 1', answer: 'XOR' as Gate },
  { a: 0, b: 0, target: 0, hint: 'Output is 0 when any input is 0', answer: 'AND' as Gate },
  { a: 1, b: 1, target: 0, hint: 'Output is 0 when any input is 1', answer: 'NOR' as Gate },
  { a: 0, b: 1, target: 1, hint: 'Output is 1 when any input is 1', answer: 'OR' as Gate },
];

const evalG = (g: Gate, a: number, b: number): number => {
  switch (g) {
    case 'AND': return a & b; case 'OR': return a | b;
    case 'NAND': return 1 - (a & b); case 'NOR': return 1 - (a | b);
    case 'XOR': return a ^ b; case 'NOT': return 1 - a;
  }
};

const Slide4: React.FC<{ play: any }> = ({ play }) => {
  const [pidx, setPidx] = useState(0);
  const [chosen, setChosen] = useState<Gate | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const puzzle = GATE_PUZZLES[pidx];
  const isCorrect = chosen !== null && evalG(chosen, puzzle.a, puzzle.b) === puzzle.target;

  const pick = (g: Gate) => {
    setChosen(g);
    const ok = evalG(g, puzzle.a, puzzle.b) === puzzle.target;
    play(ok ? 'success' : 'error');
    if (ok) setScore(s => s + 1);
  };

  const next = () => { setPidx(p => (p + 1) % GATE_PUZZLES.length); setChosen(null); setShowHint(false); };

  const GATES: Gate[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];
  const G_COLORS: Record<Gate, string> = { AND: C.cyan, OR: C.green, NAND: C.amber, NOR: C.orange, XOR: C.purple, NOT: C.rose };

  return (
    <div className="gap-6 sm:gap-9" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 700, width: '100%', textAlign: 'center' }}>
      <div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: C.text, margin: 0 }}>
          Gate Puzzle
        </motion.h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
          <Hud>Score: <span style={{ color: C.green, fontSize: 16, fontWeight: 900 }}>{score}</span></Hud>
          <Hud>Puzzle {pidx + 1}/{GATE_PUZZLES.length}</Hud>
        </div>
      </div>

      {/* Puzzle */}
      <motion.div key={pidx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="p-5 sm:px-12 sm:py-10" style={{ background: C.surface, border: `1px solid ${C.borderLite}`, borderRadius: 24, width: '100%' }}
      >
        <Hud style={{ marginBottom: 20 }}>Which gate produces output <span style={{ color: C.cyan, fontSize: 20, fontWeight: 900 }}>{puzzle.target}</span> given:</Hud>
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center items-center mb-5">
          <div className="text-2xl sm:text-5xl" style={{ fontFamily: C.mono, fontWeight: 900, color: puzzle.a ? C.cyan : C.muted }}>A={puzzle.a}</div>
          <div className="text-xl sm:text-3xl" style={{ fontFamily: C.mono, color: C.borderLite }}>?</div>
          <div className="text-2xl sm:text-5xl" style={{ fontFamily: C.mono, fontWeight: 900, color: puzzle.b ? C.cyan : C.muted }}>B={puzzle.b}</div>
          <div className="text-xl sm:text-3xl" style={{ fontFamily: C.mono, color: C.borderLite }}>→</div>
          <div className="text-2xl sm:text-5xl" style={{ fontFamily: C.mono, fontWeight: 900, color: puzzle.target ? C.cyan : C.muted }}>y={puzzle.target}</div>
        </div>
      </motion.div>

      {/* Gate options */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {GATES.map(g => {
          const isChosen = chosen === g;
          const correct = evalG(g, puzzle.a, puzzle.b) === puzzle.target;
          const color = isChosen ? (correct ? C.green : C.rose) : G_COLORS[g];
          return (
            <motion.button key={g} onClick={() => !chosen && pick(g)} whileHover={!chosen ? { scale: 1.05 } : {}} whileTap={!chosen ? { scale: 0.95 } : {}}
              animate={{ background: isChosen ? `${color}22` : `${color}11`, borderColor: isChosen ? color : `${color}44`, color: isChosen ? color : `${color}99` }}
              style={{ padding: '14px 28px', border: '2px solid', borderRadius: 16, fontFamily: C.mono, fontSize: 14, fontWeight: 900, cursor: chosen ? 'default' : 'pointer', letterSpacing: '0.1em' }}
            >
              {g}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          >
            <div style={{ fontFamily: C.mono, fontSize: 16, color: isCorrect ? C.green : C.rose, fontWeight: 900 }}>
              {isCorrect ? '✓ Perfect! ' + puzzle.answer + ' gate confirmed.' : `✗ Try again - answer: ${puzzle.answer}`}
            </div>
            {!isCorrect && !showHint && <button onClick={() => setShowHint(true)} style={{ background: 'transparent', border: `1px solid ${C.borderLite}`, color: C.muted, fontFamily: C.mono, fontSize: 11, padding: '8px 16px', borderRadius: 20, cursor: 'pointer' }}>Show Hint</button>}
            {showHint && <div style={{ fontFamily: C.mono, fontSize: 12, color: C.amber, padding: '12px 20px', border: `1px solid ${C.amber}33`, borderRadius: 16, background: `${C.amber}08` }}>{puzzle.hint}</div>}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={next}
              style={{ padding: '12px 32px', background: C.cyan, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontFamily: C.sans, fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em' }}
            >
              NEXT PUZZLE →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── SLIDE 5: SOP Builder ──────────────────────────────────────
const Slide5: React.FC<{ play: any }> = ({ play }) => {
  // 3-variable truth table, user marks y for each row
  const [outputs, setOutputs] = useState(Array(8).fill(0));
  const [showSOP, setShowSOP] = useState(false);

  const rows = Array.from({ length: 8 }, (_, i) => ({
    x1: (i >> 2) & 1, x2: (i >> 1) & 1, x3: i & 1,
    idx: i, y: outputs[i],
  }));

  const minterms = rows.filter(r => r.y).map(r => {
    const t = [r.x1 ? 'x₁' : 'x̄₁', r.x2 ? 'x₂' : 'x̄₂', r.x3 ? 'x₃' : 'x̄₃'];
    return `m${r.idx}(${t.join('')})`;
  });

  const sop = minterms.length === 0 ? '0' : minterms.map(m => m.replace(/m\d+\(/, '').replace(')', '')).join(' + ');

  const toggle = (i: number) => { setOutputs(p => p.map((v, idx) => idx === i ? 1 - v : v)); play('toggle'); setShowSOP(false); };

  return (
    <div className="gap-6 sm:gap-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 750, width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: C.text, margin: 0 }}>
          SOP Builder
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Mark which rows give y=1 → generate your Boolean expression</Hud>
      </div>

      {/* Truth Table */}
      <div style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}>
        <div className="px-3 sm:px-6 py-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 2fr', borderBottom: `1px solid ${C.border}`, fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {['x₁', 'x₂', 'x₃', 'y (click)', 'Minterm'].map(h => <div key={h} style={{ textAlign: 'center' }}>{h}</div>)}
        </div>
        {rows.map(row => (
          <div key={row.idx} className="px-3 sm:px-6 py-2.5 items-center" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 2fr', borderBottom: `1px solid ${C.border}33`, background: row.y ? `${C.cyan}08` : 'transparent', transition: 'background 0.2s' }}>
            {[row.x1, row.x2, row.x3].map((v, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: C.mono, fontSize: 16, fontWeight: 900, color: v ? C.cyan : C.muted }}>{v}</div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.button onClick={() => toggle(row.idx)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                animate={{ background: row.y ? `${C.cyan}22` : C.surfaceTop, borderColor: row.y ? C.cyan : C.borderLite, color: row.y ? C.cyan : C.muted }}
                style={{ width: 44, height: 40, border: '2px solid', borderRadius: 10, fontFamily: C.mono, fontSize: 18, fontWeight: 900, cursor: 'pointer', outline: 'none' }}
              >
                {row.y}
              </motion.button>
            </div>
            <div style={{ textAlign: 'center', fontFamily: C.mono, fontSize: 11, color: row.y ? C.cyan : C.border, fontWeight: row.y ? 700 : 400 }}>
              {row.y ? `m${row.idx}` : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Generate SOP */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowSOP(true); play('success'); }}
        className="px-6 sm:px-12 py-4 max-w-full" style={{ background: C.cyan, color: '#000', border: 'none', borderRadius: 16, fontWeight: 900, fontFamily: C.sans, fontSize: 14, letterSpacing: '0.1em', cursor: 'pointer' }}
      >
        GENERATE SOP EXPRESSION
      </motion.button>

      <AnimatePresence>
        {showSOP && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ width: '100%', background: `${C.cyan}10`, border: `2px solid ${C.cyan}44`, borderRadius: 20, padding: '28px 32px', textAlign: 'center' }}
          >
            <Hud style={{ marginBottom: 12 }}>SOP Expression</Hud>
            <div style={{ fontFamily: C.mono, fontSize: 'clamp(16px,3vw,28px)', fontWeight: 900, color: C.cyan, wordBreak: 'break-all', lineHeight: 1.6 }}>
              y = {sop}
            </div>
            {minterms.length > 0 && (
              <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 11, color: C.muted }}>
                = Σ({rows.filter(r => r.y).map(r => r.idx).join(', ')})
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── SLIDE 6: Hex RGB Decoder ──────────────────────────────────────
const generateColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return { hex: `${toHex(r)}${toHex(g)}${toHex(b)}`, dec: [r, g, b] };
};

const Slide6: React.FC<{ play: any }> = ({ play }) => {
  const [color, setColor] = useState(generateColor());
  const [rIn, setRIn] = useState('');
  const [gIn, setGIn] = useState('');
  const [bIn, setBIn] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const check = () => {
    const isCorrect = 
      parseInt(rIn, 10) === color.dec[0] &&
      parseInt(gIn, 10) === color.dec[1] &&
      parseInt(bIn, 10) === color.dec[2];
    
    setStatus(isCorrect ? 'correct' : 'wrong');
    play(isCorrect ? 'success' : 'error');
  };

  const next = () => { setColor(generateColor()); setRIn(''); setGIn(''); setBIn(''); setStatus('idle'); };

  return (
    <div className="gap-6 sm:gap-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 700, width: '100%', textAlign: 'center' }}>
      <div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: C.text, margin: 0 }}>
          Hex RGB Decoder
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Colors are just Hexadecimal numbers! Convert #RRGGBB back to Decimal 0-255</Hud>
      </div>

      <motion.div key={color.hex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="p-6 sm:p-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, background: C.surface, border: `1px solid ${C.borderLite}`, borderRadius: 24, width: '100%' }}
      >
        <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] flex-shrink-0" style={{ borderRadius: '50%', backgroundColor: `#${color.hex}`, border: `4px solid ${C.border}`, boxShadow: `0 0 40px #${color.hex}88` }} />
        <div className="text-2xl sm:text-[40px] tracking-[3px] sm:tracking-[6px] break-all text-center" style={{ fontFamily: C.mono, fontWeight: 900, color: C.text }}>
          <span style={{ color: C.muted }}>#</span>
          <span style={{ color: C.rose }}>{color.hex.substr(0,2)}</span>
          <span style={{ color: C.green }}>{color.hex.substr(2,2)}</span>
          <span style={{ color: C.cyan }}>{color.hex.substr(4,2)}</span>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3 sm:gap-5 justify-center">
        {[
          { color: C.rose, val: rIn, set: setRIn, label: 'RED Dec' },
          { color: C.green, val: gIn, set: setGIn, label: 'GREEN Dec' },
          { color: C.cyan, val: bIn, set: setBIn, label: 'BLUE Dec' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Hud style={{ color: item.color }}>{item.label}</Hud>
            <input
              value={item.val}
              onChange={e => { item.set(e.target.value); setStatus('idle'); }}
              placeholder="0-255"
              className="w-[84px] sm:w-[100px] p-3" style={{ background: C.surfaceTop, border: `2px solid ${status === 'correct' ? C.green : status === 'wrong' ? C.rose : item.color}`, borderRadius: 12, fontFamily: C.mono, fontSize: 18, color: C.text, textAlign: 'center', outline: 'none' }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={check}
          style={{ padding: '14px 40px', background: C.orange, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontFamily: C.sans, fontSize: 13, cursor: 'pointer', letterSpacing: '0.1em' }}
        >
          CHECK COLOR
        </motion.button>
        {status === 'correct' && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={next}
            style={{ padding: '14px 20px', background: C.cyan, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontFamily: C.sans, fontSize: 13, cursor: 'pointer' }}
          >
            NEXT →
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontFamily: C.mono, fontSize: 14, color: status === 'correct' ? C.green : C.rose, fontWeight: 700 }}>
            {status === 'correct' ? '✓ Spot on! Perfect conversion.' : `✗ Hmm! Red=${color.dec[0]}, Green=${color.dec[1]}, Blue=${color.dec[2]}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── SLIDE 7: De Morgan Matcher ────────────────────────────────────
const SLIDE7_PAIRS = [
  { eq: '(x • y)\'', match: 'x\' + y\'', name: 'NAND = Bubble OR' },
  { eq: '(x + y)\'', match: 'x\' • y\'', name: 'NOR = Bubble AND' },
  { eq: '(x\' • y\')\'', match: 'x + y', name: 'Negative NAND = OR' }
];

const Slide7: React.FC<{ play: any }> = ({ play }) => {
  const [pidx, setPidx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  useEffect(() => {
    const allMatches = SLIDE7_PAIRS.map(p => p.match).sort(() => Math.random() - 0.5);
    setChoices(allMatches);
    setSelected(null);
    setStatus('idle');
  }, [pidx]);

  const p = SLIDE7_PAIRS[pidx];

  const check = (choice: string) => {
    setSelected(choice);
    const isOk = choice === p.match;
    setStatus(isOk ? 'correct' : 'wrong');
    play(isOk ? 'success' : 'error');
  };

  return (
    <div className="gap-6 sm:gap-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 700, width: '100%' }}>
      <div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: C.text, margin: 0 }}>
          De Morgan's Matcher
        </motion.h2>
        <Hud style={{ marginTop: 8 }}>Find the equivalent Boolean expression using De Morgan's Laws</Hud>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, marginTop: 4 }}>(Break the line, change the sign!)</div>
      </div>

      <motion.div key={pidx} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, background: C.surface, border: `2px dashed ${C.purple}`, borderRadius: 24, padding: '40px', width: '100%' }}
      >
        <div style={{ fontFamily: C.mono, fontSize: 50, fontWeight: 900, color: C.purple, letterSpacing: 4 }}>
          {p.eq}
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, width: '100%' }}>
        {choices.map(c => (
          <motion.button key={c} onClick={() => check(c)} disabled={status === 'correct'}
            whileHover={status !== 'correct' ? { scale: 1.05 } : {}}
            animate={{ 
              background: selected === c ? (c === p.match ? `${C.green}33` : `${C.rose}33`) : C.surfaceTop,
              borderColor: selected === c ? (c === p.match ? C.green : C.rose) : C.borderLite
            }}
            style={{ padding: '24px 16px', border: '2px solid', borderRadius: 16, fontFamily: C.mono, fontSize: 24, fontWeight: 900, color: C.text, cursor: status === 'correct' ? 'default' : 'pointer' }}
          >
            {c}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {status === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ fontFamily: C.mono, fontSize: 14, color: C.green, fontWeight: 700 }}>
              ✓ Precisely! {p.name}
            </div>
            {pidx < SLIDE7_PAIRS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPidx(x => x + 1)}
                style={{ padding: '12px 32px', background: C.purple, color: '#000', border: 'none', borderRadius: 14, fontWeight: 900, fontFamily: C.sans, fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                NEXT EQ →
              </motion.button>
            ) : (
              <div style={{ fontFamily: C.mono, fontSize: 12, color: C.amber }}>Law Mastery Complete!</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── SLIDE 8: Mastery Badge ────────────────────────────────────
const Slide8: React.FC = () => (
  <div className="gap-6 sm:gap-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 600, width: '100%' }}>
    <motion.div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[160, 120, 80].map((size, i) => (
        <motion.div key={size} animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ repeat: Infinity, duration: 8 + i * 4, ease: 'linear' }}
          style={{ position: 'absolute', width: size, height: size, border: `${i === 2 ? 2 : 1}px ${i === 2 ? 'solid' : 'dashed'} ${i === 2 ? C.cyan : C.borderLite}`, borderRadius: '50%' }}
        />
      ))}
      <div style={{ width: 50, height: 50, background: C.cyan, borderRadius: '50%', boxShadow: `0 0 40px ${C.cyan}` }} />
    </motion.div>

    <div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: C.sans, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: C.text, margin: 0 }}>
        Lab Complete
      </motion.h2>
      <Hud style={{ marginTop: 12, fontSize: 12 }} glow>Digital Electronics Core Unlocked</Hud>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%' }}>
      {[
        { icon: '🔢', label: 'Number Systems', detail: 'Decimal, Binary, Octal, Hex' },
        { icon: '🔄', label: 'Conversions', detail: 'Remainder & Weight Methods' },
        { icon: '➕', label: 'Binary Arithmetic', detail: 'Ripple Carry Adder' },
        { icon: '🔁', label: 'Complements', detail: "1's, 2's, 9's, 10's" },
        { icon: '⚙️', label: 'Boolean Algebra', detail: 'Laws, DeMorgan\'s Theorem' },
        { icon: '📐', label: 'SOP / POS', detail: 'Minterms & Maxterms' },
      ].map(item => (
        <div key={item.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', textAlign: 'left' }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
          <div style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>{item.detail}</div>
        </div>
      ))}
    </div>

    <p style={{ fontFamily: C.mono, fontSize: 13, color: C.muted, lineHeight: 1.8, maxWidth: 480 }}>
      You've decoded the language of machines. From number systems to Boolean logic,
      these basics power every processor, every gate, every line of hardware description.
    </p>
  </div>
);

// ── MAIN EXPORT ───────────────────────────────────────────────
export const S13_LabActivity_v2: React.FC<{ isActive: boolean; isDarkMode: boolean }> = ({ isActive }) => {
  const [slide, setSlide] = useState(0);
  const [muted, setMuted] = useState(true);
  const play = useAudio(muted);

  const goTo = useCallback((i: number) => {
    const c = Math.max(0, Math.min(TOTAL_SLIDES - 1, i));
    if (c !== slide) { setSlide(c); play('snap'); }
  }, [slide, play]);

  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(slide + 1);
      if (e.key === 'ArrowLeft') goTo(slide - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, slide, goTo]);

  const LABELS = ['Converter Drill', 'Ripple Carry Adder', 'Complement Calc', 'Gate Puzzle', 'SOP Builder', 'Hex RGB Decoder', 'De Morgan Matcher', 'Lab Complete'];

  const slideComponents = [
    <Slide1 key={1} play={play} />,
    <Slide2 key={2} play={play} />,
    <Slide3 key={3} play={play} />,
    <Slide4 key={4} play={play} />,
    <Slide5 key={5} play={play} />,
    <Slide6 key={6} play={play} />,
    <Slide7 key={7} play={play} />,
    <Slide8 key={8} />,
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4 py-16 px-4">
      <TryItYourself />
      <div className="min-h-[560px] sm:min-h-[680px]" style={{ width: '100%', maxWidth: 1100, background: C.bg, color: C.text, fontFamily: C.sans, position: 'relative', overflow: 'hidden', borderRadius: 32, border: `1px solid ${C.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.85)' }}>

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.04)', zIndex: 30 }}>
          <motion.div animate={{ width: `${((slide + 1) / TOTAL_SLIDES) * 100}%` }} transition={{ duration: 0.5, ease: 'circOut' }}
            style={{ height: '100%', background: C.cyan, boxShadow: `0 0 12px ${C.cyanGlow}` }}
          />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-[22px] gap-3" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg,rgba(5,5,8,1) 0%,transparent 100%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Hud>Digital Electronics Mega Lab</Hud>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: slide === TOTAL_SLIDES - 1 ? C.green : C.cyan, boxShadow: `0 0 10px ${slide === TOTAL_SLIDES - 1 ? C.green : C.cyan}` }} />
              <span style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 700, color: C.text }}>{LABELS[slide]}</span>
            </div>
          </div>

          <div className="hidden md:block">
            <Hud style={{ background: C.surfaceTop, padding: '8px 16px', borderRadius: 20, border: `1px solid ${C.borderLite}`, color: C.text }}>
              {slide + 1} / {TOTAL_SLIDES} - <span style={{ color: C.cyan }}>{LABELS[slide]}</span>
            </Hud>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMuted(!muted)}
              style={{ background: C.surface, border: `1px solid ${muted ? C.border : C.orange}`, borderRadius: 12, padding: '8px 16px', fontSize: 10, fontFamily: C.mono, color: muted ? C.muted : C.orange, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em' }}
            >
              {muted ? 'AUDIO:OFF' : 'AUDIO:ON'}
            </motion.button>
          </div>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div key={slide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-[560px] sm:min-h-[680px] px-11 sm:px-12 pt-[84px] sm:pt-[90px] pb-20"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {slideComponents[slide]}
          </motion.div>
        </AnimatePresence>

        {/* Nav Arrows */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => goTo(slide - 1)} disabled={slide === 0}
          className="left-1 sm:left-5 w-9 h-9 sm:w-11 sm:h-11"
          style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: '#111111', border: `1px solid ${C.borderLite}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide === 0 ? 'transparent' : C.text, zIndex: 20, cursor: slide === 0 ? 'default' : 'pointer' }}
        >←</motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => goTo(slide + 1)} disabled={slide === TOTAL_SLIDES - 1}
          className="right-1 sm:right-5 w-9 h-9 sm:w-11 sm:h-11"
          style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: '#111111', border: `1px solid ${C.borderLite}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slide === TOTAL_SLIDES - 1 ? 'transparent' : C.text, zIndex: 20, cursor: slide === TOTAL_SLIDES - 1 ? 'default' : 'pointer' }}
        >→</motion.button>

        {/* Dot Nav */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 20 }}>
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <motion.button key={i} onClick={() => goTo(i)}
              animate={{ width: i === slide ? 24 : 8, background: i === slide ? C.cyan : C.borderLite, boxShadow: i === slide ? `0 0 8px ${C.cyanGlow}` : 'none' }}
              style={{ height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
