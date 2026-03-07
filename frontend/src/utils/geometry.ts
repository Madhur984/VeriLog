// Helper functions for SVG math (optional usage for advanced wire routing)

export const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const snapToGrid = (value: number, gridSize: number = 20) => {
    return Math.round(value / gridSize) * gridSize;
};

export const getMidpoint = (x1: number, y1: number, x2: number, y2: number) => {
    return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
    };
};
