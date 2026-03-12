import { LogicState, SubcircuitData, CanvasNodeData } from '../types/circuit';
import { NetlistCompiler } from './NetlistCompiler';
import { SimEngine } from './SimEngine';

/**
 * An isolated simulation environment that acts as a single component to its parent,
 * but runs a full nested circuit evaluation internally.
 */
export class SubcircuitEnv {
    
    private internalEngine: SimEngine;
    
    /** Maps Parent Input Port Names -> Internal Net IDs attached to the 'Pin' components */
    private inputBindings: Map<string, string> = new Map();
    /** Maps Internal Output Net IDs attached to 'Pin' components -> Parent Output Port Names */
    private outputBindings: Map<string, string> = new Map();
    
    /** Identifies internal nodes that act as boundary interfaces */
    private interfaceNodes: { id: string, name: string, dir: 'INPUT' | 'OUTPUT' }[] = [];

    constructor(
        public readonly data: SubcircuitData,
        private readonly parentCurrentTimeNs: () => number
    ) {
        this.internalEngine = new SimEngine();
        
        // 1. Identify Pin components that define the I/O interface
        this.interfaceNodes = data.nodes
            .filter(n => n.type === 'PIN')
            .map(n => ({
                id: n.id,
                name: n.parameters.label || n.id,
                dir: n.parameters.isOutput ? 'OUTPUT' : 'INPUT' 
                // Note: To a subcircuit, an internal "Output Pin" drives the PARENT's output port.
                // An internal "Input Pin" receives signals from the PARENT's input port.
            }));

        // 2. Compile internal netlist.
        // We need a dummy port resolver. In a real implementation, this references GateShapes.
        const mockPortResolver = (node: CanvasNodeData) => {
            if (node.type === 'PIN') {
                 // A pin only has one internal connection point
                 return [{ nodeId: node.id, portName: 'pin', x: node.x, y: node.y, direction: node.parameters.isOutput ? 'INPUT' : 'OUTPUT' as 'INPUT' | 'OUTPUT' }];
            }
            // For standard gates inside the subcircuit, we'd lookup their port definitions.
            return [];
        };

        const compiled = NetlistCompiler.compile(data.nodes, data.segments, mockPortResolver);
        this.internalEngine.loadTopology(compiled.nets, compiled.portToNet);

        // 3. Map the compiled internal nets to the named interface bounds
        for (const pin of this.interfaceNodes) {
             const internalPortId = `${pin.id}:pin`;
             const internalNetId = compiled.portToNet.get(internalPortId);
             
             if (!internalNetId) continue; // Unconnected pin

             if (pin.dir === 'INPUT') {
                 // Parent drives -> Internal Input Pin -> Internal Net
                 this.inputBindings.set(pin.name, internalNetId);
             } else {
                 // Internal Net -> Internal Output Pin -> Parent Output Port
                 this.outputBindings.set(internalNetId, pin.name);
             }
        }
    }

    /**
     * Executes the subcircuit based on new inputs from the parent.
     * @returns Only the changed outputs that the parent needs to know about.
     */
    public eval(inputs: Record<string, LogicState>): Record<string, LogicState> {
        const timeNs = this.parentCurrentTimeNs();

        // 1. Inject parent inputs immediately into the internal engine's root nets
        for (const [portName, state] of Object.entries(inputs)) {
            const internalNet = this.inputBindings.get(portName);
            if (internalNet && this.internalEngine.netValues[internalNet] !== state) {
                // Force state update (act as infinite driver)
                this.internalEngine.netValues[internalNet] = state;
                
                // Wake internal listeners attached to this input net
                const listeners = (this.internalEngine as any).nets[internalNet]?.listeners || [];
                for(const l of listeners) {
                     this.internalEngine.portStates[l] = state;
                     // In full implementation, we queue evaluation of components attached to 'l'
                }
            }
        }

        // 2. Fast-forward internal engine to catch up to parent time
        this.internalEngine.tick(timeNs);

        // 3. Extract settled internal outputs to pass back to parent
        const outputs: Record<string, LogicState> = {};
        for (const [internalNet, parentPortName] of this.outputBindings.entries()) {
            outputs[parentPortName] = this.internalEngine.netValues[internalNet] || 'Z';
        }

        return outputs;
    }
}
