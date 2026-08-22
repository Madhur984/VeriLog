/**
 * Yosys JSON netlist -> laid-out, cross-probable SVG schematic.
 *
 * Layout is netlistsvg + elkjs; this module owns everything around them:
 *
 *   - it validates the netlist against the skin FIRST, so a cell type with no
 *     symbol is an error rather than a silent anonymous box (see cellSupport.ts);
 *   - it rewrites netlistsvg's output into something addressable. netlistsvg tags
 *     cells `id="cell_<yosys name>"` and wires `class="net_<bit>,<bit>…"`, which
 *     is enough to recover identity but is neither stable to query nor rich
 *     enough to cross-probe. We convert those into `data-cell-id`, `data-net-id`,
 *     `data-bits` and `data-src` attributes;
 *   - it returns geometry indices so the value overlay and cross-probe layers
 *     never have to re-parse SVG path data at runtime.
 *
 * Two deliberate constraints:
 *
 *   1. The SAME netlist the simulator consumed is rendered — no second synthesis
 *      pass. The caller passes the JSON it already has.
 *   2. Nothing here mutates netlistsvg's own DOM beyond adding attributes. The
 *      value overlay lives in its own <g>, appended by the view, so a re-render
 *      replaces the diagram without having to diff the overlay out of it.
 */
import {
  checkCellSupport, UnsupportedCellError, SYNTHETIC_TYPES,
} from './cellSupport';

/** Yosys `src` is `file.v:line.col-line.col` or a comma-separated list of them. */
export interface SrcLoc {
  file: string;
  line: number;
  col?: number;
  endLine?: number;
  endCol?: number;
  /** The raw attribute, kept so nothing is lost in normalisation. */
  raw: string;
}

export interface CellInfo {
  id: string;
  type: string;
  src?: SrcLoc;
  /** Bounding box in diagram coordinates, when the symbol was placed. */
  box?: { x: number; y: number; w: number; h: number };
}

export interface NetInfo {
  /** Stable id: the Yosys bit list, comma-joined — e.g. `9,10,11,12`. */
  id: string;
  bits: number[];
  /** Signal name from `netnames`, when the net corresponds to a declared wire. */
  name?: string;
  /** A point on the wire suitable for anchoring a value label. */
  x: number;
  y: number;
}

export interface SchematicResult {
  svg: string;
  cellIndex: Map<string, CellInfo>;
  netIndex: Map<string, NetInfo>;
  /** src -> cell ids, for editor-cursor -> schematic highlighting. */
  srcIndex: Map<string, string[]>;
  /** signal name -> net id, for waveform-row -> schematic highlighting. */
  nameIndex: Map<string, string>;
  width: number;
  height: number;
  /** Types drawn but not simulatable — shown, never given a value overlay. */
  undrivenBySim: string[];
}

/** `design.v:12.3-12.8` (Yosys may list several, comma separated). */
export function parseSrc(raw: unknown): SrcLoc | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const first = raw.split('|')[0].split(',')[0].trim();
  const m = /^(.*?):(\d+)(?:\.(\d+))?(?:-(\d+)(?:\.(\d+))?)?$/.exec(first);
  if (!m) return undefined;
  const n = (s: string | undefined) => (s === undefined ? undefined : parseInt(s, 10));
  return {
    file: m[1], line: parseInt(m[2], 10),
    col: n(m[3]), endLine: n(m[4]), endCol: n(m[5]),
    raw,
  };
}

/** Key used by the editor->schematic reverse index. */
export const srcKey = (file: string, line: number): string => `${file}:${line}`;

interface RawModule {
  cells?: Record<string, { type?: string; attributes?: Record<string, unknown> }>;
  netnames?: Record<string, { bits?: unknown[]; hide_name?: number }>;
  attributes?: Record<string, unknown>;
}

/** Pick the module Yosys marked as top, else the only/first one. */
function topModule(netlist: { modules?: Record<string, RawModule> }): [string, RawModule] | null {
  const mods = netlist.modules ?? {};
  const names = Object.keys(mods);
  if (!names.length) return null;
  const isTop = (m: RawModule) => {
    const t = m.attributes?.top;
    return t === 1 || t === '1' || (typeof t === 'string' && /1$/.test(t));
  };
  const name = names.find((n) => isTop(mods[n])) ?? names[0];
  return [name, mods[name]];
}

/**
 * netlistsvg is ~1.3 MB with elkjs bundled inside it. Import it only when a
 * schematic is actually requested, matching how the Yosys engine is deferred.
 */
type RenderFn = (skin: string, netlist: unknown, cb: (err: Error | null, svg: string) => void) => void;
let renderer: Promise<RenderFn> | null = null;
function loadRenderer(): Promise<RenderFn> {
  if (!renderer) {
    renderer = import('netlistsvg').then((m) => {
      const mod = m as unknown as { render?: RenderFn; default?: { render?: RenderFn } };
      const render = mod.render ?? mod.default?.render;
      if (!render) throw new Error('netlistsvg did not expose render()');
      return render;
    }).catch((e) => { renderer = null; throw e; });
  }
  return renderer;
}

/** The skin travels as a string so it can be inlined by the bundler. */
let skinText: Promise<string> | null = null;
function loadSkin(): Promise<string> {
  if (!skinText) {
    skinText = import('./judge.skin.svg?raw').then((m) => (m as { default: string }).default);
  }
  return skinText;
}

const promisify = (render: RenderFn, skin: string, netlist: unknown): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      render(skin, netlist, (err, svg) => (err ? reject(err) : resolve(svg)));
    } catch (e) { reject(e as Error); }
  });

/**
 * netlistsvg puts the cell's Yosys name straight into `id="cell_<name>"`, and
 * those names routinely contain `$`, `.` and `:` — legal in an id attribute but
 * hostile to CSS selectors. We read them as attribute values only, never via
 * querySelector on the id, and expose a clean `data-cell-id` for lookups.
 */
const CELL_ID_PREFIX = 'cell_';
const NET_CLASS = /(?:^|\s)net_([-\d,]+)(?:\s|$)/;

/**
 * `getElementsByTagName` rather than `querySelectorAll`: the same traversal has
 * to run in the browser and under the minimal XML DOM the tests use, and only
 * this API exists in both.
 */
function tags(root: Element, name: string): Element[] {
  return Array.from(root.getElementsByTagName(name)) as Element[];
}

/** Midpoint of the longest segment — the most legible spot for a value label. */
function anchorFor(lines: { x1: number; y1: number; x2: number; y2: number }[]): { x: number; y: number } {
  let best = lines[0];
  let bestLen = -1;
  for (const l of lines) {
    const len = Math.abs(l.x2 - l.x1) + Math.abs(l.y2 - l.y1);
    if (len > bestLen) { bestLen = len; best = l; }
  }
  return { x: (best.x1 + best.x2) / 2, y: (best.y1 + best.y2) / 2 };
}

export interface RenderOptions {
  /**
   * Throw when a built-in cell has no symbol. Default true — the point of the
   * check is to be loud. Set false only to render a best-effort diagram anyway.
   */
  strict?: boolean;
  /** Injectable for tests; defaults to the lazily imported netlistsvg. */
  render?: RenderFn;
  /** Injectable for tests running without Vite's `?raw` loader. */
  skin?: string;
  /** Injectable for Node, where there is no DOMParser. */
  parseXml?: (svg: string) => Document;
}

/**
 * Render one synthesized module to a cross-probable SVG.
 *
 * @param netlist the parsed Yosys `write_json` output — the same object the
 *        simulator was built from, not a fresh synthesis.
 */
export async function yosysToSvg(
  netlist: unknown,
  opts: RenderOptions = {},
): Promise<SchematicResult> {
  const skin = opts.skin ?? await loadSkin();

  const report = checkCellSupport(netlist, skin);
  if (report.unsupported.length && opts.strict !== false) {
    throw new UnsupportedCellError(report.unsupported);
  }

  const render = opts.render ?? await loadRenderer();
  const rawSvg = await promisify(render, skin, netlist);

  const parse = opts.parseXml
    ?? ((s: string) => new DOMParser().parseFromString(s, 'image/svg+xml'));
  const doc = parse(rawSvg);
  const root = doc.documentElement;

  const top = topModule(netlist as { modules?: Record<string, RawModule> });
  const cells = top?.[1].cells ?? {};

  // Signal name per net id, so a waveform row can find its wire.
  const nameIndex = new Map<string, string>();
  for (const [name, net] of Object.entries(top?.[1].netnames ?? {})) {
    if (net.hide_name === 1) continue;
    const bits = (net.bits ?? []).filter((b): b is number => typeof b === 'number');
    if (bits.length) nameIndex.set(bits.join(','), name);
  }

  // ── cells: data-cell-id / data-type / data-src ─────────────────────────
  const cellIndex = new Map<string, CellInfo>();
  const srcIndex = new Map<string, string[]>();
  const synthetic = new Set(SYNTHETIC_TYPES);

  for (const g of tags(root, 'g')) {
    const id = g.getAttribute('id') ?? '';
    if (!id.startsWith(CELL_ID_PREFIX)) continue;
    const cellId = id.slice(CELL_ID_PREFIX.length);
    const raw = cells[cellId];
    // Module ports and constants are netlistsvg's own pseudo-cells; tag them so
    // they are clickable, but they have no Yosys cell behind them.
    const type = raw?.type ?? g.getAttribute('s:type') ?? '';

    g.setAttribute('data-cell-id', cellId);
    if (type) g.setAttribute('data-type', type);

    const src = parseSrc(raw?.attributes?.src);
    if (src) {
      g.setAttribute('data-src', src.raw);
      g.setAttribute('data-src-file', src.file);
      g.setAttribute('data-src-line', String(src.line));
      const key = srcKey(src.file, src.line);
      const list = srcIndex.get(key) ?? [];
      list.push(cellId);
      srcIndex.set(key, list);
    }

    // Only real Yosys cells are indexed. Module ports, constants and split/join
    // are netlistsvg's own scaffolding: still tagged above so they are clickable,
    // but they have no cell behind them and must not appear in the cell census.
    // Membership in the netlist's `cells` map is the exact test — `s:type` here
    // is the SYMBOL name (`inputExt`), not the alias (`$_inputExt_`).
    if (raw && !synthetic.has(type)) {
      cellIndex.set(cellId, { id: cellId, type, src, box: boxOf(g) });
    }
  }

  // ── wires: data-net-id / data-bits / data-width ────────────────────────
  // netlistsvg emits one <line> per orthogonal segment, all sharing the net's
  // class. Group them so each net gets a single anchor point rather than one
  // label per segment.
  const segments = new Map<string, { x1: number; y1: number; x2: number; y2: number }[]>();
  const wireEls: { el: Element; netId: string }[] = [];
  for (const el of [...tags(root, 'line'), ...tags(root, 'path')]) {
    const cls = el.getAttribute('class') ?? '';
    const m = NET_CLASS.exec(cls);
    if (!m) continue;
    const netId = m[1];
    el.setAttribute('data-net-id', netId);
    const name = nameIndex.get(netId);
    if (name) el.setAttribute('data-net-name', name);
    wireEls.push({ el, netId });

    if (el.tagName.toLowerCase() === 'line') {
      const num = (a: string) => Number(el.getAttribute(a) ?? 0);
      const seg = { x1: num('x1'), y1: num('y1'), x2: num('x2'), y2: num('y2') };
      const list = segments.get(netId) ?? [];
      list.push(seg);
      segments.set(netId, list);
    }
  }

  const netIndex = new Map<string, NetInfo>();
  for (const [netId, segs] of segments) {
    const bits = netId.split(',').map(Number).filter((n) => Number.isFinite(n));
    const { x, y } = anchorFor(segs);
    netIndex.set(netId, { id: netId, bits, name: nameIndex.get(netId), x, y });
  }
  // Record the bus width on every segment so CSS can thicken buses without JS.
  for (const { el, netId } of wireEls) {
    const info = netIndex.get(netId);
    if (info) el.setAttribute('data-width', String(info.bits.length));
  }

  const width = Number(root.getAttribute('width') ?? 0);
  const height = Number(root.getAttribute('height') ?? 0);
  // A viewBox is what makes zoom-to-fit possible; netlistsvg does not emit one.
  if (!root.getAttribute('viewBox') && width && height) {
    root.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  return {
    svg: serialize(doc, root),
    cellIndex,
    netIndex,
    srcIndex,
    nameIndex,
    width,
    height,
    undrivenBySim: report.undrivenBySim,
  };
}

function boxOf(g: Element): CellInfo['box'] {
  const t = g.getAttribute('transform') ?? '';
  const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)/.exec(t);
  if (!m) return undefined;
  return {
    x: Number(m[1]),
    y: Number(m[2]),
    w: Number(g.getAttribute('s:width') ?? 0),
    h: Number(g.getAttribute('s:height') ?? 0),
  };
}

function serialize(doc: Document, root: Element): string {
  const S = (globalThis as { XMLSerializer?: new () => { serializeToString(n: Node): string } }).XMLSerializer;
  if (S) return new S().serializeToString(root);
  // xmldom (Node/test path) exposes the same API from the document's own impl.
  const alt = (doc as unknown as { toString?: () => string });
  return alt.toString ? alt.toString() : '';
}

/**
 * Bus tick marks (`/N`) cannot live in the skin: a port stub's width depends on
 * the netlist, not the symbol, so the skin has no way to know. We draw them from
 * the geometry index instead, matching WaveformViewer's bus language.
 *
 * Returns SVG markup for a <g> the view appends after netlistsvg's output.
 */
export function busTickLayer(netIndex: Map<string, NetInfo>): string {
  const ticks: string[] = [];
  for (const net of netIndex.values()) {
    if (net.bits.length < 2) continue;
    const { x, y } = net;
    ticks.push(
      `<g class="bus-tick" data-net-id="${net.id}">`
      + `<line x1="${x - 4}" y1="${y + 4}" x2="${x + 4}" y2="${y - 4}"/>`
      + `<text x="${x + 6}" y="${y - 4}">${net.bits.length}</text>`
      + '</g>',
    );
  }
  return `<g class="bus-ticks">${ticks.join('')}</g>`;
}
