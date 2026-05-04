import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Timer, Zap, Trophy, RefreshCw, ChevronRight, Brain } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const QUESTIONS = [
  { q: "Row (R=1, A=0, W=1) is which index?", a: "5", type: "text" },
  { q: "Minterm for (0, 1, 1)?", a: "R'·A·W", type: "choice", options: ["R·A'·W'", "R'·A·W", "R·A·W", "R+A'+W'"] },
  { q: "Mostly 1s in Truth Table. Use?", a: "POS", type: "choice", options: ["SOP", "POS"] },
  { q: "Maxterm for (1, 1, 0)?", a: "R'+A'+W", type: "choice", options: ["R·A·W'", "R'+A'+W", "R+A+W'", "R'·A'·W"] },
  { q: "Binary 110 is decimal?", a: "6", type: "text" },
  { q: "SOP uses which rows?", a: "1", type: "choice", options: ["0", "1"] },
  { q: "Is m3 = R'·A·W?", a: "YES", type: "choice", options: ["YES", "NO"] },
  { q: "Budget is 5 gates. Design uses 6. Status?", a: "FAIL", type: "choice", options: ["PASS", "FAIL"] },
  { q: "Minterm index for R·A·W'?", a: "6", type: "text" },
  { q: "POS is Product of ...?", a: "SUMS", type: "choice", options: ["PRODUCTS", "SUMS"] },
];

export const S13_BossDrill: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [stage, setStage] = useState<'intro' | 'active' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userInput, setUserInput] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startDrill = () => {
    setStage('active');
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(30);
    setUserInput('');
  };

  const handleAnswer = (ans: string) => {
    const correct = ans.toUpperCase().replace(/\s/g, '') === QUESTIONS[currentIdx].a.toUpperCase().replace(/\s/g, '');
    if (correct) setScore(s => s + 1);
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setUserInput('');
    } else {
      endDrill();
    }
  };

  const endDrill = () => {
    setStage('result');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (stage === 'active' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endDrill();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage, timeLeft]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[600px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`p-12 rounded-3xl border-2 border-dashed border-fuchsia-500/30 text-center space-y-8 ${isDarkMode ? 'bg-fuchsia-500/5' : 'bg-fuchsia-50'}`}
          >
            <div className="w-20 h-20 bg-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-fuchsia-500/40 rotate-3">
              <ShieldAlert size={40} className="text-white" />
            </div>
            <div className="space-y-4">
              <h2 className={`text-4xl font-black ${textColor}`}>THE BOSS DRILL</h2>
              <p className="text-lg opacity-60 font-mono">10 Questions. 30 Seconds. Zero Hesitation.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left font-mono text-xs opacity-80">
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">◈ SOP/POS Logic</div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">◈ Binary Mapping</div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">◈ Gate Budgets</div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">◈ Rapid Recall</div>
            </div>
            <button 
              onClick={startDrill}
              className="px-12 py-4 bg-fuchsia-500 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-fuchsia-500/30"
            >
              INITIALIZE CHALLENGE
            </button>
          </motion.div>
        )}

        {stage === 'active' && (
          <motion.div 
            key="active"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-fuchsia-500/20 flex items-center justify-center">
                  <span className="font-mono font-bold text-fuchsia-500">{currentIdx + 1}</span>
                </div>
                <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                    className="h-full bg-fuchsia-500"
                  />
                </div>
              </div>
              <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-fuchsia-500'}`}>
                <Timer size={20} />
                <span className="text-2xl">{timeLeft}s</span>
              </div>
            </div>

            <div className={`p-12 rounded-3xl border-2 ${cardBg} shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Brain size={120} />
              </div>
              <h3 className={`text-3xl font-bold mb-12 relative z-10 ${textColor}`}>
                {QUESTIONS[currentIdx].q}
              </h3>

              {QUESTIONS[currentIdx].type === 'choice' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUESTIONS[currentIdx].options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className={`p-5 rounded-2xl border-2 font-mono text-lg font-bold transition-all ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:border-fuchsia-500 hover:bg-fuchsia-500/10' 
                          : 'bg-slate-50 border-slate-200 hover:border-fuchsia-500 hover:bg-fuchsia-500/5'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <input 
                    autoFocus
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswer(userInput)}
                    placeholder="Type answer..."
                    className={`w-full p-6 rounded-2xl border-2 bg-transparent font-mono text-2xl font-bold outline-none transition-all ${
                      isDarkMode ? 'border-white/10 focus:border-fuchsia-500' : 'border-slate-200 focus:border-fuchsia-500'
                    }`}
                  />
                  <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-center">Press Enter to Submit</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {stage === 'result' && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className={`p-12 rounded-3xl border-2 text-center space-y-8 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                <Trophy size={48} className="text-white" />
              </div>
              <div className="space-y-2">
                <h2 className={`text-4xl font-black ${textColor}`}>MISSION REPORT</h2>
                <p className={`text-6xl font-black text-emerald-500 font-mono`}>{score * 10}%</p>
                <p className="opacity-60 font-mono italic">
                  {score === QUESTIONS.length ? "Silicon Architect Grade: MASTER" : 
                   score > 7 ? "Silicon Architect Grade: SENIOR" :
                   score > 5 ? "Silicon Architect Grade: JUNIOR" : "Silicon Architect Grade: RETRAIN"}
                </p>
              </div>

              <div className="bg-black/20 p-6 rounded-2xl border border-white/10 max-w-sm mx-auto space-y-4">
                <div className="flex justify-between font-mono text-sm">
                  <span className="opacity-40">Correct Answers:</span>
                  <span className="text-emerald-400 font-bold">{score}/10</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="opacity-40">Time Efficiency:</span>
                  <span className="text-cyan-400 font-bold">{30 - timeLeft}s used</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={startDrill}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={16} /> RETRY
                </button>
                <button 
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  DEPLOY <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* Simulated Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
            >
               <div className="flex items-center gap-2 mb-6">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="font-mono text-xs uppercase tracking-widest opacity-40 text-amber-500 font-black">Global Architect Rankings</span>
               </div>
               <div className="space-y-4">
                  {[
                    { name: 'K1_ARCHITECT', score: 100, time: '14s', current: score === 10 },
                    { name: 'SILICON_VOYAGER', score: 90, time: '18s', current: false },
                    { name: 'YOU (CURRENT)', score: score * 10, time: `${30 - timeLeft}s`, current: true },
                    { name: 'GATE_MASTER_7', score: 80, time: '22s', current: false },
                    { name: 'LOGIC_FLUX', score: 70, time: '25s', current: false },
                  ].sort((a,b) => b.score - a.score).map((entry, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl border ${entry.current ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/5 opacity-60'}`}>
                       <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] opacity-20">#{i+1}</span>
                          <span className={`font-mono text-xs font-bold ${entry.current ? 'text-emerald-400' : ''}`}>{entry.name}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="font-mono text-xs">{entry.score}%</span>
                          <span className="font-mono text-[10px] opacity-40">{entry.time}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
