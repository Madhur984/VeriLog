
export const COMPANY_SKILL_MAP: Record<string, {
  required: string[]      
  preferred: string[]     
  role: string
  level: 'Fresher' | 'Mid' | 'Senior'
}> = {
  'nvidia': {
    required: ['digital-logic', 'vlsi-design', 'verilog', 'computer-arch', 'rtl-synthesis', 'timing-analysis'],
    preferred: ['cuda-programming', 'signal-processing', 'ml-inference'],
    role: 'VLSI Design Engineer',
    level: 'Mid'
  },
  'qualcomm': {
    required: ['wireless-comm', '5g-nr', 'digital-logic', 'verilog', 'signal-processing', 'rfic-design'],
    preferred: ['antenna-design', 'protocol-stacks', 'dsp'],
    role: 'Systems Engineer - 5G Modem',
    level: 'Fresher'
  },
  'texas-instruments': {
    required: ['analog-design', 'embedded-systems', 'power-electronics', 'c-programming', 'microcontrollers'],
    preferred: ['motor-control', 'industrial-comms', 'spice-simulation'],
    role: 'Systems Engineer - Analog/Embedded',
    level: 'Fresher'
  },
  'isro': {
    required: ['digital-logic', 'rf-microwave', 'signal-processing', 'embedded-systems', 'fpga-design'],
    preferred: ['satellite-comms', 'power-electronics', 'control-systems'],
    role: 'Scientist/Engineer SC',
    level: 'Fresher'
  },
  'intel': {
    required: ['vlsi-design', 'verilog', 'computer-arch', 'physical-design', 'timing-closure', 'sta'],
    preferred: ['chiplet-design', 'packaging', 'power-integrity'],
    role: 'CPU Design Engineer',
    level: 'Mid'
  },
  'samsung-semi': {
    required: ['vlsi-design', 'dram-design', 'process-tech', 'verilog'],
    preferred: ['5g-modem', 'ai-accelerator', 'packaging'],
    role: 'Design Engineer - Memory/5G',
    level: 'Fresher'
  },
  'iisc-research': {
    required: ['digital-logic', 'signal-processing', 'mathematics', 'python-ml', 'research-methods'],
    preferred: ['quantum-computing', 'neuromorphic', 'photonics'],
    role: 'PhD Scholar / Research Scientist',
    level: 'Fresher'
  }
};
