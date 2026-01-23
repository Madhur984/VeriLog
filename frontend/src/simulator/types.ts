export type ComponentType =
    | 'battery' | 'resistor' | 'switch' | 'led'
    | 'and-gate' | 'or-gate' | 'and' | 'or' | 'wire' | 'capacitor';

export interface Pin {
    id: string;
    componentId: string;
    type: 'input' | 'output';
    value: boolean;
}

export interface Component {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    rotation?: number;
    inputs: Pin[];
    outputs: Pin[];
    state: 'off' | 'on' | 'active';
}

export interface WireConnection {
    id: string;
    fromPinId: string;
    toPinId: string;
    active: boolean;
}