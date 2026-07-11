import React, { useEffect, useState } from 'react';

interface ColdOpenSplashProps {
  onComplete: () => void;
}

export const ColdOpenSplash: React.FC<ColdOpenSplashProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Session storage check
    if (sessionStorage.getItem('bfb_cold_open_played') === 'true') {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      handleComplete();
    }, 3500); // 3.5 seconds cold open (within 3-5s requirement)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleComplete();
      }
    };

    const handleClick = () => {
      handleComplete();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleComplete = () => {
    setIsFading(true);
    sessionStorage.setItem('bfb_cold_open_played', 'true');
    setTimeout(() => {
      onComplete();
    }, 700); // fade duration
  };

  // Generate lightweight ambient nodes for layout rotation
  const nodes = [
    { x: 100, y: 150, r: 8 },
    { x: 300, y: 100, r: 12 },
    { x: 500, y: 200, r: 10 },
    { x: 700, y: 120, r: 8 },
    { x: 200, y: 350, r: 14 },
    { x: 450, y: 400, r: 9 },
    { x: 650, y: 300, r: 11 },
    { x: 800, y: 450, r: 10 },
    { x: 150, y: 550, r: 7 },
    { x: 350, y: 600, r: 12 },
    { x: 550, y: 550, r: 10 },
    { x: 750, y: 650, r: 8 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7],
    [4, 8], [8, 9], [9, 10], [10, 11], [2, 6], [5, 10], [1, 5]
  ];

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#07080a] flex flex-col items-center justify-center font-mono select-none transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 scale-[1.08] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Slow spinning ambient network graph */}
      <div className="w-[80vw] h-[70vh] max-w-4xl relative animate-pulse flex items-center justify-center">
        <svg 
          viewBox="0 0 900 700" 
          className="w-full h-full text-teal-500/25 animate-[spin_60s_linear_infinite]"
        >
          {/* Edges */}
          {connections.map(([from, to], i) => (
            <line
              key={i}
              x1={nodes[from].x}
              y1={nodes[from].y}
              x2={nodes[to].x}
              y2={nodes[to].y}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 6}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-ping"
                style={{ animationDuration: `${2 + (i % 3)}s` }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="#14B8A6"
                className="shadow-[0_0_15px_#14B8A6]"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Narrative overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-12 text-center pointer-events-none">
        <div className="space-y-1.5 mt-8">
          <div className="text-[10px] text-teal-400 uppercase tracking-[0.3em] font-black">BITFORBYTES SILICON PIPELINE</div>
          <div className="text-[9px] text-slate-400 uppercase tracking-widest">INITIALIZING COGNITIVE INTERCONNECTS...</div>
        </div>

        <div className="space-y-4 max-w-lg mb-8">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-sans">
            Mapping the Semiconductor Landscape
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Every layer from physical silicon to system verification, synchronized in a single interactive stack.
          </p>
        </div>

        <div className="text-[9px] text-teal-500/60 uppercase tracking-widest animate-pulse pointer-events-auto cursor-pointer">
          [ Press any key or Click to skip compilation ]
        </div>
      </div>
    </div>
  );
};
