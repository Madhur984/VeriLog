import React, { useEffect, useRef } from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';

interface Pulse {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  maxLength: number;
  speed: number;
  color: string;
  history: { x: number; y: number }[];
}

export const LandingVisuals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [scheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const gridSize = 40;
    let pulses: Pulse[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const colorsDark = [
      'rgba(0, 245, 255, 0.35)', // Electric Laser Cyan
      'rgba(255, 95, 31, 0.25)',  // Burnished Copper
    ];

    const colorsLight = [
      'rgba(3, 105, 161, 0.25)',   // Deep Cobalt Blue
      'rgba(234, 88, 12, 0.20)',   // Burnished Amber
    ];

    const spawnPulse = (x: number, y: number, forceDir?: { dx: number; dy: number }) => {
      const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
      ];
      const dir = forceDir || directions[Math.floor(Math.random() * directions.length)];
      const colorsList = isDarkMode ? colorsDark : colorsLight;
      pulses.push({
        x,
        y,
        dx: dir.dx,
        dy: dir.dy,
        length: 0,
        maxLength: Math.floor(Math.random() * 4 + 2) * gridSize,
        speed: Math.random() * 1.5 + 1.2,
        color: colorsList[Math.random() < 0.85 ? 0 : 1],
        history: [{ x, y }],
      });
    };

    // Spawn initial random pulses
    const initPulsesCount = 10;
    const init = () => {
      for (let i = 0; i < initPulsesCount; i++) {
        const gridX = Math.floor(Math.random() * Math.max(1, width / gridSize)) * gridSize;
        const gridY = Math.floor(Math.random() * Math.max(1, height / gridSize)) * gridSize;
        spawnPulse(gridX, gridY);
      }
    };
    
    // Periodically spawn random pulses
    let lastRandomSpawn = 0;
    let lastMouseSpawn = 0;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw static grid overlay at very low opacity
      ctx.strokeStyle = isDarkMode ? 'rgba(0, 245, 255, 0.015)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 0.5;
      
      // Draw vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Draw horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Spawn pulses reactively near mouse position (throttled)
      const mouse = mouseRef.current;
      const scrollY = window.scrollY;
      const adjustedMouseY = mouse.y + scrollY;

      // Only trace inside viewport area to prevent performance degradation
      if (
        mouse.x > 0 &&
        mouse.x < width &&
        adjustedMouseY > 0 &&
        adjustedMouseY < height &&
        timestamp - lastMouseSpawn > 180
      ) {
        // Snap mouse coordinates to grid lines
        const snappedX = Math.round(mouse.x / gridSize) * gridSize;
        const snappedY = Math.round(adjustedMouseY / gridSize) * gridSize;
        
        // Spawn from snapped coordinates
        if (Math.abs(snappedX - mouse.x) < 25 && Math.abs(snappedY - adjustedMouseY) < 25) {
          spawnPulse(snappedX, snappedY);
          lastMouseSpawn = timestamp;
        }
      }

      // Autonomous random spawns
      if (pulses.length < 15 && timestamp - lastRandomSpawn > 800) {
        const rx = Math.floor(Math.random() * Math.max(1, width / gridSize)) * gridSize;
        const ry = Math.floor(Math.random() * Math.max(1, height / gridSize)) * gridSize;
        spawnPulse(rx, ry);
        lastRandomSpawn = timestamp;
      }

      // 3. Update & render active signal pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        
        // Move pulse forward
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;
        p.length += p.speed;

        // Save trace trail points
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 20) {
          p.history.shift();
        }

        // Draw trace path line
        ctx.beginPath();
        if (p.history.length > 0) {
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let k = 1; k < p.history.length; k++) {
            ctx.lineTo(p.history[k].x, p.history[k].y);
          }
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Draw leading glow point
        ctx.fillStyle = p.color.replace('0.20', '0.9').replace('0.25', '0.9').replace('0.35', '0.9');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Junction logic when reaching a grid node
        const crossedGridLine = p.dx !== 0 
          ? Math.floor((p.x - p.dx * p.speed) / gridSize) !== Math.floor(p.x / gridSize)
          : Math.floor((p.y - p.dy * p.speed) / gridSize) !== Math.floor(p.y / gridSize);

        if (crossedGridLine) {
          // Snap position to exact grid intersection
          const gridX = Math.round(p.x / gridSize) * gridSize;
          const gridY = Math.round(p.y / gridSize) * gridSize;
          p.x = gridX;
          p.y = gridY;

          // Check if pulse has exceeded max travel length or went out of bounds
          if (p.length >= p.maxLength || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            pulses.splice(i, 1);
            continue;
          }

          // Randomly turn or branch at junction
          if (Math.random() < 0.22) {
            const directions = [
              { dx: p.dy, dy: -p.dx }, // turn left
              { dx: -p.dy, dy: p.dx }, // turn right
            ];
            const newDir = directions[Math.floor(Math.random() * directions.length)];
            
            // Branch: spawn a copy turning, and keep going
            if (Math.random() < 0.5 && pulses.length < 24) {
              spawnPulse(p.x, p.y, newDir);
            } else {
              // Just turn
              p.dx = newDir.dx;
              p.dy = newDir.dy;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDarkMode]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Matte Background Matrix */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#03050a]' : 'bg-slate-50'}`} />

      {/* Interactive Signal Traces Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Concentrated Cyan Core Glow (Left Hero Side) */}
      <div className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? 'bg-cyan-500/[0.03]' : 'bg-cyan-500/[0.015]'
      }`} />

      {/* Logic Green Accent Glow (Right Workspace Side) */}
      <div className={`absolute top-[20%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${
        isDarkMode ? 'bg-emerald-500/[0.02]' : 'bg-emerald-500/[0.01]'
      }`} />

      {/* Subtle Digital Wave Noise Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800/40 to-transparent" />
    </div>
  );
};
