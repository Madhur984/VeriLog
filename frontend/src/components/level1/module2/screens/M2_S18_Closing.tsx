import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { M2ScreenProps, T } from '../types';

/** Morphing wave: transitions smoothly from analog sine to quantized steps */
const MorphingWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = 120;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr; canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      t += 0.012;
      const midY = H / 2;
      const A = H * 0.38;

      // Morph parameter: 0 = analog, 1 = digital (oscillates)
      const morph = (Math.sin(t * 0.3) + 1) * 0.5;
      const bits = 3;
      const levels = Math.pow(2, bits);

      ctx.beginPath();
      ctx.strokeStyle = T.signal;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `${T.signal}50`;

      const freq = 3;
      const N = 200;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W;
        const rawY = midY + A * Math.sin((i / N) * Math.PI * 2 * freq + t);
        const raw = Math.sin((i / N) * Math.PI * 2 * freq + t);
        const q = Math.round((raw + 1) * 0.5 * (levels - 1)) / (levels - 1);
        const qY = midY + A * (q * 2 - 1);
        const y = rawY * (1 - morph) + qY * morph;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 120, display: 'block' }} />;
};

export const M2_S18_Closing: React.FC<M2ScreenProps> = ({ triggerHaptic }) => {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setRevealed(true); triggerHaptic('success'); }, 800);
    return () => clearTimeout(t);
  }, [triggerHaptic]);

  const SUMMARY = [
    { key: 'Analog', value: 'Continuous. Infinite resolution. Noise-vulnerable.' },
    { key: 'Digital', value: 'Discrete. Finite levels. Noise immune.' },
    { key: 'Nyquist', value: 'fs ≥ 2f — or aliasing corrupts the signal.' },
    { key: 'Quantization', value: '2^n levels. More bits = less error.' },
    { key: 'ADC', value: 'Samples → Quantizes → Encodes to binary.' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${T.signal}70`, marginBottom: 14 }}>
          Module 02 Complete
        </p>
        <h2 style={{ fontFamily: T.mono, fontSize: 38, fontWeight: 900, color: T.text, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
          Analog and Digital.<br />
          <span style={{ color: T.signal }}>Both carry truth.</span>
        </h2>
        <p style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: '0.04em' }}>
          One is the language of nature. The other is the language of machines.
        </p>
      </div>

      {/* Morphing wave */}
      <div style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Analog ⟷ Digital (morphing)
          </span>
        </div>
        <MorphingWave />
      </div>

      {/* Summary table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}
      >
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${T.border}`, background: T.card }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.signal, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Module Summary</span>
        </div>
        {SUMMARY.map((row, idx) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            style={{
              display: 'flex', gap: 0,
              borderBottom: idx < SUMMARY.length - 1 ? `1px solid ${T.border}` : undefined,
            }}
          >
            <div style={{ width: 140, padding: '12px 20px', borderRight: `1px solid ${T.border}`, flexShrink: 0 }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.signal, letterSpacing: '0.1em' }}>{row.key}</span>
            </div>
            <div style={{ padding: '12px 20px' }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, letterSpacing: '0.05em' }}>{row.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Module complete badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        style={{
          padding: '16px 32px',
          border: `2px solid ${T.signal}`,
          borderRadius: 2,
          background: `${T.signal}08`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 900, color: T.signal }}>M02</div>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.text, letterSpacing: '0.1em' }}>
            ANALOG → DIGITAL COMPLETE
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.1em', marginTop: 4 }}>
            +50 XP · Signal Domain Badge Unlocked
          </div>
        </div>
      </motion.div>
    </div>
  );
};
