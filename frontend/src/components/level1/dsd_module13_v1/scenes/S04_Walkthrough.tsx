import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, StepForward, RotateCcw, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

const N = 4;
const PRESETS: Array<{ a: number; b: number }> = [
  { a: 0b1011, b: 0b0110 }, // 11 + 6 = 17
  { a: 0b1101, b: 0b1011 }, // 13 + 11 = 24
  { a: 0b0111, b: 0b0011 }, // 7 + 3 = 10
  { a: 0b1111, b: 0b0001 }, // 15 + 1 = 16 (carry ripples the whole way)
];

interface Cycle { i: number; a: number; b: number; cin: number; s: number; cout: number }

function computeCycles(A: number, B: number): { rows: Cycle[]; finalCarry: number } {
  const rows: Cycle[] = [];
  let carry = 0;
  for (let i = 0; i < N; i++) {
    const a = (A >> i) & 1;
    const b = (B >> i) & 1;
    const cin = carry;
    const s = a ^ b ^ cin;
    const cout = (a & b) | (b & cin) | (a & cin);
    rows.push({ i, a, b, cin, s, cout });
    carry = cout;
  }
  return { rows, finalCarry: carry };
}

const bin = (v: number, w: number) => v.toString(2).padStart(w, '0');

export const S04_Walkthrough: React.FC<Props> = ({ isDarkMode }) => {
  const [preset, setPreset] = useState(0);
  const [k, setK] = useState(0);        // cycles completed (0..N)
  const [playing, setPlaying] = useState(false);

  const { a: A, b: B } = PRESETS[preset];
  const { rows, finalCarry } = useMemo(() => computeCycles(A, B), [A, B]);
  const done = k >= N;

  // carry currently stored in the flip-flop (after k cycles)
  const carryNow = k === 0 ? 0 : rows[k - 1].cout;
  // the cycle about to run (when not done)
  const cur = done ? null : rows[k];

  // running result value after k cycles
  const partial = useMemo(() => {
    let v = 0;
    for (let i = 0; i < k; i++) v |= rows[i].s << i;
    if (done) v |= finalCarry << N;
    return v;
  }, [k, rows, done, finalCarry]);

  useEffect(() => { setK(0); setPlaying(false); }, [preset]);

  useEffect(() => {
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    const id = window.setTimeout(() => setK((x) => Math.min(N, x + 1)), 1100);
    return () => window.clearTimeout(id);
  }, [playing, k, done]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const cellBase  = isDarkMode ? 'border-white/15' : 'border-slate-300';

  // a register cell: pos counts MSB..LSB; consumed if pos<k, current if pos===k
  const RegCells: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div className="flex gap-1.5">
      {Array.from({ length: N }).map((_, idx) => {
        const pos = N - 1 - idx; // left = MSB
        const bit = (value >> pos) & 1;
        const consumed = pos < k;
        const current = pos === k && !done;
        return (
          <div
            key={pos}
            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-base font-black transition-all ${cellBase}`}
            style={{
              borderColor: current ? color : consumed ? `${color}22` : `${color}66`,
              background: current ? `${color}26` : 'transparent',
              color: consumed ? `${color}44` : color,
              opacity: consumed ? 0.4 : 1,
            }}
          >
            {bit}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Clock size={14} /> Chapter 05 · Live Serial Addition
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Step the clock, one bit at a time</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Pick two 4-bit numbers and walk the addition through the booth, tick by tick. Watch the
          lowest bits enter the full adder, the Sum shift into the result, and the carry survive in
          the flip-flop between cycles. Four bits, four ticks - then one last carry.
        </p>
      </motion.section>

      {/* preset + equation */}
      <div className={`p-5 rounded-3xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Operands</span>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPreset(i)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 transition-all active:scale-95"
              style={{
                borderColor: preset === i ? SKY : `${SKY}44`,
                background: preset === i ? `${SKY}22` : 'transparent',
                color: preset === i ? SKY : `${SKY}aa`,
              }}
            >
              {p.a}+{p.b}
            </button>
          ))}
        </div>
        <div className={`font-mono text-sm ${textColor}`}>
          {bin(A, N)} + {bin(B, N)} ={' '}
          <strong style={{ color: done ? EMERALD : subText }}>
            {done ? bin(partial, N + 1) : '· · · · ·'}
          </strong>
          <span className={subText}> ({A} + {B} = {A + B})</span>
        </div>
      </div>

      {/* the machine */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          {/* registers */}
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: SKY }}>Shift Register A</div>
              <RegCells value={A} color={SKY} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: SKY }}>Shift Register B</div>
              <RegCells value={B} color={SKY} />
            </div>
            <p className={`text-[11px] font-mono ${subText}`}>faded = already added · ring = at the booth now</p>
          </div>

          {/* the booth */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="rounded-2xl border-2 px-5 py-4 text-center" style={{ borderColor: VIOLET, background: `${VIOLET}12` }}>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: VIOLET }}>Full Adder</div>
              {cur ? (
                <div className={`font-mono text-sm ${textColor}`}>
                  <div>A={cur.a} B={cur.b} <span style={{ color: AMBER }}>Cin={cur.cin}</span></div>
                  <div className="my-1 opacity-40">↓</div>
                  <div><span style={{ color: EMERALD }}>Sum={cur.s}</span> <span style={{ color: AMBER }}>Cout={cur.cout}</span></div>
                </div>
              ) : (
                <div className="font-mono text-sm" style={{ color: EMERALD }}>idle ✓</div>
              )}
            </div>
            {/* carry flip-flop */}
            <div className="rounded-xl border-2 px-4 py-2 text-center" style={{ borderColor: AMBER, background: `${AMBER}12` }}>
              <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: AMBER }}>Carry flip-flop</div>
              <div className="font-mono text-2xl font-black" style={{ color: AMBER }}>{carryNow}</div>
            </div>
          </div>

          {/* result */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: EMERALD }}>Result register</div>
            <div className="flex gap-1.5">
              {Array.from({ length: N + 1 }).map((_, idx) => {
                const pos = N - idx; // left = MSB (bit N), right = bit 0
                const filled = pos < k || (done && pos === N);
                const bit = (partial >> pos) & 1;
                const justWrote = (!done && pos === k - 1) || (done && pos === N);
                return (
                  <div
                    key={pos}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-base font-black transition-all`}
                    style={{
                      borderColor: filled ? EMERALD : `${EMERALD}33`,
                      background: justWrote ? `${EMERALD}26` : 'transparent',
                      color: filled ? EMERALD : `${EMERALD}55`,
                    }}
                  >
                    {filled ? bit : '·'}
                  </div>
                );
              })}
            </div>
            <p className={`mt-2 text-[11px] font-mono ${subText}`}>fills lowest bit first; top cell is the final carry</p>
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-xs ${
              done ? '' : isDarkMode ? 'border-white/10' : 'border-slate-200'
            }`} style={done ? { borderColor: EMERALD, color: EMERALD, background: `${EMERALD}12` } : undefined}>
              {done ? <CheckCircle2 size={13} /> : <Clock size={13} />}
              {done ? `Done in ${N} ticks` : `Tick ${k} of ${N}`}
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => { setK(0); setPlaying(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-black uppercase tracking-widest ${
              isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
            } ${textColor}`}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() => { setPlaying(false); setK((x) => Math.max(0, x - 1)); }}
            disabled={k === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-black uppercase tracking-widest disabled:opacity-30 ${
              isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
            } ${textColor}`}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            disabled={done}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-black disabled:opacity-40"
            style={{ background: SKY }}
          >
            {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
          </button>
          <button
            onClick={() => { setPlaying(false); setK((x) => Math.min(N, x + 1)); }}
            disabled={done}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-black disabled:opacity-40"
            style={{ background: EMERALD }}
          >
            <StepForward size={14} /> Step clock
          </button>
        </div>
      </motion.div>

      {/* cycle log */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: SKY }}>Cycle log</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className={`text-left ${subText}`}>
                <th className="py-2 pr-4 font-bold">Tick</th>
                <th className="py-2 pr-4 font-bold">A bit</th>
                <th className="py-2 pr-4 font-bold">B bit</th>
                <th className="py-2 pr-4 font-bold" style={{ color: AMBER }}>Cin</th>
                <th className="py-2 pr-4 font-bold" style={{ color: EMERALD }}>Sum</th>
                <th className="py-2 pr-4 font-bold" style={{ color: AMBER }}>Cout</th>
                <th className="py-2 font-bold">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const reached = r.i < k;
                const current = r.i === k && !done;
                return (
                  <tr
                    key={r.i}
                    className={`border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} transition-all`}
                    style={{
                      opacity: reached || current ? 1 : 0.3,
                      background: current ? `${SKY}12` : undefined,
                    }}
                  >
                    <td className={`py-2 pr-4 ${textColor}`}>{r.i + 1}</td>
                    <td className={`py-2 pr-4 ${textColor}`}>{r.a}</td>
                    <td className={`py-2 pr-4 ${textColor}`}>{r.b}</td>
                    <td className="py-2 pr-4" style={{ color: AMBER }}>{r.cin}</td>
                    <td className="py-2 pr-4 font-black" style={{ color: EMERALD }}>{r.s}</td>
                    <td className="py-2 pr-4 font-black" style={{ color: AMBER }}>{r.cout}</td>
                    <td className={`py-2 ${subText} text-xs`}>
                      {r.cout ? 'carry parked for next tick' : 'no carry to hand on'}
                    </td>
                  </tr>
                );
              })}
              <tr className={`border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} style={{ opacity: done ? 1 : 0.3 }}>
                <td className={`py-2 pr-4 ${textColor}`}>end</td>
                <td className="py-2 pr-4" colSpan={5}>
                  <span className={subText}>final carry becomes the top result bit →</span>
                </td>
                <td className="py-2 font-black" style={{ color: EMERALD }}>{finalCarry}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* takeaway */}
      {done && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl border-2 text-center"
                    style={{ borderColor: `${EMERALD}80`, background: `${EMERALD}12` }}>
          <CheckCircle2 size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
          <h4 className={`text-lg font-black ${textColor}`}>
            {A} + {B} = {A + B}, in {N} clock ticks.
          </h4>
          <p className={`mt-1 text-sm ${subText}`}>
            One full adder. One flip-flop. Four bits took four ticks - an N-bit addition takes N
            ticks, exactly the price the serial adder pays for being so small. Try the
            {' '}{PRESETS[3].a}+{PRESETS[3].b} preset to watch a carry ripple the whole way up.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default S04_Walkthrough;
