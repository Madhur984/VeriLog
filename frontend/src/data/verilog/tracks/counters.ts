/**
 * Track 5 — Counters.
 *
 * Up/down, load, modulo-N, terminal count, saturation, Gray, ring and Johnson.
 * The recurring lesson is that "counting" is easy and the wrap condition is
 * where every bug lives.
 */
import type { VProblemV2 } from '../types';

export const COUNTER_PROBLEMS: VProblemV2[] = [
  {
    id: 'k-up-counter',
    number: 100,
    title: '4-Bit Up Counter',
    track: 'counters',
    difficulty: 'Easy',
    tags: ['counter', 'enable', 'wrap'],
    moduleName: 'counter_up4',
    statement:
      `A free-running 4-bit counter with an enable.\n\n` +
      `\`rst\` (synchronous) clears \`count\` to 0. Otherwise, when \`en\` is high the count increments; when \`en\` is low it holds. After 15 it wraps naturally back to 0 — no special case needed.`,
    context:
      `Timers, FIFO addresses and memory address generators are all this block. The wrap is free because a fixed-width register discards the carry, which is exactly what modular arithmetic wants.`,
    hint: '`count <= count + 1\'b1;` inside the enable branch. The width does the wrapping for you.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'synchronous clear' },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'count', width: 4 }],
    constraints: [
      'Module name must be `counter_up4`',
      'Priority: `rst` > `en`',
      'Wrap by natural overflow — no explicit comparison',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { count: 0 } },
      { in: { rst: 0, en: 1 }, out: { count: 1 } },
      { in: { rst: 0, en: 0 }, out: { count: 1 }, note: 'held' },
    ],
    stimulus: { cycles: 40, seed: 2001 },
    starter: `module counter_up4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  // Increment when enabled; the width handles the wrap.

endmodule`,
    solution: `module counter_up4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  always @(posedge clk) begin
    if (rst)     count <= 4'b0;
    else if (en) count <= count + 1'b1;
  end
endmodule`,
    editorial:
      `Adding \`1'b1\` rather than the unsized \`1\` keeps the arithmetic in 4 bits explicitly. Both work here because the assignment context is 4 bits wide, but sized literals are the habit that avoids surprises in wider or mixed-width expressions.\n\n` +
      `The wrap costs nothing: 15 + 1 = 16, which is \`10000\` in binary, and the fifth bit has nowhere to go in a 4-bit register. Writing \`if (count == 15) count <= 0; else count <= count + 1;\` produces a comparator you did not need — see problem 104 for when you genuinely do.`,
  },

  {
    id: 'k-updown',
    number: 101,
    title: 'Up/Down Counter',
    track: 'counters',
    difficulty: 'Easy',
    tags: ['counter', 'direction', 'underflow'],
    moduleName: 'counter_updown4',
    statement:
      `A counter that runs in either direction.\n\n` +
      `With \`en\` high, \`dir\` = 1 counts up and \`dir\` = 0 counts down. It wraps both ways: incrementing past 15 gives 0, decrementing past 0 gives 15. \`rst\` is synchronous and clears to 0.`,
    context:
      `A quadrature encoder counts up for forward rotation and down for reverse. Credit counters, stack pointers and FIFO occupancy all move in both directions too.`,
    hint: 'One `if (en)` with the direction choosing between `+ 1` and `- 1`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
      { name: 'dir', width: 1, note: '1 = up, 0 = down' },
    ],
    outputs: [{ name: 'count', width: 4 }],
    constraints: [
      'Module name must be `counter_updown4`',
      'Wrap in both directions by natural arithmetic',
      'Priority: `rst` > `en`',
    ],
    examples: [
      { in: { rst: 0, en: 1, dir: 1 }, out: { count: 1 } },
      { in: { rst: 0, en: 1, dir: 0 }, out: { count: 0 } },
      { in: { rst: 0, en: 1, dir: 0 }, out: { count: 15 }, note: 'underflow wraps' },
    ],
    stimulus: { cycles: 44, seed: 2002 },
    starter: `module counter_updown4(
  input      clk,
  input      rst,
  input      en,
  input      dir,
  output reg [3:0] count
);
  // dir picks the direction; both ends wrap.

endmodule`,
    solution: `module counter_updown4(
  input      clk,
  input      rst,
  input      en,
  input      dir,
  output reg [3:0] count
);
  always @(posedge clk) begin
    if (rst)     count <= 4'b0;
    else if (en) count <= dir ? count + 1'b1 : count - 1'b1;
  end
endmodule`,
    editorial:
      `Unsigned subtraction wraps exactly as cleanly as addition: 0 - 1 in 4 bits is 15, because the borrow falls off the top. No special case is required at either end.\n\n` +
      `In gates this is one adder plus a conditional inversion on the increment — the same add/subtract trick as problem 61 — not two separate adders. Synthesis finds that on its own.`,
  },

  {
    id: 'k-load',
    number: 102,
    title: 'Counter with Parallel Load',
    track: 'counters',
    difficulty: 'Easy',
    tags: ['counter', 'load', 'priority'],
    moduleName: 'counter_load4',
    statement:
      `A counter that can be set to an arbitrary starting value.\n\n` +
      `Resolve in this order on each edge: \`rst\` (synchronous) clears to 0; \`load\` captures \`data\` into the count; \`en\` increments; otherwise hold.\n\n` +
      `Load beats enable, so asserting both loads rather than loading-and-incrementing.`,
    context:
      `A programmable interval timer is reloaded with its period every time it expires. Address generators jump to a base offset the same way. The load path is a mux in front of the counter's register.`,
    hint: 'A three-way if / else-if chain in the stated priority order.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'load', width: 1, note: 'beats en' },
      { name: 'en', width: 1 },
      { name: 'data', width: 4, note: 'value loaded when load is high' },
    ],
    outputs: [{ name: 'count', width: 4 }],
    constraints: [
      'Module name must be `counter_load4`',
      'Priority: `rst` > `load` > `en`',
    ],
    examples: [
      { in: { rst: 0, load: 1, en: 0, data: 10 }, out: { count: 10 } },
      { in: { rst: 0, load: 0, en: 1, data: 10 }, out: { count: 11 } },
      { in: { rst: 0, load: 1, en: 1, data: 3 }, out: { count: 3 }, note: 'load wins' },
    ],
    stimulus: { cycles: 44, seed: 2003 },
    starter: `module counter_load4(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [3:0] data,
  output reg [3:0] count
);
  // rst > load > en > hold

endmodule`,
    solution: `module counter_load4(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [3:0] data,
  output reg [3:0] count
);
  always @(posedge clk) begin
    if (rst)       count <= 4'b0;
    else if (load) count <= data;
    else if (en)   count <= count + 1'b1;
  end
endmodule`,
    editorial:
      `The synthesized structure is the classic "mux before the register": a small priority mux selects between 0, \`data\`, \`count + 1\` and \`count\`, and its output goes to the flops' D inputs. Nothing gates the clock.\n\n` +
      `Priority is a specification decision, not an implementation detail. Loading while enabled could plausibly mean "load then start counting from there next cycle" — which is what this does — or "load \`data\`+1". Stating the order in the spec is what stops the two readings diverging.`,
  },

  {
    id: 'k-terminal-count',
    number: 103,
    title: 'Counter with Terminal Count',
    track: 'counters',
    difficulty: 'Easy',
    tags: ['counter', 'terminal-count', 'cascade'],
    moduleName: 'counter_tc4',
    statement:
      `A counter that announces when it is about to roll over.\n\n` +
      `The counting behaviour is the ordinary enabled up-counter. Additionally, \`tc\` is high exactly when \`count\` is at its maximum of 15 *and* \`en\` is high — meaning the next edge will wrap it. \`tc\` is combinational, not registered.`,
    context:
      `Chain counters by feeding one stage's terminal count into the next stage's enable and you get a wider counter without a wide adder. The same signal triggers periodic events without every consumer needing its own comparator.`,
    hint: '`assign tc = en & (count == 4\'hF);` — note that it depends on `en`, not just the value.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
    ],
    outputs: [
      { name: 'count', width: 4 },
      { name: 'tc', width: 1, note: 'combinational: at max AND enabled' },
    ],
    constraints: [
      'Module name must be `counter_tc4`',
      '`tc` must be combinational, not a registered signal',
      '`tc` requires `en` to be high',
    ],
    examples: [
      { in: { rst: 0, en: 1 }, out: { count: 1, tc: 0 } },
      { in: { rst: 0, en: 1 }, out: { count: 15, tc: 1 }, note: 'about to wrap' },
      { in: { rst: 0, en: 0 }, out: { count: 15, tc: 0 }, note: 'at max but not enabled' },
    ],
    stimulus: { cycles: 48, seed: 2004 },
    starter: `module counter_tc4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count,
  output           tc
);
  // tc is a continuous function of count and en.

endmodule`,
    solution: `module counter_tc4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count,
  output           tc
);
  always @(posedge clk) begin
    if (rst)     count <= 4'b0;
    else if (en) count <= count + 1'b1;
  end

  assign tc = en & (count == 4'hF);
endmodule`,
    editorial:
      `Including \`en\` in \`tc\` is what makes cascading correct. Wire this stage's \`tc\` into the next stage's \`en\`: the upper stage must advance only on the cycle the lower one actually wraps, not merely because it is sitting at 15 while stalled.\n\n` +
      `Because \`tc\` is combinational it is available in the same cycle as the wrap decision — which is what the cascade needs, but it also means \`tc\` inherits any glitching on \`en\`. Registering it removes the glitch at the cost of a cycle of skew, which then has to be accounted for in the cascade.\n\n` +
      `\`count == 4'hF\` is a 4-input AND after optimization, not a subtractor. Comparisons against constants are cheap; comparisons between two variables are not.`,
  },

  {
    id: 'k-mod-n',
    number: 104,
    title: 'Modulo-N Counter',
    track: 'counters',
    difficulty: 'Easy',
    tags: ['counter', 'modulo', 'wrap'],
    moduleName: 'counter_mod10',
    statement:
      `Count 0 through 9 and wrap — a single decimal digit.\n\n` +
      `With \`en\` high the count advances, except that from 9 it returns to 0 rather than continuing to 10. \`rst\` is synchronous. Also drive \`cout\`, high combinationally when the counter is at 9 and enabled, so digits can be chained.\n\n` +
      `The register is 4 bits wide, so the natural wrap point is 16 — this one has to be explicit.`,
    context:
      `Anything with a decimal readout counts this way: clocks, odometers, frequency counters. Chain four of these and you have a display driver that never shows an illegal digit.`,
    hint: 'Compare against 9 before incrementing. Do not rely on the register width.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
    ],
    outputs: [
      { name: 'count', width: 4, note: 'always 0 through 9' },
      { name: 'cout', width: 1, note: 'at 9 and enabled' },
    ],
    constraints: [
      'Module name must be `counter_mod10`',
      'Wrap explicitly at 9 — natural overflow is wrong here',
      '`count` must never exceed 9',
    ],
    examples: [
      { in: { rst: 0, en: 1 }, out: { count: 1, cout: 0 } },
      { in: { rst: 0, en: 1 }, out: { count: 9, cout: 1 } },
      { in: { rst: 0, en: 1 }, out: { count: 0, cout: 0 }, note: 'wraps to 0, not 10' },
    ],
    stimulus: { cycles: 48, seed: 2005 },
    starter: `module counter_mod10(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count,
  output           cout
);
  // The wrap point is 9, not 15.

endmodule`,
    solution: `module counter_mod10(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count,
  output           cout
);
  always @(posedge clk) begin
    if (rst)              count <= 4'b0;
    else if (en) begin
      if (count == 4'd9)  count <= 4'b0;
      else                count <= count + 1'b1;
    end
  end

  assign cout = en & (count == 4'd9);
endmodule`,
    editorial:
      `This is the one case where you cannot lean on the register width. A 4-bit register wraps at 16; wanting it to wrap at 10 means an explicit comparator and an explicit reset-to-zero path.\n\n` +
      `The comparator is the cost of a non-power-of-two modulus, and it lands on the critical path because the increment cannot complete until the comparison resolves. Designs that need a fast non-binary counter sometimes keep a separate "at terminal" flop, updated one cycle early, to move the comparison off the critical path.\n\n` +
      `Note the counter can never leave the legal range once it starts inside it — but it also never *recovers* if it somehow powers up at 12. Safety-critical versions use \`count >= 9\` instead of \`==\` so any illegal value collapses back into range on the next enabled edge.`,
  },

  {
    id: 'k-saturate',
    number: 105,
    title: 'Saturating Counter',
    track: 'counters',
    difficulty: 'Medium',
    tags: ['counter', 'saturation', 'credit'],
    moduleName: 'counter_saturate4',
    statement:
      `A counter that stops at its limits instead of wrapping.\n\n` +
      `With \`en\` high and \`dir\` = 1 the count increases, but holds once it reaches 12. With \`dir\` = 0 it decreases, but holds at 0. \`rst\` is synchronous and clears to 0.\n\n` +
      `Reaching a limit is not an error — the counter simply absorbs further steps in that direction while still responding to the other.`,
    context:
      `A credit counter tracking outstanding requests must not wrap: rolling from "at the limit" round to zero would report unlimited capacity at exactly the wrong moment. Retry counters have the same requirement in the other direction.`,
    hint: 'Guard each direction with its own limit test before stepping.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
      { name: 'dir', width: 1, note: '1 = up, 0 = down' },
    ],
    outputs: [{ name: 'count', width: 4, note: 'clamped to 0..12' }],
    constraints: [
      'Module name must be `counter_saturate4`',
      'Clamp at 12 going up and 0 going down',
      'Never wrap in either direction',
    ],
    examples: [
      { in: { rst: 0, en: 1, dir: 1 }, out: { count: 12 }, note: 'reached the ceiling' },
      { in: { rst: 0, en: 1, dir: 1 }, out: { count: 12 }, note: 'held, not wrapped' },
      { in: { rst: 0, en: 1, dir: 0 }, out: { count: 11 }, note: 'still responsive downward' },
    ],
    stimulus: { cycles: 60, seed: 2006 },
    starter: `module counter_saturate4(
  input      clk,
  input      rst,
  input      en,
  input      dir,
  output reg [3:0] count
);
  // Clamp at 12 and at 0.

endmodule`,
    solution: `module counter_saturate4(
  input      clk,
  input      rst,
  input      en,
  input      dir,
  output reg [3:0] count
);
  localparam MAX = 4'd12;

  always @(posedge clk) begin
    if (rst) count <= 4'b0;
    else if (en) begin
      if (dir) begin
        if (count != MAX) count <= count + 1'b1;
      end else begin
        if (count != 4'b0) count <= count - 1'b1;
      end
    end
  end
endmodule`,
    editorial:
      `Testing the limit *before* stepping is what keeps the counter inside the range at all times. The alternative — step, then clamp if you overshot — needs an extra bit of headroom and gets subtly wrong at the boundary.\n\n` +
      `\`localparam MAX\` rather than a bare \`12\` is worth the line: the limit appears once, and widening the counter later means changing one declaration instead of hunting for magic numbers.\n\n` +
      `Using \`!=\` rather than \`<\` matters if the counter can ever start above the limit — with \`!=\` it would run away, with \`>=\` it would recover. Since \`rst\` guarantees a legal start here, either is fine, but the question is worth asking of any clamped counter.`,
  },

  {
    id: 'k-gray-counter',
    number: 106,
    title: 'Gray Code Counter',
    track: 'counters',
    difficulty: 'Medium',
    tags: ['counter', 'gray-code', 'cdc'],
    moduleName: 'gray_counter4',
    statement:
      `A counter whose output changes exactly one bit per step.\n\n` +
      `Keep an ordinary binary counter internally and present it as Gray code on \`gray\`. Every consecutive value of \`gray\` — including across the wrap from the last value back to the first — must differ from the previous one in a single bit position.\n\n` +
      `\`rst\` is synchronous and clears to 0; \`en\` advances.`,
    context:
      `This is the pointer of an asynchronous FIFO. A binary pointer crossing clock domains can be sampled mid-transition and yield a value that was never actually present; a Gray pointer cannot, because only one bit is ever changing.`,
    hint:
      'Do not try to increment in Gray directly. Count in binary, then convert with `bin ^ (bin >> 1)` on the way out.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'gray', width: 4, note: 'one bit changes per step' }],
    constraints: [
      'Module name must be `gray_counter4`',
      'Count in binary internally and convert combinationally',
      'The single-bit-change property must hold across the wrap',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { gray: '4\'b0000' } },
      { in: { rst: 0, en: 1 }, out: { gray: '4\'b0001' } },
      { in: { rst: 0, en: 1 }, out: { gray: '4\'b0011' }, note: 'one bit changed' },
      { in: { rst: 0, en: 1 }, out: { gray: '4\'b0010' } },
    ],
    stimulus: { cycles: 48, seed: 2007 },
    starter: `module gray_counter4(
  input      clk,
  input      rst,
  input      en,
  output [3:0] gray
);
  reg [3:0] bin;
  // Count in binary, convert on the output.

endmodule`,
    solution: `module gray_counter4(
  input      clk,
  input      rst,
  input      en,
  output [3:0] gray
);
  reg [3:0] bin;

  always @(posedge clk) begin
    if (rst)     bin <= 4'b0;
    else if (en) bin <= bin + 1'b1;
  end

  assign gray = bin ^ (bin >> 1);
endmodule`,
    editorial:
      `Counting in binary and converting is not a shortcut — it is the correct architecture. Incrementing directly in Gray code requires finding which single bit to flip, which is a priority computation over the current value and much more logic than a binary increment plus three XORs.\n\n` +
      `The wrap works because the sequence is a full power of two: binary 15 is Gray \`1000\`, binary 0 is Gray \`0000\`, differing only in the top bit. Truncate the sequence to a non-power-of-two length and that property breaks at the wrap — which is exactly why asynchronous FIFO depths are always powers of two.\n\n` +
      `In a real FIFO the Gray pointer feeds a two-flop synchronizer in the other domain (problem 80), and is converted back to binary there (problem 65) before any arithmetic is done on it.`,
  },

  {
    id: 'k-ring',
    number: 107,
    title: 'Self-Correcting Ring Counter',
    track: 'counters',
    difficulty: 'Medium',
    tags: ['counter', 'one-hot', 'ring', 'fault-tolerance'],
    moduleName: 'ring_counter4',
    statement:
      `A one-hot token that rotates through four positions.\n\n` +
      `After reset, bit 0 is set and the rest are clear. Each enabled edge rotates the set bit one position up, and from the top it wraps back to bit 0.\n\n` +
      `There is a catch: a 4-bit register has sixteen possible values but only four are legal one-hot codes. If the register is ever found in an illegal state, it must recover to the reset value on the very next enabled edge rather than rotating the corrupted pattern forever.`,
    context:
      `One-hot sequencers drive multi-phase control directly — each bit is a phase enable, with no decoder in between and therefore no decoding glitches. The self-correction matters because a plain rotate has no path back into the legal set: a soft error would leave it cycling through garbage indefinitely.`,
    hint:
      'Check the current value against the legal set before rotating. `count & (count - 1)` being non-zero means more than one bit is set.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'count', width: 4, note: 'always exactly one hot bit' }],
    constraints: [
      'Module name must be `ring_counter4`',
      'Reset value is `4\'b0001`',
      'An illegal (non-one-hot) state must recover within one enabled cycle',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { count: '4\'b0001' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b0010' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b0100' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b1000' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b0001' }, note: 'wraps' },
    ],
    stimulus: { cycles: 44, seed: 2008 },
    starter: `module ring_counter4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  // Rotate the token; recover if the state is not one-hot.

endmodule`,
    solution: `module ring_counter4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  // Exactly one bit set: non-zero, and clearing the lowest set bit leaves nothing.
  wire legal = (count != 4'b0) && ((count & (count - 4'b1)) == 4'b0);

  always @(posedge clk) begin
    if (rst)          count <= 4'b0001;
    else if (en) begin
      if (!legal)     count <= 4'b0001;          // recover
      else            count <= {count[2:0], count[3]};  // rotate left
    end
  end
endmodule`,
    editorial:
      `\`{count[2:0], count[3]}\` is the rotate: take the low three bits, shift them up, and bring the old top bit around to position 0. Pure rewiring — no logic at all.\n\n` +
      `The legality check reuses the one-hot test from problem 38. Without it this counter has no way home: the sixteen states split into the legal 4-cycle and several disjoint orbits of illegal values, and a rotate can never move between orbits. That is the structural reason a plain ring counter is not self-correcting.\n\n` +
      `Compare with a binary counter driving a decoder: same four phases, but a decoder can glitch as multiple address bits settle at different times, briefly asserting the wrong phase. The ring counter's outputs come straight off flops, so they are glitch-free by construction — which is why it survives despite using four flops to encode four states.`,
  },

  {
    id: 'k-johnson',
    number: 108,
    title: 'Johnson Counter',
    track: 'counters',
    difficulty: 'Medium',
    tags: ['counter', 'johnson', 'twisted-ring', 'phases'],
    moduleName: 'johnson_counter4',
    statement:
      `A twisted ring counter: shift, but feed back the *complement* of the outgoing bit.\n\n` +
      `Starting from all zeros, each enabled edge shifts \`count\` one position toward the most significant bit, and the new bit 0 becomes the inverse of the old bit 3.\n\n` +
      `The result is an eight-state cycle — 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, and back to 0000 — in which exactly one bit changes per step.`,
    context:
      `Four flip-flops give four states as a ring counter but eight as a Johnson counter, and the ones fill in and drain out in a smooth thermometer pattern. Multi-phase clock generators use exactly this to produce evenly staggered, non-overlapping enables.`,
    hint: 'Shift and invert: `count <= {count[2:0], ~count[3]};`',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'count', width: 4 }],
    constraints: [
      'Module name must be `johnson_counter4`',
      'Reset value is all zeros',
      'Feed back the complement of the outgoing bit',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { count: '4\'b0000' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b1000' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b1100' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b1110' } },
      { in: { rst: 0, en: 1 }, out: { count: '4\'b1111' } },
    ],
    stimulus: { cycles: 48, seed: 2009 },
    starter: `module johnson_counter4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  // Shift up; the incoming bit is the complement of the outgoing one.

endmodule`,
    solution: `module johnson_counter4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] count
);
  always @(posedge clk) begin
    if (rst)     count <= 4'b0000;
    else if (en) count <= {count[2:0], ~count[3]};
  end
endmodule`,
    editorial:
      `The single inverter in the feedback path doubles the cycle length from 4 to 8. That is the entire difference from a ring counter, and it is a good example of how a trivial structural change alters a sequential circuit's behaviour completely.\n\n` +
      `Only one bit changes per step, so like the ring counter the outputs are glitch-free and decode cheaply — each of the eight states is identified by looking at just two adjacent bits, not all four.\n\n` +
      `This one is not self-correcting either. The sixteen states split into the legal 8-cycle and a separate 8-cycle of illegal patterns (0101, 1010 and friends), and a soft error strands the counter in the wrong orbit permanently. A production version adds a recovery term, typically forcing bit 0 low when bits 3 and 1 disagree in a way the legal sequence never produces.`,
  },
];
