import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Cpu, Zap, Activity, ShieldCheck, Box, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextbookEquation } from '../../../components/ui/TextbookEquation';

export interface SiliconLayer {
  id: number;
  name: string;
  subName: string;
  semester: string;
  nodeTech: string;
  physics: string;
  mathFormula?: string;
  rcDelay: string;
  skills: string[];
  tools: string[];
  labRoute: string;
  labName: string;
  gradient: string;
  iconColor: string;
  description: string;
}

export const SILICON_LAYERS: SiliconLayer[] = [
  {
    id: 1,
    name: 'Silicon Substrate & Doping',
    subName: 'Layer 01 · Base Crystalline Wafer',
    semester: 'Sem 1–2',
    nodeTech: 'Bulk Si / SOI / Epitaxial',
    physics: 'Bandgap Energy (1.12 eV), Electron Mobility (1400 cm²/V·s)',
    mathFormula: 'E_g = 1.12\\text{ eV}, \\quad n_i = 1.5 \\times 10^{10}\\text{ cm}^{-3}',
    rcDelay: '< 0.01 ps',
    skills: ['Semiconductor Physics', 'Doping (Boron/Phosphorus)', 'Wafer Fabrication'],
    tools: ['TCAD Silvaco', 'Sentaurus', 'MATLAB Device Physics'],
    labRoute: '/kmap-lab',
    labName: 'Logic Minimization Lab',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    iconColor: 'text-emerald-400',
    description: 'The ultra-pure single-crystal silicon ingot wafer. P-type and N-type ion implantation creates the fundamental PN junctions for semiconductor physics.'
  },
  {
    id: 2,
    name: 'Transistor Gate & Channel',
    subName: 'Layer 02 · FinFET & Gate-All-Around (GAAFET)',
    semester: 'Sem 2–3',
    nodeTech: '3nm GAA / 5nm FinFET / 28nm Planar',
    physics: 'High-k Dielectric (HfO2), Metal Gate, Subthreshold Swing (65 mV/dec)',
    mathFormula: 'I_D = \\frac{1}{2} \\mu_n C_{ox} \\frac{W}{L} (V_{GS} - V_{th})^2',
    rcDelay: '0.15 ps',
    skills: ['MOSFET Physics', 'CMOS Inverter Design', 'Short Channel Effects'],
    tools: ['LTspice', 'Cadence Virtuoso', 'HSPICE'],
    labRoute: '/logic-studio',
    labName: 'Logic Studio & Transistor Simulator',
    gradient: 'from-teal-500/20 to-cyan-500/5',
    iconColor: 'text-teal-400',
    description: 'The physical transistor switch. Modern GAAFET nanosheets wrap the gate around all 4 sides of the channel to eliminate quantum leakage currents.'
  },
  {
    id: 3,
    name: 'Local Contacts & Silicide (M0)',
    subName: 'Layer 03 · Nano-Contact Plugs',
    semester: 'Sem 3–4',
    nodeTech: 'Cobalt / Tungsten / Ruthenium Plugs',
    physics: 'Schottky Barrier Reduction, Contact Resistance (< 10⁻⁹ Ω·cm²)',
    mathFormula: 'R_c = \\frac{\\rho_c}{A_c} \\quad (\\rho_c < 10^{-9} \\;\\Omega\\cdot\\text{cm}^2)',
    rcDelay: '0.8 ps',
    skills: ['Standard Cell Layout', 'DRC / LVS Verification', 'Epitaxial Growth'],
    tools: ['Cadence Virtuoso Layout', 'Calibre DRC', 'StarRC'],
    labRoute: '/verilog-playground',
    labName: 'Verilog RTL Playground',
    gradient: 'from-cyan-500/20 to-blue-500/5',
    iconColor: 'text-cyan-400',
    description: 'The initial metal-silicon interface plugs connecting transistor source, drain, and gate to the internal interconnect network.'
  },
  {
    id: 4,
    name: 'Lower Metal Interconnects (M1–M3)',
    subName: 'Layer 04 · Standard Cell Intra-Routing',
    semester: 'Sem 4–5',
    nodeTech: 'Copper Dual-Damascene with Low-k Barrier',
    physics: 'Electromigration Limit, Wire Pitch (22nm), Parasitic Capacitance',
    mathFormula: '\\tau_{RC} = R_{wire} \\cdot C_{wire} = \\rho \\frac{L}{W \\cdot T} \\cdot \\left(\\varepsilon \\frac{W \\cdot H}{S}\\right)',
    rcDelay: '3.5 ps',
    skills: ['RTL Synthesis', 'Cell Library Characterization', 'Static Timing (STA)'],
    tools: ['Synopsys Design Compiler', 'Cadence Genus', 'PrimeTime'],
    labRoute: '/workbench',
    labName: 'RISC-V Architecture Workbench',
    gradient: 'from-blue-500/20 to-indigo-500/5',
    iconColor: 'text-blue-400',
    description: 'Tight-pitch copper tracks routing signals inside standard cells (AND, NAND, Flip-Flops, Multiplexers) to build functional digital logic blocks.'
  },
  {
    id: 5,
    name: 'Upper Metal & Clock Tree (M4–M8)',
    subName: 'Layer 05 · Global Routing & Power Mesh',
    semester: 'Sem 5–6',
    nodeTech: 'Thick Copper / Aluminum Power Grids',
    physics: 'IR Drop, Clock Skew (< 10 ps), Crosstalk Noise, CTS Buffer Insertion',
    mathFormula: '\\Delta V_{IR} = I_{grid} \\cdot R_{mesh}, \\quad \\text{Skew} = |t_{clk,A} - t_{clk,B}| < 10\\text{ ps}',
    rcDelay: '12.0 ps',
    skills: ['Floorplanning & P&R', 'Clock Tree Synthesis (CTS)', 'Power Grid Analysis'],
    tools: ['Cadence Innovus', 'Synopsys ICC2', 'Ansys RedHawk'],
    labRoute: '/workbench',
    labName: 'SoC System Workbench',
    gradient: 'from-indigo-500/20 to-purple-500/5',
    iconColor: 'text-indigo-400',
    description: 'High-speed global routing network delivering clock signals across the entire chip with minimal skew while routing VDD/GND power meshes.'
  },
  {
    id: 6,
    name: 'Die Passivation & Microbumps',
    subName: 'Layer 06 · Silicon Interposer & 3D TSVs',
    semester: 'Sem 6–7',
    nodeTech: 'C4 Solder Bumps / Copper-Copper Hybrid Bonding',
    physics: 'Through-Silicon Vias (TSV), Bump Pitch (35µm), Thermal Dissipation',
    mathFormula: 'Z_0 = \\sqrt{\\frac{L_{via}}{C_{bump}}} \\approx 50\\;\\Omega',
    rcDelay: '25.0 ps',
    skills: ['Advanced 2.5D/3D Packaging', 'Signal Integrity (SI/PI)', 'Chiplet Architecture'],
    tools: ['Ansys HFSS', 'Cadence Allegro', 'Keysight ADS'],
    labRoute: '/interview-prep',
    labName: 'Interview Prep & Company Simulator',
    gradient: 'from-purple-500/20 to-pink-500/5',
    iconColor: 'text-purple-400',
    description: 'Connecting the processed silicon die to silicon interposers and neighboring chiplets using 3D microbumps and high-density TSV columns.'
  },
  {
    id: 7,
    name: 'BGA Package & Thermal Spreader',
    subName: 'Layer 07 · Commercial Chip Package',
    semester: 'Sem 7–8',
    nodeTech: 'FC-BGA Substrate & Integrated Heat Spreader (IHS)',
    physics: 'Junction Thermal Resistance (θJA), 1000+ Pin Grid Array',
    mathFormula: '\\theta_{JA} = \\frac{T_J - T_A}{P_{diss}} \\quad [^\\circ\\text{C/W}]',
    rcDelay: '45.0 ps',
    skills: ['System-on-Chip (SoC) Integration', 'Board-Level Hardware', 'Product Tape-out'],
    tools: ['KiCad PCB', 'Cadence OrCAD', 'Thermal Simulation'],
    labRoute: '/career-roadmap',
    labName: 'Silicon Resume & Placement Compiler',
    gradient: 'from-pink-500/20 to-rose-500/5',
    iconColor: 'text-pink-400',
    description: 'The final commercial semiconductor package protecting the silicon die, dissipating thermal energy up to 300W+, and mating with the motherboard PCB.'
  }
];

export const SiliconStackExplorer: React.FC = () => {
  const [selectedLayerId, setSelectedLayerId] = useState<number>(2);
  const navigate = useNavigate();

  const selectedLayer = SILICON_LAYERS.find((l) => l.id === selectedLayerId) || SILICON_LAYERS[1];

  return (
    <section id="substrate-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="font-mono text-[10px] text-plasma-cyan uppercase tracking-[0.25em] font-bold block">
          PHYSICAL SEMICONDUCTOR ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-5xl font-mono font-bold text-text-main tracking-tight uppercase">
          7-Layer <span className="text-plasma-cyan">Silicon Substrate</span> Explorer
        </h2>
        <p className="text-text-sub text-sm max-w-3xl mx-auto font-mono leading-relaxed">
          Select any physical layer of a modern microchip to inspect its solid-state physics, nanometer process node specs, corresponding ECE coursework, and hands-on BitForBytes workstations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive 7-Layer Visual Physical Stack (Stack Diagram) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="font-mono text-xs font-bold text-text-dim uppercase tracking-widest mb-3 flex flex-wrap gap-x-3 gap-y-1 items-center justify-between">
            <span>Physical Die Cross-Section</span>
            <span className="text-[10px] text-plasma-cyan">Top (Package) → Bottom (Substrate)</span>
          </div>

          <div className="flex flex-col-reverse gap-2">
            {SILICON_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <motion.button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full p-3.5 border text-left transition-all relative overflow-hidden group flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-plasma-cyan/15 border-plasma-cyan text-text-main shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                      : 'bg-bg-base border-ghost-trace/60 text-text-sub hover:border-plasma-cyan/50 hover:text-text-main'
                  }`}
                >
                  <div className="flex items-center gap-3 z-10">
                    <span className={`w-7 h-7 rounded font-mono text-xs font-bold flex items-center justify-center ${
                      isSelected ? 'bg-plasma-cyan text-matte-obsidian' : 'bg-matte-obsidian text-text-dim border border-ghost-trace'
                    }`}>
                      0{layer.id}
                    </span>
                    <div>
                      <div className="font-mono text-xs font-bold text-text-main group-hover:text-plasma-cyan transition-colors">
                        {layer.name}
                      </div>
                      <div className="font-mono text-[9px] text-text-dim uppercase">
                        {layer.semester} · {layer.nodeTech.split('/')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 z-10">
                    <span className="font-mono text-[10px] text-plasma-cyan font-bold">
                      {layer.rcDelay}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-plasma-cyan translate-x-1' : 'text-text-dim'}`} />
                  </div>

                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${layer.gradient} opacity-50`} />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Layer Physical & Academic Inspector Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-bg-base border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-ghost-trace">
                <div>
                  <span className="font-mono text-xs font-bold text-plasma-cyan uppercase tracking-widest">
                    {selectedLayer.subName}
                  </span>
                  <h3 className="text-2xl font-mono font-bold text-text-main mt-1">
                    {selectedLayer.name}
                  </h3>
                </div>

                <span className="font-mono text-xs font-bold px-3 py-1.5 bg-matte-obsidian border border-plasma-cyan/40 text-plasma-cyan">
                  RC DELAY: {selectedLayer.rcDelay}
                </span>
              </div>

              <p className="text-sm font-mono text-text-sub leading-relaxed">
                {selectedLayer.description}
              </p>

              {/* Physical & Solid-State Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-matte-obsidian/50 border border-ghost-trace">
                <div>
                  <label className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Target Process Node</label>
                  <div className="font-mono text-xs font-bold text-text-main mt-0.5">{selectedLayer.nodeTech}</div>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">Key Solid-State Physics</label>
                  <div className="font-mono text-xs font-bold text-plasma-cyan mt-0.5">{selectedLayer.physics}</div>
                </div>
              </div>

              {/* KaTeX Mathematical Specification Block */}
              {selectedLayer.mathFormula && (
                <div className="my-2">
                  <TextbookEquation
                    math={selectedLayer.mathFormula}
                    title={`${selectedLayer.name} — Physics Identity`}
                    block={true}
                    className="!my-0"
                  />
                </div>
              )}

              {/* Required ECE Engineering Skills */}
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Core ECE Competencies</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLayer.skills.map((sk) => (
                    <span key={sk} className="text-xs font-mono font-medium px-2.5 py-1 bg-bg-elev border border-ghost-trace text-text-sub">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Industry CAD & EDA Tools */}
              <div className="space-y-2">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Standard Industry EDA Tools</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLayer.tools.map((t) => (
                    <span key={t} className="text-xs font-mono font-bold px-2.5 py-1 bg-accent-orange/10 border border-accent-orange/30 text-accent-orange">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Workstation Action Box */}
              <div className="pt-4 border-t border-ghost-trace flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="font-mono text-[9px] text-plasma-cyan uppercase tracking-widest font-bold">
                    RECOMMENDED BITFORBYTES LAB
                  </span>
                  <h4 className="font-mono font-bold text-sm text-text-main mt-0.5">
                    {selectedLayer.labName}
                  </h4>
                </div>

                <button
                  onClick={() => navigate(selectedLayer.labRoute)}
                  className="px-5 py-2.5 bg-plasma-cyan text-matte-obsidian font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-brutal hover:bg-plasma-cyan/90 transition-all shrink-0 cursor-pointer"
                >
                  <span>Launch Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
