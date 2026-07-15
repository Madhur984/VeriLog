import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import AssistantPanel from './AssistantPanel';

/**
 * "VoltMonkey" — the BitForBytes guide mascot, as a QUIET, movable launcher.
 *
 * It no longer auto-pops tips on every page. It simply idles in the corner as a
 * draggable button; CLICK it to open the AI study-buddy chat. The – button
 * minimises it to a small round chip (bottom-right); click that chip to bring
 * the monkey back. Drag position and the minimised state persist in
 * localStorage, so it stays where the learner puts it.
 *
 * Lazy-loaded from App.tsx so it never blocks first paint.
 */

const BASE = import.meta.env.BASE_URL;
const asset = (name: string) => `${BASE}mascot/${name}.png`;
const BODY_SRC = asset('body');
const HEAD_SRC = asset('happy');

// Course-module routes ship a bottom footer bar (Back / Next); the launcher
// sits a little higher there so it never covers the Next button.
const MODULE_ROUTE = /^\/(module|dsd|basic-electronics|sandbox)(\/|$)/;

const readLS = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
};
const writeLS = (key: string, v: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
};

export default function MascotWidget() {
  const { pathname } = useLocation();
  const inModule = MODULE_ROUTE.test(pathname);
  const reduce = !!useReducedMotion();

  const [minimized, setMinimized] = useState<boolean>(() => readLS('bfb_mascot_min', false));
  const [chatOpen, setChatOpen] = useState(false);

  // Draggable position, persisted. x/y are transform offsets from the
  // bottom-right anchor; the invisible boundsRef keeps it on-screen.
  const boundsRef = useRef<HTMLDivElement>(null);
  const saved = readLS<{ x: number; y: number } | null>('bfb_mascot_pos', null);
  const x = useMotionValue(saved?.x ?? 0);
  const y = useMotionValue(saved?.y ?? 0);

  const setMin = (v: boolean) => { setMinimized(v); writeLS('bfb_mascot_min', v); };
  const persistPos = () => writeLS('bfb_mascot_pos', { x: x.get(), y: y.get() });

  const idleAnim = reduce
    ? undefined
    : { y: [0, -4, 0, -3, 0], rotate: [0, -1.6, 0, 1.6, 0], scale: [1, 1.015, 1, 1.015, 1] };

  return (
    <>
      {/* invisible full-viewport drag boundary so the monkey can't be lost off-screen */}
      <div ref={boundsRef} className="pointer-events-none fixed inset-0 z-[58]" aria-hidden />

      {minimized ? (
        // Minimised → small round chip to bring VoltMonkey back.
        <button
          type="button"
          onClick={() => setMin(false)}
          aria-label="Show VoltMonkey"
          title="Show VoltMonkey"
          className="fixed bottom-4 right-4 z-[60] grid h-11 w-11 place-items-center rounded-full border-2 border-edge-strong bg-bg-elev shadow-brutal transition-transform hover:-translate-y-0.5"
        >
          <img src={HEAD_SRC} alt="" aria-hidden draggable={false} className="h-7 w-7 select-none object-contain" />
        </button>
      ) : (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={boundsRef}
          onDragEnd={persistPos}
          style={{ x, y }}
          whileDrag={{ scale: 1.05 }}
          className={`fixed right-4 z-[60] cursor-grab active:cursor-grabbing ${
            inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
          }`}
        >
          <div className="relative h-28 w-24 sm:h-32 sm:w-28">
            {/* minimise (stopPropagation so tapping it doesn't start a drag) */}
            <button
              type="button"
              onClick={() => setMin(true)}
              onPointerDownCapture={(e) => e.stopPropagation()}
              aria-label="Minimize VoltMonkey"
              title="Minimize"
              className="absolute right-0 top-0 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-edge-strong bg-bg-elev text-base font-bold leading-none text-text-dim shadow-sm transition-colors hover:text-text-main"
            >
              −
            </button>

            {/* contact shadow */}
            <span
              aria-hidden
              className="absolute bottom-1 left-1/2 h-2.5 w-2/3 -translate-x-1/2 rounded-[50%] bg-black opacity-30 blur-[3px]"
            />

            {/* the monkey — click to open the chat */}
            <motion.button
              type="button"
              onClick={() => setChatOpen(true)}
              aria-label="Ask VoltMonkey — open the AI study buddy"
              title="Ask VoltMonkey"
              className="absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-signal-bright"
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <motion.img
                src={BODY_SRC}
                alt="VoltMonkey the mascot"
                draggable={false}
                animate={idleAnim}
                transition={reduce ? undefined : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-full origin-bottom select-none object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
              />
            </motion.button>
          </div>
        </motion.div>
      )}

      <AssistantPanel open={chatOpen} onClose={() => setChatOpen(false)} pathname={pathname} inModule={inModule} />
    </>
  );
}
