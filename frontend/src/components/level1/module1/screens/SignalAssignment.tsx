import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Target, 
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ScreenProps } from '../types';
import { cn } from '../../../../lib/utils';
import { VeriButton } from '../../../shared/VeriButton';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';

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
  const [analystMessage, setAnalystMessage] = useState("Signal integrity verification in progress. Precision required.");
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
      setAnalystMessage("Neural synchronization confirmed. Proceed with the next layer.");
      triggerHaptic?.('success');
    } else {
      setStreak(0);
      setMistakes(prev => prev + 1);
      setAnalystMessage("Signal mismatch. Variance detected in the logic stream.");
      triggerHaptic?.('error');
      trackMistake?.();
    }
  };

  const nextQuestion = () => {
    if (currentIdx < activePool.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setShowFeedback(false);
      setAnalystMessage("Calibrating next challenge...");
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
        className="section-content flex flex-col items-center justify-center text-center space-y-12"
        {...focusProps}
      >
        <div className="relative">
            <div className="p-8 bg-emerald-50 text-emerald-600 rounded-full shadow-2xl shadow-emerald-100">
                <ShieldCheck size={64} />
            </div>
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-[-40px] inset-y-[-40px] border border-dashed border-emerald-200 rounded-full"
            />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">VERIFICATION PASSED.</h1>
          <p className="text-slate-400 mt-4 font-mono text-[10px] uppercase tracking-[0.3em]">Signal understanding stabilized at 98% coherence.</p>
        </div>
        <div className="grid grid-cols-3 gap-8 w-full max-w-2xl mt-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Faults</span>
                <div className="text-2xl font-black text-rose-500">{mistakes}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Accuracy</span>
                <div className="text-2xl font-black text-emerald-500">{Math.round(((activePool.length - mistakes) / activePool.length) * 100)}%</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                <div className="text-2xl font-black text-sky-500">READY</div>
            </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="section-content relative flex flex-col items-center !justify-start pt-16 min-h-[700px] bg-slate-50/50 rounded-[48px] border border-slate-100 p-8" {...focusProps}>
        {/* Progress System */}
        <div className="max-w-2xl w-full flex flex-col items-center gap-8 mb-16">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl flex items-center gap-4 w-fit">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                    <Info size={16} />
                </div>
                <p className="text-xs font-bold text-slate-600 italic">"{analystMessage}"</p>
            </div>
            
            <div className="flex justify-between items-center w-full px-8">
                <div className="flex gap-2">
                    {activePool.map((_, i) => (
                        <div key={i} className={cn(
                            "h-2 w-16 rounded-full transition-all duration-500",
                            i < currentIdx ? "bg-emerald-400" : i === currentIdx ? "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-200"
                        )} />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-sky-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak: {streak}</span>
                </div>
            </div>
        </div>

        <div className="max-w-3xl w-full space-y-12 z-10 px-8">
            <div className="space-y-4 text-center">
                <h2 className="text-sky-500 font-mono text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Layer Verification // {currentIdx + 1}</h2>
                <h1 className="text-3xl font-black text-slate-900 italic tracking-tight leading-tight">" {currentQuestion?.question} "</h1>
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
                        className={cn(
                            "!justify-between transition-all duration-300 rounded-[24px] h-16",
                            showFeedback && i === currentQuestion.correct ? "!border-emerald-500 bg-emerald-50/50" : ""
                        )}
                    >
                        <span className="font-bold text-xs uppercase tracking-wider">{option}</span>
                        {selected === i && (
                            isCorrect ? <CheckCircle2 size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-rose-500" />
                        )}
                        {showFeedback && i === currentQuestion.correct && !isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                    </VeriButton>
                ))}

                {currentQuestion?.type === 'simulation' && (
                    <div 
                        onClick={() => handleSelect(true)}
                        className={cn(
                            "h-64 rounded-[40px] border-3 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden",
                            showFeedback 
                                ? isCorrect 
                                    ? "border-emerald-500 bg-emerald-50/30" 
                                    : "border-rose-500 bg-rose-50/30" 
                                : "border-slate-200 bg-white hover:border-sky-400 shadow-sm hover:shadow-lg"
                        )}
                    >
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className={cn("w-24 h-1.5 rounded-full transition-all duration-500", selected !== null ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]" : "bg-slate-100")} />
                                <div className={cn("p-5 rounded-full border-2 transition-all duration-500", selected !== null ? "border-emerald-500 text-emerald-500 bg-white" : "border-slate-100 text-slate-200 bg-slate-50")}>
                                    <Target size={32} />
                                </div>
                                <div className={cn("w-24 h-1.5 rounded-full transition-all duration-500", selected !== null ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]" : "bg-slate-100")} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-slate-600 transition-colors">
                                {selected !== null ? "Link Established" : "Integrate Circuit Bridge"}
                            </span>
                        </div>
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                            <svg width="100%" height="100%"><defs><pattern id="simGrid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="black" /></pattern></defs><rect width="100%" height="100%" fill="url(#simGrid)" /></svg>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "p-8 rounded-[32px] border-2",
                            isCorrect ? "border-emerald-100 bg-emerald-50/30" : "border-rose-100 bg-rose-50/30"
                        )}
                    >
                        <div className="flex gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-xl", isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
                                        {isCorrect ? <Zap size={16} /> : <RotateCcw size={16} />}
                                    </div>
                                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isCorrect ? "text-emerald-600" : "text-rose-600")}>
                                        {isCorrect ? "Logic Core Synchronized" : "Variance Discovered"}
                                    </h3>
                                </div>
                                <p className="text-slate-700 text-sm font-bold leading-relaxed italic">
                                    "{isCorrect ? currentQuestion.explanation : currentQuestion.hint}"
                                </p>
                                <button 
                                    onClick={nextQuestion}
                                    className="mt-6 flex items-center gap-2 group text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-sky-600 transition-colors"
                                >
                                    Proceed to Next Logic Layer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
