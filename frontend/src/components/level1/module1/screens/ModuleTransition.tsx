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
    <div className="section-content relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] bg-white px-8" {...focusProps}>
      <div className="absolute inset-0 z-0" style={getDimStyle(false)}>
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-radial-gradient from-sky-400/20 to-transparent"
        />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] flex items-center justify-center opacity-10 blur-[2px]">
            <Oscilloscope 
                signalA={signal} 
                mode={isDigital ? 'digital' : 'analog'} 
                className={`w-full h-full scale-125 transition-all duration-1000 ${isDigital ? 'text-violet-500' : 'text-sky-500'}`} 
            />
        </div>

        <motion.div 
          animate={{ opacity: isDigital ? 0.3 : 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #0ea5e9 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl space-y-12">
        <div className="space-y-4">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 transition-all duration-1000 ${isDigital ? 'border-violet-500 bg-violet-50 shadow-xl shadow-violet-100/50' : 'border-sky-500 bg-sky-50 shadow-xl shadow-sky-100/50'}`}
            >
                <Zap className={`w-10 h-10 transition-colors duration-1000 ${isDigital ? 'text-violet-500' : 'text-sky-500'}`} />
            </motion.div>
            
            <motion.div
                animate={{ opacity: isDigital ? 1 : 0 }}
                className="text-[10px] font-mono text-violet-600 uppercase tracking-[0.5em] font-black"
            >
                Protocol Shift: Analog → Digital
            </motion.div>
        </div>

        <div className="space-y-6">
          <motion.h2 
            className="title-xl uppercase tracking-tighter leading-tight italic text-slate-900 font-black"
          >
            THE TRANSITION <br />
            <span className={isDigital ? 'text-violet-600' : 'text-sky-600'}>IS COMPLETE.</span>
          </motion.h2>

          <AnimatePresence mode="wait">
            {!isDigital ? (
                <motion.p
                    key="analog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="body italic text-slate-400 leading-relaxed font-mono text-xs font-bold"
                >
                    Capturing high-fidelity noise floor...
                </motion.p>
            ) : (
                <motion.p
                    key="digital"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="body font-bold text-violet-600 leading-relaxed px-8 italic"
                >
                    “This imperfect signal must now be controlled.”
                </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto" style={getDimStyle(false)}>
            <div className="glass-card p-4 border-slate-100 flex flex-col items-center gap-1 bg-white shadow-sm rounded-2xl">
                <Target size={14} className="text-sky-500 mb-1" />
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-slate-900">Accuracy</span>
                <span className="text-[10px] font-black text-sky-600">{memory?.performanceScore || 0}%</span>
            </div>
            <div className="glass-card p-4 border-slate-100 flex flex-col items-center gap-1 bg-white shadow-sm rounded-2xl">
                <AlertCircle size={14} className="text-rose-500 mb-1" />
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-slate-900">Errors</span>
                <span className="text-[10px] font-black text-rose-600">{memory?.totalMistakes || 0}</span>
            </div>
            <div className="glass-card p-4 border-slate-100 flex flex-col items-center gap-1 bg-white shadow-sm rounded-2xl">
                <Power size={14} className="text-emerald-500 mb-1" />
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-slate-900">Stability</span>
                <span className="text-[10px] font-black text-emerald-600">HIGH</span>
            </div>
        </div>

        <div className="flex justify-center pt-8">
          <VeriButton
            onClick={handleFinalize}
            variant={isDigital ? "logic" : "signal"}
            className="shadow-xl rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs"
          >
            INIT MOD_02 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </VeriButton>
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-12 flex justify-between items-center opacity-40 font-mono text-[8px] tracking-[0.4em] uppercase font-black text-slate-400" style={getDimStyle(false)}>
          <span>Signal_End: 0xFF</span>
          <div className="h-px flex-1 mx-8 bg-slate-200" />
          <span>Next_Module: SYSTEM_LOGIC</span>
      </div>
    </div>
  );
};

export default ModuleTransition;
