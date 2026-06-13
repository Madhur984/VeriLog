import React from 'react';
import { motion } from 'framer-motion';
import { Network, GitMerge, Layers, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const SKY = '#38bdf8';
const ROSE = '#fb7185';

export const S01_Concept: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // a tiny knockout bracket: 8 leaves -> 3 rounds
  const rounds = [8, 4, 2, 1];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: INDIGO }}>
          <Network size={14} /> The Tournament of Carries
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          Don't ask one judge. <span style={{ color: INDIGO }}>Run a bracket.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          To find the carry into every column, the look-ahead chef tried to reason about all the
          columns at once - which needs a giant brain (huge gates). The prefix adder is smarter: it
          runs a knockout tournament. Merge columns in pairs, then merge the pairs, then merge those,
          doubling the span each round. After log₂N rounds, every carry is decided.
        </p>
      </motion.section>

      {/* the bracket visual */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-5 text-center" style={{ color: INDIGO }}>8 columns, decided in 3 rounds (log₂8)</div>
        <div className="space-y-2">
          {rounds.map((count, level) => (
            <div key={level} className="flex items-center gap-3">
              <span className="font-mono text-[10px] w-20 text-right" style={{ color: INDIGO }}>
                {level === 0 ? 'columns' : `round ${level}`}
              </span>
              <div className="flex-1 flex gap-1.5">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="flex-1 h-7 rounded-md border-2 flex items-center justify-center font-mono text-[10px] font-black transition-all"
                       style={{ borderColor: level === rounds.length - 1 ? EMERALD : INDIGO, background: level === 0 ? 'transparent' : `${INDIGO}1a`, color: level === rounds.length - 1 ? EMERALD : INDIGO }}>
                    {level === 0 ? i : `×${Math.pow(2, level + 1)}`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className={`mt-4 text-center text-sm max-w-2xl mx-auto ${subText}`}>
          Each round halves the number of blocks and doubles their span. 8 → 4 → 2 → 1. Sixteen
          columns would take 4 rounds, sixty-four would take 6. The work grows, but the
          <strong style={{ color: INDIGO }}> number of levels</strong> barely does.
        </p>
      </motion.div>

      {/* block G and P */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: INDIGO }}>What gets merged</div>
          <h3 className={`text-2xl font-black ${textColor}`}>A whole block has a Generate and a Propagate too</h3>
          <p className={`mt-2 text-sm max-w-2xl mx-auto ${subText}`}>
            The trick is to summarise a span of columns with just two bits, exactly like a single column.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${EMERALD}26`, border: `1px solid ${EMERALD}55` }}><GitMerge size={20} style={{ color: EMERALD }} /></div>
            <h4 className={`mt-4 text-lg font-extrabold ${textColor}`}>Block Generate</h4>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
              A span produces a carry if its <strong style={{ color: EMERALD }}>upper part generates one</strong>, or
              if the upper part propagates a carry that its <strong style={{ color: EMERALD }}>lower part generated</strong>.
            </p>
          </div>
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${SKY}26`, border: `1px solid ${SKY}55` }}><Layers size={20} style={{ color: SKY }} /></div>
            <h4 className={`mt-4 text-lg font-extrabold ${textColor}`}>Block Propagate</h4>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
              A span passes a carry all the way through only if <strong style={{ color: SKY }}>every column inside it</strong>{' '}
              propagates - both the upper and the lower part must propagate.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${INDIGO}66`, background: isDarkMode ? 'rgba(129,140,248,0.06)' : 'rgba(129,140,248,0.05)' }}>
        <ArrowRight size={26} className="mx-auto mb-2" style={{ color: INDIGO }} />
        <p className={`text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          Because a block's (G, P) can be combined from two smaller blocks' (G, P) the same way every
          time, you can build the whole tree from one tiny, repeated merge cell. That cell is the
          <span style={{ color: INDIGO }}> Black Cell</span> - up next.
        </p>
      </motion.div>
    </div>
  );
};

export default S01_Concept;
