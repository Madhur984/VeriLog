import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C2Props { sceneIndex: number; currentScene: number; }

const DERIVATIONS = [
  {
    title: 'THE NOT BUILD',
    proof: 'NAND(A,A) = A\'',
    gate: <GateSymbol type="NAND" x={0} y={0} scale={1} inputs={1} strokeColor={PHASE_COLOR} />,
  },
  {
    title: 'THE AND BUILD',
    proof: 'NOT(NAND(A,B)) = A·B',
    gate: (
        <div className="flex items-center gap-4">
            <GateSymbol type="NAND" x={0} y={0} scale={1} strokeColor={PHASE_COLOR} />
            <span className="text-white/20">→</span>
            <GateSymbol type="NAND" x={0} y={0} scale={1} inputs={1} strokeColor={PHASE_COLOR} />
        </div>
    ),
  },
  {
    title: 'THE OR BUILD',
    proof: "NAND(A',B') = A+B",
    gate: (
        <div className="flex items-center gap-4">
            <div className="flex flex-col gap-4">
                <GateSymbol type="NAND" x={0} y={0} scale={0.8} inputs={1} strokeColor={PHASE_COLOR} />
                <GateSymbol type="NAND" x={0} y={0} scale={0.8} inputs={1} strokeColor={PHASE_COLOR} />
            </div>
            <span className="text-white/20">→</span>
            <GateSymbol type="NAND" x={0} y={0} scale={1} strokeColor={PHASE_COLOR} />
        </div>
    ),
  },
];

const C2_NANDUniversality: React.FC<C2Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND UNIVERSALITY" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Why the Industry chose NAND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="flex flex-col gap-8"
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter leading-none">
                        The <span className="text-green-500">Industry</span> Standard.
                    </h2>
                    <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest leading-relaxed">
                        Why build five different machines when one can do every job? Silicon factories optimize for one gate: <span className="text-green-500">NAND</span>.
                    </p>
                </div>

                <div className="flex flex-col gap-4 p-8 rounded-[32px] bg-white/5 border border-white/10">
                    <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">TRANSISTOR_AUDIT</div>
                    <div className="flex justify-between items-center text-sm font-mono font-black italic uppercase">
                        <span className="text-white/40">AND Gate</span>
                        <span className="text-white/60">6 Transistors</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-mono font-black italic uppercase">
                        <span className="text-white/40 font-bold">NAND Gate</span>
                        <span className="text-green-500">4 Transistors ✓</span>
                    </div>
                    <p className="text-[9px] font-mono font-black italic text-green-500/40 uppercase tracking-widest mt-2">
                        Fewer transistors = higher density = lower cost.
                    </p>
                </div>
            </motion.div>

            {/* Proofs */}
            <div className="flex flex-col gap-4 w-full">
                {DERIVATIONS.map((d, i) => (
                    <motion.div
                        key={d.title}
                        initial={{ opacity: 0, x: 30 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="p-8 rounded-[32px] bg-[#06060A] border-2 border-green-500/10 shadow-2xl flex items-center justify-between group hover:border-green-500/40 transition-all"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono font-black italic text-green-500 uppercase tracking-widest">{d.title}</span>
                            <span className="text-xs font-mono font-black italic text-white/40 uppercase">{d.proof}</span>
                        </div>
                        <div className="h-16 flex items-center">
                            {d.gate}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <p className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em] mt-auto">
            Functional Completeness: NAND alone is sufficient for any Boolean function.
        </p>
      </div>
    </SceneWrapper>
  );
};

export default C2_NANDUniversality;
