import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S06_DigitalLimit: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [bits, setBits] = useState(signal?.bitDepth ?? 4);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBits(val);
    updateSignal?.({ bitDepth: val });
    triggerHaptic('heavy');
  };

  const levels = Math.pow(2, bits);

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act II · Digital Nature
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Digital can only snapshot.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          The bit-depth sets how many distinct levels a digital signal can represent.
        </p>
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ padding: '10px 20px', border: `2px solid ${T.interact}`, borderRadius: 2, background: `${T.interact}08` }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.interact, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>Bit Depth</div>
          <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 900, color: T.text }}>{bits}-bit</div>
        </div>
        <div style={{ padding: '10px 20px', border: `1px solid ${T.border}`, borderRadius: 2 }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>Levels</div>
          <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 900, color: T.signal }}>
            2<sup>{bits}</sup> = {levels}
          </div>
        </div>
        <div style={{ padding: '10px 20px', border: `1px solid ${T.border}`, borderRadius: 2 }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>Step Size</div>
          <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 900, color: T.muted }}>
            {(100 / levels).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Wave */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Digital Signal — {bits}bit / {levels} levels
          </span>
        </div>
        <WaveCanvas mode="digital" frequency={signal?.frequency ?? 3} amplitude={signal?.amplitude ?? 0.65} bitDepth={bits} height={200} showGrid signalColor={T.interact} />
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>Bit Depth</label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{bits} bits</span>
        </div>
        <input type="range" min="1" max="8" step="1" value={bits} onChange={handleChange}
          style={{ width: '100%', accentColor: T.interact, cursor: 'pointer', height: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>1-bit (2 levels)</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>8-bit (256 levels)</span>
        </div>
      </div>

      {bits <= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '12px 16px', border: `1px solid ${T.error}30`, borderRadius: 2, background: `${T.error}06` }}>
          <p style={{ fontFamily: T.mono, fontSize: 10, color: T.error, margin: 0 }}>
            {bits === 1 ? '⚠ 1-bit: only HIGH or LOW. All nuance is gone.' : '⚠ 2-bit: only 4 levels. Severe aliasing distortion.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
