export interface StoryChoice {
  label: string;
  description: string;
  nextId: string;
}

export interface StoryNode {
  id: string;
  type: 'question' | 'outcome';
  question?: string;
  role?: string;
  company?: string;
  choices?: StoryChoice[];
}

export const storyTree: StoryNode[] = [
  // ─── LEVEL 1 ───
  {
    id: 'start',
    type: 'question',
    question: "Choose your primary domain of control.",
    choices: [
      { label: "Hardware & Silicon", description: "Design the physical foundations.", nextId: "silicon-track" },
      { label: "Signals & Wireless", description: "Master the invisible waves.", nextId: "signal-track" },
      { label: "Power & Energy", description: "Drive the green revolution.", nextId: "power-track" },
    ]
  },

  // ─── LEVEL 2: SILICON ───
  {
    id: 'silicon-track',
    type: 'question',
    question: "Select your preferred abstraction level.",
    choices: [
      { label: "Micro-Architecture", description: "Design CPU/GPU internals.", nextId: "vlsi-path" },
      { label: "System Integration", description: "FPGA & Embedded systems.", nextId: "embedded-path" },
      { label: "Design Verification", description: "Ensure silicon correctness.", nextId: "dv-path" },
    ]
  },

  // ─── LEVEL 2: SIGNALS ───
  {
    id: 'signal-track',
    type: 'question',
    question: "Choose your operational environment.",
    choices: [
      { label: "Deep Space / Defense", description: "High-reliability systems.", nextId: "defense-path" },
      { label: "Consumer Mobility", description: "5G & Modem technologies.", nextId: "mobility-path" },
    ]
  },

  // ─── LEVEL 2: POWER ───
  {
    id: 'power-track',
    type: 'question',
    question: "Where will you apply power expertise?",
    choices: [
      { label: "Electric Vehicles", description: "BMS, inverters, motor control.", nextId: "ev-path" },
      { label: "Renewable Grid", description: "Solar inverters, grid-tie systems.", nextId: "grid-path" },
    ]
  },

  // ─── LEVEL 3: VLSI ───
  {
    id: 'vlsi-path',
    type: 'question',
    question: "Select your industry trajectory.",
    choices: [
      { label: "Tier-1 IDM", description: "Join Intel/NVIDIA/Apple.", nextId: "idm-specialization" },
      { label: "Semiconductor Research", description: "PhD / R&D Frontier.", nextId: "research-focus" },
    ]
  },

  // ─── LEVEL 3: EMBEDDED ───
  {
    id: 'embedded-path',
    type: 'question',
    question: "What type of embedded systems excite you?",
    choices: [
      { label: "Automotive & ADAS", description: "Self-driving sensor fusion.", nextId: "auto-embedded" },
      { label: "IoT & Edge AI", description: "TinyML on microcontrollers.", nextId: "iot-embedded" },
      { label: "Aerospace Firmware", description: "Safety-critical DO-254.", nextId: "aero-embedded" },
    ]
  },

  // ─── LEVEL 3: DV ───
  {
    id: 'dv-path',
    type: 'question',
    question: "Which verification methodology interests you?",
    choices: [
      { label: "UVM / SystemVerilog", description: "Constrained-random testbenches.", nextId: "uvm-specialization" },
      { label: "Formal Verification", description: "Mathematical proof of correctness.", nextId: "formal-outcome" },
    ]
  },

  // ─── LEVEL 3: DEFENSE ───
  {
    id: 'defense-path',
    type: 'question',
    question: "Select your defense sector.",
    choices: [
      { label: "Space Systems", description: "Satellite payloads & navigation.", nextId: "isro-outcome" },
      { label: "Radar & EW", description: "Electronic warfare & AESA.", nextId: "drdo-outcome" },
    ]
  },

  // ─── LEVEL 3: MOBILITY ───
  {
    id: 'mobility-path',
    type: 'question',
    question: "Which layer of the modem stack?",
    choices: [
      { label: "Baseband DSP", description: "PHY layer algorithms.", nextId: "baseband-outcome" },
      { label: "RF Front-End", description: "Antenna to ADC design.", nextId: "rf-outcome" },
    ]
  },

  // ─── LEVEL 4: IDM SPECIALIZATION ───
  {
    id: 'idm-specialization',
    type: 'question',
    question: "Which silicon domain will you master?",
    choices: [
      { label: "GPU / AI Accelerators", description: "Tensor cores & parallel compute.", nextId: "nvidia-outcome" },
      { label: "CPU Core Design", description: "Out-of-order pipelines, caches.", nextId: "intel-outcome" },
      { label: "SoC Integration", description: "Full-chip integration & power.", nextId: "apple-outcome" },
    ]
  },

  // ─── LEVEL 4: RESEARCH FOCUS ───
  {
    id: 'research-focus',
    type: 'question',
    question: "What frontier will you push?",
    choices: [
      { label: "Beyond-CMOS Devices", description: "FinFET, GAA, 2D materials.", nextId: "research-outcome" },
      { label: "Neuromorphic Computing", description: "Brain-inspired architectures.", nextId: "neuromorphic-outcome" },
    ]
  },

  // ─── LEVEL 4: UVM SPECIALIZATION ───
  {
    id: 'uvm-specialization',
    type: 'question',
    question: "Which product line will you verify?",
    choices: [
      { label: "Mobile SoC", description: "Modem + AP verification.", nextId: "qualcomm-dv-outcome" },
      { label: "Data Center GPU", description: "High-performance compute.", nextId: "nvidia-dv-outcome" },
    ]
  },

  // ─── LEVEL 4: EV PATH ───
  {
    id: 'ev-path',
    type: 'question',
    question: "Which EV subsystem?",
    choices: [
      { label: "Battery Management", description: "Cell balancing & SOC estimation.", nextId: "ev-bms-outcome" },
      { label: "Traction Inverter", description: "SiC/GaN power stages.", nextId: "ev-inverter-outcome" },
    ]
  },

  // ─── LEVEL 4: GRID PATH ───
  {
    id: 'grid-path',
    type: 'question',
    question: "Grid-scale or distributed?",
    choices: [
      { label: "Utility-Scale Solar", description: "MW-class inverter design.", nextId: "grid-utility-outcome" },
      { label: "Micro-Grid / Off-Grid", description: "Hybrid storage systems.", nextId: "grid-micro-outcome" },
    ]
  },

  // ─── OUTCOMES ───
  {
    id: 'nvidia-outcome',
    type: 'outcome',
    role: "GPU RTL Design Engineer",
    company: "NVIDIA",
  },
  {
    id: 'intel-outcome',
    type: 'outcome',
    role: "CPU Core Design Engineer",
    company: "Intel",
  },
  {
    id: 'apple-outcome',
    type: 'outcome',
    role: "SoC Integration Engineer",
    company: "Apple Silicon",
  },
  {
    id: 'isro-outcome',
    type: 'outcome',
    role: "Scientist / Engineer SC",
    company: "ISRO",
  },
  {
    id: 'drdo-outcome',
    type: 'outcome',
    role: "Radar Systems Engineer",
    company: "DRDO / BEL",
  },
  {
    id: 'baseband-outcome',
    type: 'outcome',
    role: "Baseband DSP Engineer",
    company: "Qualcomm / MediaTek",
  },
  {
    id: 'rf-outcome',
    type: 'outcome',
    role: "RF Design Engineer",
    company: "Qualcomm / Skyworks",
  },
  {
    id: 'research-outcome',
    type: 'outcome',
    role: "Research Scientist",
    company: "IISc / IBM Research",
  },
  {
    id: 'neuromorphic-outcome',
    type: 'outcome',
    role: "Neuromorphic Architect",
    company: "Intel Labs / IBM Research",
  },
  {
    id: 'auto-embedded',
    type: 'outcome',
    role: "Embedded ADAS Engineer",
    company: "Tesla / Continental / Bosch",
  },
  {
    id: 'iot-embedded',
    type: 'outcome',
    role: "Edge AI / TinyML Engineer",
    company: "Google / STMicroelectronics",
  },
  {
    id: 'aero-embedded',
    type: 'outcome',
    role: "Avionics Firmware Engineer",
    company: "Boeing / HAL",
  },
  {
    id: 'formal-outcome',
    type: 'outcome',
    role: "Formal Verification Engineer",
    company: "Cadence / Synopsys",
  },
  {
    id: 'qualcomm-dv-outcome',
    type: 'outcome',
    role: "SoC Verification Engineer",
    company: "Qualcomm",
  },
  {
    id: 'nvidia-dv-outcome',
    type: 'outcome',
    role: "GPU DV Engineer",
    company: "NVIDIA",
  },
  {
    id: 'ev-bms-outcome',
    type: 'outcome',
    role: "BMS Design Engineer",
    company: "Tesla / Tata Motors / Ola Electric",
  },
  {
    id: 'ev-inverter-outcome',
    type: 'outcome',
    role: "Power Electronics Engineer",
    company: "Tesla / Infineon",
  },
  {
    id: 'grid-utility-outcome',
    type: 'outcome',
    role: "Power Systems Engineer",
    company: "SMA Solar / ABB",
  },
  {
    id: 'grid-micro-outcome',
    type: 'outcome',
    role: "Distributed Energy Engineer",
    company: "Schneider Electric / Siemens",
  },
];
