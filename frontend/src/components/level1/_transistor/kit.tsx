/**
 * Shared toolkit for the TRANSISTOR track (Basic Electronics modules 6-10:
 * BJT physics, DC biasing, AC small-signal, MOSFET, JFET).
 *
 * The bilingual (English / हिन्दी) language store, the theme helpers and the
 * generic flashcard / quiz / step-through primitives are reused verbatim from
 * the subtractor kit - they are track-agnostic. What lives HERE is everything
 * analog-flavoured: an amplifier cover hero (instead of the digital binary
 * odometer), a bilingual EN/HI video scene, and clean cover/theory/recap scenes
 * with no digital (truth-table / gate) motifs. The analog interactives (load
 * lines, characteristic curves, small-signal gain, channels) live in analog.tsx.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, PlayCircle, ChevronDown, type LucideIcon } from 'lucide-react';
import {
  SubLangProvider, useSubLang, pick, pickList, tone,
  Eyebrow, SceneShell, Card, Bullets, TranscriptPanel,
  SubFlashCards, QuizScene, StepThrough, WorkbenchCTA,
  type SubScene, type SubCard, type SubQuiz, type SubContent,
} from '../_subtractor/kit';
import { SubModuleShell, type SubPage } from '../_subtractor/SubEngine';
import { TransistorSymbol } from './analog';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';

// re-export the shared bits so a module only imports from one place
export {
  SubLangProvider, useSubLang, pick, pickList, tone,
  Eyebrow, SceneShell, Card, Bullets, TranscriptPanel,
  SubFlashCards, QuizScene, StepThrough, WorkbenchCTA,
};
export type { SubScene, SubCard, SubQuiz, SubContent, SubPage };

/* ───────────────────────── analog cover hero ───────────────────── */
// A living amplifier motif: a small signal flows IN, through the transistor,
// out as a large INVERTED swing - the one idea the whole track builds toward.
// Language-neutral, auto-animating; replaces the digital binary odometer.

const sinePts = (w: number, mid: number, amp: number, sign: number, cycles = 3) => {
  const p: string[] = [];
  for (let x = 0; x <= w; x += 3) p.push(`${x},${mid - sign * amp * Math.sin((x / w) * Math.PI * 2 * cycles)}`);
  return p.join(' ');
};

export const AnalogHero: React.FC<{ isDarkMode: boolean; accent: string; kind?: 'npn' | 'nmos' | 'njfet' }>
  = ({ isDarkMode, accent, kind = 'npn' }) => {
  const t = tone(isDarkMode);
  return (
    <div className={`relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border p-6 ${t.card}`}>
      <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 w-28"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}22, transparent)` }}
        animate={{ x: ['-30%', '130%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      <div className="relative grid grid-cols-[1fr_auto_1.4fr] items-center gap-3">
        {/* input: small signal */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 120 60" className="w-full max-w-[130px]">
            <line x1="0" y1="30" x2="120" y2="30" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
            <polyline points={sinePts(120, 30, 8, 1)} fill="none" stroke="#38bdf8" strokeWidth="2" />
            <motion.circle r="3" fill="#38bdf8" animate={{ cx: [0, 120], cy: [30, 30] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#38bdf8' }}>signal in</span>
        </div>
        {/* the device */}
        <div className="flex flex-col items-center">
          <TransistorSymbol kind={kind} accent={accent} isDarkMode={isDarkMode} size={92} />
        </div>
        {/* output: amplified, inverted */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 170 60" className="w-full max-w-[190px]">
            <line x1="0" y1="30" x2="170" y2="30" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
            <motion.polyline points={sinePts(170, 30, 22, -1)} fill="none" stroke={accent} strokeWidth="2.5"
              animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: accent }}>amplified out</span>
        </div>
      </div>
      <div className={`relative mt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] ${t.faint}`}>
        a small change in, a big change out
      </div>
    </div>
  );
};

/* ───────────────────────── bilingual video scene ───────────────── */
// One English and one Hindi cut; the player follows the language toggle and
// falls back to whichever cut exists. Transcript only lives on this page.

export const VideoScene: React.FC<{
  isDarkMode: boolean; accent: string; scene: SubScene; srcEN?: string; srcHI?: string;
}> = ({ isDarkMode, accent, scene, srcEN, srcHI }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [open, setOpen] = useState(true);
  // pick the cut for the active language, fall back to the other
  const primary = lang === 'hi' ? srcHI : srcEN;
  const src = primary ?? srcEN ?? srcHI;
  const usingFallback = !!src && !primary;
  const videoLang = lang === 'hi' ? (srcHI ? 'hi' : 'en') : (srcEN ? 'en' : 'hi');

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'वीडियो पाठ · Lesson' : 'Video lesson'}</Eyebrow>
        <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.label}</h2>
        {scene.subtitle && <p className={`max-w-3xl text-base ${t.sub}`}>{scene.subtitle}</p>}
      </section>

      <div className={`relative overflow-hidden rounded-3xl border ${t.card}`}>
        {src ? (
          <CustomVideoPlayer key={src} src={src} accent={accent} className="rounded-3xl border-0" />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-black/90 text-center">
            <div>
              <PlayCircle size={40} className="mx-auto mb-3 opacity-40" style={{ color: accent }} />
              <p className="text-sm text-slate-400">{lang === 'hi' ? 'वीडियो जल्द आ रहा है।' : 'Video coming soon.'}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
          <span>{videoLang === 'hi' ? 'हिन्दी narration' : 'English narration'}</span>
          {usingFallback && <span className={t.faint}>{lang === 'hi' ? '(इस भाषा का cut नहीं - उपलब्ध दिखा रहे हैं)' : '(no cut in this language - showing available)'}</span>}
        </div>
      </div>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={14} style={{ color: accent }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            {lang === 'hi' ? 'देखने से पहले' : 'Before you watch'}
          </span>
        </div>
        <Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>

      <div className={`rounded-3xl border ${t.soft}`}>
        <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between p-5">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
            <FileText size={14} /> {lang === 'hi' ? 'पूरा transcript' : 'Full transcript'}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} className={t.faint} /></motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <p className={`px-5 pb-5 text-[14px] leading-relaxed ${t.sub}`}>{pick(lang, scene.transcriptEN, scene.transcriptHI)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

/* ───────────────────────── analog generic scenes ───────────────── */

interface SceneProps { isDarkMode: boolean; accent: string; scene: SubScene }

export const CoverScene: React.FC<SceneProps & { moduleTitle: string; moduleSubtitle?: string; kicker?: string; heroKind?: 'npn' | 'nmos' | 'njfet' }>
  = ({ isDarkMode, accent, scene, moduleTitle, moduleSubtitle, kicker, heroKind }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <SceneShell>
      <div className="text-center">
        <h1 className={`mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl ${t.text}`}>{moduleTitle}</h1>
        {moduleSubtitle && <p className={`mx-auto mt-4 max-w-2xl text-lg ${t.sub}`}>{moduleSubtitle}</p>}
      </div>
      <AnalogHero isDarkMode={isDarkMode} accent={accent} kind={heroKind} />
      <Card isDarkMode={isDarkMode} className="mx-auto max-w-3xl">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'इस module में' : 'In this module'}</Eyebrow>
        <div className="mt-4"><Bullets isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} /></div>
      </Card>
    </SceneShell>
  );
};

/* Flowing theory prose (paragraphs, not bullet points). Each content item becomes
   a paragraph; the first is emphasised. Reads like a textbook, not a checklist. */
export const Prose: React.FC<{ isDarkMode: boolean; accent: string; en: string[]; hi?: string[] }>
  = ({ isDarkMode, accent, en, hi }) => {
  const { lang } = useSubLang();
  const items = pickList(lang, en, hi);
  const t = tone(isDarkMode);
  return (
    <div className="space-y-4">
      {items.map((p, i) => (
        <p key={i} className={`text-[15.5px] leading-[1.85] ${i === 0 ? `font-medium ${t.text}` : t.sub}`}>
          {i === 0 && <span className="mr-2 inline-block h-3.5 w-1 translate-y-0.5 rounded-full" style={{ background: accent }} />}
          {p}
        </p>
      ))}
    </div>
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
        <Prose isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>
      {children}
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
        <Prose isDarkMode={isDarkMode} accent={accent} en={scene.theoryEN} hi={scene.theoryHI} />
      </Card>
      {children}
    </SceneShell>
  );
};

/* ───────────────────────── module shell ────────────────────────── */
// Thin wrapper over the generalized engine, pinned to the /basic-electronics
// route base and the "Basic Electronics" track caption.

export const TransistorModuleShell: React.FC<{
  moduleNumber: string; moduleName: string; Icon: LucideIcon;
  pages: SubPage[]; isDarkMode: boolean; onThemeToggle: () => void; initialChapter?: string;
}> = (props) => (
  <SubModuleShell {...props} routeBase="basic-electronics" trackName="Basic Electronics" />
);
