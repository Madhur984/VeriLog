import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Target, 
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ScreenProps } from '../types';
import { VoltMonkey, MonkeyState } from '../../../../components/Bot/VoltMonkey';

interface Question {
  id: string;
  type: 'mcq' | 'simulation' | 'visual';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correct: string | number | boolean;
  explanation: string;
  hint: string;
}

const QUESTION_POOL: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    difficulty: 'easy',
    question: "You see a notification light flickering on your phone. What is the light acting as in this system?",
    options: ["The Signal itself", "The Medium", "The Return Path", "The Noise"],
    correct: 0,
    explanation: "The light serves as the carrier of information—notifying you of an event.",
    hint: "What is physically moving information to your eyes?"
  },
  {
    id: 'q2',
    type: 'simulation',
    difficulty: 'medium',
    question: "A signal needs a closed loop to flow. Click to fix the connection.",
    correct: true,
    explanation: "Without a return path, the loop is broken and current cannot flow continuously.",
    hint: "Signals can't jump across empty space. Close the circuit!"
  },
  {
    id: 'q3',
    type: 'visual',
    difficulty: 'hard',
    question: "In high-speed fiber optics, if a light pulse spreads out over time, it becomes unreadable. This is called:",
    options: ["Modulation", "Dispersion", "Reflection", "Amplification"],
    correct: 1,
    explanation: "Dispersion causes pulses to overlap, making the signal unreadable over long distances.",
    hint: "Logic says 'spread' = 'disperse'."
  },
  {
    id: 'q4',
    type: 'mcq',
    difficulty: 'medium',
    question: "If you speak into a megaphone, your voice is the source. What is the 'Modulator' here?",
    options: ["The Air", "The Megaphone", "Your Vocal Chords", "The Listener"],
    correct: 1,
    explanation: "The megaphone takes your acoustic signal and increases its intensity (amplitude).",
    hint: "Which device is changing the signal's properties?"
  }
];

import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

export const SignalAssignment: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onInteractionComplete,
  trackMistake,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [botState, setBotState] = useState<MonkeyState>('idle');
  const [activePool, setActivePool] = useState<Question[]>([]);
  const { focusProps } = useAttentionLock();

  useEffect(() => {
    const pool = QUESTION_POOL.slice(0, 3);
    setActivePool(pool);
  }, []);

  const currentQuestion = activePool[currentIdx];

  const handleSelect = (answer: any) => {
    if (showFeedback) return;
    setSelected(answer);
    
    const correct = answer === currentQuestion.correct;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setStreak(prev => prev + 1);
      setBotState('happy');
      triggerHaptic?.('success');
    } else {
      setStreak(0);
      setMistakes(prev => prev + 1);
      setBotState('thinking');
      triggerHaptic?.('error');
      trackMistake?.();
    }
  };

  const nextQuestion = () => {
    if (currentIdx < activePool.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowFeedback(false);
      setBotState('idle');
    } else {
      setCompleted(true);
      onInteractionComplete?.();
    }
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="section-content flex flex-col items-center justify-center text-center space-y-8"
        {...focusProps}
      >
        <div className="relative">
            <VoltMonkey state="happy" size="md" />
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-[-60px] inset-y-[-60px] border border-dashed border-[var(--success)]/20 rounded-full"
            />
        </div>
        <div>
          <h1 className="title-xl italic">VERIFICATION PASSED.</h1>
          <p className="body opacity-60 mt-4 font-mono text-[10px] uppercase tracking-widest">Signal understanding stabilized at 98% coherence.</p>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full max-w-xl mt-12">
            <div className="glass-card p-4 border-white/5">
                <span className="text-[8px] font-mono text-white/40 uppercase">Faults</span>
                <div className="text-xl font-mono text-[var(--error)]">{mistakes}</div>
            </div>
            <div className="glass-card p-4 border-white/5">
                <span className="text-[8px] font-mono text-white/40 uppercase">Accuracy</span>
                <div className="text-xl font-mono text-[var(--success)]">{Math.round(((activePool.length - mistakes) / activePool.length) * 100)}%</div>
            </div>
            <div className="glass-card p-4 border-white/5">
                <span className="text-[8px] font-mono text-white/40 uppercase">Status</span>
                <div className="text-xl font-mono text-[var(--accent-primary)]">Ready</div>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="section-content relative flex flex-col items-center !justify-start pt-24 min-h-[700px]" {...focusProps}>
        {/* Progress System */}
        <div className="max-w-2xl w-full flex flex-col items-center gap-8 mb-12">
            <VoltMonkey state={botState} size="sm" />
            
            <div className="flex justify-between items-center w-full px-4">
                <div className="flex gap-1">
                    {activePool.map((_, i) => (
                        <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${i < currentIdx ? 'bg-[var(--success)]' : i === currentIdx ? 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]' : 'bg-white/10'}`} />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Streak: {streak}</span>
                </div>
            </div>
        </div>

        <div className="max-w-3xl w-full space-y-10 z-10 px-4">
            <div className="space-y-4 text-center">
                <h2 className="text-[var(--accent-primary)] font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">Layer Verification // {currentIdx + 1}</h2>
                <h1 className="title-lg !text-[24px] font-mono italic leading-tight">" {currentQuestion?.question} "</h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {currentQuestion?.type === 'mcq' && currentQuestion.options?.map((option, i) => (
                    <VeriButton
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={showFeedback}
                        variant={selected === i 
                                ? isCorrect 
                                    ? 'logic' 
                                    : 'secondary'
                                : 'secondary'
                        }
                        size="lg"
                        className={`
                            !justify-between transition-all duration-300
                            ${showFeedback && i === currentQuestion.correct ? '!border-[var(--success)]' : ''}
                        `}
                    >
                        <span className="font-mono text-xs uppercase tracking-wider">{option}</span>
                        {selected === i && (
                            isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />
                        )}
                        {showFeedback && i === currentQuestion.correct && <CheckCircle2 size={18} />}
                    </VeriButton>
                ))}

                {currentQuestion?.type === 'simulation' && (
                    <div 
                        onClick={() => handleSelect(true)}
                        className={`
                            h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer 
                            group transition-all relative overflow-hidden
                            ${showFeedback ? isCorrect ? 'border-[var(--success)] bg-[var(--success)]/5' : 'border-[var(--error)] bg-[var(--error)]/5' : 'border-white/10 bg-white/[0.02] hover:border-[var(--accent-primary)]/40'}
                        `}
                    >
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-24 h-1 rounded-full ${selected !== null ? 'bg-[var(--success)] shadow-[0_0_20px_var(--success)]' : 'bg-white/10'}`} />
                                <div className={`p-4 rounded-full border ${selected !== null ? 'border-[var(--success)] text-[var(--success)]' : 'border-white/10 text-white/20'}`}>
                                    <Target size={24} />
                                </div>
                                <div className={`w-24 h-1 rounded-full ${selected !== null ? 'bg-[var(--success)] shadow-[0_0_20px_var(--success)]' : 'bg-white/10'}`} />
                            </div>
                            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40">
                                {selected !== null ? "Link Established" : "Click to bridge the gap"}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl border ${isCorrect ? 'border-[var(--success)]/20 bg-gradient-to-br from-[var(--success)]/5 to-transparent' : 'border-[var(--error)]/20 bg-gradient-to-br from-[var(--error)]/5 to-transparent'}`}
                    >
                        <div className="flex gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {isCorrect ? <Zap size={14} className="text-[var(--success)]" /> : <RotateCcw size={14} className="text-[var(--error)]" />}
                                    <h3 className={`text-[10px] font-mono uppercase tracking-widest ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                                        {isCorrect ? 'Insight Synchronized' : 'Neural Link Broken'}
                                    </h3>
                                </div>
                                <p className="text-white/80 text-xs leading-relaxed font-mono">
                                    {isCorrect ? currentQuestion.explanation : `Error: ${currentQuestion.hint}`}
                                </p>
                                <button 
                                    onClick={nextQuestion}
                                    className="mt-6 flex items-center gap-2 group text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] hover:text-white transition-colors"
                                >
                                    Proceed to Next Layer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default SignalAssignment;
