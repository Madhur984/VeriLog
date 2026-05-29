export interface GlobalSalary {
  country: string;
  currency: string;
  flag: string;
  fresher: string;
  midLevel: string;
  senior: string;
  costOfLivingIndex: number;
  visaDifficulty: 'Easy' | 'Medium' | 'Hard';
  avgNoticePeriod: string;
  topCompanies: string[];
}

export const globalSalaries: GlobalSalary[] = [
  {
    country: "India", currency: "₹ LPA", flag: "🇮🇳",
    fresher: "5-15", midLevel: "15-30", senior: "30-60",
    costOfLivingIndex: 28, visaDifficulty: "Easy",
    avgNoticePeriod: "60-90 days",
    topCompanies: ["Qualcomm", "Intel", "TI"]
  },
  {
    country: "USA", currency: "$K", flag: "🇺🇸",
    fresher: "80-140", midLevel: "140-200", senior: "200-300",
    costOfLivingIndex: 75, visaDifficulty: "Hard",
    avgNoticePeriod: "2 weeks",
    topCompanies: ["NVIDIA", "Apple", "Google"]
  },
  {
    country: "Germany", currency: "€K", flag: "🇩🇪",
    fresher: "45-65", midLevel: "65-95", senior: "95-140",
    costOfLivingIndex: 65, visaDifficulty: "Medium",
    avgNoticePeriod: "3 months",
    topCompanies: ["Infineon", "Bosch", "Siemens"]
  },
  {
    country: "Singapore", currency: "SGD K", flag: "🇸🇬",
    fresher: "50-75", midLevel: "75-120", senior: "120-180",
    costOfLivingIndex: 80, visaDifficulty: "Medium",
    avgNoticePeriod: "1 month",
    topCompanies: ["TSMC", "Broadcom", "Micron"]
  },
];

export interface SalaryConfig {
  taxRates: Record<string, number>;
  colMultipliers: Record<string, number>;
  unitLabels: Record<string, string>;
  currencySymbols: Record<string, string>;
  pfRate: Record<string, number>;
}

export const salaryConfig: SalaryConfig = {
  taxRates: { India: 0.30, USA: 0.25, Germany: 0.40, Singapore: 0.15 },
  colMultipliers: { India: 1.0, USA: 3.2, Germany: 2.4, Singapore: 2.8 },
  unitLabels: { India: "L", USA: "K", Germany: "K", Singapore: "K" },
  currencySymbols: { India: "₹", USA: "$", Germany: "€", Singapore: "SGD " },
  pfRate: { India: 0.12, USA: 0, Germany: 0.09, Singapore: 0.17 },
};

export interface DomainSalaryRange {
  id: string;
  name: string;
  fresherMin: number;
  fresherMax: number;
  midMin: number;
  midMax: number;
  seniorMin: number;
  seniorMax: number;
}

export const domainSalaryRanges: DomainSalaryRange[] = [
  { id: "vlsi", name: "VLSI Design", fresherMin: 8, fresherMax: 15, midMin: 15, midMax: 22, seniorMin: 22, seniorMax: 45 },
  { id: "embedded", name: "Embedded Systems", fresherMin: 5, fresherMax: 10, midMin: 10, midMax: 18, seniorMin: 18, seniorMax: 30 },
  { id: "wireless", name: "Wireless / 5G", fresherMin: 8, fresherMax: 12, midMin: 12, midMax: 25, seniorMin: 25, seniorMax: 45 },
  { id: "signal", name: "Signal Processing", fresherMin: 6, fresherMax: 12, midMin: 12, midMax: 20, seniorMin: 20, seniorMax: 40 },
  { id: "power", name: "Power Electronics", fresherMin: 5, fresherMax: 10, midMin: 10, midMax: 15, seniorMin: 15, seniorMax: 30 },
  { id: "control", name: "Control Systems", fresherMin: 5, fresherMax: 10, midMin: 10, midMax: 18, seniorMin: 18, seniorMax: 35 },
  { id: "rf", name: "RF & Microwave", fresherMin: 6, fresherMax: 12, midMin: 12, midMax: 22, seniorMin: 22, seniorMax: 45 },
  { id: "photonics", name: "Photonics", fresherMin: 6, fresherMax: 12, midMin: 12, midMax: 20, seniorMin: 20, seniorMax: 40 },
  { id: "iot", name: "IoT", fresherMin: 5, fresherMax: 9, midMin: 9, midMax: 18, seniorMin: 18, seniorMax: 35 },
  { id: "automotive", name: "Automotive Electronics", fresherMin: 6, fresherMax: 12, midMin: 12, midMax: 22, seniorMin: 22, seniorMax: 40 },
  { id: "medical", name: "Medical Electronics", fresherMin: 4, fresherMax: 8, midMin: 8, midMax: 16, seniorMin: 16, seniorMax: 30 },
  { id: "semicon", name: "Semiconductor Mfg", fresherMin: 6, fresherMax: 12, midMin: 12, midMax: 22, seniorMin: 22, seniorMax: 40 },
  { id: "defense", name: "Defense & Aerospace", fresherMin: 8, fresherMax: 15, midMin: 15, midMax: 30, seniorMin: 30, seniorMax: 55 },
];

// Experience multiplier curve (exponential growth)
export const experienceMultipliers: { year: number; multiplier: number; label: string }[] = [
  { year: 0, multiplier: 1.0, label: "Fresher" },
  { year: 2, multiplier: 1.5, label: "Junior" },
  { year: 5, multiplier: 2.2, label: "Mid" },
  { year: 8, multiplier: 3.0, label: "Senior" },
  { year: 10, multiplier: 3.8, label: "Lead" },
  { year: 15, multiplier: 5.0, label: "Principal" },
];
