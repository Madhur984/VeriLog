export interface TickerItem {
  cat: 'INDIA' | 'GLOBAL' | 'MARKET' | 'RESEARCH' | 'DEADLINE';
  text: string;
}

export const tickerData: TickerItem[] = [
  { cat: "INDIA", text: "India Semiconductor Mission: ₹76,000 Cr allocated — C2S, DLI, SIGHT programs active. 85,000 VLSI engineers needed by 2026." },
  { cat: "GLOBAL", text: "TSMC 2nm production begins Q2 2025. Apple M4 Pro uses TSMC 3nm. Intel 18A process announced for 2025 volume." },
  { cat: "MARKET", text: "Global semiconductor market: $611B in 2024, projected $1T by 2030. AI chip demand drives 40% of growth." },
  { cat: "INDIA", text: "Tata Electronics semiconductor plant (Dholera, Gujarat) — ₹91,000 Cr investment, 50,000 jobs by 2027." },
  { cat: "GLOBAL", text: "NVIDIA H200 GPU: 141GB HBM3e memory, 4.8TB/s bandwidth. Blackwell B200 successor now in production." },
  { cat: "MARKET", text: "ECE fresher packages 2024-25: VLSI — 8-15 LPA India; Embedded — 5-10 LPA; RF/5G — 6-12 LPA." },
  { cat: "RESEARCH", text: "IIT Bombay & IISc collaborate on India's first indigenous 28nm tape-out under C2S scheme — 2025." },
  { cat: "INDIA", text: "ISRO SSLV-D3 successfully placed EOS-08 in orbit. Recruitment: Scientist/Engineer SC — 320 posts 2025." },
  { cat: "DEADLINE", text: "GATE 2027 registration opens: September 2026. Exam: February 2027. Prepare 12 months in advance." },
  { cat: "GLOBAL", text: "5G subscriptions hit 2.3B globally (2025). 6G standardization begins at 3GPP Release 20 — 2025." },
  { cat: "MARKET", text: "VLSI Design Engineer: avg $145K in USA, ₹22 LPA in India (2025). Demand up 28% YoY." },
  { cat: "INDIA", text: "Micron Technology Sanand plant (Gujarat) operational 2025. 5,000 direct jobs + 15,000 indirect." },
  { cat: "RESEARCH", text: "Quantum computing: IBM Condor 1,121-qubit processor. India launches National Quantum Mission ₹6,003 Cr." },
  { cat: "GLOBAL", text: "RISC-V architecture adoption: 10B+ cores shipped by 2030 (RISC-V International forecast 2025)." },
  { cat: "MARKET", text: "Automotive electronics market: $400B by 2030. ADAS, EV BMS, and in-cabin radar drive demand." },
  { cat: "INDIA", text: "Samsung India R&D Bengaluru: hiring 2,000 engineers in 2025 for 5G modem and DRAM design." },
  { cat: "RESEARCH", text: "Neuromorphic chips: Intel Loihi 2, IBM NorthPole — 25x efficiency vs traditional GPU inference." },
  { cat: "GLOBAL", text: "ASML EUV revenue: €28.3B (2024). High-NA EUV (0.55 NA) ships to Intel and TSMC for 2nm+." },
  { cat: "DEADLINE", text: "BARC OCES/DGFS 2026 applications: February-March 2026. ECE branch eligible for Electronics stream." },
  { cat: "INDIA", text: "PLI Scheme for semiconductors: 28 applications approved. Total investment commitment: ₹1.52 lakh Cr." },
  { cat: "MARKET", text: "Power electronics boom: EV market India targets 30% EV penetration by 2030. SiC/GaN engineers scarce." },
  { cat: "GLOBAL", text: "Apple Silicon M4 chip: 3nm, 38 TOPS Neural Engine. MacBook Air M4 released March 2025." },
  { cat: "RESEARCH", text: "Photonic computing: Lightmatter Passage chip achieves 1 PFLOPS at 20W — 100x better than GPU." },
  { cat: "INDIA", text: "IIT Madras IITM Research Park: 15 semiconductor startups incubated. Funding from Qualcomm, Intel." },
  { cat: "MARKET", text: "IoT devices: 18.8B connected globally (2024). IoT chip market: $15.4B, 12.3% CAGR through 2030." },
];

export const categoryStyles: Record<TickerItem['cat'], { bg: string; text: string }> = {
  INDIA:    { bg: '#FFC107', text: '#0A0A0B' },
  GLOBAL:   { bg: '#06B6D4', text: '#0A0A0B' },
  MARKET:   { bg: '#FF5F1F', text: '#0A0A0B' },
  RESEARCH: { bg: '#8B5CF6', text: '#FFFFFF' },
  DEADLINE: { bg: '#FF3366', text: '#FFFFFF' },
};
