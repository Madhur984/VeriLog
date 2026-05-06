export interface StoryChoice {
  label: string;
  description: string;
  nextId: string;
}

export interface StoryNode {
  id: string;
  type: 'question' | 'outcome';
  question?: string;
  role?: string;
  company?: string;
  choices?: StoryChoice[];
}

export const storyTree: StoryNode[] = [
  {
    id: 'start',
    type: 'question',
    question: "Choose your primary domain of control.",
    choices: [
      { label: "Hardware & Silicon", description: "Design the physical foundations.", nextId: "silicon-track" },
      { label: "Signals & Wireless", description: "Master the invisible waves.", nextId: "signal-track" },
    ]
  },
  {
    id: 'silicon-track',
    type: 'question',
    question: "Select your preferred abstraction level.",
    choices: [
      { label: "Micro-Architecture", description: "Design CPU/GPU internals.", nextId: "vlsi-path" },
      { label: "System Integration", description: "FPGA & Embedded systems.", nextId: "embedded-path" },
    ]
  },
  {
    id: 'signal-track',
    type: 'question',
    question: "Choose your operational environment.",
    choices: [
      { label: "Deep Space / Defense", description: "High-reliability systems.", nextId: "isro-outcome" },
      { label: "Consumer Mobility", description: "5G & Modem technologies.", nextId: "qualcomm-outcome" },
    ]
  },
  {
    id: 'vlsi-path',
    type: 'question',
    question: "Select your industry trajectory.",
    choices: [
      { label: "Tier-1 IDM", description: "Join Intel/NVIDIA/Apple.", nextId: "nvidia-outcome" },
      { label: "Semiconductor Research", description: "PhD / R&D Frontier.", nextId: "research-outcome" },
    ]
  },
  {
    id: 'nvidia-outcome',
    type: 'outcome',
    role: "VLSI Design Engineer",
    company: "NVIDIA / Apple Silicon",
  },
  {
    id: 'isro-outcome',
    type: 'outcome',
    role: "Scientist / Engineer SC",
    company: "ISRO / DRDO",
  },
  {
    id: 'qualcomm-outcome',
    type: 'outcome',
    role: "Systems Engineer",
    company: "Qualcomm / Ericsson",
  },
  {
    id: 'research-outcome',
    type: 'outcome',
    role: "Research Scientist",
    company: "IISc / IBM Research",
  },
  {
    id: 'embedded-path',
    type: 'outcome',
    role: "Embedded Systems Lead",
    company: "Tesla / Texas Instruments",
  }
];
