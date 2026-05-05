import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, Sigma, Table } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S12_ThreeFaces: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const FACES = [
    { Icon: Cpu,   label: 'Hardware',     sub: 'Logic Gates',     color: '#22d3ee', text: 'Inverters, AND-shells and OR-shells wired together. The world reads it as silicon.' },
    { Icon: Sigma, label: 'Algebra',      sub: 'Sum of Products', color: '#fbbf24', text: 'Y = A·B + A·C′. The world reads it as Boolean expressions.' },
    { Icon: Table, label: 'Truth Table',  sub: 'Exhaustive Logic',color: '#34d399', text: '8 rows · 3 minterms — m4, m6, m7. The world reads it as data.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <Layers size={14} /> Chapter 12 · The Equivalence
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Three Faces of the Same Truth</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Whether rendered in hardware (logic gates), abstract algebra (Sum of Products), or
          exhaustive logic (a truth table), the system is{' '}
          <strong className="text-emerald-300">perfectly mathematically equivalent</strong>. Three
          lenses · one truth.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img
          src="/images/noir/p13.png"
          alt="Three faces of the same truth"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-emerald-200/70">
          Casebook · Page 13
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {FACES.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * i }}
            className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden`}
            style={{ boxShadow: `0 20px 60px ${f.color}20` }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: `${f.color}40` }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}66` }}>
                  <f.Icon size={18} style={{ color: f.color }} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: f.color }}>
                    Panel {i + 1}
                  </div>
                  <h3 className={`font-black text-lg ${textColor}`}>{f.label}</h3>
                </div>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: f.color }}>
                {f.sub}
              </div>
              <p className={`text-sm ${subText} leading-relaxed`}>{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* The equivalence diamond */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-6 text-center">
          The conversion graph
        </div>
        <svg viewBox="0 0 600 280" className="w-full h-auto max-w-2xl mx-auto">
          {/* nodes */}
          <g fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">
            <circle cx="300" cy="50"  r="42" fill="#01040c" stroke="#22d3ee" strokeWidth="2.5" />
            <text x="300" y="46" fill="#22d3ee">Circuit</text>
            <text x="300" y="62" fill="#22d3ee" fontSize="9">Hardware</text>

            <circle cx="100" cy="220" r="42" fill="#01040c" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="100" y="216" fill="#fbbf24">SOP</text>
            <text x="100" y="232" fill="#fbbf24" fontSize="9">Algebra</text>

            <circle cx="500" cy="220" r="42" fill="#01040c" stroke="#34d399" strokeWidth="2.5" />
            <text x="500" y="216" fill="#34d399">TT</text>
            <text x="500" y="232" fill="#34d399" fontSize="9">Truth Table</text>
          </g>

          {/* edges with labels */}
          <line x1="270" y1="80"  x2="135" y2="190" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="170" y="125" fill="#94a3b8" fontFamily="monospace" fontSize="10">trace gates</text>

          <line x1="330" y1="80"  x2="465" y2="190" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="395" y="125" fill="#94a3b8" fontFamily="monospace" fontSize="10">enumerate</text>

          <line x1="142" y1="220" x2="458" y2="220" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="270" y="240" fill="#94a3b8" fontFamily="monospace" fontSize="10">evaluate / minterms</text>

          {/* reverse arrows */}
          <text x="170" y="160" fill="#fcd34d" fontFamily="monospace" fontSize="10">synthesise</text>
          <text x="395" y="160" fill="#fcd34d" fontFamily="monospace" fontSize="10">read SOP</text>
          <text x="280" y="195" fill="#fcd34d" fontFamily="monospace" fontSize="10">K-Map ↔ algebra</text>
        </svg>
        <p className={`text-xs ${subText} text-center mt-4 max-w-xl mx-auto`}>
          Every edge is a skill you now own. Move freely between the three vertices and you can
          design — or decode — any combinational circuit.
        </p>
      </motion.div>
    </div>
  );
};
