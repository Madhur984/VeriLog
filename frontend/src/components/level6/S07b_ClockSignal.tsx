import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap, Timer, Radio, AudioLines } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S07b_ClockSignal: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Timer size={14} /> Master Synchronization
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan">Drum.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Without a precision signal, fifty thousand transistors are simply <span className="text-white/20 font-bold italic line-through decoration-plasma-cyan/50">Chaos.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Imagine a stadium full of people. Without a cue, they move randomly. But when the <span className="text-plasma-cyan font-bold underline underline-offset-8 decoration-plasma-cyan/30">Drum Hits</span>, every individual acts in perfect unison. 
               <br/><br/>
               The Clock is that drum. It is the rhythmic pulse that ensures every logic gate in your processor performs its specific task at the exact same nanosecond.
            </p>

            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-plasma-cyan group shadow-xl">
                 <div className="flex items-center gap-4 mb-4">
                    <Radio size={20} className="text-plasma-cyan group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Oscillation Verity</span>
                 </div>
                 <p className="body-text text-sm opacity-50 leading-relaxed font-light italic">
                    "Synchronous logic is the foundation of modern compute. The Clock signal is the physical law that governs it."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Signal Pulse Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Activity size={14} className="text-plasma-cyan" /> Master Signal Pulse Monitor
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
                <div className="relative w-full h-64 bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden flex items-center justify-center">
                    {/* Visual Sine/Square Wave Simulation */}
                    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <svg width="100%" height="100%" viewBox="0 0 800 200">
                            <path d="M 0 100 Q 25 25 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100 T 650 100 T 700 100 T 750 100 T 800 100" stroke="white" strokeWidth="1" fill="none" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10 flex gap-4 items-end h-32">
                        {[...Array(24)].map((_, i) => (
                             <motion.div 
                                key={i}
                                animate={{ height: [20, 100, 20] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                                className="w-2 bg-plasma-cyan/30 rounded-full group-hover:bg-plasma-cyan transition-colors"
                             />
                        ))}
                    </div>
                    
                    <div className="absolute top-6 right-8 flex flex-col items-end">
                        <div className="micro-text uppercase text-plasma-cyan font-black tracking-widest text-[9px]">Cycle Frequency</div>
                        <div className="hero-text text-2xl text-white">4.20 GHz</div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[40px] bg-plasma-cyan/10 border-2 border-plasma-cyan flex items-center justify-center text-plasma-cyan shadow-cyan-glow animate-pulse">
                             <Clock size={60} strokeWidth={1} />
                        </div>
                        {/* Circular Radar Sweep */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute -inset-4 border border-white/5 border-dashed rounded-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                        <div className="p-8 rounded-[35px] bg-[#0A0A0B] border border-white/5 text-center space-y-2">
                             <div className="micro-text opacity-20 uppercase tracking-widest text-[9px]">Signal Accuracy</div>
                             <div className="hero-text text-xl text-white">±0.01ps</div>
                        </div>
                        <div className="p-8 rounded-[35px] bg-[#0A0A0B] border border-white/5 text-center space-y-2">
                             <div className="micro-text opacity-20 uppercase tracking-widest text-[9px]">Duty Cycle</div>
                             <div className="hero-text text-xl text-white">50.00%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <AudioLines size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Temporal Alignment</div>
                        <div className="body-text text-[10px] opacity-30">Verifying synchronous pulse propagation delay... OK</div>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-plasma-cyan animate-pulse" />
                    <span className="micro-text text-[10px] text-plasma-cyan font-black uppercase tracking-widest">LOCKED</span>
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
