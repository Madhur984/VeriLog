// src/utils/compassEngine.ts

interface CompassScore {
  [domainId: string]: number;
}

const DOMAIN_TAGS: Record<string, string[]> = {
  'vlsi':           ['VLSI', 'Chip Design', 'RTL', 'Digital Design'],
  'embedded':       ['Embedded', 'Firmware', 'RTOS', 'Microcontroller'],
  'wireless':       ['Wireless', '5G', 'Modem', 'Communication'],
  'signal-proc':    ['Signal Processing', 'DSP', 'AI Chips'],
  'rf-microwave':   ['RF', 'Antenna', 'mmWave', 'Microwave'],
  'power-elec':     ['Power Electronics', 'EV', 'SiC', 'GaN'],
  'control-sys':    ['Control Systems', 'Robotics', 'Autopilot'],
  'iot':            ['IoT', 'Sensors', 'Edge Computing'],
  'automotive':     ['Automotive', 'ADAS', 'CAN'],
  'medical-elec':   ['Medical Electronics', 'Biomedical'],
  'photonics':      ['Photonics', 'Li-Fi', 'Fiber Optics'],
  'semi-mfg':       ['Semiconductor Manufacturing', 'Process', 'Fab'],
  'defense-aero':   ['Defense', 'ISRO', 'Radar', 'Aerospace'],
};

export const SILICON_ARCHETYPES: Record<string, { name: string; description: string; icon: string }> = {
  'vlsi': {
    name: 'THE ARCHITECT',
    description: 'Systems thinker. Designs the future from first principles.',
    icon: 'Layout'
  },
  'embedded': {
    name: 'THE INTEGRATOR',
    description: 'Hardware-Software whisperer. Brings machines to life.',
    icon: 'Cpu'
  },
  'wireless': {
    name: 'THE SIGNAL MASTER',
    description: 'Master of the invisible. Connecting the world through waves.',
    icon: 'Radio'
  },
  // ... can add more archetypes for other domains
};

export const computeCompassResult = (
  answers: Record<number, string[]>
): { primary: string; secondary: string; tertiary: string } => {
  const scores: CompassScore = {};
  
  // Initialize all domains to 0
  Object.keys(DOMAIN_TAGS).forEach(d => scores[d] = 0);
  
  // For each answer's boost tags, find matching domains and increment
  Object.values(answers).forEach(boostTags => {
    boostTags.forEach(tag => {
      Object.entries(DOMAIN_TAGS).forEach(([domainId, domainTags]) => {
        if (domainTags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) {
          scores[domainId] = (scores[domainId] || 0) + 1;
        }
      });
    });
  });
  
  // Sort by score and return top 3
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);
  
  return {
    primary: sorted[0] || 'vlsi',
    secondary: sorted[1] || 'embedded',
    tertiary: sorted[2] || 'wireless',
  };
};
