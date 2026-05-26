# Verilog HDL — Syntax, Semantics, Design Patterns

Reference for B.Tech HDL coursework and FPGA design. Focus on synthesizable subset.

## 1. Module structure

```verilog
module mux2to1 (
    input  wire        sel,
    input  wire [7:0]  a,
    input  wire [7:0]  b,
    output wire [7:0]  y
);
    assign y = sel ? b : a;
endmodule
```

Port directions: `input`, `output`, `inout`. Types: `wire` (default) for assignments, `reg` for procedural assigns inside `always`.

## 2. Data types

- **wire**: combinational net, driven by `assign` or output of a gate/module.
- **reg**: storage in procedural code. NOT necessarily a flip-flop — just means "assigned in always block."
- **integer**: 32-bit signed, used in for-loops.
- **parameter**: compile-time constant. `localparam` is scope-limited.
- **Vectors**: `wire [7:0] data;` is 8-bit, `[7:0]` = MSB-first.

### 2.1 Number literals
- `8'b1010_0101` — 8-bit binary, `_` is a separator.
- `8'hA5` — hex.
- `4'd9` — decimal.
- `8'bz` — high impedance (tri-state). `8'bx` — unknown.
- Sized vs unsized: `1'b0` vs `0` (defaults to 32-bit).

## 3. Operators

| Category | Operators |
|----------|-----------|
| Arithmetic | `+ - * / %` |
| Bitwise | `~ & \| ^ ^~` |
| Reduction | `&a` (AND all bits), `\|a`, `^a` |
| Logical | `! && \|\|` |
| Relational | `< <= > >=` |
| Equality | `== !=` (4-state, x is unknown), `=== !==` (4-state strict) |
| Shift | `<< >> <<< >>>` (arithmetic shift on signed) |
| Concat | `{a, b}` |
| Replication | `{4{1'b1}}` = `4'b1111` |
| Conditional | `cond ? t : f` |

## 4. Continuous assignment

```verilog
assign sum = a + b;
assign {cout, sum} = a + b + cin;
```
- Drives a `wire`. Evaluates whenever any RHS signal changes.
- Models combinational logic.

## 5. Procedural blocks

### 5.1 `always @*` (combinational)
```verilog
always @* begin
    case (sel)
        2'b00: y = a;
        2'b01: y = b;
        2'b10: y = c;
        default: y = 1'b0;   // mandatory to avoid inferred latches
    endcase
end
```
Rules:
- Use `=` (blocking) inside combinational always.
- Assign EVERY output in EVERY branch, or use a default assignment at the top.
- Missing assignments → synthesized latch (bug).

### 5.2 `always @(posedge clk)` (sequential)
```verilog
always @(posedge clk or negedge rst_n) begin
    if (!rst_n) q <= 8'd0;
    else        q <= d;
end
```
Rules:
- Use `<=` (non-blocking) inside sequential always.
- Reset must be in the sensitivity list for async reset; omit for sync reset.

### 5.3 Blocking vs non-blocking
- **Blocking (`=`)**: executes in order, RHS evaluated then LHS updated immediately. Use for combinational.
- **Non-blocking (`<=`)**: RHS evaluated first for all statements, THEN all LHS update at the end of the time step. Use for sequential — models how real flip-flops latch simultaneously.

Mixing them in the same always block is a classic bug source.

## 6. Common patterns

### 6.1 D flip-flop with async reset
```verilog
always @(posedge clk or negedge rst_n)
    if (!rst_n) q <= 1'b0;
    else        q <= d;
```

### 6.2 Counter
```verilog
always @(posedge clk or negedge rst_n) begin
    if (!rst_n)         count <= 4'd0;
    else if (count == 4'd9) count <= 4'd0;
    else                count <= count + 1'b1;
end
```

### 6.3 N-bit ripple-carry adder
```verilog
module rca #(parameter N = 4) (
    input  wire [N-1:0] a, b,
    input  wire         cin,
    output wire [N-1:0] sum,
    output wire         cout
);
    assign {cout, sum} = a + b + cin;
endmodule
```

### 6.4 4-to-1 MUX
```verilog
assign y = (sel == 2'b00) ? a :
           (sel == 2'b01) ? b :
           (sel == 2'b10) ? c : d;
```

### 6.5 Finite state machine (two-process style)
```verilog
typedef enum logic [1:0] { IDLE, RUN, DONE } state_t;   // SystemVerilog
state_t state, next;

always @(posedge clk or negedge rst_n)
    if (!rst_n) state <= IDLE;
    else        state <= next;

always @* begin
    next = state;
    case (state)
        IDLE: if (start) next = RUN;
        RUN:  if (done)  next = DONE;
        DONE:            next = IDLE;
    endcase
end
```

In pure Verilog (not SystemVerilog), use `parameter` constants and a `reg [1:0] state`.

## 7. Testbench fundamentals

```verilog
module tb;
    reg  clk = 0;
    reg  rst_n = 0;
    reg  [7:0] d;
    wire [7:0] q;

    dff dut (.clk(clk), .rst_n(rst_n), .d(d), .q(q));

    always #5 clk = ~clk;     // 100 MHz

    initial begin
        $dumpfile("wave.vcd"); $dumpvars(0, tb);
        d = 8'h00; rst_n = 0;
        #20 rst_n = 1;
        #10 d = 8'hA5;
        #100 $finish;
    end
endmodule
```

Key system tasks: `$display`, `$monitor`, `$dumpvars`, `$finish`, `$time`.

## 8. Synthesizable vs simulation-only

Synthesizable subset:
- `assign`, `always @*`, `always @(posedge clk)` with conventional patterns.
- Module instances, parameters.
- `case`, `if`, `for` (loops must unroll at elab time).
- Simple arithmetic.

NOT synthesizable (sim-only):
- `initial` blocks (mostly).
- `#delay` statements.
- `wait`, `fork-join`.
- Real numbers.
- File I/O.
- `force`, `release`.

## 9. Common pitfalls

1. **Inferred latch** — `always @*` with an output that isn't assigned in every path. Always use `default` in `case`, and assign defaults at the top.
2. **Wrong assignment kind** — using `<=` in combinational logic or `=` in sequential logic leads to subtle race conditions.
3. **Multi-driver conflict** — two `assign`s driving the same wire. Synthesizer either errors or x's the output.
4. **Sensitivity list mistakes** — pre-2001 you had to list every RHS signal. Use `always @*` to avoid this.
5. **Numeric width truncation** — `wire [3:0] sum = a + b;` truncates a 5-bit result. Use `{cout, sum} = a + b;` to capture carry.
6. **Reset polarity inconsistency** — pick one (active-low `_n` suffix is convention) and stick to it.
7. **Don't compare with x** — `data == 1'bx` always evaluates to x, not true. Use `===` only in sim.
8. **Implicit nets** — typo in a signal name creates a 1-bit wire silently. Always set `default_nettype none` at the top of files.

## 10. Quick VHDL contrast (in case asked)

| Concept | Verilog | VHDL |
|---------|---------|------|
| Storage | `reg` | `signal` (in arch), `variable` (in process) |
| Concurrent assign | `assign x = ...;` | `x <= ...;` |
| Process | `always @*` | `process(...)` |
| Type system | weak | strong, strict |
| Default | most permissive | most strict |

Verilog is more common in industry/courses for FPGA/ASIC entry-level work.
