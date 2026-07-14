/**
 * VerilogJudge - the BitforBytes Verilog bench. Write Verilog, watch the real
 * Yosys-synthesized circuit draw itself beside the code (and probe it live), then
 * Run to grade against an exhaustive truth table. Solid, energetic UI - no glass.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ArrowLeft, Play, RotateCcw, Lightbulb, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, BadgeCheck, Zap,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { VERILOG_PROBLEMS, isSeq, type VProblem, type AnyProblem } from '../data/verilogProblems';
import { grade, type GradeResult } from '../engine/verilog/grade';
import { compileVerilog, simulate, type Bit } from '../engine/verilog/miniSim';
import { SynthSchematicView } from '../components/verilog/SynthSchematicView';
import type { Diag } from '../engine/verilog/diagnostics';

/**
 * Drag-to-resize a panel dimension, persisted to localStorage. `min`/`max` may
 * be numbers or functions (e.g. window-relative), so a split can't push a
 * neighbouring panel off-screen. Returns the size and a pointer-down handler to
 * spread onto a divider element.
 */
function useResizable(
  key: string,
  initial: number,
  min: number | (() => number),
  max: number | (() => number),
  axis: 'x' | 'y',
  dir: 1 | -1 = 1,
) {
  const lo = () => (typeof min === 'function' ? min() : min);
  const hi = () => (typeof max === 'function' ? max() : max);
  const clamp = (v: number) => Math.max(lo(), Math.min(hi(), v));
  const [size, setSize] = useState<number>(() => {
    const s = Number(typeof window !== 'undefined' ? window.localStorage.getItem(key) : NaN);
    return Number.isFinite(s) ? clamp(s) : initial;
  });
  useEffect(() => { try { window.localStorage.setItem(key, String(size)); } catch { /* ignore */ } }, [key, size]);
  useEffect(() => {
    const onResize = () => setSize((s) => clamp(s));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const p0 = axis === 'x' ? e.clientX : e.clientY;
    const s0 = size;
    const move = (ev: PointerEvent) => setSize(clamp(s0 + dir * ((axis === 'x' ? ev.clientX : ev.clientY) - p0)));
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, axis, dir]);
  return [size, onPointerDown] as const;
}

const SOLVED_KEY = 'vj_solved_v1';
const codeKey = (id: string) => `vj_code_${id}`;

const DIFF_COLOR: Record<VProblem['difficulty'], string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#f43f5e',
};

/** First source line that mentions a signal (used when a warning has no line). */
function lineOfSignal(code: string, signal: string): number | undefined {
  const re = new RegExp(`(^|[^\\w])${signal}([^\\w]|$)`);
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return undefined;
}

// A chunky hand-drawn AND-gate mark - the bench's logo.
const Monogram: React.FC = () => (
  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.35)]">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#04231a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M7 5 H12 A7 7 0 0 1 12 19 H7 Z" />
      <path d="M3 9 H7 M3 15 H7 M19 12 H21.5" />
    </svg>
  </div>
);

const Sep: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`h-3 w-px shrink-0 bg-border-soft ${className}`} />
);

// Register a lightweight Verilog grammar for Monaco exactly once.
let verilogRegistered = false;
function registerVerilog(monaco: Monaco) {
  if (verilogRegistered) return;
  verilogRegistered = true;
  monaco.languages.register({ id: 'verilog' });
  monaco.languages.setMonarchTokensProvider('verilog', {
    keywords: [
      'module', 'endmodule', 'input', 'output', 'inout', 'wire', 'reg', 'logic',
      'assign', 'always', 'always_comb', 'always_ff', 'begin', 'end', 'if', 'else',
      'case', 'endcase', 'posedge', 'negedge', 'parameter', 'localparam',
      'and', 'or', 'not', 'nand', 'nor', 'xor', 'xnor', 'buf',
    ],
    tokenizer: {
      root: [
        [/\/\/.*/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/\b\d+'[bBoOdDhH][0-9a-fA-FxXzZ_]+/, 'number'],
        [/\b\d+\b/, 'number'],
        [/[A-Za-z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        [/[~!&|^?:=<>+\-*]/, 'operator'],
      ],
      comment: [[/[^/*]+/, 'comment'], [/\*\//, 'comment', '@pop'], [/[/*]/, 'comment']],
    },
  });
}

const loadSolved = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) || '[]')); }
  catch { return new Set(); }
};

// Every topic tag across the bank — powers the topic index/filter in the picker.
const ALL_TOPICS = Array.from(new Set(VERILOG_PROBLEMS.flatMap((p) => p.tags))).sort();

// ── daily solve streak (localStorage) ──
const STREAK_KEY = 'vj_streak_v1';
const dayStamp = (offsetDays = 0) => new Date(Date.now() - offsetDays * 86400000).toISOString().slice(0, 10);
interface Streak { count: number; last: string }
const loadStreak = (): Streak => {
  try { const s = JSON.parse(localStorage.getItem(STREAK_KEY) || 'null'); if (s && typeof s.count === 'number') return s; }
  catch { /* ignore */ }
  return { count: 0, last: '' };
};
/** Bump the streak on a solve: +1 if yesterday, reset to 1 if a gap, unchanged if already today. */
const bumpStreak = (prev: Streak): Streak => {
  const t = dayStamp(0);
  if (prev.last === t) return prev;
  const count = prev.last === dayStamp(1) ? prev.count + 1 : 1;
  const next = { count, last: t };
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(next)); } catch { /* quota */ }
  return next;
};

export const VerilogJudge: React.FC = () => {
  const navigate = useNavigate();
  const [scheme, toggleScheme] = useColorScheme();
  const isLight = scheme === 'light';

  const [problemId, setProblemId] = useState<string>(VERILOG_PROBLEMS[0].id);
  const problem = useMemo(() => VERILOG_PROBLEMS.find((p) => p.id === problemId)!, [problemId]);
  const problemIdx = useMemo(() => VERILOG_PROBLEMS.findIndex((p) => p.id === problemId), [problemId]);

  const [code, setCode] = useState<string>(() => localStorage.getItem(codeKey(problem.id)) ?? problem.starter);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<'All' | VProblem['difficulty']>('All');
  const [solved, setSolved] = useState<Set<string>>(loadSolved);
  const [streak, setStreak] = useState<Streak>(loadStreak);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [customIn, setCustomIn] = useState<Record<string, Bit>>({});
  const [customOut, setCustomOut] = useState<Record<string, Bit> | null>(null);
  const [customErr, setCustomErr] = useState<string | null>(null);
  const [problemOpen, setProblemOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [passTotal, setPassTotal] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const runTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Drag-resizable panels (desktop): problem-panel width, editor↔schematic split,
  // and console height. Persisted; clamped so no panel can be squeezed away.
  const [problemW, dragProblem] = useResizable('bfb_vj_problem_w', 360, 260, () => Math.min(680, window.innerWidth * 0.5), 'x', 1);
  const [editorW, dragEditor] = useResizable('bfb_vj_editor_w', 560, 320, () => window.innerWidth - 420, 'x', 1);
  const [consoleH, dragConsole] = useResizable('bfb_vj_console_h', 260, 140, () => window.innerHeight * 0.7, 'y', -1);

  // debounced source feeds the live Yosys schematic
  const [debounced, setDebounced] = useState(code);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(code), 240);
    return () => clearTimeout(t);
  }, [code]);

  const selectProblem = useCallback((id: string) => {
    setProblemId(id);
    const p = VERILOG_PROBLEMS.find((x) => x.id === id)!;
    const saved = localStorage.getItem(codeKey(id)) ?? p.starter;
    setCode(saved);
    setDebounced(saved);
    setResult(null);
    setResultsOpen(false);
    setShowHint(false);
    setCustomOut(null);
    setCustomErr(null);
    setCustomIn({});
    setPickerOpen(false);
  }, []);

  const onCodeChange = (v: string | undefined) => {
    const next = v ?? '';
    setCode(next);
    try { localStorage.setItem(codeKey(problem.id), next); } catch { /* quota */ }
  };

  const run = useCallback(() => {
    setRunning(true);
    setResult(null);
    setResultsOpen(true);
    if (runTimer.current) clearTimeout(runTimer.current);
    runTimer.current = setTimeout(() => {
      const r = grade(problem, code);
      setResult(r);
      setRunning(false);
      if (r.status === 'pass') {
        setPassTotal(r.total);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2200);
        setStreak((s) => bumpStreak(s));
        if (!solved.has(problem.id)) {
          const next = new Set(solved); next.add(problem.id);
          setSolved(next);
          try { localStorage.setItem(SOLVED_KEY, JSON.stringify([...next])); } catch { /* quota */ }
        }
      }
    }, 300);
  }, [problem, code, solved]);

  const runRef = useRef(run);
  useEffect(() => { runRef.current = run; }, [run]);
  useEffect(() => () => { if (runTimer.current) clearTimeout(runTimer.current); }, []);

  // Monaco handles so we can mark exactly which line/signal Yosys flagged.
  const editorRef = useRef<Parameters<NonNullable<React.ComponentProps<typeof Editor>['onMount']>>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const applyDiagnostics = useCallback((ds: Diag[]) => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;
    const src = model.getValue();
    const markers = ds.map((d) => {
      const line = d.line ?? (d.signal ? lineOfSignal(src, d.signal) : undefined) ?? 1;
      const text = model.getLineContent(line);
      return {
        severity: d.severity === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        message: d.message,
        startLineNumber: line, endLineNumber: line,
        startColumn: 1, endColumn: Math.max(2, text.length + 1),
      };
    });
    monaco.editor.setModelMarkers(model, 'yosys', markers);
  }, []);

  const resetCode = () => { onCodeChange(problem.starter); setDebounced(problem.starter); };

  // Custom "Run": simulate the student's design on ONE user-chosen input vector
  // (no grading). Combinational only — same miniSim the grader uses.
  const runCustom = useCallback(() => {
    setCustomErr(null); setCustomOut(null);
    const c = compileVerilog(code);
    if (!c.ok) { setCustomErr(c.error); return; }
    const inp: Record<string, Bit> = {};
    problem.inputs.forEach((n) => { inp[n] = (customIn[n] ?? 0) as Bit; });
    try {
      const full = simulate(c.module, inp);
      const out: Record<string, Bit> = {};
      problem.outputs.forEach((o) => { out[o] = full[o]; });
      setCustomOut(out);
    } catch (e) { setCustomErr((e as Error).message); }
  }, [code, problem, customIn]);
  const goto = (delta: number) => {
    const i = (problemIdx + delta + VERILOG_PROBLEMS.length) % VERILOG_PROBLEMS.length;
    selectProblem(VERILOG_PROBLEMS[i].id);
  };

  const solvedCount = solved.size;
  const filtered = VERILOG_PROBLEMS.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    const matchD = diffFilter === 'All' || p.difficulty === diffFilter;
    const matchT = !topicFilter || p.tags.includes(topicFilter);
    return matchQ && matchD && matchT;
  });
  const statementParas = problem.statement.split('\n\n');

  const statusDot = running ? 'bg-amber-500' : result ? (result.status === 'pass' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-text-dim';
  const statusText = running ? 'running'
    : result ? (result.status === 'pass' ? 'accepted' : result.status === 'error' ? 'compile error' : `${result.passed}/${result.total} passed`)
      : 'ready';

  // chunky energetic button base
  const raised = 'transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none';

  return (
    <div
      className="flex min-h-[100svh] w-full flex-col overflow-y-auto bg-bg-void text-text-main lg:h-screen lg:overflow-hidden"
      // De-purple: on this page the light-mode background is a neutral IDE slate,
      // not the global lavender. Dark mode is already neutral.
      style={{
        ...(isLight ? { ['--bg-void']: '#E9EDF3' } : {}),
        ['--vj-pw']: `${problemW}px`,
        ['--vj-ew']: `${editorW}px`,
        ['--vj-ch']: `${consoleH}px`,
      } as React.CSSProperties}
    >
      {/* ── Header ── */}
      <header className="relative z-30 flex h-14 shrink-0 items-center gap-2.5 border-b border-border-soft bg-bg-elev px-3 lg:px-4">
        <button onClick={() => navigate('/portal')} title="Back to portal"
          className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-text-dim transition-colors hover:bg-white/5 hover:text-text-main">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden text-[13px] font-bold lg:inline">Portal</span>
        </button>

        <Sep className="h-6" />

        <div className="flex items-center gap-2.5">
          <Monogram />
          <div className="hidden leading-tight sm:block">
            <div className="text-[14px] font-bold tracking-tight text-text-main">Verilog Bench</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-500/80">bitforbytes</div>
          </div>
        </div>

        {/* problem selector */}
        <div className="relative ml-1 sm:ml-2">
          <div className="flex items-center rounded-xl border border-border-soft bg-bg-void">
            <button onClick={() => goto(-1)} title="Previous problem"
              className="flex h-9 w-7 items-center justify-center text-text-dim transition-colors hover:text-text-main">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPickerOpen((o) => !o)}
              className="flex h-9 items-center gap-2 border-x border-border-soft px-2.5 text-[13px] font-bold transition-colors hover:bg-white/5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: DIFF_COLOR[problem.difficulty] }} />
              <span className="font-mono text-[12px] text-text-dim">{String(problem.number).padStart(2, '0')}</span>
              <span className="max-w-[34vw] truncate sm:max-w-[200px]">{problem.title}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-text-dim transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => goto(1)} title="Next problem"
              className="flex h-9 w-7 items-center justify-center text-text-dim transition-colors hover:text-text-main">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-6 top-full z-20 mt-1.5 flex max-h-[78vh] w-[330px] flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-elev shadow-xl"
                >
                  {/* search + difficulty filters */}
                  <div className="shrink-0 border-b border-border-soft p-2.5">
                    <input
                      value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
                      placeholder="Search problems or tags…"
                      className="w-full rounded-lg border border-border-soft bg-bg-void px-2.5 py-1.5 text-[12px] text-text-main outline-none placeholder:text-text-dim focus:border-emerald-500"
                    />
                    <div className="mt-2 flex items-center gap-1">
                      {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                        <button key={d} onClick={() => setDiffFilter(d)}
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${diffFilter === d ? 'bg-emerald-500 text-black' : 'bg-white/5 text-text-dim hover:text-text-main'}`}>
                          {d}
                        </button>
                      ))}
                      <span className="ml-auto font-mono text-[10px] text-text-dim">{filtered.length}/{VERILOG_PROBLEMS.length}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <button onClick={() => setTopicFilter(null)}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${!topicFilter ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-text-dim hover:text-text-main'}`}>
                        all topics
                      </button>
                      {ALL_TOPICS.map((t) => (
                        <button key={t} onClick={() => setTopicFilter((cur) => (cur === t ? null : t))}
                          className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] transition-colors ${topicFilter === t ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-text-dim hover:text-text-main'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* filtered list */}
                  <ul className="min-h-0 flex-1 overflow-y-auto p-1.5">
                    {filtered.length === 0 && (
                      <li className="px-2.5 py-8 text-center text-[12px] text-text-dim">No problems match.</li>
                    )}
                    {filtered.map((p) => {
                      const isSel = p.id === problem.id;
                      const isSolved = solved.has(p.id);
                      return (
                        <li key={p.id}>
                          <button onClick={() => selectProblem(p.id)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${isSel ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/5'}`}>
                            <span className="w-4 text-center">
                              {isSolved
                                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                : <span className="font-mono text-text-dim">{p.number}</span>}
                            </span>
                            <span className="flex-1 truncate font-bold">{p.title}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: DIFF_COLOR[p.difficulty] }}>
                              {p.difficulty}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* right cluster: progress + theme */}
        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden items-center gap-2 md:flex" title={`${solvedCount} of ${VERILOG_PROBLEMS.length} solved`}>
            <div className="flex items-center gap-[3px]">
              {VERILOG_PROBLEMS.map((p) => (
                <span key={p.id} className={`h-3.5 w-[5px] rounded-[1px] transition-colors ${solved.has(p.id) ? 'bg-emerald-500' : 'bg-border-soft'}`} />
              ))}
            </div>
            <span className="font-mono text-[11px] font-bold text-text-dim">{solvedCount}/{VERILOG_PROBLEMS.length}</span>
          </div>
          {streak.count > 0 && (
            <div className="hidden items-center gap-1 sm:flex" title={`${streak.count}-day solving streak`}>
              <span className="text-[13px] leading-none">🔥</span>
              <span className="font-mono text-[11px] font-bold text-amber-500">{streak.count}</span>
            </div>
          )}
          <Sep className="hidden h-6 md:block" />
          <button onClick={toggleScheme} title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-soft text-text-dim transition-colors hover:text-text-main">
            {isLight ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[auto_1fr] lg:overflow-hidden">
        {/* Problem panel */}
        <AnimatePresence initial={false} mode="popLayout">
          {problemOpen ? (
            <motion.section
              key="problem"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative min-w-0 overflow-y-auto border-b border-border-soft p-5 lg:w-[var(--vj-pw)] lg:border-b-0 lg:border-r lg:p-6"
            >
              {/* drag to resize the problem panel (desktop) */}
              <div
                onPointerDown={dragProblem}
                title="Drag to resize"
                className="absolute right-0 top-0 z-20 hidden h-full w-1.5 cursor-col-resize transition-colors hover:bg-emerald-500/50 lg:block"
              />
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">Problem {String(problem.number).padStart(2, '0')}</span>
                <button onClick={() => setProblemOpen(false)} title="Collapse panel"
                  className="hidden rounded-md p-1 text-text-dim hover:bg-white/5 hover:text-text-main lg:block">
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight lg:text-[22px]">{problem.title}</h2>
                <span className="rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: DIFF_COLOR[problem.difficulty], background: `${DIFF_COLOR[problem.difficulty]}22` }}>
                  {problem.difficulty}
                </span>
                {solved.has(problem.id) && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              </div>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {problem.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-text-dim">{t}</span>
                ))}
              </div>

              <div className="space-y-3.5 text-[14px] leading-[1.7] text-text-dim">
                {statementParas.map((para, i) => <p key={i} dangerouslySetInnerHTML={{ __html: mdInline(para) }} />)}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <PortCard label="Inputs" names={problem.inputs} accent="#22d3ee" />
                <PortCard label="Outputs" names={problem.outputs} accent="#34d399" />
              </div>

              <div className="mt-5">
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Examples</div>
                <div className="space-y-2">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-lg border border-border-soft bg-bg-elev px-3 py-2 font-mono text-[12px]">
                      <span className="text-cyan-400">{fmtBits(ex.in)}</span>
                      <span className="mx-2 text-text-dim">-&gt;</span>
                      <span className="text-emerald-400">{fmtBits(ex.out)}</span>
                      {ex.note && <span className="ml-3 text-text-dim">// {ex.note}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Always-on reference timing for clocked problems — study the clock
                  before/while coding, independent of any run. */}
              {isSeq(problem) && (
                <div className="mt-5">
                  <SeqWaveform problem={problem} heading="Expected timing" />
                </div>
              )}

              {problem.hint && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => setShowHint((s) => !s)}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[12px] font-bold text-amber-500 transition-colors hover:bg-amber-500/20">
                    <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Hint'}
                  </button>
                </div>
              )}
              <AnimatePresence>
                {showHint && problem.hint && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg bg-amber-500/5 px-3 py-2 text-[13px] text-amber-200/90"
                    dangerouslySetInnerHTML={{ __html: mdInline(problem.hint) }} />
                )}
              </AnimatePresence>
            </motion.section>
          ) : (
            <button
              key="reopen"
              onClick={() => setProblemOpen(true)}
              className="hidden h-full w-9 items-center justify-center border-r border-border-soft bg-bg-elev text-text-dim transition-colors hover:text-emerald-400 lg:flex"
              title="Show problem"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </AnimatePresence>

        {/* Workspace */}
        <section className="flex min-h-0 min-w-0 flex-col lg:overflow-hidden">
          {/* Toolbar */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border-soft bg-bg-elev px-3 py-1.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">design.sv</span>
            <span className="hidden items-center gap-1 font-mono text-[10px] text-text-dim/70 md:flex">
              <kbd className="rounded border border-border-soft px-1 py-px text-[9px]">Ctrl</kbd>
              <span>+</span>
              <kbd className="rounded border border-border-soft px-1 py-px text-[9px]">Enter</kbd>
              <span className="ml-0.5">submit</span>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={resetCode} title="Reset to starter"
                className="flex items-center gap-1.5 rounded-lg border border-border-soft px-2.5 py-1.5 text-[12px] font-bold text-text-dim transition-colors hover:text-text-main">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button onClick={run} disabled={running}
                className={`flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-black shadow-[0_4px_14px_rgba(16,185,129,0.35)] ${raised} hover:bg-emerald-400 disabled:opacity-60`}>
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {running ? 'Judging' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Custom-run bar (combinational problems only): try one input vector without grading */}
          {!isSeq(problem) && (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-soft bg-bg-void px-3 py-1.5 text-[11px]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-text-dim">Custom run</span>
            {problem.inputs.map((n) => {
              const v = customIn[n] ?? 0;
              return (
                <button key={n} onClick={() => setCustomIn((s) => ({ ...s, [n]: (v ? 0 : 1) as Bit }))} title={`toggle ${n}`}
                  className="flex items-center gap-1 rounded-md border border-border-soft px-2 py-0.5 font-mono transition-colors hover:border-emerald-500">
                  <span className="text-cyan-400">{n}</span>
                  <span className={v ? 'font-bold text-emerald-400' : 'text-text-dim'}>{v}</span>
                </button>
              );
            })}
            <button onClick={runCustom}
              className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-400 transition-colors hover:bg-emerald-500/25">
              Run &rsaquo;
            </button>
            {customErr && <span className="font-mono text-rose-400">{customErr}</span>}
            {customOut && !customErr && (
              <span className="ml-1 font-mono text-text-dim">
                &rarr;
                {problem.outputs.map((o) => (
                  <span key={o} className="ml-2"><span className="text-emerald-400">{o}</span>=<span className="font-bold text-text-main">{customOut[o]}</span></span>
                ))}
              </span>
            )}
          </div>
          )}

          {/* Editor | Synth schematic */}
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[var(--vj-ew)_1fr]">
            <div className="relative h-[44vh] min-h-[260px] lg:h-auto lg:min-h-0">
              {/* drag to resize editor vs schematic (desktop) */}
              <div
                onPointerDown={dragEditor}
                title="Drag to resize"
                className="absolute right-0 top-0 z-20 hidden h-full w-1.5 cursor-col-resize transition-colors hover:bg-emerald-500/50 lg:block"
              />
              <Editor
                height="100%"
                language="verilog"
                theme={isLight ? 'light' : 'vs-dark'}
                value={code}
                onChange={onCodeChange}
                beforeMount={registerVerilog}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
                }}
                options={{
                  fontSize: 13.5,
                  fontFamily: "'IBM Plex Mono','Roboto Mono',monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'line',
                }}
              />
            </div>
            <div className="h-[48vh] min-h-[300px] border-t border-border-soft lg:h-auto lg:min-h-0 lg:border-l lg:border-t-0">
              <SynthSchematicView code={debounced} isLight={isLight} onDiagnostics={applyDiagnostics} />
            </div>
          </div>

          {/* Results drawer */}
          <ResultsDrawer open={resultsOpen} setOpen={setResultsOpen} result={result} problem={problem} running={running} onResizeStart={dragConsole} />
        </section>
      </div>

      {/* ── Status bar ── */}
      <footer className="hidden h-7 shrink-0 items-center gap-2.5 border-t border-border-soft bg-bg-elev px-3 font-mono text-[11px] text-text-dim sm:flex">
        <span className="flex items-center gap-1.5 font-bold">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
          {statusText}
        </span>
        <Sep />
        <span className="flex items-center gap-1 text-emerald-500/80"><Zap className="h-3 w-3" /> bitforbytes</span>
        <span className="ml-auto">{problem.inputs.length} in &middot; {problem.outputs.length} out</span>
        <Sep className="hidden md:block" />
        <span className="hidden font-bold md:inline" style={{ color: DIFF_COLOR[problem.difficulty] }}>{problem.difficulty}</span>
        <Sep className="hidden lg:block" />
        <span className="hidden lg:inline">{isLight ? 'light' : 'dark'}</span>
      </footer>

      {/* Verified stamp */}
      <AnimatePresence>{celebrate && <VerifiedStamp total={passTotal} />}</AnimatePresence>
    </div>
  );
};

// ─── results drawer ──────────────────────────────────────────────────────────
const ResultsDrawer: React.FC<{
  open: boolean; setOpen: (b: boolean) => void;
  result: GradeResult | null; problem: AnyProblem; running: boolean;
  onResizeStart: (e: React.PointerEvent) => void;
}> = ({ open, setOpen, result, problem, running, onResizeStart }) => {
  const passed = result?.status === 'pass';
  const summary = running ? 'Compiling & simulating...'
    : !result ? 'Run to grade your design'
      : result.status === 'error' ? 'Compile error'
        : passed ? 'Accepted - every case passed'
          : `${result.passed}/${result.total} cases passed`;
  const tone = running ? 'text-text-dim'
    : !result ? 'text-text-dim'
      : result.status === 'error' || result.status === 'fail' ? 'text-rose-400'
        : 'text-emerald-400';

  return (
    <div className="shrink-0 border-t border-border-soft bg-bg-elev">
      {/* drag to resize the console height (desktop) */}
      {open && (
        <div
          onPointerDown={onResizeStart}
          title="Drag to resize"
          className="hidden h-1.5 w-full cursor-row-resize transition-colors hover:bg-emerald-500/50 lg:block"
        />
      )}
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">Console</span>
        <span className={`flex items-center gap-1.5 text-[12px] font-bold ${tone}`}>
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : passed ? <CheckCircle2 className="h-3.5 w-3.5" />
              : result ? <XCircle className="h-3.5 w-3.5" /> : null}
          {summary}
        </span>
        <span className="ml-auto text-text-dim">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="max-h-[42vh] overflow-y-auto border-t border-border-soft lg:max-h-none lg:h-[var(--vj-ch)]">
              <ResultsPanel result={result} problem={problem} running={running} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── sub-components ──────────────────────────────────────────────────────────
const PortCard: React.FC<{ label: string; names: string[]; accent: string }> = ({ label, names, accent }) => (
  <div className="rounded-lg border border-border-soft bg-bg-elev p-3">
    <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">{label}</div>
    <div className="flex flex-wrap gap-1.5">
      {names.map((n) => (
        <span key={n} className="rounded-md px-2 py-0.5 font-mono text-[12px] font-bold"
          style={{ color: accent, background: `${accent}22` }}>{n}</span>
      ))}
    </div>
  </div>
);

/**
 * SeqWaveform — a digital timing diagram for the sequential (flip-flop) tier.
 *
 * Reading a column of 0s and 1s makes it very hard to feel the *clock*. This
 * draws the actual waves so the edge-triggered story is obvious:
 *   • clk rises in the middle of every cycle (▲) — that is the sampling instant.
 *   • data inputs (and reset) are held across the whole cycle, so they are
 *     stable through the rising edge that samples them.
 *   • registered outputs change exactly ON the ▲ — the value captured at the
 *     edge appears right after it and holds until the next edge.
 * The GOLDEN timing is computed straight from the problem, so it renders even
 * before a run, on a compile error, or on a wrong answer. When a graded result
 * is available the student's own output is overlaid dashed in red and the
 * mismatching cycles are banded, so where their waveform diverges is visible.
 */
const SeqWaveform: React.FC<{ problem: AnyProblem; rows?: GradeResult['rows'] | null; heading?: string }> = ({ problem, rows, heading }) => {
  if (!isSeq(problem) || problem.vectors.length === 0) return null;

  const N = problem.vectors.length;
  const LW = 68;   // left label gutter
  const W = 48;    // per-cycle width
  const ROW = 38;  // per-signal row height (tall enough for a value digit)
  const AXIS = 22; // top strip for cycle numbers + ▲

  // Golden next-state sequence — independent of the student's code.
  let gState: Record<string, Bit> = {};
  for (const r of problem.regOutputs) gState[r] = 0;
  const expected = problem.vectors.map((vec) => { const nx = problem.step(gState, vec); gState = nx; return nx; });

  const got = rows && rows.length === N ? rows : null;
  const failCycles = new Set<number>();
  if (got) got.forEach((r, i) => { if (!r.pass) failCycles.add(i); });
  const fail = failCycles.size > 0;

  const bit = (v: Bit | undefined) => (v ? 1 : 0);
  type Sig = { label: string; color: string; kind: 'clk' | 'level' | 'reg'; dashed?: boolean; values: number[] };
  const sigs: Sig[] = [];
  sigs.push({ label: problem.clock, color: '#f59e0b', kind: 'clk', values: [] });
  if (problem.reset) sigs.push({ label: problem.reset, color: '#fb7185', kind: 'level', values: problem.vectors.map((v) => bit(v[problem.reset!])) });
  for (const d of problem.dataInputs) sigs.push({ label: d, color: '#22d3ee', kind: 'level', values: problem.vectors.map((v) => bit(v[d])) });
  for (const o of problem.regOutputs) sigs.push({ label: o, color: '#10b981', kind: 'reg', values: expected.map((e) => bit(e[o])) });
  if (fail && got) for (const o of problem.regOutputs) sigs.push({ label: `${o} (yours)`, color: '#f43f5e', kind: 'reg', dashed: true, values: got.map((r) => (r.got ? bit(r.got[o]) : 0)) });

  const totalW = LW + N * W + 10;
  const totalH = AXIS + sigs.length * ROW + 8;
  const xAt = (i: number) => LW + i * W;
  const toPts = (pts: number[][]) => pts.map((p) => `${p[0]},${p[1]}`).join(' ');

  const rowPoints = (s: Sig, hi: number, lo: number): number[][] => {
    const lv = (v: number) => (v ? hi : lo);
    const pts: number[][] = [];
    if (s.kind === 'clk') {
      for (let i = 0; i < N; i++) {
        const x0 = xAt(i), xm = x0 + W / 2, x1 = xAt(i + 1);
        pts.push([x0, lo], [xm, lo], [xm, hi], [x1, hi]);
      }
    } else if (s.kind === 'reg') {
      // registered: starts at 0, transitions at each mid-cycle rising edge
      let prev = 0;
      pts.push([xAt(0), lv(prev)]);
      for (let i = 0; i < N; i++) {
        const xm = xAt(i) + W / 2;
        pts.push([xm, lv(prev)], [xm, lv(s.values[i])]);
        prev = s.values[i];
      }
      pts.push([xAt(N), lv(prev)]);
    } else {
      // level: held across the whole cycle, transitions at cycle boundaries
      for (let i = 0; i < N; i++) { const y = lv(s.values[i]); pts.push([xAt(i), y], [xAt(i + 1), y]); }
    }
    return pts;
  };

  return (
    <div className="mb-3 rounded-lg border border-border-soft bg-bg-void/40 p-3">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">{heading ?? 'Timing diagram'}</span>
        <span className="font-mono text-[10px] text-text-dim"><span className="text-amber-500">▲</span> rising edge — inputs sampled, outputs update · 0/1 shown per cycle</span>
      </div>
      <div className="overflow-x-auto">
        <svg width={totalW} height={totalH} className="text-text-dim" role="img" aria-label="Clock timing diagram">
          {/* mismatch bands + per-cycle rising-edge guides */}
          {Array.from({ length: N }, (_, i) => {
            const xm = xAt(i) + W / 2;
            const bad = failCycles.has(i);
            return (
              <g key={`g${i}`}>
                {bad && <rect x={xAt(i)} y={AXIS} width={W} height={totalH - AXIS - 4} fill="#f43f5e" opacity={0.08} />}
                <line x1={xm} y1={AXIS} x2={xm} y2={totalH - 4} stroke={bad ? '#f43f5e' : 'currentColor'} strokeOpacity={bad ? 0.45 : 0.12} strokeWidth={1} strokeDasharray="3 3" />
                <text x={xm} y={AXIS - 8} textAnchor="middle" className="fill-current" fontSize={10} opacity={0.6}>{i}</text>
                <text x={xm} y={AXIS - 0.5} textAnchor="middle" fontSize={9} fill="#f59e0b">▲</text>
              </g>
            );
          })}
          {/* signals */}
          {sigs.map((s, r) => {
            const yTop = AXIS + r * ROW;
            const hi = yTop + 9, lo = yTop + ROW - 11;
            const digitY = yTop + ROW / 2 + 1;
            // reg values settle after the mid-cycle edge → label their held half;
            // level/input values hold the whole cycle → label the cell centre.
            const digitX = (i: number) => xAt(i) + (s.kind === 'reg' ? W * 0.75 : W / 2);
            return (
              <g key={s.label}>
                <text x={LW - 10} y={yTop + ROW / 2} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={s.color} className="font-mono font-bold">{s.label}</text>
                <line x1={LW} y1={lo} x2={xAt(N)} y2={lo} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
                <polyline points={toPts(rowPoints(s, hi, lo))} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '4 3' : undefined} opacity={s.dashed ? 0.95 : 1} />
                {s.kind !== 'clk' && s.values.map((v, i) => (
                  <text key={i} x={digitX(i)} y={digitY} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={s.color} className="font-mono">{v}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const ResultsPanel: React.FC<{ result: GradeResult | null; problem: AnyProblem; running: boolean }> = ({ result, problem, running }) => {
  const seq = isSeq(problem);
  // The timing diagram shows the golden clock behaviour for every sequential
  // problem — before a run, on a compile error, and on a wrong answer — with the
  // student's trace overlaid only once it has been graded.
  const wave = seq ? <SeqWaveform problem={problem} rows={result && result.status !== 'error' ? result.rows : null} /> : null;

  if (running) {
    return <div className="flex items-center gap-2 p-4 text-[13px] text-text-dim"><Loader2 className="h-4 w-4 animate-spin" /> Compiling &amp; simulating every input combination...</div>;
  }
  if (!result) {
    return (
      <div className="p-3">
        {wave}
        <p className="px-1 pt-1 text-[13px] leading-relaxed text-text-dim">Hit <span className="font-bold text-text-main">Submit</span> to grade your module against the full test set. As you type, the synthesized circuit on the right shows exactly what your code builds - poke its wires to see values flow.</p>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="p-3">
        {wave}
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-rose-400">
          <AlertTriangle className="h-4 w-4" /> Compile error
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 font-mono text-[12px] text-rose-300">{result.error}</pre>
      </div>
    );
  }

  const passed = result.status === 'pass';
  const inCols = isSeq(problem) ? (problem.reset ? [problem.reset, ...problem.dataInputs] : problem.dataInputs) : problem.inputs;
  const outCols = problem.outputs;
  return (
    <div className="p-3">
      <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold ${passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
        {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {passed
          ? (seq ? 'Accepted - every clock cycle matched' : 'Accepted - all cases passed')
          : `${result.passed}/${result.total} ${seq ? 'cycles' : 'cases'} passed`}
      </div>
      {wave}
      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr className="bg-bg-void text-text-dim">
              {seq && <th className="px-3 py-1.5 text-left font-bold">cyc</th>}
              {inCols.map((c) => <th key={c} className="px-3 py-1.5 text-left font-bold text-cyan-400">{c}</th>)}
              {outCols.map((c) => <th key={c} className="px-3 py-1.5 text-left font-bold text-emerald-400">{c}</th>)}
              <th className="px-3 py-1.5 text-left font-bold">got</th>
              <th className="px-3 py-1.5 text-center font-bold">ok</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} className={`border-t border-border-soft ${row.pass ? '' : 'bg-rose-500/[0.06]'}`}>
                {seq && <td className="px-3 py-1 text-text-dim">{row.cycle}</td>}
                {inCols.map((c) => <td key={c} className="px-3 py-1 text-cyan-300">{row.in[c] ?? 0}</td>)}
                {outCols.map((c) => <td key={c} className="px-3 py-1 text-emerald-300">{row.expected[c]}</td>)}
                <td className="px-3 py-1">
                  {row.got ? outCols.map((c) => (
                    <span key={c} className={row.got![c] === row.expected[c] ? 'text-text-dim' : 'font-bold text-rose-400'}>{row.got![c]} </span>
                  )) : <span className="text-rose-400">x</span>}
                </td>
                <td className="px-3 py-1 text-center">
                  {row.pass ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="mx-auto h-3.5 w-3.5 text-rose-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── "Accepted" confirmation (shown on a pass) — sharp + restrained ─────────
const VerifiedStamp: React.FC<{ total: number }> = ({ total }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="pointer-events-none fixed inset-0 z-[100] grid place-items-center"
  >
    {/* one clean pulse ring */}
    <motion.span
      className="absolute h-36 w-56 rounded-2xl border border-emerald-400/60"
      initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    />
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 6 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-emerald-500/50 bg-bg-elev px-8 py-5 shadow-[0_20px_60px_-12px_rgba(16,185,129,0.45)]"
    >
      <div className="flex items-center gap-2.5">
        <BadgeCheck className="h-6 w-6 text-emerald-400" />
        <span className="text-[19px] font-bold tracking-tight text-emerald-400">Accepted</span>
      </div>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-text-dim">All {total} test cases passed · BitForBytes</span>
    </motion.div>
  </motion.div>
);

// ─── tiny helpers ────────────────────────────────────────────────────────────
/** Render the inline `code` spans in problem prose; everything else is escaped. */
function mdInline(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-emerald-300">$1</code>');
}

const fmtBits = (rec: Record<string, number>): string =>
  Object.entries(rec).map(([k, v]) => `${k}=${v}`).join(', ');

export default VerilogJudge;
