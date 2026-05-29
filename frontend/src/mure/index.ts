/**
 * mure/index.ts - Barrel Exports for MURE Engine
 *
 * Single import point for all public MURE types and classes.
 */

// ─── Core ─────────────────────────────────────────────────────────────
export { MUREEngine } from './MUREEngine';
export { SimulationController } from './SimulationController';

// ─── Types ────────────────────────────────────────────────────────────
export type { PortState } from './core/Port';
export { DriveStrength, createPort, portHigh, portLow, portFromVoltage } from './core/Port';

export type { SignalNode, NodeId, NodeParams } from './core/SignalNode';
export { NodeType, createSignalNode } from './core/SignalNode';

export type { SignalEdge, EdgeId } from './core/SignalEdge';
export { createEdge } from './core/SignalEdge';

export { SignalGraph } from './core/SignalGraph';
export { SimulationKernel } from './core/SimulationKernel';
export { EventQueue } from './core/EventQueue';
export type { SimEvent } from './core/EventQueue';

// ─── Nodes ────────────────────────────────────────────────────────────
export { createBatteryNode } from './nodes/BatteryNode';
export { createWireNode } from './nodes/WireNode';
export { createLEDNode } from './nodes/LEDNode';
export { createSwitchNode, toggleSwitch } from './nodes/SwitchNode';
export { createResistorNode } from './nodes/ResistorNode';
export { createClockNode, tickClock } from './nodes/ClockNode';
export { createConstantNode } from './nodes/ConstantNode';
export { createLogicGateNode, generateTruthTable, getGateSpec } from './nodes/LogicGateNode';
export type { GateFunction } from './nodes/LogicGateNode';
export { createMuxNode } from './nodes/MuxNode';
export { createDecoderNode } from './nodes/DecoderNode';
export { createEncoderNode } from './nodes/EncoderNode';
export { createRegisterNode } from './nodes/RegisterNode';
export { createMemoryNode } from './nodes/MemoryNode';
export { createSevenSegmentNode } from './nodes/SevenSegmentNode';
export { createNodeByType } from './nodes/NodeRegistry';

// ─── Signals ──────────────────────────────────────────────────────────
export type { AnalogSignal } from './signals/AnalogSignal';
export { createAnalogSignal, clampVoltage, lerpVoltage, normalizeVoltage } from './signals/AnalogSignal';
export type { DigitalSignal } from './signals/DigitalSignal';
export { voltageToDigital, digitalToVoltage, boolToDigital, digitalToBool } from './signals/DigitalSignal';

// ─── Tracing ──────────────────────────────────────────────────────────
export { SignalTrace } from './tracing/SignalTrace';
export type { TraceData } from './tracing/SignalTrace';
