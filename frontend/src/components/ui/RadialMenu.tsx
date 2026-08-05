import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { Globe, LayoutGrid, Database, BookOpen, Gavel, Briefcase, RotateCw, Compass } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useColorScheme } from '../../hooks/useColorScheme';
import { isAuthenticated } from '../../lib/auth';

// --- Geometry & Math Helpers ---
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const rad = (angleInDegrees - 90) * (Math.PI / 180.0);
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

// --- Segment Component ---
interface SegmentProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  startAngle: number;
  endAngle: number;
  radius: number;
  innerRadius: number;
  isActive: boolean;
  isFlashing: boolean;
  index: number;
  dialRotation: MotionValue<number>;
  onClick: () => void;
  isLight: boolean;
  reducedMotion: boolean;
}

const RadialSegment: React.FC<SegmentProps> = React.memo(({
  id,
  label,
  icon,
  startAngle,
  endAngle,
  radius,
  innerRadius,
  isActive,
  isFlashing,
  onClick,
  index,
  dialRotation,
  isLight,
  reducedMotion
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const negRotation = useTransform(dialRotation, (v: number) => -v);

  const midAngle = (startAngle + endAngle) / 2;
  const iconPos = polarToCartesian(160, 160, innerRadius + (radius - innerRadius) * 0.55, midAngle);
  const topPath = describeArc(160, 160, radius, innerRadius, startAngle, endAngle);
  const basePath = describeArc(160, 166, radius, innerRadius, startAngle, endAngle);

  const currentScale = isPressed ? 0.96 : isHovered ? 1.06 : 1;
  const yOffset = isHovered ? (isPressed ? 2 : -8) : (isActive ? -4 : 0);

  return (
    <motion.g
      role="menuitem"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: currentScale, y: yOffset }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', damping: 16 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer', outline: 'none' }}
      className="group focus-visible:outline-none"
    >
      <title>{`Navigate to ${label}`}</title>
      {/* 3D Depth Extrusion Base */}
      <motion.path
        d={basePath}
        className={cn(
          "transition-colors duration-300 pointer-events-none",
          isActive
            ? (isLight ? "fill-sky-700/20" : "fill-cyan-950/90")
            : isHovered
              ? (isLight ? "fill-sky-500/15" : "fill-blue-950/90")
              : (isLight ? "fill-slate-200/80" : "fill-[#020617]/90")
        )}
      />

      {/* Top Segment Surface */}
      <motion.path
        d={topPath}
        className={cn(
          "transition-colors duration-300 group-focus-visible:stroke-amber-400 group-focus-visible:stroke-2",
          isFlashing
            ? (isLight ? "fill-white stroke-sky-300 stroke-2" : "fill-cyan-800 stroke-white stroke-2")
            : isActive
              ? (isLight ? "fill-sky-100/90 stroke-sky-500 stroke-2" : "fill-cyan-900/80 stroke-cyan-400 stroke-2")
              : isHovered
                ? (isLight ? "fill-sky-50/80 stroke-sky-400 stroke-[1.5]" : "fill-blue-900/60 stroke-blue-400 stroke-[1.5]")
                : (isLight ? "fill-white/80 stroke-slate-300 stroke-1" : "fill-slate-900/85 stroke-slate-700/60 stroke-1")
        )}
        style={{
          filter: isFlashing
            ? (isLight ? 'drop-shadow(0 0 18px rgba(14,165,233,0.6))' : 'drop-shadow(0 0 20px rgba(255,255,255,0.5))')
            : isActive
              ? (isLight ? 'drop-shadow(0 0 12px rgba(14,165,233,0.35))' : 'drop-shadow(0 0 16px rgba(34,211,238,0.5))')
              : isHovered
                ? (isLight ? 'drop-shadow(0 0 8px rgba(14,165,233,0.2))' : 'drop-shadow(0 8px 14px rgba(0,0,0,0.6))')
                : (isLight ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))')
        }}
      />

      {/* Inner Bevel Border Rim */}
      <motion.path
        d={describeArc(160, 160, radius - 1.5, innerRadius + 1.5, startAngle, endAngle)}
        className={cn("fill-none pointer-events-none", isLight ? "stroke-sky-300/40 stroke-1" : "stroke-white/10 stroke-1")}
      />

      {/* Active Laser Arc Accent */}
      {isActive && (
        <motion.path
          d={describeArc(160, 160, radius + 1.5, radius, startAngle, endAngle)}
          className={cn("pointer-events-none", isLight ? "fill-sky-500" : "fill-cyan-400")}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ filter: 'blur(2px)' }}
        />
      )}

      {/* Icon & Upright Text Label — driven by motion value, zero re-renders */}
      <g style={{ pointerEvents: 'none' }}>
        <foreignObject x={iconPos.x - 70} y={iconPos.y - 40} width={140} height={80} style={{ overflow: 'visible' }}>
          <motion.div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ rotate: negRotation, transformOrigin: 'center center' }}
          >
            {/* Icon Container (40px w-10 h-10 with active pulse ring) */}
            <div className={cn(
              "w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-md shrink-0",
              isActive
                ? (isLight ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_14px_rgba(14,165,233,0.5)] ring-2 ring-sky-400/40" : "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.5)] ring-2 ring-cyan-400/50 animate-[pulse_2.5s_ease-in-out_infinite]")
                : isHovered
                  ? (isLight ? "bg-sky-100 border-sky-400 text-sky-700 shadow-md" : "bg-blue-500/20 border-blue-400 text-blue-300 shadow-lg")
                  : (isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-slate-900/80 border-slate-700/60 text-slate-400")
            )}>
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              {icon}
            </div>

            {/* Typography Badge — font-sans bold, high contrast pill */}
            <div className={cn(
              "transition-colors font-sans font-bold text-[9.5px] tracking-[0.05em] uppercase px-2 py-0.5 rounded-full border shadow-sm whitespace-nowrap select-none shrink-0",
              isLight
                ? (isActive
                    ? "bg-sky-600 text-white border-sky-500 shadow-sm"
                    : isHovered
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-slate-900/90 text-slate-100 border-slate-800")
                : (isActive
                    ? "bg-cyan-950/95 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : isHovered
                      ? "bg-blue-950/90 text-blue-200 border-blue-400/40"
                      : "bg-[#090e1a]/95 text-slate-300 border-white/10")
            )}
            style={{ textShadow: isLight ? 'none' : '0 1px 3px rgba(0,0,0,0.6)' }}>
              {label}
            </div>
          </motion.div>
        </foreignObject>
      </g>
    </motion.g>
  );
});

RadialSegment.displayName = 'RadialSegment';

// --- Center Telemetry Core ---
const CenterButton: React.FC<{
  isLight: boolean;
  activeLabel: string;
  dialRotation: MotionValue<number>;
  onSpinClick: () => void;
  reducedMotion: boolean;
}> = ({ isLight, activeLabel, dialRotation, onSpinClick, reducedMotion }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const negGear = useTransform(dialRotation, (v: number) => -v * 1.5);
  const [bearing, setBearing] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setBearing(Math.round(((dialRotation.get() % 360) + 360) % 360));
    }, 200);
    return () => clearInterval(id);
  }, [dialRotation]);

  return (
    <motion.g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPressed ? 0.96 : isHovered ? 1.05 : 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", damping: 16 }}
      style={{ originX: '160px', originY: '160px', cursor: 'pointer' }}
    >
      {/* Soft Center Blur Shadow */}
      <circle cx="160" cy="172" r="80" fill={isLight ? "rgba(14,165,233,0.12)" : "rgba(0,0,0,0.8)"} filter="blur(16px)" className="pointer-events-none" />

      {/* Main Core Backdrop */}
      <circle
        cx="160" cy="160" r="84"
        className={cn(
          "transition-colors duration-300",
          isLight
            ? (isHovered ? "fill-white stroke-sky-400" : "fill-slate-50 stroke-slate-300")
            : (isHovered ? "fill-cyan-950/90 stroke-cyan-400" : "fill-slate-950/95 stroke-slate-700/80")
        )}
        strokeWidth={2}
        style={{
          filter: isLight
            ? (isHovered ? 'drop-shadow(0 0 20px rgba(14,165,233,0.3))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))')
            : (isHovered ? 'drop-shadow(0 0 30px rgba(34,211,238,0.5))' : 'drop-shadow(0 0 15px rgba(34,211,238,0.2))')
        }}
      />

      {/* Counter-rotating Inner Gear Ticks — driven by motion value */}
      <motion.circle
        cx="160" cy="160" r="72"
        className={isLight ? "fill-transparent stroke-slate-300" : "fill-transparent stroke-slate-700/50"}
        strokeWidth={12}
        strokeDasharray="2 8"
        style={{ originX: '160px', originY: '160px', rotate: reducedMotion ? 0 : negGear }}
      />

      {/* Rotating Mechanical Reticle Ring — driven by motion value */}
      <motion.circle
        cx="160" cy="160" r="76"
        className={isLight ? "fill-transparent stroke-sky-500" : "fill-transparent stroke-cyan-400"}
        strokeWidth={2.5}
        strokeDasharray="40 180"
        strokeLinecap="round"
        style={{
          originX: '160px',
          originY: '160px',
          rotate: reducedMotion ? 0 : dialRotation,
          filter: isLight ? 'drop-shadow(0 0 6px rgba(14,165,233,0.5))' : 'drop-shadow(0 0 8px rgba(34,211,238,0.6))'
        }}
      />

      {/* Center Telemetry Display (Upright Text) */}
      <foreignObject x={80} y={92} width={160} height={136} style={{ pointerEvents: 'none', overflow: 'visible' }}>
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center select-none font-sans">
          {/* Status Dot & Core Header */}
          <div className={cn(
            "text-[9px] font-mono tracking-widest font-black uppercase flex items-center justify-center gap-1.5 mb-1",
            isLight ? "text-sky-700" : "text-cyan-400"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isLight ? "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
            )} />
            RADIAL // V2.0
          </div>

          {/* Active Navigation Title */}
          <div className={cn(
            "font-extrabold text-[13.5px] leading-tight tracking-tight uppercase transition-colors truncate max-w-[145px] px-1",
            isLight ? "text-slate-900" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          )}>
            {activeLabel}
          </div>

          {/* Rotational Bearing Angle Readout */}
          <div className={cn(
            "mt-1.5 text-[9.5px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border flex items-center gap-1",
            isLight
              ? "bg-slate-100 border-slate-200 text-slate-700"
              : "bg-slate-900/90 border-slate-700/80 text-cyan-300"
          )}>
            <Compass size={10} className={isLight ? "text-sky-600" : "text-cyan-400"} />
            BEARING {bearing}°
          </div>

          {/* Quick Spin Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSpinClick();
            }}
            className={cn(
              "mt-2 pointer-events-auto p-1 rounded-full border transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center",
              isLight
                ? "bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100"
                : "bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60"
            )}
            title="Spin Menu Dial"
          >
            <RotateCw size={11} className="transition-transform duration-500 hover:rotate-180" />
          </button>
        </div>
      </foreignObject>
    </motion.g>
  );
};

// --- Static Navigation Configuration ---
const SEGMENTS = [
  { id: 'overview', label: 'Home Base', icon: <Globe size={18} strokeWidth={2.2} />, path: '/portal' },
  { id: 'grid', label: 'Workbench', icon: <LayoutGrid size={18} strokeWidth={2.2} />, path: '/workbench' },
  { id: 'career', label: 'Career Roadmap', icon: <Briefcase size={18} strokeWidth={2.2} />, path: '/career-roadmap' },
  { id: 'lab', label: 'K-Map Lab', icon: <Database size={18} strokeWidth={2.2} />, path: '/kmap-lab' },
  { id: 'analog', label: 'Analog Library', icon: <BookOpen size={18} strokeWidth={2.2} />, path: '/analogies' },
  { id: 'verilog', label: 'Verilog Judge', icon: <Gavel size={18} strokeWidth={2.2} />, path: '/verilog-playground' }
];

const DEGREE_LABELS = [
  { angle: 0, label: '000°' },
  { angle: 60, label: '060°' },
  { angle: 120, label: '120°' },
  { angle: 180, label: '180°' },
  { angle: 240, label: '240°' },
  { angle: 300, label: '300°' },
];

// --- Main Radial Menu Component ---
export const RadialMenu: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const navigate = useNavigate();
  const location = useLocation();

  const [activeId, setActiveId] = useState<string>('overview');
  const [expanded, setExpanded] = useState<boolean>(false);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartAngle = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);

  const reducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);

  // --- Rotational State & Physics ---
  const rotationAngle = useMotionValue(0);
  const springRotation = useSpring(rotationAngle, reducedMotion
    ? { stiffness: 500, damping: 50 }
    : { stiffness: 140, damping: 20 }
  );

  // Parallax Tilt State
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    if (!expanded || reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, expanded, reducedMotion]);

  const rawTiltX = useTransform(mouseY, [0, 1], [4, -4]);
  const rawTiltY = useTransform(mouseX, [0, 1], [-4, 4]);
  const tiltX = useSpring(rawTiltX, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(rawTiltY, { stiffness: 150, damping: 20 });

  const gap = 3.5;
  const anglePerSegment = 360 / SEGMENTS.length;

  // --- Smooth Segment Zenith Rotation Helper ---
  const rotateSegmentToTop = useCallback((index: number) => {
    const targetBaseAngle = -index * anglePerSegment;
    // Find shortest rotational path relative to current angle
    const current = rotationAngle.get();
    const currentNormalized = Math.round(current / 360) * 360;
    let target = currentNormalized + targetBaseAngle;
    
    // Adjust target to take shortest rotation step
    if (target - current > 180) target -= 360;
    if (target - current < -180) target += 360;

    rotationAngle.set(target);
  }, [anglePerSegment, rotationAngle]);

  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const dragDistance = useRef<number>(0);

  // --- Drag-to-Spin Pointer Handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!expanded || reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only start drag if clicking on the outer ring area (not center button)
    if (dist > 50 && dist < 170) {
      setIsDragging(true);
      setHasDragged(false);
      dragDistance.current = 0;
      dragStartAngle.current = Math.atan2(dy, dx) * (180 / Math.PI);
      dragStartRotation.current = rotationAngle.get();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  }, [expanded, reducedMotion, rotationAngle]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const deltaAngle = currentAngle - dragStartAngle.current;
    
    dragDistance.current += Math.abs(deltaAngle);
    if (Math.abs(deltaAngle) > 2) {
      setHasDragged(true);
    }

    rotationAngle.set(dragStartRotation.current + deltaAngle);
  }, [isDragging, rotationAngle]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Snap to nearest 60-degree segment after drag release
    const current = rotationAngle.get();
    const nearestSegmentIndex = (Math.round(-current / anglePerSegment) % SEGMENTS.length + SEGMENTS.length) % SEGMENTS.length;
    rotateSegmentToTop(nearestSegmentIndex);
    setActiveId(SEGMENTS[nearestSegmentIndex].id);

    // Reset drag flag after short delay to block synthetic click event
    setTimeout(() => {
      setHasDragged(false);
    }, 150);
  }, [isDragging, anglePerSegment, rotationAngle, rotateSegmentToTop]);

  // Sync Active Route & Rotate Active Segment to Top Zenith
  useEffect(() => {
    const path = location.pathname;
    let matchedIdx = 0;

    if (path.includes('/workbench')) matchedIdx = 1;
    else if (path.includes('/career-roadmap')) matchedIdx = 2;
    else if (path.includes('/kmap-lab')) matchedIdx = 3;
    else if (path.includes('/analogies')) matchedIdx = 4;
    else if (path.includes('/verilog-playground') || path.includes('/hw-leetcode')) matchedIdx = 5;
    else matchedIdx = 0;

    setActiveId(SEGMENTS[matchedIdx].id);
    rotateSegmentToTop(matchedIdx);
  }, [location.pathname, rotateSegmentToTop]);

  // Handle Manual Segment Click — ONLY navigates on genuine click (not drag release)
  const handleSegmentClick = useCallback((seg: typeof SEGMENTS[0], index: number) => {
    if (hasDragged || isDragging) return;
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: seg.path } });
      return;
    }
    setFlashingId(seg.id);
    rotateSegmentToTop(index);
    setActiveId(seg.id);
    setTimeout(() => {
      setFlashingId(null);
      navigate(seg.path);
    }, reducedMotion ? 0 : 120);
  }, [hasDragged, isDragging, navigate, rotateSegmentToTop, reducedMotion]);

  // Quick 360 Spin Action — ONLY rotates, does NOT navigate
  const triggerFullSpin = useCallback(() => {
    if (reducedMotion) return;
    const current = rotationAngle.get();
    rotationAngle.set(current - 360);
  }, [rotationAngle, reducedMotion]);

  // Scroll-wheel rotation (debounced) — ONLY rotates dial & updates active segment visual, does NOT navigate
  useEffect(() => {
    if (!expanded) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      lastWheelTime.current = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      const currentIdx = SEGMENTS.findIndex(s => s.id === activeId);
      const nextIdx = ((currentIdx + dir) % SEGMENTS.length + SEGMENTS.length) % SEGMENTS.length;
      setActiveId(SEGMENTS[nextIdx].id);
      rotateSegmentToTop(nextIdx);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [expanded, activeId, rotateSegmentToTop]);

  // Keyboard Arrow Key Step Navigation — ONLY rotates dial & updates active segment visual, does NOT navigate
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIdx = SEGMENTS.findIndex(s => s.id === activeId);
      if (currentIdx === -1) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % SEGMENTS.length;
        setActiveId(SEGMENTS[nextIdx].id);
        rotateSegmentToTop(nextIdx);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + SEGMENTS.length) % SEGMENTS.length;
        setActiveId(SEGMENTS[prevIdx].id);
        rotateSegmentToTop(prevIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded, activeId, rotateSegmentToTop]);

  const activeSegmentObj = SEGMENTS.find(s => s.id === activeId) || SEGMENTS[0];

  return (
    <div
      ref={containerRef}
      data-tour="portal-radial"
      role="navigation"
      aria-label="Main navigation dial"
      className="fixed bottom-4 left-4 z-50 pointer-events-none flex justify-center items-center w-[360px] h-[360px]"
      style={{
        perspective: '1400px',
        transform: expanded ? 'scale(1)' : 'scale(0.42)',
        transformOrigin: 'bottom left',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
      <motion.div
        className={cn(
          "pointer-events-auto rounded-full relative w-[320px] h-[320px] transition-colors duration-500",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocusCapture={() => setExpanded(true)}
        onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false); }}
        initial={{ rotateX: 50, rotateY: -5, scale: 0.85, y: 40, opacity: 0 }}
        animate={{ rotateX: 38, rotateY: -4, scale: 1, y: 0, opacity: expanded ? 1 : 0.75 }}
        whileHover={{ rotateX: 28, rotateY: -4, scale: 1.04, opacity: 1 }}
        transition={{ duration: 1, type: "spring", damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isLight
            ? '0 24px 50px rgba(14,165,233,0.18), 0 8px 24px rgba(14,165,233,0.12)'
            : '0 60px 120px rgba(0,0,0,0.8), 0 20px 50px rgba(34,211,238,0.2)'
        }}
      >
        <motion.div
          className="w-full h-full absolute inset-0"
          style={{ transformStyle: 'preserve-3d', rotateX: tiltX, rotateY: tiltY }}
        >
          {/* Top Lighting Catch */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-50"
            style={{
              transform: 'translateZ(1px)',
              background: isLight
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent 60%)'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.3))'
            }}
          />

          {/* Bottom Edge Light Catch */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-50"
            style={{
              transform: 'translateZ(1px)',
              borderBottom: isLight ? '1.5px solid rgba(14,165,233,0.3)' : '1px solid rgba(255,255,255,0.15)'
            }}
          />

          {/* Background Static Base SVG */}
          <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 overflow-visible z-10" style={{ transform: 'translateZ(-10px)' }}>
            <circle cx="160" cy="168" r="156" fill={isLight ? "rgba(241,245,249,0.92)" : "rgba(2, 6, 23, 0.92)"} />
            <circle cx="160" cy="160" r="156" fill={isLight ? "rgba(248,250,252,0.95)" : "rgba(15, 23, 42, 0.9)"} stroke={isLight ? "rgba(14,165,233,0.25)" : "rgba(255,255,255,0.08)"} strokeWidth={1.5} />
          </svg>

          {/* ROTATING MENU SVGs (Z-Layer 20) */}
          <svg width="320" height="320" viewBox="0 0 320 320" className="absolute inset-0 overflow-visible z-20" style={{ transform: 'translateZ(10px)' }}>
            <defs>
              <radialGradient id="core-glass-glare" cx="50%" cy="10%" r="90%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Rotatable Segment & HUD Compass Group */}
            <motion.g
              style={{
                originX: '160px',
                originY: '160px',
                rotate: springRotation
              }}
            >
              {/* Outer HUD Compass Ticks & Degree Markers */}
              {Array.from({ length: 12 }).map((_, tickIdx) => {
                const tickAngle = tickIdx * 30;
                const pos1 = polarToCartesian(160, 160, 154, tickAngle);
                const pos2 = polarToCartesian(160, 160, 158, tickAngle);
                const isMajor = tickIdx % 2 === 0;
                return (
                  <line
                    key={tickIdx}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={isLight ? (isMajor ? 'rgba(14,165,233,0.6)' : 'rgba(148,163,184,0.4)') : (isMajor ? 'rgba(34,211,238,0.7)' : 'rgba(255,255,255,0.15)')}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}

              {/* Outer Degree Text Labels (000°, 060°, 120°, 180°, 240°, 300°) */}
              {DEGREE_LABELS.map((d) => {
                const pos = polarToCartesian(160, 160, 147, d.angle);
                return (
                  <text
                    key={d.label}
                    x={pos.x}
                    y={pos.y + 2.5}
                    textAnchor="middle"
                    className={cn(
                      "font-mono text-[7.5px] font-bold select-none pointer-events-none",
                      isLight ? "fill-sky-700/60" : "fill-cyan-400/50"
                    )}
                  >
                    {d.label}
                  </text>
                );
              })}

              {/* Radial Segments */}
              {SEGMENTS.map((seg, i) => {
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
                    radius={152}
                    innerRadius={94}
                    isActive={activeId === seg.id}
                    isFlashing={flashingId === seg.id}
                    onClick={() => handleSegmentClick(seg, i)}
                    index={i}
                    dialRotation={springRotation}
                    isLight={isLight}
                    reducedMotion={reducedMotion}
                  />
                );
              })}
            </motion.g>

            {/* Fixed Top Zenith Marker — animated breathing glow */}
            <g style={{ transform: 'translateZ(15px)' }}>
              <motion.polygon
                points="160,3 154,14 166,14"
                fill={isLight ? '#0284c7' : '#22d3ee'}
                animate={reducedMotion ? {} : { opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  originX: '160px', originY: '10px',
                  filter: isLight ? 'drop-shadow(0 0 6px rgba(14,165,233,0.6))' : 'drop-shadow(0 0 10px rgba(34,211,238,0.9))'
                }}
              />
              {/* Thin laser line from zenith inward */}
              <line x1="160" y1="14" x2="160" y2="22"
                stroke={isLight ? '#0284c7' : '#22d3ee'}
                strokeWidth={1.5} opacity={0.5}
                strokeLinecap="round"
              />
            </g>

            {/* Segment gap separator lines */}
            {SEGMENTS.map((_, i) => {
              const gapAngle = -90 + (i * anglePerSegment);
              const p1 = polarToCartesian(160, 160, 96, gapAngle);
              const p2 = polarToCartesian(160, 160, 150, gapAngle);
              return (
                <line key={`gap-${i}`}
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isLight ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.06)'}
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Center Core Button */}
            <CenterButton
              isLight={isLight}
              activeLabel={activeSegmentObj.label}
              dialRotation={springRotation}
              onSpinClick={triggerFullSpin}
              reducedMotion={reducedMotion}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RadialMenu;
