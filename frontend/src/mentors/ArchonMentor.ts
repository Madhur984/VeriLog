/**
 * ArchonMentor.ts - Computer Architecture Mentor
 *
 * Specializes in:
 * - CPU datapath design
 * - Pipeline stages
 * - Memory hierarchy
 * - Instruction set architecture
 * - Microarchitecture concepts
 */

import { BaseMentor, type MentorHint, type HintLevel } from './MentorFramework';

export class ArchonMentor extends BaseMentor {
    constructor() {
        super({
            id: 'archon',
            name: 'Archon',
            title: 'Architecture Mentor',
            domain: 'architecture',
            avatar: '🏛',
            accentColor: '#06B6D4',
            greeting: "🏛 Welcome to computer architecture! I'm Archon - I'll guide you through CPU design, pipelines, and memory hierarchies. Let's build a processor!",
            encouragements: [
                "Excellent datapath design! Those control signals are correct.",
                "You've identified the right pipeline stages. Well done!",
                "Your understanding of the memory hierarchy is impressive.",
            ],
            corrections: [
                "That datapath connection might cause a data hazard. Check the forwarding paths.",
                "Your pipeline has a structural hazard - two units trying to use the same resource.",
                "The control signals don't match the instruction format. Let's trace through it.",
            ],
            celebrations: [
                "🏛 Magnificent architecture! Your CPU executes correctly!",
                "⚡ Your pipeline has no stalls - maximum throughput achieved!",
                "🎯 Perfect ISA design! Clean, orthogonal, and implementable!",
            ],
            catchphrases: [
                "Every instruction tells a story through the datapath.",
                "The fastest instruction is the one you don't execute.",
                "Cache is king - locality of reference is everything.",
            ],
        });
    }

    protected generateHint(errorType: string, details: string): MentorHint {
        switch (errorType) {
            case 'data_hazard':
                return {
                    level: 'explanation',
                    text: `🏛 Data hazard detected at ${details}! This occurs when an instruction depends on the result of a previous instruction still in the pipeline. Solutions: (1) forwarding/bypassing, (2) pipeline stalls, or (3) instruction reordering.`,
                    relatedConcept: 'Data Hazards',
                };

            case 'control_hazard':
                return {
                    level: 'hint',
                    text: `🏛 Control hazard at ${details}! Branch instructions cause uncertainty about the next instruction to fetch. Consider branch prediction or delayed branching.`,
                    relatedConcept: 'Control Hazards',
                };

            case 'structural_hazard':
                return {
                    level: 'hint',
                    text: `🏛 Structural hazard: two pipeline stages at ${details} need the same hardware resource simultaneously. Solution: duplicate the resource or add a stall.`,
                    relatedConcept: 'Structural Hazards',
                };

            case 'wrong_control':
                return {
                    level: 'explanation',
                    text: `🏛 Control signal mismatch at ${details}. Trace the instruction through each pipeline stage: Fetch → Decode → Execute → Memory → Writeback. Each stage needs specific control signals.`,
                    relatedConcept: 'Control Unit',
                };

            case 'cache_miss':
                return {
                    level: 'hint',
                    text: `🏛 Cache miss pattern at ${details}. Check if you're utilizing spatial locality (sequential access) and temporal locality (reusing data). Consider the cache line size and associativity.`,
                    relatedConcept: 'Cache Design',
                };

            default:
                return {
                    level: 'nudge',
                    text: `🏛 ${this.pickRandom(this.personality.corrections)}`,
                };
        }
    }

    protected generateContextualHint(level: HintLevel): MentorHint {
        const hints: Record<HintLevel, string> = {
            nudge: "🏛 Think about how data flows through the processor - from instruction memory to register file to ALU...",
            hint: "🏛 A basic CPU has 5 stages: Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), WriteBack (WB). Each instruction progresses through all stages.",
            explanation: "🏛 The datapath connects: PC → Instruction Memory → Register File → ALU → Data Memory → Register File. Control signals from the Decode stage tell each component what to do. The key insight: multiple instructions can be in different stages simultaneously - that's pipelining!",
            solution: "🏛 Here's the complete pipeline: Stage 1 (IF): PC → InstrMem, Stage 2 (ID): Read registers + sign-extend immediate, Stage 3 (EX): ALU operation, Stage 4 (MEM): Read/Write data memory, Stage 5 (WB): Write result to register file. Pipeline registers between each stage store intermediate values.",
        };

        return { level, text: hints[level] };
    }
}
