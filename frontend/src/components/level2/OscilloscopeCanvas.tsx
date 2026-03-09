/**
 * OscilloscopeCanvas.tsx
 *
 * High-performance canvas-based oscilloscope renderer.
 * Uses requestAnimationFrame + useRef — zero React state updates per frame.
 *
 * Props:
 *   ch1Samples  — Float32Array (0–1 normalized), CH1 = cyan
 *   ch2Samples  — Optional Float32Array, CH2 = orange
 *   showThreshold — Enable HIGH/LOW threshold overlay lines
 *   label1/label2 — Channel labels
 *   height — Canvas height in pixels (default 200)
 */

import { useRef, useEffect, memo } from 'react';

interface OscilloscopeCanvasProps {
    ch1Samples: Float32Array;
    ch2Samples?: Float32Array;
    showThreshold?: boolean;
    thresholdLow?: number;   // 0–1 normalized (default 0.16 = 0.8/5V)
    thresholdHigh?: number;  // 0–1 normalized (default 0.40 = 2.0/5V)
    label1?: string;
    label2?: string;
    height?: number;
    className?: string;
}

const GRID_COLOR = 'rgba(0,212,255,0.06)';
const CH1_COLOR = '#00D4FF';
const CH2_COLOR = '#F59E0B';
const LOW_COLOR = 'rgba(239,68,68,0.7)';
const HIGH_COLOR = 'rgba(16,185,129,0.7)';

function OscilloscopeCanvasInner({
    ch1Samples,
    ch2Samples,
    showThreshold = false,
    thresholdLow = 0.16,
    thresholdHigh = 0.40,
    label1 = 'CH1',
    label2 = 'CH2',
    height = 200,
    className,
}: OscilloscopeCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function draw() {
            if (!canvas || !ctx) return;
            const W = canvas.width;
            const H = canvas.height;

            // Clear
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#060912';
            ctx.fillRect(0, 0, W, H);

            // Grid
            ctx.strokeStyle = GRID_COLOR;
            ctx.lineWidth = 1;
            const COLS = 10, ROWS = 8;
            for (let i = 0; i <= COLS; i++) {
                const x = Math.round(i * W / COLS);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }
            for (let i = 0; i <= ROWS; i++) {
                const y = Math.round(i * H / ROWS);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }

            // Center line (zero reference)
            ctx.strokeStyle = 'rgba(0,212,255,0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(0, H * 0.5);
            ctx.lineTo(W, H * 0.5);
            ctx.stroke();
            ctx.setLineDash([]);

            // Threshold lines and logic band zones
            if (showThreshold) {
                const yLow = H - thresholdLow * H;
                const yHigh = H - thresholdHigh * H;

                // Zone background highlights
                ctx.fillStyle = LOW_COLOR.replace('0.7', '0.04');
                ctx.fillRect(0, yLow, W, H - yLow); // LOW zone background
                ctx.fillStyle = HIGH_COLOR.replace('0.7', '0.04');
                ctx.fillRect(0, 0, W, yHigh); // HIGH zone background
                ctx.fillStyle = 'rgba(245,158,11,0.03)';
                ctx.fillRect(0, yHigh, W, yLow - yHigh); // UNDEFINED zone background

                ctx.strokeStyle = LOW_COLOR;
                ctx.lineWidth = 1;
                ctx.setLineDash([6, 4]);
                ctx.beginPath();
                ctx.moveTo(0, yLow);
                ctx.lineTo(W, yLow);
                ctx.stroke();

                ctx.strokeStyle = HIGH_COLOR;
                ctx.beginPath();
                ctx.moveTo(0, yHigh);
                ctx.lineTo(W, yHigh);
                ctx.stroke();
                ctx.setLineDash([]);

                // Labels
                ctx.font = '9px "IBM Plex Mono", monospace';
                ctx.fillStyle = LOW_COLOR;
                ctx.fillText('LOW 0.8V', 4, yLow - 3);
                ctx.fillStyle = HIGH_COLOR;
                ctx.fillText('HIGH 2V', 4, yHigh - 3);
            }

            // Draw channel
            const drawChannel = (samples: Float32Array, color: string, yOffset = 0) => {
                if (!samples || samples.length === 0) return;
                const len = Math.min(samples.length, 256);
                const step = W / len;

                // Glow pass
                ctx.shadowColor = color;
                ctx.shadowBlur = 6;
                ctx.strokeStyle = color + '60';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 0; i < len; i++) {
                    const x = i * step;
                    const y = H - (samples[i] * H * 0.8 + H * 0.1) + yOffset;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Main trace
                ctx.shadowBlur = 0;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                for (let i = 0; i < len; i++) {
                    const x = i * step;
                    const y = H - (samples[i] * H * 0.8 + H * 0.1) + yOffset;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            };

            drawChannel(ch1Samples, CH1_COLOR);
            if (ch2Samples) drawChannel(ch2Samples, CH2_COLOR, -4);

            // Channel labels
            ctx.font = '9px "IBM Plex Mono", monospace';
            ctx.fillStyle = CH1_COLOR;
            ctx.fillText(label1, 8, 14);
            if (ch2Samples) {
                ctx.fillStyle = CH2_COLOR;
                ctx.fillText(label2, 8, 26);
            }

            // Peak voltage readout
            const peak1 = Math.max(...Array.from(ch1Samples)) * 5;
            ctx.fillStyle = 'rgba(0,212,255,0.85)';
            ctx.font = '10px "IBM Plex Mono", monospace';
            ctx.fillText(`${peak1.toFixed(2)}V PEAK`, W - 75, 14);

            // Axis labels (Feature 24)
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '8px "IBM Plex Mono", monospace';
            ctx.fillText('VOLTAGE (V)', 6, H - 6);
            ctx.fillText('TIME (ms)', W - 50, H - 6);

            // Origin label
            ctx.fillText('0,0', 4, H - 4);

            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
        // Intentionally excludes samples from deps — samples are refs updated externally
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showThreshold, thresholdLow, thresholdHigh, label1, label2, height]);

    return (
        <div className={`scope-canvas-wrapper ${className ?? ''}`} style={{ width: '100%', height }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={height}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div className="scope-scanline-overlay" />
        </div>
    );
}

export const OscilloscopeCanvas = memo(OscilloscopeCanvasInner);
