import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Globe, LayoutGrid, Database, Trophy, Settings, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

// --- Utils ---
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const rad = (angleInDegrees - 90) * Math.PI / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (x: number, y: number, radius: number, innerRadius: number, startAngle: number, endAngle: number) => {
  const startOut = polarToCartesian(x, y, radius, endAngle);
  const endOut = polarToCartesian(x, y, radius, startAngle);
  const startIn = polarToCartesian(x, y, innerRadius, endAngle);
  const endIn = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", startOut.x, startOut.y,
    "A", radius, radius, 0, largeArcFlag, 0, endOut.x, endOut.y,
    "L", endIn.x, endIn.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startIn.x, startIn.y,
    "Z"
  ].join(" ");
};

// --- Components ---
interface SegmentProps {
  id: string; label: string; icon: React.ReactNode;
  startAngle: number; endAngle: number;
  radius: number; innerRadius: number;
  isActive: boolean; index: number;
  onClick: () => void;
}

const RadialSegment: React.FC<SegmentProps> = ({ label, icon, startAngle, endAngle, radius, innerRadius, isActive, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const midAngle = (startAngle + endAngle) / 2;
  const iconPos = polarToCartesian(160, 160, innerRadius + (radius - innerRadius) * 0.55, midAngle);
  const topPath = describeArc(160, 160, radius, innerRadius, startAngle, endAngle);
  const basePath = describeArc(160, 166, radius, innerRadius, startAngle, endAngle); // Depth extrusion

  const currentScale = isPressed ? 0.97 : isHovered ? 1.05 : 1;
  const yOffset = isHovered ? (isPressed ? 2 : -8) : (isActive ? -3 : 0);

  return (
    <motion.g
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: currentScale, y: yOffset }}
      transition={{ duration: 0.5, delay: index * 0.05, type: 'spring', damping: 15 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer' }}
    >
      <motion.path d={basePath} className={cn("transition-colors duration-300 pointer-events-none", isActive ? "fill-sky-950/90" : isHovered ? "fill-indigo-950/90" : "fill-[#020617]/90")} />
      
      <motion.path d={topPath} 
        className={cn("transition-colors duration-300", isActive ? "fill-sky-900/70 stroke-sky-400 stroke-2" : isHovered ? "fill-indigo-900/60 stroke-indigo-400 stroke-[1.5]" : "fill-slate-800/80 stroke-slate-600/60 stroke-1")}
        style={{ filter: isActive ? 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.5))' : isHovered ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
      />
      
      <motion.path d={describeArc(160, 160, radius - 1.5, innerRadius + 1.5, startAngle, endAngle)} className="fill-none stroke-white/10 stroke-1 pointer-events-none" />

      {isActive && (
        <motion.path d={describeArc(160, 160, radius + 1, radius, startAngle, endAngle)} className="fill-sky-400 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} style={{ filter: 'blur(3px)' }}
        />
      )}

      <motion.g style={{ pointerEvents: 'none' }}>
        <foreignObject x={iconPos.x - 45} y={iconPos.y - 35} width={90} height={75}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 pt-1">
            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 relative overflow-hidden backdrop-blur-md", isActive ? "bg-sky-500/20 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.5)] text-sky-300" : isHovered ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300 shadow-xl" : "bg-slate-900/60 border-slate-600/50 text-slate-400 shadow-lg")}>
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              {icon}
            </div>
            <div className={cn("px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-md transition-colors text-[9px] font-black tracking-widest uppercase font-mono shadow-xl", isActive ? "bg-sky-900/90 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]" : isHovered ? "bg-indigo-950/90 text-indigo-200" : "bg-[#090e1a]/90 text-slate-400")}>
              {label}
            </div>
          </div>
        </foreignObject>
      </motion.g>
    </motion.g>
  );
};

// ...
const CenterButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.g
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)}
      initial={{ scale: 0, opacity: 0, y: 30 }}
      // Increased base scale and elevation (y: -4) per request
      animate={{ scale: isPressed ? 0.97 : isHovered ? 1.07 : 1.02, opacity: 1, y: isHovered ? -12 : -4 }}
      transition={{ duration: 0.6, type: "spring", damping: 15 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer', transform: 'translateZ(20px)' }}
    >
      <circle cx={160} cy={180} r={85} fill="rgba(0,0,0,0.7)" filter="blur(16px)" className="pointer-events-none" />
      <circle cx={160} cy={168} r={86} className="fill-[#020617] pointer-events-none" />
      
      <circle cx={160} cy={160} r={86} className={cn("transition-colors duration-300 stroke-slate-500/50", isHovered ? "fill-sky-950/90" : "fill-slate-900/95")}
        strokeWidth={2} style={{ filter: isHovered ? 'drop-shadow(0 0 40px rgba(56,189,248,0.6))' : 'drop-shadow(0 0 20px rgba(56,189,248,0.3))' }} />
      <circle cx={160} cy={160} r={84} fill="url(#core-glass-glare)" className="pointer-events-none" />

      <motion.circle cx={160} cy={160} r={72} className="fill-transparent stroke-slate-700/40 pointer-events-none" strokeWidth={14} />
      <motion.circle cx={160} cy={160} r={72} className="fill-transparent stroke-sky-400 pointer-events-none" strokeWidth={2} strokeDasharray="2 12" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ originX: '160px', originY: '160px' }} />
      
      <g className="stroke-slate-500/20 pointer-events-none">
        <line x1={160} y1={70} x2={160} y2={90} strokeWidth={2} />
        <line x1={160} y1={230} x2={160} y2={250} strokeWidth={2} />
        <line x1={70} y1={160} x2={90} y2={160} strokeWidth={2} />
        <line x1={230} y1={160} x2={250} y2={160} strokeWidth={2} />
      </g>

      <motion.circle cx={160} cy={160} r={78} className="fill-transparent stroke-sky-400 pointer-events-none" strokeWidth={4.5} strokeDasharray="100 400" strokeLinecap="round" initial={{ strokeDashoffset: -100 }}
        animate={{ strokeDashoffset: -20, rotate: isHovered ? 15 : 0, filter: isHovered ? "drop-shadow(0 0 16px #38bdf8)" : "drop-shadow(0 0 8px #0369a1)" }}
        transition={{ duration: 0.8, ease: "easeOut", rotate: { duration: 2, ease: "easeOut" } }}
        style={{ originX: '160px', originY: '160px' }} />

      <foreignObject x={85} y={105} width={150} height={110} style={{ pointerEvents: 'none' }}>
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none">
          <div className="text-[9px] text-sky-400 font-mono uppercase tracking-[0.25em] mb-1 font-bold flex items-center justify-center gap-1.5 opacity-90">
             <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse shadow-[0_0_8px_#38bdf8]" /> OS Core V1
          </div>
          <div className="text-[15px] font-black text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-wide uppercase">Hierarchical<br/>Grind</div>
          <div className="mt-3 w-20 h-1.5 bg-[#020617] border border-slate-700/50 rounded-full overflow-hidden shadow-inner flex">
             <motion.div className="h-full bg-cyan-400 relative" initial={{ width: '0%' }} animate={{ width: '65%' }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}>
                <div className="absolute inset-0 bg-white/40 shadow-[0_0_12px_#22d3ee]" />
             </motion.div>
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
};

export const RadialMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>('overview');
  
  // Interactive 3D Parallax Tilt state
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
     const path = location.pathname;
     if (path.includes('/workbench')) setActiveId('grid');
     else if (path.includes('/boss-arena')) setActiveId('leaderboards');
     else if (path.includes('/portfolio')) setActiveId('settings');
     else if (path.includes('/career-roadmap')) setActiveId('career');
     else setActiveId('overview');
  }, [location.pathname]);

  // Window bounds tracking for mouse perspective mapping
  useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
         mouseX.set(e.clientX / window.innerWidth);
         mouseY.set(e.clientY / window.innerHeight);
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Extremely subtle micro-tilt
  const rawTiltX = useTransform(mouseY, [0, 1], [4, -4]);
  const rawTiltY = useTransform(mouseX, [0, 1], [-4, 4]);

  const tiltX = useSpring(rawTiltX, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(rawTiltY, { stiffness: 150, damping: 20 });

  const SEGMENTS = [
    { id: 'overview', label: 'Home Base', icon: <Globe size={18} strokeWidth={2} />, path: '/portal' },
    { id: 'grid', label: 'Workbench', icon: <LayoutGrid size={18} strokeWidth={2} />, path: '/workbench' },
    { id: 'career', label: 'Career Roadmap', icon: <Briefcase size={18} strokeWidth={2} />, path: '/career-roadmap' },
    { id: 'lab', label: 'K-Map Lab', icon: <Database size={18} strokeWidth={2} />, path: '/kmap-lab' },
    { id: 'leaderboards', label: 'Boss Arena', icon: <Trophy size={18} strokeWidth={2} />, path: '/boss-arena' },
    { id: 'leetcode', label: 'HW LeetCode', icon: <Settings size={18} strokeWidth={2} />, path: '/hw-leetcode' }
  ];

  const gap = 3.5;
  const anglePerSegment = 360 / SEGMENTS.length;

  return (
    // Top-most container setting up the physical 3d perspective environment
    <div data-tour="portal-radial" className="fixed bottom-4 left-4 z-50 pointer-events-none flex justify-center items-center w-[360px] h-[360px]" style={{ perspective: '1400px' }}>
       {/* Ambient Bloom Area */}
       <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-[80px] scale-150" />
       
       {/* Base entry & hover backward tilt animation wrapper */}
       <motion.div
         className="pointer-events-auto rounded-full relative w-[320px] h-[320px] transition-colors duration-500"
         initial={{ rotateX: 50, rotateY: -5, scale: 0.85, y: 40, opacity: 0 }}
         animate={{ rotateX: 38, rotateY: -4, scale: 1, y: 0, opacity: 0.6 }}
         whileHover={{ rotateX: 28, rotateY: -4, scale: 1.04, opacity: 1 }}
         transition={{ duration: 1.2, type: "spring", damping: 20 }}
         style={{ 
             transformStyle: 'preserve-3d',
             boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 20px 50px rgba(0,255,255,0.2)' 
         }}
       >
         {/* Mouse-based Parallax Interaction wrapper */}
         <motion.div 
            className="w-full h-full absolute inset-0"
            style={{ transformStyle: 'preserve-3d', rotateX: tiltX, rotateY: tiltY }}
         >
             {/* Lighting Correction - darker top (farther), brighter bottom (closer) */}
             <div className="absolute inset-0 rounded-full pointer-events-none z-50" style={{ transform: 'translateZ(1px)', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(255,255,255,0.05))' }} />
             
             {/* Edge lighting - subtle bottom highlight simulating physical light catch */}
             <div className="absolute inset-0 rounded-full pointer-events-none z-50" style={{ transform: 'translateZ(1px)', borderBottom: '1px solid rgba(255,255,255,0.15)' }} />

             {/* Background Base SVG Layer (Lowest Z) */}
             <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 overflow-visible z-10" style={{ transform: 'translateZ(-10px)' }}>
                <circle cx={160} cy={168} r={156} fill="rgba(2, 6, 23, 0.9)" />
                <circle cx={160} cy={160} r={156} fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
             </svg>

             {/* Dynamic Layers SVG (Middle & High Z) */}
             <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 overflow-visible z-20" style={{ transform: 'translateZ(10px)' }}>
                <defs>
                   <radialGradient id="core-glass-glare" cx="50%" cy="10%" r="90%">
                       <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                       <stop offset="40%" stopColor="rgba(255,255,255,0.02)" />
                       <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                   </radialGradient>
                </defs>

                {SEGMENTS.map((seg, i) => {
                  const startAngle = -90 + (i * anglePerSegment) + (gap / 2);
                  const endAngle = startAngle + anglePerSegment - gap;
                  return (
                    <RadialSegment
                      key={seg.id} id={seg.id} label={seg.label} icon={seg.icon}
                      startAngle={startAngle} endAngle={endAngle} radius={152} innerRadius={94}
                      isActive={activeId === seg.id} onClick={() => { setActiveId(seg.id); navigate(seg.path); }} index={i}
                    />
                  );
                })}

                <CenterButton />
             </svg>
         </motion.div>
       </motion.div>
    </div>
  );
};


