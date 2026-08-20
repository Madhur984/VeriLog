/**
 * Track 7 — Finite State Machines.
 *
 * Moore against Mealy, the coding styles interviewers ask for by name, the
 * encoding choices (binary, one-hot, Gray, output-coded), and the safety
 * questions: illegal states, timeouts, error recovery.
 */
import type { VProblemV2 } from '../types';

export const FSM_PROBLEMS: VProblemV2[] = [
  {
    id: 'f-moore-3proc',
    number: 120,
    title: 'Moore FSM in the Three-Process Style',
    track: 'fsm',
    difficulty: 'Easy',
    tags: ['fsm', 'moore', 'coding-style'],
    moduleName: 'moore_3proc',
    statement:
      `Build a three-state Moore machine using the canonical three-block template.\n\n` +
      `States are \`S0 = 2'b00\`, \`S1 = 2'b01\`, \`S2 = 2'b10\`. An active-low asynchronous reset \`rst_n\` returns the machine to S0.\n\n` +
      `From S0: \`in\` high goes to S1, otherwise stay. From S1: \`in\` high goes to S2, otherwise back to S0. From S2: \`in\` high stays in S2, otherwise back to S0.\n\n` +
      `\`out\` is high in S2 and low everywhere else — it depends on the state alone, never on \`in\`. Also expose \`state\` so the encoding is visible.`,
    context:
      `The three-process split — one clocked block for the state register, one combinational block for next-state, one for outputs — is the house style at most companies. It keeps the sequential and combinational parts separately reviewable and makes the synthesized structure predictable.`,
    hint:
      'Three blocks: `always @(posedge clk or negedge rst_n)` for `state <= next_state`, `always @(*)` with a `case` for `next_state`, and a third for `out`. Give both combinational blocks a `default`.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1, note: 'active low, asynchronous' },
      { name: 'in', width: 1 },
    ],
    outputs: [
      { name: 'out', width: 1, note: 'high in S2 only' },
      { name: 'state', width: 2, note: 'current state encoding' },
    ],
    constraints: [
      'Module name must be `moore_3proc`',
      'States: S0 = 2\'b00, S1 = 2\'b01, S2 = 2\'b10',
      '`out` must depend on the state only (Moore)',
      'Reset is asynchronous and active low',
    ],
    examples: [
      { in: { rst_n: 0, in: 0 }, out: { state: '2\'b00', out: 0 }, note: 'reset' },
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b01', out: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b10', out: 1 } },
      { in: { rst_n: 1, in: 0 }, out: { state: '2\'b00', out: 0 } },
    ],
    stimulus: { cycles: 40, seed: 4001 },
    starter: `module moore_3proc(
  input        clk,
  input        rst_n,
  input        in,
  output reg   out,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10;
  reg [1:0] cur, nxt;

  // 1) state register   2) next-state logic   3) output logic

  assign state = cur;
endmodule`,
    solution: `module moore_3proc(
  input        clk,
  input        rst_n,
  input        in,
  output reg   out,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10;
  reg [1:0] cur, nxt;

  // 1) state register
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S0;
    else        cur <= nxt;
  end

  // 2) next-state logic
  always @(*) begin
    case (cur)
      S0:      nxt = in ? S1 : S0;
      S1:      nxt = in ? S2 : S0;
      S2:      nxt = in ? S2 : S0;
      default: nxt = S0;
    endcase
  end

  // 3) output logic — current state only
  always @(*) begin
    case (cur)
      S2:      out = 1'b1;
      default: out = 1'b0;
    endcase
  end

  assign state = cur;
endmodule`,
    editorial:
      `The split is not stylistic pedantry. The clocked block contains nothing but \`cur <= nxt\`, so the flops are obvious and the reset is unambiguous. The combinational blocks contain no state, so a missing branch shows up as a latch warning rather than as mysterious behaviour.\n\n` +
      `Both \`always @(*)\` blocks need a \`default\`. With three states in a 2-bit register there is a fourth encoding, \`2'b11\`, that nothing assigns — leave it uncovered and the tool must hold the previous value, which infers a latch on \`nxt\` and on \`out\`.\n\n` +
      `Because \`out\` is decoded from \`cur\` combinationally, it can glitch briefly while the state bits settle. That is fine for logic that samples it on the next edge, but if it drives something edge-sensitive it should be registered instead — which is a different machine with one cycle more latency.`,
  },

  {
    id: 'f-mealy',
    number: 121,
    title: 'Mealy FSM',
    track: 'fsm',
    difficulty: 'Easy',
    tags: ['fsm', 'mealy', 'latency'],
    moduleName: 'mealy_fsm',
    statement:
      `A two-state machine whose output depends on the input as well as the state.\n\n` +
      `States are \`S0 = 1'b0\` (idle) and \`S1 = 1'b1\` (active), with an active-low asynchronous reset to S0.\n\n` +
      `From S0: \`in\` high moves to S1, otherwise stay. From S1: \`in\` high stays, \`in\` low returns to S0.\n\n` +
      `\`out\` is 0 whenever the machine is in S0. In S1 it follows \`in\` directly in the same cycle — that combinational dependence on the input is what makes this a Mealy machine.`,
    context:
      `A Mealy output reacts in the cycle the input arrives; a Moore output waits for the next state to be registered. That one cycle of latency is why low-latency protocol handshakes and bus arbiters usually use Mealy outputs despite the glitch risk.`,
    hint: '`out` is a function of both `cur` and `in`: high only when in S1 and `in` is high.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1, note: 'active low, asynchronous' },
      { name: 'in', width: 1 },
    ],
    outputs: [
      { name: 'out', width: 1, note: 'depends on state AND input' },
      { name: 'state', width: 1 },
    ],
    constraints: [
      'Module name must be `mealy_fsm`',
      'States: S0 = 1\'b0, S1 = 1\'b1',
      '`out` must depend combinationally on `in` while in S1',
    ],
    examples: [
      { in: { rst_n: 0, in: 0 }, out: { state: 0, out: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: 0, out: 0 }, note: 'still in S0 this cycle' },
      { in: { rst_n: 1, in: 1 }, out: { state: 1, out: 1 }, note: 'in S1 with in high' },
      { in: { rst_n: 1, in: 0 }, out: { state: 1, out: 0 }, note: 'same state, in low' },
    ],
    stimulus: { cycles: 40, seed: 4002 },
    starter: `module mealy_fsm(
  input      clk,
  input      rst_n,
  input      in,
  output     out,
  output     state
);
  localparam S0 = 1'b0, S1 = 1'b1;
  reg cur, nxt;

  // out is high only in S1 with in high.

  assign state = cur;
endmodule`,
    solution: `module mealy_fsm(
  input      clk,
  input      rst_n,
  input      in,
  output     out,
  output     state
);
  localparam S0 = 1'b0, S1 = 1'b1;
  reg cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S0;
    else        cur <= nxt;
  end

  always @(*) begin
    case (cur)
      S0:      nxt = in ? S1 : S0;
      S1:      nxt = in ? S1 : S0;
      default: nxt = S0;
    endcase
  end

  // Mealy: the input reaches the output without passing through a register.
  assign out   = (cur == S1) & in;
  assign state = cur;
endmodule`,
    editorial:
      `Look at the fourth example row: the machine stays in S1 while \`in\` drops, and \`out\` follows immediately in that same cycle. A Moore machine physically cannot do that — its output only changes after a clock edge.\n\n` +
      `The cost is that \`out\` inherits every glitch and every timing hazard on \`in\`. There is now a combinational path from a module input straight through to a module output, which means the block cannot be treated as a clean pipeline stage and static timing has to analyse an input-to-output path.\n\n` +
      `The usual rule of thumb: use Moore for anything driving control that must be stable and glitch-free, and Mealy when a cycle of latency genuinely costs you throughput — a ready/valid handshake being the standard example.`,
  },

  {
    id: 'f-moore-vs-mealy',
    number: 122,
    title: 'Moore and Mealy, Same Detector',
    track: 'fsm',
    difficulty: 'Medium',
    tags: ['fsm', 'moore', 'mealy', 'sequence-detector'],
    moduleName: 'moore_vs_mealy',
    statement:
      `Detect two consecutive 1s on \`in\`, and report it both ways at once.\n\n` +
      `States: \`S0 = 2'b00\` (nothing seen), \`S1 = 2'b01\` (one 1 seen), \`S2 = 2'b10\` (two 1s seen). Active-low asynchronous reset to S0.\n\n` +
      `Transitions from every state: \`in\` high advances S0→S1, S1→S2, S2→S1; \`in\` low returns to S0 from anywhere.\n\n` +
      `\`moore_out\` is high whenever the machine is in S2 — one cycle after the second 1 was sampled. \`mealy_out\` is high when the machine is in S1 and \`in\` is high — the same cycle the second 1 arrives.`,
    context:
      `Running both outputs side by side makes the latency difference concrete, which is exactly why interviewers ask for it. The two signals detect the identical event one cycle apart.`,
    hint:
      '`moore_out` decodes the state only. `mealy_out` is `(cur == S1) & in`. Note S2 goes back to S1 on a 1 so overlapping patterns keep detecting.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'in', width: 1 },
    ],
    outputs: [
      { name: 'moore_out', width: 1, note: 'high in S2' },
      { name: 'mealy_out', width: 1, note: 'high in S1 with in high' },
      { name: 'state', width: 2 },
    ],
    constraints: [
      'Module name must be `moore_vs_mealy`',
      'States: S0 = 2\'b00, S1 = 2\'b01, S2 = 2\'b10',
      '`moore_out` depends on the state only',
      '`mealy_out` depends on the state and `in`',
    ],
    examples: [
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b00', moore_out: 0, mealy_out: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b01', moore_out: 0, mealy_out: 1 }, note: 'Mealy fires here' },
      { in: { rst_n: 1, in: 0 }, out: { state: '2\'b10', moore_out: 1, mealy_out: 0 }, note: 'Moore fires a cycle later' },
    ],
    stimulus: { cycles: 44, seed: 4003 },
    starter: `module moore_vs_mealy(
  input        clk,
  input        rst_n,
  input        in,
  output       moore_out,
  output       mealy_out,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10;
  reg [1:0] cur, nxt;

  assign state = cur;
endmodule`,
    solution: `module moore_vs_mealy(
  input        clk,
  input        rst_n,
  input        in,
  output       moore_out,
  output       mealy_out,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10;
  reg [1:0] cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S0;
    else        cur <= nxt;
  end

  always @(*) begin
    case (cur)
      S0:      nxt = in ? S1 : S0;
      S1:      nxt = in ? S2 : S0;
      S2:      nxt = in ? S1 : S0;
      default: nxt = S0;
    endcase
  end

  assign moore_out = (cur == S2);
  assign mealy_out = (cur == S1) & in;
  assign state     = cur;
endmodule`,
    editorial:
      `The two outputs mark the same event exactly one cycle apart. \`mealy_out\` rises during the cycle the second 1 is present; \`moore_out\` rises the cycle after, once that fact has been registered into S2.\n\n` +
      `S2 returning to S1 rather than S0 on a 1 is what makes the detector *overlapping*: the input 111 produces two detections, because the second 1 both completes one pattern and starts the next. A non-overlapping detector would go S2→S0 and see only one.\n\n` +
      `Note the Mealy version needs one fewer state in general. It fires from S1, so a machine that only ever needed the Mealy output could drop S2 entirely — Mealy machines are frequently smaller for exactly this reason.`,
  },

  {
    id: 'f-onehot',
    number: 123,
    title: 'One-Hot Encoded FSM',
    track: 'fsm',
    difficulty: 'Medium',
    tags: ['fsm', 'one-hot', 'encoding', 'fpga'],
    moduleName: 'fsm_onehot',
    statement:
      `The same three-state machine, encoded one-hot.\n\n` +
      `States are \`S0 = 3'b001\`, \`S1 = 3'b010\`, \`S2 = 3'b100\` — one flip-flop per state, exactly one bit set. Active-low asynchronous reset to S0.\n\n` +
      `Transitions: from S0, \`in\` high goes to S1; from S1, \`in\` high goes to S2; from S2, \`in\` high stays. \`in\` low returns to S0 from any state.\n\n` +
      `\`out\` is high in S2, which with this encoding means \`out\` is simply \`state[2]\`.`,
    context:
      `FPGAs have flip-flops to spare and comparatively expensive logic, so one-hot is often the default there. Each state's decode becomes a single bit test instead of a multi-bit comparison, which shortens next-state logic and raises the achievable clock rate.`,
    hint:
      'Test membership with a single bit — `cur[0]` means "in S0" — rather than comparing the whole vector.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'in', width: 1 },
    ],
    outputs: [
      { name: 'out', width: 1 },
      { name: 'state', width: 3, note: 'one-hot' },
    ],
    constraints: [
      'Module name must be `fsm_onehot`',
      'States: S0 = 3\'b001, S1 = 3\'b010, S2 = 3\'b100',
      'Exactly one state bit is set at any time',
    ],
    examples: [
      { in: { rst_n: 0, in: 0 }, out: { state: '3\'b001', out: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: '3\'b010', out: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: '3\'b100', out: 1 } },
      { in: { rst_n: 1, in: 0 }, out: { state: '3\'b001', out: 0 } },
    ],
    stimulus: { cycles: 40, seed: 4004 },
    starter: `module fsm_onehot(
  input        clk,
  input        rst_n,
  input        in,
  output       out,
  output [2:0] state
);
  localparam S0 = 3'b001, S1 = 3'b010, S2 = 3'b100;
  reg [2:0] cur, nxt;

  assign state = cur;
endmodule`,
    solution: `module fsm_onehot(
  input        clk,
  input        rst_n,
  input        in,
  output       out,
  output [2:0] state
);
  localparam S0 = 3'b001, S1 = 3'b010, S2 = 3'b100;
  reg [2:0] cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S0;
    else        cur <= nxt;
  end

  // With one-hot, "am I in state X" is a single bit test.
  always @(*) begin
    if (!in)          nxt = S0;
    else if (cur[0])  nxt = S1;
    else if (cur[1])  nxt = S2;
    else if (cur[2])  nxt = S2;
    else              nxt = S0;   // illegal encoding: recover
  end

  assign out   = cur[2];
  assign state = cur;
endmodule`,
    editorial:
      `The payoff is in the decode. Binary encoding needs \`cur == 2'b10\` — a two-bit comparison — while one-hot needs only \`cur[2]\`. Multiply that saving across every state test in the next-state logic and the combinational depth drops noticeably.\n\n` +
      `The cost is flip-flops: N states need N flops instead of ⌈log₂N⌉. At three states that is 3 versus 2 and nobody cares; at 30 states it is 30 versus 5, which is why ASIC flows, where flops are relatively expensive, tend to prefer binary or Gray.\n\n` +
      `The final \`else nxt = S0\` is the safety net. A 3-bit register has eight encodings and only three are legal, so a soft error can land the machine somewhere with no defined transition. Without that branch the machine could deadlock; with it, any illegal state collapses back to S0.\n\n` +
      `Worth knowing: most synthesis tools will re-encode your FSM automatically if they think it helps, and will happily convert your carefully written one-hot into binary or vice versa. Locking the encoding requires a synthesis attribute such as \`(* fsm_encoding = "one_hot" *)\`.`,
  },

  {
    id: 'f-safe-default',
    number: 124,
    title: 'FSM with Illegal-State Recovery',
    track: 'fsm',
    difficulty: 'Medium',
    tags: ['fsm', 'safety', 'default', 'iso26262'],
    moduleName: 'fsm_safe',
    statement:
      `Three states in a 2-bit register leave one encoding unused. Make sure the machine survives landing in it.\n\n` +
      `States \`S0 = 2'b00\`, \`S1 = 2'b01\`, \`S2 = 2'b10\`, with \`2'b11\` illegal. Active-low asynchronous reset to S0.\n\n` +
      `Normal transitions: \`in\` high advances S0→S1→S2 and holds in S2; \`in\` low returns to S0. From the illegal state the machine must return to S0 on the next edge regardless of \`in\`, with \`out\` low while it is there.\n\n` +
      `\`fault\` is high whenever the current state is the illegal encoding.`,
    context:
      `A radiation-induced bit flip or a marginal reset can drop a state register into an encoding the designer never planned for. Without an explicit recovery path the machine can sit there permanently, and in automotive or aerospace parts that is a safety finding, not a curiosity.`,
    hint:
      'A `default` branch in the next-state case that assigns S0 covers every illegal encoding at once. `fault` is a plain comparison against `2\'b11`.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'in', width: 1 },
    ],
    outputs: [
      { name: 'out', width: 1, note: 'high in S2 only' },
      { name: 'fault', width: 1, note: 'high while in an illegal state' },
      { name: 'state', width: 2 },
    ],
    constraints: [
      'Module name must be `fsm_safe`',
      'The `default` branch must recover to S0',
      '`fault` reports the illegal encoding `2\'b11`',
      '`out` must be low in the illegal state',
    ],
    examples: [
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b01', out: 0, fault: 0 } },
      { in: { rst_n: 1, in: 1 }, out: { state: '2\'b10', out: 1, fault: 0 } },
      { in: { rst_n: 1, in: 0 }, out: { state: '2\'b00', out: 0, fault: 0 } },
    ],
    stimulus: { cycles: 40, seed: 4005 },
    starter: `module fsm_safe(
  input        clk,
  input        rst_n,
  input        in,
  output reg   out,
  output       fault,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10, SX = 2'b11;
  reg [1:0] cur, nxt;

  assign state = cur;
endmodule`,
    solution: `module fsm_safe(
  input        clk,
  input        rst_n,
  input        in,
  output reg   out,
  output       fault,
  output [1:0] state
);
  localparam S0 = 2'b00, S1 = 2'b01, S2 = 2'b10, SX = 2'b11;
  reg [1:0] cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S0;
    else        cur <= nxt;
  end

  always @(*) begin
    case (cur)
      S0:      nxt = in ? S1 : S0;
      S1:      nxt = in ? S2 : S0;
      S2:      nxt = in ? S2 : S0;
      default: nxt = S0;          // any illegal encoding recovers here
    endcase
  end

  always @(*) begin
    case (cur)
      S2:      out = 1'b1;
      default: out = 1'b0;
    endcase
  end

  assign fault = (cur == SX);
  assign state = cur;
endmodule`,
    editorial:
      `The \`default\` branch is the entire safety mechanism, and it is one line. Note that it recovers unconditionally — it does not consult \`in\`, because in an undefined state the input is not meaningful.\n\n` +
      `There is a subtlety worth knowing. Synthesis tools see that \`2'b11\` is unreachable from the reset state and are entitled to optimize the recovery logic away as dead code, which defeats the whole exercise. Real safety flows either use a \`safe\` FSM synthesis attribute, or add explicit redundancy the tool cannot prove is unreachable.\n\n` +
      `Driving \`out\` low in the illegal state matters as much as recovering. A machine that briefly asserts a control output while in an undefined state can fire a real actuator, and the recovery a cycle later does not undo that.\n\n` +
      `Interview follow-up: why not just use a 2-state-per-flop encoding with no illegal codes? Because a fully-covered encoding needs the state count to be a power of two. One-hot has the same problem in reverse — most of its encodings are illegal — which is why one-hot machines need this default even more urgently.`,
  },

  {
    id: 'f-timeout',
    number: 125,
    title: 'FSM with a Watchdog Timeout',
    track: 'fsm',
    difficulty: 'Medium',
    tags: ['fsm', 'timeout', 'watchdog', 'counter'],
    moduleName: 'fsm_timeout',
    statement:
      `A request/wait machine that refuses to wait forever.\n\n` +
      `States: \`S_IDLE = 2'b00\`, \`S_WAIT = 2'b01\`, \`S_TIMEOUT = 2'b10\`. Active-low asynchronous reset to S_IDLE with the internal counter cleared.\n\n` +
      `In S_IDLE (\`busy\` = 0, \`timeout\` = 0): \`req\` high moves to S_WAIT and clears the counter, otherwise stay.\n\n` +
      `In S_WAIT (\`busy\` = 1, \`timeout\` = 0): if \`req\` drops the transaction completed, so return to S_IDLE. If \`req\` stays high the counter increments; once it has counted three cycles in S_WAIT, move to S_TIMEOUT.\n\n` +
      `In S_TIMEOUT (\`busy\` = 0, \`timeout\` = 1): return to S_IDLE unconditionally on the next edge.`,
    context:
      `Bus interconnects give a slave a bounded window to respond. If it hangs, the watchdog trips, the transaction is abandoned with an error, and the interconnect stays alive — far better than deadlocking the whole chip waiting for a peripheral that will never answer.`,
    hint:
      'Keep the counter in the same clocked block as the state. Clear it on entry to S_WAIT and increment it while waiting.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'req', width: 1, note: 'request pending' },
    ],
    outputs: [
      { name: 'busy', width: 1, note: 'high in S_WAIT' },
      { name: 'timeout', width: 1, note: 'high in S_TIMEOUT' },
      { name: 'state', width: 2 },
    ],
    constraints: [
      'Module name must be `fsm_timeout`',
      'States: S_IDLE = 2\'b00, S_WAIT = 2\'b01, S_TIMEOUT = 2\'b10',
      'Timeout trips after 3 cycles waiting with `req` still high',
      'S_TIMEOUT lasts exactly one cycle',
    ],
    examples: [
      { in: { rst_n: 1, req: 1 }, out: { state: '2\'b00', busy: 0, timeout: 0 } },
      { in: { rst_n: 1, req: 1 }, out: { state: '2\'b01', busy: 1, timeout: 0 }, note: 'waiting' },
      { in: { rst_n: 1, req: 0 }, out: { state: '2\'b10', busy: 0, timeout: 1 }, note: 'tripped' },
      { in: { rst_n: 1, req: 0 }, out: { state: '2\'b00', busy: 0, timeout: 0 }, note: 'back to idle' },
    ],
    stimulus: { cycles: 56, seed: 4006 },
    starter: `module fsm_timeout(
  input        clk,
  input        rst_n,
  input        req,
  output       busy,
  output       timeout,
  output [1:0] state
);
  localparam S_IDLE = 2'b00, S_WAIT = 2'b01, S_TIMEOUT = 2'b10;
  reg [1:0] cur;
  reg [1:0] cnt;

  assign state = cur;
endmodule`,
    solution: `module fsm_timeout(
  input        clk,
  input        rst_n,
  input        req,
  output       busy,
  output       timeout,
  output [1:0] state
);
  localparam S_IDLE = 2'b00, S_WAIT = 2'b01, S_TIMEOUT = 2'b10;
  reg [1:0] cur;
  reg [1:0] cnt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cur <= S_IDLE;
      cnt <= 2'd0;
    end else begin
      case (cur)
        S_IDLE: begin
          cnt <= 2'd0;
          if (req) cur <= S_WAIT;
        end
        S_WAIT: begin
          if (!req) begin
            cur <= S_IDLE;            // acknowledged in time
          end else if (cnt == 2'd2) begin
            cur <= S_TIMEOUT;         // third cycle waiting
          end else begin
            cnt <= cnt + 1'b1;
          end
        end
        S_TIMEOUT: begin
          cur <= S_IDLE;
          cnt <= 2'd0;
        end
        default: begin
          cur <= S_IDLE;
          cnt <= 2'd0;
        end
      endcase
    end
  end

  assign busy    = (cur == S_WAIT);
  assign timeout = (cur == S_TIMEOUT);
  assign state   = cur;
endmodule`,
    editorial:
      `This one is written as a single clocked block rather than the three-process split, because the counter and the state are genuinely coupled — the counter must clear on entry to S_WAIT and stop on exit. Splitting them into separate blocks means duplicating the state decode, which is more code and easier to get out of step.\n\n` +
      `The counter compares against 2 rather than 3 because it starts at 0: values 0, 1, 2 are three cycles of waiting. Off-by-one here is the classic bug, and it is invisible unless you count edges in a waveform.\n\n` +
      `Note the counter only increments in the branch where the machine is staying in S_WAIT. Incrementing unconditionally would also count the cycle in which the machine leaves, which throws the timing off by one in the other direction.\n\n` +
      `Real watchdogs make the limit a parameter and size the counter with \`$clog2\`, so the same block serves a 4-cycle SPI timeout and a 10,000-cycle DRAM timeout.`,
  },

  {
    id: 'f-multi-output',
    number: 126,
    title: 'Sequencer with Multiple Control Outputs',
    track: 'fsm',
    difficulty: 'Medium',
    tags: ['fsm', 'control', 'dma', 'sequencer'],
    moduleName: 'fsm_sequencer',
    statement:
      `A four-step sequencer driving three independent control strobes.\n\n` +
      `States: \`S_IDLE = 2'b00\`, \`S_READ = 2'b01\`, \`S_EXEC = 2'b10\`, \`S_WRITE = 2'b11\`. Active-low asynchronous reset to S_IDLE.\n\n` +
      `S_IDLE: all outputs low; \`start\` high moves to S_READ.\nS_READ: \`busy\` = 1, \`rd_en\` = 1; always advances to S_EXEC.\nS_EXEC: \`busy\` = 1 only; always advances to S_WRITE.\nS_WRITE: \`busy\` = 1, \`wr_en\` = 1; always returns to S_IDLE.\n\n` +
      `Once started the sequence runs to completion — \`start\` is only consulted in S_IDLE.`,
    context:
      `A DMA engine, a cache-line fill, or a memory controller's refresh sequence all look like this: a fixed series of steps, each asserting a different combination of enables to the datapath around it. The FSM is the conductor; it does not touch the data itself.`,
    hint:
      'Assign all three outputs a default of 0 at the top of the output block, then override per state. That guarantees every output is driven on every path.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'start', width: 1, note: 'only sampled in S_IDLE' },
    ],
    outputs: [
      { name: 'busy', width: 1 },
      { name: 'rd_en', width: 1 },
      { name: 'wr_en', width: 1 },
      { name: 'state', width: 2 },
    ],
    constraints: [
      'Module name must be `fsm_sequencer`',
      'States: S_IDLE = 2\'b00, S_READ = 2\'b01, S_EXEC = 2\'b10, S_WRITE = 2\'b11',
      'Once started the sequence completes without re-checking `start`',
      '`rd_en` and `wr_en` are never high at the same time',
    ],
    examples: [
      { in: { rst_n: 1, start: 1 }, out: { state: '2\'b00', busy: 0, rd_en: 0, wr_en: 0 } },
      { in: { rst_n: 1, start: 0 }, out: { state: '2\'b01', busy: 1, rd_en: 1, wr_en: 0 } },
      { in: { rst_n: 1, start: 0 }, out: { state: '2\'b10', busy: 1, rd_en: 0, wr_en: 0 } },
      { in: { rst_n: 1, start: 0 }, out: { state: '2\'b11', busy: 1, rd_en: 0, wr_en: 1 } },
    ],
    stimulus: { cycles: 48, seed: 4007 },
    starter: `module fsm_sequencer(
  input        clk,
  input        rst_n,
  input        start,
  output reg   busy,
  output reg   rd_en,
  output reg   wr_en,
  output [1:0] state
);
  localparam S_IDLE = 2'b00, S_READ = 2'b01, S_EXEC = 2'b10, S_WRITE = 2'b11;
  reg [1:0] cur, nxt;

  assign state = cur;
endmodule`,
    solution: `module fsm_sequencer(
  input        clk,
  input        rst_n,
  input        start,
  output reg   busy,
  output reg   rd_en,
  output reg   wr_en,
  output [1:0] state
);
  localparam S_IDLE = 2'b00, S_READ = 2'b01, S_EXEC = 2'b10, S_WRITE = 2'b11;
  reg [1:0] cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S_IDLE;
    else        cur <= nxt;
  end

  always @(*) begin
    case (cur)
      S_IDLE:  nxt = start ? S_READ : S_IDLE;
      S_READ:  nxt = S_EXEC;
      S_EXEC:  nxt = S_WRITE;
      S_WRITE: nxt = S_IDLE;
      default: nxt = S_IDLE;
    endcase
  end

  always @(*) begin
    // Default everything low, then override — no path can leave an output undriven.
    busy  = 1'b0;
    rd_en = 1'b0;
    wr_en = 1'b0;
    case (cur)
      S_READ:  begin busy = 1'b1; rd_en = 1'b1; end
      S_EXEC:  begin busy = 1'b1;               end
      S_WRITE: begin busy = 1'b1; wr_en = 1'b1; end
      default: ;
    endcase
  end

  assign state = cur;
endmodule`,
    editorial:
      `The default-then-override pattern in the output block is the technique worth taking away. With three outputs and four states, writing every combination explicitly means twelve assignments and one missing line infers a latch. Defaulting them all to 0 first means each state only mentions what it actually asserts, and completeness is structural rather than something you have to check.\n\n` +
      `Because \`start\` is only read in S_IDLE, a pulse arriving mid-sequence is ignored rather than restarting or corrupting the run. Whether that is right depends on the spec — some designs need to latch a pending request instead, so the next sequence begins immediately on return to idle.\n\n` +
      `The mutual exclusion of \`rd_en\` and \`wr_en\` falls out of the encoding for free: they are asserted in different states, so no logic is needed to enforce it. Getting that guarantee from the state structure rather than from an explicit check is what makes FSM-based control easy to review.`,
  },

  {
    id: 'f-seq-detect-1011',
    number: 127,
    title: 'Overlapping Sequence Detector for 1011',
    track: 'fsm',
    difficulty: 'Hard',
    tags: ['fsm', 'sequence-detector', 'moore', 'overlapping'],
    moduleName: 'seq_detect_1011',
    statement:
      `Detect the bit pattern 1011 arriving serially on \`in\`, most significant bit first, with overlaps counted.\n\n` +
      `\`found\` goes high for one cycle each time the pattern completes. Overlapping means a partial match must not be thrown away: the stream 1011011 contains two occurrences, because the trailing 11 of the first can begin the second.\n\n` +
      `Use five states tracking how much of the pattern has matched so far: \`S_IDLE = 3'd0\` (nothing), \`S_1 = 3'd1\`, \`S_10 = 3'd2\`, \`S_101 = 3'd3\`, \`S_1011 = 3'd4\` (complete). Active-low asynchronous reset to S_IDLE. \`found\` is high in S_1011 and nowhere else.\n\n` +
      `The hard part is the failure transitions: when a bit breaks the match, work out how much of the *new* input can still serve as a prefix rather than dropping straight to S_IDLE.`,
    context:
      `Frame delimiters, sync words and preamble detectors in every serial protocol are exactly this. Getting the failure transitions wrong makes the detector miss patterns that straddle a near-miss — a bug that only shows on specific input sequences and is miserable to find in the field.`,
    hint:
      'Work each state out by asking "if this bit arrives, what is the longest suffix of what I have now seen that is also a prefix of 1011?" From S_101, a 0 gives ...1010, whose longest useful suffix is 10 — so go to S_10, not S_IDLE.',
    clock: 'clk',
    reset: { name: 'rst_n', activeLow: true },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst_n', width: 1 },
      { name: 'in', width: 1, note: 'serial bit stream, MSB of the pattern first' },
    ],
    outputs: [
      { name: 'found', width: 1, note: 'one-cycle pulse on each match' },
      { name: 'state', width: 3 },
    ],
    constraints: [
      'Module name must be `seq_detect_1011`',
      'States: S_IDLE=0, S_1=1, S_10=2, S_101=3, S_1011=4',
      'Overlapping matches must both be detected',
      '`found` depends on the state only (Moore)',
    ],
    examples: [
      { in: { rst_n: 1, in: 1 }, out: { state: 0, found: 0 } },
      { in: { rst_n: 1, in: 0 }, out: { state: 1, found: 0 }, note: 'seen 1' },
      { in: { rst_n: 1, in: 1 }, out: { state: 2, found: 0 }, note: 'seen 10' },
      { in: { rst_n: 1, in: 1 }, out: { state: 3, found: 0 }, note: 'seen 101' },
      { in: { rst_n: 1, in: 0 }, out: { state: 4, found: 1 }, note: 'matched 1011' },
    ],
    stimulus: { cycles: 64, seed: 4008 },
    starter: `module seq_detect_1011(
  input        clk,
  input        rst_n,
  input        in,
  output       found,
  output [2:0] state
);
  localparam S_IDLE = 3'd0, S_1 = 3'd1, S_10 = 3'd2, S_101 = 3'd3, S_1011 = 3'd4;
  reg [2:0] cur, nxt;

  // The failure transitions are the interesting part.

  assign state = cur;
endmodule`,
    solution: `module seq_detect_1011(
  input        clk,
  input        rst_n,
  input        in,
  output       found,
  output [2:0] state
);
  localparam S_IDLE = 3'd0, S_1 = 3'd1, S_10 = 3'd2, S_101 = 3'd3, S_1011 = 3'd4;
  reg [2:0] cur, nxt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) cur <= S_IDLE;
    else        cur <= nxt;
  end

  always @(*) begin
    case (cur)
      // nothing matched yet: a 1 starts a match, a 0 gets us nowhere
      S_IDLE:  nxt = in ? S_1   : S_IDLE;
      // seen "1": another 1 restarts from that new 1; a 0 extends to "10"
      S_1:     nxt = in ? S_1   : S_10;
      // seen "10": a 1 extends to "101"; a 0 gives "100" — no useful suffix
      S_10:    nxt = in ? S_101 : S_IDLE;
      // seen "101": a 1 completes the pattern; a 0 gives "1010", whose
      // suffix "10" is still a valid prefix, so fall back to S_10
      S_101:   nxt = in ? S_1011 : S_10;
      // just matched "1011": the trailing "1" can start the next match,
      // so a 0 continues into "10" and a 1 restarts at "1"
      S_1011:  nxt = in ? S_1   : S_10;
      default: nxt = S_IDLE;
    endcase
  end

  assign found = (cur == S_1011);
  assign state = cur;
endmodule`,
    editorial:
      `Every transition here answers one question: after this bit, what is the longest suffix of everything seen so far that is also a prefix of 1011? That is precisely the failure function of the Knuth-Morris-Pratt string search, built in hardware.\n\n` +
      `Two transitions carry all the difficulty:\n\n` +
      `From **S_101 with a 0**: the stream now ends in 1010. Dropping to S_IDLE would be wrong — the trailing 10 is a valid two-bit prefix, so the correct target is S_10. Miss this and the detector fails on 10101011.\n\n` +
      `From **S_1011** (the overlap case): having just matched, the final 1 of the pattern is also a potential first bit of the next one. So a following 0 takes you to S_10 (having seen 10) and a following 1 takes you to S_1. A non-overlapping detector would go to S_IDLE here instead, and that single difference is the whole distinction between the two variants.\n\n` +
      `From **S_1 with a 1**: staying in S_1 rather than advancing is right, because 11 has only the single trailing 1 as a useful prefix.\n\n` +
      `Interview follow-up: how many states does an N-bit pattern need? N+1 for a Moore detector, or N for Mealy since the match can be reported on the transition into the final state rather than from it. And for long patterns nobody builds this by hand — the failure function is computed and the FSM generated.`,
  },
];
