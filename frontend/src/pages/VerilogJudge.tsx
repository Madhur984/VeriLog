/**
 * VerilogJudge - the BitforBytes Verilog bench. Write Verilog, watch the real
 * Yosys-synthesized circuit draw itself beside the code (and probe it live), then
 * Submit to grade differentially against the problem's reference design.
 *
 * Grading runs the student's netlist and the reference netlist over identical
 * seeded stimulus and diffs them (engine/verilog/diffGrade), so the results
 * drawer can show both a per-vector table and a real timing diagram with the
 * golden waveform overlaid. Solid, energetic UI - no glass.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ArrowLeft, Play, RotateCcw, Lightbulb, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, BadgeCheck, Zap, BookOpen, Activity, Table2,
  Command as CommandIcon, Contrast, Palette, Eraser, Search, FlaskConical,
} from 'lucide-react';
import { useColorScheme, useThemeVariant, type ThemeVariant } from '../hooks/useColorScheme';
import {
  VERILOG_V2_PROBLEMS, TRACKS, isSequential,
  type VProblemV2, type Difficulty, type TrackId, type VPort,
} from '../data/verilog';
import { gradeV2, type DiffGradeResult } from '../engine/verilog/gradeV2';
import { SynthSchematicView } from '../components/verilog/SynthSchematicView';
import { WaveformViewer } from '../components/verilog/WaveformViewer';
import { VerdictBadge, VerdictCaveat } from '../components/verilog/VerdictBadge';
import { CommandPalette, type Command } from '../components/verilog/CommandPalette';
import { CustomRunPanel } from '../components/verilog/CustomRunPanel';
import type { SynthProgress } from '../engine/verilog/yosysClient';
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

const SOLVED_KEY = 'vj_solved_v2';
const codeKey = (id: string) => `vj2_code_${id}`;

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#f43f5e',
};

const trackOf = (id: TrackId) => TRACKS.find((t) => t.id === id);

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
      'case', 'casez', 'casex', 'endcase', 'default', 'posedge', 'negedge',
      'parameter', 'localparam', 'generate', 'endgenerate', 'genvar', 'integer',
      'for', 'while', 'function', 'endfunction', 'task', 'endtask', 'signed',
      'and', 'or', 'not', 'nand', 'nor', 'xor', 'xnor', 'buf',
    ],
    tokenizer: {
      root: [
        [/\/\/.*/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/\b\d+'[bBoOdDhH][0-9a-fA-FxXzZ_]+/, 'number'],
        [/\b\d+\b/, 'number'],
        [/\$\w+/, 'keyword'],
        [/[A-Za-z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        [/[~!&|^?:=<>+\-*/%]/, 'operator'],
      ],
      comment: [[/[^/*]+/, 'comment'], [/\*\//, 'comment', '@pop'], [/[/*]/, 'comment']],
    },
  });
}

const loadSolved = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) || '[]')); }
  catch { return new Set(); }
};

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

  const [problemId, setProblemId] = useState<string>(VERILOG_V2_PROBLEMS[0].id);
  const problem = useMemo(() => VERILOG_V2_PROBLEMS.find((p) => p.id === problemId)!, [problemId]);
  const problemIdx = useMemo(() => VERILOG_V2_PROBLEMS.findIndex((p) => p.id === problemId), [problemId]);

  const [code, setCode] = useState<string>(() => localStorage.getItem(codeKey(problem.id)) ?? problem.starter);
  const [result, setResult] = useState<DiffGradeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<SynthProgress | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<'All' | Difficulty>('All');
  const [trackFilter, setTrackFilter] = useState<TrackId | null>(null);
  const [solved, setSolved] = useState<Set<string>>(loadSolved);
  const [streak, setStreak] = useState<Streak>(loadStreak);
  const [problemOpen, setProblemOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultTab, setResultTab] = useState<'run' | 'tests' | 'wave'>('run');
  const [passTotal, setPassTotal] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [variant, setVariant] = useThemeVariant();
  const runSeq = useRef(0);

  // Drag-resizable panels (desktop): problem-panel width, editor↔schematic split,
  // and console height. Persisted; clamped so no panel can be squeezed away.
  const [problemW, dragProblem] = useResizable('bfb_vj_problem_w', 380, 260, () => Math.min(680, window.innerWidth * 0.5), 'x', 1);
  const [editorW, dragEditor] = useResizable('bfb_vj_editor_w', 560, 320, () => window.innerWidth - 420, 'x', 1);
  const [consoleH, dragConsole] = useResizable('bfb_vj_console_h', 300, 140, () => window.innerHeight * 0.7, 'y', -1);

  // debounced source feeds the live Yosys schematic
  const [debounced, setDebounced] = useState(code);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(code), 240);
    return () => clearTimeout(t);
  }, [code]);

  const selectProblem = useCallback((id: string) => {
    setProblemId(id);
    const p = VERILOG_V2_PROBLEMS.find((x) => x.id === id)!;
    const saved = localStorage.getItem(codeKey(id)) ?? p.starter;
    setCode(saved);
    setDebounced(saved);
    setResult(null);
    setResultsOpen(false);
    setShowHint(false);
    setShowEditorial(false);
    setPickerOpen(false);
  }, []);

  const onCodeChange = (v: string | undefined) => {
    const next = v ?? '';
    setCode(next);
    try { localStorage.setItem(codeKey(problem.id), next); } catch { /* quota */ }
  };

  const run = useCallback(async () => {
    const seq = ++runSeq.current;
    setRunning(true);
    setResult(null);
    setProgress(null);
    setResultsOpen(true);
    try {
      const r = await gradeV2(problem, code, (p) => {
        if (runSeq.current === seq) setProgress(p);
      });
      // A newer run superseded this one — drop the stale result.
      if (runSeq.current !== seq) return;
      setResult(r);
      setResultTab(r.status !== 'pass' && r.firstFailure !== undefined ? 'wave' : 'tests');
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
    } finally {
      if (runSeq.current === seq) { setRunning(false); setProgress(null); }
    }
  }, [problem, code, solved]);

  const runRef = useRef(run);
  useEffect(() => { runRef.current = run; }, [run]);

  // Monaco handles so we can mark exactly which line/signal Yosys flagged.
  const editorRef = useRef<Parameters<NonNullable<React.ComponentProps<typeof Editor>['onMount']>>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const applyDiagnostics = useCallback((ds: Diag[]) => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;
    const src = model.getValue();
    // Benign 'note' diagnostics (e.g. array inferred as flip-flops) must not
    // mark the editor — they aren't design problems and the squiggles read as errors.
    const markers = ds.filter((d) => d.severity !== 'note').map((d) => {
      const rawLine = d.line ?? (d.signal ? lineOfSignal(src, d.signal) : undefined) ?? 1;
      // Diagnostics come from a slightly older (debounced) source, so a line can
      // be out of range if the user just deleted lines — clamp so getLineContent
      // never throws (which would freeze the schematic mid-callback).
      const line = Math.min(Math.max(1, rawLine), model.getLineCount());
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

  const goto = (delta: number) => {
    const i = (problemIdx + delta + VERILOG_V2_PROBLEMS.length) % VERILOG_V2_PROBLEMS.length;
    selectProblem(VERILOG_V2_PROBLEMS[i].id);
  };

  // Latest-value refs so the command list keeps a stable identity — rebuilding
  // 100+ commands on every keystroke would make the palette stutter.
  const resetCodeRef = useRef(resetCode);
  const gotoRef = useRef(goto);
  const selectProblemRef = useRef(selectProblem);
  useEffect(() => {
    resetCodeRef.current = resetCode;
    gotoRef.current = goto;
    selectProblemRef.current = selectProblem;
  });

  /**
   * Command registry (§5.3). Every top-bar action, every panel toggle, every
   * theme, and every problem in the bank — so the whole app is reachable
   * without the mouse and without knowing where a control lives on screen.
   */
  const commands = useMemo<Command[]>(() => {
    const acts: Command[] = [
      { id: 'run', label: 'Submit — grade this design', section: 'Run', shortcut: '⌘↵',
        icon: Play, keywords: 'test check verify', run: () => runRef.current() },
      { id: 'reset', label: 'Reset code to the starter', section: 'Run',
        icon: Eraser, keywords: 'clear revert', run: () => resetCodeRef.current() },
      { id: 'next', label: 'Next problem', section: 'Navigate',
        icon: ChevronRight, run: () => gotoRef.current(1) },
      { id: 'prev', label: 'Previous problem', section: 'Navigate',
        icon: ChevronLeft, run: () => gotoRef.current(-1) },
      { id: 'search', label: 'Browse all problems', section: 'Navigate',
        icon: Search, keywords: 'picker list find', run: () => setPickerOpen(true) },
      { id: 'jump-fail', label: 'Jump to the first failing cycle', section: 'Results',
        icon: AlertTriangle, keywords: 'divergence mismatch waveform',
        run: () => { setResultsOpen(true); setResultTab('wave'); } },
      { id: 'tab-run', label: 'Open the custom run bench', section: 'Results',
        icon: FlaskConical, keywords: 'try drive inputs probe test custom vector',
        run: () => { setResultsOpen(true); setResultTab('run'); } },
      { id: 'tab-tests', label: 'Show the results table', section: 'Results',
        icon: Table2, run: () => { setResultsOpen(true); setResultTab('tests'); } },
      { id: 'tab-wave', label: 'Show the waveform', section: 'Results',
        icon: Activity, run: () => { setResultsOpen(true); setResultTab('wave'); } },
      { id: 'toggle-problem', label: 'Toggle the problem panel', section: 'Panel',
        icon: PanelLeftClose, run: () => setProblemOpen((v) => !v) },
      { id: 'toggle-console', label: 'Toggle the console drawer', section: 'Panel',
        icon: ChevronUp, run: () => setResultsOpen((v) => !v) },
      { id: 'hint', label: 'Show the hint', section: 'Help',
        icon: Lightbulb, run: () => setShowHint(true) },
      { id: 'editorial', label: 'Open the editorial', section: 'Help',
        icon: BookOpen, keywords: 'solution explanation', run: () => setShowEditorial(true) },
      { id: 'theme-scheme', label: isLight ? 'Switch to dark mode' : 'Switch to light mode',
        section: 'Theme', icon: isLight ? Moon : Sun, run: toggleScheme },
    ];
    const variants: { id: ThemeVariant; label: string; icon: typeof Contrast }[] = [
      { id: 'standard', label: 'Theme: standard', icon: Palette },
      { id: 'high-contrast', label: 'Theme: high contrast', icon: Contrast },
      { id: 'amber', label: 'Theme: amber / CRT', icon: Palette },
    ];
    for (const v of variants) {
      if (v.id === variant) continue;
      acts.push({ id: `variant-${v.id}`, label: v.label, section: 'Theme',
        icon: v.icon, keywords: 'accessibility colour color', run: () => setVariant(v.id) });
    }
    for (const p of VERILOG_V2_PROBLEMS) {
      acts.push({
        id: `p-${p.id}`,
        label: `${p.number} · ${p.title}`,
        section: trackOf(p.track)?.title ?? 'Problem',
        keywords: `${p.moduleName} ${p.tags.join(' ')} ${p.difficulty}`,
        run: () => selectProblemRef.current(p.id),
      });
    }
    return acts;
  }, [isLight, toggleScheme, variant, setVariant]);

  // ⌘K / Ctrl+K from anywhere, including inside Monaco.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const solvedCount = solved.size;
  const filtered = VERILOG_V2_PROBLEMS.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
      || p.moduleName.toLowerCase().includes(q);
    const matchD = diffFilter === 'All' || p.difficulty === diffFilter;
    const matchT = !trackFilter || p.track === trackFilter;
    return matchQ && matchD && matchT;
  });
  const statementParas = problem.statement.split('\n\n');
  const track = trackOf(problem.track);
  const isSolved = solved.has(problem.id);

  const statusDot = running ? 'bg-amber-500' : result ? (result.status === 'pass' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-text-dim';
  const statusText = running ? 'running'
    : result ? (result.status === 'pass' ? 'accepted' : result.status === 'error' ? 'compile error' : `${result.passed}/${result.total} passed`)
      : 'ready';

  // chunky energetic button base
  const raised = 'transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none';

  return (
    <div
      className="vj-scope flex min-h-[100svh] w-full flex-col overflow-y-auto bg-bg-void text-text-main lg:h-screen lg:overflow-hidden"
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
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-text-dim transition-colors hover:bg-white/5 hover:text-text-main">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden text-[13px] font-bold lg:inline">Portal</span>
        </button>

        {/* Wordmark is dropped below sm: on a 360px phone the row only has room
            for back + problem picker + theme, and anything more crushes them. */}
        <Sep className="hidden h-6 sm:block" />

        <div className="hidden items-center gap-2.5 sm:flex">
          <Monogram />
          <div className="hidden leading-tight sm:block">
            <div className="text-[14px] font-bold tracking-tight text-text-main">Verilog Bench</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-500/80">bitforbytes</div>
          </div>
        </div>

        {/* problem selector */}
        <div className="relative ml-1 min-w-0 sm:ml-2">
          <div className="flex items-center rounded-xl border border-border-soft bg-bg-void">
            <button onClick={() => goto(-1)} title="Previous problem"
              className="flex h-9 w-7 shrink-0 items-center justify-center text-text-dim transition-colors hover:text-text-main">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPickerOpen((o) => !o)}
              className="flex h-9 min-w-0 items-center gap-2 border-x border-border-soft px-2.5 text-[13px] font-bold transition-colors hover:bg-white/5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: DIFF_COLOR[problem.difficulty] }} />
              <span className="shrink-0 font-mono text-[12px] text-text-dim">{String(problem.number).padStart(2, '0')}</span>
              <span className="max-w-[26vw] truncate sm:max-w-[200px]">{problem.title}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-text-dim transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => goto(1)} title="Next problem"
              className="flex h-9 w-7 shrink-0 items-center justify-center text-text-dim transition-colors hover:text-text-main">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                {/* Phone: a viewport-anchored sheet under the header — a 360px
                    panel offset from this button runs off the right edge of a
                    360px screen. sm+ keeps the original anchored dropdown. */}
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-x-2 top-[60px] z-30 flex max-h-[calc(100svh_-_76px)] w-auto flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-elev shadow-xl sm:absolute sm:inset-x-auto sm:left-6 sm:top-full sm:z-20 sm:mt-1.5 sm:max-h-[78vh] sm:w-[360px]"
                >
                  {/* search + difficulty + track filters */}
                  <div className="shrink-0 border-b border-border-soft p-2.5">
                    <input
                      value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
                      placeholder="Search problems, tags or module names…"
                      className="w-full rounded-lg border border-border-soft bg-bg-void px-2.5 py-1.5 text-[12px] text-text-main outline-none placeholder:text-text-dim focus:border-emerald-500"
                    />
                    <div className="mt-2 flex items-center gap-1">
                      {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                        <button key={d} onClick={() => setDiffFilter(d)}
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${diffFilter === d ? 'bg-emerald-500 text-black' : 'bg-white/5 text-text-dim hover:text-text-main'}`}>
                          {d}
                        </button>
                      ))}
                      <span className="ml-auto font-mono text-[10px] text-text-dim">{filtered.length}/{VERILOG_V2_PROBLEMS.length}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <button onClick={() => setTrackFilter(null)}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${!trackFilter ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-text-dim hover:text-text-main'}`}>
                        all tracks
                      </button>
                      {TRACKS.map((t) => {
                        const n = VERILOG_V2_PROBLEMS.filter((p) => p.track === t.id).length;
                        if (!n) return null;
                        const on = trackFilter === t.id;
                        return (
                          <button key={t.id} onClick={() => setTrackFilter((cur) => (cur === t.id ? null : t.id))}
                            title={t.blurb}
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors"
                            style={on
                              ? { background: `${t.accent}28`, color: t.accent }
                              : { background: 'rgba(255,255,255,0.05)' }}>
                            <span style={on ? undefined : { color: 'var(--text-dim, #94a3b8)' }}>{t.title}</span>
                            <span className="ml-1 font-mono opacity-70">{n}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* filtered list */}
                  <ul className="min-h-0 flex-1 overflow-y-auto p-1.5">
                    {filtered.length === 0 && (
                      <li className="px-2.5 py-8 text-center text-[12px] text-text-dim">No problems match.</li>
                    )}
                    {filtered.map((p) => {
                      const isSel = p.id === problem.id;
                      const done = solved.has(p.id);
                      const tk = trackOf(p.track);
                      return (
                        <li key={p.id}>
                          <button onClick={() => selectProblem(p.id)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${isSel ? 'bg-emerald-500/15 text-emerald-300' : 'hover:bg-white/5'}`}>
                            <span className="w-4 text-center">
                              {done
                                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                : <span className="font-mono text-text-dim">{p.number}</span>}
                            </span>
                            <span className="flex-1 truncate font-bold">{p.title}</span>
                            {tk && (
                              <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full sm:block"
                                    style={{ background: tk.accent }} title={tk.title} />
                            )}
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
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <div className="hidden items-center gap-2 md:flex" title={`${solvedCount} of ${VERILOG_V2_PROBLEMS.length} solved`}>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border-soft">
              <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                   style={{ width: `${(solvedCount / VERILOG_V2_PROBLEMS.length) * 100}%` }} />
            </div>
            <span className="font-mono text-[11px] font-bold text-text-dim">{solvedCount}/{VERILOG_V2_PROBLEMS.length}</span>
          </div>
          {streak.count > 0 && (
            <div className="hidden items-center gap-1 sm:flex" title={`${streak.count}-day solving streak`}>
              <span className="text-[13px] leading-none">🔥</span>
              <span className="font-mono text-[11px] font-bold text-amber-500">{streak.count}</span>
            </div>
          )}
          <Sep className="hidden h-6 md:block" />
          {/* Palette affordance — discoverable, since a shortcut nobody knows
              about does not exist (§5.3). */}
          <button onClick={() => setPaletteOpen(true)} title="Command palette (⌘K)"
            aria-label="Open command palette"
            className="hidden h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border-soft px-2 text-text-dim transition-colors hover:text-text-main sm:flex">
            <CommandIcon className="h-3.5 w-3.5" />
            <kbd className="font-mono text-[10px] font-bold">K</kbd>
          </button>
          <button onClick={() => setVariant(variant === 'standard' ? 'high-contrast' : variant === 'high-contrast' ? 'amber' : 'standard')}
            title={`Theme: ${variant} — click to cycle (standard → high contrast → amber)`}
            aria-label={`Theme variant: ${variant}. Click to change.`}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-soft text-text-dim transition-colors hover:text-text-main lg:flex">
            {variant === 'high-contrast' ? <Contrast className="h-4 w-4" />
              : variant === 'amber' ? <Palette className="h-4 w-4 text-amber-500" />
                : <Palette className="h-4 w-4" />}
          </button>
          <button onClick={toggleScheme} title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-soft text-text-dim transition-colors hover:text-text-main">
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
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">
                    Problem {String(problem.number).padStart(2, '0')}
                  </span>
                  {track && (
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                          style={{ color: track.accent, background: `${track.accent}1f` }}>
                      {track.title}
                    </span>
                  )}
                </div>
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
                {isSolved && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              </div>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {problem.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-text-dim">{t}</span>
                ))}
              </div>

              <div className="space-y-3.5 break-words text-[14px] leading-[1.7] text-text-dim">
                {statementParas.map((para, i) => <p key={i} dangerouslySetInnerHTML={{ __html: mdInline(para) }} />)}
              </div>

              {problem.context && (
                <div className="mt-4 rounded-lg border-l-2 border-cyan-500/60 bg-cyan-500/[0.06] py-2.5 pl-3 pr-3">
                  <div className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400/90">Why it matters</div>
                  <p className="text-[13px] leading-[1.65] text-text-dim"
                     dangerouslySetInnerHTML={{ __html: mdInline(problem.context) }} />
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PortCard label="Inputs" ports={problem.inputs} accent="#22d3ee" clock={problem.clock} />
                <PortCard label="Outputs" ports={problem.outputs} accent="#34d399" />
              </div>

              {problem.constraints && problem.constraints.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Rules</div>
                  <ul className="space-y-1.5">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-text-dim">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-text-dim/60" />
                        <span dangerouslySetInnerHTML={{ __html: mdInline(c) }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {problem.examples && problem.examples.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim">Examples</div>
                  <div className="space-y-2">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="rounded-lg border border-border-soft bg-bg-elev px-3 py-2 font-mono text-[12px]">
                        <span className="text-cyan-400">{fmtExample(ex.in)}</span>
                        <span className="mx-2 text-text-dim">-&gt;</span>
                        <span className="text-emerald-400">{fmtExample(ex.out)}</span>
                        {ex.note && <span className="ml-2 block pt-1 text-text-dim sm:ml-3 sm:inline sm:pt-0">// {ex.note}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {problem.hint && (
                  <button onClick={() => setShowHint((s) => !s)}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[12px] font-bold text-amber-500 transition-colors hover:bg-amber-500/20">
                    <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Hint'}
                  </button>
                )}
                {problem.editorial && (
                  <button onClick={() => setShowEditorial((s) => !s)}
                    title={isSolved ? undefined : 'Best read after you have solved it'}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-[12px] font-bold text-indigo-400 transition-colors hover:bg-indigo-500/20">
                    <BookOpen className="h-3.5 w-3.5" /> {showEditorial ? 'Hide editorial' : 'Editorial'}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showHint && problem.hint && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg bg-amber-500/5 px-3 py-2 text-[13px] leading-relaxed text-amber-200/90"
                    dangerouslySetInnerHTML={{ __html: mdInline(problem.hint) }} />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showEditorial && problem.editorial && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg border border-indigo-500/25 bg-indigo-500/[0.06] px-3 py-2.5">
                    {!isSolved && (
                      <div className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-400/70">
                        Spoilers — you have not solved this yet
                      </div>
                    )}
                    <div className="space-y-2.5 text-[13px] leading-[1.7] text-text-dim">
                      {problem.editorial.split('\n\n').map((para, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: mdInline(para) }} />
                      ))}
                    </div>
                  </motion.div>
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
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">
              {problem.moduleName}.v
            </span>
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
              <button onClick={() => void run()} disabled={running}
                className={`flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-black shadow-[0_4px_14px_rgba(16,185,129,0.35)] ${raised} hover:bg-emerald-400 disabled:opacity-60`}>
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {running ? 'Judging' : 'Submit'}
              </button>
            </div>
          </div>

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
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => void runRef.current());
                }}
                options={{
                  fontSize: 13.5,
                  fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
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
          <ResultsDrawer
            open={resultsOpen} setOpen={setResultsOpen}
            result={result} problem={problem} running={running} progress={progress}
            tab={resultTab} setTab={setResultTab} source={debounced}
            isLight={isLight} onResizeStart={dragConsole}
          />
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
        <span className="ml-auto">
          {problem.inputs.length} in &middot; {problem.outputs.length} out
          {isSequential(problem) && <span className="ml-1.5 text-amber-500/80">· clocked</span>}
        </span>
        <Sep className="hidden md:block" />
        <span className="hidden font-bold md:inline" style={{ color: DIFF_COLOR[problem.difficulty] }}>{problem.difficulty}</span>
        <Sep className="hidden lg:block" />
        <span className="hidden lg:inline">{isLight ? 'light' : 'dark'}</span>
      </footer>

      {/* Verified stamp */}
      <AnimatePresence>{celebrate && <VerifiedStamp total={passTotal} />}</AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  );
};

// ─── results drawer ──────────────────────────────────────────────────────────
const ResultsDrawer: React.FC<{
  open: boolean; setOpen: (b: boolean) => void;
  result: DiffGradeResult | null; problem: VProblemV2; running: boolean;
  progress: SynthProgress | null;
  tab: 'run' | 'tests' | 'wave'; setTab: (t: 'run' | 'tests' | 'wave') => void;
  /** Debounced editor contents, for the custom-run bench. */
  source: string;
  isLight: boolean;
  onResizeStart: (e: React.PointerEvent) => void;
}> = ({ open, setOpen, result, problem, running, progress, tab, setTab, source, isLight, onResizeStart }) => {
  const passed = result?.status === 'pass';
  const seq = isSequential(problem);
  const unit = seq ? 'cycles' : 'cases';
  const hasWave = !!result?.trace && result.status !== 'error';

  // The collapsed summary carries the confidence claim, not just pass/fail
  // (§6.1) — the strength of the check is part of the result, not a footnote.
  // Names the Run bench, because a tab only rendered once the drawer is open is
  // invisible to anyone who never opens it.
  const idleText = running ? 'Synthesizing & simulating…'
    : 'Try your own inputs, or Submit to grade';

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
      <div className="flex w-full items-center gap-2 px-3 py-2">
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">Console</span>
          {result && !running ? (
            <span className="flex min-w-0 items-center gap-2">
              <VerdictBadge
                status={result.status}
                kind={result.verdict}
                detail={result.verdictDetail}
                passed={result.passed}
                total={result.total}
                unit={unit}
                size="sm"
              />
              {passed && (
                <span className="hidden truncate md:inline">
                  <VerdictCaveat kind={result.verdict} total={result.total} unit={unit} />
                </span>
              )}
            </span>
          ) : (
            <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-bold text-text-dim">
              {running && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />}
              <span className="truncate">{idleText}</span>
            </span>
          )}
        </button>

        {/* The Run bench is always available — it is the thing you use BEFORE
            submitting, so gating it on having a result would defeat it. */}
        {open && (
          <div className="flex shrink-0 overflow-hidden rounded-md border border-border-soft">
            <button onClick={() => setTab('run')}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${tab === 'run' ? 'bg-emerald-500 text-black' : 'text-text-dim hover:text-text-main'}`}>
              <FlaskConical className="h-3 w-3" /> Run
            </button>
            {hasWave && (
              <>
                <button onClick={() => setTab('tests')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${tab === 'tests' ? 'bg-emerald-500 text-black' : 'text-text-dim hover:text-text-main'}`}>
                  <Table2 className="h-3 w-3" /> Tests
                </button>
                <button onClick={() => setTab('wave')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${tab === 'wave' ? 'bg-emerald-500 text-black' : 'text-text-dim hover:text-text-main'}`}>
                  <Activity className="h-3 w-3" /> Waveform
                </button>
              </>
            )}
          </div>
        )}

        <button onClick={() => setOpen(!open)} className="shrink-0 text-text-dim">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="max-h-[42vh] overflow-hidden border-t border-border-soft lg:h-[var(--vj-ch)] lg:max-h-none">
              {tab === 'run'
                ? <CustomRunPanel problem={problem} source={source} isLight={isLight} />
                : tab === 'wave' && hasWave
                  ? (
                    <WaveformViewer
                      trace={result!.trace!}
                      expectedTrace={result!.expectedTrace}
                      failingCycles={result!.rows.filter((r) => !r.pass).map((r) => r.index)}
                      outputNames={problem.outputs.map((o) => o.name)}
                      focusCycle={result!.firstFailure}
                      isLight={isLight}
                    />
                  )
                  : (
                    <div className="h-full overflow-y-auto">
                      <ResultsPanel result={result} problem={problem} running={running} progress={progress} />
                    </div>
                  )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── sub-components ──────────────────────────────────────────────────────────
const PortCard: React.FC<{ label: string; ports: VPort[]; accent: string; clock?: string }> = ({ label, ports, accent, clock }) => (
  <div className="rounded-lg border border-border-soft bg-bg-elev p-3">
    <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">{label}</div>
    <div className="space-y-1">
      {ports.map((p) => (
        <div key={p.name} className="flex items-baseline gap-2">
          <span className="rounded-md px-2 py-0.5 font-mono text-[12px] font-bold"
            style={{ color: accent, background: `${accent}22` }}>{p.name}</span>
          <span className="shrink-0 font-mono text-[10px] text-text-dim">
            {p.width > 1 ? `[${p.width - 1}:0]` : '1b'}{p.signed ? ' signed' : ''}
          </span>
          {p.name === clock && <span className="font-mono text-[10px] text-amber-500">clk</span>}
          {p.note && <span className="min-w-0 flex-1 truncate text-[11px] text-text-dim" title={p.note}>{p.note}</span>}
        </div>
      ))}
    </div>
  </div>
);

/** Format one signal value against its port width, matching the waveform viewer. */
const valStr = (v: bigint | null | undefined, width: number): string => {
  if (v === null || v === undefined) return 'x';
  if (width === 1) return v.toString();
  return `${width}'h${v.toString(16).toUpperCase()}`;
};

const ResultsPanel: React.FC<{
  result: DiffGradeResult | null; problem: VProblemV2; running: boolean; progress: SynthProgress | null;
}> = ({ result, problem, running, progress }) => {
  const seq = isSequential(problem);
  const inPorts = problem.inputs.filter((i) => i.name !== problem.clock);
  const outPorts = problem.outputs;

  if (running) {
    const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : null;
    return (
      <div className="flex flex-col gap-2 p-4 text-[13px] text-text-dim">
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {pct !== null && pct < 100
            ? `Downloading the Yosys engine — ${pct}% (one time per session)`
            : 'Synthesizing your design and the reference, then simulating both…'}
        </span>
        {pct !== null && pct < 100 && (
          <div className="h-1 w-56 overflow-hidden rounded-full bg-border-soft">
            <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-text-dim">
          Hit <span className="font-bold text-text-main">Submit</span> to grade{' '}
          <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-emerald-300">{problem.moduleName}</code>{' '}
          against the reference design. Your module and the reference are both synthesized and driven with the
          same stimulus, then compared {seq ? 'cycle by cycle' : 'vector by vector'}.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-text-dim">
          As you type, the schematic on the right shows exactly what your code builds — poke its wires to see values flow.
        </p>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-rose-400">
          <AlertTriangle className="h-4 w-4" /> Compile error
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 font-mono text-[12px] text-rose-300">{result.error}</pre>
      </div>
    );
  }

  const passed = result.status === 'pass';
  // A long exhaustive run is unreadable in full — lead with the failures.
  const failing = result.rows.filter((r) => !r.pass);
  const shown = passed ? result.rows.slice(0, 64) : failing.slice(0, 64);
  const hiddenCount = (passed ? result.rows.length : failing.length) - shown.length;

  return (
    <div className="p-3">
      <div className={`mb-3 flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold ${passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
        {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {passed
          ? `Accepted — all ${result.total} ${seq ? 'cycles' : 'cases'} matched the reference`
          : `${result.passed}/${result.total} ${seq ? 'cycles' : 'cases'} passed`}
        {!passed && result.firstFailure !== undefined && (
          <span className="font-mono text-[11px] font-normal opacity-80">
            first mismatch at {seq ? 'cycle' : 'vector'} {result.rows[result.firstFailure].index}
          </span>
        )}
      </div>

      {result.unsupportedCells && result.unsupportedCells.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-300">
          <span className="font-bold">Heads up:</span> your design uses constructs the in-browser simulator does not
          model ({result.unsupportedCells.join(', ')}), so those outputs read as x. Try expressing the same logic
          with synthesizable RTL.
        </div>
      )}

      {!passed && (
        <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">
          Failing {seq ? 'cycles' : 'vectors'}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr className="bg-bg-void text-text-dim">
              <th className="px-3 py-1.5 text-left font-bold">{seq ? 'cyc' : '#'}</th>
              {inPorts.map((c) => <th key={c.name} className="px-3 py-1.5 text-left font-bold text-cyan-400">{c.name}</th>)}
              {outPorts.map((c) => <th key={c.name} className="px-3 py-1.5 text-left font-bold text-emerald-400">{c.name}</th>)}
              <th className="px-3 py-1.5 text-left font-bold">got</th>
              <th className="px-3 py-1.5 text-center font-bold">ok</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.index} className={`border-t border-border-soft ${row.pass ? '' : 'bg-rose-500/[0.06]'}`}>
                <td className="px-3 py-1 text-text-dim">{row.index}</td>
                {inPorts.map((c) => (
                  <td key={c.name} className="whitespace-nowrap px-3 py-1 text-cyan-300">{valStr(row.in[c.name], c.width)}</td>
                ))}
                {outPorts.map((c) => (
                  <td key={c.name} className="whitespace-nowrap px-3 py-1 text-emerald-300">{valStr(row.expected[c.name], c.width)}</td>
                ))}
                <td className="whitespace-nowrap px-3 py-1">
                  {outPorts.map((c) => {
                    const ok = row.got[c.name] === row.expected[c.name];
                    return (
                      <span key={c.name} className={ok ? 'mr-2 text-text-dim' : 'mr-2 font-bold text-rose-400'}>
                        {valStr(row.got[c.name], c.width)}
                      </span>
                    );
                  })}
                </td>
                <td className="px-3 py-1 text-center">
                  {row.pass ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="mx-auto h-3.5 w-3.5 text-rose-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenCount > 0 && (
        <p className="mt-2 text-center font-mono text-[11px] text-text-dim">
          … and {hiddenCount} more — open the Waveform tab to see the whole run
        </p>
      )}
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
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-text-dim">
        Matched the reference on all {total} cases · BitForBytes
      </span>
    </motion.div>
  </motion.div>
);

// ─── tiny helpers ────────────────────────────────────────────────────────────
/** Render the inline `code` spans in problem prose; everything else is escaped. */
function mdInline(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-emerald-300">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-main">$1</strong>')
    .replace(/\n/g, '<br/>');
}

/** Examples may carry raw numbers or already-formatted Verilog literals. */
const fmtExample = (rec: Record<string, number | string>): string =>
  Object.entries(rec).map(([k, v]) => `${k}=${v}`).join(', ');

export default VerilogJudge;
