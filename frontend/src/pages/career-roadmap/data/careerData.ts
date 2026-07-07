/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BitForBytes — Career Roadmap: single source of truth
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every number rendered on /career-roadmap comes from this file so the page
 * stays honest and easy to refresh. Figures were researched from public sources
 * (see SOURCES) and reflect the market as of AS_OF. They are ranges, not
 * promises — pay and demand vary by company tier, city, node and cycle.
 *
 * To update: edit the values here and bump AS_OF. Nothing else needs to change.
 */

export const AS_OF = 'July 2026';

export interface Source { id: string; label: string; url: string }

export const SOURCES: Source[] = [
  { id: 'ism', label: 'India Semiconductor Mission (ism.gov.in)', url: 'https://ism.gov.in/' },
  { id: 'idc', label: 'IDC — Semiconductor Market Forecast 2026', url: 'https://www.idc.com/' },
  { id: 'deloitte', label: 'Deloitte — 2026 Global Semiconductor Outlook', url: 'https://www.deloitte.com/us/en/insights/industry/technology/technology-media-telecom-outlooks/semiconductor-industry-outlook.html' },
  { id: 'mckinsey', label: 'McKinsey — Semiconductor industry size', url: 'https://www.mckinsey.com/industries/semiconductors/our-insights' },
  { id: 'levels', label: 'levels.fyi — hardware/VLSI compensation', url: 'https://www.levels.fyi/' },
  { id: 'chipxpert', label: 'VLSI Engineer Salary in India 2026', url: 'https://chipxpert.in/vlsi-salary-india-2026/' },
  { id: 'takshila', label: 'Takshila — VLSI Engineer Salary India 2026', url: 'https://www.takshila-vlsi.com/blog/vlsi-engineer-salary-india-2026/' },
  { id: 'gate', label: 'GATE 2026 — IIT Guwahati', url: 'https://gate2026.iitg.ac.in/' },
  { id: 'micron', label: 'Micron Sanand ATMP (news)', url: 'https://www.microchipusa.com/industry-news/semiconductor-jobs-in-india-1million-opportunities-by-2026' },
];

/* ────────────────────────────────────────────────────────────────────────
 * 1. MARKET PULSE — the opportunity, in real numbers
 * ──────────────────────────────────────────────────────────────────────── */

export interface MarketStat {
  id: string;
  value: string;      // headline figure, pre-formatted
  label: string;      // what it is
  detail: string;     // one honest sentence of context
  sourceId: string;
}

export const marketStats: MarketStat[] = [
  {
    id: 'global-market',
    value: '~$1 trillion',
    label: 'Global chip market (2026)',
    detail: 'Semiconductor revenue crosses the trillion-dollar mark in 2026 (≈$843B in 2025), driven by the AI compute build-out.',
    sourceId: 'idc',
  },
  {
    id: 'market-2030',
    value: '~$1.7 trillion',
    label: 'Projected market by 2030',
    detail: 'Independent forecasts (IDC, McKinsey, PwC) put the market at roughly $1.6–1.8T by 2030 — a durable, multi-decade growth curve.',
    sourceId: 'mckinsey',
  },
  {
    id: 'india-investment',
    value: '₹76,000 Cr',
    label: 'India Semiconductor Mission outlay',
    detail: 'The government incentive pool that has already anchored 5+ approved fab/ATMP projects worth over ₹1.6 lakh crore ($21B+).',
    sourceId: 'ism',
  },
  {
    id: 'india-jobs',
    value: '~1 million',
    label: 'India semiconductor jobs by 2026–27',
    detail: 'Across design, verification, fabrication and packaging (ATMP) — with a projected shortfall of 300,000+ skilled engineers by 2027.',
    sourceId: 'micron',
  },
  {
    id: 'design-share',
    value: '~20%',
    label: "India's share of the world's chip-design engineers",
    detail: 'India already designs a fifth of the world’s silicon; the Mission now adds manufacturing to the map.',
    sourceId: 'ism',
  },
  {
    id: 'talent-gap',
    value: '1M+',
    label: 'Global talent shortfall by 2030',
    detail: 'Deloitte estimates the industry will be short more than a million professionals worldwide — this is a hiring market, not a lottery.',
    sourceId: 'deloitte',
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * 2. DOMAINS — where the work actually is
 * ──────────────────────────────────────────────────────────────────────── */

export interface Domain {
  id: string;
  name: string;
  tagline: string;
  fresherLpa: [number, number];   // India, ₹ LPA
  seniorLpa: [number, number];    // India, ₹ LPA (7+ yrs)
  outlook: 'red-hot' | 'hot' | 'steady';
  difficulty: 1 | 2 | 3 | 4 | 5;
  what: string;
  coreSkills: string[];
  tools: string[];
  roadmap: string[];
}

export const domains: Domain[] = [
  {
    id: 'vlsi', name: 'RTL Design & VLSI', tagline: 'Describe the chip in code',
    fresherLpa: [8, 18], seniorLpa: [30, 60], outlook: 'red-hot', difficulty: 5,
    what: 'Turn an architecture into synthesisable Verilog/SystemVerilog RTL that becomes a real chip. The core skill the whole industry is built on.',
    coreSkills: ['Verilog / SystemVerilog', 'Digital logic & FSMs', 'Computer architecture', 'Static timing (STA)', 'Low-power design'],
    tools: ['Synopsys VCS', 'Cadence Genus', 'Design Compiler', 'Git + Tcl/Python'],
    roadmap: ['Digital logic & Boolean algebra', 'Verilog → SystemVerilog', 'Computer architecture', 'Synthesis & timing', 'A tape-out-style project'],
  },
  {
    id: 'dv', name: 'Design Verification', tagline: 'Prove the chip works before it ships',
    fresherLpa: [8, 16], seniorLpa: [28, 55], outlook: 'red-hot', difficulty: 4,
    what: 'Build the testbenches and coverage that catch bugs before a $10M mask set. The single most-hired VLSI role in India, and often the highest-paid at entry.',
    coreSkills: ['SystemVerilog', 'UVM', 'Constrained-random & coverage', 'Assertions (SVA)', 'Debugging discipline'],
    tools: ['UVM', 'Synopsys VCS', 'Cadence Xcelium', 'Verdi / SimVision'],
    roadmap: ['Verilog basics', 'SystemVerilog for verification', 'UVM methodology', 'Coverage & assertions', 'Verify a real IP block'],
  },
  {
    id: 'pd', name: 'Physical Design & STA', tagline: 'From netlist to silicon layout',
    fresherLpa: [7, 15], seniorLpa: [28, 55], outlook: 'hot', difficulty: 5,
    what: 'Floorplan, place, route and close timing on advanced nodes. Advanced-node (5nm/3nm) PD expertise carries one of the biggest pay premiums.',
    coreSkills: ['Floorplanning & P&R', 'Static timing analysis', 'Clock tree synthesis', 'Physical verification', 'Tcl scripting'],
    tools: ['Cadence Innovus', 'Synopsys ICC2 / PrimeTime', 'StarRC', 'Calibre'],
    roadmap: ['CMOS & standard cells', 'Timing fundamentals', 'Place & route flow', 'Signoff (DRC/LVS/STA)', 'Block-level PD project'],
  },
  {
    id: 'analog', name: 'Analog & Mixed-Signal', tagline: 'The bridge to the real world',
    fresherLpa: [8, 16], seniorLpa: [30, 60], outlook: 'hot', difficulty: 5,
    what: 'Design op-amps, ADC/DACs, PLLs and power management — the scarce, deeply-paid craft that never fully automates.',
    coreSkills: ['Circuit intuition', 'Semiconductor devices', 'Noise & feedback', 'Layout awareness', 'SPICE'],
    tools: ['Cadence Virtuoso', 'Spectre', 'ADS', 'MATLAB'],
    roadmap: ['Network analysis', 'MOSFET device physics', 'Single-stage amplifiers', 'Data converters / PLLs', 'A full analog block'],
  },
  {
    id: 'embedded', name: 'Embedded Systems', tagline: 'Where code meets hardware',
    fresherLpa: [5, 12], seniorLpa: [18, 35], outlook: 'hot', difficulty: 3,
    what: 'Firmware, RTOS and drivers for microcontrollers — the largest and most accessible hardware job market, and a strong first role.',
    coreSkills: ['Embedded C / C++', 'Microcontroller architecture', 'RTOS', 'I2C / SPI / UART', 'Debugging with a scope'],
    tools: ['ARM Cortex-M', 'FreeRTOS / Zephyr', 'STM32 / ESP32', 'JTAG / logic analyzer'],
    roadmap: ['C for embedded', 'Microcontroller peripherals', 'RTOS concepts', 'Device drivers', 'A connected-device project'],
  },
  {
    id: 'wireless', name: 'Wireless & 5G/6G', tagline: 'The physics of connectivity',
    fresherLpa: [8, 16], seniorLpa: [25, 50], outlook: 'hot', difficulty: 4,
    what: 'Implement communication standards on silicon — baseband, modems and the DSP behind them. 6G standardisation is now underway at 3GPP.',
    coreSkills: ['Communication theory', 'Digital signal processing', '5G NR fundamentals', 'MATLAB modelling', 'Fixed-point implementation'],
    tools: ['MATLAB / Simulink', 'Python', 'C for DSP', 'Vector signal analyzers'],
    roadmap: ['Signals & systems', 'DSP', 'Digital communications', '5G NR / baseband', 'A modem-block model'],
  },
  {
    id: 'power', name: 'Power Electronics & EV', tagline: 'Move energy efficiently',
    fresherLpa: [6, 12], seniorLpa: [18, 40], outlook: 'red-hot', difficulty: 4,
    what: 'Converters, inverters and battery systems for EVs and the grid. India needs 500,000+ EV professionals by 2030; SiC/GaN skills are scarce.',
    coreSkills: ['Power semiconductor devices', 'Converter topologies', 'Control loops', 'Thermal design', 'BMS architecture'],
    tools: ['PSIM / PLECS', 'Simulink', 'SiC / GaN MOSFETs', 'Bench power tools'],
    roadmap: ['Power semiconductors', 'DC-DC / DC-AC topologies', 'Control theory', 'Battery & BMS', 'A working converter'],
  },
  {
    id: 'comp-arch', name: 'Computer Architecture', tagline: 'Design the brains',
    fresherLpa: [10, 20], seniorLpa: [35, 70], outlook: 'red-hot', difficulty: 5,
    what: 'CPU/GPU/accelerator micro-architecture, ISA and memory hierarchy — the highest-leverage design work, supercharged by the AI-chip boom.',
    coreSkills: ['ISA & pipelines (RISC-V)', 'Caches & memory', 'Performance modelling', 'RTL design', 'Parallelism'],
    tools: ['gem5', 'RISC-V toolchain', 'C++', 'Python'],
    roadmap: ['Computer organisation', 'Pipelining & hazards', 'Cache hierarchies', 'Out-of-order / accelerators', 'A pipelined core in RTL'],
  },
  {
    id: 'semi-mfg', name: 'Semiconductor Manufacturing', tagline: 'Build the chips, in India',
    fresherLpa: [6, 14], seniorLpa: [22, 45], outlook: 'red-hot', difficulty: 4,
    what: 'Process, yield and equipment engineering inside a fab or ATMP. The fastest-growing job pool as India’s Micron, Tata and CG plants come online.',
    coreSkills: ['Semiconductor physics', 'Cleanroom processing', 'Yield & defect analysis', 'Statistical process control', 'Metrology'],
    tools: ['TCAD', 'SPC tools', 'Inspection / metrology', 'Data analysis'],
    roadmap: ['Device physics', 'Fabrication steps', 'Lithography & etch', 'Yield & SPC', 'A fab/ATMP internship'],
  },
  {
    id: 'eda', name: 'EDA / CAD', tagline: 'Build the tools that build chips',
    fresherLpa: [10, 20], seniorLpa: [30, 60], outlook: 'hot', difficulty: 5,
    what: 'Write the synthesis, place-and-route and verification engines the whole industry depends on — a software-heavy, algorithmic path with strong pay.',
    coreSkills: ['C++ / Python', 'Algorithms & data structures', 'Graph & computational geometry', 'Compiler basics', 'VLSI fundamentals'],
    tools: ['C++', 'Python', 'OpenROAD / Yosys', 'LLVM'],
    roadmap: ['Strong DSA in C++', 'VLSI design flow', 'Logic synthesis algorithms', 'Placement & routing', 'Contribute to open EDA'],
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * 3. SALARIES — India, by career stage (₹ LPA)
 * ──────────────────────────────────────────────────────────────────────── */

export interface SalaryStage {
  id: string;
  stage: string;
  exp: string;
  min: number;
  max: number;
  note: string;
}

/** Broad VLSI/semiconductor bands in India, 2026. Product/MNC track. */
export const salaryStages: SalaryStage[] = [
  { id: 'fresher-service', stage: 'Fresher · services', exp: '0 yrs', min: 4, max: 10, note: 'IT/EDA service companies — the widest door in.' },
  { id: 'fresher-product', stage: 'Fresher · product', exp: '0 yrs', min: 8, max: 15, note: 'Product MNCs; median fresher ≈ ₹7.5 LPA overall.' },
  { id: 'fresher-tier1', stage: 'Fresher · Tier-1', exp: '0 yrs', min: 15, max: 30, note: 'Elite offers (Intel, Qualcomm, NVIDIA, Apple, Google).' },
  { id: 'mid', stage: 'Mid-level', exp: '3–7 yrs', min: 12, max: 25, note: 'The band most working engineers sit in.' },
  { id: 'senior', stage: 'Senior', exp: '7–10 yrs', min: 25, max: 50, note: 'Team leads and specialists; median ≈ ₹26 LPA at 5–8 yrs.' },
  { id: 'principal', stage: 'Principal / Architect', exp: '10+ yrs', min: 55, max: 100, note: 'Advanced-node PD, UVM DV leads and analog architects top out here.' },
];

export interface SkillPremium { skill: string; delta: [number, number]; why: string }

/** Extra ₹ LPA a hot skill adds on top of the base band (2026). */
export const skillPremiums: SkillPremium[] = [
  { skill: 'AI / accelerator chip design', delta: [4, 6], why: 'Every hyperscaler is building custom silicon.' },
  { skill: 'Advanced nodes (5nm / 3nm PD)', delta: [3, 5], why: 'A tiny pool of engineers can close timing at these nodes.' },
  { skill: 'EV power electronics (SiC / GaN)', delta: [3, 5], why: 'The EV ramp is outrunning the talent supply.' },
  { skill: 'Analog / mixed-signal', delta: [3, 5], why: 'Scarce craft that resists automation.' },
  { skill: 'UVM design verification', delta: [2, 4], why: 'The most-hired role; good DV engineers are always short.' },
];

/* ────────────────────────────────────────────────────────────────────────
 * 4. GLOBAL — indicative gross annual pay, 2026
 * ──────────────────────────────────────────────────────────────────────── */

export interface GlobalPay {
  country: string;
  flag: string;
  currency: string;
  entry: string;
  senior: string;
  note: string;
}

export const globalPay: GlobalPay[] = [
  { country: 'India', flag: '🇮🇳', currency: '₹ LPA', entry: '8–15', senior: '30–100', note: 'Product/MNC track; lowest cost of living.' },
  { country: 'USA', flag: '🇺🇸', currency: '$K', entry: '95–140', senior: '180–300', note: 'VLSI design engineer averages ≈ $170K; top ≈ $200K+ (levels.fyi).' },
  { country: 'Germany', flag: '🇩🇪', currency: '€K', entry: '50–70', senior: '95–140', note: 'Strong automotive & industrial semiconductor base.' },
  { country: 'Singapore', flag: '🇸🇬', currency: 'S$K', entry: '55–90', senior: '120–200', note: 'Indicative; regional fab & design hub (TSMC, Micron, GF).' },
];

/* ────────────────────────────────────────────────────────────────────────
 * 5. COMPANIES — who hires, and for what
 * ──────────────────────────────────────────────────────────────────────── */

export interface Company {
  name: string;
  domainTags: string[];
  indiaLpa: string;
  cities: string;
  lookFor: string;
}

export const companies: Company[] = [
  { name: 'NVIDIA', domainTags: ['vlsi', 'comp-arch', 'dv'], indiaLpa: '20–45', cities: 'Bengaluru · Pune · Hyderabad', lookFor: 'RTL, computer architecture, verification, CUDA-aware design.' },
  { name: 'Apple', domainTags: ['vlsi', 'analog', 'dv'], indiaLpa: '22–50', cities: 'Bengaluru · Hyderabad', lookFor: 'SoC design, low-power methodology, silicon validation.' },
  { name: 'Google', domainTags: ['comp-arch', 'dv', 'vlsi'], indiaLpa: '22–48', cities: 'Bengaluru · Hyderabad', lookFor: 'ASIC/TPU design, verification, ML-hardware.' },
  { name: 'AMD', domainTags: ['vlsi', 'pd', 'dv'], indiaLpa: '16–35', cities: 'Bengaluru · Hyderabad', lookFor: 'RTL, UVM verification, physical design.' },
  { name: 'Qualcomm', domainTags: ['wireless', 'vlsi', 'embedded'], indiaLpa: '14–30', cities: 'Hyderabad · Bengaluru · Chennai', lookFor: 'DSP, RTL, DV, 5G modem, embedded C.' },
  { name: 'Intel', domainTags: ['vlsi', 'pd', 'semi-mfg'], indiaLpa: '14–28', cities: 'Bengaluru · Hyderabad', lookFor: 'RTL, physical design, STA, DFT, process.' },
  { name: 'Samsung (SSIR)', domainTags: ['vlsi', 'dv', 'wireless'], indiaLpa: '12–24', cities: 'Bengaluru · Noida', lookFor: 'Memory & SoC design, DRAM controllers, 5G, DV.' },
  { name: 'Texas Instruments', domainTags: ['analog', 'embedded'], indiaLpa: '12–22', cities: 'Bengaluru', lookFor: 'Analog design, SPICE, embedded C, mixed-signal.' },
  { name: 'Micron', domainTags: ['semi-mfg', 'vlsi'], indiaLpa: '10–22', cities: 'Hyderabad · Sanand', lookFor: 'DRAM/NAND design, process & yield, DFT.' },
  { name: 'Synopsys', domainTags: ['eda', 'dv', 'vlsi'], indiaLpa: '12–26', cities: 'Bengaluru · Hyderabad · Noida', lookFor: 'RTL synthesis, DV (UVM), C++/Python, IP.' },
  { name: 'Cadence', domainTags: ['eda', 'analog', 'dv'], indiaLpa: '12–24', cities: 'Bengaluru · Noida · Pune', lookFor: 'EDA algorithms, AMS, verification, C++.' },
  { name: 'Tata Electronics', domainTags: ['semi-mfg', 'vlsi'], indiaLpa: '8–20', cities: 'Dholera · Bengaluru · Assam', lookFor: 'Fab process, packaging, and a build-in-India mission.' },
];

/* ────────────────────────────────────────────────────────────────────────
 * 6. OPPORTUNITIES — schemes, fabs, exams, experience (real, dated)
 * ──────────────────────────────────────────────────────────────────────── */

export interface Scheme { name: string; what: string }
export const schemes: Scheme[] = [
  { name: 'India Semiconductor Mission (ISM)', what: '₹76,000 Cr incentive pool anchoring fabs, ATMP and display projects; 5+ approved, ₹1.6 lakh Cr+ committed.' },
  { name: 'Design-Linked Incentive (DLI)', what: 'Up to 50% support + design infrastructure for Indian chip-design startups and 100+ domestic products.' },
  { name: 'Chips-to-Startup (C2S)', what: 'Trains 85,000 engineers across 100+ institutes with free industry EDA tools and real tape-outs — students can join.' },
  { name: 'SCL Mohali + PLI', what: 'Government fab modernisation and production-linked incentives building the domestic supply chain.' },
];

export interface Fab { name: string; where: string; type: string; status: 'Operational' | 'Under construction' | 'Approved' }
export const fabs: Fab[] = [
  { name: 'Micron ATMP', where: 'Sanand, Gujarat', type: 'DRAM / NAND assembly & test ($2.75B)', status: 'Operational' },
  { name: 'Tata–PSMC Fab', where: 'Dholera, Gujarat', type: "India's first 300mm fab · 28nm+", status: 'Under construction' },
  { name: 'Tata OSAT', where: 'Jagiroad, Assam', type: 'Assembly, test & packaging', status: 'Under construction' },
  { name: 'CG Power–Renesas', where: 'Sanand, Gujarat', type: 'ATMP / OSAT', status: 'Under construction' },
  { name: 'Kaynes Semicon', where: 'Sanand, Gujarat', type: 'OSAT', status: 'Under construction' },
  { name: 'HCL–Foxconn', where: 'Jewar, Uttar Pradesh', type: 'Display-driver / OSAT', status: 'Approved' },
];

export interface Exam { name: string; window: string; what: string }
export const exams: Exam[] = [
  { name: 'GATE 2027 (EC)', window: 'Register ~Aug–Sep 2026 · Exam Feb 2027', what: 'Gateway to M.Tech at IITs/IISc and PSU hiring (BEL, NPCIL, IOCL).' },
  { name: 'BARC OCES/DGFS', window: 'Applications early 2027', what: 'Research career at the Bhabha Atomic Research Centre (via GATE or BARC exam).' },
  { name: 'ISRO ICRB — Scientist/Engineer', window: 'Notified periodically', what: 'Space electronics, RF, avionics and control systems (EC eligible).' },
  { name: 'DRDO RAC / CEPTAM', window: 'Notified periodically', what: 'Defence electronics and R&D roles across labs.' },
];

export interface ExperiencePath { name: string; what: string }
export const experiencePaths: ExperiencePath[] = [
  { name: 'Product-company internships', what: 'Summer/6-month internships at Intel, Qualcomm, NVIDIA, TI — via campus and off-campus drives. The strongest conversion path.' },
  { name: 'Open-source silicon', what: 'Tape out a real chip for free through Tiny Tapeout, Google–SkyWater/IHP shuttles and OpenLane/OpenROAD.' },
  { name: 'C2S / institute tape-outs', what: 'Join a Chips-to-Startup institute programme for industry EDA tools and mentored designs.' },
  { name: 'Research internships', what: 'IISc, the IITs, IIT-M Pravartak and SERB run funded summer research in microelectronics.' },
];

/* ────────────────────────────────────────────────────────────────────────
 * 7. THE PATH — an honest year-by-year plan for a B.Tech ECE student
 * ──────────────────────────────────────────────────────────────────────── */

export interface PathStage { year: string; title: string; focus: string[] }
export const studentPath: PathStage[] = [
  { year: 'Year 1', title: 'Foundations', focus: ['Get fluent in C/C++ and math', 'Master digital logic & number systems', 'Explore domains — find what pulls you'] },
  { year: 'Year 2', title: 'Build the core', focus: ['Learn Verilog / HDL properly', 'Computer organisation & signals', 'Ship small RTL / FPGA projects', 'Pick a track to go deep on'] },
  { year: 'Year 3', title: 'Specialise', focus: ['Go deep: DV/UVM, PD/STA, analog or embedded', 'Land an internship', 'Do an open-source tape-out', 'Start GATE prep if aiming for higher studies'] },
  { year: 'Year 4', title: 'Convert', focus: ['Capstone / tape-out project', 'Interview prep: RTL, DV or PD rounds', 'Placements + GATE / MS applications'] },
  { year: 'First role → 3 yrs', title: 'Compound', focus: ['Ship real silicon; earn trust', 'Deepen one premium skill', 'Then jump to Tier-1, go abroad, or do an M.Tech/MS'] },
];
