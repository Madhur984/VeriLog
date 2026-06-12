import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Copy, Play, AlertTriangle, Code2, CheckCircle2 } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';

/**
 * The Verilog Snippet Library: verified, copyable, synthesis-aware Verilog.
 * Every snippet shows the code, the hardware it produces, the classic
 * mistakes, and a one-tap "Run in Playground" (copies the code and opens
 * the live Verilog playground). This replaces the 2AM Google session.
 */

type CatId = 'ff' | 'counter' | 'comb' | 'alu' | 'fsm' | 'verif' | 'pattern';

const CATEGORIES: Array<{ id: CatId; label: string; color: string }> = [
  { id: 'ff',      label: 'Flip-flops',    color: '#F472B6' },
  { id: 'counter', label: 'Counters',      color: '#F59E0B' },
  { id: 'comb',    label: 'Mux & Coders',  color: '#22D3EE' },
  { id: 'alu',     label: 'ALU Blocks',    color: '#34D399' },
  { id: 'fsm',     label: 'FSM Templates', color: '#A78BFA' },
  { id: 'verif',   label: 'Testbenches',   color: '#60A5FA' },
  { id: 'pattern', label: 'Patterns',      color: '#FB7185' },
];

type SchematicKind = 'dff' | 'counter' | 'ripple' | 'mux' | 'decoder' | 'encoder' | 'alu' | 'fsm' | 'tb' | 'pattern';

interface Snippet {
  id: string;
  title: string;
  category: CatId;
  synth: boolean; // synthesis-ready?
  code: string;
  hardware: string;
  schematic: SchematicKind;
  mistakes: string[];
}

const SNIPPETS: Snippet[] = [
  {
    id: 'dff-async',
    title: 'D flip-flop, asynchronous reset',
    category: 'ff', synth: true, schematic: 'dff',
    code: `module dff_async_rst (
  input  wire clk,
  input  wire rst_n,   // active-low async reset
  input  wire d,
  output reg  q
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 1'b0;
    else        q <= d;
  end
endmodule`,
    hardware: 'One standard-cell DFF with an asynchronous clear pin. The reset acts immediately, without waiting for a clock edge.',
    mistakes: [
      'Using = instead of <= inside the clocked block. Blocking assignments in sequential logic create simulation/synthesis mismatches.',
      'Forgetting "or negedge rst_n" in the sensitivity list, which silently turns your async reset into a sync one.',
      'Driving q from a second always block. One register, one driver, always.',
    ],
  },
  {
    id: 'dff-sync-en',
    title: 'D flip-flop, sync reset + enable',
    category: 'ff', synth: true, schematic: 'dff',
    code: `module dff_sync_en (
  input  wire clk,
  input  wire rst,    // active-high sync reset
  input  wire en,
  input  wire d,
  output reg  q
);
  always @(posedge clk) begin
    if (rst)     q <= 1'b0;
    else if (en) q <= d;
    // no else: q holds its value (the enable mux)
  end
endmodule`,
    hardware: 'A DFF with a 2:1 mux on its D input. The enable selects between new data and the fed-back Q, so "hold" costs one mux, not a gated clock.',
    mistakes: [
      'Gating the clock by hand (assign gclk = clk & en) to implement enable. That creates glitchy derived clocks; let the mux do it.',
      'Putting the reset check after the enable check, which makes reset wait for en and breaks your init sequence.',
    ],
  },
  {
    id: 'counter-sync',
    title: '4-bit synchronous counter',
    category: 'counter', synth: true, schematic: 'counter',
    code: `module counter4 (
  input  wire       clk,
  input  wire       rst_n,
  output reg  [3:0] count
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) count <= 4'd0;
    else        count <= count + 4'd1;
  end
endmodule`,
    hardware: 'Four DFFs sharing ONE clock, fed by a 4-bit incrementer (a small adder). All bits update on the same edge, so timing analysis is clean.',
    mistakes: [
      'Declaring count as wire. Anything assigned in an always block must be reg.',
      'Writing count = count + 1 with blocking assignment, which can ripple unexpectedly through other logic in the same block.',
    ],
  },
  {
    id: 'counter-ripple',
    title: 'Asynchronous (ripple) counter',
    category: 'counter', synth: false, schematic: 'ripple',
    code: `// Educational: know it for exams, avoid it in real RTL.
module ripple4 (
  input  wire       clk,
  input  wire       rst_n,
  output reg  [3:0] q
);
  always @(negedge clk or negedge rst_n)
    if (!rst_n) q[0] <= 1'b0; else q[0] <= ~q[0];
  always @(negedge q[0] or negedge rst_n)
    if (!rst_n) q[1] <= 1'b0; else q[1] <= ~q[1];
  always @(negedge q[1] or negedge rst_n)
    if (!rst_n) q[2] <= 1'b0; else q[2] <= ~q[2];
  always @(negedge q[2] or negedge rst_n)
    if (!rst_n) q[3] <= 1'b0; else q[3] <= ~q[3];
endmodule`,
    hardware: 'A chain of toggle flops where each output CLOCKS the next stage. Cheap in gates, but the count "ripples" bit by bit instead of updating at once.',
    mistakes: [
      'Using this in synthesized designs. Each q[i] becomes a derived clock, which STA tools and clock-tree synthesis hate.',
      'Reading the count while it is mid-ripple: for a few nanoseconds the value is simply wrong (e.g. 0111 to 1000 passes through 0110, 0100...).',
    ],
  },
  {
    id: 'counter-modn',
    title: 'Mod-N counter (parameterized)',
    category: 'counter', synth: true, schematic: 'counter',
    code: `module modn_counter #(
  parameter N = 10,
  parameter W = 4              // W >= clog2(N)
) (
  input  wire         clk,
  input  wire         rst_n,
  output reg  [W-1:0] count,
  output wire         tick     // high for 1 cycle at wrap
);
  assign tick = (count == N-1);

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n)    count <= {W{1'b0}};
    else if (tick) count <= {W{1'b0}};
    else           count <= count + 1'b1;
  end
endmodule`,
    hardware: 'A counter register, an incrementer, and a comparator against N-1 that both wraps the count and produces a one-cycle tick. Chain ticks to divide clocks safely.',
    mistakes: [
      'Comparing count == N instead of N-1, making it a mod N+1 counter. Off-by-one is THE classic counter bug.',
      'Using tick as a clock for the next block. Use it as an enable; deriving clocks from logic invites skew problems.',
    ],
  },
  {
    id: 'mux4',
    title: '4:1 mux, two styles',
    category: 'comb', synth: true, schematic: 'mux',
    code: `// Style 1: continuous assign (compact)
module mux4_assign (
  input  wire [3:0] d,
  input  wire [1:0] sel,
  output wire       y
);
  assign y = sel[1] ? (sel[0] ? d[3] : d[2])
                    : (sel[0] ? d[1] : d[0]);
endmodule

// Style 2: always + case (readable at width)
module mux4_case (
  input  wire [3:0] d,
  input  wire [1:0] sel,
  output reg        y
);
  always @* begin
    case (sel)
      2'b00:   y = d[0];
      2'b01:   y = d[1];
      2'b10:   y = d[2];
      default: y = d[3];
    endcase
  end
endmodule`,
    hardware: 'Both synthesize to the same 4:1 multiplexer tree (three 2:1 muxes). Pick the style for readability, not for the hardware.',
    mistakes: [
      'Forgetting the default arm in the case. A missing arm in combinational logic infers a LATCH, the most common interview trap in Verilog.',
      'Using always @(sel) instead of always @*. A stale sensitivity list simulates wrong and synthesizes right, the worst kind of bug.',
    ],
  },
  {
    id: 'dec3to8',
    title: '3:8 decoder with enable',
    category: 'comb', synth: true, schematic: 'decoder',
    code: `module dec3to8 (
  input  wire [2:0] a,
  input  wire       en,
  output reg  [7:0] y
);
  always @* begin
    y = 8'b0;          // default everything off
    if (en) y[a] = 1'b1;
  end
endmodule`,
    hardware: 'Eight AND gates, each matching one input code, all qualified by the enable. Exactly one output line is high at a time.',
    mistakes: [
      'Skipping the y = 0 default and assigning only one bit, which infers latches for the other seven.',
      'Expecting more than one output high. A decoder is one-hot by definition; if you need multiple, you want something else.',
    ],
  },
  {
    id: 'prio-enc8',
    title: '8:3 priority encoder',
    category: 'comb', synth: true, schematic: 'encoder',
    code: `module prio_enc8 (
  input  wire [7:0] req,
  output reg  [2:0] idx,
  output reg        valid
);
  integer i;
  always @* begin
    idx   = 3'd0;
    valid = 1'b0;
    for (i = 0; i < 8; i = i + 1)
      if (req[i]) begin
        idx   = i[2:0];   // last assignment wins:
        valid = 1'b1;     // highest set bit gets priority
      end
  end
endmodule`,
    hardware: 'A cascade of muxes implementing "highest request wins". The for loop unrolls at synthesis; no sequential hardware is created.',
    mistakes: [
      'Believing the for loop becomes a slow iterative circuit. In combinational always blocks, loops unroll into parallel gates.',
      'Forgetting the valid output. Without it, idx = 0 is ambiguous: was it request 0 or no request at all?',
    ],
  },
  {
    id: 'alu4',
    title: '4-bit ALU slice (add, sub, and, or)',
    category: 'alu', synth: true, schematic: 'alu',
    code: `module alu4 (
  input  wire [3:0] a,
  input  wire [3:0] b,
  input  wire [1:0] op,    // 00 add, 01 sub, 10 and, 11 or
  output reg  [3:0] y,
  output reg        cout
);
  always @* begin
    cout = 1'b0;
    case (op)
      2'b00:   {cout, y} = a + b;
      2'b01:   {cout, y} = a - b;   // borrow appears in cout
      2'b10:   y = a & b;
      default: y = a | b;
    endcase
  end
endmodule`,
    hardware: 'An adder/subtractor and two gate arrays feeding a 4:1 result mux, with the carry chain exposed. Chain slices for wider ALUs.',
    mistakes: [
      'Not defaulting cout before the case. The logic arms that skip cout would otherwise latch it.',
      'Sizing y the same as the sum. {cout, y} = a + b only works because the concatenation is 5 bits; drop cout and you silently truncate the carry.',
    ],
  },
  {
    id: 'fsm-moore',
    title: 'Moore FSM template (detect 101)',
    category: 'fsm', synth: true, schematic: 'fsm',
    code: `module moore_101 (
  input  wire clk,
  input  wire rst_n,
  input  wire x,
  output wire found
);
  localparam [1:0] S0 = 2'd0, S1 = 2'd1,
                   S10 = 2'd2, S101 = 2'd3;
  reg [1:0] state, next;

  // 1) state register
  always @(posedge clk or negedge rst_n)
    if (!rst_n) state <= S0;
    else        state <= next;

  // 2) next-state logic (combinational)
  always @* begin
    next = state;            // safe default
    case (state)
      S0:   next = x ? S1   : S0;
      S1:   next = x ? S1   : S10;
      S10:  next = x ? S101 : S0;
      S101: next = x ? S1   : S10;
    endcase
  end

  // 3) Moore output: state only
  assign found = (state == S101);
endmodule`,
    hardware: 'Two flops for state, a small next-state gate cloud, and an output decoder. Moore outputs change only on clock edges, so they are glitch-free.',
    mistakes: [
      'Merging all three blocks into one clocked always. It works, but outputs become registered a cycle late and the structure stops matching the bubble diagram.',
      'Forgetting next = state as the default, which infers latches the moment one case arm goes missing.',
    ],
  },
  {
    id: 'fsm-mealy',
    title: 'Mealy FSM template (detect 101, overlapping)',
    category: 'fsm', synth: true, schematic: 'fsm',
    code: `module mealy_101 (
  input  wire clk,
  input  wire rst_n,
  input  wire x,
  output wire found
);
  localparam [1:0] S0 = 2'd0, S1 = 2'd1, S10 = 2'd2;
  reg [1:0] state, next;

  always @(posedge clk or negedge rst_n)
    if (!rst_n) state <= S0;
    else        state <= next;

  always @* begin
    next = state;
    case (state)
      S0:      next = x ? S1 : S0;
      S1:      next = x ? S1 : S10;
      S10:     next = x ? S1 : S0;
      default: next = S0;
    endcase
  end

  // Mealy output: state AND input, fires one cycle
  // earlier than the Moore version (3 states, not 4)
  assign found = (state == S10) && x;
endmodule`,
    hardware: 'Same register + gate-cloud shape as Moore, but the output taps the input directly. One fewer state, one cycle faster, and the output can glitch with x.',
    mistakes: [
      'Feeding a Mealy output straight into another clock domain. It can glitch mid-cycle; register it first if anyone samples it.',
      'Comparing Moore vs Mealy by code length. The real trade is output timing and glitch behaviour, not lines of Verilog.',
    ],
  },
  {
    id: 'tb-template',
    title: 'Testbench template (clock, reset, waves)',
    category: 'verif', synth: false, schematic: 'tb',
    code: `\`timescale 1ns/1ps
module tb_counter4;
  reg        clk = 1'b0;
  reg        rst_n;
  wire [3:0] count;

  // device under test
  counter4 dut (
    .clk   (clk),
    .rst_n (rst_n),
    .count (count)
  );

  // 100 MHz clock
  always #5 clk = ~clk;

  // stimulus
  initial begin
    $dumpfile("wave.vcd");      // open in GTKWave
    $dumpvars(0, tb_counter4);
    rst_n = 1'b0;
    #12 rst_n = 1'b1;           // release between edges
    #200 $finish;
  end

  initial
    $monitor("t=%0t  count=%d", $time, count);
endmodule`,
    hardware: 'None, and that is the point. A testbench is a simulation-only wrapper: clock generator, reset sequence, waves and prints around your DUT.',
    mistakes: [
      'Releasing reset exactly on a clock edge. #12 (not #10) lands it between edges so the first capture is unambiguous.',
      'Driving DUT inputs with wire. Testbench stimulus signals must be reg because initial/always blocks assign them.',
      'Forgetting $dumpvars and then wondering why the waveform file is empty.',
    ],
  },
  {
    id: 'patterns',
    title: 'Synthesis-ready vs simulation-only',
    category: 'pattern', synth: false, schematic: 'pattern',
    code: `// ── SIMULATION-ONLY (testbench world) ──────────
#10;                  // time delays
initial begin ... end // stimulus sequences
$display / $monitor   // console prints
force / release       // poking signals mid-run
(x === 1'bx)          // testing for unknowns

// ── SYNTHESIS-READY (describes real hardware) ──
always @(posedge clk) q <= d;     // registers
always @* y = a & b;              // gates
assign z = sel ? a : b;           // muxes
case / if-else (with defaults!)   // decoders
parameter / generate              // structure`,
    hardware: 'The dividing line of the language. The top half tells the SIMULATOR what to do over time; the bottom half tells the SYNTHESIZER what to build in silicon.',
    mistakes: [
      'Writing #10 inside RTL and expecting a delay on the chip. Synthesis ignores delays completely; real delay comes from gates and constraints.',
      'Using initial blocks for reset in ASIC RTL. Power-on state needs an explicit reset signal (FPGAs partially forgive this; ASICs do not).',
      'Comparing against x or z in RTL. Unknowns exist in simulation only; hardware always has a real voltage.',
    ],
  },
];

/* ── tiny schematics ─────────────────────────────────────────────────── */

const Schematic: React.FC<{ kind: SchematicKind; color: string; dark: boolean }> = ({ kind, color, dark }) => {
  const ink = dark ? '#94A3B8' : '#64748B';
  const box = dark ? '#0A0E1A' : '#FFFFFF';
  const W = 230, H = 96;
  const common = { stroke: color, strokeWidth: 2 };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[230px]">
      {kind === 'dff' && (<g>
        <rect x={85} y={18} width={60} height={60} rx={8} fill={box} {...common} />
        <text x={115} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={color}>DFF</text>
        <path d="M85 66 l10 6 l-10 6" fill="none" {...common} />
        <line x1={30} y1={34} x2={85} y2={34} stroke={ink} strokeWidth={2} />
        <line x1={30} y1={72} x2={85} y2={72} stroke={ink} strokeWidth={2} />
        <line x1={145} y1={34} x2={200} y2={34} stroke={ink} strokeWidth={2} />
        <text x={24} y={38} textAnchor="end" fontSize={10} fontFamily="monospace" fill={ink}>D</text>
        <text x={24} y={76} textAnchor="end" fontSize={10} fontFamily="monospace" fill={ink}>clk</text>
        <text x={206} y={38} fontSize={10} fontFamily="monospace" fill={ink}>Q</text>
      </g>)}
      {kind === 'counter' && (<g>
        <rect x={40} y={28} width={56} height={44} rx={8} fill={box} {...common} />
        <text x={68} y={54} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={color}>REG</text>
        <rect x={130} y={28} width={56} height={44} rx={8} fill={box} stroke={ink} strokeWidth={2} />
        <text x={158} y={54} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={ink}>+1</text>
        <line x1={96} y1={50} x2={130} y2={50} stroke={ink} strokeWidth={2} />
        <polyline points="186,50 205,50 205,12 20,12 20,50 40,50" fill="none" stroke={ink} strokeWidth={2} strokeDasharray="4 3" />
        <text x={113} y={88} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>one clock, all bits together</text>
      </g>)}
      {kind === 'ripple' && (<g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={25 + i * 65} y={30} width={42} height={40} rx={6} fill={box} {...common} />
            <text x={46 + i * 65} y={54} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={color}>T{i}</text>
            {i < 2 && <line x1={67 + i * 65} y1={50} x2={90 + i * 65} y2={50} stroke={ink} strokeWidth={2} />}
          </g>
        ))}
        <text x={115} y={88} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>each output clocks the next (ripple)</text>
      </g>)}
      {kind === 'mux' && (<g>
        <path d={`M90 14 L140 32 L140 64 L90 82 Z`} fill={box} {...common} />
        {[22, 38, 58, 74].map((y, i) => (
          <g key={y}><line x1={45} y1={y} x2={90} y2={y} stroke={ink} strokeWidth={2} />
          <text x={38} y={y + 3} textAnchor="end" fontSize={9} fontFamily="monospace" fill={ink}>d{i}</text></g>
        ))}
        <line x1={140} y1={48} x2={190} y2={48} stroke={ink} strokeWidth={2} />
        <text x={196} y={52} fontSize={10} fontFamily="monospace" fill={ink}>y</text>
        <line x1={115} y1={73} x2={115} y2={90} stroke={ink} strokeWidth={2} />
        <text x={122} y={90} fontSize={9} fontFamily="monospace" fill={ink}>sel</text>
      </g>)}
      {kind === 'decoder' && (<g>
        <rect x={70} y={20} width={56} height={56} rx={8} fill={box} {...common} />
        <text x={98} y={52} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={color}>3:8</text>
        <line x1={28} y1={48} x2={70} y2={48} stroke={ink} strokeWidth={2} />
        {[26, 36, 46, 56, 66].map((y) => (
          <line key={y} x1={126} y1={y} x2={170} y2={y} stroke={ink} strokeWidth={1.6} />
        ))}
        <text x={176} y={50} fontSize={9} fontFamily="monospace" fill={ink}>one-hot</text>
      </g>)}
      {kind === 'encoder' && (<g>
        <rect x={104} y={20} width={56} height={56} rx={8} fill={box} {...common} />
        <text x={132} y={52} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={color}>8:3</text>
        {[26, 36, 46, 56, 66].map((y) => (
          <line key={y} x1={60} y1={y} x2={104} y2={y} stroke={ink} strokeWidth={1.6} />
        ))}
        <line x1={160} y1={48} x2={200} y2={48} stroke={ink} strokeWidth={2} />
        <text x={50} y={50} textAnchor="end" fontSize={9} fontFamily="monospace" fill={ink}>req</text>
      </g>)}
      {kind === 'alu' && (<g>
        <path d="M75 18 L155 18 L140 48 L155 78 L75 78 L90 48 Z" fill={box} {...common} />
        <text x={115} y={52} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={color}>ALU</text>
        <line x1={40} y1={28} x2={80} y2={28} stroke={ink} strokeWidth={2} />
        <line x1={40} y1={68} x2={80} y2={68} stroke={ink} strokeWidth={2} />
        <line x1={150} y1={48} x2={195} y2={48} stroke={ink} strokeWidth={2} />
        <text x={34} y={32} textAnchor="end" fontSize={10} fontFamily="monospace" fill={ink}>a</text>
        <text x={34} y={72} textAnchor="end" fontSize={10} fontFamily="monospace" fill={ink}>b</text>
        <text x={201} y={52} fontSize={10} fontFamily="monospace" fill={ink}>y</text>
      </g>)}
      {kind === 'fsm' && (<g>
        <circle cx={60} cy={48} r={22} fill={box} {...common} />
        <circle cx={165} cy={48} r={22} fill={box} stroke={ink} strokeWidth={2} />
        <text x={60} y={52} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={color}>S0</text>
        <text x={165} y={52} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>S1</text>
        <path d="M82 38 Q112 18 143 38" fill="none" stroke={ink} strokeWidth={2} />
        <path d="M143 58 Q112 78 82 58" fill="none" stroke={ink} strokeWidth={2} />
        <polygon points="143,38 134,33 136,43" fill={ink} />
        <polygon points="82,58 91,63 89,53" fill={ink} />
      </g>)}
      {kind === 'tb' && (<g>
        <rect x={85} y={26} width={64} height={46} rx={8} fill={box} {...common} />
        <text x={117} y={53} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={color}>DUT</text>
        <polyline points="25,38 40,38 40,30 55,30 55,38 70,38 70,30 85,30" fill="none" stroke={ink} strokeWidth={2} />
        <line x1={149} y1={49} x2={195} y2={49} stroke={ink} strokeWidth={2} />
        <text x={117} y={90} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>clock + stimulus around it</text>
      </g>)}
      {kind === 'pattern' && (<g>
        <rect x={25} y={20} width={80} height={56} rx={8} fill={box} stroke={ink} strokeWidth={2} strokeDasharray="5 4" />
        <rect x={125} y={20} width={80} height={56} rx={8} fill={box} {...common} />
        <text x={65} y={45} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>sim</text>
        <text x={65} y={58} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={ink}>only</text>
        <text x={165} y={45} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={color}>real</text>
        <text x={165} y={58} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={color}>silicon</text>
      </g>)}
    </svg>
  );
};

/* ── page ────────────────────────────────────────────────────────────── */

export const VerilogLibrary: React.FC = () => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CatId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SNIPPETS.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!needle) return true;
      return `${s.title} ${s.code} ${s.hardware}`.toLowerCase().includes(needle);
    });
  }, [q, cat]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const copy = async (s: Snippet) => {
    try {
      await navigator.clipboard.writeText(s.code);
      notify(`${s.title}: copied to clipboard.`);
    } catch {
      notify('Clipboard is blocked in this browser.');
    }
  };

  const runInPlayground = async (s: Snippet) => {
    try { await navigator.clipboard.writeText(s.code); } catch { /* ignore */ }
    navigate('/verilog-playground');
  };

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';
  const card = dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg';

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0A0B12]' : 'bg-white'} ${text}`}>
      <div className="mx-auto max-w-5xl px-5 pt-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
            <Code2 size={14} /> The Verilog Snippet Library
          </span>
          <h1 className={`mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight ${text}`}>
            Verified Verilog, ready to paste.
          </h1>
          <p className={`mt-4 text-lg leading-relaxed ${sub}`}>
            Every snippet shows the code, the hardware it actually produces, and the classic
            mistakes around it. This replaces the 2AM Google session.
          </p>
        </div>

        {/* search + filters */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
            dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}>
            <Search size={18} className={sub} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: flip-flop, mux, FSM, testbench..."
              className={`w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 ${text}`}
            />
            {q && <button onClick={() => setQ('')} className={`text-xs font-bold ${sub} hover:opacity-70`}>clear</button>}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCat(null)}
              className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
              style={{
                borderColor: cat === null ? '#22D3EE' : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                background: cat === null ? 'rgba(34,211,238,0.12)' : 'transparent',
                color: cat === null ? '#22D3EE' : undefined,
              }}
            >
              ALL ({SNIPPETS.length})
            </button>
            {CATEGORIES.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(active ? null : c.id)}
                  className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
                  style={{
                    borderColor: active ? c.color : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    background: active ? `${c.color}1F` : 'transparent',
                    color: active ? c.color : undefined,
                  }}
                >
                  {c.label.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* snippets */}
        <div className="mt-12 space-y-8">
          {filtered.map((s) => {
            const c = CATEGORIES.find((x) => x.id === s.category)!;
            return (
              <article key={s.id} className={`rounded-3xl border p-6 sm:p-8 ${card}`}>
                {/* header */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                        style={{ background: `${c.color}1A`, color: c.color }}>
                    {c.label}
                  </span>
                  <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                    s.synth
                      ? 'border-emerald-400/50 text-emerald-400'
                      : 'border-amber-400/50 text-amber-400'
                  }`}>
                    {s.synth ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                    {s.synth ? 'synthesis-ready' : 'simulation / educational'}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => void copy(s)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                        dark ? 'border-white/15 hover:border-white/40' : 'border-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <Copy size={13} /> Copy
                    </button>
                    <button
                      onClick={() => void runInPlayground(s)}
                      className="flex items-center gap-1.5 rounded-xl px-3 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
                      style={{ background: c.color }}
                      title="Copies the code and opens the live playground"
                    >
                      <Play size={13} /> Run in Playground
                    </button>
                  </div>
                </div>

                <h2 className={`mt-4 text-xl font-extrabold tracking-tight sm:text-2xl ${text}`}>{s.title}</h2>

                <div className="mt-5 grid gap-6 lg:grid-cols-5">
                  {/* code */}
                  <pre className={`lg:col-span-3 overflow-x-auto rounded-2xl border p-4 font-mono text-[12px] leading-relaxed ${
                    dark ? 'border-white/10 bg-black/40 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}>
                    <code>{s.code}</code>
                  </pre>
                  {/* hardware */}
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: c.color }}>
                        The hardware this produces
                      </div>
                      <Schematic kind={s.schematic} color={c.color} dark={dark} />
                      <p className={`mt-3 text-[13px] leading-relaxed ${sub}`}>{s.hardware}</p>
                    </div>
                  </div>
                </div>

                {/* mistakes */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    <AlertTriangle size={12} /> Common mistakes
                  </div>
                  <ul className="space-y-1.5">
                    {s.mistakes.map((m) => (
                      <li key={m} className={`flex gap-2.5 text-[13px] leading-relaxed ${sub}`}>
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-rose-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className={`mt-16 text-center text-sm ${sub}`}>
            Nothing matches "{q}". Try "counter" or "FSM".
          </p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-cyan-400/40 bg-slate-950 px-5 py-4 text-center text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default VerilogLibrary;
