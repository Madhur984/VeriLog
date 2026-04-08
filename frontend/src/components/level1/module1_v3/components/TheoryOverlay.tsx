import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import {
  SineGraph, SquareGraph,
  NoiseGraph, RampGraph, LiveAmplitudeGraph
} from './GraphComponents';

// ─── THEORY SECTIONS WITH GRAPH TYPES ───────────────────────────────────────
const SECTIONS = [
  {
    id: '01', title: 'DEFINITION',
    graph: 'sine',
    body: 'A signal is a function of one or more variables that conveys information about a physical phenomenon.',
    technical: 's(t) maps physical change into the digital domain.',
  },
  {
    id: '02', title: 'ANALOG vs DIGITAL',
    graph: 'square',
    body: 'Analog signals are continuous. Digital signals are discrete, representing state as 0 or 1.',
    technical: 'Discretization introduces quantization error. ADC bridges both worlds.',
  },
  {
    id: '03', title: 'NOISE',
    graph: 'noise',
    body: 'Noise is unwanted random variation superimposed on the true signal. It degrades information quality.',
    technical: 'SNR = Signal Power / Noise Power. Higher SNR = better channel.',
  },
  {
    id: '04', title: 'PARAMETERS',
    graph: 'ramp',
    body: 'Every signal has four dimensions: Amplitude (A), Frequency (f), Phase (φ), and Noise (η).',
    technical: 'x(t) = A · cos(2πft + φ) + η(t)',
  },
  {
    id: '05', title: 'LIVE SIGNAL',
    graph: 'live',
    body: 'Your current signal, rendered in real time. Amplitude controls energy. Frequency controls repetition.',
    technical: 'Interact with the canvas to observe parameter changes.',
  },
] as const;

type GraphType = 'sine' | 'square' | 'noise' | 'ramp' | 'live';

const GraphBlock: React.FC<{ type: GraphType; amplitude?: number; frequency?: number }> = ({
  type, amplitude = 0.5, frequency = 1.4,
}) => {
  const wrapperClass = 'w-full rounded-sm bg-white/[0.02] border border-white/[0.06] p-4 mb-4';
  switch (type) {
    case 'sine':    return <div className={wrapperClass}><SineGraph /></div>;
    case 'square':  return <div className={wrapperClass}><SquareGraph /></div>;
    case 'noise':   return <div className={wrapperClass}><NoiseGraph /></div>;
    case 'ramp':    return <div className={wrapperClass}><RampGraph /></div>;
    case 'live':    return <div className={wrapperClass}><LiveAmplitudeGraph amplitude={amplitude} frequency={frequency} /></div>;
  }
};

// ─── VERIFICATION QUESTIONS ──────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'q1', label: 'Q1 // CONCEPTUAL',
    question: 'What defines a signal at its fundamental level?',
    options: ['VARIATION', 'CONSTANCY', 'VOID'],
    correct: 'VARIATION',
    type: 'choice' as const,
  },
  {
    id: 'q2', label: 'Q2 // INTERACTION',
    question: 'Increase frequency above 1.8 Hz using the canvas.',
    type: 'interaction' as const,
  },
  {
    id: 'q3', label: 'Q3 // INTERACTION',
    question: 'Reduce noise below 0.1 by scrolling down.',
    type: 'noise' as const,
  },
];

// ─── MAIN OVERLAY ────────────────────────────────────────────────────────────
export const TheoryOverlay: React.FC = () => {
  const { theoryMode, toggleTheoryMode, frequency, noise, amplitude } = useSignalStore();
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q1Pass = answers.q1 === 'VARIATION';
  const q2Pass = frequency > 1.8;
  const q3Pass = noise < 0.1;
  const allPass = q1Pass && q2Pass && q3Pass;

  return (
    <AnimatePresence>
      {theoryMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] overflow-y-auto pointer-events-auto"
          style={{ background: 'rgba(14,17,22,0.97)', backdropFilter: 'blur(16px)' }}
        >
          <div className="max-w-3xl mx-auto px-8 py-20 md:px-16 md:py-24">

            {/* ── HEADER ── */}
            <header className="flex justify-between items-start mb-20 pb-8 border-b border-white/[0.07]">
              <div>
                <div className="micro-text mb-3 tracking-[0.4em] opacity-60">Technical Archive // v3.1</div>
                <h2 className="hero-text text-3xl">Signal Theory</h2>
              </div>
              <button onClick={toggleTheoryMode} className="theory-btn">
                [ CLOSE ]
              </button>
            </header>

            {/* ── SECTIONS WITH GRAPHS ── */}
            <div className="space-y-20 mb-24">
              {SECTIONS.map((sec, i) => (
                <motion.section
                  key={sec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Graph first, text below */}
                  <GraphBlock
                    type={sec.graph}
                    amplitude={amplitude}
                    frequency={frequency}
                  />

                  <div className="grid grid-cols-[48px_1fr] gap-6 items-start">
                    <div className="micro-text opacity-30 pt-1">{sec.id}</div>
                    <div>
                      <h3 className="hero-text text-lg mb-3 tracking-wider opacity-70">{sec.title}</h3>
                      <p className="body-text text-lg leading-relaxed mb-3 whitespace-pre-line">{sec.body}</p>
                      <p className="micro-text opacity-25 italic">{sec.technical}</p>
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>

            {/* ── VERIFICATION ── */}
            <div className="border-t border-white/[0.07] pt-16">
              {!showQuestions ? (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowQuestions(true)}
                    className="btn active tracking-[0.4em]"
                  >
                    BEGIN VERIFICATION
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="micro-text text-center opacity-40 tracking-[0.4em] mb-12">
                    System Verification // 3 Checks
                  </div>

                  {/* Q1 — CHOICE */}
                  <div className="bg-white/[0.03] border border-white/[0.07] p-8 space-y-5">
                    <div className="micro-text opacity-50">{QUESTIONS[0].label}</div>
                    <p className="hero-text text-xl">{QUESTIONS[0].question}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {QUESTIONS[0].options!.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAnswers(a => ({ ...a, q1: opt }))}
                          className={`px-5 py-2 border text-xs tracking-widest font-mono uppercase transition-all duration-200
                            ${answers.q1 === opt
                              ? 'border-accent-orange text-accent-orange bg-accent-orange/10'
                              : 'border-white/10 text-white/40 hover:border-white/25'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {q1Pass && (
                      <p className="micro-text text-accent-orange opacity-80 pt-2">✓ CORRECT</p>
                    )}
                  </div>

                  {/* Q2 — FREQ INTERACTION */}
                  <div className="bg-white/[0.03] border border-white/[0.07] p-8 space-y-4">
                    <div className="micro-text opacity-50">{QUESTIONS[1].label}</div>
                    <p className="hero-text text-xl">{QUESTIONS[1].question}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="text-xs font-mono text-white/30">
                        CURRENT: <span className={q2Pass ? 'text-signal-core' : 'text-white/50'}>
                          {frequency.toFixed(2)} Hz
                        </span>
                      </div>
                      {q2Pass
                        ? <span className="micro-text text-accent-orange">✓ PARAMETER MET</span>
                        : <span className="micro-text opacity-30">Move cursor right →</span>
                      }
                    </div>
                  </div>

                  {/* Q3 — NOISE INTERACTION */}
                  <div className="bg-white/[0.03] border border-white/[0.07] p-8 space-y-4">
                    <div className="micro-text opacity-50">{QUESTIONS[2].label}</div>
                    <p className="hero-text text-xl">{QUESTIONS[2].question}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="text-xs font-mono text-white/30">
                        NOISE: <span className={q3Pass ? 'text-signal-core' : 'text-white/50'}>
                          {noise.toFixed(3)}
                        </span>
                      </div>
                      {q3Pass
                        ? <span className="micro-text text-accent-orange">✓ PARAMETER MET</span>
                        : <span className="micro-text opacity-30">Scroll down to reduce</span>
                      }
                    </div>
                  </div>

                  {/* ── ALL PASS → CLOSE MODULE ── */}
                  {allPass && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-6 pt-8"
                    >
                      {/* Pink micro-pulse — 1% accent, only on final success */}
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.15, repeat: 2 }}
                        className="text-xs font-mono tracking-[0.3em] text-center"
                        style={{ color: '#EC4899' }}
                      >
                        ALL PARAMETERS CONFIRMED
                      </motion.div>
                      <button
                        onClick={() => { window.location.href = '/'; }}
                        className="btn active text-lg px-16 py-5"
                      >
                        CLOSE MODULE
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center opacity-15 mt-20 pt-8 border-t border-white/[0.05]">
              <div className="micro-text">Module 1 // Signal Theory</div>
              <div className="micro-text">Verification: {showQuestions ? 'ACTIVE' : 'PENDING'}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
