import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Cpu, Database, RefreshCw, Zap, Binary } from 'lucide-react';
import { ScreenProps } from '../types';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const SignalProcessing: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  playSound
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps, getDimStyle } = useAttentionLock();

  const steps = [
    { title: 'Analog', icon: Zap, color: '#00E5FF', desc: 'Real-world continuous signal' },
    { title: 'ADC', icon: RefreshCw, color: '#FFD740', desc: 'Analog to Digital conversion' },
    { title: 'Digital', icon: Database, color: '#7C4DFF', desc: 'Data in memory / CPU' },
    { title: 'Processing', icon: Cpu, color: '#FF7043', desc: 'Algorithms & Logic' },
    { title: 'DAC', icon: RefreshCw, color: '#00E5FF', desc: 'Digital to Analog conversion' }
  ];

  return (
    <div className="section-content relative flex flex-col items-center !justify-center bg-[#0A0F1C]" {...focusProps}>
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-[#00E5FF] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">System Flow</h2>
        <h1 className="title-xl italic">BRIDGING WORLDS.</h1>
        <p className="body opacity-60 max-w-lg mx-auto">Analyze the transformation layer from physics to logic.</p>
      </div>

      <div className="w-full max-w-5xl flex items-center justify-center gap-4 relative py-12">
        <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#070B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-white/5"
            >
                <Binary className="text-[var(--accent-primary)] w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2">The Digital Bridge</h3>
                <p className="body text-white/50 text-[10px] max-w-xs mb-6">How does a wave become a number, and a number become an action? Predict the conversion stages.</p>
                <VeriButton 
                    variant="signal"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                >
                    Initialize Bridge
                </VeriButton>
            </motion.div>
            ) : null}
        </AnimatePresence>

        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <motion.div
              onClick={() => { 
                if (predictionMode) return;
                setActiveStep(idx); 
                triggerHaptic?.('light'); 
                playSound?.('snap' as any); 
              }}
              whileHover={!predictionMode ? { y: -5 } : {}}
              style={getDimStyle(false)}
              className={`relative flex flex-col items-center gap-6 p-6 rounded-3xl border transition-all cursor-pointer min-w-[140px] ${activeStep === idx ? 'bg-white/5 border-white/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
              animate={activeStep === idx ? { scale: 1.05 } : { scale: 1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color: step.color }}>
                <step.icon size={24} className={activeStep === idx ? 'animate-pulse' : ''} />
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold font-mono uppercase tracking-widest text-white/50">{step.title}</div>
              </div>
              
              <AnimatePresence>
                {activeStep === idx && !predictionMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 text-center"
                  >
                    <p className="text-[10px] font-mono text-white/30 italic leading-relaxed">{step.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px bg-white/10" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-40 w-full max-w-md bg-[#00E5FF]/5 border border-[#00E5FF]/10 p-6 rounded-2xl flex items-center gap-4" style={getDimStyle(false)}>
          <ArrowRightLeft className="text-[#00E5FF] shrink-0" size={18} />
          <p className="text-[9px] text-[#00E5FF]/60 font-mono tracking-wider italic uppercase leading-relaxed">
            From the continuous flow of the physical world to the discrete steps of logic gates—the conversion determines fidelity.
          </p>
      </div>
    </div>
  );
};

export default SignalProcessing;
