import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#3B82F6';

interface B3Props { sceneIndex: number; currentScene: number; }

const LIMITS = [
  { n: 2, cells: 4, label: 'TRIVIAL' },
  { n: 4, cells: 16, label: 'STANDARD' },
  { n: 6, cells: 64, label: 'HUMAN_LIMIT' },
  { n: 8, cells: 256, label: 'MACHINE_ONLY' },
];

const B3_KMapLimits: React.FC<B3Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <h1 className="sr-only">K-Map Scaling Limits</h1>
      <PhaseLabel phase="B" name="SCALING LIMITS" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16" aria-label="Scaling limits progression">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            The <span className="text-blue-500">Scaling</span> Wall.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Geometric intuition is a superpower for small logic. But as inputs grow, visual adjacency breaks. At $n &gt; 6$, the human eye can no longer "see" the truth.
          </p>
        </motion.div>

        {/* Focused Progression */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full border-t border-white/5 pt-16">
            {LIMITS.map((limit, i) => (
                <motion.div
                    key={limit.n}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div 
                        className={`w-32 h-32 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden transition-all ${limit.n > 6 ? 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10'}`}
                    >
                        <span className="text-2xl font-mono font-black italic text-white/80">{limit.n}V</span>
                        {limit.n > 6 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-black text-[10px] font-mono font-black italic uppercase tracking-tighter">UNSTABLE</div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono font-black italic text-white/40 uppercase tracking-widest">{limit.label}</span>
                        <span className="text-[10px] font-mono font-black italic text-blue-500 uppercase">{limit.cells} CELLS</span>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="p-10 rounded-[32px] bg-white/5 border-2 border-white/5 w-full max-w-4xl flex flex-col md:flex-row gap-10 items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-2xl">🤖</div>
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-black italic text-blue-500 uppercase tracking-widest">INDUSTRY_ESCAPE_PATH</span>
                <p className="text-sm font-mono font-black italic text-white/60 uppercase tracking-tight leading-relaxed">
                    Beyond 6 variables, we discard K-Maps. EDA tools switch to <span className="text-white">Quine-McCluskey</span> and <span className="text-white">Espresso</span> algorithms for machine-grade optimization.
                </p>
            </div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default B3_KMapLimits;
