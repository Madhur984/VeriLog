export interface CompassOption {
  id: string;
  text: string;
  icon: string;
  tags: string[];
}

export interface CompassQuestion {
  id: number;
  category: string;
  question: string;
  options: CompassOption[];
}

export const COMPASS_QUESTIONS: CompassQuestion[] = [
  {
    id: 1,
    category: "DOMAIN ALIGNMENT",
    question: "What excites you most about electronics?",
    options: [
      {
        id: 'A',
        text: "Designing chips and circuits from scratch",
        icon: 'cpu',
        tags: ['VLSI', 'Embedded', 'Analog']
      },
      {
        id: 'B',
        text: "Wireless signals, 5G, and communication systems",
        icon: 'signal',
        tags: ['RF', 'Wireless', 'Signal-Processing']
      },
      {
        id: 'C',
        text: "Software that controls physical hardware",
        icon: 'microcontroller',
        tags: ['Embedded', 'IoT', 'Automotive']
      }
    ]
  },
  {
    id: 2,
    category: "WORK METABOLISM",
    question: "How do you prefer to work?",
    options: [
      {
        id: 'A',
        text: "Deep focus on one complex problem for weeks",
        icon: 'focus',
        tags: ['VLSI', 'Research', 'Signal-Processing']
      },
      {
        id: 'B',
        text: "Build fast, iterate, ship something tangible",
        icon: 'ship',
        tags: ['Embedded', 'IoT', 'Automotive']
      },
      {
        id: 'C',
        text: "Analyze systems, find patterns, optimize",
        icon: 'analyze',
        tags: ['RF', 'Wireless', 'Power-Electronics', 'Control-Systems']
      }
    ]
  },
  {
    id: 3,
    category: "TRAJECTORY TARGET",
    question: "What's your 5-year vision?",
    options: [
      {
        id: 'A',
        text: "Working at a global chip company (NVIDIA, Qualcomm, Intel)",
        icon: 'global',
        tags: ['VLSI', 'RF', 'Signal-Processing']
      },
      {
        id: 'B',
        text: "Building products at a startup or founding one",
        icon: 'startup',
        tags: ['Embedded', 'IoT', 'Power-Electronics']
      },
      {
        id: 'C',
        text: "Research, PhD, or national mission (ISRO, DRDO, IISc)",
        icon: 'mission',
        tags: ['RF', 'Defense-Aerospace', 'Signal-Processing', 'Research']
      }
    ]
  },
  {
    id: 4,
    category: "RISK CALIBRATION",
    question: "Your ideal career is...",
    options: [
      {
        id: 'A',
        text: "High salary, competitive, constantly learning",
        icon: 'high-salary',
        tags: ['VLSI', 'RF', 'Wireless']
      },
      {
        id: 'B',
        text: "Stable, meaningful work, good work-life balance",
        icon: 'stability',
        tags: ['Power-Electronics', 'Control-Systems', 'Medical']
      },
      {
        id: 'C',
        text: "Cutting-edge research, willing to take the long path",
        icon: 'research',
        tags: ['Photonics', 'Semiconductor-Mfg', 'Defense-Aerospace']
      }
    ]
  },
  {
    id: 5,
    category: "INDIA PRIORITY",
    question: "India's semiconductor push - where do you want to be?",
    options: [
      {
        id: 'A',
        text: "Inside a fab or design house when India's first chip ships",
        icon: 'fab',
        tags: ['VLSI', 'Semiconductor-Mfg']
      },
      {
        id: 'B',
        text: "Building India's 5G and defense electronics ecosystem",
        icon: '5g',
        tags: ['RF', 'Wireless', 'Defense-Aerospace']
      },
      {
        id: 'C',
        text: "Creating the next generation of Indian hardware products",
        icon: 'products',
        tags: ['Embedded', 'IoT', 'Automotive']
      }
    ]
  }
];
