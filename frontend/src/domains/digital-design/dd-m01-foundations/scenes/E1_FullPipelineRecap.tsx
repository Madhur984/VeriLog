import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#FF5F1F'; // High alert orange for recap/final

interface E1Props { sceneIndex: number; currentScene: number; recapNodeActive: string | null; onNodeClick: (id: string | null) => void; }

const PIPELINE_NODES = [
  { id: 'truth-table', label: 'TRUTH TABLE', detail: 'The absolute specification of logical behavior.', x: '10%' },
  { id: 'min-max', label: 'EXTRACTION', detail: 'Defining the logic with minterms or maxterms.', x: '30%' },
  { id: 'minimise', label: 'MINIMISATION', detail: 'Reducing gate cost while maintaining truth.', x: '50%' },
  { id: 'topology', label: 'TOPOLOGY', detail: 'Choosing the physical structure (SOP vs POS).', x: '70%' },
  { id: 'silicon', label: 'SILICON', detail: 'Final gate implementation with NAND/NOR gates.', x: '90%' },
];

const E1_FullPipelineRecap: React.FC<E1Props> = ({ sceneIndex, currentScene, recapNodeActive, onNodeClick }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="E" name="THE FOUNDATION LOG" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            The <span className="text-orange-500">Design</span> Pipeline.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            From abstract specification to physical silicon. This is the complete methodology of digital design.
          </p>
        </motion.div>

        {/* Focused Map Viewport */}
        <div className="w-full relative py-20">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2" />
            
            <div className="flex justify-between w-full relative z-10">
                {PIPELINE_NODES.map((node, i) => (
                    <motion.button
                        key={node.id}
                        onClick={() => onNodeClick(node.id === recapNodeActive ? null : node.id)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isActive ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: i * 0.1 }}
                        className={`flex flex-col items-center gap-4 transition-all ${recapNodeActive === node.id ? 'scale-110' : 'hover:scale-105'}`}
                    >
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${recapNodeActive === node.id ? 'bg-orange-500 border-white shadow-[0_0_30px_rgba(255,95,31,0.5)]' : 'bg-black border-white/20'}`}>
                            <span className="text-[10px] font-mono font-black italic text-white">{i+1}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-black italic uppercase tracking-widest ${recapNodeActive === node.id ? 'text-orange-500' : 'text-white/20'}`}>{node.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>

        {/* Detail Reveal */}
        <div className="w-full max-w-2xl min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                {recapNodeActive ? (
                    <motion.div
                        key={recapNodeActive}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center flex flex-col gap-4"
                    >
                        <span className="text-2xl font-mono font-black italic text-white uppercase tracking-tighter">
                            {PIPELINE_NODES.find(n => n.id === recapNodeActive)?.label}
                        </span>
                        <p className="text-sm font-mono font-black italic text-orange-500 uppercase tracking-widest max-w-lg">
                            {PIPELINE_NODES.find(n => n.id === recapNodeActive)?.detail}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono font-black italic text-white/10 uppercase tracking-[0.5em]">
                        Select_Node_To_Recap_Protocol
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Capstone Gateway */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={isActive ? { opacity: 1, scale: 1 } : {}}
           className="mt-auto px-12 py-5 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-xs tracking-[0.4em] uppercase shadow-[0_0_50px_rgba(255,95,31,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
        >
            Enter_Final_Assessment →
        </motion.div>
      </div>
    </SceneWrapper>
  );
};

export default E1_FullPipelineRecap;
