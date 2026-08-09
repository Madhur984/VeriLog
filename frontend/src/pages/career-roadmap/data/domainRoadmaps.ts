/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BitForBytes — ECE & Semiconductor Domain Playbooks & Resource Registry
 * ═══════════════════════════════════════════════════════════════════════════
 * Complete 6-domain semester-wise roadmap data, curated free resources, 
 * live job portal deep links, and internal lab routing matrix.
 */

export interface ResourceLink {
  title: string;
  url: string;
  type: 'course' | 'tool' | 'book' | 'repo' | 'lab';
  isInternal?: boolean;
}

export interface RoadmapStepData {
  step: number;
  semester: string;
  title: string;
  description: string;
  skills: string[];
  resources: ResourceLink[];
  internalLab?: {
    name: string;
    route: string;
    badge: string;
  };
}

export interface DomainPlaybook {
  id: string;
  title: string;
  tagline: string;
  fresherSalaryIndia: string;
  seniorSalaryIndia: string;
  fresherSalaryGlobal: string;
  outlook: 'red-hot' | 'hot' | 'steady';
  topEmployers: string[];
  steps: RoadmapStepData[];
}

export interface JobPortalLink {
  id: string;
  name: string;
  logoText: string;
  color: string;
  searchUrl: string;
  category: 'VLSI' | 'Embedded' | 'Software' | 'AI/ML' | 'General';
  description: string;
}

export interface AwesomeRepo {
  name: string;
  repoUrl: string;
  description: string;
  domain: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * 1. JOB PORTALS MATRIX — DIRECT LINKEDIN, NAUKRI & TOP JOB PLATFORMS
 * ──────────────────────────────────────────────────────────────────────── */

export const JOB_PORTALS: JobPortalLink[] = [
  {
    id: 'naukri-vlsi',
    name: 'Naukri.com VLSI Portal',
    logoText: 'NK',
    color: '#0066FF',
    searchUrl: 'https://www.naukri.com/vlsi-design-engineer-jobs',
    category: 'VLSI',
    description: 'India\'s #1 portal for RTL design, physical design, and verification openings.'
  },
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Semiconductor Jobs',
    logoText: 'IN',
    color: '#0A66C2',
    searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=VLSI%20Design%20Engineer',
    category: 'VLSI',
    description: 'Direct corporate recruiter posts for NVIDIA, Intel, Qualcomm, AMD, and Synopsys.'
  },
  {
    id: 'indeed-india',
    name: 'Indeed Electronics Jobs',
    logoText: 'ID',
    color: '#2164F3',
    searchUrl: 'https://in.indeed.com/q-VLSI-Engineer-jobs.html',
    category: 'General',
    description: 'Aggregated openings across Tier-1 MNCs and hardware startups in India.'
  },
  {
    id: 'naukri-embedded',
    name: 'Naukri Embedded Systems',
    logoText: 'NK',
    color: '#0052CC',
    searchUrl: 'https://www.naukri.com/embedded-engineer-jobs',
    category: 'Embedded',
    description: 'Firmware, RTOS, automotive CAN/AUTOSAR, and STM32 developer roles.'
  },
  {
    id: 'foundit-india',
    name: 'Foundit (Monster India)',
    logoText: 'FD',
    color: '#6C5CE7',
    searchUrl: 'https://www.foundit.in/srp/results?query=VLSI',
    category: 'VLSI',
    description: 'Verified hardware engineering listings across Bengaluru, Hyderabad, and Pune.'
  },
  {
    id: 'glassdoor-salaries',
    name: 'Glassdoor Hardware Jobs',
    logoText: 'GD',
    color: '#00A650',
    searchUrl: 'https://www.glassdoor.co.in/Job/india-vlsi-jobs-SRCH_IL.0,5_IN115_KO6,10.htm',
    category: 'General',
    description: 'Explore active job openings paired with anonymous salary verification data.'
  },
  {
    id: 'instahyre-hardware',
    name: 'Instahyre Tech Jobs',
    logoText: 'IH',
    color: '#FF4757',
    searchUrl: 'https://www.instahyre.com/jobs/?q=Embedded',
    category: 'Embedded',
    description: 'Direct AI-matched applications to top semiconductor startups and product MNCs.'
  },
  {
    id: 'unstop-semicon',
    name: 'Unstop (Dare2Compete) Jobs',
    logoText: 'US',
    color: '#FF6B6B',
    searchUrl: 'https://unstop.com/jobs?searchTerm=Semiconductor',
    category: 'General',
    description: 'Campus hiring drives, hackathons, and fresher semiconductor hiring challenges.'
  }
];

/* ────────────────────────────────────────────────────────────────────────
 * 2. CURATED GITHUB AWESOME REPOSITORIES
 * ──────────────────────────────────────────────────────────────────────── */

export const GITHUB_AWESOME_REPOS: AwesomeRepo[] = [
  {
    name: 'awesome-vlsi',
    repoUrl: 'https://github.com/nicer00ster/awesome-vlsi',
    description: 'Curated list of RTL tools, books, open-source EDA projects, and ASIC/FPGA tutorials.',
    domain: 'VLSI'
  },
  {
    name: 'awesome-embedded',
    repoUrl: 'https://github.com/nhivp/Awesome-Embedded',
    description: 'Resources for embedded C/C++, ARM Cortex-M, FreeRTOS, Linux kernel drivers, and microcontrollers.',
    domain: 'Embedded'
  },
  {
    name: 'awesome-iot',
    repoUrl: 'https://github.com/HQarroum/awesome-iot',
    description: 'Comprehensive list of IoT frameworks, MQTT brokers, hardware platforms, and cloud connectors.',
    domain: 'Embedded'
  },
  {
    name: 'awesome-sdr',
    repoUrl: 'https://github.com/gnuradio/awesome-sdr',
    description: 'Software Defined Radio projects, GNU Radio modules, RF algorithms, and DSP tutorials.',
    domain: 'Communications'
  },
  {
    name: 'awesome-deep-learning',
    repoUrl: 'https://github.com/ChristosChristofidis/awesome-deep-learning',
    description: 'Curated deep learning tutorials, papers, computer vision, and PyTorch/TensorFlow guides.',
    domain: 'AI/ML'
  },
  {
    name: 'system-design-primer',
    repoUrl: 'https://github.com/donnemartin/system-design-primer',
    description: 'Learn how to design large-scale systems, scalability patterns, microservices, and databases.',
    domain: 'Software'
  },
  {
    name: 'coding-interview-university',
    repoUrl: 'https://github.com/jwasham/coding-interview-university',
    description: 'Complete multi-month study plan to become a software engineer at top tech companies.',
    domain: 'Software'
  }
];

/* ────────────────────────────────────────────────────────────────────────
 * 3. 6-DOMAIN SEMESTER PLAYBOOKS (SEM 1 TO SEM 8)
 * ──────────────────────────────────────────────────────────────────────── */

export const DOMAIN_PLAYBOOKS: Record<string, DomainPlaybook> = {
  vlsi: {
    id: 'vlsi',
    title: 'VLSI & Chip Design Roadmap',
    tagline: 'From Boolean Logic to Tape-out-Ready RTL & Silicon Synthesis',
    fresherSalaryIndia: '₹8 - 18 LPA',
    seniorSalaryIndia: '₹30 - 60+ LPA',
    fresherSalaryGlobal: '$120,000 - $180,000 / yr',
    outlook: 'red-hot',
    topEmployers: ['NVIDIA', 'Intel', 'Qualcomm', 'AMD', 'Synopsys', 'Cadence', 'Apple', 'Micron'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'Digital Logic & Boolean Algebra',
        description: 'Master number systems, K-map minimization, logic gates, combinational logic (adders, MUXes), and sequential logic (flip-flops, counters, FSMs).',
        skills: ['Digital Electronics', 'K-Map Minimization', 'FSM State Diagrams', 'Boolean Reduction'],
        resources: [
          { title: 'NPTEL: Digital Circuits (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105132', type: 'course' },
          { title: 'BitForBytes K-Map Lab', url: '/kmap-lab', type: 'lab', isInternal: true },
          { title: 'BitForBytes Logic Studio', url: '/logic-studio', type: 'lab', isInternal: true },
        ],
        internalLab: { name: 'K-Map Minimizer & Logic Studio', route: '/kmap-lab', badge: 'Interactive Tool' }
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Introduction to Verilog & HDL Simulation',
        description: 'Learn Verilog HDL syntax, behavioral & dataflow modeling, non-blocking assignments, testbenches, and wave viewing in EDA simulators.',
        skills: ['Verilog HDL', 'RTL Modeling', 'Testbench Design', 'Waveform Debugging'],
        resources: [
          { title: 'NPTEL: Hardware Modeling using Verilog', url: 'https://nptel.ac.in/courses/108105158', type: 'course' },
          { title: 'EDA Playground Simulator', url: 'https://www.edaplayground.com/', type: 'tool' },
          { title: 'BitForBytes Verilog Playground', url: '/verilog-playground', type: 'lab', isInternal: true },
        ],
        internalLab: { name: 'Verilog Browser Playground', route: '/verilog-playground', badge: 'Live IDE' }
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'FPGA Prototyping & Vivado Flow',
        description: 'Implement RTL modules on real FPGA hardware (Basys 3 / Nexys A7). Understand synthesis, pin constraints (XDC), bitstream generation, and timing budgets.',
        skills: ['FPGA Prototyping', 'Xilinx Vivado', 'RTL Synthesis', 'Timing Constraints'],
        resources: [
          { title: 'Xilinx Vivado WebPack (Free)', url: 'https://www.xilinx.com/products/design-tools/vivado.html', type: 'tool' },
          { title: 'Book: FPGA Prototyping by Verilog (Pong Chu)', url: 'https://www.wiley.com/', type: 'book' },
          { title: 'Awesome-VLSI GitHub Repo', url: 'https://github.com/nicer00ster/awesome-vlsi', type: 'repo' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: 'Computer Architecture & RISC-V Core',
        description: 'Understand pipelining, hazard detection, cache memory hierarchies, and instruction set architecture (ISA). Build a 5-stage pipelined RISC-V core in Verilog.',
        skills: ['Computer Architecture', 'RISC-V ISA', 'Pipelining & Hazards', 'Cache Hierarchy'],
        resources: [
          { title: 'NPTEL: Computer Architecture (IIT Delhi)', url: 'https://nptel.ac.in/courses/106102157', type: 'course' },
          { title: 'Harris & Harris: RISC-V Edition', url: 'https://www.elsevier.com/', type: 'book' },
          { title: 'BitForBytes RISC-V Workbench', url: '/workbench', type: 'lab', isInternal: true },
        ],
        internalLab: { name: 'RISC-V Architecture Workbench', route: '/workbench', badge: 'CPU Simulator' }
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'ASIC Design Flow & SystemVerilog UVM',
        description: 'Study static timing analysis (STA), clock tree synthesis (CTS), formal verification, and SystemVerilog UVM methodology for high-coverage testbenches.',
        skills: ['SystemVerilog UVM', 'Static Timing Analysis (STA)', 'Constrained Randomization', 'SVA Assertions'],
        resources: [
          { title: 'NPTEL: VLSI Design Flow RTL to GDS', url: 'https://nptel.ac.in/courses/108103162', type: 'course' },
          { title: 'ASIC World Tutorials', url: 'http://www.asic-world.com/', type: 'course' },
          { title: 'Verification Academy (Siemens)', url: 'https://verificationacademy.com/', type: 'course' },
        ],
        internalLab: { name: 'VLSI Interview Prep Engine', route: '/interview-prep', badge: 'Company Questions' }
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'Analog & Mixed-Signal (AMS) Design',
        description: 'Op-amps, bandgap references, data converters (ADC/DAC), and PLL basics. Practice transient and AC sweep simulation in SPICE / Cadence Virtuoso.',
        skills: ['Analog Circuit Design', 'SPICE Simulation', 'Op-Amps & ADC/DAC', 'Layout DRC/LVS'],
        resources: [
          { title: 'NPTEL: Analog IC Design (IIT Madras)', url: 'https://nptel.ac.in/courses/108106105', type: 'course' },
          { title: 'Analog Devices LTspice Simulator', url: 'https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html', type: 'tool' },
          { title: 'Razavi Electronics Video Lectures', url: 'https://www.youtube.com/', type: 'course' },
        ],
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'Open MPW Tape-out & Industry Placement',
        description: 'Participate in Google / Efabless Open MPW shuttles using OpenLane & SkyWater 130nm PDK. Build a full SoC capstone and target Tier-1 VLSI recruiters.',
        skills: ['OpenLane GDSII Flow', 'SkyWater 130nm PDK', 'Tape-out Verification', 'Resume & Interview Prep'],
        resources: [
          { title: 'Efabless Open Shuttle Program', url: 'https://efabless.com/open_shuttle_program', type: 'tool' },
          { title: 'Naukri VLSI Design Engineer Jobs', url: 'https://www.naukri.com/vlsi-design-engineer-jobs', type: 'tool' },
          { title: 'LinkedIn Semiconductor Careers', url: 'https://www.linkedin.com/jobs/search/?keywords=VLSI%20Design%20Engineer', type: 'tool' },
        ],
        internalLab: { name: 'BitForBytes Silicon Resume Compiler', route: '/career-roadmap', badge: 'ATS Resume' }
      }
    ]
  },
  embedded: {
    id: 'embedded',
    title: 'Embedded Systems & IoT Roadmap',
    tagline: 'Master Firmware, Microcontrollers, FreeRTOS, Embedded Linux & IoT Cloud',
    fresherSalaryIndia: '₹6 - 12 LPA',
    seniorSalaryIndia: '₹20 - 35+ LPA',
    fresherSalaryGlobal: '$90,000 - $140,000 / yr',
    outlook: 'hot',
    topEmployers: ['Bosch', 'Texas Instruments', 'Qualcomm', 'Honeywell', 'STMicroelectronics', 'Mercedes-Benz R&D'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'C Programming & Hardware Basics',
        description: 'Write robust C code with direct pointer manipulation, bitwise operations, memory mapping, and basic sensor interfacing on Arduino / ESP8266.',
        skills: ['Embedded C', 'Pointers & Bitwise Ops', 'GPIO Interfacing', 'Circuit Schematics'],
        resources: [
          { title: 'freeCodeCamp C Programming Handbook', url: 'https://www.freecodecamp.org/news/the-c-beginners-handbook/', type: 'course' },
          { title: 'Arduino Project Hub', url: 'https://create.arduino.cc/projecthub', type: 'tool' },
        ],
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Microcontroller Architecture & STM32',
        description: 'Explore ARM Cortex-M architecture. Program low-level peripherals: GPIO, Timers, Interrupts (NVIC), UART, SPI, and I2C protocols bare-metal.',
        skills: ['ARM Cortex-M', 'STM32CubeIDE', 'Bare-Metal C', 'I2C / SPI / UART'],
        resources: [
          { title: 'STMicroelectronics Official STM32 MOOC', url: 'https://www.st.com/content/st_com/en/support/learning/stm32-education/stm32-moocs.html', type: 'course' },
          { title: 'Mastering STM32 by Carmine Noviello', url: 'https://www.carminenoviello.com/', type: 'book' },
        ],
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'Real-Time Operating Systems (FreeRTOS)',
        description: 'Understand multitasking, rate-monotonic scheduling, semaphores, mutexes, message queues, and memory management using FreeRTOS on STM32 / ESP32.',
        skills: ['FreeRTOS', 'Task Scheduling', 'Mutex & Semaphores', 'CMSIS-RTOS'],
        resources: [
          { title: 'FreeRTOS Official Documentation', url: 'https://www.freertos.org/Documentation/', type: 'tool' },
          { title: 'NPTEL: Real Time Systems (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105057', type: 'course' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: 'Embedded Linux & Kernel Driver Development',
        description: 'Bootloader (U-Boot), Linux kernel configuration, Yocto / Buildroot rootfs build, and custom device drivers on Raspberry Pi / BeagleBone.',
        skills: ['Linux Kernel Drivers', 'Yocto Project', 'U-Boot', 'Device Tree (DTS)'],
        resources: [
          { title: 'Bootlin Embedded Linux Training (Free Slides)', url: 'https://bootlin.com/docs/', type: 'course' },
          { title: 'Linux Device Drivers 3rd Ed. (LDD3)', url: 'https://lwn.net/Kernel/LDD3/', type: 'book' },
        ],
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'IoT Connectivity Protocols & Cloud Integration',
        description: 'Implement MQTT, CoAP, BLE, Wi-Fi, and LoRaWAN networking stacks. Connect embedded hardware to AWS IoT Core and Azure IoT Hub.',
        skills: ['MQTT / CoAP', 'AWS IoT Core', 'ESP32 Wi-Fi/BLE', 'Node-RED Dashboard'],
        resources: [
          { title: 'AWS IoT Developer Documentation', url: 'https://docs.aws.amazon.com/iot/', type: 'tool' },
          { title: 'MathWorks ThingSpeak IoT Platform', url: 'https://thingspeak.com/', type: 'tool' },
          { title: 'Awesome-Embedded GitHub Repo', url: 'https://github.com/nhivp/Awesome-Embedded', type: 'repo' },
        ],
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'Automotive Electronics & CAN/AUTOSAR',
        description: 'Master CAN bus, LIN bus, AUTOSAR layered architecture, MISRA-C compliance, and ISO 26262 functional safety standards.',
        skills: ['CAN Bus Protocol', 'AUTOSAR Stack', 'MISRA-C Rules', 'ISO 26262 Safety'],
        resources: [
          { title: 'NPTEL: Automotive Electronics (IIT Madras)', url: 'https://nptel.ac.in/courses/108106128', type: 'course' },
          { title: 'Vector CANoe Academic Suite', url: 'https://www.vector.com/', type: 'tool' },
        ],
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'PCB Design & Hardware Capstone',
        description: 'Design custom 2-4 layer PCBs in KiCad, source components, assemble SMD hardware, validate signal integrity, and complete an end-to-end product.',
        skills: ['KiCad PCB Layout', 'Schematic Capture', 'SMD Soldering', 'Hardware Debugging'],
        resources: [
          { title: 'KiCad EDA Official Site', url: 'https://www.kicad.org/', type: 'tool' },
          { title: 'Hackaday Hardware Community', url: 'https://hackaday.io/', type: 'tool' },
          { title: 'Naukri Embedded Engineer Jobs', url: 'https://www.naukri.com/embedded-engineer-jobs', type: 'tool' },
        ],
      }
    ]
  },
  software: {
    id: 'software',
    title: 'Software Engineering (ECE Pivot)',
    tagline: 'High-Scale Systems, Advanced Algorithms, Full-Stack & Cloud Architecture',
    fresherSalaryIndia: '₹8 - 20+ LPA',
    seniorSalaryIndia: '₹30 - 70+ LPA',
    fresherSalaryGlobal: '$130,000 - $200,000 / yr',
    outlook: 'red-hot',
    topEmployers: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Goldman Sachs', 'Uber', 'Atlassian'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'Intro to Programming & Object-Oriented Design',
        description: 'Master Python/Java fundamentals: variables, control loops, functions, OOP principles (inheritance, encapsulation, polymorphism), and clean code.',
        skills: ['Python / Java', 'OOP Principles', 'Git & GitHub', 'Clean Code'],
        resources: [
          { title: 'CS50x: Intro to Computer Science (Harvard)', url: 'https://cs50.harvard.edu/x/', type: 'course' },
          { title: 'Automate the Boring Stuff with Python', url: 'https://automatetheboringstuff.com/', type: 'book' },
        ],
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Data Structures & Algorithms (DSA)',
        description: 'Arrays, linked lists, stacks, queues, binary trees, graphs, sorting, dynamic programming, and time/space complexity analysis.',
        skills: ['Data Structures', 'Algorithms', 'Time Complexity (Big-O)', 'LeetCode Practice'],
        resources: [
          { title: 'MIT 6.006 Intro to Algorithms (OCW)', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', type: 'course' },
          { title: 'LeetCode Problem Explorer', url: 'https://leetcode.com/explore/', type: 'tool' },
        ],
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'Modern Web Development (Frontend Focus)',
        description: 'HTML5, CSS3, JavaScript (ES6+), React.js, TypeScript, and modern responsive UI design principles with RESTful API integration.',
        skills: ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS'],
        resources: [
          { title: 'The Odin Project Full-Stack Course', url: 'https://www.theodinproject.com/', type: 'course' },
          { title: 'freeCodeCamp Web Certification', url: 'https://www.freecodecamp.org/', type: 'course' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: 'Backend Systems & Database Architecture',
        description: 'Build backend microservices in Node.js / Express or Python Django. Work with relational databases (PostgreSQL) and NoSQL stores (MongoDB).',
        skills: ['Node.js / Express', 'PostgreSQL / SQL', 'REST APIs & GraphQL', 'Database Indexing'],
        resources: [
          { title: 'Full Stack Open (Univ of Helsinki)', url: 'https://fullstackopen.com/en/', type: 'course' },
          { title: 'SQLBolt Interactive SQL Tutorials', url: 'https://sqlbolt.com/', type: 'tool' },
        ],
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'System Design, Cloud & Containerization',
        description: 'Master high-scalability concepts: load balancing, caching (Redis), microservices, Docker containers, Kubernetes, and AWS deployment.',
        skills: ['System Design', 'Docker & Kubernetes', 'AWS / Cloud', 'Caching & Message Queues'],
        resources: [
          { title: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer', type: 'repo' },
          { title: 'AWS Free Tier Hands-on Tutorials', url: 'https://aws.amazon.com/free/', type: 'tool' },
        ],
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'Competitive Programming & Open Source (GSoC)',
        description: 'Solve 300+ medium/hard LeetCode challenges. Contribute to global open-source repositories through Google Summer of Code (GSoC).',
        skills: ['Competitive Programming', 'C++ STL', 'Open Source', 'System Security'],
        resources: [
          { title: 'Google Summer of Code Official', url: 'https://summerofcode.withgoogle.com/', type: 'tool' },
          { title: 'Coding Interview University Repo', url: 'https://github.com/jwasham/coding-interview-university', type: 'repo' },
        ],
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'Mock Interviews & Tech Placement Prep',
        description: 'Conduct peer-to-peer technical mock interviews, polish your GitHub portfolio, and ace coding + system design interview rounds.',
        skills: ['Mock Interviews', 'System Design Interview', 'Behavioral STAR Method', 'Resume Optimization'],
        resources: [
          { title: 'Pramp Free Peer Mock Interviews', url: 'https://www.pramp.com/', type: 'tool' },
          { title: 'GeeksforGeeks Interview Corner', url: 'https://www.geeksforgeeks.org/', type: 'tool' },
        ],
      }
    ]
  },
  aiml: {
    id: 'aiml',
    title: 'AI & Machine Learning (ECE + Math Advantage)',
    tagline: 'Linear Algebra, Deep Neural Networks, PyTorch & Edge AI Deployments',
    fresherSalaryIndia: '₹10 - 18 LPA',
    seniorSalaryIndia: '₹30 - 70+ LPA',
    fresherSalaryGlobal: '$140,000 - $220,000 / yr',
    outlook: 'red-hot',
    topEmployers: ['NVIDIA', 'Google AI', 'OpenAI', 'Meta AI', 'Microsoft', 'Tesla AI', 'Jio Brain'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'Math Foundations for Machine Learning',
        description: 'Linear algebra (matrix decompositions, eigenvalues), multivariate calculus, probability theory, statistics, and NumPy computation.',
        skills: ['Linear Algebra', 'Multivariate Calculus', 'Probability & Stats', 'NumPy & SciPy'],
        resources: [
          { title: '3Blue1Brown Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'course' },
          { title: 'Coursera Math for Machine Learning', url: 'https://www.coursera.org/', type: 'course' },
        ],
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Classical Machine Learning Algorithms',
        description: 'Supervised & unsupervised learning: linear/logistic regression, decision trees, random forests, SVMs, clustering, and Scikit-learn.',
        skills: ['Scikit-Learn', 'Feature Engineering', 'Supervised Learning', 'Model Evaluation'],
        resources: [
          { title: 'Andrew Ng Machine Learning (Stanford)', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
          { title: 'Kaggle Micro-Courses', url: 'https://www.kaggle.com/learn', type: 'tool' },
        ],
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'Deep Learning & PyTorch Architectures',
        description: 'Convolutional Neural Networks (CNNs), Recurrent Networks (RNNs), LSTMs, backpropagation math, and PyTorch model training on Google Colab GPUs.',
        skills: ['PyTorch', 'CNNs & Vision Models', 'GPU Acceleration (CUDA)', 'Deep Neural Nets'],
        resources: [
          { title: 'fast.ai Practical Deep Learning', url: 'https://www.fast.ai/', type: 'course' },
          { title: 'Awesome Deep Learning GitHub Repo', url: 'https://github.com/ChristosChristofidis/awesome-deep-learning', type: 'repo' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: 'Computer Vision & Natural Language Processing',
        description: 'Object detection (YOLO, ResNet), OpenCV pipelines, Transformer models (BERT, GPT), Hugging Face Diffusers, and fine-tuning LLMs.',
        skills: ['OpenCV', 'Hugging Face Transformers', 'YOLO Object Detection', 'LLM Fine-Tuning'],
        resources: [
          { title: 'Stanford CS231n Computer Vision', url: 'https://cs231n.github.io/', type: 'course' },
          { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'course' },
        ],
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'MLOps & Model Deployment Pipelines',
        description: 'Containerize ML models with Docker, serve REST inference APIs via FastAPI, track experiments with MLflow, and deploy on AWS SageMaker.',
        skills: ['MLOps', 'FastAPI & Docker', 'MLflow / Weights&Biases', 'TFLite & Edge AI'],
        resources: [
          { title: 'MLOps Zoomcamp (DataTalks.Club)', url: 'https://github.com/DataTalksClub/mlops-zoomcamp', type: 'repo' },
          { title: 'TFLite Edge AI Guide', url: 'https://www.tensorflow.org/lite', type: 'tool' },
        ],
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'AI Research & Hardware Accelerator Optimization',
        description: 'Optimize neural networks for hardware using ONNX, TensorRT, and TVM compiler stack. Implement Quantization (INT8) and Pruning.',
        skills: ['TensorRT', 'ONNX Runtime', 'Model Quantization', 'CUDA Scripting'],
        resources: [
          { title: 'NVIDIA Deep Learning Institute', url: 'https://www.nvidia.com/en-us/training/', type: 'course' },
          { title: 'BitForBytes AI Lab', url: '/ai-lab', type: 'lab', isInternal: true },
        ],
        internalLab: { name: 'BitForBytes Edge AI Lab', route: '/ai-lab', badge: 'AI Playground' }
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'Generative AI Capstone & ML Hiring Rounds',
        description: 'Build a custom RAG (Retrieval-Augmented Generation) system or AI chip benchmark project. Prepare for ML Engineer & AI Scientist coding rounds.',
        skills: ['Generative AI', 'RAG Pipelines', 'ML System Design', 'Interview Prep'],
        resources: [
          { title: 'Attention Is All You Need (Paper)', url: 'https://arxiv.org/abs/1706.03762', type: 'book' },
          { title: 'Grokking the Machine Learning Interview', url: 'https://www.educative.io/', type: 'book' },
        ],
      }
    ]
  },
  comms: {
    id: 'comms',
    title: 'Wireless Communications & 5G/6G Roadmap',
    tagline: 'Signals, RF Engineering, SDR Transceivers & 3GPP 5G NR Physical Layer',
    fresherSalaryIndia: '₹8 - 15 LPA',
    seniorSalaryIndia: '₹22 - 35+ LPA',
    fresherSalaryGlobal: '$100,000 - $160,000 / yr',
    outlook: 'hot',
    topEmployers: ['Qualcomm', 'Ericsson', 'Nokia', 'Samsung', 'Jio', 'ISRO', 'Keysight'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'Signals & Systems Foundations',
        description: 'Fourier series, Continuous & Discrete Fourier Transform (DFT/FFT), Laplace transform, z-transform, convolution, and MATLAB simulation.',
        skills: ['Signals & Systems', 'Fourier Analysis', 'MATLAB / Octave', 'Convolution'],
        resources: [
          { title: 'NPTEL: Signals and Systems (IIT Kanpur)', url: 'https://nptel.ac.in/courses/108104100', type: 'course' },
          { title: 'MIT 6.003 Signals and Systems (OCW)', url: 'https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/', type: 'course' },
        ],
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Analog & Digital Communications',
        description: 'AM, FM, PM, QAM, BPSK, QPSK modulation schemes. Noise performance, Shannon channel capacity theorem, and Bit Error Rate (BER) curves.',
        skills: ['Digital Modulation', 'QAM / QPSK', 'BER Calculation', 'GNU Radio'],
        resources: [
          { title: 'NPTEL: Principles of Communication', url: 'https://nptel.ac.in/courses/108104098', type: 'course' },
          { title: 'GNU Radio Wiki & Tutorials', url: 'https://wiki.gnuradio.org/', type: 'tool' },
        ],
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'Wireless & RF Systems (RTL-SDR)',
        description: 'Antenna basics, RF propagation models, link budgets, noise figures, and Software Defined Radio (SDR) using RTL-SDR / HackRF.',
        skills: ['Software Defined Radio', 'RF Link Budget', 'Antenna Basics', 'Spectrum Analysis'],
        resources: [
          { title: 'SDR for Engineers (Analog Devices Free Book)', url: 'https://www.analog.com/', type: 'book' },
          { title: 'Awesome-SDR GitHub Repository', url: 'https://github.com/gnuradio/awesome-sdr', type: 'repo' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: '5G NR & Advanced Wireless Physical Layer',
        description: 'OFDMA modulation, Massive MIMO beamforming, LDPC / Polar coding, and 5G NR physical layer channels (PDSCH, PDCCH).',
        skills: ['5G NR Physical Layer', 'Massive MIMO', 'OFDMA', 'Channel Estimation'],
        resources: [
          { title: 'NPTEL: 5G Wireless Technology (IIT Bombay)', url: 'https://nptel.ac.in/courses/108101136', type: 'course' },
          { title: 'ShareTechnote 5G NR Manual', url: 'https://www.sharetechnote.com/html/5G/Handbook_5G_Index.html', type: 'tool' },
        ],
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'Cellular Systems & 3GPP Standards',
        description: 'Explore 3GPP specifications, 5G Core architecture, network slicing, protocol stacks (RLC, MAC, PDCP), and Wireshark protocol capture.',
        skills: ['3GPP Specs', '5G Core Architecture', 'Protocol Stack (RLC/MAC)', 'Wireshark Analysis'],
        resources: [
          { title: 'srsRAN Open Source 4G/5G Software', url: 'https://www.srslte.com/', type: 'tool' },
          { title: '3GPP Official Specification Portal', url: 'https://www.3gpp.org/', type: 'tool' },
        ],
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'SDR Communication Transceiver Capstone',
        description: 'Implement a working OFDM wireless transceiver on ADALM-PLUTO SDR hardware using C++ / GNU Radio and evaluate real-world multipath fading.',
        skills: ['ADALM-PLUTO SDR', 'C++ DSP Implementation', 'Synchronization', 'Channel Equalization'],
        resources: [
          { title: 'Analog Devices ADALM-PLUTO Workshops', url: 'https://wiki.analog.com/university/tools/pluto', type: 'tool' },
          { title: 'Wireless Comm Ground Up (Qasim Chaudhari)', url: 'https://wirelesspi.com/', type: 'book' },
        ],
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'Telecom Industry Placements & Research',
        description: 'Prepare for technical interviews at Qualcomm, Ericsson, Nokia, and Samsung Wireless R&D. Target RF & 5G PHY software roles.',
        skills: ['5G PHY Interview Prep', 'Fixed-Point C/C++', 'System-Level Verification', 'Placement Practice'],
        resources: [
          { title: 'Telecom Engineering Interview Corner', url: 'https://www.geeksforgeeks.org/', type: 'tool' },
          { title: 'LinkedIn Wireless Jobs Search', url: 'https://www.linkedin.com/jobs/search/?keywords=5G%20Engineer', type: 'tool' },
        ],
      }
    ]
  },
  signal: {
    id: 'signal',
    title: 'Signal & Image Processing Roadmap',
    tagline: 'DSP Algorithms, Digital Filters, OpenCV, Audio Processing & Medical Imaging',
    fresherSalaryIndia: '₹7 - 14 LPA',
    seniorSalaryIndia: '₹20 - 30+ LPA',
    fresherSalaryGlobal: '$95,000 - $150,000 / yr',
    outlook: 'hot',
    topEmployers: ['Analog Devices', 'Texas Instruments', 'Broadcom', 'Dolby', 'Sony', 'GE Healthcare'],
    steps: [
      {
        step: 1,
        semester: 'Sem 1–2',
        title: 'Math & Digital Signal Processing (DSP) Basics',
        description: 'Sampling theorem (Nyquist), quantization noise, Z-transform, DFT, and FFT algorithm implementations in MATLAB and Python SciPy.',
        skills: ['DSP Theory', 'Sampling & Nyquist', 'FFT Algorithm', 'Python SciPy / NumPy'],
        resources: [
          { title: 'NPTEL: Digital Signal Processing (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105055', type: 'course' },
          { title: 'The Scientist & Engineer Guide to DSP (Free Book)', url: 'http://www.dspguide.com/', type: 'book' },
        ],
      },
      {
        step: 2,
        semester: 'Sem 2–3',
        title: 'Digital Filter Design (FIR & IIR)',
        description: 'Design Finite Impulse Response (FIR) and Infinite Impulse Response (IIR) filters using Butterworth, Chebyshev, and Windowing methods in C / Python.',
        skills: ['FIR / IIR Filter Design', 'Windowing Methods', 'Fixed-Point DSP C', 'Frequency Response'],
        resources: [
          { title: 'NPTEL: Digital Signal Processing (IIT Delhi)', url: 'https://nptel.ac.in/courses/108102120', type: 'course' },
          { title: 'SciPy Signal Processing Documentation', url: 'https://docs.scipy.org/doc/scipy/reference/signal.html', type: 'tool' },
        ],
      },
      {
        step: 3,
        semester: 'Sem 3–4',
        title: 'Computer Vision & Digital Image Processing',
        description: 'Image filtering, spatial domain operations, edge detection (Canny, Sobel), morphological operations, and object segmentation using OpenCV.',
        skills: ['OpenCV Python', 'Image Filtering', 'Edge Detection', 'Segmentation'],
        resources: [
          { title: 'NPTEL: Digital Image Processing (IIT Kharagpur)', url: 'https://nptel.ac.in/courses/108105152', type: 'course' },
          { title: 'OpenCV Official Documentation & Tutorials', url: 'https://docs.opencv.org/', type: 'tool' },
        ],
      },
      {
        step: 4,
        semester: 'Sem 4–5',
        title: 'Audio & Speech Signal Processing',
        description: 'Speech recognition features: Mel-Frequency Cepstral Coefficients (MFCC), spectrogram analysis, noise reduction, and Librosa speech tools.',
        skills: ['Librosa Python', 'MFCC Feature Extraction', 'Audio Codecs', 'Spectrogram Analysis'],
        resources: [
          { title: 'NPTEL: Speech Signal Processing (IIT Bombay)', url: 'https://nptel.ac.in/courses/108101004', type: 'course' },
          { title: 'Librosa Audio Processing Library', url: 'https://librosa.org/', type: 'tool' },
        ],
      },
      {
        step: 5,
        semester: 'Sem 5–6',
        title: 'Biomedical Signal Processing (ECG/EEG)',
        description: 'Process Electrocardiogram (ECG) and Electroencephalogram (EEG) signals using PhysioNet open medical data banks and wavelet transforms.',
        skills: ['Biomedical Signal Processing', 'PhysioNet Data Bank', 'Wavelet Transform', 'QRS Detection'],
        resources: [
          { title: 'PhysioNet Open Biomedical Database', url: 'https://physionet.org/', type: 'tool' },
          { title: 'NPTEL: Biomedical Signal Processing', url: 'https://nptel.ac.in/courses/108105093', type: 'course' },
        ],
      },
      {
        step: 6,
        semester: 'Sem 6–7',
        title: 'Deep Learning for Signal & Image Processing',
        description: 'Apply 1D-CNNs to time-series signals and 2D-CNNs / U-Net architectures to medical image segmentation and ultrasound analysis.',
        skills: ['PyTorch 1D/2D CNNs', 'U-Net Segmentation', 'Spectrogram Deep Learning', 'Medical Imaging'],
        resources: [
          { title: 'Coursera Deep Learning for Vision & Audio', url: 'https://www.coursera.org/', type: 'course' },
          { title: 'Kaggle Ultrasound Image Challenges', url: 'https://www.kaggle.com/', type: 'tool' },
        ],
      },
      {
        step: 7,
        semester: 'Sem 7–8',
        title: 'DSP Capstone & Technical Placement Prep',
        description: 'Build an end-to-end processing pipeline (e.g., real-time heart rate monitor or optical character recognition). Target DSP & Imaging companies.',
        skills: ['Real-Time DSP', 'C/C++ DSP Optimization', 'Portfolio Projects', 'Technical Interviews'],
        resources: [
          { title: 'DSPRelated Q&A and Career Articles', url: 'https://www.dsprelated.com/', type: 'tool' },
          { title: 'Naukri DSP & Signal Processing Jobs', url: 'https://www.naukri.com/dsp-engineer-jobs', type: 'tool' },
        ],
      }
    ]
  }
};
