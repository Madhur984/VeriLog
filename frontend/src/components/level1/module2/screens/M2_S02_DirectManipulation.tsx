import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S02_DirectManipulation: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [mode, setMode] = useState<'analog' | 'digital'>('analog');

  const toggle = () => {
    setMode(m => m === 'analog' ? 'digital' : 'analog');
    triggerHaptic('heavy');
  };

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 14 }}>
          Act I · Direct Manipulation
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Same signal. Different representation.
        </h2>
      </div>

      {/* Single graph */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Signal Viewer
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode === 'analog' ? T.signal : T.interact }}
            >
              {mode === 'analog' ? 'ANALOG - Continuous' : 'DIGITAL - Discrete'}
            </motion.span>
          </AnimatePresence>
        </div>
        <WaveCanvas
          mode={mode}
          frequency={3}
          amplitude={0.7}
          bitDepth={3}
          height={220}
          showGrid
          signalColor={mode === 'analog' ? T.signal : T.interact}
        />
      </div>

      {/* Toggle button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={toggle}
          style={{
            fontFamily: T.mono,
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            padding: '14px 32px',
            background: mode === 'analog' ? T.signal : T.interact,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {mode === 'analog' ? '→ Switch to Steps' : '→ Switch to Flow'}
        </motion.button>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.2em' }}>
          {mode === 'analog' ? 'FLOW mode' : 'STEPS mode'}
        </span>
      </div>

      <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, textAlign: 'center', letterSpacing: '0.05em', maxWidth: 480 }}>
        The underlying information is identical.<br />
        The representation changes how machines process it.
      </p>
    </div>
  );
};
