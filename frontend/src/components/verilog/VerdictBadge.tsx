/**
 * VerdictBadge — UI/UX master plan §6.1.
 *
 * The single most trust-critical surface in the product. A green tick that
 * means "we proved this correct for every possible input" and a green tick that
 * means "we tried 256 random vectors and none failed" are different claims, and
 * showing the same tick for both is a lie of omission that would make the tool
 * untrustworthy to a professional the first time they noticed.
 *
 * So each verdict pairs three independent signals — colour, glyph, and text —
 * and carries a tooltip stating in plain language exactly what was and was not
 * established. Colour is never load-bearing on its own (§13): the badge is
 * fully readable in greyscale, and the `sampled` case additionally gets a
 * dashed border so its lower confidence survives even a monochrome screenshot.
 *
 * `proved` and `bounded` are wired here but not yet produced by the grader;
 * they arrive with the Yosys miter+SAT path. Writing the contract once means
 * that phase is a grader change, not a UI redesign.
 */
import React from 'react';
import { ShieldCheck, Shield, Layers, Dices, XCircle, AlertTriangle } from 'lucide-react';
import type { VerdictKind } from '../../engine/verilog/diffGrade';

export interface VerdictSpec {
  label: string;
  /** Plain-language statement of what this verdict does and does not establish. */
  tooltip: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  /** CSS custom-property names, so every theme resolves it (§4.2). */
  fg: string;
  bg: string;
  /** Lower-confidence verdicts get a dashed border — legible without colour. */
  dashed?: boolean;
}

export const VERDICT_SPECS: Record<VerdictKind, VerdictSpec> = {
  proved: {
    label: 'Proved equivalent',
    tooltip:
      'Formally verified equivalent to the reference for every possible input, '
      + 'for all time. This is a mathematical proof, not a test.',
    icon: ShieldCheck,
    fg: 'var(--vj-proved)',
    bg: 'var(--vj-proved-bg)',
  },
  exhaustive: {
    label: 'Exhaustive',
    tooltip:
      'Every possible input combination was checked directly — nothing was '
      + 'sampled or skipped. For a design this narrow, that is as strong as a proof.',
    icon: Shield,
    fg: 'var(--vj-exhaustive)',
    bg: 'var(--vj-exhaustive-bg)',
  },
  bounded: {
    label: 'Bounded',
    tooltip:
      'Proved equivalent for every input over a fixed number of clock cycles '
      + 'from reset. Divergence beyond that horizon is not ruled out.',
    icon: Layers,
    fg: 'var(--vj-bounded)',
    bg: 'var(--vj-bounded-bg)',
  },
  sampled: {
    label: 'Sampled',
    tooltip:
      'Passed a sample of test vectors. This is evidence, not proof — a rare '
      + 'edge case outside the sample could still be wrong.',
    icon: Dices,
    fg: 'var(--vj-sampled-accent)',
    bg: 'var(--vj-sampled-bg)',
    dashed: true,
  },
};

/** Human-readable detail appended to the label, e.g. "all 256 inputs". */
function detailText(
  kind: VerdictKind,
  detail?: { cycles?: number; space?: number },
): string | null {
  if (kind === 'exhaustive' && detail?.space) {
    return `all ${detail.space.toLocaleString()} input${detail.space === 1 ? '' : 's'}`;
  }
  if (kind === 'bounded' && detail?.cycles) return `${detail.cycles} cycles`;
  if (kind === 'sampled' && detail?.cycles) return `${detail.cycles} cycles`;
  return null;
}

export interface VerdictBadgeProps {
  /** Omit for a non-passing outcome; pass `status` instead. */
  kind?: VerdictKind;
  detail?: { cycles?: number; space?: number };
  status: 'pass' | 'fail' | 'error';
  /** Failing counts, rendered instead of the confidence claim. */
  passed?: number;
  total?: number;
  unit?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  kind, detail, status, passed, total, unit = 'cases', size = 'md', className = '',
}) => {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';
  const glyph = size === 'sm' ? 12 : 13;

  // A failure makes no confidence claim — how many vectors were tried is not the
  // point once one of them is wrong.
  if (status !== 'pass') {
    const isError = status === 'error';
    const Icon = isError ? AlertTriangle : XCircle;
    const label = isError
      ? 'Did not compile'
      : `${passed ?? 0}/${total ?? 0} ${unit} passed`;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-mono font-bold uppercase tracking-wide ${pad} ${className}`}
        style={{
          color: isError ? 'var(--vj-warn)' : 'var(--vj-fail)',
          background: isError ? 'var(--vj-warn-bg)' : 'var(--vj-fail-bg)',
          border: `1px solid ${isError ? 'var(--vj-warn)' : 'var(--vj-fail)'}`,
        }}
      >
        <Icon size={glyph} className="shrink-0" aria-hidden />
        {label}
      </span>
    );
  }

  const spec = VERDICT_SPECS[kind ?? 'sampled'];
  const Icon = spec.icon;
  const extra = detailText(kind ?? 'sampled', detail);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono font-bold uppercase tracking-wide ${pad} ${className}`}
      style={{
        color: spec.fg,
        background: spec.bg,
        border: `1px ${spec.dashed ? 'dashed' : 'solid'} ${spec.fg}`,
      }}
      title={spec.tooltip}
    >
      <Icon size={glyph} className="shrink-0" aria-hidden />
      {spec.label}
      {extra && (
        <span className="font-normal normal-case opacity-80">· {extra}</span>
      )}
      {/* The tooltip is hover-only; screen readers get the full claim inline. */}
      <span className="vj-sr-only">. {spec.tooltip}</span>
    </span>
  );
};

/**
 * The one-line honesty caveat shown under a passing verdict. Deliberately
 * always present rather than only on `sampled`: a student should learn that
 * "how thoroughly was this checked" is a question with an answer, not a detail
 * that only surfaces when the answer is unflattering.
 */
export const VerdictCaveat: React.FC<{ kind?: VerdictKind; total: number; unit: string }> = ({
  kind, total, unit,
}) => {
  const text = kind === 'proved'
    ? 'Equivalence proved for the entire input space.'
    : kind === 'exhaustive'
      ? `Every one of the ${total.toLocaleString()} possible inputs was checked.`
      : kind === 'bounded'
        ? `Proved for all inputs across ${total} cycles from reset.`
        : `Checked against ${total} ${unit}. A rare edge case outside this sample could still be wrong.`;
  return <span className="text-[11px]" style={{ color: 'var(--vj-text-dim)' }}>{text}</span>;
};
