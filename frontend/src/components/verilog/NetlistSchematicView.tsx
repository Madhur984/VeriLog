/**
 * Synthesized schematic — netlistsvg + elkjs, rendered from the netlist the
 * simulator already built.
 *
 * SCOPE: the Verilog Sandbox only. The Judge (/verilog-playground) keeps its
 * original `SynthSchematicView`, which draws the same netlist with a hand-rolled
 * layout and an interactive probe/force model built for grading. The two are
 * deliberately separate components rather than one with a mode flag — they share
 * no layout, no interaction model and no value plumbing, so a flag would just be
 * two implementations behind one door.
 *
 * Where this differs from the Judge's view: layout is ELK's problem rather than
 * hand-placed columns; identity comes from data-* attributes stamped by
 * yosysToSvg, so wires and cells are addressable without re-deriving geometry;
 * and values live in a separate overlay <g> that can be rewritten without
 * touching the diagram beneath it.
 *
 * Four properties this file is responsible for keeping true:
 *
 *   1. ONE synthesis. When the caller already has a netlist (the sandbox does),
 *      it is passed straight in. Only the fallback path synthesizes, and it
 *      shares yosysClient's cache with everything else on the page.
 *   2. The overlay never fights netlistsvg. It is appended after the imported
 *      markup and cleared wholesale on re-render, so there is no diffing.
 *   3. Unsupported cells are LOUD. yosysToSvg throws rather than let netlistsvg
 *      draw an anonymous box, and that error is surfaced here as a real message.
 *   4. NAVIGATION LIVES IN THE viewBox, not in a CSS transform. Panning and
 *      zooming rewrite one attribute on the <svg>, so the drawing stays vector-
 *      sharp at any zoom, the exported file is unaffected by where the user
 *      happens to be looking, and a wheel-zoom can be anchored under the cursor
 *      (which a `transform: scale()` about a fixed origin cannot do).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, Minimize2, Scan, Loader2, AlertTriangle, Download,
  Image as ImageIcon, Play, Pause, SkipForward, RotateCcw, Zap, X, ChevronRight,
  CornerDownRight, Code2,
} from 'lucide-react';
import { buildSim, type NetlistSim } from '../../engine/verilog/netlistSim';
import {
  initialState, valuesOf, netValues, step as stepProbe, resetState, replayTo,
  clampToWidth, isClockName, isResetName, label as valueLabel, stateOf,
  type ProbeState, type NetValue,
} from './schematicProbe';
import {
  parseNetlist, inspectCell, inspectNet, submoduleNetlist, moduleSourceAt, excerptAt,
  type Detail, type CellDetail, type NetDetail, type RawNetlist,
} from './cellInspect';
import { synthesize } from '../../engine/verilog/yosysClient';
import { yosysToSvg, busTickLayer, type SchematicResult } from '../../engine/verilog/schematic/yosysToSvg';
import { UnsupportedCellError } from '../../engine/verilog/schematic/cellSupport';
import type { Trace } from '../../engine/verilog/simRunner';
import type { Diag } from '../../engine/verilog/diagnostics';
import { setProbe, useProbe } from '../../stores/crossProbeStore';

/** One of the sandbox's editors, so the inspector can show the code behind a cell. */
export interface SchematicSource {
  /** Must match the file name Yosys reports in `src` — design.v / testbench.v. */
  file: string;
  text: string;
}

export interface NetlistSchematicViewProps {
  /** Verilog source — used only when `netlistJson` is absent. */
  code?: string;
  /** The netlist the caller already synthesized. Preferred: avoids a second run. */
  netlistJson?: string;
  isLight?: boolean;
  flatten?: boolean;
  headerExtra?: React.ReactNode;
  /** Simulation trace, for the value overlay. Same object WaveformViewer uses. */
  trace?: Trace | null;
  /** Waveform cursor position, in cycles. Values shown are sampled here. */
  cursor?: number | null;
  /**
   * The editors' contents, keyed by the file names Yosys sees. Double-clicking a
   * cell shows the lines that produced it, and the module block they sit in.
   */
  sources?: SchematicSource[];
  /**
   * Diagnostics from the fallback synthesis. Only fires when this component
   * synthesizes for itself — when the caller supplies `netlistJson` it already
   * owns the diagnostics from that run, and re-reporting them would double up.
   */
  onDiagnostics?: (d: Diag[]) => void;
}

type State =
  | { k: 'idle' }
  | { k: 'busy'; note: string }
  | { k: 'error'; message: string; cellTypes?: string[] }
  // `json` rides along so the live probe can build a simulator from exactly the
  // netlist that was drawn, without the caller having to pass it twice.
  | { k: 'ready'; result: SchematicResult; json: string };

/** A rectangle of diagram space — exactly what the SVG's viewBox holds. */
interface View { x: number; y: number; w: number; h: number }

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 24;
/** Breathing room around the content when fitting, in diagram units. */
const FIT_PAD = 16;

export const NetlistSchematicView: React.FC<NetlistSchematicViewProps> = ({
  code, netlistJson, isLight, flatten, headerExtra, trace, cursor, sources, onDiagnostics,
}) => {
  const [state, setState] = useState<State>({ k: 'idle' });
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const probe = useProbe();
  const runSeq = useRef(0);
  // Held in a ref, not read as a dependency: callers rarely memoize this
  // callback, and depending on it would re-run synthesis on every parent render.
  const onDiagRef = useRef(onDiagnostics);
  onDiagRef.current = onDiagnostics;

  // ── drill-down ───────────────────────────────────────────────────────
  // A stack of submodules the user has descended into. Each entry carries its
  // own single-module netlist, so everything downstream — renderer, simulator,
  // inspector — sees an ordinary top module and needs no notion of hierarchy.
  const [drill, setDrill] = useState<{ name: string; json: string }[]>([]);
  const activeJson = drill.length ? drill[drill.length - 1].json : netlistJson;
  // A fresh run replaces the design under our feet; staying inside a submodule
  // of the PREVIOUS netlist would show a diagram that no longer exists.
  useEffect(() => { setDrill((d) => (d.length ? [] : d)); }, [netlistJson, code]);

  // ── view (pan / zoom) ────────────────────────────────────────────────
  const [view, setView] = useState<View | null>(null);
  const baseRef = useRef<View | null>(null);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const drag = useRef<{ sx: number; sy: number; view: View; moved: boolean } | null>(null);

  // ── live probe ───────────────────────────────────────────────────────
  const [sim, setSim] = useState<NetlistSim | null>(null);
  const [simState, setSimState] = useState<ProbeState | null>(null);
  const [playing, setPlaying] = useState(false);
  const [flow, setFlow] = useState(true);
  const prevVals = useRef<Map<string, string>>(new Map());

  // ── inspector ────────────────────────────────────────────────────────
  const [detail, setDetail] = useState<Detail | null>(null);
  const netlist: RawNetlist | null = useMemo(
    () => (state.k === 'ready' ? parseNetlist(state.json) : null), [state]);
  useEffect(() => { setDetail(null); }, [state]);

  // Rebuild the simulator whenever the netlist changes. Same engine as the
  // grader, on the same netlist the diagram was drawn from.
  useEffect(() => {
    if (state.k !== 'ready') { setSim(null); setSimState(null); return; }
    const s = buildSim(state.json);
    setSim(s);
    setSimState(s ? initialState(s) : null);
    prevVals.current = new Map();
  }, [state]);

  const values = useMemo(
    () => (sim && simState ? valuesOf(sim, simState) : null), [sim, simState]);
  const nets = useMemo(
    () => (values && state.k === 'ready' ? netValues(state.result.netIndex, values) : null),
    [values, state]);

  // Free-run: one clock edge per tick. Stops itself when there is no clock to
  // step, so a purely combinational design cannot sit "playing" forever.
  useEffect(() => {
    if (!playing || !sim || !sim.hasClock) { if (playing && sim && !sim.hasClock) setPlaying(false); return; }
    const id = window.setInterval(() => {
      setSimState((p) => (p ? stepProbe(sim, p) : p));
    }, 600);
    return () => window.clearInterval(id);
  }, [playing, sim]);

  // ── build the schematic ──────────────────────────────────────────────
  useEffect(() => {
    const seq = ++runSeq.current;
    let cancelled = false;

    (async () => {
      try {
        let json = activeJson;
        if (!json) {
          if (!code?.trim()) { setState({ k: 'idle' }); return; }
          setState({ k: 'busy', note: 'Synthesizing…' });
          const r = await synthesize(code, undefined, { flatten: !!flatten });
          if (cancelled || runSeq.current !== seq) return;
          onDiagRef.current?.(r.diagnostics);
          if (!r.ok) { setState({ k: 'error', message: r.error }); return; }
          json = r.json;
        }
        setState({ k: 'busy', note: 'Laying out…' });
        const parsed = JSON.parse(json) as unknown;
        const result = await yosysToSvg(parsed);
        if (cancelled || runSeq.current !== seq) return;
        setState({ k: 'ready', result, json });
      } catch (e) {
        if (cancelled || runSeq.current !== seq) return;
        if (e instanceof UnsupportedCellError) {
          setState({ k: 'error', message: e.message, cellTypes: e.cellTypes });
        } else {
          setState({ k: 'error', message: e instanceof Error ? e.message : String(e) });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [code, activeJson, flatten]);

  // ── inject the SVG once per result ───────────────────────────────────
  // Parsed into a detached document and adopted, rather than assigned through
  // innerHTML: an SVG string set via innerHTML on an HTML element is parsed with
  // HTML rules, which lower-cases attributes like viewBox and silently breaks
  // scaling.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren();
    overlayRef.current = null;
    svgRef.current = null;
    baseRef.current = null;
    setView(null);
    if (state.k !== 'ready') return;

    const doc = new DOMParser().parseFromString(state.result.svg, 'image/svg+xml');
    const parseError = doc.getElementsByTagName('parsererror')[0];
    if (parseError) return;
    const svg = document.importNode(doc.documentElement, true) as unknown as SVGSVGElement;

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.add('vj-schematic');

    // Bus ticks and the value overlay are ours, appended after netlistsvg's
    // nodes so a re-render never has to disentangle them.
    const ticks = new DOMParser()
      .parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${busTickLayer(state.result.netIndex)}</svg>`, 'image/svg+xml');
    const tickG = ticks.documentElement.firstChild;
    if (tickG) svg.appendChild(document.importNode(tickG, true));

    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    overlay.setAttribute('class', 'value-overlay');
    svg.appendChild(overlay);

    host.appendChild(svg);
    svgRef.current = svg;
    overlayRef.current = overlay;

    // The fit view is measured from the rendered ink, not from netlistsvg's
    // declared size: ELK pads its canvas generously, and fitting to the padding
    // leaves the diagram floating in the middle of an empty field.
    const base = contentBox(svg, state.result.width, state.result.height);
    baseRef.current = base;
    setView(base);
  }, [state]);

  // Push the current view onto the live node. React does not own this attribute
  // (the SVG is imperative), so it is written here rather than rendered.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !view) return;
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
  }, [view]);

  // ── click -> cross-probe selection ───────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || state.k !== 'ready') return;
    const onClick = (ev: Event) => {
      if (drag.current?.moved) return;
      const el = (ev.target as Element | null)?.closest?.('[data-net-id],[data-cell-id]');
      if (!el) return;
      const netId = el.getAttribute('data-net-id') ?? undefined;
      const cellId = el.getAttribute('data-cell-id') ?? undefined;
      const holder = el.closest('[data-src-file]');
      setProbe({
        netId,
        netName: netId ? state.result.netIndex.get(netId)?.name : undefined,
        cellId,
        srcFile: holder?.getAttribute('data-src-file') ?? undefined,
        srcLine: Number(holder?.getAttribute('data-src-line')) || undefined,
        origin: 'schematic',
      });
    };
    svg.addEventListener('click', onClick);
    return () => svg.removeEventListener('click', onClick);
  }, [state]);

  // ── double click -> inspect ──────────────────────────────────────────
  // A cell wins over a wire when both are under the cursor: the wire is the
  // larger hit area, but the symbol is what the user aimed at.
  const inspectAt = useCallback((target: Element | null) => {
    if (!netlist) return;
    const cellEl = target?.closest?.('[data-cell-id]');
    if (cellEl) {
      const d = inspectCell(netlist, cellEl.getAttribute('data-cell-id') ?? '');
      if (d) { setDetail(d); return; }
    }
    const netEl = target?.closest?.('[data-net-id]');
    if (netEl) {
      const d = inspectNet(netlist, netEl.getAttribute('data-net-id') ?? '');
      if (d) setDetail(d);
    }
  }, [netlist]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onDbl = (ev: Event) => {
      ev.preventDefault();
      inspectAt(ev.target as Element | null);
    };
    svg.addEventListener('dblclick', onDbl);
    return () => svg.removeEventListener('dblclick', onDbl);
  }, [inspectAt, state]);

  // ── reflect the shared selection as a CSS class, never a re-render ────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    for (const el of Array.from(svg.querySelectorAll('[data-selected="true"]'))) {
      el.removeAttribute('data-selected');
    }
    if (state.k !== 'ready') return;

    const mark = (sel: string) => {
      for (const el of Array.from(svg.querySelectorAll(sel))) el.setAttribute('data-selected', 'true');
    };
    if (probe.netId) mark(`[data-net-id="${cssEscape(probe.netId)}"]`);
    if (probe.cellId) mark(`[data-cell-id="${cssEscape(probe.cellId)}"]`);
    // Editor cursor: light up every cell Yosys attributed to that line.
    if (probe.origin === 'editor' && probe.srcFile && probe.srcLine) {
      const ids = state.result.srcIndex.get(`${probe.srcFile}:${probe.srcLine}`) ?? [];
      for (const id of ids) mark(`[data-cell-id="${cssEscape(id)}"]`);
    }
    // Waveform row: resolve the signal name to a net.
    if (probe.origin === 'waveform' && probe.netName) {
      const netId = state.result.nameIndex.get(probe.netName);
      if (netId) mark(`[data-net-id="${cssEscape(netId)}"]`);
    }
  }, [probe, state]);

  // The inspected thing is marked too, with its own class — selection and
  // inspection are different questions ("what am I tracking" vs "what am I
  // reading about") and collapsing them makes the diagram lie about one of them.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    for (const el of Array.from(svg.querySelectorAll('[data-inspected="true"]'))) {
      el.removeAttribute('data-inspected');
    }
    if (!detail) return;
    const sel = detail.kind === 'cell'
      ? `[data-cell-id="${cssEscape(detail.id)}"]`
      : `[data-net-id="${cssEscape(detail.id)}"]`;
    for (const el of Array.from(svg.querySelectorAll(sel))) {
      el.setAttribute('data-inspected', 'true');
    }
  }, [detail, state]);

  // ── paint live values onto the diagram ───────────────────────────────
  //
  // Written straight onto the existing DOM nodes rather than re-rendered: the
  // SVG is injected imperatively, and re-parsing it on every value change would
  // throw away pan/zoom and make stepping feel like a page reload. Each wire
  // carries `data-val` (0/1/x) and `data-changed`; colour and the flow animation
  // are CSS reacting to those, so a step costs one attribute write per wire.
  useEffect(() => {
    const svg = svgRef.current;
    const overlay = overlayRef.current;
    if (!svg || !overlay || state.k !== 'ready' || !nets) return;

    const prev = prevVals.current;
    const next = new Map<string, string>();

    for (const [netId, v] of nets) {
      const text = valueLabel(v);
      next.set(netId, text);
      const changed = prev.size > 0 && prev.get(netId) !== text;
      for (const el of Array.from(svg.querySelectorAll(`[data-net-id="${cssEscape(netId)}"]`))) {
        el.setAttribute('data-val', stateOf(v));
        // The pulse is what makes causality visible: after a clock edge, the
        // wires that actually moved light up, rather than everything looking
        // equally alive.
        if (changed) el.setAttribute('data-changed', 'true');
        else el.removeAttribute('data-changed');
      }
    }

    // Value labels. Rebuilt wholesale — a few dozen <text> nodes is cheaper than
    // diffing, and keeps the overlay a pure function of the current values.
    overlay.replaceChildren();
    for (const net of state.result.netIndex.values()) {
      const v = nets.get(net.id);
      if (!v) continue;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(net.x));
      text.setAttribute('y', String(net.y - 3));
      text.setAttribute('class', 'value-label');
      text.setAttribute('data-net-id', net.id);
      text.setAttribute('data-val', stateOf(v));
      if (prev.size > 0 && prev.get(net.id) !== next.get(net.id)) {
        text.setAttribute('data-changed', 'true');
      }
      text.textContent = valueLabel(v);
      overlay.appendChild(text);
    }

    prevVals.current = next;
    // No timer clears the marks: they persist until the NEXT value change, which
    // both reads as "what moved last" while the circuit is paused and avoids a
    // race between the clearing timeout and this effect re-running. Each update
    // removes the previous marks above, so the highlight is always exactly one
    // change old.
  }, [state, nets]);

  // An externally supplied cursor (if any) seeds the probe once. After that the
  // user owns the state — re-applying it on every render would fight the
  // interactive controls.
  useEffect(() => {
    if (!sim || !trace || cursor == null) return;
    setSimState(replayTo(sim, trace, cursor));
    // `sim` alone, deliberately: `trace` and `cursor` are read, not depended on.
    // Re-running when the cursor moves would drag the probe back to the
    // waveform's position every time the user drove an input themselves.
  }, [sim]);

  const scrubTo = useCallback((cycle: number) => {
    if (!sim || !trace) return;
    setPlaying(false);
    setSimState(replayTo(sim, trace, cycle));
  }, [sim, trace]);

  // ── pan / zoom ───────────────────────────────────────────────────────

  /**
   * Scale by `k`, keeping the diagram point under `client` pinned to the cursor.
   *
   * Everything — including the client -> diagram mapping — happens INSIDE the
   * updater, against the freshest view. A wheel gesture fires several events per
   * frame, and resolving the anchor from a rendered-but-stale `view` would make
   * each of them aim at a slightly wrong point, so a fast scroll would visibly
   * crawl away from the cursor.
   */
  const zoomBy = useCallback((k: number, client?: { x: number; y: number }) => {
    setView((v) => {
      const base = baseRef.current;
      const svg = svgRef.current;
      if (!v || !base) return v;

      const minW = base.w / MAX_ZOOM;
      const maxW = base.w / MIN_ZOOM;
      const w = Math.min(maxW, Math.max(minW, v.w / k));
      const f = w / v.w;
      if (f === 1) return v;

      let p = { x: v.x + v.w / 2, y: v.y + v.h / 2 };
      const r = svg?.getBoundingClientRect();
      if (client && r?.width && r.height) {
        // `xMidYMid meet` scales uniformly and centres the leftover space, so
        // the mapping has to undo both — using the raw width ratio puts the
        // anchor in the wrong place on any panel that is not the diagram's
        // aspect ratio.
        const s = Math.min(r.width / v.w, r.height / v.h);
        p = {
          x: v.x + (client.x - r.left - (r.width - v.w * s) / 2) / s,
          y: v.y + (client.y - r.top - (r.height - v.h * s) / 2) / s,
        };
      }
      return { x: p.x - (p.x - v.x) * f, y: p.y - (p.y - v.y) * f, w, h: v.h * f };
    });
  }, []);

  // React attaches `wheel` at the root as a PASSIVE listener, so a synthetic
  // onWheel handler cannot call preventDefault — the browser scrolls the panel
  // out from under the diagram while zooming it. A native non-passive listener
  // is the only way to own the gesture.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!baseRef.current) return;
      e.preventDefault();
      // Trackpads report tiny deltas and mice report ~100 per notch; scaling by
      // magnitude keeps both feeling like the same gesture.
      const k = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.002));
      zoomBy(Math.min(3, Math.max(1 / 3, k)), { x: e.clientX, y: e.clientY });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  const onDown = (e: React.PointerEvent) => {
    // Primary button only: a right-click is a context menu, and a middle-click
    // is the browser's autoscroll.
    if (e.button !== 0 || !view) return;
    drag.current = { sx: e.clientX, sy: e.clientY, view, moved: false };
    setDragging(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const r = svg.getBoundingClientRect();
    const s = Math.min(r.width / d.view.w, r.height / d.view.h) || 1;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    // Anchored to the view the drag STARTED from, so the diagram tracks the
    // cursor exactly instead of accumulating rounding drift over a long drag.
    setView({ x: d.view.x - dx / s, y: d.view.y - dy / s, w: d.view.w, h: d.view.h });
  };
  const onUp = () => {
    if (!drag.current) return;
    setDragging(false);
    // Cleared a tick late so the click that ends a drag can still see `moved`
    // and decline to change the cross-probe selection.
    setTimeout(() => { drag.current = null; }, 0);
  };

  const fit = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || state.k !== 'ready') return;
    const base = contentBox(svg, state.result.width, state.result.height);
    baseRef.current = base;
    setView(base);
  }, [state]);

  // ── full screen ──────────────────────────────────────────────────────
  //
  // Docked into a split pane, the schematic gets a few hundred pixels — enough
  // to see that a circuit exists, not enough to read one. Expanding hands the
  // whole screen to the diagram, which is where zooming and double-clicking
  // become worth doing.
  //
  // Deliberately NOT a portal to <body>. The colours are design tokens declared
  // on the page's `.vj-scope` ancestor, and custom properties inherit through
  // the DOM tree, not through a portal's React tree — a portalled panel would
  // render with every token unresolved. The native Fullscreen API promotes the
  // element WHERE IT STANDS, so inheritance, the injected SVG and every live
  // listener survive untouched.
  const toggleExpand = useCallback(() => {
    const el = rootRef.current;
    setExpanded((was) => {
      if (was) {
        if (document.fullscreenElement === el) void document.exitFullscreen?.();
        return false;
      }
      // The CSS overlay below is the real mechanism and always applies; the
      // fullscreen request is an enhancement that also hides the browser chrome.
      // Rejected requests (an iframe without allowfullscreen, a policy block)
      // are ignored rather than surfaced — the panel still fills the window.
      // Every link optional: older Safari has no `requestFullscreen` at all, and
      // calling `.catch` on the undefined it would return is its own crash.
      void el?.requestFullscreen?.()?.catch(() => { /* CSS overlay is enough */ });
      return true;
    });
  }, []);

  // Entering or leaving changes the viewport the diagram is letterboxed into.
  // The fit view is content-derived, so it stays valid — but a user who was
  // zoomed into a corner asked to see the WHOLE thing, so re-fit on the way in.
  useEffect(() => {
    if (!expanded) return;
    const id = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(id);
  }, [expanded, fit]);

  // Esc and F11 exit fullscreen through the browser, not through us. Without
  // this the button would still claim to be expanded after the user left.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Escape backs out one level of attention at a time: the inspector first,
  // then the drill-down, then full screen. Closing all three at once loses the
  // user's place.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (detail) setDetail(null);
      else if (drill.length) setDrill((d) => d.slice(0, -1));
      else if (expanded) toggleExpand();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail, drill.length]);

  // ── export ───────────────────────────────────────────────────────────
  //
  // Exports show the WHOLE diagram at its natural size, never the current
  // viewport: a saved schematic that reproduced someone's accidental zoom would
  // be useless as a document.
  const exportClone = useCallback((): SVGSVGElement | null => {
    const svg = svgRef.current;
    if (!svg || state.k !== 'ready') return null;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const box = baseRef.current ?? { x: 0, y: 0, w: state.result.width, h: state.result.height };
    clone.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`);
    clone.setAttribute('width', String(Math.round(box.w)));
    clone.setAttribute('height', String(Math.round(box.h)));
    // The interaction CSS lives in a page-level <style>, which a saved file has
    // no access to. Without it the export loses every value colour and the whole
    // value overlay reads as plain grey text.
    const style = clone.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = schematicCss(false);
    clone.insertBefore(style, clone.firstChild);
    inlineTokens(clone, svg);
    return clone;
  }, [state]);

  const exportSvg = useCallback(() => {
    const clone = exportClone();
    if (!clone) return;
    download(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }), 'schematic.svg');
  }, [exportClone]);

  const exportPng = useCallback(async () => {
    const clone = exportClone();
    if (!clone || state.k !== 'ready') return;
    const width = Number(clone.getAttribute('width')) || state.result.width;
    const height = Number(clone.getAttribute('height')) || state.result.height;
    const str = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([str], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error('Could not rasterize the schematic.'));
        img.src = url;
      });
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = isLight ? '#ffffff' : '#0b1120';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.drawImage(img, 0, 0);
      await new Promise<void>((res) => canvas.toBlob((b) => {
        if (b) download(b, 'schematic.png');
        res();
      }, 'image/png'));
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [exportClone, state, isLight]);

  const openSubmodule = useCallback((name: string) => {
    if (!netlist) return;
    const json = submoduleNetlist(netlist, name);
    if (!json) return;
    setDetail(null);
    setDrill((d) => [...d, { name, json }]);
  }, [netlist]);

  const ctrlBtn = 'grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-white/5 disabled:opacity-35 disabled:hover:bg-transparent';
  const cellCount = state.k === 'ready' ? state.result.cellIndex.size : 0;
  const zoomPct = view && baseRef.current ? Math.round((baseRef.current.w / view.w) * 100) : 100;

  return (
    <div
      ref={rootRef}
      className={expanded
        // `fixed inset-0` is what actually fills the window; the fullscreen
        // request on top of it only removes the browser's own chrome. Keeping
        // the CSS as the primary mechanism means a blocked request degrades to
        // a full-window panel rather than to nothing happening.
        ? 'fixed inset-0 z-50 flex flex-col'
        : 'relative flex h-full flex-col'}
      style={{ background: 'var(--vj-surface-0)' }}
    >
      <SchematicStyles flow={flow} />

      <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5"
           style={{ borderColor: 'var(--vj-border)' }}>
        {headerExtra}
        {state.k === 'ready' && (
          <span className="font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
            {cellCount} cells · {state.result.netIndex.size} nets
          </span>
        )}
        {state.k === 'ready' && (
          <span className="hidden font-mono text-[10px] sm:inline" style={{ color: 'var(--vj-text-dim)', opacity: 0.7 }}>
            · drag to pan · scroll to zoom · double-click for details
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 w-10 text-right font-mono text-[10px] tabular-nums"
                style={{ color: 'var(--vj-text-dim)' }}>{zoomPct}%</span>
          <button onClick={() => zoomBy(1.25)} title="Zoom in" disabled={!view}
                  className={ctrlBtn} style={{ color: 'var(--vj-text-dim)' }}><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => zoomBy(1 / 1.25)} title="Zoom out" disabled={!view}
                  className={ctrlBtn} style={{ color: 'var(--vj-text-dim)' }}><ZoomOut className="h-4 w-4" /></button>
          <button onClick={fit} title="Fit the whole circuit in the panel" disabled={state.k !== 'ready'}
                  className={ctrlBtn} style={{ color: 'var(--vj-text-dim)' }}><Scan className="h-4 w-4" /></button>
          <button onClick={toggleExpand} disabled={state.k !== 'ready'} className={ctrlBtn}
                  title={expanded ? 'Exit full screen (Esc)' : 'Full screen — fills the window, fitted'}
                  style={{ color: expanded ? 'var(--vj-wave)' : 'var(--vj-text-dim)' }}>
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button onClick={exportSvg} title="Export SVG" disabled={state.k !== 'ready'}
                  className={ctrlBtn} style={{ color: 'var(--vj-text-dim)' }}><Download className="h-4 w-4" /></button>
          <button onClick={exportPng} title="Export PNG" disabled={state.k !== 'ready'}
                  className={ctrlBtn} style={{ color: 'var(--vj-text-dim)' }}><ImageIcon className="h-4 w-4" /></button>
        </div>
      </div>

      {drill.length > 0 && (
        <Breadcrumb names={drill.map((d) => d.name)} onUpTo={(i) => setDrill((d) => d.slice(0, i))} />
      )}

      {state.k === 'ready' && sim && simState && (
        <DriveBar
          sim={sim}
          probe={simState}
          playing={playing}
          onDrive={(name, v) => setSimState((p) => {
            if (!p) return p;
            const d = new Map(p.drive);
            d.set(name, v);
            return { ...p, drive: d };
          })}
          onStep={() => setSimState((p) => (p ? stepProbe(sim, p) : p))}
          onReset={() => { setPlaying(false); setSimState((p) => (p ? resetState(sim, p) : p)); }}
          onPlay={() => setPlaying((v) => !v)}
          flow={flow}
          onFlow={() => setFlow((v) => !v)}
          traceCycles={trace?.cycles ?? 0}
          onScrub={scrubTo}
        />
      )}

      <div className="relative min-h-0 flex-1">
        <div
          ref={wrapRef}
          className="absolute inset-0 select-none overflow-hidden touch-none"
          onPointerDown={onDown} onPointerMove={onMove}
          onPointerUp={onUp} onPointerCancel={onUp}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          {state.k === 'busy' && (
            <Centered>
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--vj-wave)' }} />
              <span>{state.note}</span>
            </Centered>
          )}

          {state.k === 'idle' && <Centered><span>Run to see the synthesized circuit.</span></Centered>}

          {state.k === 'error' && (
            <div className="flex h-full items-start justify-center overflow-auto p-6">
              <div className="flex max-w-md items-start gap-2 rounded-lg border p-3 text-[12px]"
                   style={{ borderColor: 'var(--vj-fail)', background: 'var(--vj-fail-bg)', color: 'var(--vj-fail)' }}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="whitespace-pre-wrap">{state.message}</p>
                  {state.cellTypes && (
                    <p className="mt-1.5 font-mono text-[11px]">{state.cellTypes.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            ref={hostRef}
            className="h-full w-full"
            style={{ display: state.k === 'ready' ? 'block' : 'none' }}
          />
        </div>

        {/* Outside the pan surface on purpose: a pointerdown inside the panel
            must scroll and select text, not drag the diagram behind it. */}
        {detail && (
          <Inspector
            detail={detail}
            nets={nets}
            sources={sources}
            onClose={() => setDetail(null)}
            onOpenSubmodule={openSubmodule}
            onInspectCell={(id) => { const d = netlist && inspectCell(netlist, id); if (d) setDetail(d); }}
            onInspectNet={(id) => { const d = netlist && inspectNet(netlist, id); if (d) setDetail(d); }}
          />
        )}
      </div>
    </div>
  );
};

// ── helpers ─────────────────────────────────────────────────────────────────

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-[13px]"
       style={{ color: 'var(--vj-text-dim)' }}>{children}</div>
);

/**
 * The tightest box containing the drawing, padded.
 *
 * `getBBox` is unavailable in jsdom and can throw on a node that is not yet laid
 * out, so netlistsvg's declared size is the fallback — correct, just looser.
 */
function contentBox(svg: SVGSVGElement, w: number, h: number): View {
  try {
    const b = svg.getBBox?.();
    if (b && b.width > 0 && b.height > 0) {
      return { x: b.x - FIT_PAD, y: b.y - FIT_PAD, w: b.width + FIT_PAD * 2, h: b.height + FIT_PAD * 2 };
    }
  } catch { /* not laid out yet */ }
  return { x: 0, y: 0, w: w || 800, h: h || 600 };
}

/** Where the user is inside the hierarchy, and the way back out. */
const Breadcrumb: React.FC<{ names: string[]; onUpTo: (depth: number) => void }> = ({ names, onUpTo }) => (
  <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b px-2 py-1 font-mono text-[10px]"
       style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)', color: 'var(--vj-text-dim)' }}>
    <button onClick={() => onUpTo(0)} className="rounded px-1 hover:underline">top</button>
    {names.map((n, i) => (
      <React.Fragment key={`${n}-${i}`}>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <button onClick={() => onUpTo(i + 1)} className="rounded px-1 hover:underline"
                style={{ color: i === names.length - 1 ? 'var(--vj-wave)' : undefined }}>{n}</button>
      </React.Fragment>
    ))}
  </div>
);

// ── inspector ───────────────────────────────────────────────────────────────

/**
 * What you get for double-clicking something.
 *
 * The panel answers in the order the questions actually arrive: what is this,
 * what is it doing RIGHT NOW (live port values, and the truth-table row the
 * circuit is currently sitting on), what does it do in general, and finally
 * which line of Verilog produced it.
 */
const Inspector: React.FC<{
  detail: Detail;
  nets: Map<string, NetValue> | null;
  sources?: SchematicSource[];
  onClose: () => void;
  onOpenSubmodule: (name: string) => void;
  onInspectCell: (id: string) => void;
  onInspectNet: (id: string) => void;
}> = ({ detail, nets, sources, onClose, onOpenSubmodule, onInspectCell, onInspectNet }) => (
  <aside
    className="absolute inset-y-0 right-0 z-20 flex w-[19rem] max-w-[85%] flex-col border-l shadow-2xl"
    style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}
  >
    <header className="flex shrink-0 items-start gap-2 border-b px-3 py-2"
            style={{ borderColor: 'var(--vj-border)' }}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-bold" style={{ color: 'var(--vj-text)' }}>
          {detail.kind === 'cell' ? detail.title : (detail.name ?? 'wire')}
        </p>
        <p className="truncate font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
          {detail.kind === 'cell' ? detail.type : `${detail.width}-bit net · ${detail.id}`}
        </p>
      </div>
      <button onClick={onClose} title="Close (Esc)"
              className="grid h-6 w-6 shrink-0 place-items-center rounded hover:bg-white/10"
              style={{ color: 'var(--vj-text-dim)' }}><X className="h-3.5 w-3.5" /></button>
    </header>

    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5 text-[11px]"
         style={{ color: 'var(--vj-text)' }}>
      {detail.kind === 'cell'
        ? <CellBody detail={detail} nets={nets} sources={sources}
                    onOpenSubmodule={onOpenSubmodule} onInspectNet={onInspectNet} />
        : <NetBody detail={detail} nets={nets} onInspectCell={onInspectCell} />}
    </div>
  </aside>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-3">
    <h4 className="mb-1 font-mono text-[9px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--vj-text-dim)' }}>{title}</h4>
    {children}
  </section>
);

const DIR_MARK: Record<string, string> = { input: '→', output: '←', inout: '↔' };

const CellBody: React.FC<{
  detail: CellDetail;
  nets: Map<string, NetValue> | null;
  sources?: SchematicSource[];
  onOpenSubmodule: (name: string) => void;
  onInspectNet: (id: string) => void;
}> = ({ detail, nets, sources, onOpenSubmodule, onInspectNet }) => {
  const [showModule, setShowModule] = useState(false);
  const valueOf = (netId?: string) => {
    const v = netId ? nets?.get(netId) : undefined;
    return v ? valueLabel(v) : '—';
  };

  // The row the circuit is standing on right now. Matching on the formatted
  // input strings is exact: both sides come from the same formatter, over the
  // same ports, in the same order.
  const liveRow = useMemo(() => {
    if (!detail.truth || !nets) return -1;
    const now = detail.truth.inputs.map((i) =>
      valueOf(detail.ports.find((p) => p.name === i.name)?.netId));
    if (now.some((v) => v === '—' || v === 'x')) return -1;
    return detail.truth.rows.findIndex((r) => r.in.every((v, i) => v === now[i]));
    // `valueOf` is a closure over `nets`, which is already a dependency.
  }, [detail, nets]);

  const src = detail.src;
  const source = src && sources?.find((s) => s.file === src.file);
  const mod = source ? moduleSourceAt(source.text, src!.line) : null;
  const snippet = source ? excerptAt(source.text, src!.line, 2) : null;

  return (
    <>
      <p className="mb-3 leading-relaxed" style={{ color: 'var(--vj-text-dim)' }}>{detail.blurb}</p>

      <Section title="identity">
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 font-mono text-[10px]">
          <dt style={{ color: 'var(--vj-text-dim)' }}>instance</dt>
          <dd className="truncate" title={detail.id}>{detail.id}</dd>
          {detail.total > 0 && (
            <>
              <dt style={{ color: 'var(--vj-text-dim)' }}>cell no.</dt>
              <dd>#{detail.index} of {detail.total}</dd>
            </>
          )}
          <dt style={{ color: 'var(--vj-text-dim)' }}>type</dt>
          <dd className="truncate">{detail.type}</dd>
        </dl>
      </Section>

      {detail.submodule && (
        <button
          onClick={() => onOpenSubmodule(detail.submodule!)}
          className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors"
          style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-wave)' }}
        >
          <CornerDownRight className="h-3.5 w-3.5" />
          Open <span className="font-mono">{detail.submodule}</span>
        </button>
      )}

      <Section title="ports">
        <table className="w-full font-mono text-[10px]">
          <tbody>
            {detail.ports.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="py-0.5 pr-1" style={{ color: 'var(--vj-text-dim)' }}>{DIR_MARK[p.dir]}</td>
                <td className="py-0.5 pr-2">
                  {p.netId
                    ? <button onClick={() => onInspectNet(p.netId!)} className="hover:underline">{p.name}</button>
                    : p.name}
                  {p.width > 1 && <span style={{ color: 'var(--vj-text-dim)' }}>[{p.width - 1}:0]</span>}
                </td>
                <td className="py-0.5 pr-2 truncate" style={{ color: 'var(--vj-text-dim)' }}
                    title={p.netName}>{p.netName ?? ''}</td>
                <td className="py-0.5 text-right font-bold" style={{ color: 'var(--vj-wave)' }}>
                  {valueOf(p.netId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {detail.truth && (
        <Section title={`truth table · ${detail.truth.rows.length} rows`}>
          <div className="max-h-56 overflow-auto rounded border"
               style={{ borderColor: 'var(--vj-border)' }}>
            <table className="w-full font-mono text-[10px]">
              <thead className="sticky top-0" style={{ background: 'var(--vj-surface-2)' }}>
                <tr>
                  {detail.truth.inputs.map((i) => (
                    <th key={i.name} className="px-1.5 py-1 text-left font-bold"
                        style={{ color: 'var(--vj-text-dim)' }}>{i.name}</th>
                  ))}
                  {detail.truth.outputs.map((o) => (
                    <th key={o.name} className="border-l px-1.5 py-1 text-left font-bold"
                        style={{ color: 'var(--vj-wave)', borderColor: 'var(--vj-border)' }}>{o.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.truth.rows.map((r, i) => (
                  <tr key={i} style={i === liveRow
                    ? { background: 'var(--vj-pass-bg)', color: 'var(--vj-pass)', fontWeight: 700 }
                    : undefined}>
                    {r.in.map((v, j) => <td key={j} className="px-1.5 py-0.5">{v}</td>)}
                    {r.out.map((v, j) => (
                      <td key={j} className="border-l px-1.5 py-0.5"
                          style={{ borderColor: 'var(--vj-border)' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {liveRow >= 0 && (
            <p className="mt-1 text-[10px]" style={{ color: 'var(--vj-pass)' }}>
              Highlighted: the row this cell is on right now.
            </p>
          )}
        </Section>
      )}

      {!detail.truth && detail.truthNote && (
        <Section title="behaviour">
          <p className="leading-relaxed" style={{ color: 'var(--vj-text-dim)' }}>{detail.truthNote}</p>
        </Section>
      )}

      {detail.params.length > 0 && (
        <Section title="parameters">
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[10px]">
            {detail.params.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="truncate" style={{ color: 'var(--vj-text-dim)' }}>{k}</dt>
                <dd className="truncate text-right" title={v}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </Section>
      )}

      {src && (
        <Section title="source">
          <p className="mb-1 font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
            {src.file}:{src.line}{mod && <> · module <span style={{ color: 'var(--vj-text)' }}>{mod.name}</span></>}
          </p>
          {snippet && (
            <CodeBlock startLine={snippet.startLine} lines={snippet.lines} mark={src.line} />
          )}
          {mod && (
            <>
              <button onClick={() => setShowModule((v) => !v)}
                      className="mt-1.5 flex items-center gap-1 text-[10px] font-bold hover:underline"
                      style={{ color: 'var(--vj-wave)' }}>
                <Code2 className="h-3 w-3" />
                {showModule ? 'Hide' : 'Show'} module {mod.name}
              </button>
              {showModule && (
                <div className="mt-1">
                  <CodeBlock startLine={mod.startLine} lines={mod.code.split('\n')} mark={src.line} />
                </div>
              )}
            </>
          )}
          {!source && (
            <p className="text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
              Source for {src.file} is not available here.
            </p>
          )}
        </Section>
      )}
    </>
  );
};

const NetBody: React.FC<{
  detail: NetDetail;
  nets: Map<string, NetValue> | null;
  onInspectCell: (id: string) => void;
}> = ({ detail, nets, onInspectCell }) => {
  const v = nets?.get(detail.id);
  return (
    <>
      <Section title="value">
        <p className="font-mono text-[18px] font-bold"
           style={{ color: v ? (v.anyX ? 'var(--vj-warn)' : v.anyHigh ? 'var(--vj-pass)' : 'var(--vj-text-dim)') : 'var(--vj-text-dim)' }}>
          {v ? valueLabel(v) : '—'}
        </p>
        <p className="mt-0.5 font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
          {detail.width} bit{detail.width === 1 ? '' : 's'} · bits {detail.bits.join(', ')}
        </p>
      </Section>

      {detail.topPort && (
        <Section title="module boundary">
          <p className="font-mono text-[10px]">
            {detail.topPort.dir} <span style={{ color: 'var(--vj-text)' }}>{detail.topPort.name}</span>
          </p>
        </Section>
      )}

      <Section title="driven by">
        {detail.driver
          ? <CellLink id={detail.driver.id} type={detail.driver.type} port={detail.driver.port} onClick={onInspectCell} />
          : <p style={{ color: 'var(--vj-text-dim)' }}>
              {detail.topPort?.dir === 'input' ? 'A module input — you drive it from the bar above.' : 'Nothing in this module drives it.'}
            </p>}
      </Section>

      <Section title={`read by · ${detail.loads.length}`}>
        {detail.loads.length
          ? <ul className="space-y-0.5">
              {detail.loads.map((l, i) => (
                <li key={`${l.id}-${l.port}-${i}`}>
                  <CellLink id={l.id} type={l.type} port={l.port} onClick={onInspectCell} />
                </li>
              ))}
            </ul>
          : <p style={{ color: 'var(--vj-text-dim)' }}>Nothing reads it — it only leaves the module.</p>}
      </Section>
    </>
  );
};

const CellLink: React.FC<{
  id: string; type: string; port: string; onClick: (id: string) => void;
}> = ({ id, type, port, onClick }) => (
  <button onClick={() => onClick(id)}
          className="flex w-full items-baseline gap-1.5 truncate text-left font-mono text-[10px] hover:underline">
    <span style={{ color: 'var(--vj-wave)' }}>{type}</span>
    <span style={{ color: 'var(--vj-text-dim)' }}>.{port}</span>
    <span className="truncate" style={{ color: 'var(--vj-text-dim)', opacity: 0.7 }}>{id}</span>
  </button>
);

const CodeBlock: React.FC<{ startLine: number; lines: string[]; mark?: number }> = ({
  startLine, lines, mark,
}) => (
  <pre className="max-h-56 overflow-auto rounded border p-1.5 font-mono text-[10px] leading-relaxed"
       style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-0)' }}>
    {lines.map((l, i) => {
      const n = startLine + i;
      return (
        <div key={n} style={n === mark
          ? { background: 'var(--vj-pass-bg)', color: 'var(--vj-text)' }
          : undefined}>
          <span className="mr-2 inline-block w-6 select-none text-right"
                style={{ color: 'var(--vj-text-dim)', opacity: 0.6 }}>{n}</span>
          <span style={{ color: 'var(--vj-text-code)' }}>{l || ' '}</span>
        </div>
      );
    })}
  </pre>
);

/**
 * The driving controls: set the inputs, advance the clock, watch what moves.
 *
 * Inputs come from the netlist rather than from the Verilog text, so what you
 * can drive is exactly what the synthesized circuit actually has — after
 * optimization, which sometimes removes a port the source declared.
 */
const DriveBar: React.FC<{
  sim: NetlistSim;
  probe: ProbeState;
  playing: boolean;
  flow: boolean;
  onDrive: (name: string, v: bigint) => void;
  onStep: () => void;
  onReset: () => void;
  onPlay: () => void;
  onFlow: () => void;
  /** Length of the recorded testbench run, 0 when there is none. */
  traceCycles: number;
  onScrub: (cycle: number) => void;
}> = ({ sim, probe, playing, flow, onDrive, onStep, onReset, onPlay, onFlow, traceCycles, onScrub }) => {
  // The clock is not a drivable net here: netlistSim models an edge by
  // recomputing register state, so "step" IS the clock. Showing a clk toggle
  // would imply a control that does nothing.
  const drivable = sim.inputs.filter((p) => !isClockName(p.name));
  const btn = 'flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold transition-colors';

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-2 py-1.5"
         style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
      {sim.hasClock && (
        <div className="flex items-center gap-1">
          <button onClick={onPlay} className={btn}
                  title={playing ? 'Pause the clock' : 'Free-run the clock'}
                  style={{ background: playing ? 'var(--vj-warn-bg)' : 'var(--vj-surface-3)',
                           color: playing ? 'var(--vj-warn)' : 'var(--vj-text)' }}>
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {playing ? 'Pause' : 'Run'}
          </button>
          <button onClick={onStep} className={btn} title="One clock edge"
                  style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text)' }}>
            <SkipForward className="h-3 w-3" /> Step
          </button>
          <button onClick={onReset} className={btn} title="Back to the initial state"
                  style={{ color: 'var(--vj-text-dim)' }}>
            <RotateCcw className="h-3 w-3" />
          </button>
          <span className="font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
            t={probe.cycle}
          </span>
        </div>
      )}

      <button onClick={onFlow} className={btn} title="Animate flow along active wires"
              style={{ color: flow ? 'var(--vj-wave)' : 'var(--vj-text-dim)' }}>
        <Zap className="h-3 w-3" /> Flow
      </button>

      {traceCycles > 1 && (
        // Replay the actual testbench run through the circuit. The trace only
        // stores top-level ports, so this re-drives the simulator cycle by cycle
        // to recover every INTERNAL wire — which is what makes the flow visible.
        <label className="flex items-center gap-1.5 font-mono text-[10px]"
               style={{ color: 'var(--vj-text-dim)' }} title="Replay the testbench run">
          bench
          <input type="range" min={0} max={traceCycles - 1} value={Math.min(probe.cycle, traceCycles - 1)}
                 onChange={(e) => onScrub(Number(e.target.value))}
                 className="h-1 w-28 cursor-pointer" />
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {drivable.map((p) => (
          <PortDrive key={p.name} name={p.name} width={p.width}
                     value={probe.drive.get(p.name) ?? 0n}
                     onChange={(v) => onDrive(p.name, clampToWidth(v, p.width))} />
        ))}
        {!drivable.length && (
          <span className="text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>
            No drivable inputs — this design is self-contained.
          </span>
        )}
      </div>
    </div>
  );
};

/** One input: a toggle for a single bit, a hex field for a bus. */
const PortDrive: React.FC<{
  name: string; width: number; value: bigint; onChange: (v: bigint) => void;
}> = ({ name, width, value, onChange }) => {
  const reset = isResetName(name);
  if (width === 1) {
    const on = value !== 0n;
    return (
      <button
        onClick={() => onChange(on ? 0n : 1n)}
        title={`${name} — click to toggle${reset ? ' (reset)' : ''}`}
        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold transition-colors"
        style={{
          background: on ? 'var(--vj-pass-bg)' : 'var(--vj-surface-3)',
          color: on ? 'var(--vj-pass)' : 'var(--vj-text-dim)',
          outline: reset ? '1px dashed var(--vj-border-strong)' : 'none',
        }}
      >
        {name}<span>{on ? '1' : '0'}</span>
      </button>
    );
  }
  return (
    <label className="flex items-center gap-1 font-mono text-[11px]"
           style={{ color: 'var(--vj-text-dim)' }}>
      {name}[{width - 1}:0]
      <input
        value={`0x${value.toString(16).toUpperCase()}`}
        onChange={(e) => {
          const t = e.target.value.trim().replace(/^0x/i, '');
          // Reject rather than guess: a half-typed value should not silently
          // become 0 and make the diagram jump.
          if (!/^[0-9a-fA-F]*$/.test(t)) return;
          onChange(t === '' ? 0n : BigInt(`0x${t}`));
        }}
        className="h-6 w-16 rounded border bg-transparent px-1 text-center outline-none"
        style={{ borderColor: 'var(--vj-border-strong)', color: 'var(--vj-text-code)' }}
      />
    </label>
  );
};

/** CSS.escape with a fallback — net ids contain commas, cell ids contain `$`. */
function cssEscape(s: string): string {
  const g = globalThis as { CSS?: { escape?: (v: string) => string } };
  return g.CSS?.escape ? g.CSS.escape(s) : s.replace(/["\\]/g, '\\$&');
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Copy the resolved values of the schematic's design tokens onto the clone as
 * literal colours. An exported file is viewed outside the app, where
 * `var(--vj-schem-ink)` resolves to nothing and the drawing disappears.
 */
function inlineTokens(clone: SVGSVGElement, live: SVGSVGElement): void {
  const cs = getComputedStyle(live);
  const vars = [
    '--vj-schem-ink', '--vj-schem-body', '--vj-schem-dim',
    '--vj-wave', '--vj-fail', '--vj-pass', '--vj-warn', '--vj-text-dim', '--vj-surface-0',
  ];
  const decls = vars
    .map((v) => `${v}: ${cs.getPropertyValue(v).trim() || fallbackFor(v)};`)
    .join(' ');
  const style = clone.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `svg { ${decls} }`;
  clone.insertBefore(style, clone.firstChild);
}

const fallbackFor = (v: string): string => ({
  '--vj-schem-ink': '#1f2937',
  '--vj-schem-body': '#ffffff',
  '--vj-schem-dim': '#6b7280',
  '--vj-wave': '#059669',
  '--vj-fail': '#e11d48',
  '--vj-pass': '#059669',
  '--vj-warn': '#d97706',
  '--vj-text-dim': '#6b7280',
  '--vj-surface-0': '#ffffff',
}[v] ?? '#1f2937');

/**
 * Styles for the injected markup. Scoped to `.vj-schematic` so they cannot
 * reach the rest of the app, and kept here rather than in the skin because they
 * describe INTERACTION (hover, selection, buses), which the skin — a static
 * symbol library — has no business knowing about.
 *
 * Built as a string rather than written inline so the EXPORT path can embed the
 * exact same rules: a saved file has no page stylesheet, and without these the
 * value overlay and every wire colour are lost.
 */
function schematicCss(flow: boolean): string {
  return `
    .vj-schematic { --vj-schem-ink: var(--vj-text); --vj-schem-body: var(--vj-surface-1); --vj-schem-dim: var(--vj-text-dim); }
    .vj-schematic [data-net-id] { cursor: pointer; transition: stroke 120ms linear; }
    .vj-schematic [data-cell-id] { cursor: pointer; }
    .vj-schematic [data-width]:not([data-width="1"]) { stroke-width: 2; }

    /* Value -> colour. A wire carrying 1 reads as live, 0 as idle, x as suspect.
       This is the whole point of the interactive mode: the picture changes
       because the circuit's state changed. */
    .vj-schematic line[data-val="high"], .vj-schematic path[data-val="high"] { stroke: var(--vj-pass); }
    .vj-schematic line[data-val="low"],  .vj-schematic path[data-val="low"]  { stroke: var(--vj-text-dim); opacity: 0.55; }
    .vj-schematic line[data-val="x"],    .vj-schematic path[data-val="x"]    { stroke: var(--vj-warn); stroke-dasharray: 3 2; }

    /* Flow: dashes travelling along the wires that are actually carrying a 1.
       ELK lays the graph out left-to-right, so a negative dashoffset reads as
       signal moving from inputs toward outputs. */
    ${flow ? `
    .vj-schematic line[data-val="high"] {
      stroke-dasharray: 6 4;
      animation: vj-flow 700ms linear infinite;
    }
    @keyframes vj-flow { to { stroke-dashoffset: -10; } }
    ` : ''}

    /* What moved on the most recent update. Persists until the next change, so
       a paused circuit still shows which wires the last edge actually affected. */
    .vj-schematic line[data-changed="true"] { stroke: var(--vj-wave); }
    .vj-schematic .value-overlay text[data-changed="true"] {
      fill: var(--vj-wave); font-weight: 800;
    }

    .vj-schematic [data-net-id]:hover { stroke: var(--vj-wave); stroke-width: 2.5; }
    .vj-schematic [data-selected="true"] { stroke: var(--vj-wave); stroke-width: 2.5; }

    /* Inspected: the thing the side panel is describing. Deliberately a
       different mark from selection — dashed and unfilled, so it reads as
       "under examination" rather than "currently active". */
    .vj-schematic [data-inspected="true"] .cellbody,
    .vj-schematic [data-inspected="true"] rect,
    .vj-schematic line[data-inspected="true"] {
      stroke: var(--vj-warn); stroke-width: 2.5;
    }
    .vj-schematic [data-inspected="true"] { filter: drop-shadow(0 0 4px var(--vj-warn)); }

    .vj-schematic .bus-ticks line { stroke: var(--vj-text-dim); stroke-width: 1.2; animation: none; }
    .vj-schematic .bus-ticks text { fill: var(--vj-text-dim); stroke: none; font-size: 7px; font-family: 'JetBrains Mono', monospace; }
    .vj-schematic .value-overlay text {
      stroke: none; font-size: 8px; font-weight: 700;
      font-family: 'JetBrains Mono', monospace; text-anchor: middle; pointer-events: none;
      paint-order: stroke; stroke: var(--vj-surface-0); stroke-width: 2.5px;
      fill: var(--vj-text-dim);
    }
    .vj-schematic .value-overlay text[data-val="high"] { fill: var(--vj-pass); }
    .vj-schematic .value-overlay text[data-val="x"] { fill: var(--vj-warn); }

    @media (prefers-reduced-motion: reduce) {
      .vj-schematic line[data-val="high"] { animation: none; }
    }
  `;
}

const SchematicStyles: React.FC<{ flow: boolean }> = ({ flow }) => (
  <style>{schematicCss(flow)}</style>
);

export default NetlistSchematicView;
