export const ACTIVITIES = [
    {
        id: '1',
        title: 'Complete the Circuit',
        description: 'Drag the missing pieces to light up the bulb.',
        type: 'CIRCUIT_BUILD',
        initialComponents: [
            { id: 'bat1', type: 'BATTERY', position: { x: 50, y: 100 } },
            { id: 'led1', type: 'LED', position: { x: 450, y: 100 } } // Bulb on right
        ],
        requiredConnections: [
            { source: 'bat1', sourcePort: 'out', target: 'res1', targetPort: 'in' },
            { source: 'res1', sourcePort: 'out', target: 'led1', targetPort: 'in' }
        ],
        inventory: ['RESISTOR', 'WIRE_NODE']
    },
    {
        id: '2',
        title: 'AND Gate Decision',
        description: 'This gate only lights the LED when BOTH switches are ON.',
        type: 'LOGIC_GATE',
        initialComponents: [
            { id: 'sw1', type: 'SWITCH', position: { x: 50, y: 50 } },
            { id: 'sw2', type: 'SWITCH', position: { x: 50, y: 150 } },
            { id: 'led1', type: 'LED', position: { x: 400, y: 100 } }
        ],
        inventory: ['AND_GATE', 'OR_GATE']
    }
];
