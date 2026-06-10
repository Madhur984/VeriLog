import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as dagre from "dagre";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import { COMPANY_SKILL_MAP } from "../../../data/companySkillMap";
import { useColorScheme } from "../../../hooks/useColorScheme";
import { sfx } from "../utils/sfx";
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

// ---------- Mappings ----------
const SKILL_MAP_IDS: Record<string, string> = {
  basic_electronics: "basic-electronics",
  digital_logic: "digital-logic",
  verilog: "verilog",
  vlsi: "vlsi-design",
  embedded: "embedded-systems",
  signal_processing: "signal-processing",
  wireless: "wireless-comm",
  rf: "rf-microwave",
  power: "power-electronics",
  control: "control-systems",
  photonics: "photonics",
  defense: "defense-aero"
};

const groupColors: Record<number, string> = {
  1: "#FF5F1F", // Foundation (Orange)
  2: "#00D4FF", // Core (Cyan)
  3: "#FFDC00", // Bridge (Yellow)
  4: "#B10DC9", // Specialization (Purple)
};

const defaultPositions: Record<string, { x: number; y: number }> = {
  basic_electronics: { x: 200, y: 350 },
  digital_logic: { x: 500, y: 200 },
  verilog: { x: 850, y: 200 },
  vlsi: { x: 1200, y: 200 },
  embedded: { x: 850, y: 400 },
  signal_processing: { x: 500, y: 550 },
  wireless: { x: 850, y: 550 },
  rf: { x: 1200, y: 550 },
  power: { x: 850, y: 750 },
  control: { x: 1200, y: 750 },
  medical: { x: 1550, y: 400 },
  photonics: { x: 1550, y: 200 },
  defense: { x: 1900, y: 480 },
};

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

// ---------- Quiz Questions Map ----------
interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  basic_electronics: [
    {
      question: "What is the primary charge carrier in an N-type semiconductor?",
      options: ["Holes", "Electrons", "Protons", "Neutrons"],
      answer: 1,
      hint: "N-type stands for negative charge carrier."
    }
  ],
  digital_logic: [
    {
      question: "Which logic gate outputs 1 only when all inputs are 0?",
      options: ["AND", "NAND", "NOR", "XOR"],
      answer: 2,
      hint: "It is the negation of the OR gate."
    }
  ],
  verilog: [
    {
      question: "In Verilog, which operator represents non-blocking assignment?",
      options: ["=", "<=", "==", "=>"],
      answer: 1,
      hint: "Used in sequential always blocks."
    }
  ],
  vlsi: [
    {
      question: "What does leakage power in a CMOS cell primarily depend on?",
      options: ["Clock frequency", "Subthreshold current", "Load capacitance", "Toggle rate"],
      answer: 1,
      hint: "Leakage occurs even when the transistor is off."
    }
  ],
  embedded: [
    {
      question: "What type of register is used to configure pins as inputs or outputs?",
      options: ["Data Register", "Direction Register (DDR)", "Interrupt Register", "Status Register"],
      answer: 1,
      hint: "Commonly abbreviated as DDR (Data Direction Register)."
    }
  ],
  signal_processing: [
    {
      question: "What is the Nyquist rate for a signal with maximum frequency component of 5 kHz?",
      options: ["2.5 kHz", "5 kHz", "10 kHz", "20 kHz"],
      answer: 2,
      hint: "Nyquist rate is double the maximum frequency."
    }
  ],
  wireless: [
    {
      question: "Which modulation scheme is most spectral-efficient?",
      options: ["BPSK", "QPSK", "16-QAM", "64-QAM"],
      answer: 3,
      hint: "Higher order QAM packs more bits per symbol."
    }
  ],
  rf: [
    {
      question: "What is the characteristic impedance of standard RF transmission lines?",
      options: ["50 Ohms", "75 Ohms", "100 Ohms", "300 Ohms"],
      answer: 0,
      hint: "Commonly used in coaxial cables and test equipment."
    }
  ],
  power: [
    {
      question: "Which device is commonly used for high-voltage switching in power converters?",
      options: ["OP-AMP", "IGBT", "Schottky Diode", "Zener Diode"],
      answer: 1,
      hint: "Insulated-Gate Bipolar Transistor."
    }
  ],
  control: [
    {
      question: "A system is stable if all its closed-loop poles lie where?",
      options: ["Right half of s-plane", "Left half of s-plane", "On the imaginary axis", "At the origin"],
      answer: 1,
      hint: "Poles must have negative real parts for stability."
    }
  ],
  medical: [
    {
      question: "What is the primary frequency range of human ECG signals?",
      options: ["0.05 - 150 Hz", "1 - 10 kHz", "20 - 20,000 Hz", "1 - 10 MHz"],
      answer: 0,
      hint: "Electrocardiogram signals are low-frequency biopotentials."
    }
  ],
  photonics: [
    {
      question: "Which physical law describes the bending of light at an interface?",
      options: ["Snell's Law", "Ohm's Law", "Hooke's Law", "Bragg's Law"],
      answer: 0,
      hint: "n1 * sin(theta1) = n2 * sin(theta2)."
    }
  ],
  defense: [
    {
      question: "What type of radar uses Doppler shift to detect velocity?",
      options: ["Monopulse Radar", "Pulse-Doppler Radar", "Synthetic Aperture Radar", "Phased Array Radar"],
      answer: 1,
      hint: "Uses the Doppler frequency shift effect."
    }
  ]
};

// ---------- Error Boundary for 3D Fallback ----------
class WebGLErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Render Error, falling back to 2D:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ---------- 3D Node Mesh ----------
const ThreeDNode: React.FC<{
  node: GraphNode;
  isMastered: boolean;
  isRequired: boolean;
  isPreferred: boolean;
  isActive: boolean;
  color: string;
  onClick: () => void;
}> = ({ node, isMastered, isRequired, isPreferred, isActive, color, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Float relative to 0 since parent group handles primary coordinates
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + node.x) * 0.12;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const nodePos: [number, number, number] = [
    (node.x - 900) / 100,
    -(node.y - 450) / 100,
    (node.group === 1 ? -2.5 : node.group === 2 ? -0.8 : node.group === 3 ? 0.8 : 2.5)
  ];

  const strokeColor = isMastered ? '#10B981' : isRequired ? '#F59E0B' : color;
  const glowIntensity = isMastered ? 1.4 : isRequired ? 1.0 : hovered ? 0.8 : 0.2;

  return (
    <group 
      position={nodePos} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        setHovered(true); 
        document.body.style.cursor = 'pointer'; 
        sfx.playHover();
      }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <RoundedBox 
        ref={meshRef} 
        args={[1.8, 0.8, 0.4]} 
        radius={0.08} 
        smoothness={4}
        scale={hovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
      >
        <meshStandardMaterial
          color={isMastered ? '#064e3b' : '#0f172a'}
          roughness={0.25}
          metalness={0.8}
          emissive={strokeColor}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={isActive ? 1.0 : 0.15}
        />
      </RoundedBox>

      {/* Label */}
      <Text
        position={[0, 0.6, 0.05]}
        fontSize={0.15}
        color={isActive ? '#FFFFFF' : '#475569'}
        anchorX="center"
        anchorY="middle"
      >
        {node.name.toUpperCase()}
      </Text>

      {/* Sub-label */}
      <Text
        position={[0, -0.6, 0.05]}
        fontSize={0.09}
        color={isActive ? strokeColor : '#334155'}
        anchorX="center"
        anchorY="middle"
      >
        {isMastered ? '✓ MASTERED' : isRequired ? '⚠ REQUIRED' : '• PRE-REQ'}
      </Text>
    </group>
  );
};

// ---------- 3D Line Connection ----------
const ThreeDConnection: React.FC<{
  fromNode: GraphNode;
  toNode: GraphNode;
  isRelated: boolean;
  color: string;
}> = ({ fromNode, toNode, isRelated, color }) => {
  const fromPos: [number, number, number] = [
    (fromNode.x - 900) / 100,
    -(fromNode.y - 450) / 100,
    (fromNode.group === 1 ? -2.5 : fromNode.group === 2 ? -0.8 : fromNode.group === 3 ? 0.8 : 2.5)
  ];

  const toPos: [number, number, number] = [
    (toNode.x - 900) / 100,
    -(toNode.y - 450) / 100,
    (toNode.group === 1 ? -2.5 : toNode.group === 2 ? -0.8 : toNode.group === 3 ? 0.8 : 2.5)
  ];

  return (
    <Line
      points={[fromPos, toPos]}
      color={isRelated ? '#F59E0B' : color}
      lineWidth={isRelated ? 3.5 : 1.2}
      opacity={isRelated ? 0.8 : 0.2}
      transparent
    />
  );
};

// ---------- 3D Flow Particle ----------
const ThreeDFlowParticle: React.FC<{
  fromNode: GraphNode;
  toNode: GraphNode;
  color: string;
}> = ({ fromNode, toNode, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const fromPos: [number, number, number] = useMemo(() => [
    (fromNode.x - 900) / 100,
    -(fromNode.y - 450) / 100,
    (fromNode.group === 1 ? -2.5 : fromNode.group === 2 ? -0.8 : fromNode.group === 3 ? 0.8 : 2.5)
  ], [fromNode]);

  const toPos: [number, number, number] = useMemo(() => [
    (toNode.x - 900) / 100,
    -(toNode.y - 450) / 100,
    (toNode.group === 1 ? -2.5 : toNode.group === 2 ? -0.8 : toNode.group === 3 ? 0.8 : 2.5)
  ], [toNode]);

  const speed = useMemo(() => 0.35 + Math.random() * 0.35, []);
  const offset = useMemo(() => Math.random() * Math.PI, []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = ((state.clock.elapsedTime * speed) + offset) % 1.0;
      meshRef.current.position.x = fromPos[0] + (toPos[0] - fromPos[0]) * t;
      meshRef.current.position.y = fromPos[1] + (toPos[1] - fromPos[1]) * t;
      meshRef.current.position.z = fromPos[2] + (toPos[2] - fromPos[2]) * t;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.8} />
    </mesh>
  );
};

// ---------- 3D Constellation Scene ----------
const ThreeDGraphScene: React.FC<{
  nodes: GraphNode[];
  edges: { from: string; to: string }[];
  selectedCompany: string | null;
  masteredNodes: Set<string>;
  onNodeClick?: (nodeId: string) => void;
  requirements: any;
  isLight: boolean;
  physicsOn: boolean;
}> = ({ nodes, edges, selectedCompany, masteredNodes, onNodeClick, requirements, isLight, physicsOn }) => {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 60 }} className="w-full h-full">
      <ambientLight intensity={isLight ? 1.0 : 0.3} />
      <directionalLight position={[5, 10, 5]} intensity={isLight ? 0.8 : 1.4} />
      <pointLight position={[-5, -10, -5]} intensity={0.6} />
      
      <Stars radius={90} depth={40} count={1500} factor={4} saturation={0.5} fade speed={1.2} />
      
      <group>
        {/* Render Connections */}
        {edges.map((edge, idx) => {
          const from = nodes.find(n => n.id === edge.from);
          const to = nodes.find(n => n.id === edge.to);
          if (!from || !to) return null;
          
          const isRelated = requirements && 
            (requirements.required.includes(SKILL_MAP_IDS[edge.from]) || requirements.required.includes(SKILL_MAP_IDS[edge.to]));
          
          const color = isLight ? '#CBD5E1' : '#1e293b';
          const edgeColor = isRelated ? '#F59E0B' : groupColors[from.group];

          return (
            <React.Fragment key={`edge-group-${idx}`}>
              <ThreeDConnection
                fromNode={from}
                toNode={to}
                isRelated={!!isRelated}
                color={color}
              />
              {physicsOn && (
                <ThreeDFlowParticle
                  fromNode={from}
                  toNode={to}
                  color={edgeColor}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Render Nodes */}
        {nodes.map(node => {
          const mappedId = SKILL_MAP_IDS[node.id];
          const isMastered = masteredNodes.has(mappedId);
          const isRequired = requirements?.required.includes(mappedId) || false;
          const isPreferred = requirements?.preferred.includes(mappedId) || false;
          const isActive = !selectedCompany || isRequired || isPreferred;
          
          const color = groupColors[node.group];
          return (
            <ThreeDNode
              key={node.id}
              node={node}
              isMastered={isMastered}
              isRequired={isRequired}
              isPreferred={isPreferred}
              isActive={isActive}
              color={color}
              onClick={() => {
                if (mappedId && onNodeClick) {
                  onNodeClick(mappedId);
                }
              }}
            />
          );
        })}
      </group>
      
      <OrbitControls enableDamping dampingFactor={0.05} maxDistance={18} minDistance={3} />
    </Canvas>
  );
};

// ---------- Main Hybrid Skill Graph ----------
interface SkillGraphProps {
  selectedCompany: string | null;
  masteredNodes: Set<string>;
  onNodeClick?: (nodeId: string) => void;
  viewMode?: "2D" | "3D";
  onDragCount?: (count: number) => void;
}

export const SkillGraph: React.FC<SkillGraphProps> = ({
  selectedCompany,
  masteredNodes,
  onNodeClick,
  viewMode = "2D",
  onDragCount
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === "light";

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
  const [physicsOn, setPhysicsOn] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------- Quiz Gate State & Handlers ----------
  const [quizNode, setQuizNode] = useState<GraphNode | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleNodeClick = (nodeOrId: GraphNode | string) => {
    let node: GraphNode | undefined;
    let mappedId: string | undefined;

    if (typeof nodeOrId === 'string') {
      mappedId = nodeOrId;
      const nodeKey = Object.keys(SKILL_MAP_IDS).find(key => SKILL_MAP_IDS[key] === nodeOrId);
      if (nodeKey) {
        node = nodes.find(n => n.id === nodeKey);
      }
    } else {
      node = nodeOrId;
      mappedId = SKILL_MAP_IDS[node.id];
    }

    if (!node || !mappedId) return;

    if (masteredNodes.has(mappedId)) {
      if (onNodeClick) {
        onNodeClick(mappedId);
        sfx.playClick();
      }
    } else {
      setQuizNode(node);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setQuizCorrect(false);
      setShowHint(false);
      sfx.playClick();
    }
  };

  const currentQuestions = quizNode ? QUIZ_QUESTIONS[quizNode.id] : null;
  const currentQuestion = currentQuestions ? currentQuestions[0] : null;

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentQuestion || !quizNode) return;
    
    setQuizSubmitted(true);
    if (selectedOption === currentQuestion.answer) {
      setQuizCorrect(true);
      sfx.playSuccess();
      const mappedId = SKILL_MAP_IDS[quizNode.id];
      if (mappedId && onNodeClick) {
        onNodeClick(mappedId);
      }
      setTimeout(() => {
        setQuizNode(null);
        setSelectedOption(null);
        setQuizSubmitted(false);
        setQuizCorrect(false);
        setShowHint(false);
      }, 1500);
    } else {
      setQuizCorrect(false);
      sfx.playGlitch();
      setShowHint(true);
    }
  };

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

  const edges = useMemo(() => {
    return nodes.flatMap(n => n.prerequisites.map(p => ({ from: p, to: n.id })));
  }, [nodes]);

  const requirements = selectedCompany ? COMPANY_SKILL_MAP[selectedCompany] : null;

  if (viewMode === "3D") {
    return (
      <div 
        ref={containerRef} 
        className={`w-full ${isFullscreen ? "fixed inset-0 z-[100] bg-[#020408]" : "h-[700px] bg-[#020408]/90 border border-white/5 rounded-3xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)]"} overflow-hidden relative transition-all duration-700 font-mono`}
      >
        {/* WebGL 3D Controls HUD */}
        <div className="absolute top-6 right-6 z-50 flex flex-col gap-4">
          <div className="flex gap-2 p-1 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <button onClick={toggleFullscreen} className="p-3 text-slate-400 hover:text-white transition-all">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <div className="p-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl space-y-2 pointer-events-none">
            <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={11} /> 3D_CONSTELLATION
            </div>
            <div className="text-[8px] text-slate-500 uppercase leading-normal">
              DRAG TO ROTATE SCENE<br/>
              SCROLL TO ZOOM CAMERA
            </div>
          </div>
        </div>

        <WebGLErrorBoundary fallback={
          <div className="w-full h-full flex items-center justify-center bg-black">
            <span className="font-mono text-xs text-red-400 uppercase tracking-widest">WebGL Context Lost. Fallback to 2D.</span>
          </div>
        }>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-black">
              <span className="font-mono text-xs text-cyan-400 animate-pulse tracking-widest">BOOTING 3D RENDERING SYSTEM...</span>
            </div>
          }>
            <ThreeDGraphScene
              nodes={nodes}
              edges={edges}
              selectedCompany={selectedCompany}
              masteredNodes={masteredNodes}
              onNodeClick={handleNodeClick}
              requirements={requirements}
              isLight={isLight}
              physicsOn={physicsOn}
            />
          </Suspense>
        </WebGLErrorBoundary>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full ${isFullscreen ? "fixed inset-0 z-[100] bg-bg-void" : "h-[700px] bg-observatory-surface/40 border border-border-soft rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.15)]"} overflow-hidden relative transition-all duration-700`}
    >
      {/* 2D HUD */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-4">
        <div className="flex gap-1.5 p-1 bg-observatory-surface border border-border-soft rounded-2xl shadow-2xl backdrop-blur-md">
          <button 
            onClick={() => setPhysicsOn(!physicsOn)} 
            className={`p-3 rounded-xl transition-all ${physicsOn ? "text-cyan-400 bg-cyan-400/10" : "text-text-dim hover:text-text-main"}`} 
            title="Toggle Flow Particles"
          >
            <Activity size={16} />
          </button>
          <button 
            onClick={() => autoLayout("LR")} 
            className="p-3 text-text-dim hover:text-cyan-400 transition-all" 
            title="Auto Layout"
          >
            <Layout size={16} />
          </button>
          <button 
            onClick={() => setEditMode(!editMode)} 
            className={`p-3 rounded-xl transition-all ${editMode ? "bg-cyan-400 text-black" : "text-text-dim hover:text-cyan-400"}`} 
            title={editMode ? "Lock Nodes" : "Unlock Dragging"}
          >
            {editMode ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
          <button 
            onClick={() => setNodes(defaultNodesRaw.map(n => ({ ...n, x: defaultPositions[n.id]?.x ?? defaultPositions[n.id].x, y: defaultPositions[n.id]?.y ?? defaultPositions[n.id].y })))} 
            className="p-3 text-text-dim hover:text-text-main"
            title="Reset Positions"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={toggleFullscreen} 
            className="p-3 text-text-dim hover:text-text-main"
            title="Fullscreen Toggle"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        
        {/* Nodal Statistics */}
        <div className="p-4 bg-observatory-surface border border-border-soft rounded-2xl shadow-2xl space-y-2 backdrop-blur-md pointer-events-none">
           <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Sparkles size={11} /> SCAN_TELEMETRY
           </div>
           <div className="space-y-1 font-mono text-[8px] text-text-dim">
              <div className="flex justify-between gap-6 uppercase"><span>Active Path</span> <span className="text-cyan-400">{activePath.upstream.size + activePath.downstream.size} Nodes</span></div>
              <div className="flex justify-between gap-6 uppercase"><span>Mastered</span> <span className="text-green-400">{masteredNodes.size} Nodes</span></div>
           </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-observatory-surface border border-border-soft rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md group/search">
        <Search size={16} className="text-cyan-400" />
        <input
          type="text"
          placeholder="IDENTIFY_SILICON_NODE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[10px] font-mono text-text-main outline-none w-56 uppercase tracking-[0.2em] placeholder:opacity-20"
        />
      </div>

      <TransformWrapper
        initialScale={0.7}
        minScale={0.2}
        maxScale={2.5}
        centerOnInit
        panning={{ disabled: draggingId !== null }}
        wheel={{ step: 0.15 }}
      >
        {({ state }) => (
          <>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
              <div className="relative" style={{ width: 3000, height: 2000 }}>
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, idx) => {
                    const from = nodes.find(n => n.id === edge.from);
                    const to = nodes.find(n => n.id === edge.to);
                    if (!from || !to) return null;
                    const path = getBezierPath(from, to);
                    
                    const isPartOfActivePath = (hoveredId === edge.from && activePath.downstream.has(edge.to)) || 
                                              (hoveredId === edge.to && activePath.upstream.has(edge.from));
                    
                    const isCompanyPrereq = requirements && 
                      (requirements.required.includes(SKILL_MAP_IDS[edge.from]) || requirements.required.includes(SKILL_MAP_IDS[edge.to]));

                    const isFaint = hoveredId && !isPartOfActivePath;
                    const edgeColor = isCompanyPrereq ? '#F59E0B' : groupColors[from.group];

                    return (
                      <React.Fragment key={idx}>
                        <path
                          d={path}
                          fill="none"
                          stroke={edgeColor}
                          strokeWidth={isPartOfActivePath ? 3.5 : isCompanyPrereq ? 2 : 1.2}
                          className="transition-all duration-300"
                          style={{
                            opacity: isPartOfActivePath ? 0.9 : isFaint ? 0.05 : isCompanyPrereq ? 0.45 : 0.25,
                            filter: isPartOfActivePath ? `drop-shadow(0 0 6px ${edgeColor})` : 'none'
                          }}
                        />
                        {physicsOn && (
                          <circle r={isPartOfActivePath ? 3.5 : 2} fill={edgeColor}>
                            <animateMotion dur={`${isPartOfActivePath ? 1.2 : 2.5 + Math.random() * 2}s`} repeatCount="indefinite" path={path} />
                          </circle>
                        )}
                      </React.Fragment>
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {nodes.map((node) => {
                  const mappedId = SKILL_MAP_IDS[node.id];
                  const isMastered = masteredNodes.has(mappedId);
                  const isRequired = requirements?.required.includes(mappedId) || false;
                  const isPreferred = requirements?.preferred.includes(mappedId) || false;
                  const isActive = !selectedCompany || isRequired || isPreferred;
                  
                  const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const isDragging = draggingId === node.id;
                  const isInActivePath = hoveredId === node.id || activePath.upstream.has(node.id) || activePath.downstream.has(node.id);
                  const isDimmed = (hoveredId && !isInActivePath) || !isActive;
                  
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
                      style={{ position: "absolute", left: node.x - 56, top: node.y - 56, zIndex: isInActivePath ? 40 : 10 }}
                      animate={{
                         scale: isDragging ? 1.15 : isInActivePath ? 1.08 : 1,
                         opacity: isDimmed ? 0.2 : 1,
                         y: physicsOn && !isDragging ? [0, -8, 0] : 0
                      }}
                      transition={{
                         y: { duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" },
                         opacity: { duration: 0.3 }
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!editMode) {
                            handleNodeClick(node);
                          }
                        }}
                        className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-[3px] transition-all relative overflow-hidden group/node ${
                          isHighlighted ? "border-white shadow-lg shadow-white/20 scale-110" : ""
                        }`}
                        style={{
                          background: isMastered
                            ? (isLight ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.12)')
                            : `linear-gradient(135deg, ${groupColors[node.group]}15, ${groupColors[node.group]}05)`,
                          borderColor: isMastered 
                            ? '#10B981' 
                            : isRequired 
                              ? '#F59E0B' 
                              : isInActivePath 
                                ? groupColors[node.group] 
                                : groupColors[node.group] + "20",
                          borderWidth: isMastered || isRequired || isInActivePath ? '3px' : '2px',
                        }}
                      >
                        {/* Internal Glow Effect */}
                        <div 
                          className="absolute inset-0 opacity-10 transition-opacity group-hover/node:opacity-30"
                          style={{
                             boxShadow: isMastered 
                               ? 'inset 0 0 20px #10B981' 
                               : isRequired 
                                 ? 'inset 0 0 20px #F59E0B' 
                                 : `inset 0 0 20px ${groupColors[node.group]}`
                          }}
                        />
                        
                        <div 
                           className="mb-1.5 transition-transform duration-300 group-hover/node:scale-110" 
                           style={{ 
                             color: isMastered ? '#10B981' : isRequired ? '#F59E0B' : groupColors[node.group],
                             filter: `drop-shadow(0 0 6px ${isMastered ? '#10B981' : isRequired ? '#F59E0B' : groupColors[node.group]}80)` 
                           }}
                        >
                          {node.icon}
                        </div>
                        
                        <span 
                          className="text-[9px] font-black leading-tight px-1.5 text-center uppercase tracking-wider" 
                          style={{ color: isMastered ? '#10B981' : isRequired ? '#F59E0B' : groupColors[node.group] }}
                        >
                           {node.name}
                        </span>

                        {/* Demand Indicator (Scale Dots) */}
                        <div className="absolute bottom-2.5 flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-0.5 h-0.5 rounded-full" 
                                style={{ 
                                  backgroundColor: i < (node.demandIntensity || 5)/2 
                                    ? (isMastered ? '#10B981' : isRequired ? '#F59E0B' : groupColors[node.group]) 
                                    : '#334155' 
                                }}
                              />
                           ))}
                        </div>
                      </button>

                      {/* Interactive Diagnostics Tooltip */}
                      <AnimatePresence>
                        {hoveredId === node.id && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 122 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute top-0 left-0 w-44 bg-observatory-surface border border-border-soft p-3 rounded-2xl shadow-3xl pointer-events-none z-[100] backdrop-blur-xl"
                          >
                             <div className="text-[9px] font-black text-text-main mb-1.5 uppercase tracking-wide">{node.name}</div>
                             <div className="h-px w-full bg-border-soft mb-1.5" />
                             <div className="space-y-1 font-mono text-[7px] text-text-dim">
                                <div className="uppercase">Demand Scalar: <span className="text-cyan-400">{node.demandIntensity}/10</span></div>
                                <div className="uppercase">Prerequisites: <span className="text-orange-400">{node.prerequisites.length || "ROOT"}</span></div>
                                <div className="uppercase">Status: <span className={isMastered ? "text-green-400" : "text-amber-500"}>{isMastered ? "MASTERED" : "UNLOCKED"}</span></div>
                                <div className="italic leading-normal text-text-dim/60 mt-1.5">[ CLICK_TO_TOGGLE_MASTERY ]</div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </TransformComponent>

             {/* View Scale Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[8px] font-mono text-text-dim/60 bg-observatory-surface border border-border-soft px-8 py-2.5 rounded-full backdrop-blur-md z-50 shadow-2xl">
               <div className="flex items-center gap-1.5">ZOOM: <span className="text-text-main font-black">{(state.scale * 100).toFixed(0)}%</span></div>
               <div className="h-3 w-px bg-border-soft" />
               <div className="flex items-center gap-1.5">ENGINE: <span className="text-cyan-400 font-black">DAGRE_2D</span></div>
               <div className="h-3 w-px bg-border-soft" />
               <div className="flex items-center gap-1.5">STATUS: <span className="text-green-400 font-black">STABLE</span></div>
            </div>
          </>
        )}
      </TransformWrapper>
      {/* Cybernetic Quiz Gate Modal */}
      <AnimatePresence>
        {quizNode && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[999] flex items-center justify-center p-4 font-mono"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0b0f19] border-2 border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] relative"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    setQuizNode(null);
                    sfx.playClick();
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  [X]
                </button>
              </div>

              <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles size={11} /> SECURE_COGNITIVE_CHALLENGE
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                {quizNode.name} Mastery Gate
              </h4>

              <p className="text-[11px] text-slate-350 mb-6 leading-relaxed uppercase tracking-wide">
                {currentQuestion.question}
              </p>

              <div className="space-y-2.5 mb-6">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = "border-white/10 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 bg-white/[0.02]";
                  if (isSelected) {
                    btnStyle = "border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]";
                  }
                  if (quizSubmitted) {
                    if (idx === currentQuestion.answer) {
                      btnStyle = "border-green-500 text-green-500 bg-green-500/10";
                    } else if (isSelected) {
                      btnStyle = "border-red-500 text-red-500 bg-red-500/10";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => {
                        setSelectedOption(idx);
                        sfx.playClick();
                      }}
                      className={`w-full p-3.5 rounded-xl border text-[10px] text-left transition-all uppercase tracking-widest ${btnStyle}`}
                    >
                      {idx + 1}. {option}
                    </button>
                  );
                })}
              </div>

              {showHint && !quizCorrect && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6 text-[9px] text-amber-500 leading-normal uppercase">
                  <strong>SYSTEM_HINT:</strong> {currentQuestion.hint}
                </div>
              )}

              {quizSubmitted ? (
                <div className="text-center p-2">
                  {quizCorrect ? (
                    <span className="text-[10px] font-black text-green-400 tracking-widest animate-pulse">
                      [ ACCESS_GRANTED - NODE MASTERED ]
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-red-400 tracking-widest animate-pulse">
                      [ DECRYPTION_FAILED - TRY AGAIN ]
                    </span>
                  )}
                </div>
              ) : (
                <button
                  disabled={selectedOption === null}
                  onClick={handleQuizSubmit}
                  className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedOption !== null
                      ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:scale-[1.02]"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  SUBMIT_COGNITIVE_KEY
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
