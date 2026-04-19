import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { AlertOctagon, TrendingDown, DollarSign, XCircle, Rocket } from "lucide-react";

export const S15_CostOfBug: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [stage, setStage] = useState<'normal' | 'error' | 'failure'>('normal');

  return (
    <BlueprintContainer>
      <HeroText color={stage === 'normal' ? 'text-plasma-cyan' : 'text-burnished-copper'}>
        One Bug = ₹400+ Crore Loss.
      </HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-16 text-center max-w-3xl">
        In hardware, you cannot "patch" silicon. Once the masks are made and the wafers are printed, a single logic error becomes a thermal paperweight.
      </p>

      <div className="w-full max-w-5xl relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch h-[400px]">
            {/* Step 1: Design */}
            <div className={`p-10 rounded-[60px] border transition-all duration-700 flex flex-col items-center justify-center text-center space-y-6 backdrop-blur-md ${stage !== 'normal' ? 'grayscale opacity-30 shadow-none' : 'bg-plasma-cyan/5 border-plasma-cyan/30 shadow-cyan-glow'}`}>
                <div className="w-20 h-20 rounded-3xl bg-plasma-cyan/10 flex items-center justify-center text-plasma-cyan">
                    <Rocket size={48} />
                </div>
                <h3 className="hero-text text-2xl uppercase italic tracking-tighter">Design Phase</h3>
                <p className="body-text text-xs opacity-40 italic font-bold">Writing logic for a high-speed router.</p>
                <button 
                    onClick={() => setStage('error')}
                    className="px-6 py-2 rounded-full bg-white/5 border border-white/10 micro-text uppercase hover:bg-plasma-cyan/20 hover:text-plasma-cyan transition-all"
                >
                    Introduce Typo?
                </button>
            </div>

            {/* Step 2: Fabrication */}
            <div className={`p-10 rounded-[60px] border transition-all duration-700 flex flex-col items-center justify-center text-center space-y-6 backdrop-blur-md ${stage === 'error' ? 'bg-burnished-copper/10 border-burnished-copper shadow-lg scale-110' : 'bg-white/[0.02] border-white/5 opacity-10'}`}>
                <div className="w-20 h-20 rounded-3xl bg-burnished-copper/10 flex items-center justify-center text-burnished-copper">
                    {stage === 'error' ? <AlertOctagon size={48} className="animate-pulse" /> : <DollarSign size={48} />}
                </div>
                <h3 className="hero-text text-2xl uppercase italic tracking-tighter">Tape-Out</h3>
                <p className="body-text text-xs opacity-40 italic font-bold">Printing 100,000 wafers at $5,000 each.</p>
                <AnimatePresence>
                    {stage === 'error' && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setStage('failure')}
                            className="px-6 py-2 rounded-full bg-burnished-copper text-white shadow-lg micro-text uppercase hover:scale-105 transition-all"
                        >
                            Finalize Release
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Step 3: Failure */}
            <div className={`p-10 rounded-[60px] border transition-all duration-700 flex flex-col items-center justify-center text-center space-y-6 backdrop-blur-md ${stage === 'failure' ? 'bg-red-500/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] scale-125' : 'bg-white/[0.02] border-white/5 opacity-5'}`}>
                <div className="w-20 h-20 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <XCircle size={48} />
                </div>
                <h3 className="hero-text text-2xl uppercase italic text-red-500">MARKET FAILURE</h3>
                <div className="space-y-1">
                    <div className="hero-text text-2xl text-white italic">-$50,000,000</div>
                    <div className="micro-text uppercase text-red-500/50">Total Capital Loss</div>
                </div>
            </div>
        </div>

        {/* Global Failure Overlay */}
        <AnimatePresence>
            {stage === 'failure' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-x-0 -top-20 bottom-0 pointer-events-none flex items-center justify-center"
                >
                    <div className="hero-text text-[200px] text-red-500/5 uppercase select-none rotate-12">RECALL</div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-burnished-copper">
            <AlertOctagon size={32} />
            <p className="hero-text text-2xl italic">You cannot patch silicon.</p>
        </div>
        <button 
                onClick={() => setStage('normal')}
                className="micro-text uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
                Reset Economic Cycle
            </button>
      </div>
    </BlueprintContainer>
  );
};
