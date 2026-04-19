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
        <h1 className="text-7xl md:text-[120px] font-black italic tracking-tighter leading-[0.85] uppercase mb-8">
            The <span className="text-burnished-copper">Collapse.</span>
        </h1>
        <p className="text-2xl md:text-4xl font-black tracking-tight opacity-20 max-w-4xl mx-auto">
            Human hands can no longer draw the future.
        </p>
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
