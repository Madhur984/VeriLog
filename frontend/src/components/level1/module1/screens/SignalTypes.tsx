import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenProps } from '../types';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { Network } from 'lucide-react';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const SignalTypes: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  currentHint 
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { focusProps } = useAttentionLock();

  const types = [
    { id: 'analog', label: 'Analog', desc: 'Infinite precision waves.', icon: 'sine', variant: 'signal' },
    { id: 'digital', label: 'Digital', desc: 'Binary encoded pulses.', icon: 'square', variant: 'logic' },
    { id: 'deterministic', label: 'Deterministic', desc: 'Mathematically exact.', icon: 'steps', variant: 'signal' },
    { id: 'random', label: 'Random', desc: 'Stochastic noise.', icon: 'noise', variant: 'secondary' },
    { id: 'periodic', label: 'Periodic', desc: 'Cycles that repeat.', icon: 'repeat', variant: 'signal' },
    { id: 'aperiodic', label: 'Aperiodic', desc: 'Transient events.', icon: 'once', variant: 'secondary' },
  ];

  const renderIcon = (type: string, isSelected: boolean) => {
    const color = isSelected ? 'currentColor' : 'rgba(255,255,255,0.2)';
    switch (type) {
      case 'sine': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
          <path d="M 10 50 Q 30 10 50 50 T 90 50" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
      case 'square': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
          <path d="M 10 70 L 10 30 L 50 30 L 50 70 L 90 70 L 90 30" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
      case 'steps': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
          <path d="M 10 80 L 30 80 L 30 60 L 50 60 L 50 40 L 70 40 L 70 20 L 90 20" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
      case 'noise': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
          <path d="M 10 50 L 20 20 L 30 80 L 40 40 L 50 60 L 60 10 L 70 90 L 80 30 L 90 50" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      );
      case 'repeat': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="4" strokeDasharray="10 5" />
           <path d="M 80 50 L 85 45 L 75 45 Z" fill={color} />
        </svg>
      );
      case 'once': return (
        <svg className="w-full h-full p-2" viewBox="0 0 100 100">
          <path d="M 10 80 L 40 80 L 50 20 L 60 80 L 90 80" fill="none" stroke={color} strokeWidth="4" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="section-content relative flex flex-col items-center !justify-start pt-24 min-h-[120vh]" {...focusProps}>
      {/* AI Hint Notification */}
      <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-0 z-50 glass-card p-3 border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] uppercase tracking-[0.2em] font-mono"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 space-y-2 text-center w-full">
        <h2 className="text-[var(--accent-primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">Taxonomy</h2>
        <h1 className="title-xl italic">SIX WAYS TO FLOW.</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {types.map((item) => (
          <VeriButton
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              triggerHaptic?.('light');
            }}
            variant={(selected === item.id ? item.variant : 'secondary') as any}
            className={`
              group relative p-6 aspect-square flex flex-col items-center justify-center gap-4 overflow-hidden h-auto
              ${selected === item.id ? 'shadow-[0_0_40px_rgba(0,229,255,0.1)]' : ''}
            `}
          >
            <div className={`w-16 h-16 transition-colors duration-300 ${selected === item.id ? 'text-black' : 'text-[var(--accent-primary)] opacity-40 group-hover:opacity-100'}`}>
                {renderIcon(item.icon, selected === item.id)}
            </div>
            
            <div className="text-center space-y-1">
                <h3 className={`font-bold text-[10px] uppercase tracking-widest transition-colors ${selected === item.id ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>{item.label}</h3>
                <AnimatePresence>
                    {selected === item.id && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-[8px] text-black/60 leading-tight font-mono px-2 normal-case"
                        >
                            {item.desc}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
          </VeriButton>
        ))}
      </div>

      <div className="w-full max-w-lg mt-12 pb-12">
          <KnowledgeCard 
            title="Classification Theory"
            description="Engineers classify signals to decide which mathematical tools to use for analysis."
            details="Knowing your signal's nature is the first step in filter design and system optimization."
            icon={Network}
          />
      </div>
    </div>
  );
};

export default SignalTypes;
