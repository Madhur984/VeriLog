import React, { useState } from 'react';
import { RotateCcw, BrainCircuit } from 'lucide-react';
import { ScreenProps } from '../types';
import { Oscilloscope } from '../shared/Oscilloscope';
import { VeriSlider } from '../../../shared/VeriSlider';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { motion, AnimatePresence } from 'framer-motion';

export const SignalTransform: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  memory,
  updateSignal
}) => {
  const [scale, setScale] = useState(1);
  const [shift, setShift] = useState(0);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps } = useAttentionLock();

  const baseSignal = memory?.userSignal || { amplitude: 0.5, frequency: 2, phase: 0, noise: 0 };
  
  const transformedSignal = {
    ...baseSignal,
    frequency: baseSignal.frequency * scale,
    phase: baseSignal.phase + shift * 180 
  };

  return (
    <div className="section-content flex flex-col items-center justify-center space-y-12 bg-white" {...focusProps}>
        <div className="text-center space-y-4">
            <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Manipulation</h2>
            <h1 className="title-xl italic text-slate-900">TRANSFORM THE WAVE.</h1>
            <p className="body max-w-lg text-slate-500 mx-auto">Signals aren't static. We stretch them, shift them, and invert them to carry information.</p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="glass-card aspect-video flex items-center justify-center relative overflow-hidden group border-slate-200 bg-white shadow-lg">
                <div className="absolute inset-0 bg-grid-slate-900/[0.02]" />
                
                <AnimatePresence mode="wait">
                    {predictionMode ? (
                    <motion.div 
                        key="prediction"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl shadow-xl"
                    >
                        <BrainCircuit className="text-indigo-500 w-12 h-12 mb-4 animate-pulse" />
                        <h3 className="text-sm font-mono uppercase tracking-[0.3em] mb-2 text-slate-800">Phase Prediction</h3>
                        <p className="body text-slate-500 text-xs max-w-xs mb-6">Phase Shift moves a signal in time. Predict which direction a positive shift will move the wave.</p>
                        <VeriButton 
                            variant="secondary"
                            onClick={() => {
                                setPredictionMode(false);
                                triggerHaptic?.('heavy');
                            }}
                        >
                            Reveal Transformation
                        </VeriButton>
                    </motion.div>
                    ) : null}
                </AnimatePresence>

                <Oscilloscope 
                    signalA={transformedSignal} 
                    propagationDelay={400}
                    className="w-full h-full"
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-30 font-mono text-[8px] uppercase">
                    <span className="text-sky-600">Transform Active</span>
                    <span className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
                </div>
            </div>

            <div className="space-y-6 glass-card p-10 !bg-slate-50 relative overflow-hidden border-slate-200 shadow-sm">
                <VeriSlider 
                    label="Frequency Scale (Stretch)"
                    min={0.5}
                    max={4}
                    step={0.1}
                    value={scale}
                    onChange={(val) => {
                        setScale(val);
                        triggerHaptic?.('micro');
                        updateSignal?.({ frequency: baseSignal.frequency * val });
                        if (predictionMode) setPredictionMode(false);
                    }}
                    variant="signal"
                />

                <VeriSlider 
                    label="Phase Shift (Time Offset)"
                    min={-1}
                    max={1}
                    step={0.05}
                    value={shift}
                    unit="°"
                    onChange={(val) => {
                        setShift(val);
                        triggerHaptic?.('micro');
                        updateSignal?.({ phase: baseSignal.phase + val * 180 });
                        if (predictionMode) setPredictionMode(false);
                    }}
                    variant="logic"
                />

                <VeriButton 
                  onClick={() => { setScale(1); setShift(0); playTargetSound(); triggerHaptic?.('medium'); }}
                  variant="ghost"
                  className="w-full mt-4 bg-white border-slate-100 shadow-xs"
                >
                  <RotateCcw size={14} className="mr-2" /> Reset Transformation
                </VeriButton>
            </div>
        </div>
    </div>
  );
};

const playTargetSound = () => { /* Wrapper if needed or passed from props */ };

export default SignalTransform;
