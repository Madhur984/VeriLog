import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, HelpCircle } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDomain: (domainId: string) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, onSelectDomain }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
      title: "Design vs. Verification",
      question: "Do you prefer creating circuits and layouts, or building frameworks to find bugs?",
      options: [
        { value: 'design', label: 'Circuit & Layout Design', desc: 'Focus on structuring silicon nodes and logic blocks.' },
        { value: 'verify', label: 'Logic & Bug Verification', desc: 'Focus on writing testbenches to break and validate designs.' }
      ]
    },
    {
      id: 2,
      title: "Physical vs. Software Layers",
      question: "Are you more excited by hardware physics and controllers, or software compilers and tooling?",
      options: [
        { value: 'hardware', label: 'Physical Silicon & Hardware', desc: 'Fascinated by electromagnetic waves, physics, and board design.' },
        { value: 'software', label: 'Tooling & Coding Automation', desc: 'Fascinated by software algorithms, compilers, and hardware tools.' }
      ]
    },
    {
      id: 3,
      title: "Target Environment",
      question: "What is your dream working environment?",
      options: [
        { value: 'fab', label: 'Mega Fab or Foundry (e.g. Intel, Samsung)', desc: 'Designing physical chips and dealing with pure silicon fabrication.' },
        { value: 'ip', label: 'IP Design House (e.g. Qualcomm, NVIDIA)', desc: 'Writing high-performance architecture designs and digital systems.' }
      ]
    }
  ];

  const handleSelect = (val: string) => {
    const nextAnswers = { ...answers, [step]: val };
    setAnswers(nextAnswers);
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate recommendation
      let recommended = 'vlsi'; // Default VLSI Design
      
      const q1 = nextAnswers[1];
      const q2 = nextAnswers[2];
      const q3 = nextAnswers[3];

      if (q1 === 'verify') {
        recommended = 'dv'; // Design Verification
      } else if (q2 === 'software') {
        recommended = 'eda'; // EDA Tools
      } else if (q2 === 'hardware' && q3 === 'fab') {
        recommended = 'pd'; // Physical Design
      } else if (q2 === 'hardware' && q3 === 'ip') {
        recommended = 'embedded'; // Embedded Systems
      }

      onSelectDomain(recommended);
      setStep(1);
      setAnswers({});
      onClose();
    }
  };

  const currentQ = questions[step - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06080A]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#0F1216] border-2 border-slate-800 shadow-[0_0_50px_rgba(20,184,166,0.15)] p-6 sm:p-8 rounded-2xl z-10 text-white overflow-hidden"
          >
            {/* Background Grid Pattern Decoration */}
            <div className="absolute right-0 top-0 h-40 w-40 bg-grid-pattern opacity-5 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 uppercase tracking-tight">Onboarding Diagnostic</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {questions.map((q) => (
                      <span key={q.id} className={`h-1 w-6 rounded-full transition-colors ${q.id === step ? 'bg-teal-400' : q.id < step ? 'bg-teal-600' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Step Question */}
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest font-bold">Question 0{step} of 03</span>
                <h4 className="text-lg font-bold text-slate-100">{currentQ.question}</h4>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left p-4 bg-white/[0.02] hover:bg-teal-500/[0.04] border-2 border-slate-800 hover:border-teal-500/50 rounded-xl transition-all cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="font-bold text-sm text-slate-200 group-hover:text-teal-400 transition-colors block">{opt.label}</span>
                      <span className="text-xs text-slate-400 leading-normal block">{opt.desc}</span>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-slate-700 group-hover:border-teal-500 flex items-center justify-center text-transparent group-hover:text-teal-400 group-hover:bg-teal-500/10 shrink-0">
                      <Check size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <span>BitforBytes Silicon Engine</span>
              <span>Step {step} of 3</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
