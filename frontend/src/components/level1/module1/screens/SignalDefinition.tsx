import React, { useState } from 'react';
import { ScreenProps } from '../types';
import { Oscilloscope } from '../shared/Oscilloscope';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { LiveMetricsHUD } from '../shared/LiveMetricsHUD';
import { SignalAudioEngine } from '../shared/SignalAudioEngine';
import { Activity, Cpu, Volume2, VolumeX, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VeriSlider } from '../../../shared/VeriSlider';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const SignalDefinition: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete, 
  currentHint,
  memory,
  updateSignal
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps } = useAttentionLock();
  
  const signal = memory?.userSignal || { amplitude: 0.5, frequency: 2, noise: 0 };

  return (
    <div className="section-content flex flex-col items-center justify-center space-y-12 relative" {...focusProps}>
      <div className="text-center space-y-4">
        <h2 className="text-[var(--accent-primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">Architecture</h2>
        <h1 className="title-xl italic">WHAT MAKES A SIGNAL?</h1>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visualizer Card */}
        <div className="glass-card aspect-video flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-20">
              <div className="flex items-center gap-2 opacity-30">
                <Cpu size={14} />
                <span className="text-[8px] font-mono uppercase tracking-widest text-white">V-OS Core // Signal Layer</span>
              </div>
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`flex items-center gap-2 px-3 py-1 mt-2 rounded border text-[8px] font-mono uppercase tracking-widest transition-all ${audioEnabled ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black' : 'bg-black/40 border-white/5 text-white/40'}`}
              >
                {audioEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
                {audioEnabled ? 'Audio Live' : 'Muted'}
              </button>
          </div>
          
          <AnimatePresence mode="wait">
            {predictionMode ? (
              <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#070B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
              >
                <BrainCircuit className="text-[var(--accent-primary)] w-12 h-12 mb-4 animate-pulse" />
                <h3 className="text-sm font-mono uppercase tracking-[0.3em] mb-2">Observation Strategy</h3>
                <p className="body text-white/60 text-xs max-w-xs mb-6">Signals represent energy changes. Predict how increasing **Amplitude** will affect the wave before activating the reveal.</p>
                <button 
                  onClick={() => {
                    setPredictionMode(false);
                    triggerHaptic?.('heavy');
                  }}
                  className="px-6 py-2 rounded-full border border-[var(--accent-primary)] text-[var(--accent-primary)] text-[10px] uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-black transition-all"
                >
                  Confirm & Reveal
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Oscilloscope 
            signalA={signal} 
            propagationDelay={300}
            className="w-full h-full px-12"
          />

          <LiveMetricsHUD 
            signal={signal} 
            className="absolute top-4 right-4 scale-75 origin-top-right transition-opacity group-hover:opacity-100 opacity-60" 
          />
        </div>

        {/* Controls Card */}
        <div className="space-y-8 glass-card p-10 !bg-white/5 relative overflow-hidden">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4 border-b border-white/5 pb-2">Component Forge</h3>
          
          <div className="space-y-4 group relative">
             <div className={`
                absolute -inset-4 rounded-xl transition-all duration-500 pointer-events-none
                ${currentHint?.type === 'pulse' ? 'bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 scale-105' : 'bg-transparent'}
             `} />

            <VeriSlider 
                label="Amplitude (Voltage Peak)"
                min={0}
                max={1}
                step={0.01}
                value={signal.amplitude}
                onChange={(val) => {
                    triggerHaptic?.('micro');
                    updateSignal?.({ amplitude: val });
                    onInteractionComplete?.();
                    if (predictionMode) setPredictionMode(false);
                }}
                variant="signal"
            />
          </div>

          <div className="space-y-4">
            <VeriSlider 
                label="Noise (EMI Disturbance)"
                min={0}
                max={1}
                step={0.01}
                value={signal.noise || 0}
                onChange={(val) => {
                    triggerHaptic?.('micro');
                    updateSignal?.({ noise: val });
                }}
                variant="signal"
            />
          </div>
        </div>
      </div>

      <SignalAudioEngine signal={signal} enabled={audioEnabled} />

      {/* Theory Overlay */}
      <div className="w-full max-w-lg mt-8">
          <KnowledgeCard 
            title="Voltage over Time"
            description="In electronics, a signal is a time-varying voltage or current that conveys information."
            details="Whether it's the music from your speakers or the data in your CPU, everything is represented as changes in electromagnetic energy over time. These changes are defined by parameters like Amplitude (Strength) and Frequency (Speed)."
            icon={Activity}
          />
      </div>
    </div>
  );
};

export default SignalDefinition;
