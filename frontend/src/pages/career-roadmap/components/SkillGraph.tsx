import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { COMPANY_SKILL_MAP } from '../../../data/companySkillMap';
import * as dagre from 'dagre';

interface SkillGraphProps {
  selectedCompany: string | null;
  masteredNodes: Set<string>;
}

export const SkillGraph: React.FC<SkillGraphProps> = ({ selectedCompany, masteredNodes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mock graph data - in production this would come from a data file
  const graphData = {
    nodes: [
      { id: 'digital-logic', label: 'Digital Logic', group: 'foundation' },
      { id: 'verilog', label: 'Verilog HDL', group: 'core' },
      { id: 'vlsi-design', label: 'VLSI Design', group: 'core' },
      { id: 'rtl-synthesis', label: 'RTL Synthesis', group: 'core' },
      { id: 'timing-analysis', label: 'Static Timing', group: 'core' },
      { id: 'computer-arch', label: 'Comp Arch', group: 'foundation' },
      { id: 'cuda-programming', label: 'CUDA', group: 'spec' },
      { id: 'embedded-systems', label: 'Embedded', group: 'spec' },
    ],
    edges: [
      { from: 'digital-logic', to: 'verilog' },
      { from: 'digital-logic', to: 'computer-arch' },
      { from: 'verilog', to: 'vlsi-design' },
      { from: 'vlsi-design', to: 'rtl-synthesis' },
      { from: 'rtl-synthesis', to: 'timing-analysis' },
      { from: 'computer-arch', to: 'cuda-programming' },
    ]
  };

  const layout = useMemo(() => {
    if (dimensions.width === 0) return null;

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100 });
    g.setDefaultEdgeLabel(() => ({}));

    graphData.nodes.forEach(node => {
      g.setNode(node.id, { width: 140, height: 56 });
    });

    graphData.edges.forEach(edge => {
      g.setEdge(edge.from, edge.to);
    });

    dagre.layout(g);

    return {
      nodes: graphData.nodes.map(node => ({
        ...node,
        x: g.node(node.id).x,
        y: g.node(node.id).y,
      })),
      edges: graphData.edges.map(edge => ({
        ...edge,
        points: g.edge(edge.from, edge.to).points,
      }))
    };
  }, [dimensions]);

  if (dimensions.width === 0 || !layout) {
    return (
      <div ref={containerRef} className="w-full h-[600px] bg-observatory-surface/30 rounded-2xl animate-pulse flex items-center justify-center">
        <span className="font-mono text-xs text-slate-700 tracking-widest">INITIALIZING TOPOLOGY...</span>
      </div>
    );
  }

  const requirements = selectedCompany ? COMPANY_SKILL_MAP[selectedCompany] : null;

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-observatory-surface rounded-2xl border border-white/5 relative overflow-hidden">
      <svg className="w-full h-full">
        <g transform={`translate(${dimensions.width / 4}, 50)`}>
          {/* Render Edges */}
          {layout.edges.map((edge, i) => {
            const isRelatedToCompany = requirements && 
              (requirements.required.includes(edge.from) || requirements.required.includes(edge.to));
            
            return (
              <path
                key={i}
                d={`M ${edge.points[0].x} ${edge.points[0].y} L ${edge.points[edge.points.length-1].x} ${edge.points[edge.points.length-1].y}`}
                stroke={isRelatedToCompany ? '#F59E0B' : '#1e293b'}
                strokeWidth={isRelatedToCompany ? 2 : 1}
                fill="none"
                className="transition-all duration-500"
                opacity={selectedCompany && !isRelatedToCompany ? 0.1 : 0.4}
              />
            );
          })}

          {/* Render Nodes */}
          {layout.nodes.map(node => {
            const isMastered = masteredNodes.has(node.id);
            const isRequired = requirements?.required.includes(node.id);
            const isPreferred = requirements?.preferred.includes(node.id);
            
            const groupColors: any = {
              foundation: '#F59E0B',
              core: '#22D3EE',
              spec: '#A78BFA'
            };

            const isActive = !selectedCompany || isRequired || isPreferred;

            return (
              <g key={node.id} transform={`translate(${node.x - 70}, ${node.y - 28})`}>
                <motion.rect
                  width="140"
                  height="56"
                  rx="8"
                  className="transition-all duration-500"
                  fill="#1C1F26"
                  stroke={isRequired ? '#F59E0B' : (isMastered ? '#10B981' : groupColors[node.group])}
                  strokeWidth={isRequired || isMastered ? 2 : 1}
                  opacity={isActive ? 1 : 0.15}
                  animate={isRequired && !isMastered ? { 
                    strokeWidth: [2, 4, 2],
                    filter: ['drop-shadow(0 0 0px #F59E0B)', 'drop-shadow(0 0 8px #F59E0B)', 'drop-shadow(0 0 0px #F59E0B)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <text 
                  x="70" 
                  y="28" 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  className={`font-mono text-[11px] font-bold ${isActive ? 'fill-white' : 'fill-slate-700'}`}
                >
                  {node.label}
                </text>
                <text 
                  x="70" 
                  y="46" 
                  textAnchor="middle"
                  className={`font-mono text-[8px] uppercase tracking-widest ${isActive ? 'fill-slate-500' : 'fill-slate-800'}`}
                >
                  {node.group}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
