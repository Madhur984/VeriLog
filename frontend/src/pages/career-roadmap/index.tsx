import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDown, Unlock, School, Flag, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { FloatingCommandBar } from '../../components/FloatingCommandBar';

// Core Sections & Data
import { MarketPulse, CompaniesBoard, OpportunitiesBoard, StudentPathSection, AlumniPathwaysSection } from './sections/RoadmapSections';
import { DomainGrid } from './sections/DomainGrid';
import { DomainPlaybookSection } from './sections/DomainPlaybookSection';
import { IntelHubSection } from './sections/IntelHubSection';
import { SiliconStackExplorer } from './components/SiliconStackExplorer';
import { SiliconResumeCompiler } from './components/SiliconResumeCompiler';
import { SalaryLab } from './sections/SalaryLab';
import { SOURCES, AS_OF, marketStats, domains } from './data/careerData';
import { useCareerState } from './hooks/useCareerState';
import { getSession } from '../../lib/auth';
import { motion } from 'framer-motion';
import { reveal } from './sections/RoadmapUI';
import { DiagnosticModal } from './components/DiagnosticModal';
import { ColdOpenSplash } from './components/ColdOpenSplash';

// Lazy loaded interactive telemetry components
const SkillGapRadar = React.lazy(() =>
  import('./components/SkillGapRadar').then((m) => ({ default: m.SkillGapRadar }))
);
const SkillGraphSection = React.lazy(() =>
  import('./sections/SkillGraphSection').then((m) => ({ default: m.SkillGraphSection }))
);
const SiliconResume = React.lazy(() =>
  import('./components/SiliconResume').then((m) => ({ default: m.SiliconResume }))
);
const FiscalMatrix = React.lazy(() =>
  import('./sections/FiscalMatrix').then((m) => ({ default: m.FiscalMatrix }))
);
const FiscalMatrixSection = React.lazy(() =>
  import('./sections/FiscalMatrixSection').then((m) => ({ default: m.FiscalMatrixSection }))
);
const GlobalSalaryHeatmap = React.lazy(() =>
  import('./components/GlobalSalaryHeatmap').then((m) => ({ default: m.GlobalSalaryHeatmap }))
);
const TrajectorySimulator = React.lazy(() =>
  import('./sections/TrajectorySimulator').then((m) => ({ default: m.TrajectorySimulator }))
);

const NAV = [
  { id: 'market', label: 'Opportunity' },
  { id: 'domains', label: 'Domains' },
  { id: 'domain-playbooks', label: 'Playbooks' },
  { id: 'salaries', label: 'Salaries' },
  { id: 'intel-hub', label: 'Intel Hub' },
  { id: 'companies', label: 'Companies' },
  { id: 'opportunities', label: 'Openings' },
  { id: 'substrate-explorer', label: 'Die Physics' },
  { id: 'resume-compiler', label: 'ATS Compiler' },
  { id: 'path', label: 'The Path' },
];

const TabLoading: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
    <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider animate-pulse">
      Loading Silicon telemetry...
    </span>
  </div>
);

/* ── 2-Tap Personalization Flow ────────────────────────────────────────── */
interface PersonalizationFlowProps {
  onSelectPrefs: (prefs: { stage: string; domain: string }) => void;
  currentPrefs: { stage: string; domain: string } | null;
}

const PersonalizationFlow: React.FC<PersonalizationFlowProps> = ({ onSelectPrefs, currentPrefs }) => {
  const [stage, setStage] = useState<string | null>(currentPrefs?.stage || null);
  const [domain, setDomain] = useState<string | null>(currentPrefs?.domain || null);

  const stages = [
    { id: 'foundation', label: '1st / 2nd Year', desc: 'Foundations & Digital Logic' },
    { id: 'specializing', label: '3rd Year', desc: 'Core Specializing & Internships' },
    { id: 'placement', label: '4th Year', desc: 'Placements & Core Jobs' },
    { id: 'pivot', label: 'Graduate', desc: 'Alumni / Pivot to Core ECE' },
  ];

  const domainsList = [
    { id: 'vlsi', label: 'Digital Design & RTL', desc: 'Verilog, FSMs, Microarch' },
    { id: 'dv', label: 'Verification (UVM/DV)', desc: 'SystemVerilog, UVM, Testbenches' },
    { id: 'pd', label: 'Physical Design & STA', desc: 'Timing Analysis, Synthesis, Layout' },
    { id: 'embedded', label: 'Embedded & IoT', desc: 'Firmware, MCUs, RTOS, C' },
    { id: 'eda', label: 'Software / EDA Tools', desc: 'CAD Algorithms, Scripting, Tcl' },
  ];

  const handleSelectStage = (id: string) => {
    setStage(id);
    if (domain) {
      onSelectPrefs({ stage: id, domain });
    }
  };

  const handleSelectDomain = (id: string) => {
    setDomain(id);
    if (stage) {
      onSelectPrefs({ stage, domain: id });
    }
  };

  const handleReset = () => {
    setStage(null);
    setDomain(null);
    onSelectPrefs({ stage: '', domain: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 mb-10 bg-bg-elev border-2 border-edge shadow-brutal">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-text-main">
            Personalize Your Roadmap
          </h3>
          <p className="text-[9px] text-text-dim font-mono uppercase tracking-wider mt-1">
            2-Tap Customization Engine
          </p>
        </div>
        {(stage || domain) && (
          <button
            onClick={handleReset}
            className="text-[10px] font-mono uppercase text-[#F59E0B] hover:underline cursor-pointer"
          >
            Clear Preferences
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Career Stage */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] text-[#14B8A6] uppercase tracking-widest block">
            STEP 01: SELECT YOUR STAGE
          </span>
          <div className="grid grid-cols-1 gap-2">
            {stages.map((s) => {
              const active = stage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStage(s.id)}
                  className={`w-full text-left p-3 border-2 transition-all font-mono flex flex-col justify-center cursor-pointer ${
                    active
                      ? 'border-[#14B8A6] bg-[#14B8A6]/5 text-text-main'
                      : 'border-border-soft hover:border-edge text-text-sub hover:text-text-main bg-bg-base'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{s.label}</span>
                  <span className="text-[9px] text-text-dim uppercase mt-0.5">{s.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Domain */}
        <div className="space-y-3">
          <span className="font-mono text-[9px] text-[#14B8A6] uppercase tracking-widest block">
            STEP 02: SELECT TARGET INTEREST
          </span>
          <div className="grid grid-cols-1 gap-2">
            {domainsList.map((d) => {
              const active = domain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDomain(d.id)}
                  className={`w-full text-left p-3 border-2 transition-all font-mono flex flex-col justify-center cursor-pointer ${
                    active
                      ? 'border-[#14B8A6] bg-[#14B8A6]/5 text-text-main'
                      : 'border-border-soft hover:border-edge text-text-sub hover:text-text-main bg-bg-base'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{d.label}</span>
                  <span className="text-[9px] text-text-dim uppercase mt-0.5">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {stage && domain && (
        <div className="mt-6 pt-4 border-t border-dashed border-edge flex items-center justify-between text-xs font-mono">
          <span className="text-[#14B8A6] uppercase font-bold tracking-wider animate-pulse">
            ✓ Dashboard Customization Applied
          </span>
          <span className="text-text-dim uppercase text-[10px]">
            Targeting: {domainsList.find((dl) => dl.id === domain)?.label}
          </span>
        </div>
      )}
    </div>
  );
};

/* ── About Tab ─────────────────────────────────────────────────────────── */
const AboutTab: React.FC = () => {
  const commitments = [
    {
      number: '01',
      title: 'Free Core Education',
      description: 'We believe silicon engineering education should be open to all, bypassing expensive training academies.',
      color: '#14B8A6',
      icon: Unlock,
    },
    {
      number: '02',
      title: 'Industry-Aligned Paths',
      description: 'Learn exactly what Qualcomm, NVIDIA, and Intel look for. No academic fluff, just raw engineering skills.',
      color: '#F59E0B',
      icon: School,
    },
    {
      number: '03',
      title: 'Verified Competence',
      description: 'Go from self-assessed claims to verified hardware test completions. Prove your skills with real Verilog compiler signals.',
      color: '#EF4444',
      icon: Flag,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      <div className="text-center space-y-4">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-[0.25em] block">
          OUR MISSION & PHILOSOPHY
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-text-main tracking-tight uppercase max-w-3xl mx-auto leading-tight">
          Democratizing ECE and <span className="text-teal-400">Silicon Engineering</span> Across India
        </h2>
        <p className="text-text-sub text-base max-w-2xl mx-auto leading-relaxed">
          The semiconductor landscape in India is at a historic turning point. We build the bridges between raw academic degrees and production-grade silicon engineering careers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {commitments.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-bg-elev border-2 border-edge shadow-brutal p-8 flex flex-col justify-between hover:border-text-main transition-colors border-b-4"
              style={{ borderBottomColor: item.color }}
            >
              <div>
                <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest block mb-4">
                  COMMITMENT {item.number}
                </span>
                <div className="p-3 bg-bg-base border border-edge rounded-lg w-fit" style={{ color: item.color }}>
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-main uppercase mt-6 font-sans">
                  {item.title}
                </h3>
                <p className="text-text-sub text-sm mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#14B8A6]/5 border border-[#14B8A6]/20 p-8 rounded-xl max-w-3xl mx-auto text-center space-y-4">
        <h3 className="text-lg font-bold text-text-main uppercase tracking-tight">
          What engineers do best - we build.
        </h3>
        <p className="text-text-sub text-sm leading-relaxed max-w-xl mx-auto">
          BitForBytes is our contribution to India's semiconductor decade. By mapping physical logic skills, verifications, and compensation trajectories, we turn ambition into design competence.
        </p>
      </div>
    </div>
  );
};

/* ── Custom Roadmap Hero ──────────────────────────────────────────────── */
interface CustomRoadmapHeroProps {
  prefs: { stage: string; domain: string } | null;
  onSelectPrefs: (prefs: { stage: string; domain: string }) => void;
}

const CustomRoadmapHero: React.FC<CustomRoadmapHeroProps> = ({ prefs, onSelectPrefs }) => (
  <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
    <motion.div {...reveal}>
      <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-signal-core mb-5">
        <span className="h-2 w-2 bg-signal-core animate-gentle-pulse" /> Career roadmap · updated {AS_OF}
      </div>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-main leading-[1.02]">
        Your ECE degree is a<br /><span className="text-signal-core">ticket into silicon.</span>
      </h1>
      <p className="mt-4 mb-8 max-w-2xl text-base sm:text-lg text-text-sub leading-relaxed">
        The world is short a million chip engineers, and India is building fabs for the first time.
        This is the honest map — the domains, the real pay, who’s hiring, and the exact route from first year to first offer.
      </p>
    </motion.div>

    {/* Personalization Section Prominently Featured at Top */}
    <PersonalizationFlow currentPrefs={prefs} onSelectPrefs={onSelectPrefs} />

    {/* Static statistics moved down below personalization flow */}
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {marketStats.slice(0, 3).map((s) => (
        <div key={s.id} className="bg-bg-base border-2 border-edge shadow-brutal p-5">
          <div className="text-2xl sm:text-3xl font-bold text-text-main">{s.value}</div>
          <div className="text-sm font-medium text-text-sub mt-1">{s.label}</div>
        </div>
      ))}
    </motion.div>

    <div className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-dim">
      <ArrowDown size={14} className="animate-bounce" /> Scroll to explore
    </div>
  </section>
);

/* ── Beginner Skills View ────────────────────────────────────────────── */
const BeginnerSkillsView: React.FC<{ domain: string }> = ({ domain }) => {
  const domainName = domains.find(d => d.id === domain)?.name || "ASIC/VLSI";
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">BEGINNER WORKSPACE</span>
        <h3 className="text-2xl font-bold text-text-main uppercase">Essential Skills for {domainName}</h3>
        <p className="text-text-sub text-sm leading-relaxed">
          We have simplified the technical telemetry radar to help you focus on the absolute fundamentals. Learn these in order.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-bg-base border border-border-soft rounded-lg space-y-2">
          <span className="font-mono text-[10px] text-teal-400 font-bold block uppercase tracking-wider">STAGE 01: DIGITAL LOGIC</span>
          <h4 className="font-bold text-text-main text-sm">Boolean Algebra & Gates</h4>
          <p className="text-xs text-text-sub leading-normal">
            Master AND, OR, XOR, logic minimization, and flip-flops. This is the foundation of all silicon.
          </p>
        </div>
        <div className="p-5 bg-bg-base border border-border-soft rounded-lg space-y-2">
          <span className="font-mono text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">STAGE 02: SYSTEM VERILOG</span>
          <h4 className="font-bold text-text-main text-sm">RTL Design Basics</h4>
          <p className="text-xs text-text-sub leading-normal">
            Learn to write structural code describing how wires and registers transfer data.
          </p>
        </div>
        <div className="p-5 bg-bg-base border border-border-soft rounded-lg space-y-2">
          <span className="font-mono text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">STAGE 03: VERIFICATION</span>
          <h4 className="font-bold text-text-main text-sm">Testbench Architecture</h4>
          <p className="text-xs text-text-sub leading-normal">
            Write automated code to verify that your circuit design behaves correctly under all conditions.
          </p>
        </div>
        <div className="p-5 bg-bg-base border border-border-soft rounded-lg space-y-2">
          <span className="font-mono text-[10px] text-orange-400 font-bold block uppercase tracking-wider">STAGE 04: CORE MATH & LAB</span>
          <h4 className="font-bold text-text-main text-sm">Setup & Hold Timing</h4>
          <p className="text-xs text-text-sub leading-normal">
            Learn the timing margins required for signals to travel safely across silicon without glitches.
          </p>
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-center text-xs text-amber-500 font-mono">
        💡 Advanced 3D Interactive Skill Graph and Quantization Radar are hidden. Toggle "Telemetry Mode" in the header to view them.
      </div>
    </div>
  );
};

/* ── Beginner Financials View ─────────────────────────────────────────── */
const BeginnerFinancialsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">BEGINNER WORKSPACE</span>
        <h3 className="text-2xl font-bold text-text-main uppercase">ECE Salary & Market Overview</h3>
        <p className="text-text-sub text-sm leading-relaxed">
          ECE salary profiles have the highest slope in engineering. While software starting pay can be flat, core chip engineering pay compounds rapidly as you ship more silicon tape-outs.
        </p>
      </div>

      <div className="border border-border-soft overflow-hidden rounded-lg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-bg-base border-b border-border-soft">
              <th className="p-3 text-text-main font-bold">ECE DOMAIN</th>
              <th className="p-3 text-text-main font-bold">FRESHER STARTING</th>
              <th className="p-3 text-text-main font-bold">SENIOR (+5 YRS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/50">
            <tr>
              <td className="p-3 text-text-main font-semibold">ASIC/VLSI Design</td>
              <td className="p-3 text-emerald-400">₹12 - 18 LPA</td>
              <td className="p-3 text-emerald-400">₹30 - 55 LPA</td>
            </tr>
            <tr>
              <td className="p-3 text-text-main font-semibold">Design Verification</td>
              <td className="p-3 text-emerald-400">₹10 - 15 LPA</td>
              <td className="p-3 text-emerald-400">₹25 - 45 LPA</td>
            </tr>
            <tr>
              <td className="p-3 text-text-main font-semibold">Physical Design / STA</td>
              <td className="p-3 text-emerald-400">₹8 - 14 LPA</td>
              <td className="p-3 text-emerald-400">₹20 - 38 LPA</td>
            </tr>
            <tr>
              <td className="p-3 text-text-main font-semibold">Embedded Systems</td>
              <td className="p-3 text-emerald-400">₹6 - 11 LPA</td>
              <td className="p-3 text-emerald-400">₹18 - 30 LPA</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-5 bg-teal-500/5 border border-teal-500/20 rounded-lg space-y-2 text-xs">
        <h4 className="font-bold text-text-main">Why are core hardware salaries so high?</h4>
        <p className="text-text-sub leading-normal">
          Hardware mistakes are extremely expensive (a bad chip tape-out costs millions to re-manufacture). Companies pay a high premium for verified engineers who can design bug-free silicon.
        </p>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-center text-xs text-amber-500 font-mono">
        💡 Global Salary Heatmap and Interactive Compound curves are hidden. Toggle "Telemetry Mode" in the header to view them.
      </div>
    </div>
  );
};

/* ── Beginner Portfolio View ──────────────────────────────────────────── */
const BeginnerPortfolioView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">BEGINNER WORKSPACE</span>
        <h3 className="text-2xl font-bold text-text-main uppercase">ECE Resume Building Guide</h3>
        <p className="text-text-sub text-sm leading-relaxed">
          To land interviews at top product semiconductor companies (like Intel, NVIDIA, Qualcomm), your resume needs to focus on physical hardware accomplishments rather than simple software projects.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="h-6 w-6 rounded-full bg-teal-500/10 border border-teal-500 text-teal-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 font-bold">1</div>
          <div>
            <h4 className="font-bold text-text-main text-sm">Focus on Core Projects</h4>
            <p className="text-xs text-text-sub leading-relaxed mt-1">
              Include specific hardware designs: ALUs, RISC-V processors, FIFO buffers, or UART modules written in Verilog/SystemVerilog.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="h-6 w-6 rounded-full bg-teal-500/10 border border-teal-500 text-teal-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 font-bold">2</div>
          <div>
            <h4 className="font-bold text-text-main text-sm">List EDA Tools Used</h4>
            <p className="text-xs text-text-sub leading-relaxed mt-1">
              Explicitly call out standard industry tools: ModelSim, Vivado, GTKWave, Yosys, or OpenLane.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="h-6 w-6 rounded-full bg-teal-500/10 border border-teal-500 text-teal-400 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 font-bold">3</div>
          <div>
            <h4 className="font-bold text-text-main text-sm">Highlight Lab & Hardware Verification</h4>
            <p className="text-xs text-text-sub leading-relaxed mt-1">
              Specify testbench techniques: assertions, self-checking testbenches, and functional coverage.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg text-center text-xs text-amber-500 font-mono">
        💡 ATS Validation compiler and PDF resume exporter are hidden. Toggle "Telemetry Mode" in the header to view them.
      </div>
    </div>
  );
};

/* ── Main Page Shell ──────────────────────────────────────────────────── */
const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const careerState = useCareerState();
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [viewMode, setViewMode] = useState<'telemetry' | 'beginner'>('telemetry');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem('bfb_cold_open_played');
    if (!played) {
      setShowSplash(true);
    }
  }, []);

  const handleFocusSkillNode = (nodeId: string) => {
    setActiveTab('skills');
    careerState.setFocusedNodeId(nodeId);
    careerState.addToVisitHistory(nodeId);
  };

  // Load personalization preferences
  const [careerPrefs, setCareerPrefs] = useState<{ stage: string; domain: string } | null>(() => {
    try {
      const saved = localStorage.getItem('bfb_career_prefs');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleSelectPrefs = (prefs: { stage: string; domain: string }) => {
    setCareerPrefs(prefs);
    try {
      localStorage.setItem('bfb_career_prefs', JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
  };

  // Map selected domain to company targets
  const mapDomainToCompany = (domainId: string) => {
    switch (domainId) {
      case 'vlsi': return 'nvidia';
      case 'dv': return 'qualcomm';
      case 'pd': return 'intel';
      case 'embedded': return 'texas-instruments';
      case 'eda': return 'samsung-semi';
      default: return 'nvidia';
    }
  };

  const [radarCompany, setRadarCompany] = useState<string>('nvidia');
  useEffect(() => {
    if (careerPrefs?.domain) {
      setRadarCompany(mapDomainToCompany(careerPrefs.domain));
    }
  }, [careerPrefs?.domain]);

  // Map selected domain to salary CTC role
  const getRoleIndex = (domainId: string) => {
    if (domainId === 'embedded') return 1;
    if (domainId === 'eda') return 3;
    return 0; // VLSI Design
  };
  const initialRole = careerPrefs?.domain ? getRoleIndex(careerPrefs.domain) : 0;

  const resolvedUserName = useMemo(() => {
    try {
      const session = getSession();
      return session?.displayName || 'Guest User';
    } catch (e) {
      return 'Guest User';
    }
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-main pb-28">
      {showSplash && (
        <ColdOpenSplash
          onComplete={() => {
            sessionStorage.setItem('bfb_cold_open_played', 'true');
            setShowSplash(false);
          }}
        />
      )}
      {/* Sticky Top Navigation Shell */}
      <div className="sticky top-0 z-30 bg-bg-void border-b-2 border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/portal')}
            aria-label="Back to portal"
            className="brutal-btn inline-flex h-9 items-center gap-1.5 bg-bg-elev px-3 text-[12px] font-bold text-text-main shrink-0 cursor-pointer"
          >
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Portal</span>
          </button>

          {activeTab === 'explore' && (
            <nav aria-label="Sections" className="flex-1 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => jump(n.id)}
                  className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 text-text-sub hover:text-text-main hover:bg-bg-base border-2 border-transparent hover:border-edge transition-colors rounded-full cursor-pointer"
                >
                  {n.label}
                </button>
              ))}
            </nav>
          )}
          {activeTab !== 'explore' && <div className="flex-1" />}

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'telemetry' ? 'beginner' : 'telemetry')}
              className="brutal-btn h-9 px-3 flex items-center gap-1.5 bg-bg-elev font-mono text-[11px] uppercase tracking-wider text-text-main font-bold cursor-pointer border-2 border-edge"
              title="Toggle between simplified content and advanced developer charts"
            >
              <span className={viewMode === 'beginner' ? 'text-teal-400 font-extrabold' : 'text-text-dim'}>Beginner</span>
              <span className="text-text-dim">/</span>
              <span className={viewMode === 'telemetry' ? 'text-teal-400 font-extrabold' : 'text-text-dim'}>Telemetry</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Floating Tab Navigation Trigger */}
      <FloatingCommandBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Views */}
      <main className="relative">
        {activeTab === 'about' && <AboutTab />}

        {activeTab === 'explore' && (
          <div className="space-y-4">
            <CustomRoadmapHero prefs={careerPrefs} onSelectPrefs={handleSelectPrefs} />
            
            {/* Interactive Diagnostic Matcher CTA */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
              <div className="bg-bg-elev border-2 border-edge shadow-brutal p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="font-mono text-[10px] text-teal-400 uppercase tracking-widest font-bold">Unsure about your specialization?</div>
                  <h4 className="text-base font-bold text-text-main uppercase font-sans">Let our interactive diagnostic match you with the perfect hardware track.</h4>
                </div>
                <button
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="brutal-btn bg-teal-500/10 hover:bg-teal-500/25 border-teal-500 text-teal-400 font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 font-bold cursor-pointer flex items-center gap-2"
                >
                  <HelpCircle size={14} /> Help Me Choose
                </button>
              </div>
            </div>

            <MarketPulse />
            <DomainGrid highlightedDomainId={careerPrefs?.domain || null} onFocusSkillNode={handleFocusSkillNode} />
            <DomainPlaybookSection initialDomainId={careerPrefs?.domain || 'vlsi'} />
            <SalaryLab onFocusSkillNode={handleFocusSkillNode} />
            <IntelHubSection
              onOpenInternships={() => {}}
              onOpenGovt={() => {}}
              onOpenSimulator={() => {
                setActiveTab('skills');
              }}
            />
            <CompaniesBoard />
            <OpportunitiesBoard />
            <SiliconStackExplorer />
            <SiliconResumeCompiler />
            <StudentPathSection />
            <AlumniPathwaysSection />
          </div>
        )}

        {activeTab === 'skills' && (
          viewMode === 'beginner' ? (
            <BeginnerSkillsView domain={careerPrefs?.domain || 'vlsi'} />
          ) : (
            <div className="space-y-12">
              <Suspense fallback={<TabLoading />}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
                  <div className="space-y-2 mb-8">
                    <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
                      Silicon <span className="text-[#14B8A6]">Radar</span>
                    </h2>
                    <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
                      Interactive Quantization & Remediation Plans
                    </p>
                  </div>
                  <SkillGapRadar 
                    activeCompany={radarCompany} 
                    setActiveCompany={setRadarCompany} 
                    masteredNodes={careerState.unlockedNodes}
                    quizScores={careerState.quizScores}
                  />
                </div>
                <SkillGraphSection
                  unlockedNodes={careerState.unlockedNodes}
                  quizScores={careerState.quizScores}
                  onUpdateScore={careerState.updateQuizScore}
                  focusedNodeId={careerState.focusedNodeId}
                  setFocusedNodeId={careerState.setFocusedNodeId}
                  nodeVisitHistory={careerState.nodeVisitHistory}
                />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                  <div className="space-y-2 mb-8">
                    <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
                      Path <span className="text-[#14B8A6]">Simulator</span>
                    </h2>
                    <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
                      Simulate your ECE career outcome based on interactive node choices
                    </p>
                  </div>
                  <TrajectorySimulator onRecordSimulation={careerState.recordSimulation} />
                </div>
              </Suspense>
            </div>
          )
        )}

        {activeTab === 'financials' && (
          viewMode === 'beginner' ? (
            <BeginnerFinancialsView />
          ) : (
            <div className="space-y-12">
              <Suspense fallback={<TabLoading />}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
                  <div className="space-y-2 mb-8">
                    <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
                      Silicon <span className="text-amber-500">Heatmap</span>
                    </h2>
                    <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
                      Real-time Global Purchasing Power Parity Index
                    </p>
                  </div>
                  <GlobalSalaryHeatmap />
                </div>
                
                <FiscalMatrixSection 
                  country={careerState.fiscalPrefs.country} 
                  expYears={careerState.fiscalPrefs.expYears} 
                  onPrefsChange={(country, exp) => careerState.setFiscalPrefs(country, exp)}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                  <FiscalMatrix initialRoleIndex={initialRole} onFocusSkillNode={handleFocusSkillNode} />
                </div>
              </Suspense>
            </div>
          )
        )}

        {activeTab === 'portfolio' && (
          viewMode === 'beginner' ? (
            <BeginnerPortfolioView />
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
                  Silicon <span className="text-teal-400">Resume</span>
                </h2>
                <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
                  Interactive, verified resume export system
                </p>
              </div>
              <Suspense fallback={<TabLoading />}>
                <SiliconResume masteredNodes={careerState.unlockedNodes} userName={resolvedUserName} onFocusSkillNode={handleFocusSkillNode} />
              </Suspense>
            </div>
          )
        )}
      </main>

      {/* Sources + Honesty Footer */}
      <footer className="border-t-2 border-edge bg-bg-base mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">Sources · figures as of {AS_OF}</div>
          <p className="text-sm text-text-sub mb-4 max-w-2xl leading-relaxed text-left">
            Pay and demand are ranges that vary by company tier, city, process node and market cycle.
            Treat these as a compass, not a contract — and always verify a specific offer for yourself.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOURCES.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] text-text-dim hover:text-signal-core transition-colors underline-offset-2 hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Interactive Matcher Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onSelectDomain={(domainId) => {
          handleSelectPrefs({ stage: careerPrefs?.stage || '3rd Year', domain: domainId });
          jump('domains');
        }}
      />
    </div>
  );
};

export default CareerRoadmapPage;
