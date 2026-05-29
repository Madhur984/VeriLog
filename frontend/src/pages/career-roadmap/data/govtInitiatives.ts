export interface GovtInitiative {
  name: string;
  acronym: string;
  org: string;
  budget: string;
  target: string;
  whatItFunds: string;
  howToAccess: string;
  forECE: string;
  status: 'ACTIVE' | 'ANNOUNCED';
  eligibility: ('STUDENT' | 'STARTUP' | 'PROFESSIONAL')[];
}

export const govtInitiatives: GovtInitiative[] = [
  {
    name: "Chips to Startup",
    acronym: "C2S",
    org: "Ministry of Electronics & IT (MeitY)",
    budget: "₹76,000 Cr (part of ISM)",
    target: "85,000 engineers trained by 2025",
    whatItFunds: "VLSI design training, EDA tool access, chip tapeout subsidies",
    howToAccess: "Apply via chips2startup.in - IITs + NITs serve as training nodes",
    forECE: "Free Cadence/Synopsys tool access. Free chip fabrication for student projects.",
    status: "ACTIVE",
    eligibility: ["STUDENT", "PROFESSIONAL"],
  },
  {
    name: "Design Linked Incentive",
    acronym: "DLI",
    org: "MeitY",
    budget: "₹2,500 Cr",
    target: "100 domestic VLSI design companies",
    whatItFunds: "50% capex reimbursement for design infrastructure",
    howToAccess: "Companies apply via MeitY portal - employees benefit indirectly",
    forECE: "Join DLI-funded startups for funded salary and cutting-edge projects.",
    status: "ACTIVE",
    eligibility: ["STARTUP", "PROFESSIONAL"],
  },
  {
    name: "Special Incentive Grant for ICs & Semiconductor Hardware Tech",
    acronym: "SIGHT",
    org: "MeitY",
    budget: "₹15 Cr per product + ₹10 Cr for IP",
    target: "Domestic IC design companies",
    whatItFunds: "Product development, IP creation, prototype fabrication",
    howToAccess: "Apply as startup founder or join SIGHT-funded company",
    forECE: "Work on government-funded chip design projects at Indian startups.",
    status: "ACTIVE",
    eligibility: ["STARTUP", "PROFESSIONAL"],
  },
  {
    name: "Promoting Innovations in Individuals, Startups, and MSMEs",
    acronym: "PRISM",
    org: "DST (Department of Science & Technology)",
    budget: "₹5 Cr per project (up to 3 years)",
    target: "Individual innovators and startups",
    whatItFunds: "Prototype development, lab access, mentoring, commercialization",
    howToAccess: "Apply from final year with faculty supervisor - online portal",
    forECE: "Can apply from final year for hardware prototyping grants.",
    status: "ACTIVE",
    eligibility: ["STUDENT", "STARTUP"],
  },
  {
    name: "National Mission on Quantum Technologies & Applications",
    acronym: "NM-QTA",
    org: "DST",
    budget: "₹6,003.65 Cr over 5 years",
    target: "Quantum computing, communication, and sensing research",
    whatItFunds: "Research infrastructure, fellowships, lab equipment, international collaboration",
    howToAccess: "IISER Pune, IIT Bombay, IISc nodes - apply for PhD/PostDoc positions",
    forECE: "Quantum hardware design fellowships with ₹80K-1.2L/month stipend.",
    status: "ACTIVE",
    eligibility: ["STUDENT", "PROFESSIONAL"],
  },
  {
    name: "India Semiconductor Research Centre",
    acronym: "ISRC",
    org: "MeitY + IISc Bengaluru",
    budget: "Part of ISM allocation",
    target: "3nm and below process research",
    whatItFunds: "Advanced node research, PhD and PostDoc positions, equipment",
    howToAccess: "Apply for PhD/PostDoc at IISc - positions opening 2026",
    forECE: "PhD + PostDoc positions with ₹80K-1.2L/month stipend. Cutting-edge research.",
    status: "ANNOUNCED",
    eligibility: ["STUDENT", "PROFESSIONAL"],
  },
];
