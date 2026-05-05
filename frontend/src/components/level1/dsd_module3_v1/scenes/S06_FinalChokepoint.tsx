import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S06_FinalChokepoint: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Crosshair size={14} /> Chapter 06 · End-to-Start
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Tracing Back: The Final Chokepoint</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Madhur stands at the vault. Just upstream of Y is a single OR gate — the
          <strong className="text-amber-300"> final chokepoint</strong>. The vault opens if
          <em> either</em> incoming wire is high.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
        >
          <img
            src="/images/noir/p06.png"
            alt="The final chokepoint"
            className="w-full block aspect-[16/9] object-cover"
          />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
            Casebook · Page 06
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">First inference</div>
          <h3 className={`text-2xl font-black ${textColor}`}>Y = (Path 1) + (Path 2)</h3>
          <p className={`text-sm ${subText} leading-relaxed`}>
            We do not yet know what feeds the OR gate. We only know that whatever the two
            unknown wires turn out to be, the output is their <strong>logical sum</strong>.
          </p>
          <div className={`p-5 rounded-2xl border border-amber-400/30 bg-amber-500/5`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Notebook</div>
            <pre className={`font-mono text-sm ${textColor}`}>
{`Y = ?  +  ?
        ↑       ↑
     Path 1  Path 2`}
            </pre>
          </div>
          <p className={`text-xs ${subText}`}>
            Naming the unknowns <em>Path 1</em> and <em>Path 2</em> is the key trick. They are
            placeholders we&apos;ll resolve in the next chapter.
          </p>
        </motion.div>
      </div>

      {/* Animated OR gate */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
          The OR gate · the final chokepoint
        </div>
        <svg viewBox="0 0 600 240" className="w-full h-auto">
          <text x="20" y="80"  fill="#fbbf24" fontFamily="monospace" fontSize="14" fontWeight="bold">Path 1</text>
          <text x="20" y="170" fill="#22d3ee" fontFamily="monospace" fontSize="14" fontWeight="bold">Path 2</text>

          <line x1="80" y1="76" x2="220" y2="100" stroke="#fbbf24" strokeWidth="2.5">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;200 0" dur="2.4s" repeatCount="indefinite" />
          </line>
          <line x1="80" y1="166" x2="220" y2="142" stroke="#22d3ee" strokeWidth="2.5">
            <animate attributeName="stroke-dasharray" values="0 200;200 0;200 0" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
          </line>

          <path d="M 220 80 Q 240 121 220 162 Q 280 152 320 121 Q 280 90 220 80 Z" fill="none" stroke="#34d399" strokeWidth="3" />
          <text x="240" y="125" fill="#34d399" fontFamily="monospace" fontSize="14" fontWeight="bold">OR</text>

          <line x1="320" y1="121" x2="480" y2="121" stroke="#34d399" strokeWidth="3">
            <animate attributeName="stroke" values="#34d399;#fcd34d;#34d399" dur="1.8s" repeatCount="indefinite" />
          </line>
          <rect x="480" y="100" width="80" height="40" rx="6" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <text x="505" y="128" fill="#34d399" fontFamily="monospace" fontSize="20" fontWeight="bold">Y</text>
        </svg>
        <div className="text-center mt-4 font-mono text-base text-amber-300 font-bold tracking-wide">
          Y = Path 1 + Path 2
        </div>
      </motion.div>
    </div>
  );
};
