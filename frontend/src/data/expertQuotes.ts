export interface ExpertQuote {
  quote: string;
  name: string;
  role: string;
  company: string;
  domain: string;
  yearsExp: number;
  iitBatch: string;
}

export const EXPERT_QUOTES: ExpertQuote[] = [
  {
    quote: "I spent 6 months learning SPICE simulations that no one used. The day I opened Cadence Virtuoso and ran my first actual transistor-level sim — that was when I understood what ECE actually meant. Stop chasing grades. Open the tools.",
    name: "Rohan Mehta",
    role: "Physical Design Engineer",
    company: "Qualcomm India",
    domain: "VLSI",
    yearsExp: 5,
    iitBatch: "IIT Bombay, 2019",
  },
  {
    quote: "GATE rank 847. Rejected by 3 IITs. Joined a Tier-2 college M.Tech. Then cracked BARC. Then moved to a VLSI startup for 3× the salary. Your rank at 22 is not your ceiling. Your consistency at 27 is.",
    name: "Priya Nair",
    role: "RTL Design Engineer",
    company: "Tata Electronics R&D",
    domain: "VLSI",
    yearsExp: 4,
    iitBatch: "NIT Calicut, 2020",
  },
  {
    quote: "5G is not just a wireless technology. It's a career path. Every mmWave antenna on every 5G base station was designed by an RF engineer who started with Maxwell's equations in Year 2. The math is the moat. Learn it deeply.",
    name: "Aakash Singh",
    role: "RF Systems Engineer",
    company: "Qualcomm Inc. (San Diego)",
    domain: "RF & Wireless",
    yearsExp: 7,
    iitBatch: "IIT Delhi, 2017",
  },
];
