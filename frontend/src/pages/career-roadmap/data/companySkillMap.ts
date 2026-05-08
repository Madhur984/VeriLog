export const companySkillMap: Record<string, string[]> = {
  'Intel': ['digital-foundation', 'k-map-master', 'cmos-fabrication', 'timing-analysis', 'vlsi-architecture'],
  'Qualcomm': ['digital-foundation', 'rf-basics', 'modem-design', 'dsp-architecture', 'cmos-fabrication'],
  'NVIDIA': ['digital-foundation', 'gpu-architecture', 'verilog-hdl', 'timing-analysis', 'system-c'],
  'AMD': ['digital-foundation', 'cpu-architecture', 'verilog-hdl', 'timing-analysis', 'pcie-protocol'],
  'Apple': ['digital-foundation', 'soc-integration', 'low-power-design', 'cmos-fabrication', 'verilog-hdl'],
  'Texas Instruments': ['analog-basics', 'mixed-signal', 'power-electronics', 'cmos-fabrication'],
  'TSMC': ['cmos-fabrication', 'lithography', 'yield-analysis', 'device-physics'],
};

export const companyMetadata: Record<string, { visa: string; wfh: string }> = {
  'Intel': { visa: 'High Potential', wfh: 'Hybrid (3/2)' },
  'Qualcomm': { visa: 'High Potential', wfh: 'Hybrid (3/2)' },
  'NVIDIA': { visa: 'Exceptional', wfh: 'Flexible' },
  'AMD': { visa: 'High Potential', wfh: 'Hybrid (3/2)' },
  'Apple': { visa: 'Exceptional', wfh: 'Office-first (4/1)' },
  'Texas Instruments': { visa: 'Medium', wfh: 'Hybrid (3/2)' },
  'TSMC': { visa: 'High Potential', wfh: 'On-site' },
};
