import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, GraduationCap, ChevronDown } from 'lucide-react';
import { HalfAdderTutorial } from '../components/workbench/HalfAdderTutorial';
import { FullAdderTutorial } from '../components/workbench/FullAdderTutorial';
import { RippleCarryTutorial } from '../components/workbench/RippleCarryTutorial';
import { CarryLookAheadTutorial } from '../components/workbench/CarryLookAheadTutorial';
import { ParallelPrefixTutorial } from '../components/workbench/ParallelPrefixTutorial';
import { SerialAdderTutorial } from '../components/workbench/SerialAdderTutorial';
import { HalfSubtractorTutorial } from '../components/workbench/HalfSubtractorTutorial';
import { FullSubtractorTutorial } from '../components/workbench/FullSubtractorTutorial';
import {
  Mux4to1Tutorial, Demux1to4Tutorial, Decoder2to4Tutorial, Encoder4to2Tutorial,
  BinaryToGrayTutorial, NandUniversalTutorial, ArrayDividerCellTutorial,
} from '../components/workbench/comboTutorials';

/**
 * /workbench - the BitForBytes Logic Workbench.
 *
 * The drag-and-simulate canvas is a self-hosted open-source simulator embedded
 * in an iframe (`/circuitverse/index.html#/embed`, same origin). The page's
 * BitForBytes chrome comes from PortalLayout (the fixed Portal/Menu nav that
 * wraps this route) - we intentionally add NO second header here or it overlaps
 * that nav. The only in-page control is a small floating "Guided Builds"
 * launcher (bottom-left, clear of PortalLayout's top nav, the rail, and the
 * corner mascot) that starts/switches tutorials without leaving the page.
 *
 * Two hard-won constraints:
 *  - The iframe must always have a definite height at load (never h-full under
 *    a min-h-only parent) or the simulator boots in a collapsed box and crashes.
 *  - The iframe must keep the FULL window width or CircuitVerse switches to its
 *    compact mobile UI. So the tutorial rail and the launcher FLOAT OVER the
 *    simulator instead of shrinking it.
 */

const TUTORIALS: { id: string; label: string }[] = [
  { id: 'half-adder', label: 'Half Adder' },
  { id: 'full-adder', label: 'Full Adder' },
  { id: 'ripple-carry', label: 'Ripple-Carry Adder' },
  { id: 'carry-lookahead', label: 'Carry-Lookahead Adder' },
  { id: 'parallel-prefix', label: 'Parallel-Prefix Adder' },
  { id: 'serial-adder', label: 'Serial Adder' },
  { id: 'half-subtractor', label: 'Half Subtractor' },
  { id: 'full-subtractor', label: 'Full Subtractor' },
  { id: 'mux-4to1', label: '4-to-1 Multiplexer' },
  { id: 'demux-1to4', label: '1-to-4 Demultiplexer' },
  { id: 'decoder-2to4', label: '2-to-4 Decoder' },
  { id: 'encoder-4to2', label: '4-to-2 Encoder' },
  { id: 'binary-to-gray', label: 'Binary → Gray' },
  { id: 'nand-universal', label: 'NAND Universal Gate' },
  { id: 'array-divider-cell', label: 'Array Divider Cell' },
];

export default function Workbench() {
  const [params, setParams] = useSearchParams();
  const tutorialId = params.get('tutorial');
  const [menuOpen, setMenuOpen] = useState(false);

  const Rail = tutorialId === 'full-adder' ? FullAdderTutorial
    : tutorialId === 'half-adder' ? HalfAdderTutorial
    : tutorialId === 'ripple-carry' ? RippleCarryTutorial
    : tutorialId === 'carry-lookahead' ? CarryLookAheadTutorial
    : tutorialId === 'parallel-prefix' ? ParallelPrefixTutorial
    : tutorialId === 'serial-adder' ? SerialAdderTutorial
    : tutorialId === 'half-subtractor' ? HalfSubtractorTutorial
    : tutorialId === 'full-subtractor' ? FullSubtractorTutorial
    : tutorialId === 'mux-4to1' ? Mux4to1Tutorial
    : tutorialId === 'demux-1to4' ? Demux1to4Tutorial
    : tutorialId === 'decoder-2to4' ? Decoder2to4Tutorial
    : tutorialId === 'encoder-4to2' ? Encoder4to2Tutorial
    : tutorialId === 'binary-to-gray' ? BinaryToGrayTutorial
    : tutorialId === 'nand-universal' ? NandUniversalTutorial
    : tutorialId === 'array-divider-cell' ? ArrayDividerCellTutorial
    : null;
  const tutorial = Rail !== null;
  const activeLabel = TUTORIALS.find((t) => t.id === tutorialId)?.label;
  const [railOpen, setRailOpen] = useState(true);

  const closeTutorial = () => {
    const next = new URLSearchParams(params);
    next.delete('tutorial');
    setParams(next, { replace: true });
  };
  const launchTutorial = (id: string) => {
    const next = new URLSearchParams(params);
    next.set('tutorial', id);
    setParams(next, { replace: true });
    setMenuOpen(false);
    setRailOpen(true);
  };

  const frame = (
    <iframe
      src="/circuitverse/index.html#/embed"
      className={`block w-full border-none ${tutorial ? 'h-full' : 'min-h-[100svh]'}`}
      style={{ border: 'none', display: 'block' }}
      title="BitForBytes Logic Workbench"
      allow="fullscreen"
    />
  );

  // Floating "Guided Builds" launcher — bottom-left so it never collides with
  // PortalLayout's top nav, the right-side rail, or the bottom-right mascot.
  const launcher = (
    <div className="fixed bottom-4 left-4 z-[380] hidden lg:block">
      {menuOpen && <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(false)} />}
      {menuOpen && (
        <ul className="absolute bottom-full left-0 z-10 mb-2 max-h-[60vh] w-[248px] overflow-y-auto rounded-xl border-2 border-border-soft bg-bg-elev p-1.5 shadow-2xl">
          <li>
            <button onClick={() => { closeTutorial(); setMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${!tutorial ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/5'}`}>
              <span className="font-bold">Free build</span>
              <span className="ml-auto font-mono text-[10px] text-text-dim">blank canvas</span>
            </button>
          </li>
          <li className="my-1 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-text-dim">Guided builds</li>
          {TUTORIALS.map((t) => (
            <li key={t.id}>
              <button onClick={() => launchTutorial(t.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-bold transition-colors ${tutorialId === t.id ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/5'}`}>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setMenuOpen((o) => !o)}
        className="brutal-btn relative z-10 inline-flex h-10 items-center gap-2 bg-bg-elev px-3 text-[13px] font-bold text-text-main">
        <GraduationCap size={16} className="text-emerald-400" />
        <span className="max-w-[180px] truncate">{tutorial ? activeLabel : 'Guided Builds'}</span>
        <ChevronDown size={14} className={`text-text-dim transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  if (!Rail) {
    return (
      <>
        {frame}
        {launcher}
      </>
    );
  }

  return (
    <>
      <div className="relative h-[100svh] w-full overflow-hidden">
        {frame}

        {/* desktop: floating side rail, collapsible so the simulator's own right panel stays reachable */}
        <div
          className={`absolute right-0 top-0 z-20 hidden h-full w-[380px] shadow-2xl transition-transform duration-300 lg:block ${
            railOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Rail onClose={closeTutorial} onMinimize={() => setRailOpen(false)} />
        </div>
        {!railOpen && (
          <button
            onClick={() => setRailOpen(true)}
            className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-1 rounded-l-xl border-2 border-r-0 border-amber-500 bg-slate-950 px-2 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-amber-400 transition-all hover:px-3 lg:flex"
            style={{ writingMode: 'vertical-rl' }}
            title="Reopen the guided build"
          >
            <ChevronLeft size={13} className="rotate-90" /> Tutorial
          </button>
        )}

        {/* mobile: bottom sheet (the rail's own grab bar expands/collapses it) */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex max-h-[60svh] flex-col justify-end lg:hidden">
          <Rail onClose={closeTutorial} />
        </div>
      </div>
      {launcher}
    </>
  );
}
