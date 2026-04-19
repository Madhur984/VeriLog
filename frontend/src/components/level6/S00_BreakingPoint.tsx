import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Cpu, Layers } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
  isProMode?: boolean;
}

export const S00_BreakingPoint: React.FC<Props> = ({ isActive }) => {
  // Reduction: Fewer elements for performance, more deliberate positioning
  const gridElements = Array.from({ length: 48 }).map((_, i) => ({
    id: i,
    x: (i % 8) * 100 - 350,
    y: Math.floor(i / 8) * 80 - 160,
    delay: i * 0.05
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto relative px-8 text-center bg-matte-obsidian py-20 rounded-[80px]">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 }}
        className="mb-20"
      >
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase">
                The <span className="text-plasma-cyan shadow-cyan-glow">Wall.</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-60 font-black italic leading-tight">
                Once, we designed by hand. One gate at a time. One wire at a time. But as chips grew from 100 to 100,000,000,000 transistors, the human mind hit a hard limit.
            </p>
        </div>
        
        <div className="relative group">
            <div className="absolute -inset-4 bg-burnished-copper/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
            >
                <img src="/assets/module6/chaos.png" alt="Circuit Chaos" className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Diagnostic Scan</div>
                    <div className="text-2xl font-black italic text-burnished-copper tracking-tighter">UNMANAGEABLE COMPLEXITY</div>
                </div>
            </motion.div>
        </div>
      </div>
      </motion.div>

      <div className="relative w-full h-[300px] flex items-center justify-center">
          {/* Complexity Wave: 48 elements but highly transparent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {gridElements.map((g) => (
                <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isActive ? {
                        opacity: [0, 0.1, 0.2, 0],
                        scale: [0.8, 1.1],
                        x: g.x,
                        y: g.y,
                    } : {}}
                    transition={{ 
                        duration: 3, 
                        delay: g.delay,
                        repeat: Infinity,
                    }}
                    className="absolute p-4 rounded-xl border border-burnished-copper/10 bg-burnished-copper/5"
                >
                    <Cpu size={24} strokeWidth={1} className="text-burnished-copper opacity-30" />
                </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="z-20 p-12 rounded-[50px] bg-solder-mask border border-white/5 backdrop-blur-xl shadow-2xl"
          >
             <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight max-w-2xl">
                One billion gates. <br/>
                <span className="text-burnished-copper italic">One human brain.</span> <br/>
                The math has stopped working.
             </p>
          </motion.div>
      </div>

    </div>
  );
};
