/**
 * ChronosMentor.ts - Timing Analysis & Propagation Delay Mentor
 *
 * Specializes in:
 * - Propagation delay concepts
 * - Setup/hold time violations
 * - Critical path analysis
 * - Clock domain crossing
 * - Timing diagrams interpretation
 */

import { BaseMentor, type MentorHint, type HintLevel } from './MentorFramework';

export class ChronosMentor extends BaseMentor {
    constructor() {
        super({
            id: 'chronos',
            name: 'Chronos',
            title: 'Timing Analysis Mentor',
            domain: 'timing',
            avatar: '⏱',
            accentColor: '#F59E0B',
            greeting: "⏱ Time is everything in digital circuits. I'm Chronos - I'll help you understand how signals race through your designs. Let's analyze some timing!",
            encouragements: [
                "Good timing sense! You're thinking about delays correctly.",
                "That's a fast path you've found - literally!",
                "You're getting the hang of timing constraints.",
            ],
            corrections: [
                "Hmm, that timing might cause a glitch. Let's look at it together.",
                "Watch out - that signal might arrive too late. Check the propagation path.",
                "There's a race condition hiding here. Let me show you.",
            ],
            celebrations: [
                "⚡ Your timing is spot on! No setup violations anywhere!",
                "🎯 Perfect timing analysis! You've mastered propagation delays!",
                "⏱ Tick-tock - your circuit meets all timing constraints!",
            ],
            catchphrases: [
                "Every nanosecond counts.",
                "Time waits for no signal.",
                "The critical path determines your maximum clock speed.",
            ],
        });
    }

    protected generateHint(errorType: string, details: string): MentorHint {
        switch (errorType) {
            case 'setup_violation':
                return {
                    level: 'hint',
                    text: `⏱ Setup time violation detected! The data signal at ${details} is changing too close to the clock edge. It needs to be stable ${this.getSetupExplanation()}.`,
                    relatedConcept: 'Setup Time',
                };

            case 'hold_violation':
                return {
                    level: 'hint',
                    text: `⏱ Hold time violation! The data at ${details} is changing too soon after the clock edge. Signals must remain stable for a minimum hold time.`,
                    relatedConcept: 'Hold Time',
                };

            case 'critical_path':
                return {
                    level: 'explanation',
                    text: `⏱ Your critical path through ${details} is too long. The total propagation delay exceeds the clock period. Consider: (1) reducing logic depth, (2) pipelining, or (3) using faster gates.`,
                    relatedConcept: 'Critical Path',
                };

            case 'clock_skew':
                return {
                    level: 'hint',
                    text: `⏱ Clock skew detected between domains. The clocks at ${details} arrive at different times, which can cause metastability.`,
                    relatedConcept: 'Clock Skew',
                };

            case 'glitch':
                return {
                    level: 'explanation',
                    text: `⏱ Combinational glitch risk! When multiple inputs change at different times, the output at ${details} may momentarily show an incorrect value. This is a classic hazard.`,
                    relatedConcept: 'Hazards and Glitches',
                };

            default:
                return {
                    level: 'nudge',
                    text: `⏱ ${this.pickRandom(this.personality.corrections)}`,
                };
        }
    }

    protected generateContextualHint(level: HintLevel): MentorHint {
        const hints: Record<HintLevel, string> = {
            nudge: "⏱ Think about how long it takes for a signal to travel through each gate...",
            hint: "⏱ Each gate adds propagation delay. AND gates typically: ~2ns, NOT gates: ~1ns. Sum the delays along the longest path.",
            explanation: "⏱ The critical path is the longest delay path from any input to any output. For a 100MHz clock (10ns period), your total propagation delay must be less than 10ns minus setup time. Count the gates: path = Σ(gate_delays).",
            solution: "⏱ Here's the timing calculation: If your path goes through NOT→AND→OR→AND, the total delay is 1+2+2+2 = 7ns. With 1ns setup time, you need a clock period ≥ 8ns (max freq: 125MHz).",
        };

        return { level, text: hints[level] };
    }

    private getSetupExplanation(): string {
        return 'for at least t_setup before the clock edge arrives. Think of it like arriving at a bus stop - you need to be there before the bus!';
    }
}
