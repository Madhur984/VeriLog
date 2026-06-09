import React from 'react';

/**
 * SignalShowcase: a self-contained, dependency-free animated "live oscilloscope".
 * Pure SVG + SMIL/CSS (no video, no canvas, no JS loop), so it stays tiny and smooth.
 * Waveforms scroll seamlessly across a dark screen with a sweeping scan line.
 * The accent palette is themeable so it can match warm (home) or blue (login) UIs.
 */

export interface SignalAccent {
  main: string;   // primary wave, grid lines, live dot, LOCKED label
  soft: string;   // secondary (back) wave
  bright: string; // clock wave, scan line, HUD text
  glow: string;   // outer box-shadow colour
}

/** Default warm palette (used on the landing page). */
const WARM_ACCENT: SignalAccent = {
  main: '#FB923C',
  soft: '#F97316',
  bright: '#FDBA74',
  glow: 'rgba(249,115,22,0.4)',
};

const VIEW_W = 1920;        // path width = 2× the visible tile so the scroll loops
const SHIFT = 960;          // translate distance == one visible tile
const MID = 200;

// Smooth sine as a dense polyline (computed once at module load).
function sinePath(period: number, amp: number, phase = 0, step = 6): string {
  let d = '';
  for (let x = 0; x <= VIEW_W; x += step) {
    const y = MID + amp * Math.sin((x / period) * Math.PI * 2 + phase);
    d += (x === 0 ? 'M' : 'L') + x.toFixed(0) + ' ' + y.toFixed(1) + ' ';
  }
  return d.trim();
}

// Square (clock) wave. Period divides SHIFT so it also loops seamlessly.
function squarePath(period: number, amp: number, baseY: number): string {
  const hi = baseY - amp;
  const lo = baseY + amp;
  let y = lo;
  let d = `M0 ${lo}`;
  for (let x = 0; x <= VIEW_W; x += period / 2) {
    const ny = y === lo ? hi : lo;
    d += ` L${x.toFixed(0)} ${ny}`;
    d += ` L${(x + period / 2).toFixed(0)} ${ny}`;
    y = ny;
  }
  return d;
}

const WAVE_MAIN = sinePath(480, 72);
const WAVE_SOFT = sinePath(320, 44, Math.PI);
const CLOCK = squarePath(240, 26, 78);

const Scroller: React.FC<{ children: React.ReactNode; dur: number }> = ({ children, dur }) => (
  <g>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      from="0 0"
      to={`-${SHIFT} 0`}
      dur={`${dur}s`}
      repeatCount="indefinite"
    />
    {children}
  </g>
);

export const SignalShowcase: React.FC<{ accent?: SignalAccent }> = ({ accent = WARM_ACCENT }) => (
  <div
    className="relative aspect-video w-full overflow-hidden rounded-[28px] border border-white/10"
    style={{ background: '#0A0E1A', boxShadow: `0 40px 90px -30px ${accent.glow}` }}
  >
    <style>{`
      @keyframes bfb-scan { 0%{transform:translateX(0);opacity:0} 8%{opacity:.9} 92%{opacity:.9} 100%{transform:translateX(100%);opacity:0} }
      @keyframes bfb-blink { 0%,100%{opacity:.35} 50%{opacity:1} }
      .bfb-scan { animation: bfb-scan 4.5s ease-in-out infinite; }
      .bfb-blink { animation: bfb-blink 1.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce){ .bfb-scan{animation:none;opacity:.5} }
    `}</style>

    {/* faint grid */}
    <svg className="absolute inset-0 h-full w-full opacity-[0.16]" preserveAspectRatio="none" viewBox="0 0 960 400">
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={'v' + i} x1={i * 80} y1="0" x2={i * 80} y2="400" stroke={accent.main} strokeWidth="1" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={'h' + i} x1="0" y1={i * 80} x2="960" y2={i * 80} stroke={accent.main} strokeWidth="1" />
      ))}
    </svg>

    {/* waveforms (each tile is 960 wide; we draw 1920 and scroll -960 for a seamless loop) */}
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 960 400">
      <defs>
        <filter id="bfbGlow2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <Scroller dur={11}>
        <path d={WAVE_SOFT} fill="none" stroke={accent.soft} strokeWidth="3" strokeOpacity="0.5" />
      </Scroller>
      <Scroller dur={6}>
        <path d={CLOCK} fill="none" stroke={accent.bright} strokeWidth="2.5" strokeOpacity="0.65" />
      </Scroller>
      <Scroller dur={7.5}>
        <path d={WAVE_MAIN} fill="none" stroke={accent.main} strokeWidth="3.5" filter="url(#bfbGlow2)" strokeLinecap="round" />
      </Scroller>
    </svg>

    {/* sweeping scan line */}
    <div
      className="bfb-scan pointer-events-none absolute inset-y-0 left-0 w-[2px]"
      style={{ background: `linear-gradient(to bottom, transparent, ${accent.bright}, transparent)` }}
    />

    {/* HUD labels */}
    <div className="absolute left-5 top-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent.bright }}>
      <span className="bfb-blink h-2 w-2 rounded-full" style={{ background: accent.main }} /> Signal live
    </div>
    <div className="absolute bottom-4 left-5 font-mono text-[11px] text-white/55">
      CLK 100&nbsp;MHz&nbsp;&nbsp;&nbsp;8-bit bus&nbsp;&nbsp;&nbsp;<span style={{ color: accent.main }}>LOCKED</span>
    </div>
    <div className="absolute bottom-4 right-5 font-mono text-[11px] text-white/45 tabular-nums">▲ +5.0V&nbsp;&nbsp;▼ 0.0V</div>
  </div>
);
