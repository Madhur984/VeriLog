/**
 * WaveformExporter.tsx — Export waveform data as VCD or CSV
 *
 * Provides export buttons and format selection for oscilloscope data.
 */

import { useCallback, memo } from 'react';

export interface WaveformSample {
    time: number;
    voltage: number;
    logic: boolean;
}

export interface WaveformChannel {
    name: string;
    nodeId: string;
    portIndex: number;
    samples: WaveformSample[];
}

interface WaveformExporterProps {
    channels: WaveformChannel[];
}

export const WaveformExporter = memo(({ channels }: WaveformExporterProps) => {
    const exportCSV = useCallback(() => {
        if (channels.length === 0) return;

        // Build CSV header
        const headers = ['Time(ns)', ...channels.map(ch => `${ch.name}_V`), ...channels.map(ch => `${ch.name}_Logic`)];

        // Find all unique timestamps
        const allTimes = new Set<number>();
        for (const ch of channels) {
            for (const s of ch.samples) allTimes.add(s.time);
        }
        const sortedTimes = [...allTimes].sort((a, b) => a - b);

        // Build rows
        const rows = sortedTimes.map(t => {
            const voltages = channels.map(ch => {
                const sample = ch.samples.find(s => s.time === t);
                return sample ? sample.voltage.toFixed(3) : '';
            });
            const logics = channels.map(ch => {
                const sample = ch.samples.find(s => s.time === t);
                return sample ? (sample.logic ? '1' : '0') : '';
            });
            return [t, ...voltages, ...logics].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        download(csv, 'waveform_export.csv', 'text/csv');
    }, [channels]);

    const exportVCD = useCallback(() => {
        if (channels.length === 0) return;

        const lines: string[] = [];

        // VCD Header
        lines.push('$date ' + new Date().toISOString() + ' $end');
        lines.push('$version DigiLogic Workbench 1.0 $end');
        lines.push('$timescale 1ns $end');
        lines.push('$scope module circuit $end');

        // Variable declarations
        const symbols = 'abcdefghijklmnopqrstuvwxyz';
        channels.forEach((ch, i) => {
            const sym = symbols[i] || `s${i}`;
            lines.push(`$var wire 1 ${sym} ${ch.name} $end`);
        });

        lines.push('$upscope $end');
        lines.push('$enddefinitions $end');

        // Initial values
        lines.push('#0');
        channels.forEach((ch, i) => {
            const sym = symbols[i] || `s${i}`;
            const first = ch.samples[0];
            lines.push(`${first?.logic ? '1' : '0'}${sym}`);
        });

        // Value changes
        const allTimes = new Set<number>();
        for (const ch of channels) {
            for (const s of ch.samples) allTimes.add(s.time);
        }
        const sortedTimes = [...allTimes].sort((a, b) => a - b);

        for (const t of sortedTimes) {
            if (t === 0) continue;
            lines.push(`#${t}`);
            channels.forEach((ch, i) => {
                const sym = symbols[i] || `s${i}`;
                const sample = ch.samples.find(s => s.time === t);
                if (sample) {
                    lines.push(`${sample.logic ? '1' : '0'}${sym}`);
                }
            });
        }

        const vcd = lines.join('\n');
        download(vcd, 'waveform_export.vcd', 'text/plain');
    }, [channels]);

    return (
        <div style={{
            display: 'flex',
            gap: 4,
            padding: '4px 8px',
            fontFamily: "'IBM Plex Mono', monospace",
        }}>
            <button
                onClick={exportCSV}
                disabled={channels.length === 0}
                style={exportBtnStyle(channels.length === 0)}
            >
                📄 Export CSV
            </button>
            <button
                onClick={exportVCD}
                disabled={channels.length === 0}
                style={exportBtnStyle(channels.length === 0)}
            >
                📊 Export VCD
            </button>
            <span style={{
                flex: 1,
                textAlign: 'right',
                color: 'rgba(255,255,255,0.15)',
                fontSize: 9,
                alignSelf: 'center',
            }}>
                {channels.length} channels
            </span>
        </div>
    );
});

WaveformExporter.displayName = 'WaveformExporter';

function exportBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        background: disabled ? 'none' : 'rgba(0, 212, 255, 0.04)',
        border: '1px solid rgba(0, 212, 255, 0.1)',
        color: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)',
        fontSize: 9,
        padding: '3px 8px',
        borderRadius: 3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'all 100ms',
    };
}

function download(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
