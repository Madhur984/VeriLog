import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const SparkleCanvas = ({ trigger, isLight }: { trigger: number; isLight: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = 240;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const addParticles = () => {
      const newParticles: Particle[] = [];
      const colors = isLight
        ? ['#EA580C', '#3B82F6', '#F97316', '#0284C7']
        : ['#22D3EE', '#818CF8', '#06B6D4', '#BAE6FD'];

      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        newParticles.push({
          x: width / 2,
          y: height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2, // slight upward bias
          size: Math.random() * 4 + 2,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      particles.current.push(...newParticles);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.current = particles.current.filter(p => p.alpha > 0);

      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha -= 0.025; // fade rate
        p.size *= 0.97; // shrink
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    if (trigger > 0) {
      addParticles();
    }
    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [trigger, isLight]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute pointer-events-none z-0" 
      style={{
        width: 240,
        height: 240,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};
