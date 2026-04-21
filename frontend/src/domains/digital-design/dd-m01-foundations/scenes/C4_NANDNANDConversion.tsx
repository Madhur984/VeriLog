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
  'The canonical AND-OR circuit for F = A\'B + AB\'',
  'Insert double negations at AND outputs and OR inputs — they cancel.',
  'AND-OR becomes NAND-NAND with exactly the same gate count.',
];

const C4_NANDNANDConversion: React.FC<C4Props> = ({ sceneIndex, currentScene, step, onStepChange }) => {
  const isActive = currentScene === sceneIndex;

  const advance = useCallback(() => {
    onStepChange(Math.min(step + 1, 2) as 0|1|2|3);
  }, [step, onStepChange]);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND-NAND CONVERSION" color={PHASE_COLOR} />
      
      <div className="flex flex-col md:flex-row flex-1 gap-12 pt-24 pb-16 px-8 md:px-12 items-start overflow-hidden">
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

            <div className="flex flex-col gap-4">
                {[0,1,2].map(s => (
                    <div 
                        key={s} 
                        onClick={() => onStepChange(s as 0|1|2|3)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${step === s ? 'bg-green-500/10 border-green-500 shadow-lg' : 'bg-black/40 border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs ${step === s ? 'bg-green-500 text-black' : 'bg-white/10 text-white/40'}`}>
                            {s+1}
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[10px] font-mono font-black italic text-white/30 uppercase">PHASE_{s+1}</div>
                            <div className="text-xs font-mono font-black italic text-white/90 uppercase truncate">{STEP_LABELS[s]}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="text-[10px] font-mono font-black italic text-green-500/60 uppercase mb-3 tracking-widest">PROTOCOL_MEMO</div>
                <p className="text-sm font-mono font-black italic text-white/60 leading-relaxed uppercase">
                    {STEP_MICROCOPY[step]}
                </p>
            </div>

            <div className="flex gap-4">
                {step < 2 ? (
                    <button onClick={advance} className="px-8 py-4 rounded-2xl bg-green-500 text-black font-mono font-black italic text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all">NEXT_PHASE →</button>
                ) : (
                    <button onClick={() => onStepChange(0)} className="px-8 py-4 rounded-2xl bg-white/10 text-white/60 font-mono font-black italic text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all">RESTART_SYNC</button>
                )}
            </div>
        </motion.div>

        {/* RIGHT: Visual & Briefs */}
        <div className="flex flex-col flex-1 gap-12 min-w-0">
            <motion.div 
                key={step}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[40px] p-12 bg-[#06060A] border-2 border-green-500/20 shadow-[0_0_100px_rgba(34,197,94,0.1)] relative flex items-center justify-center overflow-hidden"
            >
                <div className="absolute top-8 left-10 text-[10px] font-mono font-black italic text-green-500/30 tracking-[0.4em] uppercase">SCHEMATIC_LAYER_0{step+1}</div>
                {step === 0 && (
                    <svg width={420} height={160} viewBox="0 0 420 160">
                        <GateSymbol type="AND" x={80} y={15} scale={1.0} strokeColor={PHASE_COLOR} label="G1" />
                        <GateSymbol type="AND" x={80} y={85} scale={1.0} strokeColor={PHASE_COLOR} label="G2" />
                        <GateSymbol type="OR"  x={240} y={50} scale={1.0} strokeColor={PHASE_COLOR} label="G3" />
                        <line x1={143} y1={42} x2={240} y2={67} stroke="#3A3A4A" strokeWidth={2} />
                        <line x1={143} y1={112} x2={240} y2={87} stroke="#3A3A4A" strokeWidth={2} />
                        {/* inputs */}
                        <text x={4} y={37} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={54} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={100} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={117} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={340} y={75} fontSize={16} fill={PHASE_COLOR} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
                {step === 1 && (
                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <div className="px-6 py-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <div className="text-[10px] font-mono font-black italic text-amber-500 uppercase tracking-widest mb-2">TRANSFORM_LOG</div>
                            <div className="text-xs font-mono font-black text-white/70 italic uppercase leading-relaxed">
                                Inserting double bubbles at AND outputs and OR inputs...
                            </div>
                        </div>
                        <div className="px-6 py-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                            <div className="text-2xl font-mono font-black italic text-white/90">¬¬X = X</div>
                            <div className="text-[10px] font-mono font-black text-green-500/40 uppercase mt-1">Double_Negation_Stability_Locked</div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <svg width={420} height={160} viewBox="0 0 420 160">
                        <GateSymbol type="NAND" x={80} y={15} scale={1.0} strokeColor={PHASE_COLOR} label="G1" active />
                        <GateSymbol type="NAND" x={80} y={85} scale={1.0} strokeColor={PHASE_COLOR} label="G2" active />
                        <GateSymbol type="NAND" x={240} y={50} scale={1.0} strokeColor={PHASE_COLOR} label="G3" active />
                        <line x1={143} y1={42} x2={240} y2={67} stroke={PHASE_COLOR} strokeWidth={2} />
                        <line x1={143} y1={112} x2={240} y2={87} stroke={PHASE_COLOR} strokeWidth={2} />
                        <text x={4} y={37} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={54} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={100} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={117} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={340} y={75} fontSize={16} fill={PHASE_COLOR} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
