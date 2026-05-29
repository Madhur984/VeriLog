/**
 * commands.ts - Command registry for the Engineering Workbench
 *
 * Each command has an id, label, category, shortcut hint, and action callback.
 * Used by the Command Palette for fuzzy-search execution.
 */

export interface WorkbenchCommand {
    id: string;
    label: string;
    category: 'gate' | 'tool' | 'simulation' | 'view' | 'navigation';
    shortcut?: string;
    icon: string;
    action: () => void;
}

/**
 * Creates the command registry. Actions are injected from the workbench context.
 */
export function createCommandRegistry(actions: {
    addGate: (type: string) => void;
    setTool: (tool: string) => void;
    simControl: (cmd: 'play' | 'pause' | 'step' | 'reset') => void;
    togglePanel: (id: string) => void;
    navigate: (path: string) => void;
}): WorkbenchCommand[] {
    return [
        // ── Gates ────────────────────────────────────────
        { id: 'add-and', label: 'Add AND Gate', category: 'gate', shortcut: 'A', icon: '∧', action: () => actions.addGate('AND') },
        { id: 'add-or', label: 'Add OR Gate', category: 'gate', shortcut: 'O', icon: '∨', action: () => actions.addGate('OR') },
        { id: 'add-not', label: 'Add NOT Gate', category: 'gate', shortcut: 'N', icon: '¬', action: () => actions.addGate('NOT') },
        { id: 'add-nand', label: 'Add NAND Gate', category: 'gate', icon: '⊼', action: () => actions.addGate('NAND') },
        { id: 'add-nor', label: 'Add NOR Gate', category: 'gate', icon: '⊽', action: () => actions.addGate('NOR') },
        { id: 'add-xor', label: 'Add XOR Gate', category: 'gate', icon: '⊕', action: () => actions.addGate('XOR') },
        { id: 'add-xnor', label: 'Add XNOR Gate', category: 'gate', icon: '⊙', action: () => actions.addGate('XNOR') },
        { id: 'add-switch', label: 'Add Switch (Input)', category: 'gate', icon: '🔘', action: () => actions.addGate('SWITCH') },
        { id: 'add-led', label: 'Add LED (Output)', category: 'gate', icon: '💡', action: () => actions.addGate('LED') },
        { id: 'add-clock', label: 'Add Clock Source', category: 'gate', icon: '⏱', action: () => actions.addGate('CLOCK') },

        // ── Tools ────────────────────────────────────────
        { id: 'tool-select', label: 'Select Tool', category: 'tool', shortcut: 'V', icon: '🖱', action: () => actions.setTool('select') },
        { id: 'tool-wire', label: 'Wire Tool', category: 'tool', shortcut: 'W', icon: '🔗', action: () => actions.setTool('wire') },
        { id: 'tool-probe', label: 'Signal Probe', category: 'tool', shortcut: 'P', icon: '📍', action: () => actions.setTool('probe') },
        { id: 'tool-delete', label: 'Delete Tool', category: 'tool', shortcut: 'X', icon: '🗑', action: () => actions.setTool('delete') },

        // ── Simulation ───────────────────────────────────
        { id: 'sim-play', label: 'Run Simulation', category: 'simulation', shortcut: 'Space', icon: '▶', action: () => actions.simControl('play') },
        { id: 'sim-pause', label: 'Pause Simulation', category: 'simulation', icon: '⏸', action: () => actions.simControl('pause') },
        { id: 'sim-step', label: 'Step Clock', category: 'simulation', shortcut: 'S', icon: '⏭', action: () => actions.simControl('step') },
        { id: 'sim-reset', label: 'Reset Simulation', category: 'simulation', icon: '⏹', action: () => actions.simControl('reset') },

        // ── View ─────────────────────────────────────────
        { id: 'view-palette', label: 'Toggle Component Palette', category: 'view', icon: '📦', action: () => actions.togglePanel('palette') },
        { id: 'view-oscilloscope', label: 'Toggle Oscilloscope', category: 'view', icon: '📊', action: () => actions.togglePanel('oscilloscope') },
        { id: 'view-console', label: 'Toggle Console', category: 'view', shortcut: 'Ctrl+`', icon: '💬', action: () => actions.togglePanel('console') },

        // ── Navigation ───────────────────────────────────
        { id: 'nav-home', label: 'Go to Home', category: 'navigation', icon: '🏠', action: () => actions.navigate('/portal') },
        { id: 'nav-fsm', label: 'Open FSM Studio', category: 'navigation', icon: '🔄', action: () => actions.navigate('/fsm') },
        { id: 'nav-verilog', label: 'Open Verilog Playground', category: 'navigation', icon: '📝', action: () => actions.navigate('/verilog') },
        { id: 'nav-skill-tree', label: 'Open Skill Tree', category: 'navigation', icon: '🌲', action: () => actions.navigate('/skill-tree') },
        { id: 'nav-cpu', label: 'Open CPU Builder', category: 'navigation', icon: '🧠', action: () => actions.navigate('/cpu-builder') },
    ];
}
