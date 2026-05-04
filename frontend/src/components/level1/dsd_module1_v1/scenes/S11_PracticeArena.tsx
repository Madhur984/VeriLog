import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, AlertCircle, CheckCircle2, ArrowRight, Brain, Zap, Cpu, Gauge } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const QUESTIONS = [
  {
    id: 1,
    q: "A truth table has 6 ones and 2 zeros. Which form is more area-efficient?",
    options: ["SOP (Σm)", "POS (ΠM)", "They are equal"],
    ans: 1, // POS
    hint: "Think about the gate budget. Do you want to track 6 signals or block 2?",
    efficiencyBonus: 15,
    rationale: "POS only requires 2 maxterms (OR gates) plus an AND gate, whereas SOP would require 6 minterms (AND gates)."
  },
  {
    id: 2,
    q: "F = Σm(0, 1, 2, 4). How many gates are in the SOP implementation?",
    options: ["3 Gates", "4 Gates", "5 Gates"],
    ans: 2, // 5 (4 ANDs + 1 OR)
    hint: "Number of gates = Number of terms + 1 final aggregator.",
    efficiencyBonus: 10,
    rationale: "4 minterms (AND gates) feed into 1 final OR gate. Total = 5 gates."
  },
  {
    id: 3,
    q: "A chip has a budget of 4 gates. F = Σm(7). Is this design valid?",
    options: ["YES - 2 gates total", "NO - 5 gates total", "YES - 1 gate total"],
    ans: 0, // YES - 2 gates (1 AND + 1 aggregator/buffer)
    hint: "Single minterm means only one AND gate is needed.",
    efficiencyBonus: 20,
    rationale: "With only one minterm, we need 1 AND gate. Usually, an aggregator isn't even needed, but in 2-level logic, it's 2 gates max."
  }
];

export const S11_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  
  // Engineering Score Tracking
  const [score, setScore] = useState({
    accuracy: 0,
    efficiency: 0,
    total: 0
  });

  const question = QUESTIONS[currentIdx];
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const handleCheck = () => {
    const correct = selected === question.ans;
    setIsCorrect(correct);
    setShowRationale(true);
    
    if (correct) {
      setScore(prev => ({
        accuracy: prev.accuracy + 10,
        efficiency: prev.efficiency + question.efficiencyBonus,
        total: prev.total + 10 + question.efficiencyBonus
      }));
    }
  };

  const next = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsCorrect(null);
      setShowRationale(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-fuchsia-400">
            <Target size={14} />
            Chapter 11 · Certification Arena
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
            Engineering Audit
          </h2>
        </div>

        {/* Real-time Scoreboard */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-lg'} flex gap-6`}>
           <div className="text-center">
              <div className="text-[9px] uppercase tracking-widest opacity-40 font-mono mb-1">Accuracy</div>
              <div className="text-lg font-black text-emerald-400">{score.accuracy}</div>
           </div>
           <div className="w-px bg-white/5" />
           <div className="text-center">
              <div className="text-[9px] uppercase tracking-widest opacity-40 font-mono mb-1">Efficiency</div>
              <div className="text-lg font-black text-cyan-400">{score.efficiency}</div>
           </div>
           <div className="w-px bg-white/5" />
           <div className="text-center">
              <div className="text-[9px] uppercase tracking-widest opacity-40 font-mono mb-1">Grade</div>
              <div className="text-lg font-black text-fuchsia-400">
                {score.total > 50 ? 'L3' : score.total > 20 ? 'L2' : 'L1'}
              </div>
           </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-[2rem] border-2 transition-all ${cardBg} ${
              isCorrect === true ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10' : 
              isCorrect === false ? 'border-rose-500/50 shadow-2xl shadow-rose-500/10' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-8">
               <span className="w-8 h-8 rounded-full bg-fuchsia-500 text-white flex items-center justify-center font-black text-xs">
                 {currentIdx + 1}
               </span>
               <div className="h-px flex-1 bg-white/5" />
               <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Silicon Design Challenge</span>
            </div>

            <h3 className={`text-2xl font-black mb-8 leading-tight ${textColor}`}>
              {question.q}
            </h3>

            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={isCorrect !== null}
                  onClick={() => setSelected(i)}
                  className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group ${
                    selected === i
                      ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-400'
                      : `hover:border-white/20 border-transparent ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`
                  } ${isCorrect !== null && i === question.ans ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : ''} ${
                    isCorrect !== null && selected === i && i !== question.ans ? 'border-rose-500 bg-rose-500/10 text-rose-400' : ''
                  }`}
                >
                  {opt}
                  {selected === i && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              {isCorrect === null ? (
                <button
                  onClick={handleCheck}
                  disabled={selected === null}
                  className="flex-1 py-4 bg-fuchsia-500 disabled:opacity-30 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-fuchsia-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Verify Blueprint
                </button>
              ) : (
                <button
                  onClick={next}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {currentIdx === QUESTIONS.length - 1 ? 'Final Review' : 'Next Challenge'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showRationale && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    {isCorrect ? <CheckCircle2 className="text-emerald-400" size={18} /> : <AlertCircle className="text-rose-400" size={18} />}
                  </div>
                  <div>
                    <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? 'Design Validated' : 'Design Flaw Detected'}
                    </div>
                    <p className={`text-sm ${subText}`}>{question.rationale}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Engineering Metrics */}
        <div className="space-y-6">
           <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="flex items-center gap-2 mb-6">
                 <Gauge size={14} className="text-cyan-400" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-black">Live Performance</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { l: 'Accuracy', v: `${(score.accuracy / (QUESTIONS.length * 10)) * 100}%`, c: 'text-emerald-400' },
                  { l: 'Gate Optimization', v: `${score.efficiency} pts`, c: 'text-cyan-400' },
                  { l: 'Pattern Bonus', v: 'Active', c: 'text-fuchsia-400' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-mono uppercase opacity-40">{m.l}</span>
                       <span className={`text-[10px] font-black ${m.c}`}>{m.v}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: m.v.includes('%') ? m.v : '60%' }}
                        className={`h-full ${m.c.replace('text', 'bg')}`} 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden group`}>
              <div className="flex items-center gap-2 mb-4">
                 <Brain size={14} className="text-fuchsia-400" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400 font-black">AI Tutor Hint</span>
              </div>
              <p className="text-xs italic opacity-60 leading-relaxed">
                "{question.hint}"
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Cpu size={100} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
