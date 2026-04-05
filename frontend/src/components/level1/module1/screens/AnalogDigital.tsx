import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Volume2, VolumeX, Zap, BrainCircuit } from 'lucide-react';
import { ScreenProps } from '../types';
import { Oscilloscope } from '../shared/Oscilloscope';
import { KnowledgeCard } from '../shared/KnowledgeCard';
import { LiveMetricsHUD } from '../shared/LiveMetricsHUD';
import { SignalLabControls } from '../shared/SignalLabControls';
import { SignalAudioEngine } from '../shared/SignalAudioEngine';
import { RealWorldInsight } from '../shared/RealWorldInsight';
import { useChallengeEngine } from '../../../../hooks/useChallengeEngine';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const AnalogDigital: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete, 
  currentHint,
  memory,
  updateSignal
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [time, setTime] = useState(0);
  const [predictionMode, setPredictionMode] = useState(true);
  const { focusProps } = useAttentionLock();

  const signal = memory?.userSignal || { 
    amplitude: 0.5, 
    frequency: 2, 
    samplingRate: 20,
    bitDepth: 4,
    noise: 0
  };

  const targetSignal = { amplitude: 0.8, frequency: 5, phase: 0 };
  const { score, isSuccess } = useChallengeEngine({ 
    userSignal: signal, 
    targetSignal: (memory?.activeMission ? targetSignal : null) 
  });

  const handleUpdate = (updates: any) => {
    updateSignal?.(updates);
    onInteractionComplete?.();
    if (predictionMode) setPredictionMode(false);
  };

  const handlePreset = (type: string) => {
    triggerHaptic?.('heavy');
    if (type === 'pure') handleUpdate({ frequency: 2, amplitude: 0.6, noise: 0, samplingRate: 100, bitDepth: 8 });
    if (type === 'aliased') handleUpdate({ frequency: 8, amplitude: 0.7, noise: 0, samplingRate: 12, bitDepth: 8 });
    if (type === 'noisy') handleUpdate({ noise: 0.4, amplitude: 0.5 });
    if (type === 'retro') handleUpdate({ bitDepth: 2, samplingRate: 20, frequency: 3 });
  };

  return (
    <div className="section-content relative flex flex-col items-center justify-center space-y-8 bg-white" {...focusProps}>
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

      <div className="mb-8 space-y-4 text-left w-full">
        <h2 className="text-sky-600 font-mono text-[10px] uppercase tracking-[0.5em] opacity-60">Classification</h2>
        <h1 className="title-xl italic text-slate-900 font-black tracking-tighter">NATURE VS. LOGIC.</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl h-[360px] mb-12 relative">
        <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-left text-[8px] font-mono uppercase tracking-[0.4em] text-slate-400 font-bold">Continuous Source (Analog)</h3>
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl relative overflow-hidden group shadow-sm">
                <Oscilloscope 
                  signalA={signal} 
                  mode={memory?.activeMission ? 'challenge' : 'analog'} 
                  targetSignal={targetSignal}
                  isFrozen={isFrozen}
                  timeScrub={time}
                  className="w-full h-full" 
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-50/40 to-transparent pointer-events-none" />
            </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 relative">
            <h3 className="text-left text-[8px] font-mono uppercase tracking-[0.4em] text-indigo-500 font-bold">Discrete Model (Digital)</h3>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group shadow-sm">
                <AnimatePresence mode="wait">
                    {predictionMode ? (
                    <motion.div 
                        key="prediction"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl"
                    >
                        <BrainCircuit className="text-indigo-500 w-10 h-10 mb-4 animate-pulse" />
                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] mb-2 text-slate-800 font-bold">Sampling Prediction</h3>
                        <p className="body text-slate-500 text-[10px] max-w-xs mb-6 font-medium">How many points per second do we need to reconstruct this smooth wave without losing its identity?</p>
                        <VeriButton 
                            variant="secondary"
                            onClick={() => {
                                setPredictionMode(false);
                                triggerHaptic?.('heavy');
                            }}
                        >
                            Activate ADC Model
                        </VeriButton>
                    </motion.div>
                    ) : null}
                </AnimatePresence>

                <Oscilloscope 
                  signalA={signal} 
                  mode="digital" 
                  isFrozen={isFrozen}
                  timeScrub={time}
                  propagationDelay={200}
                  className="w-full h-full" 
                />
            </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute -top-10 -right-4 flex flex-col gap-4 scale-90 origin-top-right z-20">
            <LiveMetricsHUD signal={signal} isDigital={true} className="!bg-white shadow-lg border-slate-100" />
            <RealWorldInsight 
                visible={signal.samplingRate < signal.frequency * 2} 
                type="aliasing" 
            />
            <RealWorldInsight 
                visible={signal.bitDepth < 3} 
                type="quantization" 
            />
        </div>
      </div>

      <SignalAudioEngine signal={signal} enabled={audioEnabled} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Lab Controls & Missions */}
        <div className="flex flex-col gap-6">
            <div className="glass-card p-6 !bg-slate-50 relative overflow-hidden border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 font-bold">Lab Experiments</h3>
                        <VeriButton 
                            variant={audioEnabled ? 'signal' : 'ghost'}
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`!p-2 w-10 h-10 ${!audioEnabled ? 'bg-white border-slate-100' : ''}`}
                        >
                            {audioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                        </VeriButton>
                    </div>
                </div>
                
                <SignalLabControls 
                    onPreset={handlePreset}
                    onTimeChange={setTime}
                    onFreeze={setIsFrozen}
                    isFrozen={isFrozen}
                    time={time}
                />
            </div>

            {/* Mission Interface */}
            <div className={`glass-card p-6 border-l-4 transition-all duration-500 shadow-sm ${isSuccess ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-2">
                        <Zap size={10} className={isSuccess ? 'text-sky-600 animate-pulse' : 'text-slate-300'} />
                        <span className={isSuccess ? 'text-sky-900 font-bold' : 'text-slate-400'}>Match the Source</span>
                    </span>
                    <span className={isSuccess ? 'text-sky-600 font-bold' : 'text-slate-400'}>
                        Accuracy: {score}%
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: `${score}%` }}
                        className={`h-full ${isSuccess ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-slate-300'}`}
                    />
                </div>
            </div>
        </div>

        {/* Theory Section */}
        <div className="space-y-6">
            <KnowledgeCard 
                title="Sampling Theory"
                description="To perfectly recreate an analog signal, you must sample at least TWICE the highest frequency."
                details="If your sampling rate is too low, you get 'Aliasing'—false patterns that didn't exist in the original signal. Try lowering the Sampling Rate while increasing the Frequency to see this in action!"
                icon={Activity}
                className="bg-white border-slate-200 shadow-sm"
            />
            
            <KnowledgeCard 
                title="Quantization Error"
                description="Converting smooth voltage into bits creates 'rounding errors' that sound like noise."
                details="Higher Bit-Depth (like 8-bit) reduces this error. Lower it to 1-Bit or 2-Bit to see the 'Staircase' effect of quantization."
                icon={Database}
                className="bg-white border-slate-200 shadow-sm"
            />
        </div>
      </div>
    </div>
  );
};

export default AnalogDigital;
