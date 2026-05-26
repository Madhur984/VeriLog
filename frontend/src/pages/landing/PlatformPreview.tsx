import { useState } from 'react';
import { LogoWordmark } from '../../components/LogoWordmark';

export const PlatformPreview = () => {
  const [a, setA] = useState<0 | 1>(1);
  const [b, setB] = useState<0 | 1>(0);
  const [c, setC] = useState<0 | 1>(1);

  const term1 = a === 1 && b === 0 && c === 1;
  const term2 = a === 0 && b === 1 && c === 0;
  const term3 = a === 1 && b === 1 && c === 1;
  const f = (term1 || term2 || term3) ? 1 : 0;

  const truthTable = [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 1], // m2
    [0, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 1, 1], // m5
    [1, 1, 0, 0],
    [1, 1, 1, 1], // m7
  ];

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
    <div className="max-w-4xl mx-auto px-6 py-20 w-full select-none">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-4">
        <span
          className="text-[10px] font-mono tracking-widest uppercase block"
          style={{ color: '#475569' }}
        >
          INSIDE THE PLATFORM
        </span>
        <h2
          className="font-bold tracking-tight uppercase font-sans text-white"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
        >
          See what you're getting into.
        </h2>
      </div>

      {/* Browser chrome */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: '1px solid rgba(148,163,184,0.10)',
          background: '#0D0F12',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Browser top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: '#131619',
            borderBottom: '1px solid rgba(148,163,184,0.06)',
          }}
        >
          {/* Traffic lights */}
          <div className="flex gap-2">
            {['#EF4444', '#F59E0B', '#10B981'].map(color => (
              <div key={color} className="w-3 h-3 rounded-full"
                   style={{ background: color, opacity: 0.7 }} />
            ))}
          </div>
          {/* URL bar */}
          <div
            className="flex-1 max-w-xs mx-auto rounded px-3 py-1 text-[11px] font-mono text-center"
            style={{
              background: '#07080A',
              color: '#475569',
              border: '1px solid rgba(148,163,184,0.06)',
            }}
          >
            bitforbytes.in/digital-design/d1
          </div>
        </div>

        {/* App UI preview */}
        <div
          className="relative flex flex-col"
          style={{ height: '480px', background: '#07080A', overflow: 'hidden' }}
        >
          {/* Top nav strip */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}
          >
            <LogoWordmark size="sm" />
            <div className="flex gap-4">
              {['DD-M01', 'SCENE 4/19', 'Interactive Sandbox'].map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono"
                      style={{ color: '#475569' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive content area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center">
            {/* Left Column: Toggles (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="text-[9px] font-mono text-[#475569] uppercase tracking-wider">
                INPUTS // INTERACTIVE VECTORS
              </div>
              <div className="space-y-3">
                {[
                  { name: 'A', val: a, setter: setA },
                  { name: 'B', val: b, setter: setB },
                  { name: 'C', val: c, setter: setC },
                ].map(input => (
                  <button
                    key={input.name}
                    onClick={() => {
                      playToggleTone(input.val === 0);
                      input.setter(input.val === 0 ? 1 : 0);
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border font-mono transition-all duration-150 cursor-pointer active:scale-98"
                    style={{
                      background: input.val === 1 ? 'rgba(34,211,238,0.03)' : '#0D0F12',
                      borderColor: input.val === 1 ? 'rgba(34,211,238,0.25)' : 'rgba(148,163,184,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: input.val === 1 ? '#22D3EE' : '#94A3B8' }}>
                        PIN {input.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                            style={{
                              background: input.val === 1 ? 'rgba(34,211,238,0.1)' : 'rgba(148,163,184,0.05)',
                              color: input.val === 1 ? '#22D3EE' : '#475569'
                            }}>
                        {input.val === 1 ? 'HIGH' : 'LOW'}
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: input.val === 1 ? '#22D3EE' : '#475569' }}>
                      {input.val === 1 ? '3.3V' : '0.0V'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Truth table & Solver (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between h-full py-2 space-y-4">
              {/* Truth table */}
              <div className="bg-[#0D0F12] border border-white/[0.04] rounded-xl p-4 flex flex-col space-y-2">
                <div className="flex justify-between text-[9px] font-mono text-[#475569] uppercase tracking-wider border-b border-white/[0.04] pb-1.5">
                  <div className="flex gap-4">
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                  </div>
                  <span>F (OUT)</span>
                </div>
                <div className="space-y-1 font-mono text-[10px] max-h-[140px] overflow-y-auto pr-1">
                  {truthTable.map((row, idx) => {
                    const isActive = row[0] === a && row[1] === b && row[2] === c;
                    const isMinterm = row[3] === 1;
                    return (
                      <div
                        key={idx}
                        className="flex justify-between py-0.5 px-2 rounded transition-colors"
                        style={{
                          background: isActive ? 'rgba(34,211,238,0.08)' : 'transparent',
                        }}
                      >
                        <div className="flex gap-4" style={{ color: isActive ? '#22D3EE' : '#94A3B8' }}>
                          <span>{row[0]}</span>
                          <span>{row[1]}</span>
                          <span>{row[2]}</span>
                        </div>
                        <span style={{
                          color: isMinterm
                            ? (isActive ? '#22D3EE' : 'rgba(34,211,238,0.5)')
                            : (isActive ? '#F1F5F9' : '#475569'),
                          fontWeight: isMinterm || isActive ? 'bold' : 'normal'
                        }}>
                          {row[3]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Solver Equation */}
              <div className="p-4 bg-[#0D0F12]/80 border border-white/[0.04] rounded-xl space-y-2">
                <div className="text-[9px] font-mono text-[#475569] uppercase tracking-wider">
                  SOLVER // MINTERM EVALUATION
                </div>
                <div className="font-mono text-[11px] sm:text-xs flex flex-wrap gap-1 items-center justify-center py-1">
                  <span className="text-white font-bold">F =</span>
                  <span className="transition-all duration-200" style={{ color: term1 ? '#22D3EE' : '#475569', textShadow: term1 ? '0 0 8px rgba(34,211,238,0.2)' : 'none' }}>
                    A·B'·C
                  </span>
                  <span className="text-[#475569]">+</span>
                  <span className="transition-all duration-200" style={{ color: term2 ? '#22D3EE' : '#475569', textShadow: term2 ? '0 0 8px rgba(34,211,238,0.2)' : 'none' }}>
                    A'·B·C'
                  </span>
                  <span className="text-[#475569]">+</span>
                  <span className="transition-all duration-200" style={{ color: term3 ? '#22D3EE' : '#475569', textShadow: term3 ? '0 0 8px rgba(34,211,238,0.2)' : 'none' }}>
                    A·B·C
                  </span>
                  <span className="text-white font-bold mx-1">=</span>
                  <span className="text-[13px] font-bold transition-all duration-200 px-2 py-0.5 rounded"
                        style={{
                          background: f === 1 ? 'rgba(34,211,238,0.1)' : 'rgba(148,163,184,0.05)',
                          color: f === 1 ? '#22D3EE' : '#94A3B8',
                          boxShadow: f === 1 ? '0 0 10px rgba(34,211,238,0.1)' : 'none'
                        }}>
                    {f}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, #07080A)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
