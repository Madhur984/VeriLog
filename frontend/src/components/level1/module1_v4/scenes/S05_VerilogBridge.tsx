import React from 'react';
import { KineticText } from '../components/Module1Components';

export const S05_VerilogBridge: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="pb-32">
       <div className={`rounded-[4rem] p-16 text-center relative overflow-hidden border shadow-2xl transition-all duration-1000 ${isDarkMode ? 'bg-slate-900/40 border-cyan-500/30' : 'bg-slate-50 border-cyan-300'}`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #22d3ee 0%, transparent 70%)' }} />
          
          <p className="text-[10px] font-mono font-black uppercase tracking-[1em] mb-12 opacity-30">Phase_Conclusion // Gateway_01</p>
          <h2 className="text-6xl md:text-7xl font-black mb-12 tracking-tighter">
             <KineticText text="THE_VERILOG" className={isDarkMode ? 'text-cyan-500' : 'text-cyan-600'} />
             <br />
             <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>BRIDGE</span>
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-12 relative z-10">
             <p className={`text-2xl font-medium leading-relaxed italic opacity-60 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                "Analog is the pulse. Digital is the mind. Verilog is the blueprint that organizes them."
             </p>
             
             <div className="p-10 rounded-[3rem] border-2 border-dashed border-cyan-500/20 bg-cyan-500/5">
                <p className="text-3xl font-black italic uppercase tracking-tighter text-cyan-500 leading-tight">
                   Design the intelligence.
                   <br />
                   Master the hardware.
                </p>
             </div>

             <div className="pt-16">
                <button
                  className="px-12 py-5 rounded-full bg-cyan-500 text-black font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.6)] hover:translate-y-[-4px] transition-all active:scale-95"
                  onClick={() => window.location.href = '/module/2'}
                >
                  Launch Module 02
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
