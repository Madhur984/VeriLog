import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Zap, MessageSquare, Lightbulb } from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const SignalMeaning: React.FC<ScreenProps> = ({ triggerHaptic, currentHint }) => {
  const [revealed, setRevealed] = useState(false);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps, getDimStyle } = useAttentionLock();

  const steps = [
    { icon: <Zap />, label: "Response", desc: "Raw electrical impulse" },
    { icon: <MessageSquare />, label: "Pattern", desc: "Recognizable structure" },
    { icon: <Brain />, label: "Context", desc: "Environmental relevance" },
    { icon: <Heart />, label: "Meaning", desc: "Actionable information" },
  ];

  const handleReveal = () => {
    setRevealed(true);
    triggerHaptic?.('success');
  };

  return (
    <div className="section-content relative" {...focusProps}>
       {/* AI Hint Notification */}
       <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 z-50 glass-card p-3 border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] uppercase tracking-[0.2em] font-mono"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 space-y-4 text-left">
        <h2 className="text-[var(--accent-primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">Semantic Layer</h2>
        <h1 className="title-xl italic">FROM PULSE TO PURPOSE.</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#070B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-white/5"
            >
                <Lightbulb className="text-[var(--accent-primary)] w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Hierarchy of Information</h3>
                <p className="body text-white/50 text-[10px] max-w-xs mb-6">Can a raw voltage spike carry the weight of a human emotion? Predict the chain of translation.</p>
                <VeriButton 
                    variant="signal"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                >
                    Initialize Semantic Chain
                </VeriButton>
            </motion.div>
            ) : null}
        </AnimatePresence>

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            style={getDimStyle(!revealed && i > 0)}
            className={`group relative transition-opacity duration-500 ${!revealed && i > 0 ? 'opacity-20 grayscale' : ''}`}
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-white/10" />
            )}
            
            <div className="p-6 glass-card flex flex-col items-center text-center gap-4 border-white/5 hover:border-[var(--accent-primary)]/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                {React.cloneElement(step.icon as React.ReactElement, { size: 24 })}
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-sm mb-1">{step.label}</h3>
                <p className="text-[8px] text-white/40 leading-relaxed font-mono uppercase tracking-wider">{step.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!revealed && !predictionMode ? (
        <div className="relative mt-12 w-full flex justify-start">
          <VeriButton
            onClick={handleReveal}
            variant="signal"
            className={currentHint?.type === 'pulse' ? 'shadow-[0_0_30px_rgba(0,229,255,0.2)]' : ''}
          >
            Decode Signal
          </VeriButton>
        </div>
      ) : revealed ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 p-6 rounded-2xl border border-dashed border-white/10 max-w-2xl text-left"
        >
          <p className="body italic text-white/60">
            "A signal without context is just noise. Adding meaning is what transforms a simple wire into a <span className="text-[var(--accent-primary)] font-bold uppercase tracking-widest">Nerve</span>."
          </p>
        </motion.div>
      ) : null}
    </div>
  );
};
