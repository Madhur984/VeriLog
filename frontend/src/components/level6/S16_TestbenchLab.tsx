import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Terminal, CheckCircle2, XCircle, Play, Binary, Layers, Share2, Activity, ShieldCheck, Database } from "lucide-react";

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
    }, 1800);
  };

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <ShieldCheck size={14} /> Verification Framework
             </div>
             <HeroText className="text-left leading-none" color="text-white">Verification <br/><span className="text-plasma-cyan">is Design.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                In the semiconductor industry, <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">70% of engineering cycles</span> are spent in the Testbench.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               You don't build hardware until you prove it works in every corner case. A Verilog engineer who cannot verify is an engineer who creates "Silicon Waste." Verification isn't an afterthought-it's the core of the implementation process.
            </p>

            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-plasma-cyan group shadow-xl">
                 <div className="flex items-center gap-4 mb-4">
                    <Database size={20} className="text-plasma-cyan group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">RTL Coverage Monitor</span>
                 </div>
                 <p className="body-text text-sm opacity-50 leading-relaxed font-light italic">
                    "You write code to build. You write testbenches to survive the complexity of a billion transistors."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: RTL Truth Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Terminal size={14} className="text-plasma-cyan" /> Industrial Simulation Terminal // VCS_2025
            </div>

            <div className="flex-1 flex flex-col gap-8 mt-12 overflow-hidden">
                {/* Stimulus Input Bay */}
                <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Binary size={80} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-4">
                            <div className="micro-text uppercase text-white/20 tracking-widest text-[9px] font-black">Signal Port // A_IN</div>
                            <div className="flex bg-black/60 rounded-3xl p-2 border border-white/5">
                                {['0', '1'].map((v) => (
                                    <button 
                                        key={v}
                                        onClick={() => setInputA(v as any)}
                                        className={`flex-1 py-4 rounded-2xl micro-text text-[10px] font-black transition-all duration-300 ${inputA === v ? 'bg-plasma-cyan text-black shadow-lg shadow-plasma-cyan/20' : 'text-white/20 hover:text-white/40 uppercase'}`}
                                    >
                                        L_FORCE_{v}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="micro-text uppercase text-white/20 tracking-widest text-[9px] font-black">Signal Port // B_IN</div>
                            <div className="flex bg-black/60 rounded-3xl p-2 border border-white/5">
                                {['0', '1'].map((v) => (
                                    <button 
                                        key={v}
                                        onClick={() => setInputB(v as any)}
                                        className={`flex-1 py-4 rounded-2xl micro-text text-[10px] font-black transition-all duration-300 ${inputB === v ? 'bg-plasma-cyan text-black shadow-lg shadow-plasma-cyan/20' : 'text-white/20 hover:text-white/40 uppercase'}`}
                                    >
                                        L_FORCE_{v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={runSimulation}
                        disabled={status === 'running'}
                        className="w-full h-16 rounded-3xl bg-plasma-cyan text-black micro-text text-[11px] font-black tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-plasma-cyan/20 disabled:opacity-50"
                    >
                        <Play size={18} fill="currentColor" />
                        Execute Simulation Cycle
                    </button>
                </div>

                {/* Simulation Logic Monitor */}
                <div className="flex-1 p-8 rounded-[40px] bg-white/[0.01] border border-white/10 font-mono text-[11px] relative overflow-hidden flex flex-col group">
                    <div className="space-y-3 opacity-60 text-white/40 mb-6">
                        <div className="flex items-center gap-2 text-plasma-cyan/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-plasma-cyan animate-pulse" />
                            [SYSTEM] Initializing SV_LOGIC kernels...
                        </div>
                        <div className="pl-4 border-l border-white/5">
                            $ iverilog -o design tb_uut.v module_core.v<br/>
                            $ vvp design
                        </div>
                        <div className="text-plasma-cyan/40 pl-4 py-1 italic">
                            # Applied Stimulus: port_a={inputA}, port_b={inputB}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {status === 'running' ? (
                                <motion.div 
                                    key="running"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-plasma-cyan border-t-transparent animate-spin" />
                                    <div className="micro-text text-plasma-cyan font-black tracking-[0.4em] uppercase animate-pulse">Running Netlist Probe...</div>
                                </motion.div>
                            ) : status === 'passed' ? (
                                <motion.div 
                                    key="passed"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-8 rounded-[40px] bg-plasma-cyan/5 border border-plasma-cyan/20 flex flex-col items-center text-center gap-4"
                                >
                                    <CheckCircle2 size={48} className="text-plasma-cyan shadow-cyan-glow" />
                                    <div>
                                        <div className="hero-text text-3xl uppercase text-white tracking-widest leading-none mb-2">Cycle Passed</div>
                                        <div className="micro-text uppercase text-plasma-cyan font-black tracking-widest text-[9px]">Logical Equivalence Verified</div>
                                    </div>
                                </motion.div>
                            ) : status === 'failed' ? (
                                <motion.div 
                                    key="failed"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/20 flex flex-col items-center text-center gap-4"
                                >
                                    <XCircle size={48} className="text-red-500" />
                                    <div>
                                        <div className="hero-text text-3xl uppercase text-white tracking-widest leading-none mb-2">Cycle Failed</div>
                                        <div className="micro-text uppercase text-red-500 font-black tracking-widest text-[9px]">Mismatched Gate Output Profile</div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center opacity-20 gap-4">
                                    <Layers size={48} />
                                    <div className="micro-text uppercase tracking-widest font-black">Awaiting Stimulus</div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="absolute bottom-6 right-8">
                         <div className="micro-text uppercase text-white/10 tracking-[0.4em] font-black text-[9px]">VCS_ENGINE_V5.4</div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-bg-elev border border-border-soft rounded-3xl shadow-neo">
                <div className="flex items-center gap-4">
                    <Share2 size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Verification Topology</div>
                        <div className="body-text text-[10px] opacity-30 italic">Observing deterministic stimulus response across UUT logic fabric.</div>
                    </div>
                </div>
                <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 text-plasma-cyan micro-text text-[9px] uppercase font-black">
                    PROBE ACTIVE
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
