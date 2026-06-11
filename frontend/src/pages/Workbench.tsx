import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { HalfAdderTutorial } from '../components/workbench/HalfAdderTutorial';
import { FullAdderTutorial } from '../components/workbench/FullAdderTutorial';

/**
 * /workbench - the live CircuitVerse editor (embed mode: no API auth needed;
 * the Vue router matches /embed/:projectId? and boots the simulator directly).
 *
 * Two hard-won constraints:
 *  - The iframe must always have a definite height at load (never h-full under
 *    a min-h-only parent) or the simulator boots in a collapsed box and its
 *    canvas/panel setup crashes (transformCallback errors).
 *  - The iframe must keep the FULL window width: CircuitVerse switches to its
 *    compact mobile UI (no Circuit Elements panel) when ITS width drops below
 *    desktop size. So the ?tutorial=half-adder rail FLOATS OVER the simulator
 *    instead of shrinking it - collapsible side panel on desktop, bottom sheet
 *    on mobile.
 */
export default function Workbench() {
  const [params, setParams] = useSearchParams();
  const tutorialId = params.get('tutorial');
  const Rail = tutorialId === 'full-adder' ? FullAdderTutorial
    : tutorialId === 'half-adder' ? HalfAdderTutorial
    : null;
  const tutorial = Rail !== null;
  const [railOpen, setRailOpen] = useState(true);

  const closeTutorial = () => {
    const next = new URLSearchParams(params);
    next.delete('tutorial');
    setParams(next, { replace: true });
  };

  const frame = (
    <iframe
      src="/circuitverse/index.html#/embed"
      className={`block w-full border-none ${tutorial ? 'h-full' : 'min-h-[100svh]'}`}
      style={{ border: 'none', display: 'block' }}
      title="CircuitVerse Simulator"
      allow="fullscreen"
    />
  );

  if (!Rail) return frame;

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {frame}

      {/* desktop: floating side rail, collapsible so the simulator's own right panel stays reachable */}
      <div
        className={`hidden lg:block absolute top-0 right-0 h-full w-[380px] z-20 shadow-2xl transition-transform duration-300 ${
          railOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Rail onClose={closeTutorial} onMinimize={() => setRailOpen(false)} />
      </div>
      {!railOpen && (
        <button
          onClick={() => setRailOpen(true)}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center gap-1 rounded-l-xl bg-slate-950 border-2 border-r-0 border-amber-500 text-amber-400 px-2 py-4 font-mono text-[10px] font-black uppercase tracking-widest hover:px-3 transition-all"
          style={{ writingMode: 'vertical-rl' }}
          title="Reopen the guided build"
        >
          <ChevronLeft size={13} className="rotate-90" /> Tutorial
        </button>
      )}

      {/* mobile: bottom sheet (the rail's own grab bar expands/collapses it) */}
      <div className="lg:hidden absolute bottom-0 inset-x-0 z-20 max-h-[60svh] flex flex-col justify-end">
        <Rail onClose={closeTutorial} />
      </div>
    </div>
  );
}
