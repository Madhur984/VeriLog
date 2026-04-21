import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';
import IntelligenceBrief from '../components/IntelligenceBrief';

const PHASE_COLOR = '#22C55E';

interface C4Props { sceneIndex: number; currentScene: number; step: 0|1|2|3; onStepChange: (s: 0|1|2|3) => void; }

const STEP_LABELS = ['START: AND-OR CIRCUIT', 'APPLY DOUBLE NEGATION', 'RESULT: NAND-NAND CIRCUIT'];
const STEP_MICROCOPY = [
  'The canonical AND-OR circuit for XOR equivalent: F = A\'B + AB\'',
  'Insert double negations at AND outputs and OR inputs — they cancel.',
  'AND-OR becomes NAND-NAND with exactly the same gate count.',
];

const C4_NANDNANDConversion: React.FC<C4Props> = ({ sceneIndex, currentScene, step, onStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const g1Inp = [!inputA, inputB];
  const g2Inp = [inputA, !inputB];
  const g1Out = g1Inp[0] && g1Inp[1];
  const g2Out = g2Inp[0] && g2Inp[1];
  const f = g1Out || g2Out;

  const advance = useCallback(() => {
    onStepChange(Math.min(step + 1, 2) as 0|1|2|3);
  }, [step, onStepChange]);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND-NAND CONVERSION" color={PHASE_COLOR} />
      
      <div className="flex flex-col lg:flex-row flex-1 gap-12 pt-24 pb-16 px-8 md:px-12 items-start overflow-hidden">
        {/* LEFT: Controls & Steps */}
        <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            className="flex flex-col gap-8 flex-shrink-0" 
            style={{ width: 340 }}
        >
            <div className="flex flex-col gap-2">
                <div className="text-[10px] font-mono font-black italic tracking-[0.3em] text-green-500 uppercase">SYNTHESIS_TRANSFORM</div>
                <div className="h-1 w-20 bg-green-500/50" />
            </div>

            <div className="flex flex-col gap-3">
                {[0,1,2].map(s => (
                    <button 
                        key={s} 
                        onClick={() => onStepChange(s as 0|1|2|3)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 text-left ${step === s ? 'bg-green-500/10 border-green-500 shadow-lg' : 'bg-black/40 border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${step === s ? 'bg-green-500 text-black' : 'bg-white/10 text-white/40'}`}>
                            {s+1}
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[10px] font-mono font-black italic text-white/30 uppercase">PHASE_{s+1}</div>
                            <div className="text-xs font-mono font-black italic text-white/90 uppercase truncate">{STEP_LABELS[s]}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest leading-none">Stimulus_Injection</div>
                <div className="flex gap-2">
                    {['A', 'B'].map((v, i) => (
                        <button
                            key={v}
                            onClick={() => i === 0 ? setInputA(!inputA) : setInputB(!inputB)}
                            className={`flex-1 h-12 rounded-xl border flex items-center justify-center font-mono font-black italic transition-all ${((i===0 && inputA) || (i===1 && inputB)) ? 'bg-green-500 border-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-transparent text-white/20'}`}
                        >
                            {v} = {((i===0 && inputA) || (i===1 && inputB)) ? '1' : '0'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 rounded-[40px] bg-black/60 border border-white/5 shadow-inner">
                <div className="text-[10px] font-mono font-black italic text-green-500/60 uppercase mb-4 tracking-widest leading-none">TRANSFORM_PROTOCOL</div>
                <p className="text-sm font-mono font-black italic text-white/60 leading-relaxed uppercase">
                    {STEP_MICROCOPY[step]}
                </p>
            </div>

            <div className="flex gap-4">
                {step < 2 ? (
                    <button onClick={advance} className="px-12 py-5 rounded-2xl bg-green-500 text-black font-mono font-black italic text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl">NEXT_PHASE ■</button>
                ) : (
                    <button onClick={() => onStepChange(0)} className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-mono font-black italic text-xs tracking-widest uppercase hover:bg-white/10 active:scale-95 transition-all">RESTART_SYNC</button>
                )}
            </div>
        </motion.div>

        {/* RIGHT: Visual & Briefs */}
        <div className="flex flex-col flex-1 gap-12 min-w-0">
            <motion.div 
                key={step}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[56px] p-12 bg-black/40 backdrop-blur-md border-2 border-green-500/10 shadow-[0_0_100px_rgba(34,197,94,0.05)] relative flex items-center justify-center min-h-[500px]"
            >
                <div className="absolute top-8 left-12 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-black italic text-green-500/60 uppercase tracking-widest">REALTIME_TOPOLOGY_LAYER_0{step+1}</span>
                </div>

                {step === 0 && (
                    <svg width={420} height={200} viewBox="0 0 420 200">
                        <GateSymbol type="AND" x={80} y={15} scale={1.0} strokeColor={PHASE_COLOR} label="G1" inputStates={g1Inp} outputState={g1Out} active={g1Out} />
                        <GateSymbol type="AND" x={80} y={105} scale={1.0} strokeColor={PHASE_COLOR} label="G2" inputStates={g2Inp} outputState={g2Out} active={g2Out} />
                        <GateSymbol type="OR"  x={260} y={60} scale={1.2} strokeColor={PHASE_COLOR} label="G3" inputStates={[g1Out, g2Out]} outputState={f} active={f} />
                        <line x1={143} y1={42} x2={260} y2={85} stroke={g1Out ? PHASE_COLOR : "#3A3A4A"} strokeWidth={2} />
                        <line x1={143} y1={132} x2={260} y2={115} stroke={g2Out ? PHASE_COLOR : "#3A3A4A"} strokeWidth={2} />
                        
                        <text x={4} y={37} fontSize={14} fill={!inputA ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={54} fontSize={14} fill={inputB ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={127} fontSize={14} fill={inputA ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={144} fontSize={14} fill={!inputB ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={360} y={115} fontSize={20} fill={f ? PHASE_COLOR : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
                {step === 1 && (
                    <div className="flex flex-col gap-10 w-full max-w-md items-center">
                        <div className="px-10 py-8 rounded-[40px] bg-orange-500/5 border-2 border-orange-500/20 shadow-xl text-center">
                            <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest mb-4">TRANSFORM_LOG :: BUBBLE_INSERTION</div>
                            <div className="text-sm font-mono font-black text-white/80 italic uppercase leading-relaxed">
                                Inserting double negations at AND outputs and OR inputs. According to DeMorgan's, an OR with inverted inputs is equivalent to a NAND.
                            </div>
                        </div>
                        <div className="px-10 py-6 rounded-[32px] bg-green-500/10 border-2 border-green-500/20 text-center flex flex-col gap-2 shadow-2xl">
                            <div className="text-3xl font-mono font-black italic text-white/90">¬¬X = X</div>
                            <div className="text-[10px] font-mono font-black text-green-500/60 uppercase tracking-widest">Double_Negation_Stability_Locked</div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <svg width={420} height={200} viewBox="0 0 420 200">
                        <GateSymbol type="NAND" x={80} y={15} scale={1.0} strokeColor={PHASE_COLOR} label="G1" inputStates={g1Inp} outputState={!g1Out} active={!g1Out} />
                        <GateSymbol type="NAND" x={80} y={105} scale={1.0} strokeColor={PHASE_COLOR} label="G2" inputStates={g2Inp} outputState={!g2Out} active={!g2Out} />
                        <GateSymbol type="NAND" x={260} y={60} scale={1.2} strokeColor={PHASE_COLOR} label="G3" inputStates={[!g1Out, !g2Out]} outputState={f} active={f} />
                        <line x1={143} y1={42} x2={260} y2={85} stroke={!g1Out ? PHASE_COLOR : "#3A3A4A"} strokeWidth={2} />
                        <line x1={143} y1={132} x2={260} y2={115} stroke={!g2Out ? PHASE_COLOR : "#3A3A4A"} strokeWidth={2} />
                        
                        <text x={4} y={37} fontSize={14} fill={!inputA ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={54} fontSize={14} fill={inputB ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={127} fontSize={14} fill={inputA ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={144} fontSize={14} fill={!inputB ? "#FFF" : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={360} y={115} fontSize={20} fill={f ? PHASE_COLOR : "#7A7A8C"} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <IntelligenceBrief 
                    type="theory"
                    title="Double_Negation"
                    description="The ¬¬X = X principle allows effortless gate swapping."
                    details="By placing a bubble at both ends of a wire, we change the gate types (AND→NAND, OR→NAND) without altering the logical outcome."
                />
                <IntelligenceBrief 
                    type="industry"
                    title="Universal_Logic"
                    description="NAND-NAND is the industry standard for SOP silicon."
                    details="Standard Cell libraries are highly optimized for NAND fabrications, making this conversion critical for physical chip design."
                />
            </div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C4_NANDNANDConversion;
