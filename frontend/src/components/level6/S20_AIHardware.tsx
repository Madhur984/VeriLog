import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Layers } from 'lucide-react';

export const S20_AIHardware: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 bg-plasma-cyan/10 text-plasma-cyan micro-text tracking-[0.3em] uppercase">
            2025 Silicon Frontier
          </div>
        </motion.div>
        <h1 className="hero-text text-5xl md:text-6xl tracking-tight">The AI <span className="text-plasma-cyan italic">Shift</span></h1>
        <p className="body-text opacity-60 max-w-2xl mx-auto">
          Verilog is no longer just for CPUs. In the age of Neural Intelligence, we build Matrix Engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Legacy CPU ALU */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu size={120} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">General Purpose ALU</h3>
                <p className="micro-text opacity-40 uppercase tracking-widest">Scalar Logic</p>
              </div>
            </div>

            <div className="space-y-4 py-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-full h-2 rounded-full bg-white/5 relative overflow-hidden">
                    <motion.div 
                      animate={{ x: [-100, 400] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="absolute inset-0 w-20 bg-plasma-cyan/20 blur-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm opacity-50 italic">
              "Flexible but slow. Designed for branch logic and generic computation."
            </p>
          </div>
        </motion.div>

        {/* Neural Systolic Array */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[40px] border border-plasma-cyan/20 bg-plasma-cyan/[0.02] backdrop-blur-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-plasma-cyan">
            <Layers size={120} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-plasma-cyan/10 flex items-center justify-center text-plasma-cyan">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Neural Matrix Engine</h3>
                <p className="micro-text text-plasma-cyan font-bold uppercase tracking-widest">Tensor Logic</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 py-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    backgroundColor: ['rgba(0,212,255,0.05)', 'rgba(0,212,255,0.3)', 'rgba(0,212,255,0.05)'] 
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: (i % 4 + Math.floor(i / 4)) * 0.1 
                  }}
                  className="aspect-square rounded-lg border border-plasma-cyan/20 flex items-center justify-center text-[8px] font-mono text-plasma-cyan/40"
                >
                  MAC
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-plasma-cyan/80 italic">
              "The architecture of intelligence. Massively parallel Matrix-Multiplication."
            </p>
          </div>
        </motion.div>
      </div>

      <div className="p-8 rounded-[30px] border border-white/5 bg-black/40 flex items-center justify-between gap-12">
        <div className="space-y-2">
          <h4 className="text-lg font-bold">Why Verilog for AI?</h4>
          <p className="text-sm opacity-50">Software is the bottle-neck. Matrix operations must be hard-wired into silicon to reach TOPS (Tera Operations Per Second) performance.</p>
        </div>
        <div className="flex gap-4">
            <div className="text-center">
                <div className="text-2xl font-black text-plasma-cyan">1000x</div>
                <div className="micro-text opacity-30 uppercase tracking-tighter">Throughput</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-black text-amber-500">10x</div>
                <div className="micro-text opacity-30 uppercase tracking-tighter">Efficiency</div>
            </div>
        </div>
      </div>
    </div>
  );
};
