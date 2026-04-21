import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms, mintermToProductTerm } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#06B6D4';
const VARS = ['A', 'B', 'C'];

interface A2Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
  selectedMinterms: Set<number>;
  onToggleMinterm: (index: number) => void;
}

const A2_Minterms: React.FC<A2Props> = ({
  sceneIndex, currentScene, tableRows, selectedMinterms, onToggleMinterm,
}) => {
  const isActive = currentScene === sceneIndex;
  const allMinterms = getMinterms(tableRows, VARS);
  const totalMinterms = allMinterms.length;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="MINTERM EXTRACTION" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-5xl mx-auto px-6 py-20 gap-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Extract the <span className="text-cyan-500">Minterms</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Focus only on the rows where F is 1. These define the "ON" states of your design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
            {/* Table Selection */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="bg-[#06060A] rounded-[48px] p-8 border-2 border-cyan-500/20 shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6 px-4">
                    <span className="text-[10px] font-mono font-black italic text-cyan-500 uppercase tracking-widest">ON_STATE_SELECTOR</span>
                    <span className="text-[10px] font-mono font-black italic text-white/20 uppercase">TARGET row[F=1]</span>
                </div>
                
                <div className="flex flex-col gap-2">
                    {tableRows.filter(r => r.output === true).map(row => (
                        <button
                            key={row.index}
                            onClick={() => onToggleMinterm(row.index)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${selectedMinterms.has(row.index) ? 'bg-cyan-500/20 border-cyan-500 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-tighter">ROW_{row.index}</span>
                                <div className="flex gap-2">
                                    {row.inputs.map((bit, bi) => (
                                        <div key={bi} className="px-2 py-1 rounded-lg bg-black/40 text-xs font-mono font-black text-white/80">{bit ? '1' : '0'}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono font-black italic text-[#A0FFA0]">F=1</span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMinterms.has(row.index) ? 'bg-cyan-500 border-cyan-500' : 'border-white/10'}`}>
                                    {selectedMinterms.has(row.index) && <span className="text-[10px]">✔</span>}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Expression Builder Visualizer */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="flex flex-col gap-8 justify-center"
            >
                <div className="text-center p-10 rounded-[48px] bg-white/5 border-2 border-white/5 shadow-2xl relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-black italic uppercase tracking-widest shadow-xl">
                       SOP_EQUATION_LOG
                    </div>
                    <AnimatePresence mode="popLayout">
                        {selectedMinterms.size === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-mono font-black italic text-white/10 uppercase tracking-widest h-32 flex items-center justify-center">
                               Select signals from table
                            </motion.div>
                        ) : (
                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 h-32 justify-center">
                                <div className="text-4xl font-mono font-black italic text-[#A0FFA0] tracking-tighter">
                                    F = {Array.from(selectedMinterms).map((idx, i) => (
                                        <span key={idx}>
                                            {i > 0 && <span className="text-cyan-500 mx-2">+</span>}
                                            {mintermToProductTerm(allMinterms.find(m => m.index === idx)!)}
                                        </span>
                                    ))}
                                </div>
                                {selectedMinterms.size === totalMinterms && (
                                    <div className="text-[10px] font-mono font-black italic text-cyan-500 uppercase tracking-[0.4em]">ALL_MINTERMS_ACCOUNTED_FOR</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 rounded-[32px] bg-black/40 border border-white/10 flex flex-col gap-4">
                    <div className="text-[10px] font-mono font-black italic text-white/30 uppercase tracking-widest">SIGNAL_RULE</div>
                    <p className="text-sm font-mono font-black italic text-white/60 leading-relaxed uppercase">
                        For MINTERMS, a '0' means we use the <span className="text-cyan-500 underline">COMPLEMENT</span> (e.g. A′). A '1' means we use the <span className="text-cyan-500 underline">TRUE</span> variable (e.g. A).
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default A2_Minterms;

