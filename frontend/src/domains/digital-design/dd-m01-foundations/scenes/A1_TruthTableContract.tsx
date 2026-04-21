import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import TruthTableBuilder from '../components/TruthTableBuilder';
import type { TruthTableRow } from '../ModuleD1.types';

const PHASE_COLOR = '#06B6D4';

interface A1Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
  tableLocked: boolean;
  tableUnlocked: boolean;
  tableLockAttempted: boolean;
  onRowsChange: (rows: TruthTableRow[]) => void;
  onLock: () => void;
  onUnlock: () => void;
  onReset: () => void;
}

const A1_TruthTableContract: React.FC<A1Props> = ({
  sceneIndex, currentScene, tableRows, tableLocked, tableUnlocked, tableLockAttempted, 
  onRowsChange, onLock, onUnlock, onReset
}) => {
  const isActive = currentScene === sceneIndex;
  const allFilled = tableRows.every(r => r.output !== null);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="THE LOGICAL CONTRACT" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto px-6 py-20 gap-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Build your <span className="text-cyan-500">Specification</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            The Truth Table is the final law. It defines what your circuit MUST do for every possible input combination.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          className="w-full bg-black/40 backdrop-blur-md p-10 rounded-[48px] border-2 border-cyan-500/20 shadow-2xl relative overflow-hidden"
        >
          {/* Challenge HUD */}
          <AnimatePresence>
            {!tableLocked && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-2xl bg-amber-500 text-black text-[10px] font-mono font-black italic uppercase tracking-[0.2em] shadow-xl z-20"
              >
                CHALLENGE: F=1 if odd number of 1s
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <TruthTableBuilder
                variables={['A', 'B', 'C']}
                rows={tableRows}
                locked={tableLocked}
                onRowsChange={onRowsChange}
                accentColor={PHASE_COLOR}
            />
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              {allFilled && !tableLocked && (
                  <button
                    onClick={onLock}
                    className="px-12 py-4 rounded-2xl bg-cyan-500 text-black font-mono font-black italic text-sm tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                  > 
                    LOCK_SPECIFICATION ■ 
                  </button>
              )}

              {tableLocked && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-8 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 text-xs font-mono font-black italic uppercase tracking-widest flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    CONTRACT_SIGNED_AND_LAWFUL
                  </motion.div>
              )}
            </div>

            {/* Mistake Recovery Flow (IMP-A1) */}
            <AnimatePresence>
              {tableLockAttempted && !allFilled && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-amber-500 text-[10px] font-mono font-black uppercase tracking-widest animate-bounce"
                >
                  ⚠ CRITICAL_ERROR: Sparse logic matrix detected. Fill all outputs.
                </motion.div>
              )}

              {tableLocked && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-6 mt-2"
                >
                  <button 
                    onClick={onUnlock}
                    className="text-[10px] font-mono text-white/20 hover:text-cyan-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-cyan-400/30"
                  >
                    Modify Contract
                  </button>
                  <button 
                    onClick={onReset}
                    className="text-[10px] font-mono text-white/20 hover:text-rose-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-rose-400/30"
                  >
                    Purge Table
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Intelligence Briefing */}
        <p className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em] mt-auto">
           Equivalence Checking // Reference ID: AXE-OR_{PHASE_COLOR.slice(1)}
        </p>
      </div>
    </SceneWrapper>
  );
};

export default A1_TruthTableContract;

