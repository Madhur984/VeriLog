import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Cpu, Activity } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S09_IdentityShift: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center w-full max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="flex items-center justify-center gap-6 mb-12 text-amber-500">
            <Trophy size={40} className="animate-bounce" />
        </div>

        <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-tight italic uppercase">
            Architect of <span className="text-amber-500">Logic.</span>
        </h2>

        <p className="text-2xl md:text-3xl opacity-40 mb-20 max-w-3xl mx-auto leading-tight font-black italic tracking-tighter">
            You no longer draw gates. You <span className="text-white italic underline decoration-amber-500/20">describe reality.</span> The digital world is yours to program.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20 max-w-5xl mx-auto">
             <div className="p-10 rounded-[40px] border border-amber-500/10 bg-amber-500/5 text-left relative group">
                 <div className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-500 mb-6">Up Next // Sequential Mastery</div>
                 <h4 className="text-3xl font-black italic tracking-tighter mb-6">The Foundation of Memory.</h4>
                 <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-amber-500 text-lg font-bold mb-6">
                    always @(posedge clk) <br />
                    &nbsp;&nbsp;count &lt;= count + 1;
                 </div>
                 <p className="text-sm opacity-50 font-bold italic tracking-tight italic">
                    <span className="text-white italic">The Secret of Synthesis:</span> This single line describes a multi-bit register + a full adder. You write logic; the tool builds the hardware.
                 </p>
             </div>

             <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col justify-center gap-10">
                 <div className="flex flex-col gap-4">
                     <div className="text-[10px] font-mono italic opacity-20 uppercase tracking-widest text-left">Waveform Preview</div>
                     <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="w-12 text-[8px] font-mono font-black opacity-20">{i === 1 ? 'CLK' : 'QOUT'}</div>
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
                    className="group w-full relative h-14 rounded-3xl bg-amber-500 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-transform hover:scale-105 active:scale-95"
                 >
                    Command Module 7 <ArrowRight size={18} />
                 </button>
             </div>
        </div>
      </motion.div>
    </div>
  );
};
