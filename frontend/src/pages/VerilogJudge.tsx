/**
 * VerilogJudge — the new Verilog playground: a Hardware-LeetCode judge.
 *
 * Pick a problem, write Verilog in the Monaco editor, hit Run, and the in-browser
 * miniSim compiles it and grades it against an exhaustive truth table (no backend
 * required for this basic tier). Phase-1 slice of the chipdev.io blueprint.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ArrowLeft, Play, RotateCcw, Lightbulb, Eye, EyeOff, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, Cpu, Trophy, Loader2,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { VERILOG_PROBLEMS, type VProblem } from '../data/verilogProblems';
import { grade, type GradeResult } from '../engine/verilog/grade';

const SOLVED_KEY = 'vj_solved_v1';
const codeKey = (id: string) => `vj_code_${id}`;

const DIFF_COLOR: Record<VProblem['difficulty'], string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#f43f5e',
};

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
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const [problemId, setProblemId] = useState<string>(VERILOG_PROBLEMS[0].id);
  const problem = useMemo(() => VERILOG_PROBLEMS.find((p) => p.id === problemId)!, [problemId]);

  const [code, setCode] = useState<string>(() => localStorage.getItem(codeKey(problem.id)) ?? problem.starter);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(loadSolved);
  const runTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Switch problem -> load its saved/starter code, reset transient UI.
  const selectProblem = useCallback((id: string) => {
    setProblemId(id);
    const p = VERILOG_PROBLEMS.find((x) => x.id === id)!;
    setCode(localStorage.getItem(codeKey(id)) ?? p.starter);
    setResult(null);
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
    if (runTimer.current) clearTimeout(runTimer.current);
    // tiny delay so the button shows feedback even though grading is instant
    runTimer.current = setTimeout(() => {
      const r = grade(problem, code);
      setResult(r);
      setRunning(false);
      if (r.status === 'pass' && !solved.has(problem.id)) {
        const next = new Set(solved); next.add(problem.id);
        setSolved(next);
        try { localStorage.setItem(SOLVED_KEY, JSON.stringify([...next])); } catch { /* quota */ }
      }
    }, 280);
  }, [problem, code, solved]);

  useEffect(() => () => { if (runTimer.current) clearTimeout(runTimer.current); }, []);

  const resetCode = () => onCodeChange(problem.starter);

  const solvedCount = solved.size;
  const statementParas = problem.statement.split('\n\n');

  return (
    <div className="flex min-h-[100svh] w-full flex-col overflow-y-auto bg-bg-void text-text-main lg:h-screen lg:overflow-hidden">
      {/* ── Header ── */}
      <header className="relative z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border-soft bg-bg-elev px-3 lg:h-14 lg:px-5">
        <button
          onClick={() => navigate('/portal')}
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-text-dim transition-colors hover:bg-white/5 hover:text-text-main"
          title="Back to portal"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-bold lg:text-base">Verilog Judge</span>
        </div>

        {/* Problem picker */}
        <div className="relative ml-1">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-border-soft bg-bg-void px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-cyan-400/50"
          >
            <span className="text-text-dim">{problem.number}.</span> {problem.title}
            <ChevronDown className={`h-3.5 w-3.5 text-text-dim transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                <motion.ul
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-20 mt-1.5 max-h-[70vh] w-[280px] overflow-y-auto rounded-xl border border-border-soft bg-bg-elev p-1.5 shadow-2xl"
                >
                  {VERILOG_PROBLEMS.map((p) => {
                    const isSel = p.id === problem.id;
                    const isSolved = solved.has(p.id);
                    return (
                      <li key={p.id}>
                        <button
                          onClick={() => selectProblem(p.id)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${isSel ? 'bg-cyan-500/10 text-cyan-300' : 'hover:bg-white/5'}`}
                        >
                          <span className="w-4 text-center">
                            {isSolved
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              : <span className="text-text-dim">{p.number}</span>}
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

        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border-soft bg-bg-void px-3 py-1 text-[12px] font-semibold text-text-dim">
          <Trophy className="h-3.5 w-3.5 text-amber-400" /> {solvedCount}/{VERILOG_PROBLEMS.length} solved
        </div>
      </header>

      {/* ── Body: description | workspace ── */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
        {/* Description */}
        <section className="min-w-0 overflow-y-auto border-b border-border-soft p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-xl font-extrabold lg:text-2xl">{problem.number}. {problem.title}</h2>
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

          {/* Ports */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <PortCard label="Inputs" names={problem.inputs} accent="#22d3ee" />
            <PortCard label="Outputs" names={problem.outputs} accent="#34d399" />
          </div>

          {/* Examples */}
          <div className="mt-5">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-text-dim">Examples</div>
            <div className="space-y-2">
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-lg border border-border-soft bg-bg-elev px-3 py-2 font-mono text-[12px]">
                  <span className="text-cyan-400">{fmtBits(ex.in)}</span>
                  <span className="mx-2 text-text-dim">→</span>
                  <span className="text-emerald-400">{fmtBits(ex.out)}</span>
                  {ex.note && <span className="ml-3 text-text-dim">// {ex.note}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Hint + Solution */}
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
        </section>

        {/* Workspace */}
        <section className="flex min-w-0 flex-col lg:overflow-hidden">
          {/* Toolbar */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border-soft bg-bg-elev px-3 py-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-text-dim">design.sv</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={resetCode} title="Reset to starter"
                className="flex items-center gap-1.5 rounded-lg border border-border-soft px-2.5 py-1.5 text-[12px] font-semibold text-text-dim transition-colors hover:text-text-main">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button onClick={run} disabled={running}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-[12px] font-bold text-black transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-60">
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                {running ? 'Running' : 'Run tests'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="h-[300px] shrink-0 lg:h-auto lg:flex-1">
            <Editor
              height="100%"
              language="verilog"
              theme={isLight ? 'light' : 'vs-dark'}
              value={code}
              onChange={onCodeChange}
              beforeMount={registerVerilog}
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

          {/* Results */}
          <div className="max-h-[42vh] shrink-0 overflow-y-auto border-t border-border-soft bg-bg-elev lg:max-h-[38%]">
            <ResultsPanel result={result} problem={problem} running={running} />
          </div>
        </section>
      </div>
    </div>
  );
};

// ─── sub-components ──────────────────────────────────────────────────────────
const PortCard: React.FC<{ label: string; names: string[]; accent: string }> = ({ label, names, accent }) => (
  <div className="rounded-lg border border-border-soft bg-bg-elev p-3">
    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-dim">{label}</div>
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
    return <div className="flex items-center gap-2 p-4 text-[13px] text-text-dim"><Loader2 className="h-4 w-4 animate-spin" /> Compiling &amp; simulating…</div>;
  }
  if (!result) {
    return <div className="p-4 text-[13px] text-text-dim">Write your module and press <span className="font-semibold text-text-main">Run tests</span> to grade it against every input combination.</div>;
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
        {passed ? 'Accepted — all cases passed!' : `${result.passed}/${result.total} test cases passed`}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr className="bg-bg-void text-text-dim">
              {problem.inputs.map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-cyan-400">{c}</th>)}
              {problem.outputs.map((c) => <th key={c} className="px-3 py-1.5 text-left font-semibold text-emerald-400">{c}</th>)}
              <th className="px-3 py-1.5 text-left font-semibold">got</th>
              <th className="px-3 py-1.5 text-center font-semibold">✓</th>
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
                  )) : <span className="text-rose-400">—</span>}
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

// ─── tiny helpers ────────────────────────────────────────────────────────────
/** Render the inline `code` spans in problem prose; everything else is escaped. */
function mdInline(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.9em] text-cyan-300">$1</code>');
}

const fmtBits = (rec: Record<string, number>): string =>
  Object.entries(rec).map(([k, v]) => `${k}=${v}`).join(', ');

export default VerilogJudge;
