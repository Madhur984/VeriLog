/**
 * Verilog Sandbox — a free-form Verilog playground: write a design and a
 * testbench, hit Run, watch the waveform.
 *
 * Where the Verilog Judge is problem-shaped (pick one, submit, get graded), this
 * is the blank page: any modules you like, your own stimulus, no verdict. It is
 * the tool you reach for when you want to *try* something rather than prove it.
 *
 * One honest limitation, surfaced in the UI rather than buried here. The engine
 * is Yosys, which synthesizes hardware — it does not interpret behavioural
 * Verilog, so `initial`, `#delay` and `$display` are discarded rather than
 * executed. `$finish` and `$stop` are worse than ignored: Yosys runs them during
 * elaboration and aborts, so a testbench containing one produces no netlist at
 * all. A testbench here is therefore a *synthesizable* one: a module
 * that instantiates your design, drives it from clocked logic, and exposes what
 * you want to watch as output ports. That is a real style used for on-chip BFMs
 * and self-test logic, and it is the style that works in a browser with no
 * server behind it. See docs/verilog-judge-toolchain.md for why.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor, { type Monaco } from '@monaco-editor/react';
import {
  ArrowLeft, Play, Loader2, Sun, Moon, RotateCcw, FileCode2, FlaskConical,
  Activity, Terminal, AlertTriangle, Info, Share2, Check, Cpu,
  PanelRight, PanelBottom, ChevronDown, ChevronUp, Layers, Network, HelpCircle,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { synthesize, type SynthProgress } from '../engine/verilog/yosysClient';
import { type Trace } from '../engine/verilog/simRunner';
import { type SynthStats } from '../engine/verilog/netlistStats';
import { explainDiagnostic, type Diag } from '../engine/verilog/diagnostics';
import { buildSandboxSource, DESIGN_FILE, TB_FILE } from '../engine/verilog/sandboxSource';
import { runSandbox } from '../engine/verilog/sandboxRun';
import { WaveformViewer } from '../components/verilog/WaveformViewer';
import { NetlistSchematicView } from '../components/verilog/NetlistSchematicView';
import { SandboxTour, SANDBOX_TOUR_STEPS } from '../components/verilog/SandboxTour';

const DESIGN_KEY = 'vsbx_design_v2';
const TB_KEY = 'vsbx_tb_v2';
const CYCLES_KEY = 'vsbx_cycles_v1';
const DOCK_KEY = 'vsbx_dock_v1';
const INTRO_KEY = 'vsbx_intro_v1';
const TOUR_KEY = 'vsbx_tour_v1';

/**
 * The starters follow the `top` / `tb` convention the intro states, so the rule
 * is demonstrated rather than merely described.
 */
const STARTER_DESIGN = `// Your top-level design. Keep it named \`top\`.
module top #(
  parameter W = 4
)(
  input              clk,
  input              rst,
  input              en,
  output reg [W-1:0] count
);
  always @(posedge clk) begin
    if (rst)     count <= {W{1'b0}};
    else if (en) count <= count + 1'b1;
  end
endmodule
`;

const STARTER_TB = `// A synthesizable testbench: it drives the design from clocked
// logic and exposes everything you want to watch as OUTPUT ports.
// Every output below becomes a row in the waveform.
module tb(
  input        clk,
  input        rst,
  output       en,
  output [3:0] count
);
  // Free-running tick so the stimulus generates itself.
  reg [3:0] tick;
  always @(posedge clk) begin
    if (rst) tick <= 4'd0;
    else     tick <= tick + 1'b1;
  end

  // Hold the design disabled for the first few cycles, then let it run.
  assign en = (tick > 4'd2);

  top #(.W(4)) uut (
    .clk   (clk),
    .rst   (rst),
    .en    (en),
    .count (count)
  );
endmodule
`;

/** Register the Verilog language once, so both editors highlight identically. */
function registerVerilog(monaco: Monaco) {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === 'verilog')) return;
  monaco.languages.register({ id: 'verilog' });
  monaco.languages.setMonarchTokensProvider('verilog', {
    defaultToken: '',
    keywords: [
      'module', 'endmodule', 'input', 'output', 'inout', 'wire', 'reg', 'logic',
      'assign', 'always', 'always_ff', 'always_comb', 'initial', 'begin', 'end',
      'if', 'else', 'case', 'casez', 'casex', 'endcase', 'default', 'for', 'while',
      'posedge', 'negedge', 'parameter', 'localparam', 'generate', 'endgenerate',
      'genvar', 'integer', 'function', 'endfunction', 'task', 'endtask', 'signed',
      'unsigned', 'typedef', 'enum', 'struct', 'packed', 'automatic',
    ],
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@block'],
        [/\d*'[bodhBODH][0-9a-fA-FxzXZ_]+/, 'number'],
        [/\b\d+\b/, 'number'],
        [/"[^"]*"/, 'string'],
        [/\$[a-zA-Z_]\w*/, 'type'],
        [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        [/[{}()[\]]/, 'delimiter.bracket'],
        [/[<>=!&|~^+\-*/%?:]+/, 'operator'],
      ],
      block: [[/\*\//, 'comment', '@pop'], [/./, 'comment']],
    },
  });
}

type OutTab = 'wave' | 'schematic' | 'synth' | 'output';
type Dock = 'right' | 'bottom';

export const VerilogSandbox: React.FC = () => {
  const navigate = useNavigate();
  const [scheme, toggleScheme] = useColorScheme();
  const isLight = scheme === 'light';

  const [design, setDesign] = useState(() => localStorage.getItem(DESIGN_KEY) ?? STARTER_DESIGN);
  const [tb, setTb] = useState(() => localStorage.getItem(TB_KEY) ?? STARTER_TB);
  const [file, setFile] = useState<'design' | 'tb'>('design');
  const [cycles, setCycles] = useState(() => Number(localStorage.getItem(CYCLES_KEY)) || 32);
  const [dock, setDock] = useState<Dock>(() =>
    (localStorage.getItem(DOCK_KEY) as Dock) === 'bottom' ? 'bottom' : 'right');
  const [introOpen, setIntroOpen] = useState(() => localStorage.getItem(INTRO_KEY) !== 'closed');

  // First visit gets the walkthrough unprompted; every later visit only on
  // request. A read that throws (Safari private mode, storage disabled) must not
  // strand the page, and showing the tour again is the harmless way to fail.
  const [tourOpen, setTourOpen] = useState(() => {
    try { return localStorage.getItem(TOUR_KEY) !== 'done'; } catch { return false; }
  });

  const closeTour = useCallback((completed: boolean) => {
    setTourOpen(false);
    // Skipping counts as done too — re-showing a tour someone dismissed is how a
    // helpful thing turns into an annoying one. The ? button brings it back.
    void completed;
    try { localStorage.setItem(TOUR_KEY, 'done'); } catch { /* quota */ }
  }, []);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<SynthProgress | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [stats, setStats] = useState<SynthStats | null>(null);
  // Kept so the Schematic tab can render from the run's netlist instead of
  // synthesizing the same source a second time.
  const [netlistJson, setNetlistJson] = useState<string | null>(null);
  const [log, setLog] = useState('');
  const [diags, setDiags] = useState<Diag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<
    { top: string; clock?: string; reset?: string; soloDesign?: boolean } | null>(null);
  const [outTab, setOutTab] = useState<OutTab>('wave');
  const [copied, setCopied] = useState(false);
  const runSeq = useRef(0);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<{ revealLineInCenter: (n: number) => void;
                             setPosition: (p: { lineNumber: number; column: number }) => void;
                             focus: () => void } | null>(null);

  useEffect(() => { try { localStorage.setItem(DESIGN_KEY, design); } catch { /* quota */ } }, [design]);
  useEffect(() => { try { localStorage.setItem(TB_KEY, tb); } catch { /* quota */ } }, [tb]);
  useEffect(() => { try { localStorage.setItem(CYCLES_KEY, String(cycles)); } catch { /* quota */ } }, [cycles]);
  useEffect(() => { try { localStorage.setItem(DOCK_KEY, dock); } catch { /* quota */ } }, [dock]);
  useEffect(() => {
    try { localStorage.setItem(INTRO_KEY, introOpen ? 'open' : 'closed'); } catch { /* quota */ }
  }, [introOpen]);

  // `\`line` directives make Yosys report errors against design.v / testbench.v
  // by name instead of against the concatenated buffer it actually parses.
  const combined = useMemo(() => buildSandboxSource(design, tb), [design, tb]);

  // The schematic inspector resolves a cell's `src` back to the editor it came
  // from. Keyed by the same file names the `\`line` directives establish, so a
  // Yosys location and an editor buffer always refer to the same thing.
  const schematicSources = useMemo(
    () => [{ file: DESIGN_FILE, text: design }, { file: TB_FILE, text: tb }],
    [design, tb],
  );

  const run = useCallback(async () => {
    const seq = ++runSeq.current;
    setRunning(true);
    setError(null);
    setProgress(null);
    try {
      const progress = (p: SynthProgress) => { if (runSeq.current === seq) setProgress(p); };
      // Flatten so a testbench's DUT instance dissolves into cells the simulator
      // can actually evaluate.
      const res = await runSandbox(design, tb, cycles, (src) =>
        synthesize(src, progress, { flatten: true }));
      if (runSeq.current !== seq) return;

      setDiags(res.diags);
      if (!res.ok) {
        setError(res.error ?? 'Synthesis failed.');
        setLog(res.error ?? '');
        setStats(null);
        setOutTab('output');
        return;
      }

      setStats(res.stats ?? null);
      setNetlistJson(res.json ?? null);
      setMeta({ top: res.top!, clock: res.clock, reset: res.reset, soloDesign: res.soloDesign });
      setTrace(res.trace!);
      setOutTab('wave');

      const t = res.trace!;
      const driven = t.signals.filter((s) => s.role === 'input');
      setLog([
        res.soloDesign ? 'source       : design.v only (testbench.v skipped — see above)' : '',
        `top module   : ${res.top}`,
        `clock        : ${res.clock ?? '(none — combinational)'}`,
        `reset        : ${res.reset ?? '(none)'}`,
        `driven inputs: ${driven.length ? driven.map((d) => d.name).join(', ') : '(self-driving)'}`,
        `cycles       : ${t.cycles}`,
        `signals      : ${t.signals.length}`,
        res.unsupported?.length ? `\nunsupported cells: ${res.unsupported.join(', ')}` : '',
        res.diags.length
          ? `\n${res.diags.map((d) => `${d.severity.toUpperCase()}${d.line ? ` line ${d.line}` : ''}: ${d.message}`).join('\n')}`
          : '',
      ].filter(Boolean).join('\n'));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutTab('output');
    } finally {
      if (runSeq.current === seq) { setRunning(false); setProgress(null); }
    }
  }, [combined, cycles, design, tb]);

  // Ctrl/⌘+Enter runs; Ctrl+PgUp/PgDn cycles the editor tabs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
      if (e.ctrlKey && (e.key === 'PageUp' || e.key === 'PageDown')) {
        e.preventDefault();
        setFile((f) => (f === 'design' ? 'tb' : 'design'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  /**
   * Push diagnostics into the editor as squiggles, the way a real IDE does.
   * Markers are attached per model URI, so a diagnostic against testbench.v
   * marks that file even while design.v is on screen — switch tabs and the
   * squiggle is already there.
   */
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    const SEV = {
      error: monaco.MarkerSeverity.Error,
      warning: monaco.MarkerSeverity.Warning,
      note: monaco.MarkerSeverity.Info,
    } as const;

    for (const model of monaco.editor.getModels()) {
      const name = model.uri.path.replace(/^\//, '');
      if (name !== DESIGN_FILE && name !== TB_FILE) continue;
      const mine = diags.filter((d) => (d.file ?? DESIGN_FILE) === name && d.line);
      monaco.editor.setModelMarkers(model, 'yosys', mine.map((d) => {
        const line = Math.min(Math.max(1, d.line!), model.getLineCount());
        const ex = explainDiagnostic(d);
        return {
          severity: SEV[d.severity],
          startLineNumber: line,
          endLineNumber: Math.min(d.endLine ?? line, model.getLineCount()),
          // Without a column span, underline the whole line rather than a
          // single character — a one-char squiggle is easy to miss entirely.
          startColumn: d.col ?? 1,
          endColumn: d.endCol ?? model.getLineMaxColumn(line),
          message: ex ? `${d.message}\n\n${ex.cause}\n→ ${ex.fix}` : d.message,
          source: 'yosys',
        };
      }));
    }
  }, [diags]);

  /** Jump the editor to a diagnostic's location, switching files if needed. */
  const goToDiag = useCallback((d: Diag) => {
    const target = (d.file ?? DESIGN_FILE) === TB_FILE ? 'tb' : 'design';
    setFile(target);
    if (!d.line) return;
    // Let the editor remount on the new file before moving the cursor.
    setTimeout(() => {
      editorRef.current?.revealLineInCenter(d.line!);
      editorRef.current?.setPosition({ lineNumber: d.line!, column: d.col ?? 1 });
      editorRef.current?.focus();
    }, 60);
  }, []);

  const resetAll = () => {
    setDesign(STARTER_DESIGN);
    setTb(STARTER_TB);
    setTrace(null); setStats(null); setError(null); setLog(''); setMeta(null);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${design}\n\n${tb}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  const errorCount = diags.filter((d) => d.severity === 'error').length;
  const warnCount = diags.filter((d) => d.severity === 'warning').length;

  const tabBtn = 'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors';
  const tabStyle = (on: boolean): React.CSSProperties => on
    ? { background: 'var(--vj-surface-0)', color: 'var(--vj-text)', borderBottom: '2px solid var(--vj-wave)' }
    : { color: 'var(--vj-text-dim)', borderBottom: '2px solid transparent' };
  const iconBtn = 'grid h-9 w-9 place-items-center rounded-lg transition-colors';

  return (
    <div className="vj-scope flex h-[100svh] w-full flex-col overflow-hidden"
         style={{ background: 'var(--vj-surface-0)', color: 'var(--vj-text)' }}>

      {/* ── header ──────────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 lg:px-4"
              style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
        <button onClick={() => navigate('/portal')} title="Back to portal"
                className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold"
                style={{ color: 'var(--vj-text-dim)' }}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden lg:inline">Portal</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: 'var(--vj-wave)', color: 'var(--vj-surface-0)' }}>
            <FlaskConical className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-[14px] font-bold tracking-tight">Verilog Sandbox</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em]"
                 style={{ color: 'var(--vj-text-dim)' }}>
              {meta ? `top · ${meta.top}` : 'open verilog + testbench'}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Dock side — the waveform pane moves right or bottom (see §Dock). */}
          <button onClick={() => setDock((d) => (d === 'right' ? 'bottom' : 'right'))}
                  data-tour="dock"
                  title={dock === 'right' ? 'Dock output to the bottom' : 'Dock output to the right'}
                  aria-label="Move the output dock"
                  className={iconBtn} style={{ color: 'var(--vj-text-dim)' }}>
            {dock === 'right' ? <PanelRight className="h-4 w-4" /> : <PanelBottom className="h-4 w-4" />}
          </button>
          <button onClick={() => setTourOpen(true)}
                  data-tour="help"
                  title="Replay the sandbox tour"
                  aria-label="Replay the sandbox tour"
                  className={iconBtn} style={{ color: 'var(--vj-text-dim)' }}>
            <HelpCircle className="h-4 w-4" />
          </button>
          <button onClick={share} title="Copy both files to the clipboard"
                  className={iconBtn} style={{ color: copied ? 'var(--vj-pass)' : 'var(--vj-text-dim)' }}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </button>
          <button onClick={resetAll} title="Restore the starter example"
                  className={iconBtn} style={{ color: 'var(--vj-text-dim)' }}>
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={toggleScheme} title={isLight ? 'Dark mode' : 'Light mode'}
                  className={iconBtn} style={{ color: 'var(--vj-text-dim)' }}>
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={run} disabled={running} data-tour="run"
                  className="ml-1 flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                  style={{ background: 'var(--vj-wave)', color: 'var(--vj-surface-0)' }}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run
          </button>
        </div>
      </header>

      <Intro open={introOpen} onToggle={() => setIntroOpen((v) => !v)} navigate={navigate} />

      {/* ── body ────────────────────────────────────────────────────────── */}
      <div className={`flex min-h-0 flex-1 ${dock === 'right' ? 'flex-col lg:flex-row' : 'flex-col'}`}>

        {/* editor */}
        <section className={`flex min-h-0 flex-col border-b ${
          dock === 'right' ? 'flex-1 lg:w-1/2 lg:border-b-0 lg:border-r' : 'flex-1'}`}
                 style={{ borderColor: 'var(--vj-border)' }}>
          <div className="flex shrink-0 items-center border-b" data-tour="editor-tabs"
               style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
            <button onClick={() => setFile('design')} className={tabBtn} style={tabStyle(file === 'design')}>
              <FileCode2 className="h-3.5 w-3.5" /> design.v
            </button>
            <button onClick={() => setFile('tb')} className={tabBtn} style={tabStyle(file === 'tb')}>
              <FlaskConical className="h-3.5 w-3.5" /> testbench.v
            </button>
          </div>

          <div className="min-h-0 flex-1">
            <Editor
              key={file}
              language="verilog"
              path={file === 'design' ? DESIGN_FILE : TB_FILE}
              value={file === 'design' ? design : tb}
              onChange={(v) => (file === 'design' ? setDesign(v ?? '') : setTb(v ?? ''))}
              beforeMount={registerVerilog}
              onMount={(ed, monaco) => {
                editorRef.current = ed as unknown as typeof editorRef.current;
                monacoRef.current = monaco;
                // Markers may have been computed while this model did not exist
                // yet (the editor remounts per tab); re-apply on mount.
                setDiags((d) => [...d]);
              }}
              theme={isLight ? 'vs' : 'vs-dark'}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono','IBM Plex Mono',monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                padding: { top: 12, bottom: 12 },
                smoothScrolling: true,
                tabSize: 2,
              }}
            />
          </div>
        </section>

        {/* output dock */}
        <section className={`flex min-h-0 flex-col ${
          dock === 'right' ? 'flex-1 lg:w-1/2' : 'h-[45vh] shrink-0 border-t'}`}
                 style={dock === 'bottom' ? { borderColor: 'var(--vj-border)' } : undefined}>
          <div className="flex shrink-0 items-center border-b" data-tour="out-tabs"
               style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
            <button onClick={() => setOutTab('wave')} className={tabBtn} style={tabStyle(outTab === 'wave')}>
              <Activity className="h-3.5 w-3.5" /> Waveform
            </button>
            <button onClick={() => setOutTab('schematic')} className={tabBtn} style={tabStyle(outTab === 'schematic')}>
              <Network className="h-3.5 w-3.5" /> Schematic
            </button>
            <button onClick={() => setOutTab('synth')} className={tabBtn} style={tabStyle(outTab === 'synth')}>
              <Cpu className="h-3.5 w-3.5" /> Synthesis
              {stats && (
                <span className="ml-1 font-mono text-[9px] opacity-70">{stats.totalCells}</span>
              )}
            </button>
            <button onClick={() => setOutTab('output')} className={tabBtn} style={tabStyle(outTab === 'output')}>
              <Terminal className="h-3.5 w-3.5" /> Output
              {errorCount > 0 && (
                <span className="ml-1 rounded px-1 text-[9px]"
                      style={{ background: 'var(--vj-fail-bg)', color: 'var(--vj-fail)' }}>{errorCount}</span>
              )}
              {errorCount === 0 && warnCount > 0 && (
                <span className="ml-1 rounded px-1 text-[9px]"
                      style={{ background: 'var(--vj-warn-bg)', color: 'var(--vj-warn)' }}>{warnCount}</span>
              )}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {outTab === 'wave' && (
              running ? <Busy progress={progress} />
                : trace ? (
                  <WaveformViewer
                    trace={trace}
                    outputNames={trace.signals.filter((s) => s.role === 'output').map((s) => s.name)}
                    isLight={isLight}
                  />
                ) : <EmptyState error={error} />
            )}

            {outTab === 'schematic' && (
              // Pass the netlist the run already produced: re-synthesizing here
              // would be a second 54 MB-engine round trip for an identical result.
              // `combined` is the fallback for viewing the circuit before a run.
              <NetlistSchematicView
                netlistJson={netlistJson ?? undefined}
                code={netlistJson ? undefined : combined}
                isLight={isLight}
                flatten
                trace={trace}
                // Double-clicking a cell shows the lines that produced it. The
                // file names must match what Yosys reports in `src`, which the
                // `\`line` directives in buildSandboxSource pin to these two.
                sources={schematicSources}
              />
            )}

            {outTab === 'synth' && (
              running ? <Busy progress={progress} /> : <SynthesisReport stats={stats} />
            )}

            {outTab === 'output' && (
              <OutputPanel error={error} log={log} diags={diags} onGoTo={goToDiag} />
            )}
          </div>
        </section>
      </div>

      {/* ── status / controls bar ───────────────────────────────────────── */}
      {/*
        Fixed height with no wrapping: a wrapping row inside `h-10` overflows
        invisibly rather than growing, which silently clipped the shortcut hints.
        Everything past the essentials drops out at narrower widths instead.
      */}
      <footer className="flex h-10 shrink-0 items-center gap-x-4 overflow-hidden border-t px-3 font-mono text-[11px]"
              style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)', color: 'var(--vj-text-dim)' }}>
        <label className="flex items-center gap-1.5" data-tour="cycles">
          cycles
          <input
            type="number" min={1} max={512} value={cycles}
            onChange={(e) => setCycles(Math.max(1, Math.min(512, Number(e.target.value) || 1)))}
            aria-label="Simulation cycles"
            className="h-6 w-16 rounded border bg-transparent px-1.5 text-center outline-none"
            style={{ borderColor: 'var(--vj-border-strong)', color: 'var(--vj-text-code)' }}
          />
        </label>

        {meta && (
          <>
            <span className="hidden shrink-0 sm:inline">top · <span style={{ color: 'var(--vj-text)' }}>{meta.top}</span></span>
            {meta.soloDesign && (
              <span className="shrink-0 rounded px-1.5" title="testbench.v could not be built with this design, so it was skipped"
                    style={{ background: 'var(--vj-warn-bg)', color: 'var(--vj-warn)' }}>
                design only
              </span>
            )}
            {meta.clock && <span className="hidden md:inline">clk · {meta.clock}</span>}
            {meta.reset && <span className="hidden md:inline">rst · {meta.reset}</span>}
          </>
        )}
        {trace && (
          <span className="hidden lg:inline">{trace.cycles} cycles · {trace.signals.length} signals</span>
        )}
        {stats && (
          <span className="hidden lg:inline">{stats.totalCells} cells · {stats.flopBits} FF</span>
        )}

        {/* Right-side hints sit clear of the mascot widget that floats in that
            corner site-wide, so they get generous breakpoints. */}
        <span className="ml-auto flex shrink-0 items-center gap-3 whitespace-nowrap pr-24">
          <span className="hidden xl:inline"><kbd>Ctrl</kbd>+<kbd>PgUp</kbd>/<kbd>PgDn</kbd> tabs</span>
          <span className="hidden sm:inline"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> run</span>
        </span>
      </footer>

      {tourOpen && <SandboxTour steps={SANDBOX_TOUR_STEPS} onClose={closeTour} />}
    </div>
  );
};

// ── intro ───────────────────────────────────────────────────────────────────

const Intro: React.FC<{
  open: boolean; onToggle: () => void; navigate: (to: string) => void;
}> = ({ open, onToggle, navigate }) => (
  <div className="shrink-0 border-b" data-tour="intro"
       style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
    <button onClick={onToggle}
            className="flex w-full items-center gap-2 px-3 py-2 text-left lg:px-4"
            aria-expanded={open}>
      <span className="text-[13px] font-bold" style={{ color: 'var(--vj-text)' }}>
        Open Verilog + testbench
      </span>
      <span className="hidden text-[12px] sm:inline" style={{ color: 'var(--vj-text-dim)' }}>
        — write a module and a testbench, then Run.
      </span>
      <span className="ml-auto" style={{ color: 'var(--vj-text-dim)' }}>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </span>
    </button>

    {open && (
      <div className="flex flex-col gap-2.5 px-3 pb-3 lg:px-4">
        <p className="text-[13px]" style={{ color: 'var(--vj-text-sub)' }}>
          Write a module and a testbench, then <strong style={{ color: 'var(--vj-text)' }}>Run</strong>.
          {' '}
          <button onClick={() => navigate('/verilog-playground')}
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'var(--vj-wave)' }}>Practice</button>
          {' · '}
          <button onClick={() => navigate('/verilog-playground')}
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'var(--vj-wave)' }}>Problems</button>
        </p>

        <div className="flex items-start gap-2 rounded-lg border p-2.5 text-[12px]"
             style={{ borderColor: 'var(--vj-border)', color: 'var(--vj-text-dim)' }}>
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--vj-info)' }} />
          <span>
            To avoid config issues across the <strong style={{ color: 'var(--vj-text-sub)' }}>Sandbox</strong>,
            {' '}<strong style={{ color: 'var(--vj-text-sub)' }}>Practice</strong> and
            {' '}<strong style={{ color: 'var(--vj-text-sub)' }}>Problems</strong>: keep your top-level design
            as <Code>module top</Code> and your sandbox testbench as <Code>module tb</Code>{' '}
            (instantiating <Code>top uut</Code>).
          </span>
        </div>
      </div>
    )}
  </div>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="rounded px-1 py-0.5 font-mono text-[11px]"
        style={{ background: 'var(--vj-surface-3)', color: 'var(--vj-text-code)' }}>{children}</code>
);

// ── panels ──────────────────────────────────────────────────────────────────

const Busy: React.FC<{ progress: SynthProgress | null }> = ({ progress }) => {
  const downloading = progress && progress.total > 0 && progress.done < progress.total;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--vj-wave)' }} />
      <span className="text-[13px]" style={{ color: 'var(--vj-text-dim)' }}>
        {downloading
          ? `Downloading the Yosys engine — ${Math.round((progress.done / progress.total) * 100)}% (once per session)`
          : 'Synthesizing and simulating…'}
      </span>
      {downloading && (
        <div className="h-1 w-56 overflow-hidden rounded-full" style={{ background: 'var(--vj-border)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${(progress.done / progress.total) * 100}%`, background: 'var(--vj-wave)' }} />
        </div>
      )}
    </div>
  );
};

/**
 * What the code actually became. Correctness is table stakes; this is the part
 * hardware people argue about — how many cells, how much storage, what the tool
 * inferred that you did not intend.
 */
const SynthesisReport: React.FC<{ stats: SynthStats | null }> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-[13px]"
           style={{ color: 'var(--vj-text-dim)' }}>
        Run to see what your code synthesized to.
      </div>
    );
  }
  const max = Math.max(1, ...stats.cells.map((c) => c.count));
  return (
    <div className="h-full overflow-y-auto p-3">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="cells" value={stats.totalCells} />
        <Stat label="flip-flops" value={stats.flopBits} unit="bits" />
        <Stat label="memory" value={stats.memBits} unit="bits" />
        <Stat label="nets" value={stats.namedNets} />
      </div>

      <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--vj-text-dim)' }}>Cells by type</h3>
      <ul className="mb-4 space-y-1">
        {stats.cells.map((c) => (
          <li key={c.type} className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate font-mono text-[11.5px] font-bold"
                  style={{ color: 'var(--vj-text)' }} title={c.type}>{c.label}</span>
            <span className="h-2 rounded-sm transition-all"
                  style={{ width: `${(c.count / max) * 60}%`, minWidth: 4, background: 'var(--vj-wave)', opacity: 0.5 }} />
            <span className="ml-auto shrink-0 font-mono text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>
              {c.count}{c.bits > c.count ? ` · ${c.bits}b` : ''}
            </span>
          </li>
        ))}
        {stats.cells.length === 0 && (
          <li className="text-[12px]" style={{ color: 'var(--vj-text-dim)' }}>
            No cells — the design optimized away to wires.
          </li>
        )}
      </ul>

      <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--vj-text-dim)' }}>
        <Layers className="mr-1 inline h-3 w-3" />Top ports · {stats.top}
      </h3>
      <ul className="space-y-1">
        {stats.ports.map((p) => (
          <li key={p.name} className="flex items-center gap-2 font-mono text-[11.5px]">
            <span className="w-14 shrink-0 uppercase" style={{ color: 'var(--vj-text-dim)' }}>{p.direction}</span>
            <span className="font-bold" style={{ color: 'var(--vj-text)' }}>{p.name}</span>
            <span style={{ color: 'var(--vj-text-dim)' }}>{p.width > 1 ? `[${p.width - 1}:0]` : '1b'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; unit?: string }> = ({ label, value, unit }) => (
  <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]"
         style={{ color: 'var(--vj-text-dim)' }}>{label}</div>
    <div className="font-mono text-[18px] font-bold leading-tight" style={{ color: 'var(--vj-text)' }}>
      {value.toLocaleString()}
      {unit && <span className="ml-1 text-[10px] font-normal" style={{ color: 'var(--vj-text-dim)' }}>{unit}</span>}
    </div>
  </div>
);

/**
 * One diagnostic, rendered the way an IDE's problem list renders it: severity,
 * file and line you can click, the engine's own words, and — where we can say
 * something useful — what it actually means and what to do.
 */
const DiagRow: React.FC<{ diag: Diag; onGoTo: (d: Diag) => void }> = ({ diag, onGoTo }) => {
  const ex = explainDiagnostic(diag);
  const tone = diag.severity === 'error'
    ? { fg: 'var(--vj-fail)', bg: 'var(--vj-fail-bg)', border: 'var(--vj-fail)' }
    : diag.severity === 'warning'
      ? { fg: 'var(--vj-warn)', bg: 'var(--vj-warn-bg)', border: 'var(--vj-warn)' }
      : { fg: 'var(--vj-info)', bg: 'transparent', border: 'var(--vj-border)' };

  return (
    <div className="rounded-lg border p-2.5 text-[12px]"
         style={{ borderColor: tone.border, background: tone.bg }}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: tone.fg }} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: tone.fg }}>{diag.severity}</span>
            {diag.line && (
              <button
                onClick={() => onGoTo(diag)}
                className="font-mono text-[11px] underline-offset-2 hover:underline"
                style={{ color: 'var(--vj-wave)' }}
                title="Go to this line"
              >
                {diag.file ?? DESIGN_FILE}:{diag.line}
              </button>
            )}
          </div>
          <p className="mt-0.5 whitespace-pre-wrap font-mono text-[11.5px]"
             style={{ color: 'var(--vj-text)' }}>{diag.message}</p>
          {ex && (
            <div className="mt-1.5 border-t pt-1.5" style={{ borderColor: 'var(--vj-border)' }}>
              <p style={{ color: 'var(--vj-text-sub)' }}>{ex.cause}</p>
              <p className="mt-0.5" style={{ color: 'var(--vj-text-sub)' }}>
                <strong style={{ color: 'var(--vj-text)' }}>Fix:</strong> {ex.fix}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OutputPanel: React.FC<{
  error: string | null; log: string; diags: Diag[]; onGoTo: (d: Diag) => void;
}> = ({ error, log, diags, onGoTo }) => {
  const problems = diags.filter((d) => d.severity !== 'note');
  const notes = diags.filter((d) => d.severity === 'note');
  // A hard failure with no parsed diagnostic still has to say something.
  const orphanError = error && !problems.some((d) => d.severity === 'error');

  return (
  <div className="h-full overflow-auto p-3">
    {orphanError && (
      <div className="mb-3 flex items-start gap-2 rounded-lg border p-3 text-[12px]"
           style={{ borderColor: 'var(--vj-fail)', background: 'var(--vj-fail-bg)', color: 'var(--vj-fail)' }}>
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span className="whitespace-pre-wrap">{error}</span>
      </div>
    )}

    {problems.length > 0 && (
      <div className="mb-3 flex flex-col gap-2">
        {problems.map((d, i) => <DiagRow key={`${d.file}${d.line}${i}`} diag={d} onGoTo={onGoTo} />)}
      </div>
    )}

    {notes.length > 0 && (
      <div className="mb-3 flex flex-col gap-2">
        {notes.map((d, i) => <DiagRow key={`n${d.file}${d.line}${i}`} diag={d} onGoTo={onGoTo} />)}
      </div>
    )}

    <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed"
         style={{ color: 'var(--vj-text-sub)' }}>
      {log || 'Run to see the elaborated top module, its clock and reset, and any Yosys warnings.'}
    </pre>

    <div className="mt-4 flex items-start gap-2 rounded-lg border p-3 text-[11.5px]"
         style={{ borderColor: 'var(--vj-border)', color: 'var(--vj-text-dim)' }}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--vj-info)' }} />
      <span>
        The engine is Yosys, which synthesizes hardware rather than interpreting it.
        {' '}<Code>initial</Code>, <Code>#delay</Code> and <Code>$display</Code> are discarded;
        {' '}<Code>$finish</Code> and <Code>$stop</Code> stop synthesis outright. So a testbench
        here drives the design from clocked logic and exposes what you want to watch as
        {' '}<strong>output ports</strong> — every output becomes a waveform row.
      </span>
    </div>
  </div>
  );
};

const EmptyState: React.FC<{ error: string | null }> = ({ error }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-xl"
          style={{ background: 'var(--vj-surface-2)', color: 'var(--vj-text-dim)' }}>
      <Activity className="h-5 w-5" />
    </span>
    <p className="max-w-xs text-[13px]" style={{ color: 'var(--vj-text-dim)' }}>
      {error
        ? 'Fix the errors in the Output tab, then run again.'
        : <>Press <strong>Run</strong> to synthesize both files and simulate the top module.</>}
    </p>
  </div>
);

export default VerilogSandbox;
