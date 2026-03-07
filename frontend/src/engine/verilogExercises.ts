/**
 * engine/verilogExercises.ts — Verilog Exercise Bank
 *
 * 15 exercises spanning combinational → sequential → FSM → advanced.
 * Each has: description, starter code, reference output waveform,
 * and hidden testbench hints.
 */

export type ExerciseLevel = 'combinational' | 'sequential' | 'fsm' | 'advanced';

export interface WaveformSample {
    signal: string;
    values: (0 | 1 | 'x' | 'z')[];
    timeSteps: number[];  // in ns
}

export interface VerilogExercise {
    id: string;
    title: string;
    level: ExerciseLevel;
    xpReward: number;
    description: string;
    concept: string;        // key engineering concept
    starterCode: string;
    hints: string[];
    referenceWaveform: WaveformSample[];
    testPoints: string[];   // what the testbench checks
}

export const EXERCISES: VerilogExercise[] = [
    // ─── Combinational ──────────────────────────────────────────────────────
    {
        id: 'ex01',
        title: 'AND Gate',
        level: 'combinational',
        xpReward: 10,
        description: 'Implement a 2-input AND gate. Output Y is HIGH only when both A and B are HIGH.',
        concept: 'Boolean algebra: Y = A · B',
        starterCode: `module and_gate (
    input  wire A,
    input  wire B,
    output wire Y
);
    // Your implementation here
    
endmodule`,
        hints: [
            'Use continuous assignment: assign Y = ...',
            'The & operator performs bitwise AND in Verilog',
        ],
        referenceWaveform: [
            { signal: 'A', values: [0, 0, 1, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'B', values: [0, 1, 0, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'Y', values: [0, 0, 0, 1], timeSteps: [0, 10, 20, 30] },
        ],
        testPoints: ['Y=0 when A=0,B=0', 'Y=0 when A=0,B=1', 'Y=0 when A=1,B=0', 'Y=1 when A=1,B=1'],
    },
    {
        id: 'ex02',
        title: 'Half Adder',
        level: 'combinational',
        xpReward: 15,
        description: 'Implement a half adder: compute the 1-bit sum and carry of two binary inputs A and B.',
        concept: 'Sum = A XOR B, Carry = A AND B',
        starterCode: `module half_adder (
    input  wire A,
    input  wire B,
    output wire Sum,
    output wire Carry
);
    // Sum = A XOR B
    // Carry = A AND B
    
endmodule`,
        hints: [
            'Use ^ for XOR and & for AND',
            'assign Sum = A ^ B;',
        ],
        referenceWaveform: [
            { signal: 'A', values: [0, 0, 1, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'B', values: [0, 1, 0, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'Sum', values: [0, 1, 1, 0], timeSteps: [0, 10, 20, 30] },
            { signal: 'Carry', values: [0, 0, 0, 1], timeSteps: [0, 10, 20, 30] },
        ],
        testPoints: ['Sum=0,Carry=0 when A=0,B=0', 'Sum=1,Carry=0 when A=1,B=0', 'Sum=0,Carry=1 when A=1,B=1'],
    },
    {
        id: 'ex03',
        title: 'Full Adder',
        level: 'combinational',
        xpReward: 20,
        description: 'Implement a full adder: add three 1-bit inputs A, B, and Cin. Produce Sum and Cout.',
        concept: 'Can be built from two half adders',
        starterCode: `module full_adder (
    input  wire A,
    input  wire B,
    input  wire Cin,
    output wire Sum,
    output wire Cout
);
    // Hint: Use two half adders or write the boolean expressions directly
    
endmodule`,
        hints: [
            'Sum = A ^ B ^ Cin',
            'Cout = (A & B) | (B & Cin) | (A & Cin)',
        ],
        referenceWaveform: [
            { signal: 'A', values: [0, 1, 1, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'B', values: [0, 0, 1, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'Cin', values: [0, 1, 0, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'Sum', values: [0, 0, 0, 1], timeSteps: [0, 10, 20, 30] },
            { signal: 'Cout', values: [0, 1, 1, 1], timeSteps: [0, 10, 20, 30] },
        ],
        testPoints: ['Sum=0,Cout=0 when A=0,B=0,Cin=0', 'Sum=1,Cout=1 when A=1,B=1,Cin=1'],
    },
    {
        id: 'ex04',
        title: '4-to-1 Multiplexer',
        level: 'combinational',
        xpReward: 20,
        description: 'Implement a 4-to-1 mux. Two select lines S[1:0] choose one of four data inputs to route to output Y.',
        concept: 'Mux: Y = D[S]',
        starterCode: `module mux4to1 (
    input  wire [3:0] D,
    input  wire [1:0] S,
    output reg  Y
);
    always @(*) begin
        case (S)
            // Fill in the case statement
        endcase
    end
endmodule`,
        hints: ['Use a case statement on S', '2\'b00: Y = D[0];'],
        referenceWaveform: [
            { signal: 'S', values: [0, 1, 0, 1], timeSteps: [0, 10, 20, 30] },
        ],
        testPoints: ['Y=D[0] when S=00', 'Y=D[1] when S=01', 'Y=D[2] when S=10', 'Y=D[3] when S=11'],
    },
    {
        id: 'ex05',
        title: '3-to-8 Decoder',
        level: 'combinational',
        xpReward: 20,
        description: 'Implement a 3-to-8 binary decoder. Exactly one of the 8 output lines Y[7:0] is HIGH, selected by A[2:0].',
        concept: 'Y = 1 << A',
        starterCode: `module decoder3to8 (
    input  wire [2:0] A,
    output reg  [7:0] Y
);
    always @(*) begin
        Y = 8'b0;
        Y[A] = 1'b1;
    end
endmodule`,
        hints: ['Y = 8\'b0 followed by Y[A] = 1 is a clean one-liner', 'Or use 1 << A'],
        referenceWaveform: [
            { signal: 'A', values: [0, 1, 0, 1, 0, 1, 0, 1], timeSteps: [0, 5, 10, 15, 20, 25, 30, 35] },
        ],
        testPoints: ['Y=00000001 when A=0', 'Y=10000000 when A=7'],
    },
    // ─── Sequential ──────────────────────────────────────────────────────────
    {
        id: 'ex06',
        title: 'D Flip-Flop',
        level: 'sequential',
        xpReward: 25,
        description: 'Implement a rising-edge-triggered D flip-flop with synchronous reset.',
        concept: 'Q captures D on posedge clk; Q=0 on reset',
        starterCode: `module dff (
    input  wire clk,
    input  wire rst,
    input  wire D,
    output reg  Q
);
    always @(posedge clk) begin
        if (rst)
            Q <= 1'b0;
        else
            Q <= D;
    end
endmodule`,
        hints: ['Use non-blocking assignment (<=) inside always @(posedge clk)', 'rst is synchronous — it only takes effect on the clock edge'],
        referenceWaveform: [
            { signal: 'clk', values: [0, 1, 0, 1, 0, 1], timeSteps: [0, 5, 10, 15, 20, 25] },
            { signal: 'D', values: [1, 1, 0, 1, 1, 1], timeSteps: [0, 5, 10, 15, 20, 25] },
            { signal: 'Q', values: [0, 1, 1, 0, 0, 1], timeSteps: [0, 5, 10, 15, 20, 25] },
        ],
        testPoints: ['Q follows D with 1-cycle delay', 'Q=0 on rst=1 regardless of D'],
    },
    {
        id: 'ex07',
        title: '4-bit Up Counter',
        level: 'sequential',
        xpReward: 30,
        description: 'Implement a 4-bit synchronous up counter. Count from 0 to 15, then wrap to 0. Reset sets count to 0.',
        concept: 'count increments on each posedge clk',
        starterCode: `module counter4 (
    input  wire clk,
    input  wire rst,
    output reg  [3:0] count
);
    always @(posedge clk) begin
        if (rst)
            count <= 4'b0;
        else
            count <= count + 1;
    end
endmodule`,
        hints: ['4-bit auto-wraps at 15→0 naturally in Verilog', 'Non-blocking <='],
        referenceWaveform: [
            { signal: 'count', values: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], timeSteps: Array.from({ length: 17 }, (_, i) => i * 5) },
        ],
        testPoints: ['count=0 after rst=1', 'count increments each cycle', 'count wraps 15→0'],
    },
    {
        id: 'ex08',
        title: '4-bit Shift Register',
        level: 'sequential',
        xpReward: 30,
        description: 'Implement a 4-bit serial-in, parallel-out shift register. Data shifts left on each posedge clk, serial input enters at LSB.',
        concept: 'reg shifts left, new bit enters at position 0',
        starterCode: `module shift_reg (
    input  wire clk,
    input  wire rst,
    input  wire serial_in,
    output reg  [3:0] Q
);
    always @(posedge clk) begin
        if (rst)
            Q <= 4'b0;
        else
            Q <= {Q[2:0], serial_in};
    end
endmodule`,
        hints: ['Concatenation {Q[2:0], serial_in} shifts left and inserts serial_in at bit 0', '{}  is the concatenation operator in Verilog'],
        referenceWaveform: [],
        testPoints: ['Q shifts left each cycle', 'Q=0 on rst', 'serial_in enters at Q[0]'],
    },
    // ─── FSM ─────────────────────────────────────────────────────────────────
    {
        id: 'ex09',
        title: 'Traffic Light FSM',
        level: 'fsm',
        xpReward: 40,
        description: 'Implement a Moore FSM for a 3-state traffic light: RED → GREEN → YELLOW → RED. Output is the 3-bit {R,G,Y} signal.',
        concept: 'Moore FSM: output depends only on state, not input',
        starterCode: `module traffic_light (
    input  wire clk,
    input  wire rst,
    output reg  [2:0] light  // {R, G, Y}
);
    localparam RED    = 2'b00;
    localparam GREEN  = 2'b01;
    localparam YELLOW = 2'b10;
    
    reg [1:0] state, next_state;
    
    // State register
    always @(posedge clk or posedge rst) begin
        if (rst) state <= RED;
        else state <= next_state;
    end
    
    // Next-state logic
    always @(*) begin
        case (state)
            RED:    next_state = GREEN;
            GREEN:  next_state = YELLOW;
            YELLOW: next_state = RED;
            default: next_state = RED;
        endcase
    end
    
    // Output logic (Moore)
    always @(*) begin
        case (state)
            RED:    light = 3'b100;
            GREEN:  light = 3'b010;
            YELLOW: light = 3'b001;
            default: light = 3'b100;
        endcase
    end
endmodule`,
        hints: ['Separate always blocks: state register, next-state, output', 'Moore = output from state only'],
        referenceWaveform: [
            { signal: 'light', values: [1, 0, 1, 1, 0, 1], timeSteps: [0, 5, 10, 15, 20, 25] },
        ],
        testPoints: ['Correct 3-state cycle', 'light=100 in RED', 'Resets to RED'],
    },
    {
        id: 'ex10',
        title: 'Sequence Detector (1011)',
        level: 'fsm',
        xpReward: 45,
        description: 'Detect the 4-bit sequence 1011 in a serial bit stream. Output detected=1 for one cycle when the sequence is found. Overlapping sequences count.',
        concept: 'Mealy FSM or Moore FSM with overlap detection',
        starterCode: `module seq_detector (
    input  wire clk,
    input  wire rst,
    input  wire bit_in,
    output reg  detected
);
    // States for detecting 1-0-1-1
    localparam S0 = 3'd0;  // initial
    localparam S1 = 3'd1;  // got 1
    localparam S2 = 3'd2;  // got 10
    localparam S3 = 3'd3;  // got 101
    localparam S4 = 3'd4;  // got 1011 (accept)
    
    reg [2:0] state;
    
    // Your state machine here
    
endmodule`,
        hints: ['Draw the state diagram first', 'On "1" from S3, go to accept AND also stay as if second 1 of a new 101X', 'detected goes HIGH when state reaches S4'],
        referenceWaveform: [],
        testPoints: ['detected=1 after sequence 1011', 'No detection for 1010', 'Overlapping detection works'],
    },
    // ─── Advanced ────────────────────────────────────────────────────────────
    {
        id: 'ex11',
        title: '4-bit ALU',
        level: 'advanced',
        xpReward: 60,
        description: 'Implement a 4-bit ALU supporting: ADD, SUB, AND, OR operations selected by 2-bit opcode.',
        concept: 'ALU: the core of every processor',
        starterCode: `module alu4 (
    input  wire [3:0] A,
    input  wire [3:0] B,
    input  wire [1:0] op,    // 00=ADD, 01=SUB, 10=AND, 11=OR
    output reg  [3:0] result,
    output reg  zero,
    output reg  carry
);
    always @(*) begin
        carry = 1'b0;
        case (op)
            2'b00: {carry, result} = A + B;
            2'b01: result = A - B;
            2'b10: result = A & B;
            2'b11: result = A | B;
        endcase
        zero = (result == 4'b0);
    end
endmodule`,
        hints: ['{carry, result} = A + B captures the carry in the MSB', 'zero flag: output is 0b0000'],
        referenceWaveform: [],
        testPoints: ['ADD: 4+3=7', 'SUB: 7-4=3', 'AND: 1111&1010=1010', 'OR: 0101|1010=1111', 'zero=1 when result=0'],
    },
    {
        id: 'ex12',
        title: 'UART Transmitter',
        level: 'advanced',
        xpReward: 80,
        description: 'Implement a UART transmitter: 8N1 format (8 data bits, no parity, 1 stop bit). Send a byte on "send" pulse, output on tx line.',
        concept: 'Serial protocol: start + 8 data bits + stop bit',
        starterCode: `module uart_tx (
    input  wire clk,         // assume baud clock (1 cycle = 1 bit period)
    input  wire rst,
    input  wire send,        // pulse to start transmission
    input  wire [7:0] data,  // byte to send
    output reg  tx,          // serial output
    output reg  busy         // HIGH during transmission
);
    // States: IDLE, START, DATA, STOP
    localparam IDLE  = 2'd0;
    localparam START = 2'd1;
    localparam DATA  = 2'd2;
    localparam STOP  = 2'd3;
    
    reg [1:0] state;
    reg [2:0] bit_cnt;
    reg [7:0] shift_reg;
    
    // Your implementation here
    
endmodule`,
        hints: [
            'In START state: tx=0 (start bit)',
            'In DATA state: tx=shift_reg[0], shift right each cycle',
            'In STOP state: tx=1 (stop bit)',
        ],
        referenceWaveform: [],
        testPoints: ['tx=1 when IDLE', 'tx=0 for start bit', 'LSB first data transmission', 'tx=1 for stop bit'],
    },
];

export function getExercise(id: string): VerilogExercise | undefined {
    return EXERCISES.find(e => e.id === id);
}

export function getExercisesByLevel(level: ExerciseLevel): VerilogExercise[] {
    return EXERCISES.filter(e => e.level === level);
}
