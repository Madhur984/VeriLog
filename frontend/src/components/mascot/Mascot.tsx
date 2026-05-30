import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Compass } from 'lucide-react';
import { getMascotLines } from './mascotLines';
import { useTour } from '../tour/TourProvider';
import { useColorScheme } from '../../hooks/useColorScheme';

/**
 * "Byte" - a route-aware talking spider mascot that DANGLES from a silk web
 * strand in the top-right corner and ALSO gives the guided tour (it replaces the
 * old floating compass launcher). Duolingo's Duo / Clash builder vibe.
 *
 * - Hangs from a glowing web strand anchored to the top of the screen and swings
 *   as a pendulum (pivot at the ceiling anchor).
 * - Idle: gentle swing + periodic blink (swaps to a blink PNG).
 * - Talking: scales up + a typewriter speech bubble (left side), cycling short
 *   page-specific lines (tap to advance). Swing dampens for readability.
 * - Tour: a glowing "Take the tour" badge hangs under Byte on any page that has
 *   a tour. Tapping it starts/replays the full guided tour (the overlay then
 *   explains everything step by step). During the tour Byte cheers + points.
 * - Greets once per page, then quiet. X hides it forever (localStorage).
 */

const OPEN = '/mascot/spider-open.png';
const BLINK = '/mascot/spider-blink.png';
const HIDE_KEY = 'bfb_mascot_hidden';
const GREET_PREFIX = 'bfb_mascot_greeted_';

const TOUR_CHEERS = ['This way! 👇', 'Check this out!', 'See that? ✨', 'Follow me!', 'Almost there!', 'You got this!'];

function lsGet(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

export const Mascot: React.FC = () => {
  const location = useLocation();
  const { isActive: tourActive, hasTourForPath, start: startTour, index: tourIndex } = useTour();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const script = useMemo(() => getMascotLines(location.pathname), [location.pathname]);

  const [hidden, setHidden] = useState<boolean>(() => lsGet(HIDE_KEY) === '1');
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);
  const [cheerIdx, setCheerIdx] = useState(0);

  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hangs from the top-right. Strand length adapts so Byte clears each page's
  // top-right UI; longer overall now so it hangs a little lower.
  const path = location.pathname;
  const isModule = path.startsWith('/module/') || path.startsWith('/dsd/') || path.startsWith('/basic-electronics/');
  const isPortal = path === '/portal';
  const strandClass = isModule
    ? 'h-[80px] sm:h-[240px]'
    : isPortal
      ? 'h-[90px] lg:h-[380px]'       // short on phones; clears the lg-only profile card on desktop
      : 'h-[100px] sm:h-[320px]';

  const fullLine = script.lines[lineIdx] ?? '';
  const talking = bubbleOpen && !tourActive;
  const showTourBadge = hasTourForPath && !tourActive && !talking;

  /* ---- typewriter for the current line ---- */
  useEffect(() => {
    if (!bubbleOpen || tourActive) return;
    setTyped('');
    let i = 0;
    if (typeTimer.current) clearInterval(typeTimer.current);
    typeTimer.current = setInterval(() => {
      i += 1;
      setTyped(fullLine.slice(0, i));
      if (i >= fullLine.length && typeTimer.current) {
        clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, 24);
    return () => { if (typeTimer.current) clearInterval(typeTimer.current); };
  }, [bubbleOpen, tourActive, lineIdx, fullLine]);

  /* ---- auto-close the bubble a few seconds after a line finishes ---- */
  useEffect(() => {
    if (!bubbleOpen || tourActive) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    const ms = 2600 + fullLine.length * 45;
    idleTimer.current = setTimeout(() => setBubbleOpen(false), ms);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [bubbleOpen, tourActive, lineIdx, fullLine]);

  /* ---- greet once per page after a short delay (skip while tour runs) ---- */
  useEffect(() => {
    if (hidden) return;
    setBubbleOpen(false);
    setLineIdx(0);
    const key = GREET_PREFIX + script.id;
    if (lsGet(key) === '1') return;
    if (greetTimer.current) clearTimeout(greetTimer.current);
    greetTimer.current = setTimeout(() => {
      if (!tourActive) {
        setWaving(true);
        setBubbleOpen(true);
        lsSet(key, '1');
        setTimeout(() => setWaving(false), 1400);
      }
    }, 1600);
    return () => { if (greetTimer.current) clearTimeout(greetTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, hidden]);

  /* ---- periodic blink ---- */
  useEffect(() => {
    if (hidden) return;
    let alive = true;
    const handle = { current: null as ReturnType<typeof setTimeout> | null };
    const loop = () => {
      const next = 2200 + Math.random() * 3200;
      handle.current = setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
        loop();
      }, next);
    };
    loop();
    return () => { alive = false; if (handle.current) clearTimeout(handle.current); };
  }, [hidden]);

  /* ---- cycle cheer text while the tour runs ---- */
  useEffect(() => {
    if (!tourActive || hidden) return;
    setCheerIdx((c) => (c + 1) % TOUR_CHEERS.length);
    const t = setInterval(() => setCheerIdx((c) => (c + 1) % TOUR_CHEERS.length), 2600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourActive, tourIndex]);

  if (hidden) return null;

  const handleTap = () => {
    if (tourActive) return;
    if (!bubbleOpen) {
      setBubbleOpen(true);
      setWaving(true);
      setTimeout(() => setWaving(false), 1000);
      return;
    }
    if (typed.length < fullLine.length) {
      setTyped(fullLine);
      if (typeTimer.current) { clearInterval(typeTimer.current); typeTimer.current = null; }
      return;
    }
    setLineIdx((i) => (i + 1) % script.lines.length);
  };

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleOpen(false);
    startTour();
  };

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHidden(true);
    lsSet(HIDE_KEY, '1');
  };

  // Small + tucked in the corner on phones; large on desktop.
  const imgClass = talking
    ? 'w-[104px] sm:w-[330px]'
    : tourActive
      ? 'w-[100px] sm:w-[315px]'
      : 'w-[96px] sm:w-[305px]';

  const swing = talking ? 0.9 : tourActive ? 2.6 : 1.6;

  return (
    <div className="fixed top-0 right-3 sm:right-8 z-[150] flex flex-col items-center select-none pointer-events-none">
      {/* Pendulum: pivots at the ceiling anchor (top center) */}
      <motion.div
        className="flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
        animate={{ rotate: [swing, -swing, swing] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* ceiling anchor node */}
        <div
          className="w-2.5 h-2.5 rounded-full -mb-px"
          style={{ 
            background: isLight ? 'rgba(2, 132, 199, 0.85)' : 'rgba(226,232,240,0.85)', 
            boxShadow: isLight ? '0 0 10px rgba(2, 132, 199, 0.5)' : '0 0 10px rgba(34,211,238,0.7)' 
          }}
        />
        {/* silk web strand */}
        <div
          className={`w-[2px] ${strandClass}`}
          style={{
            background: isLight
              ? 'linear-gradient(to bottom, rgba(2, 132, 199, 0.15), rgba(2, 132, 199, 0.6))'
              : 'linear-gradient(to bottom, rgba(226,232,240,0.15), rgba(226,232,240,0.6))',
            boxShadow: isLight
              ? '0 0 6px rgba(2, 132, 199, 0.25)'
              : '0 0 6px rgba(34,211,238,0.45)',
          }}
        />

        {/* Spider + bubbles + tour badge (only this captures pointer events) */}
        <div className="group relative -mt-3 flex flex-col items-center pointer-events-auto">
          {/* ----- Normal speech bubble (to the LEFT of the spider) ----- */}
          <AnimatePresence>
            {talking && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.92 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleTap}
                className="absolute right-full top-1/3 -translate-y-1/2 mr-3 w-[min(240px,62vw)] cursor-pointer rounded-2xl px-4 py-3"
                style={{
                  background: isLight
                    ? 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(247,249,252,0.99))'
                    : 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
                  border: isLight
                    ? '1px solid rgba(2, 132, 199, 0.22)'
                    : '1px solid rgba(34,211,238,0.35)',
                  boxShadow: isLight
                    ? '0 16px 50px rgba(0,0,0,0.08), 0 0 30px rgba(2, 132, 199, 0.06)'
                    : '0 16px 50px rgba(0,0,0,0.6), 0 0 30px rgba(34,211,238,0.18)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: isLight ? '#EA580C' : '#22D3EE' }}>
                    Byte
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {lineIdx + 1}/{script.lines.length}
                  </span>
                </div>
                <p className="text-[12.5px] leading-snug min-h-[34px]" style={{ color: isLight ? '#334155' : '#E6EDF3' }}>
                  {typed}
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle animate-pulse" style={{ background: isLight ? '#EA580C' : '#22D3EE', opacity: typed.length < fullLine.length ? 1 : 0 }} />
                </p>
                {/* In-bubble: offer the full tour */}
                {hasTourForPath && (
                  <button
                    type="button"
                    onClick={handleStartTour}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-black transition-transform active:scale-95"
                    style={{ background: '#22D3EE', boxShadow: '0 6px 18px rgba(34,211,238,0.4)' }}
                  >
                    <Compass size={13} /> Take the full tour
                  </button>
                )}
                <div className="mt-1.5 text-[9px] font-mono text-slate-500">
                  {script.lines.length > 1 ? 'tap me for more' : 'tap me anytime'}
                </div>
                <span className="absolute top-1/3 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
                  style={{
                    background: isLight ? '#FFFFFF' : 'rgba(5,8,14,0.99)',
                    borderTop: isLight ? '1px solid rgba(2, 132, 199, 0.22)' : '1px solid rgba(34,211,238,0.35)',
                    borderRight: isLight ? '1px solid rgba(2, 132, 199, 0.22)' : '1px solid rgba(34,211,238,0.35)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ----- Tour guide cheer chip (to the LEFT) ----- */}
          <AnimatePresence>
            {tourActive && (
              <motion.div
                key={cheerIdx}
                initial={{ opacity: 0, x: 8, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -6, scale: 0.85 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-full top-1/3 -translate-y-1/2 mr-3 whitespace-nowrap rounded-full px-3.5 py-1.5"
                style={{
                  background: isLight
                    ? 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(247,249,252,0.99))'
                    : 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
                  border: isLight
                    ? '1px solid rgba(2, 132, 199, 0.3)'
                    : '1px solid rgba(34,211,238,0.45)',
                  boxShadow: isLight
                    ? '0 10px 30px rgba(0,0,0,0.06), 0 0 24px rgba(2, 132, 199, 0.1)'
                    : '0 10px 30px rgba(0,0,0,0.6), 0 0 24px rgba(34,211,238,0.25)',
                }}
              >
                <span className="text-[12px] font-bold" style={{ color: isLight ? '#0284C7' : '#7DD3FC' }}>
                  {TOUR_CHEERS[cheerIdx]}
                </span>
                <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
                  style={{
                    background: isLight ? '#FFFFFF' : 'rgba(5,8,14,0.99)',
                    borderTop: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(34,211,238,0.45)',
                    borderRight: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(34,211,238,0.45)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ----- Web pointer: a silk thread Byte shoots toward its bubble while talking ----- */}
          <AnimatePresence>
            {talking && (
              <motion.div
                key="webptr"
                className="absolute z-20 pointer-events-none hidden sm:block"
                style={{ right: 'calc(50% + 40px)', top: '40%' }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative" style={{ transformOrigin: 'right center', transform: 'rotate(-13deg)' }}>
                  <div style={{
                    width: 52, height: 2,
                    background: isLight
                      ? 'linear-gradient(to left, rgba(2, 132, 199, 0.95), rgba(0, 0, 0, 0.05))'
                      : 'linear-gradient(to left, rgba(34,211,238,0.95), rgba(226,232,240,0.12))',
                    boxShadow: isLight ? '0 0 6px rgba(2, 132, 199, 0.4)' : '0 0 6px rgba(34,211,238,0.6)',
                  }} />
                  {/* sticky web tip aimed at the bubble */}
                  <motion.span
                    className="absolute -left-1 -top-[5px] w-3 h-3 rounded-full"
                    style={{
                      background: isLight ? '#0284C7' : '#22D3EE',
                      boxShadow: isLight ? '0 0 10px #0284C7' : '0 0 10px #22D3EE'
                    }}
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ----- The spider ----- */}
          <motion.button
            type="button"
            onClick={handleTap}
            aria-label="Talk to Byte, your guide"
            className="relative block bg-transparent border-none p-0 cursor-pointer"
            style={{ transformOrigin: 'top center' }}
            animate={
              waving
                ? { rotate: [0, -5, 5, -3, 3, 0], scale: talking ? 1.1 : 1 }
                : talking
                  ? { scale: 1.1, rotate: [-6, -11, -6] }   // lean + point toward the bubble it's talking into
                  : { scale: 1, rotate: 0 }
            }
            transition={
              waving
                ? { duration: 1.0, ease: 'easeInOut' }
                : talking
                  ? { rotate: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 300, damping: 18 } }
                  : { type: 'spring', stiffness: 300, damping: 18 }
            }
            whileHover={{ scale: talking ? 1.14 : 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-28 h-3 rounded-full blur-md"
              style={{ background: isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(34,211,238,0.30)' }} />
            <img
              src={blinking ? BLINK : OPEN}
              alt="Byte the spider mascot"
              draggable={false}
              className={`relative ${imgClass} h-auto transition-[width] duration-300 drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]`}
            />
          </motion.button>

          {/* ----- "Take the tour" badge (replaces the old compass launcher) ----- */}
          <AnimatePresence>
            {showTourBadge && (
              <motion.button
                type="button"
                onClick={handleStartTour}
                initial={{ opacity: 0, y: -6, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Take the guided tour"
                className="relative -mt-1 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #22D3EE, #3B82F6)', boxShadow: '0 8px 22px rgba(34,211,238,0.45)' }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid rgba(34,211,238,0.6)' }}
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
                <Compass size={13} className="relative z-10" />
                <span className="relative z-10">Take the tour</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* hide forever - appears on hover, not during the tour */}
          {!tourActive && (
            <button
              type="button"
              onClick={dismiss}
              aria-label="Hide Byte"
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.3)', color: '#94A3B8' }}
            >
              <X size={11} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
