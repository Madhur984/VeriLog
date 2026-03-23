import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Terminal, ChevronDown } from 'lucide-react';
import { ScreenProps } from '../types';

export const SystemBoot: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  playSound, 
  currentHint 
}) => {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      triggerHaptic?.('boot');
      playSound?.('success' as any);
      
      const timer = setTimeout(() => {
        setBootComplete(true);
        triggerHaptic?.('success');
      }, 5000);
      
      return () => clearTimeout(timer);
    };
    
    sequence();
  }, [triggerHaptic, playSound]);

  return (
    <div className="section-content relative flex flex-col items-center justify-center bg-[#070B14] overflow-hidden w-full h-full">
      {/* Background Pulse */}
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-radial-gradient from-[var(--accent-primary)]/10 to-transparent pointer-events-none"
      />

      {/* AI Hint Notification */}
      <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 glass-card p-3 border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] uppercase tracking-[0.2em] font-mono z-50"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-12">
        <div className="relative">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-32 h-32 rounded-full border border-white/5 border-t-[var(--accent-primary)]"
            />
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Zap className="text-[var(--accent-primary)] w-10 h-10 drop-shadow-[0_0_15px_var(--accent-primary)]" />
            </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-3 text-[var(--accent-primary)]"
            >
                <Terminal size={14} className="opacity-60" />
                <span className="text-[12px] font-mono font-black uppercase tracking-[0.5em] animate-pulse">
                    {bootComplete ? 'Neural Link Established' : 'Initializing Neural Link'}
                </span>
            </motion.div>

            <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                    className="h-full bg-[var(--accent-primary)]"
                />
            </div>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.5 }}
                className="text-[8px] font-mono uppercase tracking-widest"
            >
                Core Integrity: 100% | Latency: 4ms
            </motion.p>
        </div>
      </div>

      {/* Scroll to Begin Indicator */}
      <AnimatePresence>
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[var(--accent-primary)] animate-pulse">
              Scroll to Begin ↓
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={20} className="text-[var(--accent-primary)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemBoot;
