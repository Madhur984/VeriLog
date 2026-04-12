import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';
import { QuantizationCanvas } from '../shared/QuantizationCanvas';

export const M2_S14_Quantization: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [bits, setBits] = useState(signal?.bitDepth ?? 4);
  const levels = Math.pow(2, bits);
  const snr = 6.02 * bits + 1.76; // SQNR formula

  return (
    <div style={{ width: '100%', maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act IV · Quantization
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Rounding error is unavoidable.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Orange bars show the error between real and quantized. More bits = smaller bars.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'BIT DEPTH', value: `${bits}-bit`, color: T.interact },
          { label: 'LEVELS', value: `${levels}`, color: T.signal },
          { label: 'STEP (LSB)', value: `${(5000 / levels).toFixed(0)} mV`, color: T.muted },
          { label: 'SQNR', value: `${snr.toFixed(1)} dB`, color: T.success },
        ].map(s => (
          <div key={s.label} style={{ padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 2, background: T.card }}>
            <div style={{ fontFamily: T.mono, fontSize: 7, color: T.muted, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quantization canvas */}
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 20, height: 2, background: T.signal, opacity: 0.2 }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Original (faint)</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 20, height: 2, background: T.signal }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Quantized</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 4, height: 14, background: T.interact, borderRadius: 1 }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>Error bars</span>
          </div>
        </div>
        <QuantizationCanvas bits={bits} frequency={signal?.frequency ?? 2} height={240} showErrorBars />
      </div>

      {/* Bit depth slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>Bit Depth</label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{bits} bits</span>
        </div>
        <input type="range" min="1" max="8" step="1" value={bits}
          onChange={e => { const v = parseInt(e.target.value, 10); setBits(v); updateSignal?.({ bitDepth: v }); triggerHaptic('heavy'); }}
          style={{ width: '100%', accentColor: T.interact, cursor: 'pointer', height: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.error }}>1-bit (brutal)</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>8-bit (CD quality)</span>
        </div>
      </div>

      {bits <= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '12px 16px', border: `1px solid ${T.error}30`, borderRadius: 2, background: `${T.error}06` }}>
          <p style={{ fontFamily: T.mono, fontSize: 10, color: T.error, margin: 0 }}>
            The signal is barely recognizable. This is quantization distortion.
          </p>
        </motion.div>
      )}
    </div>
  );
};
