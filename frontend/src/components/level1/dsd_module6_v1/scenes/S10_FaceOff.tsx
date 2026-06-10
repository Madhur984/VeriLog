import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Zap, Database, Timer, Cpu, CheckCircle2, XCircle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

/* Tiny animated tea cup - the combinational mascot */
const TeaIcon: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M7 14h15v7a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6v-7Z" stroke={CYAN} strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 16h2.5a3.5 3.5 0 0 1 0 7H22" stroke={CYAN} strokeWidth="2" />
    <motion.path
      d="M12 4c-1.5 2 1.5 3.5 0 6" stroke={CYAN} strokeWidth="1.6" strokeLinecap="round"
      animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -2, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.path
      d="M17 4c-1.5 2 1.5 3.5 0 6" stroke={CYAN} strokeWidth="1.6" strokeLinecap="round"
      animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -2, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    />
  </svg>
);

/* Tiny animated scoreboard - the sequential mascot */
const ScoreIcon: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="3" y="7" width="26" height="18" rx="3" stroke={EMERALD} strokeWidth="2" />
    <text x="14" y="20.5" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>104</text>
    <motion.circle
      cx="25" cy="12" r="1.6" fill={EMERALD}
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="25" cy="20" r="1.6" fill={EMERALD}
      animate={{ opacity: [0.15, 1, 0.15] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
);

interface Row {
  label: string;
  combi: string;
  seq: string;
  combiHas?: boolean;   // green check on the combinational side
  combiLacks?: boolean; // red x on the combinational side
  seqHas?: boolean;     // green check on the sequential side
  mascots?: boolean;    // render the analogy icons
}

const ROWS: Row[] = [
  { label: 'Output depends on', combi: 'Present inputs only', seq: 'Present inputs + past state' },
  { label: 'Memory', combi: 'None', seq: 'Required - flip-flops, latches', combiLacks: true, seqHas: true },
  { label: 'Feedback loop', combi: 'Absent', seq: 'Present', combiLacks: true, seqHas: true },
  { label: 'Clock', combi: 'Not required', seq: 'Essential - synchronous', combiLacks: true, seqHas: true },
  { label: 'Analogy', combi: 'Tea vendor', seq: 'Cricket scoreboard', mascots: true },
  { label: 'Examples', combi: 'Adders, MUX, decoders', seq: 'Counters, registers, RAM', combiHas: true, seqHas: true },
];

export const S10_FaceOff: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const ink = isDarkMode ? '#ffffff' : '#0f172a';
  const dim = isDarkMode ? '#94a3b8' : '#64748b';
  const wire = isDarkMode ? '#64748b' : '#94a3b8';
  const blockFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const rowBorder = isDarkMode ? 'border-white/10' : 'border-slate-200';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Scale size={14} /> Chapter 11 · The Face Off
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Now vs Then, at a glance.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Two circuits, one table. Then watch them team up.
        </p>
      </section>

      {/* Comparison table - builds row by row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`rounded-3xl border overflow-hidden ${cardBg}`}
      >
        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`grid grid-cols-[88px_1fr_1fr] sm:grid-cols-[150px_1fr_1fr] border-b ${rowBorder}`}
        >
          <div />
          <div className="px-3 sm:px-5 py-4 flex items-center gap-3" style={{ background: `${CYAN}0d` }}>
            <TeaIcon />
            <div>
              <div className="font-mono text-[11px] sm:text-xs font-black tracking-widest" style={{ color: CYAN }}>COMBINATIONAL</div>
              <div className={`text-[10px] font-mono uppercase tracking-widest opacity-50 ${textColor}`}>the now</div>
            </div>
          </div>
          <div className="px-3 sm:px-5 py-4 flex items-center gap-3" style={{ background: `${EMERALD}0d` }}>
            <ScoreIcon />
            <div>
              <div className="font-mono text-[11px] sm:text-xs font-black tracking-widest" style={{ color: EMERALD }}>SEQUENTIAL</div>
              <div className={`text-[10px] font-mono uppercase tracking-widest opacity-50 ${textColor}`}>the then</div>
            </div>
          </div>
        </motion.div>

        {/* Rows */}
        {ROWS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -18 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 + i * 0.14, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`grid grid-cols-[88px_1fr_1fr] sm:grid-cols-[150px_1fr_1fr] ${i < ROWS.length - 1 ? `border-b ${rowBorder}` : ''}`}
          >
            <div className={`px-3 sm:px-5 py-4 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest opacity-50 flex items-center ${textColor}`}>
              {row.label}
            </div>
            <div className="px-3 sm:px-5 py-4 flex items-center gap-2" style={{ background: `${CYAN}08` }}>
              {row.combiLacks && <XCircle size={14} className="text-rose-400 shrink-0" />}
              {row.combiHas && <CheckCircle2 size={14} className="shrink-0" style={{ color: CYAN }} />}
              {row.mascots && <TeaIcon size={22} />}
              <span className={`text-xs sm:text-sm font-bold ${textColor}`}>{row.combi}</span>
            </div>
            <div className="px-3 sm:px-5 py-4 flex items-center gap-2" style={{ background: `${EMERALD}08` }}>
              {row.seqHas && <CheckCircle2 size={14} className="shrink-0" style={{ color: EMERALD }} />}
              {row.mascots && <ScoreIcon size={22} />}
              <span className={`text-xs sm:text-sm font-bold ${textColor}`}>{row.seq}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FSM symphony diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 sm:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 text-violet-400">
          <Cpu size={12} /> The symphony · now and then wired together
        </div>

        <svg viewBox="0 0 760 440" className="w-full h-auto">
          <defs>
            <marker id="ff-ar-slate" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill={wire} />
            </marker>
            <marker id="ff-ar-cyan" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill={CYAN} />
            </marker>
            <marker id="ff-ar-em" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill={EMERALD} />
            </marker>
            <marker id="ff-ar-amber" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill={AMBER} />
            </marker>
          </defs>

          {/* Inputs */}
          <text x="30" y="126" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={dim}>INPUTS</text>
          <line x1="30" y1="140" x2="143" y2="140" stroke={wire} strokeWidth="2.5" markerEnd="url(#ff-ar-slate)" />

          {/* Combinational logic block */}
          <rect x="150" y="95" width="210" height="110" rx="14" fill={blockFill} stroke={CYAN} strokeWidth="2.5" />
          <text x="255" y="137" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={CYAN}>COMBINATIONAL</text>
          <text x="255" y="156" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={CYAN}>LOGIC</text>
          <text x="255" y="180" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={dim}>the processor</text>

          {/* Outputs */}
          <line x1="360" y1="140" x2="708" y2="140" stroke={CYAN} strokeWidth="2.5" markerEnd="url(#ff-ar-cyan)" />
          <text x="650" y="126" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>OUTPUTS</text>

          {/* Next state wire: logic -> memory */}
          <path d="M 360 180 L 565 180 L 565 248" fill="none" stroke={EMERALD} strokeWidth="2.5" markerEnd="url(#ff-ar-em)" />
          <text x="420" y="171" fontSize="10" fontFamily="monospace" fill={EMERALD}>next state</text>

          {/* Memory registers block */}
          <rect x="465" y="255" width="200" height="95" rx="14" fill={blockFill} stroke={EMERALD} strokeWidth="2.5" />
          <text x="565" y="290" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>MEMORY</text>
          <text x="565" y="308" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>REGISTERS</text>
          <text x="565" y="330" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={dim}>the scoreboard</text>
          {/* Tick flash overlay */}
          <motion.rect
            x="465" y="255" width="200" height="95" rx="14" fill={EMERALD}
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Clock input triangle on the block edge */}
          <path d="M 532 350 L 540 338 L 548 350" fill="none" stroke={AMBER} strokeWidth="2" />

          {/* Past state wire: memory -> back into logic */}
          <path d="M 465 302 L 95 302 L 95 180 L 143 180" fill="none" stroke={EMERALD} strokeWidth="2.5" markerEnd="url(#ff-ar-em)" />
          <text x="235" y="294" fontSize="10" fontFamily="monospace" fill={EMERALD}>past state</text>

          {/* Clock: square wave + riser into the memory block */}
          <path
            d="M 215 405 H 250 V 383 H 285 V 405 H 320 V 383 H 355 V 405 H 390 V 383 H 425 V 405 H 460 V 383 H 495 V 405 H 530 V 383 H 540 V 360"
            fill="none" stroke={AMBER} strokeWidth="2.5" markerEnd="url(#ff-ar-amber)"
          />
          <text x="30" y="400" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>CLOCK</text>
          <text x="30" y="416" fontSize="9" fontFamily="monospace" fill={dim}>the conductor</text>

          {/* Pulses: input feed */}
          <circle r="4.5" fill={wire}>
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 30 140 L 143 140" />
          </circle>
          {/* Pulses: output stream */}
          <circle r="4.5" fill={CYAN}>
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 360 140 L 700 140" />
          </circle>
          {/* Pulses: circulating state loop (two, half a lap apart) */}
          <circle r="5" fill={EMERALD}>
            <animateMotion dur="5s" repeatCount="indefinite" path="M 250 180 L 565 180 L 565 302 L 95 302 L 95 180 Z" />
          </circle>
          <circle r="5" fill={EMERALD} opacity="0.6">
            <animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" path="M 250 180 L 565 180 L 565 302 L 95 302 L 95 180 Z" />
          </circle>
          {/* Pulse: clock tick riding the wave */}
          <circle r="4.5" fill={AMBER}>
            <animateMotion
              dur="2.4s" repeatCount="indefinite"
              path="M 215 405 H 250 V 383 H 285 V 405 H 320 V 383 H 355 V 405 H 390 V 383 H 425 V 405 H 460 V 383 H 495 V 405 H 530 V 383 H 540 V 360"
            />
          </circle>

          {/* Caption */}
          <text x="380" y="436" textAnchor="middle" fontSize="11" fontFamily="monospace" letterSpacing="2" fill={ink} opacity="0.7">
            A FINITE STATE MACHINE · THE HEART OF EVERY COMPUTER
          </text>
        </svg>

        {/* Legend chips */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {[
            { c: CYAN, t: 'instant math' },
            { c: EMERALD, t: 'held state' },
            { c: AMBER, t: 'steady beat' },
          ].map((l) => (
            <span
              key={l.t}
              className="px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest"
              style={{ background: `${l.c}1a`, color: l.c, border: `1px solid ${l.c}55` }}
            >
              {l.t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Closing equation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-8 rounded-3xl border-2 text-center ${isDarkMode ? 'bg-violet-500/5 border-violet-400/30' : 'bg-violet-50 border-violet-300'}`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {[
            { Icon: Zap, label: 'fast math', color: CYAN },
            { Icon: Database, label: 'held memory', color: EMERALD },
            { Icon: Timer, label: 'a steady beat', color: AMBER },
          ].map((p, i) => (
            <React.Fragment key={p.label}>
              {i > 0 && (
                <motion.span
                  initial={{ opacity: 0 }} animate={isActive ? { opacity: 0.5 } : {}}
                  transition={{ delay: 0.85 + i * 0.2 }}
                  className={`text-2xl font-black ${textColor}`}
                >
                  +
                </motion.span>
              )}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.2, type: 'spring', stiffness: 260, damping: 18 }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2"
                style={{ borderColor: `${p.color}66`, background: `${p.color}12` }}
              >
                <p.Icon size={18} style={{ color: p.color }} />
                <span className="font-mono text-xs font-black uppercase tracking-widest" style={{ color: p.color }}>
                  {p.label}
                </span>
              </motion.div>
            </React.Fragment>
          ))}
          <motion.span
            initial={{ opacity: 0 }} animate={isActive ? { opacity: 0.5 } : {}}
            transition={{ delay: 1.45 }}
            className={`text-2xl font-black ${textColor}`}
          >
            =
          </motion.span>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.55, type: 'spring', stiffness: 260, damping: 16 }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2"
            style={{ borderColor: `${VIOLET}88`, background: `${VIOLET}1a` }}
          >
            <Cpu size={20} style={{ color: VIOLET }} />
            <span className="font-mono text-sm font-black uppercase tracking-widest" style={{ color: VIOLET }}>
              a thinking machine
            </span>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className={`text-lg md:text-xl font-black ${textColor}`}
        >
          Fast math + held memory + a steady beat = a thinking machine.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
          className={`text-sm mt-2 ${subText}`}
        >
          Raw electrical currents become organized intelligence.
        </motion.p>
      </motion.div>
    </div>
  );
};
