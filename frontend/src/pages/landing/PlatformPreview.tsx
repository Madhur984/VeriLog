import { useState } from 'react';

export const PlatformPreview = () => {
  const [a, setA] = useState<0 | 1>(1);
  const [b, setB] = useState<0 | 1>(0);
  const [c, setC] = useState<0 | 1>(1);

  const term1 = a === 1 && b === 0 && c === 1;
  const term2 = a === 0 && b === 1 && c === 0;
  const term3 = a === 1 && b === 1 && c === 1;
  const f = term1 || term2 || term3 ? 1 : 0;

  const truthTable = [
    [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 0],
    [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 0, 0], [1, 1, 1, 1],
  ];

  const playTone = (isHigh: boolean) => {
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
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.06);
    } catch { /* autoplay policy */ }
  };

  return (
    <section className="w-full" style={{ background: '#F4F6FA' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#0891B2' }}>
            Inside the platform
          </span>
          <h2 className="mt-3 font-extrabold tracking-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', color: '#0B1220', letterSpacing: '-0.02em' }}>
            Try it right here.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#475569' }}>
            Flip the inputs - watch the truth table and the minterm equation solve live. This is a real
            slice of the platform, running in your browser.
          </p>
        </div>

        {/* Device frame (white bezel, dark screen) */}
        <div className="rounded-3xl bg-white p-2.5" style={{ border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 40px 80px rgba(15,23,42,0.12)' }}>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#07080A' }}>
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0D0F12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-2">
                {['#EF4444', '#F59E0B', '#10B981'].map((c2) => (
                  <div key={c2} className="h-3 w-3 rounded-full" style={{ background: c2, opacity: 0.7 }} />
                ))}
              </div>
              <div className="flex-1 max-w-xs mx-auto rounded-md px-3 py-1 text-[11px] font-mono text-center" style={{ background: '#07080A', color: '#64748B', border: '1px solid rgba(255,255,255,0.06)' }}>
                bitforbytes.in/dsd/1
              </div>
            </div>

            {/* Interactive content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
              {/* Inputs */}
              <div className="md:col-span-5 space-y-4">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#475569' }}>Inputs · click to toggle</div>
                {[{ name: 'A', val: a, set: setA }, { name: 'B', val: b, set: setB }, { name: 'C', val: c, set: setC }].map((inp) => (
                  <button
                    key={inp.name}
                    onClick={() => { playTone(inp.val === 0); inp.set(inp.val === 0 ? 1 : 0); }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl font-mono transition-all active:scale-[0.98]"
                    style={{ background: inp.val === 1 ? 'rgba(34,211,238,0.06)' : '#0D0F12', border: `1px solid ${inp.val === 1 ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.08)'}` }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: inp.val === 1 ? '#22D3EE' : '#94A3B8' }}>PIN {inp.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: inp.val === 1 ? 'rgba(34,211,238,0.12)' : 'rgba(148,163,184,0.08)', color: inp.val === 1 ? '#22D3EE' : '#64748B' }}>
                        {inp.val === 1 ? 'High' : 'Low'}
                      </span>
                    </span>
                    <span className="text-xs font-bold" style={{ color: inp.val === 1 ? '#22D3EE' : '#64748B' }}>{inp.val === 1 ? '3.3V' : '0.0V'}</span>
                  </button>
                ))}
              </div>

              {/* Truth table + solver */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="rounded-xl p-4" style={{ background: '#0D0F12', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider pb-1.5 mb-1" style={{ color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="flex gap-4"><span>A</span><span>B</span><span>C</span></span>
                    <span>F</span>
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    {truthTable.map((row, idx) => {
                      const active = row[0] === a && row[1] === b && row[2] === c;
                      const minterm = row[3] === 1;
                      return (
                        <div key={idx} className="flex justify-between py-0.5 px-2 rounded" style={{ background: active ? 'rgba(34,211,238,0.10)' : 'transparent' }}>
                          <span className="flex gap-4" style={{ color: active ? '#22D3EE' : '#94A3B8' }}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></span>
                          <span style={{ color: minterm ? (active ? '#22D3EE' : 'rgba(34,211,238,0.5)') : active ? '#F1F5F9' : '#475569', fontWeight: minterm || active ? 700 : 400 }}>{row[3]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'rgba(13,15,18,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: '#475569' }}>Solver · minterm evaluation</div>
                  <div className="font-mono text-[11px] sm:text-xs flex flex-wrap gap-1 items-center justify-center py-1">
                    <span className="text-white font-bold">F =</span>
                    <span style={{ color: term1 ? '#22D3EE' : '#475569' }}>A·B&apos;·C</span>
                    <span style={{ color: '#475569' }}>+</span>
                    <span style={{ color: term2 ? '#22D3EE' : '#475569' }}>A&apos;·B·C&apos;</span>
                    <span style={{ color: '#475569' }}>+</span>
                    <span style={{ color: term3 ? '#22D3EE' : '#475569' }}>A·B·C</span>
                    <span className="text-white font-bold mx-1">=</span>
                    <span className="text-[13px] font-bold px-2 py-0.5 rounded" style={{ background: f === 1 ? 'rgba(34,211,238,0.12)' : 'rgba(148,163,184,0.06)', color: f === 1 ? '#22D3EE' : '#94A3B8' }}>{f}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
