/**
 * Track 9 — Waveform & Timing.
 *
 * Circuits whose whole purpose is the SHAPE of a signal over time: strobes, PWM,
 * non-overlapping phases, line codes and measurement. These are the problems the
 * waveform viewer exists for — the answer is legible as a picture and awkward as
 * a table.
 */
import type { VProblemV2 } from '../types';

export const WAVEFORM_PROBLEMS: VProblemV2[] = [
  {
    id: 'w-clock-enable',
    number: 160,
    title: 'Clock Enable Strobe Generator',
    track: 'waveform',
    difficulty: 'Easy',
    tags: ['strobe', 'clock-enable', 'divider'],
    moduleName: 'ce_gen4',
    statement:
      `Produce a single-cycle pulse once every four clock cycles.\n\n` +
      `\`ce\` is high for exactly one cycle in every four and low for the other three. It is a registered output — a clean pulse, not a combinational decode.\n\n` +
      `\`rst\` is synchronous and restarts the cadence.`,
    context:
      `When part of a design needs to run slower, the wrong answer is to divide the clock and create a second clock domain. The right answer is a strobe: everything stays on one clock, and the slow logic simply has its enable asserted one cycle in four. Static timing analysis stays simple and no clock-domain crossing is introduced.`,
    hint:
      'A modulo-4 counter plus a comparison. Register the comparison so `ce` comes straight off a flop.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
    ],
    outputs: [{ name: 'ce', width: 1, note: 'one cycle high in every four' }],
    constraints: [
      'Module name must be `ce_gen4`',
      '`ce` must be registered, not combinational',
      'Exactly one cycle high per four-cycle period',
    ],
    examples: [
      { in: { rst: 1 }, out: { ce: 0 } },
      { in: { rst: 0 }, out: { ce: 0 } },
      { in: { rst: 0 }, out: { ce: 0 } },
      { in: { rst: 0 }, out: { ce: 1 }, note: 'the strobe' },
    ],
    stimulus: { cycles: 40, seed: 6001 },
    starter: `module ce_gen4(
  input      clk,
  input      rst,
  output reg ce
);
  reg [1:0] cnt;
  // Count to 3 and pulse.

endmodule`,
    solution: `module ce_gen4(
  input      clk,
  input      rst,
  output reg ce
);
  reg [1:0] cnt;

  always @(posedge clk) begin
    if (rst) begin
      cnt <= 2'd0;
      ce  <= 1'b0;
    end else begin
      cnt <= cnt + 1'b1;             // 2 bits wrap at 4 on their own
      ce  <= (cnt == 2'd2);          // pulse lands the cycle cnt reaches 3
    end
  end
endmodule`,
    editorial:
      `The comparison is against 2, not 3, because \`ce\` is registered: the flop captures the comparison result and presents it one cycle later, so comparing at 2 makes the pulse appear on the cycle the counter shows 3. Comparing at 3 would put the pulse one cycle late — harmless in isolation but wrong the moment the strobe has to align with something else.\n\n` +
      `A 2-bit counter wraps at 4 by itself, so no explicit modulo logic is needed here. A divide ratio that is not a power of two needs the comparator-and-clear treatment from problem 104.\n\n` +
      `Never do this by gating the clock. \`always @(posedge divided_clk)\` creates a genuine second clock domain with its own skew, its own timing constraints and a crossing back to the main domain. The strobe keeps everything in one domain and costs a counter.`,
  },

  {
    id: 'w-pulse-monostable',
    number: 161,
    title: 'Non-Retriggerable One-Shot',
    track: 'waveform',
    difficulty: 'Medium',
    tags: ['pulse', 'monostable', 'one-shot'],
    moduleName: 'pulse_oneshot',
    statement:
      `Stretch a trigger into a pulse of fixed length that ignores further triggers while it is running.\n\n` +
      `When \`trig\` is high and \`pulse\` is currently low, \`pulse\` goes high and stays high for exactly four cycles, then returns low. Triggers arriving during those four cycles are ignored — the pulse does not extend.\n\n` +
      `\`rst\` is synchronous and aborts any pulse in progress.`,
    context:
      `A short internal event often has to be stretched into something a slower consumer can see — a refresh request into a DRAM controller, a blip driving an LED, a strobe crossing to a slower clock domain. Non-retriggerable means the pulse width is guaranteed, which matters when the consumer is counting on it.`,
    hint:
      'A counter that loads on trigger and counts down. `pulse` is high while the counter is non-zero; only start a new pulse when it is zero.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'trig', width: 1, note: 'ignored while a pulse is active' },
    ],
    outputs: [{ name: 'pulse', width: 1, note: 'four cycles high' }],
    constraints: [
      'Module name must be `pulse_oneshot`',
      'Pulse is exactly 4 cycles long',
      'Non-retriggerable: triggers during the pulse are ignored',
    ],
    examples: [
      { in: { trig: 1 }, out: { pulse: 1 }, note: 'cycle 1 of 4' },
      { in: { trig: 1 }, out: { pulse: 1 }, note: 'cycle 2, trigger ignored' },
      { in: { trig: 0 }, out: { pulse: 1 }, note: 'cycle 3' },
      { in: { trig: 0 }, out: { pulse: 1 }, note: 'cycle 4' },
      { in: { trig: 0 }, out: { pulse: 0 }, note: 'done' },
    ],
    stimulus: { cycles: 56, seed: 6002 },
    starter: `module pulse_oneshot(
  input      clk,
  input      rst,
  input      trig,
  output     pulse
);
  reg [2:0] cnt;
  // Load on trigger only when idle; count down otherwise.

endmodule`,
    solution: `module pulse_oneshot(
  input      clk,
  input      rst,
  input      trig,
  output     pulse
);
  reg [2:0] cnt;

  // Active whenever the countdown is still running.
  assign pulse = (cnt != 3'd0);

  always @(posedge clk) begin
    if (rst)              cnt <= 3'd0;
    else if (cnt != 3'd0) cnt <= cnt - 1'b1;   // busy: ignore trig entirely
    else if (trig)        cnt <= 3'd4;         // idle: start a new pulse
  end
endmodule`,
    editorial:
      `The ordering of the branches is what makes this non-retriggerable. The countdown branch is tested before the trigger branch, so while \`cnt\` is non-zero the trigger is never even examined. Swap the two and you get a retriggerable one-shot, where each new trigger reloads the counter and extends the pulse — a different circuit with a different use case.\n\n` +
      `Driving \`pulse\` combinationally from \`cnt != 0\` means it rises in the same cycle the counter is loaded, giving exactly four active cycles for a load value of 4. Registering \`pulse\` separately would delay it by one and make the width arithmetic fiddlier.\n\n` +
      `The counter is 3 bits to hold 4 comfortably. Sizing it to exactly the pulse width is a common way to introduce an off-by-one: 4 needs three bits, not two.`,
  },

  {
    id: 'w-pwm',
    number: 162,
    title: 'PWM Generator',
    track: 'waveform',
    difficulty: 'Medium',
    tags: ['pwm', 'duty-cycle', 'motor', 'analog'],
    moduleName: 'pwm8',
    statement:
      `Generate a pulse-width-modulated output with a runtime-adjustable duty cycle.\n\n` +
      `A free-running counter cycles from 0 up to \`period - 1\` and wraps. \`pwm\` is high while that counter is below \`duty\` and low for the rest of the period, producing one contiguous high segment per cycle.\n\n` +
      `Two edge cases matter: \`duty\` = 0 must hold \`pwm\` low for the entire period, and \`duty\` >= \`period\` must hold it high throughout. \`pwm\` is registered.\n\n` +
      `\`rst\` is synchronous and restarts the counter.`,
    context:
      `Motor drivers, LED dimmers and switching regulators all deliver an analog-looking average from a purely digital output by varying the fraction of time it spends high. The load's own inertia — mechanical, thermal or an LC filter — does the averaging.`,
    hint:
      'Compare the counter against `duty`, and register the result. Wrap the counter when it reaches `period - 1`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'period', width: 8, note: 'total cycles per PWM period' },
      { name: 'duty', width: 8, note: 'cycles high per period' },
    ],
    outputs: [{ name: 'pwm', width: 1, note: 'registered PWM output' }],
    constraints: [
      'Module name must be `pwm8`',
      '`duty` = 0 gives a constantly low output',
      '`duty` >= `period` gives a constantly high output',
      '`pwm` must be registered',
    ],
    examples: [
      { in: { period: 8, duty: 3 }, out: { pwm: 1 }, note: '37.5% duty' },
      { in: { period: 8, duty: 0 }, out: { pwm: 0 }, note: 'always low' },
      { in: { period: 8, duty: 8 }, out: { pwm: 1 }, note: 'always high' },
    ],
    stimulus: { cycles: 72, seed: 6003 },
    starter: `module pwm8(
  input        clk,
  input        rst,
  input  [7:0] period,
  input  [7:0] duty,
  output reg   pwm
);
  reg [7:0] cnt;
  // High while cnt < duty; wrap at period - 1.

endmodule`,
    solution: `module pwm8(
  input        clk,
  input        rst,
  input  [7:0] period,
  input  [7:0] duty,
  output reg   pwm
);
  reg [7:0] cnt;

  // Next counter value, so the registered output stays aligned with it.
  wire [7:0] nxt = (cnt + 8'd1 >= period) ? 8'd0 : cnt + 8'd1;

  always @(posedge clk) begin
    if (rst) begin
      cnt <= 8'd0;
      pwm <= (8'd0 < duty);
    end else begin
      cnt <= nxt;
      pwm <= (nxt < duty);
    end
  end
endmodule`,
    editorial:
      `The comparison uses \`nxt\` rather than \`cnt\` because \`pwm\` is registered. Both the counter and the output update on the same edge, so comparing the value the counter is *about to hold* keeps the waveform aligned with the count. Comparing \`cnt\` instead shifts the whole waveform one cycle, which is invisible on a single channel and very visible when two PWMs must stay in phase.\n\n` +
      `The strict \`<\` is what makes the edge cases fall out for free. With \`duty\` = 0 nothing is ever below it, so the output stays low; with \`duty\` >= \`period\` every counter value is below it, so the output stays high. Using \`<=\` instead would give \`duty\` = 0 a one-cycle pulse — a small error that shows up as an LED that never fully turns off.\n\n` +
      `The wrap test is \`cnt + 1 >= period\` rather than \`== period - 1\` so that changing \`period\` at runtime to something below the current count still recovers rather than running a full lap first.\n\n` +
      `Resolution and frequency trade against each other: an 8-bit period at a 100 MHz clock gives roughly 390 kHz with 256 steps. More steps means a lower switching frequency, and for motor drive the switching frequency usually has to stay above the audible range.`,
  },

  {
    id: 'w-nonoverlap',
    number: 163,
    title: 'Non-Overlapping Two-Phase Clock',
    track: 'waveform',
    difficulty: 'Medium',
    tags: ['two-phase', 'dead-time', 'switched-capacitor'],
    moduleName: 'phase_gen2',
    statement:
      `Generate two alternating phase enables that are never high at the same time.\n\n` +
      `The repeating six-cycle sequence is: \`phi1\` high for two cycles, then both low for one cycle, then \`phi2\` high for two cycles, then both low for one cycle, and repeat.\n\n` +
      `The single-cycle gaps are dead time. \`phi1\` and \`phi2\` must never be high simultaneously on any cycle, including during reset.\n\n` +
      `\`rst\` is synchronous and restarts the sequence with both phases low.`,
    context:
      `Switched-capacitor circuits, charge pumps and dynamic logic are driven by two phases that must not overlap even momentarily. If both switches conduct at once you get shoot-through: a direct low-impedance path from supply to ground that wastes power and can damage the devices. A plain inverted clock is not safe, because it switches both phases on the same edge with zero margin.`,
    hint:
      'A modulo-6 counter and a `case` decoding it. Registering the outputs keeps them glitch-free.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
    ],
    outputs: [
      { name: 'phi1', width: 1 },
      { name: 'phi2', width: 1 },
    ],
    constraints: [
      'Module name must be `phase_gen2`',
      '`phi1` and `phi2` must NEVER both be high',
      'One dead cycle between each phase',
      'Both outputs registered',
    ],
    examples: [
      { in: { rst: 1 }, out: { phi1: 0, phi2: 0 } },
      { in: { rst: 0 }, out: { phi1: 1, phi2: 0 }, note: 'phi1 cycle 1' },
      { in: { rst: 0 }, out: { phi1: 1, phi2: 0 }, note: 'phi1 cycle 2' },
      { in: { rst: 0 }, out: { phi1: 0, phi2: 0 }, note: 'dead time' },
      { in: { rst: 0 }, out: { phi1: 0, phi2: 1 }, note: 'phi2 cycle 1' },
    ],
    stimulus: { cycles: 48, seed: 6004 },
    starter: `module phase_gen2(
  input      clk,
  input      rst,
  output reg phi1,
  output reg phi2
);
  reg [2:0] cnt;
  // Six-cycle sequence: phi1, phi1, dead, phi2, phi2, dead.

endmodule`,
    solution: `module phase_gen2(
  input      clk,
  input      rst,
  output reg phi1,
  output reg phi2
);
  reg [2:0] cnt;

  wire [2:0] nxt = (cnt == 3'd5) ? 3'd0 : cnt + 1'b1;

  always @(posedge clk) begin
    if (rst) begin
      cnt  <= 3'd0;
      phi1 <= 1'b0;
      phi2 <= 1'b0;
    end else begin
      cnt <= nxt;
      // Decode the NEXT count so the registered outputs line up with it.
      phi1 <= (nxt == 3'd0) || (nxt == 3'd1);
      phi2 <= (nxt == 3'd3) || (nxt == 3'd4);
    end
  end
endmodule`,
    editorial:
      `Counts 2 and 5 decode to neither phase, and those two cycles are the dead time. Because each phase is decoded from a disjoint set of counter values, non-overlap is structural — there is no input or corner case that can make both true at once, which is exactly the guarantee this circuit has to provide.\n\n` +
      `Registering both outputs matters more here than usual. A combinational decode of the counter can glitch while the count bits settle at slightly different times, and a glitch that briefly asserts both phases is precisely the shoot-through event the dead time exists to prevent. Coming straight off flops, the outputs change only on the clock edge.\n\n` +
      `Note that reset drives both phases low rather than starting a phase immediately. Releasing reset into an asserted phase would produce a partial pulse of unpredictable width, and downstream charge-transfer circuits generally cannot tolerate that.\n\n` +
      `On real silicon the dead time also has to cover clock skew and gate-driver propagation delay between the two phases, so it is sized from timing analysis rather than picked for convenience. One cycle here is a placeholder for that calculation.`,
  },

  {
    id: 'w-manchester',
    number: 164,
    title: 'Manchester Encoder',
    track: 'waveform',
    difficulty: 'Medium',
    tags: ['line-code', 'manchester', 'ethernet', 'self-clocking'],
    moduleName: 'manchester_enc',
    statement:
      `Encode a bit stream as a self-clocking line code.\n\n` +
      `Each bit occupies four clock cycles: two for the first half and two for the second. A data bit of 1 is sent as HIGH for the first half then LOW for the second. A data bit of 0 is sent as LOW then HIGH.\n\n` +
      `\`data_in\` is captured at the start of each bit period and encoded for the whole of it, so it must be stable before the period begins. \`line\` is registered.\n\n` +
      `\`rst\` is synchronous and restarts the bit period alignment.`,
    context:
      `10BASE-T Ethernet and many legacy serial links carry no separate clock wire. Manchester coding guarantees a transition in the middle of every bit regardless of the data, so the receiver can recover timing from the data stream itself. The price is bandwidth: two line transitions per bit means twice the signalling rate.`,
    hint:
      'A modulo-4 counter marks position within the bit. Latch `data_in` when the counter wraps, then drive the first half from the latched bit and the second half from its complement.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'data_in', width: 1, note: 'sampled at the start of each bit period' },
    ],
    outputs: [{ name: 'line', width: 1, note: 'Manchester-encoded output' }],
    constraints: [
      'Module name must be `manchester_enc`',
      'Bit period is 4 cycles: 2 high-half, 2 low-half',
      '1 encodes as HIGH then LOW; 0 encodes as LOW then HIGH',
      'Exactly one transition in the middle of every bit',
    ],
    examples: [
      { in: { data_in: 1 }, out: { line: 1 }, note: 'bit=1, first half' },
      { in: { data_in: 1 }, out: { line: 1 }, note: 'first half' },
      { in: { data_in: 1 }, out: { line: 0 }, note: 'mid-bit transition' },
      { in: { data_in: 1 }, out: { line: 0 }, note: 'second half' },
    ],
    stimulus: { cycles: 64, seed: 6005 },
    starter: `module manchester_enc(
  input      clk,
  input      rst,
  input      data_in,
  output reg line
);
  reg [1:0] phase;
  reg       bit_held;
  // First half sends the bit, second half sends its complement.

endmodule`,
    solution: `module manchester_enc(
  input      clk,
  input      rst,
  input      data_in,
  output reg line
);
  reg [1:0] phase;    // position within the 4-cycle bit period
  reg       bit_held;

  wire [1:0] nxt_phase = phase + 1'b1;         // 2 bits wrap at 4
  // A new bit is captured whenever the phase wraps back to 0.
  wire       nxt_bit   = (nxt_phase == 2'd0) ? data_in : bit_held;

  always @(posedge clk) begin
    if (rst) begin
      phase    <= 2'd0;
      bit_held <= 1'b0;
      line     <= 1'b0;
    end else begin
      phase    <= nxt_phase;
      bit_held <= nxt_bit;
      // First half (phases 0,1) sends the bit; second half (2,3) its complement.
      line     <= (nxt_phase[1] == 1'b0) ? nxt_bit : ~nxt_bit;
    end
  end
endmodule`,
    editorial:
      `\`phase[1]\` alone distinguishes the halves: phases 0 and 1 have it clear, phases 2 and 3 have it set. That makes the encoding a single mux on one counter bit rather than a full comparison.\n\n` +
      `Everything is computed from \`nxt_phase\` and \`nxt_bit\` rather than the current values, because \`line\` is registered and has to be aligned with the phase it represents. This is the same registered-output alignment issue as the PWM and phase-generator problems — worth noticing that it recurs in every timing-shaped circuit.\n\n` +
      `Latching the data bit at the start of the period is what lets the encoder tolerate \`data_in\` changing mid-period. Without \`bit_held\`, a change halfway through would corrupt the second half of the symbol and destroy the mid-bit transition the receiver depends on.\n\n` +
      `The self-clocking property comes entirely from that guaranteed mid-bit transition: whatever the data, the line moves at the centre of every bit, so a receiver PLL always has edges to lock to. Long runs of identical bits — which would leave an NRZ line static for many bit times — are exactly what this defends against. The cost is that the line switches at twice the data rate, which is why faster Ethernet moved to 4B/5B and similar codes that recover most of the bandwidth while still bounding the run length.`,
  },

  {
    id: 'w-pulse-measure',
    number: 165,
    title: 'Pulse Width Measurement',
    track: 'waveform',
    difficulty: 'Medium',
    tags: ['measurement', 'edge-detect', 'timer', 'sensor'],
    moduleName: 'pulse_measure',
    statement:
      `Time how long each high pulse on \`sig\` lasts, in clock cycles.\n\n` +
      `Start counting when \`sig\` rises and keep counting while it stays high. When it falls, capture the total into \`width\` and pulse \`valid\` high for one cycle to say a fresh measurement is available.\n\n` +
      `Each pulse is measured independently — the counter restarts at every rising edge. \`width\` holds its last measurement between pulses. A \`sig\` that never goes high produces no measurements at all.\n\n` +
      `\`rst\` is synchronous.`,
    context:
      `An ultrasonic rangefinder returns an echo pulse whose width is proportional to distance. Infrared remotes encode bits as pulses of differing length. In both cases the receiving logic has to count clock cycles between two edges and report the result once the pulse ends.`,
    hint:
      'Register `sig` to detect its edges. Increment a counter while high; on the falling edge copy it into `width` and raise `valid` for one cycle.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'sig', width: 1, note: 'pulse being measured' },
    ],
    outputs: [
      { name: 'width', width: 8, note: 'width of the most recent pulse' },
      { name: 'valid', width: 1, note: 'one-cycle pulse when a measurement completes' },
    ],
    constraints: [
      'Module name must be `pulse_measure`',
      'The measurement is reported on the FALLING edge, not the rising one',
      'Each pulse restarts the counter',
      '`width` persists until the next measurement',
    ],
    examples: [
      { in: { sig: 1 }, out: { width: 0, valid: 0 }, note: 'counting' },
      { in: { sig: 1 }, out: { width: 0, valid: 0 } },
      { in: { sig: 0 }, out: { width: 2, valid: 1 }, note: 'two cycles high' },
      { in: { sig: 0 }, out: { width: 2, valid: 0 }, note: 'held' },
    ],
    stimulus: { cycles: 72, seed: 6006 },
    starter: `module pulse_measure(
  input        clk,
  input        rst,
  input        sig,
  output reg [7:0] width,
  output reg       valid
);
  reg [7:0] cnt;
  reg       prev;
  // Count while high; capture on the falling edge.

endmodule`,
    solution: `module pulse_measure(
  input        clk,
  input        rst,
  input        sig,
  output reg [7:0] width,
  output reg       valid
);
  reg [7:0] cnt;
  reg       prev;

  wire rising  = sig & ~prev;
  wire falling = ~sig & prev;

  always @(posedge clk) begin
    if (rst) begin
      cnt   <= 8'd0;
      prev  <= 1'b0;
      width <= 8'd0;
      valid <= 1'b0;
    end else begin
      prev  <= sig;
      valid <= falling;              // one-cycle report on the trailing edge

      if (rising)      cnt <= 8'd1;  // this cycle already counts
      else if (sig)    cnt <= cnt + 1'b1;
      else             cnt <= 8'd0;

      if (falling)     width <= cnt;
    end
  end
endmodule`,
    editorial:
      `Reporting on the falling edge is not a stylistic choice — the width is not known until the pulse ends. Any design that drives \`width\` while the pulse is still high is reporting a running total, not a measurement, and downstream logic has no way to tell the difference.\n\n` +
      `The rising-edge branch loads 1 rather than 0 because the cycle in which the edge is detected is already part of the pulse. Loading 0 undercounts every pulse by one, which is the standard off-by-one here and is only visible if you count edges in a waveform.\n\n` +
      `\`valid <= falling\` gives exactly a one-cycle pulse for free, since \`falling\` itself is only true for one cycle. Consumers can use it as a write enable to capture \`width\` without any handshake.\n\n` +
      `Two practical caveats. If \`sig\` comes from off-chip it is asynchronous and needs a two-flop synchronizer (problem 80) before the \`prev\` flop, or that flop can go metastable. And the counter can overflow on a pulse longer than 255 cycles — a production version either widens it or saturates and flags the overflow rather than silently wrapping.`,
  },
];
