/**
 * useLogicAnalystL3.ts - Logic Analyst for Level 3: Binary Awakening
 */

import { useCallback, useRef } from 'react';
import { useBinaryStore, selectCognitionTier } from '../stores/binaryStore';

export type AnalystTier = 'sharp' | 'steady' | 'struggling' | 'overconfident' | 'passive';
export type L3Scene = 'whybinary' | 'switch' | 'counter' | 'register' | 'arithmetic' | 'bridge';

export interface AnalystResponse {
    observation: string;
    analysis: string;
    conclusion: string;
    insight: string;
    tier: AnalystTier;
}

const ANALYST_DB: Record<L3Scene, Record<AnalystTier, AnalystResponse[]>> = {
    whybinary: {
        sharp: [{ observation: "Signal thresholding understood.", analysis: "Analog to Digital conversion verified. Noise margin interpreted correctly.", conclusion: "You have identified the engineering necessity of discrete logic.", insight: "Binary is an immunity strategy. By ignoring variation, we ensure calculation consistency.", tier: "sharp" }],
        steady: [{ observation: "Threshold applied to noisy signal.", analysis: "Digital abstraction confirmed. Discrete states 0 and 1 recovered from analog drift.", conclusion: "The indeterminate zone has been successfully gated.", insight: "Every bit in a CPU corresponds to a specific voltage level. Stability is the priority.", tier: "steady" }],
        struggling: [{ observation: "Recovering truth from noise.", analysis: "Thresholding simplifies reality.", conclusion: "Click apply to see how binary ignores the noise.", insight: "Without thresholding, bits would flicker randomly due to thermal noise.", tier: "struggling" }],
        overconfident: [{ observation: "Threshold logic active.", analysis: "System ready.", conclusion: "The transition is complete.", insight: "Digital logic is the backbone of reliability.", tier: "overconfident" }],
        passive: [{ observation: "Monitoring signal drift.", analysis: "Noise levels are high.", conclusion: "Apply the threshold to stabilize the bit.", insight: "Analog signals cannot be duplicated perfectly; binary bits can.", tier: "passive" }]
    },
    switch: {
        sharp: [{ observation: "Voltage-to-Binary matrix confirmed.", analysis: "Static 4-bit CMOS input. Logic HIGH (VDD) vs Logic LOW (GND) abstraction verified.", conclusion: "You are viewing the foundational binary digitization of physical voltage potential.", insight: "In ultra-low power designs, even 'static' bits consume leakage power. Every 1 in this register represents a real current flow in the sub-micron substrate.", tier: "sharp" }],
        steady: [{ observation: "Switch transition detected.", analysis: "Standard thresholding logic applied. Digital systems map continuous voltage to discrete logic states.", conclusion: "The switch connected VDD to the input node, crossing the 2.0V binary HIGH threshold.", insight: "Real-world signals are noisy. Hardware uses 'Schmitt Triggers' to clean up these transitions before the CPU sees them.", tier: "steady" }],
        struggling: [{ observation: "Switch bit changed.", analysis: "A digital system knows only two states: ON (1) and OFF (0).", conclusion: "Look at Bit 0 (the LSB) - it toggles based on the rightmost switch.", insight: "Start by toggling one switch at a time. The rightmost bit is the smallest power of two (2^0 = 1).", tier: "struggling" }],
        overconfident: [{ observation: "Rapid switch toggling detected. Pattern integrity suspect.", analysis: "High interaction frequency without state analysis suggests trial-and-error rather than systematic engineering.", conclusion: "Slowing down to observe the transformation will stabilize your model.", insight: "Real-world bounce in physical switches requires debouncing logic.", tier: "overconfident" }],
        passive: [{ observation: "Low interaction density in Switch Lab.", analysis: "Binary systems are experimental. Observe how the LSB affects the total differently than the MSB.", conclusion: "Toggle each switch once to map the physical position to its binary weight.", insight: "Passive observation misses the 'feel' of digital thresholds.", tier: "passive" }]
    },
    counter: {
        sharp: [{ observation: "Counter increment confirmed. Ripple sequence observed.", analysis: "Propagation delay (Tpd) is the critical constraint. Each bit must wait for the carry from its predecessor.", conclusion: "This ripple effect determines the maximum frequency (Fmax) of the circuit.", insight: "High-speed processors use Carry Lookahead Logic to bypass the ripple. You are witnessing raw physical delay.", tier: "sharp" }],
        steady: [{ observation: "Counter value updated. Carry propagated.", analysis: "In binary counting, 1 + 1 generates a 'carry' to the next power-of-two column.", conclusion: "Notice how the carry travels from right to left.", insight: "The carry chain is the 'time limit' for a single clock cycle.", tier: "steady" }],
        struggling: [{ observation: "Number increased by 1.", analysis: "When a bit is already 1 and you add 1, it becomes 0 and sends a signal to its neighbor.", conclusion: "Watch Bit 0. Every time it resets to 0, it gives its 'energy' to Bit 1.", insight: "Focus on the carry: it only flows to the left.", tier: "struggling" }],
        overconfident: [{ observation: "Rapid incrementing. Observe the carry chain!", analysis: "Clicking too fast skips the most important part: the propagation wave.", conclusion: "Slow down. Watch how bits flip in sequence.", insight: "High-speed counters use 'Carry Lookahead' to bypass this delay.", tier: "overconfident" }],
        passive: [{ observation: "Counter interaction is low.", analysis: "Counting to 15 is the best way to see the full ripple effect.", conclusion: "Increment until you see multiple bits flip at once.", insight: "Binary counters are the heartbeat of digital clocks.", tier: "passive" }]
    },
    register: {
        sharp: [{ observation: "8-bit memory cell modification confirmed.", analysis: "Addressable 1-byte register stored. Hex display 0x00-0xFF verified.", conclusion: "The register stores 8 bits-the fundamental unit of addressable memory.", insight: "Each bit here is a physical D flip-flop. At the hardware level, this is a synchronous array.", tier: "sharp" }],
        steady: [{ observation: "Register bit pattern updated.", analysis: "Groups of 4 bits drive the Hex display. 1010 (10) = 0xA.", conclusion: "Storage is volatile until you pulse the 'Store' signal.", insight: "Hexadecimal is the engineer's shorthand. One hex digit represents 4 bits.", tier: "steady" }],
        struggling: [{ observation: "Register state changed.", analysis: "A byte is 8 bits. It can store numbers, colors, or letters.", conclusion: "Try toggling different nibbles.", insight: "Think of this as a save button. Until you 'Store', it's just a buffer.", tier: "struggling" }],
        overconfident: [{ observation: "Register bits modified rapidly without storage.", analysis: "Data in a register is volatile until the WRITE ENABLE signal is pulsed.", conclusion: "The current bits represent the input buffer.", insight: "Registers have 'Setup' and 'Hold' time requirements.", tier: "overconfident" }],
        passive: [{ observation: "Memory interaction detected.", analysis: "A byte can represent anything. Notice how hex digits update.", conclusion: "Toggle bits to see nibble independence.", insight: "In assembly, `MOV R0, #0xFF` sets all bits in an 8-bit register.", tier: "passive" }]
    },
    arithmetic: {
        sharp: [{ observation: "Ripple carry sequence initiated.", analysis: "S = A ⊕ B ⊕ Cin. The carry path is the hardware bottleneck.", conclusion: "If the carry ripple is too slow, the clock cycle must be extended.", insight: "Modern ALUs use Wallace Trees to solve this at O(log N) speed.", tier: "sharp" }],
        steady: [{ observation: "Full Adder logic active.", analysis: "Column-by-column binary addition. 1+1 = 10 (0 sum, 1 carry).", conclusion: "Notice the carry-out of Bit 2 becomes the carry-in of Bit 3.", insight: "The carry is 'tension.' It carries overflow energy to the next stage.", tier: "steady" }],
        struggling: [{ observation: "Addition started.", analysis: "Binary addition follows decimal rules, but carries happen sooner.", conclusion: "Follow the glowing carry particle.", insight: "Try 1+1 first. You've witnessed the birth of digital arithmetic.", tier: "struggling" }],
        overconfident: [{ observation: "Repeated 'Compute' triggers with same operands.", analysis: "The result is deterministic. Observe the specific inputs to each Full Adder cell.", conclusion: "The Full Adder takes 3 inputs. (A+B+Cin) >= 2 generates a carry.", insight: "ALUs use parallel prefix trees to speed up this process.", tier: "overconfident" }],
        passive: [{ observation: "Arithmetic engine idle.", analysis: "Change operand bits to see carry flow. Can you ripple through all 4 bits?", conclusion: "Try adding 1111 + 0001 for a full ripple.", insight: "The 'Carry Out' of the leftmost bit is the 'Overflow' flag.", tier: "passive" }]
    },
    bridge: {
        sharp: [{ observation: "Half-adder manifestation complete.", analysis: "Boolean convergence verified. XOR + AND implementation is algebraically sound.", conclusion: "You have reconciled electrical physics with logical abstraction.", insight: "This bridge is where physics becomes math. Every CPU uses billions of these.", tier: "sharp" }],
        steady: [{ observation: "Gate construction successful.", analysis: "The XOR sum and AND carry signals are properly mapped.", conclusion: "You have built a functional 1-bit adder cell.", insight: "A 64-bit processor is just 64 of these cells chained together.", tier: "steady" }],
        struggling: [{ observation: "Logic gates connected.", analysis: "Sum and Carry bits established.", conclusion: "You've built a machine that can add.", insight: "Combined, these two simple gates perform the fundamental act of arithmetic.", tier: "struggling" }],
        overconfident: [{ observation: "Bridge active.", analysis: "Ready for Silicon.", conclusion: "Connection complete.", insight: "Logic is the structure of thought in silicon.", tier: "overconfident" }],
        passive: [{ observation: "Observing the black box.", analysis: "Gates are ready.", conclusion: "Connect the XOR and AND to advance.", insight: "The Half-adder is the smallest meaningful circuit in a CPU.", tier: "passive" }]
    }
};

export function useLogicAnalystL3() {
    const interactionHistory = useRef<boolean[]>([]);
    const usedIndices = useRef<Record<string, Set<number>>>({});

    const recordInteraction = useCallback((success: boolean) => {
        interactionHistory.current = [...interactionHistory.current.slice(-6), success];
    }, []);

    const cognitionTier = useBinaryStore(selectCognitionTier);
    const metrics = useBinaryStore(s => s.metrics);

    const getTier = useCallback((): AnalystTier => {
        if (cognitionTier === 'overconfident' || cognitionTier === 'passive' || cognitionTier === 'struggling') {
            return cognitionTier;
        }
        const hist = interactionHistory.current;
        if (hist.length === 0) return 'steady';
        const successes = hist.filter(Boolean).length;
        if (successes === hist.length && hist.length >= 2) return 'sharp';
        if (successes >= Math.ceil(hist.length * 0.6)) return 'steady';
        return 'struggling';
    }, [cognitionTier]);

    const getProactiveMessage = useCallback((_scene: L3Scene): string | null => {
        const { hesitationTime, errorStreak } = metrics;
        if (errorStreak >= 2) return "Logic Analyst Alert: Repeated state mismatch detected. Try analyzing the carry chain at 0.5x speed.";
        if (hesitationTime > 10000) return "Insight: Complex logical transition ahead. Remember, the LSB always toggles first.";
        return null;
    }, [metrics]);

    const getResponse = useCallback((scene: L3Scene): AnalystResponse => {
        const tier = getTier();
        if (!ANALYST_DB[scene]) {
            console.warn(`ANALYST_DB missing context: ${scene}`);
            return {
                observation: "System status stable.",
                analysis: "Data processing in progress.",
                conclusion: "Proceed with lab verification.",
                insight: "Digital logic requires consistent state monitoring.",
                tier: "steady"
            };
        }
        const pool = ANALYST_DB[scene][tier];
        const key = `${scene}-${tier}`;
        if (!usedIndices.current[key]) usedIndices.current[key] = new Set();
        const used = usedIndices.current[key];
        let available = pool.map((_, i) => i).filter((i) => !used.has(i));
        if (available.length === 0) {
            used.clear();
            available = pool.map((_, i) => i);
        }
        const idx = available[Math.floor(Math.random() * available.length)];
        used.add(idx);
        const response = pool[idx];
        return {
            ...response,
            insight: response.insight + " [SYSTEM IMPACT: This principle directly determines clock speed and data integrity.]"
        };
    }, [getTier]);

    return { recordInteraction, getResponse, getTier, getProactiveMessage };
}
