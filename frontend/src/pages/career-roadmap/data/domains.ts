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
  }
];
