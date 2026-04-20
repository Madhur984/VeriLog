import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Terminal, CheckCircle2, XCircle, Play, Binary } from "lucide-react";

export const S16_TestbenchLab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [inputA, setInputA] = useState<'0' | '1'>('0');
  const [inputB, setInputB] = useState<'0' | '1'>('0');
  const [status, setStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');

  const runSimulation = () => {
    setStatus('running');
    setTimeout(() => {
      // Simple logic check: AND gate simulation
      const result = (inputA === '1' && inputB === '1') ? 'passed' : 'failed';
      setStatus(result);
    }, 1500);
  };

  return (
    <BlueprintContainer>
      <HeroText>Verification is Design.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-16 text-center max-w-3xl">
        In the industry, 70% of an engineer's time is spent in the Testbench. You don't build until you prove it works in every corner case.
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
        {/* Input Stimulus Area */}
        <div className="md:col-span-4 space-y-6">
            <div className="micro-text uppercase text-plasma-cyan mb-4">Input Stimulus</div>
            
            <div className="p-8 rounded-[40px] bg-black/40 border border-white/5 space-y-8 flex flex-col items-center backdrop-blur-md">
                <div className="space-y-4 w-full">
                    <label className="micro-text uppercase opacity-40">Signal A</label>
                    <div className="flex bg-white/5 rounded-2xl p-2">
                        {['0', '1'].map((v) => (
                            <button 
                                key={v}
                                onClick={() => setInputA(v as any)}
                                className={`flex-1 py-3 rounded-xl micro-text transition-all ${inputA === v ? 'bg-plasma-cyan text-black' : 'opacity-30 hover:opacity-100 uppercase'}`}
                            >
                                {v === '1' ? 'HIGH' : 'LOW'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 w-full">
                    <label className="micro-text uppercase opacity-40">Signal B</label>
                    <div className="flex bg-white/5 rounded-2xl p-2">
                        {['0', '1'].map((v) => (
                            <button 
                                key={v}
                                onClick={() => setInputB(v as any)}
                                className={`flex-1 py-3 rounded-xl micro-text transition-all ${inputB === v ? 'bg-plasma-cyan text-black' : 'opacity-30 hover:opacity-100 uppercase'}`}
                            >
                                {v === '1' ? 'HIGH' : 'LOW'}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={runSimulation}
                    disabled={status === 'running'}
                    className="w-full py-6 rounded-3xl bg-plasma-cyan text-black micro-text uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Play size={20} fill="currentColor" />
                    Simulate
                </button>
            </div>
        </div>

        {/* Terminal/Output Area */}
        <div className="md:col-span-8 h-full">
            <div className="flex items-center justify-between mb-4 px-4">
                <div className="micro-text uppercase text-white/40 flex items-center gap-2">
                    <Terminal size={14} /> Simulation Terminal
                </div>
                <div className="mono-text opacity-20 uppercase">VCS.K1.PRO</div>
            </div>

            <div className="relative h-full min-h-[400px] bg-[#0A0A0B]/80 border border-white/10 rounded-[50px] p-10 font-mono text-sm overflow-hidden flex flex-col shadow-inner backdrop-blur-3xl">
                <div className="flex-1 space-y-4 opacity-80 mono-text">
                    <div className="text-plasma-cyan/60"># Loading testbench modules...</div>
                    <div className="text-white/60"># Initializing stimulus signals...</div>
                    <div className="text-white/40 italic">$display("Stimulus A: {inputA}, B: {inputB}");</div>
                    
                    <AnimatePresence>
                        {status !== 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
                                <div className="text-cyber-amber"># Running RTL Simulation...</div>
                                <div className="flex gap-4 text-white/20">
                                    {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse">{i}ns...</div>)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {status === 'passed' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-500 hero-text text-lg flex items-center gap-4 pt-6 italic">
                            <CheckCircle2 size={24} />
                            SIMULATION PASSED: Correct Logic Result Detected.
                        </motion.div>
                    )}

                    {status === 'failed' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 hero-text text-lg flex items-center gap-4 pt-6 italic">
                            <XCircle size={24} />
                            SIMULATION FAILED: Unexpected output pattern. Check Netlist.
                        </motion.div>
                    )}
                </div>

                {status === 'running' && (
                    <motion.div 
                        animate={{ opacity: [0.2, 0.4, 0.2] }} 
                        transition={{ repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="hero-text text-2xl text-plasma-cyan italic uppercase flex items-center gap-6">
                            <Binary size={40} className="animate-pulse" /> Analyzing Logic Paths...
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase">
        Key Takeaway: You write code to build. You write testbenches to survive.
      </div>
    </BlueprintContainer>
  );
};
