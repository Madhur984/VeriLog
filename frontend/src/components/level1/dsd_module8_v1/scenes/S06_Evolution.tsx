import React from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows, AlertTriangle, Link2 } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const ROSE = '#fb7185';
const VIOLET = '#a78bfa';

const COMPARISON: Array<{ param: string; ha: string; fa: string; faWins: boolean }> = [
  { param: 'Input capacity',      ha: '2 ports (A, B)',               fa: '3 ports (A, B, Cin)',                      faWins: true },
  { param: 'Output capacity',     ha: '2 ports (S, Cout)',            fa: '2 ports (S, Cout)',                        faWins: false },
  { param: 'Multi-bit cascading', ha: 'Impossible (lacks Cin)',       fa: 'Supported (propagates Cout to Cin)',       faWins: true },
  { param: 'Internal complexity', ha: 'Base level (1 XOR, 1 AND)',    fa: 'Synthesized structure (2 HA + 1 OR)',      faWins: true },
];

export const S06_Evolution: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim       = isDarkMode ? '#475569' : '#94a3b8';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <GitCompareArrows size={14} /> Chapter 07 · Architectural Evolution
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Half vs. Full Adder</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Side by side, the upgrade is small on paper - one extra input port - but it changes
          what the machine <em>is</em>: a one-off calculator becomes a chainable building block.
        </p>
      </section>

      {/* comparison table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[560px] md:min-w-0">
            <div className={`grid grid-cols-3 font-mono text-[10px] md:text-[11px] uppercase tracking-widest py-3 px-4 ${
              isDarkMode ? 'bg-white/[0.06]' : 'bg-slate-100'
            }`}>
              <span style={{ color: AMBER }}>Parameter</span>
              <span style={{ color: ROSE }}>Half Adder</span>
              <span style={{ color: CYAN }}>Full Adder</span>
            </div>
            {COMPARISON.map(({ param, ha, fa, faWins }, i) => (
              <motion.div key={param}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className={`grid grid-cols-3 items-center gap-2 py-4 px-4 border-t text-[13px] md:text-sm ${textColor}`}
                          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                <span className="font-bold">{param}</span>
                <span className={`font-mono ${subText}`}>{ha}</span>
                <span className="font-mono font-bold" style={{ color: faWins ? CYAN : undefined }}>{fa}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* the imperative */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50'}`}
                  style={{ borderColor: `${AMBER}55` }}>
        <div className="flex items-start gap-3 max-w-3xl mx-auto">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: AMBER }} />
          <p className={`text-sm leading-relaxed ${textColor}`}>
            <strong style={{ color: AMBER }}>The Imperative:</strong> the full adder architecture
            is necessitated <em>entirely</em> by the requirement to process carry-over from
            preceding computational stages in multi-bit arithmetic. No carry-in, no chaining -
            and no chaining means no 8-bit, 32-bit or 64-bit addition at all.
          </p>
        </div>
      </motion.div>

      {/* ripple chain visual */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          <Link2 size={13} /> What cascading buys · a 4-bit ripple-carry adder
        </div>

        <svg viewBox="0 0 640 170" className="w-full max-w-3xl mx-auto h-auto" role="img"
             aria-label="Four full adder blocks chained: each carry-out feeds the next carry-in">
          {[3, 2, 1, 0].map((bit, i) => {
            const x = 30 + i * 150;
            return (
              <g key={bit}>
                {/* operand inputs */}
                <line x1={x + 25} y1={18} x2={x + 25} y2={40} stroke={dim} strokeWidth="2" />
                <line x1={x + 65} y1={18} x2={x + 65} y2={40} stroke={dim} strokeWidth="2" />
                <text x={x + 25} y={12} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={dim}>A{bit}</text>
                <text x={x + 65} y={12} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={dim}>B{bit}</text>
                {/* FA block */}
                <rect x={x} y={40} width={90} height={60} rx={10} fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
                <text x={x + 45} y={76} textAnchor="middle" fontSize="15" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>FA{bit}</text>
                {/* sum output */}
                <line x1={x + 45} y1={100} x2={x + 45} y2={122} stroke={CYAN} strokeWidth="2" />
                <text x={x + 45} y={136} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={CYAN}>S{bit}</text>
                {/* carry chain to the left block */}
                {i < 3 ? (
                  <g>
                    <line x1={x + 90 + 60} y1={70} x2={x + 90} y2={70} stroke={AMBER} strokeWidth="2.5" />
                    <polygon points={`${x + 96},65 ${x + 90},70 ${x + 96},75`} fill={AMBER} />
                    <text x={x + 90 + 30} y={62} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>
                      Cout→Cin
                    </text>
                  </g>
                ) : (
                  <g>
                    <line x1={x + 150} y1={70} x2={x + 90} y2={70} stroke={dim} strokeWidth="2" strokeDasharray="4 4" />
                    <text x={x + 122} y={62} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={dim}>Cin = 0</text>
                  </g>
                )}
              </g>
            );
          })}
          {/* final carry out on the far left */}
          <line x1={30} y1={70} x2={4} y2={70} stroke={AMBER} strokeWidth="2.5" />
          <text x={17} y={58} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>C4</text>
        </svg>

        <p className={`text-sm text-center max-w-2xl mx-auto mt-4 ${subText}`}>
          Each block's <span className="font-mono font-bold" style={{ color: AMBER }}>Cout</span> rides
          into the next block's <span className="font-mono font-bold" style={{ color: EMERALD }}>Cin</span> -
          the carry <em>ripples</em> right to left, exactly like the hand-written carry in
          column addition. Four blocks add two 4-bit numbers; sixty-four add the operands
          inside a modern CPU.
        </p>
      </motion.div>

      {/* fact cards */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="grid sm:grid-cols-3 gap-3">
        {[
          ['Same outputs, new reach', 'Both adders emit exactly S and Cout. The difference is not what comes out - it is what the block can ACCEPT. Interfaces define machines.', CYAN],
          ['First-stage trick', 'Bit 0 of a ripple adder has no previous column, so its Cin is tied to 0. Some designs even use a plain half adder there - the only seat where one still fits.', VIOLET],
          ['The cost of growth', 'The HA is base level: 1 XOR + 1 AND. The FA is a synthesized structure: 2 XOR, 2 AND, 1 OR. Five gates buy infinite width via chaining.', EMERALD],
        ].map(([title, body, color]) => (
          <div key={title as string} className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: color as string }}>
              {title}
            </div>
            <p className={`text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
