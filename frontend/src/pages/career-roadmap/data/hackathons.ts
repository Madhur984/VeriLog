export interface Hackathon {
  name: string;
  organizer: string;
  prize: string;
  domains: string[];
  frequency: string;
  nextEdition: string;
  level: string;
  teamSize?: string;
  mode: 'Online' | 'Hybrid' | 'Offline';
  difficulty: 1 | 2 | 3;
  status: 'OPEN' | 'UPCOMING' | 'CLOSED';
  whyItMatters: string;
}

export const hackathons: Hackathon[] = [
  {
    name: "Smart India Hackathon (SIH)",
    organizer: "MoE, AICTE",
    prize: "₹1L per winning team (₹5L grand prize)",
    domains: ["Electronics", "Embedded", "IoT", "Defense"],
    frequency: "Annual (August-December)",
    nextEdition: "SIH 2026 - registration opens July 2026",
    level: "National",
    teamSize: "6 members",
    mode: "Hybrid",
    difficulty: 2,
    status: "UPCOMING",
    whyItMatters: "Judges from DRDO, ISRO, PSUs. Best for PSU placements and government recognition.",
  },
  {
    name: "Texas Instruments Innovation Challenge (TIIC)",
    organizer: "Texas Instruments India",
    prize: "₹2.5L for 1st place",
    domains: ["Analog", "Embedded", "Industrial Electronics"],
    frequency: "Annual",
    nextEdition: "TIIC 2026 - registration Q1 2026",
    level: "National University level",
    mode: "Hybrid",
    difficulty: 2,
    status: "UPCOMING",
    whyItMatters: "Winners get TI pre-placement offers directly. Industry-grade problem statements.",
  },
  {
    name: "Qualcomm Innovation Fellowship India (QIF)",
    organizer: "Qualcomm",
    prize: "₹50L research funding",
    domains: ["5G/mmWave", "AI/ML chips", "IoT", "VLSI"],
    frequency: "Annual",
    nextEdition: "QIF 2027 - applications Nov 2026",
    level: "PhD students primarily, final-year UG eligible",
    mode: "Hybrid",
    difficulty: 3,
    status: "UPCOMING",
    whyItMatters: "Qualcomm PPO + US visa sponsorship for winners. Highest-value ECE fellowship in India.",
  },
  {
    name: "NASA Space Apps Challenge",
    organizer: "NASA + ISRO partner events in India",
    prize: "Global recognition + NASA internship eligibility",
    domains: ["RF", "Signal Processing", "Embedded for space"],
    frequency: "Annual (October)",
    nextEdition: "October 2026",
    level: "Global",
    mode: "Hybrid",
    difficulty: 2,
    status: "UPCOMING",
    whyItMatters: "ISRO notices Indian NASA winners. Backdoor to ISRO recruitment pipeline.",
  },
  {
    name: "IEEE ICASSP Student Challenge",
    organizer: "IEEE",
    prize: "Travel grant + publication opportunity",
    domains: ["Signal Processing", "AI/ML on chips"],
    frequency: "Annual (with ICASSP conference)",
    nextEdition: "ICASSP 2027",
    level: "International",
    mode: "Hybrid",
    difficulty: 3,
    status: "UPCOMING",
    whyItMatters: "IEEE certification + international publication in final year. CV goldmine.",
  },
  {
    name: "e-Yantra Robotics Competition (eYRC)",
    organizer: "IIT Bombay + MoE",
    prize: "Cash prizes + internship at IIT Bombay",
    domains: ["Embedded", "Robotics", "RTOS", "Control Systems"],
    frequency: "Annual (September-March season)",
    nextEdition: "eYRC 2026-27 - registration Sep 2026",
    level: "National",
    mode: "Hybrid",
    difficulty: 2,
    status: "UPCOMING",
    whyItMatters: "Best embedded systems competition in India. Intel sponsors. IIT Bombay certificate.",
  },
];
