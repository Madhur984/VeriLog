/**
 * Shared interactive primitives for the COMBINATIONAL BUILDING BLOCKS track
 * (DSD modules 21-27: MUX, DEMUX, decoder, encoder, code converters, Shannon /
 * universal logic, array divider).
 *
 * Every output is COMPUTED in code from the live inputs - never hardcoded - so
 * the routing, one-hot lines, encoded codes, conversions and quotients always
 * agree with the boolean algebra. Theme-aware (isDarkMode + accent), bilingual
 * via useSubLang, framer-motion for the routing/selection animations. The
 * generic scenes, LiveGate, TruthTable, StepThrough and Prose come from the
 * shared _subtractor kit; only block-specific visuals live here.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { tone, useSubLang, Card } from '../_subtractor/kit';

const DIM = (d: boolean) => (d ? '#334155' : '#cbd5e1');

/* a clickable 0/1 bit */
export const BitToggle: React.FC<{
  value: number; onClick?: () => void; color: string; label?: string; sub?: string; size?: number;
}> = ({ value, onClick, color, label, sub, size = 40 }) => (
  <button
    type="button" onClick={onClick} disabled={!onClick}
    className={`flex flex-col items-center gap-1 ${onClick ? 'active:scale-90' : 'cursor-default'}`}
  >
    {label && <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>}
    <motion.span
      key={value}
      initial={{ scale: 0.8 }} animate={{ scale: 1 }}
      className="flex items-center justify-center rounded-lg font-mono text-lg font-black tabular-nums"
      style={{ width: size, height: size, background: value ? color : 'transparent', color: value ? '#000' : color, border: `2px solid ${color}${value ? '' : '66'}` }}
    >
      {value}
    </motion.span>
    {sub && <span className="font-mono text-[9px] opacity-60">{sub}</span>}
  </button>
);

const fromBits = (bits: number[]) => bits.reduce((a, b) => a * 2 + b, 0); // MSB first
const toBits = (n: number, w: number) => Array.from({ length: w }, (_, i) => (n >> (w - 1 - i)) & 1);

/* ───────────────────────── MULTIPLEXER ─────────────────────────── */
// 2^k inputs -> 1 output, k select lines. Toggle the inputs and the select
// lines; the chosen input is routed (highlighted) to Y. Y = inputs[sel].

export const MuxViz: React.FC<{ isDarkMode: boolean; accent: string; inputs?: 2 | 4 | 8 }>
  = ({ isDarkMode, accent, inputs = 4 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const k = Math.log2(inputs);
  const [inVals, setInVals] = useState<number[]>(() => Array.from({ length: inputs }, (_, i) => i % 2));
  const [sel, setSel] = useState<number[]>(() => Array(k).fill(0));
  const selIdx = fromBits(sel);
  const Y = inVals[selIdx];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {inputs}-to-1 MUX {lang === 'hi' ? '· input चुनिए' : '· pick an input'}
      </div>
      <div className="flex items-center justify-center gap-4">
        {/* inputs */}
        <div className="flex flex-col gap-2">
          {inVals.map((v, i) => {
            const active = i === selIdx;
            return (
              <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all"
                style={{ background: active ? `${accent}1a` : 'transparent', border: active ? `1px solid ${accent}` : '1px solid transparent' }}>
                <BitToggle value={v} onClick={() => setInVals((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} color={active ? accent : DIM(isDarkMode)} size={32} />
                <span className="font-mono text-[11px]" style={{ color: active ? accent : (t.faint as string) }}>I{i}</span>
                {active && <motion.span layoutId="muxsel" className="font-mono text-[12px]" style={{ color: accent }}>→</motion.span>}
              </div>
            );
          })}
        </div>
        {/* body */}
        <svg viewBox="0 0 90 120" className="w-[80px]">
          <polygon points="10,10 60,30 60,90 10,110" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.5" />
          <text x="30" y="56" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={accent}>{inputs}:1</text>
          <text x="30" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>MUX</text>
          <motion.line key={Y} x1="60" y1="60" x2="88" y2="60" stroke={Y ? accent : DIM(isDarkMode)} strokeWidth="3"
            animate={{ opacity: Y ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: Y ? Infinity : 0, duration: 1.2 }} />
        </svg>
        {/* output */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px]" style={{ color: accent }}>Y</span>
          <BitToggle value={Y} color={accent} size={44} />
        </div>
      </div>
      {/* select lines */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'select' : 'select'}</span>
        {sel.map((s, i) => (
          <BitToggle key={i} value={s} onClick={() => setSel((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} color="#f59e0b" label={`S${k - 1 - i}`} size={32} />
        ))}
        <span className="font-mono text-[12px] font-black" style={{ color: '#f59e0b' }}>= {selIdx}</span>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        sel = {selIdx} {'->'} Y = <b style={{ color: accent }}>I{selIdx} = {Y}</b>
      </p>
    </Card>
  );
};

/* ───────────────────────── DEMULTIPLEXER ───────────────────────── */
// 1 input D -> 2^k outputs; only the selected output carries D, the rest are 0.

export const DemuxViz: React.FC<{ isDarkMode: boolean; accent: string; outputs?: 2 | 4 | 8 }>
  = ({ isDarkMode, accent, outputs = 4 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const k = Math.log2(outputs);
  const [D, setD] = useState(1);
  const [sel, setSel] = useState<number[]>(() => Array(k).fill(0));
  const selIdx = fromBits(sel);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        1-to-{outputs} DEMUX {lang === 'hi' ? '· कहाँ भेजें?' : '· route it'}
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px]" style={{ color: accent }}>D</span>
          <BitToggle value={D} onClick={() => setD((v) => v ^ 1)} color={accent} size={44} />
        </div>
        <svg viewBox="0 0 90 120" className="w-[80px]">
          <polygon points="30,30 80,10 80,110 30,90" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.5" />
          <text x="58" y="60" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>1:{outputs}</text>
          <line x1="2" y1="60" x2="30" y2="60" stroke={D ? accent : DIM(isDarkMode)} strokeWidth="3" />
        </svg>
        <div className="flex flex-col gap-2">
          {Array.from({ length: outputs }, (_, i) => {
            const active = i === selIdx;
            const out = active ? D : 0;
            return (
              <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1"
                style={{ background: active ? `${accent}1a` : 'transparent', border: active ? `1px solid ${accent}` : '1px solid transparent' }}>
                <span className="font-mono text-[11px]" style={{ color: active ? accent : (t.faint as string) }}>Y{i}</span>
                <BitToggle value={out} color={active ? accent : DIM(isDarkMode)} size={30} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>select</span>
        {sel.map((s, i) => (
          <BitToggle key={i} value={s} onClick={() => setSel((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} color="#f59e0b" label={`S${k - 1 - i}`} size={32} />
        ))}
        <span className="font-mono text-[12px] font-black" style={{ color: '#f59e0b' }}>= {selIdx}</span>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        Y{selIdx} = D = <b style={{ color: accent }}>{D}</b>, {lang === 'hi' ? 'बाक़ी सब 0' : 'all others = 0'}
      </p>
    </Card>
  );
};

/* ───────────────────────── DECODER ─────────────────────────────── */
// n address bits -> 2^n one-hot outputs; exactly one line is HIGH.

export const DecoderViz: React.FC<{ isDarkMode: boolean; accent: string; bits?: 2 | 3 }>
  = ({ isDarkMode, accent, bits = 2 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const n = 1 << bits;
  const [addr, setAddr] = useState<number[]>(() => Array(bits).fill(0));
  const idx = fromBits(addr);
  const minterm = (i: number) => addr.map((_, p) => `${'ABCD'[p]}${(i >> (bits - 1 - p)) & 1 ? '' : "'"}`).join('.');

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {bits}-to-{n} decoder {lang === 'hi' ? '· one-hot' : '· one-hot'}
      </div>
      <div className="flex items-center justify-center gap-3">
        <BitToggle value={addr[0]} onClick={() => setAddr((a) => a.map((x, j) => (j === 0 ? x ^ 1 : x)))} color="#f59e0b" label="A" size={36} />
        <BitToggle value={addr[1]} onClick={() => setAddr((a) => a.map((x, j) => (j === 1 ? x ^ 1 : x)))} color="#f59e0b" label="B" size={36} />
        {bits === 3 && <BitToggle value={addr[2]} onClick={() => setAddr((a) => a.map((x, j) => (j === 2 ? x ^ 1 : x)))} color="#f59e0b" label="C" size={36} />}
        <span className="font-mono text-[12px] font-black" style={{ color: '#f59e0b' }}>= {idx}</span>
      </div>
      <div className={`mx-auto mt-4 grid gap-2`} style={{ gridTemplateColumns: `repeat(${Math.min(n, 4)}, minmax(0,1fr))` }}>
        {Array.from({ length: n }, (_, i) => {
          const on = i === idx;
          return (
            <motion.div key={i} animate={{ scale: on ? 1.04 : 1 }}
              className="flex flex-col items-center gap-1 rounded-xl border p-2"
              style={{ borderColor: on ? accent : `${DIM(isDarkMode)}66`, background: on ? `${accent}1a` : 'transparent' }}>
              <span className="font-mono text-[10px]" style={{ color: on ? accent : (t.faint as string) }}>D{i}</span>
              <BitToggle value={on ? 1 : 0} color={on ? accent : DIM(isDarkMode)} size={28} />
              <span className="font-mono text-[8px]" style={{ color: on ? accent : (t.faint as string) }}>{minterm(i)}</span>
            </motion.div>
          );
        })}
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi' ? 'सिर्फ़' : 'only'} D{idx} = 1 {'->'} D{idx} = <b style={{ color: accent }}>{minterm(idx)}</b> ({lang === 'hi' ? 'इसका minterm' : 'its minterm'})
      </p>
    </Card>
  );
};

/* ───────────────────────── PRIORITY ENCODER ────────────────────── */
// 4 input "voting booth" lines; output the binary index of the HIGHEST active
// line + a valid bit. Demonstrates why priority + valid are needed.

export const EncoderViz: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState<number[]>([0, 0, 0, 0]); // D0..D3
  const highest = [3, 2, 1, 0].find((i) => D[i] === 1);
  const valid = highest !== undefined ? 1 : 0;
  const A1 = valid && (highest as number) >= 2 ? 1 : 0;
  const A0 = valid && ((highest as number) & 1) ? 1 : 0;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        4-to-2 priority encoder {lang === 'hi' ? '· voting booth' : '· voting booth'}
      </div>
      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col gap-2">
          {[3, 2, 1, 0].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1"
              style={{ background: highest === i ? `${accent}1a` : 'transparent', border: highest === i ? `1px solid ${accent}` : '1px solid transparent' }}>
              <BitToggle value={D[i]} onClick={() => setD((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} color={highest === i ? accent : '#38bdf8'} label={`D${i}`} size={30} />
              {highest === i && <span className="font-mono text-[10px] font-black" style={{ color: accent }}>{lang === 'hi' ? 'जीता' : 'wins'}</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[10px] ${t.faint}`}>code</span>
          <div className="flex gap-2">
            <BitToggle value={A1} color={accent} label="A1" size={40} />
            <BitToggle value={A0} color={accent} label="A0" size={40} />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[10px]" style={{ color: valid ? '#34d399' : '#fb7185' }}>V</span>
            <BitToggle value={valid} color={valid ? '#34d399' : '#fb7185'} size={26} />
          </div>
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {valid
          ? <>{lang === 'hi' ? 'सबसे ऊँची active line' : 'highest active line'} D{highest} {'->'} <b style={{ color: accent }}>{A1}{A0}</b>, V=1</>
          : <>{lang === 'hi' ? 'कोई input नहीं - V=0, output का कोई मतलब नहीं' : 'no input active - V=0, output is meaningless'}</>}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>A1 = D3 + D2 · A0 = D3 + D1.D2'</p>
    </Card>
  );
};

/* ───────────────────────── CODE CONVERTER ──────────────────────── */
// One 4-bit value, shown live in Binary, Gray (g_i = b_i ^ b_{i+1}), BCD, and
// Excess-3 (value + 3). The Gray XOR chain is drawn out.

export const CodeConverter: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [b, setB] = useState<number[]>([0, 1, 0, 1]); // b3 b2 b1 b0
  const val = fromBits(b);
  const gray = [b[0], b[0] ^ b[1], b[1] ^ b[2], b[2] ^ b[3]];
  const xs3 = val <= 12 ? toBits(val + 3, 4) : null; // excess-3 of a decimal digit
  const bcdValid = val <= 9;

  const Row: React.FC<{ label: string; bits: number[]; note?: string }> = ({ label, bits, note }) => (
    <div className="flex items-center gap-3">
      <span className="w-20 font-mono text-[12px]" style={{ color: accent }}>{label}</span>
      <div className="flex gap-1.5">{bits.map((x, i) => <BitToggle key={i} value={x} color={accent} size={28} />)}</div>
      {note && <span className={`font-mono text-[10px] ${t.faint}`}>{note}</span>}
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'code converter · toggle binary' : 'code converter · toggle binary'}
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 font-mono text-[12px]" style={{ color: accent }}>Binary</span>
        <div className="flex gap-1.5">
          {b.map((x, i) => <BitToggle key={i} value={x} onClick={() => setB((a) => a.map((v, j) => (j === i ? v ^ 1 : v)))} color="#f59e0b" size={32} />)}
        </div>
        <span className="font-mono text-[12px] font-black" style={{ color: '#f59e0b' }}>= {val}</span>
      </div>
      <div className="my-3 h-px w-full" style={{ background: `${accent}22` }} />
      <div className="space-y-2">
        <Row label="Gray" bits={gray} note="g_i = b_i ^ b_{i+1}" />
        <Row label="Excess-3" bits={xs3 ?? [0, 0, 0, 0]} note={xs3 ? 'value + 3' : ''} />
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        BCD: {bcdValid ? <b style={{ color: '#34d399' }}>{lang === 'hi' ? `मान्य digit ${val}` : `valid digit ${val}`}</b> : <b style={{ color: '#fb7185' }}>{lang === 'hi' ? `${val} > 9, BCD में अमान्य` : `${val} > 9, not a BCD digit`}</b>}
      </p>
    </Card>
  );
};

/* ───────────────────────── SHANNON / MUX UNIVERSALITY ──────────── */
// Toggle the 4 truth-table outputs of F(x,y); expand about x:
// F = x'.F0 + x.F1, where F0 = F|x=0 and F1 = F|x=1 feed a 2-to-1 MUX.

export const ShannonExpander: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // F indexed by (x,y): rows 00,01,10,11
  const [F, setF] = useState<number[]>([0, 1, 1, 0]); // default XOR
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const idx = x * 2 + y;
  const out = F[idx];
  // cofactors as functions of y: F0 = {F(00),F(01)}, F1 = {F(10),F(11)}
  const F0 = [F[0], F[1]];
  const F1 = [F[2], F[3]];
  const muxData = x === 0 ? F0[y] : F1[y];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? "Shannon: F = x'·F0 + x·F1" : "Shannon: F = x'·F0 + x·F1"}
      </div>
      {/* truth table - toggle outputs */}
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-1 text-center font-mono text-[12px]">
        <div className={`font-black ${t.faint}`}>x</div><div className={`font-black ${t.faint}`}>y</div><div className="font-black" style={{ color: accent }}>F</div>
        {[0, 1, 2, 3].map((r) => (
          <React.Fragment key={r}>
            <div className={r === idx ? 'font-black' : ''} style={{ color: r === idx ? accent : undefined }}>{r >> 1}</div>
            <div className={r === idx ? 'font-black' : ''} style={{ color: r === idx ? accent : undefined }}>{r & 1}</div>
            <button onClick={() => setF((f) => f.map((v, j) => (j === r ? v ^ 1 : v)))}
              className="mx-auto flex h-7 w-7 items-center justify-center rounded font-black active:scale-90"
              style={{ background: F[r] ? accent : 'transparent', color: F[r] ? '#000' : accent, border: `1.5px solid ${accent}${r === idx ? '' : '66'}` }}>
              {F[r]}
            </button>
          </React.Fragment>
        ))}
      </div>
      {/* the MUX realization */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="flex flex-col gap-2 font-mono text-[11px]">
          <span style={{ color: x === 0 ? accent : (t.faint as string) }}>F0(y={y}) = {F0[y]}</span>
          <span style={{ color: x === 1 ? accent : (t.faint as string) }}>F1(y={y}) = {F1[y]}</span>
        </div>
        <svg viewBox="0 0 70 90" className="w-[60px]">
          <polygon points="8,8 48,26 48,64 8,82" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2" />
          <text x="26" y="48" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>2:1</text>
          <line x1="48" y1="45" x2="68" y2="45" stroke={muxData ? accent : DIM(isDarkMode)} strokeWidth="3" />
        </svg>
        <BitToggle value={muxData} color={accent} label="F" size={40} />
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[12px]">
        <span className={t.faint as string}>select x =</span>
        <BitToggle value={x} onClick={() => setX((v) => v ^ 1)} color="#f59e0b" size={30} />
        <span className={t.faint as string}>y =</span>
        <BitToggle value={y} onClick={() => setY((v) => v ^ 1)} color="#38bdf8" size={30} />
        <span>{'->'} F = <b style={{ color: out === muxData ? '#34d399' : '#fb7185' }}>{muxData}</b></span>
      </div>
      <p className={`mt-2 text-center font-mono text-[11px] ${t.sub}`}>
        {lang === 'hi' ? 'x ही 2-to-1 MUX का select है; F0/F1 cofactors data हैं - इसलिए MUX universal है।' : 'x is the 2-to-1 MUX select; the cofactors F0/F1 are the data - so a MUX is universal.'}
      </p>
    </Card>
  );
};

/* ───────────────────────── NAND UNIVERSALITY ───────────────────── */
// Build NOT / AND / OR from NAND only, all computed live.

export const NandUniversal: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const nand = (p: number, q: number) => (p & q) ^ 1;
  const NOT = nand(a, a);
  const AND = nand(nand(a, b), nand(a, b));
  const OR = nand(nand(a, a), nand(b, b));
  const rows = [
    { name: "NOT a", build: 'a NAND a', val: NOT, check: a ^ 1 },
    { name: 'a AND b', build: '(a NAND b) NAND (a NAND b)', val: AND, check: a & b },
    { name: 'a OR b', build: "(a NAND a) NAND (b NAND b)", val: OR, check: a | b },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'NAND = Swiss Army knife' : 'NAND = Swiss Army knife'}
      </div>
      <div className="flex items-center justify-center gap-4">
        <BitToggle value={a} onClick={() => setA((v) => v ^ 1)} color="#38bdf8" label="a" size={40} />
        <BitToggle value={b} onClick={() => setB((v) => v ^ 1)} color="#fb7185" label="b" size={40} />
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center justify-between gap-2 rounded-lg border p-2 ${t.soft}`}>
            <div>
              <div className="font-mono text-[12px] font-black" style={{ color: accent }}>{r.name}</div>
              <div className={`font-mono text-[10px] ${t.faint}`}>{r.build}</div>
            </div>
            <div className="flex items-center gap-2">
              <BitToggle value={r.val} color={accent} size={30} />
              <span className="font-mono text-[10px]" style={{ color: r.val === r.check ? '#34d399' : '#fb7185' }}>{r.val === r.check ? '✓' : '✗'}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ───────────────────────── ARRAY DIVIDER ───────────────────────── */
// Restoring long division shown step by step, every value computed in code.

export const ArrayDividerViz: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dividend, setDividend] = useState(11);
  const [divisor, setDivisor] = useState(3);
  const W = 4;
  // restoring division, MSB-first
  const steps: { bit: number; rem: number; trial: number; fit: boolean; q: number }[] = [];
  let rem = 0;
  for (let i = W - 1; i >= 0; i--) {
    rem = (rem << 1) | ((dividend >> i) & 1);
    const trial = rem - divisor;
    const fit = trial >= 0;
    if (fit) rem = trial;
    steps.push({ bit: (dividend >> i) & 1, rem, trial, fit, q: fit ? 1 : 0 });
  }
  const quotient = steps.reduce((a, s) => (a << 1) | s.q, 0);
  const remainder = rem;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'restoring array divider' : 'restoring array divider'}
      </div>
      <div className="flex items-center justify-center gap-4 font-mono text-[13px]">
        <label className="flex items-center gap-2">{lang === 'hi' ? 'भाज्य' : 'dividend'}
          <input type="range" min={0} max={15} value={dividend} onChange={(e) => setDividend(+e.target.value)} style={{ accentColor: accent }} />
          <b style={{ color: accent }}>{dividend}</b>
        </label>
        <label className="flex items-center gap-2">{lang === 'hi' ? 'भाजक' : 'divisor'}
          <input type="range" min={1} max={15} value={divisor} onChange={(e) => setDivisor(+e.target.value)} style={{ accentColor: '#f59e0b' }} />
          <b style={{ color: '#f59e0b' }}>{divisor}</b>
        </label>
      </div>
      <div className="mt-3 space-y-1.5">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 font-mono text-[12px] ${t.soft}`}>
            <span className={t.faint as string}>{lang === 'hi' ? `कदम ${i + 1}` : `step ${i + 1}`} · bit {s.bit}</span>
            <span>rem-div = {s.fit ? <b style={{ color: '#34d399' }}>{s.trial} ≥ 0, {lang === 'hi' ? 'घटाओ' : 'subtract'}, q=1</b> : <b style={{ color: '#fb7185' }}>{'<'} 0, {lang === 'hi' ? 'restore' : 'restore'}, q=0</b>}</span>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-center font-mono text-[15px] font-black ${t.text}`}>
        {dividend} / {divisor} = <span style={{ color: accent }}>{quotient}</span> {lang === 'hi' ? 'शेष' : 'rem'} <span style={{ color: '#f59e0b' }}>{remainder}</span>
      </p>
    </Card>
  );
};
