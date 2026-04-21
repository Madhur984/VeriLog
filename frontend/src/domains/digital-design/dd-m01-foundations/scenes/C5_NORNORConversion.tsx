import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';
import IntelligenceBrief from '../components/IntelligenceBrief';

const NOR_COLOR = '#3B82F6';

interface C5Props { sceneIndex: number; currentScene: number; step: 0|1|2|3; onStepChange: (s: 0|1|2|3) => void; }

const STEP_LABELS = ['START: OR-AND CIRCUIT', 'APPLY DOUBLE NEGATION', 'RESULT: NOR-NOR CIRCUIT'];
const STEP_MICROCOPY = [
  'The canonical OR-AND circuit for F = (A+B)·(A\'+B\')',
  'Insert bubbles at OR outputs and AND inputs.',
  'OR-AND becomes NOR-NOR. Same gate cost — one gate type.',
];

const C5_NORNORConversion: React.FC<C5Props> = ({ sceneIndex, currentScene, step, onStepChange }) => {
  const isActive = currentScene === sceneIndex;

  const advance = () => onStepChange(Math.min(step + 1, 2) as 0|1|2|3);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={NOR_COLOR}>
      <PhaseLabel phase="C" name="NOR-NOR CONVERSION" color={NOR_COLOR} />
      
      <div className="flex flex-col md:flex-row flex-1 gap-12 pt-24 pb-16 px-8 md:px-12 items-start overflow-hidden">
        {/* LEFT: Controls & Steps */}
        <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            className="flex flex-col gap-8 flex-shrink-0" 
            style={{ width: 340 }}
        >
            <div className="flex flex-col gap-2">
                <div className="text-[10px] font-mono font-black italic tracking-[0.3em] text-blue-500 uppercase">SYNTHESIS_TRANSFORM</div>
                <div className="h-1 w-20 bg-blue-500/50" />
            </div>

            <div className="flex flex-col gap-4">
                {[0,1,2].map(s => (
                    <div 
                        key={s} 
                        onClick={() => onStepChange(s as 0|1|2|3)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${step === s ? 'bg-blue-500/10 border-blue-500 shadow-lg' : 'bg-black/40 border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs ${step === s ? 'bg-blue-500 text-black' : 'bg-white/10 text-white/40'}`}>
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
                <div className="text-[10px] font-mono font-black italic text-blue-500/60 uppercase mb-3 tracking-widest">PROTOCOL_MEMO</div>
                <p className="text-sm font-mono font-black italic text-white/60 leading-relaxed uppercase">
                    {STEP_MICROCOPY[step]}
                </p>
            </div>

            <div className="flex gap-4">
                {step < 2 ? (
                    <button onClick={advance} className="px-8 py-4 rounded-2xl bg-blue-500 text-black font-mono font-black italic text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all">NEXT_PHASE →</button>
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
                className="rounded-[40px] p-12 bg-[#06060A] border-2 border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative flex items-center justify-center overflow-hidden"
            >
                <div className="absolute top-8 left-10 text-[10px] font-mono font-black italic text-blue-500/30 tracking-[0.4em] uppercase">SCHEMATIC_LAYER_0{step+1}</div>
                {step === 0 && (
                    <svg width={420} height={160} viewBox="0 0 420 160">
                        <GateSymbol type="OR"  x={80} y={15} scale={1.0} strokeColor={NOR_COLOR} label="G1" />
                        <GateSymbol type="OR"  x={80} y={85} scale={1.0} strokeColor={NOR_COLOR} label="G2" />
                        <GateSymbol type="AND" x={240} y={50} scale={1.0} strokeColor={NOR_COLOR} label="G3" />
                        <line x1={143} y1={42} x2={240} y2={67} stroke="#3A3A4A" strokeWidth={2} />
                        <line x1={143} y1={112} x2={240} y2={87} stroke="#3A3A4A" strokeWidth={2} />
                        <text x={4} y={37} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={54} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={100} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={117} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={340} y={75} fontSize={16} fill={NOR_COLOR} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
                {step === 1 && (
                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <div className="px-6 py-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <div className="text-[10px] font-mono font-black italic text-amber-500 uppercase tracking-widest mb-2">TRANSFORM_LOG</div>
                            <div className="text-xs font-mono font-black text-white/70 italic uppercase leading-relaxed text-center">
                                APPLYING DE MORGAN DUALITY...<br/>INSERTING NOR BUBBLES...
                            </div>
                        </div>
                        <div className="px-6 py-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
                            <div className="text-2xl font-mono font-black italic text-white/90">(A+B)′′ = A+B</div>
                            <div className="text-[10px] font-mono font-black text-blue-500/40 uppercase mt-1">Double_Negation_Stability_Locked</div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <svg width={420} height={160} viewBox="0 0 420 160">
                        <GateSymbol type="NOR" x={80} y={15} scale={1.0} strokeColor={NOR_COLOR} label="G1" active />
                        <GateSymbol type="NOR" x={80} y={85} scale={1.0} strokeColor={NOR_COLOR} label="G2" active />
                        <GateSymbol type="NOR" x={240} y={50} scale={1.0} strokeColor={NOR_COLOR} label="G3" active />
                        <line x1={143} y1={42} x2={240} y2={67} stroke={NOR_COLOR} strokeWidth={2} />
                        <line x1={143} y1={112} x2={240} y2={87} stroke={NOR_COLOR} strokeWidth={2} />
                        <text x={4} y={37} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A</text>
                        <text x={4} y={54} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B</text>
                        <text x={4} y={100} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">A′</text>
                        <text x={4} y={117} fontSize={14} fill="#7A7A8C" fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">B′</text>
                        <text x={340} y={75} fontSize={16} fill={NOR_COLOR} fontFamily="IBM Plex Mono" fontStyle="italic" fontWeight="900">F</text>
                    </svg>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <IntelligenceBrief 
                    type="theory"
                    title="POS_To_NOR"
                    description="Maxterms map naturally to OR gates. Sums map to NOR."
                    details="While SOP forms are perfect for NAND logic, Product of Sums (POS) forms are the native language of NOR logic."
                />
                <IntelligenceBrief 
                    type="industry"
                    title="Hardware_Optimization"
                    description="Uniform gate types simplify fabrication."
                    details="Fabricating identical NOR gates is cheaper and easier for silence mask layouts. Engineers maximize 'gate homogeneity'."
                />
            </div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C5_NORNORConversion;
