import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GitMerge, Layers, Gauge, Network } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Plain-English "Facts First" primer for the parallel-prefix adder — sits right
 * after the video. Clear GeeksforGeeks-style explanation: compute carries in a
 * tree so time grows like log₂(N), plus the three common topologies.
 */

export const S01b_Facts: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const chipBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const ACCENT = '#818cf8';

  const FACTS = [
    {
      Icon: Network, color: '#818cf8', tag: 'What it is',
      title: 'Carries built in a tree',
      body: (
        <>It is a faster carry-look-ahead adder. Instead of one big block of logic, it combines the
        <strong> Generate/Propagate</strong> signals of small groups in a <strong>tree</strong>,
        merging bigger and bigger spans.</>
      ),
    },
    {
      Icon: GitMerge, color: '#34d399', tag: 'The black cell',
      title: 'One step, repeated',
      body: (
        <>The whole tree is built from a single operation that merges two neighbouring blocks’
        (G, P) into one. Wire that same cell over and over and the carries fall out.</>
      ),
    },
    {
      Icon: Layers, color: '#22d3ee', tag: 'Why it is fast',
      title: 'log₂ N levels, not N',
      body: (
        <>Each level of the tree <strong>doubles</strong> the span it covers, so 16 bits need only
        <strong> 4</strong> levels (2⁴ = 16). Time grows like <span className="font-mono">log₂ N</span>
        — far better than a ripple’s <span className="font-mono">N</span>.</>
      ),
    },
    {
      Icon: Gauge, color: '#fb7185', tag: 'The flavours',
      title: 'Pick your trade-off',
      body: (
        <><strong>Kogge-Stone</strong> is the fastest (most wires). <strong>Brent-Kung</strong> uses
        the fewest gates (a little slower). <strong>Ladner-Fischer</strong> sits in between.</>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
          <BookOpen size={14} /> The Facts · Start Here
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The fastest way to add</h2>
        <p className={`text-base max-w-3xl leading-relaxed ${subText}`}>
          Carry-look-ahead is fast, but for wide numbers one giant block of logic gets clumsy. A
          <strong> parallel-prefix adder</strong> does the same job as a <strong>tree</strong>: it
          combines carries in pairs, then fours, then eights. This is the adder inside real high-speed
          processors.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        {FACTS.map((f, i) => {
          const Icon = f.Icon;
          return (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.07 }}
              className={`p-6 rounded-3xl border ${cardBg}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: `${f.color}22`, color: f.color, border: `1.5px solid ${f.color}55` }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: f.color }}>{f.tag}</div>
                  <h4 className={`text-lg font-black ${textColor}`}>{f.title}</h4>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${subText}`}>{f.body}</p>
            </motion.div>
          );
        })}
      </div>

      {/* the merge rule + level illustration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-7 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <GitMerge size={16} style={{ color: ACCENT }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>
            The merge rule · combine two blocks
          </span>
        </div>
        <div className={`p-4 rounded-xl font-mono text-sm md:text-base font-black ${chipBg} border`} style={{ color: ACCENT }}>
          G = G_high + P_high · G_low &nbsp;&nbsp;|&nbsp;&nbsp; P = P_high · P_low
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {['16 bits', 'level 1 → spans of 2', 'level 2 → spans of 4', 'level 3 → spans of 8', 'level 4 → all 16'].map((s, i) => (
            <span key={i} className={`px-3 py-1.5 rounded-full text-[11px] font-mono border ${chipBg}`}
                  style={{ color: i === 0 ? textColorHex(isDarkMode) : ACCENT, borderColor: i === 0 ? 'var(--border-soft)' : `${ACCENT}66` }}>
              {s}
            </span>
          ))}
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${textColor}`}>
          Each level merges twice the span of the one before. Four levels cover all 16 bits — that
          doubling is why a prefix adder is so much faster than waiting bit by bit.
        </p>
      </motion.div>

      <p className={`text-[11px] font-mono opacity-50 ${subText}`}>
        Next, the story — think of a knockout tournament where winners of small brackets meet to decide
        bigger ones.
      </p>
    </div>
  );
};

// tiny helper so the "16 bits" chip text stays readable in both themes
function textColorHex(isDark: boolean) { return isDark ? '#e2e8f0' : '#0f172a'; }
