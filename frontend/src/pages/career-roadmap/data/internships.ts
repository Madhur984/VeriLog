export interface Internship {
  name: string;
  org: string;
  roles?: string[];
  duration: string;
  stipend: string;
  location?: string;
  applyVia?: string;
  conversionRate?: string;
  eligibility?: string;
  deadline?: string;
  tip?: string;
  seats?: string;
  domains?: string[];
  category: 'india' | 'international' | 'research';
}

export const internships: Internship[] = [
  // INDIA PROGRAMS
  {
    name: "Qualcomm India Intern Program",
    org: "Qualcomm",
    roles: ["RTL Design", "DV", "RF Modem", "AI/ML Inference"],
    duration: "6 months (Jan-Jun, Jul-Dec batches)",
    stipend: "₹80,000-1,20,000/month",
    location: "Bengaluru / Hyderabad",
    applyVia: "careers.qualcomm.com",
    conversionRate: "~70% get PPO",
    eligibility: "B.E./B.Tech ECE/EEE, 7.5+ CGPA, VLSI or DSP coursework",
    category: "india",
  },
  {
    name: "Texas Instruments India Intern",
    org: "Texas Instruments",
    roles: ["Analog Design", "Embedded SW", "Digital Design"],
    duration: "6 months",
    stipend: "₹70,000-1,00,000/month",
    location: "Bengaluru",
    applyVia: "ti.com/careers",
    conversionRate: "~65%",
    eligibility: "B.E./B.Tech, knowledge of SPICE, MATLAB, C",
    category: "india",
  },
  {
    name: "Samsung R&D Institute India (SRIB)",
    org: "Samsung",
    roles: ["5G Modem", "DRAM Design", "AI Chip Architecture"],
    duration: "2-6 months",
    stipend: "₹60,000-90,000/month",
    location: "Bengaluru / Noida",
    conversionRate: "~55%",
    category: "india",
  },
  {
    name: "Intel India Design Engineering Intern",
    org: "Intel",
    roles: ["CPU Design", "Physical Design", "Validation"],
    duration: "6 months",
    stipend: "₹70,000-1,10,000/month",
    location: "Bengaluru / Hyderabad",
    conversionRate: "~60%",
    category: "india",
  },

  // INTERNATIONAL PROGRAMS
  {
    name: "MITACS Globalink Research Internship",
    org: "MITACS (Canada)",
    duration: "12 weeks (May-August)",
    stipend: "CAD 10,000 flat",
    domains: ["ECE", "CS", "Physics"],
    seats: "~500/year for India",
    deadline: "Typically September (for following summer)",
    tip: "CGPA 8.0+ strongly recommended. Apply to 7 projects max.",
    eligibility: "Undergraduate students, penultimate year preferred",
    category: "international",
  },
  {
    name: "DAAD WISE (Germany)",
    org: "DAAD",
    duration: "2-3 months (May-July)",
    stipend: "€650/month + travel grant",
    location: "TU Munich, KIT, RWTH Aachen (German universities)",
    deadline: "October 15 each year",
    tip: "Choose ECE labs working on automotive or RF - highest acceptance chance.",
    category: "international",
  },
  {
    name: "NTU URECA (Singapore)",
    org: "Nanyang Technological University",
    duration: "1 semester",
    stipend: "SGD 1,500/month",
    deadline: "November for following January",
    category: "international",
  },
  {
    name: "CERN Summer Student Programme",
    org: "CERN",
    duration: "8-13 weeks",
    stipend: "CHF 90/day + accommodation",
    deadline: "January (very competitive)",
    tip: "ECE relevance: Electronics for detector systems, FPGA, RF amplifiers.",
    category: "international",
  },

  // RESEARCH PROGRAMS
  {
    name: "IISc Summer Research Program (SRP)",
    org: "Indian Institute of Science",
    duration: "2 months (May-July)",
    stipend: "₹10,000-20,000/month",
    domains: ["ECE", "EEE", "Photonics", "RF"],
    applyVia: "sac.iisc.ac.in (typically opens February)",
    category: "research",
  },
  {
    name: "IISER Summer Internship",
    org: "IISER (multiple campuses)",
    duration: "6-8 weeks",
    stipend: "₹8,000-15,000/month",
    category: "research",
  },
  {
    name: "IIT Kanpur SURGE Program",
    org: "IIT Kanpur",
    duration: "8 weeks (May-July)",
    stipend: "₹8,000-12,000/month",
    deadline: "January-February each year",
    applyVia: "surge.iitk.ac.in",
    category: "research",
  },
  {
    name: "IIT Bombay Research Internship Program",
    org: "IIT Bombay",
    duration: "8 weeks",
    stipend: "₹8,000-12,000/month",
    deadline: "February each year",
    category: "research",
  },
];
