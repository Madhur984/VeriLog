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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
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
                        <span className="text-[10px] font-mono text-white/20 uppercase">GATES</span>
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
                        <span className="text-[10px] font-mono text-blue-500/40 uppercase">GATES</span>
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

        <p className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em] mt-auto">
           Smaller die area = lower fabrication cost = higher clock frequency.
        </p>
      </div>
    </SceneWrapper>
  );
};

export default B1_CostOfCanonical;
