/**
 * CircuitBackground.tsx
 *
 * GPU-accelerated canvas particle engine for the Login page.
 * 60 FPS floating circuit nodes + signal pulses + cursor reactivity.
 *
 * Architecture:
 *  - All state lives in refs (no React re-renders during animation)
 *  - Single rAF loop; cleanup on unmount
 *  - Respects prefers-reduced-motion
 */
import { useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    pulse: number;       // 0→1 glow phase
    pulseSpeed: number;
}

interface Pulse {
    fromIdx: number;
    toIdx: number;
    progress: number;   // 0→1 travel position
    speed: number;
    color: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_COUNT = 55;
const CONNECTION_DIST = 160;  // px — max edge draw distance
const CURSOR_ATTRACT_DIST = 180;
const CURSOR_ATTRACT_FORCE = 0.018;
const DRIFT = 0.3;  // max random velocity

const COLORS = {
    node: '#00D4FF',
    nodeSecondary: '#10B981',
    edgeDim: 'rgba(0,212,255,0.07)',
    edgeActive: 'rgba(0,212,255,0.22)',
    pulseBlue: '#00D4FF',
    pulseGreen: '#10B981',
    bg: '#080B12',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function dist(ax: number, ay: number, bx: number, by: number) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
}

// ── Component ─────────────────────────────────────────────────────────────────

export const CircuitBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const nodesRef = useRef<Node[]>([]);
    const pulsesRef = useRef<Pulse[]>([]);
    const cursorRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect prefers-reduced-motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ── Resize / DPI ──────────────────────────────────────────────────────
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Init nodes ────────────────────────────────────────────────────────
        nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
            x: rand(0, window.innerWidth),
            y: rand(0, window.innerHeight),
            vx: rand(-DRIFT, DRIFT),
            vy: rand(-DRIFT, DRIFT),
            radius: rand(2, 4.5),
            pulse: Math.random(),
            pulseSpeed: rand(0.005, 0.018),
        }));

        // ── Seed a few initial pulses ─────────────────────────────────────────
        const spawnPulse = () => {
            const nodes = nodesRef.current;
            const fromIdx = Math.floor(Math.random() * nodes.length);
            const candidates: number[] = [];
            for (let i = 0; i < nodes.length; i++) {
                if (i === fromIdx) continue;
                if (dist(nodes[fromIdx].x, nodes[fromIdx].y, nodes[i].x, nodes[i].y) < CONNECTION_DIST) {
                    candidates.push(i);
                }
            }
            if (candidates.length > 0) {
                pulsesRef.current.push({
                    fromIdx,
                    toIdx: candidates[Math.floor(Math.random() * candidates.length)],
                    progress: 0,
                    speed: rand(0.006, 0.015),
                    color: Math.random() > 0.5 ? COLORS.pulseBlue : COLORS.pulseGreen,
                });
            }
        };

        for (let i = 0; i < 6; i++) spawnPulse();

        // Spawn new pulses periodically
        const spawnInterval = setInterval(() => {
            if (pulsesRef.current.length < 12) spawnPulse();
        }, 900);

        // ── Cursor tracking ───────────────────────────────────────────────────
        const onMove = (e: MouseEvent) => {
            cursorRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMove);

        // ── Main render loop ──────────────────────────────────────────────────
        const draw = () => {
            const W = window.innerWidth;
            const H = window.innerHeight;
            const nodes = nodesRef.current;
            const cursor = cursorRef.current;

            // Clear
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = COLORS.bg;
            ctx.fillRect(0, 0, W, H);

            // Update + draw nodes
            for (const n of nodes) {
                if (!prefersReduced) {
                    // Cursor attraction
                    const dx = cursor.x - n.x;
                    const dy = cursor.y - n.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < CURSOR_ATTRACT_DIST) {
                        const force = (1 - d / CURSOR_ATTRACT_DIST) * CURSOR_ATTRACT_FORCE;
                        n.vx += dx * force * 0.01;
                        n.vy += dy * force * 0.01;
                    }

                    // Dampen velocity
                    n.vx *= 0.99;
                    n.vy *= 0.99;

                    // Move
                    n.x += n.vx;
                    n.y += n.vy;

                    // Wrap around edges
                    if (n.x < -20) n.x = W + 20;
                    if (n.x > W + 20) n.x = -20;
                    if (n.y < -20) n.y = H + 20;
                    if (n.y > H + 20) n.y = -20;

                    // Pulse phase
                    n.pulse = (n.pulse + n.pulseSpeed) % 1;
                }

                // Draw node
                const glow = 0.4 + 0.6 * Math.sin(n.pulse * Math.PI * 2);
                ctx.save();
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = COLORS.node;
                ctx.globalAlpha = 0.15 + 0.55 * glow;
                ctx.fill();
                // Outer glow halo
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
                grad.addColorStop(0, `rgba(0,212,255,${0.25 * glow})`);
                grad.addColorStop(1, 'rgba(0,212,255,0)');
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.globalAlpha = 1;
                ctx.fill();
                ctx.restore();
            }

            // Draw edges
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    if (d < CONNECTION_DIST) {
                        const alpha = (1 - d / CONNECTION_DIST) * 0.18;
                        ctx.save();
                        ctx.strokeStyle = COLORS.edgeDim;
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            // Draw + advance pulses
            pulsesRef.current = pulsesRef.current.filter(p => {
                const from = nodes[p.fromIdx];
                const to = nodes[p.toIdx];
                if (!from || !to) return false;
                const d = dist(from.x, from.y, to.x, to.y);
                if (d > CONNECTION_DIST * 1.2) return false;

                const px = from.x + (to.x - from.x) * p.progress;
                const py = from.y + (to.y - from.y) * p.progress;

                // Trail
                const trailLen = 0.15;
                const trailStart = Math.max(0, p.progress - trailLen);
                const tx = from.x + (to.x - from.x) * trailStart;
                const ty = from.y + (to.y - from.y) * trailStart;

                ctx.save();
                const lineGrad = ctx.createLinearGradient(tx, ty, px, py);
                lineGrad.addColorStop(0, 'rgba(0,212,255,0)');
                lineGrad.addColorStop(1, p.color);
                ctx.strokeStyle = lineGrad;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(px, py);
                ctx.stroke();
                // Pulse head dot
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.9;
                ctx.fill();
                ctx.restore();

                if (!prefersReduced) {
                    p.progress += p.speed;
                }
                return p.progress < 1.0;
            });

            // Cursor electric ripple
            if (cursor.x > 0 && !prefersReduced) {
                ctx.save();
                const rippleGrad = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 40);
                rippleGrad.addColorStop(0, 'rgba(0,212,255,0.08)');
                rippleGrad.addColorStop(1, 'rgba(0,212,255,0)');
                ctx.beginPath();
                ctx.arc(cursor.x, cursor.y, 40, 0, Math.PI * 2);
                ctx.fillStyle = rippleGrad;
                ctx.fill();
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearInterval(spawnInterval);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                pointerEvents: 'none',
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    );
};
