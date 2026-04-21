import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, MousePointer2, Share2 } from 'lucide-react';
import { ScreenProps } from '../types';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

const MEDIA = {
  COPPER: {
    name: 'Copper Wire',
    speed: 1,
    attenuation: 0.3,
    color: 'var(--accent-secondary)', // Purple for electrical
    description: 'Electrical signals. Moderate speed, high interference.'
  },
  FIBER: {
    name: 'Fiber Optic',
    speed: 1.5,
    attenuation: 0.05,
    color: 'var(--accent-primary)', // Cyan for light
    description: 'Light pulses. Ultra-fast, near-zero loss.'
  },
  AIR: {
    name: 'Wireless (Air)',
    speed: 1.2,
    attenuation: 0.6,
    color: '#F59E0B', // Warning Amber for wireless
    description: 'Radio waves. High mobility, rapid degradation.'
  }
};

export const SignalPropagation: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete
}) => {
  const [activeMedium, setActiveMedium] = useState<keyof typeof MEDIA>('COPPER');
  const [pulses, setPulses] = useState<{ id: number; x: number }[]>([]);
  const { focusProps } = useAttentionLock();

  const medium = MEDIA[activeMedium];

  const triggerPulse = () => {
    const id = Date.now();
    setPulses(prev => [...prev, { id, x: 0 }]);
    triggerHaptic?.('light');
    onInteractionComplete?.();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPulses((prev: { id: number; x: number }[]) => 
        prev
          .map(p => ({ ...p, x: p.x + (medium.speed * 2) }))
          .filter(p => p.x < 100)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [medium.speed]);

  return (
    <div className="section-content flex flex-col items-center justify-center space-y-12 h-full bg-white px-4" {...focusProps}>
      <div className="text-center space-y-4">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Mediums</h2>
        <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">SIGNALS IN MOTION</h1>
        <p className="body max-w-lg text-slate-500 mx-auto font-medium">A signal doesn't just exist; it travels. The medium dictates the rules of the journey.</p>
      </div>

      <div className="w-full max-w-4xl glass-card p-12 relative overflow-hidden bg-slate-50/50 border-slate-200 shadow-sm rounded-3xl">
        <div className="absolute inset-0 bg-grid-slate-900/[0.02]" />
        
        {/* Propagation Track */}
        <div className="relative h-24 w-full flex items-center justify-center">
            {/* The "Wire" */}
            <div 
                className="absolute w-full h-1 rounded-full opacity-10"
                style={{ backgroundColor: medium.color }}
            />
            <motion.div 
                className="absolute w-full h-1 rounded-full blur-[2px]"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ backgroundColor: medium.color }}
            />

            {/* Pulses */}
            {pulses.map(pulse => (
                <motion.div
                    key={pulse.id}
                    className="absolute w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2"
                    style={{ 
                        left: `${pulse.x}%`,
                        backgroundColor: medium.color,
                        boxShadow: `0 0 20px ${medium.color}`,
                        opacity: 1 - (pulse.x / 100) * medium.attenuation
                    }}
                >
                    <Zap size={8} className="text-white" />
                </motion.div>
            ))}

            {/* Start/End Gates */}
            <div className="absolute left-0 h-8 w-1 bg-slate-200 rounded-full" />
            <div className="absolute right-0 h-8 w-1 bg-slate-200 rounded-full" />
        </div>

        {/* Medium Selection */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {(Object.keys(MEDIA) as Array<keyof typeof MEDIA>).map((key) => {
                const m = MEDIA[key];
                const isActive = activeMedium === key;
                return (
                    <VeriButton
                        key={key}
                        onClick={() => {
                            setActiveMedium(key);
                            triggerHaptic?.('micro');
                        }}
                        variant={isActive ? (key === 'COPPER' ? 'logic' : 'signal') : 'secondary'}
                        className={`p-4 h-auto flex flex-col items-start gap-1 transition-all duration-300 ${isActive ? 'shadow-md ring-2 ring-offset-2 ring-sky-500/20' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-center w-full mb-1">
                            <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                {m.name}
                            </span>
                        </div>
                        <p className={`text-[8px] leading-relaxed text-left font-mono normal-case font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {m.description}
                        </p>
                    </VeriButton>
                );
            })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <VeriButton
            onClick={triggerPulse}
            variant="primary"
            className="px-8 !rounded-full bg-slate-900 !text-white hover:bg-slate-800 transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
            <MousePointer2 size={12} className="mr-2" />
            Inject Signal Pulse
        </VeriButton>
        <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-slate-400 font-bold">
            Observe attenuation and latency over distance
        </span>
      </div>

      <div className="w-full max-w-2xl mt-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <KnowledgeCard 
            title="Medium & Velocity"
            description="Signals travel at different speeds depending on the physical medium."
            details="In Copper or Fiber, it's slower than light in a vacuum. Attenuation is the loss of signal strength over distance, which is why we need repeaters in long-distance cables!"
            icon={Share2}
            className="bg-white border-slate-200 shadow-sm"
          />
          <KnowledgeCard 
            title="Timing & Capture"
            description="Capturing a signal is like photographing a jumping frog."
            details="If you snap the camera *during* the jump, the image is a blur (Metastability). Digital elements require a specific 'aperture time' (Setup & Hold) to capture a clear signal."
            icon={Zap}
            className="bg-sky-50 border-sky-100 shadow-sm"
          />
      </div>
    </div>
  );
};

export default SignalPropagation;
