import React from 'react';
import { QuizArena, Problem, ReferenceRow } from '../../dsd_module9_v1/components/QuizArena';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ACCENT = '#fb7185';

const PROBLEMS: Problem[] = [
  {
    id: 'pp1', badge: 'CORE IDEA', badgeColor: '#818cf8',
    prompt: 'What is the central idea of a parallel prefix adder?',
    options: [
      'Add one bit per clock cycle to save area',
      'Compute the carries in a tree of merge cells, so the delay grows as log₂N',
      'Ripple the carry but with a faster clock',
      'Store every carry in a flip-flop',
    ],
    correct: 1,
    explain:
      'A parallel prefix adder arranges carry computation as a logarithmic tree. Blocks merge pairwise, doubling their span each level, so all carries are known after only log₂N levels - the fastest class of adder.',
  },
  {
    id: 'pp2', badge: 'WHY A TREE', badgeColor: '#fb923c',
    prompt: 'Why not just use one big flat carry look-ahead block for 64 bits?',
    options: [
      'It would give wrong answers',
      'Its carry equations need gates with impossibly large fan-in; the tree uses small repeated cells instead',
      'Flat look-ahead is actually slower than ripple',
      'It cannot produce a carry-out',
    ],
    correct: 1,
    explain:
      'A flat look-ahead block over 64 bits needs gates with dozens of inputs - unbuildable. The prefix adder keeps the look-ahead speed but assembles it from tiny, identical merge cells wired into a tree.',
  },
  {
    id: 'pp3', badge: 'BLOCK GENERATE', badgeColor: '#34d399',
    prompt: 'When does a combined block (upper over lower) generate a carry?',
    options: [
      'Only when both blocks generate',
      'G = G_upper + P_upper · G_lower',
      'G = G_upper · G_lower',
      'G = P_upper + P_lower',
    ],
    correct: 1,
    explain:
      'The span generates a carry if the upper block makes one itself (G_upper), or if the upper block propagates a carry that the lower block generated (P_upper · G_lower). That is the Black Cell\'s generate output.',
  },
  {
    id: 'pp4', badge: 'BLOCK PROPAGATE', badgeColor: '#38bdf8',
    prompt: 'When does a combined block propagate a carry all the way through?',
    options: [
      'P = P_upper + P_lower',
      'P = P_upper · P_lower',
      'P = G_upper · G_lower',
      'Always',
    ],
    correct: 1,
    explain:
      'A carry entering the bottom survives to the top only if every part propagates, so P = P_upper · P_lower. Both the lower and upper spans must pass it along.',
  },
  {
    id: 'pp5', badge: 'THE BLACK CELL', badgeColor: '#818cf8',
    prompt: 'What does the Black Cell do?',
    options: [
      'Adds two bits',
      'Merges the (Generate, Propagate) summary of two blocks into one summary for the combined span',
      'Stores a carry between clock cycles',
      'Inverts the carry',
    ],
    correct: 1,
    explain:
      'The Black Cell is the one repeated building block of the prefix tree. It takes an upper block\'s (G, P) and a lower block\'s (G, P) and outputs a single (G, P) for the whole span.',
  },
  {
    id: 'pp6', badge: 'COUNTING LEVELS', badgeColor: '#34d399',
    prompt: 'How many tree levels does a 16-bit parallel prefix adder need?',
    options: ['16 levels', '8 levels', '4 levels', '2 levels'],
    correct: 2,
    explain:
      'The span doubles each level, so the number of levels is log₂N. log₂16 = 4. A ripple adder would need 16 carry stages for the same width - the tree needs only 4.',
  },
  {
    id: 'pp7', badge: 'ASSOCIATIVITY', badgeColor: '#fb7185',
    prompt: 'Why is it valid to merge the blocks in a tree (any grouping) rather than strictly left to right?',
    options: [
      'Because the merge operator is associative, so the grouping does not change the result',
      'Because carries do not actually matter',
      'Because the clock forces the order',
      'It is not valid; prefix adders are approximate',
    ],
    correct: 0,
    explain:
      'The (G, P) merge is associative: regrouping the operations gives the same answer. That mathematical property is exactly what permits the parallel, tree-shaped evaluation instead of a sequential chain.',
  },
  {
    id: 'pp8', badge: 'THE PHASES', badgeColor: '#38bdf8',
    prompt: 'What are the three phases of a parallel prefix adder, in order?',
    options: [
      'Sum, then carry, then propagate',
      'Precompute G/P, then the prefix tree, then the sum (Sᵢ = Pᵢ ⊕ Cᵢ₋₁)',
      'Ripple, then store, then shift',
      'Generate, then wait, then repeat',
    ],
    correct: 1,
    explain:
      'Phase 1 precomputes Gᵢ = Aᵢ·Bᵢ and Pᵢ = Aᵢ⊕Bᵢ in parallel. Phase 2 is the Black Cell tree that produces every carry. Phase 3 forms each sum bit as Sᵢ = Pᵢ ⊕ Cᵢ₋₁.',
  },
  {
    id: 'pp9', badge: 'TOPOLOGIES', badgeColor: '#fb923c',
    prompt: 'How do the Kogge-Stone and Brent-Kung topologies differ?',
    options: [
      'Kogge-Stone is slower but smaller',
      'Kogge-Stone prioritises speed (min depth, lots of wiring); Brent-Kung prioritises area (less wiring, more depth)',
      'They produce different sums',
      'Brent-Kung is not a real adder',
    ],
    correct: 1,
    explain:
      'Both compute the same carries; they only differ in how the tree is wired. Kogge-Stone minimises logic depth for maximum speed at the cost of wiring and area; Brent-Kung minimises wiring/area at the cost of a few extra levels.',
  },
  {
    id: 'pp10', badge: 'WHERE USED', badgeColor: '#818cf8',
    prompt: 'Where are parallel prefix adders typically used?',
    options: [
      'Only in tiny low-power sensors',
      'In the high-speed arithmetic units of modern processors, where wide additions must be fast',
      'Nowhere; they are only theoretical',
      'In place of memory',
    ],
    correct: 1,
    explain:
      'Their logarithmic delay makes them the go-to for high-speed ALUs and microprocessor datapaths doing fast, wide (32/64-bit) additions. The trade is high hardware and wiring cost, which those designs accept for speed.',
  },
];

const REFERENCE: ReferenceRow[] = [
  { term: 'Parallel prefix adder', def: 'Computes carries in a logarithmic tree of merge cells; delay grows as log₂N. The fastest adder class.' },
  { term: 'Block G / P', def: 'A whole span summarised by one Generate and one Propagate bit, just like a single column.' },
  { term: 'Black Cell', def: 'The repeated merge cell. G = G_up + P_up·G_low, P = P_up·P_low.' },
  { term: 'Logarithmic delay', def: 'log₂N levels: 8→3, 16→4, 32→5, 64→6. Doubling the width adds one level.' },
  { term: 'Associativity', def: 'The merge can be regrouped freely, which is what allows the tree-shaped, parallel evaluation.' },
  { term: 'Topologies', def: 'Kogge-Stone (fastest, most wiring), Brent-Kung (smallest, more depth), Ladner-Fischer (hybrid).' },
];

export const S06_Practice: React.FC<Props> = ({ isDarkMode }) => (
  <QuizArena
    isDarkMode={isDarkMode}
    accent={ACCENT}
    tag="Chapter 07 · Practice Arena"
    title="Prefix Drill"
    intro="Block Generate and Propagate, the Black Cell, log₂N levels, associativity, the three phases and the topologies - every beat of the module is here. Each question explains itself the instant you answer. Aim for 10/10."
    problems={PROBLEMS}
    reference={REFERENCE}
    closer="One chapter left: the cheatsheet, the performance matrix and where the adder track goes from here."
  />
);

export default S06_Practice;
