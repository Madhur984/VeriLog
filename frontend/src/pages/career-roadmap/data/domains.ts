export interface Domain {
  id: string;
  name: string;
  salary: string;
  growth: string;
  difficulty: number;
  tags: string[];
  description: string;
  roadmap: string[];
  skills: string[];
  resources: { name: string; url: string }[];
}

export const domains: Domain[] = [
  {
    id: "vlsi",
    name: "VLSI & Digital Design",
    salary: "₹12-35 LPA",
    growth: "+22% YoY",
    difficulty: 5,
    tags: ["RTL", "Verilog", "ASIC", "FPGA"],
    description: "The heart of the semiconductor industry. Designing the chips that power everything from AI to space probes.",
    roadmap: ["Digital Logic Fundamentals", "Verilog/SystemVerilog", "Computer Architecture", "Static Timing Analysis (STA)", "Synthesis & PnR"],
    skills: ["Verilog", "SystemVerilog", "UVM", "Scripting (Python/Tcl)", "CMOS Fundamentals"],
    resources: [
      { name: "VLSI System Design (VSD)", url: "#" },
      { name: "NPTEL: VLSI Design", url: "#" },
      { name: "Verilog on EDA Playground", url: "#" }
    ]
  },
  {
    id: "embedded",
    name: "Embedded Systems",
    salary: "₹6-22 LPA",
    growth: "+18% YoY",
    difficulty: 4,
    tags: ["C/C++", "RTOS", "Firmware", "IoT"],
    description: "Bridging code and hardware. Developing the firmware and OS for specialized hardware systems.",
    roadmap: ["C Programming for Embedded", "Microcontroller Architectures", "RTOS Concepts", "Device Drivers", "Hardware Interfacing"],
    skills: ["Embedded C", "C++", "FreeRTOS", "I2C/SPI/UART", "ARM Cortex-M"],
    resources: [
      { name: "FastBit Embedded Brain Academy", url: "#" },
      { name: "Embedded.com", url: "#" },
      { name: "Quantum Leaps (State Machines)", url: "#" }
    ]
  },
  {
    id: "wireless",
    name: "Wireless & 5G/6G",
    salary: "₹10-28 LPA",
    growth: "+25% YoY",
    difficulty: 4,
    tags: ["5G", "RF", "DSP", "Modems"],
    description: "Architecting the future of connectivity. Implementing complex communication protocols on silicon.",
    roadmap: ["Communication Theory", "Digital Signal Processing", "5G NR Standards", "Baseband Processing", "RF Front-end Basics"],
    skills: ["MATLAB", "DSP Algorithms", "Wireless Comm", "RF Basics", "System Modeling"],
    resources: [
      { name: "Wireless Pi", url: "#" },
      { name: "3GPP Specifications", url: "#" },
      { name: "IEEE Communications Society", url: "#" }
    ]
  },
  {
    id: "analog",
    name: "Analog & Mixed-Signal",
    salary: "₹14-40 LPA",
    growth: "+15% YoY",
    difficulty: 5,
    tags: ["Op-Amps", "ADC/DAC", "PLL", "SPICE"],
    description: "Mastering the continuous world. Designing precision circuits that interface with the physical world.",
    roadmap: ["Network Analysis", "Semiconductor Devices", "Analog Circuit Design", "Mixed-Signal Layout", "Precision Instrumentation"],
    skills: ["SPICE Simulation", "Cadence Virtuoso", "Circuit Intuition", "Noise Analysis", "Layout Design"],
    resources: [
      { name: "Razavi Electronics (YouTube)", url: "#" },
      { name: "Analog Devices Wiki", url: "#" },
      { name: "TI Precision Labs", url: "#" }
    ]
  },
  {
    id: "power",
    name: "Power Electronics",
    salary: "₹8-25 LPA",
    growth: "+30% YoY",
    difficulty: 4,
    tags: ["EV", "SiC/GaN", "Inverters", "BMS"],
    description: "Driving the green revolution. Efficient energy conversion for EVs and renewable energy grids.",
    roadmap: ["Power Semiconductor Devices", "Converter Topologies", "Control Loops", "Thermal Management", "BMS Architectures"],
    skills: ["PSIM/Simulink", "Power MOSFETs/IGBTs", "Thermal Design", "Control Theory", "Magnetics"],
    resources: [
      { name: "PES University", url: "#" },
      { name: "Infineon Academy", url: "#" },
      { name: "Power Electronics News", url: "#" }
    ]
  },
  {
    id: "semi-mfg",
    name: "Semiconductor Manufacturing",
    salary: "₹10-30 LPA",
    growth: "+35% YoY",
    difficulty: 4,
    tags: ["Fab", "Lithography", "Yield", "Process"],
    description: "Building the foundries of the future. Process engineering, yield optimization, and next-gen node development.",
    roadmap: ["Semiconductor Physics", "Cleanroom Processing", "Lithography & Patterning", "Yield Analysis", "Metrology & Inspection"],
    skills: ["TCAD", "Process Integration", "Defect Analysis", "SPC/SQC", "Equipment Engineering"],
    resources: [
      { name: "TSMC University", url: "#" },
      { name: "SEMI Academy", url: "#" },
      { name: "Solid State Technology", url: "#" }
    ]
  },
  {
    id: "comp-arch",
    name: "Computer Architecture",
    salary: "₹15-45 LPA",
    growth: "+20% YoY",
    difficulty: 5,
    tags: ["CPU", "GPU", "RISC-V", "Cache"],
    description: "Designing the brains of computation. CPU/GPU micro-architecture, ISA design, and memory hierarchies.",
    roadmap: ["ISA Design (RISC-V)", "Pipeline Architecture", "Cache Hierarchies", "Branch Prediction", "Out-of-Order Execution"],
    skills: ["Gem5 Simulation", "RISC-V Assembly", "Performance Modeling", "RTL Design", "Compiler Awareness"],
    resources: [
      { name: "Computer Architecture: A Quantitative Approach (H&P)", url: "#" },
      { name: "RISC-V Foundation", url: "#" },
      { name: "Onur Mutlu Lectures", url: "#" }
    ]
  },
  {
    id: "automotive",
    name: "Automotive Electronics",
    salary: "₹8-28 LPA",
    growth: "+28% YoY",
    difficulty: 4,
    tags: ["ADAS", "V2X", "CAN", "ISO-26262"],
    description: "Engineering the next generation of intelligent vehicles. Sensor fusion, ADAS, and functional safety.",
    roadmap: ["Automotive Protocols (CAN/LIN)", "ISO 26262 Functional Safety", "ADAS Sensor Fusion", "V2X Communication", "EV Powertrain Control"],
    skills: ["AUTOSAR", "CAN Protocol", "Functional Safety", "Simulink", "Embedded C++"],
    resources: [
      { name: "Vector Academy", url: "#" },
      { name: "NXP Automotive Training", url: "#" },
      { name: "SAE International", url: "#" }
    ]
  },
  {
    id: "quantum",
    name: "Quantum Computing",
    salary: "₹18-50 LPA",
    growth: "+40% YoY",
    difficulty: 5,
    tags: ["Qubits", "Cryogenics", "Error Correction", "Research"],
    description: "The frontier of computation. Quantum hardware engineering, cryo-electronics, and error correction.",
    roadmap: ["Quantum Mechanics Foundations", "Qubit Technologies", "Quantum Error Correction", "Cryogenic Electronics", "Quantum Algorithms"],
    skills: ["Qiskit/Cirq", "Cryogenic Design", "RF/Microwave Engineering", "Statistical Mechanics", "Python"],
    resources: [
      { name: "IBM Quantum Learning", url: "#" },
      { name: "MIT OpenCourseWare: Quantum", url: "#" },
      { name: "Google Quantum AI", url: "#" }
    ]
  },
  {
    id: "eda",
    name: "EDA / CAD Tools",
    salary: "₹12-35 LPA",
    growth: "+18% YoY",
    difficulty: 5,
    tags: ["Synthesis", "P&R", "Simulation", "Algorithms"],
    description: "Building the tools that build chips. EDA algorithm development, physical design automation, and verification engines.",
    roadmap: ["Graph Algorithms", "Logic Synthesis Algorithms", "Placement & Routing", "Timing Engine Development", "Formal Methods"],
    skills: ["C++/Python", "Algorithms & Data Structures", "Compiler Design", "Computational Geometry", "VLSI Fundamentals"],
    resources: [
      { name: "Cadence University", url: "#" },
      { name: "Synopsys Learning Center", url: "#" },
      { name: "EDA Algorithm Research Papers", url: "#" }
    ]
  }
];
