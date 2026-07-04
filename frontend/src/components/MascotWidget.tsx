import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * "Byte" — the BitForBytes guide mascot.
 *
 * Floats in the bottom-right corner of every page and pops a speech bubble with
 * tips tailored to the current route, so it actually *explains* what each page
 * is for. Click the mascot (or "Next") to cycle through the tips for that page.
 *
 * The character is the full-body monkey mascot (`frontend/public/mascot/body.png`)
 * with a lively idle — a gentle bob, sway and breathing. No external runtime;
 * it's a plain image, so it just works.
 *
 * Lazy-loaded from App.tsx so it never blocks first paint.
 */

const BASE = import.meta.env.BASE_URL;
const MASCOT_SRC = `${BASE}mascot/body.png`;

type Guide = { test: (path: string) => boolean; title: string; tips: string[] };

/** Ordered most-specific → least-specific; first match wins. */
const GUIDES: Guide[] = [
  {
    test: (p) => p === '/',
    title: 'Welcome',
    tips: [
      "Hi, I'm Byte! ⚡ Welcome to BitForBytes — learn to design real chips, from zero.",
      'Everything here is hands-on: you build actual logic, not just read theory.',
      'Hit “Get Started” to open the portal and pick your first module.',
    ],
  },
  {
    test: (p) => p.startsWith('/portal'),
    title: 'Your Workstation',
    tips: [
      'This is your Workstation — every module, lab and tool lives here.',
      "The first modules are free. Green checks show what you've finished.",
      'New to logic? Start with the Digital System Design (DSD) track.',
    ],
  },
  {
    test: (p) => p.startsWith('/career-roadmap') || p.startsWith('/silicon-map'),
    title: 'Career Map',
    tips: [
      'This map shows how skills connect into real VLSI careers.',
      'Click any node to see what to learn next — and why it matters.',
    ],
  },
  {
    test: (p) => p.startsWith('/dsd/'),
    title: 'Digital System Design',
    tips: [
      'Each DSD module builds a real circuit, one step at a time.',
      "Watch the analogy first — then build it yourself; that's where it clicks.",
      'Stuck? The recap at the end sums up the whole idea in plain language.',
    ],
  },
  {
    test: (p) => p.startsWith('/basic-electronics/'),
    title: 'Basic Electronics',
    tips: [
      'Transistors, BJTs, MOSFETs — the building blocks of every chip.',
      'Follow the analogy first; the math makes sense once you can picture it.',
    ],
  },
  {
    test: (p) => p.startsWith('/module/'),
    title: 'Course Module',
    tips: [
      'This module mixes video, interactives and practice — take your time on the builds.',
      'Tap the lightning tail on any diagram to see it animate.',
    ],
  },
  {
    test: (p) => p.startsWith('/workbench'),
    title: 'Logic Workbench',
    tips: [
      'A live sandbox — drag gates, wire them up, and watch signals flow.',
      'Try a guided tutorial (like the half-adder) to learn the ropes fast.',
    ],
  },
  {
    test: (p) => p.startsWith('/kmap-lab'),
    title: 'K-Map Lab',
    tips: [
      'Karnaugh maps simplify boolean logic — group the 1s to shrink the expression.',
      'Bigger groups = simpler circuits. Aim for the fewest, largest groups.',
    ],
  },
  {
    test: (p) => p.startsWith('/verilog-playground') || p.startsWith('/hw-leetcode'),
    title: 'Hardware LeetCode',
    tips: [
      'Write Verilog, run it against test cases, get instant feedback.',
      'Start with the single-bit combinational problems, then level up.',
    ],
  },
  {
    test: (p) => p.startsWith('/fsm'),
    title: 'FSM Playground',
    tips: [
      'Design states and transitions, then watch the state machine run live.',
      'A clean state diagram makes the Verilog almost write itself.',
    ],
  },
  {
    test: (p) => p.startsWith('/signal-playground') || p.startsWith('/logic-studio'),
    title: 'Explore Freely',
    tips: ['No wrong answers here — just signals to poke at and understand.'],
  },
  {
    test: (p) =>
      p.startsWith('/boss-arena') || p.startsWith('/gatekeeper-game') || p.startsWith('/debug-mission'),
    title: 'Challenge Mode',
    tips: [
      "These test everything you've learned. Deep breath — you've got this. ⚡",
      'Read the brief twice, sketch it, then build. Speed comes later.',
    ],
  },
  {
    test: (p) => p.startsWith('/analogies') || p.startsWith('/verilog-library'),
    title: 'Reference Library',
    tips: ["Bookmark this — it's your quick-reference for concepts and Verilog patterns."],
  },
  {
    test: (p) => p.startsWith('/profile') || p.startsWith('/settings'),
    title: 'Your Progress',
    tips: ['Your streaks, finished modules and saved work all live here.'],
  },
];

const DEFAULT_GUIDE: Guide = {
  test: () => true,
  title: 'Byte the Guide',
  tips: [
    "Need a hand? I'm Byte — I'll pop up with tips wherever you go.",
    "Click me any time for a hint about the page you're on.",
  ],
};

function guideFor(path: string): Guide {
  return GUIDES.find((g) => g.test(path)) ?? DEFAULT_GUIDE;
}

// Course-module routes ship a bottom footer bar (Back / Next). The mascot must
// sit ABOVE that bar there so it never covers the Next button.
const MODULE_ROUTE = /^\/(module|dsd|basic-electronics|sandbox)(\/|$)/;

export default function MascotWidget() {
  const { pathname } = useLocation();
  const guide = useMemo(() => guideFor(pathname), [pathname]);
  const inModule = MODULE_ROUTE.test(pathname);

  const [open, setOpen] = useState(true);
  const [idx, setIdx] = useState(0);

  // Fresh tip whenever the route changes.
  useEffect(() => {
    setIdx(0);
    setOpen(true);
  }, [pathname]);

  // Auto-tuck the bubble away after a while so it never blocks the page.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 11000);
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

  return (
    <div
      className={`pointer-events-none fixed right-4 z-[60] flex flex-col items-end gap-2 ${
        inModule ? 'bottom-24 lg:bottom-28' : 'bottom-4'
      }`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key={`${pathname}-${idx}`}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative max-w-[15rem] rounded-xl border-2 border-edge-strong bg-bg-elev px-3.5 py-3 shadow-brutal sm:max-w-[17rem]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss tip"
              className="absolute right-2 top-1.5 text-text-dim transition-colors hover:text-text-main"
            >
              ×
            </button>
            <p className="pr-3 font-mono text-[10px] font-bold uppercase tracking-widest text-signal-bright">
              {guide.title}
            </p>
            <p className="mt-1 text-sm leading-snug text-text-main">{guide.tips[idx]}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-text-dim">
                {guide.tips.length > 1 ? `${idx + 1}/${guide.tips.length}` : ''}
              </span>
              <button
                type="button"
                onClick={advance}
                className="font-mono text-[11px] font-bold uppercase tracking-wide text-signal-bright transition-transform hover:translate-x-0.5"
              >
                {idx < guide.tips.length - 1 ? 'Next ›' : 'Got it ✓'}
              </button>
            </div>
            {/* speech-bubble tail pointing down toward the mascot */}
            <span className="absolute -bottom-[7px] right-9 h-3 w-3 rotate-45 border-b-2 border-r-2 border-edge-strong bg-bg-elev" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={advance}
        aria-label="Byte the guide — click for a tip about this page"
        className={`pointer-events-auto rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-signal-bright ${
          inModule ? 'h-20 w-[4.5rem] sm:h-24 sm:w-20' : 'h-32 w-28 sm:h-40 sm:w-36'
        }`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <motion.img
          src={MASCOT_SRC}
          alt="Byte the mascot"
          draggable={false}
          animate={{ y: [0, -6, 0, -4, 0], rotate: [0, -2.5, 0, 2.5, 0], scale: [1, 1.02, 1, 1.02, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-full origin-bottom select-none object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
        />
      </motion.button>
    </div>
  );
}
