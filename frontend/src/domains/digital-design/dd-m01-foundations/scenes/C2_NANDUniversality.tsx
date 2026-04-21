import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C2Props { sceneIndex: number; currentScene: number; }

const C2_NANDUniversality: React.FC<C2Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // Logical results for NAND builds
  const notA = !inputA;
  const nandAB = !(inputA && inputB);
  const andAB = !nandAB;
  const orAB = !(!inputA && !inputB);

  const derivations = [
    {
      title: 'THE NOT BUILD',
      proof: `NAND(${inputA ? '1' : '0'},${inputA ? '1' : '0'}) = ${notA ? '1' : '0'}`,
      gate: (
        <svg width="60" height="40" viewBox="0 0 60 40">
          <GateSymbol 
            type="NAND" 
            x={0} y={0} scale={1} 
            inputStates={[inputA, inputA]} 
            outputState={notA}
            strokeColor={PHASE_COLOR} 
            active={notA}
          />
        </svg>
      ),
    },
    {
      title: 'THE AND BUILD',
      proof: `NOT(NAND(${inputA ? '1' : '0'},${inputB ? '1' : '0'})) = ${andAB ? '1' : '0'}`,
      gate: (
          <div className="flex items-center gap-4">
              <svg width="60" height="40" viewBox="0 0 60 40">
                  <GateSymbol type="NAND" x={0} y={0} scale={1} inputStates={[inputA, inputB]} outputState={nandAB} strokeColor={PHASE_COLOR} active={nandAB} />
              </svg>
              <span className="text-white/20">→</span>
              <svg width="60" height="40" viewBox="0 0 60 40">
                  <GateSymbol type="NAND" x={0} y={0} scale={1} inputStates={[nandAB, nandAB]} outputState={andAB} strokeColor={PHASE_COLOR} active={andAB} />
              </svg>
          </div>
      ),
    },
    {
      title: 'THE OR BUILD',
      proof: `NAND(A',B') = ${orAB ? '1' : '0'}`,
      gate: (
          <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                  <svg width="48" height="32" viewBox="0 0 60 40">
                      <GateSymbol type="NAND" x={0} y={0} scale={0.8} inputStates={[inputA, inputA]} outputState={!inputA} strokeColor={PHASE_COLOR} active={!inputA} />
                  </svg>
                  <svg width="48" height="32" viewBox="0 0 60 40">
                      <GateSymbol type="NAND" x={0} y={0} scale={0.8} inputStates={[inputB, inputB]} outputState={!inputB} strokeColor={PHASE_COLOR} active={!inputB} />
                  </svg>
              </div>
              <span className="text-white/20">→</span>
              <svg width="60" height="40" viewBox="0 0 60 40">
                  <GateSymbol type="NAND" x={0} y={0} scale={1} inputStates={[!inputA, !inputB]} outputState={orAB} strokeColor={PHASE_COLOR} active={orAB} />
              </svg>
          </div>
      ),
    },
  ];

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND UNIVERSALITY" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-5 flex flex-col gap-8"
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter leading-none">
                        The <span className="text-green-500">Industry</span> Standard.
                    </h2>
                    <p className="text-sm font-mono font-bold italic text-white/50 uppercase tracking-widest leading-relaxed">
                        Silicon factories optimize for one universal building block: <span className="text-green-500 font-black tracking-tighter">NAND</span>. 
                    </p>
                    <div className="p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 text-xs font-mono text-green-100/70 leading-relaxed">
                        <strong className="text-green-400 font-black uppercase">Manufacturing Economy:</strong> Think of logic families as interchangeable Lego blocks or the assembly line of the digital revolution. An unconfigured silicon chip is essentially a <strong className="text-white italic">"Sea of NAND gates"</strong>—a blank, programmable canvas because NAND is inherently easier and cheaper to fabricate at the transistor level than AND/OR.
                    </div>
                </div>

                {/* Stimulus Injection */}
                <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                    <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest leading-none">Live_Stimulus_Injection // Logic_Probe</div>
                    <div className="flex gap-3">
                        {['A', 'B'].map((v, i) => (
                            <button
                                key={v}
                                onClick={() => i === 0 ? setInputA(!inputA) : setInputB(!inputB)}
                                className={`flex-1 h-16 rounded-2xl border flex items-center justify-center font-mono font-black italic transition-all ${((i===0 && inputA) || (i===1 && inputB)) ? 'bg-green-500 border-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-transparent text-white/20'}`}
                            >
                                {v} = {((i===0 && inputA) || (i===1 && inputB)) ? '1' : '0'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-8 rounded-[32px] bg-black/40 border border-white/10">
                    <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">PHISYCAL_AUDIT</div>
                    <div className="flex justify-between items-center text-sm font-mono font-black italic uppercase">
                        <span className="text-white/40">AND Gate</span>
                        <span className="text-white/60">6 Transistors</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-mono font-black italic uppercase">
                        <span className="text-white/40 font-bold">NAND Gate</span>
                        <span className="text-green-500">4 Transistors ✓</span>
                    </div>
                </div>
            </motion.div>

            {/* Proofs */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                {derivations.map((d, i) => (
                    <motion.div
                        key={d.title}
                        initial={{ opacity: 0, x: 30 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="p-8 rounded-[32px] bg-[#06060A] border-2 border-green-500/10 shadow-2xl flex items-center justify-between group hover:border-green-500/40 transition-all"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono font-black italic text-green-500 uppercase tracking-widest">{d.title}</span>
                            <span className="text-xs font-mono font-black italic text-white/60 uppercase">{d.proof}</span>
                        </div>
                        <div className="h-16 flex items-center">
                            {d.gate}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <p className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em] mt-auto">
            Functional Completeness Protocol :: NAND_ONLY_CORE
        </p>
      </div>
    </SceneWrapper>
  );
};

export default C2_NANDUniversality;
