import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { domainQuizzes } from '../data/quizQuestions';
import { DataTerminal } from './DataTerminal';

interface MasteryQuizModalProps {
  domainId: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const MasteryQuizModal: React.FC<MasteryQuizModalProps> = ({ 
  domainId, 
  onClose, 
  onComplete 
}) => {
  const questions = domainQuizzes[domainId] || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const finalPercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-matte-obsidian/80">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <DataTerminal 
          title={`${domainId.toUpperCase()} MASTERY CALIBRATION`}
          subtitle={showResult ? "Assessment Complete" : `Question ${currentIdx + 1} of ${questions.length}`}
          className="min-h-[400px]"
        >
          <div className="p-8">
            {!showResult ? (
              <div className="space-y-8">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-mono text-text-main leading-relaxed flex-1">
                    {questions[currentIdx]?.q}
                  </h2>
                  <button 
                    onClick={onClose}
                    className="text-text-dim hover:text-text-main font-mono text-xs uppercase px-2 py-1 border border-ghost-trace hover:border-text-main/20 transition-all"
                  >
                    Abort [ESC]
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {questions[currentIdx]?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedOption !== null}
                      className={`
                        p-4 text-left font-mono text-sm border transition-all duration-200
                        ${selectedOption === null 
                          ? 'border-ghost-trace hover:border-plasma-cyan hover:bg-plasma-cyan/5 text-text-sub' 
                          : i === questions[currentIdx].correct
                            ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                            : i === selectedOption
                              ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'border-ghost-trace opacity-50 text-text-dim'
                        }
                      `}
                    >
                      <span className="mr-4 text-plasma-cyan/50">[{String.fromCharCode(65 + i)}]</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="text-6xl font-mono font-bold text-plasma-cyan drop-shadow-cyan">
                  {finalPercentage}%
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-mono text-text-main uppercase tracking-widest">
                    {finalPercentage >= 80 ? "Silicon Master Status Achieved" : "Calibration Partial"}
                  </h3>
                  <p className="text-text-sub font-mono text-sm max-w-sm mx-auto">
                    {finalPercentage >= 80 
                      ? "Your neural patterns align with top-tier engineering standards. Badge unlocked."
                      : "Core concepts identified, but precision is required for master status."}
                  </p>
                </div>
                <div className="flex justify-center gap-4 pt-8">
                  <button 
                    onClick={() => onComplete(finalPercentage)}
                    className="px-8 py-3 bg-plasma-cyan text-matte-obsidian font-mono text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Sync Results
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-bg-base border border-ghost-trace text-text-main font-mono text-sm font-bold uppercase tracking-widest hover:bg-bg-elev transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </DataTerminal>
      </motion.div>
    </div>
  );
};
