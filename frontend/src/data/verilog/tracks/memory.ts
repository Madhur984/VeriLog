/**
 * Track 8 — Memory & Interfaces.
 *
 * RAMs, register files, FIFO pointer logic and the ready/valid handshake. These
 * exercise the `$mem` path through the simulator, and they are where the classic
 * VLSI interview questions concentrate.
 */
import type { VProblemV2 } from '../types';

export const MEMORY_PROBLEMS: VProblemV2[] = [
  {
    id: 'm-sync-ram',
    number: 140,
    title: 'Synchronous Single-Port RAM',
    track: 'memory',
    difficulty: 'Medium',
    tags: ['ram', 'memory', 'synchronous'],
    moduleName: 'ram_sync16x8',
    statement:
      `A 16-word by 8-bit memory with one port shared between reads and writes.\n\n` +
      `On each rising edge: if \`we\` is high, \`din\` is written to the word selected by \`addr\`. Independently, and on the same edge, the word currently at \`addr\` is captured into the output register, so \`dout\` presents it from the following cycle.\n\n` +
      `Because the read is registered from the pre-write contents, writing and reading the same address in one cycle yields the OLD value on \`dout\` — read-before-write behaviour.`,
    context:
      `This is the shape that maps onto a real on-chip SRAM block. The registered read is not a design choice so much as a physical fact: an SRAM's sense amplifiers need the address stable at the clock edge and produce data afterwards, which is why an unregistered "async read" RAM does not exist in most technologies.`,
    hint:
      'Declare `reg [7:0] mem [0:15];` and do both the write and the `dout <= mem[addr];` capture inside one `always @(posedge clk)`.',
    clock: 'clk',
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'we', width: 1, note: 'write enable' },
      { name: 'addr', width: 4, note: 'shared read/write address' },
      { name: 'din', width: 8 },
    ],
    outputs: [{ name: 'dout', width: 8, note: 'registered read data' }],
    constraints: [
      'Module name must be `ram_sync16x8`',
      'Both the write and the read capture happen on `posedge clk`',
      'Read-before-write: a same-cycle read returns the old contents',
      'No reset — memory contents power up undefined in real hardware',
    ],
    examples: [
      { in: { we: 1, addr: 0, din: 5 }, out: { dout: '?' }, note: 'write 5 to word 0' },
      { in: { we: 1, addr: 1, din: 9 }, out: { dout: 5 }, note: 'dout shows word 0 from last cycle' },
      { in: { we: 0, addr: 0, din: 0 }, out: { dout: 9 } },
    ],
    stimulus: { cycles: 48, seed: 5001 },
    starter: `module ram_sync16x8(
  input        clk,
  input        we,
  input  [3:0] addr,
  input  [7:0] din,
  output reg [7:0] dout
);
  reg [7:0] mem [0:15];
  // Write when enabled; always capture the addressed word into dout.

endmodule`,
    solution: `module ram_sync16x8(
  input        clk,
  input        we,
  input  [3:0] addr,
  input  [7:0] din,
  output reg [7:0] dout
);
  reg [7:0] mem [0:15];

  always @(posedge clk) begin
    if (we) mem[addr] <= din;
    // Non-blocking, so this reads the PRE-write contents even when we is high.
    dout <= mem[addr];
  end
endmodule`,
    editorial:
      `The read-before-write behaviour is a direct consequence of non-blocking assignment. Both statements sample the old \`mem\` contents, so \`dout\` gets the pre-write value even when \`we\` is high on the same address. Swap to blocking assignments and you would get write-through instead — and a simulation/synthesis mismatch, because the inferred SRAM would not behave that way.\n\n` +
      `Which behaviour you want is a real design decision. Write-through (also called write-first) is convenient for a pipeline that reads back what it just wrote, but it needs a bypass mux in front of the output register, which costs area and delay. Read-first is what the raw SRAM gives you for free.\n\n` +
      `Note the absence of a reset. You cannot reset an SRAM array — there is no clear pin on the bit cells — so memory contents are undefined at power-up and firmware has to initialize anything it depends on. A design that resets its memory has inferred flip-flops instead of a RAM, which for anything larger than a few dozen words is an enormous waste of area.\n\n` +
      `Yosys infers a \`$mem\` cell from this pattern. Break the pattern — for instance by resetting the array, or reading it from two different clocked blocks — and inference fails, leaving you with 128 individual flip-flops.`,
  },

  {
    id: 'm-regfile',
    number: 141,
    title: 'Register File with Asynchronous Read',
    track: 'memory',
    difficulty: 'Medium',
    tags: ['register-file', 'memory', 'cpu', 'dual-port'],
    moduleName: 'regfile8x8',
    statement:
      `An eight-entry register file with one write port and two independent read ports.\n\n` +
      `Writes are synchronous: when \`we\` is high, \`wdata\` lands in the entry selected by \`waddr\` on the rising edge. Reads are asynchronous — \`rdata_a\` and \`rdata_b\` continuously reflect the entries at \`raddr_a\` and \`raddr_b\` with no clock involved.\n\n` +
      `A read of the address being written in the same cycle returns the OLD value, since the write has not taken effect until the edge completes.`,
    context:
      `A classic RISC pipeline reads two source operands and writes one destination every cycle, which is exactly this port configuration. Combinational reads are what let the decode stage fetch operands and the execute stage use them in the same cycle.`,
    hint:
      'Writes go in an `always @(posedge clk)`. Reads are plain continuous assignments straight off the array.',
    clock: 'clk',
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'we', width: 1 },
      { name: 'waddr', width: 3 },
      { name: 'wdata', width: 8 },
      { name: 'raddr_a', width: 3 },
      { name: 'raddr_b', width: 3 },
    ],
    outputs: [
      { name: 'rdata_a', width: 8, note: 'combinational read port A' },
      { name: 'rdata_b', width: 8, note: 'combinational read port B' },
    ],
    constraints: [
      'Module name must be `regfile8x8`',
      'Writes synchronous, reads asynchronous',
      'Two read ports must work independently and simultaneously',
    ],
    examples: [
      { in: { we: 1, waddr: 2, wdata: 7, raddr_a: 0, raddr_b: 0 }, out: { rdata_a: '?', rdata_b: '?' } },
      { in: { we: 0, waddr: 0, wdata: 0, raddr_a: 2, raddr_b: 2 }, out: { rdata_a: 7, rdata_b: 7 } },
    ],
    stimulus: { cycles: 52, seed: 5002 },
    starter: `module regfile8x8(
  input        clk,
  input        we,
  input  [2:0] waddr,
  input  [7:0] wdata,
  input  [2:0] raddr_a,
  input  [2:0] raddr_b,
  output [7:0] rdata_a,
  output [7:0] rdata_b
);
  reg [7:0] regs [0:7];
  // Synchronous write, combinational reads.

endmodule`,
    solution: `module regfile8x8(
  input        clk,
  input        we,
  input  [2:0] waddr,
  input  [7:0] wdata,
  input  [2:0] raddr_a,
  input  [2:0] raddr_b,
  output [7:0] rdata_a,
  output [7:0] rdata_b
);
  reg [7:0] regs [0:7];

  always @(posedge clk) begin
    if (we) regs[waddr] <= wdata;
  end

  assign rdata_a = regs[raddr_a];
  assign rdata_b = regs[raddr_b];
endmodule`,
    editorial:
      `Asynchronous reads are what distinguish a register file from a RAM. Each read port becomes an 8-to-1 multiplexer across all eight entries, which is why register files stay small: the mux grows with the entry count and with every additional read port, and it sits directly on the critical path.\n\n` +
      `That cost is exactly why a 32-entry RISC-V register file is a hand-crafted structure rather than an inferred array, and why adding a third read port for a fused multiply-add is a genuinely expensive architectural decision.\n\n` +
      `The same-cycle read-during-write returning stale data is the read-after-write hazard that pipeline forwarding exists to solve. The register file does not fix it; the forwarding network in front of the ALU does, by bypassing the writeback value around the register file entirely.\n\n` +
      `Some designs add a write-through bypass here — \`(we && raddr_a == waddr) ? wdata : regs[raddr_a]\` — which removes one forwarding case at the cost of a comparator and a mux per read port.`,
  },

  {
    id: 'm-fifo-ptr',
    number: 142,
    title: 'FIFO Pointer and Flag Logic',
    track: 'memory',
    difficulty: 'Hard',
    tags: ['fifo', 'pointers', 'full-empty', 'wrap-bit'],
    moduleName: 'fifo_ptr8',
    statement:
      `The control half of an eight-deep FIFO — pointers and status flags, without the storage array.\n\n` +
      `Keep a write pointer and a read pointer, each **four** bits wide for an eight-entry FIFO. The extra top bit is a wrap counter, not an address; \`waddr\` and \`raddr\` are the low three bits.\n\n` +
      `A write is accepted when \`wr\` is high and the FIFO is not full, and advances the write pointer. A read is accepted when \`rd\` is high and the FIFO is not empty, and advances the read pointer.\n\n` +
      `\`empty\` is high when the two pointers are completely equal. \`full\` is high when the address bits match but the wrap bits differ. \`count\` reports the number of entries held, from 0 to 8.\n\n` +
      `\`rst\` is synchronous and clears both pointers.`,
    context:
      `Distinguishing full from empty is the whole problem in FIFO design. With pointers only as wide as the address, both conditions look identical — the pointers are equal — and there is no way to tell a full FIFO from an empty one. The extra bit is the standard fix.`,
    hint:
      'Pointers are 4 bits, addresses are `ptr[2:0]`. Empty is `wptr == rptr`; full is `wptr[2:0] == rptr[2:0] && wptr[3] != rptr[3]`. `count` is simply `wptr - rptr`.',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 'wr', width: 1, note: 'write request' },
      { name: 'rd', width: 1, note: 'read request' },
    ],
    outputs: [
      { name: 'waddr', width: 3, note: 'write address into the array' },
      { name: 'raddr', width: 3, note: 'read address into the array' },
      { name: 'full', width: 1 },
      { name: 'empty', width: 1 },
      { name: 'count', width: 4, note: 'entries currently held, 0..8' },
    ],
    constraints: [
      'Module name must be `fifo_ptr8`',
      'Pointers are 4 bits; addresses are the low 3',
      'A write while full is ignored; a read while empty is ignored',
      '`full` and `empty` must be distinguishable',
    ],
    examples: [
      { in: { rst: 1, wr: 0, rd: 0 }, out: { waddr: 0, raddr: 0, full: 0, empty: 1, count: 0 } },
      { in: { rst: 0, wr: 1, rd: 0 }, out: { waddr: 1, raddr: 0, full: 0, empty: 0, count: 1 } },
      { in: { rst: 0, wr: 0, rd: 1 }, out: { waddr: 1, raddr: 1, full: 0, empty: 1, count: 0 } },
    ],
    stimulus: { cycles: 64, seed: 5003 },
    starter: `module fifo_ptr8(
  input        clk,
  input        rst,
  input        wr,
  input        rd,
  output [2:0] waddr,
  output [2:0] raddr,
  output       full,
  output       empty,
  output [3:0] count
);
  reg [3:0] wptr, rptr;   // 4 bits: 3 address + 1 wrap
  // Guard each pointer with its flag before advancing.

endmodule`,
    solution: `module fifo_ptr8(
  input        clk,
  input        rst,
  input        wr,
  input        rd,
  output [2:0] waddr,
  output [2:0] raddr,
  output       full,
  output       empty,
  output [3:0] count
);
  reg [3:0] wptr, rptr;   // 4 bits: 3 address + 1 wrap

  wire do_wr = wr & ~full;
  wire do_rd = rd & ~empty;

  always @(posedge clk) begin
    if (rst) begin
      wptr <= 4'b0;
      rptr <= 4'b0;
    end else begin
      if (do_wr) wptr <= wptr + 1'b1;
      if (do_rd) rptr <= rptr + 1'b1;
    end
  end

  assign waddr = wptr[2:0];
  assign raddr = rptr[2:0];

  // Equal in every bit: the pointers are genuinely together — empty.
  assign empty = (wptr == rptr);
  // Same address but opposite wrap bit: the writer has lapped the reader — full.
  assign full  = (wptr[2:0] == rptr[2:0]) && (wptr[3] != rptr[3]);
  // Modular subtraction gives the occupancy directly, including the full case.
  assign count = wptr - rptr;
endmodule`,
    editorial:
      `The extra pointer bit is the key idea and it is worth being precise about why. With 3-bit pointers on an 8-entry FIFO, "empty" and "full" both present as \`wptr == rptr\` and are indistinguishable. Widening to 4 bits means the pointers only match completely when the writer has advanced the same number of *total* steps as the reader — genuinely empty. When the writer has gone exactly one lap further, the addresses match but the wrap bits differ — full.\n\n` +
      `\`count = wptr - rptr\` works by modular arithmetic and needs no special cases. When full, the difference is 8, which is why \`count\` is 4 bits wide rather than 3 — an 8-deep FIFO has nine possible occupancies, 0 through 8.\n\n` +
      `Guarding with \`do_wr\` and \`do_rd\` rather than raw \`wr\` and \`rd\` is what makes overflow and underflow impossible. Without those guards, a write while full advances the pointer past the reader and the FIFO silently reports empty while holding eight stale entries — a spectacularly confusing failure.\n\n` +
      `The alternative to the wrap bit is a separate occupancy counter incremented and decremented alongside the pointers. It works and is easier to read, but the counter must be updated correctly on simultaneous read and write, and it does not extend to the asynchronous case. For a CDC FIFO the wrap-bit scheme is essentially mandatory, because the pointers get Gray-coded (problems 48, 49 and 86) and a Gray-coded counter has no meaningful arithmetic difference to compute.`,
  },

  {
    id: 'm-skid-buffer',
    number: 143,
    title: 'Ready/Valid Skid Buffer',
    track: 'memory',
    difficulty: 'Hard',
    tags: ['handshake', 'axi', 'backpressure', 'skid-buffer'],
    moduleName: 'skid_buffer8',
    statement:
      `A two-entry buffer that breaks the combinational path through a ready/valid handshake without losing throughput.\n\n` +
      `Upstream drives \`s_valid\` and \`s_data\` and observes \`s_ready\`. Downstream observes \`m_valid\` and \`m_data\` and drives \`m_ready\`. A transfer happens on any cycle where valid and ready are both high.\n\n` +
      `Keep a main register and a spare "skid" register. Accept upstream data whenever the skid register is empty, so \`s_ready\` is high in that case. When downstream stalls while the main register is occupied and more data arrives, park it in the skid register. Once downstream accepts again, drain the skid register into the main one.\n\n` +
      `\`rst\` is synchronous: both registers empty, \`s_ready\` high, \`m_valid\` low.`,
    context:
      `In AXI and AXI-Stream, a naive pipeline register cuts the valid path but leaves \`m_ready\` combinationally driving \`s_ready\`, so backpressure ripples the whole length of the chain in one cycle. A skid buffer registers both directions. The spare entry is what stops the extra cycle of ready latency from costing throughput.`,
    hint:
      'Track two occupancy flags. `s_ready` depends only on whether the skid register is free. On each edge decide, in order: does the skid register drain, does new data go to main, or does it skid?',
    clock: 'clk',
    reset: { name: 'rst', activeLow: false },
    inputs: [
      { name: 'clk', width: 1 },
      { name: 'rst', width: 1 },
      { name: 's_valid', width: 1, note: 'upstream has data' },
      { name: 's_data', width: 8 },
      { name: 'm_ready', width: 1, note: 'downstream can accept' },
    ],
    outputs: [
      { name: 's_ready', width: 1, note: 'we can accept upstream data' },
      { name: 'm_valid', width: 1, note: 'we have data for downstream' },
      { name: 'm_data', width: 8 },
    ],
    constraints: [
      'Module name must be `skid_buffer8`',
      '`s_ready` is high whenever the skid register is empty',
      'No data may be dropped when downstream stalls',
      'Both handshake directions are registered',
    ],
    examples: [
      { in: { s_valid: 1, s_data: '8\'hA5', m_ready: 1 }, out: { s_ready: 1, m_valid: 0, m_data: '8\'h00' } },
      { in: { s_valid: 1, s_data: '8\'h55', m_ready: 0 }, out: { s_ready: 1, m_valid: 1, m_data: '8\'hA5' } },
      { in: { s_valid: 1, s_data: '8\'h77', m_ready: 0 }, out: { s_ready: 0, m_valid: 1, m_data: '8\'hA5' }, note: 'skid full, backpressure' },
    ],
    stimulus: { cycles: 72, seed: 5004 },
    starter: `module skid_buffer8(
  input        clk,
  input        rst,
  input        s_valid,
  input  [7:0] s_data,
  output       s_ready,
  output       m_valid,
  output [7:0] m_data,
  input        m_ready
);
  reg [7:0] main_data, skid_data;
  reg       main_valid, skid_valid;
  // s_ready depends only on the skid register being free.

endmodule`,
    solution: `module skid_buffer8(
  input        clk,
  input        rst,
  input        s_valid,
  input  [7:0] s_data,
  output       s_ready,
  output       m_valid,
  output [7:0] m_data,
  input        m_ready
);
  reg [7:0] main_data, skid_data;
  reg       main_valid, skid_valid;

  // Registered backpressure: we can take data whenever the spare slot is free.
  assign s_ready = ~skid_valid;
  assign m_valid = main_valid;
  assign m_data  = main_data;

  wire accept   = s_valid & s_ready;              // upstream transfer this cycle
  wire released = main_valid & m_ready;           // downstream took the main entry

  always @(posedge clk) begin
    if (rst) begin
      main_valid <= 1'b0;
      skid_valid <= 1'b0;
      main_data  <= 8'b0;
      skid_data  <= 8'b0;
    end else begin
      if (released || !main_valid) begin
        // Main slot is free this cycle: drain the skid first, else take new data.
        if (skid_valid) begin
          main_data  <= skid_data;
          main_valid <= 1'b1;
          skid_valid <= 1'b0;
        end else if (accept) begin
          main_data  <= s_data;
          main_valid <= 1'b1;
        end else begin
          main_valid <= 1'b0;
        end
      end else if (accept) begin
        // Main slot is occupied and stalled — park the new beat in the skid slot.
        skid_data  <= s_data;
        skid_valid <= 1'b1;
      end
    end
  end
endmodule`,
    editorial:
      `The rule that makes this work is that \`s_ready\` depends **only** on \`skid_valid\`, never on \`m_ready\`. That is what registers the backpressure: downstream's ready signal cannot reach upstream combinationally, so a long chain of these does not build a ready path that spans the whole pipeline.\n\n` +
      `Why the spare entry is needed at all: registering \`s_ready\` means upstream sees a stall one cycle late, so one more beat is already in flight when the stall arrives. Without somewhere to put it that beat is lost. The skid register catches exactly that one beat — hence "skid", as in skidding to a stop.\n\n` +
      `The priority in the update is what preserves ordering. When the main slot frees up, the skid entry must drain first; taking the new upstream beat instead would deliver data out of order. That single \`if (skid_valid)\` before \`else if (accept)\` is the entire ordering guarantee.\n\n` +
      `Throughput is the reason to prefer this over a simple two-cycle handshake. A skid buffer sustains one transfer per cycle indefinitely when neither side stalls, whereas a naive registered handshake that deasserts ready while it drains achieves at best 50%.\n\n` +
      `Interview follow-ups worth having ready: valid must never be withdrawn once asserted until the transfer completes (no "valid retraction"), ready is allowed to depend on valid but not the reverse or you deadlock, and this two-entry structure is the minimum that gives full throughput with both directions registered.`,
  },
];
