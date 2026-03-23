import React, { useState, useEffect } from 'react';
import { ScreenProps } from '../types';
import { Oscilloscope } from '../shared/Oscilloscope';
import { LiveMetricsHUD } from '../shared/LiveMetricsHUD';
import { SignalLabControls } from '../shared/SignalLabControls';
import { SignalAudioEngine } from '../shared/SignalAudioEngine';
import { Info, HelpCircle, ChevronRight, ShieldAlert, Cpu, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VeriSlider } from '../../../shared/VeriSlider';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; isCorrect: boolean }[];
  category: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'basic_info',
    category: 'BASIC',
    text: "Which signal carries the actual information?",
    options: [
      { label: "Carrier", value: "A", isCorrect: false },
      { label: "Message", value: "B", isCorrect: true },
      { label: "Noise", value: "C", isCorrect: false }
    ]
  },
  {
    id: 'carrier_purpose',
    category: 'UNDERSTANDING',
    text: "Why do we use a high-frequency carrier wave?",
    options: [
      { label: "To slow the signal", value: "A", isCorrect: false },
      { label: "To transmit over distance", value: "B", isCorrect: true },
      { label: "To remove noise", value: "C", isCorrect: false }
    ]
  },
  {
    id: 'am_logic',
    category: 'MODULATION',
    text: "What happens during Amplitude Modulation (AM)?",
    options: [
      { label: "Frequency changes", value: "A", isCorrect: false },
      { label: "Amplitude follows message", value: "B", isCorrect: true },
      { label: "Signal disappears", value: "C", isCorrect: false }
    ]
  },
  {
    id: 'noise_effect',
    category: 'INTERFERENCE',
    text: "What is the primary effect of Noise on a signal?",
    options: [
      { label: "Improves clarity", value: "A", isCorrect: false },
      { label: "Distorts the signal", value: "B", isCorrect: true },
      { label: "Removes original message", value: "C", isCorrect: false }
    ]
  }
];

export const SignalParameters: React.FC<ScreenProps & {
  updateMessageSignal?: (u: any) => void;
  updateCarrierSignal?: (u: any) => void;
  updateModulation?: (u: any) => void;
  updateInterference?: (u: any) => void;
}> = ({ 
  triggerHaptic, 
  memory,
  updateMessageSignal,
  updateCarrierSignal,
  updateModulation,
  updateInterference,
}) => {
  const { focusProps } = useAttentionLock();
  const [activeTab, setActiveTab] = useState<'sim' | 'mod'>('mod');
  const [showTheory, setShowTheory] = useState(true);
  const [theoryStep, setTheoryStep] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [time, setTime] = useState(0);

  // Use type casting to handle extended memory properties
  const mem = memory as any;
  const messageSignal = mem?.messageSignal || { amplitude: 0.4, frequency: 2, phase: 0, type: 'sine' };
  const carrierSignal = mem?.carrierSignal || { amplitude: 0.8, frequency: 20, phase: 0, type: 'sine' };
  const modulation = mem?.modulation || { depth: 0.5, enabled: false };
  const interference = mem?.interference || { intensity: 0, type: 'gaussian' };
  
  const [channels, setChannels] = useState({ ch1: true, ch2: false, ch3: true, ch4: true });

  useEffect(() => {
    if (showTheory) triggerHaptic?.('light');
  }, [showTheory, triggerHaptic]);

  const theorySlides = [
    {
      title: "MESSAGE vs CARRIER",
      content: "Information is slow (Message). Transport is fast (Carrier). Together, they travel the distance.",
      icon: <Info className="text-[var(--accent-primary)]" />
    },
    {
      title: "MODULATION",
      content: "We embed the message into the carrier's amplitude. The envelope now carries your data.",
      icon: <Cpu className="text-[var(--accent-secondary)]" />
    },
    {
      title: "INTERFERENCE",
      content: "Real signals get corrupted. Noise adds chaos to the transmission.",
      icon: <ShieldAlert className="text-[var(--error)]" />
    }
  ];

  const handleAnswer = (isCorrect: boolean) => {
    triggerHaptic?.(isCorrect ? 'light' : 'heavy');
    setQuestionFeedback({
      correct: isCorrect,
      msg: isCorrect ? "CONCEPT SYNCED." : "SIGNAL ERROR. TRY AGAIN."
    });
    
    if (isCorrect) {
      setTimeout(() => {
        setQuestionFeedback(null);
        if (activeQuestion !== null && activeQuestion < QUESTIONS.length - 1) {
          setActiveQuestion(activeQuestion + 1);
        } else {
          setActiveQuestion(null);
        }
      }, 1500);
    }
  };

  const handlePreset = (type: string) => {
    triggerHaptic?.('heavy');
    if (type === 'pure') {
      updateMessageSignal?.({ frequency: 2, amplitude: 0.6 });
      updateInterference?.({ intensity: 0 });
    }
    if (type === 'noisy') {
      updateInterference?.({ intensity: 0.4 });
    }
  };

  const currentSignal = activeTab === 'sim' ? mem?.userSignal : messageSignal;

  return (
    <div className="section-content flex flex-col items-center justify-center space-y-8 relative p-4" {...focusProps}>
        {/* Theory Overlay */}
        <AnimatePresence>
          {showTheory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#070B14]/95 backdrop-blur-xl flex items-center justify-center p-8"
            >
              <motion.div 
                key={theoryStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="max-w-xl text-center space-y-8"
              >
                <div className="flex justify-center mb-4 scale-150">
                  {theorySlides[theoryStep].icon}
                </div>
                <h2 className="title-lg text-white tracking-widest uppercase italic">{theorySlides[theoryStep].title}</h2>
                <p className="body text-white/70 text-lg leading-relaxed">{theorySlides[theoryStep].content}</p>
                <div className="flex justify-center gap-4 mt-8">
                  {theoryStep < theorySlides.length - 1 ? (
                    <VeriButton variant="secondary" onClick={() => setTheoryStep(theoryStep + 1)}>
                      Next Insight <ChevronRight size={14} className="ml-2" />
                    </VeriButton>
                  ) : (
                    <VeriButton variant="signal" onClick={() => { setShowTheory(false); setActiveQuestion(0); }}>
                      Enter Simulator
                    </VeriButton>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Overlay */}
        <AnimatePresence>
          {activeQuestion !== null && !showTheory && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
            >
              <div className="glass-card p-6 border-[var(--accent-primary)]/40 bg-black/80">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] font-mono text-[var(--accent-primary)] uppercase tracking-widest">{QUESTIONS[activeQuestion].category}</span>
                  <HelpCircle size={12} className="text-white/20" />
                </div>
                <p className="text-sm font-bold text-white mb-6 italic">"{QUESTIONS[activeQuestion].text}"</p>
                <div className="grid grid-cols-3 gap-3">
                  {QUESTIONS[activeQuestion].options.map((opt, i) => (
                    <VeriButton 
                      key={i} 
                      size="sm" 
                      variant="ghost" 
                      className="!text-[10px]"
                      onClick={() => handleAnswer(opt.isCorrect)}
                    >
                      {opt.label}
                    </VeriButton>
                  ))}
                </div>
                {questionFeedback && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`text-center mt-4 text-[9px] font-mono uppercase tracking-widest ${questionFeedback.correct ? 'text-[var(--accent-primary)]' : 'text-[var(--error)]'}`}
                  >
                    {questionFeedback.msg}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center space-y-2">
            <h2 className="text-[var(--accent-primary)] font-mono text-[9px] uppercase tracking-[0.5em] opacity-40">Communication Lab</h2>
            <h1 className="title-lg italic tracking-tighter">OSCILLOSCOPE COMMAND.</h1>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visualizer Column */}
            <div className="lg:col-span-8 space-y-4">
                <div className="glass-card aspect-[21/9] flex items-center justify-center relative overflow-hidden group border-white/10">
                    {/* View Controls */}
                    <div className="absolute top-4 left-4 flex gap-2 z-20 scale-75 origin-top-left">
                        <VeriButton 
                            size="sm"
                            variant={activeTab === 'sim' ? 'signal' : 'ghost'}
                            onClick={() => setActiveTab('sim')}
                        >
                            Basic
                        </VeriButton>
                        <VeriButton 
                            size="sm"
                            variant={activeTab === 'mod' ? 'logic' : 'ghost'}
                            onClick={() => setActiveTab('mod')}
                        >
                            Comm System
                        </VeriButton>
                    </div>

                    {/* Channel Toggles */}
                    <div className="absolute bottom-4 left-4 flex gap-2 z-20 scale-75 origin-bottom-left">
                      {(['ch1', 'ch2', 'ch3', 'ch4'] as const).map((ch) => (
                        <button 
                          key={ch}
                          onClick={() => setChannels(p => ({ ...p, [ch]: !p[ch] }))}
                          className={`w-8 h-4 rounded-full border border-white/20 text-[6px] font-mono flex items-center justify-center transition-colors ${channels[ch] ? 'bg-white/10 text-white' : 'bg-transparent text-white/20'}`}
                        >
                          {ch.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <Oscilloscope 
                        messageSignal={messageSignal}
                        carrierSignal={carrierSignal}
                        modulation={modulation}
                        interference={interference}
                        signalA={mem?.userSignal}
                        mode={activeTab === 'mod' ? 'modulation' : 'analog'}
                        channels={channels}
                        isFrozen={isFrozen}
                        timeScrub={time}
                        className="w-full h-full"
                    />

                    <div className="absolute top-4 right-4 flex flex-col gap-2 scale-75 origin-top-right">
                        <LiveMetricsHUD signal={messageSignal} className="!bg-black/60" />
                        <LiveMetricsHUD signal={carrierSignal} className="!bg-black/60 opacity-60" />
                    </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <SignalLabControls 
                        onPreset={handlePreset}
                        onTimeChange={setTime}
                        onFreeze={setIsFrozen}
                        isFrozen={isFrozen}
                        time={time}
                    />
                  </div>
                  <VeriButton 
                    size="sm" 
                    variant={modulation.enabled ? 'signal' : 'ghost'}
                    className="h-[40px] px-6"
                    onClick={() => {
                        updateModulation?.({ enabled: !modulation.enabled });
                        setAudioEnabled(!audioEnabled);
                    }}
                  >
                    {modulation.enabled ? 'MODULATION ACTIVE' : 'ENGAGE MODULATION'}
                  </VeriButton>
                </div>
            </div>

            {/* Controls Column */}
            <div className="lg:col-span-4 space-y-4">
                <div className="glass-card p-6 space-y-6 !bg-white/5 border-white/5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Transmission Tuning</h3>
                        <Activity className="text-[var(--accent-primary)] w-3 h-3 animate-pulse" />
                    </div>

                    <div className="space-y-8">
                      <VeriSlider 
                          label="Message Freq"
                          value={messageSignal.frequency}
                          min={1} max={5} step={0.1}
                          variant="logic"
                          onChange={(val) => updateMessageSignal?.({ frequency: val })}
                          unit="Hz"
                      />
                      <VeriSlider 
                          label="Carrier Freq"
                          value={carrierSignal.frequency}
                          min={10} max={50} step={1}
                          variant="signal"
                          onChange={(val) => updateCarrierSignal?.({ frequency: val })}
                          unit="Hz"
                      />
                      <VeriSlider 
                          label="Modulation Depth"
                          value={modulation.depth}
                          min={0} max={1} step={0.01}
                          variant="logic"
                          onChange={(val) => updateModulation?.({ depth: val })}
                          unit="%"
                      />
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[8px] font-mono text-[var(--error)] uppercase tracking-widest">Interference Engine</span>
                           <select 
                             className="bg-transparent text-[8px] font-mono text-white/40 border-none outline-none"
                             value={interference.type}
                             onChange={(e: any) => updateInterference?.({ type: e.target.value })}
                           >
                             <option value="gaussian">Gaussian</option>
                             <option value="burst">Burst</option>
                             <option value="emi">EMI</option>
                           </select>
                        </div>
                        <VeriSlider 
                            label="Noise Intensity"
                            value={interference.intensity}
                            min={0} max={1} step={0.01}
                            variant="signal"
                            onChange={(val) => updateInterference?.({ intensity: val })}
                            unit="%"
                        />
                      </div>
                    </div>
                </div>

                <div className="glass-card p-4 flex items-center gap-4 bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/10">
                   <div className="p-2 rounded-lg bg-black/40">
                      <HelpCircle size={16} className="text-[var(--accent-primary)]" />
                   </div>
                   <div>
                      <p className="text-[8px] font-mono text-white/40 uppercase">Pro Tip</p>
                      <p className="text-[10px] text-white/70">Observe how the <span className="text-[var(--accent-primary)] font-bold">envelope</span> contains your actual data.</p>
                   </div>
                </div>
            </div>
        </div>

        <SignalAudioEngine signal={currentSignal} enabled={audioEnabled} />
    </div>
  );
};

export default SignalParameters;
