import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const InsightLock: React.FC<ScreenProps> = ({ onNext, triggerHaptic, playSound }) => {
  const { focusProps } = useAttentionLock();
  const handleContinue = () => {
    triggerHaptic?.('success');
    playSound?.('success');
    onNext?.();
  };

  return (
    <div className="section-content relative flex items-center justify-center bg-white" {...focusProps}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card max-w-lg w-full p-8 text-center space-y-8 relative overflow-hidden border-slate-200 bg-slate-50/50 shadow-xl rounded-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-40" />
        
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
            <Lock size={28} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="title-lg uppercase tracking-widest italic text-slate-900 font-black">LOOP CLOSED.</h2>
          <p className="body text-slate-500 font-medium">
            A signal is not just a movement of energy. It is a <span className="text-sky-600 font-bold uppercase tracking-widest">complete path</span>. 
          </p>
        </div>

        <div className="flex justify-center">
          <VeriButton
            onClick={handleContinue}
            variant="signal"
          >
            Continue <ArrowRight size={16} className="ml-2" />
          </VeriButton>
        </div>

        <div className="pt-2">
          <p className="text-[8px] font-mono text-slate-400 uppercase tracking-[0.4em] font-bold">
            Concept Locked // Module 1.4 Active
          </p>
        </div>
      </motion.div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] pointer-events-none" />
    </div>
  );
};

export default InsightLock;
