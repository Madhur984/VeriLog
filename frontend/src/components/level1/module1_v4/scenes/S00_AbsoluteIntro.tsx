import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const S00_AbsoluteIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const phrases = [
    { text: "Everything you see...", sub: "Photons hitting your retina.", color: "#818cf8" },
    { text: "Everything you touch...", sub: "Electrical impulses in your nerves.", color: "#c084fc" },
    { text: "Everything you hear...", sub: "Pressure waves in the air.", color: "#22d3ee" },
    { text: "Is a Signal.", sub: "Information encoded in a physical medium.", color: "#f472b6", highlight: true },
    { text: "In the heart of machines...", sub: "This medium is Electron Flow.", color: "#fbbf24" },
    { text: "Signals are Reality.", sub: "Welcome to Module 01.", color: "#2dd4bf", highlight: true, final: true },
  ];

  const handleNext = () => {
    if (index < phrases.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const current = phrases[index];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleNext}
      className="fixed inset-0 z-[100] bg-[#020308] flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Background Interactive Field */}
      <div className="absolute inset-0 z-0 opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <WaveGrid mousePos={mousePos} color={current.color} />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-10"
        >
          <h2 className={`text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none ${current.highlight ? 'drop-shadow-2xl' : 'opacity-80 text-white'}`} style={{ color: current.highlight ? current.color : undefined }}>
            {current.text}
          </h2>
          
          <p className="mt-8 text-lg font-mono tracking-widest text-white/30 italic">
            {current.sub}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 flex items-center justify-center gap-4 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 group-hover:text-white/40 transition-colors">
              {current.final ? "Click to Initialize Module" : "Click to Continue"}
            </span>
            <div className={`w-12 h-px bg-white/10 group-hover:w-20 transition-all`} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#020308_80%)]" />
        <motion.div 
            className="absolute w-[80vw] h-[80vw] rounded-full blur-[150px] opacity-10" 
            animate={{ background: `radial-gradient(circle, ${current.color} 0%, transparent 60%)`, x: mousePos.x * 200 - 100, y: mousePos.y * 200 - 100 }}
            transition={{ type: "spring", stiffness: 30 }}
        />
      </div>
    </div>
  );
};

const WaveGrid: React.FC<{ mousePos: { x: number; y: number }; color: string }> = ({ mousePos, color }) => {
  const lines = 12;
  return (
    <g>
      {Array.from({ length: lines }).map((_, i) => (
        <InteractivePath key={i} index={i} total={lines} mousePos={mousePos} color={color} />
      ))}
    </g>
  );
};

const InteractivePath: React.FC<{ index: number; total: number; mousePos: { x: number; y: number }; color: string }> = ({ index, total, mousePos, color }) => {
  const points = 40;
  const baseY = (index / total) * 1000;

  const generatePath = () => {
    let d = `M 0 ${baseY}`;
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * 1000;
        const normalizedX = (i / points);
        const dist = Math.sqrt(Math.pow(normalizedX - mousePos.x, 2) + Math.pow((baseY/1000) - mousePos.y, 2));
        const influence = Math.max(0, 1 - dist * 3);
        
        const y = baseY + Math.sin(i * 0.2 + Date.now() * 0.001) * (20 + influence * 150);
        d += ` L ${x} ${y}`;
    }
    return d;
  };

  const [path, setPath] = useState(generatePath());

  useEffect(() => {
    const id = setInterval(() => {
        setPath(generatePath());
    }, 32);
    return () => clearInterval(id);
  }, [mousePos, color]);

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={1}
      opacity={0.3}
      animate={{ stroke: color }}
    />
  );
};
