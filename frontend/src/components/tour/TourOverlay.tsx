import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Sparkles, Check, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useTour } from './TourProvider';
import { useGamificationStore } from '../../stores/gamificationStore';
import { MiniDemo } from './MiniDemo';
import type { TourStep } from './tourSteps';

interface Rect { top: number; left: number; width: number; height: number; }

const PAD = 10;
const CARD_W = 360;

function rectsEqual(a: Rect | null, b: Rect | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return Math.abs(a.top - b.top) < 0.5 && Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5;
}

const CONFETTI_COLORS = ['#22D3EE', '#A855F7', '#34D399', '#F59E0B', '#EC4899', '#3B82F6', '#FFFFFF'];

const Confetti: React.FC<{ accent: string }> = ({ accent }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 46 + Math.random() * 0.5;
        const dist = 140 + Math.random() * 320;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60,
          rot: Math.random() * 720 - 360,
          delay: Math.random() * 0.12,
          size: 6 + Math.random() * 8,
          color: i % 7 === 0 ? accent : CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          round: Math.random() > 0.5,
        };
      }),
    [accent]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[170] flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.4 }}
          transition={{ duration: 1.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', width: p.size, height: p.size, background: p.color,
            borderRadius: p.round ? '50%' : '2px', boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};

/* ── Reusable content fragments ─────────────────────────────────────────────── */

const Points: React.FC<{ items: string[]; accent: string; center?: boolean }> = ({ items, accent, center }) => (
  <ul className={`w-full space-y-1.5 ${center ? 'max-w-xs mx-auto text-left' : ''}`}>
    {items.map((t, i) => (
      <li key={i} className="flex items-start gap-2 text-[12px] text-slate-300/90 leading-snug">
        <span className="mt-[3px] flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: `${accent}22` }}>
          <Check className="w-2.5 h-2.5" style={{ color: accent }} />
        </span>
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

const Kbd: React.FC<{ keys: string[]; center?: boolean }> = ({ keys, center }) => (
  <div className={`flex items-center gap-1.5 ${center ? 'justify-center' : ''}`}>
    {keys.map((k, i) => (
      <kbd key={i} className="px-2 py-1 rounded-md border border-white/15 bg-white/[0.06] text-[11px] font-mono font-bold text-slate-200 shadow-[0_2px_0_rgba(0,0,0,0.4)]">
        {k}
      </kbd>
    ))}
  </div>
);

const Tip: React.FC<{ text: string; accent: string }> = ({ text, accent }) => (
  <div className="flex items-start gap-2 w-full rounded-xl px-3 py-2 text-left" style={{ background: `${accent}12`, border: `1px solid ${accent}2e` }}>
    <Lightbulb className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" style={{ color: accent }} />
    <span className="text-[11.5px] leading-snug text-slate-300/90">{text}</span>
  </div>
);

/* ── Component ──────────────────────────────────────────────────────────────── */

export const TourOverlay: React.FC = () => {
  const { def, index, isActive, next, prev, goTo, stop, dontShowAgain } = useTour();
  const firstName = useGamificationStore((s) => s.firstName);

  const [rect, setRect] = useState<Rect | null>(null);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));
  const [finishing, setFinishing] = useState(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step: TourStep | null = def && isActive ? def.steps[index] : null;
  const accent = step?.accent ?? '#22D3EE';
  const total = def?.steps.length ?? 0;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Continuously measure the spotlight target so it stays glued to animated/scrolling elements.
  useEffect(() => {
    if (!isActive || !step || !step.target || step.placement === 'center') { setRect(null); return; }
    let raf = 0;
    let last: Rect | null = null;
    const tick = () => {
      const el = document.querySelector(step.target as string) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const nx: Rect = { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 };
          if (!rectsEqual(last, nx)) { last = nx; setRect(nx); }
        } else if (last) { last = null; setRect(null); }
      } else if (last) { last = null; setRect(null); }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [isActive, index, step]);

  useEffect(() => {
    if (!isActive || !step?.target || step.placement === 'center') return;
    const el = document.querySelector(step.target) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isActive, index, step]);

  const triggerFinish = () => {
    setFinishing(true);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    finishTimer.current = setTimeout(() => { setFinishing(false); stop(true); }, 1250);
  };
  const advance = () => { if (isLast) triggerFinish(); else next(); };

  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Escape') { e.preventDefault(); stop(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => () => { if (finishTimer.current) clearTimeout(finishTimer.current); }, []);

  if (!isActive || !step) return null;

  const useSpotlight = !!rect && step.placement !== 'center';
  const kicker = isFirst && firstName ? `Hey ${firstName.split(' ')[0]} 👋` : def?.name;

  /* Shared bits */
  const ProgressSegments = (
    <div className="flex items-center gap-1.5 w-full">
      {def?.steps.map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{ background: i <= index ? accent : 'rgba(255,255,255,0.14)' }}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
  );

  const Dots = (
    <div className="flex gap-1.5 justify-center">
      {def?.steps.map((_, i) => (
        <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
          style={{ width: i === index ? 22 : 7, height: 7, background: i === index ? accent : 'rgba(255,255,255,0.14)' }}
          aria-label={`Step ${i + 1}`} />
      ))}
    </div>
  );

  const Controls = (
    <div className="flex items-center justify-between gap-3">
      <button onClick={dontShowAgain} className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap">
        Don&apos;t show tours
      </button>
      <div className="flex items-center gap-2">
        {!isFirst && (
          <button onClick={prev} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[12px] text-slate-200 transition-colors active:scale-95">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        )}
        <button onClick={advance} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-black transition-all active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px ${accent}55` }}>
          {isLast ? (<>Finish <Check className="w-3.5 h-3.5" /></>) : (<>Next <ArrowRight className="w-3.5 h-3.5" /></>)}
        </button>
      </div>
    </div>
  );

  /* ── MOBILE: full-screen no-scroll story (centered steps) ── */
  if (isMobile && !useSpotlight) {
    return (
      <div className="fixed inset-x-0 top-0 z-[140] h-[100svh] overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0.97), rgba(3,5,10,0.99))' }}>
        {/* edge tap zones (middle band only, so header/footer stay clickable) */}
        <button aria-label="Previous" onClick={prev} className="absolute left-0 top-24 bottom-28 w-[20%] z-0 flex items-center justify-start pl-1">
          {!isFirst && <ChevronLeft className="w-5 h-5 text-white/20" />}
        </button>
        <button aria-label="Next" onClick={advance} className="absolute right-0 top-24 bottom-28 w-[20%] z-0 flex items-center justify-end pr-1">
          <ChevronRight className="w-5 h-5 text-white/20" />
        </button>

        {/* header */}
        <div className="flex-none px-5 pt-[max(16px,env(safe-area-inset-top))] pb-2 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ borderColor: `${accent}40`, color: accent, background: `${accent}14` }}>
              <Sparkles className="w-3 h-3" /> {kicker}
            </div>
            <button onClick={() => stop(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          {ProgressSegments}
        </div>

        {/* content */}
        <div className="flex-1 min-h-0 overflow-hidden relative z-10 flex flex-col items-center justify-center text-center px-6 gap-3">
          <AnimatePresence mode="wait">
            <motion.div key={index} className="flex flex-col items-center gap-3 w-full"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {step.emoji && (
                <motion.div className="text-5xl" animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  {step.emoji}
                </motion.div>
              )}
              <h3 className="text-2xl font-black text-white leading-tight px-2">{step.title}</h3>
              <p className="text-[13.5px] text-slate-300/90 leading-relaxed max-w-sm">{step.body}</p>
              {step.demo && <div className="my-1"><MiniDemo kind={step.demo} accent={accent} /></div>}
              {step.points && <Points items={step.points} accent={accent} center />}
              {step.kbd && <Kbd keys={step.kbd} center />}
              {step.tip && <div className="max-w-sm w-full"><Tip text={step.tip} accent={accent} /></div>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="flex-none px-5 pt-2 pb-[max(18px,env(safe-area-inset-bottom))] relative z-10 space-y-3">
          {Dots}
          {Controls}
        </div>

        {finishing && <Confetti accent={accent} />}
      </div>
    );
  }

  /* ── Card (desktop hero, desktop anchored, mobile bottom caption for spotlight) ── */
  const cardStyle: React.CSSProperties = (() => {
    if (!useSpotlight || isMobile) return {};
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
    const GAP = 18; const vw = window.innerWidth; const vh = window.innerHeight;
    let top = rect.top; let left = rect.left;
    switch (step.placement) {
      case 'right': left = rect.left + rect.width + GAP; top = rect.top; break;
      case 'left': left = rect.left - CARD_W - GAP; top = rect.top; break;
      case 'top': top = rect.top - 300; left = rect.left; break;
      case 'bottom': default: top = rect.top + rect.height + GAP; left = rect.left; break;
    }
    left = Math.max(16, Math.min(left, vw - CARD_W - 16));
    top = Math.max(16, Math.min(top, vh - 340));
    return { top, left, width: CARD_W };
  })();

  const centeredCard = !useSpotlight; // desktop centered hero
  // For a mobile spotlight step, render a compact bottom caption (kept short → no scroll).
  const mobileCaption = isMobile && useSpotlight;

  const cardClass = [
    'pointer-events-auto rounded-3xl border overflow-hidden backdrop-blur-2xl',
    mobileCaption ? 'fixed left-3 right-3 bottom-[max(12px,env(safe-area-inset-bottom))]' : '',
    !mobileCaption && centeredCard ? 'relative w-[min(460px,calc(100vw-32px))] max-h-[88vh]' : '',
    !mobileCaption && !centeredCard ? 'fixed' : '',
  ].join(' ');

  const Card = (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: centeredCard ? 24 : 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cardClass}
      style={{
        ...((!mobileCaption && !centeredCard) ? cardStyle : {}),
        background: 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
        borderColor: `${accent}40`,
        boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accent}22, 0 0 40px ${accent}22`,
      }}
    >
      <motion.div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        animate={{ backgroundPositionX: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />

      <div className={centeredCard ? 'p-7 text-center' : 'p-5'}>
        <div className={`flex items-center ${centeredCard ? 'justify-center' : 'justify-between'} mb-3 gap-2`}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ borderColor: `${accent}40`, color: accent, background: `${accent}14` }}>
            <Sparkles className="w-3 h-3" /> {kicker}
          </div>
          {!centeredCard && (
            <button onClick={() => stop(true)} className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {centeredCard && step.emoji && (
          <motion.div className="text-5xl mb-3 inline-block" animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            {step.emoji}
          </motion.div>
        )}

        <h3 className={`font-bold text-white leading-snug ${centeredCard ? 'text-2xl mb-2' : 'text-[15px] mb-1.5'}`}>
          {!centeredCard && step.emoji ? <span className="mr-1.5">{step.emoji}</span> : null}{step.title}
        </h3>
        <p className={`text-slate-300/90 leading-relaxed ${centeredCard ? 'text-sm mb-4 max-w-sm mx-auto' : 'text-[12.5px] mb-3'}`}>{step.body}</p>

        {/* Rich extras (skip the heavy ones in the compact mobile caption) */}
        {!mobileCaption && (
          <div className={`flex flex-col gap-3 ${centeredCard ? 'items-center mb-5' : 'mb-4'}`}>
            {step.demo && <MiniDemo kind={step.demo} accent={accent} />}
            {step.points && <Points items={step.points} accent={accent} center={centeredCard} />}
            {step.kbd && <Kbd keys={step.kbd} center={centeredCard} />}
            {step.tip && <Tip text={step.tip} accent={accent} />}
          </div>
        )}
        {mobileCaption && step.kbd && <div className="mb-4"><Kbd keys={step.kbd} /></div>}

        <div className="mb-4">{Dots}</div>
        {Controls}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[140] pointer-events-none">
      {useSpotlight && rect ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={() => stop(true)}>
          <defs>
            <mask id="bfb-tour-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="16" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(3,5,10,0.82)" mask="url(#bfb-tour-mask)" />
          <motion.rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="16" fill="none" stroke={accent} strokeWidth="2"
            initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />
        </svg>
      ) : (
        <motion.div className="absolute inset-0 pointer-events-auto" style={{ background: 'rgba(3,5,10,0.84)', backdropFilter: 'blur(2px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => stop(true)} />
      )}

      {centeredCard && !isMobile ? (
        <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
          <AnimatePresence mode="wait">{Card}</AnimatePresence>
        </div>
      ) : (
        <AnimatePresence mode="wait">{Card}</AnimatePresence>
      )}

      {finishing && <Confetti accent={accent} />}
    </div>
  );
};
