import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import TruthTableBuilder from '../components/TruthTableBuilder';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow, CircuitForm } from '../ModuleD1.types';
import { buildTruthTableRows, getMinterms, getMaxterms, recommendPath } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FF5F1F'; // High path orange
const BOSS_VARS = ['A', 'B', 'C'];
const MAJORITY_ROWS_ANSWER = new Set([3, 5, 6, 7]);

type BossStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface E2Props { sceneIndex: number; currentScene: number; bossStep: BossStep; onBossStepChange: (s: BossStep) => void; }

const E2_BossChallenge: React.FC<E2Props> = ({ sceneIndex, currentScene, bossStep, onBossStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const [rows, setRows] = useState<TruthTableRow[]>(buildTruthTableRows(3));
  const [locked, setLocked] = useState(false);
  const [tableCorrect, setTableCorrect] = useState<boolean | null>(null);
  const [circuitMode, setCircuitMode] = useState<CircuitForm>('AND-OR');

  const minterms = getMinterms(rows, BOSS_VARS);
  const maxterms = getMaxterms(rows, BOSS_VARS);
  const path = recommendPath(minterms, maxterms);

  const checkTable = useCallback(() => {
    const userOnes = new Set(rows.filter(r => r.output === true).map(r => r.index));
    const correct = MAJORITY_ROWS_ANSWER.size === userOnes.size && [...MAJORITY_ROWS_ANSWER].every(i => userOnes.has(i));
    setTableCorrect(correct);
    if (correct) {
      setLocked(true);
      onBossStepChange(2 as BossStep);
    }
  }, [rows, onBossStepChange]);

  const advance = () => {
    if (bossStep < 6) onBossStepChange((bossStep + 1) as BossStep);
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="E" name="FINAL ASSESSMENT" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        <AnimatePresence mode="wait">
            {bossStep === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center flex flex-col gap-8">
                     <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">Mission: <span className="text-orange-500">The Majority Voter</span>.</h2>
                     <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
                        In high-reliability flight systems, we use 3 compute nodes. Your task: Design the 2-of-3 voter logic. If 2 or more inputs are HIGH, the function MUST fire.
                     </p>
                     <button onClick={advance} className="px-16 py-6 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-sm tracking-[0.4em] uppercase self-center hover:scale-105 active:scale-95 transition-all">INITIALIZE_CHALLENGE →</button>
                </motion.div>
            )}

            {bossStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10 items-center">
                    <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-[0.4em]">PHASE_01 :: LOGIC_SPECIFICATION</div>
                    <div className="bg-[#06060A] p-10 rounded-[48px] border-2 border-orange-500/20 shadow-2xl">
                        <TruthTableBuilder variables={BOSS_VARS} rows={rows} locked={locked} onRowsChange={setRows} accentColor={PHASE_COLOR} compact />
                    </div>
                    {tableCorrect === false && <span className="text-red-500 font-mono font-black italic text-[10px] uppercase">✗ ERROR_DETECTED :: CHECK_MAJORITY_RULE</span>}
                    <button onClick={checkTable} className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-mono font-black italic text-xs tracking-widest uppercase hover:bg-white/10 active:scale-95">VERIFY_SPEC</button>
                </motion.div>
            )}

            {(bossStep >= 2 && bossStep <= 5) && (
                <motion.div key="s2-5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                    <div className="flex flex-col gap-8">
                        <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest">PHASE_0{bossStep} :: HARDWARE_SYNTHESIS</div>
                        <div className="flex flex-col gap-4">
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                                <span className="text-[10px] font-mono font-black italic text-white/20 uppercase block mb-2">EXTRACTION_RESULTS</span>
                                <div className="flex justify-between items-center text-xs font-mono font-black italic text-white/60">
                                    <span>MINTERMS (1s)</span>
                                    <span className="text-blue-500">{minterms.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono font-black italic text-white/60 mt-2">
                                    <span>MAXTERMS (0s)</span>
                                    <span className="text-orange-500">{maxterms.length}</span>
                                </div>
                            </div>
                            <div className="p-8 rounded-[32px] bg-orange-500/10 border border-orange-500/20">
                                <span className="text-[10px] font-mono font-black italic text-orange-500 uppercase block mb-2">ARCHITECTURAL_RECOMMENDATION</span>
                                <span className="text-xs font-mono font-black italic text-white uppercase">{path === 'EQUAL' ? 'COST_BALANCED' : `USE_${path}_PATH`}</span>
                            </div>
                        </div>
                        <button onClick={advance} className="px-10 py-5 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-[10px] tracking-widest uppercase self-start">{bossStep === 5 ? 'COMPLETE_DESIGN' : 'NEXT_PHASE →'}</button>
                    </div>

                    <div className="bg-[#06060A] rounded-[48px] border-2 border-orange-500/20 p-12 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
                        <div className="absolute top-6 left-10 text-[10px] font-mono font-black italic text-orange-500/40 uppercase tracking-widest">REALTIME_NETLIST</div>
                        <div className="scale-110">
                            <CircuitCanvas
                                form={circuitMode}
                                minterms={minterms}
                                maxterms={maxterms}
                                variables={BOSS_VARS}
                                width={400}
                                height={320}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {bossStep === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col gap-10">
                    <div className="text-9xl mb-4">🏆</div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-6xl font-mono font-black italic text-white uppercase tracking-tighter">MISSION_COMPLETE</h1>
                        <p className="text-sm font-mono font-black italic text-orange-500 uppercase tracking-[0.4em]">SYSTEM_STABILIZED :: LOGIC_VERIFIED</p>
                    </div>
                    <button onClick={() => window.location.href = '/portal'} className="px-24 py-8 rounded-[32px] border-4 border-orange-500 text-orange-500 font-mono font-black italic text-xl tracking-[0.3em] uppercase hover:bg-orange-500 hover:text-black transition-all">RETURN_TO_COMMAND</button>
                </motion.div>
            )}
        </AnimatePresence>

        <p className="text-[10px] font-mono font-black italic text-white/10 uppercase tracking-[0.3em] mt-auto">
            Design Verification Completion Protocol :: DD-M01 FINAL
        </p>
      </div>
    </SceneWrapper>
  );
};

export default E2_BossChallenge;
