import { registerComponent } from '../ComponentDef';

// Gates
import { AndGate, OrGate, NotGate, NandGate, NorGate, XorGate, XnorGate, BufferGate } from './gates';
// I/O
import { Button, LED, SevenSegment, Probe } from './io';
// Memory
import { DFlipFlop, Register, RAM } from './memory';
// Plexers
import { Multiplexer, Demultiplexer } from './plexers';
// Wiring
import { Pin, Constant, Clock, Splitter, Power, Ground, Tunnel } from './wiring';

export function registerAllComponents() {
    // Gates
    registerComponent(AndGate);
    registerComponent(OrGate);
    registerComponent(NotGate);
    registerComponent(NandGate);
    registerComponent(NorGate);
    registerComponent(XorGate);
    registerComponent(XnorGate);
    registerComponent(BufferGate);

    // I/O
    registerComponent(Button);
    registerComponent(LED);
    registerComponent(SevenSegment);
    registerComponent(Probe);

    // Memory
    registerComponent(DFlipFlop);
    registerComponent(Register);
    registerComponent(RAM);

    // Plexers
    registerComponent(Multiplexer);
    registerComponent(Demultiplexer);

    // Wiring
    registerComponent(Pin);
    registerComponent(Constant);
    registerComponent(Clock);
    registerComponent(Splitter);
    registerComponent(Power);
    registerComponent(Ground);
    registerComponent(Tunnel);
}
