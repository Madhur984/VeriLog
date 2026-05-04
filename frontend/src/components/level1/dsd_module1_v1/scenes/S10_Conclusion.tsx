import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Layout, ArrowRight, ShieldCheck, Lock, Unlock, Cpu, Zap, Binary, BookOpen, Activity } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S10_Conclusion: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [testInputs, setTestInputs] = useState({ R: false, A: false, W: false });
  const [showCard, setShowCard] = useState(false);

  const { R, A, W } = testInputs;
  // F(R,A,W) = Σm(3, 5, 6, 7) from previous scenes
  const isUnlocked = (!R && A && W) || (R && !A && W) || (R && A && !W) || (R && A && W);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20"
        >
          <Trophy size={40} className="text-white" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className={`text-4xl md:text-6xl font-black ${textColor}`}>
            Mission Accomplished
          </h2>
          <p className={`text-lg font-mono uppercase tracking-[0.3em] text-emerald-400`}>
            Boolean Architect · Level 01
          </p>
        </div>
      </section>

      {/* Real World Bridge: The Greenhouse Lock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-black">Final Deployment Simulation</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className={`text-2xl font-black ${textColor}`}>Greenhouse Door Lock</h3>
            <p className={`text-sm ${subText}`}>
              You thought you were helping Ben with a picnic. But in engineering, 
              <strong> abstract logic is universal</strong>. The same SOP/POS equations 
              you built are currently powering this automated greenhouse lock.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              {['R', 'A', 'W'].map(k => (
                <button
                  key={k}
                  onClick={() => setTestInputs(p => ({ ...p, [k]: !p[k as keyof typeof p] }))}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                    testInputs[k as keyof typeof testInputs] 
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20' 
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  {k === 'R' ? 'Rain' : k === 'A' ? 'Alert' : 'Wind'} Sensor: {testInputs[k as keyof typeof testInputs] ? '1' : '0'}
                </button>
              ))}
            </div>
          </div>

          <div className={`aspect-video rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-500 ${
            isUnlocked ? 'bg-emerald-500/10 border-emerald-400/50' : 'bg-rose-500/10 border-rose-400/50'
          }`}>
             <motion.div
               animate={isUnlocked ? { rotateY: 0 } : { rotateY: 180 }}
               className="mb-4"
             >
               {isUnlocked ? <Unlock size={64} className="text-emerald-400" /> : <Lock size={64} className="text-rose-400" />}
             </motion.div>
             <div className={`font-mono text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-emerald-400' : 'text-rose-400'}`}>
               System Status: {isUnlocked ? 'ACCESS GRANTED' : 'LOCKED'}
             </div>
             <div className="text-[10px] opacity-40 font-mono mt-2 uppercase tracking-tighter">
               F(R,A,W) = Σm(3,5,6,7) Active
             </div>
          </div>
        </div>
      </motion.div>

      {/* Mental Compression Card */}
      <div className="text-center">
        <button
          onClick={() => setShowCard(!showCard)}
          className={`group flex items-center gap-3 mx-auto px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all ${
            showCard ? 'bg-fuchsia-500 text-white' : 'bg-white/5 border border-white/10 hover:border-fuchsia-500/50'
          }`}
        >
          <BookOpen size={18} />
          {showCard ? 'Close Mental Compression' : 'Open Mental Compression Card'}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-8 rounded-[2rem] border-4 border-fuchsia-500/30 ${isDarkMode ? 'bg-black' : 'bg-white shadow-2xl'} shadow-[0_0_50px_rgba(217,70,239,0.1)]`}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-black">
                  Rule 01 · SOP Architecture
                </div>
                <h4 className={`text-3xl font-black ${textColor}`}>The 1-Tracker</h4>
                <p className={`text-sm leading-relaxed ${subText}`}>
                  Focus on the <strong>ON</strong> rows. Every row that produces a <strong>1</strong> becomes a 3-input AND gate. We then OR them all together.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
                  <span className="text-fuchsia-400 italic">// Strategy Tip:</span><br/>
                  Use SOP when the truth table is <strong>Sparse</strong> (mostly 0s).
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase font-black">
                  Rule 02 · POS Architecture
                </div>
                <h4 className={`text-3xl font-black ${textColor}`}>The 0-Blocker</h4>
                <p className={`text-sm leading-relaxed ${subText}`}>
                  Focus on the <strong>OFF</strong> rows. Every row that produces a <strong>0</strong> becomes a 3-input OR gate (inverted inputs). We then AND them all together.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
                  <span className="text-fuchsia-400 italic">// Strategy Tip:</span><br/>
                  Use POS when the truth table is <strong>Dense</strong> (mostly 1s).
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[
                 { l: 'Gate Cost', v: 'Min is Win', i: <Cpu size={14}/> },
                 { l: 'Area Budget', v: '5 Gates Max', i: <Zap size={14}/> },
                 { l: 'Prop Delay', v: '2-Level Fix', i: <Activity size={14}/> },
                 { l: 'Language', v: 'Verilog Next', i: <Binary size={14}/> },
               ].map((d, i) => (
                 <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                    <div className="flex justify-center mb-1 text-fuchsia-400 opacity-60">{d.i}</div>
                    <div className="text-[9px] uppercase tracking-widest opacity-40 font-mono">{d.l}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>{d.v}</div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Silicon Impact Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        className={`p-10 rounded-[40px] border-2 border-emerald-500/30 bg-emerald-500/5 text-center relative overflow-hidden mt-12`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
        <h4 className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 font-black">Performance Audit // Final</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
           <div className="space-y-1">
              <div className="text-3xl font-black font-mono text-white">$12,500</div>
              <div className="text-[9px] opacity-40 uppercase tracking-widest font-mono">Estimated BOM Savings</div>
           </div>
           <div className="space-y-1">
              <div className="text-3xl font-black font-mono text-white">Top 2%</div>
              <div className="text-[9px] opacity-40 uppercase tracking-widest font-mono">Global Architect Tier</div>
           </div>
           <div className="hidden md:block space-y-1">
              <div className="text-3xl font-black font-mono text-white">0 ERRORS</div>
              <div className="text-[9px] opacity-40 uppercase tracking-widest font-mono">Logic Integrity Verified</div>
           </div>
        </div>

        {/* Floating Particles Simulation (CSS-based) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ y: 200, x: Math.random() * 400, opacity: 0 }}
               animate={{ y: -100, opacity: [0, 1, 0] }}
               transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
               className="absolute w-1 h-1 bg-emerald-400 rounded-full"
             />
           ))}
        </div>
      </motion.div>

      <div className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl border-2 border-dashed border-white/10 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} mt-12`}>
        <div className="space-y-2 mb-6 md:mb-0">
          <h3 className={`text-2xl font-black ${textColor}`}>Continue Your Journey</h3>
          <p className={`text-sm ${subText}`}>You've mastered canonical forms. Next: <strong>Logic Minimization</strong>.</p>
        </div>
        <button className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
          Initialize Module 02
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
