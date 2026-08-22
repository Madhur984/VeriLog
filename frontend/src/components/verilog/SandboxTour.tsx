/**
 * Sandbox onboarding tour — a spotlight walkthrough for a first-time visitor.
 *
 * The sandbox is a blank page with four output tabs and a Yosys-shaped
 * limitation, none of which announce themselves. A newcomer's first question is
 * "what do I type, and where does the answer appear?", and the second is "why
 * did my `initial` block do nothing?". This answers both before they hit it.
 *
 * Two deliberate choices:
 *
 *  - The tour POINTS at real controls, it does not click them. Driving the app
 *    from a tour means every step depends on the previous one leaving the right
 *    state, and a mis-step strands the user somewhere they never asked to be.
 *    Switching to the Schematic tab would also kick off a second synthesis run.
 *    Highlighting is enough to make a control findable.
 *
 *  - Targets are addressed by `data-tour` attributes, not CSS classes or DOM
 *    order, so restyling the sandbox cannot silently break the tour. A step
 *    whose target is missing degrades to a centred card rather than pointing at
 *    the wrong thing or crashing.
 */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface TourStep {
  /** `data-tour` value of the element to spotlight. Omit for a centred card. */
  target?: string;
  title: string;
  body: React.ReactNode;
  /** Preferred side to place the card on; flipped when there is no room. */
  place?: 'top' | 'bottom' | 'left' | 'right';
}

const CARD_W = 344;
const GAP = 14;
/** Breathing room between the spotlight ring and the element it surrounds. */
const PAD = 6;
const EDGE = 12;

interface Box { top: number; left: number; width: number; height: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Track a target's viewport rect, re-measuring when the page moves under it.
 * Monaco relayouts and the dock toggle both resize things without a scroll or a
 * window resize, so a ResizeObserver on <body> covers what listeners miss.
 */
function useTargetBox(target: string | undefined, step: number): Box | null {
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    if (!target) { setBox(null); return; }

    let raf = 0;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
      if (!el) { setBox(null); return; }
      const r = el.getBoundingClientRect();
      // A zero-size rect means the element is hidden at this breakpoint (several
      // sandbox controls drop out on narrow screens); treat it as absent.
      if (r.width === 0 && r.height === 0) { setBox(null); return; }
      setBox((prev) =>
        prev && prev.top === r.top && prev.left === r.left
          && prev.width === r.width && prev.height === r.height
          ? prev
          : { top: r.top, left: r.left, width: r.width, height: r.height });
    };

    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    measure();

    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      ro.disconnect();
    };
  }, [target, step]);

  return box;
}

/**
 * Place the card beside the spotlight, flipping and clamping to stay on screen.
 *
 * Takes the viewport explicitly rather than reading `window`, which keeps it a
 * pure function — the flip-and-clamp rules are the only real logic here, and
 * they are worth testing without a DOM.
 */
export function placeCard(
  box: Box | null,
  cardH: number,
  prefer: TourStep['place'],
  vw: number,
  vh: number,
  cardW: number = CARD_W,
): { top: number; left: number } {
  if (!box) {
    return {
      top: Math.round(Math.max(EDGE, (vh - cardH) / 2)),
      left: Math.round(Math.max(EDGE, (vw - cardW) / 2)),
    };
  }

  const room = {
    bottom: vh - (box.top + box.height) - GAP,
    top: box.top - GAP,
    right: vw - (box.left + box.width) - GAP,
    left: box.left - GAP,
  };

  // Try the requested side, then the others in order of how much room they have.
  const order: NonNullable<TourStep['place']>[] = [
    prefer ?? 'bottom',
    ...(['bottom', 'top', 'right', 'left'] as const)
      .filter((s) => s !== prefer)
      .sort((a, b) => room[b] - room[a]),
  ];
  const side = order.find((s) => room[s] >= (s === 'top' || s === 'bottom' ? cardH : cardW)) ?? order[0];

  let top: number;
  let left: number;
  if (side === 'bottom' || side === 'top') {
    top = side === 'bottom' ? box.top + box.height + GAP : box.top - cardH - GAP;
    left = box.left + box.width / 2 - cardW / 2;
  } else {
    left = side === 'right' ? box.left + box.width + GAP : box.left - cardW - GAP;
    top = box.top + box.height / 2 - cardH / 2;
  }

  return {
    top: Math.round(clamp(top, EDGE, Math.max(EDGE, vh - cardH - EDGE))),
    left: Math.round(clamp(left, EDGE, Math.max(EDGE, vw - cardW - EDGE))),
  };
}

export const SandboxTour: React.FC<{
  steps: TourStep[];
  /** Called on finish, skip or Esc — the caller decides what to persist. */
  onClose: (completed: boolean) => void;
}> = ({ steps, onClose }) => {
  const [i, setI] = useState(0);
  const step = steps[i];
  const box = useTargetBox(step?.target, i);

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(200);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const last = i === steps.length - 1;
  const next = useCallback(() => (last ? onClose(true) : setI((n) => n + 1)), [last, onClose]);
  const back = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  // Measure the card so it can be centred/flipped against its real height.
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h && h !== cardH) setCardH(h);
  });

  // Take focus for the duration so keys reach the tour, and hand it back after.
  useEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();
    return () => restoreFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(false); return; }
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); next(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, back, onClose]);

  if (!step) return null;

  // On a phone the fixed card is wider than the screen; shrink it to fit rather
  // than let it hang off the edge.
  const cardW = Math.min(CARD_W, window.innerWidth - EDGE * 2);
  const pos = placeCard(box, cardH, step.place, window.innerWidth, window.innerHeight, cardW);

  return (
    <div className="fixed inset-0 z-[900]" role="presentation">
      {/* The scrim is the spotlight's own outer shadow, so there is exactly one
          element and therefore no seams between four dimming rectangles. */}
      {box ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-lg"
          style={{
            top: box.top - PAD,
            left: box.left - PAD,
            width: box.width + PAD * 2,
            height: box.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(2,6,23,0.66)',
            outline: '2px solid var(--vj-wave)',
            outlineOffset: 2,
            transition: 'all var(--vj-dur-transition, 180ms) var(--vj-ease, ease)',
          }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.66)' }} />
      )}

      {/* Swallow clicks on the page beneath: a tour that lets you click through
          desynchronises from whatever you changed. */}
      <div className="absolute inset-0" onClick={() => onClose(false)} />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Sandbox tour, step ${i + 1} of ${steps.length}: ${step.title}`}
        tabIndex={-1}
        className="absolute rounded-xl border p-4 shadow-2xl outline-none"
        style={{
          ...pos,
          width: cardW,
          background: 'var(--vj-surface-1)',
          borderColor: 'var(--vj-border-strong)',
          color: 'var(--vj-text)',
        }}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--vj-wave)' }}>
            {i + 1} / {steps.length}
          </span>
          <button
            onClick={() => onClose(false)}
            aria-label="Skip the tour"
            className="ml-auto grid h-6 w-6 place-items-center rounded transition-colors"
            style={{ color: 'var(--vj-text-dim)' }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <h2 className="mb-1.5 text-[15px] font-bold tracking-tight">{step.title}</h2>
        <div className="text-[13px] leading-relaxed" style={{ color: 'var(--vj-text-sub)' }}>
          {step.body}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1" aria-hidden>
            {steps.map((s, n) => (
              <span
                key={s.title}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 14 : 6,
                  background: n === i ? 'var(--vj-wave)' : 'var(--vj-border-strong)',
                }}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {i > 0 && (
              <button
                onClick={back}
                className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-[12px] font-bold"
                style={{ color: 'var(--vj-text-dim)' }}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
            <button
              onClick={next}
              className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'var(--vj-wave)', color: 'var(--vj-surface-0)' }}
            >
              {last ? <><Check className="h-3.5 w-3.5" /> Start building</>
                : <>Next <ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const K: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="rounded px-1 py-0.5 font-mono text-[10px]"
       style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text-code)' }}>{children}</kbd>
);

const C: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="rounded px-1 py-0.5 font-mono text-[11px]"
        style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text-code)' }}>{children}</code>
);

/**
 * The script. Ordered as a first session actually goes: what this is, what you
 * type, how you run it, where the answers land, then the two things that will
 * otherwise bite you (the naming convention and the Yosys limitation).
 */
export const SANDBOX_TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to the Verilog Sandbox',
    body: (
      <>
        A blank page for Verilog: write a design, write a testbench, press Run, and
        watch it work. No problem to solve and no grade — that is the{' '}
        <strong style={{ color: 'var(--vj-text)' }}>Verilog Judge</strong> next door.
        <br /><br />
        Takes about a minute. <K>Esc</K> to skip.
      </>
    ),
  },
  {
    target: 'editor-tabs',
    place: 'bottom',
    title: 'Two files',
    body: (
      <>
        <C>design.v</C> holds the hardware you are building. <C>testbench.v</C> holds
        the logic that drives it.
        <br /><br />
        Both are already filled in with a working 4-bit counter, so you can press Run
        before writing a line. <K>Ctrl</K>+<K>PgUp</K>/<K>PgDn</K> switches between them.
      </>
    ),
  },
  {
    target: 'run',
    place: 'bottom',
    title: 'Run it',
    body: (
      <>
        Synthesizes both files and simulates the result — or <K>Ctrl</K>+<K>Enter</K>.
        <br /><br />
        The first run downloads the Yosys engine (~54 MB) once per session, so give it
        a moment. Everything after that is instant, and it all runs in your browser —
        nothing is uploaded.
      </>
    ),
  },
  {
    target: 'out-tabs',
    place: 'bottom',
    title: 'Four ways to see it',
    body: (
      <>
        <strong style={{ color: 'var(--vj-text)' }}>Waveform</strong> — every signal over
        time; click to drop a cursor, shift-click for a second one to measure between them.<br />
        <strong style={{ color: 'var(--vj-text)' }}>Schematic</strong> — the actual gates
        and flip-flops it built.<br />
        <strong style={{ color: 'var(--vj-text)' }}>Synthesis</strong> — what it cost:
        cell count, storage bits.<br />
        <strong style={{ color: 'var(--vj-text)' }}>Output</strong> — the log, plus any
        errors and warnings.
      </>
    ),
  },
  {
    target: 'cycles',
    place: 'top',
    title: 'How long to simulate',
    body: (
      <>
        The number of clock edges to run. Raise it to see a slow counter wrap around;
        lower it when you only care about the first few cycles.
      </>
    ),
  },
  {
    target: 'dock',
    place: 'bottom',
    title: 'Move the output',
    body: (
      <>
        Puts the output pane on the right or across the bottom. Bottom gives waveforms
        the full width, which helps on long traces; right suits wide code.
      </>
    ),
  },
  {
    target: 'intro',
    place: 'bottom',
    title: 'One naming rule',
    body: (
      <>
        Keep your top-level design as <C>module top</C> and your testbench as{' '}
        <C>module tb</C>, instantiating it as <C>top uut</C>.
        <br /><br />
        The Sandbox, Practice and Problems all assume it, so code you write here pastes
        straight into the Judge.
      </>
    ),
  },
  {
    title: 'One thing that will surprise you',
    body: (
      <>
        The engine is Yosys, which <em>synthesizes hardware</em> rather than interpreting
        Verilog. So <C>initial</C>, <C>#delay</C> and <C>$display</C> are discarded rather
        than executed — and <C>$finish</C> / <C>$stop</C> stop synthesis outright, so leave
        them out entirely.
        <br /><br />
        Write a <strong style={{ color: 'var(--vj-text)' }}>synthesizable</strong> testbench
        instead: drive the design from clocked logic, and expose anything you want to watch
        as an <C>output</C> port. Every output becomes a row in the waveform. The starter
        testbench shows the pattern.
        <br /><br />
        You can replay this tour any time from the <strong style={{ color: 'var(--vj-text)' }}>?</strong> button.
      </>
    ),
  },
];
