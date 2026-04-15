import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Lock, ShieldAlert, Cpu, Award, Zap, Terminal, Database, Activity } from 'lucide-react';

import { TechnicalAudit } from '../components/TechnicalAudit';

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
        text: "You sample a 10 kHz sine wave at 16 kHz. What do you see after reconstruction?",
        options: [
            "A perfect 10 kHz reproduction", 
            "Absolute silence (infinite error)", 
            "A 6 kHz alias 'ghost' frequency", 
            "A 26 kHz harmonic product"
        ],
        correct: 2,
        insight: "f_alias = |f_in - kFs|. Here, |10 - 16| = 6 kHz. Because 16 kHz is below the Nyquist rate (20 kHz), the 10 kHz signal 'folds' into the baseband."
    },
    {
        id: 2,
        text: "Adding one extra bit to your system resolution increases the theoretical SNR by approximately how many dB?",
        options: [
            "1.76 dB", 
            "3.01 dB", 
            "6.02 dB", 
            "20.0 dB"
        ],
        correct: 2,
        insight: "The 6 dB per bit rule: Each bit doubles the possible levels (2^N), which halves the quantization error, leading to a 6.02 dB improvement in dynamic range."
    },
    {
        id: 3,
        text: "Why is TPDF Dither used in professional audio mastering when reducing bit depth?",
        options: [
            "To increase the speed of the DSP processor", 
            "To remove quantization's harmonic distortion", 
            "To filter out frequencies above 20 kHz", 
            "To prevent the signal from clipping at 0 dBFS"
        ],
        correct: 1,
        insight: "Dither decorrelates the error from the signal, replacing harsh harmonic distortion with a benign, constant noise floor. It linearizes the 'staircase'."
    }
];

export const S09_KnowledgeGate: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [stage, setStage] = useState<'scan' | 'quiz' | 'mastered'>('scan');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/40' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const buttonBg = isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-inner' : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm';

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
    } else {
        setStage('mastered');
    }
  };

  const handleCheck = (idx: number) => {
    setSelected(idx);
    setShowResult(true);
  };

  if (stage === 'scan') {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-12 max-w-2xl mx-auto">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`w-32 h-32 rounded-full border-2 flex items-center justify-center relative ${isDarkMode ? 'border-orange-500/20 bg-orange-500/5 shadow-orange-500/10' : 'border-orange-200 bg-orange-50'}`}
             >
                  <Lock className={accentColor} size={40} />
                  <motion.div 
                    animate={{ height: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-x-0 top-0 bg-orange-500/20 blur-sm" 
                  />
             </motion.div>
             <div className="space-y-4 text-center">
                <h2 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>Mastery Verification</h2>
                <p className={`text-sm font-medium opacity-60 leading-relaxed ${textColor}`}>
                    The Digital Bridge is a high-security zone. Verify your engineering knowledge to finalize your clearance.
                </p>
             </div>
             <motion.button 
                onClick={() => setStage('quiz')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: isDarkMode ? ["0 0 20px rgba(249,115,22,0.1)", "0 0 50px rgba(249,115,22,0.3)", "0 0 20px rgba(249,115,22,0.1)"] : "none" }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-orange-500 text-black shadow-orange-500/40' : 'bg-orange-600 text-white shadow-orange-600/40'}`}
             >
                Initiate Biometric Link
             </motion.button>
          </div>
      );
  }

  if (stage === 'mastered') {
    return (
        <div className="flex flex-col gap-12 max-w-5xl mx-auto py-12 text-left">
            <header className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/20">
                    <Award className="text-white" size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>Clearance <span className="text-green-500">Granted</span></h2>
                    <p className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black opacity-30 ${textColor}`}>Verification ID: V_CORE_2026_MASTER</p>
                </div>
            </header>

            <div className={`p-12 rounded-[4rem] border shadow-2xl space-y-12 relative overflow-hidden ${isDarkMode ? 'bg-black/60 border-green-500/20' : 'bg-white border-green-200 shadow-xl'}`}>
                {/* BINARY CELEBRATION */}
                <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div 
                            key={i}
                            initial={{ y: -100, x: Math.random() * 1000 }}
                            animate={{ y: 2000 }}
                            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
                            className={`text-[8px] font-mono font-black ${isDarkMode ? 'text-green-500' : 'text-green-800'}`}
                        >
                            {Math.random() > 0.5 ? '1' : '0'}
                        </motion.div>
                    ))}
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
                     <CheckCircle2 size={300} className="text-green-500" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {[
                        { icon: Activity, title: "The Nyquist Shield", desc: "You've mastered the law of Sampling. Taking 2x snapshots is the minimum for survival in the digital world." },
                        { icon: Database, title: "Precision Mapping", desc: "You understand the ladder. Every bit you add doubles the rungs and lowers the noise floor by 6dB." },
                        { icon: Zap, title: "Linearization Aura", desc: "You've harnessed Dither. Noise is no longer an enemy, but a secret tool to shake the bits free." },
                        { icon: Terminal, title: "Silicon Architect", desc: "You can choose the right silicon for the right job. From Speed Demons to Efficiency Masters." }
                    ].map((item, i) => (
                        <div key={i} className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                             <item.icon size={20} className="text-green-500 mb-6" />
                             <h4 className={`text-lg font-black italic tracking-tighter mb-2 ${textColor}`}>{item.title}</h4>
                             <p className={`text-xs leading-relaxed opacity-60 ${textColor}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center justify-between pt-10 border-t border-dashed border-green-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className={`text-[11px] font-mono uppercase tracking-[0.2em] font-black opacity-40 ${textColor}`}>Accessing Module 03...</span>
                    </div>
                    <button className={`px-16 py-7 rounded-full font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500 ${isDarkMode ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/20'}`}>
                        Enter V-CORE
                    </button>
                </div>
            </div>

            <TechnicalAudit 
                isDarkMode={isDarkMode}
                showFullView={true}
                specs={{
                    concept: "The Bridge Complete: You have traversed the Digital Bridge. Sampling discretizes time, Quantization discretizes amplitude, and Reconstruction recovers liquid reality. The analog world is now a list of numbers.",
                    physical: "The Finite Compromise: Every digital system accepts a bounded loss (quantization noise) to gain infinite reproducibility and immunity to the 'Entropy of Analog'. Digital is the strategy of absolute control.",
                    formal: "Mastery Verification: You've validated that reconstruction is an exact recovery if Nyquist is satisfied, and that bit depth determines the theoretical dynamic range (6.02 dB per bit).",
                    insight: "Future Horizon: These formatted numbers are now ready for the next layer. You are prepared to enter Module 3, where raw samples are transformed into logic, algorithms, and binary computation.",
                    advanced: [
                        {
                            title: "Metastability in Logic",
                            content: "At the gate level, when a sample changes states exactly as a clock edge arrives, the logic gate can enter a metastable state—neither 0 nor 1. High-speed ADCs use synchronizers to mitigate this 'Silicon Indecision'."
                        },
                        {
                            title: "Energy of a Bit",
                            content: "In ultra-low-power edge computing, moving a single bit from the ADC to memory can cost more energy than the conversion itself. Designers use data-compression-at-source to minimize this 'Communication Tax'."
                        }
                    ]
                }}
            />
        </div>
    );
  }

  const q = QUESTIONS[currentIdx];

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto py-12 text-left">
      <header className="flex items-center gap-8 px-4">
        <div className={`p-5 rounded-3xl border shadow-xl transition-all duration-500 ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-50 border-orange-100'}`}>
            <ShieldAlert className={accentColor} size={28} />
        </div>
        <div className="space-y-2">
            <h2 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>Challenge <span className={accentColor}>0{currentIdx + 1}</span></h2>
            <p className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black opacity-30 ${textColor}`}>Mastery Gate Verification</p>
        </div>
      </header>

      <div className={`p-10 md:p-14 rounded-[4rem] border space-y-12 shadow-2xl relative overflow-hidden transition-all duration-700 ${cardBg}`}>
        <div className="absolute top-0 right-0 p-12 select-none pointer-events-none">
            <span className={`text-[80px] font-black italic ${isDarkMode ? 'text-white/[0.03]' : 'text-black/[0.03]'}`}>
                {currentIdx + 1}
            </span>
        </div>

        <div className="space-y-12 relative z-10">
            <p className={`text-3xl font-black leading-tight pr-14 ${textColor}`}>{q.text}</p>
            
            <div className="grid grid-cols-1 gap-6">
                {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const isSelected = i === selected;
                    
                    return (
                        <button 
                            key={i} disabled={showResult} onClick={() => handleCheck(i)}
                            className={`
                                w-full p-8 rounded-[3rem] border text-left transition-all duration-500 flex justify-between items-center group
                                ${showResult && isCorrect 
                                    ? (isDarkMode ? 'bg-green-500/10 border-green-500 text-white shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'bg-green-50 border-green-500 text-green-900') 
                                    : showResult && isSelected 
                                    ? (isDarkMode ? 'bg-red-500/10 border-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-red-50 border-red-500 text-red-900') 
                                    : buttonBg}
                            `}
                        >
                            <div className="flex flex-col">
                                <span className={`text-lg font-black tracking-tight ${showResult && !isCorrect && !isSelected ? 'opacity-30' : ''}`}>{opt}</span>
                                {showResult && isSelected && (
                                    <motion.span 
                                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                        className={`text-[9px] font-black uppercase tracking-widest mt-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {isCorrect ? 'VERIFIED: CORRECT' : 'AUDIT FAILED: INCORRECT'}
                                    </motion.span>
                                )}
                            </div>
                            {showResult && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                            {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
                            {!showResult && <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-orange-500" size={20} />}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className={`p-12 rounded-[3.5rem] border space-y-6 shadow-inner relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}
                    >
                        <div className={`p-3 rounded-xl inline-flex border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                             <Cpu size={14} className={accentColor} />
                        </div>
                        <div className="space-y-4">
                            <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black ${accentColor}`}>Engineer's Logic Audit</span>
                            <p className={`text-lg leading-relaxed font-medium italic opacity-70 ${textColor}`}>
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    "{q.insight}"
                                </motion.span>
                            </p>
                        </div>
                        
                        <div className="flex justify-end pt-6">
                            <button 
                                onClick={handleNext}
                                className={`flex items-center gap-6 px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all duration-500 shadow-2xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black shadow-black/20'}`}
                            >
                                {currentIdx < QUESTIONS.length - 1 ? 'Next Validation' : 'Secure Mastery'} <ChevronRight size={18} />
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
