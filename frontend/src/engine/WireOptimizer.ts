/**
 * engine/WireOptimizer.ts
 * 
 * Implements Logisim's wire topology cleanup rules:
 * 1. Collinear overlapping segments are merged.
 * 2. If a segment's endpoint lies strictly inside another segment, 
 *    the crossed segment is split into two.
 * 3. Crossing segments that don't end on each other are NOT split.
 * 
 * This ensures that T-junctions create 3 segments meeting at a point,
 * which cleanly translates to a 3-degree node in WireLayer for rendering a dot.
 */

export interface TempSeg {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    id?: string;
}

export function optimizeSegments(segments: TempSeg[], nextId: () => string): TempSeg[] {
    const H: TempSeg[] = [];
    const V: TempSeg[] = [];

    // 1. Normalize and separate
    for (const seg of segments) {
        let { x1, y1, x2, y2 } = seg;
        if (x1 === x2 && y1 === y2) continue; // Ignore point segments
        if (x1 > x2 || (x1 === x2 && y1 > y2)) {
            let t = x1; x1 = x2; x2 = t;
            t = y1; y1 = y2; y2 = t;
        }

        if (y1 === y2) {
            H.push({ ...seg, x1, y1, x2, y2 });
        } else if (x1 === x2) {
            V.push({ ...seg, x1, y1, x2, y2 });
        } else {
            // Not orthogonal? Should not happen in Logisim, but handle by ignoring or keeping as is.
        }
    }

    // 2. Merge overlapping collinear segments
    const mergedH = mergeCollinear(H, 'y1', 'x1', 'x2');
    const mergedV = mergeCollinear(V, 'x1', 'y1', 'y2');

    // 3. Find all endpoints for splitting
    const endpoints: { x: number, y: number }[] = [];
    for (const s of mergedH) {
        endpoints.push({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 });
    }
    for (const s of mergedV) {
        endpoints.push({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 });
    }

    // 4. Split segments
    const finalSegs: TempSeg[] = [];

    for (const s of mergedH) {
        const splitPoints = endpoints
            .filter(p => p.y === s.y1 && p.x > s.x1 && p.x < s.x2)
            .map(p => p.x)
            .sort((a, b) => a - b);

        // Remove duplicates
        const uniqueSplits = [...new Set(splitPoints)];

        if (uniqueSplits.length === 0) {
            finalSegs.push(s);
        } else {
            let currentX = s.x1;
            for (const sp of uniqueSplits) {
                finalSegs.push({ x1: currentX, y1: s.y1, x2: sp, y2: s.y2, id: nextId() });
                currentX = sp;
            }
            finalSegs.push({ x1: currentX, y1: s.y1, x2: s.x2, y2: s.y2, id: s.id || nextId() });
        }
    }

    for (const s of mergedV) {
        const splitPoints = endpoints
            .filter(p => p.x === s.x1 && p.y > s.y1 && p.y < s.y2)
            .map(p => p.y)
            .sort((a, b) => a - b);

        // Remove duplicates
        const uniqueSplits = [...new Set(splitPoints)];

        if (uniqueSplits.length === 0) {
            finalSegs.push(s);
        } else {
            let currentY = s.y1;
            for (const sp of uniqueSplits) {
                finalSegs.push({ x1: s.x1, y1: currentY, x2: s.x2, y2: sp, id: nextId() });
                currentY = sp;
            }
            finalSegs.push({ x1: s.x1, y1: currentY, x2: s.x2, y2: s.y2, id: s.id || nextId() });
        }
    }

    return finalSegs;
}

// Generic collinear merge
function mergeCollinear(
    segments: TempSeg[],
    axis: 'x1' | 'y1',
    startBase: 'x1' | 'y1',
    endBase: 'x2' | 'y2'
): TempSeg[] {
    const groups = new Map<number, TempSeg[]>();
    for (const s of segments) {
        const key = axis === 'x1' ? s.x1 : s.y1;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push({ ...s });
    }

    const merged: TempSeg[] = [];

    for (const [, group] of groups) {
        group.sort((a, b) => {
            const valA = startBase === 'x1' ? a.x1 : a.y1;
            const valB = startBase === 'x1' ? b.x1 : b.y1;
            return valA - valB;
        });

        let current = group[0];
        for (let i = 1; i < group.length; i++) {
            const next = group[i];
            const nextStart = startBase === 'x1' ? next.x1 : next.y1;
            const currentEnd = endBase === 'x2' ? current.x2 : current.y2;

            if (nextStart <= currentEnd) {
                // Overlap: extend current
                if (endBase === 'x2') {
                    current.x2 = Math.max(current.x2, next.x2);
                } else {
                    current.y2 = Math.max(current.y2, next.y2);
                }
                current.id = undefined;
            } else {
                // Gap
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);
    }

    return merged;
}
