import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTerminal } from './DataTerminal';
import { useColorScheme } from '../../../hooks/useColorScheme';

const QUESTION_BANK = {
  'VLSI RTL': [
    { q: "Explain the difference between blocking and non-blocking assignments.", keywords: ["sequential", "combinational", "<=", "="] },
    { q: "How do you avoid latches in combinational logic?", keywords: ["default", "else", "complete coverage"] },
    { q: "What is setup and hold time?", keywords: ["clock", "data window", "violation", "capture"] },
  ],
  'Embedded C': [
    { q: "What does the 'volatile' keyword do?", keywords: ["optimization", "hardware", "interrupt", "memory"] },
    { q: "Explain ISR (Interrupt Service Routine).", keywords: ["hardware", "context switch", "vector table"] },
  ],
  'RF Basics': [
    { q: "What is the 1dB compression point?", keywords: ["linearity", "gain", "saturation"] },
    { q: "Explain Smith Chart applications.", keywords: ["impedance", "matching", "reflection coefficient"] },
  ]
};

interface TechnicalTerminalProps {
  onUpdateQuizScore?: (domainId: string, score: number) => void;
}

export const TechnicalTerminal: React.FC<TechnicalTerminalProps> = ({ onUpdateQuizScore }) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [domain, setDomain] = useState<keyof typeof QUESTION_BANK>('VLSI RTL');
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [stress, setStress] = useState(20);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Stable random seed for stress bars — only regenerate on question changes, not on stress changes (prevents jitter while typing)
  const stressBarHeights = useRef<number[]>(Array.from({ length: 15 }, () => Math.random()));
  useEffect(() => {
    stressBarHeights.current = Array.from({ length: 15 }, () => Math.random());
  }, [domain, qIndex]);

  useEffect(() => {
    let timer: any;
    if (!feedback) {
      timer = setInterval(() => {
        setStress(s => Math.min(100, s + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback, qIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const currentQ = QUESTION_BANK[domain][qIndex];
    let matchedKeywords = 0;
    currentQ.keywords.forEach(kw => {
      if (answer.toLowerCase().includes(kw.toLowerCase())) matchedKeywords++;
    });

    if (matchedKeywords >= currentQ.keywords.length / 2) {
      setFeedback("ACCEPTABLE. Moving to next probe...");
      
      if (onUpdateQuizScore) {
        const domainMap: Record<string, string> = {
          'VLSI RTL': 'vlsi',
          'Embedded C': 'embedded',
          'RF Basics': 'wireless',
        };
        onUpdateQuizScore(domainMap[domain] || 'vlsi', 100);
      }

      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
        setStress(20);
        setQIndex((i) => (i + 1) % QUESTION_BANK[domain].length);
      }, 2000);
    } else {
      setFeedback("INSUFFICIENT. Missing critical keywords.");
      setStress(s => Math.min(100, s + 20));
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const accentColor = isLight ? '#0369A1' : '#22d3ee';

  return (
    <DataTerminal title="INTERVIEW TERMINAL" subtitle="Stress Test Simulation" className="h-auto min-h-[500px]">
      <div className={`flex flex-col lg:flex-row h-full p-6 gap-6 font-mono ${
        isLight ? 'bg-bg-base' : 'bg-[#050505]'
      }`}>
        
        {/* Main Terminal */}
        <div className={`flex-1 flex flex-col border p-6 rounded-sm relative overflow-hidden ${
          isLight ? 'bg-bg-elev border-border-soft' : 'bg-black border-[#111]'
        }`}>
          <div className={`absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] ${isLight ? 'opacity-[0.03]' : ''}`} />
          
          <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isLight ? 'border-border-soft' : 'border-white/10'}`}>
             <div className="flex gap-4">
                {Object.keys(QUESTION_BANK).map(d => (
                  <button 
                    key={d} 
                    onClick={() => { setDomain(d as any); setQIndex(0); setAnswer(''); setFeedback(null); setStress(20); }}
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                      domain === d 
                        ? (isLight ? 'bg-signal-core text-white font-bold' : 'bg-cyan-400 text-black font-bold') 
                        : 'text-text-dim hover:text-signal-core'
                    }`}
                  >
                    {d}
                  </button>
                ))}
             </div>
             <div className="text-[10px] text-text-dim uppercase">PROBE {qIndex + 1}/{QUESTION_BANK[domain].length}</div>
          </div>

          <div className="flex-1 space-y-6 relative z-10">
            <div style={{ color: accentColor }} className="text-sm">
              <span className="text-text-dim mr-2">&gt;</span> 
              {QUESTION_BANK[domain][qIndex].q}
            </div>
            
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={`text-sm ${feedback.includes('ACCEPTABLE') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  [SYSTEM] {feedback}
                </motion.div>
              ) : (
                <motion.form 
                  key="input"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2"
                >
                  <label className="text-[10px] text-text-dim uppercase tracking-widest mt-4">Provide Answer:</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    className={`w-full h-32 bg-transparent border p-3 text-sm focus:outline-none resize-none custom-scrollbar ${
                      isLight 
                        ? 'border-border-soft text-signal-core focus:border-signal-core' 
                        : 'border-white/10 text-cyan-400 focus:border-cyan-400'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Ctrl + Enter to submit</span>
                    <button 
                      type="submit" 
                      className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border rounded transition-all ${
                        isLight 
                          ? 'border-signal-core text-signal-core hover:bg-signal-core hover:text-white' 
                          : 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400 hover:text-black'
                      }`}
                    >
                      SUBMIT
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stress Monitor */}
        <div className={`w-full lg:w-48 border p-4 flex flex-col justify-between ${
          isLight ? 'bg-bg-elev border-border-soft' : 'bg-black border-[#111]'
        }`}>
           <div>
              <div className="text-[10px] uppercase tracking-widest mb-4" style={{ color: accentColor }}>Biometric Stress</div>
              <div className="text-3xl font-bold text-text-main mb-2">{stress}%</div>
              
              <div className="h-40 w-full flex items-end gap-1">
                {stressBarHeights.current.map((seed, i) => {
                  const h = seed * stress;
                  return (
                    <motion.div 
                      key={i}
                      className="flex-1"
                      initial={{ height: '0%' }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      style={{ 
                        backgroundColor: stress > 70 ? '#ef4444' : stress > 40 ? '#f59e0b' : accentColor,
                        opacity: i > 10 ? 0.3 : 1
                      }}
                    />
                  )
                })}
              </div>
           </div>

           <div className="space-y-2">
             <div className="text-[9px] text-text-dim uppercase">Keyword Hits</div>
             <div className="text-sm" style={{ color: accentColor }}>Monitoring...</div>
           </div>
        </div>
      </div>
    </DataTerminal>
  );
};
