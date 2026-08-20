/**
 * Browser entry point for v2 grading.
 *
 * diffGrade takes its synthesizer as a parameter so the same grader runs under
 * Node (authoring harness, CI) and in the browser. This module supplies the
 * browser half: the Yosys WASM worker behind yosysClient.
 */
import { diffGrade, type DiffGradeResult, type SynthOutcome } from './diffGrade';
import { synthesize, type SynthProgress } from './yosysClient';
import type { VProblemV2 } from '../../data/verilog/types';

export type { DiffGradeResult, DiffRow } from './diffGrade';

/** Adapt yosysClient's result shape to what diffGrade expects. */
function browserSynth(onProgress?: (p: SynthProgress) => void) {
  return async (code: string): Promise<SynthOutcome> => {
    const r = await synthesize(code, onProgress);
    return r.ok
      ? { json: r.json, diagnostics: r.diagnostics }
      : { json: '', log: r.error, diagnostics: r.diagnostics };
  };
}

/**
 * Grade a submission in the browser. Reports engine-download progress on the
 * first call of a session, since the Yosys core is a one-time ~40 MB fetch.
 */
export function gradeV2(
  problem: VProblemV2,
  source: string,
  onProgress?: (p: SynthProgress) => void,
): Promise<DiffGradeResult> {
  return diffGrade(problem, source, browserSynth(onProgress));
}
