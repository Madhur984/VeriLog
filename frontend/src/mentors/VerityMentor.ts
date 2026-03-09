/**
 * VerityMentor.ts — Verilog HDL Coding Mentor
 *
 * Specializes in:
 * - Verilog syntax and semantics
 * - Blocking vs non-blocking assignments
 * - Module instantiation patterns
 * - Testbench writing
 * - Common Verilog mistakes
 */

import { BaseMentor, type MentorHint, type HintLevel } from './MentorFramework';

export class VerityMentor extends BaseMentor {
    constructor() {
        super({
            id: 'verity',
            name: 'Verity',
            title: 'Verilog HDL Mentor',
            domain: 'verilog',
            avatar: '📝',
            accentColor: '#8B5CF6',
            greeting: "📝 Welcome to the world of Hardware Description Languages! I'm Verity — I'll guide you through Verilog syntax, semantics, and best practices. Let's write some hardware!",
            encouragements: [
                "Clean Verilog! Your sensitivity list is perfect.",
                "Great module structure — that's very synthesizable code.",
                "Your testbench coverage is looking solid!",
            ],
            corrections: [
                "That assignment might cause a latch. Let me explain the difference between = and <=.",
                "Your sensitivity list might be incomplete — this could cause simulation mismatches.",
                "Be careful with blocking assignments in sequential logic blocks.",
            ],
            celebrations: [
                "📝 Beautifully written Verilog! Clean, synthesizable, and well-structured!",
                "🎯 Your module passed all test cases! Hardware engineer in the making!",
                "⚡ Perfect! Your Verilog simulates correctly AND is synthesizable!",
            ],
            catchphrases: [
                "In Verilog, always means always — unless you forget the sensitivity list.",
                "Think in hardware, not software.",
                "If it's not synthesizable, it's just a simulation dream.",
            ],
        });
    }

    protected generateHint(errorType: string, details: string): MentorHint {
        switch (errorType) {
            case 'blocking_sequential':
                return {
                    level: 'explanation',
                    text: `📝 You used a blocking assignment (=) inside an always @(posedge clk) block at ${details}. In sequential logic, always use non-blocking assignments (<=). Blocking = executes sequentially (like software), while non-blocking <= updates simultaneously (like hardware).`,
                    relatedConcept: 'Blocking vs Non-blocking',
                    codeSnippet: `// ❌ Wrong\nalways @(posedge clk)\n  b = a;  // blocking\n\n// ✅ Correct\nalways @(posedge clk)\n  b <= a;  // non-blocking`,
                };

            case 'incomplete_sensitivity':
                return {
                    level: 'hint',
                    text: `📝 Your sensitivity list at ${details} doesn't include all signals read inside the block. This means the block won't re-evaluate when those signals change.`,
                    relatedConcept: 'Sensitivity Lists',
                    codeSnippet: `// Use @(*) for combinational logic\nalways @(*)\n  out = a & b;`,
                };

            case 'inferred_latch':
                return {
                    level: 'explanation',
                    text: `📝 An unintended latch was inferred at ${details}. This happens when a combinational always block doesn't assign a value in all branches. Add a default assignment or complete all cases.`,
                    relatedConcept: 'Latch Inference',
                    codeSnippet: `// Add default before case/if\nalways @(*) begin\n  out = 0; // default\n  if (sel) out = a;\nend`,
                };

            case 'width_mismatch':
                return {
                    level: 'hint',
                    text: `📝 Width mismatch at ${details}! The left-hand side and right-hand side have different bit widths. Verilog will silently truncate or zero-extend, which may cause bugs.`,
                    relatedConcept: 'Bit Widths',
                };

            case 'syntax_error':
                return {
                    level: 'nudge',
                    text: `📝 Syntax error near ${details}. Check for missing semicolons, mismatched begin/end pairs, or incorrect port declarations.`,
                    relatedConcept: 'Verilog Syntax',
                };

            default:
                return {
                    level: 'nudge',
                    text: `📝 ${this.pickRandom(this.personality.corrections)}`,
                };
        }
    }

    protected generateContextualHint(level: HintLevel): MentorHint {
        const hints: Record<HintLevel, string> = {
            nudge: "📝 Remember: `always @(posedge clk)` for sequential, `always @(*)` for combinational...",
            hint: "📝 In Verilog, think about what hardware you're describing, not what 'code' you're writing. Each always block is a separate piece of hardware running in parallel.",
            explanation: "📝 Key Verilog rules: (1) Use `<=` in sequential blocks, `=` in combinational blocks. (2) Always have defaults in combinational case/if statements to avoid latches. (3) Only one always block should drive each signal.",
            solution: "📝 Here's the correct pattern:\n```verilog\n// Sequential with reset\nalways @(posedge clk or posedge reset)\n  if (reset) q <= 0;\n  else q <= d;\n```",
        };

        return { level, text: hints[level] };
    }
}
