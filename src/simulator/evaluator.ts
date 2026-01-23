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
            switch (c.type) {
                case 'and-gate': {
                    const allHigh = c.inputs.length > 0 && c.inputs.every(p => p.value);
                    c.state = allHigh ? 'active' : 'off';
                    c.outputs[0].value = allHigh;
                    break;
                }
                case 'or-gate': {
                    const anyHigh = c.inputs.some(p => p.value);
                    c.state = anyHigh ? 'active' : 'off';
                    c.outputs[0].value = anyHigh;
                    break;
                }
                case 'led': {
                    const inputActive = c.inputs[0]?.value;
                    c.state = inputActive ? 'on' : 'off';
                    break;
                }
                case 'resistor': {
                    const inputActive = c.inputs[0]?.value;
                    c.state = inputActive ? 'active' : 'off';
                    if (c.outputs[0]) c.outputs[0].value = inputActive;
                    break;
                }
            }
        });
    }
};