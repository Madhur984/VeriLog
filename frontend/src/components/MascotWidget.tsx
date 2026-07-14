import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AssistantPanel from './AssistantPanel';

/**
 * "VoltMonkey" — the BitForBytes guide mascot.
 *
 * A living little character in the bottom-right corner of every page. The
 * full-body monkey (`public/mascot/body.png`) idles with a gentle breathing
 * bob and every few seconds does a spring-loaded HOP — its ground shadow
 * squashes and stretches to sell the weight, and two electric spark motes
 * flicker off its lightning tail (this is an electronics brand, after all).
 *
 * When it speaks, the bubble carries a small expression head that matches the
 * mood of the page (`happy` / `excited` / `thinking` / `focused` / …), blinks
 * on its own, nods when a new tip appears, and the tip text types itself out.
 *
 * Every animation is transform/opacity only (GPU-cheap) and the whole thing
 * goes still under `prefers-reduced-motion`.
 *
 * Lazy-loaded from App.tsx so it never blocks first paint.
 */

const BASE = import.meta.env.BASE_URL;
const asset = (name: string) => `${BASE}mascot/${name}.png`;
const BODY_SRC = asset('body');

type Mood =
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'focused'
  | 'surprised'
  | 'wink'
  | 'motivated'
  | 'confident'
  | 'confused'
  | 'achiever';

type Guide = { test: (path: string) => boolean; title: string; mood: Mood; tips: string[] };

/** Ordered most-specific → least-specific; first match wins. */
const GUIDES: Guide[] = [
  {
    test: (p) => p === '/',
    title: 'Welcome',
    mood: 'motivated',
    tips: [
      "Hi, I'm VoltMonkey! ⚡ Welcome to BitForBytes — learn to design real chips, from zero.",
      'Everything here is hands-on: you build actual logic, not just read theory.',
      'Hit “Get started” to open the workstation and pick your first module.',
    ],
  },
  {
    test: (p) => p.startsWith('/portal'),
    title: 'Your Workstation',
    mood: 'confident',
    tips: [
      'This is your Workstation — every module, lab and tool lives here.',
      "The first modules are free. Green checks show what you've finished.",
      'New to logic? Start with the Foundation track.',
    ],
  },
  {
    test: (p) => p.startsWith('/career-roadmap') || p.startsWith('/silicon-map'),
    title: 'Career Map',
    mood: 'thinking',
    tips: [
      'This map shows how skills connect into real VLSI careers.',
      'Click any node to see what to learn next — and why it matters.',
    ],
  },
  {
    test: (p) => p.startsWith('/dsd/'),
    title: 'Digital System Design',
    mood: 'focused',
    tips: [
      'Each DSD module builds a real circuit, one step at a time.',
      "Watch the analogy first — then build it yourself; that's where it clicks.",
      'Stuck? The recap at the end sums up the whole idea in plain language.',
    ],
  },
  {
    test: (p) => p.startsWith('/basic-electronics/'),
    title: 'Basic Electronics',
    mood: 'focused',
    tips: [
      'Transistors, BJTs, MOSFETs — the building blocks of every chip.',
      'Follow the analogy first; the math makes sense once you can picture it.',
    ],
  },
  {
    test: (p) => p.startsWith('/module/'),
    title: 'Foundation',
    mood: 'focused',
    tips: [
      'This module mixes video, interactives and practice — take your time on the builds.',
      'Tap the lightning tail on any diagram to see it animate.',
    ],
  },
  {
    test: (p) => p.startsWith('/workbench'),
    title: 'Logic Workbench',
    mood: 'thinking',
    tips: [
      'A live sandbox — drag gates, wire them up, and watch signals flow.',
      'Try a guided tutorial (like the half-adder) to learn the ropes fast.',
    ],
  },
  {
    test: (p) => p.startsWith('/kmap-lab'),
    title: 'K-Map Lab',
    mood: 'thinking',
    tips: [
      'Karnaugh maps simplify boolean logic — group the 1s to shrink the expression.',
      'Bigger groups = simpler circuits. Aim for the fewest, largest groups.',
    ],
  },
  {
    test: (p) => p.startsWith('/verilog-playground') || p.startsWith('/hw-leetcode'),
    title: 'Verilog Judge',
    mood: 'confident',
    tips: [
      'Write Verilog, run it against test cases, get instant feedback.',
      'Start with the single-bit combinational problems, then level up.',
    ],
  },
  {
    test: (p) => p.startsWith('/signal-playground') || p.startsWith('/logic-studio'),
    title: 'Explore Freely',
    mood: 'happy',
    tips: ['No wrong answers here — just signals to poke at and understand.'],
  },
  {
    test: (p) => p.startsWith('/boss-arena'),
    title: 'Boss Arena',
    mood: 'motivated',
    tips: [
      "This tests everything you've learned. Deep breath — you've got this. ⚡",
      'Read the brief twice, sketch it, then build. Speed comes later.',
    ],
  },
  {
    test: (p) => p.startsWith('/gatekeeper-game') || p.startsWith('/debug-mission'),
    title: 'Debug Challenge',
    mood: 'confused',
    tips: [
      "Something's off in this circuit — your job is to hunt it down. 🔍",
      'Trace the signal step by step; the bug hides where you assume it works.',
    ],
  },
  {
    test: (p) => p.startsWith('/analogies') || p.startsWith('/verilog-library'),
    title: 'Reference Library',
    mood: 'happy',
    tips: ["Bookmark this — it's your quick-reference for concepts and Verilog patterns."],
  },
  {
    test: (p) => p.startsWith('/profile') || p.startsWith('/settings'),
    title: 'Your Progress',
    mood: 'achiever',
    tips: ['Your streaks, finished modules and saved work all live here.'],
  },
];

const DEFAULT_GUIDE: Guide = {
  test: () => true,
  title: 'VoltMonkey the Guide',
  mood: 'happy',
  tips: [
    "Need a hand? I'm VoltMonkey — I'll pop up with tips wherever you go.",
    "Click me any time for a hint about the page you're on.",
  ],
};

function guideFor(path: string): Guide {
  return GUIDES.find((g) => g.test(path)) ?? DEFAULT_GUIDE;
}

// Course-module routes ship a bottom footer bar (Back / Next). The mascot must
// sit ABOVE that bar there so it never covers the Next button.
const MODULE_ROUTE = /^\/(module|dsd|basic-electronics|sandbox)(\/|$)/;

/* ── The blinking, nodding expression head shown inside the speech bubble ── */
const ExpressionHead: React.FC<{ mood: Mood; nodKey: string; reduce: boolean }> = ({
  mood,
  nodKey,
  reduce,
}) => (
  <motion.span
    key={nodKey}
    initial={reduce ? false : { scale: 0.5, rotate: -12, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 420, damping: 18 }}
    className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-edge-strong bg-bg-base"
  >
    <motion.img
      src={asset(mood)}
      alt=""
      aria-hidden
      draggable={false}
      className="h-9 w-9 origin-center select-none object-contain"
      animate={reduce ? undefined : { scaleY: [1, 1, 0.12, 1] }}
      transition={
        reduce
          ? undefined
          : { duration: 0.5, times: [0, 0.86, 0.93, 1], repeat: Infinity, repeatDelay: 3.1 }
      }
    />
  </motion.span>
);

export default function MascotWidget() {
  const { pathname } = useLocation();
  const guide = useMemo(() => guideFor(pathname), [pathname]);
  const inModule = MODULE_ROUTE.test(pathname);
  const reduce = !!useReducedMotion();

  const [open, setOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [typed, setTyped] = useState('');

  const mood: Mood = hovered ? 'excited' : guide.mood;
  const fullTip = guide.tips[idx] ?? '';

  // Fresh tip whenever the route changes.
  useEffect(() => {
    setIdx(0);
    setOpen(true);
  }, [pathname]);

  // Typewriter reveal of the current tip.
  useEffect(() => {
    if (reduce) {
      setTyped(fullTip);
      return;
    }
    setTyped('');
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setTyped(fullTip.slice(0, i));
      if (i >= fullTip.length) window.clearInterval(t);
    }, 16);
    return () => window.clearInterval(t);
  }, [fullTip, reduce]);

  // Auto-tuck the bubble away after a while so it never blocks the page.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 12000);
    return () => window.clearTimeout(t);
  }, [open, idx]);

  const advance = () => {
    if (!open) {
      setIdx(0);
      setOpen(true);
      return;
    }
    if (idx < guide.tips.length - 1) setIdx((i) => i + 1);
    else setOpen(false);
  };

  // Idle bob for the body (breathing). The bigger HOP lives on the wrapper.
  const idleAnim = reduce
    ? undefined
    : { y: [0, -4, 0, -3, 0], rotate: [0, -1.6, 0, 1.6, 0], scale: [1, 1.015, 1, 1.015, 1] };
  const hopAnim = reduce ? undefined : { y: [0, 0, -22, -3, 0, 0] };
  const hopTimes = [0, 0.5, 0.66, 0.8, 0.9, 1];
  // Shadow squashes when grounded, shrinks/fades as VoltMonkey leaves the floor.
  const shadowAnim = reduce
    ? undefined
    : { scaleX: [1, 1, 0.62, 0.92, 1, 1], opacity: [0.32, 0.32, 0.14, 0.28, 0.32, 0.32] };

  return (
    <>
    <div
      className={`pointer-events-none fixed right-4 z-[60] flex flex-col items-end gap-2 ${
        inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
      }`}
    >
      <AnimatePresence>
        {open && !chatOpen && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative max-w-[16rem] rounded-xl border-2 border-edge-strong bg-bg-elev px-3.5 py-3 shadow-brutal sm:max-w-[18rem]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss tip"
              className="absolute right-2 top-1.5 text-text-dim transition-colors hover:text-text-main"
            >
              ×
            </button>

            <div className="flex items-start gap-2.5 pr-3">
              <ExpressionHead mood={mood} nodKey={`${pathname}-${idx}`} reduce={reduce} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-signal-bright">
                  {guide.title}
                </p>
                <p className="mt-1 min-h-[2.5rem] text-sm leading-snug text-text-main">
                  {typed}
                  {!reduce && typed.length < fullTip.length && (
                    <motion.span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-signal-bright"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    />
                  )}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1" aria-hidden>
                {guide.tips.length > 1 &&
                  guide.tips.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === idx ? 'w-4 bg-signal-bright' : 'w-1.5 bg-border-soft'
                      }`}
                    />
                  ))}
              </span>
              <button
                type="button"
                onClick={advance}
                className="font-mono text-[11px] font-bold uppercase tracking-wide text-signal-bright transition-transform hover:translate-x-0.5"
              >
                {idx < guide.tips.length - 1 ? 'Next ›' : 'Got it ✓'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="mt-2 w-full rounded-lg border-2 border-edge-strong bg-signal-bright/10 py-1.5 text-[11px] font-bold uppercase tracking-wide text-signal-bright transition-colors hover:bg-signal-bright/20"
            >
              💬 Ask VoltMonkey anything
            </button>

            {/* speech-bubble tail pointing down toward the mascot */}
            <span className="absolute -bottom-[7px] right-9 h-3 w-3 rotate-45 border-b-2 border-r-2 border-edge-strong bg-bg-elev" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character zone: grounded shadow + sparks + hopping body */}
      <div
        className={`pointer-events-none relative ${
          inModule ? 'h-20 w-[4.5rem] sm:h-24 sm:w-20' : 'h-32 w-28 sm:h-40 sm:w-36'
        }`}
      >
        {/* contact shadow on the floor — reacts to the hop */}
        <motion.span
          aria-hidden
          className="absolute bottom-1 left-1/2 h-2.5 w-2/3 -translate-x-1/2 rounded-[50%] bg-black blur-[3px]"
          style={{ opacity: 0.3 }}
          animate={shadowAnim}
          transition={
            reduce
              ? undefined
              : { duration: 3.4, times: hopTimes, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }
          }
        />

        {/* electric spark motes off the lightning tail (left side) */}
        {!reduce &&
          [0, 1].map((s) => (
            <motion.span
              key={s}
              aria-hidden
              className="absolute left-0 select-none text-[13px] leading-none text-signal-bright drop-shadow-[0_0_4px_rgba(167,139,250,0.9)]"
              style={{ bottom: `${28 + s * 16}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.4], x: [-2, -8, -12], y: [0, -4, -9] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                repeatDelay: 1.6 + s * 0.9,
                delay: s * 0.5,
                ease: 'easeOut',
              }}
            >
              ⚡
            </motion.span>
          ))}

        {/* the hop wrapper */}
        <motion.div
          className="absolute inset-0"
          animate={hopAnim}
          transition={
            reduce
              ? undefined
              : { duration: 3.4, times: hopTimes, repeat: Infinity, repeatDelay: 1.6, ease: [0.5, 0, 0.4, 1] }
          }
        >
          <motion.button
            type="button"
            onClick={() => setChatOpen(true)}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            aria-label="VoltMonkey the guide — click to chat with the AI study buddy"
            className="pointer-events-auto h-full w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-signal-bright"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92, rotate: -3 }}
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
        </motion.div>
      </div>
    </div>
    <AssistantPanel open={chatOpen} onClose={() => setChatOpen(false)} pathname={pathname} inModule={inModule} />
    </>
  );
}
