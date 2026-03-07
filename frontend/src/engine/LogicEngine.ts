/**
 * engine/LogicEngine.ts — Legacy compatibility shim.
 * The canonical simulation engine is engine/CSE.ts.
 * This file re-exports from the new engine so existing call sites compile
 * during the migration period.
 */

export type {
    CircuitGraph as CircuitState,
    ComponentNode as Component,
    Connection,
} from './types';

export { CSE as LogicEngine } from './CSE';
