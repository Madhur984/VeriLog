/**
 * Shared toolkit for the SUBTRACTOR track (dsd modules 14-17).
 *
 * One place for: the bilingual (English / हिन्दी) language store + toggle, the
 * scene primitives (headers, cards, bullet lists, transcript panels, truth
 * tables), the generic data-driven scenes (cover / video / theory / recap /
 * flashcards / quiz) and a bilingual flip-card deck. Each module ships only a
 * thin content.ts + a scenes.tsx (bespoke circuit/activity visuals) on top of
 * this, so all four modules stay consistent and there is one thing to fix.
 *
 * Theme: every component is driven by `isDarkMode` (Tailwind classes) + an
 * `accent` hex (the active part colour, passed down from the engine). No
 * component owns its own theme state - that lives in the shared useColorScheme
 * store, exactly like the rest of the app.
 */
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages, BookOpen, FileText, PlayCircle, ChevronDown, RotateCw, Eye, Wrench, ArrowRight,
} from 'lucide-react';
import { QuizArena, type Problem } from '../dsd_module9_v1/components/QuizArena';

/* ───────────────────────── content types ───────────────────────── */
// These match the JSON the content workflow produced 1:1 (HI fields optional so
// a missing translation gracefully falls back to English).

export interface SubScene {
  id: string;
  label: string;
  kind: string;                 // cover|video|theory|truth|circuit|activity|flashcards|quiz|recap
  subtitle?: string;
  theoryEN: string[];
  theoryHI?: string[];
  transcriptEN: string;
  transcriptHI?: string;
  visualNote?: string;
}
export interface SubCard {
  frontEN: string; backEN: string;
  frontHI?: string; backHI?: string;
}
export interface SubQuiz {
  questionEN: string; questionHI?: string;
  options: string[];
  answerIndex: number;
  explainEN: string; explainHI?: string;
}
export interface SubContent {
  moduleTitle: string;
  moduleSubtitle?: string;
  scenes: SubScene[];
  flashcards: SubCard[];
  quiz: SubQuiz[];
}

/* ───────────────────────── language store ──────────────────────── */

export type Lang = 'en' | 'hi';
const LANG_KEY = 'bfb_sub_lang';

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }
const SubLangContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} });

export const SubLangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem(LANG_KEY) as Lang) || 'en'; } catch { return 'en'; }
  });
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  }, []);
  return <SubLangContext.Provider value={{ lang, setLang }}>{children}</SubLangContext.Provider>;
};

export const useSubLang = () => useContext(SubLangContext);

/** Pick the EN or HI variant, falling back to EN when a translation is absent. */
export function pick(lang: Lang, en: string, hi?: string): string {
  return lang === 'hi' ? (hi && hi.trim() ? hi : en) : en;
}
export function pickList(lang: Lang, en: string[], hi?: string[]): string[] {
  return lang === 'hi' && hi && hi.length ? hi : en;
}

export const LangToggle: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang, setLang } = useSubLang();
  return (
    <div
      className={`flex items-center gap-1 rounded-full border p-1 ${
        isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
      }`}
      title="Switch language · भाषा बदलें"
    >
      <Languages size={13} className="ml-1.5 opacity-40" />
      {(['en', 'hi'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide transition-colors"
          style={
            lang === l
              ? { background: accent, color: '#000' }
              : { color: isDarkMode ? '#94a3b8' : '#475569' }
          }
        >
          {l === 'en' ? 'EN' : 'हिं'}
        </button>
      ))}
    </div>
  );
};

/* ───────────────────────── theme helpers ───────────────────────── */

export const tone = (isDarkMode: boolean) => ({
  text: isDarkMode ? 'text-white' : 'text-slate-900',
  sub: isDarkMode ? 'text-slate-300' : 'text-slate-600',
  faint: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  card: isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl',
  soft: isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200',
  ink: isDarkMode ? '#e2e8f0' : '#0f172a',
  box: isDarkMode ? '#0a0e1a' : '#ffffff',
});

/* ───────────────────────── primitives ──────────────────────────── */

export const Eyebrow: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <div className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>{children}</div>
);

export const SceneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-6xl mx-auto space-y-10 py-2">{children}</div>
);

export const Card: React.FC<{ isDarkMode: boolean; className?: string; children: React.ReactNode; style?: React.CSSProperties }>
  = ({ isDarkMode, className = '', children, style }) => (
  <div className={`p-6 rounded-3xl border ${tone(isDarkMode).card} ${className}`} style={style}>{children}</div>
);

/** A theory bullet list that follows the active language. */
export const Bullets: React.FC<{ isDarkMode: boolean; accent: string; en: string[]; hi?: string[] }>
  = ({ isDarkMode, accent, en, hi }) => {
  const { lang } = useSubLang();
  const items = pickList(lang, en, hi);
  const t = tone(isDarkMode);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
          <span className={`text-[15px] leading-relaxed ${t.sub}`}>{it}</span>
        </li>
      ))}
    </ul>
  );
};

/** Narration transcript card with the language label, matches the video beat. */
export const TranscriptPanel: React.FC<{ isDarkMode: boolean; accent: string; en: string; hi?: string }>
  = ({ isDarkMode, accent, en, hi }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className={`p-5 rounded-3xl border ${t.soft}`}>
      <div className="mb-2 flex items-center gap-2">
        <FileText size={14} style={{ color: accent }} />
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'विवरण · Transcript' : 'Transcript'}
        </span>
      </div>
      <p className={`text-[14px] leading-relaxed ${t.sub}`}>{pick(lang, en, hi)}</p>
    </div>
  );
};

/* ───────────────────────── truth table ─────────────────────────── */

export interface TTRow { cells: (string | number)[]; highlight?: boolean }

export const TruthTable: React.FC<{
  isDarkMode: boolean; accent: string; headers: string[]; rows: TTRow[]; note?: string;
}> = ({ isDarkMode, accent, headers, rows, note }) => {
  const t = tone(isDarkMode);
  return (
    <div className={`overflow-hidden rounded-3xl border ${t.card}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-center">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-[13px] font-black"
                  style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={r.highlight ? { background: `${accent}14` } : undefined}>
                {r.cells.map((c, ci) => (
                  <td key={ci}
                    className={`px-4 py-2.5 text-[15px] ${ci < headers.length - 2 ? t.faint : t.text} ${r.highlight ? 'font-black' : 'font-bold'}`}
                    style={{ borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <div className={`px-4 py-3 text-[12px] ${t.faint}`} style={{ borderTop: `1px solid ${accent}22` }}>{note}</div>}
    </div>
  );
};

/* ───────────────────────── live logic gate ─────────────────────── */
// Authentic gate silhouettes (XOR / AND / OR / NOT) with colour-coded wires
// whose glow follows the live bit value. Reused by the parking lot, the ledger
// and the calculator analogies so every logic claim is shown computing.

export type GateType = 'XOR' | 'AND' | 'OR' | 'NOT';

const gateCompute = (type: GateType, a: number, b: number) =>
  type === 'XOR' ? (a ^ b) : type === 'AND' ? (a & b) : type === 'OR' ? (a | b) : (a ^ 1);

export const LiveGate: React.FC<{
  type: GateType; a: number; b?: number; isDarkMode: boolean; accent: string;
  labelA?: string; labelB?: string; labelOut?: string; colorA?: string; colorB?: string; colorOut?: string;
}> = ({ type, a, b = 0, isDarkMode, accent, labelA, labelB, labelOut, colorA = '#38bdf8', colorB = '#fb7185', colorOut = '#34d399' }) => {
  const out = gateCompute(type, a, b);
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const wire = (on: number, c: string) => (on ? c : dim);
  const body: Record<GateType, string> = {
    AND: 'M40,18 L62,18 A26,26 0 0 1 62,70 L40,70 Z',
    OR: 'M36,18 Q56,44 36,70 Q78,70 92,44 Q78,18 36,18 Z',
    XOR: 'M44,18 Q64,44 44,70 Q86,70 100,44 Q86,18 44,18 Z',
    NOT: 'M42,18 L42,70 L86,44 Z',
  };
  const tip = type === 'AND' ? 88 : type === 'NOT' ? 92 : type === 'XOR' ? 100 : 92;
  const single = type === 'NOT';
  return (
    <svg viewBox="0 0 150 88" className="h-auto w-full max-w-[260px]">
      {/* back arc for XOR */}
      {type === 'XOR' && <path d="M34,18 Q54,44 34,70" fill="none" stroke={accent} strokeWidth="2.5" />}
      {/* input wires */}
      {single ? (
        <motion.line x1="6" y1="44" x2="42" y2="44" stroke={wire(a, colorA)} strokeWidth="3"
          animate={{ opacity: a ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: a ? Infinity : 0, duration: 1.4 }} />
      ) : (
        <>
          <motion.line x1="6" y1="30" x2={type === 'XOR' ? 46 : 40} y2="30" stroke={wire(a, colorA)} strokeWidth="3"
            animate={{ opacity: a ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: a ? Infinity : 0, duration: 1.4 }} />
          <motion.line x1="6" y1="58" x2={type === 'XOR' ? 46 : 40} y2="58" stroke={wire(b, colorB)} strokeWidth="3"
            animate={{ opacity: b ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: b ? Infinity : 0, duration: 1.4 }} />
        </>
      )}
      {/* gate body */}
      <path d={body[type]} fill={isDarkMode ? '#0a0e1a' : '#ffffff'} stroke={accent} strokeWidth="2.5" />
      {type === 'NOT' && <circle cx={tip - 1} cy="44" r="5" fill={isDarkMode ? '#0a0e1a' : '#ffffff'} stroke={accent} strokeWidth="2.5" />}
      <text x={type === 'NOT' ? 56 : (type === 'AND' ? 56 : 62)} y="48" fontFamily="monospace" fontSize="11" fontWeight="700" fill={accent} textAnchor="middle">{type}</text>
      {/* output wire */}
      <motion.line x1={type === 'NOT' ? tip + 4 : tip} y1="44" x2="144" y2="44" stroke={wire(out, colorOut)} strokeWidth="3"
        animate={{ opacity: out ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: out ? Infinity : 0, duration: 1.4 }} />
      {/* pin values */}
      {single ? (
        <text x="2" y="40" fontFamily="monospace" fontSize="12" fontWeight="800" fill={wire(a, colorA)}>{a}</text>
      ) : (
        <>
          <text x="2" y="26" fontFamily="monospace" fontSize="12" fontWeight="800" fill={wire(a, colorA)}>{a}</text>
          <text x="2" y="62" fontFamily="monospace" fontSize="12" fontWeight="800" fill={wire(b, colorB)}>{b}</text>
        </>
      )}
      <text x="146" y="40" fontFamily="monospace" fontSize="12" fontWeight="800" fill={wire(out, colorOut)} textAnchor="end">{out}</text>
      {/* optional labels */}
      {labelA && <text x="14" y="18" fontFamily="monospace" fontSize="9" fill={t.faint as string}>{labelA}</text>}
      {labelB && !single && <text x="14" y="80" fontFamily="monospace" fontSize="9" fill={t.faint as string}>{labelB}</text>}
      {labelOut && <text x="146" y="62" fontFamily="monospace" fontSize="9" fill={t.faint as string} textAnchor="end">{labelOut}</text>}
    </svg>
  );
};

/* ───────────────────────── step-through ────────────────────────── */
// A guided, click-through walkthrough: the student advances one step at a time
// and the body + caption animate in. Used to explain every algorithm step by
// step (binary subtraction, two's complement, the +6 correction, etc.).

export const StepThrough: React.FC<{
  steps: { label: string; body: React.ReactNode }[];
  isDarkMode: boolean; accent: string;
}> = ({ steps, isDarkMode, accent }) => {
  const [i, setI] = useState(0);
  const t = tone(isDarkMode);
  const n = steps.length;
  const idx = Math.max(0, Math.min(i, n - 1));
  const step = steps[idx];
  if (!step) return null;
  return (
    <div className={`rounded-3xl border p-6 ${t.card}`}>
      <div className="mb-4 flex items-center gap-1.5">
        {steps.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`step ${k + 1}`}
            className="h-2 flex-1 rounded-full transition-all"
            style={{ background: k <= idx ? accent : (isDarkMode ? '#1e293b' : '#e2e8f0') }} />
        ))}
      </div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>Step {idx + 1} / {n}</span>
        <span className={`text-right text-sm font-black ${t.text}`}>{step.label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.3 }}>
          {step.body}
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={idx === 0}
          className={`rounded-xl border px-4 py-2 text-sm font-bold ${t.soft} ${idx === 0 ? 'opacity-30' : ''}`}>Prev</button>
        <button onClick={() => setI((v) => Math.min(n - 1, v + 1))}
          className="rounded-xl px-5 py-2 text-sm font-black text-black active:scale-95"
          style={{ background: accent, opacity: idx === n - 1 ? 0.45 : 1 }}>
          {idx === n - 1 ? 'Done' : 'Next step'}
        </button>
      </div>
    </div>
  );
};

/* ───────────────────────── binary hero ─────────────────────────── */
// A living cover motif: a 5-bit odometer that counts up, every bit flipping in
// 3D as it changes, the decimal value morphing, and a scanline sweeping across.
// Pure binary - language-neutral - so it fits every module on the track, and it
// quietly drills binary<->decimal fluency before a single word of theory. Tap
// to pause; tap again to resume; tap while paused steps one value forward.

export const BinaryHero: React.FC<{ isDarkMode: boolean; accent: string; bitWidth?: number }>
  = ({ isDarkMode, accent, bitWidth = 5 }) => {
  const t = tone(isDarkMode);
  const max = 1 << bitWidth;
  const [n, setN] = useState(5 % max);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setN((v) => (v + 1) % max), 1150);
    return () => clearInterval(id);
  }, [playing, max]);
  const arr = Array.from({ length: bitWidth }, (_, i) => (n >> (bitWidth - 1 - i)) & 1);
  return (
    <button
      type="button"
      onClick={() => (playing ? setPlaying(false) : setN((v) => (v + 1) % max))}
      onDoubleClick={() => setPlaying(true)}
      title="tap to pause / step · double-tap to play"
      className={`relative mx-auto block w-full max-w-2xl overflow-hidden rounded-3xl border p-6 text-left ${tone(isDarkMode).card}`}
    >
      {/* sweeping scanline */}
      <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 w-28"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}26, transparent)` }}
        animate={{ x: ['-30%', '130%'] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }} />
      <div className="relative flex flex-wrap items-end justify-center gap-2 sm:gap-3">
        {arr.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[9px] tabular-nums ${t.faint}`}>{1 << (bitWidth - 1 - i)}</span>
            <div className="h-11 w-11 [perspective:600px]">
              <motion.div key={b}
                initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.3 }}
                className="flex h-full w-full items-center justify-center rounded-xl font-mono text-xl font-black tabular-nums"
                style={{ background: b ? accent : 'transparent', color: b ? '#000' : accent, border: `1.5px solid ${accent}${b ? '' : '55'}` }}>
                {b}
              </motion.div>
            </div>
          </div>
        ))}
        <span className={`mx-1 self-center font-mono text-2xl font-black ${t.faint}`}>=</span>
        <div className="flex min-w-[2.5ch] items-center justify-center self-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span key={n} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }} className="font-mono text-4xl font-black tabular-nums" style={{ color: accent }}>
              {n}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className={`relative mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] ${t.faint}`}>
        {playing ? 'live · tap to pause' : 'paused · tap to step · dbl-tap to play'}
      </div>
    </button>
  );
};

/* ───────────────────────── flow rail ───────────────────────────── */
// "Bits -> logic -> result" - the one loop every module on this track shares.
// Animated pulses travel the wires from the input pins through the logic block
// to the output, so the recap leaves a moving mental model, not just a list.

export const FlowRail: React.FC<{ isDarkMode: boolean; accent: string }>
  = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const Pulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; delay: number }> = ({ x1, y1, x2, y2, delay }) => (
    <motion.circle r="4" fill={accent}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }} />
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'bits → logic → नतीजा' : 'bits → logic → result'}
      </div>
      <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-lg">
        {/* wires */}
        <line x1="58" y1="40" x2="124" y2="50" stroke={dim} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="80" x2="124" y2="70" stroke={dim} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="196" y1="60" x2="262" y2="60" stroke={dim} strokeWidth="2.5" strokeLinecap="round" />
        {/* traveling pulses */}
        <Pulse x1={58} y1={40} x2={124} y2={50} delay={0} />
        <Pulse x1={58} y1={80} x2={124} y2={70} delay={0.25} />
        <Pulse x1={196} y1={60} x2={262} y2={60} delay={0.85} />
        {/* input pins */}
        {[{ y: 40, l: 'A' }, { y: 80, l: 'B' }].map((p) => (
          <g key={p.l}>
            <circle cx="40" cy={p.y} r="16" fill={box} stroke={accent} strokeWidth="2.5" />
            <text x="40" y={p.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="800" fill={accent}>{p.l}</text>
          </g>
        ))}
        {/* logic block */}
        <rect x="124" y="32" width="72" height="56" rx="12" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="160" y="58" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={accent}>LOGIC</text>
        <text x="160" y="74" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={dim}>gates</text>
        {/* output node */}
        <circle cx="284" cy="60" r="19" fill={accent} />
        <text x="284" y="66" textAnchor="middle" fontFamily="monospace" fontSize="18" fontWeight="900" fill={box}>=</text>
      </svg>
      <p className={`mt-2 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'पूरे track का यही एक loop है - input bits दीजिए, gates को compute करने दीजिए, नतीजा पढ़िए।'
          : 'Every page on this track is the same loop - drive the input bits, let the gates compute, read the result.'}
      </p>
    </Card>
  );
};

/* ───────────────────────── generic scenes ──────────────────────── */

interface SceneProps { isDarkMode: boolean; accent: string; scene: SubScene }

export const CoverScene: React.FC<SceneProps & { moduleTitle: string; moduleSubtitle?: string; kicker?: string }>
  = ({ isDarkMode, accent, scene, moduleTitle, moduleSubtitle, kicker }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <SceneShell>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em]"
          style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}44` }}>
          {kicker ?? 'Subtractor Track'}
        </div>
        <h1 className={`mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl ${t.text}`}>{moduleTitle}</h1>
        {moduleSubtitle && <p className={`mx-auto mt-4 max-w-2xl text-lg ${t.sub}`}>{moduleSubtitle}</p>}
      </div>
      <BinaryHero isDarkMode={isDarkMode} accent={accent} />
      <Card isDarkMode={isDarkMode} className="mx-auto max-w-3xl">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'इस module में' : 'In this module'}</Eyebrow>
        <div className="mt-4"><Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} /></div>
      </Card>
    </SceneShell>
  );
};

export const TheoryScene: React.FC<SceneProps & { children?: React.ReactNode }>
  = ({ isDarkMode, accent, scene, children }) => {
  const t = tone(isDarkMode);
  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>
      <Card isDarkMode={isDarkMode}>
        <Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>
      {children}
    </SceneShell>
  );
};

export const VideoScene: React.FC<SceneProps & { src?: string }>
  = ({ isDarkMode, accent, scene, src }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'वीडियो पाठ · Lesson' : 'Video lesson'}</Eyebrow>
        <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.label}</h2>
        {scene.subtitle && <p className={`max-w-3xl text-base ${t.sub}`}>{scene.subtitle}</p>}
      </section>

      <motion.div className={`relative overflow-hidden rounded-3xl border ${t.card}`}>
        {src ? (
          <video
            ref={videoRef}
            controls
            preload="metadata"
            src={src}
            className="w-full aspect-video bg-black"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-black/90 text-center">
            <div>
              <PlayCircle size={40} className="mx-auto mb-3 opacity-40" style={{ color: accent }} />
              <p className="text-sm text-slate-400">{lang === 'hi' ? 'वीडियो जल्द आ रहा है - नीचे पूरा transcript पढ़ें।' : 'Video coming soon - read the full transcript below.'}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* before-you-watch theory */}
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={14} style={{ color: accent }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            {lang === 'hi' ? 'देखने से पहले' : 'Before you watch'}
          </span>
        </div>
        <Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>

      {/* collapsible transcript */}
      <div className={`rounded-3xl border ${t.soft}`}>
        <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between p-5">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
            <FileText size={14} /> {lang === 'hi' ? 'पूरा transcript' : 'Full transcript'}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} className={t.faint} /></motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <p className={`px-5 pb-5 text-[14px] leading-relaxed ${t.sub}`}>{pick(lang, scene.transcriptEN, scene.transcriptHI)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export const RecapScene: React.FC<SceneProps & { children?: React.ReactNode }>
  = ({ isDarkMode, accent, scene, children }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'सार · Recap' : 'Recap'}</Eyebrow>
        <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.label}</h2>
      </section>
      <Card isDarkMode={isDarkMode}>
        <Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>
      <FlowRail isDarkMode={isDarkMode} accent={accent} />
      {children}
    </SceneShell>
  );
};

/* ───────────────────────── flashcards ──────────────────────────── */

export const SubFlashCards: React.FC<{ isDarkMode: boolean; accent: string; cards: SubCard[] }>
  = ({ isDarkMode, accent, cards }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c, i) => {
        const isFlipped = !!flipped[i];
        return (
          <div key={i} className="h-[280px] [perspective:1400px]">
            <div
              className="relative h-full w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
            >
              {/* front */}
              <div className={`absolute inset-0 flex flex-col overflow-hidden rounded-3xl border p-6 [backface-visibility:hidden] ${
                isDarkMode ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
              }`} style={{ borderColor: `${accent}33` }}>
                <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
                  {lang === 'hi' ? 'सवाल / पद' : 'Term'}
                </div>
                <h3 className={`mt-3 text-xl font-extrabold leading-snug ${t.text}`}>{pick(lang, c.frontEN, c.frontHI)}</h3>
                <div className={`mt-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
                  <RotateCw size={12} /> {lang === 'hi' ? 'जवाब के लिए tap करें' : 'tap for the answer'}
                </div>
              </div>
              {/* back */}
              <div className={`absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                isDarkMode ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
              }`} style={{ borderColor: `${accent}66` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
                  {lang === 'hi' ? 'असली logic' : 'The real logic'}
                </div>
                <p className={`mt-3 text-[14px] leading-relaxed ${t.text}`}>{pick(lang, c.backEN, c.backHI)}</p>
                <div className={`mt-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
                  <RotateCw size={12} /> {lang === 'hi' ? 'वापस पलटें' : 'tap to flip back'}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────────────────── quiz (wraps QuizArena) ──────────────── */

export const QuizScene: React.FC<{
  isDarkMode: boolean; accent: string; quiz: SubQuiz[];
  tag: string; title: string; intro: string; badge: string;
}> = ({ isDarkMode, accent, quiz, tag, title, intro, badge }) => {
  const { lang } = useSubLang();
  const problems: Problem[] = quiz.map((q, i) => ({
    id: `q${i}`,
    badge,
    badgeColor: accent,
    prompt: pick(lang, q.questionEN, q.questionHI),
    options: q.options,
    correct: q.answerIndex,
    explain: pick(lang, q.explainEN, q.explainHI),
  }));
  // QuizArena keeps answer state keyed by index, so remount on language switch
  // to avoid a stale pick pointing at the wrong translated prompt.
  return (
    <div key={lang}>
      <QuizArena isDarkMode={isDarkMode} accent={accent} tag={tag} title={title} intro={intro} problems={problems} />
    </div>
  );
};

/* ───────────────────────── workbench CTA ───────────────────────── */
// "Build it for real" panel that launches the live CircuitVerse workbench with
// the matching guided-build rail (/workbench?tutorial=<id>).

export const WorkbenchCTA: React.FC<{
  isDarkMode: boolean; accent: string; tutorial: string;
  titleEN?: string; titleHI?: string; bodyEN?: string; bodyHI?: string;
}> = ({ isDarkMode, accent, tutorial, titleEN, titleHI, bodyEN, bodyHI }) => {
  const navigate = useNavigate();
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="rounded-3xl border p-6" style={{ borderColor: `${accent}55`, background: `${accent}0d` }}>
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl" style={{ background: `${accent}1a`, color: accent }}>
          <Wrench size={26} />
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-black ${t.text}`}>
            {lang === 'hi' ? (titleHI ?? 'इसे असली में बनाइए') : (titleEN ?? 'Build it for real')}
          </h3>
          <p className={`mt-1 text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? (bodyHI ?? 'live CircuitVerse workbench खोलिए और यह circuit ख़ुद, कदम-दर-कदम बनाइए - हर row को असली hardware पर साबित कीजिए।')
              : (bodyEN ?? 'Open the live CircuitVerse workbench and build this circuit yourself, step by step - then prove every row on real hardware.')}
          </p>
        </div>
        <button onClick={() => navigate(`/workbench?tutorial=${tutorial}`)}
          className="flex items-center gap-2 rounded-2xl px-6 py-3 font-black text-black transition-all active:scale-95"
          style={{ background: accent, boxShadow: `0 10px 30px ${accent}33` }}>
          {lang === 'hi' ? 'Workbench खोलें' : 'Open the workbench'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
