import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';

interface RadarAxis {
  label: string;
  userValue: number;
  reqValue: number;
}

const computeUserSkills = (masteredNodes: string[]) => {
  const masteredSet = new Set(masteredNodes.map(s => s.toLowerCase().trim()));
  
  let digitalVal = 20;
  if (masteredSet.has('digital-foundation') || masteredSet.has('digital-logic') || masteredSet.has('digital-design')) digitalVal += 35;
  if (masteredSet.has('boolean-algebra')) digitalVal += 25;
  if (masteredSet.has('k-map-master') || masteredSet.has('k-map')) digitalVal += 20;
  
  let verilogVal = 20;
  if (masteredSet.has('verilog-hdl') || masteredSet.has('verilog')) verilogVal += 45;
  if (masteredSet.has('systemverilog') || masteredSet.has('sv-basics')) verilogVal += 35;
  
  let staVal = 10;
  if (masteredSet.has('timing-analysis') || masteredSet.has('sta-timing')) staVal += 40;
  if (masteredSet.has('setup-hold') || masteredSet.has('setup-hold-checks')) staVal += 25;
  if (masteredSet.has('clock-domain-crossing') || masteredSet.has('cdc')) staVal += 25;
  
  let archVal = 20;
  if (masteredSet.has('computer-architecture') || masteredSet.has('cpu-architecture') || masteredSet.has('architecture-basics')) archVal += 30;
  if (masteredSet.has('gpu-architecture') || masteredSet.has('gpu-basics')) archVal += 25;
  if (masteredSet.has('risc-v') || masteredSet.has('riscv-core')) archVal += 25;
  
  let uvmVal = 10;
  if (masteredSet.has('uvm-basics') || masteredSet.has('uvm-verification') || masteredSet.has('verification-methodology')) uvmVal += 40;
  if (masteredSet.has('verification') || masteredSet.has('dv-basics')) uvmVal += 30;
  if (masteredSet.has('systemverilog-assertions') || masteredSet.has('sva')) uvmVal += 20;
  
  let scriptingVal = 20;
  if (masteredSet.has('scripting-tcl') || masteredSet.has('tcl-scripting')) scriptingVal += 40;
  if (masteredSet.has('python-scripting') || masteredSet.has('python')) scriptingVal += 40;
  
  return {
    digital: Math.min(100, digitalVal),
    verilog: Math.min(100, verilogVal),
    sta: Math.min(100, staVal),
    arch: Math.min(100, archVal),
    uvm: Math.min(100, uvmVal),
    scripting: Math.min(100, scriptingVal)
  };
};

export const SkillGapRadar = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [activeCompany, setActiveCompany] = useState('nvidia');
  const [studyHours, setStudyHours] = useState(2);
  const [masteredNodes, setMasteredNodes] = useState<string[]>([]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('bfb_mastered_nodes');
        if (stored) {
          setMasteredNodes(JSON.parse(stored));
        } else {
          setMasteredNodes(['digital-foundation', 'verilog-hdl']);
        }
      } catch (e) {
        console.error('Error parsing mastered nodes from storage:', e);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bfb_nodes_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bfb_nodes_updated', handleStorageChange);
    };
  }, []);

  const userScores = computeUserSkills(masteredNodes);

  const COMPANY_PRESETS: Record<string, { name: string; target: string; axes: RadarAxis[] }> = {
    nvidia: {
      name: 'NVIDIA',
      target: 'ASIC/RTL Design Engineer',
      axes: [
        { label: 'Verilog/SV', userValue: userScores.verilog, reqValue: 95 },
        { label: 'STA & Timing', userValue: userScores.sta, reqValue: 85 },
        { label: 'Computer Arch', userValue: userScores.arch, reqValue: 90 },
        { label: 'UVM/DV', userValue: userScores.uvm, reqValue: 80 },
        { label: 'Digital Foundations', userValue: userScores.digital, reqValue: 95 },
        { label: 'Scripting (Tcl/Py)', userValue: userScores.scripting, reqValue: 75 }
      ]
    },
    qualcomm: {
      name: 'Qualcomm',
      target: 'Design Verification (DV) Engineer',
      axes: [
        { label: 'Verilog/SV', userValue: userScores.verilog, reqValue: 90 },
        { label: 'STA & Timing', userValue: userScores.sta, reqValue: 75 },
        { label: 'Computer Arch', userValue: userScores.arch, reqValue: 85 },
        { label: 'UVM/DV', userValue: userScores.uvm, reqValue: 95 },
        { label: 'Digital Foundations', userValue: userScores.digital, reqValue: 90 },
        { label: 'Scripting (Tcl/Py)', userValue: userScores.scripting, reqValue: 80 }
      ]
    }
  };

  const currentPreset = COMPANY_PRESETS[activeCompany];
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const totalAxes = currentPreset.axes.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const userPoints = currentPreset.axes.map((axis, i) => getCoordinates(i, axis.userValue));
  const reqPoints = currentPreset.axes.map((axis, i) => getCoordinates(i, axis.reqValue));
  
  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const reqPath = reqPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const matchPercentage = Math.round(
    (currentPreset.axes.reduce((acc, axis) => acc + Math.min(axis.userValue / axis.reqValue, 1), 0) / totalAxes) * 100
  );

  const totalGapPoints = currentPreset.axes.reduce((acc, axis) => acc + Math.max(0, axis.reqValue - axis.userValue), 0);
  const pointsPerWeek = studyHours * 3;
  const weeksToParity = totalGapPoints > 0 ? Math.ceil(totalGapPoints / pointsPerWeek) : 0;

  // Theme-aware grid and spoke colors
  const gridStroke = isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(148,163,184,0.05)';
  const spokeStroke = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(148,163,184,0.08)';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 py-12 border rounded-xl ${
      isLight ? 'bg-bg-base text-text-main border-border-soft' : 'bg-[#07080A] text-white border-white/5'
    }`}>
      {/* Left: Interactive Telemetry Matrix */}
      <div className={`border rounded-xl p-6 flex flex-col items-center relative ${
        isLight ? 'bg-bg-elev border-border-soft' : 'bg-[#0D0F12] border-white/5'
      }`}>
        <div className={`w-full flex justify-between items-center mb-6 border-b pb-4 ${isLight ? 'border-border-soft' : 'border-white/5'}`}>
          <span className="text-xs font-mono text-text-dim tracking-wider">SKILL QUANTIZATION SPECTRUM</span>
          <div className="flex gap-2">
            {Object.keys(COMPANY_PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCompany(key)}
                className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
                  activeCompany === key 
                    ? (isLight ? 'border-signal-core bg-signal-core/10 text-signal-core' : 'border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]') 
                    : `${isLight ? 'border-border-soft text-text-dim hover:border-ghost-trace' : 'border-white/10 text-slate-400 hover:border-white/20'}`
                }`}
              >
                {COMPANY_PRESETS[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* Pure SVG Radar Engine */}
        <svg width={size} height={size} className="overflow-visible my-4">
          {/* Concentric Grid Rings */}
          {[25, 50, 75, 100].map((pct) => {
            const ringPoints = currentPreset.axes.map((_, i) => getCoordinates(i, pct));
            const ringPath = ringPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
            return <path key={pct} d={ringPath} fill="none" stroke={gridStroke} strokeWidth="1" />;
          })}

          {/* Grid Spokes */}
          {currentPreset.axes.map((_, i) => {
            const edge = getCoordinates(i, 100);
            return <line key={i} x1={center} y1={center} x2={edge.x} y2={edge.y} stroke={spokeStroke} strokeWidth="1" />;
          })}

          {/* Target Profile Boundary */}
          <motion.path 
            key={`${activeCompany}-req`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
            d={reqPath} 
            fill="rgba(245,158,11,0.02)" 
            stroke="#F59E0B" 
            strokeWidth="1.5" 
            strokeDasharray="4 3" 
          />

          {/* User Profile Polygon */}
          <motion.path 
            key={`${activeCompany}-user-${masteredNodes.length}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            d={userPath} 
            fill={isLight ? 'rgba(3,105,161,0.12)' : 'rgba(34,211,238,0.12)'}
            stroke={isLight ? '#0369A1' : '#22D3EE'}
            strokeWidth="2" 
          />

          {/* Axis Labels */}
          {currentPreset.axes.map((axis, i) => {
            const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
            const labelRadius = radius + 24;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);
            const isMet = axis.userValue >= axis.reqValue;

            return (
              <text
                key={i} x={lx} y={ly}
                textAnchor="middle" dominantBaseline="middle"
                className="text-[10px] font-mono font-medium"
                fill={isMet ? (isLight ? '#0369A1' : '#22D3EE') : '#F59E0B'}
              >
                {axis.label}
              </text>
            );
          })}
        </svg>

        <div className={`mt-6 flex gap-6 text-xs font-mono border-t pt-4 w-full justify-center ${isLight ? 'border-border-soft' : 'border-white/5'}`}>
          <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isLight ? 'bg-signal-core' : 'bg-[#22D3EE]'}`} /> YOUR GRAPH</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#F59E0B] rounded-full border border-dashed" /> REQUIRED</div>
        </div>
      </div>

      {/* Right: Architectural Gap Diagnostics */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#F59E0B]">TARGET: {currentPreset.target.toUpperCase()}</span>
            <h3 className="text-4xl font-bold font-mono text-text-main mt-1">{matchPercentage}% MATCH</h3>
          </div>

          <div className="space-y-3">
            {currentPreset.axes.map((axis) => {
              const gap = axis.reqValue - axis.userValue;
              if (gap <= 0) {
                return (
                  <div key={axis.label} className={`p-4 border rounded-lg flex items-start gap-3 ${
                    isLight ? 'bg-bg-elev border-green-500/15' : 'bg-[#0D0F12] border-green-500/10'
                  }`}>
                    <CheckCircle2 className={`shrink-0 mt-0.5 ${isLight ? 'text-signal-core' : 'text-[#22D3EE]'}`} size={16} />
                    <div className="w-full">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-text-main font-semibold">{axis.label}</span>
                        <span className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'}>MET</span>
                      </div>
                      <div className={`w-full h-1 mt-2 rounded-full overflow-hidden ${isLight ? 'bg-ghost-trace' : 'bg-slate-800'}`}>
                        <div className={`h-full ${isLight ? 'bg-signal-core' : 'bg-[#22D3EE]'}`} style={{ width: `${axis.userValue}%` }} />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={axis.label} className={`p-4 border rounded-lg flex items-start gap-3 ${
                  isLight ? 'bg-bg-elev border-orange-500/15' : 'bg-[#0D0F12] border-orange-500/10'
                }`}>
                  <ShieldAlert className="text-[#F59E0B] shrink-0 mt-0.5" size={16} />
                  <div className="w-full">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-main font-semibold">{axis.label}</span>
                      <span className="text-[#F59E0B]">GAP: -{gap}%</span>
                    </div>
                    <div className={`w-full h-1 mt-2 rounded-full overflow-hidden ${isLight ? 'bg-ghost-trace' : 'bg-slate-800'}`}>
                      <div className={`h-full ${isLight ? 'bg-signal-core' : 'bg-[#22D3EE]'}`} style={{ width: `${axis.userValue}%` }} />
                      <div className="bg-[#F59E0B] h-full" style={{ width: `${gap}%`, marginLeft: `${axis.userValue}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adaptive Execution Estimator */}
        <div className={`border rounded-xl p-5 mt-6 ${isLight ? 'bg-bg-elev border-border-soft' : 'bg-[#0D0F12] border-white/5'}`}>
          <div className="flex justify-between items-center text-xs font-mono text-text-dim mb-3">
            <span>INTENSITY ADJUSTER</span>
            <span className={`font-bold ${isLight ? 'text-signal-core' : 'text-[#22D3EE]'}`}>{studyHours} HRS/DAY</span>
          </div>
          <input
            type="range" min="1" max="5" value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
            className={`w-full h-1 rounded-lg cursor-pointer ${isLight ? 'accent-[#0369A1] bg-ghost-trace' : 'accent-[#22D3EE] bg-slate-800'}`}
          />
          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-text-dim">
            <Zap size={14} className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'} />
            {weeksToParity > 0 ? (
              <span>Time to 100% Industry Parity: <strong className="text-text-main">{weeksToParity} Weeks</strong></span>
            ) : (
              <span>All target metrics successfully met! <strong className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'}>Ready for Interview Subsystem.</strong></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
