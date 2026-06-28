/**
 * VerilogJudge - the Verilog bench: a visual hardware playground. Write Verilog
 * in the editor and a live gate-level schematic draws itself beside the code;
 * flip the input switches to watch current flow, then Run to grade the design
 * against an exhaustive truth table. Everything runs in the browser via miniSim.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ArrowLeft, Play, RotateCcw, Lightbulb, Eye, EyeOff, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, BadgeCheck,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { VERILOG_PROBLEMS, type VProblem } from '../data/verilogProblems';
import { grade, type GradeResult } from '../engine/verilog/grade';
import { compileVerilog } from '../engine/verilog/miniSim';
import { buildSchematic, type Schematic } from '../engine/verilog/schematic';
import { SchematicView } from '../components/verilog/SchematicView';
import { SynthSchematicView } from '../components/verilog/SynthSchematicView';

const SOLVED_KEY = 'vj_solved_v1';
const codeKey = (id: string) => `vj_code_${id}`;

const DIFF_COLOR: Record<VProblem['difficulty'], string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#f43f5e',
};

// A small hand-drawn AND-gate mark - the bench's logo.
const Monogram: React.FC = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
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
  const [showSolution, setShowSolution] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(loadSolved);
  const [problemOpen, setProblemOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [passTotal, setPassTotal] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  // Yosys is the main synthesizer; the quick interactive view is opt-in for
  // basic single-bit designs. Choice persists across problems.
  const [schematicMode, setSchematicMode] = useState<'live' | 'synth'>(() => {
    try { return (localStorage.getItem('vj_schem_mode') as 'live' | 'synth') || 'synth'; } catch { return 'synth'; }
  });
  const setMode = (m: 'live' | 'synth') => { setSchematicMode(m); try { localStorage.setItem('vj_schem_mode', m); } catch { /* quota */ } };
  const runTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── one compile feeds both the live schematic and the status bar ────────────
  const [debounced, setDebounced] = useState(code);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(code), 240);
    return () => clearTimeout(t);
  }, [code]);
  const compiled = useMemo(() => compileVerilog(debounced), [debounced]);
  const schematic: Schematic | null = useMemo(
    () => (compiled.ok ? buildSchematic(compiled.module) : null),
    [compiled],
  );

  const selectProblem = useCallback((id: string) => {
    setProblemId(id);
    const p = VERILOG_PROBLEMS.find((x) => x.id === id)!;
    const saved = localStorage.getItem(codeKey(id)) ?? p.starter;
    setCode(saved);
    setDebounced(saved);
    setResult(null);
    setResultsOpen(false);
    setShowHint(false);
    setShowSolution(false);
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
        setTimeout(() => setCelebrate(false), 2000);
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

  const resetCode = () => { onCodeChange(problem.starter); setDebounced(problem.starter); };
  const goto = (delta: number) => {
    const i = (problemIdx + delta + VERILOG_PROBLEMS.length) % VERILOG_PROBLEMS.length;
    selectProblem(VERILOG_PROBLEMS[i].id);
  };

  const solvedCount = solved.size;
  const statementParas = problem.statement.split('\n\n');

  // schematic engine selection: Yosys (synth) is primary; Live is the instant
  // interactive view, available only when the quick engine can elaborate the code.
  const canLive = compiled.ok;
  const showSynth = schematicMode === 'synth' || !canLive;
  const schemToggle = (
    <div className="flex items-center rounded-md border border-border-soft bg-bg-void p-0.5 font-mono text-[10px] font-black uppercase tracking-wide">
      <button onClick={() => canLive && setMode('live')} disabled={!canLive}
        title={canLive ? 'Instant interactive view (single-bit)' : 'Live view needs basic combinational code'}
        className={`rounded px-2 py-0.5 transition-colors ${!showSynth ? 'bg-emerald-500/20 text-emerald-400' : canLive ? 'text-text-dim hover:text-text-main' : 'cursor-not-allowed text-text-dim/40'}`}>
        Live
      </button>
      <button onClick={() => setMode('synth')} title="Full Yosys synthesizer - any valid Verilog"
        className={`rounded px-2 py-0.5 transition-colors ${showSynth ? 'bg-indigo-500/20 text-indigo-400' : 'text-text-dim hover:text-text-main'}`}>
        Synth
      </button>
    </div>
  );

  return (
    <div className="flex min-h-[100svh] w-full flex-col overflow-y-auto bg-bg-void text-text-main lg:h-screen lg:overflow-hidden">
      {/* ── Header ── */}
      <header className="relative z-30 flex h-14 shrink-0 items-center gap-2.5 border-b border-border-soft bg-bg-elev px-3 lg:px-4">
        <button onClick={() => navigate('/portal')} title="Back to portal"
          className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-text-dim transition-colors hover:bg-white/5 hover:text-text-main">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden text-[13px] font-semibold lg:inline">Portal</span>
        </button>

        <Sep className="h-6" />

        <div className="flex items-center gap-2.5">
          <Monogram />
          <div className="hidden leading-tight sm:block">
            <div className="text-[14px] font-extrabold tracking-tight text-text-main">Verilog Bench</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-dim">logic sandbox</div>
          </div>
        </div>

        {/* problem selector */}
        <div className="relative ml-1 sm:ml-2">
          <div className="flex items-center rounded-lg border border-border-soft bg-bg-void">
            <button onClick={() => goto(-1)} title="Previous problem"
              className="flex h-9 w-7 items-center justify-center text-text-dim transition-colors hover:text-text-main">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPickerOpen((o) => !o)}
              className="flex h-9 items-center gap-2 border-x border-border-soft px-2.5 text-[13px] font-semibold transition-colors hover:bg-white/5">
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
                <motion.ul
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-6 top-full z-20 mt-1.5 max-h-[70vh] w-[290px] overflow-y-auto rounded-xl border border-border-soft bg-bg-elev p-1.5 shadow-2xl"
                >
                  {VERILOG_PROBLEMS.map((p) => {
                    const isSel = p.id === problem.id;
                    const isSolved = solved.has(p.id);
                    return (
                      <li key={p.id}>
                        <button onClick={() => selectProblem(p.id)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${isSel ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-white/5'}`}>
                          <span className="w-4 text-center">
                            {isSolved
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              : <span className="font-mono text-text-dim">{p.number}</span>}
                          </span>
                          <span className="flex-1 font-medium">{p.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: DIFF_COLOR[p.difficulty] }}>
                            {p.difficulty}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
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
            <span className="font-mono text-[11px] text-text-dim">{solvedCount}/{VERILOG_PROBLEMS.length}</span>
          </div>
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
              className="relative min-w-0 overflow-y-auto border-b border-border-soft p-5 lg:w-[360px] lg:border-b-0 lg:border-r lg:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">Problem {String(problem.number).padStart(2, '0')}</span>
                <button onClick={() => setProblemOpen(false)} title="Collapse panel"
                  className="hidden rounded-md p-1 text-text-dim hover:bg-white/5 hover:text-text-main lg:block">
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-extrabold tracking-tight lg:text-[22px]">{problem.title}</h2>
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: DIFF_COLOR[problem.difficulty], background: `${DIFF_COLOR[problem.difficulty]}1a` }}>
                  {problem.difficulty}
                </span>
                {solved.has(problem.id) && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              </div>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {problem.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-text-dim">{t}</span>
                ))}
              </div>

              <div className="space-y-3 text-[14px] leading-relaxed text-text-dim">
                {statementParas.map((para, i) => <p key={i} dangerouslySetInnerHTML={{ __html: mdInline(para) }} />)}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <PortCard label="Inputs" names={problem.inputs} accent="#22d3ee" />
                <PortCard label="Outputs" names={problem.outputs} accent="#34d399" />
              </div>

              <div className="mt-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">Examples</div>
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

              <div className="mt-5 flex flex-wrap gap-2">
                {problem.hint && (
                  <button onClick={() => setShowHint((s) => !s)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[12px] font-semibold text-amber-500 transition-colors hover:bg-amber-500/15">
                    <Lightbulb className="h-3.5 w-3.5" /> {showHint ? 'Hide hint' : 'Hint'}
                  </button>
                )}
                <button onClick={() => setShowSolution((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-text-dim transition-colors hover:text-text-main">
                  {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showSolution ? 'Hide solution' : 'Solution'}
                </button>
              </div>
              <AnimatePresence>
                {showHint && problem.hint && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg bg-amber-500/5 px-3 py-2 text-[13px] text-amber-200/90"
                    dangerouslySetInnerHTML={{ __html: mdInline(problem.hint) }} />
                )}
                {showSolution && (
                  <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-x-auto rounded-lg border border-border-soft bg-bg-elev p-3 font-mono text-[12px] text-text-main">
                    {problem.solution}
                  </motion.pre>
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
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">design.sv</span>
            <span className="hidden items-center gap-1 font-mono text-[10px] text-text-dim/70 md:flex">
              <kbd className="rounded border border-border-soft px-1 py-px text-[9px]">Ctrl</kbd>
              <span>+</span>
              <kbd className="rounded border border-border-soft px-1 py-px text-[9px]">Enter</kbd>
              <span className="ml-0.5">run</span>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={resetCode} title="Reset to starter"
                className="flex items-center gap-1.5 rounded-lg border border-border-soft px-2.5 py-1.5 text-[12px] font-semibold text-text-dim transition-colors hover:text-text-main">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button onClick={run} disabled={running}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-[12px] font-bold text-black shadow-sm transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-60">
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {running ? 'Running' : 'Run'}
              </button>
            </div>
          </div>

          {/* Editor | Schematic */}
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
            <div className="h-[44vh] min-h-[260px] lg:h-auto lg:min-h-0">
              <Editor
                height="100%"
                language="verilog"
                theme={isLight ? 'light' : 'vs-dark'}
                value={code}
                onChange={onCodeChange}
                beforeMount={registerVerilog}
                onMount={(editor, monaco) => {
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
              {showSynth
                ? <SynthSchematicView code={debounced} isLight={isLight} miniError={compiled.ok ? null : compiled.error} headerExtra={schemToggle} />
                : <SchematicView schematic={schematic} error={null} isLight={isLight} headerExtra={schemToggle} />}
            </div>
          </div>

          {/* Results drawer */}
          <ResultsDrawer
            open={resultsOpen} setOpen={setResultsOpen}
            result={result} problem={problem} running={running}
          />
        </section>
      </div>

      {/* ── Status bar ── */}
      <footer className="hidden h-7 shrink-0 items-center gap-2.5 border-t border-border-soft bg-bg-elev px-3 font-mono text-[11px] text-text-dim sm:flex">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${compiled.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {compiled.ok ? 'elaborates' : 'syntax error'}
        </span>
        {schematic && (
          <>
            <Sep />
            <span>{schematic.gateCount} gate{schematic.gateCount === 1 ? '' : 's'}</span>
            <Sep />
            <span>{schematic.wires.length} net{schematic.wires.length === 1 ? '' : 's'}</span>
          </>
        )}
        <span className="ml-auto">{problem.inputs.length} in &middot; {problem.outputs.length} out</span>
        <Sep className="hidden md:block" />
        <span className="hidden md:inline" style={{ color: DIFF_COLOR[problem.difficulty] }}>{problem.difficulty}</span>
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
  result: GradeResult | null; problem: VProblem; running: boolean;
}> = ({ open, setOpen, result, problem, running }) => {
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
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Console</span>
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
            <div className="max-h-[34vh] overflow-y-auto border-t border-border-soft">
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
    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">{label}</div>
    <div className="flex flex-wrap gap-1.5">
      {names.map((n) => (
        <span key={n} className="rounded-md px-2 py-0.5 font-mono text-[12px] font-bold"
          style={{ color: accent, background: `${accent}1a` }}>{n}</span>
      ))}
    </div>
  </div>
);

const ResultsPanel: React.FC<{ result: GradeResult | null; problem: VProblem; running: boolean }> = ({ result, problem, running }) => {
  if (running) {
    return <div className="flex items-center gap-2 p-4 text-[13px] text-text-dim"><Loader2 className="h-4 w-4 animate-spin" /> Compiling &amp; simulating every input combination...</div>;
  }
  if (!result) {
    return <div className="p-4 text-[13px] leading-relaxed text-text-dim">Press <span className="font-semibold text-text-main">Run</span> to grade your module against every input combination. While you type, the schematic on the right shows exactly what your code builds.</div>;
  }

  if (result.status === 'error') {
    return (
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-rose-400">
          <AlertTriangle className="h-4 w-4" /> Compile error
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 font-mono text-[12px] text-rose-300">{result.error}</pre>
      </div>
    );
  }

  const cols = [...problem.inputs, ...problem.outputs];
  const passed = result.status === 'pass';
  return (
    <div className="p-3">
      <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold ${passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {passed ? 'Accepted - all cases passed' : `${result.passed}/${result.total} test cases passed`}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr className="bg-bg-void text-text-dim">
              {problem.inputs.map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-cyan-400">{c}</th>)}
              {problem.outputs.map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-emerald-400">{c}</th>)}
              <th className="px-3 py-1.5 text-left font-semibold">got</th>
              <th className="px-3 py-1.5 text-center font-semibold">ok</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} className={`border-t border-border-soft ${row.pass ? '' : 'bg-rose-500/[0.06]'}`}>
                {problem.inputs.map((c) => <td key={c} className="px-3 py-1 text-cyan-300">{row.in[c]}</td>)}
                {problem.outputs.map((c) => <td key={c} className="px-3 py-1 text-emerald-300">{row.expected[c]}</td>)}
                <td className="px-3 py-1">
                  {row.got ? cols.filter((c) => problem.outputs.includes(c)).map((c) => (
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

// ─── verified stamp (shown briefly on a pass) ────────────────────────────────
const VerifiedStamp: React.FC<{ total: number }> = ({ total }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="pointer-events-none fixed inset-0 z-[100] grid place-items-center"
  >
    <motion.span
      className="absolute h-40 w-40 rounded-full border-2 border-emerald-400"
      initial={{ scale: 0.3, opacity: 0.6 }} animate={{ scale: 1.9, opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
    <motion.div
      initial={{ scale: 1.5, opacity: 0, rotate: 6 }}
      animate={{ scale: 1, opacity: 1, rotate: -7 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 15 }}
      className="flex flex-col items-center gap-1 rounded-2xl border-[2.5px] border-dashed border-emerald-500 bg-bg-elev/85 px-7 py-4 backdrop-blur"
      style={{ boxShadow: '0 0 0 4px rgba(16,185,129,0.12), 0 18px 50px rgba(0,0,0,0.4)' }}
    >
      <div className="flex items-center gap-2 text-emerald-400">
        <BadgeCheck className="h-7 w-7" />
        <span className="text-2xl font-black uppercase tracking-[0.12em]">Verified</span>
      </div>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-emerald-500/80">all {total} vectors pass</span>
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
