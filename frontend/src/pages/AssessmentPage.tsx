import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, Terminal, ArrowRight, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { VoltBot } from '../components/ui/VoltBot';
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
    const [botState, setBotState] = useState<'idle' | 'speaking' | 'happy' | 'sad' | 'thinking'>('speaking');
    const [botMessage, setBotMessage] = useState("Educational module initialized. Ready for logic verification.");
    const [successStep, setSuccessStep] = useState<0 | 1 | 2>(0);

    // Structural reinforcement: track correct count WITHOUT useState (avoids re-render)
    const correctCountRef = useRef(0);

    // Apply CSS structural reinforcement — reduces float amplitude after 3+ correct
    const applyStructuralReinforcement = useCallback((count: number) => {
        // Amplitude ramps down from 2px → 0.5px as correctCount increases
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
            setBotState('happy');
            setBotMessage(msg);
            // Increment correct count ref and apply structural reinforcement
            correctCountRef.current += 1;
            if (correctCountRef.current >= 3) {
                applyStructuralReinforcement(correctCountRef.current);
            }
        } else {
            const msg = GUIDANCE_MESSAGES.incorrect[Math.floor(Math.random() * GUIDANCE_MESSAGES.incorrect.length)];
            setBotState('sad');
            setBotMessage(`${msg} ${question.explanation}`);
        }
    };

    const handleContinue = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(s => s + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setBotState('speaking');
            setBotMessage("Loading next data packet...");
        } else {
            setSuccessStep(1);
        }
    };

    useEffect(() => {
        if (!isAnswered && successStep === 0) {
            if (selectedOption) {
                setBotState('thinking');
                setBotMessage("Analyzing selection... silicon gates are shifting!");
            } else {
                setBotState('idle');
                const hint = question.gateType
                    ? `Input A and B are ready. What is the ${question.gateType.toLowerCase()} output?`
                    : "Observation is key. Trust your logic.";
                setBotMessage(hint);
            }
        }
    }, [selectedOption, isAnswered, question.gateType, successStep]);

    const navItems = [1, 2]; // Define navItems for the progress indicators

    return (
        <div className="h-screen bg-background flex flex-col font-sans overflow-hidden relative selection:bg-indigo-500/10 text-foreground">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <AnimatePresence mode="wait">
                {successStep === 0 ? (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Progress Header */}
                        <header className="relative z-20 max-w-6xl w-full mx-auto pt-8 px-8 flex items-center space-x-8">
                            <button
                                onClick={() => navigate('/home')}
                                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-400 hover:text-indigo-300 transition-all hover:bg-white/10 active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                                    className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                            <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-xs font-heading font-bold text-indigo-400 tracking-wide">
                                    Unit {currentStep + 1} of {QUESTIONS.length}
                                </span>
                            </div>
                        </header>

                        <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-8 py-2 flex flex-col justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, scale: 0.99, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.01, y: -5 }}
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
                                                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                                <span className="text-xs font-heading font-bold text-indigo-400/80 tracking-widest uppercase">Logic Verification Phase</span>
                                            </motion.div>
                                            <h1 className="text-5xl font-heading font-bold text-white leading-tight tracking-tight">
                                                {question.text}
                                            </h1>
                                            <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
                                                {question.subtext}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 max-w-md">
                                            {question.options.map((option, optIdx) => {
                                                const isSelected = selectedOption === option;
                                                const isAnswerCorrect = isAnswered && option === question.correctAnswer;
                                                const isAnswerWrong = isAnswered && isSelected && selectedOption !== question.correctAnswer;
                                                return (
                                                    <button
                                                        key={option}
                                                        disabled={isAnswered}
                                                        onClick={() => setSelectedOption(option)}
                                                        style={{ '--card-delay': `${optIdx * 0.15}s` } as React.CSSProperties}
                                                        className={cn(
                                                            // Base + CSS float animation from assessment-cards.css
                                                            "question-option-card relative p-6 rounded-xl border transition-colors text-left group overflow-hidden bg-white/5 backdrop-blur-sm",
                                                            isSelected
                                                                ? "border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-500/10"
                                                                : "border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10",
                                                            isAnswerCorrect && "question-option-card--correct border-emerald-500/50 bg-emerald-500/10 !text-emerald-400",
                                                            isAnswerWrong && "question-option-card--incorrect border-amber-500/50 bg-amber-500/10 !text-amber-400"
                                                        )}
                                                    >
                                                        <div className="flex items-center relative z-10">
                                                            <span className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center mr-5 font-heading font-bold text-sm border transition-all",
                                                                isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-indigo-400"
                                                            )}>
                                                                {option.charAt(0)}
                                                            </span>
                                                            <span className="font-heading font-bold text-xl tracking-tight">
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
                                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden flex-1 group">
                                            {question.gateType ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full max-w-[400px]"
                                                >
                                                    <LogicGateSVG
                                                        type={question.gateType}
                                                        interactionState={isAnswered ? (isCorrect ? 'success' : 'error') : (selectedOption ? 'active' : 'idle')}
                                                        className="bg-transparent border-none shadow-none backdrop-blur-none"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col">
                                                    <div className="flex items-center space-x-2 mb-6 text-purple-400/60 border-b border-purple-500/20 pb-4">
                                                        <Terminal className="w-4 h-4" />
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">System_Lore_Logs v4.0</span>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                                                        <div className="space-y-4">
                                                            {question.extraInfo?.map((info, idx) => (
                                                                <motion.div
                                                                    key={idx}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: idx * 0.1 }}
                                                                    className="flex items-start space-x-4 group/item"
                                                                >
                                                                    <span className="text-[10px] font-mono text-purple-500/40 mt-1">[{idx.toString().padStart(2, '0')}]</span>
                                                                    <p className="text-sm font-mono text-purple-300/80 leading-relaxed group-hover/item:text-purple-300 transition-colors">
                                                                        {info}
                                                                    </p>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-500/0 to-purple-500/5 pointer-events-none" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center justify-between space-y-8 bg-white/5 rounded-2xl p-10 border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all">
                                            <VoltBot
                                                state={botState}
                                                message={botMessage}
                                                className="scale-110 !static"
                                            />
                                            <div className="w-full max-w-sm pt-8 border-t border-white/5">
                                                <button
                                                    onClick={isAnswered ? handleContinue : handleCheck}
                                                    disabled={!selectedOption}
                                                    className={cn(
                                                        "group relative w-full h-16 rounded-xl font-heading font-black text-xl flex items-center justify-center overflow-hidden transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl",
                                                        !isAnswered
                                                            ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
                                                            : (isCorrect ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20" : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-500/20")
                                                    )}
                                                >
                                                    <span className="relative z-10 flex items-center tracking-tight">
                                                        {isAnswered ? "Continue Path" : "Verify Logic"}
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-auto"
                        onClick={() => {
                            if (successStep === 1) setSuccessStep(2);
                            else navigate('/portal');
                        }}
                    >
                        <LogicStormBackground />

                        <AnimatePresence mode="wait">
                            {successStep === 1 ? (
                                <motion.div
                                    key="motivational-1"
                                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative z-10 text-center space-y-8 px-8 max-w-5xl"
                                >
                                    <div className="flex justify-center mb-12">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                            className="bg-primary/20 p-8 rounded-2xl border border-primary/30 shadow-[0_0_50px_rgba(58,134,255,0.2)]"
                                        >
                                            <Trophy className="w-20 h-20 text-primary" />
                                        </motion.div>
                                    </div>

                                    <h1 className="font-heading font-black text-6xl md:text-8xl text-white tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                        great job <span className="text-primary">Scientist!</span>
                                    </h1>

                                    <p className="font-mono text-slate-300 text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
                                        you have overcome the fear of starting.
                                    </p>

                                    <div className="pt-16">
                                        <span className="text-primary/60 font-mono text-sm animate-pulse tracking-[0.3em] uppercase">
                                            [ CLICK ANYWHERE TO CONTINUE ]
                                        </span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="motivational-2"
                                    initial={{ opacity: 0, x: 200, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -200, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="relative z-10 text-center space-y-10 px-8 max-w-6xl"
                                >
                                    <div className="flex justify-center mb-6">
                                        <VoltBot state="happy" className="scale-[2.5]" />
                                    </div>

                                    <h1 className="font-heading font-black text-5xl md:text-7xl text-white tracking-tighter uppercase">
                                        Protocol <span className="text-signal-success">Ascension</span>
                                    </h1>

                                    <p className="font-mono text-slate-400 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                                        now as you have decided and overcame a challenge let's go further to real world
                                    </p>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="pt-12"
                                    >
                                        <button
                                            onClick={() => navigate('/portal')}
                                            className="group relative px-12 py-6 bg-primary text-background font-heading font-black text-2xl rounded-xl overflow-hidden shadow-glow-primary hover:scale-105 transition-all"
                                        >
                                            <span className="relative z-10 flex items-center">
                                                ENTER REAL WORLD <ArrowRight className="ml-4 w-10 h-10 group-hover:translate-x-2 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress Indicators */}
                        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-4">
                            {navItems.map((item) => (
                                <div
                                    key={item}
                                    className={cn(
                                        "h-1.5 w-24 rounded-full transition-all duration-700 shadow-glow-primary",
                                        successStep >= item ? "bg-primary" : "bg-slate-800"
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
