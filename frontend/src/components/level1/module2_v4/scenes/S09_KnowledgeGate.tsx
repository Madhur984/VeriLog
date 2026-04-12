import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, ChevronRight, Lock, Unlock } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
    insight: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "You are designing a high-end audio recorder for an 20kHz orchestra. What is the minimum absolute sample rate required to avoid aliasing?",
        options: ["20 kHz", "40.1 kHz", "10 kHz", "96 kHz"],
        correct: 1,
        insight: "Nyquist criterion: Fs must be > 2 * Fmax. 40.1kHz covers the full human hearing range."
    },
    {
        id: 2,
        text: "Increasing bit depth from 8-bit to 16-bit mainly improves which characteristic?",
        options: ["Frequency response", "Power consumption", "Quantization Noise floor", "Sampling speed"],
        correct: 2,
        insight: "Each bit adds 6dB of range. 16-bit provides a much lower 'floor' for subtle details."
    },
    {
        id: 3,
        text: "Why do engineers add dither (random noise) to a digital signal?",
        options: ["To save power", "To mask mistakes", "To linearize quantization distortion", "To speed up the ADC"],
        correct: 2,
        insight: "Dither trades a slightly higher noise floor for the ability to hear signals 'buried' between rungs."
    }
];

export const S09_KnowledgeGate: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mastered, setMastered] = useState(false);

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
    } else {
        setMastered(true);
    }
  };

  const handleCheck = (idx: number) => {
    setSelected(idx);
    setShowResult(true);
  };

  if (mastered) {
    return (
        <div className="flex flex-col items-center justify-center space-y-10 py-20 text-center max-w-2xl mx-auto">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
                <Unlock className="text-cyan-500" size={40} />
            </motion.div>
            <div className="space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter text-white">Bridge <span className="text-cyan-500">Mastered</span></h2>
                <p className="text-lg text-white/40 leading-relaxed font-medium">
                    The gap between reality and digital calculation has been solved. You are ready for 
                    Module 3: Linear Systems.
                </p>
            </div>
            <button className="px-12 py-5 rounded-full bg-cyan-500 text-black font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform">
                Proceed to V-CORE
            </button>
        </div>
    );
  }

  const q = QUESTIONS[currentIdx];

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-10">
      <header className="flex items-center gap-6">
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/5">
            <Lock className="text-orange-500" size={24} />
        </div>
        <div className="space-y-1">
            <h2 className="text-4xl font-black italic tracking-tighter text-white">The Final <span className="text-orange-500">Gate</span></h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 font-black">Validation Required for Transit</p>
        </div>
      </header>

      <div className="p-10 rounded-[3rem] border border-white/10 bg-black/40 space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
            <span className="text-[40px] font-black italic text-white/[0.03]">0{currentIdx + 1} / 03</span>
        </div>

        <div className="space-y-10 relative z-10">
            <p className="text-2xl font-black text-white/90 leading-tight pr-12">{q.text}</p>
            
            <div className="grid grid-cols-1 gap-4">
                {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const isSelected = i === selected;
                    
                    return (
                        <button 
                            key={i}
                            disabled={showResult}
                            onClick={() => handleCheck(i)}
                            className={`
                                w-full p-6 rounded-[2rem] border text-left transition-all duration-300 flex justify-between items-center group
                                ${showResult && isCorrect ? 'bg-cyan-500/10 border-cyan-500 text-white' : 
                                  showResult && isSelected ? 'bg-red-500/10 border-red-500 text-white' : 
                                  'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}
                            `}
                        >
                            <span className={`text-sm font-bold tracking-tight ${showResult && !isCorrect && !isSelected ? 'opacity-30' : ''}`}>{opt}</span>
                            {showResult && isCorrect && <CheckCircle2 className="text-cyan-500" size={20} />}
                            {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-3"
                    >
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-500 font-black">Engineering Insight</span>
                        <p className="text-sm text-white/50 leading-relaxed font-medium italic">"{q.insight}"</p>
                        
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={handleNext}
                                className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-transform"
                            >
                                {currentIdx < QUESTIONS.length - 1 ? 'Next Challenge' : 'Confirm Mastery'} <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
