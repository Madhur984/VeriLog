import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Unlock, School, Flag, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { FloatingCommandBar } from '../../components/FloatingCommandBar';

// Core Sections & Data
import { RoadmapHero, MarketPulse, CompaniesBoard, OpportunitiesBoard, StudentPathSection, AlumniPathwaysSection } from './sections/RoadmapSections';
import { DomainGrid } from './sections/DomainGrid';
import { SalaryLab } from './sections/SalaryLab';
import { SOURCES, AS_OF, domains } from './data/careerData';
import { useCareerState } from './hooks/useCareerState';
import { getSession } from '../../lib/auth';
import { DiagnosticModal } from './components/DiagnosticModal';
import { ColdOpenSplash } from './components/ColdOpenSplash';
import { PersonalizationFlow } from './components/PersonalizationFlow';
import { CareerWeather } from '../../components/CareerWeather';
import { MissionClock } from '../../components/MissionClock';
import { BiometricCalibration } from '../../components/BiometricCalibration';

// Lazy loaded interactive components
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

const TabLoading: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
    <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider animate-pulse">
      Loading...
    </span>
  </div>
);

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
          BitforBytes is our contribution to India's semiconductor decade. By mapping physical logic skills, verifications, and compensation trajectories, we turn ambition into design competence.
        </p>
      </div>
    </div>
  );
};

/* ── Beginner Skills View ────────────────────────────────────────────── */
const BeginnerSkillsView: React.FC<{ domain: string }> = ({ domain }) => {
  const domainName = domains.find(d => d.id === domain)?.name || "ASIC/VLSI";
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">SIMPLE VIEW</span>
        <h3 className="text-2xl font-bold text-text-main uppercase">Essential Skills for {domainName}</h3>
        <p className="text-text-sub text-sm leading-relaxed">
          Core fundamentals to focus on first. Switch to Advanced mode to see the interactive skill graph and radar.
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
    </div>
  );
};

/* ── Beginner Financials View ─────────────────────────────────────────── */
const BeginnerFinancialsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">SIMPLE VIEW</span>
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
    </div>
  );
};

/* ── Beginner Portfolio View ──────────────────────────────────────────── */
const BeginnerPortfolioView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-bg-elev border-2 border-edge shadow-brutal space-y-8 mt-10">
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block">SIMPLE VIEW</span>
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
    </div>
  );
};

/* ── Main Page Shell ──────────────────────────────────────────────────── */
const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const careerState = useCareerState();
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [viewMode, setViewMode] = useState<'advanced' | 'simple'>('advanced');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bfb_cold_open_played') !== 'true';
    } catch {
      return true;
    }
  });
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);

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
    } catch {
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
    } catch {
      return 'Guest User';
    }
  }, []);

  const getStageLabel = (stageId: string) => {
    if (stageId === 'foundation') return '1st / 2nd Year';
    if (stageId === 'specializing') return '3rd Year';
    if (stageId === 'placement') return '4th Year';
    if (stageId === 'pivot') return 'Graduate / Alumni';
    return stageId;
  };
  const getDomainLabel = (domainId: string) => {
    if (domainId === 'vlsi') return 'Digital Design & RTL';
    if (domainId === 'dv') return 'Verification (UVM/DV)';
    if (domainId === 'pd') return 'Physical Design & STA';
    if (domainId === 'embedded') return 'Embedded & IoT';
    if (domainId === 'eda') return 'Software / EDA Tools';
    return domainId;
  };

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {showSplash && <ColdOpenSplash onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-bg-void text-text-main pb-28">
        {/* Sticky Top Navigation — minimal: back + view toggle + theme */}
        <div className="sticky top-0 z-30 bg-bg-void border-b-2 border-edge">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/portal')}
              aria-label="Back to portal"
              className="brutal-btn inline-flex h-9 items-center gap-1.5 bg-bg-elev px-3 text-[12px] font-bold text-text-main shrink-0 cursor-pointer"
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Portal</span>
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setViewMode(viewMode === 'advanced' ? 'simple' : 'advanced')}
                className="brutal-btn h-9 px-3 flex items-center gap-1.5 bg-bg-elev font-mono text-[11px] uppercase tracking-wider text-text-main font-bold cursor-pointer border-2 border-edge"
                title="Toggle between Beginner and Telemetry mode"
              >
                <span className={viewMode === 'simple' ? 'text-teal-400 font-extrabold' : 'text-text-dim'}>Beginner</span>
                <span className="text-text-dim">/</span>
                <span className={viewMode === 'advanced' ? 'text-teal-400 font-extrabold' : 'text-text-dim'}>Telemetry</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Floating Tab Navigation */}
        <FloatingCommandBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Tab Views */}
        <main className="relative">
          {activeTab === 'about' && <AboutTab />}

          {activeTab === 'explore' && (
            <div className="space-y-4">
              {/* Restored original RoadmapHero as clean page opener */}
              <RoadmapHero onStartDiagnostic={() => setIsDiagnosticOpen(true)} />

              {/* Personalization / Onboarding Calibration Flow */}
              {(!careerPrefs || isRecalibrating) ? (
                <PersonalizationFlow
                  currentPrefs={careerPrefs}
                  onSelectPrefs={(prefs) => {
                    handleSelectPrefs(prefs);
                    setIsRecalibrating(false);
                  }}
                />
              ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
                  <div className="bg-bg-elev border-2 border-edge shadow-brutal p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-gentle-pulse" />
                      <span className="font-mono text-xs text-text-sub uppercase">
                        SIGNAL PATHWAY CALIBRATED: <span className="text-text-main font-bold">{getStageLabel(careerPrefs.stage).toUpperCase()}</span> Specializing in <span className="text-teal-400 font-bold">{getDomainLabel(careerPrefs.domain).toUpperCase()}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setIsRecalibrating(true)}
                      className="brutal-btn h-8 px-3 flex items-center bg-bg-base font-mono text-[10px] uppercase tracking-wider text-text-main font-bold border-2 border-edge cursor-pointer"
                    >
                      Recalibrate
                    </button>
                  </div>
                </div>
              )}

              {/* Silicon Telemetry & Targeting Panel / Simple Insights */}
              {viewMode === 'advanced' ? (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
                  <div className="flex items-center justify-between gap-4 mb-6 py-3 border-b border-border-soft/50">
                    <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
                      SILICON TELEMETRY & TARGETING DECK
                    </span>
                    <span className="font-mono text-[10px] text-teal-400 animate-gentle-pulse">
                      SYSTEM ACTIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-bg-elev border-2 border-edge shadow-brutal p-6">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">NEURAL SIGNAL PATHWAY SYNC</h3>
                        <BiometricCalibration />
                      </div>
                      <div className="bg-bg-elev border-2 border-edge shadow-brutal p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">SILICON DEMAND WEATHER</h3>
                          <p className="text-xs text-text-sub leading-normal mb-4">
                            Real-time industrial demand shifts across major ECE design sectors.
                          </p>
                        </div>
                        <CareerWeather />
                      </div>
                    </div>
                    <div className="bg-bg-elev border-2 border-edge shadow-brutal p-6">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-signal-core mb-4">MISSION TARGET CLOCKS</h3>
                      <MissionClock />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                  <div className="bg-bg-elev border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-6">
                    <div className="border-b border-border-soft/50 pb-4">
                      <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block mb-1">
                        BEGINNER GUIDE
                      </span>
                      <h3 className="text-2xl font-bold text-text-main uppercase">
                        ECE Core Industry Highlights
                      </h3>
                      <p className="text-text-sub text-sm leading-relaxed mt-1">
                        High-level insights to help beginners navigate the Indian semiconductor landscape.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <span className="text-teal-400 mt-1 select-none">▪</span>
                          <div>
                            <h4 className="font-bold text-text-main text-sm">India Fab Renaissance</h4>
                            <p className="text-xs text-text-sub leading-relaxed mt-0.5">
                              The India Semiconductor Mission (ISM) with a ₹76,000 Cr outlay is funding major manufacturing fabs (like Tata-PSMC in Dholera) and OSAT plants, creating 300,000+ core jobs.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-teal-400 mt-1 select-none">▪</span>
                          <div>
                            <h4 className="font-bold text-text-main text-sm">Product MNC vs. IT Services</h4>
                            <p className="text-xs text-text-sub leading-relaxed mt-0.5">
                              Silicon product companies (NVIDIA, Qualcomm, Intel) pay freshers ₹8–18 LPA starting salary, compounding rapidly compared to standard service sector software roles.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <span className="text-teal-400 mt-1 select-none">▪</span>
                          <div>
                            <h4 className="font-bold text-text-main text-sm">The Skill Shortage</h4>
                            <p className="text-xs text-text-sub leading-relaxed mt-0.5">
                              A severe shortage of VLSI design and verification engineers means companies hire on demonstrated competence. Verifying small designs on the platform is highly valued.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-teal-400 mt-1 select-none">▪</span>
                          <div>
                            <h4 className="font-bold text-text-main text-sm">No-Fluff Roadmap</h4>
                            <p className="text-xs text-text-sub leading-relaxed mt-0.5">
                              Start with basic Digital Logic (gates, Boolean algebra) and progress to Verilog RTL. Practice design verification (UVM/DV) or Physical Design (STA) once core logic is solid.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Domain grid with inline diagnostic CTA */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between gap-4 mb-6 py-3 border-b border-border-soft/50">
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
                    10 ECE domains · click to expand
                  </span>
                  <button
                    onClick={() => setIsDiagnosticOpen(true)}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                  >
                    <HelpCircle size={13} /> Help me find my domain →
                  </button>
                </div>
              </div>

            <MarketPulse />
            <DomainGrid highlightedDomainId={careerPrefs?.domain || null} onFocusSkillNode={handleFocusSkillNode} />
            
            {viewMode === 'advanced' ? (
              <SalaryLab onFocusSkillNode={handleFocusSkillNode} />
            ) : (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-bg-elev border-2 border-edge shadow-brutal p-6 sm:p-8 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block mb-1">
                      SIMPLE SALARY SUMMARY
                    </span>
                    <h3 className="text-2xl font-bold text-text-main uppercase">
                      Silicon Compensation Bands
                    </h3>
                    <p className="text-text-sub text-sm leading-relaxed mt-1">
                      A summary of ECE salary trajectories across product and service sectors in India.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-soft/45">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider block">IT / EDA Services Entry</span>
                      <span className="text-xl font-bold text-text-main block">₹4.0L – ₹10.0L <span className="text-xs font-normal text-text-dim">/ year</span></span>
                      <p className="text-xs text-text-dim leading-relaxed">
                        Wide entry gates at services companies or smaller design houses.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-teal-400 uppercase tracking-wider block">Product MNC Entry</span>
                      <span className="text-xl font-bold text-text-main block">₹8.0L – ₹15.0L <span className="text-xs font-normal text-text-dim">/ year</span></span>
                      <p className="text-xs text-text-dim leading-relaxed">
                        Qualcomm, Intel, SSIR. High standards, rewarding candidates with solid fundamentals.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-accent-orange uppercase tracking-wider block">Elite Core Product Entry</span>
                      <span className="text-xl font-bold text-text-main block">₹15.0L – ₹30.0L <span className="text-xs font-normal text-text-dim">/ year</span></span>
                      <p className="text-xs text-text-dim leading-relaxed">
                        Apple, NVIDIA, Google TPU teams. Highly competitive; requires stellar design portfolios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <CompaniesBoard />
            <OpportunitiesBoard />
            <StudentPathSection />
            <AlumniPathwaysSection />
          </div>
        )}

        {activeTab === 'skills' && (
          viewMode === 'simple' ? (
            <BeginnerSkillsView domain={careerPrefs?.domain || 'vlsi'} />
          ) : (
            <div className="space-y-12">
              <Suspense fallback={<TabLoading />}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
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
          viewMode === 'simple' ? (
            <BeginnerFinancialsView />
          ) : (
            <div className="space-y-12">
              <Suspense fallback={<TabLoading />}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
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
          viewMode === 'simple' ? (
            <BeginnerPortfolioView />
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
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
    </>
  );
};

export default CareerRoadmapPage;
