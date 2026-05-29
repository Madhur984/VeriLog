import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

const OPTIONS = [
  { id: 'a', label: 'Signal A', correct: true, hint: 'This is the smooth analog (continuous) signal.' },
  { id: 'b', label: 'Signal B', correct: false, hint: 'Signal B is digital - it uses discrete steps.' },
];

export const M2_S08_Checkpoint1: React.FC<M2ScreenProps> = ({ triggerHaptic, onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const handleSelect = (id: string) => {
    if (locked) return;
    setSelected(id);
    const opt = OPTIONS.find(o => o.id === id)!;
    if (opt.correct) {
      setLocked(true);
      triggerHaptic('success');
    } else {
      triggerHaptic('error');
    }
  };

  const isCorrect = selected && OPTIONS.find(o => o.id === selected)?.correct;

  return (
    <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Checkpoint 1 · Act II Complete
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: '-0.02em' }}>
          Which signal is continuous?
        </h2>
      </div>

      {/* Two signals to choose from */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>
        {OPTIONS.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const borderColor = !isSelected ? T.border : (opt.correct ? T.success : T.error);
          return (
            <motion.button
              key={opt.id}
              whileTap={!locked ? { scale: 0.98 } : undefined}
              onClick={() => handleSelect(opt.id)}
              style={{
                border: `2px solid ${borderColor}`,
                borderRadius: 2,
                overflow: 'hidden',
                background: T.bg,
                cursor: locked ? 'default' : 'pointer',
                textAlign: 'left',
                padding: 0,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{opt.label}</span>
                {isSelected && (opt.correct
                  ? <CheckCircle2 size={14} color={T.success} />
                  : <XCircle size={14} color={T.error} />
                )}
              </div>
              <WaveCanvas
                mode={idx === 0 ? 'analog' : 'digital'}
                frequency={3} amplitude={0.65} bitDepth={4}
                height={160} showGrid={false}
                signalColor={idx === 0 ? T.signal : T.interact}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '16px 24px',
              border: `1px solid ${isCorrect ? `${T.success}40` : `${T.error}40`}`,
              borderRadius: 2,
              background: isCorrect ? `${T.success}08` : `${T.error}08`,
              textAlign: 'center', width: '100%',
            }}
          >
            <p style={{ fontFamily: T.mono, fontSize: 12, color: isCorrect ? T.success : T.error, margin: 0, letterSpacing: '0.08em' }}>
              {OPTIONS.find(o => o.id === selected)?.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {isCorrect && (
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
            Continue → Act III
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
