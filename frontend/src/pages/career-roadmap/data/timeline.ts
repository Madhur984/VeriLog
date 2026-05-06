export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  core: string[];
  exams: string[];
  projects: string[];
  milestone: string;
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    year: "Year 1",
    title: "Foundation",
    description: "Build core concepts and develop engineering intuition.",
    core: ["Mathematics (Linear Algebra, Calculus, Probability)", "Physics (Semiconductor Basics)", "C Programming (Pointers, Structs, Memory)", "Basic Electronics (KVL, KCL, BJT, MOSFET)"],
    exams: ["JEE Mains result (if applicable)", "CBSE/State board marks", "University internal exams"],
    projects: ["LED flasher circuit", "Basic oscillator (Colpitts/Hartley)", "Arduino-based temperature sensor"],
    milestone: "Build intuition before memorization. Understand WHY, not just HOW.",
  },
  {
    year: "Year 2",
    title: "Core Subjects",
    description: "Deepen understanding of digital and analog electronics.",
    core: ["Digital Electronics (Boolean Algebra, K-maps, Sequential Circuits)", "Signals & Systems (Fourier, Laplace, Z-transform)", "Analog Circuits (Op-amps, Oscillators, Filters)", "Microcontrollers (8051/AVR/ARM intro)"],
    exams: ["Internal university exams", "NPTEL online course certifications", "Competitive programming (optional)"],
    projects: ["4-bit ALU on FPGA (Xilinx/Altera)", "Sensor-based Arduino/ESP32 project", "PCB design for a simple amplifier circuit"],
    milestone: "First FPGA experience. First PCB you've designed and soldered.",
  },
  {
    year: "Year 3",
    title: "Specialization",
    description: "Choose your domain path and build deep expertise.",
    core: ["VLSI Design / Embedded / RF (choose primary path)", "Verilog/VHDL (if VLSI/FPGA track)", "Communication Systems / DSP", "Electives aligned with chosen domain"],
    exams: ["GATE mock test series begins (6 months before)", "Competitive programming or hackathon wins", "Industry certifications (ARM, Cadence, TI)"],
    projects: ["Full VLSI chip design in Cadence (college lab)", "BLE IoT node with cloud dashboard", "Research paper draft or conference submission"],
    milestone: "Domain declared. First internship secured. Portfolio taking shape.",
  },
  {
    year: "Year 4",
    title: "Launch",
    description: "Final year — placements, exams, and career launch.",
    core: ["Capstone project (6-month duration)", "Interview preparation (DSA + domain)", "GATE actual exam preparation", "GRE/TOEFL (if MS abroad planned)"],
    exams: ["GATE 2027/2028", "Campus placements (Aug–Feb)", "GRE/TOEFL (if applicable)", "Company-specific coding rounds"],
    projects: ["Published GitHub portfolio (5+ projects)", "2+ industry internship experiences", "Capstone: Full system-level project"],
    milestone: "Placement secured OR MS admit received. Career trajectory locked in.",
  },
  {
    year: "Year 5–7",
    title: "Early Career",
    description: "First job — learn fast, contribute to production, build reputation.",
    core: ["On-job learning and domain deepening", "Internal tools and proprietary flows", "Open-source contributions", "Cross-functional collaboration"],
    exams: ["Cadence Certified Verilog Professional", "ARM Cortex Certification", "AWS IoT Core Certification", "Industry-specific compliance training"],
    projects: ["Production tape-out contribution", "Internal tool or flow improvement", "Conference paper or tech blog publication"],
    milestone: "₹15L+ salary achieved. International opportunity becoming visible.",
  },
];
