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
    <div className="section-content relative flex items-center justify-center" {...focusProps}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card max-w-lg w-full p-8 text-center space-y-8 relative overflow-hidden border-white/5"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
        
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <Lock size={28} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="title-lg uppercase tracking-widest italic">LOOP CLOSED.</h2>
          <p className="body text-white/60">
            A signal is not just a movement of energy. It is a <span className="text-[var(--accent-primary)] font-bold uppercase tracking-widest">complete path</span>. 
          </p>
        </div>

        <div className="flex justify-center">
          <VeriButton
            onClick={handleContinue}
            variant="signal"
          >
            Continue <ArrowRight size={16} />
          </VeriButton>
        </div>

        <div className="pt-2">
          <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
            Concept Locked // Module 1.4 Active
          </p>
        </div>
      </motion.div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
    </div>
  );
};

export default InsightLock;
