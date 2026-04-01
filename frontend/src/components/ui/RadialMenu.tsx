import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, LayoutGrid, Database, Trophy, Hexagon, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface SegmentProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  startAngle: number;
  endAngle: number;
  radius: number;
  innerRadius: number;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const rad = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
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

const RadialSegment: React.FC<SegmentProps> = ({ label, icon, startAngle, endAngle, radius, innerRadius, isActive, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const midAngle = (startAngle + endAngle) / 2;
  const iconPos = polarToCartesian(160, 160, innerRadius + (radius - innerRadius) * 0.55, midAngle);
  const path = describeArc(160, 160, radius, innerRadius, startAngle, endAngle);

  // Animations
  const hoverScale = isHovered ? (isActive ? 1.05 : 1.03) : (isActive ? 1.05 : 1);
  const pressScale = isPressed ? 0.98 : 1;
  const currentScale = hoverScale * pressScale;

  return (
    <motion.g
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', damping: 15 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer' }}
    >
      <motion.path
        d={path}
        animate={{ scale: currentScale }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "transition-all duration-300",
          isActive 
            ? "fill-sky-500/30 stroke-sky-400 stroke-2" 
            : isHovered 
              ? "fill-indigo-500/20 stroke-indigo-400 stroke-[1.5]" 
              : "fill-slate-800/60 stroke-slate-700/80 stroke-1"
        )}
        style={{
          filter: isActive ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.5))' : isHovered ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' : 'none'
        }}
      />
      
      {/* Outer Neon Edge for active state */}
      {isActive && (
        <motion.path
          d={describeArc(160, 160, radius + 2, radius, startAngle, endAngle)}
          className="fill-sky-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ filter: 'drop-shadow(0 0 4px #38bdf8)' }}
        />
      )}

      {/* Inner highlight line per segment */}
      <motion.path
          d={describeArc(160, 160, innerRadius + 2, innerRadius, startAngle, endAngle)}
          className={cn(
              isActive ? "fill-sky-300/80" : "fill-slate-600/50"
          )}
          animate={{ scale: currentScale }}
           transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Icon & Label Container */}
      <motion.g
        animate={{ scale: currentScale }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <foreignObject
          x={iconPos.x - 40}
          y={iconPos.y - 30}
          width={80}
          height={60}
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <div className={cn(
              "p-1.5 rounded-xl backdrop-blur-sm transition-colors duration-300",
              isActive ? "bg-sky-500/20 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.4)]" : 
              isHovered ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800/50 text-slate-400"
            )}>
              {icon}
            </div>
            <span className={cn(
              "text-[9px] font-bold text-center leading-tight drop-shadow-md tracking-wider uppercase font-mono transition-colors",
              isActive ? "text-sky-300" : isHovered ? "text-indigo-200" : "text-slate-400"
            )}>
              {label}
            </span>
          </div>
        </foreignObject>
      </motion.g>
    </motion.g>
  );
};

const CenterButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring", damping: 15 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer' }}
    >
      {/* Glowing Rings */}
      <circle cx={160} cy={160} r={85} className="fill-transparent stroke-slate-800 stroke-[6]" />
      
      <circle 
        cx={160} cy={160} r={82} 
        className={cn(
          "transition-all duration-300",
          isHovered ? "fill-sky-900/40" : "fill-slate-900/60"
        )}
        style={{
          backdropFilter: 'blur(12px)',
          filter: isHovered ? 'drop-shadow(0 0 15px rgba(56,189,248,0.3))' : 'drop-shadow(0 0 20px rgba(0,0,0,0.8))'
        }} 
      />

      {/* Rotating Accent Ring */}
      <motion.circle 
        cx={160} cy={160} r={78} 
        className="fill-transparent stroke-sky-500/40" 
        strokeWidth={2}
        strokeDasharray="10 20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ originX: '160px', originY: '160px' }}
      />

      {/* Center Dynamic Ring */}
      <motion.circle 
        cx={160} cy={160} r={80} 
        className="fill-transparent stroke-sky-400" 
        strokeWidth={4}
        strokeDasharray="100 400"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 500 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 8px #38bdf8)" }}
      />

      <foreignObject
        x={90} y={110} width={140} height={100}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div 
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
            animate={{ scale: isPressed ? 0.95 : isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
        >
          <div className="text-[8px] text-sky-400 font-mono uppercase tracking-[0.2em] mb-1 font-bold">
            Current Project
          </div>
          <div className="text-[13px] font-black text-white leading-tight drop-shadow-lg tracking-wide uppercase">
            Hierarchical<br/>Core Grind
          </div>
          <div className="mt-2 w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-sky-400" 
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
             />
          </div>
        </motion.div>
      </foreignObject>
    </motion.g>
  );
};

export const RadialMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveId = () => {
      const path = location.pathname;
      if (path.includes('/portal')) return 'overview';
      if (path.includes('/workbench')) return 'grid';
      if (path.includes('/boss-arena') || path.includes('/assessment')) return 'leaderboards';
      if (path.includes('/skill-tree')) return 'glyph';
      if (path.includes('/portfolio')) return 'settings';
      return 'overview'; // Default
  }
  
  const [activeId, setActiveId] = useState<string>(getActiveId());

  useEffect(() => {
     setActiveId(getActiveId());
  }, [location.pathname]);

  const SEGMENTS = [
    { id: 'overview', label: 'Global Overview', icon: <Globe size={18} strokeWidth={2.5} />, path: '/portal' },
    { id: 'grid', label: 'The Grid', icon: <LayoutGrid size={18} strokeWidth={2.5} />, path: '/workbench' },
    { id: 'resources', label: 'Resources', icon: <Database size={18} strokeWidth={2.5} />, path: '/cpu-lab' },
    { id: 'leaderboards', label: 'Leaderboards', icon: <Trophy size={18} strokeWidth={2.5} />, path: '/boss-arena' },
    { id: 'glyph', label: 'Glyph', icon: <Hexagon size={18} strokeWidth={2.5} />, path: '/skill-tree' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} strokeWidth={2.5} />, path: '/portfolio' }
  ];

  const totalSegments = SEGMENTS.length;
  const gap = 4; // degrees
  const anglePerSegment = 360 / totalSegments;

  const handleNav = (id: string, path: string) => {
      setActiveId(id);
      navigate(path);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
       {/* Background glow behind the menu */}
       <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none transform scale-110" />
       <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none transform scale-150 translate-x-10 -translate-y-10" />

       <motion.svg 
         width="320" height="320" viewBox="0 0 320 320"
         initial={{ rotate: -90, opacity: 0 }}
         animate={{ rotate: 0, opacity: 1 }}
         transition={{ duration: 1, type: "spring", damping: 20 }}
       >
         <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
         </defs>

         {/* Base backdrop circle to catch clicks/looks nice */}
         <circle cx={160} cy={160} r={155} fill="rgba(15, 23, 42, 0.4)" style={{ backdropFilter: 'blur(8px)' }} />

         {SEGMENTS.map((seg, i) => {
           // We start from -90 deg (top center) and go clockwise
           const startAngle = -90 + (i * anglePerSegment) + (gap / 2);
           const endAngle = startAngle + anglePerSegment - gap;
           
           return (
             <RadialSegment
               key={seg.id}
               id={seg.id}
               label={seg.label}
               icon={seg.icon}
               startAngle={startAngle}
               endAngle={endAngle}
               radius={150}
               innerRadius={90}
               isActive={activeId === seg.id}
               onClick={() => handleNav(seg.id, seg.path)}
               index={i}
             />
           );
         })}

         <CenterButton />
       </motion.svg>
    </div>
  );
};
