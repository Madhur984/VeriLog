import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { M2ScreenProps, T } from '../types';

const QUESTION = {
  text: 'What hardware component converts an analog signal to a digital one?',
  options: [
    { id: 'a', text: 'DAC — Digital to Analog Converter', correct: false,
      explanation: 'The DAC is the reverse: it converts digital → analog. Used in speakers and displays.' },
    { id: 'b', text: 'ADC — Analog to Digital Converter', correct: true,
      explanation: '✓ Correct! The ADC (Analog-to-Digital Converter) samples, quantizes, and encodes the analog signal.' },
    { id: 'c', text: 'CPU — Central Processing Unit', correct: false,
      explanation: 'The CPU processes already-digital data. It cannot directly interface with analog signals.' },
  ]
};

export const M2_S17_FinalCheckpoint: React.FC<M2ScreenProps> = ({ triggerHaptic, onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const handleSelect = (id: string) => {
    if (locked) return;
    setSelected(id);
    const opt = QUESTION.options.find(o => o.id === id)!;
    if (opt.correct) { setLocked(true); triggerHaptic('success'); }
    else triggerHaptic('error');
  };

  const selectedOpt = selected ? QUESTION.options.find(o => o.id === selected) : null;

  return (
    <div style={{ width: '100%', maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Final Checkpoint · Module 2
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 26, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          {QUESTION.text}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {QUESTION.options.map(opt => {
          const isSelected = selected === opt.id;
          const borderColor = !isSelected ? T.border : (opt.correct ? T.success : T.error);
          const bg = !isSelected ? T.bg : (opt.correct ? `${T.success}08` : `${T.error}08`);
          return (
            <motion.button
              key={opt.id}
              whileTap={!locked ? { scale: 0.99 } : undefined}
              onClick={() => handleSelect(opt.id)}
              style={{
                width: '100%', textAlign: 'left',
                padding: '16px 20px',
                border: `2px solid ${borderColor}`,
                borderRadius: 2, background: bg,
                cursor: locked ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', flexShrink: 0 }}>{opt.id.toUpperCase()}</span>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text, flex: 1, letterSpacing: '0.03em' }}>{opt.text}</span>
              {isSelected && (opt.correct ? <CheckCircle2 size={18} color={T.success} /> : <XCircle size={18} color={T.error} />)}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOpt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '16px 24px', width: '100%',
              border: `1px solid ${selectedOpt.correct ? `${T.success}40` : `${T.error}40`}`,
              borderRadius: 2,
              background: selectedOpt.correct ? `${T.success}08` : `${T.error}08`,
            }}
          >
            <p style={{ fontFamily: T.mono, fontSize: 11, color: selectedOpt.correct ? T.success : T.error, margin: 0, lineHeight: 1.7 }}>
              {selectedOpt.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {locked && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
              padding: '14px 36px', background: T.signal, color: '#FFF',
              border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 700,
            }}
          >
            Final Screen →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
