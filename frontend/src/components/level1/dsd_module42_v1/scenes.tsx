/**
 * Hazards & Races - dsd/42, "Correct Logic, Wrong Instant". FINAL module of the
 * Sequential Logic track. Generic scenes come from the shared _subtractor kit;
 * the live glitch scope, the two-path race, the static-1 / static-0 K-map labs,
 * the three-path dynamic-hazard reconvergence, the essential-hazard feedback
 * race, the consensus-theorem step-through and the two-wire bulb analogy are
 * bespoke. EVERY glitch shown (dip, spike, multi-toggle, race verdict) is
 * COMPUTED from one small shared timing model (`twoPathTimeline`) or a plain
 * boolean function - never hardcoded - so the "before" and "after" states
 * genuinely differ in code, not just in prose.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Plus, Minus } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const SRC_EN: string | undefined = '/videos/dsd42-hazards.mp4';
const SRC_HI: string | undefined = undefined;

/* ═══════════════════════ core hazard math (single source of truth) ═══════════════════════
   Every glitch in this module reduces to the same shape: a FAST path and a SLOW
   path each hold an OLD value until their own gate delay elapses, then flip to
   a NEW value; a combining gate (OR for SOP, AND for POS) is evaluated at every
   tick. A hazard is simply the combine producing a value neither steady state
   expects, for as long as the two paths disagree. */
type Combine = 'AND' | 'OR';
type Dir = 'fall' | 'rise';
interface PathTick { t: number; fast: number; slow: number; y: number }

function twoPathTimeline(
  fastOld: number, fastNew: number, slowOld: number, slowNew: number,
  fastDelay: number, slowDelay: number, combine: Combine,
): PathTick[] {
  const maxT = Math.max(fastDelay, slowDelay);
  const fn = combine === 'AND' ? (a: number, b: number) => a & b : (a: number, b: number) => a | b;
  return Array.from({ length: maxT + 1 }, (_, tt) => {
    const fast = tt >= fastDelay ? fastNew : fastOld;
    const slow = tt >= slowDelay ? slowNew : slowOld;
    return { t: tt, fast, slow, y: fn(fast, slow) };
  });
}

/* ───────── bespoke: the cover's live glitch scope ─────────
   A repeating loop of Y = A'C + AB (B=C=1) as A transitions 1->0 then 0->1.
   The fall edge glitches (AB, the fast path, switches off before A'C, the
   slow/inverted path, switches on); the rise edge never does - both computed
   live from the very same twoPathTimeline, proving the asymmetry is real. */
const FAST_D = 1, SLOW_D = 2;
const lapFor = (dir: Dir): (PathTick & { dir: Dir })[] => {
  const line = dir === 'fall'
    ? twoPathTimeline(1, 0, 0, 1, FAST_D, SLOW_D, 'OR')
    : twoPathTimeline(0, 1, 1, 0, FAST_D, SLOW_D, 'OR');
  const withHold = [...line, line[line.length - 1]];
  return withHold.map((s) => ({ ...s, dir }));
};
const SCOPE_LAP: (PathTick & { dir: Dir })[] = [...lapFor('fall'), ...lapFor('rise')];

const GlitchScope: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setI((v) => (v + 1) % SCOPE_LAP.length), 700);
    return () => clearInterval(id);
  }, [playing]);

  const n = SCOPE_LAP.length;
  const cur = SCOPE_LAP[i];
  const hist = Array.from({ length: n }, (_, k) => SCOPE_LAP[(i - n + 1 + k + n * 4) % n]);
  const glitch = cur.dir === 'fall' && cur.y === 0;

  const step = 34, hi = 18, lo = 60, x0 = 10;
  const width = x0 + n * step + 10;
  let d = `M${x0},${hist[0].y ? hi : lo}`;
  hist.forEach((h, k) => {
    const xa = x0 + k * step, xb = xa + step, y = h.y ? hi : lo;
    d += ` L${xa},${y} L${xb},${y}`;
    if (k < hist.length - 1) {
      const nxt = hist[k + 1];
      if (nxt.y !== h.y) d += ` L${xb},${nxt.y ? hi : lo}`;
    }
  });

  return (
    <button type="button" onClick={() => setPlaying((p) => !p)}
      title="tap to pause / resume the scope"
      className={`relative mx-auto block w-full max-w-2xl overflow-hidden rounded-3xl border p-6 text-left ${t.card}`}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <Activity size={16} style={{ color: glitch ? ACC.III : accent }} />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: glitch ? ACC.III : accent }}>
          {lang === 'hi' ? 'live glitch scope · Y जो 1 पर रहना चाहिए' : 'live glitch scope · Y should hold at 1'}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} 78`} className="mx-auto w-full max-w-xl">
        <line x1={x0} y1={hi} x2={width - 10} y2={hi} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeDasharray="2 4" />
        <path d={d} fill="none" stroke={glitch ? ACC.III : accent} strokeWidth="3" strokeLinejoin="round" />
        <motion.circle cx={x0 + (n - 1) * step + step} cy={cur.y ? hi : lo} r={4.5} fill={glitch ? ACC.III : accent}
          animate={glitch ? { r: [4.5, 7, 4.5] } : { r: 4.5 }} transition={{ duration: 0.6, repeat: glitch ? Infinity : 0 }} />
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px]">
        <span className={t.faint as string}>A: {cur.dir === 'fall' ? '1→0' : '0→1'}</span>
        <span className={t.faint as string}>fast(AB)={cur.fast}</span>
        <span className={t.faint as string}>slow(A&apos;C)={cur.slow}</span>
        <span className="font-black" style={{ color: glitch ? ACC.III : ACC.good }}>Y={cur.y}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={glitch ? 'g' : cur.dir} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-2 text-center font-mono text-[12px]" style={{ color: glitch ? ACC.III : (t.faint as string) }}>
          {glitch
            ? (lang === 'hi' ? `glitch! slow path fast से ${SLOW_D - FAST_D} tick पीछे है` : `glitch! the slow path lags the fast path by ${SLOW_D - FAST_D} tick`)
            : (lang === 'hi' ? 'दोनों path सहमत हैं - कोई glitch नहीं' : 'both paths agree here - no glitch')}
        </motion.p>
      </AnimatePresence>
      <div className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.25em] opacity-40">
        {playing ? 'live · tap to pause' : 'paused · tap to resume'}
      </div>
    </button>
  );
};

/* ───────── bespoke: S02 - two adjustable paths racing into an OR gate ───────── */
const TwoPathGlitchViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dir, setDir] = useState<Dir>('fall');
  const [slowDelay, setSlowDelay] = useState(2);
  const fastDelay = 1;
  const timeline = dir === 'fall'
    ? twoPathTimeline(1, 0, 0, 1, fastDelay, slowDelay, 'OR')
    : twoPathTimeline(0, 1, 1, 0, fastDelay, slowDelay, 'OR');
  const glitchTicks = timeline.filter((r) => r.y === 0);
  const hasGlitch = glitchTicks.length > 0;
  const rows = timeline.map((r) => ({ cells: [r.t, r.fast, r.slow, r.y], highlight: r.y === 0 }));

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border p-1" style={{ borderColor: `${accent}44` }}>
            {(['fall', 'rise'] as Dir[]).map((dd) => (
              <button key={dd} onClick={() => setDir(dd)}
                className="rounded-full px-3 py-1 font-mono text-[11px] font-black transition-colors"
                style={dir === dd ? { background: accent, color: '#000' } : { color: accent }}>
                {dd === 'fall' ? 'A: 1→0' : 'A: 0→1'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className={t.faint as string}>{lang === 'hi' ? 'slow path delay' : 'slow path delay'}</span>
            <button onClick={() => setSlowDelay((v) => Math.max(fastDelay, v - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border font-black active:scale-90 sm:h-7 sm:w-7" style={{ borderColor: `${accent}55`, color: accent }}><Minus size={13} /></button>
            <span className="w-5 text-center font-black" style={{ color: accent }}>{slowDelay}</span>
            <button onClick={() => setSlowDelay((v) => Math.min(4, v + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border font-black active:scale-90 sm:h-7 sm:w-7" style={{ borderColor: `${accent}55`, color: accent }}><Plus size={13} /></button>
          </div>
        </div>

        <svg viewBox="0 0 300 120" className="mx-auto w-full max-w-md">
          <line x1="20" y1="30" x2="200" y2="30" stroke={ACC.I} strokeWidth="3" />
          <text x="10" y="20" fontFamily="monospace" fontSize="9" fill={ACC.I}>{lang === 'hi' ? `तेज़ path (${fastDelay} level)` : `fast path (${fastDelay} level)`}</text>
          <line x1="20" y1="90" x2="90" y2="90" stroke={ACC.III} strokeWidth="3" />
          <path d="M90,80 L106,90 L90,100 Z" fill="none" stroke={ACC.III} strokeWidth="2" />
          <circle cx="110" cy="90" r="3.5" fill="none" stroke={ACC.III} strokeWidth="2" />
          <line x1="114" y1="90" x2="200" y2="90" stroke={ACC.III} strokeWidth="3" />
          <text x="10" y="112" fontFamily="monospace" fontSize="9" fill={ACC.III}>{lang === 'hi' ? `धीमा path (${slowDelay} level)` : `slow path (${slowDelay} levels)`}</text>
          <path d="M200,20 Q220,60 200,100 Q250,100 270,60 Q250,20 200,20 Z" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.5" />
          <text x="228" y="64" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={accent}>OR</text>
          <line x1="270" y1="60" x2="296" y2="60" stroke={hasGlitch ? ACC.III : accent} strokeWidth="3" />
          <text x="298" y="56" fontFamily="monospace" fontSize="10" fontWeight="900" fill={hasGlitch ? ACC.III : accent}>Y</text>
        </svg>
      </Card>

      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['t', 'fast', 'slow', 'Y']} rows={rows}
        note={hasGlitch
          ? (lang === 'hi' ? `glitch width = slowDelay − fastDelay = ${glitchTicks.length} tick(s) - हर मान live computed है।` : `glitch width = slowDelay − fastDelay = ${glitchTicks.length} tick(s) - every value computed live.`)
          : (lang === 'hi' ? 'इस delay/direction पर कोई glitch नहीं - Y हर tick पर स्थिर रहता है।' : 'no glitch at this delay/direction - Y stays steady at every tick.')}
      />
    </div>
  );
};

/* ───────── K-map shared plumbing (2x4, rows=A, cols=BC gray) ───────── */
const KMAP_COLS: [number, number][] = [[0, 0], [0, 1], [1, 1], [1, 0]];
const KMAP_LABELS = ['00', '01', '11', '10'];

/* ───────── bespoke: S03 - static-1, Y=A'C+AB, before/after BC ───────── */
const static1F = (a: number, b: number, c: number) => ((a ^ 1) & c) | (a & b);

const Static1Lab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [withBC, setWithBC] = useState(false);

  const line = twoPathTimeline(1, 0, 0, 1, 1, 2, 'OR'); // AB fast, A'C slow, A:1->0
  const ticks = line.map((r) => ({ ...r, bc: withBC ? 1 : 0, yFinal: r.y | (withBC ? 1 : 0) }));
  const hazardPresent = ticks.some((r) => r.yFinal === 0);
  const rows = ticks.map((r) => ({ cells: [r.t, r.fast, r.slow, r.bc, r.yFinal], highlight: r.yFinal === 0 }));

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          K-map · Y = A&apos;C + AB{withBC ? ' + BC' : ''}
        </div>
        <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="mx-auto w-max font-mono text-[11px]">
          <div className="flex items-center">
            <div className="w-14 shrink-0" />
            {KMAP_LABELS.map((l) => <div key={l} className={`w-16 shrink-0 text-center ${t.faint}`}>BC={l}</div>)}
          </div>
          {[0, 1].map((a) => (
            <div key={a} className="flex items-center">
              <div className={`w-14 shrink-0 pr-2 text-right ${t.faint}`}>A={a}</div>
              {KMAP_COLS.map(([b, c], ci) => {
                const val = static1F(a, b, c);
                const inAC = a === 0 && c === 1;
                const inAB = a === 1 && b === 1;
                const inBC = withBC && b === 1 && c === 1;
                const border = inBC ? ACC.good : inAC ? ACC.I : inAB ? ACC.II : (isDarkMode ? '#334155' : '#cbd5e1');
                const label = inBC ? 'BC' : inAC ? "A'C" : inAB ? 'AB' : '';
                return (
                  <div key={ci} className="w-16 shrink-0 p-1">
                    <div className="flex h-12 flex-col items-center justify-center rounded-lg border-2 font-black"
                      style={{ borderColor: border, background: val ? `${border}22` : 'transparent', color: val ? border : (t.faint as string) }}>
                      <span>{val}</span>
                      {label && <span className="text-[8px] font-normal opacity-70">{label}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {withBC
            ? (lang === 'hi' ? "m3 और m7 (A=0/A=1 सीमा, B=C=1) अब एक साझा BC group से covered हैं।" : 'm3 and m7 (the A=0/A=1 border, B=C=1) are now covered by one shared BC group.')
            : (lang === 'hi' ? "m3 और m7 adjacent हैं (सिर्फ़ A अलग) पर दो अलग groups से covered हैं - यही hazard का gap है।" : 'm3 and m7 are adjacent (only A differs) but covered by two different groups - that gap is the hazard.')}
        </p>
      </Card>

      <div className="flex items-center justify-center">
        <button onClick={() => setWithBC((v) => !v)}
          className="rounded-2xl border-2 px-5 py-2.5 font-mono text-[12px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: withBC ? ACC.good : `${accent}55`, color: withBC ? ACC.good : accent, background: withBC ? `${ACC.good}18` : 'transparent' }}>
          {withBC ? (lang === 'hi' ? 'BC term जोड़ा गया ✓' : 'BC term added ✓') : (lang === 'hi' ? '+ BC term जोड़ें' : '+ add the BC term')}
        </button>
      </div>

      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['t', 'AB (fast)', "A'C (slow)", 'BC', 'Y']} rows={rows}
        note={lang === 'hi' ? 'A: 1→0 transition simulate किया गया, हर column code से computed है।' : 'simulating the A: 1→0 transition, every column computed in code.'} />

      <AnimatePresence mode="wait">
        <motion.p key={withBC ? 'ok' : 'bad'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-center font-mono text-[13px] font-black" style={{ color: hazardPresent ? ACC.III : ACC.good }}>
          {hazardPresent
            ? (lang === 'hi' ? 'hazard PRESENT - Y क्षण भर 0 पर dip करता है' : 'hazard PRESENT - Y dips to 0 for an instant')
            : (lang === 'hi' ? 'hazard ELIMINATED - Y हर tick पर 1 रहता है' : 'hazard ELIMINATED - Y stays 1 on every tick')}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

/* ───────── bespoke: S04 - static-0, Y=(A+B')(B+C), before/after (A+C) ───────── */
const static0F = (a: number, b: number, c: number) => (a | (b ^ 1)) & (b | c);

const Static0Lab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [withAC, setWithAC] = useState(false);

  const line = twoPathTimeline(0, 1, 1, 0, 1, 2, 'AND'); // (B+C) fast, (A+B') slow, B:0->1
  const ticks = line.map((r) => ({ ...r, ac: withAC ? 0 : 1, yFinal: r.y & (withAC ? 0 : 1) }));
  const hazardPresent = ticks.some((r) => r.yFinal === 1);
  const rows = ticks.map((r) => ({ cells: [r.t, r.fast, r.slow, r.ac, r.yFinal], highlight: r.yFinal === 1 }));

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          K-map (0s) · Y = (A+B&apos;)(B+C){withAC ? '(A+C)' : ''}
        </div>
        <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <div className="mx-auto w-max font-mono text-[11px]">
          <div className="flex items-center">
            <div className="w-14 shrink-0" />
            {KMAP_LABELS.map((l) => <div key={l} className={`w-16 shrink-0 text-center ${t.faint}`}>BC={l}</div>)}
          </div>
          {[0, 1].map((a) => (
            <div key={a} className="flex items-center">
              <div className={`w-14 shrink-0 pr-2 text-right ${t.faint}`}>A={a}</div>
              {KMAP_COLS.map(([b, c], ci) => {
                const val = static0F(a, b, c);
                const inABp = a === 0 && b === 1;
                const inBC0 = b === 0 && c === 0;
                const inAC0 = withAC && a === 0 && c === 0;
                const border = inAC0 ? ACC.good : inABp ? ACC.I : inBC0 ? ACC.II : (isDarkMode ? '#334155' : '#cbd5e1');
                const label = inAC0 ? 'A+C' : inABp ? "A+B'" : inBC0 ? 'B+C' : '';
                return (
                  <div key={ci} className="w-16 shrink-0 p-1">
                    <div className="flex h-12 flex-col items-center justify-center rounded-lg border-2 font-black"
                      style={{ borderColor: border, background: val === 0 ? `${border}22` : 'transparent', color: val === 0 ? border : (t.faint as string) }}>
                      <span>{val}</span>
                      {val === 0 && label && <span className="text-[8px] font-normal opacity-70">{label}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {withAC
            ? (lang === 'hi' ? 'm0 और m2 (B=0/B=1 सीमा, A=0,C=0) अब एक साझा (A+C) group से covered हैं।' : 'm0 and m2 (the B=0/B=1 border, A=0, C=0) are now covered by one shared (A+C) group.')
            : (lang === 'hi' ? 'm0 और m2 adjacent हैं (सिर्फ़ B अलग) पर दो अलग groups से covered हैं - यही hazard का gap है।' : 'm0 and m2 are adjacent (only B differs) but covered by two different groups - that gap is the hazard.')}
        </p>
      </Card>

      <div className="flex items-center justify-center">
        <button onClick={() => setWithAC((v) => !v)}
          className="rounded-2xl border-2 px-5 py-2.5 font-mono text-[12px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: withAC ? ACC.good : `${accent}55`, color: withAC ? ACC.good : accent, background: withAC ? `${ACC.good}18` : 'transparent' }}>
          {withAC ? (lang === 'hi' ? '(A+C) term जोड़ा गया ✓' : '(A+C) term added ✓') : (lang === 'hi' ? '+ (A+C) term जोड़ें' : '+ add the (A+C) term')}
        </button>
      </div>

      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['t', '(B+C) fast', "(A+B') slow", '(A+C)', 'Y']} rows={rows}
        note={lang === 'hi' ? 'B: 0→1 transition simulate किया गया, हर column code से computed है।' : 'simulating the B: 0→1 transition, every column computed in code.'} />

      <AnimatePresence mode="wait">
        <motion.p key={withAC ? 'ok' : 'bad'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-center font-mono text-[13px] font-black" style={{ color: hazardPresent ? ACC.III : ACC.good }}>
          {hazardPresent
            ? (lang === 'hi' ? 'hazard PRESENT - Y क्षण भर 1 पर spike करता है' : 'hazard PRESENT - Y spikes to 1 for an instant')
            : (lang === 'hi' ? 'hazard ELIMINATED - Y हर tick पर 0 रहता है' : 'hazard ELIMINATED - Y stays 0 on every tick')}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

/* ───────── bespoke: S05 - dynamic hazard, 3 paths of 1/2/3 levels reconverge ───────── */
const DYN_DELAYS = [1, 2, 3];
const dynTick = (tt: number, flattened: boolean) => {
  const delays = flattened ? [1, 1, 1] : DYN_DELAYS;
  const v = delays.map((delay) => (tt >= delay ? 1 : 0));
  const y = v[0] ^ v[1] ^ v[2];
  return { t: tt, v, y };
};

const DynamicHazardViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [flattened, setFlattened] = useState(false);
  const maxT = flattened ? 1 : 3;
  const ticks = Array.from({ length: maxT + 1 }, (_, tt) => dynTick(tt, flattened));
  const toggles = ticks.reduce((acc, r, k) => (k > 0 && r.y !== ticks[k - 1].y ? acc + 1 : acc), 0);

  const steps = ticks.map((r) => ({
    label: `t=${r.t}`,
    body: (
      <div className="space-y-3">
        <svg viewBox="0 0 260 130" className="mx-auto w-full max-w-sm">
          {[0, 1, 2].map((p) => {
            const y0 = 20 + p * 34;
            const on = r.v[p] === 1;
            const levels = flattened ? 1 : DYN_DELAYS[p];
            const dim = isDarkMode ? '#334155' : '#cbd5e1';
            return (
              <g key={p}>
                <line x1="10" y1={y0} x2="150" y2={y0} stroke={on ? accent : dim} strokeWidth="3" />
                {Array.from({ length: levels }, (_, lvl) => (
                  <rect key={lvl} x={30 + lvl * 34} y={y0 - 8} width="20" height="16" rx="4"
                    fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={on ? accent : dim} strokeWidth="1.6" />
                ))}
                <text x="2" y={y0 + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={on ? accent : (t.faint as string)}>v{p + 1}={r.v[p]}</text>
              </g>
            );
          })}
          <path d="M150,16 L188,60 L150,104 Q180,60 150,16 Z" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.2" />
          <text x="166" y="64" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={accent}>⊕</text>
          <line x1="188" y1="60" x2="248" y2="60" stroke={r.y ? accent : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
          <text x="250" y="56" fontFamily="monospace" fontSize="12" fontWeight="900" fill={r.y ? accent : (t.faint as string)}>Y={r.y}</text>
        </svg>
        <p className={`text-center font-mono text-[12px] ${t.sub}`}>
          v1,v2,v3 = {r.v.join(',')} → Y = {r.v[0]}⊕{r.v[1]}⊕{r.v[2]} = <b style={{ color: accent }}>{r.y}</b>
        </p>
      </div>
    ),
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setFlattened((v) => !v)}
          className="rounded-2xl border-2 px-5 py-2.5 font-mono text-[12px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: flattened ? ACC.good : `${accent}55`, color: flattened ? ACC.good : accent, background: flattened ? `${ACC.good}18` : 'transparent' }}>
          {flattened ? (lang === 'hi' ? 'flattened · 2-level ✓' : 'flattened · 2-level ✓') : (lang === 'hi' ? '3 paths · 1/2/3 levels' : '3 paths · 1/2/3 levels')}
        </button>
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
      <p className="text-center font-mono text-[13px] font-black" style={{ color: toggles > 1 ? ACC.III : ACC.good }}>
        {toggles > 1
          ? (lang === 'hi' ? `${toggles} toggles observed - एक इरादा transition flicker करता है` : `${toggles} toggles observed - one intended transition flickers`)
          : (lang === 'hi' ? 'सिर्फ़ 1 साफ़ transition - कोई dynamic hazard नहीं' : 'only 1 clean transition - no dynamic hazard')}
      </p>
    </div>
  );
};

/* ───────── bespoke: S06 - essential hazard, direct path vs feedback-loop path ───────── */
const EssentialHazardViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const directDelay = 3;
  const [feedbackDelay, setFeedbackDelay] = useState(3);
  const [triedConsensus, setTriedConsensus] = useState(false);
  const hazardPresent = feedbackDelay <= directDelay;
  const scale = 20;

  const tryConsensus = () => setTriedConsensus(true); // logic added, delays untouched - on purpose
  const addDelay = () => { setFeedbackDelay((v) => Math.min(9, v + 2)); setTriedConsensus(false); };
  const reset = () => { setFeedbackDelay(3); setTriedConsensus(false); };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'direct path बनाम feedback-loop path - race' : 'direct path vs feedback-loop path - the race'}
      </div>

      <svg viewBox="0 0 320 155" className="mx-auto w-full max-w-lg">
        <line x1="20" y1="30" x2="180" y2="30" stroke={ACC.I} strokeWidth="3" />
        <text x="10" y="20" fontFamily="monospace" fontSize="9" fill={ACC.I}>{lang === 'hi' ? 'direct path' : 'direct path'}</text>
        <path d="M20,90 H80 Q140,90 140,120 Q140,150 80,150 Q20,150 20,120 Q20,96 62,92" fill="none" stroke={ACC.III} strokeWidth="3" />
        <text x="10" y="80" fontFamily="monospace" fontSize="9" fill={ACC.III}>{lang === 'hi' ? 'feedback loop path' : 'feedback-loop path'}</text>
        <rect x="180" y="60" width="76" height="46" rx="10" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.4" />
        <text x="218" y="88" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>{lang === 'hi' ? 'state decision' : 'state decision'}</text>
        <line x1="140" y1="83" x2="180" y2="83" stroke={ACC.III} strokeWidth="3" />
        <line x1="180" y1="30" x2="180" y2="70" stroke={ACC.I} strokeWidth="3" />

        <line x1="20" y1="132" x2="300" y2="132" stroke={t.faint as string} strokeWidth="1.5" />
        <circle cx={20 + Math.min(directDelay, 12) * scale} cy="132" r="5" fill={ACC.I} />
        <text x={20 + Math.min(directDelay, 12) * scale} y="123" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ACC.I}>direct t={directDelay}</text>
        <circle cx={20 + Math.min(feedbackDelay, 12) * scale} cy="132" r="5" fill={ACC.III} />
        <text x={20 + Math.min(feedbackDelay, 12) * scale} y="148" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ACC.III}>feedback t={feedbackDelay}</text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <button onClick={tryConsensus}
          className="rounded-2xl border-2 px-4 py-2 font-mono text-[11px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: `${ACC.III}66`, color: ACC.III }}>
          {lang === 'hi' ? 'consensus gate जोड़ने की कोशिश करें' : 'try adding a consensus gate'}
        </button>
        <button onClick={addDelay}
          className="rounded-2xl border-2 px-4 py-2 font-mono text-[11px] font-black uppercase tracking-wide active:scale-95"
          style={{ borderColor: `${ACC.good}66`, color: ACC.good }}>
          {lang === 'hi' ? '+ feedback path में delay जोड़ें' : '+ add feedback-path delay'}
        </button>
        <button onClick={reset} className="rounded-2xl border px-3 py-2 font-mono text-[10px] uppercase tracking-wide"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', color: t.faint as string }}>
          reset
        </button>
      </div>

      <div className="mt-4 rounded-2xl border p-4 text-center" style={{ borderColor: hazardPresent ? `${ACC.III}55` : `${ACC.good}55`, background: hazardPresent ? `${ACC.III}0d` : `${ACC.good}0d` }}>
        <p className="font-mono text-[13px] font-black" style={{ color: hazardPresent ? ACC.III : ACC.good }}>
          {hazardPresent
            ? (lang === 'hi' ? `race UNSAFE: feedback (t=${feedbackDelay}) direct (t=${directDelay}) के बाद सुरक्षित रूप से नहीं पहुँचता` : `race UNSAFE: feedback (t=${feedbackDelay}) does not arrive safely after direct (t=${directDelay})`)
            : (lang === 'hi' ? `race SAFE: feedback (t=${feedbackDelay}) direct (t=${directDelay}) के बाद पहुँचता है` : `race SAFE: feedback (t=${feedbackDelay}) now arrives after direct (t=${directDelay})`)}
        </p>
        {triedConsensus && (
          <p className="mt-2 font-mono text-[11px]" style={{ color: ACC.III }}>
            {lang === 'hi'
              ? `एक redundant AND/OR gate जोड़ा गया - पर delays अभी भी direct=${directDelay}, feedback=${feedbackDelay} हैं। कुछ नहीं बदला: logic जोड़ना ARRIVAL TIME नहीं बदलता।`
              : `added a redundant AND/OR gate - but the delays are still direct=${directDelay}, feedback=${feedbackDelay}. Nothing moved: adding logic never changes arrival TIME.`}
          </p>
        )}
      </div>
    </Card>
  );
};

/* ───────── bespoke: S07 - the consensus theorem, derived + live ───────── */
const ConsensusLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [X, setX] = useState(1);
  const [Y, setY] = useState(1);
  const [Z, setZ] = useState(1);
  const XY = X & Y, XpZ = (X ^ 1) & Z, YZterm = Y & Z;
  const withoutYZ = XY | XpZ;
  const withYZ = XY | XpZ | YZterm;

  const allMatch = useMemo(() => {
    for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) {
      const xy = x & y, xpz = (x ^ 1) & z, yz = y & z;
      if ((xy | xpz) !== (xy | xpz | yz)) return false;
    }
    return true;
  }, []);

  const rows = useMemo(() => {
    const out: { cells: (string | number)[]; highlight?: boolean }[] = [];
    for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) {
      const xy = x & y, xpz = (x ^ 1) & z, yz = y & z;
      out.push({ cells: [x, y, z, xy, xpz, yz, xy | xpz, xy | xpz | yz], highlight: yz === 1 });
    }
    return out;
  }, []);

  const mono = (v: string) => <span className="font-mono font-black" style={{ color: accent }}>{v}</span>;
  const steps = [
    {
      label: lang === 'hi' ? 'कथन' : 'Statement',
      body: (
        <div className="space-y-2 text-center">
          <div className="text-lg">{mono("XY + X'Z + YZ = XY + X'Z")}</div>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi' ? "YZ को consensus term कहते हैं - X और X' के बीच का 'pivot'." : "YZ is called the consensus term - the 'pivot' between X and X'."}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Truth-table प्रमाण' : 'Truth-table proof',
      body: (
        <TruthTable isDarkMode={isDarkMode} accent={accent}
          headers={['X', 'Y', 'Z', 'XY', "X'Z", 'YZ', "XY+X'Z", '+YZ']} rows={rows}
          note={allMatch
            ? (lang === 'hi' ? 'सभी 8 rows में आख़िरी दो columns मेल खाते हैं - YZ logically redundant है, भले ही अपने में active रहे (highlighted rows)।' : 'the last two columns match on all 8 rows - YZ is logically redundant even on the rows where it is itself active (highlighted).')
            : ''} />
      ),
    },
    {
      label: lang === 'hi' ? 'Live gates' : 'Live gates',
      body: (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {([['X', X, setX], ['Y', Y, setY], ['Z', Z, setZ]] as [string, number, (n: number) => void][]).map(([lbl, v, set]) => (
              <button key={lbl} onClick={() => set(v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
                <span className="font-mono text-[11px] font-bold" style={{ color: ACC.II }}>{lbl}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
                  style={{ background: v ? ACC.II : 'transparent', color: v ? '#000' : ACC.II, border: `2px solid ${ACC.II}${v ? '' : '66'}` }}>{v}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-1"><span className={`font-mono text-[10px] ${t.faint}`}>XY</span><LiveGate type="AND" a={X} b={Y} isDarkMode={isDarkMode} accent={accent} labelA="X" labelB="Y" /></div>
            <div className="flex flex-col items-center gap-1"><span className={`font-mono text-[10px] ${t.faint}`}>X&apos;Z</span><LiveGate type="AND" a={X ^ 1} b={Z} isDarkMode={isDarkMode} accent={accent} labelA="X'" labelB="Z" /></div>
            <div className="flex flex-col items-center gap-1"><span className={`font-mono text-[10px] ${t.faint}`}>YZ · consensus</span><LiveGate type="AND" a={Y} b={Z} isDarkMode={isDarkMode} accent={accent} labelA="Y" labelB="Z" colorOut={ACC.good} /></div>
          </div>
          <p className={`text-center font-mono text-[13px] ${t.sub}`}>
            XY+X&apos;Z = <b style={{ color: accent }}>{withoutYZ}</b>, XY+X&apos;Z+YZ = <b style={{ color: accent }}>{withYZ}</b> -{' '}
            <span style={{ color: withoutYZ === withYZ ? ACC.good : ACC.III }}>
              {withoutYZ === withYZ ? (lang === 'hi' ? 'हमेशा बराबर' : 'always equal') : (lang === 'hi' ? 'भिन्न!' : 'different!')}
            </span>
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'इस module पर वापस' : 'Back to this module',
      body: (
        <div className="space-y-3 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'X=A, Y=B, Z=C रखिए:' : 'Set X=A, Y=B, Z=C:'}</p>
          <div className="text-[15px]">{mono("Y = A'C + AB + BC")}</div>
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? "dual (OR/AND) रूप में X=B', Y=A, Z=C रखिए:" : "in the dual (OR/AND) form set X=B', Y=A, Z=C:"}</p>
          <div className="text-[15px]">{mono("Y = (A+B')(B+C)(A+C)")}</div>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: S08 - the two-wire bulb analogy, same math as GlitchScope ───────── */
const LightSwitchAnalogy: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dir, setDir] = useState<Dir>('fall');
  const [tick, setTick] = useState(2);
  const [playing, setPlaying] = useState(false);
  const line = dir === 'fall'
    ? twoPathTimeline(1, 0, 0, 1, 1, 2, 'OR')
    : twoPathTimeline(0, 1, 1, 0, 1, 2, 'OR');
  const cur = line[Math.min(tick, line.length - 1)];

  const flip = () => {
    setDir((d) => (d === 'fall' ? 'rise' : 'fall'));
    setTick(0);
    setPlaying(true);
  };
  useEffect(() => {
    if (!playing) return;
    if (tick >= line.length - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setTick((v) => v + 1), 550);
    return () => clearTimeout(id);
  }, [playing, tick, line.length]);

  const flicker = cur.y === 0;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'दो wires, एक bulb' : 'two wires, one bulb'}
      </div>
      <svg viewBox="0 0 300 140" className="mx-auto w-full max-w-md">
        <rect x="10" y="55" width="28" height="30" rx="5" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2" />
        <text x="24" y="74" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>{dir === 'fall' ? 'OFF' : 'ON'}</text>
        <path d="M38,60 H150" fill="none" stroke={cur.fast ? ACC.I : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
        <text x="60" y="50" fontFamily="monospace" fontSize="8" fill={ACC.I}>{lang === 'hi' ? 'छोटी wire' : 'short wire'}</text>
        <path d="M38,80 Q38,120 90,120 Q150,120 150,80" fill="none" stroke={cur.slow ? ACC.III : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
        <text x="55" y="134" fontFamily="monospace" fontSize="8" fill={ACC.III}>{lang === 'hi' ? 'लंबी wire (धीमी)' : 'long wire (slower)'}</text>
        <motion.circle cx="180" cy="70" r="26" fill={cur.y ? '#fde68a' : 'transparent'} stroke={flicker ? ACC.III : accent} strokeWidth="3"
          animate={{ scale: flicker ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.4 }} />
        <text x="180" y="75" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="900" fill={cur.y ? '#78350f' : accent}>{cur.y ? 'ON' : 'off'}</text>
      </svg>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={flip} className="flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
          <Zap size={15} /> {lang === 'hi' ? 'switch पलटें' : 'flip the switch'}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={`${dir}-${tick}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-3 text-center font-mono text-[13px]" style={{ color: flicker ? ACC.III : (t.sub as string) }}>
          {flicker
            ? (lang === 'hi' ? "flicker! छोटी wire ने बदला, लंबी wire ने अभी नहीं - क्षण भर अंधेरा" : "flicker! the short wire has switched, the long wire hasn't caught up yet - a brief dark instant")
            : (lang === 'hi' ? `bulb = ${cur.y ? 'on' : 'off'}, स्थिर` : `bulb = ${cur.y ? 'on' : 'off'}, steady`)}
        </motion.p>
      </AnimatePresence>
    </Card>
  );
};

/* ───────── bespoke: recap summary matrix ───────── */
const HAZARD_ROWS = [
  { id: 'static-1', symptom: 'holds 1, dips to 0', symptomHI: '1 पर टिकता है, 0 पर dip', cure: 'consensus AND term', cureHI: 'consensus AND term', consensus: true },
  { id: 'static-0', symptom: 'holds 0, spikes to 1', symptomHI: '0 पर टिकता है, 1 पर spike', cure: 'consensus OR term', cureHI: 'consensus OR term', consensus: true },
  { id: 'dynamic', symptom: 'one edge, several toggles', symptomHI: 'एक edge, कई toggles', cure: 'flatten to 2 levels', cureHI: '2 levels तक flatten', consensus: false },
  { id: 'essential', symptom: 'async feedback race', symptomHI: 'async feedback race', cure: 'physical feedback delay', cureHI: 'physical feedback delay', consensus: false },
];

const HazardMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const rows = HAZARD_ROWS.map((r) => ({
    cells: [r.id, lang === 'hi' ? r.symptomHI : r.symptom, lang === 'hi' ? r.cureHI : r.cure, r.consensus ? '✓' : '✗'],
    highlight: !r.consensus,
  }));
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['hazard', lang === 'hi' ? 'लक्षण' : 'symptom', lang === 'hi' ? 'इलाज' : 'cure', lang === 'hi' ? 'consensus theorem?' : 'consensus theorem?']}
      rows={rows}
      note={lang === 'hi' ? 'सिर्फ़ essential hazard consensus theorem का विरोध करता है - इसे सिर्फ़ भौतिक delay ठीक करता है।' : 'only the essential hazard resists the consensus theorem - only a physical delay fixes it.'} />
  );
};

/* ───────── part assignment (copied verbatim from module 21) ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (key.includes('facts')) return 'facts';
  if (key.includes('static1')) return 'static1';
  if (key.includes('static0')) return 'static0';
  if (key.includes('dynamic')) return 'dynamic';
  if (key.includes('essential')) return 'essential';
  if (key.includes('consensus')) return 'consensus';
  if (key.includes('analogy')) return 'analogy';
  if (key.includes('build')) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => (
        <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
          kicker="HAZARDS · Correct Logic, Wrong Instant" hero={<GlitchScope isDarkMode={p.isDarkMode} accent={p.accent} />} />
      );
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="HAZARD" tag="Practice · Hazards & Races" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <HazardMatrix isDarkMode={p.isDarkMode} accent={p.accent} />
        </RecapScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'facts' && (
            <div className="space-y-6">
              <TryItYourself />
              <TwoPathGlitchViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'static1' && (
            <div className="space-y-6">
              <TryItYourself />
              <Static1Lab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'static0' && (
            <div className="space-y-6">
              <TryItYourself />
              <Static0Lab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'dynamic' && (
            <div className="space-y-6">
              <TryItYourself />
              <DynamicHazardViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'essential' && (
            <div className="space-y-6">
              <TryItYourself />
              <EssentialHazardViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'consensus' && (
            <div className="space-y-6">
              <TryItYourself />
              <ConsensusLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <LightSwitchAnalogy isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="hazard-free-sop"
              titleEN="Build a hazard-free SOP for real"
              titleHI="असली में एक hazard-free SOP बनाइए"
              bodyEN="Open the live workbench and wire Y = A'C + AB from a NOT, two ANDs and an OR, prove the glitch on A's transition, then add the BC consensus gate and prove it's gone."
              bodyHI="live workbench खोलिए और Y = A'C + AB को एक NOT, दो ANDs और एक OR से बनाइए, A के transition पर glitch साबित कीजिए, फिर BC consensus gate जोड़कर साबित कीजिए कि यह चला गया।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
