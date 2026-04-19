import React from 'react';
import { motion } from 'framer-motion';
import { Code, Share2, Rocket } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S05b_DieComparison: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto px-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic uppercase">Code to <span className="text-rose-500">Silicon.</span></h2>
            <p className="text-lg opacity-40 font-bold italic tracking-tight italic">Tangible proof of the digital-to-physical transition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Verilog RTL */}
          <div className="bg-[#020100] p-8 rounded-[40px] border border-white/5 relative group overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                    <Code size={18} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Verilog RTL</span>
            </div>
            <pre className="text-sm font-mono text-rose-400 leading-relaxed font-bold">
{`module adder(
  input [3:0] a, b,
  output [4:0] sum
);
  assign sum = a + b;
endmodule`}
            </pre>
            <div className="mt-8 pt-6 border-t border-white/5 text-[10px] font-mono opacity-20 uppercase tracking-widest italic">
                Logic Definition
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/5 blur-3xl rounded-full" />
          </div>

          {/* Right: Physical Die Placeholder */}
          <div className="relative group">
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center h-[350px] relative overflow-hidden backdrop-blur-sm">
                 {/* Stylized Die Pattern Backdrop */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                         <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="1" />
                         <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                 </div>

                 <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center p-0.5 shadow-2xl shadow-rose-500/20">
                        <div className="w-full h-full bg-[#020100] rounded-[22px] flex items-center justify-center">
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">DIE_X04</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-black italic tracking-wide uppercase">Physical Silicon</div>
                        <div className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] mt-1">Foundry Output</div>
                    </div>
                 </div>
            </div>
            
            {/* Connection Arrow */}
            <div className="absolute top-1/2 -left-5 -translate-y-1/2 z-20 md:flex hidden">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-black flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Share2 size={20} />
                </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-black uppercase tracking-widest text-white/40">
                <Rocket size={14} className="text-rose-500" /> This Verilog code becomes this silicon die.
            </div>
        </div>
      </motion.div>
    </div>
  );
};
