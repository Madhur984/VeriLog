import React from 'react';
import {
  StudyScene,
  Section,
  CodeBlock,
  KeyPoints,
  Callout,
} from './StudyKit';
import {
  SequentialVsParallel,
  VerilogTimeline,
  ModuleBox,
  HierarchyTree,
  TestbenchDiagram,
  SynthesisFlow,
  SimVsRealWave,
  ToolFlow,
  ConcurrentBlocks,
  MentalStack,
  FlipFlopParts,
} from './Diagrams';
import {
  AnimatedClock,
  AnimatedLevelVsEdge,
  AnimatedPosedge,
  InteractiveFlipFlop,
  InteractiveHalfAdder,
  InteractiveMux,
  AnimatedHDLPipeline,
} from './InteractiveDiagrams';
import { TryItYourself } from '../../../ui/TryItYourself';

interface SceneProps { accent: string }

// Helper: vertical-centred figure with a small caption
const Figure: React.FC<{ children: React.ReactNode; caption?: string }> = ({ children, caption }) => (
  <figure className="w-full flex flex-col items-center my-4">
    {children}
    {caption && (
      <figcaption className="mt-3 text-[11px] font-mono tracking-[0.2em] uppercase text-slate-500 dark:text-white/40 text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

// ════════════════════════════════════════════════════════════════════════════
// PART I · LANGUAGE FOUNDATION
// ════════════════════════════════════════════════════════════════════════════

export const SceneWhatIsHDL: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part I · 01"
    title="What is a Hardware Description Language?"
    lead="Code that describes circuits. A synthesis tool turns it into physical gates."
  >
    <Figure caption="From source text to silicon - watch the dot flow through the pipeline">
      <AnimatedHDLPipeline accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Two industry HDLs: Verilog (and SystemVerilog) and VHDL.',
        'Same source simulates in software and synthesises into silicon.',
        'Tooling (lint, formal, equivalence) operates on the text - schematic capture cannot scale.',
      ]}
    />
  </StudyScene>
);

export const SceneNotSoftware: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part I · 02"
    title="HDL is Not Software"
    lead="Software runs instructions one after another. Hardware exists all at once."
  >
    <Figure caption="The single most important mental switch">
      <SequentialVsParallel accent={accent} />
    </Figure>

    <Callout accent={accent}>
      Read every line as <em>“this gate exists,”</em> never as <em>“then we do this.”</em>
    </Callout>
  </StudyScene>
);

export const SceneOriginStory: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part I · 03"
    title="Origin of Verilog"
    lead="From a 1984 simulator startup to a global IEEE standard."
  >
    <Figure caption="Twenty years of standardisation">
      <VerilogTimeline accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Verilog-2001 is the de-facto baseline for digital ASIC and FPGA design.',
        'SystemVerilog (IEEE 1800) extends Verilog with classes, interfaces, and assertions for verification.',
        'VHDL holds defence and aerospace; Chisel and SpinalHDL compile down to Verilog.',
      ]}
    />
  </StudyScene>
);

// ════════════════════════════════════════════════════════════════════════════
// PART II · WRITING VERILOG
// ════════════════════════════════════════════════════════════════════════════

export const SceneFirstVerilog: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part II · 01"
    title="Your First Verilog Module"
    lead="A module is the basic unit of design. Below: a half-adder, eight lines of code, two gates."
  >
    <TryItYourself />
    <Figure caption="Try it - toggle a and b, watch the wires light up and the outputs update">
      <InteractiveHalfAdder accent={accent} />
    </Figure>

    <Section accent={accent} title="The eight lines">
      <CodeBlock
        accent={accent}
        code={`module half_adder (
  input  wire a, b,
  output wire sum, carry
);
  assign sum   = a ^ b;
  assign carry = a & b;
endmodule`}
      />
    </Section>
  </StudyScene>
);

export const SceneModuleThinking: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part II · 02"
    title="Module Thinking"
    lead="A module is a black box: ports in, ports out, internal wiring hidden."
  >
    <Figure caption="The black-box principle - callers depend only on the ports">
      <ModuleBox accent={accent} name="full_adder" inputs={['a', 'b', 'cin']} outputs={['sum', 'cout']} />
    </Figure>

    <Section accent={accent} title="Instantiating it">
      <CodeBlock
        accent={accent}
        code={`full_adder fa1 (.a(x), .b(y), .cin(c0), .sum(s), .cout(c1));`}
      />
    </Section>

    <KeyPoints
      accent={accent}
      points={[
        'Always use named connections (`.a(x)`) - never positional.',
        'Instance names should describe role (`fa_low`), not type.',
      ]}
    />
  </StudyScene>
);

export const SceneHierarchy: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part II · 03"
    title="Hierarchical Design"
    lead="Big chips are nested trees of small modules."
  >
    <Figure caption="A 4-bit ripple-carry adder = 4 full_adders, each a pair of half_adders">
      <HierarchyTree accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Reuse - one full_adder, used four times here, four hundred times elsewhere.',
        'Verification - test each level in isolation before composing.',
        'Synthesis tools usually preserve the hierarchy as physical floorplan blocks.',
      ]}
    />
  </StudyScene>
);

// ════════════════════════════════════════════════════════════════════════════
// PART III · BEHAVIOR & TIMING
// ════════════════════════════════════════════════════════════════════════════

export const SceneParallel: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 01"
    title="Parallel Execution"
    lead="Every always block is independent silicon. They all fire at the same instant."
  >
    <Figure caption="No ordering between always blocks - order in the file is irrelevant">
      <ConcurrentBlocks accent={accent} />
    </Figure>

    <Callout accent={accent} label="Hard rule">
      A signal must have <strong className="text-slate-900 dark:text-white">exactly one driver.</strong> Two always blocks writing the same
      reg is a synthesis error.
    </Callout>
  </StudyScene>
);

export const SceneCombinational: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 02"
    title="Combinational Logic"
    lead="No memory. Output is a pure function of the current inputs."
  >
    <TryItYourself />
    <Figure caption="Toggle a, b, and sel - the active path lights up, y updates instantly">
      <InteractiveMux accent={accent} />
    </Figure>

    <Section accent={accent} title="Two equivalent forms">
      <CodeBlock
        accent={accent}
        code={`assign y = sel ? a : b;        // continuous assign

always @(*) begin               // combinational always
  if (sel) y = a;
  else     y = b;
end`}
      />
    </Section>

    <KeyPoints
      accent={accent}
      points={[
        'Inside `always @(*)`, assign every output on every path - or you infer a latch.',
        'Use blocking `=` for combinational, never non-blocking `<=`.',
      ]}
    />
  </StudyScene>
);

// ── 03 What is a Clock? ──────────────────────────────────────────────────────
export const SceneWhatIsClock: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 03"
    title="What is a Clock?"
    lead="A periodic square wave that paces every flip-flop on the chip - the heartbeat of digital design."
  >
    <TryItYourself />
    <Figure caption="Live clock - drag the slider to change period, watch frequency update">
      <AnimatedClock accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Period (T) - time of one full cycle. Frequency f = 1/T (Hz).',
        'Duty cycle - fraction of the period spent HIGH; 50% is the digital default.',
        'Two edges per period: rising (low → high) and falling (high → low). Most designs trigger only one.',
        'Practical numbers: a 100 MHz clock has T = 10 ns; a modern CPU runs at 3-5 GHz (T ≈ 0.2-0.3 ns).',
      ]}
    />
  </StudyScene>
);

// ── 04 Edge vs Level Triggering ──────────────────────────────────────────────
export const SceneEdgeVsLevel: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 04"
    title="Edge-Triggered vs Level-Triggered"
    lead="Two ways a storage element can listen to its control signal - the difference between a latch and a flip-flop."
  >
    <TryItYourself />
    <Figure caption="Auto-playing - shaded windows show when the latch is transparent; dots mark flip-flop sampling">
      <AnimatedLevelVsEdge accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Latch (level-triggered) - q follows d as long as the enable is asserted; opaque otherwise.',
        'Flip-flop (edge-triggered) - q updates only at one instant (the chosen clock edge), then holds.',
        'Synchronous design uses flip-flops almost exclusively. Latches are dangerous: they can be transparent for arbitrary windows and create timing loops.',
        'A combinational `always` block missing an output assignment infers a latch - this is a common bug, not a feature.',
      ]}
    />
  </StudyScene>
);

// ── 05 Positive Edge Triggering ──────────────────────────────────────────────
export const ScenePosedge: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 05"
    title="Positive Edge Triggering"
    lead="`always @(posedge clk)` says: sample d on the low → high transition of clk, ignore everything else."
  >
    <TryItYourself />
    <Figure caption="Cursor sweeps live - a flash highlights each sampling instant on q">
      <AnimatedPosedge accent={accent} />
    </Figure>

    <Section accent={accent} title="The Verilog idiom">
      <CodeBlock
        accent={accent}
        code={`// rising-edge triggered D flip-flop
always @(posedge clk) q <= d;

// falling-edge variant - used by some serial protocols
always @(negedge clk) q <= d;`}
      />
    </Section>

    <Callout accent={accent}>
      In a single design, pick <strong className="text-slate-900 dark:text-white">one edge</strong> and use it everywhere. Mixed-edge logic
      is legal but doubles the clock-tree balancing work and is a common source of timing closure pain.
    </Callout>
  </StudyScene>
);

// ── 06 Anatomy of a D Flip-Flop ──────────────────────────────────────────────
export const SceneFlipFlopParts: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 06"
    title="Anatomy of a D Flip-Flop"
    lead="A rising-edge D-FF is two latches in series: a master that captures while clk is low, a slave that releases while clk is high."
  >
    <Figure caption="Master-slave construction - only one latch is transparent at a time">
      <FlipFlopParts accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'When clk is LOW - master is transparent (samples D), slave holds (Q stable).',
        'When clk is HIGH - master holds, slave releases the captured value to Q.',
        'The transition LOW → HIGH (rising edge) is the moment the captured value reaches Q. That is "posedge."',
        'Setup time: D must be stable BEFORE the rising edge. Hold time: D must remain stable AFTER it.',
      ]}
    />
  </StudyScene>
);

// ── 07 Reset / Preset / Clear ────────────────────────────────────────────────
export const SceneResetPreset: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part III · 07"
    title="Reset · Clear · Preset"
    lead="Control inputs that force a flip-flop into a known state regardless of D and CLK - essential for power-up and recovery."
  >
    <TryItYourself />
    <Figure caption="Try it - toggle D, click CLK to advance, then PRE / CLR (asynchronous)">
      <InteractiveFlipFlop accent={accent} />
    </Figure>

    <Section accent={accent} title="The four control inputs">
      <KeyPoints
        accent={accent}
        points={[
          'CLR / RST (Clear / Reset) - forces Q = 0. Most common on registers and counters.',
          'PRE / SET (Preset / Set) - forces Q = 1. Used where the resting state is logical-1 (e.g. enable pins).',
          'Synchronous (sampled by clk) - clean timing, but needs the clock to be running. Recommended for FPGAs.',
          'Asynchronous (acts immediately) - required at power-up before the clock is stable; harder to verify.',
        ]}
      />
    </Section>

    <Section accent={accent} title="Verilog patterns">
      <CodeBlock
        accent={accent}
        code={`// Synchronous active-high reset
always @(posedge clk) begin
  if (rst) q <= 1'b0;
  else     q <= d;
end

// Asynchronous active-low reset (FPGA / ASIC convention)
always @(posedge clk or negedge rst_n) begin
  if (!rst_n) q <= 1'b0;
  else        q <= d;
end

// Preset (set to 1) - same shape, different reset value
always @(posedge clk or negedge pre_n) begin
  if (!pre_n) q <= 1'b1;
  else        q <= d;
end`}
      />
    </Section>

    <Callout accent={accent} label="Convention">
      <code className="text-slate-900 dark:text-white">_n</code> suffix marks an active-low signal (asserted when 0). Asynchronous resets
      are usually active-low so a floating wire (pulled up) is the inactive state.
    </Callout>
  </StudyScene>
);

// ════════════════════════════════════════════════════════════════════════════
// PART IV · VERIFICATION
// ════════════════════════════════════════════════════════════════════════════

export const SceneTestbench: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part IV · 01"
    title="Testbench Basics"
    lead="A non-synthesisable Verilog file that drives the design and checks the response."
  >
    <Figure caption="The TB drives stimulus, the DUT responds, the TB observes">
      <TestbenchDiagram accent={accent} />
    </Figure>

    <Section accent={accent} title="The shape of every TB">
      <CodeBlock
        accent={accent}
        code={`module tb_half_adder;
  reg  a, b;
  wire sum, carry;
  half_adder dut (.a(a), .b(b), .sum(sum), .carry(carry));

  initial begin
    $monitor("a=%b b=%b => sum=%b carry=%b", a, b, sum, carry);
    {a,b}=2'b00; #10;
    {a,b}=2'b01; #10;
    {a,b}=2'b10; #10;
    {a,b}=2'b11; #10;
    $finish;
  end
endmodule`}
      />
    </Section>
  </StudyScene>
);

export const SceneTestbenchLab: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part IV · 02"
    title="Testbench Lab - The Tool Flow"
    lead="Two free, cross-platform toolchains take you from textbook Verilog to running waveforms."
  >
    <Figure caption="Compile → run → dump VCD → view in GTKWave">
      <ToolFlow accent={accent} />
    </Figure>

    <Section accent={accent} title="Three commands and you’re done">
      <CodeBlock
        accent={accent}
        lang="shell"
        code={`iverilog -o sim.out half_adder.v tb_half_adder.v   # compile
vvp sim.out                                       # run
gtkwave dump.vcd                                  # view`}
      />
    </Section>

    <Callout accent={accent}>
      Start with iverilog + GTKWave. Move to <strong className="text-slate-900 dark:text-white">Verilator</strong> once your testbenches
      need to run millions of cycles per night.
    </Callout>
  </StudyScene>
);

export const SceneSimVsReal: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part IV · 03"
    title="Simulation vs Reality"
    lead="The simulator is a model. Silicon is physics. They agree on intent - and disagree on glitches."
  >
    <Figure caption="Same logical function, two different waveforms">
      <SimVsRealWave accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Sim catches: logical correctness, register state, reset behaviour.',
        'Sim misses: gate glitches, setup/hold, metastability, IR drop, thermal.',
        'Run gate-level simulation with SDF timing before tape-out.',
      ]}
    />
  </StudyScene>
);

// ════════════════════════════════════════════════════════════════════════════
// PART V · GATEWAY
// ════════════════════════════════════════════════════════════════════════════

export const SceneSynthesis: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part V · 01"
    title="Synthesis Flow"
    lead="The compiler step from synthesisable Verilog to a netlist of gates from a target technology."
  >
    <Figure caption="Five stages from RTL to silicon">
      <SynthesisFlow accent={accent} />
    </Figure>

    <KeyPoints
      accent={accent}
      points={[
        'Open-source: Yosys (often paired with nextpnr for FPGAs).',
        'Industry: Synopsys Design Compiler, Cadence Genus.',
        'Constraints (clock period, I/O delay) are required input - without them the tool cannot judge timing.',
      ]}
    />
  </StudyScene>
);

export const SceneIdentity: React.FC<SceneProps> = ({ accent }) => (
  <StudyScene
    accent={accent}
    eyebrow="Part V · 02"
    title="The Engineer Mindset"
    lead="When you write Verilog, picture the gates."
  >
    <Figure caption="Every line you type lives at every level of this stack">
      <MentalStack accent={accent} />
    </Figure>

    <Callout accent={accent} label="What's next">
      Module 6 (L6 · Synthesis Layer) - abstraction levels, VLSI flow, FPGA vs ASIC, modern accelerators. You now have
      the language; the next module shows you the system.
    </Callout>
  </StudyScene>
);
