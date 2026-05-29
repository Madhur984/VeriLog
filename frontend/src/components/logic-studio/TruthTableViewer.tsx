/**
 * TruthTableViewer.tsx - Auto-generated truth table for logic gates
 */

import { useMemo } from 'react';
import { NodeType } from '../../mure/core/SignalNode';

interface Props {
    gateType: NodeType;
    inputCount?: number;
    currentInputs?: boolean[];
}

type GateEvaluator = (inputs: boolean[]) => boolean;

const GATE_EVALUATORS: Partial<Record<NodeType, GateEvaluator>> = {
    [NodeType.AND]: (ins) => ins.every(Boolean),
    [NodeType.OR]: (ins) => ins.some(Boolean),
    [NodeType.NOT]: (ins) => !ins[0],
    [NodeType.NAND]: (ins) => !ins.every(Boolean),
    [NodeType.NOR]: (ins) => !ins.some(Boolean),
    [NodeType.XOR]: (ins) => ins.reduce((a, b) => a !== b, false),
    [NodeType.XNOR]: (ins) => !ins.reduce((a, b) => a !== b, false),
};

function generateRows(inputCount: number, evaluator: GateEvaluator) {
    const rows: { inputs: boolean[]; output: boolean }[] = [];
    const total = 1 << inputCount;

    for (let i = 0; i < total; i++) {
        const inputs: boolean[] = [];
        for (let b = inputCount - 1; b >= 0; b--) {
            inputs.push(Boolean((i >> b) & 1));
        }
        rows.push({ inputs, output: evaluator(inputs) });
    }

    return rows;
}

export function TruthTableViewer({ gateType, inputCount = 2, currentInputs }: Props) {
    const evaluator = GATE_EVALUATORS[gateType];
    const gateName = NodeType[gateType] || 'UNKNOWN';

    const rows = useMemo(() => {
        if (!evaluator) return [];
        return generateRows(gateType === NodeType.NOT ? 1 : inputCount, evaluator);
    }, [gateType, inputCount, evaluator]);

    const actualInputCount = gateType === NodeType.NOT ? 1 : inputCount;
    const inputLabels = Array.from({ length: actualInputCount }, (_, i) =>
        String.fromCharCode(65 + i) // A, B, C, ...
    );

    if (!evaluator) {
        return (
            <div className="studio-truth-table">
                <div className="studio-truth-table-header">{gateName}</div>
                <div className="studio-truth-table-empty">
                    No truth table for this component type.
                </div>
            </div>
        );
    }

    const isCurrentRow = (row: { inputs: boolean[] }) => {
        if (!currentInputs) return false;
        return row.inputs.every((v, i) => v === currentInputs[i]);
    };

    return (
        <div className="studio-truth-table">
            <div className="studio-truth-table-header">
                {gateName} Gate - Truth Table
            </div>
            <table className="studio-truth-table-grid">
                <thead>
                    <tr>
                        {inputLabels.map((label) => (
                            <th key={label}>{label}</th>
                        ))}
                        <th className="studio-truth-table-output">Q</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            className={isCurrentRow(row) ? 'studio-truth-table-row--active' : ''}
                        >
                            {row.inputs.map((val, j) => (
                                <td key={j} className={val ? 'studio-tt-high' : 'studio-tt-low'}>
                                    {val ? '1' : '0'}
                                </td>
                            ))}
                            <td
                                className={`studio-truth-table-output ${row.output ? 'studio-tt-high' : 'studio-tt-low'
                                    }`}
                            >
                                {row.output ? '1' : '0'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
