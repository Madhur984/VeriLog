/**
 * Circuit Builder
 * Converts an ASTNode into a positioned gate graph suitable for SVG rendering.
 */

import { ASTNode } from './parseBoolean';

// ---------- Types ----------

export type GateType = 'INPUT' | 'NOT' | 'AND' | 'OR' | 'OUTPUT';

export interface GateNode {
  id: string;
  type: GateType;
  label: string;
  x: number;
  y: number;
  /** IDs of gates that feed into this gate's inputs */
  inputIds: string[];
}

export interface CircuitGraph {
  nodes: GateNode[];
  /** Wire connections: from.output → to.input at toPort index */
  wires: Array<{ fromId: string; toId: string }>;
}

// ---------- Layout constants ----------
const COL_WIDTH = 140;
const ROW_HEIGHT = 72;
const PADDING_X = 60;
const PADDING_Y = 50;

// ---------- Builder state ----------
let nodeCounter = 0;
const nodeMap = new Map<string, GateNode>();
const wires: Array<{ fromId: string; toId: string }> = [];

function freshId(prefix: string): string {
  return `${prefix}_${nodeCounter++}`;
}

function addWire(fromId: string, toId: string) {
  wires.push({ fromId, toId });
}

// ---------- Recursive AST → node builder ----------

function buildNode(ast: ASTNode, inputNodeMap: Map<string, GateNode>): GateNode {
  switch (ast.type) {
    case 'VAR': {
      // Reuse existing input node for same variable
      const existing = inputNodeMap.get(ast.name);
      if (existing) return existing;
      const node: GateNode = {
        id: freshId('input'),
        type: 'INPUT',
        label: ast.name,
        x: 0, y: 0,
        inputIds: [],
      };
      inputNodeMap.set(ast.name, node);
      nodeMap.set(node.id, node);
      return node;
    }

    case 'NOT': {
      const inputNode = buildNode(ast.input, inputNodeMap);
      const node: GateNode = {
        id: freshId('not'),
        type: 'NOT',
        label: "NOT",
        x: 0, y: 0,
        inputIds: [inputNode.id],
      };
      nodeMap.set(node.id, node);
      addWire(inputNode.id, node.id);
      return node;
    }

    case 'AND': {
      const inputNodes = ast.inputs.map(inp => buildNode(inp, inputNodeMap));
      const node: GateNode = {
        id: freshId('and'),
        type: 'AND',
        label: 'AND',
        x: 0, y: 0,
        inputIds: inputNodes.map(n => n.id),
      };
      nodeMap.set(node.id, node);
      inputNodes.forEach(n => addWire(n.id, node.id));
      return node;
    }

    case 'OR': {
      const inputNodes = ast.inputs.map(inp => buildNode(inp, inputNodeMap));
      const node: GateNode = {
        id: freshId('or'),
        type: 'OR',
        label: 'OR',
        x: 0, y: 0,
        inputIds: inputNodes.map(n => n.id),
      };
      nodeMap.set(node.id, node);
      inputNodes.forEach(n => addWire(n.id, node.id));
      return node;
    }
  }
}

// ---------- Level assignment ----------

function assignLevels(nodes: GateNode[]): Map<string, number> {
  const levels = new Map<string, number>();

  function getLevel(id: string): number {
    if (levels.has(id)) return levels.get(id)!;
    const node = nodeMap.get(id)!;
    if (node.inputIds.length === 0) {
      levels.set(id, 0);
      return 0;
    }
    const maxInput = Math.max(...node.inputIds.map(getLevel));
    const level = maxInput + 1;
    levels.set(id, level);
    return level;
  }

  nodes.forEach(n => getLevel(n.id));
  return levels;
}

// ---------- Layout: assign x, y ----------

function layoutNodes(nodes: GateNode[], outputId: string): void {
  const levels = assignLevels(nodes);

  // Group by level
  const byLevel = new Map<number, GateNode[]>();
  nodes.forEach(n => {
    const lv = levels.get(n.id) ?? 0;
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(n);
  });

  // Find max level to push output to the right
  const maxLevel = Math.max(...Array.from(levels.values()));

  // OUTPUT node: place at maxLevel + 1
  const outputNode = nodeMap.get(outputId);
  if (outputNode) {
    const outLv = maxLevel + 1;
    outputNode.x = PADDING_X + outLv * COL_WIDTH;
  }

  // Assign x/y for each level group
  byLevel.forEach((groupNodes, level) => {
    const totalHeight = (groupNodes.length - 1) * ROW_HEIGHT;
    groupNodes.forEach((node, i) => {
      node.x = PADDING_X + level * COL_WIDTH;
      node.y = PADDING_Y + i * ROW_HEIGHT - totalHeight / 2 + 200; // vertically center
    });
  });

  // Place output node vertically at center
  if (outputNode) {
    const lv = maxLevel + 1;
    outputNode.x = PADDING_X + lv * COL_WIDTH;
    outputNode.y = PADDING_Y + 200;
  }
}

// ---------- Public API ----------

export function buildCircuit(ast: ASTNode): CircuitGraph {
  // Reset state
  nodeCounter = 0;
  nodeMap.clear();
  wires.length = 0;

  const inputNodeMap = new Map<string, GateNode>();
  const rootNode = buildNode(ast, inputNodeMap);

  // Add OUTPUT node
  const outputNode: GateNode = {
    id: 'output',
    type: 'OUTPUT',
    label: 'F',
    x: 0, y: 0,
    inputIds: [rootNode.id],
  };
  nodeMap.set('output', outputNode);
  addWire(rootNode.id, 'output');

  const allNodes = Array.from(nodeMap.values());
  layoutNodes(allNodes, 'output');

  // Center vertically: shift all nodes so centroid is at a fixed y
  const ys = allNodes.map(n => n.y);
  const minY = Math.min(...ys);
  const shift = PADDING_Y - minY + 20;
  allNodes.forEach(n => { n.y += shift; });

  return {
    nodes: allNodes,
    wires: [...wires],
  };
}

/**
 * Compute the total SVG canvas size needed.
 */
export function getCanvasSize(nodes: GateNode[]): { width: number; height: number } {
  if (nodes.length === 0) return { width: 600, height: 300 };
  const maxX = Math.max(...nodes.map(n => n.x)) + COL_WIDTH;
  const maxY = Math.max(...nodes.map(n => n.y)) + ROW_HEIGHT;
  return {
    width: Math.max(maxX + PADDING_X, 600),
    height: Math.max(maxY + PADDING_Y, 300),
  };
}
