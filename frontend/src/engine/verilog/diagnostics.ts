/**
 * Parse Yosys stdout/stderr into structured diagnostics so the bench can tell
 * the user exactly what is wrong and on which wire/line. Yosys reports two ways:
 *   - hard errors throw and log `design.v:LINE: ERROR: message`
 *   - softer problems (undeclared wire, width mismatch, multiple drivers) do NOT
 *     throw - it warns (`design.v:LINE: Warning: ...`, often naming `\sig` or
 *     `top.\sig`) and synthesizes anyway. We surface those too.
 */
export interface Diag {
  // 'note' = benign, expected Yosys chatter that isn't a problem with the design
  // (e.g. an array being inferred as flip-flops). Surfaced quietly, never as an alarm.
  severity: 'error' | 'warning' | 'note';
  line?: number;
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
    const locm = /design\.v:(\d+)/.exec(line);
    const ln = locm ? parseInt(locm[1], 10) : undefined;
    // signal name in `\sig' / 'sig' / module.\sig form
    const sigm = /[`'][\\]?([A-Za-z_]\w*)'|\.\\([A-Za-z_]\w*)/.exec(line);
    const signal = sigm ? (sigm[1] || sigm[2]) : undefined;
    const key = `${severity}|${ln ?? ''}|${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ severity, line: ln, signal, message });
  }
  // errors first, then warnings, then benign notes; stable within each group
  const rank = { error: 0, warning: 1, note: 2 } as const;
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
