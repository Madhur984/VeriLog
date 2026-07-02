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
    <div className="section-content relative bg-white" {...focusProps}>
       {/* AI Hint Notification */}
       <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 z-50 glass-card p-3 border-sky-200 bg-white/90 text-sky-600 text-[10px] uppercase tracking-[0.2em] font-mono shadow-lg"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 space-y-4 text-left px-4">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Semantic Layer</h2>
        <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">FROM PULSE TO PURPOSE.</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 relative px-4">
        <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-100 shadow-2xl"
            >
                <Lightbulb className="text-sky-600 w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2 text-slate-800 font-bold">Hierarchy of Information</h3>
                <p className="body text-slate-500 text-[10px] max-w-xs mb-6 font-medium">Can a raw voltage spike carry the weight of a human emotion? Predict the chain of translation.</p>
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
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-slate-100" />
            )}
            
            <div className={`p-6 glass-card flex flex-col items-center text-center gap-4 border-slate-200 transition-all shadow-sm ${revealed || i === 0 ? 'bg-slate-50' : 'bg-white'} hover:border-sky-400/50 hover:bg-sky-50/30`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${revealed || i === 0 ? 'bg-sky-600 text-white border-transparent shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                {React.cloneElement(step.icon as React.ReactElement, { size: 24 })}
              </div>
              <div>
                <h3 className={`font-bold text-sm mb-1 ${revealed || i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</h3>
                <p className={`text-[8px] leading-relaxed font-mono uppercase tracking-wider font-bold ${revealed || i === 0 ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!revealed && !predictionMode ? (
        <div className="relative mt-12 w-full flex justify-start px-4">
          <VeriButton
            onClick={handleReveal}
            variant="signal"
            className={currentHint?.type === 'pulse' ? 'shadow-[0_0_30px_rgba(14,165,233,0.2)]' : ''}
          >
            Decode Signal
          </VeriButton>
        </div>
      ) : revealed ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 p-6 rounded-2xl border border-dashed border-slate-200 max-w-2xl text-left bg-slate-50/50 ml-4"
        >
          <p className="body italic text-slate-600 font-medium">
            "A signal without context is just noise. Adding meaning is what transforms a simple wire into a <span className="text-sky-600 font-bold uppercase tracking-widest">Nerve</span>."
          </p>
        </motion.div>
      ) : null}
    </div>
  );
};
