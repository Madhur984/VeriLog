# Verilog Bench — Master Implementation Plan

> **Goal:** Make `bitforbytes.in/verilog-playground` the place hardware engineers learn RTL — a browser IDE that compiles, simulates, *proves*, and explains Verilog better than any tool that currently exists, online or off.

> [!IMPORTANT]
> Two constraints hold across every phase.
> **Licensing:** anything shipped to the browser stays permissively licensed (Yosys is ISC). GPL tools live behind a process boundary on the server or not at all — see [verilog-judge-toolchain.md](verilog-judge-toolchain.md).
> **Offline-first:** the default learning loop must work with no network after first load. Server features are enhancements, never the critical path.

---

## 0. What "best in the world" has to mean

Ambition needs a scoreboard. These are the claims the finished product should be able to make, each of which is falsifiable:

| Claim | Measurable form | Who else does this today |
|---|---|---|
| Fastest feedback | p50 verdict < 700 ms combinational, < 1.5 s sequential, fully offline | HDLBits ~3–8 s (server round trip) |
| Actually correct | Verdict is a **formal equivalence proof**, not sampled vectors | Nobody, at any price point |
| Catches the bug class students actually hit | Sim/synth mismatch detected and named | Commercial tools only, and only as a lint warning |
| Explains failure | Minimal counterexample + named failure class + waveform jump | Nobody |
| Real waveforms | VCD in/out, cursors, measurements, 100k+ transitions at 60 fps | GTKWave (desktop), Surfer (desktop/web, no judge) |
| Teaches cost, not just correctness | Gate count, logic depth, critical path vs reference | Nobody in an educational context |
| Works on a bad connection in a lab | PWA, engine cached, zero server dependency | Nobody |

If a phase does not move one of those rows, it is decoration and belongs below the line.

---

## 1. Current state audit

Honest inventory as of this plan. Line counts are real.

| Subsystem | File(s) | Lines | Status |
|---|---|---|---|
| Problem bank v2 | `data/verilog/` (10 tracks + types + index) | ~6 800 | ✅ 106 problems, 9 tracks, CI-validated |
| Integrity harness | `data/verilog/problems.test.ts` | 172 | ✅ 431 assertions against real Yosys |
| Differential grader | `engine/verilog/diffGrade.ts` | 181 | ✅ Stable |
| Stimulus generation | `engine/verilog/stimulus.ts` | 240 | ✅ Exhaustive ≤14 bits, else seeded sampling |
| Netlist simulator | `engine/verilog/netlistSim.ts` | 493 | ⚠️ 2-state only, post-synthesis |
| Sim runner / trace | `engine/verilog/simRunner.ts` | 120 | ✅ Stable |
| Yosys WASM bridge | `yosys.worker.ts`, `yosysClient.ts` | 206 | ⚠️ 54 MB, refetched per session |
| Diagnostics | `engine/verilog/diagnostics.ts` | 56 | ⚠️ Regex over Yosys stdout |
| Schematic | `synthSchematic.ts`, `SynthSchematicView.tsx` | 735 | ✅ Flat only, no cross-probe |
| Waveform | `components/verilog/WaveformViewer.tsx` | 425 | ⚠️ SVG, no cursors, no VCD |
| Judge page | `pages/VerilogJudge.tsx` | 1 021 | ⚠️ Monolith, does too much |
| **Dead v1 stack** | `verilogProblems.ts`, `grade.ts`, `miniSim.ts`, `seqSim.ts`, `schematic.ts` | ~1 100 | ❌ Superseded, still in tree |

### The three structural gaps that cap the ceiling

Everything in this plan follows from these.

**Gap 1 — We simulate the netlist, not the language.**
`netlistSim` runs Yosys's *output*. That is why `$display`, `initial`, `#delays`, tristate and X-propagation are impossible today, and why "your simulation passes but your synthesis is broken" — the single most expensive bug class in real RTL — is invisible to us. Fixing this is Phase 3 and it is the largest piece of work in the document.

**Gap 2 — The verdict is sampled, not proven.**
For >14 input bits we test 256 random vectors. A design that fails on exactly one input out of 4 billion passes. Yosys already ships `miter` and `sat`; we are sitting on a formal equivalence checker and not using it. This is Phase 2 and it is the cheapest large win available.

**Gap 3 — The editor knows nothing about Verilog.**
Monaco has a hand-written Monarch tokenizer — colours only. No parse tree means no hover, no go-to-definition, no as-you-type diagnostics, no latch-inference warning, no width-mismatch warning. Every mistake costs a full synthesis round trip to discover. This is Phase 1.

---

## 2. Principles

1. **Never lie to the student.** A green verdict must mean something precise, and the UI must say which — "proved equivalent" and "passed 256 of 256 sampled vectors" are different claims and get different badges.
2. **Failure is the product.** Anyone can print `WRONG ANSWER`. The differentiator is the next 400 ms: minimal counterexample, named failure class, cursor already parked on the diverging edge.
3. **Offline is the default path.** Server features degrade gracefully and are always labelled.
4. **The bank is code.** Every problem passes the integrity harness in CI or it does not ship.
5. **One state store.** Judge state consolidates into `stores/verilogJudgeStore.ts`; no new globals beyond it.
6. **Every panel is keyboard-reachable.** Hardware engineers live on keyboards.

---

## Phase 0 — Foundations & instrumentation

**Goal:** clear the deck and start measuring, so later phases have a baseline to beat.
**Size:** ~1 week. **Unblocks:** everything.

### 0.1 Retire the v1 stack
- **[DELETE]** `data/verilogProblems.ts`, `engine/verilog/grade.ts`, `miniSim.ts`, `seqSim.ts`, `schematic.ts` and their four test files
- **[VERIFY]** all 30 v1 problems are already carried into `data/verilog/tracks/foundations.ts` — they are, as of commit `f4cf8eec`
- Removes ~1 100 lines and ~32 tests that assert behaviour nothing ships

### 0.2 Split the judge monolith
`VerilogJudge.tsx` is 1 021 lines and holds layout, state, grading orchestration and four sub-components.
- **[NEW]** `stores/verilogJudgeStore.ts` — zustand: `problemId`, `code`, `result`, `solved`, `streak`, `panelLayout`, `engineState`
- **[NEW]** `components/verilog/ProblemPanel.tsx`, `EditorPanel.tsx`, `ResultsDrawer.tsx`, `ProblemPicker.tsx`
- **[MODIFY]** `pages/VerilogJudge.tsx` → layout host only, target < 200 lines
- **[NEW]** `hooks/useJudgeRun.ts` — run orchestration, cancellation, stale-result guarding

### 0.3 Performance instrumentation
- **[NEW]** `engine/verilog/telemetry.ts` — phase timings (`fetch`, `synth`, `build`, `stimulus`, `sim`, `diff`), emitted per run
- **[NEW]** `components/verilog/PerfBadge.tsx` — dev-only overlay showing the breakdown
- **[NEW]** `scripts/bench-bank.ts` — grades all 106 references headless, writes p50/p95 per phase to `bench/baseline.json`
- Establishes the number every later phase is measured against

### 0.4 Bank quality: mutation testing
The harness proves the reference passes. It does not prove the *stimulus is strong enough to catch a wrong answer*.
- **[NEW]** `data/verilog/mutation.test.ts` — for each problem, apply mutation operators to the reference (flip a comparison, drop a reset branch, swap `<=`/`=`, off-by-one a constant, invert a polarity) and assert the stimulus **catches** each mutant
- Any surviving mutant is a problem whose stimulus is too weak — a student could pass with broken logic
- Run nightly, not per-commit (it is 106 × ~8 mutants × a synth each)

### Verification
- [ ] `npm test` green after v1 removal; test count drops by ~32, not more
- [ ] `VerilogJudge.tsx` under 200 lines
- [ ] `bench/baseline.json` committed with p50/p95 for all 106 problems
- [ ] Mutation survivors triaged to zero or explicitly waived with a reason

---

## Phase 1 — The editor becomes an IDE

**Goal:** the student learns their mistake while typing, not 400 ms after submitting.
**Size:** ~3–4 weeks. **Depends on:** Phase 0.2.

This phase is built on a real parse tree. Everything else in it is a consequence.

### 1.1 Real Verilog parsing in the browser
- **[NEW]** dependency `web-tree-sitter` + a compiled `tree-sitter-verilog` grammar (~250 KB WASM)
- **[NEW]** `engine/verilog/lang/parser.ts` — load grammar, `parse(text)`, `reparse(edit)` incremental
- **[NEW]** `engine/verilog/lang/ast.ts` — typed query helpers over the CST: modules, ports, nets, always-blocks, instantiations, case-items
- **[NEW]** `engine/verilog/lang/symbols.ts` — scope table: declaration site, width, signedness, direction, driver set, reader set

Tree-sitter is the right choice specifically because it recovers from errors — a half-typed module still yields a usable tree, which is the whole point of doing this on keystroke. Target: reparse < 5 ms on a 200-line file.

### 1.2 Language services (Monaco providers)
- **[NEW]** `engine/verilog/lang/monaco/` — one file per provider
  - `semanticTokens.ts` — colour by *meaning*: port vs net vs reg vs parameter vs instance
  - `hover.ts` — `[7:0] wire, driven at line 12, read at 18, 21` on any identifier
  - `definition.ts` / `references.ts` — go-to-declaration, find-all-drivers
  - `documentSymbols.ts` — outline: module → ports → always blocks → instances
  - `completion.ts` — keywords, in-scope signals, **port-connection completion** when instantiating a module (`.clk(|)` → suggests matching names)
  - `signatureHelp.ts` — parameter list while instantiating
  - `rename.ts`, `formatting.ts`, `foldingRange.ts`
- **[NEW]** `engine/verilog/lang/snippets.ts` — `always_ff`, `always_comb`, `case`, `casez`, FSM skeleton, testbench skeleton, `generate` loop

### 1.3 The lint engine — the part that actually teaches
- **[NEW]** `engine/verilog/lang/lint/` — one rule per file, each with `id`, `severity`, `message`, `explain` (a paragraph), and an optional `fix` (Monaco code action)

| Rule | Why it matters |
|---|---|
| `latch-inferred` | Incomplete `if`/`case` in a combinational block — the #1 student bug |
| `blocking-in-sequential` | `=` inside `always @(posedge)` — simulation race |
| `nonblocking-in-combinational` | `<=` in `always @*` — works in sim, wrong intent |
| `incomplete-sensitivity` | `always @(a)` when `b` is read — classic sim/synth mismatch |
| `width-mismatch` | Silent truncation on assignment |
| `signedness-mix` | `$signed`/unsigned comparison, the 0xFF-is-255-or-−1 trap |
| `multiple-drivers` | Two `assign`s to one net |
| `undriven-net` / `unread-net` | Usually a typo |
| `case-no-default` | With `full_case` semantics explained |
| `reset-polarity-mismatch` | Declared `rst_n` but tested `if (rst_n)` |
| `async-reset-deassertion` | Recovery/removal — asserted async, released async |
| `clock-in-data-path` | Clock used as a data signal |
| `magic-number-width` | `4'd15` vs `'d15` in a parameterized context |

Every rule ships with `explain` prose and, where mechanical, a one-click fix. This is Verilator's `--lint-only` value delivered offline, instantly, with teaching attached.

### 1.4 Editor UX
- Inline squiggles + gutter icons, debounced 150 ms
- **[NEW]** `components/verilog/LintPanel.tsx` — grouped by severity, click to jump, "explain" expands the paragraph
- Bracket-pair colourization, `begin`/`end` matching, `module`/`endmodule` sticky header
- Multi-file scratch tabs (design + testbench) — prerequisite for Phase 3
- Vim and Emacs keymaps (opt-in; hardware people ask for this constantly)
- **[NEW]** diff view: your current code vs your last accepted submission

### Verification
- [ ] Reparse p95 < 5 ms on a 200-line file; no dropped keystrokes at 120 wpm
- [ ] All 13 lint rules have a positive and negative fixture test
- [ ] Running lint across all 106 reference solutions yields **zero** findings (they are the style exemplar)
- [ ] Hover, go-to-def and rename work across a two-module file with instantiation

---

## Phase 2 — Proof, not sampling

**Goal:** turn "passed 256 vectors" into "proved equivalent for all 2³² inputs".
**Size:** ~2–3 weeks. **Depends on:** nothing. **Highest value per unit effort in the plan.**

Yosys already contains everything needed. We are not using it.

### 2.1 Spike — ✅ **resolved, this works today**

Probed the shipped `@yowasp/yosys` 0.64 WASM build. `sat`, `miter`, `equiv_make`, `equiv_induct`, `equiv_status` and `write_smt2` are all **present** — MiniSat is compiled in. No fallback to z3 needed.

Ran it end to end against an 8-bit adder:

| Case | Result | Time |
|---|---|---|
| `a + b` vs `b + a` | **PROVED** equivalent, all 65 536 input pairs | 391 ms |
| `a + b`, wrong on exactly one input pair | **COUNTEREXAMPLE** found | 61 ms |

That second row is the argument for this whole phase. A design broken on 1 input out of 65 536 has a **0.4% chance** of being caught by our current 256-vector sample. The SAT solver found it in 61 ms, and handed back the exact input.

### 2.2 Combinational equivalence — exact
- **[NEW]** `engine/verilog/prove/miter.ts`

The working script, verified:

```
read_verilog gold.v ; prep -top gold ; design -stash gold
read_verilog gate.v ; prep -top gate ; design -stash gate
design -copy-from gold -as gold gold
design -copy-from gate -as gate gate
miter -equiv -flatten -make_outputs gold gate miter
prep -top miter
sat -verify -prove trigger 0 -show-inputs miter
```

Parse the log for `no model found: SUCCESS` (proved) or `model found: FAIL` (counterexample, with the input vector printed by `-show-inputs`). Result is one of exactly three things: **proved equivalent** (mathematically, for every input), **counterexample** (fed straight into the results table and the waveform), or **timeout** (fall back to sampling and say so on the badge).

Note the `design -stash` / `-copy-from` dance — synthesizing both designs in one pass collides on module names. This is the part that takes an afternoon to get right; it is written down here so nobody rediscovers it.

### 2.3 Sequential equivalence — bounded, then inductive
- **[NEW]** `engine/verilog/prove/seqEquiv.ts`
- Bounded: `sat -seq N -verify -prove` for N cycles (N ≈ 20 covers every problem in the bank)
- Inductive where state encoding matches: `equiv_make` → `equiv_simple` → `equiv_induct` → `equiv_status -assert`
- FSMs with different state encodings will not prove inductively; bounded + sampling is the honest answer there, and the UI says so

### 2.4 Verdict taxonomy — say exactly what was established
- **[MODIFY]** `diffGrade.ts` → `VerdictKind = 'proved' | 'bounded' | 'sampled' | 'exhaustive'`
- **[NEW]** `components/verilog/VerdictBadge.tsx`

| Badge | Meaning | Colour |
|---|---|---|
| **PROVED** | Formally equivalent, all inputs, all time | emerald + shield icon |
| **EXHAUSTIVE** | Every input vector enumerated (≤ 14 bits) | emerald |
| **BOUNDED (20 cycles)** | Proved for 20 cycles from reset | teal |
| **SAMPLED (256/256)** | Passed a random sample — not a proof | amber-tinted green, with an honest tooltip |

That amber tint on `SAMPLED` is a deliberate product decision. Overclaiming is the one thing that would make this tool untrustworthy to a professional.

### 2.5 Counterexamples are gold
A SAT counterexample is the *smallest interesting input* by construction. Feed it directly to the results table as row 0, pre-selected, with the waveform cursor already on it.

### Verification
- [ ] All 106 references prove equivalent to themselves
- [ ] A deliberately broken variant of each of 20 sample problems yields a counterexample, never a false "proved"
- [ ] Proof p95 < 2 s for combinational, < 5 s bounded-sequential
- [ ] Timeout path degrades to sampling with the badge changed, never a silent green

---

## Phase 3 — Behavioural simulation, and the mismatch detector

**Goal:** simulate the *language*, not the netlist — and then use both engines against each other.
**Size:** ~8–12 weeks. **Depends on:** Phase 1.1 (the parse tree). **The big one.**

### 3.1 Why build this rather than ship Icarus server-side

| Option | Unlocks | Cost | Verdict |
|---|---|---|---|
| Keep netlistSim only | — | 0 | Caps the product |
| Server-side Icarus (GPLv2, process boundary) | Full behavioural Verilog | Container, sandbox, queue, per-run cost, +500 ms latency, breaks offline | **Tier 3 escape hatch, not the default** |
| Verilator server-side | Fast sim, great lint | C++ compile per submission (seconds) | Lint only — see 3.6 |
| **Own 4-state interpreter over the CST** | Full behavioural, offline, instant, *and* dual-engine diffing | 8–12 weeks | **Recommended** |

The decisive argument is not the feature list. It is that owning both a behavioural engine and a netlist engine lets us diff them — and that comparison is a product nobody else has (§3.5).

### 3.2 The interpreter core
- **[NEW]** `engine/verilog/behavioral/`
  - `value.ts` — 4-state (`0`/`1`/`X`/`Z`) arbitrary-width vectors on `BigInt` pairs (value + mask); signed/unsigned semantics
  - `elaborate.ts` — parameter resolution, `generate` unrolling, hierarchy flattening with scope paths
  - `scheduler.ts` — the IEEE 1364 stratified event queue: **active → inactive (`#0`) → NBA → monitor**, with `$display` and `$monitor` in the right regions
  - `exec.ts` — statement interpreter: blocking/non-blocking, `if`, `case`/`casez`/`casex`, loops, tasks, functions, `fork`/`join` (subset)
  - `sensitivity.ts` — explicit lists, `@*` inference, `posedge`/`negedge`/`edge`
  - `net.ts` — net resolution for multiple drivers: `wire` (X on conflict), `tri`, `wand`/`wor`, `supply0/1` — this is what makes tristate work
  - `system.ts` — `$display`, `$write`, `$monitor`, `$time`, `$random(seed)`, `$finish`, `$stop`, `$readmemh/b`, `$signed/$unsigned`, `$clog2`, `$bits`
  - `vcd.ts` — dump a real VCD while simulating

**Correctness is the whole game here.** A behavioural simulator that is subtly wrong is worse than none.
- **[NEW]** `behavioral/conformance/` — a golden-output suite. Every fixture is run through **real Icarus Verilog in CI** (Node-side, GPL-safe: separate process, dev-dependency, never shipped) and our output must match byte-for-byte.
- Seed the suite from the IEEE 1364 examples, then grow it from every bug found.

### 3.3 What it unlocks immediately
- Testbench problems: "write a testbench that proves this DUT is broken"
- `initial` blocks, `#delays`, `$display` — i.e. the way Verilog is actually taught in every textbook
- Tristate / `inout` / bidirectional bus problems
- X-propagation: uninitialized register reads show as X and propagate, teaching why reset matters
- Race demonstration: the same code giving different answers under different (legal) scheduler orders

### 3.4 A console that shows `$display`
- **[NEW]** `components/verilog/SimConsole.tsx` — timestamped, sim-time-stamped, filterable, click-a-line → jump the waveform cursor to that sim time

### 3.5 ⭐ The sim/synth mismatch detector
This is the centrepiece feature of the entire plan.

Run the student's source through **both** engines with identical stimulus:
- behavioural interpreter (what their simulator says)
- Yosys `prep` → netlistSim (what the hardware will actually do)

Diff the traces. When they disagree, the design has a **simulation/synthesis mismatch** — the bug class that survives every testbench and then fails in silicon.

- **[NEW]** `engine/verilog/mismatch.ts` — run both, align traces, locate first divergence, classify
- **[NEW]** `components/verilog/MismatchReport.tsx` — three-way waveform: behavioural / synthesized / reference

Classifier catalogue (each maps to a named lesson):

| Symptom | Diagnosis |
|---|---|
| Diverges only when a signal not in the sensitivity list changes | Incomplete sensitivity list |
| Behavioural holds a value, netlist does not | Inferred latch |
| Order-dependent within one time step | Blocking assignment in sequential logic |
| Netlist resolves X where behavioural picked a branch | `casex` don't-care mismatch |
| Behavioural has Z, netlist has a mux | Tristate optimized away |
| Diverges only in the first cycles | Missing reset / relies on `initial` |

**No other learning platform can even detect these, because they all have exactly one simulator.** We would have two, and the disagreement between them *is* the lesson.

### 3.6 Tier 3: the server escape hatch (optional, later)
- **[NEW]** `backend/src/routes/simulate.ts` — `POST /api/verilog/simulate` → `{ sources, top, testbench }` → `{ stdout, vcd, exitCode }`
- Container with `iverilog` + `vvp` + `verilator --lint-only`, no network, hard CPU/memory/wall-clock caps (`vvp` will happily run an infinite `always`)
- GPL boundary stays clean: separate process invoked over HTTP, never linked
- Used for: "check my answer against the industry-standard tool" certification, and Verilator lint as a second opinion

### Verification
- [ ] 100% of the conformance suite matches Icarus byte-for-byte
- [ ] All 106 references produce identical traces under both engines (no false mismatches)
- [ ] A hand-written incomplete-sensitivity-list design is detected and classified correctly
- [ ] Behavioural sim of a 32-cycle sequential problem completes < 100 ms

---

## Phase 4 — The waveform becomes a real analyzer

**Goal:** stop being a picture of a trace; become the tool an engineer would choose over GTKWave for these sizes.
**Size:** ~3 weeks. **Depends on:** Phase 3 for VCD content (but can start on existing traces).

### 4.1 Rendering rebuild
Current SVG rendering will collapse past a few thousand transitions.
- **[NEW]** `components/verilog/waveform/Canvas2DRenderer.ts` — canvas-based, virtualized by visible time window
- **[NEW]** `components/verilog/waveform/WebGLRenderer.ts` — optional, engages past 50k transitions
- Target: 100 000 transitions, 200 signals, 60 fps pan/zoom

### 4.2 Analyzer features
- Two cursors + **delta readout** (the single most-used GTKWave feature)
- Named markers, saved per problem
- Measurements: period, frequency, duty cycle, pulse width, setup/hold between two edges
- Per-signal radix (hex/dec/bin/oct/ASCII/signed), remembered per signal
- Bus expand → individual bits
- Signal search + regex filter, drag-reorder, groups, pinning
- Keyboard: `n`/`p` next/prev edge, `f` fit, `z` zoom-selection, `m` marker, `c` cursor
- **X and Z rendering**: red hatch for X, mid-rail for Z — currently impossible, unlocked by Phase 3
- Glitch highlighting: multiple transitions inside one delta cycle
- Analog/step view for buses (see a counter ramp as a ramp)

### 4.3 VCD interoperability — both directions
- **[NEW]** `engine/verilog/vcd/parse.ts` — import an external VCD, render it. Students can bring dumps from ModelSim/Vivado/Icarus.
- **[NEW]** `engine/verilog/vcd/write.ts` — export any run. Students can take it to GTKWave or Surfer.
- Drag-and-drop a `.vcd` onto the page → it opens.

This makes the tool useful **outside** the judge, which is how a tool becomes the one people keep open.

### 4.4 Diff mode, upgraded
The dashed `want` overlay works. Next:
- "Jump to first divergence" button + keyboard `d`
- Red banding already exists — add a divergence minimap along the timeline
- Three-way mode for Phase 3.5 mismatch reports

### Verification
- [ ] 100k transitions pan/zoom at ≥ 55 fps on a 2019 MacBook Air
- [ ] VCD round trip: export → GTKWave opens it → re-import → identical trace
- [ ] Cursor delta matches hand-computed period on a known clock divider
- [ ] Every feature reachable by keyboard; waveform has an accessible table fallback

---

## Phase 5 — The schematic becomes explorable

**Goal:** connect source ↔ structure ↔ behaviour so the three views teach each other.
**Size:** ~3 weeks. **Depends on:** Phase 1 (source positions), Phase 4 (waveform cursor).

### 5.1 Tri-directional cross-probing ⭐
- Click a wire in the schematic → highlight its source line **and** scroll the waveform to that signal
- Click a signal in the waveform → highlight the driving cells in the schematic
- Put the caret on a source line → pulse the cells it generated

Requires source-location tracking through synthesis: Yosys emits `src` attributes in `write_json`, we currently discard them.
- **[MODIFY]** `synthSchematic.ts` — preserve `src` attributes, map back to editor positions
- **[NEW]** `stores/crossProbeStore.ts` — one selection model shared by three views

### 5.2 Hierarchy
- Drill into instantiated submodules, breadcrumb to walk back out
- Requires dropping `-flatten` and keeping the module tree

### 5.3 Value annotation & time travel ⭐
Scrub the waveform cursor and the schematic **annotates every wire with its value at that instant** — registers show their contents, buses show hex. Step forward and back through cycles and watch data move through the circuit.

This is the single most requested thing in digital-logic education and it does not exist anywhere in a browser.

### 5.4 Cost model — teaching that correct is not enough
- **[NEW]** `engine/verilog/analysis/cost.ts` — cell count, logic depth, estimated critical path (unit-delay model over the netlist), FF count, inferred memory bits
- **[NEW]** `components/verilog/CostReport.tsx` — your design vs the reference, side by side

```
Your design      Reference      Δ
47 cells         31 cells       +52%
depth 6          depth 4        +2 levels
12 flip-flops    12 flip-flops  —
critical path: count[3] → adder → mux → count_next
```

- Critical path highlighted in the schematic
- **Gate-golf leaderboard** per problem: correct *and* smallest. Turns optimization into a game with a real cost function.

### Verification
- [ ] Clicking any wire highlights the correct source line for all 106 references
- [ ] Value annotation matches the waveform at 20 randomly sampled cursor positions
- [ ] Cost report cell counts match `yosys stat` exactly
- [ ] Hierarchy drill-down works on a 3-level design

---

## Phase 6 — Feedback that teaches

**Goal:** the 400 ms after a red verdict is where the product wins or loses.
**Size:** ~3 weeks. **Depends on:** Phase 2 (counterexamples), Phase 3 (mismatch).

### 6.1 Counterexample minimization
A random failing vector is noise. A *minimal* one is a lesson.
- **[NEW]** `engine/verilog/explain/minimize.ts` — delta-debugging: shrink the failing input toward zero/don't-care while it still fails; for sequential, shrink the cycle prefix
- "Fails on `a=8'h80, b=8'h00`" beats "fails on `a=8'hA7, b=8'h3C`" every time — the first one says *sign bit*

### 6.2 Failure classification
- **[NEW]** `engine/verilog/explain/classify.ts` — pattern-match the divergence

| Pattern | Named diagnosis |
|---|---|
| Output correct but one cycle late/early | Pipeline depth off by one |
| Correct when reset is low, wrong at release | Reset polarity or priority |
| Correct except at the wrap value | Modulo/terminal-count boundary |
| Correct except when enable is low | Enable not gating the update |
| Every output bit inverted | Polarity |
| Correct on small values, wrong on large | Width truncation |
| Correct unsigned, wrong on negatives | Signedness |
| Only the MSB wrong | Sign extension / carry-out |

### 6.3 Structural hypothesis
Compare the student's netlist against the reference's structurally — cell histogram, FF count, fan-in cones — and suggest: *"Your design has 0 flip-flops; the reference has 4. This problem needs state."*
- **[NEW]** `engine/verilog/explain/structural.ts`

### 6.4 Progressive hints
Replace the single `hint` field with three tiers, revealed on request, each costing nothing but recorded:
1. **Nudge** — restates the tricky part of the spec
2. **Approach** — the architecture, no code
3. **Skeleton** — structure with the key line blank

- **[MODIFY]** `data/verilog/types.ts` — `hints: [string, string, string]`
- Bank migration: 106 problems × 2 new hints (authoring work, parallelizable)

### 6.5 VoltMonkey integration (optional, server)
The backend already has a VoltMonkey RAG service. Feed it the **deterministic** analysis (minimal counterexample + classification + cost delta) as grounded context so it explains rather than guesses.
- **[MODIFY]** `backend/src/voltmonkey/router.ts` — accept a judge-context payload
- Never the primary explanation. Deterministic first, LLM as an optional elaboration.

### Verification
- [ ] Minimizer reduces 20 known failures to a human-recognizable minimal case
- [ ] Classifier labels ≥ 80% of a corpus of 100 real wrong submissions correctly
- [ ] Zero misclassifications that would actively mislead (precision over recall)

---

## Phase 7 — UI/UX system pass

**Goal:** make it feel like a professional instrument and work for everyone.
**Size:** ~4 weeks. **Runs partly in parallel with 4–6.**

### 7.1 Design tokens
The codebase uses `palette(light)` factory functions and zero `dark:` classes — consistent, but ad hoc.
- **[NEW]** `styles/tokens.css` — CSS custom properties: surface/elevation ladder, text hierarchy, accent per track, semantic (pass/fail/warn/proved/unknown)
- **[MODIFY]** `palette()` factories read from tokens
- Adds a **high-contrast** theme and an **amber/CRT** theme (hardware people love it) for free

### 7.2 Layout
- Dockable, resizable panels; the `useResizable` hook is already the seed
- Saved layouts: *Learn* (problem-heavy), *Debug* (waveform-heavy), *Focus* (editor full-bleed)
- Full-screen waveform and full-screen schematic (`F` key)
- Density toggle: comfortable / compact

### 7.3 Command palette & keyboard-first
- **[NEW]** `components/verilog/CommandPalette.tsx` (`⌘K`)
- Run, reset, next/prev problem, jump to failure, toggle any panel, change radix, switch theme, open editorial, copy VCD
- **[NEW]** `components/verilog/ShortcutSheet.tsx` (`?`)

### 7.4 Accessibility — non-negotiable
- **Never encode meaning in colour alone.** Pass/fail gets an icon; the waveform diff gets dashes as well as hue. ~8% of male engineers are red-green colour deficient, and the current diff view is red/green.
- Waveform gets an ARIA table fallback and a screen-reader description ("clk: 32 transitions, period 2 cycles")
- Full keyboard reachability; visible focus rings; `prefers-reduced-motion` honoured across framer-motion
- WCAG AA contrast in all four themes, verified in CI with `axe-core`
- Editor: respects OS font scaling

### 7.5 Responsive
Editing Verilog on a phone is hostile; pretending otherwise is worse than not supporting it.
- **Desktop (≥1280)**: full three-pane
- **Tablet (768–1279)**: stacked, tabbed results, editor still usable
- **Mobile (<768)**: **Study mode** — read the problem, read the editorial, review your accepted solutions, watch a waveform. Editing is available but explicitly secondary.

### 7.6 First-run experience
- 60-second interactive tour on problem 0, which **pre-warms the 54 MB Yosys engine in the background** so the first submit is instant instead of a 40-second wait — the current biggest first-impression problem
- Empty states, skeleton loaders, honest progress everywhere

### Verification
- [ ] `axe-core` CI pass, zero violations, all four themes
- [ ] Full solve loop completable with keyboard only
- [ ] Colour-blindness simulation (deuteranopia/protanopia) — every state still distinguishable
- [ ] Lighthouse ≥ 95 performance / 100 accessibility
- [ ] Tour completion leaves the engine warm; first submit < 1 s

---

## Phase 8 — Content scale & the authoring pipeline

**Goal:** 106 → 400+ problems without the quality bar moving.
**Size:** ongoing; tooling ~2 weeks.

### 8.1 Authoring tooling
- **[NEW]** `scripts/problem-new.ts` — scaffolds a track file entry, opens it, runs the harness on save
- **[NEW]** `scripts/problem-check.ts` — single-problem validation in ~3 s instead of a full suite run
- **[NEW]** `docs/AUTHORING.md` — the schema, the house voice, the rules (original prose, executable reference, editorial that covers trade-offs and an interview follow-up)

### 8.2 Schema v3
- `hints: [nudge, approach, skeleton]` (Phase 6.4)
- `prerequisites: string[]` — problem IDs, enabling a real skill graph
- `concepts: string[]` — for spaced repetition
- `solutions: { name, code, note }[]` — show two or three *idiomatic* alternatives post-solve, not just one
- `verifyMode: 'prove' | 'bounded' | 'exhaustive' | 'sampled'` — per-problem, chosen by the author
- `estimatedMinutes`, and later `observedSolveRate` from real data

### 8.3 New tracks
| Track | Problems | Notes |
|---|---|---|
| SystemVerilog subset | 25 | `always_ff/comb/latch`, `logic`, `enum`, packed structs, `unique/priority` |
| Testbench & verification | 25 | Unlocked by Phase 3 — write a TB that finds the bug, assertions, coverage |
| Protocols | 30 | UART, SPI, I²C, AXI-Lite, valid/ready, handshake corner cases |
| Clock domain crossing | 15 | Synchronizers, async FIFO, pulse sync, reset sync |
| Arbitration & scheduling | 15 | Round-robin, weighted, credit-based |
| Datapath | 20 | Multipliers (array/Booth/Wallace), dividers, fixed-point, CORDIC |
| Memory systems | 20 | Cache tag/data, write buffer, ECC (SECDED), banking |
| CPU capstone | 20 | ALU → regfile → single-cycle → 5-stage pipeline → hazard unit → forwarding |
| Debug & repair | 20 | **"Here is broken RTL and a failing waveform. Fix it."** — the inverse skill, and the one interviews actually test |
| Optimization | 15 | Same function, hit a gate-count or depth target (Phase 5.4 cost model) |

The **Debug & repair** and **Optimization** tracks are only possible because of the cost model and mismatch detector. They are the tracks no competitor can copy without building Phases 3 and 5 first.

### 8.4 Community contributions
- Problem submission via PR, with the integrity harness as the automated gate
- Author credit rendered on the problem
- Editorial submissions from users who solved it

### Verification
- [ ] Every new problem passes the harness *and* the mutation suite
- [ ] Lint (Phase 1.3) reports zero findings on every reference solution
- [ ] Prerequisite graph is acyclic and every problem is reachable

---

## Phase 9 — Identity, persistence, progression

**Goal:** the work survives the browser cache. Supabase is already a dependency.
**Size:** ~3 weeks.

### 9.1 Sync
- **[NEW]** `backend/src/routes/judge.ts` — submissions, per-problem best, code history
- Anonymous localStorage → account merge on first sign-in, never a data loss event
- Conflict resolution: newest wins per problem, with local history retained

### 9.2 Progression
- Skill radar per track, driven by first-try rate rather than raw completion
- Spaced repetition: a concept failed twice resurfaces in 3 days
- Streak (exists) + weekly goals
- Submission history with a diff against your own prior attempts

### 9.3 Social
- Shareable permalinks to a solution + its waveform
- Gate-golf leaderboards (Phase 5.4)
- Weekly contest: 4 problems, 90 minutes, ranked by correctness → cost → time
- Daily problem

### Verification
- [ ] Anonymous → signed-in merge loses nothing, verified by fixture
- [ ] Offline solves queue and sync on reconnect
- [ ] Permalink renders the exact waveform for someone not signed in

---

## Phase 10 — Performance, reliability, offline

**Goal:** works in a university lab on hotel wifi.
**Size:** ~2 weeks. **Should be pulled earlier if the engine-download complaint rate is high.**

### 10.1 Engine delivery
The 54 MB Yosys WASM refetches per session. This is the worst number in the product.
- Cache in **Cache Storage** keyed by version; check on boot, fetch only on change
- Self-host rather than CDN-hop; Brotli (expect ~15 MB over the wire)
- Prefetch on idle from the landing page, so arriving at the judge is instant
- Investigate `wasm-split` / lazy sections — the SAT solver is only needed on submit

### 10.2 PWA
- Service worker, offline shell, bank bundled, engine cached
- Installable; a genuinely offline Verilog IDE is a category of one

### 10.3 Worker discipline
- Worker pool (2–4), never block the UI thread
- Cancellable runs — currently a stale run can still land (the `runSeq` guard is a patch, not a fix)
- Progressive results: stream case results as they complete rather than waiting for all

### 10.4 Reliability
- **[NEW]** `components/verilog/JudgeErrorBoundary.tsx` — never lose the student's code to a crash
- Autosave to IndexedDB every 2 s with per-problem undo history
- Crash reporting with the code redacted by default

### Verification
- [ ] Second visit: engine loads from cache in < 500 ms
- [ ] Airplane mode: full solve loop works end to end
- [ ] Killing the tab mid-run loses no code
- [ ] Lighthouse PWA: installable

---

## Cross-cutting concerns

### Testing strategy
| Layer | Tool | Gate |
|---|---|---|
| Unit — engine | vitest | every PR |
| Bank integrity | vitest + real Yosys | every PR |
| Bank mutation | vitest | nightly |
| Conformance vs Icarus | vitest + `iverilog` (dev-only) | every PR touching `behavioral/` |
| Language services | vitest fixtures | every PR |
| Visual regression | Playwright + screenshots, all 4 themes | every PR touching `components/verilog/` |
| E2E solve loop | Playwright | every PR |
| Accessibility | axe-core | every PR |
| Performance | `scripts/bench-bank.ts` vs `bench/baseline.json` | every PR, fails on >10% regression |

### Telemetry (privacy-first)
Aggregate only, no code contents without explicit opt-in: per-problem solve rate, first-try rate, time-to-solve distribution, most common failure classification, engine load timings, error rates. This is what calibrates difficulty and finds the problems whose statements are unclear.

### Internationalization
Defer, but do not paint into a corner: no concatenated user-facing strings, all copy through a `t()` seam from Phase 7 onward. Hindi and Mandarin are the obvious first targets given the audience.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ~~`sat`/`miter` absent from the yowasp build~~ | — | — | **Retired.** Probed and confirmed present; proof runs in 391 ms (§2.1) |
| Behavioural interpreter is subtly wrong | **High** | **Severe** — wrong teaching is worse than none | Conformance suite vs real Icarus in CI, byte-exact, before the engine is ever user-facing |
| Phase 3 scope explodes | High | High | Ship in slices: expressions → always/NBA → tasks/functions → generate → tristate. Each slice independently useful. Timebox to 12 weeks, then reassess against server-side Icarus |
| 54 MB engine drives bounce | **Already happening** | High | Pull Phase 10.1 forward if data supports it |
| tree-sitter-verilog grammar gaps | Medium | Medium | Grammar is MIT and forkable; error recovery means gaps degrade rather than crash |
| Bank quality drops while scaling to 400 | Medium | High | Harness + mutation testing + lint-clean references as hard CI gates |
| Formal proof timeouts frustrate users | Medium | Low | 5 s cap, then transparent fallback to sampling with an honest badge |
| Scope creep away from the core loop | High | Medium | §0 scoreboard — if a feature moves no row, it does not ship |

---

## Sequencing

```
Phase 0  Foundations ─┬─────────────────────────────────────────────
                      │
Phase 2  PROOF ───────┼── (independent, do early — best value/effort)
                      │
Phase 1  IDE ─────────┴──┬── Phase 3  BEHAVIOURAL SIM ──┬── Phase 3.5 MISMATCH ⭐
                         │                              │
                         │   Phase 4  WAVEFORM ─────────┤
                         │                              │
                         └── Phase 5  SCHEMATIC ────────┴── Phase 6  EXPLAIN
                                                             │
Phase 7  UI/UX  ── parallel from here ───────────────────────┤
Phase 8  CONTENT ── parallel, continuous ────────────────────┤
Phase 9  IDENTITY ───────────────────────────────────────────┤
Phase 10 PERF ── pull forward if bounce data demands ────────┘
```

### Rough sizing

| Phase | Engineer-weeks | Confidence |
|---|---|---|
| 0 — Foundations | 1 | High |
| 2 — Proof | 2–3 | **High** — spike resolved, §2.1 |
| 1 — IDE | 3–4 | High |
| 3 — Behavioural sim | 8–12 | **Low — the estimate most likely to be wrong** |
| 4 — Waveform | 3 | High |
| 5 — Schematic | 3 | Medium |
| 6 — Explain | 3 | Medium |
| 7 — UI/UX | 4 | High |
| 8 — Content tooling | 2 + ongoing | High |
| 9 — Identity | 3 | High |
| 10 — Perf | 2 | High |
| | **~34–40 weeks** | one engineer, sequential |

Phases 4, 7, 8, 9 and 10 parallelize well. With two engineers the critical path is roughly Phase 0 → 1 → 3 → 3.5 → 6, about 20 weeks.

---

## Recommended first three moves

If only three things happen, these:

1. **Phase 2 — formal proof.** Two to three weeks, and it changes what the product *is*: from "a quiz that checks some inputs" to "a tool that proves your circuit correct". The infrastructure is already loaded in the browser and sitting unused — §2.1 proves an 8-bit adder in 391 ms and catches a 1-in-65 536 bug in 61 ms, using the exact Yosys build already shipping.
2. **Phase 10.1 — engine caching.** Days of work against the single worst number in the product. A 54 MB download on every visit is losing users before they ever type a character.
3. **Phase 1 — the IDE.** Latch inference and width mismatch are the bugs students hit hardest, and today both take a full synthesis round trip to discover. Catching them mid-keystroke, with an explanation attached, is the difference between a judge and a teacher.

Then commit to Phase 3, because the mismatch detector (§3.5) is the feature that makes the sentence *"nothing like this exists"* literally true rather than marketing.

---

*Companion documents: [verilog-judge-toolchain.md](verilog-judge-toolchain.md) — why Yosys and not Icarus/Verilator/GTKWave in the browser, and what that decision costs.*
