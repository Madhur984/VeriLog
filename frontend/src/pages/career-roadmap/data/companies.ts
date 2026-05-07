export interface DreamCompany {
  name: string;
  domain: string;
  salaryIndia: string;
  salaryGlobal: string;
  location: string;
  whatTheyLookFor: string;
}

export const dreamCompanies: DreamCompany[] = [
  { name: "NVIDIA", domain: "VLSI / GPU / AI", salaryIndia: "18–40 LPA", salaryGlobal: "$150k–250k (US)", location: "Bengaluru, Pune, Santa Clara", whatTheyLookFor: "Strong Verilog, computer architecture, CUDA, RTL design" },
  { name: "Intel", domain: "VLSI / Semiconductor", salaryIndia: "12–25 LPA", salaryGlobal: "$120k–200k (US)", location: "Bengaluru, Hyderabad, Santa Clara", whatTheyLookFor: "RTL design, physical design, timing closure, chiplet architecture" },
  { name: "Qualcomm", domain: "Wireless / VLSI / 5G", salaryIndia: "12–28 LPA", salaryGlobal: "$130k–220k (US)", location: "Hyderabad, Bengaluru, San Diego", whatTheyLookFor: "Wireless comm, DSP, Verilog, embedded C, 5G modem" },
  { name: "Tesla", domain: "Automotive / Power / AI", salaryIndia: "20–40 LPA", salaryGlobal: "$120k–200k (US)", location: "Palo Alto, Austin, Berlin", whatTheyLookFor: "BMS, power electronics, embedded Linux, ADAS" },
  { name: "ISRO", domain: "Space / RF / Avionics", salaryIndia: "₹56K–1.77L/month", salaryGlobal: "N/A", location: "Multiple centres (India)", whatTheyLookFor: "GATE score >650, strong RF/communication, control systems" },
  { name: "Google", domain: "Hardware / AI / TPU", salaryIndia: "25–50 LPA", salaryGlobal: "$150k–300k (US)", location: "Bengaluru, Hyderabad, Mountain View", whatTheyLookFor: "TPU design, verification, embedded systems, ML hardware" },
  { name: "Apple", domain: "SoC / Consumer Electronics", salaryIndia: "25–50 LPA", salaryGlobal: "$140k–250k (US)", location: "Hyderabad, Bengaluru, Cupertino", whatTheyLookFor: "SoC design, power management, firmware, Apple Silicon" },
  { name: "Samsung Semiconductor", domain: "VLSI / Memory / 5G", salaryIndia: "12–22 LPA", salaryGlobal: "$110k–180k (US)", location: "Bengaluru, Noida, Suwon", whatTheyLookFor: "Memory controller, DRAM design, 5G modem, verification" },
  { name: "Texas Instruments", domain: "Analog / Embedded / Mixed-Signal", salaryIndia: "10–18 LPA", salaryGlobal: "$100k–160k (US)", location: "Bengaluru, Dallas", whatTheyLookFor: "Analog circuit design, embedded C, RTOS, SPICE" },
  { name: "Boeing", domain: "Aerospace / Avionics / Defense", salaryIndia: "10–20 LPA", salaryGlobal: "$90k–150k (US)", location: "Bengaluru, Chennai, Seattle", whatTheyLookFor: "DO-254, avionics, control systems, FPGA" },
  { name: "Cadence Design Systems", domain: "EDA Tools / VLSI", salaryIndia: "12–22 LPA", salaryGlobal: "$120k–200k (US)", location: "San Jose, Bengaluru, Noida", whatTheyLookFor: "Verilog, Spectre, AMS design, algorithm development" },
  { name: "Synopsys", domain: "EDA / IP / Semiconductor", salaryIndia: "14–25 LPA", salaryGlobal: "$130k–210k (US)", location: "Mountain View, Bengaluru, Hyderabad", whatTheyLookFor: "RTL synthesis, DV (UVM/SystemVerilog), Python, scripting" },
  { name: "STMicroelectronics", domain: "Analog / Embedded / IoT", salaryIndia: "8–16 LPA", salaryGlobal: "€60k–100k (EU)", location: "Noida, Greater Noida, Geneva", whatTheyLookFor: "STM32, CAN bus, motor control, analog design" },
];
