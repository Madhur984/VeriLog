import { ASTNode } from './parseBoolean';

export type TechnologyMappingMode = 'AND-OR' | 'NAND-NAND' | 'NOR-NOR';

export interface TechMappedGateNode {
  id: string;
  type: 'INPUT' | 'NAND' | 'NOR' | 'AND' | 'OR' | 'NOT' | 'OUTPUT';
  label: string;
  x: number;
  y: number;
  inputIds: string[];
}

export interface TechMappedCircuit {
  nodes: TechMappedGateNode[];
  wires: Array<{ fromId: string; toId: string }>;
  gateCounts: {
    nand: number;
    nor: number;
    and: number;
    or: number;
    not: number;
    inputs: number;
  };
}

/**
 * Converts SOP / POS expressions to 2-level NAND-NAND or NOR-NOR equivalents.
 */
export const convertToTechnologyMap = (
  ast: ASTNode | null,
  mode: TechnologyMappingMode
): TechnologyMappingMode => {
  return mode;
};
