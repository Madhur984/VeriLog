/**
 * Utility functions for drawing and visualizing circuits
 */

export const drawGate = (type: 'AND' | 'OR' | 'NOT', x: number, y: number) => {
  // Placeholder for future SVG generation
  return { type, x, y };
};

export const getConnectorPath = (start: {x: number, y: number}, end: {x: number, y: number}) => {
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
};
