/**
 * Turning the sandbox's two editors into one thing Yosys can read — without
 * losing track of which file each line came from.
 *
 * The sandbox concatenates design.v and testbench.v and hands Yosys a single
 * buffer. Naively that makes every reported line number wrong for the testbench:
 * an error on testbench.v line 3 gets reported as line 8, pointing at innocent
 * code in the other file. Rather than correcting the numbers afterwards with
 * arithmetic (which breaks the moment anything else touches the buffer), we tell
 * the parser the truth up front with `\`line` directives. Yosys honours them, so
 * it reports `testbench.v:3` on its own and every downstream consumer — the
 * output panel, the editor squiggles — gets correct locations for free.
 *
 * The directives are preprocessor-only: synthesis is unaffected. The netlist is
 * structurally identical with and without them, differing only in the source
 * locations baked into auto-generated cell names, which is precisely the point.
 */
import type { Diag } from './diagnostics';

export const DESIGN_FILE = 'design.v';
export const TB_FILE = 'testbench.v';

/**
 * `\`line N "file" 0` resets the parser's position: the NEXT physical line is
 * line N of "file". Level 0 means "neither entering nor leaving an include".
 */
const directive = (file: string) => `\`line 1 "${file}" 0`;

/** Combine both editors into the single source Yosys parses. */
export function buildSandboxSource(design: string, tb: string): string {
  const parts = [directive(DESIGN_FILE), design];
  if (tb.trim()) parts.push(directive(TB_FILE), tb);
  return parts.join('\n');
}

// ── pre-run lint ─────────────────────────────────────────────────────────────

/**
 * Constructs Yosys accepts and then silently throws away.
 *
 * This is the sandbox's single most confusing failure: a testbench written in
 * normal simulation style (`initial`, `#10`, `$display`) synthesizes cleanly,
 * reports no error, and produces a flat waveform — because none of it was
 * executed. Yosys says nothing, so we have to. Vivado's elaboration warnings do
 * the same job for the same reason.
 */
const NON_SYNTH: {
  re: RegExp; what: string; why: string; severity: Diag['severity'];
}[] = [
  {
    re: /^\s*initial\b/,
    what: '`initial` block',
    why: 'Initial blocks describe simulation-time behaviour, not hardware, so synthesis discards them. Drive the design from an `always @(posedge clk)` block instead, and use the reset input for start-up values.',
    severity: 'note',
  },
  {
    re: /#\s*\d/,
    what: 'delay (`#`)',
    why: 'Delays have no hardware meaning and are ignored. Sequence your stimulus by counting clock cycles in a register instead.',
    severity: 'note',
  },
  {
    re: /\$(display|write|monitor|strobe)\b/,
    what: 'text output task',
    why: 'There is no console to print to — this line is discarded. Expose the value as an `output` port and read it off the waveform.',
    severity: 'note',
  },
  {
    // NOT merely ignored: Yosys either executes $finish during elaboration and
    // aborts ("System task `$finish' executed."), or rejects it outright when it
    // sits outside an initial block. Either way synthesis fails and there is no
    // netlist, so this is an error the moment it is typed.
    re: /\$(finish|stop)\b/,
    what: '`$finish` / `$stop`',
    why: 'The synthesis engine runs this at elaboration time and aborts, so nothing is built. Delete it — the run length is set by the cycles box in the status bar, not by the source.',
    severity: 'error',
  },
  {
    re: /\$(dumpfile|dumpvars)\b/,
    what: 'VCD dump task',
    why: 'Waveforms are captured automatically — every output port of the top module becomes a row.',
    severity: 'note',
  },
];

/** Strip comments and string literals so a keyword inside them never lints. */
function stripNoise(src: string): string[] {
  const noBlock = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  return noBlock.split('\n').map((l) =>
    l.replace(/\/\/.*$/, '').replace(/"(?:[^"\\]|\\.)*"/g, '""'));
}

/**
 * Flag non-synthesizable constructs before Yosys quietly drops them. Returns
 * notes, never errors: the code is legal Verilog and will synthesize — it just
 * will not do what the author expects.
 */
export function lintNonSynthesizable(source: string, file: string): Diag[] {
  const out: Diag[] = [];
  const reported = new Set<string>();
  stripNoise(source).forEach((text, i) => {
    for (const { re, what, why, severity } of NON_SYNTH) {
      if (!re.test(text)) continue;
      // One note per construct per file: a testbench with twenty `$display`
      // calls should say one useful thing, not twenty identical ones.
      if (reported.has(what)) continue;
      reported.add(what);
      const verb = severity === 'error'
        ? 'is not supported by the synthesis engine'
        : 'is ignored by the synthesis engine';
      out.push({ severity, file, line: i + 1, message: `${what} ${verb}. ${why}` });
    }
  });
  return out;
}

/** Lint both sandbox files, tagging each note with the file it came from. */
export function lintSandbox(design: string, tb: string): Diag[] {
  return [
    ...lintNonSynthesizable(design, DESIGN_FILE),
    ...(tb.trim() ? lintNonSynthesizable(tb, TB_FILE) : []),
  ];
}

// ── testbench / design agreement ─────────────────────────────────────────────

export interface BenchWiring {
  /** Parameters the testbench overrides, e.g. `W` from `#(.W(4))`. */
  params: string[];
  /** Ports it connects by name, e.g. `clk` from `.clk(clk)`. */
  ports: string[];
}

/**
 * What the testbench *tries* to connect the design to.
 *
 * Deliberately a regex over text rather than a parse: this only ever runs to
 * explain a failure that already happened, so being approximate is fine, but
 * being wrong is not — it looks for one specific shape, `<module> <inst> (...)`,
 * and returns nothing when it does not find exactly that.
 */
export function benchWiring(tb: string, moduleName: string): BenchWiring | null {
  const src = stripNoise(tb).join('\n');
  // `top #(.W(4)) uut ( .clk(clk), ... );` — the parameter list is optional.
  const re = new RegExp(
    `\\b${moduleName}\\s*(#\\s*\\(([^;]*?)\\))?\\s*\\w+\\s*\\(([\\s\\S]*?)\\)\\s*;`, 'm');
  const m = re.exec(src);
  if (!m) return null;
  const names = (chunk: string) =>
    [...chunk.matchAll(/\.\s*(\w+)\s*\(/g)].map((x) => x[1]);
  return { params: names(m[2] ?? ''), ports: names(m[3] ?? '') };
}

/**
 * Compare what the testbench connects against the design's real ports (read
 * from the netlist, so these are facts rather than another regex). Returns a
 * human sentence, or null when the two agree well enough to say nothing.
 */
export function describeBenchMismatch(
  wiring: BenchWiring | null,
  designPorts: string[],
): string | null {
  if (!wiring) return null;
  const have = new Set(designPorts);
  const unknown = wiring.ports.filter((p) => !have.has(p));
  const unconnected = designPorts.filter((p) => !wiring.ports.includes(p));
  const bits: string[] = [];
  if (wiring.params.length) {
    bits.push(`passes parameter${wiring.params.length > 1 ? 's' : ''} ${wiring.params.map((p) => `\`${p}\``).join(', ')}`);
  }
  if (unknown.length) {
    bits.push(`connects ${unknown.map((p) => `\`${p}\``).join(', ')}, which the design does not declare`);
  }
  if (!bits.length) return null;
  const tail = unconnected.length
    ? ` The design's actual ports are ${designPorts.map((p) => `\`${p}\``).join(', ')}.`
    : '';
  return `testbench.v ${bits.join(', and ')}.${tail}`;
}

/**
 * Fold the lint into what Yosys said, without saying it twice.
 *
 * The two overlap by design: `$finish` trips our lint AND makes Yosys abort, so
 * a naive concatenation reports the same line twice in slightly different words.
 * Where Yosys has already spoken about a line it wins — it saw the real parse,
 * and our lint is only a regex over text.
 */
export function mergeDiagnostics(fromYosys: Diag[], fromLint: Diag[]): Diag[] {
  const spokenFor = new Set(
    fromYosys.filter((d) => d.line).map((d) => `${d.file ?? DESIGN_FILE}:${d.line}`));
  return [
    ...fromYosys,
    ...fromLint.filter((d) => !spokenFor.has(`${d.file ?? DESIGN_FILE}:${d.line}`)),
  ];
}
