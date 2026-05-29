import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S05_FrequencyControl: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [frequency, setFrequency] = useState(signal?.frequency ?? 3);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFrequency(val);
    updateSignal?.({ frequency: val });
    triggerHaptic('light');
  };

  const period = (1 / frequency * 1000).toFixed(1);

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>

      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act II · Signal Control
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Frequency is speed.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          How many cycles per second. Drag up to feel aliasing foreshadow.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'FREQUENCY', value: `${frequency.toFixed(1)} Hz` },
          { label: 'PERIOD', value: `${period} ms` },
          { label: 'ω (ANGULAR)', value: `${(2 * Math.PI * frequency).toFixed(1)} rad/s` },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '12px 16px', border: `1px solid ${T.border}`, borderRadius: 2, background: T.card }}>
            <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.signal }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Wave */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <WaveCanvas mode="analog" frequency={frequency} amplitude={signal?.amplitude ?? 0.65} height={200} showGrid />
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Frequency
          </label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{frequency.toFixed(1)} Hz</span>
        </div>
        <input
          type="range" min="0.5" max="12" step="0.1"
          value={frequency}
          onChange={handleChange}
          style={{ width: '100%', accentColor: T.interact, cursor: 'pointer', height: 4 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>0.5 Hz</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>12 Hz</span>
        </div>
      </div>

      {frequency > 8 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '12px 16px', border: `1px solid ${T.interact}30`, borderRadius: 2, background: `${T.interact}06` }}
        >
          <p style={{ fontFamily: T.mono, fontSize: 10, color: T.interact, margin: 0 }}>
            ⚡ High frequency - you'll need a faster sampler to capture this correctly.
          </p>
        </motion.div>
      )}
    </div>
  );
};
