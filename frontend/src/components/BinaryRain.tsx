import { useEffect, useRef } from 'react';

export const BinaryRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COL_W = 20;
    const cols = Math.floor(canvas.width / COL_W);
    const drops = Array.from({ length: cols }, () =>
      Math.random() * -canvas.height
    );
    const speeds = Array.from({ length: cols }, () =>
      40 + Math.random() * 40
    );

    let last = performance.now();
    let animId: number;

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Fade trail - very transparent overlay
      ctx.fillStyle = 'rgba(7,8,10,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '12px IBM Plex Mono';
      ctx.fillStyle = '#22D3EE';

      for (let i = 0; i < cols; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const x = i * COL_W;
        const y = drops[i];

        if (y > 0 && y < canvas.height) {
          ctx.globalAlpha = Math.min(y / canvas.height, 1) * 0.6;
          ctx.fillText(char, x, y);
        }

        drops[i] += speeds[i] * dt;
        if (drops[i] > canvas.height + 20) {
          drops[i] = -20;
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.04 }}
    />
  );
};
