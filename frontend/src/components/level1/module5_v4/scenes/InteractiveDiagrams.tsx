import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props { accent: string }

// ─── Small UI primitives shared by the interactive components ─────────────────
const Btn: React.FC<{
  accent: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}> = ({ accent, onClick, active, children, size = 'md' }) => (
  <button
    onClick={onClick}
    className={`rounded-md border font-mono uppercase tracking-[0.18em] transition-all duration-150 ${
      size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-[11px] px-3 py-1.5'
    } ${active ? 'text-black' : 'text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
    style={{
      borderColor: active ? accent : 'rgba(255,255,255,0.15)',
      backgroundColor: active ? accent : 'transparent',
      boxShadow: active ? `0 0 8px ${accent}55` : 'none',
    }}
  >
    {children}
  </button>
);

const Bit: React.FC<{ accent: string; value: 0 | 1; label?: string; size?: number }> = ({
  accent, value, label, size = 36,
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="rounded-md border flex items-center justify-center font-mono font-bold transition-colors duration-150"
      style={{
        width: size,
        height: size,
        borderColor: value ? accent : 'rgba(255,255,255,0.18)',
        backgroundColor: value ? `${accent}25` : 'transparent',
        color: value ? accent : 'rgba(255,255,255,0.4)',
        fontSize: size >= 36 ? 16 : 12,
        boxShadow: value ? `0 0 10px ${accent}55` : 'none',
      }}
    >
      {value}
    </div>
    {label && <span className="text-[9px] font-mono text-slate-600 dark:text-white/55 tracking-widest">{label}</span>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 1. ANIMATED CLOCK - running cursor + adjustable period
// ════════════════════════════════════════════════════════════════════════════
export const AnimatedClock: React.FC<Props> = ({ accent }) => {
  const [period, setPeriod] = useState(10); // ns
  const [running, setRunning] = useState(true);
  const [t, setT] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    const tick = (now: number) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      if (running) setT(prev => (prev + dt * 0.05) % 240); // sweep across 240 svg units
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running]);

  const freq = (1000 / period).toFixed(0); // MHz
  const halfPx = 30; // each half-cycle width in px
  const cursorX = 60 + t;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <svg viewBox="0 0 360 140" className="w-full">
        {/* clock waveform: 4 cycles */}
        <text x={6} y={44} fill="#94a3b8" fontSize={11} fontFamily="monospace">clk</text>
        <path
          d={`M 60 60 L 60 30 ${Array.from({ length: 4 }, (_, i) => {
            const x = 60 + i * halfPx * 2;
            return `L ${x + halfPx} 30 L ${x + halfPx} 60 L ${x + halfPx * 2} 60 L ${x + halfPx * 2} 30`;
          }).join(' ')}`}
          fill="none" stroke={accent} strokeWidth={1.8}
        />
        {/* baseline */}
        <line x1={60} y1={75} x2={300} y2={75} stroke="#475569" strokeWidth={0.5} />

        {/* moving cursor */}
        <line x1={cursorX} y1={20} x2={cursorX} y2={90} stroke={accent} strokeOpacity={0.9} strokeWidth={1} />
        <circle cx={cursorX} cy={45} r={4} fill={accent} />

        {/* period bracket on the first cycle */}
        <line x1={60} y1={108} x2={60 + halfPx * 2} y2={108} stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
        <line x1={60} y1={104} x2={60} y2={112} stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
        <line x1={60 + halfPx * 2} y1={104} x2={60 + halfPx * 2} y2={112} stroke={accent} strokeOpacity={0.6} strokeWidth={1} />
        <text x={60 + halfPx} y={124} textAnchor="middle" fill={accent} fontSize={10} fontFamily="monospace">
          T = {period} ns
        </text>
      </svg>

      <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 dark:text-white/70">
        <Btn accent={accent} onClick={() => setRunning(r => !r)} active={running}>
          {running ? '❚❚ pause' : '▶ play'}
        </Btn>
        <label className="flex items-center gap-2">
          period
          <input
            type="range" min={2} max={20} step={1}
            value={period}
            onChange={e => setPeriod(parseInt(e.target.value))}
            className="accent-current"
            style={{ accentColor: accent } as React.CSSProperties}
          />
          <span style={{ color: accent }} className="tabular-nums">{period} ns</span>
        </label>
        <span className="opacity-60">→ f = <span style={{ color: accent }}>{freq} MHz</span></span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 2. ANIMATED LEVEL vs EDGE - autoplay clock + d, latch and flop side by side
// ════════════════════════════════════════════════════════════════════════════
export const AnimatedLevelVsEdge: React.FC<Props> = ({ accent }) => {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(t => (t + 1) % 16), 220);
    return () => clearInterval(id);
  }, [running]);

  // Pattern: clk and d arrays of 16 phases (each cell = ~25px)
  const clk = [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]; // duty 50%
  const d   = [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0];

  // Latch: q follows d when clk HIGH (==1), holds otherwise
  const qLatch: number[] = [];
  let lastL = 0;
  for (let i = 0; i < 16; i++) {
    if (clk[i] === 1) lastL = d[i];
    qLatch.push(lastL);
  }

  // Flop: q updates on rising edge of clk (clk[i]=1 && clk[i-1]=0), with d at that edge
  const qFlop: number[] = [];
  let lastF = 0;
  for (let i = 0; i < 16; i++) {
    if (clk[i] === 1 && clk[i - 1] === 0) lastF = d[i];
    qFlop.push(lastF);
  }

  const cell = 24;
  const baseY = (val: number, low: number, high: number) => (val ? high : low);
  const buildPath = (arr: number[], low: number, high: number) => {
    let p = `M 50 ${baseY(arr[0], low, high)}`;
    for (let i = 0; i < arr.length; i++) {
      const x = 50 + i * cell;
      p += ` L ${x + cell} ${baseY(arr[i], low, high)}`;
      if (i < arr.length - 1 && arr[i] !== arr[i + 1]) {
        p += ` L ${x + cell} ${baseY(arr[i + 1], low, high)}`;
      }
    }
    return p;
  };

  const cursorX = 50 + ((tick + 1) * cell) - cell / 2;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${50 + 16 * cell + 30} 320`} className="w-full">
        {[
          { label: 'clk', y0: 45, low: 60, high: 30, color: '#cbd5e1', path: buildPath(clk, 60, 30) },
          { label: 'd',   y0: 105, low: 120, high: 90, color: '#94a3b8', path: buildPath(d, 120, 90) },
          { label: 'q (latch)', y0: 195, low: 210, high: 180, color: accent, path: buildPath(qLatch, 210, 180) },
          { label: 'q (flop)',  y0: 280, low: 295, high: 265, color: accent, path: buildPath(qFlop, 295, 265) },
        ].map((row, i) => (
          <g key={i}>
            <text x={6} y={row.y0} fill="#94a3b8" fontSize={10} fontFamily="monospace">{row.label}</text>
            <path d={row.path} fill="none" stroke={row.color} strokeWidth={i >= 2 ? 2 : 1.5} />
          </g>
        ))}

        {/* Highlight latch transparent windows (when clk HIGH) */}
        {clk.map((v, i) =>
          v === 1 ? (
            <rect key={i} x={50 + i * cell} y={170} width={cell} height={50}
                  fill={accent} fillOpacity={0.06} />
          ) : null
        )}
        <text x={56} y={235} fill={`${accent}aa`} fontSize={9} fontFamily="monospace">
          shaded = transparent (q follows d)
        </text>

        {/* Mark rising edges */}
        {clk.map((v, i) => {
          const prev = clk[i - 1] ?? 0;
          if (v === 1 && prev === 0) {
            const x = 50 + i * cell;
            return (
              <g key={i}>
                <line x1={x} y1={20} x2={x} y2={310} stroke={accent} strokeOpacity={0.18} strokeWidth={0.8} strokeDasharray="2 4" />
                <circle cx={x} cy={285} r={3} fill={accent} />
              </g>
            );
          }
          return null;
        })}

        {/* Live time cursor */}
        <line x1={cursorX} y1={20} x2={cursorX} y2={310} stroke={accent} strokeOpacity={0.5} strokeWidth={1} />
      </svg>

      <Btn accent={accent} onClick={() => setRunning(r => !r)} active={running}>
        {running ? '❚❚ pause' : '▶ play'}
      </Btn>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 3. ANIMATED POSEDGE - cursor + flash on each rising edge
// ════════════════════════════════════════════════════════════════════════════
export const AnimatedPosedge: React.FC<Props> = ({ accent }) => {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(t => (t + 1) % 16), 250);
    return () => clearInterval(id);
  }, [running]);

  const clk = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];
  const d   = [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0];
  const q: number[] = [];
  let last = 0;
  for (let i = 0; i < 16; i++) {
    if (clk[i] === 1 && (clk[i - 1] ?? 0) === 0) last = d[i];
    q.push(last);
  }

  const cell = 24;
  const buildPath = (arr: number[], low: number, high: number) => {
    let p = `M 50 ${arr[0] ? high : low}`;
    for (let i = 0; i < arr.length; i++) {
      const x = 50 + i * cell;
      p += ` L ${x + cell} ${arr[i] ? high : low}`;
      if (i < arr.length - 1 && arr[i] !== arr[i + 1]) {
        p += ` L ${x + cell} ${arr[i + 1] ? high : low}`;
      }
    }
    return p;
  };

  const cursorX = 50 + ((tick + 1) * cell) - cell / 2;
  const isAtEdge = clk[tick] === 1 && (clk[tick - 1] ?? 0) === 0;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${50 + 16 * cell + 30} 240`} className="w-full">
        <text x={6} y={45} fill="#94a3b8" fontSize={10} fontFamily="monospace">clk</text>
        <text x={6} y={115} fill="#94a3b8" fontSize={10} fontFamily="monospace">d</text>
        <text x={6} y={185} fill={accent} fontSize={10} fontFamily="monospace">q</text>

        <path d={buildPath(clk, 60, 30)} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
        <path d={buildPath(d, 130, 100)} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        <path d={buildPath(q, 200, 170)} fill="none" stroke={accent} strokeWidth={2.2} />

        {/* Mark all rising edges */}
        {clk.map((v, i) => {
          const prev = clk[i - 1] ?? 0;
          if (v === 1 && prev === 0) {
            const x = 50 + i * cell;
            return (
              <g key={i}>
                <line x1={x} y1={20} x2={x} y2={220} stroke={accent} strokeOpacity={0.15} strokeWidth={0.8} strokeDasharray="2 4" />
                <circle cx={x} cy={30} r={3} fill={accent} />
              </g>
            );
          }
          return null;
        })}

        {/* Live cursor with flash on edge */}
        <line x1={cursorX} y1={20} x2={cursorX} y2={220} stroke={accent} strokeWidth={1} />
        {isAtEdge && (
          <motion.circle
            key={tick}
            cx={cursorX} cy={185} r={10}
            fill="none" stroke={accent} strokeWidth={2}
            initial={{ opacity: 1, r: 4 }}
            animate={{ opacity: 0, r: 18 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </svg>

      <Btn accent={accent} onClick={() => setRunning(r => !r)} active={running}>
        {running ? '❚❚ pause' : '▶ play'}
      </Btn>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 4. INTERACTIVE FLIP-FLOP - buttons + live waveform
// ════════════════════════════════════════════════════════════════════════════
export const InteractiveFlipFlop: React.FC<Props> = ({ accent }) => {
  const [d, setD] = useState<0 | 1>(0);
  const [q, setQ] = useState<0 | 1>(0);
  const [history, setHistory] = useState<{ d: 0 | 1; q: 0 | 1; clk: 0 | 1 }[]>([
    { d: 0, q: 0, clk: 0 },
  ]);

  const push = (entry: { d: 0 | 1; q: 0 | 1; clk: 0 | 1 }) => {
    setHistory(h => [...h.slice(-23), entry]);
  };

  const tickClk = () => {
    // simulate one full cycle: clk goes high then low
    setQ(d);
    push({ d, q: d, clk: 1 });
    setTimeout(() => push({ d, q: d, clk: 0 }), 80);
  };

  const preset = () => {
    setQ(1);
    push({ d, q: 1, clk: 0 });
  };

  const clear = () => {
    setQ(0);
    push({ d, q: 0, clk: 0 });
  };

  const toggleD = () => {
    const nd = (d ? 0 : 1) as 0 | 1;
    setD(nd);
    push({ d: nd, q, clk: 0 });
  };

  // Build waveform from history
  const cell = 16;
  const W = 50 + history.length * cell + 20;
  const buildPath = (key: 'd' | 'q' | 'clk', low: number, high: number) => {
    if (history.length === 0) return '';
    let p = `M 50 ${history[0][key] ? high : low}`;
    for (let i = 0; i < history.length; i++) {
      const x = 50 + i * cell;
      p += ` L ${x + cell} ${history[i][key] ? high : low}`;
      if (i < history.length - 1 && history[i][key] !== history[i + 1][key]) {
        p += ` L ${x + cell} ${history[i + 1][key] ? high : low}`;
      }
    }
    return p;
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-5">
      {/* Schematic + controls */}
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {/* Inputs */}
        <div className="flex flex-col items-center gap-2">
          <Btn accent={accent} onClick={toggleD} active={d === 1}>D = {d}</Btn>
          <Btn accent={accent} onClick={tickClk} size="sm">CLK ↑ tick</Btn>
        </div>

        {/* FF box */}
        <div
          className="rounded-lg border flex flex-col items-center justify-center px-6 py-4 relative"
          style={{
            borderColor: accent,
            backgroundColor: '#0B0D11',
            boxShadow: `0 0 12px ${accent}30, inset 0 0 8px ${accent}15`,
            minWidth: 130,
          }}
        >
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-60" style={{ color: accent }}>
            D-FF
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Bit accent={accent} value={d} label="D" />
            <span className="text-white/40">→</span>
            <Bit accent={accent} value={q} label="Q" size={44} />
          </div>
          {/* PRE / CLR buttons attached to the box */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Btn accent={accent} onClick={preset} size="sm">PRE</Btn>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <Btn accent={accent} onClick={clear} size="sm">CLR</Btn>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col items-center gap-1.5">
          <Bit accent={accent} value={q ? 0 : 1 as 0 | 1} label="Q̅" />
          <span className="text-[9px] font-mono text-slate-500 dark:text-white/40">complement</span>
        </div>
      </div>

      {/* Live waveform */}
      <div className="w-full">
        <svg viewBox={`0 0 ${W} 200`} className="w-full">
          {[
            { label: 'clk', key: 'clk' as const, low: 50, high: 25, color: '#cbd5e1' },
            { label: 'd',   key: 'd' as const,   low: 105, high: 80, color: '#94a3b8' },
            { label: 'q',   key: 'q' as const,   low: 175, high: 150, color: accent },
          ].map((r, i) => (
            <g key={i}>
              <text x={6} y={r.low - 5} fill={r.color} fontSize={10} fontFamily="monospace">{r.label}</text>
              <path d={buildPath(r.key, r.low, r.high)} fill="none" stroke={r.color} strokeWidth={i === 2 ? 2 : 1.5} />
            </g>
          ))}
          <text x={6} y={195} fill="#475569" fontSize={9} fontFamily="monospace">
            history → click CLK to advance
          </text>
        </svg>
      </div>

      <div className="text-[10px] font-mono text-slate-500 dark:text-white/45 tracking-widest">
        try → toggle D · click CLK · then PRE / CLR (asynchronous)
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 5. INTERACTIVE HALF-ADDER - toggle inputs, watch outputs light up
// ════════════════════════════════════════════════════════════════════════════
export const InteractiveHalfAdder: React.FC<Props> = ({ accent }) => {
  const [a, setA] = useState<0 | 1>(0);
  const [b, setB] = useState<0 | 1>(0);
  const sum = (a ^ b) as 0 | 1;
  const carry = (a & b) as 0 | 1;

  const wireColor = (v: 0 | 1) => (v ? accent : '#475569');

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <svg viewBox="0 0 480 220" className="w-full">
        {/* a wire */}
        <line x1={20} y1={60} x2={140} y2={60} stroke={wireColor(a)} strokeWidth={2} />
        <line x1={80} y1={60} x2={80} y2={170} stroke={wireColor(a)} strokeWidth={2} />
        <line x1={80} y1={120} x2={140} y2={120} stroke={wireColor(a)} strokeWidth={2} />
        <line x1={80} y1={170} x2={140} y2={170} stroke={wireColor(a)} strokeWidth={2} />
        {/* b wire */}
        <line x1={20} y1={150} x2={140} y2={150} stroke={wireColor(b)} strokeWidth={2} />

        {/* XOR gate */}
        <g transform="translate(140,40)">
          <path d="M 0 0 Q 25 40 0 80 Q 40 80 60 40 Q 40 0 0 0 Z"
                fill="#0B0D11"
                stroke={sum ? accent : '#94a3b8'}
                strokeWidth={1.5} />
          <path d="M -8 0 Q 17 40 -8 80" fill="none"
                stroke={sum ? accent : '#94a3b8'} strokeWidth={1.5} />
          <text x={28} y={45} textAnchor="middle"
                fill={sum ? accent : '#94a3b8'} fontSize={11} fontFamily="monospace">XOR</text>
        </g>

        {/* AND gate */}
        <g transform="translate(140,130)">
          <path d="M 0 0 L 30 0 Q 60 0 60 30 Q 60 60 30 60 L 0 60 Z"
                fill="#0B0D11"
                stroke={carry ? accent : '#94a3b8'}
                strokeWidth={1.5} />
          <text x={28} y={36} textAnchor="middle"
                fill={carry ? accent : '#94a3b8'} fontSize={11} fontFamily="monospace">AND</text>
        </g>

        {/* sum/carry output wires */}
        <line x1={200} y1={80} x2={420} y2={80} stroke={wireColor(sum)} strokeWidth={2} />
        <line x1={200} y1={160} x2={420} y2={160} stroke={wireColor(carry)} strokeWidth={2} />

        {/* Live result indicator dots */}
        <motion.circle
          key={`a-${a}`}
          cx={20} cy={60} r={5}
          fill={wireColor(a)}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          key={`b-${b}`}
          cx={20} cy={150} r={5}
          fill={wireColor(b)}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Controls + bits row */}
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="flex items-center gap-3">
          <Btn accent={accent} onClick={() => setA(a ? 0 : 1)} active={a === 1}>a = {a}</Btn>
          <Btn accent={accent} onClick={() => setB(b ? 0 : 1)} active={b === 1}>b = {b}</Btn>
        </div>
        <div className="flex items-center gap-4">
          <Bit accent={accent} value={sum} label="sum" />
          <Bit accent={accent} value={carry} label="carry" />
        </div>
        <div className="text-[10px] font-mono text-slate-600 dark:text-white/55">
          sum = a ⊕ b · carry = a · b
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 6. INTERACTIVE 2:1 MUX - toggle inputs and selector, see active path
// ════════════════════════════════════════════════════════════════════════════
export const InteractiveMux: React.FC<Props> = ({ accent }) => {
  const [a, setA] = useState<0 | 1>(0);
  const [b, setB] = useState<0 | 1>(1);
  const [sel, setSel] = useState<0 | 1>(0);
  const y = (sel ? a : b) as 0 | 1;

  const aActive = sel === 1;
  const bActive = sel === 0;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4">
      <svg viewBox="0 0 520 220" className="w-full">
        {/* MUX symbol */}
        <polygon points="120,30 220,60 220,140 120,170"
                 fill="#0B0D11" stroke={accent} strokeWidth={1.5} />
        <text x={170} y={108} textAnchor="middle" fill={accent}
              fontSize={12} fontFamily="monospace">2:1 MUX</text>

        {/* Input a */}
        <line x1={40} y1={60} x2={120} y2={60}
              stroke={aActive ? accent : a ? `${accent}55` : '#475569'}
              strokeWidth={aActive ? 2.5 : 1.5} />
        <text x={32} y={64} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">a</text>

        {/* Input b */}
        <line x1={40} y1={140} x2={120} y2={140}
              stroke={bActive ? accent : b ? `${accent}55` : '#475569'}
              strokeWidth={bActive ? 2.5 : 1.5} />
        <text x={32} y={144} textAnchor="end" fill="#cbd5e1" fontSize={12} fontFamily="monospace">b</text>

        {/* Sel */}
        <line x1={170} y1={170} x2={170} y2={195}
              stroke={sel ? accent : '#475569'} strokeWidth={1.5} />
        <text x={170} y={210} textAnchor="middle" fill="#cbd5e1" fontSize={12} fontFamily="monospace">sel</text>

        {/* y */}
        <line x1={220} y1={100} x2={300} y2={100}
              stroke={y ? accent : '#475569'} strokeWidth={2.5} />
        <text x={306} y={104} fill="#cbd5e1" fontSize={12} fontFamily="monospace">y</text>

        {/* Path indicator */}
        <text x={356} y={70} fill={`${accent}aa`} fontSize={10} fontFamily="monospace">
          sel = {sel}
        </text>
        <text x={356} y={88} fill={accent} fontSize={11} fontFamily="monospace">
          → y picks {sel ? 'a' : 'b'}
        </text>
        <text x={356} y={108} fill="#cbd5e1" fontSize={11} fontFamily="monospace">
          y = {y}
        </text>
      </svg>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Btn accent={accent} onClick={() => setA(a ? 0 : 1)} active={a === 1}>a = {a}</Btn>
        <Btn accent={accent} onClick={() => setB(b ? 0 : 1)} active={b === 1}>b = {b}</Btn>
        <Btn accent={accent} onClick={() => setSel(sel ? 0 : 1)} active={sel === 1}>sel = {sel}</Btn>
        <span className="text-[11px] font-mono text-slate-600 dark:text-white/55">y = sel ? a : b</span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 7. ANIMATED HDL PIPELINE - particle flowing through stages
// ════════════════════════════════════════════════════════════════════════════
export const AnimatedHDLPipeline: React.FC<Props> = ({ accent }) => {
  const stages = [
    { x: 20,  label: 'Verilog Code', sub: 'text' },
    { x: 200, label: 'Synthesis',    sub: 'compile' },
    { x: 380, label: 'Netlist',      sub: 'gates' },
    { x: 560, label: 'Silicon',      sub: 'die' },
  ];

  return (
    <svg viewBox="0 0 720 140" className="w-full max-w-3xl">
      {/* Connector traces */}
      {[0, 1, 2].map(i => (
        <line key={i} x1={stages[i].x + 140} y1={70} x2={stages[i + 1].x} y2={70}
              stroke={accent} strokeOpacity={0.4} strokeWidth={1} />
      ))}

      {/* Boxes */}
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={40} width={140} height={60} rx={8}
                fill="#0B0D11" stroke={accent} strokeOpacity={0.7} strokeWidth={1} />
          <text x={s.x + 70} y={68} textAnchor="middle" fill="#E5E7EB" fontSize={13} fontWeight={600}>
            {s.label}
          </text>
          <text x={s.x + 70} y={86} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
            {s.sub}
          </text>
        </g>
      ))}

      {/* Animated particle that flows left → right and loops */}
      <motion.circle
        cx={0} cy={70} r={5}
        fill={accent}
        style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        animate={{ cx: [stages[0].x + 140, stages[3].x] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
};
