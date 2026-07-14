import React from 'react';
import { motion } from 'framer-motion';

interface Props { isActive?: boolean; isDarkMode: boolean; }

const CYAN = '#22d3ee';
const AMBER = '#fbbf24';
const EMERALD = '#34d399';

/**
 * T = one clock period in seconds. Every clocked animation (CLK blink,
 * stepped output lamp, timing-strip playhead, feedback flow) uses exactly
 * `duration: T` so the sequential card visibly "beats" while the
 * combinational card keeps flowing freely at the original 1.8s (= T / 2).
 */
const T = 3.6;

/**
 * Simple block diagram, drawn twice:
 *  - combinational: inputs -> LOGIC -> output, plus a dashed ghost of the
 *    missing memory and loop so both drawings share the same geometry
 *  - sequential: the SAME pipeline plus a MEMORY box (with a CLK pin) and
 *    a labeled feedback loop
 * The point of the cover: the only real difference is the loop.
 */
const BlockDiagram: React.FC<{ withMemory: boolean; accent: string; isDarkMode: boolean }> = ({
  withMemory, accent, isDarkMode,
}) => {
  const ink = isDarkMode ? '#e2e8f0' : '#0f172a';
  const faint = isDarkMode ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.25)';
  const boxFill = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
  const idle = isDarkMode ? '#475569' : '#cbd5e1';

  return (
    <svg viewBox="0 0 360 230" className="w-full h-auto" role="img"
      aria-label={withMemory
        ? 'Sequential circuit: logic block with a clocked memory box and a feedback loop carrying the stored state back in'
        : 'Combinational circuit: inputs straight through a logic block to the output, with no memory and no feedback'}>
      {/* input wires */}
      {[78, 102].map((y) => (
        <g key={y}>
          <line x1="16" y1={y} x2="120" y2={y} stroke={faint} strokeWidth="3" />
          <motion.line
            x1="16" y1={y} x2="120" y2={y}
            stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 18"
            animate={{ strokeDashoffset: [0, -96] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        </g>
      ))}
      <text x="16" y="62" fontFamily="monospace" fontSize="11" fill={ink} opacity="0.7">INPUTS</text>

      {/* logic block: identical on both cards, tiny gate glyphs inside */}
      <rect x="120" y="48" width="120" height="84" rx="12" fill={boxFill} stroke={accent} strokeWidth="2.5" />
      <text x="180" y="76" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="14" fill={ink}>LOGIC</text>
      <g transform="translate(144 88)" stroke={ink} strokeWidth="1.5" fill="none" opacity="0.35">
        {/* AND */}
        <path d="M 0 0 H 8 A 7.5 7.5 0 0 1 8 15 H 0 Z" />
        {/* OR */}
        <path d="M 26 0 Q 30 7.5 26 15 Q 36 14 41 7.5 Q 36 1 26 0 Z" />
        {/* NOT */}
        <path d="M 56 1 L 67 7.5 L 56 14 Z" />
        <circle cx="69.5" cy="7.5" r="2.3" />
      </g>
      <text x="180" y="122" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ink} opacity="0.5">gates only</text>

      {/* output wire + lamp */}
      <line x1="240" y1="90" x2="320" y2="90" stroke={faint} strokeWidth="3" />
      <motion.line
        x1="240" y1="90" x2="320" y2="90"
        stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 18"
        animate={{ strokeDashoffset: [0, -96] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
      {withMemory ? (
        /* clocked lamp: holds, then SNAPS bright on the tick */
        <motion.circle
          cx="332" cy="90" r="11" fill={accent}
          animate={{ opacity: [0.35, 0.35, 1, 1, 0.35] }}
          transition={{ duration: T, repeat: Infinity, ease: 'linear', times: [0, 0.48, 0.52, 0.85, 1] }}
        />
      ) : (
        /* free-running lamp: breathes with the input flow */
        <motion.circle
          cx="332" cy="90" r="11" fill={accent}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <text x="332" y="62" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={ink} opacity="0.7">OUTPUT</text>

      {withMemory ? (
        <>
          {/* feedback loop: output -> memory -> back into logic */}
          <path d="M 280 90 L 280 178 L 196 178" fill="none" stroke={faint} strokeWidth="3" />
          <path d="M 124 178 L 84 178 L 84 102 L 116 102" fill="none" stroke={faint} strokeWidth="3" />
          <motion.path
            d="M 280 90 L 280 178 L 196 178"
            fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 18"
            animate={{ strokeDashoffset: [0, -96] }}
            transition={{ duration: T, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 124 178 L 84 178 L 84 102 L 116 102"
            fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 18"
            animate={{ strokeDashoffset: [0, -96] }}
            transition={{ duration: T, repeat: Infinity, ease: 'linear' }}
          />
          {/* arrowhead where the stored state re-enters the logic */}
          <polygon points="110,97 120,102 110,107" fill={accent} />
          {/* wire names that match the formula chip */}
          <text x="286" y="142" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.75">next state</text>
          <text x="78" y="146" textAnchor="end" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.85">stored state</text>

          {/* memory box */}
          <rect x="124" y="158" width="72" height="40" rx="9" fill={boxFill} stroke={accent} strokeWidth="2.5" />
          <text x="160" y="176" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="10" fill={ink}>MEMORY</text>
          <text x="160" y="188" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={ink} opacity="0.6">flip-flops</text>

          {/* CLK pin: edge-trigger triangle, blinks once per period */}
          <motion.g
            animate={{ opacity: [0.3, 0.3, 1, 1, 0.3] }}
            transition={{ duration: T, repeat: Infinity, ease: 'linear', times: [0, 0.46, 0.5, 0.62, 1] }}
          >
            <line x1="160" y1="210" x2="160" y2="198" stroke={accent} strokeWidth="2" />
            <polyline points="153,198 160,189 167,198" fill="none" stroke={accent} strokeWidth="2" />
          </motion.g>
          <text x="160" y="222" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>CLK</text>

          <text x="262" y="222" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>the past comes back</text>
        </>
      ) : (
        <>
          {/* dashed ghost of the loop this circuit does NOT have */}
          <path d="M 280 90 L 280 178 L 196 178" fill="none" stroke={idle} strokeWidth="2" strokeDasharray="5 7" opacity="0.18" />
          <path d="M 124 178 L 84 178 L 84 102 L 116 102" fill="none" stroke={idle} strokeWidth="2" strokeDasharray="5 7" opacity="0.18" />
          <rect x="124" y="158" width="72" height="40" rx="9" fill="none" stroke={idle} strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
          <text x="160" y="181" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={idle}>NO MEMORY</text>
          <text x="262" y="222" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.45">nothing stored · nothing comes back</text>
        </>
      )}
    </svg>
  );
};

/**
 * Tiny two/three-lane timing strip: structure above (BlockDiagram) shows
 * the wiring, this shows the BEHAVIOR. Combinational: OUT flips the same
 * instant IN flips. Sequential: OUT moves only on the next CLK tick.
 * All traces are static path strings; one shared playhead sweeps both
 * cards in lockstep (duration T).
 */
const TimingStrip: React.FC<{ clocked: boolean; accent: string; isDarkMode: boolean }> = ({
  clocked, accent, isDarkMode,
}) => {
  const ink = isDarkMode ? '#e2e8f0' : '#0f172a';

  return (
    <svg viewBox="0 0 360 96" className="w-full h-auto" role="img"
      aria-label={clocked
        ? 'Timing: the output changes only at the rising clock ticks'
        : 'Timing: the output follows the input the same instant it changes'}>
      {clocked ? (
        <>
          <text x="42" y="21" textAnchor="end" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.7">CLK</text>
          <text x="42" y="49" textAnchor="end" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.7">IN</text>
          <text x="42" y="77" textAnchor="end" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.7">OUT</text>
          <g transform="translate(50 0)">
            {/* rising-edge tick marks */}
            {[50, 150, 250].map((x) => (
              <g key={x}>
                <line x1={x} y1="6" x2={x} y2="84" stroke={accent} strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
                <polygon points={`${x - 3},31 ${x + 3},31 ${x},25`} fill={accent} opacity="0.7" />
              </g>
            ))}
            {/* CLK: steady beat */}
            <path
              d="M 0 24 L 50 24 L 50 12 L 100 12 L 100 24 L 150 24 L 150 12 L 200 12 L 200 24 L 250 24 L 250 12 L 300 12"
              fill="none" stroke={accent} strokeWidth="2" opacity="0.55" strokeLinejoin="round"
            />
            {/* IN: flips between ticks */}
            <path
              d="M 0 52 L 80 52 L 80 40 L 210 40 L 210 52 L 300 52"
              fill="none" stroke={ink} strokeWidth="2" opacity="0.5" strokeLinejoin="round"
            />
            {/* OUT: waits for the next rising edge */}
            <path
              d="M 0 80 L 150 80 L 150 68 L 250 68 L 250 80 L 300 80"
              fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 4px ${accent}66)` }}
            />
            <motion.line
              x1="0" y1="6" x2="0" y2="84" stroke={ink} strokeWidth="1" opacity="0.35"
              animate={{ x: [0, 300] }}
              transition={{ duration: T, repeat: Infinity, ease: 'linear' }}
            />
          </g>
          <text x="200" y="94" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>
            IN flips early · OUT waits for the next tick
          </text>
        </>
      ) : (
        <>
          <text x="42" y="33" textAnchor="end" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.7">IN</text>
          <text x="42" y="69" textAnchor="end" fontFamily="monospace" fontSize="9" fill={ink} opacity="0.7">OUT</text>
          <g transform="translate(50 0)">
            {/* IN: flips whenever */}
            <path
              d="M 0 36 L 60 36 L 60 24 L 140 24 L 140 36 L 220 36 L 220 24 L 300 24"
              fill="none" stroke={ink} strokeWidth="2" opacity="0.5" strokeLinejoin="round"
            />
            {/* OUT: same shape, shifted by a hair (gate delay) */}
            <path
              d="M 0 72 L 65 72 L 65 60 L 145 60 L 145 72 L 225 72 L 225 60 L 300 60"
              fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 4px ${accent}66)` }}
            />
            <motion.line
              x1="0" y1="6" x2="0" y2="84" stroke={ink} strokeWidth="1" opacity="0.35"
              animate={{ x: [0, 300] }}
              transition={{ duration: T, repeat: Infinity, ease: 'linear' }}
            />
          </g>
          <text x="200" y="94" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>
            OUT follows IN the same instant · only gate delay
          </text>
        </>
      )}
    </svg>
  );
};

/** One plain difference row: label on the left, value on the right. */
const DiffRow: React.FC<{ label: string; value: string; accent: string; isDarkMode: boolean }> = ({
  label, value, accent, isDarkMode,
}) => (
  <div className={`flex items-center justify-between gap-3 py-2 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
    <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    <span className="text-sm font-bold text-right" style={{ color: accent }}>{value}</span>
  </div>
);

interface Side {
  accent: string;
  name: string;
  tagline: string;
  withMemory: boolean;
  formula: React.ReactNode;
  rows: ReadonlyArray<readonly [string, string]>;
}

export const S00_Cover: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const sides: readonly Side[] = [
    {
      accent: CYAN,
      name: 'Combinational',
      tagline: 'lives in the NOW',
      withMemory: false,
      formula: <>Output = F(inputs)</>,
      rows: [
        ['Output from', 'present inputs only'],
        ['Memory', 'none'],
        ['Feedback loop', 'none'],
        ['Clock', 'no clock input of its own'],
        ['Real life', 'the tea vendor'],
        ['Examples', 'adder, MUX, decoder'],
      ],
    },
    {
      accent: AMBER,
      name: 'Sequential',
      tagline: 'remembers the THEN',
      withMemory: true,
      formula: <>Next = F(inputs, <span style={{ color: EMERALD }}>state</span>)</>,
      rows: [
        ['Output from', 'inputs + stored state'],
        ['Memory', 'yes, flip-flops'],
        ['Feedback loop', 'output comes back'],
        ['Clock', 'one shared clock for all'],
        ['Real life', 'the cricket scoreboard'],
        ['Examples', 'counter, register, RAM'],
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-5"
      >
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          The Logic of<br />
          <span style={{ color: CYAN }}>Now</span> and <span style={{ color: AMBER }}>Then</span>.
        </h1>
        <p className={`text-xl ${subText} max-w-3xl`}>
          Two circuit families. One difference: does anything get remembered?
        </p>
      </motion.section>

      {/* Simple side-by-side difference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {sides.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 18 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12 }}
            className={`rounded-3xl border ${cardBg} p-6 md:p-7 flex flex-col`}
            style={{ boxShadow: isDarkMode ? `0 0 50px ${s.accent}0d` : undefined }}
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h2 className="text-2xl font-black tracking-tight" style={{ color: s.accent }}>{s.name}</h2>
              <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${subText}`}>{s.tagline}</span>
            </div>

            {/* the rule, in one line */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-[9px] uppercase tracking-[0.22em] ${subText}`}>the rule</span>
              <span
                className="px-3 py-1 rounded-full border font-mono text-[11px] font-bold tracking-wide"
                style={{ borderColor: `${s.accent}55`, color: s.accent, background: `${s.accent}10` }}
              >
                {s.formula}
              </span>
            </div>

            <BlockDiagram withMemory={s.withMemory} accent={s.accent} isDarkMode={isDarkMode} />

            <div className="mt-2">
              <TimingStrip clocked={s.withMemory} accent={s.accent} isDarkMode={isDarkMode} />
            </div>

            <div className="mt-auto pt-2">
              {s.rows.map(([label, value]) => (
                <DiffRow key={label} label={label} value={value} accent={s.accent} isDarkMode={isDarkMode} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* The one-line takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-2xl border ${cardBg} px-6 py-4 text-center`}
      >
        <span className={`text-sm md:text-base font-semibold ${textColor}`}>
          Same gates on both sides. The only difference is the{' '}
          <span style={{ color: EMERALD }}>loop into memory</span>, and even that memory is just
          gates wired back on themselves. One loop is all it takes to remember.
        </span>
      </motion.div>
    </div>
  );
};
