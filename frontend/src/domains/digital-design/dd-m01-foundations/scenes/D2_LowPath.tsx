import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMaxterms } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FF5F1F'; // Bright Orange/Red for Maxterm Choice
const VARS = ['A', 'B', 'C'];

interface D2Props { sceneIndex: number; currentScene: number; tableRows: TruthTableRow[]; }

const D2_LowPath: React.FC<D2Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const maxterms = getMaxterms(tableRows, VARS);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="THE LOW PATH" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Path Two: <span className="text-orange-500">Maxterm Focus</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Choose this path if your Truth Table has fewer 0s than 1s. You define exactly what BLOCKS the signal.
          </p>
        </motion.div>

        {/* Focused Path Anatomy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
            {/* Steps & Rules */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="flex flex-col gap-8"
            >
                <div className="p-8 rounded-[32px] bg-white/5 border-2 border-white/5 flex flex-col gap-6">
                    <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest">POS_PIPELINE</div>
                    <div className="flex flex-col gap-4">
                        {[
                            { step: '01', text: 'IDENTIFY F=0 ROWS' },
                            { step: '02', text: 'EXTRACT SUM TERMS' },
                            { step: '03', text: 'REDUCE WITH K-MAPS' },
                            { step: '04', text: 'MAP TO NOR-NOR' },
                        ].map(s => (
                            <div key={s.step} className="flex items-center gap-4 text-xs font-mono font-black italic text-white/60 uppercase">
                                <span className="text-orange-500">{s.step}</span>
                                <span>{s.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-[32px] bg-orange-500/10 border border-orange-500/20 text-xs font-mono font-black italic uppercase tracking-widest leading-relaxed text-orange-500">
                   ✓ BEST FOR: Dense functions (e.g. valid signals, ready states)
                </div>
            </motion.div>

            {/* Circuit Viewing Area */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className="bg-[#06060A] rounded-[48px] border-2 border-orange-500/20 p-12 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden"
            >
                <div className="absolute top-6 left-10 text-[10px] font-mono font-black italic text-orange-500/40 uppercase tracking-widest">PATH_REALISATION</div>
                <div className="scale-110 md:scale-125">
                    <CircuitCanvas
                        form="NOR-NOR"
                        maxterms={maxterms}
                        variables={VARS}
                        width={400}
                        height={Math.max(260, maxterms.length * 60)}
                    />
                </div>
            </motion.div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default D2_LowPath;
