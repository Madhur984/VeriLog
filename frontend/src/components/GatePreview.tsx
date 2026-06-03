import React, { useState } from 'react';

const GATES = {
  AND:  (a: boolean, b: boolean) => a && b,
  OR:   (a: boolean, b: boolean) => a || b,
  NAND: (a: boolean, b: boolean) => !(a && b),
  NOR:  (a: boolean, b: boolean) => !(a || b),
  XOR:  (a: boolean, b: boolean) => a !== b,
} as const;

type GateType = keyof typeof GATES;

export const GatePreview = () => {
  const [gate, setGate] = useState<GateType>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const output = GATES[gate](a, b);

  const playToggleTone = (isHigh: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHigh ? 700 : 350, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Browser autoplay policy
    }
  };

  return (
    <div
      className="rounded-2xl p-6 h-full font-mono flex flex-col justify-between"
      style={{
        background: '#0D0F12',
        border: '1px solid rgba(148,163,184,0.08)',
      }}
    >
      <div>
        {/* Gate selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] font-mono text-slate-500 mr-1">
            GATE:
          </span>
          {(Object.keys(GATES) as GateType[]).map(g => (
            <button
              key={g}
              onClick={() => {
                playToggleTone(true);
                setGate(g);
              }}
              aria-label={`Select ${g} logic gate`}
              className="px-3 py-1 rounded text-[10px] font-mono transition-all duration-150 cursor-pointer"
              style={{
                background: gate === g ? '#22D3EE' : 'transparent',
                color: gate === g ? '#07080A' : '#94A3B8',
                border: `1px solid ${gate === g
                  ? '#22D3EE'
                  : 'rgba(148,163,184,0.12)'}`,
              }}
            >
              {g}
            </button>
          ))}
        </div>
 
        {/* Main circuit area */}
        <div className="flex items-center justify-between mb-6">
          {/* Inputs */}
          <div className="space-y-4">
            {[
              { label: 'A', val: a, set: setA },
              { label: 'B', val: b, set: setB },
            ].map(({ label, val, set }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-mono w-4" style={{ color: '#94A3B8' }}>{label}</span>
                <button
                  onClick={() => {
                    playToggleTone(!val);
                    set(v => !v);
                  }}
                  aria-label={`Toggle logic input ${label} state`}
                  className="w-12 h-6 rounded-full relative transition-all duration-200 flex items-center cursor-pointer"
                  style={{
                    background: val
                      ? '#22D3EE'
                      : 'rgba(148,163,184,0.10)',
                    border: `1px solid ${val
                      ? '#22D3EE'
                      : 'rgba(148,163,184,0.15)'}`,
                  }}
                >
                  <span
                    className="absolute w-4 h-4 bg-white rounded-full transition-all duration-200"
                    style={{
                      left: val ? '26px' : '4px',
                      boxShadow: val
                        ? '0 0 8px rgba(34,211,238,0.6)'
                        : 'none',
                    }}
                  />
                </button>
                <span className="text-xs font-mono w-4" style={{ color: val ? '#22D3EE' : '#475569' }}>
                  {val ? '1' : '0'}
                </span>
              </div>
            ))}
          </div>

          {/* Gate symbol SVG */}
          <div className="flex-1 flex justify-center">
            <svg width="80" height="60" viewBox="0 0 80 60">
              {/* Input wires */}
              <line x1="0" y1="20" x2="20" y2="20"
                    stroke={a ? '#22D3EE' : '#334155'} strokeWidth="1.5"/>
              <line x1="0" y1="40" x2="20" y2="40"
                    stroke={b ? '#22D3EE' : '#334155'} strokeWidth="1.5"/>
              {/* Gate body - AND/NAND/OR/NOR/XOR shape */}
              <path d="M20 10 L20 50 L40 50 Q65 50 65 30 Q65 10 40 10 Z"
                    fill="#0D0F12"
                    stroke="#22D3EE"
                    strokeWidth="1.5"/>
              {/* Gate label */}
              <text x="38" y="34" textAnchor="middle"
                    fontSize="9" fontFamily="IBM Plex Mono"
                    fill="#22D3EE">
                {gate}
              </text>
              {/* Output wire */}
              <line x1="65" y1="30" x2="80" y2="30"
                    stroke={output ? '#10B981' : '#334155'} strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Output LED */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full transition-all duration-200"
              style={{
                background: output ? '#10B981' : '#1C2333',
                boxShadow: output
                  ? '0 0 16px rgba(16,185,129,0.6)'
                  : 'none',
                border: `2px solid ${output ? '#10B981' : '#334155'}`,
              }}
            />
            <span className="text-xs font-mono" style={{ color: output ? '#10B981' : '#475569' }}>
              {output ? 'HIGH' : 'LOW'}
            </span>
          </div>
        </div>

        {/* Mini truth table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(148,163,184,0.06)' }}
        >
          <div className="grid grid-cols-3 text-[10px] font-mono" style={{ borderBottom: '1px solid rgba(148,163,184,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['A', 'B', 'OUT'].map(h => (
              <div key={h} className="px-3 py-1.5 text-center" style={{ color: '#475569' }}>
                {h}
              </div>
            ))}
          </div>
          {[[false, false], [false, true], [true, false], [true, true]].map(([ra, rb], i) => {
            const rout = GATES[gate](ra, rb);
            const isActive = ra === a && rb === b;
            return (
              <div
                key={i}
                className="grid grid-cols-3 text-[10px] font-mono transition-colors duration-150"
                style={{
                  background: isActive
                    ? 'rgba(34,211,238,0.06)'
                    : 'transparent',
                  borderLeft: isActive
                    ? '2px solid #22D3EE'
                    : '2px solid transparent',
                }}
              >
                {[ra, rb, rout].map((v, j) => (
                  <div key={j} className="px-3 py-1.5 text-center"
                       style={{
                         color: isActive
                           ? (j === 2
                             ? (v ? '#10B981' : '#EF4444')
                             : '#F1F5F9')
                           : '#475569',
                       }}>
                    {v ? '1' : '0'}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] font-mono text-center mt-4" style={{ color: '#475569' }}>
        Toggle A and B. Watch the output change. This is what you'll master.
      </p>
    </div>
  );
};
