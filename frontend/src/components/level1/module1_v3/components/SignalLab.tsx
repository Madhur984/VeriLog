import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { useTaskStore } from '../store/taskStore';

export const SignalLab: React.FC = () => {
  const { amplitude, frequency, noise, stability, toggleTheoryMode } = useSignalStore();
  const { currentTask, setTask } = useTaskStore();

  const tasks = [
    "",
    "Stabilize medium energy",
    "Increase signal density",
    "Maintain under noise",
    "Achieve clean signal",
    "Stabilize system"
  ];

  const getStatus = (stability: number) => {
    if (stability < 0.3) return "UNSTABLE";
    if (stability < 0.6) return "CHAOTIC";
    if (stability < 0.8) return "STABILIZING";
    return "STABLE";
  };

  useEffect(() => {
    if (currentTask === 0) setTask(1);
    
    // Final Completion Logic
    if (currentTask > 5) {
      const timer = setTimeout(() => {
        toggleTheoryMode();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, setTask, toggleTheoryMode]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      
      {/* 🧠 TASK (TOP CENTER) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentTask}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="micro-text text-v3-cyan opacity-40 uppercase tracking-[0.4em] mb-2">Current Objective</div>
          <div className="hero-text text-xl uppercase tracking-widest text-[#E6F9FF] shadow-sm">
            {currentTask <= 5 ? tasks[currentTask] : "SYSTEM MASTERED"}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 📊 STATUS (BOTTOM LEFT) */}
      <div className="absolute bottom-12 left-12 flex flex-col items-start gap-1">
        <div className="micro-text opacity-40 uppercase tracking-widest">System State</div>
        <div className={`hero-text text-sm tracking-[0.2em] ${stability > 0.8 ? 'text-v3-cyan' : 'text-white'}`}>
          STATE: {getStatus(stability)}
        </div>
      </div>

      {/* 🎛️ VALUES (BOTTOM RIGHT) */}
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 text-right">
        <div className="micro-text opacity-40 uppercase tracking-widest">Live Metrics</div>
        <div className="micro-text text-xs text-white/60 font-mono">
          A: {amplitude.toFixed(2)}<br/>
          F: {frequency.toFixed(2)}<br/>
          N: {noise.toFixed(2)}
        </div>
      </div>

      {/* 🏆 COMPLETION OVERLAY */}
      {currentTask > 5 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
        >
          <div className="text-center">
            <h2 className="hero-text text-3xl mb-4">MASTERY ACHIEVED</h2>
            <p className="micro-text opacity-60">Redirecting to Signal Theory...</p>
          </div>
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-text {
          text-shadow: 0 0 6px rgba(0,0,0,0.6), 0 0 12px rgba(0,0,0,0.4);
        }
        .micro-text {
          text-shadow: 0 0 4px rgba(0,0,0,0.5);
        }
      `}} />
    </div>
  );
};
