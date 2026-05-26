# Sequential Logic — Latches, Flip-Flops, Registers, Counters, FSMs, Memory

Reference for B.Tech digital electronics.

## 1. Latches vs Flip-Flops

| Property | Latch | Flip-Flop |
|----------|-------|-----------|
| Trigger  | level (transparent while enabled) | edge (rising or falling) |
| Use      | rarely as standalone state | almost all clocked storage |
| Built from | cross-coupled NAND/NOR | latch + clock gating (master-slave or edge-detector) |

Both store 1 bit. A flip-flop is a latch with clock-edge sensitivity added.

## 2. Latch Types

### 2.1 SR latch (NOR-based, active high)
| S | R | Q (next) |
|---|---|----------|
| 0 | 0 | hold |
| 0 | 1 | 0 (reset) |
| 1 | 0 | 1 (set)   |
| 1 | 1 | invalid (Q and Q' both 0; race on release) |

NAND-based SR latch is active-low; invalid condition is S=R=0.

### 2.2 Gated SR latch
Adds enable: latch follows S/R only when EN=1.

### 2.3 D latch
$Q^+ = D$ while EN=1. Avoids invalid state.

## 3. Flip-Flops

### 3.1 D flip-flop
$$Q^{n+1} = D$$
Single input, no invalid state. Most common storage element in synchronous designs.

### 3.2 JK flip-flop
| J | K | $Q^{n+1}$ |
|---|---|-----------|
| 0 | 0 | $Q^n$ (hold) |
| 0 | 1 | 0 (reset) |
| 1 | 0 | 1 (set) |
| 1 | 1 | $\overline{Q^n}$ (toggle) |

Characteristic equation: $Q^{n+1} = JQ'^n + K'Q^n$.

### 3.3 T flip-flop
$$Q^{n+1} = T \oplus Q^n$$
T=1 toggles, T=0 holds. Built from JK with J=K=T.

### 3.4 SR flip-flop
Edge-triggered SR. Same caveats as latch: SR=11 is invalid.

### 3.5 Conversions
Any FF → any FF using **excitation tables**:

D excitation: $D = Q^{n+1}$.
JK excitation: $J = Q^{n+1}\overline{Q^n}$ (in min form using don't-cares).
T excitation: $T = Q^{n+1} \oplus Q^n$.

### 3.6 Master-slave vs edge-triggered
- **Master-slave** (e.g., older JK): two latches in cascade, sample on level, output on opposite level. Suffered "ones-catching."
- **Edge-triggered**: samples only at a clock edge; modern standard.

## 4. Timing parameters

- **Setup time ($t_{su}$)**: data must be stable BEFORE clock edge.
- **Hold time ($t_h$)**: data must remain stable AFTER clock edge.
- **Clock-to-Q ($t_{cq}$)**: delay from edge to output transition.
- **Propagation delay ($t_{pd}$)** of combinational logic.
- **Max clock frequency**:
$$T_{clk,\min} = t_{cq} + t_{pd,\max} + t_{su}$$
$$f_{max} = 1 / T_{clk,\min}$$

- **Hold-time violation** check: $t_{cq} + t_{pd,\min} \ge t_h$.

## 5. Registers

### 5.1 Types
- **SISO** — serial in, serial out.
- **SIPO** — serial in, parallel out.
- **PISO** — parallel in, serial out.
- **PIPO** — parallel in, parallel out (buffer).
- **Universal shift register** — supports load, shift-left, shift-right, hold via MUX on each FF input.

### 5.2 Shift register applications
- Serial-to-parallel and parallel-to-serial conversion (UART).
- Delay lines.
- Sequence generators when combined with feedback.

## 6. Counters

### 6.1 Asynchronous (ripple) counter
- FFs cascaded with clock of stage $i+1$ driven by Q of stage $i$.
- Simple but: cumulative propagation delay → glitches, low max frequency.
- Mod-N: $n = \lceil \log_2 N \rceil$ flip-flops, with reset logic to clear at count $N$.

### 6.2 Synchronous counter
- All FFs share the same clock.
- Combinational logic from current state to JK/T/D inputs.
- Higher $f_{max}$, no decoding glitches in counter outputs.

### 6.3 Up/down counter
Select line chooses next-state logic for ascending or descending sequence.

### 6.4 Johnson (twisted ring) counter
- $n$ FFs in a ring with the last Q' fed back to first D.
- $2n$ unique states (vs $n$ for plain ring).
- Self-decoding outputs.

### 6.5 Ring counter
- $n$ FFs in a ring; one '1' circulates. Has $n$ states.
- Needs initialization (preset one bit).

### 6.6 Modulus
Modulus = number of unique states. For binary counter with $n$ bits, max modulus $= 2^n$. Truncated counters reset before reaching $2^n$.

## 7. Finite State Machines (FSMs)

### 7.1 Mealy vs Moore
- **Mealy**: outputs depend on **current state AND inputs**. Fewer states, but outputs can glitch with input changes.
- **Moore**: outputs depend on **current state only**. More states often, but glitch-free outputs (synchronous).

### 7.2 Design procedure
1. State diagram from problem.
2. State table (current state, input → next state, output).
3. State assignment (binary, gray, one-hot).
4. State minimization (equivalent states merge; row-matching or partition refinement).
5. Choose flip-flop type; derive excitation equations.
6. Implement combinational logic for next state + outputs.

### 7.3 State encodings
- **Binary**: minimum FFs, more combinational logic.
- **Gray**: minimizes glitches when transitioning between adjacent states.
- **One-hot**: one FF per state, simplest next-state logic, more FFs. Common in FPGA designs.

### 7.4 Equivalence
Two states $S_i$ and $S_j$ are equivalent if for every input:
- they produce the same output, AND
- their next states are equivalent.

Implication chart (k-tables) or partition refinement finds equivalence classes.

## 8. Memory Devices

### 8.1 ROM
- Non-volatile. Mask-ROM (factory), PROM (one-time programmable), EPROM (UV-erasable), EEPROM (electrically erasable), Flash (block-erasable).
- $m \times n$ ROM: $m$ words of $n$ bits, $\log_2 m$ address lines.

### 8.2 RAM
- **SRAM**: 6-T cell (or 4T+2R). Fast, used for cache. Static — holds value while powered.
- **DRAM**: 1-T + capacitor cell. Dense, slower, needs **refresh** (~every 64 ms). Used for main memory.
- **Address**: $\log_2$(# words) lines. **Data**: word width.

### 8.3 Memory hierarchy
Registers → L1 cache → L2 → L3 → main DRAM → SSD/HDD. Faster/smaller toward CPU.

### 8.4 Cache
- **Direct-mapped**: each address maps to one cache line.
- **Set-associative ($n$-way)**: each address can land in any of $n$ lines per set.
- **Fully-associative**: any address in any line. Most flexible, most hardware.
- Replacement: LRU, FIFO, random.
- Write policies: write-through vs write-back.

## 9. Common gotchas

1. **Setup violation** = data arrived too late; **hold violation** = data changed too soon. Hold is a function of min combinational delay, NOT max.
2. **Counter reset bug**: if you use combinational reset on a ripple counter, decoding glitches can briefly clear the counter early.
3. **Mealy output glitches**: any input change in the middle of a clock period can flicker the output. Register outputs if downstream is async.
4. **One-hot FSM** with $n$ states needs $n$ FFs — don't confuse with binary encoding.
5. **DRAM refresh** must be issued or data is lost. Refresh is a row-level operation.
6. **JK with J=K=1** toggles every clock — easy way to build a divide-by-2.
