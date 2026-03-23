import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap, CheckCircle2 } from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const FinalInsight: React.FC<ScreenProps> = () => {
  const { focusProps } = useAttentionLock();
  const insights = [
    { text: "Signal is energy", icon: Zap },
    { text: "Signal is information", icon: Heart },
    { text: "Signal is control", icon: Brain },
    { text: "Signal returns to its source", icon: CheckCircle2 }
  ];

  return (
    <div className="section-content relative flex flex-col items-center justify-center bg-[#0A0F1C] overflow-hidden" {...focusProps}>
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-[var(--accent-primary)] animate-pulse" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-[var(--accent-secondary)] animate-ping" />
      </div>

      <div className="relative z-10 text-center space-y-24 max-w-4xl">
        <div className="space-y-6">
            <h2 className="text-[var(--accent-primary)] font-mono text-sm uppercase tracking-[0.8em] opacity-40">Conclusion</h2>
            <h1 className="text-6xl font-black text-[var(--text-primary)] italic uppercase tracking-tighter leading-none">
                You are a system<br />of <span className="text-[var(--accent-primary)]">signals.</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            {insights.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.2 }}
                    className="flex items-center gap-6 group"
                >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-primary)]/50 transition-all">
                        <item.icon className="text-[var(--accent-primary)]/40 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                    </div>
                    <span className="text-xl font-bold italic text-white/60 group-hover:text-white transition-colors">
                        {item.text}
                    </span>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="pt-12 border-t border-white/5"
        >
            <p className="text-sm font-mono text-white/20 uppercase tracking-[0.4em] leading-relaxed">
                Core Module 01 Summary Complete. <br /> Scroll to finalize system transition.
            </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FinalInsight;
