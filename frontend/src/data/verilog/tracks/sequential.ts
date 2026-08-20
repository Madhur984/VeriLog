/**
 * Track 4 — Sequential Logic.
 *
 * Storage elements and the control that surrounds them: reset flavours, clock
 * enables, byte lanes, edge detection, pipeline stall/flush and clock-domain
 * crossing. Graded cycle by cycle against the reference, with the reset
 * exercised at the start of the run and again mid-run.
 */
import type { VProblemV2 } from '../types';

export const SEQUENTIAL_PROBLEMS: VProblemV2[] = [
  {
    id: 's-dff',
    number: 70,
    title: 'D Flip-Flop',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['flip-flop', 'basics', 'clocked'],
    moduleName: 'dff_basic',
    statement:
      `The simplest storage element there is.\n\n` +
      `On every rising edge of \`clk\`, \`q\` captures whatever \`d\` holds at that instant. Between edges \`q\` does not move, no matter what \`d\` does.`,
    context:
      `Every pipeline register, every state register, every FIFO entry is built from these. The whole discipline of synchronous design rests on the fact that a flip-flop only samples at one instant, so the combinational logic feeding it has a full cycle to settle.`,
    hint: 'Use `always @(posedge clk)` with a non-blocking assignment: `q <= d;`.',
    clock: 'clk',
    inputs: [
      { name: 'clk', width: 1, note: 'rising edge samples d' },
      { name: 'd', width: 1 },
    ],
    outputs: [{ name: 'q', width: 1 }],
    constraints: [
      'Module name must be `dff_basic`',
      'All state changes on `posedge clk`',
      'Use non-blocking (`<=`) assignment',
      'No delays or `initial` blocks',
    ],
    examples: [
      { in: { d: 0 }, out: { q: 0 }, note: 'captures 0' },
      { in: { d: 1 }, out: { q: 1 }, note: 'captures 1 on the next edge' },
    ],
    stimulus: { cycles: 24, seed: 101 },
    starter: `module dff_basic(
  input      clk,
  input      d,
  output reg q
);
  // Capture d on the rising edge.

endmodule`,
    solution: `module dff_basic(
  input      clk,
  input      d,
  output reg q
);
  always @(posedge clk) q <= d;
endmodule`,
    editorial:
      `The non-blocking assignment matters more than it looks. \`<=\` schedules the update so every flip-flop in the design samples the *old* values of its inputs, which is what real hardware does — all flops switch together on the edge. Using \`=\` inside a clocked block makes the result depend on the order statements happen to be written, and a shift register built that way collapses into a single flop.\n\n` +
      `The rule worth internalizing: non-blocking for sequential logic, blocking for combinational. Mixing them in one always block is how simulation and synthesis start disagreeing.`,
  },

  {
    id: 's-dff-sync-rst',
    number: 71,
    title: 'Flip-Flop with Synchronous Reset',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['flip-flop', 'reset', 'synchronous'],
    moduleName: 'dff_sync_reset',
    statement:
      `Add a reset that is sampled like data.\n\n` +
      `On each rising edge: if \`rst\` is high, \`q\` becomes 0 regardless of \`d\`; otherwise \`q\` captures \`d\`. Reset has priority over the data.\n\n` +
      `Crucially, \`rst\` only matters *at the edge*. A reset pulse that comes and goes between two edges has no effect at all.`,
    context:
      `Synchronous reset is the default choice in most FPGA and many ASIC flows. Because the reset arrives through the flop's data path, it needs no special timing treatment — static timing analysis checks it like any other input, and there is no reset-recovery constraint to worry about.`,
    hint: 'Keep `rst` out of the sensitivity list: `always @(posedge clk)` then `if (rst) …`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'active high, sampled at the edge' },
      { name: 'd', width: 1 },
    ],
    outputs: [{ name: 'q', width: 1 }],
    constraints: [
      'Module name must be `dff_sync_reset`',
      'Reset must be SYNCHRONOUS — do not put it in the sensitivity list',
      '`rst` takes priority over `d`',
    ],
    examples: [
      { in: { rst: 1, d: 1 }, out: { q: 0 }, note: 'reset wins' },
      { in: { rst: 0, d: 1 }, out: { q: 1 } },
    ],
    stimulus: { cycles: 28, seed: 202 },
    starter: `module dff_sync_reset(
  input      clk,
  input      rst,
  input      d,
  output reg q
);
  // Sensitivity list holds clk ONLY.

endmodule`,
    solution: `module dff_sync_reset(
  input      clk,
  input      rst,
  input      d,
  output reg q
);
  always @(posedge clk) begin
    if (rst) q <= 1'b0;
    else     q <= d;
  end
endmodule`,
    editorial:
      `Because \`rst\` sits inside the clocked block, synthesis folds it into the flop's data path — it becomes a mux in front of D, or a dedicated sync-reset flop if the library has one. Nothing about the clock or reset routing is special.\n\n` +
      `The trade-off against asynchronous reset: this one cannot initialize the chip before the clock is running. A design with a gated or not-yet-locked clock will sit in an unknown state until edges start arriving, which is exactly why power-on reset is usually asynchronous even when everything else is synchronous.\n\n` +
      `The other consequence is that reset pulses must be at least a full clock period wide to be seen. A short glitch on the reset line is simply missed.`,
  },

  {
    id: 's-dff-async-rst',
    number: 72,
    title: 'Flip-Flop with Asynchronous Reset',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['flip-flop', 'reset', 'asynchronous', 'active-low'],
    moduleName: 'dff_async_reset',
    statement:
      `Add a reset that acts immediately, without waiting for a clock edge.\n\n` +
      `\`rst_n\` is active low. Whenever it is 0, \`q\` is forced to 0 straight away. While it is 1, \`q\` captures \`d\` on each rising edge as usual.`,
    context:
      `Power-on reset and emergency fault lines have to work before the clock is trustworthy, so they are wired asynchronously. Active-low is the industry convention — an open-drain reset line pulled high idles in the released state, and a broken or floating driver asserts reset rather than releasing it.`,
    hint:
      'The reset edge belongs in the sensitivity list: `always @(posedge clk or negedge rst_n)`, and the reset branch must be tested first.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1, note: 'active LOW, asynchronous' },
      { name: 'd', width: 1 },
    ],
    outputs: [{ name: 'q', width: 1 }],
    constraints: [
      'Module name must be `dff_async_reset`',
      'Include `negedge rst_n` in the sensitivity list',
      'Reset is active LOW',
    ],
    examples: [
      { in: { rst_n: 0, d: 1 }, out: { q: 0 }, note: 'held in reset' },
      { in: { rst_n: 1, d: 1 }, out: { q: 1 } },
    ],
    stimulus: { cycles: 28, seed: 303 },
    starter: `module dff_async_reset(
  input      clk,
  input      rst_n,
  input      d,
  output reg q
);
  // always @(posedge clk or negedge rst_n)

endmodule`,
    solution: `module dff_async_reset(
  input      clk,
  input      rst_n,
  input      d,
  output reg q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 1'b0;
    else        q <= d;
  end
endmodule`,
    editorial:
      `The sensitivity list is the entire difference between this and the previous problem. Listing \`negedge rst_n\` tells synthesis to use a flop with a dedicated asynchronous clear pin; omitting it produces a synchronous reset no matter what the code looks like it means.\n\n` +
      `The reset branch must come first in the \`if\`, and it must test only the reset signal. Any other condition mixed in makes the block unsynthesizable as an async-reset flop.\n\n` +
      `The catch nobody mentions until it bites: asynchronous *assertion* is safe, but asynchronous *deassertion* is not. If reset releases too close to a clock edge, the flop can go metastable — the recovery/removal timing check. That is why real designs assert reset asynchronously and release it synchronously, using a reset synchronizer (a small two-flop chain much like problem 80).`,
  },

  {
    id: 's-dff-enable',
    number: 73,
    title: 'Register with Clock Enable',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['register', 'enable', 'power'],
    moduleName: 'reg_enable8',
    statement:
      `An 8-bit register that only updates when told to.\n\n` +
      `On the rising edge: \`rst\` (synchronous, active high) clears \`q\` to 0. Otherwise, if \`en\` is high, \`q\` captures \`d\`; if \`en\` is low, \`q\` holds its current value and \`d\` is ignored.\n\n` +
      `Priority is reset, then enable.`,
    context:
      `Data is not valid on every cycle in most pipelines, so registers hold rather than churn. Beyond correctness this is a power technique: a flop that does not toggle burns no dynamic power, and enables are what synthesis later converts into real clock gating.`,
    hint: 'Nest the conditions: reset first, then `else if (en)`. With no final `else`, the register naturally holds.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'synchronous, active high' },
      { name: 'en', width: 1, note: 'high loads d' },
      { name: 'd', width: 8 },
    ],
    outputs: [{ name: 'q', width: 8 }],
    constraints: [
      'Module name must be `reg_enable8`',
      'Priority: `rst` > `en`',
      'Do NOT gate the clock — use an enable',
    ],
    examples: [
      { in: { rst: 0, en: 1, d: '8\'hAB' }, out: { q: '8\'hAB' } },
      { in: { rst: 0, en: 0, d: '8\'hFF' }, out: { q: '8\'hAB' }, note: 'held' },
      { in: { rst: 1, en: 1, d: '8\'hFF' }, out: { q: '8\'h00' } },
    ],
    stimulus: { cycles: 32, seed: 404 },
    starter: `module reg_enable8(
  input        clk,
  input        rst,
  input        en,
  input  [7:0] d,
  output reg [7:0] q
);
  // Reset, then enable, otherwise hold.

endmodule`,
    solution: `module reg_enable8(
  input        clk,
  input        rst,
  input        en,
  input  [7:0] d,
  output reg [7:0] q
);
  always @(posedge clk) begin
    if (rst)     q <= 8'b0;
    else if (en) q <= d;
  end
endmodule`,
    editorial:
      `The absence of an \`else\` is deliberate and correct here. In a clocked block, a register that is not assigned on some path simply keeps its value — that is what a flip-flop does. This is the one place where "incomplete" assignment is right; in a combinational block the same omission would infer a latch.\n\n` +
      `Never write \`always @(posedge (clk & en))\`. Gating the clock in RTL creates a derived clock with glitches, wrecks static timing analysis, and breaks scan insertion. Describe the enable and let synthesis insert a proper integrated clock-gating cell if the power savings justify it — that cell contains a latch specifically to make the gating glitch-free.`,
  },

  {
    id: 's-byte-enable',
    number: 76,
    title: 'Byte-Enabled 32-Bit Register',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['register', 'byte-enable', 'bus', 'generate'],
    moduleName: 'reg_byte_enable',
    statement:
      `A 32-bit register whose four byte lanes update independently.\n\n` +
      `\`be\` carries one enable per byte: \`be[0]\` controls bits 7:0, \`be[1]\` bits 15:8, \`be[2]\` bits 23:16, \`be[3]\` bits 31:24. On the rising edge each lane either takes its slice of \`d\` or keeps what it had. \`rst\` is synchronous and clears the whole register.`,
    context:
      `Bus protocols like AXI and AHB carry byte strobes so a processor can write a single byte into a 32-bit peripheral register without disturbing the neighbouring fields. Without lane enables, a byte write would need a read-modify-write round trip.`,
    hint:
      'A `generate` loop over the four lanes keeps this short. The indexed part-select `q[8*i +: 8]` addresses lane `i`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'synchronous, clears all lanes' },
      { name: 'be', width: 4, note: 'one write enable per byte lane' },
      { name: 'd', width: 32 },
    ],
    outputs: [{ name: 'q', width: 32 }],
    constraints: [
      'Module name must be `reg_byte_enable`',
      '`be[i]` enables bits `8*i +: 8`',
      'Lanes with their enable low must hold',
    ],
    examples: [
      { in: { be: '4\'b1111', d: '32\'hAABBCCDD' }, out: { q: '32\'hAABBCCDD' } },
      { in: { be: '4\'b0001', d: '32\'h00000011' }, out: { q: '32\'hAABBCC11' }, note: 'lane 0 only' },
      { in: { be: '4\'b1000', d: '32\'h99000000' }, out: { q: '32\'h99BBCC11' }, note: 'lane 3 only' },
    ],
    stimulus: { cycles: 36, seed: 505 },
    starter: `module reg_byte_enable(
  input         clk,
  input         rst,
  input  [3:0]  be,
  input  [31:0] d,
  output reg [31:0] q
);
  // Each byte lane updates on its own enable.

endmodule`,
    solution: `module reg_byte_enable(
  input         clk,
  input         rst,
  input  [3:0]  be,
  input  [31:0] d,
  output reg [31:0] q
);
  integer i;
  always @(posedge clk) begin
    if (rst) q <= 32'b0;
    else begin
      for (i = 0; i < 4; i = i + 1)
        if (be[i]) q[8*i +: 8] <= d[8*i +: 8];
    end
  end
endmodule`,
    editorial:
      `The \`+:\` part-select is what makes the loop possible — \`q[8*i +: 8]\` means "8 bits starting at 8*i", and unlike \`q[8*i+7 : 8*i]\` it is legal with a variable base. Slice bounds written with a colon must be constants; the indexed form exists precisely for this case.\n\n` +
      `A \`for\` loop inside an always block is not a loop in hardware. Synthesis unrolls it completely at elaboration, producing four independent enabled lanes — the same netlist you would get from writing the four \`if\` statements by hand.\n\n` +
      `In the synthesized result each lane becomes eight flops sharing one enable, which maps directly onto library flops with enable pins. That is why byte strobes are cheap: no extra muxing, just four enable nets instead of one.`,
  },

  {
    id: 's-edge-detect',
    number: 77,
    title: 'Edge Detector',
    track: 'sequential',
    difficulty: 'Easy',
    tags: ['edge-detect', 'pulse', 'synchronous'],
    moduleName: 'edge_detect',
    statement:
      `Turn a level into single-cycle pulses on its transitions.\n\n` +
      `Remember what \`sig\` was on the previous cycle and compare. \`rise\` pulses high for exactly one cycle when \`sig\` goes 0 to 1, \`fall\` when it goes 1 to 0, and \`either\` on any change. A signal that simply stays high produces no pulses at all.\n\n` +
      `\`rst\` is synchronous and clears both the history and the outputs.`,
    context:
      `A button held down for a hundred million cycles should enqueue one event, not a hundred million. Any time a slow level meets fast logic — an interrupt request, a FIFO push, a protocol strobe — something has to convert the level into an event, and this is that something.`,
    hint:
      'Register `sig` into a `prev` flop each cycle. Then `rise = sig & ~prev`. Note that the outputs here are registered, so they appear the cycle after the transition.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'sig', width: 1, note: 'level being watched' },
    ],
    outputs: [
      { name: 'rise', width: 1, note: 'one-cycle pulse on 0->1' },
      { name: 'fall', width: 1, note: 'one-cycle pulse on 1->0' },
      { name: 'either', width: 1, note: 'pulse on any transition' },
    ],
    constraints: [
      'Module name must be `edge_detect`',
      'Each pulse lasts exactly one clock cycle',
      'A steady input produces no pulses',
      'Outputs are registered',
    ],
    examples: [
      { in: { sig: 0 }, out: { rise: 0, fall: 0, either: 0 } },
      { in: { sig: 1 }, out: { rise: 1, fall: 0, either: 1 }, note: 'the cycle after the rise' },
      { in: { sig: 1 }, out: { rise: 0, fall: 0, either: 0 }, note: 'steady — no pulse' },
    ],
    stimulus: { cycles: 32, seed: 606 },
    starter: `module edge_detect(
  input      clk,
  input      rst,
  input      sig,
  output reg rise,
  output reg fall,
  output reg either
);
  reg prev;
  // Compare sig against its value last cycle.

endmodule`,
    solution: `module edge_detect(
  input      clk,
  input      rst,
  input      sig,
  output reg rise,
  output reg fall,
  output reg either
);
  reg prev;

  always @(posedge clk) begin
    if (rst) begin
      prev   <= 1'b0;
      rise   <= 1'b0;
      fall   <= 1'b0;
      either <= 1'b0;
    end else begin
      prev   <= sig;
      rise   <=  sig & ~prev;
      fall   <= ~sig &  prev;
      either <=  sig ^  prev;
    end
  end
endmodule`,
    editorial:
      `All four assignments read the *old* \`prev\` because they are non-blocking — \`prev <= sig\` schedules the update for the end of the cycle, so \`sig & ~prev\` still sees last cycle's value. Switch to blocking assignments and \`prev\` would already equal \`sig\` by the time the comparison ran, and no edge would ever be detected. This is the clearest small example of why the distinction matters.\n\n` +
      `Registering the outputs costs one cycle of latency but keeps them glitch-free, which matters when they drive a FIFO write enable or an interrupt latch. The combinational alternative (\`assign rise = sig & ~prev;\`) responds a cycle sooner but can glitch as \`sig\` and \`prev\` settle at slightly different times.\n\n` +
      `One assumption hiding here: \`sig\` must already be synchronous to \`clk\`. Feed a genuinely asynchronous input into this block and the \`prev\` flop can go metastable — put it through a two-flop synchronizer first (problem 80).`,
  },

  {
    id: 's-pipeline-stall',
    number: 78,
    title: 'Pipeline Register with Stall and Flush',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['pipeline', 'hazard', 'priority', 'cpu'],
    moduleName: 'pipe_stage8',
    statement:
      `A pipeline register that a hazard unit can freeze or clear.\n\n` +
      `On each rising edge, resolve these in strict priority order:\n\n` +
      `\`rst\` (synchronous) — clear \`q\` to 0.\n` +
      `\`flush\` — clear \`q\` to 0, inserting a bubble. Flush beats stall.\n` +
      `\`stall\` — hold \`q\` unchanged, ignoring \`d\`.\n` +
      `Otherwise — capture \`d\`.\n\n` +
      `\`valid\` is high whenever the stage currently holds real data rather than a bubble.`,
    context:
      `Both signals come from the hazard unit of a pipelined processor. A stall freezes a stage while it waits for an operand or a slow memory; a flush discards in-flight instructions after a mispredicted branch. Getting the priority backwards means a flushed instruction survives a stall cycle and executes anyway — a genuinely hard bug to find.`,
    hint: 'A single if / else-if chain in priority order. Track `valid` with the same rules.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'stall', width: 1, note: 'hold the stage' },
      { name: 'flush', width: 1, note: 'insert a bubble — beats stall' },
      { name: 'd', width: 8 },
      { name: 'd_valid', width: 1, note: 'incoming data is real' },
    ],
    outputs: [
      { name: 'q', width: 8 },
      { name: 'valid', width: 1, note: 'stage holds real data' },
    ],
    constraints: [
      'Module name must be `pipe_stage8`',
      'Priority: `rst` > `flush` > `stall` > load',
      'A flush must clear `valid` even while stalled',
    ],
    examples: [
      { in: { stall: 0, flush: 0, d: '8\'hA5', d_valid: 1 }, out: { q: '8\'hA5', valid: 1 } },
      { in: { stall: 1, flush: 0, d: '8\'h55', d_valid: 1 }, out: { q: '8\'hA5', valid: 1 }, note: 'stalled' },
      { in: { stall: 1, flush: 1, d: '8\'h77', d_valid: 1 }, out: { q: '8\'h00', valid: 0 }, note: 'flush wins' },
    ],
    stimulus: { cycles: 40, seed: 707 },
    starter: `module pipe_stage8(
  input        clk,
  input        rst,
  input        stall,
  input        flush,
  input  [7:0] d,
  input        d_valid,
  output reg [7:0] q,
  output reg       valid
);
  // rst > flush > stall > load

endmodule`,
    solution: `module pipe_stage8(
  input        clk,
  input        rst,
  input        stall,
  input        flush,
  input  [7:0] d,
  input        d_valid,
  output reg [7:0] q,
  output reg       valid
);
  always @(posedge clk) begin
    if (rst) begin
      q     <= 8'b0;
      valid <= 1'b0;
    end else if (flush) begin
      q     <= 8'b0;
      valid <= 1'b0;
    end else if (stall) begin
      q     <= q;
      valid <= valid;
    end else begin
      q     <= d;
      valid <= d_valid;
    end
  end
endmodule`,
    editorial:
      `The \`else if\` chain *is* the priority encoder — the order the branches are written is the order the hardware resolves them, and no two can fire at once. Writing the same conditions as separate \`if\` statements would let a later one silently override an earlier one, which is how priority bugs get in.\n\n` +
      `Flush must outrank stall. Consider a mispredicted branch resolving while the stage happens to be stalled on a cache miss: if stall won, the bogus instruction would sit in the pipeline and issue once the stall cleared. Real hazard units always let the flush through.\n\n` +
      `The explicit \`q <= q;\` in the stall branch is redundant — omitting the assignment holds the value anyway — but it documents the intent, and reviewers reading a priority chain benefit from seeing every branch state its effect.\n\n` +
      `Interview follow-up: what happens when a stage stalls but the one behind it does not? The upstream stage keeps producing data with nowhere to put it, so stalls must propagate backwards through the pipeline. That is what problem 79 covers.`,
  },

  {
    id: 's-pipeline-2stage',
    number: 79,
    title: 'Two-Stage Pipeline with Back-Propagating Stall',
    track: 'sequential',
    difficulty: 'Hard',
    tags: ['pipeline', 'hazard', 'backpressure', 'cpu'],
    moduleName: 'pipe_two_stage',
    statement:
      `Two pipeline stages in series, where a stall on the back stage must also freeze the front one.\n\n` +
      `Normally \`s1\` captures \`d\` and \`s2\` captures the previous \`s1\`. But when \`stall2\` is high, stage 2 holds — and stage 1 must hold too, otherwise the value it is carrying would be overwritten and lost before stage 2 could take it.\n\n` +
      `\`flush2\` clears stage 2 only, leaving stage 1 alone. It takes priority over the stall. \`rst\` is synchronous and clears both.`,
    context:
      `This is backpressure, the reason pipeline control is harder than pipeline datapath. A stall at any point has to ripple upstream, and each stage needs to know not just whether it can advance but whether the stage in front of it can accept.`,
    hint:
      'Stage 1 advances only when stage 2 is not stalled. Stage 2 checks flush before stall. Note that flushing stage 2 does not unstall stage 1.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'stall2', width: 1, note: 'stage 2 cannot advance' },
      { name: 'flush2', width: 1, note: 'bubble into stage 2' },
      { name: 'd', width: 8 },
    ],
    outputs: [
      { name: 's1', width: 8, note: 'stage 1 contents' },
      { name: 's2', width: 8, note: 'stage 2 contents' },
    ],
    constraints: [
      'Module name must be `pipe_two_stage`',
      'A stall on stage 2 must also freeze stage 1',
      '`flush2` clears stage 2 only, and beats `stall2`',
      'Priority within each stage: `rst` > `flush2` > `stall2` > advance',
    ],
    examples: [
      { in: { stall2: 0, flush2: 0, d: '8\'hA5' }, out: { s1: '8\'hA5', s2: '8\'h00' } },
      { in: { stall2: 0, flush2: 0, d: '8\'h55' }, out: { s1: '8\'h55', s2: '8\'hA5' } },
      { in: { stall2: 1, flush2: 0, d: '8\'h77' }, out: { s1: '8\'h55', s2: '8\'hA5' }, note: 'both frozen' },
      { in: { stall2: 1, flush2: 1, d: '8\'h99' }, out: { s1: '8\'h55', s2: '8\'h00' }, note: 'stage 2 bubbles, stage 1 still frozen' },
    ],
    stimulus: { cycles: 44, seed: 808 },
    starter: `module pipe_two_stage(
  input        clk,
  input        rst,
  input        stall2,
  input        flush2,
  input  [7:0] d,
  output reg [7:0] s1,
  output reg [7:0] s2
);
  // Stage 1 may only advance when stage 2 can accept.

endmodule`,
    solution: `module pipe_two_stage(
  input        clk,
  input        rst,
  input        stall2,
  input        flush2,
  input  [7:0] d,
  output reg [7:0] s1,
  output reg [7:0] s2
);
  always @(posedge clk) begin
    if (rst) begin
      s1 <= 8'b0;
      s2 <= 8'b0;
    end else begin
      // Backpressure: stage 1 freezes whenever stage 2 is stalled.
      if (!stall2) s1 <= d;

      if (flush2)       s2 <= 8'b0;
      else if (!stall2) s2 <= s1;
    end
  end
endmodule`,
    editorial:
      `The single line \`if (!stall2) s1 <= d;\` is the entire backpressure mechanism. Drop the condition and stage 1 keeps loading new data while stage 2 is frozen, so whatever stage 1 was holding is destroyed before stage 2 ever consumes it — data loss that only shows up under load, when stalls actually happen.\n\n` +
      `Note what \`flush2\` does *not* do: it clears stage 2 but leaves stage 1 frozen if \`stall2\` is still asserted. That is deliberate. The flush discards the instruction in stage 2; it says nothing about whether the downstream resource has become available, so the stall stands.\n\n` +
      `Scaling this up is where real pipelines get their complexity. With N stages every stage needs a "can I advance" term built from every stall condition downstream of it, and that logic becomes a long combinational chain — often the critical path of a deep pipeline. The standard fix is the skid buffer, which converts the global stall into a purely local ready/valid handshake between adjacent stages.`,
  },

  {
    id: 's-sync-2ff',
    number: 80,
    title: 'Two-Flop Synchronizer',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['cdc', 'metastability', 'synchronizer'],
    moduleName: 'sync_2ff',
    statement:
      `Bring a single-bit signal from a foreign clock domain into this one safely.\n\n` +
      `\`async_in\` arrives from logic clocked by something else, so it can change at any moment — including right at this domain's clock edge. Pass it through two flip-flops in series clocked by \`clk\`, and drive \`sync_out\` from the second one.\n\n` +
      `\`rst\` is synchronous and clears both stages.`,
    context:
      `When a flip-flop's setup or hold time is violated its output can hover between levels for a while before settling — metastability. You cannot prevent it, only give it time to resolve. The first flop absorbs the violation; the second samples a full clock period later, by which point the odds of still being unresolved are astronomically small.`,
    hint: 'Two flops in a chain. Do not add any logic between them.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1, note: 'destination domain clock' },
      { name: 'rst', width: 1 },
      { name: 'async_in', width: 1, note: 'from another clock domain' },
    ],
    outputs: [{ name: 'sync_out', width: 1, note: 'safe to use in this domain' }],
    constraints: [
      'Module name must be `sync_2ff`',
      'Exactly two flip-flop stages',
      'No combinational logic between the stages',
      '`sync_out` comes from the second stage',
    ],
    examples: [
      { in: { async_in: 1 }, out: { sync_out: 0 }, note: 'first flop only' },
      { in: { async_in: 1 }, out: { sync_out: 1 }, note: 'arrives after two cycles' },
    ],
    stimulus: { cycles: 28, seed: 909 },
    starter: `module sync_2ff(
  input      clk,
  input      rst,
  input      async_in,
  output     sync_out
);
  reg ff1, ff2;
  // Two stages, nothing in between.

endmodule`,
    solution: `module sync_2ff(
  input      clk,
  input      rst,
  input      async_in,
  output     sync_out
);
  reg ff1, ff2;

  always @(posedge clk) begin
    if (rst) begin
      ff1 <= 1'b0;
      ff2 <= 1'b0;
    end else begin
      ff1 <= async_in;
      ff2 <= ff1;
    end
  end

  assign sync_out = ff2;
endmodule`,
    editorial:
      `Keeping the path between the two flops empty is the whole point. Any gate there eats into the settling time the second flop is supposed to be granting the first, which is exactly the budget the synchronizer exists to provide. Synthesis must also be told not to optimize the chain away — real projects mark it with a \`ASYNC_REG\` attribute or an equivalent constraint.\n\n` +
      `What this does and does not buy you. It makes a single-bit *level* safe to sample. It does **not** work for a multi-bit bus: each bit's synchronizer resolves independently, so on a cycle where several bits change you can latch a combination that never existed on the source side. Buses cross either Gray-coded (one bit changes at a time — problems 48 and 49) or with a handshake, or through an asynchronous FIFO.\n\n` +
      `It also does not preserve narrow pulses. A pulse shorter than a destination clock period can fall between edges and vanish entirely. Crossing a pulse means converting it to a level (a toggle) on the source side and detecting the edge after synchronizing.\n\n` +
      `Two stages is the usual choice; very high clock frequencies sometimes use three, because the mean time between failures improves exponentially with each added stage.`,
  },

  {
    id: 's-saturating-acc',
    number: 81,
    title: 'Saturating Accumulator',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['accumulator', 'saturation', 'dsp'],
    moduleName: 'acc_saturate8',
    statement:
      `An 8-bit accumulator that clamps instead of wrapping.\n\n` +
      `When \`en\` is high, add \`d\` to the running total. If the sum would exceed 255, hold \`sum\` at 255 and raise \`sat\` instead of wrapping around to a small number. \`clr\` (synchronous) resets both \`sum\` and \`sat\` to 0, and outranks \`en\`.\n\n` +
      `Once saturated the accumulator stays at 255 until it is cleared.`,
    context:
      `In audio and image processing a wrapped sample is catastrophic — a bright pixel becomes black, a loud sample becomes a click at the opposite extreme. Saturating arithmetic clamps at the limit instead, which merely distorts. Every DSP instruction set has saturating variants for this reason.`,
    hint:
      'Add in 9 bits so the carry is visible: `{1\'b0, sum} + {1\'b0, d}`. Bit 8 of that tells you the result overflowed.',
    clock: 'clk',
    reset: { name: 'clr', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'clr', width: 1, note: 'synchronous clear, beats en' },
      { name: 'en', width: 1, note: 'accumulate this cycle' },
      { name: 'd', width: 8, note: 'unsigned addend' },
    ],
    outputs: [
      { name: 'sum', width: 8, note: 'running total, clamped at 255' },
      { name: 'sat', width: 1, note: 'high once clamped' },
    ],
    constraints: [
      'Module name must be `acc_saturate8`',
      'Clamp at 255 rather than wrapping',
      'Priority: `clr` > `en`',
      '`sat` stays high until cleared',
    ],
    examples: [
      { in: { clr: 0, en: 1, d: '8\'hC0' }, out: { sum: '8\'hC0', sat: 0 }, note: '192' },
      { in: { clr: 0, en: 1, d: '8\'h50' }, out: { sum: '8\'hFF', sat: 1 }, note: '192+80 clamps' },
      { in: { clr: 1, en: 0, d: '8\'h00' }, out: { sum: '8\'h00', sat: 0 } },
    ],
    stimulus: { cycles: 40, seed: 1010 },
    starter: `module acc_saturate8(
  input        clk,
  input        clr,
  input        en,
  input  [7:0] d,
  output reg [7:0] sum,
  output reg       sat
);
  // Widen the addition so the overflow is visible, then clamp.

endmodule`,
    solution: `module acc_saturate8(
  input        clk,
  input        clr,
  input        en,
  input  [7:0] d,
  output reg [7:0] sum,
  output reg       sat
);
  // 9-bit add keeps the carry out where it can be tested.
  wire [8:0] wide = {1'b0, sum} + {1'b0, d};

  always @(posedge clk) begin
    if (clr) begin
      sum <= 8'b0;
      sat <= 1'b0;
    end else if (en) begin
      if (wide[8]) begin
        sum <= 8'hFF;
        sat <= 1'b1;
      end else begin
        sum <= wide[7:0];
      end
    end
  end
endmodule`,
    editorial:
      `Zero-extending both operands to 9 bits before adding is what makes the overflow detectable. Add two 8-bit values into an 8-bit result and the carry is simply gone — there is nothing left to test.\n\n` +
      `\`sat\` is set but never cleared except by \`clr\`, which makes it sticky. That is usually what you want from a saturation flag: it records that precision was lost at some point during the accumulation, not merely that the most recent addition happened to clamp.\n\n` +
      `Note that once \`sum\` reaches 255, any further non-zero addend overflows again and re-clamps, so the value is stable. Adding 0 while saturated leaves \`wide[8]\` low and writes 255 back unchanged — still correct, just via the other branch.\n\n` +
      `Signed saturation is the harder cousin: you must clamp at both +127 and -128, and the direction depends on the sign of the operands, not just a carry bit.`,
  },

  {
    id: 's-tmr-vote',
    number: 82,
    title: 'Triple Modular Redundancy Voter',
    track: 'sequential',
    difficulty: 'Medium',
    tags: ['reliability', 'tmr', 'fault-tolerance'],
    moduleName: 'tmr_vote8',
    statement:
      `Take a majority vote across three redundant copies of the same 8-bit value.\n\n` +
      `For each bit position independently, \`q\` takes whichever value at least two of \`a\`, \`b\` and \`c\` agree on. Also raise \`fault\` whenever the three inputs are not all identical, so a disagreement is reported even though it was corrected.\n\n` +
      `Both outputs are registered, and only update when \`en\` is high. \`rst\` is synchronous.`,
    context:
      `Spacecraft, automotive safety controllers and some server memory paths run three copies of the same logic and vote on the result. A single-event upset from a cosmic ray flips one copy; the voter masks it and flags it, so the system keeps running while maintenance is scheduled.`,
    hint:
      'Bitwise majority is `(a & b) | (b & c) | (a & c)`. The fault flag is a straight inequality test across the three vectors.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
      { name: 'a', width: 8, note: 'channel A' },
      { name: 'b', width: 8, note: 'channel B' },
      { name: 'c', width: 8, note: 'channel C' },
    ],
    outputs: [
      { name: 'q', width: 8, note: 'bitwise majority' },
      { name: 'fault', width: 1, note: 'the channels disagreed' },
    ],
    constraints: [
      'Module name must be `tmr_vote8`',
      'Vote per bit, not per word',
      'Outputs are registered and gated by `en`',
    ],
    examples: [
      { in: { en: 1, a: '8\'hA5', b: '8\'hA5', c: '8\'hA5' }, out: { q: '8\'hA5', fault: 0 } },
      { in: { en: 1, a: '8\'hA5', b: '8\'hFF', c: '8\'hA5' }, out: { q: '8\'hA5', fault: 1 }, note: 'B corrupted, corrected' },
    ],
    stimulus: { cycles: 36, seed: 1111 },
    starter: `module tmr_vote8(
  input        clk,
  input        rst,
  input        en,
  input  [7:0] a,
  input  [7:0] b,
  input  [7:0] c,
  output reg [7:0] q,
  output reg       fault
);
  // Majority per bit; fault when the three do not all agree.

endmodule`,
    solution: `module tmr_vote8(
  input        clk,
  input        rst,
  input        en,
  input  [7:0] a,
  input  [7:0] b,
  input  [7:0] c,
  output reg [7:0] q,
  output reg       fault
);
  wire [7:0] majority = (a & b) | (b & c) | (a & c);
  wire       disagree = (a != b) || (b != c) || (a != c);

  always @(posedge clk) begin
    if (rst) begin
      q     <= 8'b0;
      fault <= 1'b0;
    end else if (en) begin
      q     <= majority;
      fault <= disagree;
    end
  end
endmodule`,
    editorial:
      `Voting has to be per bit, and the expression \`(a & b) | (b & c) | (a & c)\` does that naturally — each bit position of the result depends only on the matching bit of the three inputs. A word-level vote (pick whichever whole vector two channels agree on) fails as soon as two different channels are hit in two different bit positions, which is precisely the case redundancy is meant to survive.\n\n` +
      `The voter itself is a single point of failure — nothing corrects an upset inside it. Designs that need to survive that replicate the voter too, and each downstream copy votes independently. At that point the flags matter more than the correction, because the system is running degraded and needs to know.\n\n` +
      `This is the same majority-of-three function as the full adder's carry from problem 51. Identical gates, completely different purpose.`,
  },
];
