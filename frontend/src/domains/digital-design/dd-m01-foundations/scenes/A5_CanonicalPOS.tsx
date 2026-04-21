import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMaxterms, maxtermToSumTerm } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FF3366';
const VARS = ['A', 'B', 'C'];

interface A5Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
}

const A5_CanonicalPOS: React.FC<A5Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const [inputValues, setInputValues] = useState<boolean[]>([false, false, false]);
  const [tracing, setTracing] = useState(false);

  const maxterms = getMaxterms(tableRows, VARS);
  const expression = maxterms.length > 0
    ? maxterms.map(m => maxtermToSumTerm(m)).join(' · ')
    : '1';

  const toggleBit = (i: number) => {
    setInputValues(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="THE COMPLETE POS PLAN" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-12 gap-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Dual <span className="text-rose-500">Completeness</span>.
          </h2>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xl font-mono font-black italic text-[#A0FFA0] tracking-tighter shadow-xl">
             F = {expression}
          </div>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-2xl mx-auto mt-2">
            The Product-of-Sums (POS) circuit defines the function by what it EXCLUDES. It is just as rigorous and complete as the SOP model.
          </p>
        </motion.div>

        {/* Focused Circuit Render */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          className="w-full bg-[#06060A] rounded-[48px] border-2 border-rose-500/20 shadow-[0_0_100px_rgba(255,51,102,0.1)] p-12 relative flex items-center justify-center min-h-[400px]"
        >
             <div className="absolute top-6 left-10 text-[10px] font-mono font-black italic text-rose-500/40 tracking-[0.4em]">CANONICAL_OR_AND_REALIZATION</div>
             
             <div className="scale-110 md:scale-125 transition-transform">
                <CircuitCanvas
                    form="OR-AND"
                    maxterms={maxterms}
                    variables={VARS}
                    inputValues={tracing ? inputValues : undefined}
                    width={500}
                    height={Math.max(300, maxterms.length * 60)}
                />
             </div>
        </motion.div>

        {/* Simple Trace Control */}
        <div className="flex flex-col items-center gap-6">
            {!tracing ? (
                <button onClick={() => setTracing(true)} className="px-10 py-4 rounded-2xl bg-rose-500 text-black font-mono font-black italic text-xs tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,51,102,0.3)]">
                   BEGIN_SIGNAL_TRACE ▶
                </button>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        {VARS.map((v, i) => (
                            <button key={v} onClick={() => toggleBit(i)} className={`px-8 py-3 rounded-xl font-mono font-black italic text-xs transition-all border-2 ${inputValues[i] ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-black/40 border-white/5 text-white/20'}`}>
                                {v}={inputValues[i]?'1':'0'}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setTracing(false)} className="text-[10px] font-mono font-black text-white/20 hover:text-white uppercase tracking-widest mt-2">CLOSE_TRACER</button>
                </div>
            )}
        </div>
      </div>
    </SceneWrapper>
  );
};

export default A5_CanonicalPOS;
