/**
 * Parse Yosys stdout/stderr into structured diagnostics so the bench can tell
 * the user exactly what is wrong, in which file, and on which line. Yosys
 * reports two ways:
 *   - hard errors throw and log `design.v:LINE: ERROR: message`
 *   - softer problems (undeclared wire, width mismatch, multiple drivers) do NOT
 *     throw - it warns (`design.v:LINE: Warning: ...`, often naming `\sig` or
 *     `top.\sig`) and synthesizes anyway. We surface those too.
 *
 * Locations come in two shapes, both of which appear in real logs:
 *   `design.v:12:`                        line only, on the message prefix
 *   `... at design.v:2.8-2.13.`           line.col-line.col, mid-message
 * The filename is whatever the source claimed — the sandbox emits `\`line`
 * directives so Yosys attributes errors to `design.v` or `testbench.v` itself
 * rather than to the concatenated buffer it actually parsed.
 */
export interface Diag {
  // 'note' = benign, expected Yosys chatter that isn't a problem with the design
  // (e.g. an array being inferred as flip-flops). Surfaced quietly, never as an alarm.
  severity: 'error' | 'warning' | 'note';
  /** Source file the location refers to, when Yosys named one. */
  file?: string;
  line?: number;
  endLine?: number;
  /** 1-based columns, only present on the messages that carry a span. */
  col?: number;
  endCol?: number;
  signal?: string;
  message: string;
}

// Yosys warnings that are normal, expected, and not actionable in a learning
// sandbox. These get demoted to 'note' so they don't clutter the schematic or
// mark the editor with scary squiggles. Keep this list conservative — only
// genuinely benign chatter, never anything that hints at a real design bug.
const BENIGN_PATTERNS: RegExp[] = [
  /Replacing memory\b.*\bwith list of registers/i, // array inferred as FFs — expected
  /Yosys\s+\d/i,                                    // version banner
  /Removed?\s+\d+\s+unused\b/i,                     // dead-code cleanup
];

function classify(kind: 'ERROR' | 'Warning', message: string): Diag['severity'] {
  if (kind === 'ERROR') return 'error';
  return BENIGN_PATTERNS.some((re) => re.test(message)) ? 'note' : 'warning';
}

/** `design.v:12`, `testbench.v:3.5-3.9` — filename kept as reported. */
const LOC = /([A-Za-z0-9_.\-/]+\.s?v):(\d+)(?:\.(\d+)(?:-(\d+)\.(\d+))?)?/;

function locate(line: string): Pick<Diag, 'file' | 'line' | 'endLine' | 'col' | 'endCol'> {
  const m = LOC.exec(line);
  if (!m) return {};
  const num = (s: string | undefined) => (s === undefined ? undefined : parseInt(s, 10));
  return {
    file: m[1],
    line: num(m[2]),
    col: num(m[3]),
    endLine: num(m[4]),
    endCol: num(m[5]),
  };
}

export function parseDiagnostics(log: string): Diag[] {
  const out: Diag[] = [];
  const seen = new Set<string>();
  for (const raw of log.split('\n')) {
    const line = raw.trim();
    if (!line || /unique messages/i.test(line)) continue;
    const m = /\b(ERROR|Warning):\s*(.+)$/.exec(line);
    if (!m) continue;
    const message = m[2].trim().replace(/\s+$/, '');
    const severity: Diag['severity'] = classify(m[1] as 'ERROR' | 'Warning', message);
    const loc = locate(line);
    // signal name in `\sig' / 'sig' / module.\sig form
    const sigm = /[`'][\\]?([A-Za-z_]\w*)'|\.\\([A-Za-z_]\w*)/.exec(line);
    const signal = sigm ? (sigm[1] || sigm[2]) : undefined;
    const key = `${severity}|${loc.file ?? ''}|${loc.line ?? ''}|${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ severity, ...loc, signal, message });
  }
  // errors first, then warnings, then benign notes; stable within each group
  const rank = { error: 0, warning: 1, note: 2 } as const;
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

// ── plain-English explanations ───────────────────────────────────────────────

export interface Explanation {
  /** What actually went wrong, in the user's terms rather than the parser's. */
  cause: string;
  /** What to do about it. */
  fix: string;
}

/**
 * Yosys speaks parser-generator: "unexpected TOK_INPUT, expecting ';'" names
 * the token the grammar choked on, which tells a learner nothing. Every pattern
 * below was taken from real Yosys output (see the corpus in the tests), not
 * guessed, and each says what the user typed wrong and what to type instead.
 *
 * A message with no entry here is still shown verbatim — an unexplained real
 * error beats a confidently wrong explanation.
 */
const EXPLANATIONS: { re: RegExp; explain: (m: RegExpExecArray) => Explanation }[] = [
  {
    // The single most common first-timer error: Verilog-1995 headers need a
    // semicolon before the port declarations start.
    re: /syntax error, unexpected TOK_(INPUT|OUTPUT|INOUT|REG|WIRE)\b.*expecting ';'/i,
    explain: () => ({
      cause: 'The line before this one is missing its semicolon.',
      fix: "End the module header with `;` — `module top (sum, cout, a, b);` — then declare the ports on the following lines.",
    }),
  },
  {
    re: /syntax error, unexpected end of file/i,
    explain: () => ({
      cause: 'The file ended while something was still open.',
      fix: 'Check that every `module` has a matching `endmodule`, and every `begin` a matching `end`.',
    }),
  },
  {
    re: /syntax error, unexpected '\.', expecting '\)' or ','/i,
    explain: () => ({
      cause: 'Two port connections in an instantiation are not separated by a comma.',
      fix: 'Put a comma between them: `top uut (.clk(clk), .a(a), .y(y));`',
    }),
  },
  {
    re: /syntax error, unexpected (\S+?),? expecting (.+)$/i,
    explain: (m) => ({
      cause: `The parser reached ${m[1].replace(/^TOK_/, '').toLowerCase()} where it needed ${m[2].replace(/TOK_/g, '').toLowerCase()}.`,
      fix: 'Check this line and the one above it for a missing semicolon, comma, bracket, or keyword.',
    }),
  },
  {
    re: /Identifier `?\\?(\w+)'? is implicitly declared/i,
    explain: (m) => ({
      cause: `\`${m[1]}\` was never declared, so Verilog silently created it as a 1-bit wire.`,
      fix: `Declare it (\`wire\`/\`reg\`, with the width you meant) or fix the spelling — Verilog is case-sensitive, so \`${m[1]}\` and \`${m[1].toLowerCase()}\` are different signals.`,
    }),
  },
  {
    re: /Wire (\S+) is used but has no driver/i,
    explain: (m) => ({
      cause: `Nothing ever assigns \`${m[1].replace(/^.*\\/, '')}\`, so it reads as undefined.`,
      fix: 'Drive it with an `assign`, or from an `always` block, or connect it to a module port.',
    }),
  },
  {
    re: /reg '?\\?(\w+)'? is assigned in a continuous assignment/i,
    explain: (m) => ({
      cause: `\`${m[1]}\` is declared \`reg\` but driven by an \`assign\`, which is not legal Verilog.`,
      fix: `Either declare \`${m[1]}\` as \`wire\` and keep the \`assign\`, or keep \`reg\` and drive it inside an \`always\` block.`,
    }),
  },
  {
    re: /Module `?\\?(\w+)'? referenced in module `?\\?(\w+)'?.*is not part of the design/i,
    explain: (m) => ({
      cause: `\`${m[2]}\` instantiates a module called \`${m[1]}\`, but no such module is defined.`,
      fix: `Define \`${m[1]}\` in design.v or testbench.v, or correct the name — the sandbox only sees these two files.`,
    }),
  },
  {
    re: /Digit larger than \d+ used in .*base-(\d+) constant/i,
    explain: (m) => ({
      cause: `A literal contains a digit that does not exist in base ${m[1]}.`,
      fix: m[1] === '2'
        ? "Binary literals may only use 0, 1, x, z and _ — e.g. `4'b1010`."
        : `Use digits valid in base ${m[1]}, or change the base letter.`,
    }),
  },
  {
    // Two distinct Yosys messages, same root cause: $finish/$stop are
    // simulator controls. Inside an `initial` block Yosys *executes* the task
    // during elaboration and aborts; outside one it refuses outright.
    re: /System task `?\\?\$(finish|stop)'? (?:executed|outside initial block is unsupported)/i,
    explain: (m) => ({
      cause: `\`$${m[1]}\` is a simulator command, and this engine synthesizes hardware — it ran the task at elaboration time and stopped, so no circuit was built.`,
      fix: `Delete the \`$${m[1]}\`. How long the simulation runs is set by the cycles box in the status bar, not by the source.`,
    }),
  },
  {
    // Fires when a testbench instantiates the design with `#(.W(4))` but the
    // design declares no such parameter — the classic symptom of editing the
    // design while leaving the starter testbench in place. Yosys blames
    // design.v line 1, which is nowhere near the real problem.
    re: /Can'?t find object for defparam `?\\?(\w+)'?/i,
    explain: (m) => ({
      cause: `The testbench passes a parameter \`${m[1]}\` that your design does not declare.`,
      fix: `Either add \`parameter ${m[1]} = …\` to the design's module header, or drop the \`#(.${m[1]}(…))\` from the instantiation in testbench.v.`,
    }),
  },
  {
    re: /Ignoring call to system task \$(\w+)/i,
    explain: (m) => ({
      cause: `\`$${m[1]}\` has no hardware meaning, so it was skipped.`,
      fix: 'Waveforms are captured automatically — every output port of the top module becomes a row.',
    }),
  },
  {
    re: /multiple conflicting drivers/i,
    explain: () => ({
      cause: 'More than one statement drives the same signal at the same time.',
      fix: 'Give the signal exactly one driver — one `assign`, or one `always` block, never both.',
    }),
  },
];

export function explainDiagnostic(d: Diag): Explanation | undefined {
  for (const { re, explain } of EXPLANATIONS) {
    const m = re.exec(d.message);
    if (m) return explain(m);
  }
  return undefined;
}
