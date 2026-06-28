/**
 * Parse Yosys stdout/stderr into structured diagnostics so the bench can tell
 * the user exactly what is wrong and on which wire/line. Yosys reports two ways:
 *   - hard errors throw and log `design.v:LINE: ERROR: message`
 *   - softer problems (undeclared wire, width mismatch, multiple drivers) do NOT
 *     throw - it warns (`design.v:LINE: Warning: ...`, often naming `\sig` or
 *     `top.\sig`) and synthesizes anyway. We surface those too.
 */
export interface Diag {
  severity: 'error' | 'warning';
  line?: number;
  signal?: string;
  message: string;
}

export function parseDiagnostics(log: string): Diag[] {
  const out: Diag[] = [];
  const seen = new Set<string>();
  for (const raw of log.split('\n')) {
    const line = raw.trim();
    if (!line || /unique messages/i.test(line)) continue;
    const m = /\b(ERROR|Warning):\s*(.+)$/.exec(line);
    if (!m) continue;
    const severity: Diag['severity'] = m[1] === 'ERROR' ? 'error' : 'warning';
    const message = m[2].trim().replace(/\s+$/, '');
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
  // errors first, then warnings; stable within
  return out.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1));
}
