import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, RotateCcw, Sigma, Workflow } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

type Phase = 'idle' | 'feed' | 'combine' | 'flip' | 'store';
interface Play { past: number; delta: number; next: number; }

const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';

const STATUS: Record<Phase, string> = {
  idle: 'Press an umpire signal to bowl the next ball.',
  feed: 'Present input and stored past travel into the logic...',
  combine: 'Logic combines past with present...',
  flip: 'The board flips to the next state.',
  store: 'The new value loops back. It is now the past.',
};

const BALLS = [
  { d: 1, sub: 'Single' },
  { d: 4, sub: 'Boundary' },
  { d: 6, sub: 'Sixer' },
];

/* one flip-clock digit */
const FlipDigit: React.FC<{ d: string; i: number }> = ({ d, i }) => (
  <div
    className="relative w-12 h-16 md:w-16 md:h-24 rounded-lg overflow-hidden border border-white/10"
    style={{ perspective: 500, background: '#05080f' }}
  >
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={d}
        initial={{ rotateX: -95, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 95, opacity: 0 }}
        transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center font-mono font-black text-3xl md:text-5xl text-white"
      >
        {d}
      </motion.div>
    </AnimatePresence>
    <div className="absolute left-0 right-0 top-1/2 h-px bg-black/70" />
  </div>
);

/* one slot of the live equation strip */
const Slot: React.FC<{ label: string; value: string; color: string; lit: boolean; active: boolean; isDarkMode: boolean }>
  = ({ label, value, color, lit, active, isDarkMode }) => (
    <motion.div
      animate={{
        borderColor: lit ? color : (isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'),
        boxShadow: active ? `0 0 28px ${color}55` : '0 0 0px rgba(0,0,0,0)',
        scale: active ? 1.06 : 1,
      }}
      className="flex-1 min-w-[88px] rounded-2xl border-2 px-3 py-3 text-center"
      style={{ background: lit ? `${color}12` : 'transparent' }}
    >
      <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color }}>{label}</div>
      <div className="font-mono text-xl md:text-2xl font-black" style={{ color: lit ? color : (isDarkMode ? '#475569' : '#94a3b8') }}>
        {value}
      </div>
    </motion.div>
  );

export const S07_Scoreboard: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const dim   = isDarkMode ? '#334155' : '#cbd5e1';
  const label = isDarkMode ? '#94a3b8' : '#64748b';
  const panel = isDarkMode ? '#0a0e1a' : '#ffffff';

  const [board, setBoard] = useState(100);    // what the flip board shows
  const [stored, setStored] = useState(100);  // what the memory box holds
  const [phase, setPhase] = useState<Phase>('idle');
  const [play, setPlay] = useState<Play | null>(null);

  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);
  const after = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };

  const fire = (d: number) => {
    if (phase !== 'idle') return;
    const next = stored + d;
    setPlay({ past: stored, delta: d, next });
    setPhase('feed');
    after(950,  () => setPhase('combine'));
    after(1750, () => { setPhase('flip'); setBoard(next); });
    after(2550, () => setPhase('store'));
    after(3500, () => { setStored(next); setPhase('idle'); });
  };

  const reset = () => {
    if (phase !== 'idle') return;
    setBoard(100); setStored(100); setPlay(null);
  };

  const digits = String(board).padStart(3, '0').split('');
  const feeding = phase === 'feed';
  const combining = phase === 'combine';
  const flipping = phase === 'flip';
  const storing = phase === 'store';
  const nextKnown = play !== null && (flipping || storing || phase === 'idle');

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Header ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Repeat size={14} /> Part III · The cricket scoreboard
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Past plus present makes next.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The board remembers the score. The umpire signals the present. Press a button and watch the loop feed the answer back into memory.
        </p>
      </section>

      {/* ── Live demo card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg} space-y-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
          Live demo · one ball at a time
        </div>

        {/* the flip board */}
        <div className="flex justify-center">
          <div className="rounded-2xl px-5 py-4 md:px-8 md:py-5 border border-white/10" style={{ background: '#0b1220' }}>
            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-center mb-2" style={{ color: EMERALD }}>
              Scoreboard · runs
            </div>
            <div className="flex gap-1.5 md:gap-2 justify-center">
              {digits.map((d, i) => <FlipDigit key={i} d={d} i={i} />)}
            </div>
          </div>
        </div>

        {/* live equation strip */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <Slot label="Past state" value={play ? String(play.past) : '—'} color={EMERALD}
            lit={play !== null} active={feeding} isDarkMode={isDarkMode} />
          <span className={`text-2xl font-black ${textColor} opacity-40`}>+</span>
          <Slot label="Present input" value={play ? `+${play.delta}` : '—'} color={AMBER}
            lit={play !== null} active={feeding || combining} isDarkMode={isDarkMode} />
          <span className={`text-2xl font-black ${textColor} opacity-40`}>=</span>
          <Slot label="Next state" value={nextKnown && play ? String(play.next) : (play ? '?' : '—')} color={CYAN}
            lit={nextKnown} active={flipping} isDarkMode={isDarkMode} />
        </div>

        {/* umpire buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: AMBER }}>
              Umpire<br />present input
            </span>
            {BALLS.map((b) => (
              <button
                key={b.d}
                onClick={() => fire(b.d)}
                disabled={phase !== 'idle'}
                className={`px-4 py-2.5 rounded-xl border-2 font-mono font-black transition-all active:scale-95 ${phase !== 'idle' ? 'opacity-35 cursor-not-allowed' : ''}`}
                style={{ borderColor: AMBER, color: AMBER, background: `${AMBER}10` }}
              >
                <span className="text-base block leading-none">+{b.d}</span>
                <span className="text-[9px] uppercase tracking-widest opacity-70">{b.sub}</span>
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            disabled={phase !== 'idle'}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-[11px] transition-all active:scale-95 ${phase !== 'idle' ? 'opacity-35 cursor-not-allowed' : ''} ${isDarkMode ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
          >
            <RotateCcw size={13} /> Reset 100
          </button>
        </div>

        {/* the feedback loop diagram */}
        <svg viewBox="0 0 720 330" className="w-full h-auto">
          {/* next state: logic up to board */}
          <line x1="360" y1="78" x2="360" y2="22" stroke={flipping ? CYAN : dim} strokeWidth="3" style={{ transition: 'stroke 250ms' }} />
          <polygon points="353,24 367,24 360,10" fill={flipping ? CYAN : dim} style={{ transition: 'fill 250ms' }} />
          <text x="372" y="50" fontSize="9" fontFamily="monospace" fill={flipping ? CYAN : label}>next state</text>

          {/* feedback: board down into memory */}
          <polyline points="470,12 470,46 660,46 660,230" fill="none"
            stroke={storing ? EMERALD : dim} strokeWidth="3" strokeDasharray="7 6" style={{ transition: 'stroke 250ms' }} />
          <polygon points="653,228 667,228 660,242" fill={storing ? EMERALD : dim} style={{ transition: 'fill 250ms' }} />
          <text x="538" y="38" fontSize="9" fontFamily="monospace" fill={storing ? EMERALD : label}>becomes the past</text>

          {/* present input node + arrow into logic */}
          <rect x="30" y="100" width="140" height="60" rx="12" fill={panel}
            stroke={feeding ? AMBER : dim} strokeWidth="2.5" style={{ transition: 'stroke 250ms' }} />
          <text x="100" y="124" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>PRESENT INPUT</text>
          <text x="100" y="146" textAnchor="middle" fontSize="15" fontFamily="monospace" fontWeight="bold"
            fill={play && (feeding || combining) ? AMBER : label}>
            {play && (feeding || combining) ? `+${play.delta}` : 'umpire'}
          </text>
          <line x1="170" y1="130" x2="266" y2="130" stroke={feeding ? AMBER : dim} strokeWidth="3" style={{ transition: 'stroke 250ms' }} />
          <polygon points="266,123 266,137 280,130" fill={feeding ? AMBER : dim} style={{ transition: 'fill 250ms' }} />

          {/* logic block + gear */}
          <rect x="280" y="78" width="160" height="96" rx="18" fill={panel}
            stroke={combining ? EMERALD : dim} strokeWidth={combining ? 3.5 : 2.5}
            style={{ transition: 'stroke 250ms', filter: combining ? `drop-shadow(0 0 10px ${EMERALD}88)` : 'none' }} />
          <g transform="translate(360,114)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: combining ? 0.7 : 9 }}
            >
              <circle r="13" fill="none" stroke={combining ? EMERALD : label} strokeWidth="3" />
              <line x1="0" y1="-19" x2="0" y2="19" stroke={combining ? EMERALD : label} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-19" y1="0" x2="19" y2="0" stroke={combining ? EMERALD : label} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-13.4" y1="-13.4" x2="13.4" y2="13.4" stroke={combining ? EMERALD : label} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-13.4" y1="13.4" x2="13.4" y2="-13.4" stroke={combining ? EMERALD : label} strokeWidth="3.5" strokeLinecap="round" />
              <circle r="4.5" fill={combining ? EMERALD : label} />
            </motion.g>
          </g>
          <text x="360" y="162" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold"
            fill={combining ? EMERALD : label}>
            COMBINE LOGIC
          </text>

          {/* memory box */}
          <rect x="500" y="240" width="190" height="70" rx="14" fill={panel}
            stroke={feeding || storing ? EMERALD : dim} strokeWidth="2.5"
            style={{ transition: 'stroke 250ms', filter: storing ? `drop-shadow(0 0 10px ${EMERALD}88)` : 'none' }} />
          <text x="595" y="264" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>MEMORY · PAST STATE</text>
          <text x="595" y="296" textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>
            {stored}
          </text>

          {/* memory pulls the past into the logic */}
          <polyline points="500,275 360,275 360,178" fill="none"
            stroke={feeding ? EMERALD : dim} strokeWidth="3" strokeDasharray="7 6" style={{ transition: 'stroke 250ms' }} />
          <polygon points="353,182 367,182 360,168" fill={feeding ? EMERALD : dim} style={{ transition: 'fill 250ms' }} />
          <text x="392" y="268" fontSize="9" fontFamily="monospace" fill={feeding ? EMERALD : label}>pulls the past</text>

          {/* traveling chips */}
          {feeding && play && (
            <>
              <motion.g initial={{ x: 0 }} animate={{ x: 100 }} transition={{ duration: 0.85, ease: 'easeInOut' }}>
                <circle cx="170" cy="130" r="15" fill={AMBER} />
                <text x="170" y="134" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#000">
                  +{play.delta}
                </text>
              </motion.g>
              <motion.g
                initial={{ x: 0, y: 0 }}
                animate={{ x: [0, -140, -140], y: [0, 0, -98] }}
                transition={{ duration: 0.9, times: [0, 0.55, 1], ease: 'easeInOut' }}
              >
                <circle cx="500" cy="275" r="15" fill={EMERALD} />
                <text x="500" y="279" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#000">
                  {play.past}
                </text>
              </motion.g>
            </>
          )}
          {flipping && play && (
            <motion.g initial={{ y: 0 }} animate={{ y: -52 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
              <circle cx="360" cy="72" r="15" fill={CYAN} />
              <text x="360" y="76" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#000">
                {play.next}
              </text>
            </motion.g>
          )}
          {storing && play && (
            <motion.g
              initial={{ x: 0, y: 0 }}
              animate={{ x: [0, 0, 190, 190], y: [0, 32, 32, 216] }}
              transition={{ duration: 0.9, times: [0, 0.18, 0.55, 1], ease: 'easeInOut' }}
            >
              <circle cx="470" cy="14" r="15" fill={EMERALD} />
              <text x="470" y="18" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#000">
                {play.next}
              </text>
            </motion.g>
          )}
        </svg>

        {/* phase narration */}
        <div className="font-mono text-[11px] tracking-wide text-center"
          style={{ color: phase === 'idle' ? label : (flipping ? CYAN : (feeding || combining || storing ? EMERALD : label)) }}>
          {STATUS[phase]}
        </div>
      </motion.div>

      {/* ── The three roles ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: 'Past state', c: EMERALD, line: 'The board before the ball. Lives in the memory box.' },
          { t: 'Present input', c: AMBER, line: 'The umpire signal arriving right now.' },
          { t: 'Next state', c: CYAN, line: 'The new score. It loops back and becomes the past.' },
        ].map((r, i) => (
          <motion.div
            key={r.t}
            initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-5 rounded-2xl border-2"
            style={{ borderColor: `${r.c}55`, background: `${r.c}10` }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1.5" style={{ color: r.c }}>{r.t}</div>
            <p className={`text-sm ${subText}`}>{r.line}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Standard text: the state equation ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg} space-y-5`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
          <Sigma size={14} /> Standard text · The state equation
        </div>

        {/* the recurrence itself */}
        <div className={`rounded-2xl border px-4 py-5 text-center space-y-2 ${isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
          <div className="font-mono text-base md:text-xl font-black tracking-wide">
            <span style={{ color: CYAN }}>next state</span>
            <span className={`${textColor} opacity-50`}> = F(</span>
            <span style={{ color: EMERALD }}>present state</span>
            <span className={`${textColor} opacity-50`}>, </span>
            <span style={{ color: AMBER }}>present input</span>
            <span className={`${textColor} opacity-50`}>)</span>
          </div>
          <div className="font-mono text-xs md:text-sm" style={{ color: label }}>
            written compactly: <span style={{ color: CYAN }}>Sₜ₊₁</span> = F(<span style={{ color: EMERALD }}>Sₜ</span>, <span style={{ color: AMBER }}>Xₜ</span>)
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${subText}`}>
          This recurrence is the rule the scoreboard obeys on every ball. F is the combine logic in the diagram
          above - a fixed combinational block (logic with no memory of its own) that computes the same answer
          every time it is given the same two values. Here F is addition, but swap in a different F and the same
          loop becomes something new: this one equation is the heart of every counter, register, and processor
          ever built.
        </p>

        {/* vocabulary rows */}
        <div className="space-y-2.5">
          {[
            { term: 'Present state', sym: 'Sₜ', c: EMERALD, def: 'What the memory holds right now - the 154 already sitting on the board when the ball is bowled.' },
            { term: 'Present input', sym: 'Xₜ', c: AMBER, def: 'What just arrived from outside - the umpire raising the +4 signal for a boundary.' },
            { term: 'Next state', sym: 'Sₜ₊₁', c: CYAN, def: 'What the memory will hold after the update - 158, which loops back and serves as the present state for the next ball.' },
          ].map((r) => (
            <div
              key={r.term}
              className={`flex flex-wrap md:flex-nowrap items-start gap-3 p-3.5 rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
              style={{ background: `${r.c}08` }}
            >
              <span
                className="shrink-0 px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ borderColor: `${r.c}66`, color: r.c, background: `${r.c}12` }}
              >
                {r.term}
              </span>
              <span className="shrink-0 font-mono text-sm font-black pt-0.5" style={{ color: r.c }}>{r.sym}</span>
              <p className={`text-sm ${subText}`}>{r.def}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Note: this is a state machine ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45 }}
        className="p-6 md:p-8 rounded-3xl border-2 space-y-3"
        style={{ borderColor: `${AMBER}55`, background: `${AMBER}0d` }}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: AMBER }}>
          <Workflow size={14} /> Note · This is a state machine
        </div>
        <h3 className={`text-lg md:text-xl font-black ${textColor}`}>
          You have just met a finite state machine.
        </h3>
        <p className={`text-sm leading-relaxed ${subText}`}>
          A circuit that steps through states under a fixed rule is called a finite state machine (FSM) -
          finite because its possible states can be listed out, machine because the rule never bends. The
          scoreboard is one: its states are the possible scores, its input is the umpire's signal, and its
          rule is addition. Recognising the FSM hiding inside a system is the single most useful skill in
          sequential design.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { k: 'States', v: 'the possible scores', c: EMERALD },
            { k: 'Input', v: "the umpire's signal", c: AMBER },
            { k: 'Rule', v: 'addition', c: CYAN },
          ].map((chip) => (
            <span
              key={chip.k}
              className="px-2.5 py-1 rounded-md border font-mono text-[10px]"
              style={{ borderColor: `${chip.c}66`, color: chip.c, background: `${chip.c}10` }}
            >
              <span className="font-bold uppercase tracking-widest">{chip.k}:</span>
              <span className="opacity-80"> {chip.v}</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Closing mantra ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="p-6 md:p-8 rounded-3xl border-2 text-center space-y-2"
        style={{ borderColor: EMERALD, background: `${EMERALD}11` }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
          The whole idea of sequential logic
        </div>
        <h3 className={`text-xl md:text-3xl font-black ${textColor}`}>
          <span style={{ color: EMERALD }}>PAST STATE</span>
          <span className="opacity-50"> + </span>
          <span style={{ color: AMBER }}>PRESENT INPUT</span>
          <span className="opacity-50"> = </span>
          <span style={{ color: CYAN }}>NEXT STATE</span>
        </h3>
        <p className={`text-sm ${subText}`}>The loop is the memory. The board never forgets.</p>
      </motion.div>
    </div>
  );
};
