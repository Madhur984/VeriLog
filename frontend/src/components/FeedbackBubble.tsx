import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { MessageCircleHeart, X } from 'lucide-react';
import { FeedbackPanel } from './FeedbackPanel';

const TEASED_KEY = 'bfb_feedback_teased';
const TEASE_DELAY_MS = 4000;
const TEASE_AUTO_HIDE_MS = 9000;
const POS_KEY = 'bfb_feedback_pos';

const readTeased = (): boolean => {
  try { return localStorage.getItem(TEASED_KEY) === '1'; } catch { return false; }
};
const markTeased = () => {
  try { localStorage.setItem(TEASED_KEY, '1'); } catch { /* ignore */ }
};

// Draggable position, same persistence pattern as MascotWidget's drag: x/y
// are transform offsets from the pill's normal bottom-left anchor.
const readPos = (): { x: number; y: number } | null => {
  try {
    const v = localStorage.getItem(POS_KEY);
    return v ? (JSON.parse(v) as { x: number; y: number }) : null;
  } catch { return null; }
};
const writePos = (p: { x: number; y: number }) => {
  try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
};

/**
 * Feedback launcher for the portal (the learner's home base). Deliberately
 * scoped to /portal only: inside a lesson it competed with the Back/Next bar
 * and the mascot for attention, and feedback is something you give about the
 * product, not mid-exercise.
 *
 * Behaviour: an icon-only pill that widens to reveal "Feedback" on hover. Four
 * seconds after the first ever visit it speaks up once, then never again
 * (localStorage) — from then on it just idles until clicked.
 */
export default function FeedbackBubble() {
  const { pathname } = useLocation();
  const reduce = !!useReducedMotion();

  const [tease, setTease] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Draggable position (Portal-only, since this whole component already
  // early-returns everywhere else). boundsRef is an invisible full-viewport
  // drag constraint — same "can't be lost off-screen" pattern MascotWidget
  // uses — and x/y persist across visits the same way.
  const boundsRef = useRef<HTMLDivElement>(null);
  const savedPos = readPos();
  const x = useMotionValue(savedPos?.x ?? 0);
  const y = useMotionValue(savedPos?.y ?? 0);
  const persistPos = () => writePos({ x: x.get(), y: y.get() });

  useEffect(() => {
    if (readTeased()) return;
    const show = setTimeout(() => {
      setTease(true);
      markTeased();
      timers.current.push(setTimeout(() => setTease(false), TEASE_AUTO_HIDE_MS));
    }, TEASE_DELAY_MS);
    timers.current.push(show);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // Portal only — every other route keeps its corner free.
  if (pathname !== '/portal') return null;

  const expanded = hover || tease;

  return (
    <>
      {/* invisible full-viewport drag boundary, same as MascotWidget's */}
      <div ref={boundsRef} className="pointer-events-none fixed inset-0 z-[58]" aria-hidden />

      {/* Sits BELOW the portal's radial menu, never beside it: the wheel is
          centred and its lower-left segment reached into the old bottom-5/left-5
          spot, so the pill overlapped "Analog Library". Anchored hard into the
          corner (and smaller on phones) it stays clear of the wheel at every
          viewport width. Draggable: x/y is an offset from that anchor,
          constrained to the viewport and persisted across visits. */}
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={boundsRef}
        onDragEnd={persistPos}
        style={{ x, y }}
        whileDrag={{ scale: 1.05 }}
        className="fixed bottom-3 left-3 z-[59] flex cursor-grab flex-col items-start gap-2.5 active:cursor-grabbing sm:bottom-4 sm:left-4"
      >
        <AnimatePresence>
          {tease && !panelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="relative ml-1 max-w-[236px] rounded-2xl rounded-bl-md border-[2.5px] border-[#1B1436] bg-white px-4 py-3 shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:shadow-[4px_4px_0_#7A3FD0]"
            >
              <button
                type="button"
                onClick={() => setTease(false)}
                onPointerDownCapture={(e) => e.stopPropagation()}
                aria-label="Dismiss"
                className="absolute -right-2.5 -top-2.5 grid h-6 w-6 place-items-center rounded-full border-2 border-[#1B1436] bg-white text-[#1B1436] shadow-[1.5px_1.5px_0_#1B1436] transition-transform hover:-translate-y-[1px] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[1.5px_1.5px_0_#7A3FD0]"
              >
                <X size={12} strokeWidth={3} />
              </button>
              <p className="text-[13px] font-bold leading-snug text-[#1B1436] dark:text-[#E9E4FA]">
                Found a bug? Something confusing?
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-[#6B5E86] dark:text-[#8E80B4]">
                Tell us — we read every message.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => { setTease(false); setPanelOpen(true); }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label="Give feedback"
          whileTap={{ scale: 0.94 }}
          animate={{ width: expanded ? 148 : 46 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="relative grid h-[46px] place-items-center overflow-hidden rounded-full border-[2.5px] border-[#1B1436] bg-[#FF7A1A] text-white shadow-[4px_4px_0_#1B1436] outline-none transition-shadow hover:shadow-[5px_5px_0_#1B1436] focus-visible:ring-2 focus-visible:ring-[#7A3FD0] focus-visible:ring-offset-2 dark:border-[#4A3D7A] dark:shadow-[4px_4px_0_#7A3FD0] sm:h-[52px]"
        >
          {/* one soft attention ring while the tease is up, then never again */}
          {tease && !reduce && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#FF7A1A]"
              animate={{ scale: [1, 1.45], opacity: [0.65, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <span className="relative flex w-full items-center gap-2.5 pl-[13px]">
            <MessageCircleHeart size={23} strokeWidth={2.3} className="flex-shrink-0" />
            <motion.span
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.14 }}
              className="whitespace-nowrap text-[14px] font-bold tracking-tight"
            >
              Feedback
            </motion.span>
          </span>
        </motion.button>
      </motion.div>

      <FeedbackPanel open={panelOpen} onClose={() => setPanelOpen(false)} pathname={pathname} />
    </>
  );
}
