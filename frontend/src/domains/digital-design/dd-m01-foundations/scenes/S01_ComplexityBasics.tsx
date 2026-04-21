import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#06B6D4';

const BinaryTree: React.FC = () => (
    <svg width={300} height={200} viewBox="0 0 300 200" className="mx-auto overflow-visible">
      {/* root */}
      <motion.circle 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        cx={150} cy={20} r={12} fill="#06060A" stroke={PHASE_COLOR} strokeWidth={2} 
      />
      
      {/* n=1 */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1={150} y1={32} x2={80} y2={80} stroke={PHASE_COLOR} strokeWidth={2} />
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1={150} y1={32} x2={220} y2={80} stroke={PHASE_COLOR} strokeWidth={2} />
      
      <motion.circle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} cx={80} cy={80} r={10} fill="#06060A" stroke={PHASE_COLOR} strokeWidth={2} />
      <motion.circle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} cx={220} cy={80} r={10} fill="#06060A" stroke={PHASE_COLOR} strokeWidth={2} />

      {/* n=2 */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} x1={80} y1={90} x2={40} y2={140} stroke={`${PHASE_COLOR}66`} strokeWidth={1} />
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} x1={80} y1={90} x2={120} y2={140} stroke={`${PHASE_COLOR}66`} strokeWidth={1} />
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} x1={220} y1={90} x2={180} y2={140} stroke={`${PHASE_COLOR}66`} strokeWidth={1} />
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} x1={220} y1={90} x2={260} y2={140} stroke={`${PHASE_COLOR}66`} strokeWidth={1} />
      
      {[40, 120, 180, 260].map((cx, i) => (
          <motion.circle key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} cx={cx} cy={140} r={8} fill="#06060A" stroke={`${PHASE_COLOR}66`} strokeWidth={1} />
      ))}

      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} x={150} y={180} textAnchor="middle" fill={PHASE_COLOR} className="text-xs font-mono font-black italic uppercase tracking-widest">
        Complexity = 2ⁿ Rows
      </motion.text>
    </svg>
);

const S01_ComplexityBasics: React.FC<{ sceneIndex: number; currentScene: number }> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="THE COMPLEXITY EXPLOSION" color={PHASE_COLOR} />
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-12 text-center gap-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8 }}
           className="flex flex-col gap-6"
        >
          <h2 className="text-5xl font-mono font-black italic text-white leading-tight uppercase tracking-tighter">
             Every variable <span className="text-cyan-500">doubles</span> the universe.
          </h2>
          <p className="text-xl font-mono font-black italic text-white/40 uppercase tracking-widest leading-relaxed">
             A single bit has 2 states. Two bits have 4. <br/>
             This exponential growth is why we cannot design by hand.
          </p>

          <div className="flex justify-center gap-4 mt-4">
             {[
               { id: 'tt', label: 'TRUTH_TABLE', def: 'The complete mapping of 2ⁿ input states to outputs.' },
               { id: 'min', label: 'MINTERM', def: 'A product term (AND gate) representing exactly one ON state.' },
             ].map(g => (
               <div key={g.id} className="group relative">
                  <button className="px-4 py-2 rounded-full border border-white/10 text-[10px] font-mono font-black italic text-white/20 hover:text-cyan-400 hover:border-cyan-400/40 transition-all uppercase tracking-widest">
                    {g.label} ?
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-4 rounded-xl bg-black border border-white/10 text-[10px] font-mono italic text-white/60 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <div className="text-cyan-500 mb-1">■ INTEL_LOG</div>
                    {g.def}
                  </div>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={isActive ? { opacity: 1, scale: 1 } : {}}
           transition={{ delay: 0.4, duration: 1 }}
           className="p-12 rounded-[40px] bg-black/40 border-2 border-cyan-500/10 shadow-2xl"
        >
          <BinaryTree />
        </motion.div>
      </div>
    </SceneWrapper>
  );
};

export default S01_ComplexityBasics;

