/**
 * Snap utility for grid-based dragging
 */

export interface SnapConfig {
    gridSize?: number;
    snapPoints?: number[];
}

/**
 * Snaps a value to the nearest grid increment
 */
export const snapToGrid = (value: number, gridSize: number = 20): number => {
    return Math.round(value / gridSize) * gridSize;
};

/**
 * Snaps a value to the nearest point in an array
 */
export const snapToPoints = (value: number, points: number[]): number => {
    return points.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
};

/**
 * Snaps x and y coordinates to grid or specific points
 */
export const snapPosition = (
    x: number,
    y: number,
    config: {
        x?: SnapConfig;
        y?: SnapConfig;
        global?: number;
    } = {}
): { x: number; y: number } => {
    const globalSnap = config.global;

    // Handle X coordinate
    let snappedX = x;
    if (config.x?.snapPoints) {
        snappedX = snapToPoints(x, config.x.snapPoints);
    } else if (config.x?.gridSize) {
        snappedX = snapToGrid(x, config.x.gridSize);
    } else if (globalSnap) {
        snappedX = snapToGrid(x, globalSnap);
    }

    // Handle Y coordinate
    let snappedY = y;
    if (config.y?.snapPoints) {
        snappedY = snapToPoints(y, config.y.snapPoints);
    } else if (config.y?.gridSize) {
        snappedY = snapToGrid(y, config.y.gridSize);
    } else if (globalSnap) {
        snappedY = snapToGrid(y, globalSnap);
    }

    return { x: snappedX, y: snappedY };
};

/**
 * Gets the bounding box center of an element
 */
export const getElementCenter = (element: HTMLElement): { x: number; y: number } => {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
};

/**
 * Checks if a point is within a drop zone
 */
export const isInDropZone = (
    point: { x: number; y: number },
    zone: { x: number; y: number; width: number; height: number },
    tolerance: number = 20
): boolean => {
    return (
        point.x >= zone.x - tolerance &&
        point.x <= zone.x + zone.width + tolerance &&
        point.y >= zone.y - tolerance &&
        point.y <= zone.y + zone.height + tolerance
    );
};
