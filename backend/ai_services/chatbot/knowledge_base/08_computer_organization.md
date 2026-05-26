# Computer Organization, Microprocessors, Memory Architecture

Reference for B.Tech computer-org and microprocessor coursework.

## 1. Number representation in computers

### 1.1 Integer
- Unsigned $n$-bit: $[0, 2^n - 1]$.
- 2's complement $n$-bit signed: $[-2^{n-1}, 2^{n-1} - 1]$.
- Sign-extend when widening signed; zero-extend for unsigned.

### 1.2 Floating point (IEEE 754)
- **Single precision (32-bit)**: 1 sign + 8 exponent (bias 127) + 23 mantissa.
- **Double precision (64-bit)**: 1 + 11 (bias 1023) + 52.
- Value $= (-1)^S \times 1.M \times 2^{E - bias}$ (normalized).
- Special: $E=0$ → denormal or zero, $E=\text{all 1s}$ → infinity / NaN.

## 2. CPU Components

### 2.1 Datapath
- **ALU**: arithmetic + logical operations.
- **Register file**: small fast storage for operands and intermediates.
- **PC (Program Counter)**: address of next instruction.
- **IR (Instruction Register)**: current instruction being decoded.
- **MAR / MDR**: memory address / data registers (interface to memory).
- **Status flags**: zero, carry, sign, overflow, parity.

### 2.2 Control unit
- **Hardwired**: combinational logic produces control signals. Fast, less flexible.
- **Microprogrammed**: each instruction = sequence of micro-ops stored in control memory. Easier to modify, slower.

## 3. Instruction Set Architecture (ISA)

### 3.1 Classifications
- **RISC** (e.g. RISC-V, ARM, MIPS): few instructions, fixed-length encoding, load-store architecture, large register file. Easier to pipeline.
- **CISC** (e.g. x86): variable-length, many addressing modes, memory operands. Microcoded inside.

### 3.2 Instruction formats
- Opcode + operands. Operand can be: register, immediate, memory.
- 0/1/2/3-operand machines.
- Fixed (RISC, 32 bits typical) or variable (CISC) length.

### 3.3 Addressing modes
| Mode | Effective address |
|------|-------------------|
| Immediate | operand IS the value |
| Register | operand in register |
| Direct | EA = address in instruction |
| Indirect | EA = contents of register/memory |
| Register indirect | EA = contents of register |
| Indexed | EA = base + index |
| PC-relative | EA = PC + offset |
| Base-register | EA = base register + displacement |

## 4. Instruction Cycle

### 4.1 Phases (basic)
1. **Fetch**: $\text{IR} \leftarrow M[\text{PC}]$; $\text{PC} \leftarrow \text{PC} + 4$ (or instruction size).
2. **Decode**: parse opcode, read register file.
3. **Execute**: ALU op or address compute.
4. **Memory access** (if load/store).
5. **Write-back**: store result in destination register.

### 4.2 Single-cycle vs multi-cycle
- Single-cycle: every instruction completes in 1 long clock. Clock period limited by slowest instruction (typically load).
- Multi-cycle: shorter clock; instructions take 3–5 cycles depending on type.

## 5. Pipelining

### 5.1 Classic 5-stage RISC pipeline
IF (Instruction Fetch) → ID (Decode/Register read) → EX (Execute/Address) → MEM (Memory access) → WB (Write-back).

### 5.2 Speedup
- Ideal speedup = number of stages $k$.
- With $n$ instructions, $k$ stages: time = $(k + n - 1)$ cycles vs $nk$ for non-pipelined. Speedup $= \frac{nk}{k+n-1} \to k$ as $n \to \infty$.

### 5.3 Hazards
- **Structural**: hardware resource conflict (e.g. single memory port for IF + MEM). Resolved by duplicating units or stalling.
- **Data**: instruction depends on result of prior in-flight instruction.
  - RAW (Read-After-Write): true dependency. Use **forwarding** to bypass register file, or stall.
  - WAR, WAW: matter only in out-of-order execution.
- **Control**: branches alter PC after IF has started fetching the next instruction.
  - Stall (bubble), predict-not-taken, delayed branch, branch prediction.

### 5.4 Branch prediction
- **Static**: always not-taken, or backwards-taken-forwards-not-taken.
- **Dynamic 2-bit counter**: per-branch saturating counter (strongly/weakly taken/not-taken).
- **Correlated** (gshare, gselect): hash of history.

## 6. Memory Hierarchy

### 6.1 Hierarchy (typical)
| Level | Capacity | Latency | Tech |
|-------|----------|---------|------|
| Registers | ~1 KB | 1 cycle | SRAM in CPU |
| L1 cache | 32–64 KB | 2–4 cycles | SRAM |
| L2 cache | 256 KB – 1 MB | 10–20 cycles | SRAM |
| L3 cache | 4–64 MB | 30–60 cycles | SRAM (shared) |
| Main memory | GB | 100–300 cycles | DRAM |
| SSD | TB | 100k cycles | NAND flash |
| HDD | TB+ | 10M cycles | magnetic |

### 6.2 Locality
- **Temporal**: recently accessed data likely to be accessed again.
- **Spatial**: data near a recent access likely to be accessed.
- Cache lines exploit spatial; LRU policies exploit temporal.

### 6.3 Cache organization
- **Direct-mapped**: line index = address mod (cache size). Conflict-prone.
- **Fully associative**: any line goes anywhere. Best hit rate, hardware-heavy.
- **N-way set-associative**: each set holds N lines. Sweet spot (typically 4–16 way).
- **Address split**: [ tag | index | block-offset ].
- **Write policies**:
  - Write-through: every write updates main memory. Simple, slow.
  - Write-back: dirty bit; flush on eviction. Fast, requires coherence.
- **Replacement**: LRU, pseudo-LRU, FIFO, random.

### 6.4 AMAT (Average Memory Access Time)
$$\text{AMAT} = \text{Hit time} + \text{Miss rate} \times \text{Miss penalty}$$
Multi-level: AMAT$_{L1}$ = $t_{L1}$ + miss$_{L1}$ × AMAT$_{L2}$, etc.

## 7. Virtual Memory

### 7.1 Concept
- Each process gets its own virtual address space (e.g., 48 bits on x86-64).
- **Page table** maps virtual pages to physical frames.
- Pages typically 4 KB (or 2 MB / 1 GB "huge pages").

### 7.2 TLB
- Translation Lookaside Buffer: small cache of recent virtual-to-physical translations.
- TLB miss → page table walk (HW or OS).

### 7.3 Page fault
- Page not in physical memory → OS loads from disk, evicts another page.
- Demand paging: pages loaded only when accessed.

## 8. I/O

### 8.1 Techniques
- **Programmed I/O**: CPU polls device status — wasteful.
- **Interrupt-driven**: device asserts IRQ when ready.
- **DMA**: dedicated controller transfers data without CPU; CPU notified on completion.

### 8.2 Buses
- Address, data, control lines.
- Synchronous (clocked) vs asynchronous (handshake).
- Examples: PCIe (modern serial), older parallel buses (ISA, PCI), USB.

## 9. 8085 / 8086 Highlights (common in syllabi)

### 9.1 Intel 8085 (8-bit)
- 8-bit data bus, 16-bit address bus (64 KB addressable).
- Registers: A (accumulator), B, C, D, E, H, L; pairs BC, DE, HL.
- Flags: S, Z, AC, P, CY.
- ~74 instructions.

### 9.2 Intel 8086 (16-bit)
- 16-bit data bus, 20-bit address bus (1 MB addressable via segmentation).
- Segment registers: CS, DS, SS, ES; physical address = segment × 16 + offset.
- General registers: AX, BX, CX, DX (16-bit, splittable into AH/AL etc.).
- Pipelined: BIU (Bus Interface Unit) prefetches instructions while EU (Execution Unit) executes.
- Real mode vs protected mode (later 80286+).

## 10. Common pitfalls

1. **2's complement edge cases**: $-2^{n-1}$ has no positive counterpart (its negation overflows).
2. **Pipeline speedup ≠ number of stages** in practice — hazards and clock-period overhead cap it.
3. **Cache miss penalty** matters more than miss rate for AMAT — a 5% miss rate hitting DRAM is much worse than 10% hitting L2.
4. **TLB miss** is much faster than a page fault — don't confuse them. TLB miss = HW/OS page-table walk; page fault = disk access.
5. **Write-through vs write-back**: write-through is simpler but bottlenecks the bus; write-back is faster but needs cache coherence in multi-core systems.
6. **Endianness**: x86 is little-endian (LSB at lowest address); some networks/ARMs default to big-endian. Affects byte-level memory dumps and network protocols.
7. **Segmented memory in 8086**: 1 MB total, NOT 64 KB. The 16-bit registers cover only 64 KB each — segmentation extends reach.
