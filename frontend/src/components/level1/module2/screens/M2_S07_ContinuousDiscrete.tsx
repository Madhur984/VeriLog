import React, { useState } from 'react';
import { M2ScreenProps, T } from '../types';
import { WaveCanvas } from '../shared/WaveCanvas';

export const M2_S07_ContinuousDiscrete: React.FC<M2ScreenProps> = ({ triggerHaptic, updateSignal, signal }) => {
  const [samplesPerPeriod, setSamplesPerPeriod] = useState(signal?.samplingRate ?? 12);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSamplesPerPeriod(val);
    updateSignal?.({ samplingRate: val });
    triggerHaptic('light');
  };

  const quality = samplesPerPeriod < 3 ? 'critical' : samplesPerPeriod < 6 ? 'poor' : samplesPerPeriod < 12 ? 'fair' : 'good';
  const qualityColors = { critical: T.error, poor: '#D97706', fair: '#CA8A04', good: T.success };

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 12 }}>
          Act II · Discretization
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Continuous → Discrete.
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: '0.05em' }}>
          Orange dots are samples. Slide to see how sampling density affects reconstruction.
        </p>
      </div>

      {/* Wave with sampling overlay */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>Sampling Overlay</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.signal }} />
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>Analog</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.interact }} />
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>Samples</span>
          </div>
        </div>
        <WaveCanvas mode="sampling-overlay" frequency={signal?.frequency ?? 3} amplitude={signal?.amplitude ?? 0.65}
          samplingRate={samplesPerPeriod} height={210} showGrid />
      </div>

      {/* Quality indicator */}
      <div style={{ display: 'flex', gap: 12 }}>
        {(['critical', 'poor', 'fair', 'good'] as const).map(q => (
          <div key={q} style={{
            flex: 1, padding: '8px 12px', borderRadius: 2, textAlign: 'center',
            border: `1px solid ${quality === q ? qualityColors[q] : T.border}`,
            background: quality === q ? `${qualityColors[q]}10` : T.card,
            transition: 'all 0.2s',
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: quality === q ? qualityColors[q] : T.muted }}>
              {q}
            </span>
          </div>
        ))}
      </div>

      {/* Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.muted }}>
            Samples per Period
          </label>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.interact }}>{samplesPerPeriod} samp/period</span>
        </div>
        <input type="range" min="2" max="32" step="1" value={samplesPerPeriod} onChange={handleChange}
          style={{ width: '100%', accentColor: T.interact, cursor: 'pointer', height: 4 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>2 (critical)</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>32 (high fidelity)</span>
        </div>
      </div>
    </div>
  );
};
