import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTerminal } from './DataTerminal';

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

export const TechnicalTerminal: React.FC = () => {
  const [domain, setDomain] = useState<keyof typeof QUESTION_BANK>('VLSI RTL');
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [stress, setStress] = useState(20);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  return (
    <DataTerminal title="INTERVIEW TERMINAL" subtitle="Stress Test Simulation" className="h-auto min-h-[500px]">
      <div className="flex flex-col lg:flex-row h-full p-6 gap-6 font-mono bg-[#050505]">
        
        {/* Main Terminal */}
        <div className="flex-1 flex flex-col border border-[#111] bg-black p-6 rounded-sm relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
             <div className="flex gap-4">
                {Object.keys(QUESTION_BANK).map(d => (
                  <button 
                    key={d} 
                    onClick={() => { setDomain(d as any); setQIndex(0); setAnswer(''); setFeedback(null); setStress(20); }}
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 ${domain === d ? 'bg-cyan-400 text-black font-bold' : 'text-slate-500 hover:text-cyan-400'}`}
                  >
                    {d}
                  </button>
                ))}
             </div>
             <div className="text-[10px] text-slate-500 uppercase">PROBE {qIndex + 1}/{QUESTION_BANK[domain].length}</div>
          </div>

          <div className="flex-1 space-y-6 relative z-10">
            <div className="text-cyan-400 text-sm">
              <span className="text-slate-500 mr-2">&gt;</span> 
              {QUESTION_BANK[domain][qIndex].q}
            </div>
            
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={`text-sm ${feedback.includes('ACCEPTABLE') ? 'text-green-400' : 'text-red-400'}`}
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
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest mt-4">Provide Answer:</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-32 bg-transparent border border-white/10 p-3 text-cyan-400 text-sm focus:outline-none focus:border-cyan-400 resize-none custom-scrollbar"
                  />
                  <button type="submit" className="hidden" />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stress Monitor */}
        <div className="w-full lg:w-48 border border-[#111] bg-black p-4 flex flex-col justify-between">
           <div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-4">Biometric Stress</div>
              <div className="text-3xl font-bold text-white mb-2">{stress}%</div>
              
              <div className="h-40 w-full flex items-end gap-1">
                {Array.from({ length: 15 }).map((_, i) => {
                  const h = Math.random() * stress;
                  return (
                    <motion.div 
                      key={i}
                      className="flex-1 bg-cyan-400"
                      initial={{ height: '0%' }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        backgroundColor: stress > 70 ? '#ef4444' : stress > 40 ? '#f59e0b' : '#22d3ee',
                        opacity: i > 10 ? 0.3 : 1 // Fade end bars for aesthetic
                      }}
                    />
                  )
                })}
              </div>
           </div>

           <div className="space-y-2">
             <div className="text-[9px] text-slate-500 uppercase">Keyword Hits</div>
             <div className="text-sm text-cyan-400">Monitoring...</div>
           </div>
        </div>
      </div>
    </DataTerminal>
  );
};
