/**
 * Track 6 — Shift Registers.
 *
 * Serialization, deserialization, delay lines and feedback shift registers. The
 * LFSR problems are where the track stops being mechanical: the feedback
 * topology determines both the sequence and the critical path.
 */
import type { VProblemV2 } from '../types';

export const SHIFT_PROBLEMS: VProblemV2[] = [
  {
    id: 'sh-sipo',
    number: 90,
    title: 'Serial-In Parallel-Out Register',
    track: 'shift',
    difficulty: 'Easy',
    tags: ['shift-register', 'deserializer', 'uart'],
    moduleName: 'sipo8',
    statement:
      `Collect a serial bit stream into a parallel word.\n\n` +
      `When \`en\` is high, each rising edge shifts \`sin\` into bit 0 while every existing bit moves one position up. \`parallel\` exposes all eight bits at once, and \`sout\` carries the bit currently in the top position — the one about to fall off.\n\n` +
      `\`rst\` is synchronous and clears the register.`,
    context:
      `Every UART receiver, SPI slave and serial ADC interface contains one of these. Bits arrive one at a time and the rest of the design wants a whole byte, so something has to accumulate them.`,
    hint: 'The shift is one concatenation: `{reg[6:0], sin}`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1, note: 'high shifts, low holds' },
      { name: 'sin', width: 1, note: 'serial input, enters bit 0' },
    ],
    outputs: [
      { name: 'parallel', width: 8, note: 'the whole register' },
      { name: 'sout', width: 1, note: 'bit 7, the outgoing bit' },
    ],
    constraints: [
      'Module name must be `sipo8`',
      'New bits enter at bit 0 and move toward bit 7',
      '`sout` is bit 7 of the register',
    ],
    examples: [
      { in: { en: 1, sin: 1 }, out: { parallel: '8\'b00000001', sout: 0 } },
      { in: { en: 1, sin: 0 }, out: { parallel: '8\'b00000010', sout: 0 } },
      { in: { en: 0, sin: 1 }, out: { parallel: '8\'b00000010', sout: 0 }, note: 'held' },
    ],
    stimulus: { cycles: 40, seed: 3001 },
    starter: `module sipo8(
  input        clk,
  input        rst,
  input        en,
  input        sin,
  output reg [7:0] parallel,
  output           sout
);
  // Shift up, new bit into position 0.

endmodule`,
    solution: `module sipo8(
  input        clk,
  input        rst,
  input        en,
  input        sin,
  output reg [7:0] parallel,
  output           sout
);
  always @(posedge clk) begin
    if (rst)     parallel <= 8'b0;
    else if (en) parallel <= {parallel[6:0], sin};
  end

  assign sout = parallel[7];
endmodule`,
    editorial:
      `\`{parallel[6:0], sin}\` builds the next value directly: drop the old top bit, shift everything up by taking bits 6:0 as the new bits 7:1, and put \`sin\` at the bottom. The old bit 7 is simply not included, which is what "falls off the end" means in hardware.\n\n` +
      `Non-blocking assignment is essential. With \`=\` the right-hand side would already see partially-updated bits and the register would not behave as a shift chain at all.\n\n` +
      `A real UART receiver adds a bit counter alongside this, so it knows when eight bits have arrived and the parallel word is complete. The shift register alone has no notion of framing.`,
  },

  {
    id: 'sh-piso',
    number: 91,
    title: 'Parallel-In Serial-Out Register',
    track: 'shift',
    difficulty: 'Easy',
    tags: ['shift-register', 'serializer', 'spi'],
    moduleName: 'piso8',
    statement:
      `The transmit side: take a parallel word and send it out one bit at a time.\n\n` +
      `Priority on each edge: \`rst\` (synchronous) clears; \`load\` captures \`parallel\` into the register; \`en\` shifts the register one position up, bringing in 0 at the bottom. \`sout\` always shows bit 7 — the bit currently being transmitted.`,
    context:
      `SPI masters and UART transmitters work exactly this way: the CPU writes a byte, the load pulse captures it, and then the shift clock walks it onto the wire most-significant-bit first.`,
    hint: 'Shift with a zero fill: `{reg[6:0], 1\'b0}`. Load takes priority over shift.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'load', width: 1, note: 'capture parallel, beats en' },
      { name: 'en', width: 1, note: 'shift one position' },
      { name: 'parallel', width: 8 },
    ],
    outputs: [{ name: 'sout', width: 1, note: 'bit 7 of the register' }],
    constraints: [
      'Module name must be `piso8`',
      'Priority: `rst` > `load` > `en`',
      'Shifting brings in 0 at bit 0',
    ],
    examples: [
      { in: { load: 1, en: 0, parallel: '8\'b10110000' }, out: { sout: 1 } },
      { in: { load: 0, en: 1, parallel: '8\'b00000000' }, out: { sout: 0 }, note: 'shifted, now bit 6 is out' },
      { in: { load: 0, en: 1, parallel: '8\'b00000000' }, out: { sout: 1 } },
    ],
    stimulus: { cycles: 44, seed: 3002 },
    starter: `module piso8(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [7:0] parallel,
  output       sout
);
  reg [7:0] shreg;
  // Load, or shift up with a zero fill.

endmodule`,
    solution: `module piso8(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [7:0] parallel,
  output       sout
);
  reg [7:0] shreg;

  always @(posedge clk) begin
    if (rst)       shreg <= 8'b0;
    else if (load) shreg <= parallel;
    else if (en)   shreg <= {shreg[6:0], 1'b0};
  end

  assign sout = shreg[7];
endmodule`,
    editorial:
      `Load has to outrank shift. If both were allowed at once the freshly loaded value would immediately be shifted, and the first transmitted bit would be wrong — an off-by-one that only shows up on the wire.\n\n` +
      `Because \`sout\` is bit 7 and loading is immediate, the most significant bit is available the cycle after the load, before any shifting. That is MSB-first transmission, which is what SPI mode 0 and most serial protocols expect. LSB-first would shift the other way and tap bit 0 instead.\n\n` +
      `The zero fill is a choice: some designs recirculate \`shreg[7]\` back into bit 0 instead, so the word survives transmission and can be sent again without reloading.`,
  },

  {
    id: 'sh-universal',
    number: 92,
    title: 'Universal Shift Register',
    track: 'shift',
    difficulty: 'Medium',
    tags: ['shift-register', 'mode', 'case'],
    moduleName: 'shift_universal8',
    statement:
      `One register, four modes, selected by \`mode\`:\n\n` +
      `0 — hold, ignoring everything\n1 — shift right: \`sin\` enters bit 7, bits move toward bit 0\n2 — shift left: \`sin\` enters bit 0, bits move toward bit 7\n3 — parallel load from \`parallel_in\`\n\n` +
      `\`rst\` is synchronous and outranks the mode. \`q\` exposes the whole register.`,
    context:
      `This is the classic 74194-style part, and the shape survives in modern designs wherever a register must serve several roles: a SerDes framer that captures in parallel and streams in either direction, or an LFSR that needs a seed-load path.`,
    hint: 'A `case (mode)` with all four branches covered. Reset stays outside, at the top.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'mode', width: 2, note: '0 hold, 1 right, 2 left, 3 load' },
      { name: 'sin', width: 1, note: 'serial input for either direction' },
      { name: 'parallel_in', width: 8 },
    ],
    outputs: [{ name: 'q', width: 8 }],
    constraints: [
      'Module name must be `shift_universal8`',
      '`rst` beats `mode`',
      'Cover all four modes',
    ],
    examples: [
      { in: { mode: 3, sin: 0, parallel_in: '8\'b10100000' }, out: { q: '8\'b10100000' } },
      { in: { mode: 2, sin: 1, parallel_in: '8\'b0' }, out: { q: '8\'b01000001' }, note: 'left, sin into bit 0' },
      { in: { mode: 1, sin: 1, parallel_in: '8\'b0' }, out: { q: '8\'b10100000' }, note: 'right, sin into bit 7' },
      { in: { mode: 0, sin: 1, parallel_in: '8\'b0' }, out: { q: '8\'b10100000' }, note: 'hold' },
    ],
    stimulus: { cycles: 48, seed: 3003 },
    starter: `module shift_universal8(
  input        clk,
  input        rst,
  input  [1:0] mode,
  input        sin,
  input  [7:0] parallel_in,
  output reg [7:0] q
);
  // 0 hold, 1 right, 2 left, 3 load

endmodule`,
    solution: `module shift_universal8(
  input        clk,
  input        rst,
  input  [1:0] mode,
  input        sin,
  input  [7:0] parallel_in,
  output reg [7:0] q
);
  always @(posedge clk) begin
    if (rst) q <= 8'b0;
    else begin
      case (mode)
        2'b00: q <= q;                    // hold
        2'b01: q <= {sin, q[7:1]};        // shift right
        2'b10: q <= {q[6:0], sin};        // shift left
        2'b11: q <= parallel_in;          // load
        default: q <= q;
      endcase
    end
  end
endmodule`,
    editorial:
      `Watch the two shift concatenations — they are mirror images and easy to swap by accident. Shifting *right* means bits move toward bit 0, so the incoming bit lands at the top: \`{sin, q[7:1]}\`. Shifting *left* moves bits toward bit 7 and the incoming bit lands at the bottom: \`{q[6:0], sin}\`.\n\n` +
      `In a clocked block an unhandled case would hold rather than latch, so the \`default\` is not strictly load-bearing here. It still belongs: if \`mode\` were later widened, the default is what keeps the behaviour defined.\n\n` +
      `The synthesized result is one 4-input mux per bit plus the flop — the shifts themselves are free rewiring, and all the area is in the mode selection.`,
  },

  {
    id: 'sh-delay-line',
    number: 93,
    title: 'Fixed-Latency Delay Line with Taps',
    track: 'shift',
    difficulty: 'Easy',
    tags: ['shift-register', 'delay', 'pipeline', 'fir'],
    moduleName: 'delay_line4',
    statement:
      `A four-cycle delay line that also exposes every intermediate stage.\n\n` +
      `On each rising edge (there is no enable — it shifts every cycle) \`din\` enters stage 0 and each stage passes its value to the next. \`taps\` shows all four stages at once, with \`taps[0]\` the newest sample. \`dout\` is the oldest stage, so a bit applied to \`din\` appears on \`dout\` exactly four cycles later.\n\n` +
      `\`rst\` is synchronous and clears every stage.`,
    context:
      `A control signal computed early in a pipeline has to arrive at the same stage as the data it describes, so it gets delayed by exactly as many cycles. FIR filters need all the taps simultaneously, since each one is multiplied by its own coefficient.`,
    hint: 'A plain shift register, but drive `taps` from the register itself so all stages are visible.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'din', width: 1 },
    ],
    outputs: [
      { name: 'taps', width: 4, note: 'taps[0] newest, taps[3] oldest' },
      { name: 'dout', width: 1, note: 'din delayed by 4 cycles' },
    ],
    constraints: [
      'Module name must be `delay_line4`',
      'Shifts on every cycle — no enable',
      '`dout` must equal `taps[3]`',
    ],
    examples: [
      { in: { din: 1 }, out: { taps: '4\'b0001', dout: 0 } },
      { in: { din: 0 }, out: { taps: '4\'b0010', dout: 0 } },
      { in: { din: 0 }, out: { taps: '4\'b0100', dout: 0 } },
      { in: { din: 0 }, out: { taps: '4\'b1000', dout: 1 }, note: 'four cycles later' },
    ],
    stimulus: { cycles: 32, seed: 3004 },
    starter: `module delay_line4(
  input      clk,
  input      rst,
  input      din,
  output reg [3:0] taps,
  output           dout
);
  // Shift every cycle; expose all stages.

endmodule`,
    solution: `module delay_line4(
  input      clk,
  input      rst,
  input      din,
  output reg [3:0] taps,
  output           dout
);
  always @(posedge clk) begin
    if (rst) taps <= 4'b0;
    else     taps <= {taps[2:0], din};
  end

  assign dout = taps[3];
endmodule`,
    editorial:
      `Exposing the internal stages costs nothing — the flops exist either way, and \`taps\` is just naming their outputs. That is why a tapped delay line is the natural structure for a FIR filter: every coefficient multiplier reads a different tap of the same chain.\n\n` +
      `The latency is exactly the register depth, which is what makes this useful for pipeline alignment: if the datapath takes four cycles, delay the control signal by four and they arrive together. Miscounting by one is one of the most common pipeline bugs, and it is invisible until the data and its control disagree.\n\n` +
      `With no enable this shifts unconditionally. In a pipeline that stalls, the delay line needs the same enable as the datapath it is shadowing, or the alignment breaks the moment a stall happens.`,
  },

  {
    id: 'sh-lfsr-fib',
    number: 94,
    title: 'Fibonacci LFSR',
    track: 'shift',
    difficulty: 'Medium',
    tags: ['lfsr', 'prbs', 'bist', 'feedback'],
    moduleName: 'lfsr_fib4',
    statement:
      `A shift register that generates its own input.\n\n` +
      `There is no serial data port. Instead the incoming bit is the XOR of two taps of the register itself: bit 3 and bit 2. On each enabled edge the register shifts up and that feedback bit enters position 0.\n\n` +
      `\`rst\` is synchronous and seeds the register to \`4'b0001\` — a non-zero seed is mandatory. With these taps the register visits all fifteen non-zero values before repeating.`,
    context:
      `Built-in self-test engines use LFSRs to generate pseudo-random stimulus without storing a vector table, and data scramblers use them to break up long runs of identical bits so a receiver's clock recovery keeps working.`,
    hint:
      'Feedback is `lfsr[3] ^ lfsr[2]`, and the shift is `{lfsr[2:0], feedback}`. The all-zero state is a trap — it feeds itself forever, which is why reset seeds a 1.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'seeds to 4\'b0001' },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'lfsr', width: 4, note: 'cycles through 15 non-zero states' }],
    constraints: [
      'Module name must be `lfsr_fib4`',
      'Reset seed is `4\'b0001`, never zero',
      'Feedback taps are bits 3 and 2',
      'No serial input port',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { lfsr: '4\'b0001' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b0010' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b0100' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b1001' }, note: 'feedback kicks in' },
    ],
    stimulus: { cycles: 48, seed: 3005 },
    starter: `module lfsr_fib4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] lfsr
);
  // Feedback = lfsr[3] ^ lfsr[2], shifted into bit 0.

endmodule`,
    solution: `module lfsr_fib4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] lfsr
);
  wire fb = lfsr[3] ^ lfsr[2];

  always @(posedge clk) begin
    if (rst)     lfsr <= 4'b0001;
    else if (en) lfsr <= {lfsr[2:0], fb};
  end
endmodule`,
    editorial:
      `The all-zero state is an absorbing trap: XOR of two zeros is zero, so a zeroed LFSR shifts zeros forever. This is why the reset seed must be non-zero, and why the maximal sequence length is 2^n − 1 rather than 2^n — zero is excluded from the cycle entirely.\n\n` +
      `The tap positions are not arbitrary. They correspond to a primitive polynomial over GF(2); for 4 bits, x⁴ + x³ + 1, which is the [3,2] tap pair used here. Pick the wrong taps and the register still runs but breaks into several short cycles instead of one long one.\n\n` +
      `This is the Fibonacci topology: all taps XOR together into a single feedback bit that feeds one end. That XOR sits in front of every shift, so with many taps the feedback becomes a deep XOR tree on the critical path — which is exactly the problem the Galois form solves.`,
  },

  {
    id: 'sh-lfsr-galois',
    number: 95,
    title: 'Galois LFSR',
    track: 'shift',
    difficulty: 'Medium',
    tags: ['lfsr', 'galois', 'critical-path', 'prbs'],
    moduleName: 'lfsr_galois4',
    statement:
      `The same sequence length, restructured for speed.\n\n` +
      `Rather than collecting taps into one feedback bit, the outgoing bit is XORed into selected positions along the register. On each enabled edge all four bits update simultaneously:\n\n` +
      `bit 0 takes the old bit 1\nbit 1 takes the old bit 2\nbit 2 takes the old bit 3 XOR the old bit 0\nbit 3 takes the old bit 0\n\n` +
      `\`rst\` seeds to \`4'b0001\`. This also visits all fifteen non-zero states.`,
    context:
      `A Fibonacci LFSR puts its whole XOR tree in front of one flop. The Galois form distributes those XORs so no flop has more than one gate in front of it, which keeps the maximum clock frequency high on wide registers. Same sequence family, better timing.`,
    hint:
      'Write all four next-state assignments in one clocked block. Non-blocking assignment means every right-hand side reads the old values, which is exactly what "simultaneously" requires.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'seeds to 4\'b0001' },
      { name: 'en', width: 1 },
    ],
    outputs: [{ name: 'lfsr', width: 4 }],
    constraints: [
      'Module name must be `lfsr_galois4`',
      'Reset seed is `4\'b0001`',
      'Feedback is distributed, not collected into one bit',
    ],
    examples: [
      { in: { rst: 1, en: 0 }, out: { lfsr: '4\'b0001' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b1100' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b0110' } },
      { in: { rst: 0, en: 1 }, out: { lfsr: '4\'b0011' } },
    ],
    stimulus: { cycles: 48, seed: 3006 },
    starter: `module lfsr_galois4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] lfsr
);
  // bit0<=bit1, bit1<=bit2, bit2<=bit3^bit0, bit3<=bit0

endmodule`,
    solution: `module lfsr_galois4(
  input      clk,
  input      rst,
  input      en,
  output reg [3:0] lfsr
);
  always @(posedge clk) begin
    if (rst) lfsr <= 4'b0001;
    else if (en) begin
      lfsr[0] <= lfsr[1];
      lfsr[1] <= lfsr[2];
      lfsr[2] <= lfsr[3] ^ lfsr[0];
      lfsr[3] <= lfsr[0];
    end
  end
endmodule`,
    editorial:
      `Non-blocking assignment is doing something important here. All four right-hand sides read the *pre-edge* register contents, so \`lfsr[2] <= lfsr[3] ^ lfsr[0]\` uses the old bit 0 even though bit 0 is being reassigned in the same block. With blocking assignments the statements would chain and the sequence would be wrong.\n\n` +
      `The structural payoff: no flip-flop in this design has more than a single XOR in front of it. A Fibonacci LFSR with many taps stacks its XORs into a tree feeding one flop, and that tree is the critical path. For a 32-bit scrambler running at multi-gigahertz that difference decides whether the design closes timing.\n\n` +
      `The two forms produce the same *set* of states in a different order, so they are interchangeable for scrambling and BIST — where you need pseudo-randomness, not a specific sequence. They are not interchangeable if a receiver must reproduce the exact same order.`,
  },

  {
    id: 'sh-lfsr-seed',
    number: 96,
    title: 'LFSR with Loadable Seed',
    track: 'shift',
    difficulty: 'Medium',
    tags: ['lfsr', 'seed', 'bist', 'reproducibility'],
    moduleName: 'lfsr_seeded4',
    statement:
      `An LFSR whose starting point is programmable rather than fixed.\n\n` +
      `Separate the clear from the seed: \`rst\` (synchronous) clears the register to all zeros, while \`load\` captures \`seed\` into it. \`en\` then advances using the Fibonacci feedback \`lfsr[3] ^ lfsr[2]\`.\n\n` +
      `Priority is \`rst\`, then \`load\`, then \`en\`. Note that loading a zero seed is allowed, and the register will then stay stuck at zero — that is the honest behaviour of the hardware, not something to special-case.`,
    context:
      `A self-test engine has to reproduce the same pseudo-random sequence run after run to compare against a known-good signature, and different instances of the same block often need different starting points. A hardcoded reset value gives you neither.`,
    hint: 'A three-way priority chain. The feedback expression is the same as the Fibonacci LFSR.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1, note: 'clears to zero' },
      { name: 'load', width: 1, note: 'captures seed, beats en' },
      { name: 'en', width: 1 },
      { name: 'seed', width: 4 },
    ],
    outputs: [{ name: 'lfsr', width: 4 }],
    constraints: [
      'Module name must be `lfsr_seeded4`',
      'Priority: `rst` > `load` > `en`',
      '`rst` clears to zero — it does not seed',
      'A zero seed legitimately locks the register at zero',
    ],
    examples: [
      { in: { rst: 1, load: 0, en: 0, seed: 0 }, out: { lfsr: '4\'b0000' } },
      { in: { rst: 0, load: 1, en: 0, seed: 10 }, out: { lfsr: '4\'b1010' } },
      { in: { rst: 0, load: 0, en: 1, seed: 0 }, out: { lfsr: '4\'b0101' } },
    ],
    stimulus: { cycles: 48, seed: 3007 },
    starter: `module lfsr_seeded4(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [3:0] seed,
  output reg [3:0] lfsr
);
  // rst clears; load seeds; en advances.

endmodule`,
    solution: `module lfsr_seeded4(
  input        clk,
  input        rst,
  input        load,
  input        en,
  input  [3:0] seed,
  output reg [3:0] lfsr
);
  wire fb = lfsr[3] ^ lfsr[2];

  always @(posedge clk) begin
    if (rst)       lfsr <= 4'b0000;
    else if (load) lfsr <= seed;
    else if (en)   lfsr <= {lfsr[2:0], fb};
  end
endmodule`,
    editorial:
      `Splitting clear from seed is the whole design. Reset now means "put the hardware in a known idle state" and load means "start this particular sequence" — two different intents that a single hardcoded reset value conflates.\n\n` +
      `The zero-seed lockup is deliberately not special-cased. Silently substituting a non-zero value would hide a real software bug, and the spec is clearer if the hardware does exactly what it is told. Production designs typically validate the seed in firmware, or use a "non-zero detect" that forces a 1 only at reset.\n\n` +
      `Interview follow-up: how do you verify an LFSR is maximal length? Run it 2^n − 1 cycles from any non-zero seed and confirm it returns to that seed, having visited every non-zero value exactly once. Anything shorter means the taps do not form a primitive polynomial.`,
  },

  {
    id: 'sh-parity-accum',
    number: 97,
    title: 'Shift Register with Running Parity',
    track: 'shift',
    difficulty: 'Medium',
    tags: ['shift-register', 'parity', 'serial', 'uart'],
    moduleName: 'shift_parity8',
    statement:
      `A shift register that tracks the parity of everything that has passed through it.\n\n` +
      `When \`en\` is high, \`sin\` shifts into bit 0 as usual, and on the same edge \`parity\` toggles if \`sin\` is 1. When \`en\` is low both the register and the parity hold. \`rst\` is synchronous and clears both.\n\n` +
      `\`parity\` therefore reflects the XOR of every bit shifted in since the last reset — not the parity of the eight bits currently held.`,
    context:
      `A UART appends a parity bit right after the data bits. Computing it incrementally as the bits stream past means it is ready the instant the last data bit is shifted, with no separate XOR tree over the assembled word and no extra cycle.`,
    hint: '`parity <= parity ^ sin;` in the same branch as the shift. Both update on the same edge.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'en', width: 1 },
      { name: 'sin', width: 1 },
    ],
    outputs: [
      { name: 'q', width: 8, note: 'the shift register' },
      { name: 'parity', width: 1, note: 'XOR of every bit shifted in since reset' },
    ],
    constraints: [
      'Module name must be `shift_parity8`',
      '`parity` accumulates over the whole stream, not the current 8 bits',
      'Both update under the same `rst` and `en` conditions',
    ],
    examples: [
      { in: { en: 1, sin: 1 }, out: { q: '8\'b00000001', parity: 1 } },
      { in: { en: 1, sin: 0 }, out: { q: '8\'b00000010', parity: 1 }, note: 'zero does not toggle' },
      { in: { en: 1, sin: 1 }, out: { q: '8\'b00000101', parity: 0 } },
      { in: { en: 0, sin: 1 }, out: { q: '8\'b00000101', parity: 0 }, note: 'both held' },
    ],
    stimulus: { cycles: 40, seed: 3008 },
    starter: `module shift_parity8(
  input        clk,
  input        rst,
  input        en,
  input        sin,
  output reg [7:0] q,
  output reg       parity
);
  // Shift and accumulate parity on the same edge.

endmodule`,
    solution: `module shift_parity8(
  input        clk,
  input        rst,
  input        en,
  input        sin,
  output reg [7:0] q,
  output reg       parity
);
  always @(posedge clk) begin
    if (rst) begin
      q      <= 8'b0;
      parity <= 1'b0;
    end else if (en) begin
      q      <= {q[6:0], sin};
      parity <= parity ^ sin;
    end
  end
endmodule`,
    editorial:
      `A single XOR gate and one flop replace what would otherwise be an 8-input XOR tree over the assembled word. The incremental form is cheaper *and* faster, because the parity is finished the moment the last bit arrives rather than a gate-delay afterwards.\n\n` +
      `Note carefully what \`parity\` means: it is the running XOR of the entire stream since reset, not the parity of the eight bits currently in \`q\`. Those differ as soon as more than eight bits have been shifted, because bits that fell off the top still contributed. A framing controller resets the accumulator at the start of each character to get per-character parity.\n\n` +
      `Both registers share the same \`rst\` and \`en\` conditions, which is what keeps them consistent. Letting the parity update while the shift is stalled would count a bit that never entered the register.`,
  },
];
