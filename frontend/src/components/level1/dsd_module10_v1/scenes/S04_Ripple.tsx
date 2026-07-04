import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, StepForward, RotateCcw, Zap, Hourglass, CheckCircle2, Clock } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

const N = 4;
const PRESETS: Array<{ a: number; b: number; note: string }> = [
  { a: 0b0111, b: 0b0001, note: 'worst case: the carry ripples through every stage' },
  { a: 0b1011, b: 0b0111, note: 'mixed: carries jump in partway up the chain' },
  { a: 0b1010, b: 0b0101, note: 'no carries at all, yet the hardware still waits' },
];

export const S04_Ripple: React.FC<Props> = ({ isDarkMode }) => {
  const [preset, setPreset] = useState(0);
  const [step, setStep] = useState(0); // stages settled (0..N)
  const [playing, setPlaying] = useState(false);

  const { a: A, b: B, note } = PRESETS[preset];

  const { sums, carries, cout, sumVal } = useMemo(() => {
    const carries = [0];
    const sums: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = (A >> i) & 1, b = (B >> i) & 1, c = carries[i];
      sums[i] = a ^ b ^ c;
      carries[i + 1] = (a & b) | (b & c) | (a & c);
    }
    const cout = carries[N];
    const sumVal = sums.reduce((v, bit, i) => v + (bit << i), 0) + (cout << N);
    return { sums, carries, cout, sumVal };
  }, [A, B]);

  const done = step >= N;
  const elapsed = 2 * step;       // in units of gate delay (ΔG)
  const total = 2 * N;            // 2·N·ΔG

  useEffect(() => { setStep(0); setPlaying(false); }, [preset]);
  useEffect(() => {
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    const id = window.setTimeout(() => setStep((s) => Math.min(N, s + 1)), 1100);
    return () => window.clearTimeout(id);
  }, [playing, step, done]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const greyWire  = isDarkMode ? '#334155' : '#cbd5e1';

  const order = [3, 2, 1, 0]; // bit3..bit0 left to right
  const bin = (v: number, w: number) => v.toString(2).padStart(w, '0');

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Zap size={14} /> Chapter 05 · Watch the Carry Ripple
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The baton, handed down the line</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The logic view said the answer appears instantly. In real hardware it does not. Each stage
          must wait for the carry from the stage below before it can settle. Step the wavefront and
          watch the carry ripple left, one runner at a time, while the delay clock ticks up.
        </p>
      </motion.section>

      {/* preset + delay meter */}
      <div><TryItYourself label="Step the wavefront" /></div>
      <div className={`p-5 rounded-3xl border flex flex-wrap items-center justify-between gap-4 ${cardBg}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Operands</span>
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => setPreset(i)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 transition-all active:scale-95"
              style={{ borderColor: preset === i ? AMBER : `${AMBER}44`, background: preset === i ? `${AMBER}22` : 'transparent', color: preset === i ? AMBER : `${AMBER}aa` }}>
              {p.a}+{p.b}
            </button>
          ))}
        </div>
        <div className={`font-mono text-sm ${textColor}`}>
          {bin(A, N)} + {bin(B, N)} = <strong style={{ color: done ? EMERALD : subText }}>{done ? bin(sumVal, N + 1) : '?????'}</strong>
          <span className={subText}> ({A}+{B}={A + B})</span>
        </div>
      </div>

      {/* the chain */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border overflow-x-auto ${cardBg}`}>
        <div className="flex items-stretch justify-center gap-2 min-w-[640px]">
          {/* Cout */}
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>Cout</div>
            <div className="w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-black"
                 style={{ borderColor: done ? AMBER : `${AMBER}44`, color: done ? AMBER : `${AMBER}66`, background: done ? `${AMBER}1a` : 'transparent' }}>
              {done ? cout : '?'}
            </div>
          </div>

          {order.map((i, k) => {
            const settled = i < step;
            const active = i === step && !done;
            const waiting = i > step;
            const stageColor = settled ? EMERALD : active ? AMBER : greyWire;
            return (
              <React.Fragment key={i}>
                {/* carry wire into stage i (from the right neighbour) */}
                <div className="flex items-center">
                  <div className="w-6 h-1 rounded transition-all" style={{ background: (i < step && carries[i]) ? AMBER : greyWire }} />
                </div>
                <div className="rounded-2xl border-2 p-3 text-center transition-all" style={{
                  borderColor: stageColor,
                  background: active ? `${AMBER}14` : settled ? `${EMERALD}0e` : 'transparent',
                  minWidth: 100,
                  boxShadow: active ? `0 0 18px ${AMBER}55` : 'none',
                  opacity: waiting ? 0.55 : 1,
                }}>
                  <div className="font-mono text-[10px] font-black" style={{ color: VIOLET }}>FA{i}</div>
                  <div className="font-mono text-[8px] mb-1 opacity-50">bit {i}</div>
                  <div className="font-mono text-[9px]" style={{ color: SKY }}>A={(A >> i) & 1} B={(B >> i) & 1}</div>
                  <div className="font-mono text-[9px]" style={{ color: AMBER }}>Cin={i <= step ? carries[i] : '?'}</div>
                  <div className="mt-2">
                    <div className="font-mono text-[9px] uppercase" style={{ color: settled ? EMERALD : subText }}>Sum</div>
                    <div className="w-9 h-9 mx-auto rounded-lg border-2 flex items-center justify-center font-mono text-base font-black"
                         style={{ borderColor: settled ? EMERALD : greyWire, color: settled ? EMERALD : `${greyWire}`, background: settled ? `${EMERALD}1a` : 'transparent' }}>
                      {settled ? sums[i] : '?'}
                    </div>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 font-mono text-[8px] font-black uppercase tracking-widest" style={{ color: stageColor }}>
                    {settled ? <><CheckCircle2 size={9} /> done</> : active ? <><Zap size={9} /> settling</> : <><Hourglass size={9} /> waiting</>}
                  </div>
                </div>
                {k === order.length - 1 && (
                  <div className="flex flex-col items-center justify-center ml-1">
                    <div className="w-6 h-1 rounded" style={{ background: AMBER }} />
                    <div className="font-mono text-[9px] mt-1" style={{ color: AMBER }}>Cin=0</div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* delay meter */}
      <div className={`p-5 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5" style={{ color: AMBER }}>
            <Clock size={12} /> Delay clock
          </span>
          <span className={`font-mono text-sm font-black ${textColor}`}>
            {elapsed}·ΔG <span className={subText}>/ {total}·ΔG (2·N·ΔG)</span>
          </span>
        </div>
        {/* timeline bars: each stage = 2 ΔG, in series */}
        <div className="flex gap-1 h-6">
          {order.slice().reverse().map((i) => { // bit0..bit3 left to right on the timeline
            const settled = i < step;
            const active = i === step && !done;
            return (
              <div key={i} className="flex-1 rounded-md border flex items-center justify-center font-mono text-[9px] font-black transition-all"
                   style={{
                     borderColor: settled ? EMERALD : active ? AMBER : greyWire,
                     background: settled ? `${EMERALD}22` : active ? `${AMBER}22` : 'transparent',
                     color: settled ? EMERALD : active ? AMBER : subText,
                   }}>
                FA{i} · 2ΔG
              </div>
            );
          })}
        </div>
        <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-xs ${done ? '' : isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
             style={done ? { borderColor: EMERALD, color: EMERALD, background: `${EMERALD}12` } : undefined}>
          {done ? <CheckCircle2 size={13} /> : <Hourglass size={13} />}
          {done ? `Stable after ${total}·ΔG` : `${step} of ${N} stages settled`}
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button onClick={() => { setStep(0); setPlaying(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-black uppercase tracking-widest ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} ${textColor}`}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={() => setPlaying((p) => !p)} disabled={done}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-black disabled:opacity-40" style={{ background: AMBER }}>
          {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
        </button>
        <button onClick={() => { setPlaying(false); setStep((s) => Math.min(N, s + 1)); }} disabled={done}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest text-black disabled:opacity-40" style={{ background: EMERALD }}>
          <StepForward size={14} /> Advance baton
        </button>
      </div>

      {/* takeaway */}
      {done && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl border-2 text-center" style={{ borderColor: `${EMERALD}80`, background: `${EMERALD}12` }}>
          <CheckCircle2 size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
          <h4 className={`text-lg font-black ${textColor}`}>{A} + {B} = {A + B}, stable after {total}·ΔG.</h4>
          <p className={`mt-1 text-sm max-w-2xl mx-auto ${subText}`}>
            {note}. Either way the worst-case delay is the same 2·N·ΔG, because the hardware cannot
            know in advance whether a carry will ripple - it must allow time for the longest possible
            path every time. That fixed, growing wait is exactly what the next adders attack.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default S04_Ripple;
