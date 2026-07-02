import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BrainCircuit } from 'lucide-react';
import { ScreenProps } from '../types';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const SignalFeel: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete,
  currentHint
}) => {
  const [interactionState, setInteractionState] = useState<'idle' | 'tapping' | 'holding' | 'modulating'>('idle');
  const [intensity, setIntensity] = useState(0);
  const [hasCreated, setHasCreated] = useState(false);
  const [predictionMode, setPredictionMode] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { focusProps } = useAttentionLock();
  
  const holdTimer = useRef<any>(null);

  const handleMouseDown = () => {
    if (predictionMode) return;
    setInteractionState('tapping');
    triggerHaptic?.('light');

    holdTimer.current = setTimeout(() => {
        setInteractionState('holding');
        triggerHaptic?.('tension');
    }, 400);
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (interactionState === 'holding' || interactionState === 'modulating') {
        setInteractionState('modulating');
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const dist = Math.abs(clientX - (rect.left + rect.width / 2));
            const newIntensity = Math.min(dist / (rect.width / 2), 1);
            setIntensity(newIntensity);
            
            if (newIntensity > 0.8 && !hasCreated) {
                setHasCreated(true);
                triggerHaptic?.('success');
                onInteractionComplete?.();
            }
        }
    }
  }, [interactionState, hasCreated, triggerHaptic, onInteractionComplete]);

  const handleMouseUp = () => {
    clearTimeout(holdTimer.current);
    if (interactionState === 'modulating' && intensity > 0.5) {
        triggerHaptic?.('light');
    }
    setInteractionState('idle');
    setIntensity(0);
  };

  useEffect(() => {
    if (interactionState === 'modulating') {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
    };
  }, [interactionState, handleMouseMove]);

  return (
    <div ref={containerRef} className="section-content relative min-h-[500px] flex flex-col items-center justify-center select-none overflow-hidden bg-white" {...focusProps}>
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

        <div className="flex flex-col gap-6 items-center text-center w-full z-10 pointer-events-none">
            <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Entry Hook</h2>
            <h1 className="title-xl max-w-2xl bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent italic font-black">
                {hasCreated ? "ENERGY TRANSFORMED." : "SIGNAL IS LIFE."}
            </h1>
            <p className="body max-w-lg font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                {hasCreated ? "Information stabilized. System ready." : "Interaction begins with a single discharge."}
            </p>
        </div>

        <div 
            className="relative mt-20 w-80 h-80 flex items-center justify-center cursor-pointer interactive"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            <AnimatePresence mode="wait">
                {predictionMode ? (
                <motion.div 
                    key="prediction"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center p-8 text-center rounded-full shadow-2xl border border-slate-100"
                >
                    <BrainCircuit className="text-sky-600 w-10 h-10 mb-4 animate-pulse" />
                    <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2 text-slate-800 font-bold">Conscious Input</h3>
                    <p className="body text-slate-500 text-[10px] max-w-xs mb-6 font-medium">Signals are not just pulses; they are modulated energy. Can you feel the tension before the strike?</p>
                    <VeriButton 
                        variant="signal"
                        onClick={() => {
                            setPredictionMode(false);
                            triggerHaptic?.('heavy');
                        }}
                    >
                        Initiate Pulse
                    </VeriButton>
                </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Background Glows */}
            <motion.div 
                animate={{ 
                    scale: interactionState !== 'idle' ? 1.5 + intensity : 1,
                    opacity: interactionState !== 'idle' ? 0.3 + intensity * 0.3 : 0.05
                }}
                className="absolute inset-0 bg-sky-400 rounded-full blur-[80px] pointer-events-none"
            />

            {/* Core Interaction Zone */}
            <motion.div
                animate={{ 
                    scale: interactionState === 'tapping' ? 0.95 : interactionState === 'holding' ? 1.1 : 1,
                    borderColor: interactionState !== 'idle' ? '#0ea5e9' : 'rgba(15, 23, 42, 0.1)'
                }}
                className="w-48 h-48 rounded-full border-2 border-dashed flex items-center justify-center relative bg-slate-50 shadow-inner"
            >
                <Zap 
                    className={`transition-all duration-300 ${interactionState !== 'idle' ? 'text-sky-500 scale-125 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'text-slate-200'}`}
                    size={hasCreated ? 48 : 32}
                />
            </motion.div>

            {/* Instruction Overlay */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full text-center">
                <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-slate-400 font-bold whitespace-nowrap">
                    {interactionState === 'idle' ? "Tap to Pulse // Hold to Stabilize" : "Energy Peak Approaching"}
                </span>
            </div>
        </div>
    </div>
  );
};

export default SignalFeel;
