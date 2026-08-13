/**
 * Designing State Machines - dsd/40, "From Word Problem To Working Hardware"
 * (Sequential Logic track, FINAL module - closes dsd 28-42).
 * Generic scenes come from the shared _subtractor kit; the progressive
 * spec-to-diagram wizard, the six-stage design-funnel StepThrough, the
 * row-matching worked-example lab, the implication-chart grid, the state
 * assignment cost comparator, the excitation-equation derivation, the
 * film-editor analogy and the closing track timeline are all bespoke. EVERY
 * displayed value - which rows match, which chart cells cross or survive and
 * why, the assignment literal/term counts, the excitation equations - is
 * COMPUTED in code from small worked example tables (runRowMatching /
 * buildChart / assignmentReport / ffExcite), never a hardcoded conclusion.
 */
import React, { useMemo, useState } from 'react';
import { Wand2, Rows, Grid3x3, Binary, Cpu, Scissors, Check, X } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  StateDiagram, StateTable, ExciteTable, ffExcite, ClockButton, Toggle,
  type FSMState, type FSMEdge,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';
import { CONTENT } from './content';

const ACC = { good: '#34d399', warn: '#f59e0b', bin: '#38bdf8', hot: '#fb7185' };
const SRC_EN: string | undefined = '/videos/dsd40-design.mp4';
const SRC_HI: string | undefined = undefined;
const SRC_ROWMATCH = '/videos/dsd40-rowmatch.mp4';

/* ═══════════════════════ the running spec example (3-state Moore FSM) ═══════════════════════
   "Detect two consecutive 1s, overlap allowed." Used live in the cover hero, the
   design-funnel StepThrough, the assignment lab and the excitation lab, so the
   SAME machine gets carried, end to end, through every stage of the pipeline. */

interface SpecState { id: string; out: 0 | 1 }
const SPEC_STATES: SpecState[] = [
  { id: 'S0', out: 0 },
  { id: 'S1', out: 0 },
  { id: 'S2', out: 1 },
];
interface SpecTrans { from: string; x: 0 | 1; to: string }
const SPEC_TRANS: SpecTrans[] = [
  { from: 'S0', x: 0, to: 'S0' },
  { from: 'S0', x: 1, to: 'S1' },
  { from: 'S1', x: 0, to: 'S0' },
  { from: 'S1', x: 1, to: 'S2' },
  { from: 'S2', x: 0, to: 'S0' },
  { from: 'S2', x: 1, to: 'S2' },
];
const SPEC_DIAG_STATES: FSMState[] = [
  { id: 'S0', label: 'S0 / 0', x: 60, y: 90 },
  { id: 'S1', label: 'S1 / 0', x: 175, y: 90 },
  { id: 'S2', label: 'S2 / 1', x: 290, y: 90 },
];
const SPEC_DIAG_EDGES: (FSMEdge & { reveal: number })[] = [
  { from: 'S0', to: 'S0', label: '0', reveal: 2 },
  { from: 'S0', to: 'S1', label: '1', reveal: 2 },
  { from: 'S1', to: 'S0', label: '0', reveal: 2 },
  { from: 'S1', to: 'S2', label: '1', reveal: 3 },
  { from: 'S2', to: 'S0', label: '0', reveal: 3 },
  { from: 'S2', to: 'S2', label: '1', reveal: 3 },
];
const SPEC_STATE_REVEAL: Record<string, number> = { S0: 1, S1: 2, S2: 3 };

/* ═══════════════════════ state-assignment algebra (binary vs one-hot) ═══════════════════════ */

type Scheme = 'binary' | 'onehot';

function stateIndex(id: string): number { return SPEC_STATES.findIndex((s) => s.id === id); }
function schemeBits(scheme: Scheme): number {
  const n = SPEC_STATES.length;
  return scheme === 'binary' ? Math.max(1, Math.ceil(Math.log2(n))) : n;
}
function codeOf(scheme: Scheme, id: string): string {
  const n = SPEC_STATES.length;
  const i = stateIndex(id);
  const bits = schemeBits(scheme);
  return scheme === 'binary'
    ? i.toString(2).padStart(bits, '0')
    : Array.from({ length: n }, (_, k) => (k === i ? '1' : '0')).join('');
}
/** Raw literal-cost model: a binary term must AND every present-state bit (to pin
 *  down exactly which state) plus the input; a one-hot term needs only that one
 *  dedicated source bit plus the input, since the state already owns its own wire. */
function assignmentReport(scheme: Scheme) {
  const bits = schemeBits(scheme);
  let totalTerms = 0;
  let totalLiterals = 0;
  for (const tr of SPEC_TRANS) {
    const nc = codeOf(scheme, tr.to);
    for (let b = 0; b < bits; b++) {
      if (nc[b] === '1') {
        totalTerms += 1;
        totalLiterals += scheme === 'binary' ? bits + 1 : 2;
      }
    }
  }
  return { bits, totalTerms, totalLiterals };
}
function litsForRow(scheme: Scheme, tr: SpecTrans, bit: number, bits: number): string[] {
  if (scheme === 'binary') {
    const pc = codeOf('binary', tr.from);
    const lits: string[] = [];
    for (let b = 0; b < bits; b++) lits.push(pc[b] === '1' ? `Q${bits - 1 - b}` : `Q${bits - 1 - b}'`);
    lits.push(tr.x === 1 ? 'X' : "X'");
    return lits;
  }
  const srcIdx = stateIndex(tr.from);
  return [`Q${srcIdx}`, tr.x === 1 ? 'X' : "X'"];
}

/* ═══════════════════════ excitation algebra (D or T, reusing ffExcite) ═══════════════════════ */

type FFTypeDT = 'D' | 'T';

function excitationRows(scheme: Scheme, ffType: FFTypeDT): (string | number)[][] {
  const bits = schemeBits(scheme);
  return SPEC_TRANS.map((tr) => {
    const pc = codeOf(scheme, tr.from);
    const nc = codeOf(scheme, tr.to);
    const exc = Array.from({ length: bits }, (_, b) => ffExcite(ffType, Number(pc[b]), Number(nc[b]))[0]);
    return [tr.from, pc, tr.x, tr.to, nc, ...exc];
  });
}
function excitationSOP(scheme: Scheme, ffType: FFTypeDT, bit: number): string {
  const bits = schemeBits(scheme);
  const terms: string[] = [];
  for (const tr of SPEC_TRANS) {
    const pc = codeOf(scheme, tr.from);
    const nc = codeOf(scheme, tr.to);
    const e = ffExcite(ffType, Number(pc[bit]), Number(nc[bit]))[0];
    if (e === '1') terms.push(litsForRow(scheme, tr, bit, bits).join('.'));
  }
  return terms.length ? terms.join(' + ') : '0';
}

/* ═══════════════════════ row-matching engine (Method 1, reduction) ═══════════════════════
   A worked 6-state table that reduces to 4 in two rounds: round 1 finds one direct
   match, substitution then exposes a second match invisible on the first pass. */

interface RRow { id: string; next0: string; next1: string; out0: 0 | 1; out1: 0 | 1 }

const ROW_MATCH_ROWS: RRow[] = [
  { id: 'A', next0: 'B', next1: 'C', out0: 0, out1: 1 },
  { id: 'B', next0: 'D', next1: 'E', out0: 1, out1: 0 },
  { id: 'C', next0: 'D', next1: 'F', out0: 1, out1: 0 },
  { id: 'D', next0: 'A', next1: 'A', out0: 0, out1: 0 },
  { id: 'E', next0: 'B', next1: 'C', out0: 1, out1: 1 },
  { id: 'F', next0: 'B', next1: 'C', out0: 1, out1: 1 },
];

interface Merge { round: number; keep: string; drop: string }
interface RowMatchResult {
  rounds: Merge[][];
  alias: Record<string, string>;
  finalIds: string[];
  finalRows: Record<string, { next0: string; next1: string; out0: 0 | 1; out1: 0 | 1 }>;
}

function resolveId(alias: Record<string, string>, id: string): string {
  let cur = id;
  while (alias[cur] !== cur) cur = alias[cur];
  return cur;
}

function runRowMatching(rows: RRow[]): RowMatchResult {
  const byId: Record<string, RRow> = {};
  rows.forEach((r) => { byId[r.id] = r; });
  const alias: Record<string, string> = {};
  rows.forEach((r) => { alias[r.id] = r.id; });
  const rounds: Merge[][] = [];
  let changed = true;
  while (changed) {
    changed = false;
    const alive = rows.map((r) => r.id).filter((id) => resolveId(alias, id) === id);
    const roundMerges: Merge[] = [];
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const a = alive[i], b = alive[j];
        if (resolveId(alias, a) !== a || resolveId(alias, b) !== b) continue;
        const ra = byId[a], rb = byId[b];
        const n0a = resolveId(alias, ra.next0), n0b = resolveId(alias, rb.next0);
        const n1a = resolveId(alias, ra.next1), n1b = resolveId(alias, rb.next1);
        if (ra.out0 === rb.out0 && ra.out1 === rb.out1 && n0a === n0b && n1a === n1b) {
          alias[b] = a;
          roundMerges.push({ round: rounds.length + 1, keep: a, drop: b });
          changed = true;
        }
      }
    }
    if (roundMerges.length) rounds.push(roundMerges);
  }
  const finalIds = rows.map((r) => r.id).filter((id) => resolveId(alias, id) === id);
  const finalRows: RowMatchResult['finalRows'] = {};
  finalIds.forEach((id) => {
    const r = byId[id];
    finalRows[id] = { next0: resolveId(alias, r.next0), next1: resolveId(alias, r.next1), out0: r.out0, out1: r.out1 };
  });
  return { rounds, alias, finalIds, finalRows };
}

/* ═══════════════════════ implication-chart engine (Method 2, reduction) ═══════════════════════
   A differently-structured 6-state table: an output-cross triggers a chain of TWO
   rounds of cascade crosses, while one pair (E,F) survives every round untouched. */

const CHART_ROWS: RRow[] = [
  { id: 'A', next0: 'D', next1: 'E', out0: 0, out1: 0 },
  { id: 'B', next0: 'C', next1: 'E', out0: 0, out1: 0 },
  { id: 'C', next0: 'A', next1: 'A', out0: 1, out1: 0 },
  { id: 'D', next0: 'A', next1: 'A', out0: 0, out1: 1 },
  { id: 'E', next0: 'B', next1: 'B', out0: 0, out1: 1 },
  { id: 'F', next0: 'B', next1: 'B', out0: 0, out1: 1 },
];

interface ChartCell {
  a: string; b: string;
  crossed: boolean;
  via: 'output' | 'cascade' | null;
  round: number;
  dep: [string, string] | null;
  instant: boolean;
}

const pairKey = (x: string, y: string): string => [x, y].sort().join('-');

function buildChart(rows: RRow[]): { cells: ChartCell[]; states: string[] } {
  const ids = rows.map((r) => r.id);
  const byId: Record<string, RRow> = {};
  rows.forEach((r) => { byId[r.id] = r; });
  const pairs: { a: string; b: string }[] = [];
  for (let i = 1; i < ids.length; i++) for (let j = 0; j < i; j++) pairs.push({ a: ids[i], b: ids[j] });

  const cross = new Set<string>();
  const crossVia: Record<string, 'output' | 'cascade'> = {};
  const crossRound: Record<string, number> = {};
  const crossDep: Record<string, [string, string]> = {};
  const deps: Record<string, [string, string][]> = {};

  for (const p of pairs) {
    const ra = byId[p.a], rb = byId[p.b];
    const k = pairKey(p.a, p.b);
    if (ra.out0 !== rb.out0 || ra.out1 !== rb.out1) {
      cross.add(k); crossVia[k] = 'output'; crossRound[k] = 0;
    } else {
      const d: [string, string][] = [];
      if (ra.next0 !== rb.next0) d.push([ra.next0, rb.next0]);
      if (ra.next1 !== rb.next1) d.push([ra.next1, rb.next1]);
      deps[k] = d;
    }
  }

  let round = 0;
  let changed = true;
  while (changed) {
    changed = false;
    round += 1;
    const snapshot = new Set(cross);
    for (const p of pairs) {
      const k = pairKey(p.a, p.b);
      if (cross.has(k)) continue;
      for (const [x, y] of deps[k] || []) {
        if (x === y) continue;
        const dk = pairKey(x, y);
        if (snapshot.has(dk)) {
          cross.add(k); crossVia[k] = 'cascade'; crossRound[k] = round; crossDep[k] = [x, y];
          changed = true;
          break;
        }
      }
    }
  }

  const cells: ChartCell[] = pairs.map((p) => {
    const k = pairKey(p.a, p.b);
    const isCrossed = cross.has(k);
    const d = deps[k] || [];
    return {
      a: p.a, b: p.b,
      crossed: isCrossed,
      via: isCrossed ? crossVia[k] : null,
      round: isCrossed ? crossRound[k] : -1,
      dep: isCrossed ? (crossVia[k] === 'cascade' ? crossDep[k] : null) : (d.length ? d[0] : null),
      instant: !isCrossed && d.length === 0,
    };
  });
  return { cells, states: ids };
}

function partitionFromChart(states: string[], cells: ChartCell[]): string[][] {
  const parent: Record<string, string> = {};
  states.forEach((s) => { parent[s] = s; });
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  cells.forEach((c) => { if (!c.crossed) { const ra = find(c.a), rb = find(c.b); if (ra !== rb) parent[rb] = ra; } });
  const groups: Record<string, string[]> = {};
  states.forEach((s) => { const r = find(s); (groups[r] ??= []).push(s); });
  return Object.values(groups);
}

/* ═══════════════════════ bespoke: cover hero - the spec-to-diagram wizard ═══════════════════════
   Reveals the "detect two consecutive 1s" machine one clause at a time, then lets
   the student drive the finished 3-state machine live with a real clock + input. */

const SpecWizard: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [cur, setCur] = useState('S0');
  const tick = () => {
    const tr = SPEC_TRANS.find((tr2) => tr2.from === cur && tr2.x === x);
    if (tr) setCur(tr.to);
  };
  const out = SPEC_STATES.find((s) => s.id === cur)?.out ?? 0;

  const diagramAt = (stage: number) => {
    const states = SPEC_DIAG_STATES.filter((s) => SPEC_STATE_REVEAL[s.id] <= stage);
    const visible = new Set(states.map((s) => s.id));
    const edges = SPEC_DIAG_EDGES.filter((e) => e.reveal <= stage && visible.has(e.from) && visible.has(e.to));
    return { states, edges };
  };

  const captionAt = (stage: number): string => {
    if (stage === 0) return lang === 'hi'
      ? '"जैसे ही machine ने दो लगातार 1s देखे, output उठाइए (overlap के साथ)।" - अभी सिर्फ़ शब्द, अभी तक कोई state नहीं।'
      : '"Raise the output the instant the machine has seen two consecutive 1s (overlap allowed)." - just words so far, no states yet.';
    if (stage === 1) return lang === 'hi' ? 'S0 = अभी तक कोई 1 नहीं देखा। मशीन यहीं से शुरू होती है।' : 'S0 = no 1 seen yet. The machine starts here.';
    if (stage === 2) return lang === 'hi' ? 'S1 = ठीक एक 1 देखा। on 0 वापस S0, on 1 आगे S2 की तरफ़।' : 'S1 = exactly one 1 seen. On 0, fall back to S0; on 1, move on toward S2.';
    return lang === 'hi' ? 'S2 = दो लगातार 1s मिले, output = 1। on 1 यहीं रहिए (overlap), on 0 S0 पर वापस।' : 'S2 = two consecutive 1s found, output = 1. On 1, stay right here (overlap); on 0, fall back to S0.';
  };

  const steps = [0, 1, 2, 3].map((stage) => {
    const { states, edges } = diagramAt(stage);
    return {
      label: stage === 0 ? (lang === 'hi' ? 'spec' : 'spec') : `S${stage - 1}`,
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[13px] ${t.sub}`}>{captionAt(stage)}</p>
          {states.length > 0 && (
            <StateDiagram isDarkMode={isDarkMode} accent={accent} states={states} edges={edges} width={340} height={160}
              active={states[states.length - 1]?.id} />
          )}
        </div>
      ),
    };
  });

  steps.push({
    label: lang === 'hi' ? 'ख़ुद चलाइए' : 'drive it',
    body: (
      <div className="space-y-3">
        <p className={`text-center text-[13px] ${t.sub}`}>
          {lang === 'hi' ? 'X toggle कीजिए, फिर CLK दबाइए और पूरी मशीन को ख़ुद हिलते देखिए।' : 'Toggle X, then press CLK and watch the finished machine move itself.'}
        </p>
        <StateDiagram isDarkMode={isDarkMode} accent={accent} states={SPEC_DIAG_STATES} edges={SPEC_DIAG_EDGES} width={340} height={160} active={cur} />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Toggle label="X" v={x} onClick={() => setX(x ^ 1)} color={accent} />
          <ClockButton accent={accent} onTick={tick} canAuto={false} />
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>Y</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
              style={{ background: out ? ACC.good : 'transparent', color: out ? '#000' : ACC.good, border: `2px solid ${ACC.good}` }}>{out}</span>
          </div>
        </div>
      </div>
    ),
  });

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <Wand2 size={16} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
          {lang === 'hi' ? 'spec -> diagram · click through' : 'spec -> diagram · click through'}
        </span>
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ═══════════════════════ bespoke S02: the six-stage design funnel ═══════════════════════ */

const FunnelPipeline: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const reduction = useMemo(() => runRowMatching(ROW_MATCH_ROWS), []);
  const specTableRows: (string | number)[][] = SPEC_TRANS.map((tr) => [
    tr.from, tr.x, tr.to, SPEC_STATES.find((s) => s.id === tr.to)?.out ?? 0,
  ]);

  const steps = [
    {
      label: lang === 'hi' ? '1 · Specification' : '1 · Specification',
      body: (
        <p className={`text-center text-[13.5px] ${t.sub}`}>
          {lang === 'hi'
            ? 'Human thought: एक सादा वाक्य तय करता है मशीन को क्या याद रखना है - अभी कोई circuit नहीं, सिर्फ़ शर्त।'
            : 'Human thought: a plain sentence decides what the machine must remember - no circuit yet, just the requirement.'}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? '2 · State Diagram' : '2 · State Diagram',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>
            {lang === 'hi' ? 'Spatial geometry: हर याद रखी शर्त एक circle, हर clock-triggered बदलाव input/output से labelled एक arc।' : 'Spatial geometry: one circle per remembered condition, one input/output-labelled arc per clock-triggered change.'}
          </p>
          <StateDiagram isDarkMode={isDarkMode} accent={accent} states={SPEC_DIAG_STATES} edges={SPEC_DIAG_EDGES} width={320} height={150} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '3 · State Table' : '3 · State Table',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>
            {lang === 'hi' ? 'Tabular data: diagram से मैकेनिकल रूप से पढ़ा - हर present-state x input का next state और output।' : 'Tabular data: read mechanically off the diagram - every present-state x input pair, its next state and output.'}
          </p>
          <StateTable isDarkMode={isDarkMode} accent={accent} headers={['state', 'X', 'next', 'Y']} rows={specTableRows} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '4 · Assignment & Reduction' : '4 · Assignment & Reduction',
      body: (
        <p className={`text-center text-[13.5px] ${t.sub}`}>
          {lang === 'hi'
            ? <>Mathematical optimisation: पहले equivalent states merge कीजिए (अगले दो scenes का worked example {ROW_MATCH_ROWS.length} states को <b style={{ color: accent }}>{reduction.finalIds.length}</b> तक reduce करता है), फिर बचे states को bits दीजिए।</>
            : <>Mathematical optimisation: merge equivalent states first (the next two scenes' worked example reduces {ROW_MATCH_ROWS.length} states down to <b style={{ color: accent }}>{reduction.finalIds.length}</b>), then hand the survivors bit patterns.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? '5 · Excitation & Minimisation' : '5 · Excitation & Minimisation',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>
            {lang === 'hi' ? 'Binary logic: चुने flip-flop की excitation table हर ज़रूरी Q(t)->Q(t+1) उछाल के लिए ठीक input बताती है - D का reference नीचे।' : "Binary logic: the chosen flip-flop's excitation table names the exact input every required Q(t)->Q(t+1) jump needs - D's reference below."}
          </p>
          <ExciteTable isDarkMode={isDarkMode} accent={accent} type="D" />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '6 · Realisation' : '6 · Realisation',
      body: (
        <p className={`text-center text-[13.5px] ${t.sub}`}>
          {lang === 'hi'
            ? 'Physical silicon: minimised equations असली AND/OR gates बनते हैं जो flip-flop inputs चलाते हैं, सब एक साझा master clock से trigger।'
            : 'Physical silicon: the minimised equations become real AND/OR gates feeding the flip-flop inputs, all triggered off one shared master clock.'}
        </p>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ═══════════════════════ bespoke S03: row-matching worked lab ═══════════════════════ */

const RowMatchLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const result = useMemo(() => runRowMatching(ROW_MATCH_ROWS), []);
  const byId = useMemo(() => Object.fromEntries(ROW_MATCH_ROWS.map((r) => [r.id, r])), []);
  const ids = ROW_MATCH_ROWS.map((r) => r.id);
  const [pa, setPa] = useState('E');
  const [pb, setPb] = useState('F');

  const tableRows: (string | number)[][] = ROW_MATCH_ROWS.map((r) => [r.id, r.next0, r.next1, r.out0, r.out1]);
  const finalRows: (string | number)[][] = result.finalIds.map((id) => {
    const r = result.finalRows[id];
    return [id, r.next0, r.next1, r.out0, r.out1];
  });

  const ra = byId[pa], rb = byId[pb];
  const outMatch = ra.out0 === rb.out0 && ra.out1 === rb.out1;
  const n0Match = ra.next0 === rb.next0;
  const n1Match = ra.next1 === rb.next1;
  const allMatch = pa !== pb && outMatch && n0Match && n1Match;

  const cell = (ok: boolean, v: string | number) => (
    <span className="font-mono font-black" style={{ color: ok ? ACC.good : ACC.warn }}>{v}</span>
  );

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Rows size={16} style={{ color: accent }} />
          <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
            {lang === 'hi' ? 'शुरुआती table · छह states' : 'starting table · six states'}
          </span>
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent} headers={['state', 'next(0)', 'next(1)', 'out(0)', 'out(1)']} rows={tableRows} />
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'ख़ुद जाँचिए · कोई भी दो rows चुनिए' : 'try it yourself · pick any two rows'}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'row 1' : 'row 1'}</span>
            <div className="flex flex-wrap justify-center gap-1">
              {ids.map((id) => (
                <button key={id} onClick={() => setPa(id)}
                  className="h-10 w-10 rounded-lg font-mono text-[13px] font-black active:scale-90 sm:h-8 sm:w-8"
                  style={pa === id ? { background: accent, color: '#000' } : { border: `1.5px solid ${accent}55`, color: accent }}>{id}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'row 2' : 'row 2'}</span>
            <div className="flex flex-wrap justify-center gap-1">
              {ids.map((id) => (
                <button key={id} onClick={() => setPb(id)}
                  className="h-10 w-10 rounded-lg font-mono text-[13px] font-black active:scale-90 sm:h-8 sm:w-8"
                  style={pb === id ? { background: ACC.hot, color: '#000' } : { border: `1.5px solid ${ACC.hot}55`, color: ACC.hot }}>{id}</button>
              ))}
            </div>
          </div>
        </div>

        {pa === pb ? (
          <p className={`mt-4 text-center font-mono text-[13px] ${t.faint}`}>{lang === 'hi' ? 'दो अलग states चुनिए।' : 'pick two different states.'}</p>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[{ id: pa, r: ra }, { id: pb, r: rb }].map((s) => (
                <div key={s.id} className={`rounded-2xl border p-3 text-center ${t.soft}`}>
                  <div className="font-mono text-[12px] font-black" style={{ color: accent }}>{s.id}</div>
                  <div className="mt-1 font-mono text-[12px]">
                    next(0)={cell(n0Match, s.r.next0)} next(1)={cell(n1Match, s.r.next1)} out=({cell(outMatch, s.r.out0)},{cell(outMatch, s.r.out1)})
                  </div>
                </div>
              ))}
            </div>
            <p className={`flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
              {allMatch ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.warn }} />}
              {allMatch
                ? (lang === 'hi' ? <>{pa} और {pb} हर column पर मेल खाते हैं - <b style={{ color: ACC.good }}>merge कीजिए</b>।</> : <>{pa} and {pb} match on every column - <b style={{ color: ACC.good }}>merge them</b>.</>)
                : (lang === 'hi' ? <>{pa} और {pb} किसी column पर अलग हैं - अभी merge नहीं।</> : <>{pa} and {pb} differ on some column - no merge yet.</>)}
            </p>
          </div>
        )}
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'computed merge log · round-दर-round' : 'computed merge log · round by round'}
        </div>
        <div className="space-y-3">
          {result.rounds.map((round, ri) => (
            <div key={ri} className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{lang === 'hi' ? `round ${ri + 1}` : `round ${ri + 1}`}</div>
              {round.map((m, mi) => (
                <p key={mi} className={`text-[13px] ${t.sub}`}>
                  {lang === 'hi'
                    ? <><b style={{ color: accent }}>{m.keep}</b> ≡ <b style={{ color: accent }}>{m.drop}</b> - identical row; <b style={{ color: ACC.warn }}>{m.drop}</b> हटाया, हर reference <b style={{ color: ACC.good }}>{m.keep}</b> पर redirect।</>
                    : <><b style={{ color: accent }}>{m.keep}</b> ≡ <b style={{ color: accent }}>{m.drop}</b> - identical row; delete <b style={{ color: ACC.warn }}>{m.drop}</b>, redirect every reference to <b style={{ color: ACC.good }}>{m.keep}</b>.</>}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.good }}>
          {lang === 'hi' ? `reduced table · ${ROW_MATCH_ROWS.length} -> ${result.finalIds.length} states` : `reduced table · ${ROW_MATCH_ROWS.length} -> ${result.finalIds.length} states`}
        </div>
        <StateTable isDarkMode={isDarkMode} accent={ACC.good} headers={['state', 'next(0)', 'next(1)', 'out(0)', 'out(1)']} rows={finalRows}
          note={lang === 'hi' ? 'एक भी और pass कुछ नया merge नहीं देता - यही convergence है।' : 'one more full pass finds nothing new to merge - that is convergence.'} />
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'bonus वीडियो · row-matching walkthrough' : 'bonus video · row-matching walkthrough'}
        </div>
        <div className="overflow-hidden rounded-2xl">
          <CustomVideoPlayer src={SRC_ROWMATCH} accent={accent} className="rounded-2xl border-0" />
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════ bespoke S04: implication chart lab ═══════════════════════ */

const explainCell = (byId: Record<string, RRow>, c: ChartCell, lang: 'en' | 'hi'): React.ReactNode => {
  if (c.crossed && c.via === 'output') {
    const ra = byId[c.a], rb = byId[c.b];
    return lang === 'hi'
      ? <>{c.a} और {c.b}: outputs अलग ({ra.out0},{ra.out1}) बनाम ({rb.out0},{rb.out1}) - <b style={{ color: ACC.warn }}>कभी equivalent नहीं</b>।</>
      : <>{c.a} and {c.b}: outputs differ ({ra.out0},{ra.out1}) vs ({rb.out0},{rb.out1}) - <b style={{ color: ACC.warn }}>never equivalent</b>.</>;
  }
  if (c.crossed && c.via === 'cascade' && c.dep) {
    return lang === 'hi'
      ? <>{c.a} और {c.b}: outputs मेल खाते थे, पर dependency जोड़ी ({c.dep[0]},{c.dep[1]}) round {c.round} तक cross हो चुकी थी - <b style={{ color: ACC.warn }}>cascade से cross</b>।</>
      : <>{c.a} and {c.b}: outputs matched, but the dependency pair ({c.dep[0]},{c.dep[1]}) was already crossed by round {c.round} - <b style={{ color: ACC.warn }}>crossed by cascade</b>.</>;
  }
  if (c.instant) {
    return lang === 'hi'
      ? <>{c.a} और {c.b}: outputs मेल खाते और next-states पहले से identical - <b style={{ color: ACC.good }}>instant identity, compatible</b>।</>
      : <>{c.a} and {c.b}: outputs match and next-states are already identical - <b style={{ color: ACC.good }}>instant identity, compatible</b>.</>;
  }
  const d = c.dep;
  return lang === 'hi'
    ? <>{c.a} और {c.b}: outputs मेल खाते; dependency{d ? ` (${d[0]},${d[1]})` : ''} पूरे convergence में कभी cross नहीं हुई - <b style={{ color: ACC.good }}>compatible</b>।</>
    : <>{c.a} and {c.b}: outputs match; the dependency{d ? ` (${d[0]},${d[1]})` : ''} never got crossed through convergence - <b style={{ color: ACC.good }}>compatible</b>.</>;
};

const ImplicationChartLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const byId = useMemo(() => Object.fromEntries(CHART_ROWS.map((r) => [r.id, r])), []);
  const chart = useMemo(() => buildChart(CHART_ROWS), []);
  const cellByKey = useMemo(() => Object.fromEntries(chart.cells.map((c) => [pairKey(c.a, c.b), c])), [chart]);
  const [sel, setSel] = useState<ChartCell | null>(null);
  const blocks = useMemo(() => partitionFromChart(chart.states, chart.cells).filter((g) => g.length > 1), [chart]);

  const rowStates = chart.states.slice(1);
  const colStates = chart.states.slice(0, -1);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Grid3x3 size={16} style={{ color: accent }} />
          <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
            {lang === 'hi' ? 'triangular chart · cell tap कीजिए' : 'triangular chart · tap a cell'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse text-center font-mono">
            <thead>
              <tr>
                <th className="px-2 py-1.5" />
                {colStates.map((cs) => (
                  <th key={cs} className="px-2 py-1.5 text-[12px] font-black" style={{ color: accent }}>{cs}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowStates.map((rs, ri) => (
                <tr key={rs}>
                  <th className="px-2 py-1.5 text-[12px] font-black" style={{ color: accent }}>{rs}</th>
                  {colStates.slice(0, ri + 1).map((cs) => {
                    const c = cellByKey[pairKey(rs, cs)];
                    const isSel = sel && sel.a === c.a && sel.b === c.b;
                    const glyph = c.crossed ? '×' : c.instant ? '✓' : c.dep ? '✓' : '✓';
                    const col = c.crossed ? ACC.warn : ACC.good;
                    return (
                      <td key={cs} className="p-1">
                        <button onClick={() => setSel(c)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-[15px] font-black transition-all sm:h-9 sm:w-9"
                          style={isSel ? { background: col, color: '#000' } : { border: `1.5px solid ${col}55`, color: col }}>
                          {glyph}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
          {lang === 'hi' ? '× = cross (कभी equivalent नहीं) · ✓ = compatible (instant या resolved)' : '× = crossed (never equivalent) · ✓ = compatible (instant or resolved)'}
        </p>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'चुने cell का कारण · computed' : 'selected cell, why · computed'}
        </div>
        <p className={`text-[13.5px] ${t.sub}`}>
          {sel ? explainCell(byId, sel, lang) : (lang === 'hi' ? 'ऊपर एक cell tap कीजिए।' : 'tap a cell above.')}
        </p>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.good }}>
          {lang === 'hi' ? 'convergence के बाद बचे compatible classes' : 'compatible classes surviving convergence'}
        </div>
        <p className={`text-[13.5px] ${t.sub}`}>
          {blocks.length
            ? blocks.map((g) => `{${g.join(', ')}}`).join(', ')
            : (lang === 'hi' ? 'कोई pair नहीं बचा - यह table पहले से minimal है।' : 'no pair survives - this table is already minimal.')}
        </p>
      </Card>
    </div>
  );
};

/* ═══════════════════════ bespoke S05: state assignment lab ═══════════════════════ */

const AssignmentLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const binBits = schemeBits('binary');
  const hotBits = schemeBits('onehot');
  const codeRows: (string | number)[][] = SPEC_STATES.map((s) => [s.id, codeOf('binary', s.id), codeOf('onehot', s.id)]);
  const binReport = assignmentReport('binary');
  const hotReport = assignmentReport('onehot');
  const nextRows = (scheme: Scheme): (string | number)[][] =>
    SPEC_TRANS.map((tr) => [tr.from, codeOf(scheme, tr.from), tr.x, tr.to, codeOf(scheme, tr.to)]);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Binary size={16} style={{ color: accent }} />
          <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
            {lang === 'hi' ? 'तीन states, दो codes' : 'three states, two codes'}
          </span>
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={['state', `binary (${binBits}b)`, `one-hot (${hotBits}b)`]} rows={codeRows}
          note={lang === 'hi'
            ? `3 states -> binary को ceil(log2 3) = ${binBits} flip-flops चाहिए; one-hot को ${hotBits} चाहिए।`
            : `3 states -> binary needs ceil(log2 3) = ${binBits} flip-flops; one-hot needs ${hotBits}.`} />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[{ id: 'binary' as Scheme, label: 'Binary', report: binReport, color: ACC.bin },
          { id: 'onehot' as Scheme, label: 'One-hot', report: hotReport, color: ACC.hot }].map((s) => (
          <div key={s.id} className={`rounded-2xl border p-4 text-center ${t.soft}`} style={{ borderColor: `${s.color}55` }}>
            <div className="font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: s.color }}>{s.label}</div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[12px]">
              <div><div className={t.faint}>{lang === 'hi' ? 'flip-flops' : 'flip-flops'}</div><div className="text-lg font-black" style={{ color: s.color }}>{s.report.bits}</div></div>
              <div><div className={t.faint}>{lang === 'hi' ? 'terms' : 'terms'}</div><div className="text-lg font-black" style={{ color: s.color }}>{s.report.totalTerms}</div></div>
              <div><div className={t.faint}>{lang === 'hi' ? 'literals' : 'literals'}</div><div className="text-lg font-black" style={{ color: s.color }}>{s.report.totalLiterals}</div></div>
            </div>
          </div>
        ))}
      </div>
      <p className={`text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>हर binary term को state pin करने को हर present-state bit AND करनी पड़ती है ({binBits}+1 literals/term); हर one-hot term को सिर्फ़ उस state की अपनी bit चाहिए (2 literals/term) - पर one-hot को {hotBits - binBits} ज़्यादा flip-flops और {hotReport.totalTerms - binReport.totalTerms} ज़्यादा terms चाहिए।</>
          : <>every binary term must AND every present-state bit to pin the state ({binBits}+1 literals/term); every one-hot term needs only that state's own bit (2 literals/term) - but one-hot spends {hotBits - binBits} more flip-flops and {hotReport.totalTerms - binReport.totalTerms} more terms.</>}
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StateTable isDarkMode={isDarkMode} accent={ACC.bin} headers={['state', 'code', 'X', 'next', 'next code']} rows={nextRows('binary')} note="binary" />
        <StateTable isDarkMode={isDarkMode} accent={ACC.hot} headers={['state', 'code', 'X', 'next', 'next code']} rows={nextRows('onehot')} note="one-hot" />
      </div>
    </div>
  );
};

/* ═══════════════════════ bespoke S06: excitation lab ═══════════════════════ */

const ExcitationLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [scheme, setScheme] = useState<Scheme>('binary');
  const [ffType, setFfType] = useState<FFTypeDT>('D');
  const bits = schemeBits(scheme);
  const rows = excitationRows(scheme, ffType);
  const bitLabel = (b: number) => (scheme === 'binary' ? `${ffType}${bits - 1 - b}` : `${ffType}_${SPEC_STATES[b].id}`);
  const headers = ['state', 'code', 'X', 'next', 'next code', ...Array.from({ length: bits }, (_, b) => bitLabel(b))];

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Cpu size={16} style={{ color: accent }} />
          <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
            {lang === 'hi' ? 'flip-flop + scheme चुनिए' : 'pick a flip-flop + a scheme'}
          </span>
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{lang === 'hi' ? 'flip-flop' : 'flip-flop'}</span>
            <div className="flex gap-1">
              {(['D', 'T'] as FFTypeDT[]).map((f) => (
                <button key={f} onClick={() => setFfType(f)}
                  className="rounded-lg px-3 py-1.5 font-mono text-[12px] font-black active:scale-90"
                  style={ffType === f ? { background: accent, color: '#000' } : { border: `1.5px solid ${accent}66`, color: accent }}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.bin }}>{lang === 'hi' ? 'scheme' : 'scheme'}</span>
            <div className="flex gap-1">
              {(['binary', 'onehot'] as Scheme[]).map((s) => (
                <button key={s} onClick={() => setScheme(s)}
                  className="rounded-lg px-3 py-1.5 font-mono text-[12px] font-black active:scale-90"
                  style={scheme === s ? { background: ACC.bin, color: '#000' } : { border: `1.5px solid ${ACC.bin}66`, color: ACC.bin }}>{s === 'binary' ? 'Binary' : 'One-hot'}</button>
              ))}
            </div>
          </div>
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent} headers={headers} rows={rows}
          note={lang === 'hi' ? 'हर excitation cell ffExcite से गिना गया, हाथ से नहीं लिखा।' : 'every excitation cell computed from ffExcite, never hand-typed.'} />
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: bits }, (_, b) => (
          <div key={b} className={`rounded-2xl border p-4 ${t.soft}`}>
            <div className="font-mono text-[12px] font-black" style={{ color: accent }}>{bitLabel(b)} =</div>
            <div className="mt-1 font-mono text-[13px]" style={{ color: accent }}>{excitationSOP(scheme, ffType, b)}</div>
          </div>
        ))}
      </div>

      <ExciteTable isDarkMode={isDarkMode} accent={accent} type={ffType} />
    </div>
  );
};

/* ═══════════════════════ bespoke S07: the film editor's cut ═══════════════════════ */

const ScriptEditor: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const result = useMemo(() => runRowMatching(ROW_MATCH_ROWS), []);
  const byId = useMemo(() => Object.fromEntries(ROW_MATCH_ROWS.map((r) => [r.id, r])), []);
  const cutOf: Record<string, string> = {};
  result.rounds.flat().forEach((m) => { cutOf[m.drop] = m.keep; });

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Scissors size={16} style={{ color: accent }} />
          <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
            {lang === 'hi' ? 'rough cut · छह scenes' : 'rough cut · six scenes'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ROW_MATCH_ROWS.map((r) => {
            const cut = cutOf[r.id];
            return (
              <div key={r.id} className="flex flex-col items-center gap-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 font-mono text-xl font-black"
                  style={cut
                    ? { borderColor: `${ACC.warn}88`, color: ACC.warn, textDecoration: 'line-through', opacity: 0.55 }
                    : { borderColor: `${ACC.good}88`, color: ACC.good }}>
                  {r.id}
                </div>
                <span className="font-mono text-[10px]" style={{ color: cut ? ACC.warn : ACC.good }}>
                  {cut ? (lang === 'hi' ? `कट -> ${cut}` : `cut -> ${cut}`) : (lang === 'hi' ? 'रखा' : 'kept')}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? "editor की cut sheet · computed" : "editor's cut sheet · computed"}
        </div>
        <div className="space-y-3">
          {result.rounds.map((round, ri) => (
            <div key={ri} className="space-y-1.5">
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{lang === 'hi' ? `round ${ri + 1}` : `round ${ri + 1}`}</div>
              {round.map((m, mi) => {
                const rk = byId[m.keep];
                const n0 = resolveId(result.alias, rk.next0);
                const n1 = resolveId(result.alias, rk.next1);
                return (
                  <p key={mi} className={`text-[13px] ${t.sub}`}>
                    {lang === 'hi'
                      ? <>Scene <b style={{ color: accent }}>{m.drop}</b> और Scene <b style={{ color: accent }}>{m.keep}</b> shot-for-shot identical हैं - same dialogue out=({rk.out0},{rk.out1}), same अगली scene next=({n0},{n1})। Editor <b style={{ color: ACC.warn }}>{m.drop}</b> काटता है, हर cue <b style={{ color: ACC.good }}>{m.keep}</b> पर splice करता है।</>
                      : <>Scene <b style={{ color: accent }}>{m.drop}</b> and Scene <b style={{ color: accent }}>{m.keep}</b> are shot-for-shot identical - same dialogue out=({rk.out0},{rk.out1}), same next scene next=({n0},{n1}). The editor cuts <b style={{ color: ACC.warn }}>{m.drop}</b>, splices every cue onto <b style={{ color: ACC.good }}>{m.keep}</b>.</>}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
        <p className={`mt-3 text-center font-mono text-[12px] ${t.faint}`}>
          {lang === 'hi'
            ? `${ROW_MATCH_ROWS.length} scenes -> ${result.finalIds.length} scenes बचीं, कहानी बिना बदले।`
            : `${ROW_MATCH_ROWS.length} scenes -> ${result.finalIds.length} scenes survive, story unchanged.`}
        </p>
      </Card>
    </div>
  );
};

/* ═══════════════════════ bespoke S11: closing track timeline ═══════════════════════ */

interface TrackModule { n: number; label: string; band: 'memory' | 'datapath' | 'fsm' | 'physical' }
const TRACK_MODULES: TrackModule[] = [
  { n: 28, label: 'Sequential Intro', band: 'memory' },
  { n: 29, label: 'Latches', band: 'memory' },
  { n: 30, label: 'Flip-Flops', band: 'memory' },
  { n: 31, label: 'Timing & Race-Around', band: 'memory' },
  { n: 32, label: 'Representations', band: 'datapath' },
  { n: 33, label: 'Conversions', band: 'datapath' },
  { n: 34, label: 'Registers', band: 'datapath' },
  { n: 35, label: 'Async Counters', band: 'datapath' },
  { n: 36, label: 'Decoding & Sync Counters', band: 'datapath' },
  { n: 37, label: 'Special Counters', band: 'datapath' },
  { n: 38, label: 'Analysis & Reverse', band: 'fsm' },
  { n: 39, label: 'Mealy, Moore & Encoding', band: 'fsm' },
  { n: 40, label: 'Designing State Machines', band: 'fsm' },
  { n: 41, label: 'Async Design', band: 'physical' },
  { n: 42, label: 'Hazards', band: 'physical' },
];
const BAND_COLOR: Record<TrackModule['band'], string> = { memory: '#38bdf8', datapath: '#f59e0b', fsm: '#fb7185', physical: '#a78bfa' };

const TrackTimeline: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const bandLabel = (b: TrackModule['band']): string => {
    if (b === 'memory') return lang === 'hi' ? 'memory' : 'memory';
    if (b === 'datapath') return lang === 'hi' ? 'datapath' : 'datapath';
    if (b === 'fsm') return lang === 'hi' ? 'FSM theory व design' : 'FSM theory & design';
    return lang === 'hi' ? 'physical reality' : 'physical reality';
  };
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Sequential Logic track · dsd 28-42, पूरा हुआ' : 'Sequential Logic track · dsd 28-42, complete'}
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-end gap-1.5 px-1 pb-1">
          {TRACK_MODULES.map((m) => {
            const here = m.n === 40;
            const col = BAND_COLOR[m.band];
            return (
              <div key={m.n} className="flex w-[68px] flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[11px] font-black"
                  style={here ? { background: col, color: '#000', boxShadow: `0 0 0 3px ${col}55` } : { border: `2px solid ${col}88`, color: col }}>
                  {m.n}
                </div>
                <span className={`text-center font-mono text-[8px] leading-tight ${here ? '' : t.faint}`} style={here ? { color: col, fontWeight: 800 } : undefined}>
                  {m.label}
                </span>
                {here && <span className="font-mono text-[8px] font-black" style={{ color: col }}>{lang === 'hi' ? '(यहाँ)' : '(here)'}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px]">
        {(['memory', 'datapath', 'fsm', 'physical'] as const).map((b) => (
          <span key={b} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BAND_COLOR[b] }} />
            <span className={t.faint}>{bandLabel(b)}</span>
          </span>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════ part assignment ═══════════════════════ */
const partAt = (i: number): string =>
  i <= 1 ? 'PART I · THE SPEC'
    : i <= 4 ? 'PART II · REDUCE'
      : i <= 8 ? 'PART III · ASSIGN & BUILD'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_RowMatching': return 'rowmatch';
    case 'S04_ImplicationChart': return 'chart';
    case 'S05_Assignment': return 'assignment';
    case 'S06_Excitation': return 'excitation';
    case 'S07_Analogy': return 'analogy';
    case 'S08_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="FSM Design · Word Problem to Silicon"
        hero={<SpecWizard isDarkMode={p.isDarkMode} accent={p.accent} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FSM" tag="Practice · Designing State Machines" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => (
        <>
          <RecapScene {...p} scene={scene} />
          <SceneShell><TrackTimeline isDarkMode={p.isDarkMode} accent={p.accent} /></SceneShell>
        </>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'facts' && (
            <div className="space-y-6">
              <TryItYourself />
              <FunnelPipeline isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'rowmatch' && (
            <div className="space-y-6">
              <TryItYourself />
              <RowMatchLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'chart' && (
            <div className="space-y-6">
              <TryItYourself />
              <ImplicationChartLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'assignment' && (
            <div className="space-y-6">
              <TryItYourself />
              <AssignmentLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'excitation' && (
            <div className="space-y-6">
              <TryItYourself />
              <ExcitationLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <ScriptEditor isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="state-machine-design"
              titleEN="Build a state machine for real"
              titleHI="असली में एक state machine बनाइए"
              bodyEN="Open the live workbench and wire the reduced, binary-assigned two-consecutive-ones detector from two D flip-flops and a handful of AND/OR gates, then prove the output pulses on exactly the right clock edge."
              bodyHI="live workbench खोलिए और reduced, binary-assigned दो-लगातार-ones detector को दो D flip-flops और मुट्ठी भर AND/OR gates से wire कीजिए, फिर साबित कीजिए output ठीक सही clock edge पर pulse करे।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
