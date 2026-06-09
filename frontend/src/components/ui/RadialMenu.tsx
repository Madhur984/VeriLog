import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Globe, LayoutGrid, Database, Trophy, Settings, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useColorScheme } from '../../hooks/useColorScheme';
import { isAuthenticated } from '../../lib/auth';

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
  isLight: boolean;
}

const RadialSegment: React.FC<SegmentProps> = ({ label, icon, startAngle, endAngle, radius, innerRadius, isActive, onClick, index, isLight }) => {
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
      <motion.path d={basePath} className={cn("transition-colors duration-300 pointer-events-none", isActive ? (isLight ? "fill-[#0369A1]/25" : "fill-blue-950/90") : isHovered ? (isLight ? "fill-[#5B21B6]/20" : "fill-indigo-950/90") : (isLight ? "fill-[#0E7490]/[0.16]" : "fill-[#020617]/90"))} />

      <motion.path d={topPath}
        className={cn("transition-colors duration-300",
          isActive
            ? (isLight ? "fill-[#0369A1]/[0.30] stroke-[#0369A1] stroke-2" : "fill-blue-900/70 stroke-blue-400 stroke-2")
            : isHovered
              ? (isLight ? "fill-[#5B21B6]/[0.22] stroke-[#5B21B6] stroke-[1.5]" : "fill-indigo-900/60 stroke-indigo-400 stroke-[1.5]")
              : (isLight ? "fill-[#0E7490]/[0.16] stroke-[#0E7490] stroke-[1.5]" : "fill-slate-800/80 stroke-slate-600/60 stroke-1")
        )}
        style={{
          filter: isActive
            ? (isLight ? 'drop-shadow(0 0 12px rgba(3,105,161,0.55)) drop-shadow(0 0 4px rgba(3,105,161,0.45))' : 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))')
            : isHovered
              ? (isLight ? 'drop-shadow(0 0 10px rgba(91,33,182,0.45)) drop-shadow(0 0 3px rgba(91,33,182,0.4))' : 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))')
              : (isLight ? 'drop-shadow(0 0 6px rgba(14,116,144,0.4))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))')
        }}
      />

      <motion.path d={describeArc(160, 160, radius - 1.5, innerRadius + 1.5, startAngle, endAngle)} className={cn("fill-none pointer-events-none", isLight ? "stroke-[#0369A1]/45 stroke-[1.5]" : "stroke-white/10 stroke-1")} />

      {isActive && (
        <motion.path d={describeArc(160, 160, radius + 1, radius, startAngle, endAngle)} className={cn("pointer-events-none", isLight ? "fill-[#0369A1]" : "fill-blue-400")}
          initial={{ opacity: 0 }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} style={{ filter: isLight ? 'blur(3px)' : 'blur(3px)' }}
        />
      )}

      <motion.g style={{ pointerEvents: 'none' }}>
        <foreignObject x={iconPos.x - 45} y={iconPos.y - 35} width={90} height={75}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 pt-1">
            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 relative overflow-hidden backdrop-blur-md",
              isActive
                ? (isLight ? "bg-[#0369A1]/25 border-[#0369A1] text-[#0369A1] shadow-[0_0_15px_rgba(3,105,161,0.45)]" : "bg-blue-500/20 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-blue-300")
                : isHovered
                  ? (isLight ? "bg-[#5B21B6]/20 border-[#5B21B6] text-[#5B21B6] shadow-[0_0_12px_rgba(91,33,182,0.4)]" : "bg-indigo-500/20 border-indigo-400/40 text-indigo-300 shadow-xl")
                  : (isLight ? "bg-[#0E7490]/[0.16] border-[#0E7490]/80 text-[#0E7490] shadow-[0_0_8px_rgba(14,116,144,0.3)]" : "bg-slate-900/60 border-slate-600/50 text-slate-400 shadow-lg")
            )}>
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              {icon}
            </div>
            <div className={cn("px-2 py-0.5 rounded-full border backdrop-blur-md transition-colors font-black tracking-widest uppercase font-mono shadow-xl",
              isLight ? "text-[11px] border-[#0369A1]/40" : "text-[9px] border-white/5",
              isActive
                ? (isLight ? "bg-[#0369A1]/20 text-[#0C4A6E] border-[#0369A1]/70 shadow-[0_0_10px_rgba(3,105,161,0.35)]" : "bg-blue-900/90 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]")
                : isHovered
                  ? (isLight ? "bg-[#5B21B6]/18 text-[#4C1D95] border-[#5B21B6]/60" : "bg-indigo-950/90 text-indigo-200")
                  : (isLight ? "bg-[#0E7490]/[0.16] text-[#0E7490] border-[#0E7490]/50" : "bg-[#090e1a]/90 text-slate-400")
            )}>
              {label}
            </div>
          </div>
        </foreignObject>
      </motion.g>
    </motion.g>
  );
};

// --- Center Button ---
const CenterButton: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.g
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)}
      initial={{ scale: 0, opacity: 0, y: 30 }}
      animate={{ scale: isPressed ? 0.97 : isHovered ? 1.07 : 1.02, opacity: 1, y: isHovered ? -12 : -4 }}
      transition={{ duration: 0.6, type: "spring", damping: 15 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer', transform: 'translateZ(20px)' }}
    >
      <circle cx="160" cy="180" r="85" fill={isLight ? "rgba(56,189,248,0.30)" : "rgba(0,0,0,0.7)"} filter="blur(16px)" className="pointer-events-none" />
      <circle cx="160" cy="168" r="86" className={isLight ? "fill-[#38BDF8]/[0.12] pointer-events-none" : "fill-[#020617] pointer-events-none"} />

      <circle cx="160" cy="160" r="86"
        className={cn("transition-colors duration-300",
          isLight
            ? cn("stroke-[#0369A1]", isHovered ? "fill-[#6366F1]/[0.16]" : "fill-[#22D3EE]/[0.13]")
            : cn("stroke-slate-500/50", isHovered ? "fill-blue-950/90" : "fill-slate-900/95")
        )}
        strokeWidth={isLight ? 2 : 2}
        style={{
          filter: isLight
            ? (isHovered ? 'drop-shadow(0 0 28px rgba(3,105,161,0.5)) drop-shadow(0 0 8px rgba(3,105,161,0.45))' : 'drop-shadow(0 0 18px rgba(3,105,161,0.4)) drop-shadow(0 0 5px rgba(14,116,144,0.4))')
            : (isHovered ? 'drop-shadow(0 0 40px rgba(59,130,246,0.6))' : 'drop-shadow(0 0 20px rgba(59,130,246,0.3))')
        }}
      />
      <circle cx="160" cy="160" r="84" fill="url(#core-glass-glare)" className="pointer-events-none" />

      <circle cx="160" cy="160" r="72" className={isLight ? "fill-transparent stroke-[#0369A1]/25 pointer-events-none" : "fill-transparent stroke-slate-700/40 pointer-events-none"} strokeWidth={14} />
      <motion.circle cx="160" cy="160" r="72" className={isLight ? "fill-transparent stroke-[#0E7490] pointer-events-none" : "fill-transparent stroke-blue-400 pointer-events-none"} strokeWidth={isLight ? 2.5 : 2} strokeDasharray="2 12" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ originX: '160px', originY: '160px', filter: isLight ? 'drop-shadow(0 0 4px rgba(14,116,144,0.8))' : undefined }} />

      <g className={isLight ? "stroke-[#0369A1]/70 pointer-events-none" : "stroke-slate-500/20 pointer-events-none"}>
        <line x1={160} y1={70} x2={160} y2={90} strokeWidth={isLight ? 2.5 : 2} />
        <line x1={160} y1={230} x2={160} y2={250} strokeWidth={isLight ? 2.5 : 2} />
        <line x1={70} y1={160} x2={90} y2={160} strokeWidth={isLight ? 2.5 : 2} />
        <line x1={230} y1={160} x2={250} y2={160} strokeWidth={isLight ? 2.5 : 2} />
      </g>

      <motion.circle cx="160" cy="160" r="78" className={isLight ? "fill-transparent stroke-[#0369A1] pointer-events-none" : "fill-transparent stroke-blue-400 pointer-events-none"} strokeWidth={4.5} strokeDasharray="100 400" strokeLinecap="round" initial={{ strokeDashoffset: -100 }}
        animate={{ strokeDashoffset: -20, rotate: isHovered ? 15 : 0, filter: isHovered ? (isLight ? "drop-shadow(0 0 14px #0369A1)" : "drop-shadow(0 0 16px #60a5fa)") : (isLight ? "drop-shadow(0 0 8px #0369A1)" : "drop-shadow(0 0 8px #1d4ed8)") }}
        transition={{ duration: 0.8, ease: "easeOut", rotate: { duration: 2, ease: "easeOut" } }}
        style={{ originX: '160px', originY: '160px' }} />

      <foreignObject x={85} y={105} width={150} height={110} style={{ pointerEvents: 'none' }}>
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none">
          <div className={`font-mono uppercase tracking-[0.25em] mb-1 font-bold flex items-center justify-center gap-1.5 opacity-90 ${isLight ? 'text-[11px] text-[#0369A1] drop-shadow-[0_0_6px_rgba(3,105,161,0.4)]' : 'text-[9px] text-blue-400'}`}>
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-[#0E7490] shadow-[0_0_10px_rgba(14,116,144,0.9)]' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'}`} /> OS Core V1
          </div>
          <div className={`font-black leading-tight tracking-wide uppercase ${isLight ? 'text-[17px] text-[#0C4A6E] drop-shadow-[0_0_8px_rgba(3,105,161,0.35)]' : 'text-[15px] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]'}`}>Hierarchical<br/>Grind</div>
          <div className={`mt-3 w-20 h-1.5 border rounded-full overflow-hidden shadow-inner flex ${isLight ? 'bg-[#0369A1]/20 border-[#0369A1]/60' : 'bg-[#020617] border-slate-700/50'}`}>
             <motion.div className={`h-full relative ${isLight ? 'bg-[#0E7490]' : 'bg-blue-400'}`} initial={{ width: '0%' }} animate={{ width: '65%' }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}>
                <div className={`absolute inset-0 ${isLight ? 'bg-[#0E7490] shadow-[0_0_12px_rgba(14,116,144,0.8)]' : 'bg-white/40 shadow-[0_0_12px_#3b82f6]'}`} />
             </motion.div>
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
};

// --- Main Radial Menu Component ---
export const RadialMenu: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<string>('overview');

  // Collapsed-to-corner state: the menu sits small in the bottom-left to free up
  // page space, and scales back to full size on hover / keyboard focus.
  const [expanded, setExpanded] = useState(false);

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

  // Window bounds tracking for mouse perspective mapping.
  // Only run while the dial is expanded — when it's collapsed in the corner the
  // per-frame parallax is invisible and just burns CPU, which made the portal lag.
  useEffect(() => {
     if (!expanded) return;
     const handleMouseMove = (e: MouseEvent) => {
         mouseX.set(e.clientX / window.innerWidth);
         mouseY.set(e.clientY / window.innerHeight);
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, expanded]);

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
    // Top-most container setting up the physical 3d perspective environment.
    // Collapses into the bottom-left corner (scale 0.4) and grows back to full
    // size from that corner on hover/focus, freeing up page space when idle.
    <div
      data-tour="portal-radial"
      className="fixed bottom-4 left-4 z-50 pointer-events-none flex justify-center items-center w-[360px] h-[360px]"
      style={{
        perspective: '1400px',
        transform: expanded ? 'scale(1)' : 'scale(0.4)',
        transformOrigin: 'bottom left',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
       {/* Ambient Bloom Area */}
       <div className={isLight ? "absolute inset-0 bg-[#0369A1]/25 rounded-full blur-[80px] scale-150" : "absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] scale-150"} />
       
       {/* Base entry & hover backward tilt animation wrapper */}
       <motion.div
         className="pointer-events-auto rounded-full relative w-[320px] h-[320px] transition-colors duration-500"
         onMouseEnter={() => setExpanded(true)}
         onMouseLeave={() => setExpanded(false)}
         onFocusCapture={() => setExpanded(true)}
         onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false); }}
         initial={{ rotateX: 50, rotateY: -5, scale: 0.85, y: 40, opacity: 0 }}
         animate={{ rotateX: 38, rotateY: -4, scale: 1, y: 0, opacity: expanded ? 1 : 0.7 }}
         whileHover={{ rotateX: 28, rotateY: -4, scale: 1.04, opacity: 1 }}
         transition={{ duration: 1.2, type: "spring", damping: 20 }}
         style={{ 
             transformStyle: 'preserve-3d',
             boxShadow: isLight
               ? '0 30px 60px rgba(3,105,161,0.22), 0 10px 35px rgba(14,116,144,0.26), 0 0 40px rgba(91,33,182,0.16)'
               : '0 60px 120px rgba(0,0,0,0.7), 0 20px 50px rgba(0,255,255,0.2)'
         }}
       >
         {/* Mouse-based Parallax Interaction wrapper */}
         <motion.div 
            className="w-full h-full absolute inset-0"
            style={{ transformStyle: 'preserve-3d', rotateX: tiltX, rotateY: tiltY }}
         >
             {/* Lighting Correction - darker top (farther), brighter bottom (closer) */}
             <div className="absolute inset-0 rounded-full pointer-events-none z-50" style={{ transform: 'translateZ(1px)', background: isLight ? 'linear-gradient(to bottom, rgba(3,105,161,0.16), rgba(14,116,144,0.10))' : 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(255,255,255,0.05))' }} />

             {/* Edge lighting - subtle bottom highlight simulating physical light catch */}
             <div className="absolute inset-0 rounded-full pointer-events-none z-50" style={{ transform: 'translateZ(1px)', borderBottom: isLight ? '1.5px solid rgba(3,105,161,0.6)' : '1px solid rgba(255,255,255,0.15)' }} />
 
             {/* Background Base SVG Layer (Lowest Z) */}
             <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 overflow-visible z-10" style={{ transform: 'translateZ(-10px)' }}>
                 <circle cx="160" cy="168" r="156" fill={isLight ? "rgba(34,211,238,0.10)" : "rgba(2, 6, 23, 0.9)"} />
                 <circle cx="160" cy="160" r="156" fill={isLight ? "rgba(56,189,248,0.12)" : "rgba(15, 23, 42, 0.85)"} stroke={isLight ? "rgba(3,105,161,0.55)" : "rgba(255,255,255,0.05)"} strokeWidth={isLight ? 1.5 : 1} />
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
                       isActive={activeId === seg.id} onClick={() => { if (!isAuthenticated()) { navigate('/login', { state: { from: seg.path } }); return; } setActiveId(seg.id); navigate(seg.path); }} index={i}
                       isLight={isLight}
                     />
                   );
                 })}
 
                 <CenterButton isLight={isLight} />
              </svg>
          </motion.div>
       </motion.div>
    </div>
  );
};
