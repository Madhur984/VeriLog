# Verilog Judge — simulation toolchain

A decision record for how the judge compiles and simulates student Verilog, and
what the alternatives would cost.

## Decision

**Yosys (WASM, in-browser) is the only engine.** Grading is *differential*: the
student's design and the problem's reference solution are both synthesized to a
netlist, driven with identical seeded stimulus, and their outputs compared.

```
student.v ──┐
            ├─► Yosys WASM ─► JSON netlist ─► netlistSim ─► trace ──┐
reference.v ┘                                                       ├─► diff ─► verdict + waveform
                        same stimulus (seeded, reproducible) ───────┘
```

Implementation: `engine/verilog/diffGrade.ts` (grader), `simRunner.ts` (execution),
`stimulus.ts` (vector generation), `netlistSim.ts` (cell-level evaluation).
The synthesizer is injected, so the identical grader runs in the browser
(`gradeV2.ts` → Yosys worker) and under Node (`testing/yosysNode.ts` → CI).

## Why differential grading

The v1 bank carried a hand-written JavaScript `golden` function per problem. That
does not scale: a 4-bit ALU or a FIFO would need its entire behaviour
re-implemented in TypeScript, and any drift between the JS model and the Verilog
intent becomes a wrong grade for the student.

With a reference written in Verilog, the spec *is* executable and there is no
second model to drift. `data/verilog/problems.test.ts` then validates the whole
bank against the real engine on every CI run:

- the reference scores 100% against its own stimulus;
- the starter code does **not** pass (the problem is not trivially satisfied);
- the declared ports match the ports Yosys actually finds;
- no unsupported cells, and no `x` on any reference output.

That last check earns its keep. A design using constructs `netlistSim` cannot
model produces `x`, and two `x`-producing designs compare equal — so a broken
problem could look like it passes. The check caught exactly that during authoring
(`$shiftx` from an indexed part-select), which is why `$shiftx` is now modelled.

## What Yosys-only cannot do

| Not supported | Why | Workaround used |
|---|---|---|
| `$display`, `$monitor`, `#delays`, `initial` | Not synthesizable; Yosys discards them | Problems are graded by driving ports, not by running a testbench |
| Tristate / `inout` | `prep` optimizes `1'bz` into an ordinary mux, losing the high-Z state | No tristate problems in the bank |
| Transparent latches | Modelled, but level-sensitive timing is approximate | No latch-inference problems (clock-gating cells excluded) |
| Simulation/synthesis mismatch bugs | There is no separate simulator to disagree with | Out of scope — this is a design judge, not a lint tool |

Everything else in the 89-problem bank works: parameters, `generate`, `case`/
`casez`, `$clog2`, `$signed`, multi-bit arithmetic, FSMs, memories (`$mem_v2`),
and every flip-flop flavour including async reset.

## Alternatives evaluated

### Icarus Verilog — rejected for the browser, viable server-side

Icarus can be compiled to WASM; [VeriSim](https://github.com/senolgulgonul/verisim)
demonstrates a working three-stage port (`ivlpp` → `ivl` → `vvp`) with VCD output.
It would give full behavioural Verilog: testbenches, tristate, `$display`.

**The blocker is licensing.** Icarus is GPLv2+, and the compiled `.wasm` modules
are derivative works. Serving them to browsers is *distribution*, which would
oblige BitForBytes to license the judge frontend under the GPL as well. Yosys is
ISC, which is why the current stack has no such constraint.

Running Icarus **server-side** avoids this — GPLv2 is triggered by distribution,
not by use, and SaaS use is not distribution. That remains the recommended path
if behavioural simulation is ever needed:

- sandboxed container (no network, CPU/memory/wall-clock caps — `vvp` will
  happily run an infinite `always` loop);
- returns a VCD, which the existing `WaveformViewer` can render after a VCD→Trace
  parser is added;
- unlocks tristate, memories initialized with `$readmemh`, and self-checking
  testbench problems.

### Verilator — not viable in-browser, low priority server-side

Verilator transpiles Verilog to C++ and then needs a C++ compiler and a link
step. That toolchain does not exist in a browser, and even server-side the
compile-per-submission latency (seconds) is far worse than Yosys's ~0.4 s for a
judge workload. Verilator wins on *simulation throughput* for large designs run
for millions of cycles — the opposite of this workload, which is tiny designs run
for tens of cycles. Its lint mode (`verilator --lint-only`) is the genuinely
interesting part and could be added server-side to give style feedback.

### GTKWave — cannot be embedded

GTKWave is a native GTK desktop application. There is no embeddable build. The
in-page equivalent is `components/verilog/WaveformViewer.tsx`, which renders the
grading trace directly (bus hexagons, hex/dec/bin radix, hover cursor with
per-signal readout, red banding on mismatching cycles, and a dashed `want` row
carrying the reference values). It reads a `Trace`, not a VCD, so no file
round-trip is involved; adding a VCD parser would let it also open external dumps.

## If the backend path is taken later

1. Container with `iverilog` + `vvp`, no network, hard resource caps.
2. `POST /simulate` taking `{ sources, top, testbench }`, returning
   `{ stdout, vcd, exitCode }`.
3. VCD → `Trace` parser so `WaveformViewer` renders it unchanged.
4. Route only the problems that need it; keep Yosys as the default fast path so
   the common case stays instant and offline.

Keep the GPL boundary clean: the container is a separate process invoked over
HTTP, never a library linked into the application.
