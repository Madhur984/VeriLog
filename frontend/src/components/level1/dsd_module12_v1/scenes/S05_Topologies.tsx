import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Gauge, Scale, Cpu } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const ROSE = '#fb7185';
const ORANGE = '#fb923c';
const SKY = '#38bdf8';

const PHASES = [
  { n: '1', title: 'Precomputation', body: 'In parallel from the inputs, every column makes its Generate Gᵢ = Aᵢ·Bᵢ and Propagate Pᵢ = Aᵢ⊕Bᵢ.', color: SKY },
  { n: '2', title: 'Prefix tree', body: 'The Black Cell network merges blocks level by level. The span doubles each stage, so it finishes in log₂N levels.', color: INDIGO },
  { n: '3', title: 'Sum computation', body: 'With every carry now known, each sum bit is one XOR: Sᵢ = Pᵢ ⊕ Cᵢ₋₁. The answer falls out.', color: EMERALD },
];

const TOPOS = [
  { name: 'Kogge-Stone', tag: 'maximum speed', body: 'Minimum logic depth - the fastest. The cost is the most wiring tracks and the largest physical area.', color: ROSE },
  { name: 'Brent-Kung', tag: 'area efficient', body: 'Minimal wiring and fan-out, so it is compact - but it has more levels, so marginally higher delay.', color: EMERALD },
  { name: 'Ladner-Fischer', tag: 'the hybrid', body: 'Balances Kogge-Stone speed with Brent-Kung area by managing fan-out at the internal nodes.', color: INDIGO },
];

const MATRIX = [
  { name: 'Ripple carry', delay: 'Linear', hw: 'Minimal', use: 'Low-power or tiny-area designs', color: ROSE },
  { name: 'Carry look-ahead', delay: 'Block-linear', hw: 'Moderate', use: 'Intermediate widths', color: ORANGE },
  { name: 'Parallel prefix', delay: 'Logarithmic', hw: 'High', use: 'High-speed CPU datapaths, wide vectors', color: INDIGO },
];

export const S05_Topologies: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Layers size={14} /> Chapter 06 · Phases & Topologies
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Three phases, and a family of trees</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Every parallel prefix adder runs the same three phases. The only thing that changes between
          designs is how the middle phase - the tree - is wired, trading speed against area.
        </p>
      </motion.section>

      {/* three phases */}
      <div className="grid md:grid-cols-3 gap-4">
        {PHASES.map((p) => (
          <motion.div key={p.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-black" style={{ background: p.color }}>{p.n}</div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{p.title}</h3>
            <p className={`mt-1.5 text-[13px] leading-relaxed ${subText}`}>{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* topologies */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Gauge size={16} style={{ color: INDIGO }} />
          <h3 className={`text-xl font-black ${textColor}`}>The same tree, wired three ways</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TOPOS.map((t) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
              <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest" style={{ background: `${t.color}1f`, color: t.color, border: `1px solid ${t.color}55` }}>{t.tag}</span>
              <h4 className={`mt-3 text-lg font-extrabold ${textColor}`}>{t.name}</h4>
              <p className={`mt-1.5 text-[13px] leading-relaxed ${subText}`}>{t.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* performance matrix */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
          <Scale size={15} style={{ color: INDIGO }} />
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: INDIGO }}>The whole adder family, side by side</span>
        </div>
        <div className="grid grid-cols-4 text-[11px] md:text-sm font-mono font-black uppercase tracking-widest text-center">
          <div className={`p-3 ${subText} text-left`}>Architecture</div>
          <div className={`p-3 ${subText}`}>Delay</div>
          <div className={`p-3 ${subText}`}>Hardware</div>
          <div className={`p-3 ${subText} text-left`}>Best for</div>
        </div>
        {MATRIX.map((m, i) => (
          <div key={m.name} className={`grid grid-cols-4 text-[12px] md:text-sm text-center border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${i === 2 ? (isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50/60') : ''}`}>
            <div className={`p-3 font-bold text-left ${textColor}`} style={i === 2 ? { color: INDIGO } : undefined}>{m.name}</div>
            <div className="p-3 font-medium" style={{ color: m.color }}>{m.delay}</div>
            <div className={`p-3 ${subText}`}>{m.hw}</div>
            <div className={`p-3 text-left ${subText}`}>{m.use}</div>
          </div>
        ))}
      </motion.div>

      {/* close */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${INDIGO}66`, background: isDarkMode ? 'rgba(129,140,248,0.06)' : 'rgba(129,140,248,0.05)' }}>
        <Cpu size={26} className="mx-auto mb-2" style={{ color: INDIGO }} />
        <p className={`text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          The critical-path delay is mathematically bounded by log₂N, which is why the parallel prefix
          adder is the definitive high-speed choice. When a modern CPU adds two 64-bit numbers in a
          single fast cycle, this is the circuit doing it.
        </p>
      </motion.div>
    </div>
  );
};

export default S05_Topologies;
