import React, { useState, useCallback, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onEarnSIP: () => void;
}

function normalizeAnswer(ans: string): string {
  return ans.toLowerCase().replace(/\s+/g, '').replace(/f\s*=\s*/gi, '');
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

  const handleSubmit = useCallback(() => {
    const newResults: Record<string, boolean | null> = {};
    let correct = 0;
    for (const q of questions) {
      const ans = answers[q.id] ?? '';
      const ok = checkAnswer(q, ans);
      newResults[q.id] = ok;
      if (ok) correct++;
    }
    setResults(newResults);
    setSubmitted(true);
    if (correct / questions.length >= 0.75 && !sipEarned) {
      onEarnSIP();
    }
  }, [answers, questions, sipEarned, onEarnSIP]);

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
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: '#111114', border: `1px solid ${phaseColor}44` }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-8 py-5 flex items-center justify-between"
              style={{ background: '#111114', borderBottom: `1px solid ${phaseColor}22` }}
            >
              <div>
                <div className="text-[10px] font-mono tracking-[0.15em] mb-1" style={{ color: phaseColor }}>
                  PHASE_{phase} // CHECKPOINT_0{id}
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#E8E8F0', fontFamily: 'Inter, system-ui' }}>
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#7A7A8C] hover:text-[#E8E8F0] transition-colors text-xl leading-none focus:outline-none focus:ring-2 focus:ring-[#00D4FF] rounded"
                aria-label="Close checkpoint"
              >
                ✕
              </button>
            </div>

            {/* Questions */}
            <div className="px-8 py-6 flex flex-col gap-6">
              {questions.map((q, qi) => (
                <div key={q.id} className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold"
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
                    <p className="text-[14px] leading-relaxed" style={{ color: '#E8E8F0', fontFamily: 'Inter, system-ui' }}>
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
                      className="ml-9 px-4 py-2 rounded-lg text-[13px] font-mono focus:outline-none focus:ring-2"
                      style={{
                        background: '#1A1A1F',
                        border: `1px solid ${results[q.id] === true ? '#00FF88' : results[q.id] === false ? '#FF3366' : '#FFFFFF0F'}`,
                        color: '#A0FFA0',
                        fontFamily: 'IBM Plex Mono, monospace',
                        maxWidth: 360,
                        focusRingColor: phaseColor,
                      }}
                      aria-label={`Answer for question ${qi + 1}`}
                    />
                  )}

                  {q.type === 'mcq' && q.options && (
                    <div className="ml-9 flex flex-wrap gap-2">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          disabled={submitted}
                          className="px-4 py-2 rounded-lg text-[12px] font-mono transition-all"
                          style={{
                            background:
                              answers[q.id] === opt
                                ? submitted && results[q.id] === false
                                  ? 'rgba(255,51,102,0.2)'
                                  : `rgba(${parseInt(phaseColor.slice(1,3),16)},${parseInt(phaseColor.slice(3,5),16)},${parseInt(phaseColor.slice(5,7),16)},0.2)`
                                : submitted && opt === q.correct
                                  ? 'rgba(0,255,136,0.15)'
                                  : '#1A1A1F',
                            border: `1px solid ${answers[q.id] === opt ? phaseColor : '#FFFFFF0F'}`,
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
                    <div className="ml-9 flex flex-col gap-2">
                      {q.options.map(opt => {
                        const selected = ((answers[q.id] as string[]) ?? []).includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-3 cursor-pointer">
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
                              className="w-4 h-4 rounded accent-[#A855F7]"
                            />
                            <span className="text-[13px]" style={{ color: '#E8E8F0' }}>{opt}</span>
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
                      className="ml-9 px-3 py-2 rounded-lg text-[12px]"
                      style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)', color: '#E8E8F0' }}
                    >
                      {q.explanation}
                    </motion.div>
                  )}

                  {/* Hint */}
                  {!submitted && q.hint && (
                    <button
                      onClick={() => setShowHints(prev => ({ ...prev, [q.id]: true }))}
                      className="ml-9 text-[11px] font-mono text-[#7A7A8C] hover:text-[#FFC107] transition-colors text-left"
                    >
                      {showHints[q.id] ? `💡 ${q.hint}` : 'HINT (free)'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="sticky bottom-0 px-8 py-5 flex items-center justify-between"
              style={{ background: '#111114', borderTop: `1px solid #FFFFFF0F` }}
            >
              <div className="flex items-center gap-2 text-[12px] font-mono" style={{ color: '#7A7A8C' }}>
                <span>REWARD:</span>
                <span style={{ color: '#FFC107' }}>+{sipReward} SIP</span>
                {sipEarned && (
                  <span className="ml-2" style={{ color: '#00FF88' }}>✓ EARNED</span>
                )}
              </div>
              <div className="flex gap-3">
                {submitted && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg text-[12px] font-mono border border-white/10 text-[#7A7A8C] hover:text-[#E8E8F0] transition-colors"
                  >
                    RETRY
                  </button>
                )}
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-lg text-[13px] font-mono font-semibold transition-all hover:scale-102"
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
                    className="px-5 py-2 rounded-lg text-[13px] font-mono font-semibold"
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
