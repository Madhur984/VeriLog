/**
 * Problem-bank integrity harness.
 *
 * Every problem is validated against the REAL Yosys engine, exactly as a student
 * would be graded:
 *   1. the reference solution scores 100% against itself under the generated
 *      stimulus (proves the interface, stimulus and reference agree);
 *   2. the starter code does NOT pass (proves the problem is actually a problem
 *      and not accidentally satisfied by an empty module);
 *   3. the declared ports match the ports Yosys finds in the reference;
 *   4. ids, numbers, titles and module names are unique, numbering follows the
 *      track order, and every "problem N" cross-reference still resolves.
 *
 * This is what makes a large bank maintainable — a broken problem fails CI
 * rather than a student's submission.
 */
import { describe, it, expect } from 'vitest';
import { VERILOG_V2_PROBLEMS } from './index';
import { diffGrade, type DiffGradeResult } from '../../engine/verilog/diffGrade';
import { synthesizeNode } from '../../engine/verilog/testing/yosysNode';
import { buildFromNetlist } from '../../engine/verilog/simRunner';
import { inputBits, TRACKS, type TrackId } from './types';

const synth = synthesizeNode;
const TIMEOUT = 180_000;

describe('problem bank — schema', () => {
  it('has problems', () => {
    expect(VERILOG_V2_PROBLEMS.length).toBeGreaterThan(0);
  });

  it('uses unique ids, numbers and module names', () => {
    const ids = VERILOG_V2_PROBLEMS.map((p) => p.id);
    const nums = VERILOG_V2_PROBLEMS.map((p) => p.number);
    const mods = VERILOG_V2_PROBLEMS.map((p) => p.moduleName);
    expect(new Set(ids).size, `duplicate id: ${dupes(ids).join(', ')}`).toBe(ids.length);
    expect(new Set(nums).size, `duplicate number: ${dupes(nums.map(String)).join(', ')}`).toBe(nums.length);
    expect(new Set(mods).size, `duplicate module name: ${dupes(mods).join(', ')}`).toBe(mods.length);
  });

  it('declares the module name it asks for in both starter and solution', () => {
    for (const p of VERILOG_V2_PROBLEMS) {
      const re = new RegExp(`\\bmodule\\s+${p.moduleName}\\b`);
      expect(re.test(p.starter), `${p.id}: starter does not declare module ${p.moduleName}`).toBe(true);
      expect(re.test(p.solution), `${p.id}: solution does not declare module ${p.moduleName}`).toBe(true);
    }
  });

  it('names a clock and reset that exist in the port list', () => {
    for (const p of VERILOG_V2_PROBLEMS) {
      const names = new Set(p.inputs.map((i) => i.name));
      if (p.clock) expect(names.has(p.clock), `${p.id}: clock '${p.clock}' is not an input`).toBe(true);
      if (p.reset) expect(names.has(p.reset.name), `${p.id}: reset '${p.reset.name}' is not an input`).toBe(true);
    }
  });

  it('numbers problems in track order, with no two titles alike', () => {
    // The bank reads top to bottom as a curriculum: every problem in a track
    // sits in one contiguous number range, and the ranges follow TRACKS.
    const rank = new Map(TRACKS.map((t, i) => [t.id, i]));
    const firstSeen = new Map<TrackId, number>();
    let prevTrack: TrackId | null = null;

    for (const p of VERILOG_V2_PROBLEMS) {
      if (p.track !== prevTrack) {
        expect(
          firstSeen.has(p.track),
          `track '${p.track}' is split — #${p.number} sits after a different track`,
        ).toBe(false);
        firstSeen.set(p.track, p.number);
        if (prevTrack) {
          expect(
            rank.get(p.track)!,
            `track '${p.track}' is numbered before '${prevTrack}' but listed after it in TRACKS`,
          ).toBeGreaterThan(rank.get(prevTrack)!);
        }
        prevTrack = p.track;
      }
    }

    const titles = VERILOG_V2_PROBLEMS.map((p) => p.title.toLowerCase());
    expect(new Set(titles).size, `duplicate title: ${dupes(titles).join(', ')}`).toBe(titles.length);
  });

  it('only cross-references problem numbers that exist', () => {
    const numbers = new Set(VERILOG_V2_PROBLEMS.map((p) => p.number));
    for (const p of VERILOG_V2_PROBLEMS) {
      const prose = [p.statement, p.context ?? '', p.editorial ?? ''].join('\n');
      for (const m of prose.matchAll(/\bproblem (\d+)\b/gi)) {
        expect(
          numbers.has(Number(m[1])),
          `${p.id}: refers to problem ${m[1]}, which no longer exists`,
        ).toBe(true);
        expect(Number(m[1]), `${p.id}: refers to itself`).not.toBe(p.number);
      }
    }
  });

  it('keeps exhaustive problems inside the enumeration budget', () => {
    for (const p of VERILOG_V2_PROBLEMS) {
      if (p.clock) continue;
      const bits = inputBits(p);
      if (bits > 14) {
        expect(p.stimulus?.mode, `${p.id}: ${bits} input bits needs an explicit sampled stimulus mode`).toBe('vectors');
      }
    }
  });
});

describe.each(VERILOG_V2_PROBLEMS.map((p) => [`#${p.number} ${p.id}`, p] as const))(
  'problem %s',
  (_label, problem) => {
    it('reference solution passes its own stimulus', async () => {
      const res = await diffGrade(problem, problem.solution, synth);
      expect(res.status, describeFailure(res)).toBe('pass');
      expect(res.total, 'stimulus produced no vectors').toBeGreaterThan(0);
    }, TIMEOUT);

    it('starter code does not pass', async () => {
      const res = await diffGrade(problem, problem.starter, synth);
      expect(res.status, 'starter unexpectedly passes — the problem is trivially satisfied').not.toBe('pass');
    }, TIMEOUT);

    it('declared ports match the synthesized reference', async () => {
      const { json, log } = await synth(problem.solution);
      expect(json, `reference failed to synthesize:\n${log.slice(-800)}`).toBeTruthy();
      const built = buildFromNetlist(json);
      expect(built.ok).toBe(true);
      if (!built.ok) return;

      const actual = new Map(built.ports.map((p) => [p.name, p]));
      for (const want of [...problem.inputs, ...problem.outputs]) {
        const got = actual.get(want.name);
        expect(got, `reference has no port '${want.name}'`).toBeTruthy();
        expect(got!.width, `port '${want.name}' width`).toBe(want.width);
      }
      // Nothing undeclared should be dangling on the reference interface.
      const declared = new Set([...problem.inputs, ...problem.outputs].map((p) => p.name));
      for (const p of built.ports) {
        expect(declared.has(p.name), `reference exposes undeclared port '${p.name}'`).toBe(true);
      }
    }, TIMEOUT);

    it('simulates without unsupported cells or unknown outputs', async () => {
      const res = await diffGrade(problem, problem.solution, synth);
      expect(res.unsupportedCells ?? [], 'reference uses cells netlistSim cannot model').toEqual([]);

      // A reference that emits x would "match" any other x-producing design, so
      // a broken problem could look like it passes. Outputs must be resolved.
      const unknown = (res.expectedTrace?.signals ?? [])
        .filter((s) => s.role === 'output')
        .flatMap((s) => s.values.map((v, i) => (v === null ? `${s.name}@${i}` : null)))
        .filter((x): x is string => x !== null);
      expect(unknown.slice(0, 5), 'reference produced x on an output').toEqual([]);
    }, TIMEOUT);
  },
);

/** Readable failure detail — vectors carry BigInt, which JSON.stringify rejects. */
function describeFailure(res: DiffGradeResult): string {
  if (res.error) return res.error;
  if (res.status === 'pass') return 'passed';
  const row = res.rows[res.firstFailure ?? 0];
  if (!row) return `${res.passed}/${res.total} passed`;
  const fmt = (o: Record<string, bigint | null>) =>
    Object.entries(o).map(([k, v]) => `${k}=${v === null ? 'x' : v.toString()}`).join(' ');
  return `${res.passed}/${res.total} passed. First mismatch at index ${row.index}: `
    + `in{ ${fmt(row.in)} } expected{ ${fmt(row.expected)} } got{ ${fmt(row.got)} }`;
}

function dupes(xs: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const x of xs) (seen.has(x) ? dup : seen).add(x);
  return [...dup];
}
