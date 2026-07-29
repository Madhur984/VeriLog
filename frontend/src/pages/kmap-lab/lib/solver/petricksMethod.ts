import { Implicant } from "../../types/solver";

/**
 * Exact minimum-cost prime-implicant cover.
 *
 * Given the prime implicants and the minterms that MUST be covered, this returns
 * the cheapest subset of prime implicants that covers every required minterm.
 * Cost is minimised lexicographically as (number of terms, then total literal
 * count) — i.e. the fewest gates first, and among ties the simplest terms.
 *
 * The strategy is:
 *   1. Iteratively pull out essential prime implicants (a minterm covered by
 *      exactly one still-available PI forces that PI in). This also catches
 *      "secondary" essentials that only appear after earlier ones are removed.
 *   2. Branch-and-bound over whatever cyclic core is left, so the answer is a
 *      TRUE minimum rather than a greedy approximation.
 *
 * Don't-cares are handled by the caller: they may appear inside a PI's minterm
 * list (letting groups grow), but they are never part of `requiredMinterms`, so
 * we never force a PI just to cover a don't-care.
 */

/** Literals in an implicant term = the number of fixed (non-dash) bits. */
const literalCount = (bin: string): number => {
  let n = 0;
  for (let i = 0; i < bin.length; i++) if (bin[i] !== "-") n++;
  return n;
};

export const solveMinimumCoverage = (
  primeImplicants: Implicant[],
  requiredMinterms: number[]
): Implicant[] => {
  if (requiredMinterms.length === 0) return [];
  const required = new Set(requiredMinterms);

  // What each PI covers, restricted to the required minterms (don't-cares dropped).
  const cover: Set<number>[] = primeImplicants.map(
    (pi) => new Set(pi.minterms.filter((m) => required.has(m)))
  );
  const literals: number[] = primeImplicants.map((pi) => literalCount(pi.binary));

  const selected = new Set<number>();  // PI indices definitely in the answer
  const available = new Set<number>(); // PI indices still selectable
  primeImplicants.forEach((_, i) => {
    if (cover[i].size > 0) available.add(i);
  });
  const uncovered = new Set<number>(requiredMinterms);

  // ── 1. Iterative essential-PI extraction ────────────────────────────────
  let progressed = true;
  while (progressed && uncovered.size > 0) {
    progressed = false;
    for (const m of [...uncovered]) {
      if (!uncovered.has(m)) continue; // may have been covered earlier this pass
      let onlyIdx = -1;
      let count = 0;
      for (const i of available) {
        if (cover[i].has(m)) {
          count++;
          onlyIdx = i;
          if (count > 1) break;
        }
      }
      if (count === 1) {
        selected.add(onlyIdx);
        available.delete(onlyIdx);
        for (const c of cover[onlyIdx]) uncovered.delete(c);
        progressed = true;
      }
    }
  }

  if (uncovered.size === 0) {
    return orderTerms([...selected].map((i) => primeImplicants[i]));
  }

  // ── 2. Branch-and-bound over the cyclic core ────────────────────────────
  const candidates = [...available];
  const baseLiterals = [...selected].reduce((s, i) => s + literals[i], 0);
  const baseTerms = selected.size;

  let bestSet: number[] | null = null;
  let bestTerms = Infinity;
  let bestLiterals = Infinity;

  // Lower-bound prune: cost only grows as PIs are added, and any partial with
  // minterms left needs at least one more PI. So once a partial already ties or
  // beats the best on (terms, literals) it cannot yield a strict improvement.
  const cannotImprove = (terms: number, lits: number): boolean =>
    terms > bestTerms || (terms === bestTerms && lits >= bestLiterals);

  // Safety cap on explored nodes. The first DFS descent always reaches a
  // complete cover, so `bestSet` is valid even if the cap is hit; for <=5
  // variables the cap is never approached in practice.
  let budget = 2_000_000;

  const search = (left: Set<number>, picked: number[], pickedLits: number): void => {
    if (budget-- <= 0) return;
    const terms = baseTerms + picked.length;
    const lits = baseLiterals + pickedLits;
    if (cannotImprove(terms, lits)) return;

    if (left.size === 0) {
      // Guaranteed strictly better than best, given the prune above.
      bestTerms = terms;
      bestLiterals = lits;
      bestSet = [...picked];
      return;
    }

    // Most-constrained minterm: the one with the fewest covering PIs still open.
    let target = -1;
    let fewest = Infinity;
    for (const m of left) {
      let n = 0;
      for (const i of candidates) {
        if (cover[i].has(m) && !picked.includes(i)) n++;
      }
      if (n < fewest) {
        fewest = n;
        target = m;
      }
    }
    if (target === -1 || fewest === 0) return; // unreachable for a valid PI set

    for (const i of candidates) {
      if (picked.includes(i) || !cover[i].has(target)) continue;
      const next = new Set(left);
      for (const c of cover[i]) next.delete(c);
      search(next, [...picked, i], pickedLits + literals[i]);
    }
  };

  search(new Set(uncovered), [], 0);

  const core = bestSet ?? [];
  return orderTerms([...selected, ...core].map((i) => primeImplicants[i]));
};

/**
 * Canonical, stable ordering of the result terms: larger groups (fewer literals)
 * first, then by binary pattern. Keeps the displayed expression, the K-map group
 * outlines, and the circuit consistent and readable across renders.
 */
const orderTerms = (imps: Implicant[]): Implicant[] =>
  [...imps].sort((a, b) => {
    const la = literalCount(a.binary);
    const lb = literalCount(b.binary);
    if (la !== lb) return la - lb;
    return a.binary < b.binary ? -1 : a.binary > b.binary ? 1 : 0;
  });
