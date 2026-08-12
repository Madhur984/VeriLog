/**
 * Shared interactive block library for the SEQUENTIAL LOGIC track (dsd 28-42).
 *
 * The `_combo/blocks` of the sequential world. Every visual here is LIVE and
 * COMPUTED - latch/flip-flop next states come from the characteristic equations,
 * counter sequences are iterated, excitation tables are derived, waveforms are
 * generated from the same logic - so a student can never read a wrong value.
 *
 * Only depends on the shared kit primitives (`tone`, `useSubLang`, `Card`) so it
 * stays theme-aware + bilingual exactly like the rest of the track. Each module's
 * `scenes.tsx` composes these + its own bespoke visuals on top.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { tone, useSubLang, Card } from '../_subtractor/kit';

/* ═══════════════════════ flip-flop logic (single source of truth) ═══════════════════════ */

export type FFType = 'SR' | 'D' | 'JK' | 'T';

/** Next state Q(t+1). Returns -1 for the SR forbidden input (S=R=1). a,b are the
 *  two inputs: SR→(S,R), JK→(J,K), D→(D,-), T→(T,-). */
export function ffNext(type: FFType, q: number, a: number, b = 0): number {
  switch (type) {
    case 'D':  return a & 1;
    case 'T':  return (a & 1) ^ q;
    case 'SR': return a && b ? -1 : a ? 1 : b ? 0 : q;
    case 'JK': return (a & (q ^ 1)) | ((b ^ 1) & q);   // J·Q' + K'·Q
  }
}

/** Inputs a flip-flop of `type` needs to move Q→Qn (excitation). 'x' = don't-care. */
export function ffExcite(type: FFType, q: number, qn: number): (string)[] {
  if (type === 'D') return [String(qn)];
  if (type === 'T') return [String(q ^ qn)];
  if (type === 'SR') {
    if (q === 0 && qn === 0) return ['0', 'x'];
    if (q === 0 && qn === 1) return ['1', '0'];
    if (q === 1 && qn === 0) return ['0', '1'];
    return ['x', '0'];
  }
  // JK
  if (q === 0 && qn === 0) return ['0', 'x'];
  if (q === 0 && qn === 1) return ['1', 'x'];
  if (q === 1 && qn === 0) return ['x', '1'];
  return ['x', '0'];
}

export const FF_META: Record<FFType, { inputs: string[]; eq: string; name: string }> = {
  SR: { inputs: ['S', 'R'], eq: "Q(t+1) = S + R'·Q   (S·R = 0)", name: 'SR' },
  D:  { inputs: ['D'],      eq: 'Q(t+1) = D',                    name: 'D' },
  JK: { inputs: ['J', 'K'], eq: "Q(t+1) = J·Q' + K'·Q",          name: 'JK' },
  T:  { inputs: ['T'],      eq: "Q(t+1) = T ⊕ Q",               name: 'T' },
};

/** Symbolic characteristic-table rows (Q+ as 'Q','Q\'','0','1','×'). */
export function ffCharRows(type: FFType): { in: number[]; qn: string }[] {
  const sym = (q0: number, q1: number): string =>
    q0 === 0 && q1 === 1 ? 'Q'
      : q0 === 1 && q1 === 0 ? "Q'"
        : q0 === 0 && q1 === 0 ? '0'
          : q0 === 1 && q1 === 1 ? '1' : '×';
  if (type === 'D' || type === 'T') {
    return [0, 1].map((a) => {
      const r0 = ffNext(type, 0, a), r1 = ffNext(type, 1, a);
      return { in: [a], qn: sym(r0, r1) };
    });
  }
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => {
    const r0 = ffNext(type, 0, a, b), r1 = ffNext(type, 1, a, b);
    return { in: [a, b], qn: r0 === -1 ? '×' : sym(r0, r1) };
  });
}

/* ═══════════════════════ tiny shared controls ═══════════════════════ */

export const Toggle: React.FC<{ label: string; v: number; onClick: () => void; color: string; sub?: string }>
  = ({ label, v, onClick, color, sub }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90">
    <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
    <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
      style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `2px solid ${color}${v ? '' : '66'}` }}>
      {v}
    </span>
    {sub && <span className="font-mono text-[8px] opacity-50">{sub}</span>}
  </button>
);

/** A clock control: a big "tick" button that pulses, plus optional auto-run. Calls
 *  onTick once per rising edge. */
export const ClockButton: React.FC<{ accent: string; onTick: () => void; canAuto?: boolean }>
  = ({ accent, onTick, canAuto = true }) => {
  const { lang } = useSubLang();
  const [run, setRun] = useState(false);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => tickRef.current(), 1100);
    return () => clearInterval(id);
  }, [run]);
  return (
    <div className="flex items-center justify-center gap-3">
      <button onClick={onTick}
        className="flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
        style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
        <Zap size={16} /> {lang === 'hi' ? 'CLK ▲ टिक' : 'CLK ▲ tick'}
      </button>
      {canAuto && (
        <button onClick={() => setRun((r) => !r)}
          className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: run ? accent : `${accent}55`, color: accent, background: run ? `${accent}1a` : 'transparent' }}>
          {run ? (lang === 'hi' ? '⏸ रोकें' : '⏸ stop') : (lang === 'hi' ? '▶ auto' : '▶ auto')}
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════ clock waveform ═══════════════════════ */

export const ClockWave: React.FC<{ isDarkMode: boolean; accent: string; cycles?: number; edge?: 'rising' | 'falling' | 'none'; label?: string }>
  = ({ isDarkMode, accent, cycles = 4, edge = 'rising', label = 'CLK' }) => {
  const t = tone(isDarkMode);
  const w = 60, h = 26, top = 8, bot = 34;
  // build the square-wave path: each cycle = low half then high half
  let d = `M8,${bot}`;
  const pts: { x: number; kind: 'rise' | 'fall' }[] = [];
  for (let i = 0; i < cycles; i++) {
    const x0 = 8 + i * w, xm = x0 + w / 2, x1 = x0 + w;
    d += ` H${xm} V${top} H${x1} V${bot}`;
    pts.push({ x: xm, kind: 'rise' });
    pts.push({ x: x1, kind: 'fall' });
  }
  const total = 8 + cycles * w + 8;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${total} 52`} className="mx-auto w-full" style={{ maxWidth: total }}>
        <text x="2" y="26" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>{label}</text>
        <path d={d} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" transform="translate(24,0)" />
        {edge !== 'none' && pts.filter((p) => p.kind === edge.slice(0, 4) as 'rise' | 'fall' || (edge === 'rising' && p.kind === 'rise') || (edge === 'falling' && p.kind === 'fall'))
          .map((p, i) => (
            <g key={i} transform="translate(24,0)">
              <line x1={p.x} y1={top - 4} x2={p.x} y2={bot + 4} stroke={t.faint as string} strokeWidth="1" strokeDasharray="2 2" />
              <path d={`M${p.x - 4},${edge === 'rising' ? top + 2 : bot - 2} L${p.x},${edge === 'rising' ? top - 4 : bot + 4} L${p.x + 4},${edge === 'rising' ? top + 2 : bot - 2}`}
                fill="none" stroke={accent} strokeWidth="2" />
            </g>
          ))}
      </svg>
    </div>
  );
};

/* ═══════════════════════ generic timing diagram ═══════════════════════ */

export interface WaveSignal { name: string; values: number[]; color?: string }

/** Aligned multi-track digital waveform. Each signal is an array of 0/1 samples;
 *  all must be the same length. A clock track is drawn on top automatically. */
export const TimingDiagram: React.FC<{ isDarkMode: boolean; accent: string; signals: WaveSignal[]; showClock?: boolean; cursor?: number }>
  = ({ isDarkMode, accent, signals, showClock = true, cursor }) => {
  const t = tone(isDarkMode);
  const n = signals[0]?.values.length ?? 0;
  const step = 40, top = 6, hi = 6, lo = 24, rowH = 40, lblW = 46, x0 = lblW + 6;
  const width = x0 + n * step + 10;
  const wavePath = (vals: number[], yTop: number, yBot: number): string => {
    let d = `M${x0},${vals[0] ? yTop : yBot}`;
    for (let i = 0; i < vals.length; i++) {
      const xa = x0 + i * step, xb = xa + step;
      const y = vals[i] ? yTop : yBot;
      d += ` L${xa},${y} L${xb},${y}`;
      if (i < vals.length - 1 && vals[i] !== vals[i + 1]) d += ` L${xb},${vals[i + 1] ? yTop : yBot}`;
    }
    return d;
  };
  const rows: WaveSignal[] = showClock
    ? [{ name: 'CLK', values: Array.from({ length: n }, (_, i) => i % 2), color: accent }, ...signals]
    : signals;
  const height = rows.length * rowH + 8;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full" style={{ maxWidth: Math.max(width, 320) }}>
        {rows.map((s, r) => {
          const yTop = top + r * rowH + hi, yBot = top + r * rowH + lo;
          const col = s.color ?? (r === 0 && showClock ? accent : (t.ink as string));
          return (
            <g key={s.name}>
              <text x="2" y={yBot} fontFamily="monospace" fontSize="10" fontWeight="800" fill={col}>{s.name}</text>
              <path d={wavePath(s.values, yTop, yBot)} fill="none" stroke={col} strokeWidth="2.2" />
            </g>
          );
        })}
        {typeof cursor === 'number' && cursor >= 0 && (
          <line x1={x0 + cursor * step + step / 2} y1={0} x2={x0 + cursor * step + step / 2} y2={height}
            stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" opacity={0.7} />
        )}
      </svg>
    </div>
  );
};

/* ═══════════════════════ flip-flop symbol + live viz ═══════════════════════ */

/** A drawn flip-flop box with the edge-trigger clock triangle and live Q / Q'. */
const FFSymbol: React.FC<{ type: FFType; q: number; accent: string; isDarkMode: boolean; inA: number; inB?: number }>
  = ({ type, q, accent, isDarkMode, inA, inB }) => {
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [la, lb] = FF_META[type].inputs;
  const two = FF_META[type].inputs.length === 2;
  return (
    <svg viewBox="0 0 150 110" className="w-full max-w-[220px]">
      {/* input wires */}
      <line x1="6" y1={two ? 32 : 55} x2="40" y2={two ? 32 : 55} stroke={inA ? accent : dim} strokeWidth="3" />
      <text x="4" y={two ? 26 : 49} fontFamily="monospace" fontSize="11" fontWeight="800" fill={inA ? accent : dim}>{la}</text>
      {two && <>
        <line x1="6" y1="78" x2="40" y2="78" stroke={inB ? accent : dim} strokeWidth="3" />
        <text x="4" y="72" fontFamily="monospace" fontSize="11" fontWeight="800" fill={inB ? accent : dim}>{lb}</text>
      </>}
      {/* clock input with edge triangle */}
      <line x1="6" y1="95" x2="40" y2="95" stroke={dim} strokeWidth="2.5" />
      <path d="M40,90 L48,95 L40,100 Z" fill="none" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.6" />
      <text x="52" y="99" fontFamily="monospace" fontSize="8" fill={isDarkMode ? '#94a3b8' : '#475569'}>CLK</text>
      {/* body */}
      <rect x="40" y="16" width="70" height="86" rx="8" fill={box} stroke={accent} strokeWidth="2.5" />
      <text x="75" y="60" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="800" fill={accent}>{FF_META[type].name}</text>
      <text x="75" y="74" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>FF</text>
      {/* outputs */}
      <line x1="110" y1="36" x2="144" y2="36" stroke={q ? accent : dim} strokeWidth="3" />
      <text x="128" y="30" fontFamily="monospace" fontSize="11" fontWeight="800" fill={q ? accent : dim}>Q={q}</text>
      <line x1="110" y1="82" x2="144" y2="82" stroke={q ? dim : accent} strokeWidth="3" />
      <text x="124" y="98" fontFamily="monospace" fontSize="10" fontWeight="800" fill={q ? dim : accent}>Q'={q ^ 1}</text>
    </svg>
  );
};

/** The workhorse: an edge-triggered flip-flop you drive by hand. Toggle the inputs,
 *  press the clock, and Q updates by the characteristic equation. Keeps a rolling
 *  waveform of the last few ticks. */
export const FlipFlopViz: React.FC<{ isDarkMode: boolean; accent: string; type: FFType; initialQ?: number }>
  = ({ isDarkMode, accent, type, initialQ = 0 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const two = FF_META[type].inputs.length === 2;
  const [a, setA] = useState(type === 'JK' ? 1 : 1);
  const [b, setB] = useState(1);
  const [q, setQ] = useState(initialQ);
  const [hist, setHist] = useState<{ a: number; b: number; q: number }[]>([{ a, b, q }]);
  const preview = ffNext(type, q, a, two ? b : 0);
  const invalid = preview === -1;

  const tick = () => {
    const nx = ffNext(type, q, a, two ? b : 0);
    const nq = nx === -1 ? q : nx;                     // forbidden → don't move
    setQ(nq);
    setHist((h) => [...h.slice(-7), { a, b, q: nq }]);
  };

  const waves: WaveSignal[] = [
    { name: FF_META[type].inputs[0], values: hist.map((x) => x.a), color: '#38bdf8' },
    ...(two ? [{ name: FF_META[type].inputs[1], values: hist.map((x) => x.b), color: '#fb7185' }] : []),
    { name: 'Q', values: hist.map((x) => x.q), color: '#34d399' },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>{type} flip-flop · live</span>
        <span className={`font-mono text-[11px] ${t.faint}`}>{FF_META[type].eq}</span>
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
        <FFSymbol type={type} q={q} accent={accent} isDarkMode={isDarkMode} inA={a} inB={b} />
        <div className="flex items-center gap-4">
          <Toggle label={FF_META[type].inputs[0]} v={a} onClick={() => setA(a ^ 1)} color="#38bdf8" />
          {two && <Toggle label={FF_META[type].inputs[1]} v={b} onClick={() => setB(b ^ 1)} color="#fb7185" />}
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[11px] ${t.faint}`}>Q(t)</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
              style={{ background: q ? '#34d399' : 'transparent', color: q ? '#000' : '#34d399', border: '2px solid #34d399' }}>{q}</span>
          </div>
        </div>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {invalid
          ? <span style={{ color: '#fb7185' }}>{lang === 'hi' ? "S=R=1 निषिद्ध — Q नहीं बदलेगा" : 'S=R=1 forbidden — Q will not move'}</span>
          : <>Q(t+1) = <b style={{ color: '#34d399' }}>{preview}</b> {lang === 'hi' ? '(अगली CLK ▲ पर)' : '(on the next CLK ▲)'}</>}
      </p>
      <div className="mt-3"><TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={waves} /></div>
    </Card>
  );
};

/* ═══════════════════════ SR latch (cross-coupled NOR/NAND) ═══════════════════════ */

export const SRLatchViz: React.FC<{ isDarkMode: boolean; accent: string; gate?: 'NOR' | 'NAND' }>
  = ({ isDarkMode, accent, gate = 'NOR' }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [s, setS] = useState(0);
  const [r, setR] = useState(0);
  const [q, setQ] = useState(1);
  // NOR latch: active-high S/R. NAND latch: active-low (S'/R'), invalid at 0,0.
  const forbidden = gate === 'NOR' ? (s === 1 && r === 1) : (s === 0 && r === 0);
  const apply = (ns: number, nr: number) => {
    setS(ns); setR(nr);
    if (gate === 'NOR') {
      if (ns === 1 && nr === 0) setQ(1);
      else if (ns === 0 && nr === 1) setQ(0);
      // 0,0 hold; 1,1 forbidden → leave as-is (Q=Q'=0 conceptually)
    } else {
      if (ns === 0 && nr === 1) setQ(1);        // S' low sets
      else if (ns === 1 && nr === 0) setQ(0);   // R' low resets
    }
  };
  const qbar = forbidden ? 0 : q ^ 1;
  const [lblS, lblR] = gate === 'NOR' ? ['S', 'R'] : ["S'", "R'"];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {gate === 'NOR' ? 'NOR' : 'NAND'} {lang === 'hi' ? 'SR latch · live' : 'SR latch · live'}
      </div>
      <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-lg">
        {/* two cross-coupled gates */}
        {[{ y: 34, out: q, lbl: 'Q', inTop: gate === 'NOR' ? r : s }, { y: 104, out: qbar, lbl: "Q'", inTop: gate === 'NOR' ? s : r }].map((g, i) => (
          <g key={i}>
            <path d={gate === 'NOR' ? `M120,${g.y - 22} q34,0 52,22 q-18,22 -52,22 q10,-22 0,-44 Z` : `M120,${g.y - 22} h34 a22,22 0 0 1 0,44 h-34 Z`}
              fill={box} stroke={accent} strokeWidth="2.2" />
            {gate === 'NAND' && <circle cx="178" cy={g.y} r="4" fill={box} stroke={accent} strokeWidth="2" />}
            <text x="140" y={g.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>{gate}</text>
            <line x1={gate === 'NAND' ? 182 : 174} y1={g.y} x2="250" y2={g.y} stroke={g.out ? accent : dim} strokeWidth="3" />
            <text x="256" y={g.y + 4} fontFamily="monospace" fontSize="12" fontWeight="800" fill={g.out ? accent : dim}>{g.lbl}={g.out}</text>
          </g>
        ))}
        {/* external inputs */}
        <line x1="20" y1="20" x2="120" y2="20" stroke={s ? accent : dim} strokeWidth="2.5" />
        <line x1="120" y1="20" x2="120" y2="18" stroke={s ? accent : dim} strokeWidth="2.5" />
        <text x="6" y="24" fontFamily="monospace" fontSize="11" fontWeight="800" fill={s ? accent : dim}>{lblS}</text>
        <line x1="20" y1="130" x2="120" y2="130" stroke={r ? accent : dim} strokeWidth="2.5" />
        <text x="6" y="134" fontFamily="monospace" fontSize="11" fontWeight="800" fill={r ? accent : dim}>{lblR}</text>
        {/* cross-coupling feedback */}
        <path d="M250,34 q28,0 28,35 q0,35 -104,35" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="4 3" />
        <path d="M250,104 q28,0 28,-35 q0,-35 -104,-35" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="4 3" />
      </svg>
      <div className="mt-2 flex items-center justify-center gap-4">
        <Toggle label={lblS} v={s} onClick={() => apply(s ^ 1, r)} color={accent} />
        <Toggle label={lblR} v={r} onClick={() => apply(s, r ^ 1)} color={accent} />
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {forbidden
          ? <span style={{ color: '#fb7185' }}>{lang === 'hi' ? 'निषिद्ध input — Q और Q\' दोनों एक जैसे!' : "forbidden input — Q and Q' both driven the same!"}</span>
          : (s === 0 && r === 0) || (gate === 'NAND' && s === 1 && r === 1)
            ? <>{lang === 'hi' ? 'HOLD — पिछली स्थिति याद है' : 'HOLD — the last state is remembered'}: Q=<b style={{ color: accent }}>{q}</b></>
            : <>Q=<b style={{ color: accent }}>{q}</b>, Q'=<b style={{ color: accent }}>{qbar}</b></>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ gated D latch (level-sensitive) ═══════════════════════ */

export const DLatchViz: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [d, setD] = useState(1);
  const [en, setEn] = useState(1);
  const [q, setQ] = useState(0);
  // level-sensitive: while EN=1, Q transparently follows D; EN=0 holds.
  useEffect(() => { if (en) setQ(d); }, [en, d]);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'gated D latch · transparent जब EN=1' : 'gated D latch · transparent when EN=1'}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox="0 0 160 100" className="w-full max-w-[220px]">
          <line x1="4" y1="30" x2="44" y2="30" stroke={d ? accent : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
          <text x="2" y="24" fontFamily="monospace" fontSize="11" fontWeight="800" fill={accent}>D={d}</text>
          <line x1="4" y1="70" x2="44" y2="70" stroke={en ? '#34d399' : '#fb7185'} strokeWidth="3" />
          <text x="2" y="86" fontFamily="monospace" fontSize="11" fontWeight="800" fill={en ? '#34d399' : '#fb7185'}>EN={en}</text>
          <rect x="44" y="14" width="66" height="72" rx="8" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.5" />
          <text x="77" y="46" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>D</text>
          <text x="77" y="62" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={isDarkMode ? '#334155' : '#94a3b8'}>latch</text>
          <line x1="110" y1="36" x2="150" y2="36" stroke={q ? accent : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
          <text x="118" y="30" fontFamily="monospace" fontSize="11" fontWeight="800" fill={q ? accent : (isDarkMode ? '#334155' : '#cbd5e1')}>Q={q}</text>
        </svg>
        <div className="flex items-center gap-4">
          <Toggle label="D" v={d} onClick={() => setD(d ^ 1)} color={accent} />
          <Toggle label="EN" v={en} onClick={() => setEn(en ^ 1)} color="#34d399" />
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {en
          ? <span style={{ color: '#34d399' }}>{lang === 'hi' ? 'EN=1 → खुला: Q, D को copy करता है' : 'EN=1 → open: Q copies D'}</span>
          : <span style={{ color: '#fb7185' }}>{lang === 'hi' ? `EN=0 → बंद: Q=${q} जमा हुआ` : `EN=0 → closed: Q=${q} is frozen`}</span>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ shift register ═══════════════════════ */

export const ShiftRegisterViz: React.FC<{ isDarkMode: boolean; accent: string; stages?: number }>
  = ({ isDarkMode, accent, stages = 4 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [cells, setCells] = useState<number[]>(Array(stages).fill(0));
  const [serialIn, setSerialIn] = useState(1);
  const shift = () => setCells((c) => [serialIn, ...c.slice(0, stages - 1)]);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? `${stages}-bit shift register (SIPO)` : `${stages}-bit shift register (SIPO)`}
      </div>
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div className="mr-1 flex flex-col items-center">
          <span className={`font-mono text-[9px] ${t.faint}`}>{lang === 'hi' ? 'serial in' : 'serial in'}</span>
          <button onClick={() => setSerialIn(serialIn ^ 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black active:scale-90"
            style={{ background: serialIn ? accent : 'transparent', color: serialIn ? '#000' : accent, border: `2px solid ${accent}` }}>{serialIn}</button>
        </div>
        {cells.map((c, i) => (
          <React.Fragment key={i}>
            <span className="opacity-30">→</span>
            <div className="flex flex-col items-center gap-1">
              <span className={`font-mono text-[9px] ${t.faint}`}>Q{i}</span>
              <motion.div key={`${i}-${c}`} initial={{ scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-lg font-black"
                style={{ background: c ? accent : 'transparent', color: c ? '#000' : accent, border: `2px solid ${accent}${c ? '' : '55'}` }}>{c}</motion.div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={shift} /></div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi' ? 'हर CLK ▲ पर हर bit एक stage दाईं ओर सरकता है' : 'on each CLK ▲ every bit slides one stage right'} · Q = {cells.join(' ')}
      </p>
    </Card>
  );
};

/* ═══════════════════════ counter (ripple / synchronous) ═══════════════════════ */

export const CounterViz: React.FC<{ isDarkMode: boolean; accent: string; bits?: number; dir?: 'up' | 'down'; mod?: number; mode?: 'ripple' | 'sync' }>
  = ({ isDarkMode, accent, bits = 3, dir = 'up', mod, mode = 'sync' }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const modulus = mod ?? (1 << bits);
  const [count, setCount] = useState(0);
  const tick = () => setCount((c) => {
    const nx = dir === 'up' ? c + 1 : c - 1 + modulus;
    return nx % modulus;
  });
  const arr = Array.from({ length: bits }, (_, i) => (count >> (bits - 1 - i)) & 1);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          MOD-{modulus} {dir} · {mode}
        </span>
        <span className={`font-mono text-[11px] ${t.faint}`}>{mode === 'ripple' ? (lang === 'hi' ? 'हर FF अगले को clock करता है' : 'each FF clocks the next') : (lang === 'hi' ? 'सब FF एक ही clock' : 'all FFs share one clock')}</span>
      </div>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {arr.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[9px] ${t.faint}`}>Q{bits - 1 - i}</span>
            <motion.div key={`${i}-${b}`} initial={{ rotateX: mode === 'ripple' ? -60 : 0, opacity: 0.5 }} animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: mode === 'ripple' ? i * 0.08 : 0 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-xl font-black"
              style={{ background: b ? accent : 'transparent', color: b ? '#000' : accent, border: `2px solid ${accent}${b ? '' : '55'}` }}>{b}</motion.div>
          </div>
        ))}
        <span className={`mx-1 self-center font-mono text-2xl font-black ${t.faint}`}>=</span>
        <span className="self-center font-mono text-3xl font-black tabular-nums" style={{ color: accent }}>{count}</span>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi' ? `गिनती ${dir === 'up' ? 'बढ़ती' : 'घटती'} है 0…${modulus - 1}, फिर wrap` : `counts ${dir} through 0…${modulus - 1}, then wraps`}
      </p>
    </Card>
  );
};

/* ═══════════════════════ state diagram + state table ═══════════════════════ */

export interface FSMState { id: string; label: string; x: number; y: number }
export interface FSMEdge { from: string; to: string; label: string; curve?: number }

/** A small FSM state-diagram renderer. `active` highlights a state node. Edges are
 *  quadratic curves with an arrowhead + a label; self-loops draw a top loop. */
export const StateDiagram: React.FC<{ isDarkMode: boolean; accent: string; states: FSMState[]; edges: FSMEdge[]; active?: string; width?: number; height?: number }>
  = ({ isDarkMode, accent, states, edges, active, width = 320, height = 200 }) => {
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const R = 22;
  const at = (id: string) => states.find((s) => s.id === id)!;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full" style={{ maxWidth: width }}>
        <defs>
          <marker id={`arrow-${accent.replace('#', '')}`} markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill={accent} />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = at(e.from), b = at(e.to);
          if (e.from === e.to) {
            const lx = a.x, ly = a.y - R;
            return (
              <g key={i}>
                <path d={`M${lx - 8},${ly} Q${lx},${ly - 30} ${lx + 8},${ly}`} fill="none" stroke={dim} strokeWidth="1.8"
                  markerEnd={`url(#arrow-${accent.replace('#', '')})`} />
                <text x={lx} y={ly - 30} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill={t.sub as string}>{e.label}</text>
              </g>
            );
          }
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - (e.curve ?? 26);
          const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
          const bx = b.x - (dx / len) * R, by = b.y - (dy / len) * R;
          return (
            <g key={i}>
              <path d={`M${a.x},${a.y} Q${mx},${my} ${bx},${by}`} fill="none" stroke={dim} strokeWidth="1.8"
                markerEnd={`url(#arrow-${accent.replace('#', '')})`} />
              <text x={mx} y={my + 2} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill={t.sub as string}>{e.label}</text>
            </g>
          );
        })}
        {states.map((s) => {
          const on = s.id === active;
          return (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={R} fill={on ? accent : box} stroke={accent} strokeWidth={on ? 3 : 2} />
              <text x={s.x} y={s.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={on ? '#000' : accent}>{s.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** Generic state / transition table with an optional highlighted row. */
export const StateTable: React.FC<{ isDarkMode: boolean; accent: string; headers: string[]; rows: (string | number)[][]; highlight?: number; note?: string }>
  = ({ isDarkMode, accent, headers, rows, highlight, note }) => {
  const t = tone(isDarkMode);
  return (
    <div className={`overflow-hidden rounded-3xl border ${t.card}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center font-mono">
          <thead>
            <tr>{headers.map((h, i) => (
              <th key={i} className="px-3 py-2.5 text-[13px] font-black" style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={ri === highlight ? { background: `${accent}18` } : undefined}>
                {r.map((c, ci) => (
                  <td key={ci} className={`px-3 py-2 text-[14px] font-bold ${t.text}`}
                    style={{ borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <div className={`px-4 py-2.5 text-[12px] ${t.faint}`} style={{ borderTop: `1px solid ${accent}22` }}>{note}</div>}
    </div>
  );
};

/* ═══════════════════════ excitation / characteristic table helpers ═══════════════════════ */

/** Renders the characteristic table of a flip-flop type (all computed). */
export const CharTable: React.FC<{ isDarkMode: boolean; accent: string; type: FFType }>
  = ({ isDarkMode, accent, type }) => {
  const rows = ffCharRows(type).map((r) => [...r.in, r.qn]);
  return <StateTable isDarkMode={isDarkMode} accent={accent}
    headers={[...FF_META[type].inputs, 'Q(t+1)']} rows={rows} note={FF_META[type].eq} />;
};

/** Renders the excitation table of a flip-flop type (Q, Q(t+1) → required inputs). */
export const ExciteTable: React.FC<{ isDarkMode: boolean; accent: string; type: FFType }>
  = ({ isDarkMode, accent, type }) => {
  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([q, qn]) => [q, qn, ...ffExcite(type, q, qn)]);
  return <StateTable isDarkMode={isDarkMode} accent={accent}
    headers={['Q(t)', 'Q(t+1)', ...FF_META[type].inputs]} rows={rows} note="x = don't-care" />;
};
