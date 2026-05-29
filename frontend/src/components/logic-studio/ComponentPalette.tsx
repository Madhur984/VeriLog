/**
 * ComponentPalette.tsx - Categorized drag-to-add component list
 */

import { NodeType } from '../../mure/core/SignalNode';

interface PaletteItem {
    type: NodeType;
    label: string;
    icon: string;
}

interface PaletteCategory {
    name: string;
    items: PaletteItem[];
}

const CATEGORIES: PaletteCategory[] = [
    {
        name: 'Sources',
        items: [
            { type: NodeType.BATTERY, label: 'Battery', icon: '🔋' },
            { type: NodeType.CLOCK, label: 'Clock', icon: '⏰' },
            { type: NodeType.CONSTANT, label: 'Constant', icon: '1️⃣' },
        ],
    },
    {
        name: 'Logic Gates',
        items: [
            { type: NodeType.AND, label: 'AND', icon: '&' },
            { type: NodeType.OR, label: 'OR', icon: '≥1' },
            { type: NodeType.NOT, label: 'NOT', icon: '!' },
            { type: NodeType.NAND, label: 'NAND', icon: '⊼' },
            { type: NodeType.NOR, label: 'NOR', icon: '⊽' },
            { type: NodeType.XOR, label: 'XOR', icon: '⊕' },
            { type: NodeType.XNOR, label: 'XNOR', icon: '⊙' },
        ],
    },
    {
        name: 'I/O',
        items: [
            { type: NodeType.LED, label: 'LED', icon: '💡' },
            { type: NodeType.SWITCH, label: 'Switch', icon: '🔘' },
            { type: NodeType.SEVEN_SEGMENT, label: '7-Seg', icon: '🔢' },
        ],
    },
    {
        name: 'Advanced',
        items: [
            { type: NodeType.MUX, label: 'MUX', icon: '🔀' },
            { type: NodeType.DECODER, label: 'Decoder', icon: '📤' },
            { type: NodeType.ENCODER, label: 'Encoder', icon: '📥' },
            { type: NodeType.REGISTER, label: 'Register', icon: '📦' },
            { type: NodeType.MEMORY, label: 'Memory', icon: '💾' },
            { type: NodeType.RESISTOR, label: 'Resistor', icon: 'Ω' },
            { type: NodeType.WIRE, label: 'Wire', icon: '━' },
        ],
    },
];

interface Props {
    onAddComponent: (type: NodeType) => void;
}

export function ComponentPalette({ onAddComponent }: Props) {
    return (
        <div className="studio-palette">
            <div className="studio-palette-header">Components</div>
            {CATEGORIES.map((cat) => (
                <div key={cat.name} className="studio-palette-category">
                    <div className="studio-palette-category-name">{cat.name}</div>
                    <div className="studio-palette-items">
                        {cat.items.map((item) => (
                            <button
                                key={item.type}
                                className="studio-palette-item"
                                onClick={() => onAddComponent(item.type)}
                                title={item.label}
                            >
                                <span className="studio-palette-icon">{item.icon}</span>
                                <span className="studio-palette-label">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
