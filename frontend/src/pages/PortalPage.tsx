import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SkillGraph } from "./components/SkillGraph";
import { useColorScheme } from "../hooks/useColorScheme";
import {
  Cpu,
  Wifi,
  CircuitBoard,
  Radio,
  Zap,
  Move3d,
  Shield,
  Eye,
  TrendingUp,
  Briefcase,
  Building2,
  Rocket,
  GraduationCap,
  Award,
  BookOpen,
  Linkedin,
  Github,
  Mail,
  DollarSign,
  Target,
  Users,
  FileText,
  Sparkles,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Download,
  Trophy,
  Landmark,
  Search,
  Heart,
  Brain,
  ChevronRight,
  Info,
  X,
  Calculator,
  Share2,
  Bookmark,
  Star,
  Columns,
  ExternalLink,
  Layers,
  BarChart,
  Settings,
} from "lucide-react";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

interface Domain {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  keySkills: string[];
  jobRoles: string[];
  companies: string[];
  startingSalary: string;
  demand: "High" | "Medium" | "Growing";
  difficulty: "Easy" | "Moderate" | "Hard";
  // Detailed fields for Modal
  allJobRoles: string[];
  allCompanies: string[];
  salaryProgression: { fresher: string; mid: string; senior: string };
  requiredCourses: string[];
  interviewTips: string[];
  toolsToMaster: string[];
  industryTrends: string[];
  sampleProjects: string[];
}

interface DreamCompany {
  name: string;
  domain: string;
  salaryIndia: string;
  salaryGlobal: string;
  location: string;
  whatTheyLookFor: string;
}

interface GlobalSalary {
  country: string;
  currency: string;
  fresher: string;
  midLevel: string;
  senior: string;
  costOfLivingIndex: number;
}

interface VisaPathway {
  country: string;
  visaName: string;
  requirements: string;
  stayPeriod: string;
  pathToPR: string;
}

interface Hackathon {
  name: string;
  organizer: string;
  frequency: string;
  prizes: string;
  skills: string;
  mode: "Online" | "Hybrid" | "Offline";
}

interface GovtInitiative {
  name: string;
  ministry: string;
  benefits: string;
  eligibility: string;
  link: string;
}

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

interface GateCutoff {
  institution: string;
  gen: number;
  obc: number;
  sc: number;
  exam: string;
}

// ----------------------------------------------------------------------
// DATA: DOMAINS OF ECE (13) - EXTREMELY DETAILED
// ----------------------------------------------------------------------

const domains: Domain[] = [
  {
    id: "vlsi",
    name: "VLSI Design",
    icon: <Cpu className="w-6 h-6" />,
    description: "Designing the tiny, complex brains inside every electronic device – from processors to memory chips.",
    keySkills: ["Verilog/VHDL", "Physical Design", "Timing Analysis", "Cadence/Synopsys"],
    jobRoles: ["RTL Design Engineer", "Physical Design Engineer", "Design Verification Engineer", "DFT Engineer"],
    companies: ["Intel", "NVIDIA", "AMD", "Texas Instruments", "Qualcomm", "Synopsys", "Cadence"],
    startingSalary: "8–15 LPA",
    demand: "High",
    difficulty: "Hard",
    allJobRoles: ["RTL Design Engineer", "Physical Design Engineer", "Design Verification Engineer", "DFT Engineer", "ASIC Design Engineer", "FPGA Engineer", "Layout Engineer", "CAD Engineer"],
    allCompanies: ["Intel", "NVIDIA", "AMD", "Texas Instruments", "Qualcomm", "Synopsys", "Cadence", "ARM", "Apple", "Samsung Semiconductor", "Micron", "Analog Devices", "Broadcom", "MediaTek"],
    salaryProgression: { fresher: "8–15 LPA", mid: "18–30 LPA", senior: "35–60 LPA" },
    requiredCourses: ["NPTEL – VLSI Physical Design", "Coursera – VLSI CAD", "Udemy – Verilog for Beginners", "MIT OCW – CMOS VLSI Design"],
    interviewTips: ["Master timing analysis (setup/hold)", "Practice STA (PrimeTime)", "Understand clock tree synthesis", "Be ready for puzzle questions (FIFO design, synchronizers)"],
    toolsToMaster: ["Cadence Virtuoso", "Synopsys Design Compiler", "ICC2", "PrimeTime", "Mentor Calibre", "Xilinx Vivado", "ModelSim"],
    industryTrends: ["Chiplets & advanced packaging", "AI/ML accelerators (TPUs, NPUs)", "RISC-V based SoCs", "3D-ICs", "Low-power design for IoT"],
    sampleProjects: ["4-bit RISC processor in Verilog", "SRAM memory controller", "AXI bus interface", "PLL layout using Cadence", "Open-source ASIC design with OpenLane"],
  },
  {
    id: "embedded",
    name: "Embedded Systems",
    icon: <CircuitBoard className="w-6 h-6" />,
    description: "Programming specialized computers (microcontrollers) that control everything from cars to smartwatches.",
    keySkills: ["C/C++", "ARM Cortex", "RTOS", "IoT Protocols", "Embedded Linux"],
    jobRoles: ["Embedded Software Engineer", "Firmware Engineer", "RTOS Engineer", "BSP Engineer"],
    companies: ["Bosch", "Samsung", "Apple", "Siemens", "Honeywell", "Tesla", "Ather Energy"],
    startingSalary: "5–10 LPA",
    demand: "High",
    difficulty: "Moderate",
    allJobRoles: ["Embedded Software Engineer", "Firmware Engineer", "RTOS Engineer", "BSP Engineer", "Embedded Linux Engineer", "IoT Engineer", "Automotive Embedded Engineer", "Embedded Security Engineer"],
    allCompanies: ["Bosch", "Samsung", "Apple", "Siemens", "Honeywell", "Tesla", "Ather Energy", "Qualcomm", "NXP", "STMicroelectronics", "Texas Instruments", "Renesas", "Infineon", "Google (Nest)", "Amazon (Lab126)"],
    salaryProgression: { fresher: "5–10 LPA", mid: "12–22 LPA", senior: "25–40 LPA" },
    requiredCourses: ["Embedded Systems – IIT KGP (NPTEL)", "RTOS – FreeRTOS tutorials", "Embedded Linux – Yocto Project", "ARM Cortex-M – Udemy"],
    interviewTips: ["Know interrupt handling & ISR design", "Understand memory mapping & linker scripts", "Practice bit-wise operations & volatile keyword", "Be able to explain boot sequence"],
    toolsToMaster: ["Keil uVision", "IAR EWARM", "STM32CubeIDE", "JTAG debuggers (J-Link)", "Oscilloscope & logic analyzer", "Wireshark for IoT", "Git"],
    industryTrends: ["TinyML on microcontrollers", "RISC-V based MCUs", "Functional safety (ISO 26262)", "Edge AI", "Zephyr RTOS"],
    sampleProjects: ["Real-time weather station with ESP32", "RTOS task scheduler", "CAN bus sniffer", "Bootloader for STM32", "IoT gateway with MQTT"],
  },
  {
    id: "wireless",
    name: "Wireless Communication",
    icon: <Wifi className="w-6 h-6" />,
    description: "Transmitting data over air – 4G/5G/6G, Wi-Fi, Bluetooth, satellite communication.",
    keySkills: ["Digital Comm", "5G NR", "MATLAB", "RF Basics", "Networking"],
    jobRoles: ["Wireless Engineer", "RF Engineer", "Protocol Stack Developer", "Network Planner"],
    companies: ["Ericsson", "Nokia", "Qualcomm", "Samsung", "Jio", "Airtel", "ISRO"],
    startingSalary: "6–12 LPA",
    demand: "Growing",
    difficulty: "Hard",
    allJobRoles: ["Wireless Engineer", "RF Engineer", "Protocol Stack Developer", "Network Planner", "Physical Layer Designer", "Baseband Algorithm Engineer", "Embedded Wireless Engineer", "5G NR Specialist"],
    allCompanies: ["Ericsson", "Nokia", "Qualcomm", "Samsung", "Jio", "Airtel", "ISRO", "Huawei", "ZTE", "Apple (wireless team)", "Google (Fi)", "MediaTek", "Broadcom", "Skyworks"],
    salaryProgression: { fresher: "6–12 LPA", mid: "12–22 LPA", senior: "25–45 LPA" },
    requiredCourses: ["NPTEL – Wireless Communication", "Coursera – 5G NR Fundamentals", "edX – RF Design", "MATLAB onramp for communications"],
    interviewTips: ["Understand OFDM, MIMO, channel models", "Know modulation schemes (QPSK, 16-QAM)", "Be able to calculate link budget", "Explain HARQ, beamforming"],
    toolsToMaster: ["MATLAB/Simulink", "NS-3 network simulator", "Wireshark", "RF test equipment (spectrum analyzer)", "Keysight ADS", "GNURadio"],
    industryTrends: ["6G (THz communication)", "RIS (Reconfigurable Intelligent Surfaces)", "NTN (Non-Terrestrial Networks)", "Integrated sensing & communication"],
    sampleProjects: ["OFDM transmitter in MATLAB", "LoRa gateway", "Bluetooth low energy beacon", "Link budget calculator", "5G NR PUSCH simulation"],
  },
  {
    id: "signal",
    name: "Signal Processing",
    icon: <Radio className="w-6 h-6" />,
    description: "Manipulating signals (audio, image, radar) for enhancement or information extraction.",
    keySkills: ["DSP", "MATLAB/Python", "Filter Design", "Machine Learning", "Image Processing"],
    jobRoles: ["DSP Engineer", "Computer Vision Engineer", "Audio Engineer", "Radar Signal Engineer"],
    companies: ["Google", "Microsoft", "Boeing", "DRDO", "Philips", "Sony"],
    startingSalary: "6–12 LPA",
    demand: "High",
    difficulty: "Hard",
    allJobRoles: ["DSP Engineer", "Computer Vision Engineer", "Audio Engineer", "Radar Signal Engineer", "Algorithm Engineer", "Speech Recognition Specialist", "Imaging Scientist", "Multimedia Engineer"],
    allCompanies: ["Google", "Microsoft", "Boeing", "DRDO", "Philips", "Sony", "Apple", "Meta", "Amazon", "Intel", "Qualcomm", "NVIDIA", "Bose", "Dolby"],
    salaryProgression: { fresher: "6–12 LPA", mid: "15–28 LPA", senior: "30–55 LPA" },
    requiredCourses: ["Signals and Systems – MIT OCW", "Digital Signal Processing – Rice Univ", "Computer Vision – Coursera", "Deep Learning for Audio – Udemy"],
    interviewTips: ["Master Z-transform, DTFT, FFT derivation", "Explain aliasing & Nyquist criteria formally", "Differentiate between FIR & IIR filters", "Understand feature extraction for ML"],
    toolsToMaster: ["MATLAB/Simulink", "Python (NumPy, SciPy, PyTorch)", "OpenCV", "Cuda for parallel processing", "LabVTI", "Audacity for analysis"],
    industryTrends: ["AI-driven noise cancellation", "Real-time deepfake detection", "Edge DSP for IoT", "Quantum Signal Processing", "Compute-in-Memory for DSP"],
    sampleProjects: ["Real-time ECG monitor simulation", "AI-based guitar pedal (distortion/wah)", "Handwritten digit recognition from scratch", "Voice command recognizer", "Radar pulse compression simulation"],
  },
  {
    id: "power",
    name: "Power Electronics",
    icon: <Zap className="w-6 h-6" />,
    description: "Efficient conversion and control of electrical energy – EVs, renewables, industrial drives.",
    keySkills: ["SMPS Design", "Magnetic Design", "EV Powertrain", "BMS", "Thermal Management"],
    jobRoles: ["Power Electronics Engineer", "EV Engineer", "BMS Engineer", "Applications Engineer"],
    companies: ["Tesla", "Ola Electric", "Siemens", "ABB", "Delta Electronics", "NXP"],
    startingSalary: "5–10 LPA",
    demand: "High",
    difficulty: "Moderate",
    allJobRoles: ["Power Electronics Engineer", "EV Engineer", "BMS Engineer", "Applications Engineer", "Hardware Design Engineer", "Inverter Design Engineer", "Converter Specialist", "Grid Integration Engineer"],
    allCompanies: ["Tesla", "Ola Electric", "Siemens", "ABB", "Delta Electronics", "NXP", "Infineon", "STMicroelectronics", "OnSemi", "Danfoss", "Schneider Electric", "TATA Power", "Ather Energy", "Rivian"],
    salaryProgression: { fresher: "5–10 LPA", mid: "12–22 LPA", senior: "25–45 LPA" },
    requiredCourses: ["NPTEL – Power Electronics", "Coursera – EV Technology", "Udemy – SMPS Design", "BMS Fundamentals – specialized training"],
    interviewTips: ["Explain Buck/Boost converter topologies", "Understand gate driver circuit design", "Know MOSFET/IGBT selection criteria", "Explain state-of-charge (SoC) estimation"],
    toolsToMaster: ["LTspice", "PSIM", "MATLAB/Simulink", "Altium Designer", "ANSYS Maxwell", "Tektronix Power Analyzers"],
    industryTrends: ["GaN & SiC based power converters", "Solid-state batteries", "V2G (Vehicle-to-Grid) tech", "Wireless EV charging", "Microgrids"],
    sampleProjects: ["10W DC-DC Buck converter PCB", "Solar charge controller with MPPT", "Lithium-ion BMS prototype", "3-phase inverter for BLDC motor", "Smart power meter with IoT"],
  },
  {
    id: "control",
    name: "Control Systems",
    icon: <Move3d className="w-6 h-6" />,
    description: "Making dynamic systems behave predictably – robotics, autopilots, industrial automation.",
    keySkills: ["PID Control", "State-Space", "Simulink", "Robotics", "PLC Programming"],
    jobRoles: ["Control Engineer", "Robotics Engineer", "Flight Control Engineer", "Automation Engineer"],
    companies: ["Boeing", "Airbus", "DRDO", "Bosch", "Rockwell Automation", "GreyOrange"],
    startingSalary: "5–10 LPA",
    demand: "Growing",
    difficulty: "Moderate",
    allJobRoles: ["Control Engineer", "Robotics Engineer", "Flight Control Engineer", "Automation Engineer", "Systems Engineer", "GNC Engineer", "Mechatronics Engineer", "Process Control Engineer"],
    allCompanies: ["Boeing", "Airbus", "DRDO", "Bosch", "Rockwell Automation", "GreyOrange", "Honeywell", "Lockheed Martin", "General Dynamics", "Kuka Robotics", "Fanuc", "Tesla (Autopilot)", "SpaceX"],
    salaryProgression: { fresher: "5–10 LPA", mid: "12–25 LPA", senior: "30–50 LPA" },
    requiredCourses: ["Control Systems – NPTEL (IIT M)", "Robotics Spezialization – Coursera", "Flight Mechanics – MIT OCW", "PLC Programming Workshop"],
    interviewTips: ["Differentiate between Time & Frequency domain", "Explain Root Locus and Bode plot significance", "Know stability criteria (Nyquist, Routh-Hurwitz)", "Explain Kalman Filtering basics"],
    toolsToMaster: ["MATLAB/Simulink", "COMSOL Multiphysics", "ROS (Robot Operating System)", "LabVIEW", "TwinCAT", "SolidWorks (basics)"],
    industryTrends: ["Model Predictive Control (MPC)", "Autonomous drone swarms", "Industry 5.0 (Human-Robot collab)", "AI-augmented control for rockets", "Digital Twins"],
    sampleProjects: ["Self-balancing two-wheeled robot", "PID-based drone altitude controller", "Traffic light control with PLC", "Inverted pendulum simulation", "Ball and beam balancer"],
  },
  {
    id: "rf",
    name: "RF & Microwave",
    icon: <Radio className="w-6 h-6" />,
    description: "High-frequency circuits for radar, 5G mmWave, satellite transceivers.",
    keySkills: ["Antenna Design", "HFSS/CST", "S-parameters", "Matching Networks", "VNA"],
    jobRoles: ["RF Engineer", "Antenna Designer", "Microwave Engineer", "EMC Engineer"],
    companies: ["Qualcomm", "ISRO", "DRDO", "Honeywell", "L3Harris", "Samsung"],
    startingSalary: "6–12 LPA",
    demand: "High",
    difficulty: "Hard",
    allJobRoles: ["RF Engineer", "Antenna Designer", "Microwave Engineer", "EMC Engineer", "High-Frequency PCB Designer", "Radar Systems Engineer", "Satellite Links Engineer", "Field Application Engineer"],
    allCompanies: ["Qualcomm", "ISRO", "DRDO", "Honeywell", "L3Harris", "Samsung", "Apple", "Ericsson", "Raytheon", "Northrop Grumman", "Keysight", "Rohde & Schwarz", "SpaceX", "ViaSat"],
    salaryProgression: { fresher: "6–12 LPA", mid: "14–25 LPA", senior: "30–55 LPA" },
    requiredCourses: ["Microwave Engineering – IIT Kharagpur", "Antenna Design – Coursera", "RF Circuit Design – Udemy", "Radar Signal Processing – edX"],
    interviewTips: ["Master Smith Chart operations", "Explain Impedance Matching (L/T networks)", "Know S-parameter definitions (S11, S21)", "Understand Antenna parameters (Gain, VSWR, RL)"],
    toolsToMaster: ["Ansys HFSS", "CST Studio Suite", "Keysight ADS", "AWR Microwave Office", "Network Analyzers", "Signal Generators"],
    industryTrends: ["mmWave for 5G/6G", "Phased Array Antennas", "Meta-materials for stealth", "Satcom (Starlink type)", "Terrahertz systems"],
    sampleProjects: ["2.4GHz Microstrip patch antenna", "RF Low-Noise Amplifier (LNA) design", "Bandpass filter using stubs", "RFID tag antenna simulation", "HFSS based SAR analysis"],
  },
  {
    id: "photonics",
    name: "Photonics & Optoelectronics",
    icon: <Eye className="w-6 h-6" />,
    description: "Light-based devices – fiber optics, Li-Fi, laser systems, optical sensors.",
    keySkills: ["Optics", "Fiber Optic Comm", "Laser Physics", "Lumerical", "COMSOL"],
    jobRoles: ["Optical Engineer", "Photonics Engineer", "Fiber Optic Designer"],
    companies: ["Cisco", "Finisar", "Lumentum", "Corning", "ST Microelectronics"],
    startingSalary: "6–12 LPA",
    demand: "Growing",
    difficulty: "Hard",
    allJobRoles: ["Optical Engineer", "Photonics Engineer", "Fiber Optic Designer", "Laser Systems Specialist", "Optoelectronic Device Researcher", "Optical Network Architect", "Lidar Systems Engineer"],
    allCompanies: ["Cisco", "Finisar", "Lumentum", "Corning", "ST Microelectronics", "Intel (Silicon Photonics)", "Apple", "Broadcom", "Nokia Bell Labs", "HPE", "Thorlabs", "Coherent", "ASML"],
    salaryProgression: { fresher: "6–12 LPA", mid: "15–28 LPA", senior: "30–60 LPA" },
    requiredCourses: ["Principles of Photonics – NPTEL", "Fiber Optic Communications – Coursera", "Quantum Optics – edX", "Laser Science – MIT OCW"],
    interviewTips: ["Explain Total Internal Reflection and Modal Dispersion", "Know Laser diode vs LED physics", "Differentiate between PIN and APD photodiodes", "Explain Wavelength Division Multiplexing (WDM)"],
    toolsToMaster: ["Ansys Lumerical", "Zemax OpticStudio", "COMSOL Optics", "LabVIEW", "Fiber Splicing kits", "Optical Spectrum Analyzers"],
    industryTrends: ["Silicon Photonics (optical interconnects)", "Li-Fi (Light Fidelity)", "Quantum Cryptography", "Optical Computing", "Biophotonics for diagnostics"],
    sampleProjects: ["Design of a Mach-Zehnder Interferometer", "Li-Fi based audio transceiver", "Optical fiber link budget simulator", "Photonic crystal fiber design", "Laser-based distance measuring tool"],
  },
  {
    id: "iot",
    name: "Internet of Things (IoT)",
    icon: <Wifi className="w-6 h-6" />,
    description: "Network of connected sensors and actuators – smart homes, industrial monitoring.",
    keySkills: ["Sensors", "MQTT", "Cloud Platforms", "Low-Power Design", "Edge Computing"],
    jobRoles: ["IoT Engineer", "Embedded IoT Engineer", "IoT Solutions Architect"],
    companies: ["AWS", "Microsoft", "Google", "Bosch", "Siemens", "Intel"],
    startingSalary: "5–9 LPA",
    demand: "High",
    difficulty: "Moderate",
    allJobRoles: ["IoT Engineer", "Embedded IoT Engineer", "IoT Solutions Architect", "IoT Security Specialist", "Edge Computing Developer", "Cloud-IoT Integration Engineer", "Sensor Network Analyst"],
    allCompanies: ["AWS", "Microsoft", "Google", "Bosch", "Siemens", "Intel", "IBM", "Cisco", "Ather Energy", "Samsung (SmartThings)", "Honeywell", "Schneider Electric", "Particle", "Arduino Pro"],
    salaryProgression: { fresher: "5–9 LPA", mid: "12–22 LPA", senior: "25–45 LPA" },
    requiredCourses: ["Introduction to IoT – NPTEL", "IoT Specialization – Coursera (UCI)", "AWS Certified IoT Core – AWS Training", "Edge AI and IoT – Udacity"],
    interviewTips: ["Explain MQTT vs HTTP for IoT", "Know Low-power protocols (LoRaWAN, Sigfox, NB-IoT)", "Differentiate between Edge and Cloud computing", "Explain sleep modes and battery optimization"],
    toolsToMaster: ["Arduino/ESP32/Raspberry Pi", "Node-RED", "MQTT Brokers (Mosquitto)", "AWS/Azure IoT Core", "Blynk/Thingspeak", "KiCad for sensor boards"],
    industryTrends: ["Industrial IoT (IIoT)", "Security at the Edge", "AIoT (AI + IoT)", "Matter Protocol for Smart Home", "Self-powered IoT nodes (energy harvesting)"],
    sampleProjects: ["LoRa based agricultural monitoring", "Smart home dashboard with Home Assistant", "Industrial asset tracker with NB-IoT", "Edge AI camera for person detection", "Blockchain for IoT data security"],
  },
  {
    id: "automotive",
    name: "Automotive Electronics",
    icon: <Zap className="w-6 h-6" />,
    description: "Electronics for vehicles – ADAS, infotainment, battery management, V2X.",
    keySkills: ["CAN/LIN", "AUTOSAR", "ISO 26262", "BMS", "Radar/LiDAR"],
    jobRoles: ["Automotive Engineer", "ADAS Engineer", "BMS Engineer", "Infotainment Engineer"],
    companies: ["Bosch", "Continental", "Tesla", "Mahindra", "Tata Motors", "Mercedes-Benz"],
    startingSalary: "6–12 LPA",
    demand: "High",
    difficulty: "Moderate",
    allJobRoles: ["Automotive Engineer", "ADAS Engineer", "BMS Engineer", "Infotainment Engineer", "V2X Communication Engineer", "Autonomous Driving Architect", "Automotive Functional Safety Engineer", "ECU Developer"],
    allCompanies: ["Bosch", "Continental", "Tesla", "Mahindra", "Tata Motors", "Mercedes-Benz", "BMW", "Audi", "NXP", "Infineon", "NVIDIA (Drive)", "Aptiv", "Valeo", "Magna"],
    salaryProgression: { fresher: "6–12 LPA", mid: "14–26 LPA", senior: "30–55 LPA" },
    requiredCourses: ["Introduction to Automotive Electronics – NPTEL", "Self-Driving Cars Specialization – Coursera", "AUTOSAR Developer Training", "Electric Vehicle Fundamentals – edX"],
    interviewTips: ["Explain CAN bus arbitration and frame structure", "Know ISO 26262 safety levels (ASIL A-D)", "Explain Regenerative braking control logic", "Know differences between Radar, LiDAR, and Sonar"],
    toolsToMaster: ["CANalyzer / CANoe", "ETAS Laboratory", "MATLAB/Simulink", "DSPACE", "LabVIEW", "Pspice"],
    industryTrends: ["Software-Defined Vehicles (SDVs)", "Level 5 Autonomy", "Over-the-Air (OTA) updates", "Hydrogen fuel cell electronics", "Centralized E/E Architecture"],
    sampleProjects: ["CAN bus simulation between two MCUs", "BMS with cell balancing algorithm", "Lane detection using OpenCV & Raspberry Pi", "Smart charger with V2G capability", "Infotainment UI with Android Automotive"],
  },
  {
    id: "medical",
    name: "Medical Electronics",
    icon: <Shield className="w-6 h-6" />,
    description: "Devices for diagnosis, monitoring, therapy – ECG, pacemakers, imaging systems.",
    keySkills: ["Biomedical Signal Processing", "Analog Front-End", "Medical Standards", "Instrumentation"],
    jobRoles: ["Medical Devices Engineer", "Biomedical Engineer", "Clinical Engineer"],
    companies: ["Philips", "Siemens Healthineers", "GE Healthcare", "Medtronic", "Biosense"],
    startingSalary: "4–8 LPA",
    demand: "Growing",
    difficulty: "Moderate",
    allJobRoles: ["Medical Devices Engineer", "Biomedical Engineer", "Clinical Engineer", "Medical Imaging Specialist", "Wearable Health Tech Developer", "Surgical Robotics Engineer", "Regulatory Affairs Engineer"],
    allCompanies: ["Philips", "Siemens Healthineers", "GE Healthcare", "Medtronic", "Biosense", "Johnson & Johnson", "Stryker", "Abbott", "ResMed", "Roche Diagnostics", "Zimmer Biomet"],
    salaryProgression: { fresher: "4–8 LPA", mid: "10–18 LPA", senior: "22–40 LPA" },
    requiredCourses: ["Medical Electronics – NPTEL", "Biomedical Instrumentation – Coursera", "Bioelectromagnetism – edX", "FDA Regulatory standards – specialized courses"],
    interviewTips: ["Explain Bio-potential amplifiers (ECG/EEG circuits)", "Know safety standards like IEC 60601", "Understand isolation techniques in medical hardware", "Explain MRI/CT scan basic signal physics"],
    toolsToMaster: ["MATLAB", "Pspice / LTspice", "LabVIEW", "Altium Designer", "SolidWorks (Medical packaging)", "Python for Health Data"],
    industryTrends: ["Remote patient monitoring (RPM)", "AI in medical imaging", "Minimally invasive surgical robots", "Implantable smart sensors", "Telemedicine hardware"],
    sampleProjects: ["Portable Pulse Oximeter", "Low-cost ECG acquisition system", "Wearable fall detector for elderly", "Non-invasive glucose monitor simulation", "Smart pill dispenser with IoT"],
  },
  {
    id: "semicon",
    name: "Semiconductor Manufacturing",
    icon: <Cpu className="w-6 h-6" />,
    description: "Fabricating chips – cleanroom processes, wafer fab, assembly & test.",
    keySkills: ["Fabrication Processes", "TCAD", "Yield Analysis", "Failure Analysis", "Cleanroom Protocols"],
    jobRoles: ["Process Engineer", "Yield Engineer", "Integration Engineer", "Equipment Engineer"],
    companies: ["TSMC", "Intel", "Samsung", "Micron", "Tower Semiconductor", "Applied Materials"],
    startingSalary: "6–12 LPA",
    demand: "High",
    difficulty: "Hard",
    allJobRoles: ["Process Engineer", "Yield Engineer", "Integration Engineer", "Equipment Engineer", "Metrology Engineer", "Contamination Control Specialist", "Etch/Photolithography Engineer", "Fab Operations Manager"],
    allCompanies: ["TSMC", "Intel", "Samsung", "Micron", "Tower Semiconductor", "Applied Materials", "ASML", "Lam Research", "KLA", "Tokyo Electron", "GlobalFoundries", "UMC", "Tata Electronics (India)"],
    salaryProgression: { fresher: "6–12 LPA", mid: "14–25 LPA", senior: "28–50 LPA" },
    requiredCourses: ["Semiconductor Device Physics – MIT OCW", "Microfabrication Techniques – NPTEL", "Nanotechnology – Coursera", "Cleanroom safety protocols – specialized training"],
    interviewTips: ["Explain the Photolithography process in detail", "Know Moore's Law and its current limitations", "Explain difference between N-type and P-type fabrication", "Understand Yield loss factors (particles, alignment)"],
    toolsToMaster: ["Sentaurus TCAD", "Silvaco", "JMP for Yield analysis", "SEM/TEM (theoretical knowledge)", "CAD for Fab layout", "Excel VBA for data tracking"],
    industryTrends: ["2nm and 1nm process nodes", "EUV (Extreme Ultraviolet) Lithography", "Chiplets and Heterogeneous Integration", "Green Manufacturing in Fabs", "Indigenous Fabs in India (Semicon India)"],
    sampleProjects: ["TCAD simulation of a FinFET device", "MOSFET fabrication steps flow-chart design", "Yield analysis study of a dummy 12-inch wafer", "Cleanroom airflow simulation", "Process window optimization for lithography"],
  },
  {
    id: "defense",
    name: "Defense & Aerospace",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Radar, sonar, electronic warfare, avionics, missile guidance.",
    keySkills: ["Radar Systems", "EW", "Secure Comms", "Avionics", "DO-254"],
    jobRoles: ["Scientist (DRDO)", "Engineer (ISRO)", "Avionics Engineer", "EW Specialist"],
    companies: ["DRDO", "ISRO", "ADA", "BEL", "Boeing", "Lockheed Martin"],
    startingSalary: "8–15 LPA (PSU scale)",
    demand: "High",
    difficulty: "Hard",
    allJobRoles: ["Scientist (DRDO)", "Engineer (ISRO)", "Avionics Engineer", "EW Specialist", "Guidance & Navigation Specialist", "Secure Communication Architect", "Radar Systems Engineer", "Combat Systems Integration Engineer"],
    allCompanies: ["DRDO", "ISRO", "ADA", "BEL", "HAL", "Boeing", "Lockheed Martin", "Raytheon", "Northrop Grumman", "BAE Systems", "Thales", "Safran", "IdeaForge", "Astra Microwave"],
    salaryProgression: { fresher: "8–15 LPA", mid: "15–30 LPA", senior: "30–65 LPA" },
    requiredCourses: ["Radar Engineering – IIT Delhi", "Flight Dynamics – NPTEL", "Secure Communications – Coursera", "Avionics Systems – specialized university course"],
    interviewTips: ["Explain the Radar range equation", "Know Pulse compression and Doppler effect fundamentals", "Explain Frequency Hopping and Jamming basics", "Understand DO-254 hardware safety lifecycle"],
    toolsToMaster: ["MATLAB/Simulink", "Ansys HFSS", "LabVIEW", "Green Hills Integrity RTOS", "DOORS for requirements", "VHDL for secure logic"],
    industryTrends: ["Hypersonic missile electronics", "Stealth (Low Observability) tech", "Electronic Warfare (EW) suite on drones", "Space-based ISR (Intelligence Survelliance)", "AI-based target recognition"],
    sampleProjects: ["Digital Radar Signal Emulator", "Encrypted peer-to-peer radio Link", "GPS-independent navigation algorithm", "Flight data recorder with secure storage", "Radar Absorbing Material (RAM) simulation"],
  },
];

// ----------------------------------------------------------------------
// DREAM COMPANIES
// ----------------------------------------------------------------------

const dreamCompanies: DreamCompany[] = [
  { name: "NVIDIA", domain: "VLSI / GPU", salaryIndia: "18–35 LPA", salaryGlobal: "$150k–250k (US)", location: "Bengaluru, Pune, Santa Clara", whatTheyLookFor: "Strong Verilog, computer architecture, CUDA" },
  { name: "Intel", domain: "VLSI / Semiconductor", salaryIndia: "12–25 LPA", salaryGlobal: "$120k–200k (US)", location: "Bengaluru, Hyderabad, Santa Clara", whatTheyLookFor: "RTL design, physical design, timing closure" },
  { name: "Qualcomm", domain: "Wireless / VLSI", salaryIndia: "12–28 LPA", salaryGlobal: "$130k–220k (US)", location: "Hyderabad, Bengaluru, San Diego", whatTheyLookFor: "Wireless comm, DSP, Verilog, embedded C" },
  { name: "Tesla", domain: "Automotive / Power", salaryIndia: "20–40 LPA", salaryGlobal: "$120k–200k (US)", location: "Palo Alto, Austin, Berlin", whatTheyLookFor: "BMS, power electronics, embedded Linux" },
  { name: "ISRO", domain: "Space / RF", salaryIndia: "~56k–1.77L per month", salaryGlobal: "N/A", location: "Multiple (India)", whatTheyLookFor: "GATE score >650, strong RF/communication" },
  { name: "Google", domain: "Hardware / AI", salaryIndia: "25–50 LPA", salaryGlobal: "$150k–300k (US)", location: "Bengaluru, Hyderabad, Mountain View", whatTheyLookFor: "TPU design, verification, embedded systems" },
  { name: "Apple", domain: "Consumer Electronics", salaryIndia: "20–45 LPA", salaryGlobal: "$140k–250k (US)", location: "Bengaluru, Cupertino", whatTheyLookFor: "SoC design, power management, firmware" },
  { name: "Samsung Semiconductor", domain: "VLSI / Memory", salaryIndia: "12–22 LPA", salaryGlobal: "$110k–180k (US)", location: "Bengaluru, Noida, Suwon", whatTheyLookFor: "Memory controller design, verification" },
  { name: "Texas Instruments", domain: "Analog / Embedded", salaryIndia: "10–18 LPA", salaryGlobal: "$100k–160k (US)", location: "Bengaluru, Dallas", whatTheyLookFor: "Analog circuit design, embedded C, RTOS" },
  { name: "Boeing", domain: "Aerospace / Avionics", salaryIndia: "10–20 LPA", salaryGlobal: "$90k–150k (US)", location: "Bengaluru, Chennai, Seattle", whatTheyLookFor: "DO-254, avionics, control systems" },
];

const globalSalaries: GlobalSalary[] = [
  { country: "India", currency: "₹ LPA", fresher: "5–12", midLevel: "12–25", senior: "25–50", costOfLivingIndex: 28 },
  { country: "USA", currency: "$k", fresher: "80–120", midLevel: "120–180", senior: "180–300", costOfLivingIndex: 75 },
  { country: "Germany", currency: "€k", fresher: "45–60", midLevel: "60–90", senior: "90–140", costOfLivingIndex: 65 },
  { country: "Singapore", currency: "SGD k", fresher: "50–70", midLevel: "70–110", senior: "110–180", costOfLivingIndex: 80 },
];

const visaPathways: VisaPathway[] = [
  { country: "USA", visaName: "H-1B (Specialty Occupation)", requirements: "Bachelor's degree + employer sponsor", stayPeriod: "3 years (extendable to 6)", pathToPR: "EB-2/EB-3 green card (long backlog)" },
  { country: "Germany", visaName: "EU Blue Card", requirements: "Degree + job offer ≥ €45k", stayPeriod: "4 years", pathToPR: "21–33 months → Permanent Residency" },
  { country: "Singapore", visaName: "Employment Pass (EP)", requirements: "Degree + job offer ≥ SGD 5k", stayPeriod: "1–2 years (renewable)", pathToPR: "After 6 months, can apply for PR" },
  { country: "Canada", visaName: "Global Talent Stream", requirements: "Job offer + LMIA exemption", stayPeriod: "2 years", pathToPR: "Express Entry (1 year experience)" },
];

const timelineMilestones = [
  { year: "Year 1", title: "Foundation", description: "Build core concepts and explore possibilities.", actions: ["Master Basic Electrical Engineering.", "Learn C programming.", "Arduino projects.", "Join clubs."] },
  { year: "Year 2", title: "Core Subjects", description: "Deepen understanding of electronics.", actions: ["Electronic Devices (BJT, MOSFET).", "Digital Logic Design.", "Signals & Systems.", "PCB design."] },
  { year: "Year 3", title: "Specialization", description: "Choose a domain and build skills.", actions: ["Select primary domain.", "Major project.", "Internship hunt.", "Certifications."] },
  { year: "Year 4", title: "Launch", description: "Placements or higher studies.", actions: ["Final year project.", "Placement prep.", "GATE qualified?", "GRE/TOEFL."] },
  { year: "0–2 yrs", title: "Early Career", description: "First job – learn and growth.", actions: ["GET at core company.", "Master internal tools.", "Contribute to OSS."] },
];

const quizQuestions: QuizQuestion[] = [{ q: "What is Nyquist rate?", options: ["Fs > 2×Fmax", "Fs = Fmax", "Fs < Fmax", "Fs = 0"], correct: 0 }];

// Data managed in SkillGraph component.

// ----------------------------------------------------------------------
// REUSABLE COMPONENTS
// ----------------------------------------------------------------------

const SectionTitle: React.FC<{ icon?: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="mb-12 text-center">
    {icon && <div className="inline-block p-2 rounded-full bg-plasma-cyan/10 text-plasma-cyan mb-4">{icon}</div>}
    <h2 className="text-3xl md:text-4xl font-bold font-ui text-oscilloscope-trace">{title}</h2>
    {subtitle && <p className="text-grid-line font-mono text-sm mt-2 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-20 h-0.5 bg-plasma-cyan/50 mx-auto mt-4" />
  </div>
);

const DomainCard: React.FC<{
  domain: Domain;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
  canCompare: boolean;
  onOpenModal: (domain: Domain) => void;
}> = ({ domain, index, isBookmarked, onToggleBookmark, isComparing, onToggleCompare, canCompare, onOpenModal }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onClick={() => onOpenModal(domain)}
      className="bg-solder-mask border border-ghost-trace rounded-2xl p-5 hover:border-plasma-cyan/50 transition-all group relative cursor-pointer"
    >
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(domain.id); }}
          disabled={!canCompare && !isComparing}
          className={`p-1 rounded bg-black/40 border transition-all ${isComparing ? "border-plasma-cyan text-plasma-cyan" : "border-ghost-trace text-grid-line hover:text-white disabled:opacity-30"}`}
          title="Compare domain"
        >
          <Columns size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(domain.id); }}
          className={`p-1 rounded bg-black/40 border transition-all ${isBookmarked ? "border-burnished-copper text-burnished-copper" : "border-ghost-trace text-grid-line hover:text-white"}`}
          title="Bookmark domain"
        >
          {isBookmarked ? <Star size={12} fill="currentColor" /> : <Bookmark size={12} />}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-plasma-cyan">{domain.icon}</div>
        <h3 className="text-xl font-bold font-ui text-oscilloscope-trace group-hover:text-plasma-cyan transition-colors">{domain.name}</h3>
      </div>
      <p className="text-grid-line text-sm mb-3 line-clamp-2">{domain.description}</p>
      <div className="flex gap-2 mb-3 text-[10px] font-mono">
        <span className={`px-2 py-0.5 rounded-full ${domain.demand === "High" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {domain.demand}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
          {domain.difficulty}
        </span>
      </div>
      <div className="space-y-1 text-xs font-mono">
        <div><span className="text-plasma-cyan">🔧 Skills:</span> {domain.keySkills.slice(0, 2).join(", ")}</div>
        <div><span className="text-burnished-copper">💰 Salary:</span> {domain.startingSalary}</div>
      </div>
      <div className="mt-4 text-center text-[10px] font-mono text-plasma-cyan opacity-0 group-hover:opacity-100 transition-opacity">
         SCROLL DATA DETECTED // CLICK TO ANALYZE →
      </div>
    </motion.div>
  );
};

const DomainDetailModal: React.FC<{ domain: Domain; onClose: () => void; isBookmarked: boolean; onToggleBookmark: (id: string) => void }> = ({ domain, onClose, isBookmarked, onToggleBookmark }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-solder-mask border border-plasma-cyan/30 rounded-3xl shadow-[0_0_50px_rgba(0,212,255,0.1)] p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-grid-line hover:text-plasma-cyan transition-all bg-white/5 p-2 rounded-full">
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 border-b border-white/5 pb-10">
          <div className="p-4 bg-plasma-cyan/10 rounded-3xl text-plasma-cyan">{domain.icon}</div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black font-ui text-white mb-2">{domain.name}</h2>
            <p className="text-grid-line max-w-2xl leading-relaxed">{domain.description}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <button
               onClick={() => onToggleBookmark(domain.id)}
               className={`px-4 py-2 rounded-xl flex items-center gap-2 border font-mono text-xs transition-all ${isBookmarked ? 'bg-burnished-copper border-burnished-copper text-white' : 'border-white/10 text-grid-line hover:border-plasma-cyan/50 hover:text-white'}`}
            >
              <Star size={14} fill={isBookmarked ? "currentColor" : "none"} /> {isBookmarked ? "BOOKMARKED" : "SAVE NODE"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
              <h3 className="text-sm font-black text-plasma-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart size={16} /> Salary Trajectory
              </h3>
              <div className="space-y-4 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-grid-line">FRESHER</span>
                  <span className="text-white font-bold">{domain.salaryProgression.fresher}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-grid-line">MID-LEVEL</span>
                  <span className="text-white font-bold">{domain.salaryProgression.mid}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-grid-line">SENIOR</span>
                  <span className="text-white font-bold">{domain.salaryProgression.senior}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-plasma-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={16} /> Market Intensity
              </h3>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${domain.demand === 'High' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  DEMAND: {domain.demand.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-plasma-cyan/10 text-plasma-cyan border border-plasma-cyan/20">
                  DIFF: {domain.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-plasma-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                <Settings size={16} /> Essential Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {domain.toolsToMaster.map(tool => (
                  <span key={tool} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-grid-line">{tool}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Job Roles Architect</h3>
                  <div className="space-y-2">
                    {domain.allJobRoles.map(role => (
                      <div key={role} className="flex items-center gap-3 text-sm text-grid-line">
                        <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan" /> {role}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Recommended Courses</h3>
                  <div className="space-y-3">
                    {domain.requiredCourses.map(course => (
                      <div key={course} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl text-xs text-grid-line border border-white/5 hover:border-plasma-cyan/30 transition-all">
                        <BookOpen size={14} className="mt-0.5 text-plasma-cyan" /> {course}
                      </div>
                    ))}
                  </div>
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                   <h3 className="text-lg font-bold text-white mb-4">Domain Mastery Pulse</h3>
                   <div className="p-4 bg-burnished-copper/5 border border-burnished-copper/20 rounded-2xl italic text-sm text-oscilloscope-trace">
                      "Trends: {domain.industryTrends.join(" // ")}"
                   </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">L-Level Projects</h3>
                  <div className="space-y-2">
                    {domain.sampleProjects.map((proj, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-grid-line">
                         <Rocket size={14} className="text-burnished-copper" /> {proj}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Industrial Reach</h3>
                  <div className="flex flex-wrap gap-2">
                    {domain.allCompanies.map(c => <span key={c} className="px-2 py-1 bg-black/40 text-[10px] font-mono border border-white/5 rounded text-grid-line">{c}</span>)}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TimelineSlider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0]?.clientWidth || 300;
      containerRef.current.scrollTo({ left: index * (cardWidth + 24), behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY !== 0) {
      const delta = e.deltaY > 0 ? 1 : -1;
      scrollToIndex(Math.min(timelineMilestones.length - 1, Math.max(0, activeIndex + delta)));
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollToIndex(activeIndex - 1);
      if (e.key === "ArrowRight") scrollToIndex(activeIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-6 pb-6 scroll-smooth scrollbar-hide"
        onWheel={handleWheel}
      >
        {timelineMilestones.map((milestone, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-80 cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <div className={`bg-solder-mask border rounded-2xl p-5 transition-all ${expandedIndex === idx ? "border-plasma-cyan shadow-cyan-glow" : "border-ghost-trace"}`}>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-plasma-cyan" size={18} />
                <h3 className="text-xl font-bold font-ui text-plasma-cyan">{milestone.year}</h3>
              </div>
              <h4 className="text-lg font-bold font-ui text-oscilloscope-trace">{milestone.title}</h4>
              <p className="text-grid-line text-sm mt-1">{milestone.description}</p>
              {expandedIndex === idx && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-1 list-disc list-inside text-xs font-mono text-oscilloscope-trace/80"
                >
                  {milestone.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {timelineMilestones.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`h-1 rounded-full transition-all ${activeIndex === idx ? "w-8 bg-plasma-cyan" : "w-4 bg-ghost-trace"}`}
          />
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN PORTAL PAGE
// ----------------------------------------------------------------------

export const PortalPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDemand, setFilterDemand] = useState<"All" | "High" | "Growing" | "Medium">("All");
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [scheme] = useColorScheme();

  // 📌 Bookmark & Compare States
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ece_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [salaryCalc, setSalaryCalc] = useState({ base: 12, country: "India", experience: "Fresher" });
  const [unlockedNodes, setUnlockedNodes] = useState<Set<string>>(new Set(["basic_electronics", "digital_logic"]));

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("ece_bookmarks", JSON.stringify(next));
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(0, 2));
  };

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           domain.keySkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDemand = filterDemand === "All" || domain.demand === filterDemand;
    return matchesSearch && matchesDemand;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.3 }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: "intro", label: "Intro" },
    { id: "skill-graph", label: "Skill Graph" },
    { id: "domains", label: "Pokedex" },
    { id: "calculator", label: "Salary Calc" },
    { id: "dream", label: "Dream Cos" },
    { id: "global", label: "Global" },
    { id: "timeline", label: "Timeline" },
    { id: "quiz", label: "Quiz" },
  ];

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadPDF = async () => {
    const element = document.getElementById("portal-content");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("ECE_Pokedex_Roadmap.pdf");
  };

  const calculateTakeHome = () => {
    const rates: Record<string, number> = { "India": 0.8, "USA": 0.75, "Germany": 0.6, "Singapore": 0.85 };
    const colAdj: Record<string, number> = { "India": 1, "USA": 0.3, "Germany": 0.4, "Singapore": 0.25 };
    const multiplier = salaryCalc.experience === "Mid" ? 1.8 : salaryCalc.experience === "Senior" ? 3 : 1;
    const net = salaryCalc.base * multiplier * rates[salaryCalc.country];
    const power = net * colAdj[salaryCalc.country];
    return { net: net.toFixed(1), power: power.toFixed(1) };
  };

  const takeHome = calculateTakeHome();

  return (
    <div className={`min-h-screen ${scheme === 'dark' ? 'bg-matte-obsidian text-oscilloscope-trace' : 'bg-white text-black'} font-ui relative overflow-y-auto h-screen scrollbar-hide transition-colors duration-500`}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute inset-0 bg-ghost-traces opacity-20" />
      </div>

      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-ghost-trace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Cpu className="text-plasma-cyan" size={24} />
              <span className="font-mono font-bold text-plasma-cyan tracking-wider">ECE PORTAL</span>
            </div>
            <div className="hidden lg:flex gap-6 text-xs font-mono scrollbar-hide whitespace-nowrap overflow-x-auto max-w-xl">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`transition-all py-2 border-b-2 ${activeSection === s.id ? "text-plasma-cyan border-plasma-cyan" : "text-grid-line border-transparent hover:text-white"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={downloadPDF} className="p-2 text-grid-line hover:text-plasma-cyan transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main id="portal-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-40">
        
        <AnimatePresence>
          {compareIds.length === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-24 bottom-24 bg-matte-obsidian/95 border border-plasma-cyan/40 rounded-3xl z-50 p-8 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-plasma-cyan flex items-center gap-3"><Columns /> Comparison Matrix</h2>
                <button onClick={() => setCompareIds([])} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 overflow-y-auto pr-4 scrollbar-hide">
                {compareIds.map(id => {
                  const d = domains.find(dom => dom.id === id);
                  return d ? (
                    <div key={id} className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-plasma-cyan mb-4">{d.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{d.name}</h3>
                        <p className="text-grid-line text-sm">{d.description}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[10px] text-grid-line block mb-1 uppercase tracking-widest">Market Demand</span>
                           <span className={`font-bold ${d.demand === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>{d.demand}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[10px] text-grid-line block mb-1 uppercase tracking-widest">Complexity</span>
                           <span className="font-bold text-cyan-400">{d.difficulty}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                           <span className="text-[10px] text-grid-line block mb-1 uppercase tracking-widest">Base Salary</span>
                           <span className="font-bold text-burnished-copper">{d.startingSalary}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section id="intro" ref={(el) => (sectionRefs.current["intro"] = el)} className="text-center pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-plasma-cyan/5 border border-plasma-cyan/20 text-plasma-cyan text-xs font-mono mb-6">
              <Sparkles size={14} /> INITIALIZING CAREER TRAJECTORY V2.1
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-ui tracking-tighter leading-none mb-8 uppercase">
              The ECE <span className="text-plasma-cyan">Pokédex</span>
            </h1>
            <p className="text-xl text-grid-line max-w-3xl mx-auto leading-relaxed font-mono">
               Deep-link your academic nodes to industrial outcomes. The silicon-grade guide for ECE specialists. 
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <button onClick={() => scrollTo("domains")} className="px-10 py-5 bg-plasma-cyan text-black font-black uppercase text-xs tracking-widest rounded-full hover:shadow-cyan-glow transition-all active:scale-95">
                Scan Domains
              </button>
              <button onClick={() => scrollTo("skill-graph")} className="px-10 py-5 border border-plasma-cyan/30 text-plasma-cyan font-black uppercase text-xs tracking-widest rounded-full hover:bg-plasma-cyan/10 transition-all active:scale-95">
                Visualization
              </button>
            </div>
          </motion.div>
        </section>

        <section id="skill-graph" ref={(el) => (sectionRefs.current["skill-graph"] = el)}>
          <SectionTitle icon={<Brain size={28} />} title="Interactive Dependency" subtitle="🔓 Press 'E' to unlock dragging. Drag silicon-nodes to build your own trajectory." />
          <SkillGraph 
            onNodeClick={(domainId) => {
              const domain = domains.find(d => d.id === domainId);
              if (domain) setSelectedDomain(domain);
            }} 
            unlockedNodes={unlockedNodes} 
          />
          <p className="text-center text-[10px] font-mono text-grid-line mt-4 uppercase tracking-widest opacity-50">
             [ POSITIONS_SAVED // RESET_LAYOUT_WITH_R_KEY ]
          </p>
        </section>

        <section id="domains" ref={(el) => (sectionRefs.current["domains"] = el)}>
          <SectionTitle icon={<Search size={28} />} title="Domain Trajectories" subtitle="Click any node to expand extreme details: job roles, salary progression, courses, tools, and interview tips." />
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grid-line" size={18} />
              <input
                type="text"
                placeholder="Search silicon specializations..."
                className="w-full pl-12 pr-4 py-4 bg-solder-mask border border-ghost-trace rounded-2xl text-oscilloscope-trace font-mono text-sm focus:border-plasma-cyan outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "High", "Growing"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDemand(d as any)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold font-mono transition-all ${filterDemand === d ? "bg-plasma-cyan text-black" : "bg-ghost-trace/30 text-grid-line hover:text-white"}`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDomains.map((domain, idx) => (
              <DomainCard 
                key={domain.id} domain={domain} index={idx} 
                isBookmarked={bookmarks.includes(domain.id)} onToggleBookmark={toggleBookmark}
                isComparing={compareIds.includes(domain.id)} onToggleCompare={toggleCompare}
                canCompare={compareIds.length < 2 || compareIds.includes(domain.id)}
                onOpenModal={setSelectedDomain}
              />
            ))}
          </div>
        </section>

        <section id="calculator" ref={(el) => (sectionRefs.current["calculator"] = el)}>
          <SectionTitle icon={<Calculator size={28} />} title="Fiscal Matrix" subtitle="Calculate global take-home based on regional tax nodes and seniority." />
          <div className="bg-solder-mask border border-ghost-trace rounded-3xl p-10 max-w-4xl mx-auto shadow-xl">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-grid-line tracking-widest block mb-2 uppercase">Base Scalar (annual)</label>
                      <input type="number" value={salaryCalc.base} onChange={(e) => setSalaryCalc({...salaryCalc, base: Number(e.target.value)})} className="bg-black/40 border border-white/5 px-4 py-3 rounded-xl w-full text-plasma-cyan font-mono" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-grid-line tracking-widest block mb-2 uppercase">Region</label>
                      <select value={salaryCalc.country} onChange={(e) => setSalaryCalc({...salaryCalc, country: e.target.value})} className="bg-black/40 border border-white/5 px-4 py-3 rounded-xl w-full text-sm">
                         {globalSalaries.map(g => <option key={g.country} value={g.country}>{g.country}</option>)}
                      </select>
                   </div>
                   <div className="flex gap-2">
                      {["Fresher", "Mid", "Senior"].map(lvl => (
                         <button key={lvl} onClick={() => setSalaryCalc({...salaryCalc, experience: lvl})} className={`flex-1 py-1.5 text-[8px] font-bold rounded-lg border ${salaryCalc.experience === lvl ? 'bg-plasma-cyan/10 border-plasma-cyan text-plasma-cyan' : 'border-white/5 text-grid-line'}`}>{lvl.toUpperCase()}</button>
                      ))}
                   </div>
                </div>
                <div className="md:col-span-2 text-center flex flex-col justify-center items-center border-l border-white/5 pl-10">
                   <span className="text-[10px] text-grid-line uppercase tracking-widest">Net Realization</span>
                   <div className="text-7xl font-black text-white my-4">{salaryCalc.country === 'India' ? '₹' : '$'}{takeHome.net}K</div>
                   <p className="text-xs text-grid-line font-mono bg-white/[0.02] px-4 py-2 rounded-full border border-white/5 italic">Adjusted for local fiscal compression & COL index.</p>
                </div>
             </div>
          </div>
        </section>

        <section id="dream" ref={(el) => (sectionRefs.current["dream"] = el)}>
          <SectionTitle icon={<Building2 size={28} />} title="Market Giants" subtitle="Industrial leaders in hardware, silicon, and avionics." />
          <div className="overflow-x-auto scrollbar-hide"><table className="w-full text-left border-collapse min-w-[800px]"><thead><tr className="border-b border-white/10 text-[10px] uppercase font-mono"><th className="p-4 text-plasma-cyan">Entity</th><th className="p-4">Focus</th><th className="p-4">Scalar (India)</th><th className="p-4">Global Matrix</th></tr></thead><tbody className="divide-y divide-white/5">{dreamCompanies.map((c, i) => (<tr key={i} className="hover:bg-white/[0.02] transition-colors"><td className="p-4 font-bold text-white">{c.name}</td><td className="p-4 text-sm text-grid-line">{c.domain}</td><td className="p-4 font-mono text-xs">{c.salaryIndia}</td><td className="p-4 font-mono text-xs text-grid-line">{c.salaryGlobal}</td></tr>))}</tbody></table></div>
        </section>

        <section id="global" ref={(el) => (sectionRefs.current["global"] = el)}>
          <SectionTitle icon={<Globe size={28} />} title="Hub Analytics" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {globalSalaries.map(g => (
                <div key={g.country} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                   <div className="text-lg font-black mb-4">{g.country} ({g.currency})</div>
                   <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between"><span>FRESH:</span> <span className="text-plasma-cyan">{g.fresher}</span></div>
                      <div className="flex justify-between"><span>SENIOR:</span> <span className="text-plasma-cyan">{g.senior}</span></div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="text-[10px] text-grid-line mb-1 italic">COL Index: {g.costOfLivingIndex}%</div>
                      <div className="h-1 bg-white/5 w-full rounded-full"><div className="h-full bg-plasma-cyan" style={{width:`${g.costOfLivingIndex}%`}} /></div>
                   </div>
                </div>
             ))}
          </div>
        </section>

        <section id="timeline" ref={(el) => (sectionRefs.current["timeline"] = el)}>
          <SectionTitle icon={<Clock size={28} />} title="Execution Timeline" subtitle="From foundation nodes to industrial deployment." />
          <TimelineSlider />
        </section>

        <section id="quiz" ref={(el) => (sectionRefs.current["quiz"] = el)}>
          <SectionTitle icon={<Brain size={28} />} title="Mastery Node" subtitle="Solve to verify trajectory calibration." />
          <div className="bg-solder-mask border border-ghost-trace rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl text-center space-y-10">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-6">
                <p className="text-3xl font-black">{q.q}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {q.options.map((opt, optIdx) => (
                    <button key={optIdx} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:border-plasma-cyan transition-all uppercase">
                       {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-8 border-t border-white/5 italic text-sm text-grid-line uppercase font-black">
               [ VERIFICATION REQUIRED FOR FULL ACCESS ]
            </div>
          </div>
        </section>

        <section className="text-center py-40 border-t border-white/5">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic mb-10">SILICON AWAITS.</h2>
          <div className="flex justify-center gap-6">
            <button onClick={downloadPDF} className="px-16 py-6 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-plasma-cyan hover:scale-105 transition-all">
              EXTRACT DATA PDF
            </button>
            <button className="p-6 border border-white/10 rounded-full hover:bg-white/5 transition-all"><Share2 /></button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-20 px-8 text-center space-y-4 opacity-30">
        <div className="text-[10px] font-mono tracking-[0.5em] text-plasma-cyan">CAREER_MODULE_V2.1 // VERILOG.OS</div>
        <div className="text-[8px] font-mono text-grid-line uppercase">© 2025 ECE Trajectory Instrument. All industrial nodes verified.</div>
      </footer>

      <AnimatePresence>
        {selectedDomain && (
          <DomainDetailModal 
            domain={selectedDomain} 
            onClose={() => setSelectedDomain(null)} 
            isBookmarked={bookmarks.includes(selectedDomain.id)}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortalPage;
