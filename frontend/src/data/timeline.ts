export interface TimelineResource {
  name: string;
  url: string;
}

export interface TimelineCard {
  year: string;
  phase: string;
  quote: string;
  milestones: string[];
  artifacts: string[];
  exams: string[];
  resources: TimelineResource[];
}

export const TIMELINE_DATA: TimelineCard[] = [
  {
    year: 'YEAR 1',
    phase: 'FOUNDATION',
    quote: '"Build intuition before memorization."',
    milestones: [
      'Complete Mathematics (Calculus, Linear Algebra, Probability)',
      'Master C programming fundamentals',
      'Understand basic circuit theory (KVL, KCL, Thevenin)',
      'Build first breadboard circuit'
    ],
    artifacts: ['LED blink circuit', 'Basic oscillator (Colpitts)', 'Logic gate PCB'],
    exams: ['University internal exams', 'CBSE/State board marks'],
    resources: [
      { name: 'NPTEL: Basic Electronics', url: 'https://nptel.ac.in' },
      { name: 'NPTEL: Problem Solving C', url: 'https://nptel.ac.in' },
    ]
  },
  {
    year: 'YEAR 2',
    phase: 'CORE SUBJECTS',
    quote: '"Digital logic is the DNA of every chip."',
    milestones: [
      'Complete Digital Electronics (K-Maps, Flip-flops, FSMs)',
      'Learn Signals & Systems (Fourier, Laplace)',
      'First FPGA project (Xilinx/Altera)',
      'Start competitive programming (optional but valuable)'
    ],
    artifacts: ['4-bit ALU on FPGA', 'Sensor-based Arduino project', 'PCB design in KiCAD'],
    exams: ['University exams', 'Start GATE mock series'],
    resources: [
      { name: 'VSD: Digital Design', url: 'https://vlsisystemdesign.com' },
      { name: 'MIT OCW: Signals & Systems', url: 'https://ocw.mit.edu' },
    ]
  },
  {
    year: 'YEAR 3',
    phase: 'SPECIALIZATION',
    quote: '"Choose your path. Go deep, not wide."',
    milestones: [
      'Declare your primary domain (from Compass result)',
      'Complete domain-specific coursework',
      'Secure first domain-relevant internship',
      'Begin certification in domain tool (Cadence/ARM/TI)'
    ],
    artifacts: [
      'Full VLSI chip design in Cadence (college lab)',
      'BLE IoT node with cloud dashboard',
      '5G protocol stack simulation (MATLAB)'
    ],
    exams: ['GATE mock series (300+ questions)', 'Domain certification exam'],
    resources: [
      { name: 'C2S Program: Free EDA Tools', url: 'https://chips2startup.in' },
      { name: 'ARM Cortex-M Certification', url: 'https://developer.arm.com' },
    ]
  },
  {
    year: 'YEAR 4',
    phase: 'LAUNCH',
    quote: '"Final year. Make every decision count."',
    milestones: [
      'Complete GATE exam (target < Rank 1000 for PSU, < 500 for IIT)',
      'Prepare for campus placements (domain-specific prep)',
      'Publish GitHub portfolio with 5+ projects',
      'Secure 2+ industry internship experiences'
    ],
    artifacts: [
      'Published GitHub portfolio',
      'Capstone project (real industry problem)',
      '2+ LOR from domain professionals'
    ],
    exams: ['GATE 2027/2028', 'Campus placement technical rounds', 'GRE (if MS planned)'],
    resources: [
      { name: 'GATE Virtual Calculator', url: 'https://gate.iitb.ac.in' },
      { name: 'GeeksForGeeks GATE Practice', url: 'https://geeksforgeeks.org' },
    ]
  },
  {
    year: 'EARLY CAREER',
    phase: 'YEAR 1–3 AT WORK',
    quote: '"Your learning rate here outpaces your college years."',
    milestones: [
      'Complete company onboarding + tool certification',
      'Own a full design block independently by Year 2',
      'Contribute to open-source (RISC-V, OpenROAD, etc.)',
      'Build visibility on LinkedIn + GitHub'
    ],
    artifacts: [
      'First tapeout contribution (your name on a chip)',
      'Conference paper or tech blog post',
      'Mentoring a junior engineer'
    ],
    exams: ['Domain-specific: Cadence Verilog cert, AWS IoT cert'],
    resources: [
      { name: 'OpenROAD Project', url: 'https://openroad.readthedocs.io' },
      { name: 'VLSI Expert Community', url: 'https://vlsiexpert.com' },
    ]
  },
  {
    year: 'SENIOR+',
    phase: 'YEAR 5–10',
    quote: '"At this stage, your career defines you — not the other way."',
    milestones: [
      'Salary crosses ₹30 LPA (India) or $150k (USA) milestone',
      'Lead a team or technical project',
      'International mobility (H-1B, Blue Card, EP)',
      'Consider startup / founding / research path'
    ],
    artifacts: [
      'Patents (1+ filed or granted)',
      'Speaking at IEEE/DAC/ICCAD conference',
      'Equity in a company (ESOP or founding)'
    ],
    exams: ['MBA (optional, IIM/ISB)', 'MS (MIT/Stanford/TU Munich if not done)'],
    resources: [
      { name: 'DAC: Design Automation Conference', url: 'https://dac.com' },
      { name: 'ICCAD Conference', url: 'https://iccad.com' },
    ]
  }
];
