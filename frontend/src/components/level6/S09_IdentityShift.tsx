import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Cpu, Activity } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S09_IdentityShift: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center w-full max-w-6xl mx-auto px-8 relative bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-6 mb-16 text-amber-500 relative">
            <Trophy size={60} className="animate-bounce" />
            <div className="absolute -inset-10 bg-amber-500/10 blur-[60px] rounded-full animate-pulse" />
        </div>

        <h2 className="hero-text text-6xl md:text-[120px] italic uppercase mb-12 leading-[0.8] text-white">
            Architect of <span className="text-amber-500">Logic.</span>
        </h2>

        <p className="body-text text-2xl md:text-5xl opacity-60 mb-20 max-w-4xl mx-auto italic leading-tight">
            You no longer draw gates. You <span className="text-white italic underline underline-offset-8 decoration-amber-500/30 px-2">describe reality.</span> The digital world is yours to program.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20 max-w-5xl mx-auto">
              <div className="p-10 rounded-[60px] border border-amber-500/10 bg-amber-500/5 text-left relative group backdrop-blur-md shadow-inner flex flex-col justify-center">
                 <div className="micro-text uppercase text-amber-500 mb-8 tracking-[0.4em]">Up Next // Sequential Mastery</div>
                 <h4 className="hero-text text-3xl md:text-5xl italic mb-10 uppercase tracking-tighter">The Foundation <br/>of Memory.</h4>
                 <div className="p-8 rounded-[35px] bg-[#0A0A0B] border border-white/5 mono-text text-amber-500 text-lg md:text-xl mb-10 shadow-inner overflow-hidden relative group-hover:border-amber-500/20 transition-all">
                    always @(posedge clk) <br />
                    &nbsp;&nbsp;count &lt;= count + 1;
                 </div>
                 <p className="body-text text-base md:text-lg opacity-60 italic leading-snug">
                    <span className="text-white italic">The Secret of Synthesis:</span> This single line describes a multi-bit register + a full adder. You write logic; the tool builds the hardware.
                 </p>
             </div>

             <div className="p-10 rounded-[60px] border border-white/5 bg-white/[0.01] flex flex-col justify-center gap-16 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                 <div className="flex flex-col gap-4">
                      <div className="micro-text text-left opacity-20 uppercase">Waveform Preview</div>
                     <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="w-12 micro-text opacity-20">{i === 1 ? 'CLK' : 'QOUT'}</div>
                                <div className="flex-1 h-2 rounded-full bg-white/5 relative overflow-hidden">
                                     <motion.div 
                                        animate={{ x: [-200, 200] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                        className="h-full w-24 bg-amber-500/20 rounded-full"
                                     />
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>

                 <button 
                    onClick={() => window.location.href = '/course-map'}
                    className="group w-full relative h-20 rounded-[35px] bg-amber-500 text-slate-950 hero-text text-xl md:text-2xl italic uppercase flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40"
                 >
                    Command Module 7 <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                 </button>
             </div>
        </div>
      </motion.div>
    </div>
  );
};
