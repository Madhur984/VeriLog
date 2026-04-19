import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S07b_ClockSignal: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full flex-1 flex flex-col items-center justify-center pt-10"
      >
        <h2 className="hero-text text-8xl md:text-[180px] italic uppercase leading-[0.8] mb-16 text-white">
            The <span className="text-cyan-500">Drum.</span>
        </h2>
        
        <div className="max-w-4xl space-y-16 px-6">
            <p className="body-text text-3xl md:text-6xl italic leading-tight text-white/90">
                 Imagine 50,000 people in a stadium. <br/>
                 Without a signal, they are <span className="text-white opacity-20">Chaos.</span>
            </p>
            
            <div className="flex items-center justify-center gap-16 py-10 border-y border-white/5 bg-white/[0.01] rounded-[40px] px-10 backdrop-blur-sm">
                 <div className="w-px h-32 bg-cyan-500/30" />
                 <p className="body-text text-xl md:text-3xl opacity-60 italic max-w-xl leading-snug text-left">
                    But when the <span className="text-cyan-500 underline underline-offset-8">Drum Hits</span>, everyone stands up at the exact same moment. 
                    <br/><br/>
                    The Clock is that drum. It ensures every gate in your computer acts in <span className="text-white italic">perfect unison.</span>
                 </p>
            </div>
        </div>
      </motion.div>

      {/* Simplified, Powerful Metronome */}
      <div className="mt-16 pb-10 opacity-60 group hover:opacity-100 transition-opacity">
         <div className="flex flex-col items-center">
                <div className="w-20 h-40 bg-white/[0.03] border border-white/10 rounded-t-[50px] rounded-b-2xl relative overflow-hidden backdrop-blur-md shadow-xl">
                    <motion.div 
                        animate={{ rotate: [-30, 30] }}
                        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        style={{ originX: '50%', originY: '100%' }}
                        className="absolute bottom-6 left-1/2 -ml-0.5 w-1 h-28 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                    />
                </div>
                <div className="mt-6 micro-text uppercase text-cyan-500 tracking-[0.4em] animate-pulse">Pulse Detection Active</div>
         </div>
      </div>

    </div>
  );
};
