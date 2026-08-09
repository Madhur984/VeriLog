export interface DreamCompany {
  name: string;
  domain: string;
  salaryIndia: string;
  salaryGlobal: string;
  location: string;
  whatTheyLookFor: string;
  linkedinUrl: string;
  naukriUrl: string;
  logoSvg?: string;
}

export const dreamCompanies: DreamCompany[] = [
  { 
    name: "NVIDIA", 
    domain: "VLSI / GPU / AI Silicon", 
    salaryIndia: "18-40 LPA", 
    salaryGlobal: "$150k-250k (US)", 
    location: "Bengaluru, Pune, Santa Clara", 
    whatTheyLookFor: "Strong Verilog, computer architecture, CUDA, RTL design & DV",
    linkedinUrl: "https://www.linkedin.com/company/nvidia/jobs/",
    naukriUrl: "https://www.naukri.com/nvidia-jobs-careers"
  },
  { 
    name: "Intel", 
    domain: "VLSI / Semiconductor / CPU", 
    salaryIndia: "12-25 LPA", 
    salaryGlobal: "$120k-200k (US)", 
    location: "Bengaluru, Hyderabad, Santa Clara", 
    whatTheyLookFor: "RTL design, physical design, timing closure, chiplet architecture",
    linkedinUrl: "https://www.linkedin.com/company/intel-corporation/jobs/",
    naukriUrl: "https://www.naukri.com/intel-jobs-careers"
  },
  { 
    name: "Qualcomm", 
    domain: "Wireless / VLSI / 5G Modem", 
    salaryIndia: "12-28 LPA", 
    salaryGlobal: "$130k-220k (US)", 
    location: "Hyderabad, Bengaluru, San Diego", 
    whatTheyLookFor: "Wireless comm, DSP, Verilog, embedded C, 5G modem",
    linkedinUrl: "https://www.linkedin.com/company/qualcomm/jobs/",
    naukriUrl: "https://www.naukri.com/qualcomm-jobs-careers"
  },
  { 
    name: "AMD", 
    domain: "RTL / CPU Cores / GPUs", 
    salaryIndia: "16-35 LPA", 
    salaryGlobal: "$140k-230k (US)", 
    location: "Bengaluru, Hyderabad, Austin", 
    whatTheyLookFor: "RTL design, SystemVerilog UVM verification, physical design",
    linkedinUrl: "https://www.linkedin.com/company/amd/jobs/",
    naukriUrl: "https://www.naukri.com/amd-jobs-careers"
  },
  { 
    name: "Texas Instruments", 
    domain: "Analog / Embedded / Mixed-Signal", 
    salaryIndia: "10-18 LPA", 
    salaryGlobal: "$100k-160k (US)", 
    location: "Bengaluru, Dallas", 
    whatTheyLookFor: "Analog circuit design, embedded C, RTOS, SPICE, precision DAC/ADC",
    linkedinUrl: "https://www.linkedin.com/company/texas-instruments/jobs/",
    naukriUrl: "https://www.naukri.com/texas-instruments-jobs-careers"
  },
  { 
    name: "Synopsys", 
    domain: "EDA Tools / RTL Synthesis / IP", 
    salaryIndia: "14-25 LPA", 
    salaryGlobal: "$130k-210k (US)", 
    location: "Mountain View, Bengaluru, Hyderabad", 
    whatTheyLookFor: "RTL synthesis, DV (UVM/SystemVerilog), Python, scripting",
    linkedinUrl: "https://www.linkedin.com/company/synopsys/jobs/",
    naukriUrl: "https://www.naukri.com/synopsys-jobs-careers"
  },
  { 
    name: "Cadence Design Systems", 
    domain: "EDA / Physical Design / Verification", 
    salaryIndia: "12-22 LPA", 
    salaryGlobal: "$120k-200k (US)", 
    location: "San Jose, Bengaluru, Noida", 
    whatTheyLookFor: "Verilog, Spectre, AMS design, algorithm development",
    linkedinUrl: "https://www.linkedin.com/company/cadence-design-systems/jobs/",
    naukriUrl: "https://www.naukri.com/cadence-jobs-careers"
  },
  { 
    name: "Micron Technology", 
    domain: "DRAM / NAND / Memory / ATMP", 
    salaryIndia: "10-22 LPA", 
    salaryGlobal: "$110k-180k (US)", 
    location: "Hyderabad, Sanand, Boise", 
    whatTheyLookFor: "DRAM/NAND design, process & yield, DFT, ATMP packaging",
    linkedinUrl: "https://www.linkedin.com/company/micron-technology/jobs/",
    naukriUrl: "https://www.naukri.com/micron-technology-jobs-careers"
  },
  { 
    name: "Tata Electronics", 
    domain: "Fab Manufacturing / OSAT / Assembly", 
    salaryIndia: "8-20 LPA", 
    salaryGlobal: "N/A", 
    location: "Dholera, Bengaluru, Jagiroad (Assam)", 
    whatTheyLookFor: "Fab process, cleanroom, OSAT packaging, yield engineering",
    linkedinUrl: "https://www.linkedin.com/company/tata-electronics/jobs/",
    naukriUrl: "https://www.naukri.com/tata-electronics-jobs-careers"
  },
  { 
    name: "Google", 
    domain: "Hardware / TPU / AI Accelerator", 
    salaryIndia: "25-50 LPA", 
    salaryGlobal: "$150k-300k (US)", 
    location: "Bengaluru, Hyderabad, Mountain View", 
    whatTheyLookFor: "TPU design, verification, embedded systems, ML hardware",
    linkedinUrl: "https://www.linkedin.com/company/google/jobs/",
    naukriUrl: "https://www.naukri.com/google-jobs-careers"
  },
  { 
    name: "Apple", 
    domain: "SoC / Consumer Electronics / Silicon", 
    salaryIndia: "25-50 LPA", 
    salaryGlobal: "$140k-250k (US)", 
    location: "Hyderabad, Bengaluru, Cupertino", 
    whatTheyLookFor: "SoC design, power management, firmware, Apple Silicon",
    linkedinUrl: "https://www.linkedin.com/company/apple/jobs/",
    naukriUrl: "https://www.naukri.com/apple-jobs-careers"
  },
  { 
    name: "Samsung Semiconductor", 
    domain: "VLSI / Memory / 5G Modem", 
    salaryIndia: "12-22 LPA", 
    salaryGlobal: "$110k-180k (US)", 
    location: "Bengaluru, Noida, Suwon", 
    whatTheyLookFor: "Memory controller, DRAM design, 5G modem, verification",
    linkedinUrl: "https://www.linkedin.com/company/samsung-electronics/jobs/",
    naukriUrl: "https://www.naukri.com/samsung-jobs-careers"
  },
  { 
    name: "Bosch", 
    domain: "Automotive / Embedded / Sensors", 
    salaryIndia: "8-18 LPA", 
    salaryGlobal: "€60k-100k (EU)", 
    location: "Bengaluru, Coimbatore, Stuttgart", 
    whatTheyLookFor: "AUTOSAR, CAN bus, embedded C/C++, sensor fusion",
    linkedinUrl: "https://www.linkedin.com/company/bosch/jobs/",
    naukriUrl: "https://www.naukri.com/bosch-jobs-careers"
  },
  { 
    name: "STMicroelectronics", 
    domain: "Analog / Embedded / Microcontrollers", 
    salaryIndia: "8-16 LPA", 
    salaryGlobal: "€60k-100k (EU)", 
    location: "Noida, Greater Noida, Geneva", 
    whatTheyLookFor: "STM32, CAN bus, motor control, analog design",
    linkedinUrl: "https://www.linkedin.com/company/stmicroelectronics/jobs/",
    naukriUrl: "https://www.naukri.com/stmicroelectronics-jobs-careers"
  },
  { 
    name: "ISRO", 
    domain: "Space / RF / Avionics", 
    salaryIndia: "₹56K-1.77L/month", 
    salaryGlobal: "N/A", 
    location: "Multiple centres (Bengaluru, Trivandrum, Sriharikota)", 
    whatTheyLookFor: "GATE score >650, strong RF/communication, control systems",
    linkedinUrl: "https://www.linkedin.com/company/isro/jobs/",
    naukriUrl: "https://www.naukri.com/isro-jobs-careers"
  }
];

