import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BookOpen, MousePointerClick, Timer, TrendingDown, TrendingUp, Workflow } from 'lucide-react';

type Bit = 0 | 1;
type Mode = 'sync' | 'async';

interface Props {
  isActive?: boolean;
  isDarkMode: boolean;
}

const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const AMBER = '#fbbf24';

const N = 72;          // samples visible on the scope
const SAMPLE_MS = 100; // sample period
const HALF = 8;        // samples per clock half-period
const W = 560;         // trace width in svg units

const zeros = (): Bit[] => Array.from({ length: N }, () => 0 as Bit);

// Square wave with crisp vertical edges
const wavePath = (buf: Bit[], yHigh: number, yLow: number): string => {
  const dx = W / (buf.length - 1);
  const yOf = (v: Bit) => (v === 1 ? yHigh : yLow);
  let p = `M 0 ${yOf(buf[0])}`;
  for (let i = 1; i < buf.length; i++) {
    const x = (i * dx).toFixed(1);
    if (buf[i] !== buf[i - 1]) p += ` L ${x} ${yOf(buf[i - 1])}`;
    p += ` L ${x} ${yOf(buf[i])}`;
  }
  return p;
};

export const S09_Clock: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const off = isDarkMode ? '#475569' : '#cbd5e1';

  const [d, setD] = useState<Bit>(0);
  const [mode, setMode] = useState<Mode>('sync');
  const [clk, setClk] = useState<Bit>(0);
  const [qDisp, setQDisp] = useState<Bit>(0);
  const [flash, setFlash] = useState(0);
  const [scope, setScope] = useState<{ clk: Bit[]; d: Bit[]; q: Bit[] }>(() => ({
    clk: zeros(), d: zeros(), q: zeros(),
  }));

  const dRef = useRef<Bit>(0);
  const modeRef = useRef<Mode>('sync');
  const qRef = useRef<Bit>(0);
  const nRef = useRef(0);
  const prevClkRef = useRef<Bit>(0);

  useEffect(() => { dRef.current = d; }, [d]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const id = window.setInterval(() => {
      nRef.current += 1;
      const level = (Math.floor(nRef.current / HALF) % 2) as Bit;
      const rising = level === 1 && prevClkRef.current === 0;
      prevClkRef.current = level;

      if (modeRef.current === 'async') {
        qRef.current = dRef.current;
      } else if (rising) {
        qRef.current = dRef.current;     // the edge catches the value
        setFlash(f => f + 1);
      }

      setClk(level);
      setQDisp(qRef.current);
      setScope(s => ({
        clk: [...s.clk.slice(1), level],
        d: [...s.d.slice(1), dRef.current],
        q: [...s.q.slice(1), qRef.current],
      }));
    }, SAMPLE_MS);
    return () => window.clearInterval(id);
  }, []);

  const dx = W / (N - 1);
  const edges: number[] = [];
  for (let i = 1; i < scope.clk.length; i++) {
    if (scope.clk[i] === 1 && scope.clk[i - 1] === 0) edges.push(i);
  }

  const sync = mode === 'sync';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: CYAN }}>
          <Activity size={14} /> Chapter 09 · The Heartbeat Clock
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One beat. Everyone moves together.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The clock is a metronome made of voltage. Flip the raw input as fast as you like: the stored bit moves only when the beat lands.
        </p>
      </section>

      {/* Live scope */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-5`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
            Live scope · clock vs raw vs stored
          </div>

          <div className="flex items-center gap-4">
            {/* Metronome */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-10 flex items-end justify-center">
                <motion.div
                  animate={{ rotate: clk ? 24 : -24 }}
                  transition={{ type: 'spring', stiffness: 70, damping: 11 }}
                  className="w-1 h-9 rounded-full"
                  style={{ background: CYAN, transformOrigin: 'bottom center' }}
                />
                <div className="absolute bottom-0 w-6 h-1.5 rounded-full" style={{ background: `${CYAN}66` }} />
              </div>
              <motion.div
                animate={{
                  scale: clk ? 1.12 : 0.88,
                  boxShadow: clk ? `0 0 16px ${CYAN}66` : '0 0 0px rgba(0,0,0,0)',
                }}
                className="px-3 py-1 rounded-full border-2 font-mono text-[10px] font-black"
                style={{ borderColor: CYAN, color: CYAN }}
              >
                {clk ? 'TICK' : 'TOCK'}
              </motion.div>
            </div>

            {/* Mode switch */}
            <div className="flex rounded-xl border-2 overflow-hidden font-mono text-xs font-black" style={{ borderColor: CYAN }}>
              {(['sync', 'async'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="px-4 py-2 uppercase tracking-widest transition-all"
                  style={{
                    backgroundColor: mode === m ? CYAN : 'transparent',
                    color: mode === m ? '#000' : CYAN,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 640 224" className="w-full h-auto">
          <text x="0" y="48" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={CYAN}>CLK</text>
          <text x="0" y="120" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={AMBER}>D raw</text>
          <text x="0" y="192" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>Q held</text>
          <text x="630" y="12" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'} textAnchor="end" opacity="0.7">now</text>

          <g transform="translate(68 0)">
            {/* lane baselines */}
            {[60, 132, 204].map((y) => (
              <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={off} strokeWidth="1" strokeDasharray="2 6" opacity="0.35" />
            ))}

            {/* rising edge markers */}
            {edges.map((i) => {
              const x = i * dx;
              return (
                <g key={i}>
                  <line x1={x} y1="14" x2={x} y2="212" stroke={CYAN} strokeWidth="1" strokeDasharray="3 4" opacity={sync ? 0.3 : 0.1} />
                  {sync && <polygon points={`${x - 4},72 ${x + 4},72 ${x},64`} fill={CYAN} opacity="0.7" />}
                </g>
              );
            })}

            {/* the now line */}
            <line x1={W} y1="14" x2={W} y2="212" stroke={off} strokeWidth="1" opacity="0.4" />

            {/* traces */}
            <path d={wavePath(scope.clk, 26, 60)} fill="none" stroke={CYAN} strokeWidth="2.5" opacity={sync ? 1 : 0.35} strokeLinejoin="round" />
            <path d={wavePath(scope.d, 98, 132)} fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinejoin="round" />
            <path
              d={wavePath(scope.q, 170, 204)} fill="none" stroke={EMERALD} strokeWidth="2.5" strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 4px ${EMERALD}66)` }}
            />
          </g>
        </svg>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setD(v => (v === 1 ? 0 : 1))}
            className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
            style={{
              borderColor: AMBER,
              color: d ? '#000' : AMBER,
              backgroundColor: d ? AMBER : 'transparent',
              boxShadow: d ? `0 0 20px ${AMBER}55` : 'none',
            }}
          >
            <span className="text-[9px] uppercase tracking-widest opacity-80 flex items-center gap-1">
              <MousePointerClick size={10} /> raw input · tap fast
            </span>
            <span className="text-base">D = {d}</span>
          </button>

          <div className="flex-1 grid sm:grid-cols-2 gap-3">
            <div className={`rounded-xl px-4 py-3 border font-mono text-xs flex items-center ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span style={{ color: AMBER }}>D moves the instant you tap. Jittery.</span>
            </div>
            <motion.div
              animate={{ borderColor: sync ? `${EMERALD}55` : `${AMBER}55` }}
              className={`rounded-xl px-4 py-3 border font-mono text-xs flex items-center ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}
            >
              <span style={{ color: EMERALD }}>
                {sync ? 'Q waits for the next rising edge. Calm and ordered.' : 'Q copies D immediately. No rhythm, no discipline.'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
        {/* D flip-flop */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
              The storage box · D flip-flop
            </div>
            {flash > 0 && sync && (
              <motion.div
                key={flash}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1] }}
                className="font-mono text-xs font-black"
                style={{ color: CYAN }}
              >
                edge caught D = {qDisp}
              </motion.div>
            )}
          </div>

          <svg viewBox="0 0 380 200" className="w-full h-auto">
            {/* D input */}
            <text x="2" y="84" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={d ? AMBER : off}>D={d}</text>
            <line x1="44" y1="80" x2="120" y2="80" stroke={d ? AMBER : off} strokeWidth="3" style={{ filter: d ? `drop-shadow(0 0 5px ${AMBER})` : 'none' }} />

            {/* CLK input */}
            <text x="2" y="144" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={sync && clk ? CYAN : off}>CLK</text>
            <line x1="44" y1="140" x2="120" y2="140" stroke={sync && clk ? CYAN : off} strokeWidth="3" opacity={sync ? 1 : 0.35} style={{ filter: sync && clk ? `drop-shadow(0 0 5px ${CYAN})` : 'none' }} />

            {/* Box */}
            <rect x="120" y="40" width="120" height="120" rx="14" fill="none" stroke={CYAN} strokeWidth="3" />
            <text x="134" y="86" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={CYAN}>D</text>
            <text x="216" y="86" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Q</text>
            {/* edge-trigger triangle */}
            <polyline points="120,130 136,140 120,150" fill="none" stroke={CYAN} strokeWidth="2.5" opacity={sync ? 1 : 0.3} />
            {!sync && (
              <>
                <line x1="114" y1="152" x2="142" y2="128" stroke={AMBER} strokeWidth="2.5" />
                <text x="148" y="144" fontSize="9" fontFamily="monospace" fill={AMBER} opacity="0.85">ignored</text>
              </>
            )}

            {/* Q output */}
            <line x1="240" y1="80" x2="324" y2="80" stroke={qDisp ? EMERALD : off} strokeWidth="3" style={{ filter: qDisp ? `drop-shadow(0 0 5px ${EMERALD})` : 'none' }} />
            <circle cx="324" cy="80" r="4" fill={qDisp ? EMERALD : off} />
            <text x="332" y="85" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={qDisp ? EMERALD : off}>Q={qDisp}</text>

            {/* capture flash ring */}
            {flash > 0 && sync && (
              <motion.rect
                key={`ring-${flash}`}
                x="112" y="32" width="136" height="136" rx="18"
                fill="none" stroke={CYAN} strokeWidth="2.5"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: 0, scale: 1.12 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            )}
          </svg>

          <p className={`text-sm ${subText}`}>
            {sync
              ? 'The triangle means edge-triggered: Q listens only at the instant the clock rises.'
              : 'No clock duty: Q shadows D the moment it moves. Fast, but nothing is coordinated.'}
          </p>
        </motion.div>

        {/* Sync vs async + caption */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: EMERALD }}>
              Synchronous · clocked
            </div>
            <p className={`text-sm ${textColor}`}>
              State changes only on the tick. Billions of parts update in step, so data never collides.
            </p>
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>
              Asynchronous · no clock
            </div>
            <p className={`text-sm ${textColor}`}>
              Storage reacts immediately. Simple for one latch, chaos for a billion.
            </p>
          </div>

          <div className="rounded-3xl p-6 border-2 flex-1 flex flex-col justify-center" style={{ borderColor: CYAN, background: `${CYAN}11` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: CYAN }}>
              Key takeaway
            </div>
            <p className={`text-base font-bold ${textColor}`}>
              The clock is the conductor: everyone updates together, nothing collides.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Standard text · the formal version */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: CYAN }}>
          <BookOpen size={14} /> Standard Text · The Formal Version
        </div>
        <h3 className={`text-2xl md:text-3xl font-black ${textColor}`}>Same ideas, textbook wording.</h3>
        <p className={`text-sm max-w-3xl ${subText}`}>
          Three short notes that pin down the vocabulary you just watched in motion.
        </p>
      </section>

      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {/* Clock arithmetic */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
            <Timer size={12} /> Clock arithmetic
          </div>
          <p className={`text-sm ${subText}`}>
            The clock signal is a square wave: a voltage that snaps between low and high at perfectly
            regular times. One full repeat - one high stretch plus one low stretch - is the period,
            written T. The number of repeats per second is the frequency, written f and measured in
            hertz (Hz). The two are tied by a single rule: f = 1/T.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { term: 'period T', def: 'the time taken by one complete cycle of the wave', color: CYAN },
              { term: 'frequency f', def: 'cycles completed per second; always f = 1/T', color: CYAN },
              { term: '1 GHz', def: '10⁹ cycles every second, so each period is just 1 ns', color: EMERALD },
            ].map(({ term, def, color }) => (
              <div
                key={term}
                className={`rounded-xl px-3 py-2 border flex items-baseline gap-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="font-mono text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color }}>{term}</span>
                <span className={`text-xs ${subText}`}>{def}</span>
              </div>
            ))}
          </div>
          <p className={`text-sm ${subText}`}>
            That nanosecond is a deadline. Inside one single period, all the combinational logic
            (gates with no memory) sitting between two memory elements must finish settling before
            the next edge arrives.
          </p>
        </motion.div>

        {/* Two edges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
            <TrendingUp size={12} /> Two edges · the vocabulary
          </div>
          <p className={`text-sm ${subText}`}>
            Every clock cycle contains exactly two instants of change. The jump from 0 to 1 is
            called the rising edge. The drop from 1 to 0 is called the falling edge.
          </p>
          <div className="flex flex-col gap-2">
            <div className={`rounded-xl px-3 py-2 border flex items-center gap-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <TrendingUp size={14} style={{ color: EMERALD }} />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: EMERALD }}>rising edge</span>
              <span className={`text-xs ${subText}`}>0 to 1 - the jump up</span>
            </div>
            <div className={`rounded-xl px-3 py-2 border flex items-center gap-3 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <TrendingDown size={14} style={{ color: AMBER }} />
              <span className="font-mono text-[10px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: AMBER }}>falling edge</span>
              <span className={`text-xs ${subText}`}>1 to 0 - the drop down</span>
            </div>
          </div>
          <p className={`text-sm ${subText}`}>
            An edge-triggered flip-flop copies its input at one chosen edge (the small triangle on
            its symbol marks the clock pin) and ignores the input at every other moment. Listening
            for one instant and ignoring all the rest is exactly what makes the update instant
            precise.
          </p>
        </motion.div>

        {/* Synchronous vs asynchronous */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: AMBER }}>
            <Workflow size={12} /> Sync vs async · formally
          </div>
          <div className={`rounded-xl px-3 py-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: EMERALD }}>synchronous</span>
            <p className={`text-xs ${subText}`}>
              Every memory element shares one clock and updates together on the same edge. Timing
              stays predictable, because between any two ticks the circuit has a known amount of
              time to settle. Almost every real chip is built this way.
            </p>
          </div>
          <div className={`rounded-xl px-3 py-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest block mb-1" style={{ color: AMBER }}>asynchronous</span>
            <p className={`text-xs ${subText}`}>
              Changes ripple through the circuit whenever inputs change, with no shared tick at all.
              Faster on paper, since nothing waits for a clock, but timing chaos in practice - so it
              is reserved for special cases.
            </p>
          </div>
          <p className={`text-sm ${subText}`}>
            This is the same trade you flipped with the sync/async switch above: the clock costs a
            little waiting and buys total order.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
