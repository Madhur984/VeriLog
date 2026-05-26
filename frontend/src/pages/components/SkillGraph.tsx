import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dagre from "dagre";
import {
  CircuitBoard, Cpu, Wifi, Radio, Zap, Move3d, Shield, Eye, TrendingUp,
  Lock, Unlock, RefreshCw, Maximize2, Minimize2, Search,
  Layout, Sparkles, Activity
} from "lucide-react";

// ---------- Types ----------
interface GraphNode {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  domainId: string;
  prerequisites: string[];
  group: number;
  demandIntensity?: number; // 1-10 for glow logic
}

// ---------- Default Data with Enhanced Metadata ----------
const defaultNodesRaw: Omit<GraphNode, "x" | "y">[] = [
  { id: "basic_electronics", name: "Basic Electronics", icon: <Zap size={20} />, domainId: "", prerequisites: [], group: 1, demandIntensity: 5 },
  { id: "digital_logic", name: "Digital Logic", icon: <CircuitBoard size={20} />, domainId: "", prerequisites: ["basic_electronics"], group: 2, demandIntensity: 7 },
  { id: "verilog", name: "Verilog/VHDL", icon: <Cpu size={20} />, domainId: "", prerequisites: ["digital_logic"], group: 3, demandIntensity: 9 },
  { id: "vlsi", name: "VLSI Design", icon: <Cpu size={20} />, domainId: "vlsi", prerequisites: ["verilog"], group: 4, demandIntensity: 10 },
  { id: "embedded", name: "Embedded Systems", icon: <CircuitBoard size={20} />, domainId: "embedded", prerequisites: ["digital_logic"], group: 4, demandIntensity: 9 },
  { id: "signal_processing", name: "Signal Processing", icon: <Radio size={20} />, domainId: "signal", prerequisites: ["basic_electronics"], group: 2, demandIntensity: 8 },
  { id: "wireless", name: "Wireless Comm", icon: <Wifi size={20} />, domainId: "wireless", prerequisites: ["signal_processing"], group: 4, demandIntensity: 8 },
  { id: "rf", name: "RF & Microwave", icon: <Radio size={20} />, domainId: "rf", prerequisites: ["wireless"], group: 4, demandIntensity: 9 },
  { id: "power", name: "Power Electronics", icon: <Zap size={20} />, domainId: "power", prerequisites: ["basic_electronics"], group: 4, demandIntensity: 9 },
  { id: "control", name: "Control Systems", icon: <Move3d size={20} />, domainId: "control", prerequisites: ["basic_electronics"], group: 4, demandIntensity: 7 },
  { id: "medical", name: "Medical Electronics", icon: <Shield size={20} />, domainId: "medical", prerequisites: ["signal_processing", "embedded"], group: 4, demandIntensity: 6 },
  { id: "photonics", name: "Photonics", icon: <Eye size={20} />, domainId: "photonics", prerequisites: ["basic_electronics"], group: 4, demandIntensity: 7 },
  { id: "defense", name: "Defense & Aerospace", icon: <TrendingUp size={20} />, domainId: "defense", prerequisites: ["rf", "control"], group: 4, demandIntensity: 10 },
];

const groupColors: Record<number, string> = {
  1: "#FF5F1F", // Foundation (Orange)
  2: "#00D4FF", // Core (Cyan)
  3: "#FFDC00", // Bridge (Yellow)
  4: "#B10DC9", // Specialization (Purple)
};

const defaultPositions: Record<string, { x: number; y: number }> = {
  basic_electronics: { x: 100, y: 350 },
  digital_logic: { x: 400, y: 150 },
  verilog: { x: 750, y: 150 },
  vlsi: { x: 1100, y: 150 },
  embedded: { x: 750, y: 350 },
  signal_processing: { x: 400, y: 550 },
  wireless: { x: 750, y: 550 },
  rf: { x: 1100, y: 550 },
  power: { x: 750, y: 750 },
  control: { x: 1100, y: 400 },
  medical: { x: 1400, y: 350 },
  photonics: { x: 1400, y: 150 },
  defense: { x: 1700, y: 400 },
};

interface SkillGraphProps {
  onNodeClick: (domainId: string) => void;
  unlockedNodes?: Set<string>;
  onDragCount?: (count: number) => void; 
}

export const SkillGraph: React.FC<SkillGraphProps> = ({ onNodeClick, unlockedNodes: _unlockedNodes = new Set(), onDragCount }) => {
  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    const saved = localStorage.getItem("bfb_skill_graph_positions_v2");
    const positions = saved ? JSON.parse(saved) : defaultPositions;
    return defaultNodesRaw.map(n => ({
      ...n,
      x: positions[n.id]?.x ?? defaultPositions[n.id].x,
      y: positions[n.id]?.y ?? defaultPositions[n.id].y,
    }));
  });

  const [editMode, setEditMode] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragCountRef = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMinimap] = useState(true);
  const [physicsOn, setPhysicsOn] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------- Path Logic ----------
  const activePath = useMemo(() => {
    if (!hoveredId) return { upstream: new Set<string>(), downstream: new Set<string>() };
    
    const upstream = new Set<string>();
    const findUpstream = (id: string) => {
      const node = nodes.find(n => n.id === id);
      if (!node) return;
      node.prerequisites.forEach(pre => {
        if (!upstream.has(pre)) {
          upstream.add(pre);
          findUpstream(pre);
        }
      });
    };

    const downstream = new Set<string>();
    const findDownstream = (id: string) => {
      nodes.forEach(node => {
        if (node.prerequisites.includes(id)) {
          if (!downstream.has(node.id)) {
            downstream.add(node.id);
            findDownstream(node.id);
          }
        }
      });
    };

    findUpstream(hoveredId);
    findDownstream(hoveredId);
    return { upstream, downstream };
  }, [hoveredId, nodes]);

  // ---------- Persistence ----------
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach(n => { positions[n.id] = { x: n.x, y: n.y }; });
    localStorage.setItem("bfb_skill_graph_positions_v2", JSON.stringify(positions));
  }, [nodes]);

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
    if (onDragCount) {
      dragCountRef.current += 1;
      onDragCount(dragCountRef.current);
    }
  };

  const autoLayout = (dir: "LR" | "TB") => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: dir, nodesep: 150, ranksep: 200, marginx: 200, marginy: 200 });
    g.setDefaultEdgeLabel(() => ({}));
    defaultNodesRaw.forEach(n => g.setNode(n.id, { width: 100, height: 100 }));
    defaultNodesRaw.forEach(n => n.prerequisites.forEach(p => g.setEdge(p, n.id)));
    dagre.layout(g);
    setNodes(prev => prev.map(n => ({ ...n, x: g.node(n.id).x, y: g.node(n.id).y })));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
       containerRef.current.requestFullscreen();
       setIsFullscreen(true);
    } else {
       document.exitFullscreen();
       setIsFullscreen(false);
    }
  };

  const getBezierPath = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    const dx = to.x - from.x;
    const cp1x = from.x + dx * 0.4;
    const cp2x = from.x + dx * 0.6;
    return `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;
  };

  const edges = nodes.flatMap(n => n.prerequisites.map(p => ({ from: p, to: n.id })));

  return (
    <div ref={containerRef} className={`w-full ${isFullscreen ? "fixed inset-0 z-[100] bg-[#050505]" : "h-[750px] bg-[#050505]/40 border border-[#1A1A25] rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)]"} overflow-hidden relative transition-all duration-700 font-ui`}>
      {/* Neo-Brutalist HUD */}
      <div className="absolute top-8 right-8 z-50 flex flex-col gap-4">
        <div className="flex gap-2 p-1.5 bg-[#0A0A0F]/80 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
          <button onClick={() => setPhysicsOn(!physicsOn)} className={`p-3 rounded-xl transition-all ${physicsOn ? "text-plasma-cyan shadow-cyan-glow bg-plasma-cyan/10" : "text-white/20 hover:text-white"}`} title="Bio-Luminescence Flow"><Activity size={18} /></button>
          <button onClick={() => autoLayout("LR")} className="p-3 text-white/20 hover:text-plasma-cyan transition-all"><Layout size={18} /></button>
          <button onClick={() => setEditMode(!editMode)} className={`p-3 rounded-xl transition-all ${editMode ? "bg-plasma-cyan text-black" : "text-white/20 hover:text-plasma-cyan"}`}>{editMode ? <Unlock size={18} /> : <Lock size={18} />}</button>
          <button onClick={() => setNodes(defaultNodesRaw.map(n => ({ ...n, x: defaultPositions[n.id].x, y: defaultPositions[n.id].y })))} className="p-3 text-white/20 hover:text-white"><RefreshCw size={18} /></button>
          <button onClick={toggleFullscreen} className="p-3 text-white/20 hover:text-white">{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
        
        {/* Real-time Diagnostics HUD */}
        <div className="p-4 bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl space-y-3">
           <div className="text-[10px] font-black text-plasma-cyan uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Sparkles size={12} /> TRAJECTORY_PULSE
           </div>
           <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase"><span>Active Path</span> <span className="text-plasma-cyan">{activePath.upstream.size + activePath.downstream.size} Nodes</span></div>
              <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase"><span>System Load</span> <span className="text-green-400">0.04ms</span></div>
           </div>
        </div>
      </div>

      <div className="absolute top-8 left-8 z-50 flex items-center gap-4 bg-[#0A0A0F]/80 border border-white/5 rounded-2xl px-5 py-4 backdrop-blur-xl shadow-2xl group/search">
        <Search size={18} className="text-plasma-cyan group-focus-within/search:scale-125 transition-transform" />
        <input
          type="text"
          placeholder="IDENTIFY_SILICON_NODE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-mono text-white outline-none w-64 uppercase tracking-[0.3em] placeholder:opacity-20 decoration-none"
        />
      </div>

      <TransformWrapper
        initialScale={0.5}
        minScale={0.2}
        maxScale={3}
        centerOnInit
        panning={{ disabled: draggingId !== null }}
        wheel={{ step: 0.15 }}
      >
        {({ state }) => (
          <>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
              <div className="relative" style={{ width: 4000, height: 3000 }}>
                {/* Plasma SVG Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, idx) => {
                    const from = nodes.find(n => n.id === edge.from);
                    const to = nodes.find(n => n.id === edge.to);
                    if (!from || !to) return null;
                    const path = getBezierPath(from, to);
                    
                    const isPartOfActivePath = (hoveredId === edge.from && activePath.downstream.has(edge.to)) || 
                                              (hoveredId === edge.to && activePath.upstream.has(edge.from));
                    
                    const isFaint = hoveredId && !isPartOfActivePath;

                    return (
                      <React.Fragment key={idx}>
                        <path
                          d={path}
                          fill="none"
                          stroke={groupColors[from.group]}
                          strokeWidth={isPartOfActivePath ? 4 : 1.5}
                          className="transition-all duration-500"
                          style={{
                            opacity: isPartOfActivePath ? 0.8 : isFaint ? 0.05 : 0.2,
                            filter: isPartOfActivePath ? `drop-shadow(0 0 8px ${groupColors[from.group]})` : 'none'
                          }}
                        />
                        {physicsOn && (
                          <circle r={isPartOfActivePath ? 4 : 2} fill={groupColors[from.group]}>
                            <animateMotion dur={`${isPartOfActivePath ? 1 : 2.5 + Math.random() * 2}s`} repeatCount="indefinite" path={path} />
                            {isPartOfActivePath && <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite" />}
                          </circle>
                        )}
                      </React.Fragment>
                    );
                  })}
                </svg>

                {/* Cyber-Nodes Layer */}
                {nodes.map((node) => {
                  const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const isDragging = draggingId === node.id;
                  const isInActivePath = hoveredId === node.id || activePath.upstream.has(node.id) || activePath.downstream.has(node.id);
                  const isDimmed = hoveredId && !isInActivePath;
                  
                  return (
                    <motion.div
                      key={node.id}
                      drag={editMode}
                      dragMomentum={false}
                      onDragStart={() => setDraggingId(node.id)}
                      onDragEnd={(_, info) => {
                        setDraggingId(null);
                        updateNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y);
                      }}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ position: "absolute", left: node.x - 50, top: node.y - 50, zIndex: isInActivePath ? 50 : 10 }}
                      animate={{
                         scale: isDragging ? 1.2 : isInActivePath ? 1.1 : 1,
                         opacity: isDimmed ? 0.2 : 1,
                         y: physicsOn && !isDragging ? [0, -12, 0] : 0
                      }}
                      transition={{
                         y: { duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" },
                         opacity: { duration: 0.4 }
                      }}
                    >
                      <button
                        onClick={(e) => {
                          if (!editMode && node.domainId) onNodeClick(node.domainId);
                          e.stopPropagation();
                        }}
                        className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-[3px] transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group/node ${
                          isHighlighted ? "border-white shadow-white/40 scale-110" : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${groupColors[node.group]}15, ${groupColors[node.group]}05)`,
                          borderColor: isInActivePath ? groupColors[node.group] : groupColors[node.group] + "20",
                        }}
                      >
                         {/* Dynamic Glow Intensity based on Demand */}
                        <div 
                          className="absolute inset-0 opacity-20 transition-opacity group-hover/node:opacity-40"
                          style={{
                             boxShadow: isInActivePath ? `inset 0 0 30px ${groupColors[node.group]}` : 'none'
                          }}
                        />
                        
                        <div 
                           className="mb-2 transition-transform duration-500 group-hover/node:scale-125" 
                           style={{ color: groupColors[node.group], filter: `drop-shadow(0 0 10px ${groupColors[node.group]}80)` }}
                        >
                          {node.icon}
                        </div>
                        
                        <span className="text-[9px] font-black leading-tight px-2 text-center uppercase tracking-wider" style={{ color: groupColors[node.group] }}>
                           {node.name}
                        </span>

                        {/* Demand Indicator (Nodal Analytics) */}
                        <div className="absolute bottom-2 flex gap-1">
                           {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1 h-1 rounded-full ${i < (node.demandIntensity || 5)/2 ? '' : 'bg-white/5'}`} 
                                style={{ backgroundColor: i < (node.demandIntensity || 5)/2 ? groupColors[node.group] : undefined }}
                              />
                           ))}
                        </div>

                        {/* Interactive Scan-lines */}
                        <div className="absolute inset-0 bg-scan-line opacity-[0.03] pointer-events-none" />
                      </button>

                      <AnimatePresence>
                        {hoveredId === node.id && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 120 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute top-0 left-0 w-48 bg-[#0A0A0F]/95 border border-white/5 p-4 rounded-2xl shadow-3xl pointer-events-none z-[100] backdrop-blur-xl"
                          >
                             <div className="text-[10px] font-black text-white mb-2 uppercase tracking-[0.1em]">{node.name}</div>
                             <div className="h-0.5 w-full bg-white/5 mb-2" />
                             <div className="space-y-2">
                                <div className="text-[8px] font-mono text-white/40 uppercase">Demand Scalar: <span className="text-plasma-cyan">{node.demandIntensity}/10</span></div>
                                <div className="text-[8px] font-mono text-white/40 uppercase">Prerequisites: <span className="text-orange-400">{node.prerequisites.length || "ROOT"}</span></div>
                                <div className="text-[7px] text-grid-line italic leading-tight mt-2">[ CLICK_TO_INIT_INDUSTRIAL_PROBE ]</div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </TransformComponent>

            {/* Tactical Minimap */}
            {showMinimap && (
              <div className="absolute bottom-8 right-8 z-50 w-72 h-44 bg-[#0A0A0F]/80 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-3xl shadow-3xl group/minimap">
                <div className="w-full h-full relative cursor-crosshair">
                   <svg width="100%" height="100%" viewBox="0 0 4000 3000" preserveAspectRatio="none">
                      {edges.map((e, i) => {
                         const f = nodes.find(n => n.id === e.from);
                         const t = nodes.find(n => n.id === e.to);
                         return f && t ? <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={groupColors[f.group]} strokeWidth={20} opacity={0.2} /> : null;
                      })}
                      {nodes.map(n => <circle key={n.id} cx={n.x} cy={n.y} r={hoveredId === n.id ? 80 : 40} fill={groupColors[n.group]} className="transition-all" />)}
                   </svg>
                   <div className="absolute inset-0 bg-transparent hover:bg-white/5 transition-all" />
                   <div className="absolute top-3 left-4 text-[7px] font-black text-white/20 uppercase tracking-widest pointer-events-none">MINIMAP_RADAR</div>
                </div>
              </div>
            )}
            
            {/* View HUD */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-10 text-[9px] font-mono text-white/20 bg-[#0A0A0F]/60 px-10 py-3 rounded-full border border-white/5 backdrop-blur-xl z-50">
               <div className="flex items-center gap-2">ZOOM: <span className="text-white font-black">{(state.scale * 100).toFixed(0)}%</span></div>
               <div className="h-3 w-px bg-white/5" />
               <div className="flex items-center gap-2">ENGINE: <span className="text-plasma-cyan font-black">HYBRID_V4.2</span></div>
               <div className="h-3 w-px bg-white/5" />
               <div className="flex items-center gap-2">STATUS: <span className="text-green-400 font-black">STABLE</span></div>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
