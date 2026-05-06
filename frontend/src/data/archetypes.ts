
export interface SiliconArchetype {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  triggerPath: string[];
  famous: string;
  strength: string;
  blindspot: string;
  companies: string[];
  linkedinLine: string;
}

export const SILICON_ARCHETYPES: SiliconArchetype[] = [
  {
    id: 'the-architect',
    name: 'THE ARCHITECT',
    subtitle: 'Systems thinker. Designs the future from first principles.',
    icon: '⬡',
    color: '#22D3EE',
    triggerPath: ['hardware', 'vlsi', 'industry'],
    famous: 'Jim Keller (AMD, Tesla, Intel)',
    strength: 'Big picture design + optimization',
    blindspot: 'Can overthink simple problems',
    companies: ['Intel', 'NVIDIA', 'Apple Silicon'],
    linkedinLine: 'Silicon Architect | RTL Design | Computer Architecture',
  },
  {
    id: 'the-signal-hunter',
    name: 'THE SIGNAL HUNTER',
    subtitle: 'Finds patterns in noise. Thrives where complexity meets physics.',
    icon: '∿',
    color: '#F59E0B',
    triggerPath: ['signals', 'wireless', 'research'],
    famous: 'Claude Shannon (information theory)',
    strength: 'DSP + RF + communication systems',
    blindspot: 'May prefer math over production deadlines',
    companies: ['Qualcomm', 'Ericsson', 'ISRO'],
    linkedinLine: '5G/Signal Engineer | DSP | RF Systems',
  },
  {
    id: 'the-builder',
    name: 'THE BUILDER',
    subtitle: 'Gets things done. Makes hardware breathe.',
    icon: '⚙',
    color: '#10B981',
    triggerPath: ['embedded', 'startup', 'industry'],
    famous: 'Elon Musk (builds things fast)',
    strength: 'Embedded systems + rapid prototyping',
    blindspot: 'Can sacrifice elegance for speed',
    companies: ['Tesla', 'startups', 'Texas Instruments'],
    linkedinLine: 'Embedded Systems Engineer | RTOS | IoT',
  },
  {
    id: 'the-quantum-mind',
    name: 'THE QUANTUM MIND',
    subtitle: 'Thinks beyond silicon. Builds what doesn\'t exist yet.',
    icon: 'Ψ',
    color: '#A78BFA',
    triggerPath: ['research', 'phd', 'frontier'],
    famous: 'John Preskill (quantum computing)',
    strength: 'Research + innovation + long-term thinking',
    blindspot: 'Impatient with immediate ROI demands',
    companies: ['IISc', 'IBM Research', 'Google Quantum AI'],
    linkedinLine: 'Research Engineer | Quantum/Neuromorphic | PhD',
  },
];
