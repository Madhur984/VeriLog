import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Info, BrainCircuit, Network, Microscope } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const Wire = ({ d, active, color }: { d: string; active: boolean; color: string }) => (
  <g>
    <path d={d} fill="none" stroke={color} strokeWidth="2" opacity="0.1" />
    <motion.path
      d={d} fill="none" stroke={color} strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: active ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
    {active && (
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1], 
          opacity: [0, 0.8, 0],
          strokeDasharray: ["1, 10", "10, 1"]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    )}
  </g>
);

const AndGate = ({ x, y, active, label, onClick }: { x: number; y: number; active: boolean; label: string; onClick?: () => void }) => (
  <motion.g 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
  >
    <rect x={x} y={y} width="40" height="40" rx="4" fill={active ? "#10b98122" : "#334155"} stroke={active ? "#10b981" : "#475569"} strokeWidth="2" />
    <text x={x + 20} y={y + 25} textAnchor="middle" fill={active ? "#10b981" : "#94a3b8"} fontSize="10" fontWeight="bold" fontFamily="monospace">&</text>
    <text x={x + 20} y={y - 8} textAnchor="middle" fill={active ? "#10b981" : "#64748b"} fontSize="8" fontWeight="black" fontFamily="monospace" className="uppercase tracking-tighter">{label}</text>
  </motion.g>
);

const OrGate = ({ x, y, active, label, onClick }: { x: number; y: number; active: boolean; label: string; onClick?: () => void }) => (
  <motion.g 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
  >
    <rect x={x} y={y} width="40" height="40" rx="20" fill={active ? "#38bdf822" : "#334155"} stroke={active ? "#38bdf8" : "#475569"} strokeWidth="2" />
    <text x={x + 20} y={y + 25} textAnchor="middle" fill={active ? "#38bdf8" : "#94a3b8"} fontSize="10" fontWeight="bold" fontFamily="monospace">≥</text>
    <text x={x + 20} y={y - 8} textAnchor="middle" fill={active ? "#38bdf8" : "#64748b"} fontSize="8" fontWeight="black" fontFamily="monospace" className="uppercase tracking-tighter">{label}</text>
  </motion.g>
);

export const S07b_GateCircuits: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [inputs, setInputs] = useState({ R: true, A: true, W: true });
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const { R, A, W } = inputs;
  const s0 = R && A && W;      // m7
  const s1 = R && A && !W;     // m6
  const s2 = R && !A && W;     // m5
  const s3 = !R && A && W;     // m3
  const outSOP = s0 || s1 || s2 || s3;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const toggle = (key: keyof typeof inputs) => setInputs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <BrainCircuit size={14} />
          Chapter 07b · The Physical Blueprint
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Inside Ben's Decision Neurons
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A Boolean equation isn't just math—it's a physical path. 
          In the <strong>SOP</strong> architecture, we build "neurons" for every reason to go. 
          If any neuron fires, the consensus engine grants approval.
        </p>

        {/* BOM Impact Note */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`mt-4 p-4 rounded-2xl flex items-start gap-3 ${
            isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'
          }`}
        >
          <Info size={18} className="text-cyan-400 mt-0.5 shrink-0" />
          <p className={`text-xs leading-relaxed ${subText}`}>
            <strong>BOM Impact:</strong> Every gate consumes physical area and power. 
            While SOP/POS are equivalent mathematically, the <strong>gate count</strong> 
            determines manufacturing cost. Architects always simplify before synthesis.
          </p>
        </motion.div>
      </section>

      {/* Controller */}
      <div className={`p-6 rounded-3xl border ${cardBg} flex flex-wrap gap-8 items-center justify-center`}>
        {Object.entries(inputs).map(([k, v]) => (
          <button
            key={k} onClick={() => toggle(k as any)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
              v ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105' : 'bg-slate-500/10 border-slate-700 opacity-60'
            }`}>
              <Zap size={24} className={v ? 'text-cyan-400 fill-cyan-400/20' : 'text-slate-600'} />
            </div>
            <div className="text-center">
              <div className={`text-xs font-black uppercase tracking-widest ${v ? 'text-cyan-400' : 'text-slate-500'}`}>{k === 'R' ? 'Rain' : k === 'A' ? 'Alert' : 'Wind'}</div>
              <div className="font-mono text-[10px] opacity-40 uppercase">{v ? 'Active (1)' : 'Idle (0)'}</div>
            </div>
          </button>
        ))}
        
        <div className="h-10 w-px bg-white/10 hidden md:block" />

        <div className="flex flex-col items-center gap-2">
           <div className={`w-20 h-10 rounded-xl border flex items-center justify-center font-black transition-all duration-500 ${
             outSOP ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-rose-500/20 border-rose-400 text-rose-400'
           }`}>
             {outSOP ? 'GO (1)' : 'STAY (0)'}
           </div>
           <div className="font-mono text-[9px] uppercase tracking-tighter opacity-40">System Output</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* SOP Visualization */}
        <div className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden group`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Network size={14} className="text-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-black">Ben's Brain (SOP)</span>
            </div>
            <div className="text-[9px] font-mono opacity-40 uppercase tracking-tighter">Architecture: AND → OR</div>
          </div>

          <svg viewBox="0 0 400 320" className="w-full drop-shadow-2xl">
            {/* Input Rails */}
            <line x1="20" y1="40" x2="20" y2="280" stroke={R ? "#10b981" : "#334155"} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            <line x1="40" y1="40" x2="40" y2="280" stroke={A ? "#10b981" : "#334155"} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            <line x1="60" y1="40" x2="60" y2="280" stroke={W ? "#10b981" : "#334155"} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />

            {/* Signal Wires to AND gates */}
            <Wire d="M 20 60 L 100 60" active={R} color="#10b981" />
            <Wire d="M 40 70 L 100 70" active={A} color="#10b981" />
            <Wire d="M 60 80 L 100 80" active={W} color="#10b981" />

            <Wire d="M 20 120 L 100 120" active={R} color="#10b981" />
            <Wire d="M 40 130 L 100 130" active={A} color="#10b981" />
            <Wire d="M 60 140 L 100 140" active={!W} color="#10b981" />

            <Wire d="M 20 180 L 100 180" active={R} color="#10b981" />
            <Wire d="M 40 190 L 100 190" active={!A} color="#10b981" />
            <Wire d="M 60 200 L 100 200" active={W} color="#10b981" />

            <Wire d="M 20 240 L 100 240" active={!R} color="#10b981" />
            <Wire d="M 40 250 L 100 250" active={A} color="#10b981" />
            <Wire d="M 60 260 L 100 260" active={W} color="#10b981" />

            {/* AND Gates (Neurons) */}
            <AndGate x={100} y={50} active={s0} label="Neuron 0" onClick={() => setSelectedGate('m7')} />
            <AndGate x={100} y={110} active={s1} label="Neuron 1" onClick={() => setSelectedGate('m6')} />
            <AndGate x={100} y={170} active={s2} label="Neuron 2" onClick={() => setSelectedGate('m5')} />
            <AndGate x={100} y={230} active={s3} label="Neuron 3" onClick={() => setSelectedGate('m3')} />

            {/* OR Logic (Consensus) */}
            <Wire d="M 140 70 L 260 140" active={s0} color="#38bdf8" />
            <Wire d="M 140 130 L 260 150" active={s1} color="#38bdf8" />
            <Wire d="M 140 190 L 260 160" active={s2} color="#38bdf8" />
            <Wire d="M 140 250 L 260 170" active={s3} color="#38bdf8" />

            <OrGate x={260} y={135} active={outSOP} label="Consensus" onClick={() => setSelectedGate('consensus')} />
            <Wire d="M 300 155 L 360 155" active={outSOP} color="#38bdf8" />
            
            <circle cx="365" cy="155" r="5" fill={outSOP ? "#10b981" : "#334155"} className="animate-pulse" />
          </svg>

          {/* Micro-ticker */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between border-t border-white/5 pt-3">
             <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${outSOP ? 'bg-emerald-500 animate-ping' : 'bg-slate-700'}`} />
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">Signal status: {outSOP ? 'NOMINAL' : 'WAIT'}</span>
             </div>
             <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500/50">Decisions firing...</span>
          </div>
        </div>

        {/* Info / Microscope Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedGate ? (
              <motion.div
                key={selectedGate}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200 shadow-xl'}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Microscope size={16} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-black">Gate Inspection</span>
                </div>
                
                {selectedGate === 'consensus' ? (
                  <div className="space-y-4">
                    <h3 className={`text-xl font-black ${textColor}`}>Consensus Engine (OR)</h3>
                    <p className={`text-sm ${subText}`}>This gate represents Ben's final decision. If <strong>any</strong> of the active neurons fire, he goes to the picnic.</p>
                    <div className="p-4 rounded-2xl bg-black/20 font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span>Inputs Active:</span> <span className="text-emerald-400">{( [s0,s1,s2,s3].filter(Boolean).length )}</span></div>
                      <div className="flex justify-between"><span>Status:</span> <span className={outSOP ? 'text-emerald-400' : 'text-rose-400'}>{outSOP ? 'PASSED' : 'BLOCKED'}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className={`text-xl font-black ${textColor}`}>Decision Neuron {selectedGate.replace('m','')}</h3>
                    <p className={`text-sm ${subText}`}>This neuron is programmed to fire <strong>only</strong> when a specific scenario occurs (a minterm). All conditions must be met simultaneously.</p>
                    <div className="p-4 rounded-2xl bg-black/20 font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span>Rain Sensor:</span> <span className="text-cyan-400">{R ? '1' : '0'}</span></div>
                      <div className="flex justify-between"><span>Alert System:</span> <span className="text-cyan-400">{A ? '1' : '0'}</span></div>
                      <div className="flex justify-between"><span>Wind Sensor:</span> <span className="text-cyan-400">{W ? '1' : '0'}</span></div>
                      <div className="h-px bg-white/5 my-2" />
                      <div className="flex justify-between font-black"><span>Result:</span> <span className={selectedGate === 'm7' && s0 ? 'text-emerald-400' : 'text-rose-400'}>FIRE</span></div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedGate(null)}
                  className="mt-6 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[10px] uppercase tracking-widest transition-colors"
                >
                  Close Inspection
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]`}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                  <Activity size={32} />
                </div>
                <div>
                  <h4 className={`font-black ${textColor}`}>Microscope Idle</h4>
                  <p className={`text-xs ${subText} max-w-[200px] mt-1`}>Click any gate in the circuit to see exactly how Ben evaluates the logic.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Info size={14} className="text-fuchsia-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400 font-black">Hardware Reality</span>
            </div>
            <ul className="space-y-4">
              {[
                { t: 'Propagation Delay', v: '~12ns', d: 'Time taken for signals to traverse the neurons.' },
                { t: 'Transistor Count', v: '22 Gates', d: 'Estimated silicon area for this picnic decision.' },
                { t: 'Voltage Threshold', v: '0.8V VDD', d: 'Standard operating level for this CMOS design.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1 h-10 rounded-full bg-fuchsia-500/20 shrink-0" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${textColor}`}>{item.t}</span>
                      <span className="font-mono text-[11px] text-fuchsia-400">{item.v}</span>
                    </div>
                    <p className="text-[10px] opacity-40 font-mono leading-tight">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Gate Archetype Library */}
      <section className="space-y-6 pt-12 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Microscope size={18} className="text-cyan-400" />
          <h3 className={`text-xl font-bold ${textColor}`}>Gate Archetype Library</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              name: 'AND (Product)', 
              symbol: '&', 
              role: 'Consensus Builder', 
              desc: 'Outputs 1 only if ALL inputs are 1. The backbone of minterms.',
              color: 'emerald'
            },
            { 
              name: 'OR (Sum)', 
              symbol: '≥1', 
              role: 'Opportunity Gatherer', 
              desc: 'Outputs 1 if ANY input is 1. The final collector in SOP.',
              color: 'sky'
            },
            { 
              name: 'NAND (Inverted AND)', 
              symbol: '&', 
              role: 'Universal Building Block', 
              desc: 'The most efficient gate in CMOS manufacturing. Can build any logic.',
              color: 'rose'
            },
            { 
              name: 'NOR (Inverted OR)', 
              symbol: '≥1', 
              role: 'Disaster Filter', 
              desc: 'Highly efficient for negative logic and fail-safe designs.',
              color: 'amber'
            },
            { 
              name: 'XOR (Difference)', 
              symbol: '=1', 
              role: 'Inequality Detector', 
              desc: 'The heart of arithmetic. Fires when inputs disagree.',
              color: 'fuchsia'
            },
            { 
              name: 'NOT (Inverter)', 
              symbol: '1', 
              role: 'Perspective Flipper', 
              desc: 'Simple but vital. Bridges "Joy" and "Caution" universes.',
              color: 'indigo'
            }
          ].map((gate, i) => (
            <motion.div
              key={gate.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-3xl border ${cardBg} group hover:border-cyan-500/50 transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400`}>
                  {gate.symbol}
                </div>
                <span className={`text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest`}>{gate.role}</span>
              </div>
              <h4 className={`text-sm font-black mb-2 ${textColor}`}>{gate.name}</h4>
              <p className={`text-xs ${subText} leading-relaxed opacity-70`}>{gate.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
