/**
 * engine/GateSVGShapes.ts — IEEE/ANSI Rectangular Gate SVG Definitions
 *
 * Every gate is represented as a 64×48px rectangular symbol (IEEE 91-1984 style).
 * Port positions are relative to the shape origin (0,0).
 *
 * Design choices vs Logisim:
 * - Strict IEEE rectangular forms (no curved bodies — cleaner for grid layout)
 * - Port circles are rendered by CanvasNode.tsx, not here
 * - Shapes are pure SVG path strings for direct DOM injection
 */

export interface PortDefinition {
    id: string;
    side: 'left' | 'right' | 'top' | 'bottom';
    /** Offset from the corresponding edge midpoint, in pixels */
    offset: number;
    role: 'input' | 'output' | 'clock';
    label: string;
}

export interface GateShape {
    /** Outer body path (relative to x,y origin) */
    bodyPath: string;
    /** IEEE qualifier symbol text */
    symbol: string;
    /** Color accent for SVG border */
    color: string;
    /** Width × Height of bounding box */
    w: number;
    h: number;
    /** Pin definitions used by CanvasNode to place circles */
    ports: PortDefinition[];
    /** Optional bubble positions (NOT circles on outputs) */
    bubbles?: Array<{ x: number; y: number }>;
}

// ── Standard Rectangles ────────────────────────────────────────────────────

const rect = (w: number, h: number) =>
    `M0,0 L${w},0 L${w},${h} L0,${h} Z`;

// ── Port Helpers ──────────────────────────────────────────────────────────

const twoInputPorts: PortDefinition[] = [
    { id: 'A', side: 'left', offset: -8, role: 'input', label: 'A' },
    { id: 'B', side: 'left', offset: 8, role: 'input', label: 'B' },
];

const oneOutputPort: PortDefinition[] = [
    { id: 'Y', side: 'right', offset: 0, role: 'output', label: 'Y' },
];

// ── Gate Definitions ──────────────────────────────────────────────────────

export const GATE_SHAPES: Record<string, GateShape> = {
    // ── Basic Gates ──────────────────────────────────────────────────────────

    AND: {
        bodyPath: rect(64, 48), symbol: '&', color: '#00D4FF', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
    },

    OR: {
        bodyPath: rect(64, 48), symbol: '≥1', color: '#10B981', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
    },

    NOT: {
        bodyPath: rect(56, 40), symbol: '1', color: '#F59E0B', w: 56, h: 40,
        ports: [
            { id: 'A', side: 'left', offset: 0, role: 'input', label: 'A' },
            { id: 'Y', side: 'right', offset: 0, role: 'output', label: 'Y' },
        ],
        bubbles: [{ x: 60, y: 20 }],
    },

    NAND: {
        bodyPath: rect(64, 48), symbol: '&', color: '#A78BFA', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
        bubbles: [{ x: 68, y: 24 }],
    },

    NOR: {
        bodyPath: rect(64, 48), symbol: '≥1', color: '#F43F5E', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
        bubbles: [{ x: 68, y: 24 }],
    },

    XOR: {
        bodyPath: rect(64, 48), symbol: '=1', color: '#FB923C', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
    },

    XNOR: {
        bodyPath: rect(64, 48), symbol: '=1', color: '#34D399', w: 64, h: 48,
        ports: [...twoInputPorts, ...oneOutputPort],
        bubbles: [{ x: 68, y: 24 }],
    },

    BUFFER: {
        bodyPath: rect(48, 40), symbol: '→', color: '#60A5FA', w: 48, h: 40,
        ports: [
            { id: 'A', side: 'left', offset: 0, role: 'input', label: 'A' },
            { id: 'Y', side: 'right', offset: 0, role: 'output', label: 'Y' },
        ],
    },

    // ── Flip-Flops & Latches ─────────────────────────────────────────────────

    D_FF: {
        bodyPath: rect(72, 64), symbol: 'D', color: '#818CF8', w: 72, h: 64,
        ports: [
            { id: 'D', side: 'left', offset: -12, role: 'input', label: 'D' },
            { id: 'CLK', side: 'left', offset: 12, role: 'clock', label: '▷' },
            { id: 'Q', side: 'right', offset: -12, role: 'output', label: 'Q' },
            { id: 'Qn', side: 'right', offset: 12, role: 'output', label: 'Q̄' },
        ],
    },

    JK_FF: {
        bodyPath: rect(72, 72), symbol: 'JK', color: '#C084FC', w: 72, h: 72,
        ports: [
            { id: 'J', side: 'left', offset: -16, role: 'input', label: 'J' },
            { id: 'K', side: 'left', offset: 0, role: 'input', label: 'K' },
            { id: 'CLK', side: 'left', offset: 16, role: 'clock', label: '▷' },
            { id: 'Q', side: 'right', offset: -16, role: 'output', label: 'Q' },
            { id: 'Qn', side: 'right', offset: 16, role: 'output', label: 'Q̄' },
        ],
    },

    SR_LATCH: {
        bodyPath: rect(72, 56), symbol: 'SR', color: '#E879F9', w: 72, h: 56,
        ports: [
            { id: 'S', side: 'left', offset: -8, role: 'input', label: 'S' },
            { id: 'R', side: 'left', offset: 8, role: 'input', label: 'R' },
            { id: 'Q', side: 'right', offset: -8, role: 'output', label: 'Q' },
            { id: 'Qn', side: 'right', offset: 8, role: 'output', label: 'Q̄' },
        ],
    },

    // ── I/O ──────────────────────────────────────────────────────────────────

    SWITCH_SPST: {
        bodyPath: rect(56, 40), symbol: '⏻', color: '#64748B', w: 56, h: 40,
        ports: [
            { id: 'Y', side: 'right', offset: 0, role: 'output', label: 'Y' },
        ],
    },

    PUSHBUTTON: {
        bodyPath: rect(56, 40), symbol: '⊓', color: '#64748B', w: 56, h: 40,
        ports: [
            { id: 'Y', side: 'right', offset: 0, role: 'output', label: 'Y' },
        ],
    },

    LED: {
        bodyPath: rect(48, 48), symbol: '◉', color: '#EF4444', w: 48, h: 48,
        ports: [
            { id: 'A', side: 'left', offset: 0, role: 'input', label: 'A' },
        ],
    },

    SEVEN_SEG: {
        bodyPath: rect(64, 80), symbol: '8', color: '#F59E0B', w: 64, h: 80,
        ports: [
            { id: 'A', side: 'left', offset: -24, role: 'input', label: 'a' },
            { id: 'B', side: 'left', offset: -16, role: 'input', label: 'b' },
            { id: 'C', side: 'left', offset: -8, role: 'input', label: 'c' },
            { id: 'D', side: 'left', offset: 0, role: 'input', label: 'd' },
            { id: 'E', side: 'left', offset: 8, role: 'input', label: 'e' },
            { id: 'F', side: 'left', offset: 16, role: 'input', label: 'f' },
            { id: 'G', side: 'left', offset: 24, role: 'input', label: 'g' },
        ],
    },

    BATTERY: {
        bodyPath: rect(48, 40), symbol: '⚡', color: '#FCD34D', w: 48, h: 40,
        ports: [
            { id: 'VCC', side: 'right', offset: 0, role: 'output', label: 'VCC' },
        ],
    },

    GROUND: {
        bodyPath: rect(40, 32), symbol: '⏚', color: '#94A3B8', w: 40, h: 32,
        ports: [
            { id: 'GND', side: 'right', offset: 0, role: 'output', label: 'GND' },
        ],
    },

    // ── Advanced ─────────────────────────────────────────────────────────────

    COMPARATOR: {
        bodyPath: rect(72, 48), symbol: '=?', color: '#06B6D4', w: 72, h: 48,
        ports: [
            { id: 'A', side: 'left', offset: -8, role: 'input', label: 'A' },
            { id: 'B', side: 'left', offset: 8, role: 'input', label: 'B' },
            { id: 'GT', side: 'right', offset: -8, role: 'output', label: 'A>B' },
            { id: 'EQ', side: 'right', offset: 8, role: 'output', label: 'A=B' },
        ],
    },
};

/**
 * Get port pixel position given the gate shape and a port definition.
 * Returns absolute position relative to the gate origin (top-left).
 */
export function getPortPosition(shape: GateShape, port: PortDefinition): { x: number; y: number } {
    const cx = shape.w / 2;
    const cy = shape.h / 2;
    switch (port.side) {
        case 'left': return { x: 0, y: cy + port.offset };
        case 'right': return { x: shape.w, y: cy + port.offset };
        case 'top': return { x: cx + port.offset, y: 0 };
        case 'bottom': return { x: cx + port.offset, y: shape.h };
    }
}
