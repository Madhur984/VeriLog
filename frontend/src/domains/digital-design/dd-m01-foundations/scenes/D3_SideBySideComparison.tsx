import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms, getMaxterms } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FFC107';
const VARS = ['A', 'B', 'C'];

interface D3Props { sceneIndex: number; currentScene: number; tableRows: TruthTableRow[]; }

const D3_SideBySideComparison: React.FC<D3Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const minterms = getMinterms(tableRows, VARS);
  const maxterms = getMaxterms(tableRows, VARS);

  const sopGates = minterms.length + 1;
  const posGates = maxterms.length + 1;
  const winner = minterms.length < maxterms.length ? 'HIGH' : minterms.length > maxterms.length ? 'LOW' : 'BOTH';

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="THE ARCHITECT'S CHOICE" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Architectural <span className="text-amber-500">Selection</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Two paths to the same result. One is mathematically exhaustive; the other is dual. The choice is yours.
          </p>
        </motion.div>

        {/* Comparison Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
            {/* HIGH PATH */}
            <motion.div 
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`bg-[#06060A] rounded-[48px] p-10 border-2 transition-all ${winner === 'HIGH' ? 'border-amber-500 shadow-[0_0_50px_rgba(255,193,7,0.2)]' : 'border-white/5 opacity-40'}`}
            >
                <div className="text-[10px] font-mono font-black italic text-amber-500 uppercase tracking-widest mb-6">MINTERM_PATH</div>
                <div className="flex flex-col gap-4">
                    <div className="text-4xl font-mono font-black italic text-white/80">{sopGates} <span className="text-sm text-white/20 uppercase">GATES</span></div>
                    <div className="text-xs font-mono font-black italic text-white/40 uppercase tracking-widest">SOP_STRUCTURE</div>
                </div>
                {winner === 'HIGH' && (
                    <div className="mt-8 px-4 py-2 bg-amber-500 text-black text-[10px] font-mono font-black italic uppercase text-center rounded-full">OPTIMAL_PATH</div>
                )}
            </motion.div>

            {/* VS CENTER */}
            <div className="flex flex-col items-center gap-4">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
                <div className="text-4xl font-mono font-black italic text-white/10 uppercase tracking-tighter">VS</div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
            </div>

            {/* LOW PATH */}
            <motion.div 
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`bg-[#06060A] rounded-[48px] p-10 border-2 transition-all ${winner === 'LOW' ? 'border-orange-500 shadow-[0_0_50px_rgba(255,95,31,0.2)]' : 'border-white/5 opacity-40'}`}
            >
                <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest mb-6">MAXTERM_PATH</div>
                <div className="flex flex-col gap-4">
                    <div className="text-4xl font-mono font-black italic text-white/80">{posGates} <span className="text-sm text-white/20 uppercase">GATES</span></div>
                    <div className="text-xs font-mono font-black italic text-white/40 uppercase tracking-widest">POS_STRUCTURE</div>
                </div>
                {winner === 'LOW' && (
                    <div className="mt-8 px-4 py-2 bg-orange-500 text-black text-[10px] font-mono font-black italic uppercase text-center rounded-full">OPTIMAL_PATH</div>
                )}
            </motion.div>
        </div>

        <p className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em] mt-auto">
           Architectural decisions are made where logic meets economics.
        </p>
      </div>
    </SceneWrapper>
  );
};

export default D3_SideBySideComparison;
