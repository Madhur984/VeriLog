import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Lock, Unlock } from 'lucide-react';

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

/**
 * S09_KnowledgeGate: The Validation Pass
 */
export const S09_KnowledgeGate: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mastered, setMastered] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/40' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const buttonBg = isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm';

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
        <div className="flex flex-col items-center justify-center space-y-12 py-24 text-center max-w-2xl mx-auto">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-28 h-28 rounded-full border flex items-center justify-center shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-orange-500/20 border-orange-500 shadow-orange-500/20' : 'bg-orange-50 border-orange-200 shadow-orange-500/10'}`}
            >
                <Unlock className={accentColor} size={48} />
            </motion.div>
            <div className="space-y-6">
                <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>Bridge <span className={accentColor}>Mastered</span></h2>
                <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
                    The gap between reality and digital calculation has been solved. You are officially 
                    qualified to manipulate signals in the discrete domain.
                </p>
            </div>
            <button className={`px-14 py-6 rounded-full font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ${isDarkMode ? 'bg-orange-500 text-black shadow-orange-500/40' : 'bg-orange-600 text-white shadow-orange-600/40'}`}>
                Initialize V-CORE
            </button>
        </div>
    );
  }

  const q = QUESTIONS[currentIdx];

  return (
    <div className="flex flex-col gap-14 max-w-4xl mx-auto py-12">
      <header className="flex items-center gap-8 px-4">
        <div className={`p-5 rounded-3xl border shadow-xl transition-all duration-500 ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-50 border-orange-100'}`}>
            <Lock className={accentColor} size={28} />
        </div>
        <div className="space-y-2">
            <h2 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>The Final <span className={accentColor}>Gate</span></h2>
            <p className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Access Verification Required</p>
        </div>
      </header>

      <div className={`p-12 rounded-[3.5rem] border space-y-12 shadow-2xl relative overflow-hidden transition-colors duration-500 ${cardBg}`}>
        <div className="absolute top-0 right-0 p-10 select-none">
            <span className={`text-[48px] font-black italic ${isDarkMode ? 'text-white/[0.03]' : 'text-black/[0.03]'}`}>
                0{currentIdx + 1} <span className="text-[24px]">/ 03</span>
            </span>
        </div>

        <div className="space-y-12 relative z-10">
            <p className={`text-3xl font-black leading-tight pr-12 ${textColor}`}>{q.text}</p>
            
            <div className="grid grid-cols-1 gap-5">
                {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const isSelected = i === selected;
                    
                    return (
                        <button 
                            key={i}
                            disabled={showResult}
                            onClick={() => handleCheck(i)}
                            className={`
                                w-full p-8 rounded-[2.5rem] border text-left transition-all duration-300 flex justify-between items-center group
                                ${showResult && isCorrect 
                                    ? (isDarkMode ? 'bg-green-500/10 border-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-green-50 border-green-500 text-green-900') 
                                    : showResult && isSelected 
                                    ? (isDarkMode ? 'bg-red-500/10 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'bg-red-50 border-red-500 text-red-900') 
                                    : buttonBg}
                            `}
                        >
                            <span className={`text-lg font-bold tracking-tight ${showResult && !isCorrect && !isSelected ? 'opacity-30' : ''}`}>{opt}</span>
                            {showResult && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                            {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className={`p-10 rounded-[2.5rem] border space-y-4 shadow-inner ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        <span className={`text-[11px] font-mono uppercase tracking-[0.3em] font-black ${accentColor}`}>Technical Audit Case</span>
                        <p className={`text-base leading-relaxed font-medium italic ${isDarkMode ? 'text-white/50' : 'text-gray-600'}`}>"{q.insight}"</p>
                        
                        <div className="flex justify-end mt-8">
                            <button 
                                onClick={handleNext}
                                className={`flex items-center gap-4 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all duration-300 shadow-xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                            >
                                {currentIdx < QUESTIONS.length - 1 ? 'Next Challenge' : 'Confirm Mastery'} <ChevronRight size={18} />
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
