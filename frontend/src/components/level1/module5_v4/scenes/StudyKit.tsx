import React from 'react';

// ─── SHARED STUDY-FOCUSED SCENE BUILDING BLOCKS ────────────────────────────────
// All Verilog Core scenes use these primitives to stay visually consistent.

export const Eyebrow: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <div
    className="inline-block text-[10px] font-mono tracking-[0.28em] uppercase px-2.5 py-1 rounded-sm border"
    style={{ color: accent, borderColor: `${accent}55` }}
  >
    {children}
  </div>
);

export const SceneTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
    {children}
  </h1>
);

export const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light max-w-3xl">
    {children}
  </p>
);

export const Body: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-base text-white/65 leading-relaxed max-w-3xl ${className}`}>
    {children}
  </p>
);

export const Section: React.FC<{ accent: string; title: string; children: React.ReactNode }> = ({ accent, title, children }) => (
  <section className="space-y-3">
    <h2
      className="text-[11px] font-mono tracking-[0.22em] uppercase pb-2 border-b inline-block pr-12"
      style={{ color: accent, borderColor: `${accent}55` }}
    >
      {title}
    </h2>
    <div className="space-y-3 pt-2">{children}</div>
  </section>
);

export const CodeBlock: React.FC<{ accent: string; lang?: string; code: string }> = ({ accent, lang = 'verilog', code }) => (
  <div
    className="rounded-lg border bg-[#08090C] overflow-hidden"
    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
  >
    <div
      className="flex items-center justify-between px-4 py-2 border-b text-[10px] font-mono"
      style={{ borderColor: 'rgba(255,255,255,0.06)', color: `${accent}cc` }}
    >
      <span className="tracking-[0.2em] uppercase">{lang}</span>
      <span className="text-white/30 tracking-[0.15em]">readable example</span>
    </div>
    <pre className="px-5 py-4 text-[13px] leading-relaxed font-mono text-white/85 whitespace-pre overflow-x-auto">
      <code>{code}</code>
    </pre>
  </div>
);

export const KeyPoints: React.FC<{ accent: string; points: string[] }> = ({ accent, points }) => (
  <ul className="space-y-2 max-w-3xl">
    {points.map((p, i) => (
      <li key={i} className="flex items-start gap-3 text-[14px] text-white/75 leading-relaxed">
        <span
          className="mt-2 w-1.5 h-1.5 rounded-sm flex-shrink-0"
          style={{ backgroundColor: accent }}
        />
        <span>{p}</span>
      </li>
    ))}
  </ul>
);

export const TwoColumn: React.FC<{ left: React.ReactNode; right: React.ReactNode }> = ({ left, right }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5 space-y-2">
      {left}
    </div>
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5 space-y-2">
      {right}
    </div>
  </div>
);

export const Callout: React.FC<{ accent: string; label?: string; children: React.ReactNode }> = ({ accent, label = 'Key Insight', children }) => (
  <div
    className="rounded-lg border-l-2 pl-4 py-3 max-w-3xl bg-white/[0.02]"
    style={{ borderColor: accent }}
  >
    <div className="text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5" style={{ color: accent }}>
      {label}
    </div>
    <div className="text-[14px] text-white/80 leading-relaxed">{children}</div>
  </div>
);

// ─── SCENE WRAPPER ────────────────────────────────────────────────────────────
export const StudyScene: React.FC<{
  accent: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ accent, eyebrow, title, lead, children }) => (
  <div className="space-y-8 w-full">
    <header className="space-y-4">
      <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
      <SceneTitle>{title}</SceneTitle>
      {lead && <Lead>{lead}</Lead>}
    </header>
    <div className="space-y-8">{children}</div>
  </div>
);
