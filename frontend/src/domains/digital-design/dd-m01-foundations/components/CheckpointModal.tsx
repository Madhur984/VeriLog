import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeExpression } from '../../../../shared/utils/booleanEngine';

export interface CheckpointQuestion {
  id: string;
  type: 'text' | 'number' | 'mcq' | 'multiselect';
  question: string;
  options?: string[];
  correct: string | string[] | number;
  hint?: string;
  explanation?: string;
}

interface CheckpointModalProps {
  id: 1 | 2 | 3 | 4;
  open: boolean;
  title: string;
  phase: string;
  phaseColor: string;
  questions: CheckpointQuestion[];
  sipReward: number;
  sipEarned: boolean;
  onClose: () => void;
  onEarnSIP: (firstTry: boolean) => void; // IMP-D1
}

function normalizeAnswer(ans: string): string {
  // Try canonical normalization first for boolean expressions
  const canonical = normalizeExpression(ans);
  if (canonical) return canonical;
  // Fallback for non-boolean text
  return ans.toLowerCase().replace(/\s+/g, '');
}

function checkAnswer(q: CheckpointQuestion, userAnswer: string | string[]): boolean {
  if (q.type === 'text') {
    const ua = normalizeAnswer(userAnswer as string);
    const ca = normalizeAnswer(q.correct as string);
    return ua === ca;
  }
  if (q.type === 'number') {
    return Number(userAnswer) === Number(q.correct);
  }
  if (q.type === 'mcq') {
    return (userAnswer as string) === (q.correct as string);
  }
  if (q.type === 'multiselect') {
    const ua = [...(userAnswer as string[])].sort().join(',');
    const ca = [...(q.correct as string[])].sort().join(',');
    return ua === ca;
  }
  return false;
}

const CheckpointModal: React.FC<CheckpointModalProps> = ({
  id,
  open,
  title,
  phase,
  phaseColor,
  questions,
  sipReward,
  sipEarned,
  onClose,
  onEarnSIP,
}) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true); // IMP-D1

  const handleSubmit = useCallback(() => {
    const newResults: Record<string, boolean | null> = {};
    let correctCount = 0;
    for (const q of questions) {
      const ans = answers[q.id] ?? '';
      const ok = checkAnswer(q, ans);
      newResults[q.id] = ok;
      if (ok) correctCount++;
    }
    setResults(newResults);
    setSubmitted(true);
    
    // Check if passed (75%)
    const passed = correctCount / questions.length >= 0.75;
    
    if (passed && !sipEarned) {
      onEarnSIP(firstAttempt);
    }
    
    if (!passed) {
      setFirstAttempt(false); // Subsequent attempts aren't the first try
    }
  }, [answers, questions, sipEarned, onEarnSIP, firstAttempt]);

  const handleReset = () => {
    setAnswers({});
    setResults({});
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cp-backdrop"
          className="fixed inset-0 z-[500] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.95, opacity: 0, rotateX: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            style={{ background: '#070709', border: `1px solid ${phaseColor}55` }}
          >
            {/* Binary Rain Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[8px] leading-none overflow-hidden select-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100 }}
                  animate={{ y: 800 }}
                  transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                  className="absolute"
                  style={{ left: `${i * 5}%`, color: phaseColor }}
                >
                  {Math.random() > 0.5 ? '10101100101' : '00110101010'}
                  <br />{Math.random() > 0.5 ? '11001010101' : '10101010111'}
                </motion.div>
              ))}
            </div>

            {/* Scanlines layer */}
            <div className="absolute inset-0 bg-scanlines opacity-[0.05] pointer-events-none z-20" />

            {/* Header */}
            <div
              className="relative z-30 px-8 py-6 flex items-center justify-between"
              style={{ background: 'rgba(17,17,20,0.8)', borderBottom: `1px solid ${phaseColor}33`, backdropFilter: 'blur(4px)' }}
            >
              <div>
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }} 
                  transition={{ duration: 0.2, repeat: 3 }}
                  className="text-xs font-mono tracking-[0.3em] mb-2" 
                  style={{ color: phaseColor }}
                >
                  SYSTEM_INTEGRITY_CHECK // 0{id}
                </motion.div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: '#E8E8F0' }}>
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#7A7A8C] hover:text-[#E8E8F0] transition-colors text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-[#00D4FF] rounded"
                aria-label="Close checkpoint"
              >
                ✕
              </button>
            </div>

            {/* Questions */}
            <div className="relative z-30 px-10 py-8 flex-1 overflow-y-auto flex flex-col gap-8 scrollbar-hide">
              {questions.map((q, qi) => (
                <div key={q.id} className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                      style={{
                        background:
                          results[q.id] === true
                            ? 'rgba(0,255,136,0.2)'
                            : results[q.id] === false
                              ? 'rgba(255,51,102,0.2)'
                              : `rgba(${parseInt(phaseColor.slice(1,3),16)},${parseInt(phaseColor.slice(3,5),16)},${parseInt(phaseColor.slice(5,7),16)},0.2)`,
                        color:
                          results[q.id] === true ? '#00FF88'
                          : results[q.id] === false ? '#FF3366'
                          : phaseColor,
                      }}
                    >
                      {results[q.id] === true ? '✓' : results[q.id] === false ? '✗' : qi + 1}
                    </span>
                    <p className="text-base leading-relaxed font-semibold italic tracking-tight" style={{ color: '#E8E8F0', fontFamily: 'Inter, system-ui' }}>
                      {q.question}
                    </p>
                  </div>

                  {/* Input */}
                  {(q.type === 'text' || q.type === 'number') && (
                    <input
                      type={q.type === 'number' ? 'number' : 'text'}
                      value={(answers[q.id] as string) ?? ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      disabled={submitted}
                      placeholder={q.type === 'number' ? '0' : 'Your answer...'}
                      className="ml-12 px-5 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2"
                      style={{
                        background: '#1A1A1F',
                        border: `2px solid ${results[q.id] === true ? '#00FF88' : results[q.id] === false ? '#FF3366' : '#FFFFFF1A'}`,
                        color: '#A0FFA0',
                        fontFamily: 'IBM Plex Mono, monospace',
                        maxWidth: 400,
                        focusRingColor: phaseColor,
                      }}
                      aria-label={`Answer for question ${qi + 1}`}
                    />
                  )}

                  {q.type === 'mcq' && q.options && (
                    <div className="ml-12 flex flex-wrap gap-3">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          disabled={submitted}
                          className="px-5 py-2.5 rounded-xl text-xs font-mono font-black italic transition-all"
                          style={{
                            background:
                              answers[q.id] === opt
                                ? submitted && results[q.id] === false
                                  ? 'rgba(255,51,102,0.2)'
                                  : `rgba(${parseInt(phaseColor.slice(1,3),16)},${parseInt(phaseColor.slice(3,5),16)},${parseInt(phaseColor.slice(5,7),16)},0.3)`
                                : submitted && opt === q.correct
                                  ? 'rgba(0,255,136,0.15)'
                                  : '#1A1A1F',
                            border: `2px solid ${answers[q.id] === opt ? phaseColor : 'transparent'}`,
                            color: answers[q.id] === opt ? phaseColor : '#7A7A8C',
                          }}
                          aria-pressed={answers[q.id] === opt}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'multiselect' && q.options && (
                    <div className="ml-12 flex flex-col gap-3">
                      {q.options.map(opt => {
                        const selected = ((answers[q.id] as string[]) ?? []).includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected}
                              disabled={submitted}
                              onChange={() => {
                                if (submitted) return;
                                const cur = (answers[q.id] as string[]) ?? [];
                                const next = selected ? cur.filter(x => x !== opt) : [...cur, opt];
                                setAnswers(prev => ({ ...prev, [q.id]: next }));
                              }}
                              className="w-5 h-5 rounded-md accent-[#06B6D4]"
                            />
                            <span className="text-sm font-bold" style={{ color: '#E8E8F0' }}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Feedback */}
                  {submitted && results[q.id] === false && q.explanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="ml-12 px-4 py-3 rounded-xl text-sm"
                      style={{ background: 'rgba(255,51,102,0.12)', border: '1px solid rgba(255,51,102,0.3)', color: '#FFD1D1' }}
                    >
                      {q.explanation}
                    </motion.div>
                  )}

                  {/* Hint */}
                  {!submitted && q.hint && (
                    <button
                      onClick={() => setShowHints(prev => ({ ...prev, [q.id]: true }))}
                      className="ml-12 text-xs font-mono font-black italic text-[#7A7A8C] hover:text-[#FFC107] transition-colors text-left"
                    >
                      {showHints[q.id] ? `💡 ${q.hint}` : 'HINT (free)'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="sticky bottom-0 px-10 py-6 flex items-center justify-between"
              style={{ background: '#111114', borderTop: `1px solid #FFFFFF0F` }}
            >
              <div className="flex items-center gap-2 text-sm font-mono font-black italic" style={{ color: '#7A7A8C' }}>
                <span>REWARD:</span>
                <span style={{ color: '#FFC107' }}>+{sipReward} SIP</span>
                {sipEarned && (
                  <span className="ml-2" style={{ color: '#00FF88' }}>✓ EARNED</span>
                )}
              </div>
              <div className="flex gap-4">
                {submitted && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl text-xs font-mono font-black border border-white/10 text-[#7A7A8C] hover:text-[#E8E8F0] transition-colors"
                  >
                    RETRY
                  </button>
                )}
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl text-sm font-mono font-black italic tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                    style={{
                      background: phaseColor,
                      color: '#000',
                    }}
                  >
                    CHECK ANSWERS
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-xl text-sm font-mono font-black italic tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    style={{ background: '#22C55E', color: '#000' }}
                  >
                    CONTINUE →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckpointModal;

