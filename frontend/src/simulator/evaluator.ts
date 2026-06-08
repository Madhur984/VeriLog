import { Component, WireConnection } from './types';

export const evaluateCircuit = (
    components: Record<string, Component>,
    wires: Record<string, WireConnection>
) => {
    // 1. Reset
    Object.values(components).forEach(c => {
        if (c.type !== 'battery' && c.type !== 'switch') {
            c.state = 'off';
            c.outputs.forEach(p => p.value = false);
        }
    });

    // 2. Propagate Signal (3 passes)
    for (let pass = 0; pass < 3; pass++) {
        // Wires transfer signal
        Object.values(wires).forEach(wire => {
            const sourceComp = Object.values(components).find(c => c.outputs.some(p => p.id === wire.fromPinId));
            const destComp = Object.values(components).find(c => c.inputs.some(p => p.id === wire.toPinId));

            if (sourceComp && destComp) {
                const sourcePin = sourceComp.outputs.find(p => p.id === wire.fromPinId);
                const destPin = destComp.inputs.find(p => p.id === wire.toPinId);
                if (sourcePin && destPin) {
                    wire.active = sourcePin.value;
                    destPin.value = sourcePin.value;
                }
            }
        });

        // Components process logic
        Object.values(components).forEach(c => {
            const inputs = c.inputs.map(p => p.value);
            const anyHigh = inputs.some(Boolean);
            const allHigh = inputs.length > 0 && inputs.every(Boolean);
            // Odd-parity → true for an odd number of high inputs (2-input XOR generalises cleanly).
            const oddParity = inputs.reduce<boolean>((acc, v) => acc !== !!v, false);

            // Combinational gate output, or null for non-gate components handled below.
            let out: boolean | null = null;
            switch (c.type) {
                case 'and-gate': case 'and': out = allHigh; break;
                case 'or-gate': case 'or': out = anyHigh; break;
                case 'nand-gate': out = !allHigh; break;
                case 'nor-gate': out = !anyHigh; break;
                case 'xor-gate': out = oddParity; break;
                case 'xnor-gate': out = !oddParity; break;
                case 'not-gate': out = !(inputs[0] ?? false); break;
                case 'led': {
                    c.state = inputs[0] ? 'on' : 'off';
                    break;
                }
                case 'resistor': {
                    const a = inputs[0] ?? false;
                    c.state = a ? 'active' : 'off';
                    if (c.outputs[0]) c.outputs[0].value = a; // guarded: gate may have no output pin
                    break;
                }
            }

            if (out !== null) {
                c.state = out ? 'active' : 'off';
                // Guard against a malformed gate with no output pin (previously this
                // threw "Cannot set properties of undefined" and broke the engine).
                if (c.outputs[0]) c.outputs[0].value = out;
            }
        });
    }
};
