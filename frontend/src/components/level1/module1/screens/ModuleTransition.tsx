import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, ArrowRight, Zap, Target, AlertCircle } from 'lucide-react';
import { ScreenProps } from '../types';
import { Oscilloscope } from '../shared/Oscilloscope';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const ModuleTransition: React.FC<ScreenProps & { onInitialize: () => void }> = ({ 
  onInitialize, 
  triggerHaptic, 
  playSound,
  memory
}) => {
  const [isDigital, setIsDigital] = useState(false);
  const { focusProps, getDimStyle } = useAttentionLock();
  const signal = memory?.userSignal || { amplitude: 0.5, frequency: 2, samplingRate: 20 };

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsDigital(true);
        triggerHaptic?.('success');
    }, 2000);
    return () => clearTimeout(timer);
  }, [triggerHaptic]);

  const handleFinalize = () => {
    triggerHaptic?.('heavy');
    playSound?.('tension');
    
    const transitionData = {
        signalState: signal,
        performanceScore: memory?.performanceScore || 85,
        mistakes: memory?.totalMistakes || 0,
        timestamp: Date.now()
    };
    
    console.log("[V-OS] Preparing Module 2 with context:", transitionData);
    onInitialize?.();
  };

  return (
    <div className="section-content relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]" {...focusProps}>
      <div className="absolute inset-0 z-0" style={getDimStyle(false)}>
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-radial-gradient from-[var(--accent-secondary)]/10 to-transparent"
        />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] flex items-center justify-center opacity-20 blur-[2px]">
            <Oscilloscope 
                signalA={signal} 
                mode={isDigital ? 'digital' : 'analog'} 
                className={`w-full h-full scale-125 transition-all duration-1000 ${isDigital ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}`} 
            />
        </div>

        <motion.div 
          animate={{ opacity: isDigital ? 0.4 : 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, var(--accent-secondary-alpha) 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }} 
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl space-y-12">
        <div className="space-y-4">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 transition-all duration-1000 ${isDigital ? 'border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10 shadow-[0_0_40px_var(--accent-secondary-alpha)]' : 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'}`}
            >
                <Zap className={`w-10 h-10 transition-colors duration-1000 ${isDigital ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}`} />
            </motion.div>
            
            <motion.div
                animate={{ opacity: isDigital ? 1 : 0 }}
                className="text-[8px] font-mono text-[var(--accent-secondary)] uppercase tracking-[0.5em] font-bold"
            >
                Protocol Shift: Analog → Digital
            </motion.div>
        </div>

        <div className="space-y-6">
          <motion.h2 
            className="title-xl uppercase tracking-widest leading-tight italic"
          >
            THE TRANSITION <br />
            <span className={isDigital ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}>IS COMPLETE.</span>
          </motion.h2>

          <AnimatePresence mode="wait">
            {!isDigital ? (
                <motion.p
                    key="analog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="body italic opacity-60 leading-relaxed font-mono text-xs"
                >
                    Capturing high-fidelity noise floor...
                </motion.p>
            ) : (
                <motion.p
                    key="digital"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="body font-bold text-[var(--accent-secondary)] leading-relaxed px-8 italic"
                >
                    “This imperfect signal must now be controlled.”
                </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto opacity-40" style={getDimStyle(false)}>
            <div className="glass-card p-3 border-none flex flex-col items-center gap-1 bg-white/5">
                <Target size={12} className="text-[var(--accent-primary)]" />
                <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-[#E3F2FD]">Accuracy: {memory?.performanceScore || 0}%</span>
            </div>
            <div className="glass-card p-3 border-none flex flex-col items-center gap-1 bg-white/5">
                <AlertCircle size={12} className="text-[var(--error)]" />
                <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-[#E3F2FD]">Errors: {memory?.totalMistakes || 0}</span>
            </div>
            <div className="glass-card p-3 border-none flex flex-col items-center gap-1 bg-white/5">
                <Power size={12} className="text-[var(--success)]" />
                <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-[#E3F2FD]">Stability: HIGH</span>
            </div>
        </div>

        <div className="flex justify-center pt-8">
          <VeriButton
            onClick={handleFinalize}
            variant={isDigital ? "logic" : "signal"}
            className="shadow-xl"
          >
            INIT MOD_02 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </VeriButton>
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-12 flex justify-between items-center opacity-20 font-mono text-[7px] tracking-widest uppercase" style={getDimStyle(false)}>
          <span>Signal_End: 0xFF</span>
          <div className="h-px flex-1 mx-8 bg-white/10" />
          <span>Next_Module: SYSTEM_LOGIC</span>
      </div>
    </div>
  );
};

export default ModuleTransition;
