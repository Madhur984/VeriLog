import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Signal, Layout, Globe, Rocket, Shield, Activity, Radio, Laptop } from 'lucide-react';
import { COMPASS_QUESTIONS } from '../data/compassQuestions';
import { computeCompassResult } from '../utils/compassEngine';
import { useCompass } from '../hooks/useCompass';
import { DOMAINS } from '../data/domains';

const iconMap: Record<string, any> = {
  cpu: Cpu,
  signal: Signal,
  microcontroller: Cpu,
  focus: Layout,
  ship: Rocket,
  analyze: Activity,
  global: Globe,
  startup: Rocket,
  mission: Shield,
  'high-salary': Activity,
  stability: Shield,
  research: Layout,
  fab: Cpu,
  '5g': Radio,
  products: Laptop,
};

export const SiliconCompass: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { completed, saveResult, skipCompass } = useCompass();
  const [isOpen, setIsOpen] = useState(!completed);
  const [currentStep, setCurrentStep] = useState(0); // 0-4 for questions, 5 for result
  const [answers, setAnswers] = useState<Record<number, string[]>>({});

  if (!isOpen || completed) return null;

  const handleAnswer = (questionId: number, tags: string[]) => {
    const updatedAnswers = { ...answers, [questionId]: tags };
    setAnswers(updatedAnswers);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      const results = computeCompassResult(updatedAnswers);
      saveResult(results.primary, results.secondary, results.tertiary);
      setCurrentStep(5);
    }
  };

  const handleSkip = () => {
    skipCompass();
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const currentQ = COMPASS_QUESTIONS[currentStep];
  const progress = (currentStep / 5) * 100;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#020408]/95 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl px-6">
        
        {/* Progress Bar */}
        <div className="absolute top-[-100px] left-0 w-full h-[2px] bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-right from-cyan-400 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {currentStep < 5 ? (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">
                  {currentQ.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl leading-tight">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQ.options.map((option) => {
                  const Icon = iconMap[option.icon] || Cpu;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQ.id, option.tags)}
                      className="group relative flex flex-col items-start p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-left transition-all hover:bg-white/[0.06] hover:border-cyan-400/30 hover:translate-y-[-2px]"
                    >
                      <div className="mb-4 p-3 rounded-xl bg-white/[0.05] text-cyan-400 group-hover:bg-cyan-400/10 transition-colors">
                        <Icon size={24} />
                      </div>
                      <p className="text-white font-medium text-lg leading-snug">
                        {option.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <ResultScreen 
              result={computeCompassResult(answers)} 
              onClose={() => {
                setIsOpen(false);
                if (onComplete) onComplete();
              }} 
            />
          )}
        </AnimatePresence>

        <button 
          onClick={handleSkip}
          className="absolute bottom-[-100px] right-6 font-mono text-[10px] tracking-[0.1em] text-slate-500 uppercase hover:text-white transition-colors"
        >
          SKIP FOR NOW
        </button>
      </div>
    </div>
  );
};

const ResultScreen: React.FC<{ result: any; onClose: () => void }> = ({ result, onClose }) => {
  const primaryDomain = DOMAINS.find(d => d.id === result.primary) || DOMAINS[0];
  const secondaryDomain = DOMAINS.find(d => d.id === result.secondary) || DOMAINS[1];
  const tertiaryDomain = DOMAINS.find(d => d.id === result.tertiary) || DOMAINS[2];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="space-y-8 text-center"
    >
      <div className="space-y-2">
        <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400 uppercase">
          CALIBRATION COMPLETE
        </span>
        <h2 className="text-4xl font-bold text-white uppercase tracking-tight">
          Your Silicon Trajectory is Mapped.
        </h2>
      </div>

      <div className="space-y-4">
        <div className="text-left">
           <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest ml-1">Primary Domain</span>
           <div className="mt-2 p-6 rounded-2xl bg-cyan-400/5 border border-cyan-400/30 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyan-400" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase">{primaryDomain.name}</h3>
                  <p className="text-slate-400 mt-1 italic">"{primaryDomain.tagline}"</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] font-mono border border-cyan-400/20 uppercase">High Demand</span>
                  <span className="text-cyan-400 font-mono text-xs">{primaryDomain.salaryRange} Fresher</span>
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 opacity-50 text-left">
              <span className="font-mono text-[9px] text-slate-500 uppercase">Secondary Match</span>
              <p className="text-white font-semibold mt-1 uppercase text-sm">{secondaryDomain.name}</p>
           </div>
           <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 opacity-50 text-left">
              <span className="font-mono text-[9px] text-slate-500 uppercase">Tertiary Match</span>
              <p className="text-white font-semibold mt-1 uppercase text-sm">{tertiaryDomain.name}</p>
           </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col items-center gap-6">
        <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
           <Rocket size={14} className="text-amber-500" />
           <span className="font-mono text-[10px] text-amber-500 uppercase">Archetype: THE ARCHITECT</span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-cyan-400 text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors"
          >
            Explore My Domain
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white/5 text-white font-bold uppercase text-xs tracking-widest rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            View Full Roadmap
          </button>
        </div>
      </div>
    </motion.div>
  );
};
