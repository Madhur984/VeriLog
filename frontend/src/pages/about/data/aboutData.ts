export interface StatCard {
  value: string;
  label: string;
  context: string;
  color: string;
}

export interface CommitmentCard {
  number: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export interface BuildingTask {
  done: boolean;
  text: string;
}

export interface UserTypeCard {
  label: string;
  color: string;
  opening: string;
  detail: string;
  cta: string;
  ctaLink: string;
}

export interface ComparisonRow {
  platform: string;
  issue: string;
  verdict: 'gap' | 'partial' | 'solution';
}

export const PROBLEM_STATS: StatCard[] = [
  {
    value: "1.5M",
    label: "ECE graduates per year in India",
    context: "Most don't know what their degree can do.",
    color: "text-white",
  },
  {
    value: "< 8%",
    label: "end up in core electronics roles",
    context: "The rest pivot to IT, MBA, or feel stuck.",
    color: "text-cyan-400",
  },
  {
    value: "85000",
    label: "VLSI engineers needed by 2026",
    context: "India Semiconductor Mission target. Unfilled.",
    color: "text-amber-400",
  },
  {
    value: "₹0",
    label: "cost of quality free Verilog courses in Indian context",
    context: "Before BitforBytes. This was the gap.",
    color: "text-emerald-400",
  },
];

export const HONEST_PROBLEM_ITEMS = [
  "Most students discover VLSI exists only in their 7th semester — when it's almost too late to prepare.",
  "A student at IIT has Cadence lab access. A student at a tier-3 college has a 2017 YouTube video.",
  "The domain with the highest salary growth in India — VLSI Design — has zero free, structured, interactive courses.",
  "GATE coaching covers the exam. Nobody covers the career.",
  "India's Semiconductor Mission needs engineers NOW. The pipeline of trained students is years behind.",
  "The students who do get VLSI jobs mostly figured it out alone. That shouldn't be a requirement."
];

export const COMMITMENTS: CommitmentCard[] = [
  {
    number: "01",
    title: "Always Free",
    description: "Core learning content — every module, every exercise, every career tool — will always be free for students. No paywalls on education.",
    iconName: "Unlock",
    color: "#22D3EE",
  },
  {
    number: "02",
    title: "Tier-3 Reality",
    description: "Built for students without lab access, expensive software, or well-connected seniors. Everything runs in the browser. Everything is explained from scratch.",
    iconName: "School",
    color: "#F59E0B",
  },
  {
    number: "03",
    title: "India First",
    description: "ISRO, ISM, C2S, Indian salary data, Indian company hiring patterns — this platform is built for the Indian semiconductor ecosystem, not imported from a US curriculum.",
    iconName: "Flag",
    color: "#10B981",
  },
];


export const USER_TYPES: UserTypeCard[] = [
  {
    label: "THE CONFUSED FIRST-YEAR",
    color: "#22D3EE",
    opening: "You got ECE because CS cutoffs were too high.",
    detail: "You're still not sure what electronics engineers actually do. You've been told 'it'll make sense later.' It hasn't. Start here. The Career Roadmap will show you every domain, every salary, and every company in 10 minutes.",
    cta: "EXPLORE DOMAINS →",
    ctaLink: "/career-roadmap",
  },
  {
    label: "THE STUCK THIRD-YEAR",
    color: "#F59E0B",
    opening: "Your CS friends have internships. You have derivations.",
    detail: "You've finished 5 semesters of theory and you're watching placement season from the sidelines. The gap between what your college taught and what companies want is real — and bridgeable. The Skill Topology will show you exactly what's missing.",
    cta: "SEE YOUR SKILL GAPS →",
    ctaLink: "/career-roadmap",
  },
  {
    label: 'THE DETERMINED ONE',
    color: '#10B981',
    opening: 'You actually want to design chips.',
    detail: "You found VLSI on your own. You know it's the right path. You just need someone to show you how to get from your tier-3 college to Qualcomm or Intel. The modules are built exactly for that journey.",
    cta: 'START LEARNING →',
    ctaLink: '/portal',
  },
  {
    label: 'THE NATION BUILDER',
    color: '#EA580C',
    opening: 'You want to do something that matters for India.',
    detail: "You see what China did with semiconductors in 20 years. You see India's ISM. You want to be part of it — not as a spectator but as an engineer. This platform is built with exactly that intent.",
    cta: "EXPLORE INDIA'S SILICON MISSION →",
    ctaLink: '/career-roadmap',
  },
];

export const COMPARISONS: ComparisonRow[] = [
  {
    platform: "YouTube",
    issue: "No structure. Random quality. No Indian industry context.",
    verdict: "gap",
  },
  {
    platform: "Coursera / edX",
    issue: "Expensive. Built for US grad students. Assumes lab access.",
    verdict: "gap",
  },
  {
    platform: "NPTEL",
    issue: "Excellent theory. Zero interactivity. No career bridge.",
    verdict: "partial",
  },
  {
    platform: "VSD / Udemy VLSI",
    issue: "Paid. Assumes prior knowledge. No India-specific career data.",
    verdict: "partial",
  },
  {
    platform: "BitforBytes",
    issue: "Free. Interactive. India-first. Career-connected.",
    verdict: "solution",
  },
];
