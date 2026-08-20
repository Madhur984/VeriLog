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
 * Verilog, so `initial`, `#delay`, `$display` and `$finish` are discarded rather
 * than executed. A testbench here is therefore a *synthesizable* one: a module
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
  Activity, Network, Terminal, AlertTriangle, Info, Share2, Check,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { synthesize, type SynthProgress } from '../engine/verilog/yosysClient';
import { buildFromNetlist, runTrace, type PortInfo, type Trace } from '../engine/verilog/simRunner';
import { buildSeqVectors, buildVectors, type StimPort } from '../engine/verilog/stimulus';
import type { Diag } from '../engine/verilog/diagnostics';
import { WaveformViewer } from '../components/verilog/WaveformViewer';
import { SynthSchematicView } from '../components/verilog/SynthSchematicView';

const DESIGN_KEY = 'vsbx_design_v1';
const TB_KEY = 'vsbx_tb_v1';
const CYCLES_KEY = 'vsbx_cycles_v1';

const STARTER_DESIGN = `// Your design. Anything synthesizable works.
module counter #(
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
// Every output below shows up as a row in the waveform.
module tb(
  input        clk,
  input        rst,
  output       en,
  output [3:0] count
);
  // Free-running tick so the stimulus is self-generated.
  reg [3:0] tick;
  always @(posedge clk) begin
    if (rst) tick <= 4'd0;
    else     tick <= tick + 1'b1;
  end

  // Hold the design disabled for the first few cycles, then let it run.
  assign en = (tick > 4'd2);

  counter #(.W(4)) dut (
    .clk   (clk),
    .rst   (rst),
    .en    (en),
    .count (count)
  );
endmodule
`;

/** Ports whose names read like a clock, in the order engineers write them. */
const CLOCK_NAMES = /^(clk|clock|clk_i|i_clk|clki|sysclk|clk_in)$/i;
const RESET_NAMES = /^(rst|reset|rst_n|resetn|reset_n|nrst|n_rst|arst|arst_n|rst_i|i_rst)$/i;

const inferClock = (ports: PortInfo[]): string | undefined =>
  ports.find((p) => p.direction === 'input' && p.width === 1 && CLOCK_NAMES.test(p.name))?.name;

const inferReset = (ports: PortInfo[]): { name: string; activeLow: boolean } | undefined => {
  const p = ports.find((x) => x.direction === 'input' && x.width === 1 && RESET_NAMES.test(x.name));
  if (!p) return undefined;
  return { name: p.name, activeLow: /(_n|^n)/i.test(p.name.replace(/^(rst|reset|arst)/i, '')) || /^n/i.test(p.name) };
};

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

type OutTab = 'wave' | 'schematic' | 'console';

export const VerilogSandbox: React.FC = () => {
  const navigate = useNavigate();
  const [scheme, toggleScheme] = useColorScheme();
  const isLight = scheme === 'light';

  const [design, setDesign] = useState(() => localStorage.getItem(DESIGN_KEY) ?? STARTER_DESIGN);
  const [tb, setTb] = useState(() => localStorage.getItem(TB_KEY) ?? STARTER_TB);
  const [file, setFile] = useState<'design' | 'tb'>('design');
  const [cycles, setCycles] = useState(() => Number(localStorage.getItem(CYCLES_KEY)) || 32);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<SynthProgress | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [log, setLog] = useState<string>('');
  const [diags, setDiags] = useState<Diag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [topName, setTopName] = useState<string | null>(null);
  const [outTab, setOutTab] = useState<OutTab>('wave');
  const [copied, setCopied] = useState(false);
  const runSeq = useRef(0);

  useEffect(() => { try { localStorage.setItem(DESIGN_KEY, design); } catch { /* quota */ } }, [design]);
  useEffect(() => { try { localStorage.setItem(TB_KEY, tb); } catch { /* quota */ } }, [tb]);
  useEffect(() => { try { localStorage.setItem(CYCLES_KEY, String(cycles)); } catch { /* quota */ } }, [cycles]);

  /** Both files, in the order Yosys reads them. */
  const combined = useMemo(
    () => `${design}\n\n${tb.trim() ? tb : ''}`,
    [design, tb],
  );

  const run = useCallback(async () => {
    const seq = ++runSeq.current;
    setRunning(true);
    setError(null);
    setProgress(null);
    try {
      // Flatten so the testbench's DUT instance dissolves into cells the
      // simulator can actually evaluate.
      const r = await synthesize(combined, (p) => {
        if (runSeq.current === seq) setProgress(p);
      }, { flatten: true });
      if (runSeq.current !== seq) return;

      setDiags(r.diagnostics);
      if (!r.ok) {
        setError(r.error);
        setLog(r.error);
        setOutTab('console');
        return;
      }

      const built = buildFromNetlist(r.json);
      if (!built.ok) { setError(built.error); setOutTab('console'); return; }

      setTopName(built.moduleName);
      const clock = inferClock(built.ports);
      const reset = inferReset(built.ports);
      const drivable: StimPort[] = built.ports
        .filter((p) => p.direction === 'input' && p.name !== clock)
        .map((p) => ({ name: p.name, width: p.width }));

      // A self-driving testbench has no inputs beyond the clock; give it empty
      // vectors so it still gets `cycles` clock edges.
      const vectors = clock
        ? (drivable.length
          ? buildSeqVectors(drivable, { cycles, reset, seed: 1 })
          : Array.from({ length: cycles }, () => ({})))
        : buildVectors(drivable, { mode: drivable.length ? 'exhaustive' : 'vectors', vectors: 1 });

      const t = runTrace(built.sim, vectors, { clock });
      setTrace(t);
      setOutTab('wave');

      const unsupported = built.sim.unsupported;
      setLog([
        `top module   : ${built.moduleName}`,
        `clock        : ${clock ?? '(none — combinational)'}`,
        `reset        : ${reset ? `${reset.name}${reset.activeLow ? ' (active low)' : ''}` : '(none)'}`,
        `driven inputs: ${drivable.length ? drivable.map((d) => `${d.name}[${d.width}]`).join(', ') : '(self-driving)'}`,
        `cycles       : ${t.cycles}`,
        `signals      : ${t.signals.length}`,
        unsupported.length ? `\nunsupported cells: ${unsupported.join(', ')}` : '',
        r.diagnostics.length
          ? `\n${r.diagnostics.map((d) => `${d.severity.toUpperCase()}${d.line ? ` line ${d.line}` : ''}: ${d.message}`).join('\n')}`
          : '',
      ].filter(Boolean).join('\n'));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutTab('console');
    } finally {
      if (runSeq.current === seq) { setRunning(false); setProgress(null); }
    }
  }, [combined, cycles]);

  // ⌘/Ctrl+Enter anywhere, including inside Monaco.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  const reset = () => {
    setDesign(STARTER_DESIGN);
    setTb(STARTER_TB);
    setTrace(null);
    setError(null);
    setLog('');
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

  const tabBtn = (on: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${
      on ? '' : 'hover:opacity-80'}`;
  const tabStyle = (on: boolean): React.CSSProperties => on
    ? { background: 'var(--vj-surface-0)', color: 'var(--vj-text)', borderBottom: '2px solid var(--vj-wave)' }
    : { color: 'var(--vj-text-dim)', borderBottom: '2px solid transparent' };

  return (
    <div className="vj-scope flex h-[100svh] w-full flex-col overflow-hidden"
         style={{ background: 'var(--vj-surface-0)', color: 'var(--vj-text)' }}>

      {/* ── header ──────────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 lg:px-4"
              style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
        <button onClick={() => navigate('/portal')} title="Back to portal"
                className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold transition-colors"
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
              {topName ? `top · ${topName}` : 'bitforbytes'}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="hidden items-center gap-1.5 text-[11px] sm:flex"
                 style={{ color: 'var(--vj-text-dim)' }}>
            cycles
            <input
              type="number" min={1} max={512} value={cycles}
              onChange={(e) => setCycles(Math.max(1, Math.min(512, Number(e.target.value) || 1)))}
              className="h-8 w-16 rounded-md border bg-transparent px-2 text-center font-mono text-[12px] outline-none"
              style={{ borderColor: 'var(--vj-border-strong)', color: 'var(--vj-text-code)' }}
            />
          </label>

          <button onClick={share} title="Copy both files to the clipboard"
                  className="grid h-9 w-9 place-items-center rounded-lg transition-colors"
                  style={{ color: copied ? 'var(--vj-pass)' : 'var(--vj-text-dim)' }}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </button>
          <button onClick={reset} title="Restore the starter example"
                  className="grid h-9 w-9 place-items-center rounded-lg transition-colors"
                  style={{ color: 'var(--vj-text-dim)' }}>
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={toggleScheme} title={isLight ? 'Dark mode' : 'Light mode'}
                  className="grid h-9 w-9 place-items-center rounded-lg transition-colors"
                  style={{ color: 'var(--vj-text-dim)' }}>
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button onClick={run} disabled={running}
                  className="flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                  style={{ background: 'var(--vj-wave)', color: 'var(--vj-surface-0)' }}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run
          </button>
        </div>
      </header>

      {/* ── body ────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">

        {/* editor */}
        <section className="flex min-h-0 flex-1 flex-col border-b lg:w-1/2 lg:border-b-0 lg:border-r"
                 style={{ borderColor: 'var(--vj-border)' }}>
          <div className="flex shrink-0 items-center gap-0 border-b"
               style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
            <button onClick={() => setFile('design')} className={tabBtn(file === 'design')} style={tabStyle(file === 'design')}>
              <FileCode2 className="h-3.5 w-3.5" /> design.v
            </button>
            <button onClick={() => setFile('tb')} className={tabBtn(file === 'tb')} style={tabStyle(file === 'tb')}>
              <FlaskConical className="h-3.5 w-3.5" /> testbench.v
            </button>
            <span className="ml-auto px-3 font-mono text-[10px]" style={{ color: 'var(--vj-text-dim)' }}>
              ⌘↵ run
            </span>
          </div>

          <div className="min-h-0 flex-1">
            <Editor
              key={file}
              language="verilog"
              path={file === 'design' ? 'design.v' : 'testbench.v'}
              value={file === 'design' ? design : tb}
              onChange={(v) => (file === 'design' ? setDesign(v ?? '') : setTb(v ?? ''))}
              beforeMount={registerVerilog}
              theme={isLight ? 'vs' : 'vs-dark'}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono','IBM Plex Mono',monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'line',
                smoothScrolling: true,
                tabSize: 2,
              }}
            />
          </div>
        </section>

        {/* output */}
        <section className="flex min-h-0 flex-1 flex-col lg:w-1/2">
          <div className="flex shrink-0 items-center gap-0 border-b"
               style={{ borderColor: 'var(--vj-border)', background: 'var(--vj-surface-1)' }}>
            <button onClick={() => setOutTab('wave')} className={tabBtn(outTab === 'wave')} style={tabStyle(outTab === 'wave')}>
              <Activity className="h-3.5 w-3.5" /> Waveform
            </button>
            <button onClick={() => setOutTab('schematic')} className={tabBtn(outTab === 'schematic')} style={tabStyle(outTab === 'schematic')}>
              <Network className="h-3.5 w-3.5" /> Schematic
            </button>
            <button onClick={() => setOutTab('console')} className={tabBtn(outTab === 'console')} style={tabStyle(outTab === 'console')}>
              <Terminal className="h-3.5 w-3.5" /> Console
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
              running ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--vj-wave)' }} />
                  <span className="text-[13px]" style={{ color: 'var(--vj-text-dim)' }}>
                    {progress && progress.total > 0 && progress.done < progress.total
                      ? `Downloading the Yosys engine — ${Math.round((progress.done / progress.total) * 100)}% (once per session)`
                      : 'Synthesizing and simulating…'}
                  </span>
                  {progress && progress.total > 0 && progress.done < progress.total && (
                    <div className="h-1 w-56 overflow-hidden rounded-full" style={{ background: 'var(--vj-border)' }}>
                      <div className="h-full rounded-full transition-all"
                           style={{ width: `${(progress.done / progress.total) * 100}%`, background: 'var(--vj-wave)' }} />
                    </div>
                  )}
                </div>
              ) : trace ? (
                <WaveformViewer
                  trace={trace}
                  outputNames={trace.signals.filter((s) => s.role === 'output').map((s) => s.name)}
                  isLight={isLight}
                />
              ) : (
                <EmptyState error={error} />
              )
            )}

            {outTab === 'schematic' && (
              <SynthSchematicView code={combined} isLight={isLight} />
            )}

            {outTab === 'console' && (
              <div className="h-full overflow-auto p-3">
                {error && (
                  <div className="mb-3 flex items-start gap-2 rounded-lg border p-3 text-[12px]"
                       style={{ borderColor: 'var(--vj-fail)', background: 'var(--vj-fail-bg)', color: 'var(--vj-fail)' }}>
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="whitespace-pre-wrap">{error}</span>
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
                    {' '}<code>initial</code>, <code>#delay</code>, <code>$display</code> and <code>$finish</code>{' '}
                    are discarded, so a testbench here drives the design from clocked logic and exposes
                    what you want to watch as <strong>output ports</strong> — every output becomes a
                    waveform row.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
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
        ? 'Fix the errors in the Console tab, then run again.'
        : <>Press <strong>Run</strong> to synthesize both files and simulate the top module.</>}
    </p>
  </div>
);

export default VerilogSandbox;
