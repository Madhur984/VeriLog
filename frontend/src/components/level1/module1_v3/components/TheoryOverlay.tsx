import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const TheoryOverlay: React.FC = () => {
  const { theoryMode, toggleTheoryMode, frequency } = useSignalStore();
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState({ q1: "" });

  const sections = [
    {
      id: "01",
      title: "DEFINITION",
      content: "Signal = A function of variables representing a physical phenomenon.",
      technical: "In this module, s(t) maps physical changes into the digital domain."
    },
    {
      id: "02",
      title: "TYPES",
      content: "Analog → Continuous. Digital → Discrete.\nDeterministic → Predictable. Random → Stochastic.\nPeriodic → Repeating. Aperiodic → Non-Repeating.",
      technical: "Classification determines the processing complexity."
    },
    {
      id: "03",
      title: "PARAMETERS",
      content: "A → Amplitude (Energy)\nf → Frequency (Rate)\nt → Time (Domain)\nη → Noise (Distortion)\nφ → Phase (Shift)",
      technical: "These parameters form the DNA of any communication system."
    },
    {
      id: "04",
      title: "DSP PIPELINE",
      content: "Analog Source → ADC → Processing → DAC → Analog Sink",
      technical: "Analog to Digital Conversion (ADC) is the bridge to logic."
    },
    {
      id: "05",
      title: "BASIC SIGNALS",
      content: "Step → State change (0 → 1)\nImpulse → Instant spike\nRamp → Linear growth\nParabolic → Quadratic growth",
      technical: "Elementary building blocks of complex systems."
    },
    {
      id: "06",
      title: "PERIODIC MODEL",
      content: "x(t) = A cos(ωt + φ)",
      technical: "The fundamental harmonic oscillation model."
    },
    {
      id: "07",
      title: "APPLICATIONS",
      content: "Audio Systems // Communication // Medical Imaging // Radar // Sensors",
      technical: "DSP is the foundation of modern infrastructure."
    }
  ];

  return (
    <AnimatePresence>
      {theoryMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto pointer-events-auto p-12 md:p-24"
        >
          <div className="max-w-4xl mx-auto flex flex-col min-h-full">
            <header className="flex justify-between items-start border-b border-white/10 pb-16 mb-16">
              <div>
                <span className="micro-text text-v3-cyan tracking-[0.5em] opacity-60 uppercase">Technical Archive // v3.1</span>
                <h2 className="hero-text text-4xl mt-4">Signal Theory</h2>
              </div>
              <button 
                onClick={toggleTheoryMode}
                className="micro-text border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all uppercase"
              >
                [ CLOSE ]
              </button>
            </header>

            <div className="space-y-24 pb-32">
              {sections.map((sec) => (
                <section key={sec.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-baseline group">
                   <div className="micro-text text-v3-cyan opacity-40 group-hover:opacity-100 transition-opacity">
                     SEC // {sec.id}
                   </div>
                   <div className="md:col-span-2">
                     <h3 className="hero-text text-xl mb-6 opacity-40 tracking-wider group-hover:opacity-100 transition-opacity uppercase">{sec.title}</h3>
                     <p className="body-text text-2xl leading-relaxed mb-6 pre-line">{sec.content}</p>
                     <p className="micro-text opacity-30 italic leading-loose uppercase tracking-widest">{sec.technical}</p>
                   </div>
                </section>
              ))}
            </div>

            <footer className="mt-auto pt-16 border-t border-white/5 flex flex-col items-center gap-12">
              {!showQuestions ? (
                <button 
                  onClick={() => setShowQuestions(true)}
                  className="px-12 py-4 border border-v3-cyan text-v3-cyan bg-v3-cyan/5 tracking-[0.4em] uppercase hover:scale-105 transition-all"
                >
                  Start System Verification
                </button>
              ) : (
                <div className="w-full space-y-12 pb-24">
                  <header className="text-center opacity-40 micro-text tracking-[0.5em] mb-12">Verification // Hybrid Logic</header>
                  
                  <div className="bg-white/5 p-12 rounded-sm border border-white/10">
                    <h4 className="micro-text text-v3-cyan mb-4">Q1 // CONCEPTUAL</h4>
                    <p className="hero-text text-2xl mb-8">What defines a signal at its most fundamental level?</p>
                    <div className="flex gap-4">
                      {["VARIATION", "CONSTANCY", "VOID"].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setAnswers({...answers, q1: opt})}
                          className={`px-6 py-2 border text-xs tracking-widest ${answers.q1 === opt ? 'bg-v3-cyan text-black border-v3-cyan' : 'border-white/20'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 p-12 rounded-sm border border-white/10">
                    <h4 className="micro-text text-v3-cyan mb-4">Q2 // INTERACTION</h4>
                    <p className="hero-text text-2xl mb-4">Increase frequency above 1.8 Hz.</p>
                    <div className={`micro-text ${frequency > 1.8 ? 'text-v3-cyan' : 'opacity-40'}`}>
                      {frequency > 1.8 ? "SUCCESS // PARAMETER MET" : "SYSTEM WAITING..."}
                    </div>
                  </div>

                  {answers.q1 === "VARIATION" && frequency > 1.8 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-12">
                      <button 
                        onClick={() => window.location.href = '/'} // End of Module 1
                        className="px-16 py-6 border-2 border-v3-cyan text-v3-cyan text-xl tracking-[0.3em] font-bold hover:bg-v3-cyan hover:text-black transition-all"
                      >
                        CLOSE MODULE
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
              
              <div className="w-full flex justify-between items-center opacity-20">
                <div className="micro-text">Module 1 // Final Verification</div>
                <div className="micro-text tracking-[0.3em]">Validation Mode: {showQuestions ? "ACTIVE" : "PENDING"}</div>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
