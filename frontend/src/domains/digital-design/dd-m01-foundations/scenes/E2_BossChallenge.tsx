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

interface E2Props { 
  sceneIndex: number; 
  currentScene: number; 
  bossStep: BossStep; 
  onBossStepChange: (s: BossStep) => void; 
}

const E2_BossChallenge: React.FC<E2Props> = ({ sceneIndex, currentScene, bossStep, onBossStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const [rows, setRows] = useState<TruthTableRow[]>(buildTruthTableRows(3));
  const [locked, setLocked] = useState(false);
  const [tableCorrect, setTableCorrect] = useState<boolean | null>(null);
  const [circuitMode, setCircuitMode] = useState<CircuitForm>('AND-OR');
  const [inputValues, setInputValues] = useState<boolean[]>([false, false, false]);

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

  const toggleInput = (idx: number) => {
    const next = [...inputValues];
    next[idx] = !next[idx];
    setInputValues(next);
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="E" name="FINAL ASSESSMENT" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-7xl mx-auto px-6 py-20 gap-16 relative">
        <AnimatePresence mode="wait">
            {bossStep === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center flex flex-col gap-8 max-w-2xl">
                     <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full border-2 border-orange-500/40 flex items-center justify-center text-3xl animate-pulse">⚡</div>
                     </div>
                     <h2 className="text-5xl font-mono font-black italic text-white uppercase tracking-tighter">Mission: <span className="text-orange-500">The Majority Voter</span>.</h2>
                     <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest leading-relaxed">
                        In high-reliability flight systems, we use 3 compute nodes. Your task: Design the 2-of-3 voter logic. If 2 or more inputs are HIGH, the function MUST fire. This is Triple Modular Redundancy.
                     </p>
                     <button onClick={advance} className="px-16 py-6 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-sm tracking-[0.4em] uppercase self-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,95,31,0.3)]">
                        INITIALIZE_CHALLENGE ■
                     </button>
                </motion.div>
            )}

            {bossStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10 items-center">
                    <div className="text-center">
                        <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-[0.4em] mb-2">PHASE_01 :: LOGIC_SPECIFICATION</div>
                        <h3 className="text-2xl font-mono font-black italic text-white uppercase">Define the Voter Law</h3>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md p-10 rounded-[48px] border-2 border-orange-500/20 shadow-2xl relative">
                        <TruthTableBuilder variables={BOSS_VARS} rows={rows} locked={locked} onRowsChange={setRows} accentColor={PHASE_COLOR} />
                        
                        {tableCorrect === false && (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-rose-500 font-mono font-black italic text-[10px] uppercase tracking-widest animate-bounce">
                             ⚠ SPECIFICATION_MISMATCH: CHECK_MAJORITY_RULE
                           </motion.div>
                        )}
                    </div>
                    
                    <button onClick={checkTable} className="px-12 py-5 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl">
                       VERIFY_REFERENCE_MODEL ■
                    </button>
                </motion.div>
            )}

            {(bossStep >= 2 && bossStep <= 5) && (
                <motion.div key="s2-5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
                    {/* Metrics Sidebar */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest">PHASE_0{bossStep} :: SYNTHESIS</div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                <span className="text-[10px] font-mono font-black italic text-white/20 uppercase block mb-4">EXTRACTION_TELEMETRY</span>
                                <div className="flex justify-between items-center text-xs font-mono font-black italic">
                                    <span className="text-white/40">MINTERMS</span>
                                    <span className="text-cyan-400">{minterms.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono font-black italic mt-3">
                                    <span className="text-white/40">MAXTERMS</span>
                                    <span className="text-rose-500">{maxterms.length}</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20">
                                <span className="text-[10px] font-mono font-black italic text-orange-500 uppercase block mb-3">CONSTRAINTS</span>
                                <span className="text-xs font-mono font-black italic text-white uppercase leading-relaxed">
                                    {path === 'EQUAL' ? 'OPTIMAL_SYMMETRY_DETECTED' : `ARCHITECTURE_PIVOT: USE_${path}`}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto p-6 rounded-3xl bg-black/60 border border-white/5">
                            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4 italic">Signal_Injection</div>
                            <div className="flex gap-2">
                                {BOSS_VARS.map((v, i) => (
                                    <button
                                        key={v}
                                        onClick={() => toggleInput(i)}
                                        className={`flex-1 h-12 rounded-xl border flex items-center justify-center font-mono font-black italic transition-all ${inputValues[i] ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_15px_rgba(255,95,31,0.4)]' : 'bg-white/5 border-transparent text-white/20'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Circuit Stage */}
                    <div className="lg:col-span-6 bg-black/40 backdrop-blur-md rounded-[56px] border-2 border-orange-500/10 p-12 shadow-2xl relative min-h-[500px] flex items-center justify-center overflow-hidden">
                        <div className="absolute top-8 left-12 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-black italic text-orange-500/60 uppercase tracking-widest">MAJORITY_VOTER // PHYSICAL_TOPOLOGY</span>
                        </div>
                        
                        <CircuitCanvas
                            form={path === 'POS' ? 'OR-AND' : 'AND-OR'}
                            minterms={minterms}
                            maxterms={maxterms}
                            variables={BOSS_VARS}
                            inputValues={inputValues}
                            width={440}
                            height={340}
                        />
                    </div>

                    {/* Action Column */}
                    <div className="lg:col-span-3 flex flex-col gap-6 justify-center">
                        <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 text-center">
                            <span className="text-[10px] font-mono font-black italic text-white/20 uppercase block mb-4 tracking-widest">Verifying_Logic...</span>
                            <div className="text-4xl font-mono font-black italic text-white">
                                {bossStep === 5 ? 'STABLE' : `${bossStep * 20}%`}
                            </div>
                        </div>

                        <button onClick={advance} className="w-full py-6 rounded-2xl bg-orange-500 text-black font-mono font-black italic text-sm tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl">
                           {bossStep === 5 ? 'SIGN_OFF ■' : 'EXECUTE_DEPLOY →'}
                        </button>
                    </div>
                </motion.div>
            )}

            {bossStep === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col gap-12 max-w-3xl">
                    <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center text-6xl shadow-[0_0_100px_rgba(34,197,94,0.3)]">
                           ✓
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h1 className="text-7xl font-mono font-black italic text-white uppercase tracking-tighter leading-none">MISSION_COMPLETE</h1>
                        <p className="text-sm font-mono font-black italic text-green-500 uppercase tracking-[0.6em]">SYSTEM_STABILIZED // LOGIC_VERIFIED</p>
                    </div>
                    <div className="p-10 rounded-[56px] bg-white/5 border border-white/10 max-w-xl mx-auto flex flex-col gap-4">
                        <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest leading-relaxed">
                            You have successfully engineered a Majority Voter circuit from scratch. This foundation allows for redundant, fail-silent computation in critical environments.
                        </p>
                    </div>
                    <button onClick={() => window.location.href = '/portal'} className="px-24 py-8 rounded-[40px] bg-white text-black font-mono font-black italic text-xl tracking-[0.3em] uppercase hover:bg-green-500 hover:text-white transition-all shadow-2xl self-center">
                       RETURN_TO_COMMAND ■
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black italic text-white/10 uppercase tracking-[0.5em] whitespace-nowrap">
            Automated Logic Verification Protocol // DD-M01 FINAL
        </div>
      </div>
    </SceneWrapper>
  );
};

export default E2_BossChallenge;
