import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, Terminal, ArrowRight, Trophy, Info, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { LogicGateSVG } from '../components/ui/LogicGateSVG';
import { LogicStormBackground } from '../components/ui/LogicStormBackground';
import './assessment-cards.css';

interface Question {
    id: number;
    text: string;
    subtext?: string;
    gateType?: 'and' | 'or' | 'nand' | 'nor' | 'not' | 'xor';
    options: string[];
    correctAnswer: string;
    explanation: string;
    extraInfo?: string[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Identify the expression",
        subtext: "Y = (A ⋅ B)' represents which logic gate symbol?",
        gateType: 'nand',
        options: ['AND', 'OR', 'NAND', 'NOR'],
        correctAnswer: 'NAND',
        explanation: "AND followed by NOT is NAND. (A ⋅ B)' is the algebraic form.",
        extraInfo: [
            "SYS_LOG: NAND gate is universal.",
            "FACT: 7401 is a quad 2-input NAND gate.",
            "CALC: Output is LOW only if A=1 AND B=1.",
            "INFO: Widely used in flash memory (NAND)."
        ]
    },
    {
        id: 2,
        text: "Binary Signal Form",
        subtext: "How is the decimal number 3 represented in binary signal levels?",
        options: ['10', '11', '01', '00'],
        correctAnswer: '11',
        explanation: "3 in decimal is 11 in binary. Both bits are HIGH (1).",
        extraInfo: [
            "SYS_LOG: Converting decimal 3 to binary.",
            "LSB: Power of 2^0 is 1. (Weight: 1)",
            "MSB: Power of 2^1 is 2. (Weight: 2)",
            "FACT: 2+1 = 3. Binary resultant: 11.",
            "WARNING: Signal saturation detected at level 11."
        ]
    },
    {
        id: 3,
        text: "Universal Architect",
        subtext: "Which of these is known as a 'Universal Gate'?",
        gateType: 'nand',
        options: ['AND', 'NAND', 'OR', 'XOR'],
        correctAnswer: 'NAND',
        explanation: "NAND and NOR are universal gates because they can build any other gate.",
        extraInfo: [
            "ARCH_FILE: All logic is computable via NAND.",
            "HIST: Apollo Guidance Computer used NOR gates.",
            "EFFICIENCY: Reducing chip area with universality.",
            "LOG: NAND(A,A) = NOT(A).",
            "LOG: NAND(NAND(A,B), NAND(A,B)) = AND(A,B)."
        ]
    },
    {
        id: 4,
        text: "Hexadecimal Cipher",
        subtext: "What is the result of 8 + 3 in Hexadecimal Notation?",
        options: ['A', 'B', 'C', '11'],
        correctAnswer: 'B',
        explanation: "8 + 3 = 11. In Hexadecimal, 10=A, 11=B, 12=C...",
        extraInfo: [
            "ADDR_BUS: Hex is base-16 calculation.",
            "ALU_INPUT: 1000 + 0011 -> 1011 (binary).",
            "FACT: Memory addresses use base-16 for density.",
            "SYBIL: 11 in Dec is 'B' in Hex protocol.",
            "SYS_LOG: Overflow check... Negative. Result valid."
        ]
    },
    {
        id: 5,
        text: "Binary Logic",
        subtext: "What is the binary representation of decimal number 6?",
        options: ['100', '101', '110', '111'],
        correctAnswer: '110',
        explanation: "6 in binary is 110 (4 + 2 + 0).",
        extraInfo: [
            "BIN_CORE: Calculating 2^2 + 2^1.",
            "LOG: 4 + 2 = 6.",
            "SIGNAL: High-High-Low configuration.",
            "FACT: Binary 110 is used in parity checks.",
            "INFO: MSB is left-most bit (4)."
        ]
    },
    {
        id: 6,
        text: "Inversion Protocol",
        subtext: "What happens to the output of a NOT gate if the input is 0?",
        gateType: 'not',
        options: ['0', '1', 'Same as input', 'Undefined'],
        correctAnswer: '1',
        explanation: "A NOT gate always inverts the signal. 0 becomes 1.",
        extraInfo: [
            "CORE_LOG: Applying NOT(0).",
            "SIGNAL: Inversion buffer activated.",
            "HIST: First hex inverters used vacuum tubes.",
            "LOG: Logic 0 maps to Ground (0V).",
            "LOG: Logic 1 maps to VCC (5V/3.3V)."
        ]
    },
    {
        id: 7,
        text: "Logical Union",
        subtext: "Which gate turns ON (1) if at least one input is 1?",
        gateType: 'or',
        options: ['AND', 'OR', 'NOT', 'NAND'],
        correctAnswer: 'OR',
        explanation: "The OR gate outputs HIGH if any or both inputs are HIGH.",
        extraInfo: [
            "SYS_LOG: OR gate truth discovery.",
            "TRUTH_TABLE: 0,1 -> 1 | 1,0 -> 1 | 1,1 -> 1.",
            "FACT: Paralleled switches represent OR logic.",
            "INFO: Y = A + B in Boolean notation.",
            "CALC: Probability of HIGH output: 75%."
        ]
    },
    {
        id: 8,
        text: "Signal Sequence",
        subtext: "What is the binary representation of decimal number 9?",
        options: ['1001', '1010', '1100', '1110'],
        correctAnswer: '1001',
        explanation: "9 in binary is 1001 (8 + 0 + 0 + 1).",
        extraInfo: [
            "LOG: 2^3 + 2^0 = 8 + 1.",
            "SIGNAL: Pulse-Low-Low-Pulse.",
            "FACT: Hexadecimal representation is 0x09.",
            "INFO: 1001 is a palindromic binary number.",
            "SYS: Validating signal strength... Nominal."
        ]
    },
    {
        id: 9,
        text: "Hardware Safeguard",
        subtext: "Which component limits current in a circuit?",
        options: ['Capacitor', 'Resistor', 'Diode', 'Transistor'],
        correctAnswer: 'Resistor',
        explanation: "Resistors limit the flow of electrical current to protect components.",
        extraInfo: [
            "PHYSICS_LOG: Ohm's Law (V = I * R).",
            "FACT: Resistor bands indicate resistance value.",
            "MATERIAL: Carbon film or metal oxide cores.",
            "SYS: Preventing thermal runaway... Staging.",
            "INFO: Resistance measured in Ohms (Ω)."
        ]
    },
    {
        id: 10,
        text: "Logical Intersection",
        subtext: "What is the output of an AND gate if both inputs are 1?",
        gateType: 'and',
        options: ['0', '1', '2', 'Undefined'],
        correctAnswer: '1',
        explanation: "An AND gate only outputs HIGH (1) if ALL inputs are HIGH.",
        extraInfo: [
            "LOG: AND gate synchronizer.",
            "TRUTH: 1 && 1 = 1.",
            "FACT: Series switches represent AND logic.",
            "INFO: Multiplication in Boolean algebra.",
            "CALC: Output is LOW for 3/4 input states."
        ]
    },
    {
        id: 11,
        text: "Energy Reservoir",
        subtext: "Which device stores energy in an electric field?",
        options: ['Inductor', 'Resistor', 'Capacitor', 'Switch'],
        correctAnswer: 'Capacitor',
        explanation: "Capacitors store energy in the electric field between two conductive plates.",
        extraInfo: [
            "LOG: Capacitance = Charge / Voltage.",
            "FACT: Farad is the unit of capacitance.",
            "USAGE: Smoothing power supply ripples.",
            "INFO: Blocking DC while allowing AC.",
            "SYS: Charge time constant RC = R * C."
        ]
    },
    {
        id: 12,
        text: "Bit Weighting",
        subtext: "What is the decimal value of binary 1000?",
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: "In binary, 1000 represents 2^3, which equals 8.",
        extraInfo: [
            "DATA_CORE: 4th bit (MSB) weigh: 8.",
            "INFO: 1000 is a perfect power of 2.",
            "LOG: Byte slice detected: [1000xxxx].",
            "FACT: Often used as a base step in cycles.",
            "SYS_LOG: Read operation successful at addr 0008."
        ]
    },
    {
        id: 13,
        text: "The NAND Condition",
        subtext: "Which gate outputs 0 ONLY when all inputs are 1?",
        gateType: 'nand',
        options: ['AND', 'OR', 'NAND', 'XOR'],
        correctAnswer: 'NAND',
        explanation: "NAND is 'NOT AND'. Since AND is 1 for all 1s, NAND is 0 for all 1s.",
        extraInfo: [
            "SYS_LOG: NAND exception handling.",
            "TRUTH_TABLE: (1,1) -> 0.",
            "FACT: Building blocks of modern SSDs.",
            "INFO: Negative-AND logic implementation.",
            "CALC: Boolean Y = !(A & B)."
        ]
    },
    {
        id: 14,
        text: "Flow Control",
        subtext: "What is the primary function of a diode?",
        options: ['Amplifies signal', 'Stores charge', 'Allows current in one direction', 'Increases voltage'],
        correctAnswer: 'Allows current in one direction',
        explanation: "A diode acts as a one-way valve, allowing current to flow in only one direction.",
        extraInfo: [
            "PHYSICS_LOG: PN Junction dynamics.",
            "FACT: Forward bias vs Reverse bias.",
            "USAGE: Rectification (AC to DC).",
            "INFO: Breakdown voltage threshold check.",
            "LOG: Typical drop: 0.7V for Silicon."
        ]
    },
    {
        id: 15,
        text: "Hexadecimal Sum",
        subtext: "What is the result of 5 + 5 in hexadecimal?",
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        explanation: "5 + 5 = 10. In hex, the value 10 is represented by 'A'.",
        extraInfo: [
            "ALU_LOG: 0101 + 0101 = 1010.",
            "HEX: 1010 maps to 'A'.",
            "FACT: Hex uses letters A-F for 10-15.",
            "INFO: Base-16 system prevents overflow error.",
            "SYS: Validating carry out... Zero."
        ]
    },
    {
        id: 16,
        text: "Exclusive Logic",
        subtext: "Which gate outputs 1 ONLY when both inputs are different?",
        gateType: 'xor',
        options: ['AND', 'XOR', 'OR', 'NOR'],
        correctAnswer: 'XOR',
        explanation: "The XOR (Exclusive OR) gate outputs 1 if exactly one input is 1.",
        extraInfo: [
            "LOG: XOR parity generator.",
            "TRUTH: (0,1)->1 | (1,0)->1 | (0,0)->0 | (1,1)->0.",
            "FACT: Foundation of half-adders.",
            "INFO: Difference detector in circuits.",
            "CALC: Binary addition without carry."
        ]
    }
];

export const AssessmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Educational module initialized. Ready for logic verification.");
    const [successStep, setSuccessStep] = useState<0 | 1 | 2>(0);

    const correctCountRef = useRef(0);

    const applyStructuralReinforcement = useCallback((count: number) => {
        const amplitude = Math.max(0.5, 2 - (count - 3) * 0.3);
        document.documentElement.style.setProperty('--card-float-amplitude', `${amplitude.toFixed(1)}px`);
    }, []);

    const question = QUESTIONS[currentStep];

    const GUIDANCE_MESSAGES = {
        correct: [
            "Binary Perfection! Your neural patterns are impressive.",
            "Signal flow confirmed. Precision implementation!",
            "100% Signal Strength! Protocol optimized.",
        ],
        incorrect: [
            "Logic mismatch detected. Recalibrating...",
            "Signal noise interference. Recalculating path...",
            "Circuit breaker tripped. Analyze the logic again.",
        ]
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        const correct = selectedOption === question.correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            const msg = GUIDANCE_MESSAGES.correct[Math.floor(Math.random() * GUIDANCE_MESSAGES.correct.length)];
            setStatusMessage(msg);
            correctCountRef.current += 1;
            if (correctCountRef.current >= 3) {
                applyStructuralReinforcement(correctCountRef.current);
            }
        } else {
            const msg = GUIDANCE_MESSAGES.incorrect[Math.floor(Math.random() * GUIDANCE_MESSAGES.incorrect.length)];
            setStatusMessage(`${msg} ${question.explanation}`);
        }
    };

    const handleContinue = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(s => s + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setStatusMessage("Loading next data packet...");
        } else {
            setSuccessStep(1);
        }
    };

    useEffect(() => {
        if (!isAnswered && successStep === 0) {
            if (selectedOption) {
                setStatusMessage("Analyzing selection... silicon gates are shifting!");
            } else {
                const hint = question.gateType
                    ? `Input A and B are ready. What is the ${question.gateType.toLowerCase()} output?`
                    : "Observation is key. Trust your logic.";
                setStatusMessage(hint);
            }
        }
    }, [selectedOption, isAnswered, question.gateType, successStep]);

    const navItems = [1, 2];

    const T = {
        bg: 'bg-slate-50',
        card: 'bg-white',
        text: 'text-slate-900',
        muted: 'text-slate-500',
        border: 'border-slate-200',
        shadow: 'shadow-xl shadow-slate-200/50',
    };

    return (
        <div className={`h-screen ${T.bg} flex flex-col font-sans overflow-hidden relative selection:bg-sky-500/10 ${T.text}`}>
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="black" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <AnimatePresence mode="wait">
                {successStep === 0 ? (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                        className="flex-1 flex flex-col relative z-10"
                    >
                        {/* Progress Header */}
                        <header className="max-w-6xl w-full mx-auto pt-8 px-8 flex items-center space-x-8">
                            <button
                                onClick={() => navigate('/portal')}
                                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                                    className="h-full bg-sky-600 transition-all duration-700 shadow-md"
                                />
                            </div>
                            <div className="px-5 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                <span className="text-xs font-black text-slate-800 tracking-widest uppercase">
                                    Progress: {Math.round(((currentStep) / QUESTIONS.length) * 100)}%
                                </span>
                            </div>
                        </header>

                        <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-2 flex flex-col justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, scale: 0.99, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.01, y: -10 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                                >
                                    {/* Left Content */}
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="p-1 px-3 bg-sky-50 text-sky-600 rounded-full border border-sky-100 text-[10px] font-black tracking-widest uppercase">Logic Verification Phase</div>
                                            </motion.div>
                                            <h1 className="text-5xl font-heading font-black text-slate-900 leading-tight tracking-tight">
                                                {question.text}
                                            </h1>
                                            <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
                                                {question.subtext}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 max-w-md">
                                            {question.options.map((option, optIdx) => {
                                                const isSelected = selectedOption === option;
                                                const isAnswerCorrect = isAnswered && option === question.correctAnswer;
                                                const isAnswerWrong = isAnswered && isSelected && selectedOption !== question.correctAnswer;
                                                return (
                                                    <button
                                                        key={option}
                                                        disabled={isAnswered}
                                                        onClick={() => setSelectedOption(option)}
                                                        className={cn(
                                                            "relative p-6 rounded-2xl border-2 transition-all text-left font-bold shadow-sm overflow-hidden",
                                                            isSelected
                                                                ? "border-sky-600 bg-sky-50 text-sky-900 ring-4 ring-sky-100"
                                                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50",
                                                            isAnswerCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-100",
                                                            isAnswerWrong && "border-rose-500 bg-rose-50 text-rose-800 ring-4 ring-rose-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center relative z-10">
                                                            <span className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center mr-5 font-heading font-black text-sm border-2 transition-all shadow-sm",
                                                                isSelected 
                                                                    ? (isAnswered ? (isAnswerCorrect ? "bg-emerald-500 border-white text-white" : "bg-rose-500 border-white text-white") : "bg-sky-600 border-white text-white") 
                                                                    : "bg-white border-slate-100 text-slate-400"
                                                            )}>
                                                                {String.fromCharCode(65 + optIdx)}
                                                            </span>
                                                            <span className="font-heading font-black text-xl tracking-tight">
                                                                {option}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Right Content */}
                                    <div className="flex flex-col space-y-8 h-full">
                                        <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden flex-1 group">
                                            {question.gateType ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full max-w-[420px]"
                                                >
                                                    <LogicGateSVG
                                                        type={question.gateType}
                                                        interactionState={isAnswered ? (isCorrect ? 'success' : 'error') : (selectedOption ? 'active' : 'idle')}
                                                        className="bg-transparent border-none shadow-none grayscale-0"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col">
                                                    <div className="flex items-center space-x-3 mb-8 text-sky-600/60 border-b border-slate-100 pb-6">
                                                        <Terminal className="w-5 h-5" />
                                                        <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">System_Lore_Logs v4.0</span>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                                                        {question.extraInfo?.map((info, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                className="flex items-start space-x-5 group/item cursor-default"
                                                            >
                                                                <span className="text-[10px] font-black text-sky-500/30 mt-1.5 font-mono">[{idx.toString().padStart(2, '0')}]</span>
                                                                <p className="text-base font-bold text-slate-500 leading-relaxed hover:text-sky-600 transition-colors">
                                                                    {info}
                                                                </p>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col p-10 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                                            <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className={cn(
                                                    "p-2 rounded-xl shrink-0 mt-1",
                                                    isAnswered ? (isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600") : "bg-sky-100 text-sky-600"
                                                )}>
                                                    {isAnswered ? (isCorrect ? <ShieldCheck size={20} /> : <Info size={20} />) : <Activity size={20} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Analysis Feed</div>
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                                        "{statusMessage}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full pt-4">
                                                <button
                                                    onClick={isAnswered ? handleContinue : handleCheck}
                                                    disabled={!selectedOption}
                                                    className={cn(
                                                        "group relative w-full h-18 rounded-2xl font-black text-xl flex items-center justify-center overflow-hidden transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200",
                                                        !isAnswered
                                                            ? "bg-slate-900 text-white hover:bg-black"
                                                            : (isCorrect ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-rose-600 text-white hover:bg-rose-500")
                                                    )}
                                                >
                                                    <span className="relative z-10 flex items-center tracking-tight">
                                                        {isAnswered ? "CONTINUE SEQUENCE" : "VERIFY LOGIC"}
                                                        <ChevronRight className="ml-3 w-7 h-7 group-hover:translate-x-1.5 transition-transform" />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-sequence"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white pointer-events-auto"
                        onClick={() => {
                            if (successStep === 1) setSuccessStep(2);
                            else navigate('/portal');
                        }}
                    >
                        <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
                            <LogicStormBackground />
                        </div>

                        <AnimatePresence mode="wait">
                            {successStep === 1 ? (
                                <motion.div
                                    key="motivational-1"
                                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative z-10 text-center space-y-10 px-8 max-w-5xl"
                                >
                                    <div className="flex justify-center mb-16">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                y: [0, -10, 0]
                                            }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                            className="bg-sky-50 p-10 rounded-[40px] border border-sky-100 shadow-2xl shadow-sky-100"
                                        >
                                            <Trophy className="w-24 h-24 text-sky-600" />
                                        </motion.div>
                                    </div>

                                    <h1 className="font-heading font-black text-7xl md:text-9xl text-slate-900 tracking-tighter uppercase">
                                        GREAT JOB <span className="text-sky-600">SCIENTIST!</span>
                                    </h1>

                                    <p className="font-heading font-black text-slate-400 text-3xl md:text-4xl max-w-3xl mx-auto leading-tight uppercase tracking-tight">
                                        YOU HAVE OVERCOME THE FEAR OF STARTING.
                                    </p>

                                    <div className="pt-24">
                                        <span className="text-sky-400 font-black text-xs animate-pulse tracking-[0.5em] uppercase border-b-2 border-sky-100 pb-2">
                                            [ CLICK ANYWHERE TO CONTINUE ]
                                        </span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="motivational-2"
                                    initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative z-10 text-center space-y-12 px-8 max-w-6xl"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="p-8 bg-emerald-50 rounded-[48px] border-4 border-emerald-100 shadow-2xl shadow-emerald-100">
                                            <ShieldCheck className="w-32 h-32 text-emerald-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h1 className="font-heading font-black text-6xl md:text-8xl text-slate-900 tracking-tighter uppercase">
                                            PROTOCOL <span className="text-emerald-500">ASCENSION</span>
                                        </h1>
                                        <p className="font-heading font-black text-slate-400 text-2xl md:text-3xl max-w-4xl mx-auto leading-tight uppercase tracking-tight">
                                            NOW AS YOU HAVE DECIDED AND OVERCAME A CHALLENGE LET'S GO FURTHER TO REAL WORLD
                                        </p>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="pt-16"
                                    >
                                        <button
                                            onClick={() => navigate('/portal')}
                                            className="group relative px-16 py-8 bg-slate-900 text-white font-heading font-black text-3xl rounded-[32px] overflow-hidden shadow-2xl shadow-slate-300 hover:scale-105 transition-all active:scale-95"
                                        >
                                            <span className="relative z-10 flex items-center tracking-tighter">
                                                ENTER PORTAL <ArrowRight className="ml-6 w-12 h-12 group-hover:translate-x-2 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-sky-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress Indicators */}
                        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-6">
                            {navItems.map((item) => (
                                <div
                                    key={item}
                                    className={cn(
                                        "h-2 w-32 rounded-full transition-all duration-1000",
                                        successStep >= item ? "bg-sky-600 shadow-lg shadow-sky-200" : "bg-slate-100 shadow-inner"
                                    )}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
