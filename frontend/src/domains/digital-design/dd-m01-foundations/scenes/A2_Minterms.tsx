import React, { useState } from 'react';
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

  // Micro-quiz state (IMP-B1)
  const initialQuizRow = tableRows.findIndex(r => r.output === true);
  const [quizRow, setQuizRow] = useState<number | null>(initialQuizRow >= 0 ? initialQuizRow : null);
  const [quizStep, setQuizStep] = useState<'IDLE' | 'CHALLENGE' | 'PASSED'>(initialQuizRow >= 0 ? 'CHALLENGE' : 'IDLE');
  const [shake, setShake] = useState(false);

  const handleQuizAnswer = (answer: string) => {
    if (quizRow === null || quizRow === -1) return;
    const m = allMinterms.find(m => m.index === quizRow);
    if (!m) return;
    const correct = mintermToProductTerm(m);
    if (answer === correct) {
      setQuizStep('PASSED');
      onToggleMinterm(quizRow);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const currentQuizMinterm = (quizRow !== null && quizRow !== -1) ? allMinterms.find(m => m.index === quizRow) : null;

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

        {/* Micro-Quiz Challenge (IMP-B1) */}
        <AnimatePresence>
          {quizStep === 'CHALLENGE' && isActive && currentQuizMinterm && (
            <motion.div
              key="quiz-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            >
              <motion.div 
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="w-full max-w-md bg-[#0A0A0E] border-2 border-cyan-500/40 rounded-[40px] p-10 shadow-[0_0_100px_rgba(6,182,212,0.2)] flex flex-col gap-8 text-center"
              >
                <div>
                  <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-4 italic">Pedagogical_Challenge // Rule_Verification</div>
                  <h3 className="text-2xl font-mono font-black italic text-white uppercase leading-none mb-3">Identify the Term</h3>
                  <p className="text-xs font-mono font-black italic text-white/40 uppercase tracking-widest leading-relaxed">
                    Row {currentQuizMinterm.index} has inputs:
                    <br />
                    <span className="text-white">
                      A={currentQuizMinterm.inputs?.[0] ?? '?'} 
                      B={currentQuizMinterm.inputs?.[1] ?? '?'} 
                      C={currentQuizMinterm.inputs?.[2] ?? '?'}
                    </span>
                    <br />
                    Which expression correctly represents this state?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    mintermToProductTerm(currentQuizMinterm),
                    `(${VARS.map((v, i) => currentQuizMinterm.inputs?.[i] ? `${v}'` : v).join('+')})`,
                    VARS.map((v, i) => currentQuizMinterm.inputs?.[i] ? v : `${v}'`).join(''),
                  ].sort(() => Math.random() - 0.5).map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(opt)}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/5 text-sm font-mono font-black italic text-white/60 hover:text-cyan-400 transition-all uppercase tracking-widest"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <div className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
                  Hint: Minterm '0' = Complement, '1' = True
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex-1 flex flex-col items-center gap-8 min-h-0">
          <div className="flex flex-col items-center gap-2">
             <div className="text-[10px] font-mono font-black italic text-cyan-500 uppercase tracking-widest animate-pulse">■ OBJECTIVE: SELECT ALL ROWS WHERE F=1 IN THE TABLE BELOW</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
            {/* Table Selection */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-6 bg-black/40 backdrop-blur-md rounded-[48px] p-8 border-2 border-cyan-500/10 shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6 px-4">
                    <span className="text-[10px] font-mono font-black italic text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      ON_STATE_SELECTOR
                    </span>
                    <span className="text-[10px] font-mono font-black italic text-white/20 uppercase">TARGET row[F=1]</span>
                </div>
                
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                    {tableRows.filter(r => r.output === true).map(row => (
                        <button
                            key={row.index}
                            onClick={() => onToggleMinterm(row.index)}
                            className={`flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${selectedMinterms.has(row.index) ? 'bg-cyan-500/20 border-cyan-500 shadow-lg' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <div className="flex gap-4 items-center">
                                <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-tighter">ROW_{row.index}</span>
                                <div className="flex gap-2">
                                    {row.inputs.map((bit, bi) => (
                                        <div key={bi} className={`px-2 py-1 rounded-lg text-xs font-mono font-black ${bit ? 'bg-cyan-500/40 text-white' : 'bg-black/40 text-white/40'}`}>{bit ? '1' : '0'}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono font-black italic text-cyan-400">1</span>
                                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedMinterms.has(row.index) ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/10'}`}>
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
                className="lg:col-span-6 flex flex-col gap-8 justify-center"
            >
                <div className="text-center p-12 rounded-[56px] bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl relative min-h-[220px] flex items-center justify-center">
                    <div className="absolute top-8 left-12 flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                         <span className="text-[10px] font-mono font-black italic text-cyan-500/60 uppercase tracking-widest">SOP_SYNTHESIS_ENGINE</span>
                    </div>
                    
                    <AnimatePresence mode="popLayout">
                        {selectedMinterms.size === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-mono font-black italic text-white/10 uppercase tracking-widest flex items-center justify-center">
                               Waiting for extraction...
                            </motion.div>
                        ) : (
                            <motion.div key="content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6 items-center">
                                <div className="text-4xl font-mono font-black italic text-white tracking-tighter text-center">
                                    F = {Array.from(selectedMinterms).sort((a,b)=>a-b).map((idx, i) => (
                                        <span key={idx}>
                                            {i > 0 && <span className="text-cyan-500 mx-2">+</span>}
                                            {mintermToProductTerm(allMinterms.find(m => m.index === idx)!)}
                                        </span>
                                    ))}
                                </div>
                                {selectedMinterms.size === totalMinterms && (
                                    <div className="px-4 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-black italic uppercase tracking-widest">
                                      VALIDATION: ALL_MINTERMS_ACCOUNTED_FOR
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                    <div className="text-[10px] font-mono font-black italic text-white/30 uppercase tracking-widest leading-none">Logic_Law // Silicon_Rules</div>
                    <p className="text-sm font-mono font-black italic text-white/60 leading-relaxed uppercase">
                        For MINTERMS, a <span className="text-rose-500">'0'</span> means use the <span className="text-cyan-500 underline">COMPLEMENT</span> (e.g. A′), while a <span className="text-cyan-400">'1'</span> means use the <span className="text-cyan-500 underline">TRUE</span> variable (e.g. A).
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  </SceneWrapper>
);
};

export default A2_Minterms;

