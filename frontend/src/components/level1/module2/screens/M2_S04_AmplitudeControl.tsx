import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S04_AmplitudeControl: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [amplitude, setAmplitude] = useState(signal?.amplitude ?? 0.65);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmplitude(val);
    updateSignal?.({ amplitude: val });
    triggerHaptic('light');
  };

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act II · Signal Control
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Amplitude is height.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Drag the slider. Watch how the signal's peak voltage changes.
        </p>
      </div>

      {/* Wave display */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>CH1 - Analog Signal</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.signal }}>
            A = {(amplitude * 5).toFixed(2)} V
          </span>
        </div>
        <WaveCanvas mode="analog" frequency={signal?.frequency ?? 3} amplitude={amplitude} height={200} showGrid />
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Amplitude
          </label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact, letterSpacing: '0.1em' }}>
            {Math.round(amplitude * 100)}%
          </span>
        </div>
        <input
          type="range" min="0.1" max="1.0" step="0.01"
          value={amplitude}
          onChange={handleChange}
          style={{ width: '100%', accentColor: T.interact, cursor: 'pointer', height: 4 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>0 V</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>5 V</span>
        </div>
      </div>

      {/* Insight */}
      <motion.div
        animate={{ opacity: amplitude < 0.2 || amplitude > 0.85 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '12px 16px',
          border: `1px solid ${T.signal}30`,
          borderRadius: 2,
          background: `${T.signal}06`,
        }}
      >
        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.signal, margin: 0, letterSpacing: '0.1em' }}>
          {amplitude < 0.2 ? '⚠ Low amplitude - signal approaching noise floor' : 'ℹ High amplitude - approaching ADC clipping range'}
        </p>
      </motion.div>
    </div>
  );
};
