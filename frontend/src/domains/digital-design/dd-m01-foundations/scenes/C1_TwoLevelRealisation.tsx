import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import { parseSOP } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#22C55E';
const VARS = ['A', 'B', 'C'];

interface C1Props { sceneIndex: number; currentScene: number; expressionInput: string; }

const C1_TwoLevelRealisation: React.FC<C1Props> = ({ sceneIndex, currentScene, expressionInput }) => {
  const isActive = currentScene === sceneIndex;
  const [activeMode, setActiveMode] = useState<'AND-OR' | 'OR-AND'>('AND-OR');
  const minterms = parseSOP(expressionInput, VARS);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="THE TWO-LEVEL STANDARD" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Physical <span className="text-green-500">Topology</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            All canonical logic maps to a mandatory 2-level structure. First level identifies the terms; second level collects them into the result.
          </p>
        </motion.div>

        {/* Focused Laboratory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
            {/* Logic Toggle */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => setActiveMode('AND-OR')}
                        className={`p-10 rounded-[32px] border-2 transition-all flex flex-col gap-4 text-left ${activeMode === 'AND-OR' ? 'bg-green-500/10 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-transparent opacity-40'}`}
                    >
                        <span className="text-[10px] font-mono font-black italic uppercase tracking-widest text-green-500">SOP_REALISATION</span>
                        <span className="text-2xl font-mono font-black italic text-white uppercase">AND-OR COLLECTOR</span>
                    </button>
                    <button 
                        onClick={() => setActiveMode('OR-AND')}
                        className={`p-10 rounded-[32px] border-2 transition-all flex flex-col gap-4 text-left ${activeMode === 'OR-AND' ? 'bg-green-500/10 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-transparent opacity-40'}`}
                    >
                        <span className="text-[10px] font-mono font-black italic uppercase tracking-widest text-green-500">POS_REALISATION</span>
                        <span className="text-2xl font-mono font-black italic text-white uppercase">OR-AND COLLECTOR</span>
                    </button>
                </div>
            </motion.div>

            {/* Circuit Viewing Area */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className="bg-[#06060A] rounded-[48px] border-2 border-green-500/20 p-12 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden"
            >
                <div className="absolute top-6 left-10 text-[10px] font-mono font-black italic text-green-500/40 uppercase tracking-widest">LIVE_TOPOLOGY_RENDER</div>
                <div className="scale-110 md:scale-125">
                    <CircuitCanvas
                        form={activeMode}
                        minterms={activeMode === 'AND-OR' ? minterms : undefined}
                        maxterms={activeMode === 'OR-AND' ? minterms : undefined} // Mocking maxterms with minterms for visual demo if needed
                        variables={VARS}
                        width={400}
                        height={300}
                    />
                </div>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl opacity-40 text-[10px] font-mono font-black italic uppercase tracking-widest">
            <div>✓ Guaranteed 2-Level Propagation Delay</div>
            <div className="text-right">✓ Deterministic Silicon Routing</div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C1_TwoLevelRealisation;
