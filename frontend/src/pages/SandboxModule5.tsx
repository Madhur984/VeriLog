import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, RotateCcw, Copy, Check, ArrowLeft, Box, Binary, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SandboxModule5: React.FC = () => {
  const [code, setCode] = useState('assign Y = (A & B) | (~C & D);');
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleRun = () => {
    setIsSimulating(true);
    setHasRun(false);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 1500);
  };

  const handleCopy = () => {
     navigator.clipboard.writeText(code);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-main p-8 md:p-20 font-sans selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-cyan-500/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/module/5')}
                  className="w-12 h-12 rounded-2xl bg-bg-elev border border-border-soft flex items-center justify-center hover:bg-hover-bg transition-all text-text-main"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-mono tracking-widest uppercase font-black">
                            Experimental Lab
                        </div>
                        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-widest uppercase font-black animate-pulse">
                            Sandbox v1.0
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic">Verilog <span className="text-cyan-500">Playground</span></h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <div className="text-[10px] font-mono uppercase opacity-30 tracking-widest font-black text-text-dim">Memory Status</div>
                    <div className="text-xs font-mono text-emerald-500">Allocated: 4.2 MB</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-bg-elev border border-border-soft flex items-center justify-center text-text-dim/60">
                    <Box size={20} />
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Console */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="rounded-[40px] border border-border-soft bg-bg-elev overflow-hidden shadow-2xl relative group">
                    <div className="px-8 py-5 border-b border-border-soft bg-bg-base/40 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                             <Terminal size={16} className="text-cyan-500 opacity-40" />
                             <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 text-text-dim">combinational_logic_test.v</span>
                        </div>
                        <button onClick={handleCopy} className="p-2.5 rounded-xl bg-bg-base border border-border-soft text-text-dim hover:text-cyan-500 transition-all">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div className="relative p-10 font-mono text-xl md:text-2xl min-h-[400px] flex">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="absolute inset-0 w-full h-full p-10 bg-transparent text-transparent outline-none resize-none z-10 caret-cyan-500 selection:bg-cyan-500/30"
                        />
                        <div className="pointer-events-none z-0 whitespace-pre-wrap leading-relaxed">
                             <span className="text-cyan-500 font-black italic">assign </span>
                             <span className="text-text-main font-medium">{code.replace('assign', '')}</span>
                             <motion.span 
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="inline-block w-1 h-6 bg-cyan-500 align-middle ml-1"
                             />
                        </div>
                    </div>

                    <div className="px-10 py-8 border-t border-border-soft bg-bg-base/20 flex items-center justify-between">
                         <button 
                            onClick={handleRun}
                            disabled={isSimulating}
                            className={`group flex items-center gap-4 px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all ${isSimulating ? 'bg-cyan-500/20 text-cyan-500/40' : 'bg-cyan-500 text-black hover:scale-105 active:scale-95 shadow-2xl shadow-cyan-500/30'}`}
                         >
                            {isSimulating ? <Binary size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                            {isSimulating ? 'Compiling Netlist...' : 'Execute Logic'}
                         </button>
                         <button onClick={() => setCode('// Write your logic here\nassign Y = ;')} className="p-4 text-text-dim/30 hover:text-text-main hover:rotate-180 transition-all duration-700">
                             <RotateCcw size={20} />
                         </button>
                    </div>
                </div>

                <div className="p-8 rounded-[35px] bg-bg-elev border border-border-soft flex items-start gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                         <Zap size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-xs font-black uppercase tracking-widest text-amber-500/80">Sandbox Rules</h4>
                         <p className="text-sm text-text-sub leading-relaxed font-medium"> This sandbox supports combinational logic expressions using <span className="text-text-main font-bold">& (AND), | (OR), ~ (NOT), ^ (XOR)</span>. Every assignment represents a physical wire connection in your simulated hardware design.</p>
                      </div>
                </div>
            </div>

            {/* Visualizer Panel */}
            <div className="flex flex-col gap-6">
                <div className="rounded-[40px] border border-border-soft bg-bg-elev p-10 flex flex-col items-center justify-center min-h-[400px] relative shadow-neo overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                         <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                            {[...Array(100)].map((_, i) => <div key={i} className="border-[0.5px] border-cyan-500" />)}
                         </div>
                    </div>

                    <div className="absolute top-8 left-10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 italic text-text-dim">Gate Synthesis Engine</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {hasRun ? (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center gap-10"
                            >
                                <div className="relative">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                        className="w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center"
                                    >
                                        <div className="w-40 h-40 border border-cyan-500/10 rounded-full" />
                                    </motion.div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Cpu size={80} className="text-cyan-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-black uppercase tracking-widest inline-block">Logic Validated</div>
                                    <h3 className="text-2xl font-black italic tracking-tighter">Netlist Successfully Inferred</h3>
                                    <p className="text-xs text-text-dim font-mono tracking-widest">Complex gate mapping pass // No timing violations</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-6 opacity-[0.15] group-hover:opacity-30 transition-opacity">
                                <Play size={60} className="mx-auto" />
                                <div className="text-xl font-black uppercase tracking-tighter italic">Execute Logic to Synthesize</div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-8 rounded-[35px] border border-border-soft bg-bg-elev/20 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                         <div className="text-[10px] font-mono uppercase tracking-widest opacity-30 font-black text-text-dim">Statistics</div>
                         <div className="w-8 h-8 rounded-lg bg-bg-base flex items-center justify-center text-text-dim/40"><Binary size={14} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-bg-void border border-border-soft">
                            <div className="text-[9px] font-mono uppercase opacity-30 mb-2 text-text-dim">Gate Count</div>
                            <div className="text-xl font-black text-cyan-500">12 - 42</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-bg-void border border-border-soft">
                            <div className="text-[9px] font-mono uppercase opacity-30 mb-2 text-text-dim">Estimated Area</div>
                            <div className="text-xl font-black text-amber-500">8.4 µm²</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
