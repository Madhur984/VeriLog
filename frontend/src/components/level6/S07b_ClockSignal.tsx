import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S07b_ClockSignal: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-8 relative text-center">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full flex-1 flex flex-col items-center justify-center pt-20"
      >
        <h2 className="text-7xl md:text-[140px] font-black italic tracking-tighter leading-[0.8] uppercase mb-12">
            The <span className="text-cyan-500">Drum.</span>
        </h2>
        
        <div className="max-w-4xl space-y-12">
            <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight italic">
                 Imagine 50,000 people in a stadium. <br/>
                 Without a signal, they are <span className="text-white opacity-20">Chaos.</span>
            </p>
            
            <div className="flex items-center justify-center gap-12 py-10">
                 <div className="w-px h-24 bg-cyan-500/20" />
                 <p className="text-xl md:text-2xl font-bold opacity-40 italic max-w-lg">
                    But when the <span className="text-cyan-500">Drum Hits</span>, everyone stands up at the exact same moment. 
                    <br/><br/>
                    The Clock is that drum. It ensures every gate in your computer acts in <span className="text-white">perfect unison.</span>
                 </p>
            </div>
        </div>
      </motion.div>

      {/* Simplified, Powerful Metronome */}
      <div className="pb-20 opacity-40 group hover:opacity-100 transition-opacity">
         <div className="flex flex-col items-center">
                <div className="w-16 h-32 bg-white/[0.02] border border-white/5 rounded-t-[40px] rounded-b-xl relative overflow-hidden">
                    <motion.div 
                        animate={{ rotate: [-25, 25] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        style={{ originX: '50%', originY: '100%' }}
                        className="absolute bottom-4 left-1/2 -ml-0.5 w-0.5 h-24 bg-cyan-500"
                    />
                </div>
                <div className="mt-4 text-[10px] uppercase font-mono tracking-[0.4em] text-cyan-500 font-black">Pulse Detection Active</div>
         </div>
      </div>

    </div>
  );
};
