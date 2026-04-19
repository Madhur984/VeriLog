import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Thermometer, BatteryLow, Activity } from 'lucide-react';

export const S21_PowerDesign: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [isPowerGated, setIsPowerGated] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 micro-text tracking-[0.3em] uppercase">
            Thermal Efficiency Layer
          </div>
        </motion.div>
        <h1 className="hero-text text-5xl md:text-6xl tracking-tight">Green <span className="text-amber-500 italic">Silicon</span></h1>
        <p className="body-text opacity-60 max-w-2xl mx-auto">
          Logic is expensive. In Verilog, we don't just build circuits—we build switches that save the world.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Power Controls */}
        <div className="lg:col-span-1 p-8 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Module Gating</h3>
                <p className="text-sm opacity-50">Manually shut down idle logic blocks to prevent leakage current.</p>
            </div>

            <button 
                onClick={() => setIsPowerGated(!isPowerGated)}
                className={`w-full py-6 rounded-[25px] flex flex-col items-center gap-3 transition-all ${isPowerGated ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
                <Zap size={32} className={isPowerGated ? 'animate-pulse' : ''} />
                <span className="micro-text uppercase font-black tracking-widest">
                    {isPowerGated ? 'Circuit De-Energized' : 'Circuit Online'}
                </span>
            </button>

            <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-mono opacity-40 uppercase">
                    <span>Efficiency Rating</span>
                    <span>{isPowerGated ? '98%' : '42%'}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={false}
                        animate={{ width: isPowerGated ? '98%' : '42%', backgroundColor: isPowerGated ? '#f59e0b' : '#3b82f6' }}
                        className="h-full"
                    />
                </div>
            </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 p-10 rounded-[60px] border border-white/5 bg-black/40 backdrop-blur-md relative overflow-hidden flex items-center justify-center min-h-[400px]">
             {/* Heat Gradient */}
             <motion.div 
                animate={{ opacity: isPowerGated ? 0.05 : 0.4 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.3),transparent_70%)]" 
             />

             <div className="relative z-10 grid grid-cols-4 gap-12">
                   {Array.from({ length: 12 }).map((_, i) => (
                       <motion.div 
                        key={i}
                        animate={{ 
                            opacity: isPowerGated ? 0.1 : 1,
                            scale: isPowerGated ? 0.9 : 1,
                            borderColor: isPowerGated ? 'rgba(255,255,255,0.05)' : '#f59e0b'
                        }}
                        className="w-16 h-16 rounded-2xl border flex items-center justify-center transition-colors shadow-2xl"
                       >
                           <Activity size={24} className={isPowerGated ? 'opacity-0' : 'text-amber-500 animate-pulse'} />
                       </motion.div>
                   ))}
             </div>

             {/* HUD Readout */}
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-12 pb-2">
                 <div className="flex flex-col items-center">
                    <Thermometer size={16} className={isPowerGated ? 'text-white/20' : 'text-amber-500 animate-bounce'} />
                    <span className="text-sm font-mono mt-2 font-black italic">{isPowerGated ? '28°C' : '84°C'}</span>
                    <span className="micro-text opacity-20 uppercase">TJunction</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <BatteryLow size={16} className={isPowerGated ? 'text-amber-500' : 'text-white/20'} />
                    <span className="text-sm font-mono mt-2 font-black italic">{isPowerGated ? '4mW' : '1.2W'}</span>
                    <span className="micro-text opacity-20 uppercase">Consumption</span>
                 </div>
             </div>
        </div>
      </div>

      <div className="p-8 rounded-[30px] border border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <ShieldAlert size={16} />
                <h5 className="font-bold micro-text uppercase tracking-widest">Dark Silicon</h5>
              </div>
              <p className="text-xs opacity-40">Modern chips can't turn on all their transistors at once without melting. We must design with power-intent.</p>
          </div>
          <div className="space-y-2">
              <div className="flex items-center gap-2 text-plasma-cyan">
                <Zap size={16} />
                <h5 className="font-bold micro-text uppercase tracking-widest">Clock Gating</h5>
              </div>
              <p className="text-xs opacity-40">Verilog enables the automatic disabling of the clock tree for registers that are not updating.</p>
          </div>
          <div className="space-y-2">
              <div className="flex items-center gap-2 text-plasma-cyan font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <h5 className="font-bold micro-text uppercase tracking-widest text-green-500">Verification</h5>
              </div>
              <p className="text-xs opacity-40">Power-aware simulation ensures that gating doesn't break the reset or state logic of the chip.</p>
          </div>
      </div>
    </div>
  );
};
