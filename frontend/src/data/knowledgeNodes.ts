/**
 * knowledgeNodes.ts
 *
 * Structured knowledge data for Level 1 knowledge nodes.
 * Schema: intuition → equation → misconception → real-world case → career relevance.
 */

export interface KnowledgeNodeData {
    id: string;
    label: string;
    title: string;
    definition: string;
    corePrinciple: string;
    practicalExample: string;
    misconception?: string;
    designInsight?: string;
    equation?: string;
    equationLabel?: string;
}

export const LEVEL1_KNOWLEDGE_NODES: Record<string, KnowledgeNodeData> = {
    'closed-circuit': {
        id: 'closed-circuit',
        label: '↺',
        title: 'Closed Circuit',
        definition:
            'A closed circuit is a continuous, unbroken conductive path from a power source, through a load, and back to the source.',
        corePrinciple:
            'Charge requires an uninterrupted loop to circulate; energy leaves the source and must return to it.',
        practicalExample:
            'A severed diagnostic cable stops all data flow immediately, regardless of source voltage.',
        misconception:
            'Engineers often assume: "If only one end is disconnected, some current still flows." This is wrong. Current is binary in a simple loop — either the loop is closed and current flows, or it is open and current is zero.',
        designInsight:
            "A 'Return Path' isn't just a wire—it's half of your antenna. Poor return paths in high-speed digital designs cause EMI failures because the energy will find its own path back, usually through space as radiation."
    },

    'ohms-law': {
        id: 'ohms-law',
        label: 'Ω',
        title: "Ohm's Law",
        definition:
            'The foundational math describing the relationship between voltage (pressure), resistance (friction), and current (flow).',
        corePrinciple:
            'If you push harder (voltage up) or reduce friction (resistance down), more electrons flow proportionally.',
        practicalExample:
            'USB-C Power Delivery negotiation: devices actively negotiate voltage levels while keeping current within cable resistance limits.',
        equation: 'V = I × R',
        equationLabel: 'V = Voltage (V), I = Current (A), R = Resistance (Ω)',
        misconception:
            '"More voltage always means more current." This only holds if resistance stays fixed. In circuits with variable loads, the relationship is non-linear.',
        designInsight:
            "Always design with margin. If a trace requires 1A, calculate resistance for 1.5A to prevent voltage droop at the load. Heat from I²R losses is the enemy of reliability."
    },

    'short-circuit': {
        id: 'short-circuit',
        label: '⚡',
        title: 'Short Circuit',
        definition:
            'A near-zero-resistance path directly between supply terminals, bypassing the intended load.',
        corePrinciple:
            'Current always takes the path of least resistance. With minimal resistance, current spikes exponentially, generating immense heat.',
        practicalExample:
            'Internal electrode misalignment created micro short circuits inside lithium batteries, causing catastrophic thermal runaway.',
        misconception:
            '"A short circuit just makes the device stop working." Reality: Ohm\'s Law demands near-infinite current, causing fires, explosive capacitor failures, and IC destruction.',
        designInsight:
            "Protection circuits must blow faster than the silicon fails. Fuses, PTCs, and active crowbars are mandatory to constrain energy dumps."
    },

    'open-circuit': {
        id: 'open-circuit',
        label: '◯',
        title: 'Open Circuit',
        definition:
            'A physical break in the loop where current cannot flow because there is no continuous conductive path.',
        corePrinciple:
            'Without continuity, electron circulation halts entirely, even if a high potential difference (voltage) exists across the gap.',
        practicalExample:
            'A single broken wire in an alternator field circuit creates an open circuit, instantly halting battery charging.',
        misconception:
            '"If the device turns off, the circuit must be open." An open circuit specifically means a physical break, not just a software shutoff or blown component.',
        designInsight:
            "Open circuits often happen intermittently due to thermal expansion or mechanical vibration. Always specify highly reliable locking connectors in critical hardware."
    },
};
