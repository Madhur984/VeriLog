import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';

export const TheoryOverlay: React.FC = () => {
  const { theoryMode, toggleTheoryMode, scene } = useSignalStore();

  const getSceneTheory = (s: number) => {
    switch (s) {
      case 1: return {
        title: "S01 // IDENTITY",
        l1: "A signal is a function of one or more variables representing a physical phenomenon.",
        l2: "Examples: Sound waves, voltage, temperature, motion.",
        formula: "s(t) = f(x, y, z, ...)",
        mapping: "DEFINITION"
      };
      case 2: return {
        title: "S02 // VARIATION",
        l1: "Variation exists in every system. Signals classify this variation.",
        l2: "Analog vs Digital. Periodic vs Aperiodic. Deterministic vs Random.",
        formula: "S ⊂ {Analog, Digital}",
        mapping: "TAXONOMY"
      };
      case 3: return {
        title: "S03 // TEMPORALITY",
        l1: "Time is the carrier. Without duration, information cannot unfold.",
        l2: "Signals exist only in the unfolding of 'now'.",
        formula: "s(t) | t ∈ ℝ",
        mapping: "TIME"
      };
      case 4: return {
        title: "S04 // ENERGY",
        l1: "Energy is expressed as amplitude. Higher amplitude means higher intensity.",
        l2: "In electrical systems, this often maps to Voltage (V).",
        formula: "E ∝ A²",
        mapping: "AMPLITUDE"
      };
      case 5: return {
        title: "S05 // PARAMETRIC DNA",
        l1: "Amplitude (A) and Frequency (f) define the fundamental essence of periodic waveforms.",
        l2: "Changing 'f' changes the rate of information transfer.",
        formula: "s(t) = A sin(2πft + φ)",
        mapping: "PARAMETERS"
      };
      case 6: return {
        title: "S06 // ELEMENTARY",
        l1: "Complex signals are combinations of basic forms: Step, Impulse, and Ramp.",
        l2: "Unit Step u(t) represents a sudden state change.",
        formula: "u(t) = {1, t≥0; 0, t<0}",
        mapping: "BUILDING BLOCKS"
      };
      case 7: return {
        title: "S07 // INTERFERENCE",
        l1: "Unwanted disturbance is Noise (η). It represents uncertainty and entropy.",
        l2: "Signal-to-Noise Ratio (SNR) determines the quality of communication.",
        formula: "SNR = P_signal / P_noise",
        mapping: "ENTROPY"
      };
      case 8: return {
        title: "S08 // PROCESSING",
        l1: "Signals can be modified using Digital Signal Processing (DSP).",
        l2: "The pipeline: Analog → ADC → Filter → DAC → Analog.",
        formula: "y[n] = ∑ x[k] h[n-k]",
        mapping: "PIPELINE"
      };
      case 9: return {
        title: "S09 // GEOMETRIC",
        l1: "Waveform geometry (Triangle, Square) arises from harmonic composition.",
        l2: "Square waves contain only odd harmonics.",
        formula: "x(t) = sign(sin(t))",
        mapping: "GEOMETRY"
      };
      case 10: return {
        title: "S10 // REAL WORLD",
        l1: "Signals are the universal language. From heartbeat to orbital mechanics.",
        l2: "Everything that changes is information.",
        formula: "I = -log₂(P)",
        mapping: "EXISTENCE"
      };
      case 11: return {
        title: "S11 // SYNTHESIS",
        l1: "Stability is the state of perfect parameter alignment.",
        l2: "When A, f, and η reach optimal values, coherence is achieved.",
        formula: "Ψ = ∫ |s(t)|² dt → 1",
        mapping: "COHERENCE"
      };
      default: return {
        title: "SIGNAL OVERVIEW",
        l1: "Acquire the signals. Understand the change.",
        l2: "Proceed to initiate laboratory analysis.",
        formula: "Σ Information",
        mapping: "CORE"
      };
    }
  };

  const data = getSceneTheory(scene);

  return (
    <AnimatePresence>
      {theoryMode && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="theory-overlay pointer-events-auto"
        >
          <div className="theory-overlay-content">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
              <div>
                <span className="micro-text text-v3-cyan opacity-60">Theoretical Context</span>
                <h2 className="hero-text text-2xl mt-2">{data.title}</h2>
              </div>
              <button 
                onClick={toggleTheoryMode}
                className="micro-text hover:text-white transition-colors p-2 border border-white/10"
              >
                [ CLOSE ]
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
              <section className="theory-section">
                <h3 className="micro-text text-v3-cyan mb-4">Core Principles</h3>
                <p className="body-text text-xl leading-relaxed">{data.l1}</p>
                <div className="mt-12 opacity-40 micro-text">Technical Insight:</div>
                <p className="body-text opacity-60 italic mt-2">{data.l2}</p>
              </section>

              <section className="theory-section bg-white/[0.02] p-8 border border-white/5 rounded-sm">
                <h3 className="micro-text text-v3-cyan mb-4">Mathematical Model</h3>
                <pre className="hero-text text-xl opacity-90 mb-8 font-mono">{data.formula}</pre>
                <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
                  <span className="micro-text">Domain // {data.mapping}</span>
                  <span className="micro-text">v3.01.2025</span>
                </div>
              </section>
            </div>
            
            <footer className="mt-auto pt-12 border-t border-white/5 flex justify-between items-center opacity-20">
              <div className="micro-text">Laboratory // Module 1 // Acquisition</div>
              <div className="micro-text tracking-[0.4em]">RESEARCH SESSION ACTIVE</div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
