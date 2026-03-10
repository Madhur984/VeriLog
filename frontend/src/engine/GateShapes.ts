/**
 * engine/GateShapes.ts — Logisim-style Component Rendering
 *
 * Provides SVG paths and styles for IEEE core logic gates.
 * Logisim uses distinctive curved ANSI shapes for OR, XOR, AND.
 */

export const ARC_AND = `
  M 0,0 
  L 2,0 
  A 2,2 0 0,1 4,2
  A 2,2 0 0,1 2,4
  L 0,4 
  Z
`;

export const ARC_OR = `
  M 0,0
  Q 1,2 0,4
  Q 2,4 4,2
  Q 2,0 0,0
  Z
`;

export const ARC_XOR = `
  M 0.5,0
  Q 1.5,2 0.5,4
  Q 2.5,4 4,2
  Q 2.5,0 0.5,0
  Z
  M -0.5,0
  Q 0.5,2 -0.5,4
`;

export const TRIANGLE_BUFFER = `
  M 0,0
  L 4,2
  L 0,4
  Z
`;

export const BUBBLE = `
  M 4,2
  A 0.5,0.5 0 1,1 5,2
  A 0.5,0.5 0 1,1 4,2
  Z
`;

export function getSvgPath(style: string, extras?: string): string {
    let path = '';
    switch (style) {
        case 'and': path = ARC_AND; break;
        case 'or': path = ARC_OR; break;
        case 'triangle': path = TRIANGLE_BUFFER; break;
        case 'not': path = TRIANGLE_BUFFER + BUBBLE; break;
        case 'rect': path = 'M 0,0 L 4,0 L 4,4 L 0,4 Z'; break;
        case 'custom': path = ''; break; // Handled by component-specific renderers
        default: path = 'M 0,0 L 4,0 L 4,4 L 0,4 Z'; break;
    }

    if (extras) {
        if (extras.includes('bubble') && style !== 'not') path += BUBBLE;
        if (extras.includes('exclusive')) path = ARC_XOR + (extras.includes('bubble') ? BUBBLE : '');
    }

    // Multiply coordinates by 10 (grid unit)
    // E.g., M 0,0 L 2,0 -> M 0,0 L 20,0
    // regex to multiply numbers
    return path.replace(/([-\d.]+)/g, (match) => {
        return String(parseFloat(match) * 10);
    });
}

/** 
 * Gets the specific port position defined by the component.
 * Ports define their grid position relative to the component's (0,0) top-left pin.
 */
export function getPortPosition(port: { x: number; y: number }): { x: number; y: number; length: number } {
    // We return length=10 (one grid unit) for drawing lines extending outward
    return {
        x: port.x * 10,
        y: port.y * 10,
        length: 10
    };
}
