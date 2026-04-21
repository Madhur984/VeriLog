import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#3B82F6';

interface B1Props { sceneIndex: number; currentScene: number; }

const CANONICAL_COST = { gates: 11, power: 110, delay: 40 };
const MINIMAL_COST   = { gates: 3,  power: 30,  delay: 15 };

const B1_CostOfCanonical: React.FC<B1Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="B" name="BOOLEAN ECONOMY" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-5xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Mathematical <span className="text-blue-500">Scale</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Your canonical equations are perfect blueprints. But in the physical world, every gate costs power, area, and speed.
          </p>
        </motion.div>

        {/* Audit Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full relative z-10">
            {/* CANONICAL */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="bg-[#06060A] rounded-[48px] p-10 border-2 border-white/5 shadow-2xl flex flex-col gap-8 relative overflow-hidden"
            >
                <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest flex justify-between items-center">
                    <span>COMPLETE_CANONICAL</span>
                    <span className="text-red-500">EXPENSIVE</span>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-baseline">
                        <span className="text-4xl font-mono font-black italic text-white/80">{CANONICAL_COST.gates}</span>
                        <span className="text-[10px] font-mono text-white/20 uppercase">GATES / BOM</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={isActive ? { width: '100%' } : {}} className="h-full bg-red-500/40" transition={{ duration: 1 }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono font-black italic">
                        <div className="text-white/30 uppercase">Power: {CANONICAL_COST.power}mW</div>
                        <div className="text-white/30 uppercase text-right">Delay: {CANONICAL_COST.delay}ns</div>
                    </div>
                </div>
            </motion.div>

            {/* MINIMISED */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="bg-blue-500/5 rounded-[48px] p-10 border-2 border-blue-500/20 shadow-2xl flex flex-col gap-8 relative overflow-hidden"
            >
                <div className="text-[10px] font-mono font-black italic text-blue-500 uppercase tracking-widest flex justify-between items-center">
                    <span>ECONOMIC_MINIMAL</span>
                    <span className="text-green-500">OPTIMAL</span>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-baseline">
                        <span className="text-4xl font-mono font-black italic text-blue-500">{MINIMAL_COST.gates}</span>
                        <span className="text-[10px] font-mono text-blue-500/40 uppercase">GATES / BOM</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={isActive ? { width: '27%' } : {}} className="h-full bg-blue-500" transition={{ duration: 1, delay: 0.5 }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono font-black italic">
                        <div className="text-blue-500/60 uppercase">Power: {MINIMAL_COST.power}mW</div>
                        <div className="text-blue-500/60 uppercase text-right">Delay: {MINIMAL_COST.delay}ns</div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1, type: 'spring' }}
                    className="absolute -top-4 -right-4 px-6 py-2 bg-blue-500 text-black text-[10px] font-mono font-black italic uppercase tracking-widest shadow-xl"
                >
                    73%_SAVINGS
                </motion.div>
            </motion.div>
        </div>

        {/* Industrial BOM Context */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="w-full max-w-4xl p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
        >
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-black italic uppercase tracking-widest text-blue-400">The Power, Performance, Area (PPA) Triad</h4>
                <p className="text-xs font-mono text-white/60 leading-relaxed">
                    Simplifying an expression is exactly like trimming a manufacturing <strong className="text-blue-400 font-black">Bill of Materials (BOM)</strong>. Every algebraic term translates to a costly physical logic gate, and every variable (literal) translates to an input wire. Using the Identity Theorem, you literally replace an active gate with a passive wire.
                </p>
            </div>
        </motion.div>
      </div>
    </SceneWrapper>
  );
};


export default B1_CostOfCanonical;
