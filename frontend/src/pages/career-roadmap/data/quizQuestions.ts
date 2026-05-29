export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  domain: string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // VLSI / Digital Design
  { q: "Who holds the process patent for MOSFET?", options: ["Bell Labs", "Fairchild", "Intel", "AT&T"], correct: 0, domain: "VLSI", explanation: "The MOSFET was invented at Bell Labs by Mohamed Atalla and Dawon Kahng in 1959." },
  { q: "What does GDSII stand for?", options: ["Graphic Design System II", "Gate Design Standard II", "Global Die Specification II", "Grid Data Structure II"], correct: 0, domain: "VLSI", explanation: "GDSII (Graphic Design System II) is the standard file format for IC layout data." },
  { q: "In CMOS, a NOR gate has PMOS transistors in:", options: ["Series", "Parallel", "Both", "None"], correct: 0, domain: "VLSI", explanation: "In CMOS NOR, PMOS transistors are in series (pull-up) and NMOS in parallel (pull-down)." },
  { q: "Setup time is measured from clock edge to:", options: ["Data arrival", "Data stable end", "Previous data", "Output change"], correct: 1, domain: "VLSI", explanation: "Setup time is the minimum time data must be stable BEFORE the active clock edge." },
  { q: "Which layer in ASIC flow converts RTL to gates?", options: ["Synthesis", "Floorplan", "Place and Route", "Verification"], correct: 0, domain: "VLSI", explanation: "Logic synthesis translates RTL (Verilog/VHDL) into a gate-level netlist." },

  // Signals & Systems
  { q: "Nyquist theorem: minimum sampling rate is:", options: ["Equal to signal freq", "2× max signal freq", "4× max signal freq", "Signal bandwidth"], correct: 1, domain: "Signals", explanation: "Nyquist theorem states sampling rate must be at least 2× the maximum signal frequency." },
  { q: "DFT of a rectangular window is:", options: ["Sinc function", "Gaussian", "Exponential", "Dirac delta"], correct: 0, domain: "Signals", explanation: "The Discrete Fourier Transform of a rectangular window produces a sinc (sin(x)/x) function." },
  { q: "An LTI system is BIBO stable if its impulse response is:", options: ["Absolutely integrable", "Square integrable", "Bounded", "Periodic"], correct: 0, domain: "Signals", explanation: "BIBO stability requires the impulse response h(t) to be absolutely integrable (∫|h(t)|dt < ∞)." },

  // Wireless / RF
  { q: "5G NR uses which multiple access scheme?", options: ["OFDMA", "CDMA", "FDMA", "TDMA"], correct: 0, domain: "RF", explanation: "5G NR uses OFDMA (Orthogonal Frequency Division Multiple Access) for both DL and UL." },
  { q: "VSWR of 1:1 indicates:", options: ["Perfect mismatch", "Perfect match", "Infinite reflection", "50% efficiency"], correct: 1, domain: "RF", explanation: "VSWR 1:1 means zero reflected power - a perfect impedance match." },
  { q: "Which modulation has highest spectral efficiency?", options: ["BPSK", "QPSK", "16-QAM", "64-QAM"], correct: 3, domain: "RF", explanation: "64-QAM carries 6 bits/symbol, giving the highest spectral efficiency but requiring better SNR." },

  // Embedded
  { q: "ARM Cortex-M4 includes which coprocessor?", options: ["FPU", "GPU", "DSP only", "None"], correct: 0, domain: "Embedded", explanation: "Cortex-M4 includes an optional single-precision FPU and DSP instructions." },
  { q: "RTOS context switch stores state in:", options: ["Heap", "Stack", "ROM", "Flash"], correct: 1, domain: "Embedded", explanation: "Context switch saves CPU registers and program counter onto the task's stack." },
  { q: "I2C uses how many wires (excluding power)?", options: ["1", "2", "3", "4"], correct: 1, domain: "Embedded", explanation: "I2C uses two wires: SDA (data) and SCL (clock), both open-drain with pull-ups." },
  { q: "Interrupt latency is minimized by:", options: ["Higher clock", "Nested vectored interrupt", "Polling", "DMA"], correct: 1, domain: "Embedded", explanation: "NVIC (Nested Vectored Interrupt Controller) enables priority-based preemption for minimal latency." },

  // Power Electronics
  { q: "SiC MOSFETs are preferred over Si in EVs because:", options: ["Lower Vth", "Higher switching freq + temp", "Cheaper", "Lower current rating"], correct: 1, domain: "Power", explanation: "SiC handles higher temperatures (175°C+) and switching frequencies, reducing losses in EV inverters." },
  { q: "MPPT stands for:", options: ["Maximum Power Point Tracking", "Minimum Phase Power Transfer", "Multi-Phase Power Technology", "Maximum Phase Point Transfer"], correct: 0, domain: "Power", explanation: "MPPT algorithms track the optimal voltage/current point on a solar panel's I-V curve." },

  // Career / Industry
  { q: "Which EDA company makes Virtuoso (analog circuit design tool)?", options: ["Synopsys", "Mentor Graphics", "Cadence", "Siemens EDA"], correct: 2, domain: "Industry", explanation: "Cadence Virtuoso is the industry-standard tool for custom analog/mixed-signal IC design." },
  { q: "TSMC is headquartered in:", options: ["Seoul", "Hsinchu Taiwan", "Tokyo", "Singapore"], correct: 1, domain: "Industry", explanation: "Taiwan Semiconductor Manufacturing Company is headquartered in Hsinchu Science Park, Taiwan." },
  { q: "India Semiconductor Mission total outlay:", options: ["₹10,000 Cr", "₹76,000 Cr", "₹1,00,000 Cr", "₹45,000 Cr"], correct: 1, domain: "India", explanation: "ISM was allocated ₹76,000 Crore to build India's semiconductor ecosystem." },
  { q: "C2S stands for:", options: ["Chips to Startups", "Circuit to Silicon", "Core to System", "Code to Silicon"], correct: 0, domain: "India", explanation: "Chips to Startups (C2S) is MeitY's program for VLSI design training and chip tapeout." },
  { q: "RISC-V is:", options: ["A company", "An open ISA standard", "A programming language", "A chip fabrication process"], correct: 1, domain: "Industry", explanation: "RISC-V is an open-source Instruction Set Architecture maintained by RISC-V International." },
  { q: "Verification accounts for what % of VLSI project time?", options: ["20%", "40%", "60%", "80%"], correct: 2, domain: "VLSI", explanation: "Design verification typically consumes ~60-70% of the total ASIC development effort." },
  { q: "Which language is used for hardware verification (UVM)?", options: ["VHDL", "SystemVerilog", "C++", "Python"], correct: 1, domain: "VLSI", explanation: "UVM (Universal Verification Methodology) is built on SystemVerilog's OOP features." },
  { q: "The Tata Electronics Dholera plant will use which node?", options: ["28nm", "16nm", "7nm", "5nm"], correct: 0, domain: "India", explanation: "Tata Electronics' Dholera Gujarat fab targets mature 28nm node for power management and auto chips." },
  { q: "ISRO's SSLV stands for:", options: ["Small Satellite Launch Vehicle", "Standard Space Launch Vessel", "Solar System Launch Vector", "Secure Satellite Link Vehicle"], correct: 0, domain: "India", explanation: "SSLV is ISRO's small satellite launcher for payloads up to 500kg to low Earth orbit." },
  { q: "GaN transistors excel in:", options: ["Low power audio", "High frequency power electronics", "Analog computation", "Memory storage"], correct: 1, domain: "Power", explanation: "GaN's wide bandgap enables high-frequency, high-efficiency power conversion (chargers, RF PAs)." },
  { q: "Metastability in flip-flops is caused by:", options: ["Excessive clock freq", "Setup/Hold violation", "Power noise", "Temperature"], correct: 1, domain: "VLSI", explanation: "Metastability occurs when data transitions within the setup/hold window, leaving the FF in an indeterminate state." },
  { q: "The first commercial 2nm chip in production is from:", options: ["Intel", "Samsung", "TSMC", "IBM"], correct: 2, domain: "Industry", explanation: "TSMC began 2nm (N2) risk production in 2025, with volume production planned for 2026." },
  { q: "CAN bus is primarily used in:", options: ["IoT sensors", "Automotive ECUs", "RF transceivers", "Power inverters"], correct: 1, domain: "Embedded", explanation: "Controller Area Network (CAN) is the standard bus for inter-ECU communication in vehicles." },
];

// Domain-specific quiz questions for mastery quizzes (5 per domain)
export const domainQuizzes: Record<string, QuizQuestion[]> = {
  vlsi: [
    { q: "In a CMOS NAND gate, which transistors are in series?", options: ["PMOS", "NMOS", "Both", "Neither"], correct: 1, domain: "VLSI", explanation: "In CMOS NAND, NMOS transistors are in series (pull-down) and PMOS in parallel (pull-up)." },
    { q: "Setup time violation in a flip-flop causes:", options: ["Metastability", "Hold violation", "Power spike", "Glitch"], correct: 0, domain: "VLSI", explanation: "Setup violation means data wasn't stable long enough before clock edge, risking metastability." },
    { q: "Which EDA tool is used for RTL synthesis by Synopsys?", options: ["Cadence Genus", "Design Compiler", "Innovus", "Virtuoso"], correct: 1, domain: "VLSI", explanation: "Synopsys Design Compiler is the industry-standard RTL synthesis tool." },
    { q: "λ in VLSI refers to:", options: ["Wavelength", "Half minimum feature size", "Gate length", "Metal pitch"], correct: 1, domain: "VLSI", explanation: "Lambda (λ) represents half the minimum feature size, used in scalable design rules." },
    { q: "TSMC 5nm vs 7nm: approximate transistor density improvement:", options: ["1.5×", "1.8×", "2.1×", "3×"], correct: 1, domain: "VLSI", explanation: "TSMC N5 offers ~1.8× transistor density improvement over N7, from ~91M to ~171M transistors/mm²." },
  ],
  embedded: [
    { q: "FreeRTOS task states include:", options: ["Running, Ready, Blocked, Suspended", "Active, Passive, Sleep", "On, Off, Idle", "Start, Stop, Pause"], correct: 0, domain: "Embedded", explanation: "FreeRTOS tasks cycle through Running, Ready, Blocked, and Suspended states." },
    { q: "Volatile keyword in C prevents:", options: ["Memory leaks", "Compiler optimization of variable access", "Stack overflow", "Type casting"], correct: 1, domain: "Embedded", explanation: "Volatile tells the compiler to always read from memory, preventing optimization of hardware registers." },
    { q: "SPI communication requires minimum wires:", options: ["2", "3", "4", "5"], correct: 2, domain: "Embedded", explanation: "SPI needs MOSI, MISO, SCLK, and SS (chip select) - 4 wires minimum." },
    { q: "Watchdog timer is used to:", options: ["Measure time", "Reset system on hang", "Generate PWM", "Count events"], correct: 1, domain: "Embedded", explanation: "A watchdog timer resets the MCU if the firmware fails to 'pet' it within the timeout period." },
    { q: "Bootloader resides in:", options: ["RAM", "Flash (start address)", "EEPROM", "External SD"], correct: 1, domain: "Embedded", explanation: "The bootloader occupies the beginning of flash memory and runs first on power-up." },
  ],
  wireless: [
    { q: "MIMO stands for:", options: ["Multiple Input Multiple Output", "Modulated Input Modulated Output", "Mixed Intermediate Mode Operation", "Multi-band Internal Modulation Output"], correct: 0, domain: "RF", explanation: "MIMO uses multiple antennas at both transmitter and receiver for spatial multiplexing." },
    { q: "5G NR frequency range FR2 covers:", options: ["Sub-6 GHz", "24.25-52.6 GHz (mmWave)", "700 MHz-2.5 GHz", "Above 100 GHz"], correct: 1, domain: "RF", explanation: "FR2 is the millimeter-wave band (24.25-52.6 GHz) offering high bandwidth but limited range." },
    { q: "Channel coding in 5G data channel uses:", options: ["Turbo codes", "LDPC codes", "Convolutional codes", "Reed-Solomon"], correct: 1, domain: "RF", explanation: "5G NR uses LDPC (Low-Density Parity-Check) codes for data and Polar codes for control channels." },
    { q: "Beamforming improves:", options: ["Battery life", "Signal directivity and range", "Modulation order", "Bandwidth"], correct: 1, domain: "RF", explanation: "Beamforming steers the antenna pattern toward the intended user, boosting SNR and range." },
    { q: "Path loss in free space increases with:", options: ["Distance only", "Frequency only", "Both distance and frequency", "Neither"], correct: 2, domain: "RF", explanation: "Free-space path loss (Friis equation) is proportional to both distance² and frequency²." },
  ],
  signal: [
    { q: "FFT reduces DFT complexity from O(N²) to:", options: ["O(N)", "O(N log N)", "O(log N)", "O(N³)"], correct: 1, domain: "Signals", explanation: "The FFT algorithm (Cooley-Tukey) reduces N² multiplications to N log₂ N." },
    { q: "Windowing in spectral analysis reduces:", options: ["Noise", "Spectral leakage", "Sampling rate", "Bit depth"], correct: 1, domain: "Signals", explanation: "Window functions (Hamming, Hanning) reduce spectral leakage caused by finite-length signals." },
    { q: "Convolution in time domain equals:", options: ["Addition in frequency", "Multiplication in frequency", "Division in frequency", "Subtraction in frequency"], correct: 1, domain: "Signals", explanation: "This is the Convolution Theorem - convolution in time = multiplication in frequency domain." },
    { q: "A causal system's impulse response h(t) is:", options: ["Zero for t < 0", "Zero for t > 0", "Always positive", "Always bounded"], correct: 0, domain: "Signals", explanation: "A causal system cannot respond before the input arrives, so h(t) = 0 for t < 0." },
    { q: "Kalman filter is used for:", options: ["Image compression", "Optimal state estimation", "Audio synthesis", "Database queries"], correct: 1, domain: "Signals", explanation: "The Kalman filter recursively estimates the state of a dynamic system from noisy measurements." },
  ],
  power: [
    { q: "Buck converter output voltage is:", options: ["Higher than input", "Lower than input", "Equal to input", "Inverted"], correct: 1, domain: "Power", explanation: "A buck (step-down) converter always produces output voltage lower than input voltage." },
    { q: "Duty cycle in a boost converter: Vout =", options: ["Vin × D", "Vin / (1-D)", "Vin × (1-D)", "Vin / D"], correct: 1, domain: "Power", explanation: "Boost converter: Vout = Vin / (1 - D), where D is the duty cycle (0 < D < 1)." },
    { q: "IGBT is preferred over MOSFET for:", options: ["High frequency", "High voltage + high current", "Low noise", "Digital logic"], correct: 1, domain: "Power", explanation: "IGBTs combine MOSFET gate drive with BJT high-current capability, ideal for high-power applications." },
    { q: "Regenerative braking converts:", options: ["Kinetic to thermal", "Kinetic to electrical", "Chemical to kinetic", "Electrical to chemical"], correct: 1, domain: "Power", explanation: "Regenerative braking uses the motor as a generator, converting kinetic energy back to electrical energy." },
    { q: "THD stands for:", options: ["Total Harmonic Distortion", "Thermal Heat Dissipation", "Transistor Hold Delay", "Time-domain Harmonic Decomposition"], correct: 0, domain: "Power", explanation: "THD measures the ratio of harmonic content to the fundamental frequency in a power signal." },
  ],
};
