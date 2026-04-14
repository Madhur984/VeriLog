import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dagre from "dagre";
import {
  CircuitBoard, Cpu, Wifi, Radio, Zap, Move3d, Shield, Eye, TrendingUp,
  Lock, Unlock, RefreshCw, Maximize2, Minimize2, Download, Upload, Search,
  GitBranch, Layout, Sparkles, Activity
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
  group: number; // For colored categorization (from ForceGraph2D)
}

// ---------- Default Data with Group Mapping ----------
const defaultNodesRaw: Omit<GraphNode, "x" | "y">[] = [
  { id: "basic_electronics", name: "Basic Electronics", icon: <Zap size={20} />, domainId: "", prerequisites: [], group: 1 },
  { id: "digital_logic", name: "Digital Logic", icon: <CircuitBoard size={20} />, domainId: "", prerequisites: ["basic_electronics"], group: 2 },
  { id: "verilog", name: "Verilog/VHDL", icon: <Cpu size={20} />, domainId: "", prerequisites: ["digital_logic"], group: 3 },
  { id: "vlsi", name: "VLSI Design", icon: <Cpu size={20} />, domainId: "vlsi", prerequisites: ["verilog"], group: 4 },
  { id: "embedded", name: "Embedded Systems", icon: <CircuitBoard size={20} />, domainId: "embedded", prerequisites: ["digital_logic"], group: 4 },
  { id: "signal_processing", name: "Signal Processing", icon: <Radio size={20} />, domainId: "signal", prerequisites: ["basic_electronics"], group: 2 },
  { id: "wireless", name: "Wireless Comm", icon: <Wifi size={20} />, domainId: "wireless", prerequisites: ["signal_processing"], group: 4 },
  { id: "rf", name: "RF & Microwave", icon: <Radio size={20} />, domainId: "rf", prerequisites: ["wireless"], group: 4 },
  { id: "power", name: "Power Electronics", icon: <Zap size={20} />, domainId: "power", prerequisites: ["basic_electronics"], group: 4 },
  { id: "control", name: "Control Systems", icon: <Move3d size={20} />, domainId: "control", prerequisites: ["basic_electronics"], group: 4 },
  { id: "medical", name: "Medical Electronics", icon: <Shield size={20} />, domainId: "medical", prerequisites: ["signal_processing", "embedded"], group: 4 },
  { id: "photonics", name: "Photonics", icon: <Eye size={20} />, domainId: "photonics", prerequisites: ["basic_electronics"], group: 4 },
  { id: "defense", name: "Defense & Aerospace", icon: <TrendingUp size={20} />, domainId: "defense", prerequisites: ["rf", "control"], group: 4 },
];

const groupColors: Record<number, string> = {
  1: "#FF5F1F", // Foundation (Orange)
  2: "#00D4FF", // Core (Cyan)
  3: "#FFDC00", // Bridge (Yellow)
  4: "#B10DC9", // Specialization (Purple)
};

const defaultPositions: Record<string, { x: number; y: number }> = {
  basic_electronics: { x: 100, y: 350 },
  digital_logic: { x: 300, y: 150 },
  verilog: { x: 600, y: 150 },
  vlsi: { x: 900, y: 150 },
  embedded: { x: 600, y: 350 },
  signal_processing: { x: 600, y: 550 },
  wireless: { x: 900, y: 550 },
  rf: { x: 1200, y: 550 },
  power: { x: 900, y: 350 },
  control: { x: 1200, y: 350 },
  medical: { x: 1500, y: 350 },
  photonics: { x: 1500, y: 150 },
  defense: { x: 1800, y: 350 },
};

const applyAutoLayout = (nodesRaw: Omit<GraphNode, "x" | "y">[], direction: "LR" | "TB" = "LR"): GraphNode[] => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 150, ranksep: 200, marginx: 150, marginy: 150 });
  g.setDefaultEdgeLabel(() => ({}));
  nodesRaw.forEach(node => g.setNode(node.id, { width: 100, height: 100 }));
  nodesRaw.forEach(node => node.prerequisites.forEach(pre => g.setEdge(pre, node.id)));
  dagre.layout(g);
  return nodesRaw.map(node => {
     const p = g.node(node.id);
     return { ...node, x: p.x, y: p.y };
  });
};

const loadSavedPositions = () => {
  try {
    const saved = localStorage.getItem("skill_graph_mixed_positions");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return defaultPositions;
};

const buildNodes = (saved: Record<string, { x: number; y: number }>, auto = false): GraphNode[] => {
  if (auto) return applyAutoLayout(defaultNodesRaw, "LR");
  return defaultNodesRaw.map(node => ({
    ...node,
    x: saved[node.id]?.x ?? defaultPositions[node.id].x,
    y: saved[node.id]?.y ?? defaultPositions[node.id].y,
  }));
};

interface SkillGraphProps {
  onNodeClick: (domainId: string) => void;
  unlockedNodes?: Set<string>;
}

export const SkillGraph: React.FC<SkillGraphProps> = ({ onNodeClick, unlockedNodes = new Set() }) => {
  const [nodes, setNodes] = useState<GraphNode[]>(() => buildNodes(loadSavedPositions(), false));
  const [editMode, setEditMode] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMinimap, setShowMinimap] = useState(true);
  const [physicsOn, setPhysicsOn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach(node => { positions[node.id] = { x: node.x, y: node.y }; });
    localStorage.setItem("skill_graph_mixed_positions", JSON.stringify(positions));
  }, [nodes]);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => node.id === id ? { ...node, x, y } : node));
  }, []);

  const resetLayout = () => setNodes(buildNodes(defaultPositions, false));
  const autoLayout = () => setNodes(applyAutoLayout(defaultNodesRaw, "LR"));

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

  const filteredNodeIds = searchTerm
    ? nodes.filter(node => node.name.toLowerCase().includes(searchTerm.toLowerCase())).map(n => n.id)
    : [];

  const edges = nodes.flatMap(node =>
    node.prerequisites.map(pre => ({ from: pre, to: node.id }))
  );

  return (
    <div ref={containerRef} className={`w-full ${isFullscreen ? "fixed inset-0 z-[100] bg-matte-obsidian" : "h-[700px] bg-matte-obsidian/40 border border-ghost-trace rounded-3xl"} overflow-hidden relative transition-all duration-500`}>
      {/* Mixed HUD HUD (Combining both vibes) */}
      <div className="absolute top-6 right-6 z-50 flex gap-3 p-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
        <button
           onClick={() => setPhysicsOn(!physicsOn)}
           className={`p-3 rounded-xl transition-all ${physicsOn ? "text-plasma-cyan shadow-cyan-glow bg-plasma-cyan/10" : "text-grid-line"}`}
           title="Toggle Particle Physics"
        >
          <Activity size={18} />
        </button>
        <button
          onClick={autoLayout}
          className="p-3 text-grid-line hover:text-white transition-all"
          title="Hierarchical Sort"
        >
          <Layout size={18} />
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`p-3 rounded-xl transition-all ${editMode ? "bg-plasma-cyan text-black" : "text-plasma-cyan hover:bg-plasma-cyan/10"}`}
          title="Reposition Nodes"
        >
          {editMode ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
        <button onClick={resetLayout} className="p-3 text-grid-line hover:text-white"><RefreshCw size={18} /></button>
        <button onClick={toggleFullscreen} className="p-3 text-grid-line hover:text-white">
           {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl px-4 py-3 backdrop-blur-md">
        <Search size={16} className="text-plasma-cyan" />
        <input
          type="text"
          placeholder="SEARCH_SILICON_WEB..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[10px] font-mono text-oscilloscope-trace outline-none w-48 uppercase tracking-widest"
        />
      </div>

      <TransformWrapper
        initialScale={0.6}
        minScale={0.3}
        maxScale={2.5}
        centerOnInit
        panning={{ disabled: draggingId !== null }}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform, state }) => (
          <>
            <div className="absolute bottom-6 left-6 z-50 flex gap-2">
              <button onClick={() => zoomIn()} className="w-10 h-10 bg-black/40 border border-white/5 rounded-xl text-grid-line">+</button>
              <button onClick={() => zoomOut()} className="w-10 h-10 bg-black/40 border border-white/5 rounded-xl text-grid-line">-</button>
              <button onClick={() => resetTransform()} className="px-4 h-10 bg-black/40 border border-white/5 rounded-xl text-[10px] font-mono text-grid-line">CENTER_VIEW</button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: 3000, height: 2000 }}>
                {edges.map((edge, idx) => {
                  const from = nodes.find(n => n.id === edge.from);
                  const to = nodes.find(n => n.id === edge.to);
                  if (!from || !to) return null;
                  const path = getBezierPath(from, to);
                  const pathId = `path-${idx}`;
                  
                  return (
                    <React.Fragment key={idx}>
                      <path
                        id={pathId}
                        d={path}
                        fill="none"
                        stroke={groupColors[from.group] + "40"}
                        strokeWidth={2}
                        className="transition-all"
                      />
                      {physicsOn && (
                        <circle r="3" fill={groupColors[from.group]}>
                          <animateMotion
                            dur={`${2 + Math.random() * 2}s`}
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      )}
                    </React.Fragment>
                  );
                })}
              </svg>

              <div className="relative" style={{ width: 3000, height: 2000 }}>
                {nodes.map((node) => {
                  const isHighlighted = filteredNodeIds.includes(node.id);
                  const isDragging = draggingId === node.id;
                  
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
                      style={{
                        position: "absolute",
                        left: node.x - 45,
                        top: node.y - 45,
                        zIndex: isDragging ? 50 : 10,
                      }}
                      animate={{
                         scale: isDragging ? 1.15 : 1,
                         y: physicsOn && !isDragging ? [0, -10, 0] : 0
                      }}
                      transition={{
                         y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                         scale: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                    >
                      <button
                        onClick={(e) => {
                          if (!editMode && node.domainId) onNodeClick(node.domainId);
                          e.stopPropagation();
                        }}
                        className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 transition-all shadow-2xl relative group/node ${
                          isDragging ? "opacity-90" : "opacity-100"
                        } ${isHighlighted ? "border-white shadow-white/20" : "border-white/5"}`}
                        style={{
                          background: `radial-gradient(circle at center, ${groupColors[node.group]}30, transparent)`,
                          borderColor: groupColors[node.group] + (isHighlighted ? "FF" : "40")
                        }}
                      >
                        <div style={{ color: groupColors[node.group] }}>{node.icon}</div>
                        <span className="text-[10px] font-mono leading-tight px-1 text-center font-black uppercase mt-1" style={{ color: groupColors[node.group] }}>
                           {node.name}
                        </span>

                        {/* Particle Ring (from ForceGraph flavor) */}
                        <div className="absolute inset-[-8px] rounded-full border border-dashed opacity-20 group-hover/node:opacity-100 transition-opacity animate-spin-slow" style={{ borderColor: groupColors[node.group] }} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </TransformComponent>

            {/* Force-Style Minimap */}
            {showMinimap && (
              <div className="absolute bottom-6 right-6 z-50 w-60 h-44 bg-black/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                <div className="w-full h-full relative">
                  <svg width="100%" height="100%" viewBox="0 0 3000 2000" preserveAspectRatio="none">
                    {edges.map((e, i) => {
                      const f = nodes.find(n => n.id === e.from);
                      const t = nodes.find(n => n.id === e.to);
                      return f && t ? <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={groupColors[f.group]} strokeWidth={15} opacity={0.3} /> : null;
                    })}
                    {nodes.map(n => <circle key={n.id} cx={n.x} cy={n.y} r={30} fill={groupColors[n.group]} />)}
                  </svg>
                  <div className="absolute inset-0 hover:bg-white/5 transition-all cursor-crosshair" onClick={() => setShowMinimap(!showMinimap)} />
                </div>
              </div>
            )}
          </>
        )}
      </TransformWrapper>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[9px] font-mono text-grid-line bg-black/60 px-8 py-2 rounded-full border border-white/5 z-50">
        <div className="flex items-center gap-2"><Sparkles size={12} className="text-plasma-cyan" /> MIXED_ENGINE_ACTIVE</div>
        <div className="h-2 w-px bg-white/10" />
        <div>DRAG_NODE: {editMode ? "READY" : "LOCKED"}</div>
        <div className="h-2 w-px bg-white/10" />
        <div>PHYSICS: {physicsOn ? "LIVE" : "IDLE"}</div>
      </div>
    </div>
  );
};
