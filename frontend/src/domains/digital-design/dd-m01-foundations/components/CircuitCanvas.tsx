import React, { memo, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GateSymbol from './GateSymbol';
import type { CircuitForm } from '../ModuleD1.types';
import type { Minterm, Maxterm } from '../../../../shared/utils/booleanEngine';
import { useCursorGravity } from '../../../../hooks/useCursorGravity';

interface CircuitCanvasProps {
  form: CircuitForm;
  minterms?: Minterm[];
  maxterms?: Maxterm[];
  variables: string[];
  inputValues?: boolean[];
  width?: number;
  height?: number;
}

interface GateLayout {
  id: string;
  type: 'AND' | 'OR' | 'NAND' | 'NOR';
  x: number;
  y: number;
  inputs: string[];  // variable names or primed
  active?: boolean;
}

const SCALE = 0.9;
const GATE_H = 44 * SCALE;
const GATE_W = 64 * SCALE;
const GAP = 8;
const INPUT_X = 48;
const L1_X = 120;
const L2_X = 260;

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  form,
  minterms = [],
  maxterms = [],
  variables,
  inputValues,
  width = 400,
  height = 300,
}) => {
  const items = form === 'AND-OR' || form === 'NAND-NAND' ? minterms : maxterms;
  const isNAND = form === 'NAND-NAND';
  const isNOR = form === 'NOR-NOR';
  const isSOP = form === 'AND-OR' || form === 'NAND-NAND';

  const l1Type = isSOP ? (isNAND ? 'NAND' : 'AND') : (isNOR ? 'NOR' : 'OR');
  const l2Type = isSOP ? (isNAND ? 'NAND' : 'OR') : (isNOR ? 'NOR' : 'AND');

  const count = items.length;
  const totalH = Math.max(height, count * (GATE_H + GAP) + GAP);
  const startY = (totalH - count * (GATE_H + GAP)) / 2;

  const activeTermIndex = useMemo(() => {
    if (!inputValues) return -1;
    return items.findIndex((item) => {
      // Check if all present variables in this term match input values
      for (let i = 0; i < variables.length; i++) {
        if (item.present && !item.present[i]) continue;
        const expected = item.complements[i] ? false : true;
        if (inputValues[i] !== expected) return false;
      }
      return true;
    });
  }, [inputValues, items, variables]);

  const l2Y = totalH / 2 - GATE_H / 2;
  const l2CenterY = l2Y + GATE_H / 2;

  const { mouseX, mouseY, smoothMouseX, smoothMouseY } = useCursorGravity();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isNear, setIsNear] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;
    // Simple proximity: if within SVG bounds
    setIsNear(nx > 0 && nx < width && ny > 0 && ny < totalH);
  };

  return (
    <div className="relative group/canvas" onMouseMove={handleMouseMove} onMouseLeave={() => setIsNear(false)}>
      <svg
        ref={svgRef}
        width={width}
        height={totalH}
        viewBox={`0 0 ${width} ${totalH}`}
        role="img"
        aria-label={`${form} logic circuit with ${count} level-1 gates`}
        className="overflow-visible"
      >
      <defs>
        <filter id="glow-cyan">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Level 1 gates */}
      {items.map((item, idx) => {
        const termY = startY + idx * (GATE_H + GAP);
        const isActive = inputValues ? idx === activeTermIndex : false;
        
        // Filter input labels to only show those present in the term
        const termInputs = variables
          .map((v, i) => ({ label: `${v}${item.complements[i] ? "'" : ""}`, index: i }))
          .filter((_, i) => !item.present || item.present[i]);

        return (
          <g key={item.index || idx}>
            {/* Variable labels */}
            {termInputs.map((inp, li) => {
              const spacing = (GATE_H - 10) / (termInputs.length + 1);
              const inpOffset = (li + 1) * spacing + 5;
              const inpY = termY + inpOffset;
              
              const bitValue = inputValues ? inputValues[inp.index] : null;
              const literalActive = bitValue !== null && (item.complements[inp.index] ? !bitValue : bitValue);

              return (
                <React.Fragment key={inp.index}>
                  <text
                    x={INPUT_X - 8}
                    y={inpY + 4}
                    fontSize={12}
                    fill={literalActive ? "#00D4FF" : "#7A7A8C"}
                    fontFamily="IBM Plex Mono, monospace"
                    textAnchor="end"
                    className="font-black italic"
                  >
                    {inp.label}
                  </text>
                  <line
                    x1={INPUT_X}
                    y1={inpY}
                    x2={L1_X}
                    y2={inpY}
                    stroke={literalActive ? "#00D4FF" : "#3A3A4A"}
                    strokeWidth={2}
                  />
                </React.Fragment>
              );
            })}

            {/* Level 1 gate */}
            <GateSymbol
              type={l1Type}
              x={L1_X}
              y={termY}
              scale={SCALE}
              active={isActive}
              inputStates={termInputs.map(inp => {
                if (!inputValues) return false;
                const val = inputValues[inp.index];
                return item.complements[inp.index] ? !val : val;
              })}
              outputState={isActive}
              label={item.present?.every(p => p) ? `m${item.index}` : `T${idx}`}
            />

            {/* Wire from L1 to L2 */}
            <path
              d={`M${L1_X + GATE_W},${termY + GATE_H / 2} C${L1_X + GATE_W + 20},${termY + GATE_H / 2} ${L2_X - 20},${l2CenterY} ${L2_X},${l2CenterY}`}
              stroke={isActive ? '#00D4FF' : '#3A3A4A'}
              strokeWidth={2}
              fill="none"
            />

            {/* Traveling signal dot */}
            {isActive && (
              <circle r={3} fill="#00D4FF" filter="url(#glow-cyan)">
                <animateMotion
                  dur="1.2s"
                  repeatCount="indefinite"
                  path={`M${L1_X + GATE_W},${termY + GATE_H / 2} C${L1_X + GATE_W + 20},${termY + GATE_H / 2} ${L2_X - 20},${l2CenterY} ${L2_X},${l2CenterY}`}
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* Level 2 gate */}
      {count > 0 && (
        <>
          <GateSymbol
            type={l2Type}
            x={L2_X}
            y={l2Y}
            scale={SCALE}
            active={inputValues ? activeTermIndex >= 0 : false}
            outputState={inputValues ? activeTermIndex >= 0 : false}
          />
          {/* Output wire */}
          <line
            x1={L2_X + GATE_W}
            y1={l2CenterY}
            x2={L2_X + GATE_W + 30}
            y2={l2CenterY}
            stroke={inputValues && activeTermIndex >= 0 ? '#00FF88' : '#3A3A4A'}
            strokeWidth={2.5}
          />
          <text
            x={L2_X + GATE_W + 42}
            y={l2CenterY + 5}
            fontSize={14}
            fill={inputValues && activeTermIndex >= 0 ? '#00FF88' : '#7A7A8C'}
            fontFamily="IBM Plex Mono, monospace"
            className="font-black italic"
          >
            F
          </text>
        </>
      )}
      </svg>
      
      {/* Logic Probe Instrument */}
      <AnimatePresence>
        {isNear && (
          <motion.div
            style={{ x: smoothMouseX, y: smoothMouseY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed pointer-events-none z-[200] ml-6 -mt-6 px-3 py-2 rounded-lg bg-[#0A0A0C]/90 border border-cyan-500/50 flex flex-col gap-1 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-black text-cyan-400/80 uppercase tracking-widest">Probe_A1</span>
              <div className={`w-2 h-2 rounded-full ${inputValues && activeTermIndex >= 0 ? 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]' : 'bg-white/10'}`} />
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs font-mono font-black text-white/40 italic uppercase">LEVEL</span>
              <span className={`text-xs font-mono font-black italic ${inputValues && activeTermIndex >= 0 ? 'text-cyan-400' : 'text-rose-500'}`}>
                {inputValues && activeTermIndex >= 0 ? 'HIGH' : 'LOW'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(CircuitCanvas);
