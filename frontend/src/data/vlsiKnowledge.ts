/* ─── VLSI Knowledge Base ─── */
export interface KnowledgeEntry {
    question: string;
    keywords: string[];
    answer: string;
    category: 'basics' | 'gates' | 'verilog' | 'timing' | 'interview' | 'circuits';
}

export const VLSI_KNOWLEDGE: KnowledgeEntry[] = [
    // ── Boolean Algebra ──
    {
        question: "What is Boolean algebra?",
        keywords: ['boolean', 'algebra', 'logic', 'true', 'false'],
        answer: "Boolean algebra is a branch of mathematics that deals with binary variables (0 and 1) and logical operations (AND, OR, NOT). It forms the basis of all digital circuits. Key laws include De Morgan's theorem: (A·B)' = A'+B' and (A+B)' = A'·B'.",
        category: 'basics',
    },
    {
        question: "What are De Morgan's theorems?",
        keywords: ['demorgan', 'de morgan', 'theorem', 'complement'],
        answer: "De Morgan's Theorems: 1) (A·B)' = A' + B' — the complement of AND equals OR of complements. 2) (A+B)' = A'·B' — the complement of OR equals AND of complements. These are fundamental for simplifying digital logic expressions and converting between NAND/NOR forms.",
        category: 'basics',
    },

    // ── Logic Gates ──
    {
        question: "What is an AND gate?",
        keywords: ['and', 'gate', 'conjunction'],
        answer: "An AND gate outputs HIGH (1) only when ALL inputs are HIGH. Truth table: 0·0=0, 0·1=0, 1·0=0, 1·1=1. Boolean expression: Y = A·B. IC number: 7408 (quad 2-input AND). Think of it as series switches — both must be ON for current to flow.",
        category: 'gates',
    },
    {
        question: "What is an OR gate?",
        keywords: ['or', 'gate', 'disjunction'],
        answer: "An OR gate outputs HIGH (1) when ANY input is HIGH. Truth table: 0+0=0, 0+1=1, 1+0=1, 1+1=1. Boolean expression: Y = A+B. IC number: 7432. Think of it as parallel switches — either one ON lets current flow.",
        category: 'gates',
    },
    {
        question: "What is a NAND gate?",
        keywords: ['nand', 'universal', 'gate'],
        answer: "NAND (Not-AND) is a universal gate — you can build ANY other gate using only NAND gates! Output is LOW only when all inputs are HIGH. Y = (A·B)'. IC: 7400. NAND gates are the building blocks of modern flash memory (hence 'NAND flash').",
        category: 'gates',
    },
    {
        question: "What is a NOR gate?",
        keywords: ['nor', 'universal', 'gate'],
        answer: "NOR (Not-OR) is also a universal gate. Output is HIGH only when ALL inputs are LOW. Y = (A+B)'. IC: 7402. Fun fact: the Apollo Guidance Computer was built entirely with NOR gates!",
        category: 'gates',
    },
    {
        question: "What is an XOR gate?",
        keywords: ['xor', 'exclusive', 'gate', 'parity'],
        answer: "XOR (Exclusive OR) outputs 1 when inputs are DIFFERENT. Y = A⊕B = A'B + AB'. IC: 7486. Used in parity generators, checksums, and half-adders. Key property: A⊕A = 0 and A⊕0 = A.",
        category: 'gates',
    },
    {
        question: "What are universal gates?",
        keywords: ['universal', 'gate', 'nand', 'nor'],
        answer: "NAND and NOR are called universal gates because any Boolean function can be implemented using only NAND gates (or only NOR gates). This is critical in VLSI design for standardized cell libraries. NAND(A,A) = NOT(A), proving universality.",
        category: 'gates',
    },

    // ── Verilog ──
    {
        question: "What is Verilog?",
        keywords: ['verilog', 'hdl', 'hardware', 'description', 'language'],
        answer: "Verilog is a Hardware Description Language (HDL) used to model electronic systems. Unlike software languages, Verilog describes hardware that operates in parallel. It supports behavioral, dataflow, and structural modeling. Used extensively in ASIC and FPGA design.",
        category: 'verilog',
    },
    {
        question: "What is the difference between wire and reg in Verilog?",
        keywords: ['wire', 'reg', 'verilog', 'difference'],
        answer: "'wire' represents a physical connection — it can't store values and must be continuously driven (used with assign statements). 'reg' can hold a value and is used inside always blocks. Note: 'reg' doesn't always synthesize to a register — it can be combinational logic too!",
        category: 'verilog',
    },
    {
        question: "What is the difference between blocking and non-blocking assignments?",
        keywords: ['blocking', 'non-blocking', 'assignment', '<=', '='],
        answer: "Blocking (=) executes sequentially — each statement completes before the next starts. Non-blocking (<=) executes concurrently — all right-hand sides are evaluated first, then assigned simultaneously. Rule of thumb: use '=' in combinational always blocks, '<=' in sequential (clocked) always blocks.",
        category: 'verilog',
    },
    {
        question: "How do you write an always block?",
        keywords: ['always', 'block', 'verilog', 'sensitivity'],
        answer: "always @(sensitivity_list) begin ... end. For combinational: always @(*) or always @(a, b). For sequential: always @(posedge clk). Example flip-flop:\n\nalways @(posedge clk or posedge rst)\n  if (rst) q <= 0;\n  else q <= d;",
        category: 'verilog',
    },

    // ── Timing ──
    {
        question: "What is setup time?",
        keywords: ['setup', 'time', 'timing', 'violation'],
        answer: "Setup time (Tsu) is the minimum time the data input must be stable BEFORE the active clock edge. If violated (data changes too close to clock edge), the flip-flop may capture incorrect data — this is called a setup violation. Fix: slow down the clock or optimize the combinational path.",
        category: 'timing',
    },
    {
        question: "What is hold time?",
        keywords: ['hold', 'time', 'timing', 'violation'],
        answer: "Hold time (Th) is the minimum time the data input must remain stable AFTER the active clock edge. Hold violations are more dangerous than setup violations because they can't be fixed by adjusting clock frequency. Fix: add buffer delays in the data path.",
        category: 'timing',
    },
    {
        question: "What is clock skew?",
        keywords: ['clock', 'skew', 'timing'],
        answer: "Clock skew is the difference in clock arrival times at different flip-flops. Positive skew can help with setup time but hurt hold time. Negative skew does the opposite. In VLSI design, clock tree synthesis (CTS) is used to minimize skew across the chip.",
        category: 'timing',
    },
    {
        question: "What is propagation delay?",
        keywords: ['propagation', 'delay', 'tpd'],
        answer: "Propagation delay (tpd) is the time for a signal change to propagate from input to output of a gate. It has two components: tpHL (high-to-low) and tpLH (low-to-high). Total circuit delay = sum of propagation delays along the critical (longest) path.",
        category: 'timing',
    },

    // ── Flip-Flops ──
    {
        question: "What is a flip-flop?",
        keywords: ['flip', 'flop', 'latch', 'register', 'sequential'],
        answer: "A flip-flop is a sequential circuit element that stores one bit of data. Unlike latches (level-sensitive), flip-flops are edge-triggered (respond to clock transitions). Types: D flip-flop (most common in VLSI), JK flip-flop, T flip-flop, SR flip-flop.",
        category: 'circuits',
    },
    {
        question: "What is the difference between a latch and a flip-flop?",
        keywords: ['latch', 'flip-flop', 'difference', 'level', 'edge'],
        answer: "A latch is level-sensitive — it's transparent when enable is HIGH. A flip-flop is edge-triggered — it captures data only at clock edges. Flip-flops are preferred in synchronous design because they prevent race conditions and are easier to analyze for timing.",
        category: 'circuits',
    },

    // ── Interview Questions ──
    {
        question: "What is metastability?",
        keywords: ['metastability', 'meta', 'stable', 'unstable'],
        answer: "Metastability occurs when a flip-flop's setup/hold time is violated, causing the output to enter an unpredictable state between 0 and 1. It can last an indefinite time. Solution: use synchronizer chains (2-3 flip-flops in series) when crossing clock domains.",
        category: 'interview',
    },
    {
        question: "What is a Karnaugh map?",
        keywords: ['karnaugh', 'kmap', 'k-map', 'simplification'],
        answer: "A Karnaugh map (K-map) is a visual method for simplifying Boolean expressions. Variables are arranged in Gray code order so adjacent cells differ by one bit. Group 1s in powers of 2 (1, 2, 4, 8...) to find the simplified expression. Works well up to 5-6 variables.",
        category: 'basics',
    },
    {
        question: "What is an FPGA?",
        keywords: ['fpga', 'field', 'programmable', 'gate', 'array'],
        answer: "An FPGA (Field-Programmable Gate Array) is a reconfigurable IC containing CLBs (Configurable Logic Blocks), interconnects, and I/O blocks. Unlike ASICs, FPGAs can be reprogrammed after manufacturing. Used for prototyping, low-volume production, and real-time processing.",
        category: 'interview',
    },
    {
        question: "What is an ASIC?",
        keywords: ['asic', 'application', 'specific', 'integrated'],
        answer: "An ASIC (Application-Specific Integrated Circuit) is a custom chip designed for a specific purpose. Unlike FPGAs, ASICs can't be reprogrammed but offer better performance, lower power, and lower per-unit cost at high volumes. The design flow: RTL → Synthesis → P&R → Tape-out → Fabrication.",
        category: 'interview',
    },
    {
        question: "What is the difference between combinational and sequential circuits?",
        keywords: ['combinational', 'sequential', 'circuit', 'difference'],
        answer: "Combinational circuits: output depends ONLY on current inputs (no memory). Examples: gates, MUX, adders. Sequential circuits: output depends on current inputs AND past state (has memory). Examples: flip-flops, counters, registers. Sequential = Combinational + Storage elements.",
        category: 'interview',
    },
    {
        question: "What is a multiplexer?",
        keywords: ['multiplexer', 'mux', 'selector'],
        answer: "A multiplexer (MUX) selects one of N data inputs and routes it to output based on select lines. A 2:1 MUX: Y = S'·A + S·B. Used everywhere in VLSI: data routing, function implementation, clock selection. An N-input MUX can implement any N-variable Boolean function!",
        category: 'circuits',
    },
];

/* ─── Fuzzy matching ─── */
export function searchKnowledge(query: string): KnowledgeEntry | null {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    const words = q.split(/\s+/).filter(w => w.length > 2);

    let bestScore = 0;
    let bestEntry: KnowledgeEntry | null = null;

    for (const entry of VLSI_KNOWLEDGE) {
        let score = 0;

        // Keyword match (highest weight)
        for (const kw of entry.keywords) {
            if (q.includes(kw.toLowerCase())) score += 3;
            for (const word of words) {
                if (kw.toLowerCase().includes(word)) score += 1;
            }
        }

        // Question similarity
        const qLower = entry.question.toLowerCase();
        for (const word of words) {
            if (qLower.includes(word)) score += 0.5;
        }

        if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
        }
    }

    return bestScore >= 2 ? bestEntry : null;
}
