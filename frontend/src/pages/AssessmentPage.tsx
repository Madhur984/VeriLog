import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { VoltBot } from '../components/ui/VoltBot';
import { LogicGateSVG } from '../components/ui/LogicGateSVG';

interface Question {
    id: number;
    text: string;
    subtext?: string;
    gateType?: 'and' | 'or' | 'nand' | 'nor' | 'not' | 'xor';
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Identify the expression",
        subtext: "Y = (A ⋅ B)' represents which logic gate symbol?",
        gateType: 'nand',
        options: ['AND', 'OR', 'NAND', 'NOR'],
        correctAnswer: 'NAND',
        explanation: "AND followed by NOT is NAND. (A ⋅ B)' is the algebraic form."
    },
    {
        id: 2,
        text: "Binary Signal Form",
        subtext: "How is the decimal number 3 represented in binary signal levels?",
        options: ['10', '11', '01', '00'],
        correctAnswer: '11',
        explanation: "3 in decimal is 11 in binary. Both bits are HIGH (1)."
    },
    {
        id: 3,
        text: "Universal Architect",
        subtext: "Which of these is known as a 'Universal Gate'?",
        gateType: 'nand',
        options: ['AND', 'NAND', 'OR', 'XOR'],
        correctAnswer: 'NAND',
        explanation: "NAND and NOR are universal gates because they can build any other gate."
    },
    {
        id: 4,
        text: "Hexadecimal Cipher",
        subtext: "What is the result of 8 + 3 in Hexadecimal Notation?",
        options: ['A', 'B', 'C', '11'],
        correctAnswer: 'B',
        explanation: "8 + 3 = 11. In Hexadecimal, 10=A, 11=B, 12=C..."
    },
    {
        id: 5,
        text: "Binary Logic",
        subtext: "What is the binary representation of decimal number 6?",
        options: ['100', '101', '110', '111'],
        correctAnswer: '110',
        explanation: "6 in binary is 110 (4 + 2 + 0)."
    },
    {
        id: 6,
        text: "Inversion Protocol",
        subtext: "What happens to the output of a NOT gate if the input is 0?",
        gateType: 'not',
        options: ['0', '1', 'Same as input', 'Undefined'],
        correctAnswer: '1',
        explanation: "A NOT gate always inverts the signal. 0 becomes 1."
    },
    {
        id: 7,
        text: "Logical Union",
        subtext: "Which gate turns ON (1) if at least one input is 1?",
        gateType: 'or',
        options: ['AND', 'OR', 'NOT', 'NAND'],
        correctAnswer: 'OR',
        explanation: "The OR gate outputs HIGH if any or both inputs are HIGH."
    },
    {
        id: 8,
        text: "Signal Sequence",
        subtext: "What is the binary representation of decimal number 9?",
        options: ['1001', '1010', '1100', '1110'],
        correctAnswer: '1001',
        explanation: "9 in binary is 1001 (8 + 0 + 0 + 1)."
    },
    {
        id: 9,
        text: "Hardware Safeguard",
        subtext: "Which component limits current in a circuit?",
        options: ['Capacitor', 'Resistor', 'Diode', 'Transistor'],
        correctAnswer: 'Resistor',
        explanation: "Resistors limit the flow of electrical current to protect components."
    },
    {
        id: 10,
        text: "Logical Intersection",
        subtext: "What is the output of an AND gate if both inputs are 1?",
        gateType: 'and',
        options: ['0', '1', '2', 'Undefined'],
        correctAnswer: '1',
        explanation: "An AND gate only outputs HIGH (1) if ALL inputs are HIGH."
    },
    {
        id: 11,
        text: "Energy Reservoir",
        subtext: "Which device stores energy in an electric field?",
        options: ['Inductor', 'Resistor', 'Capacitor', 'Switch'],
        correctAnswer: 'Capacitor',
        explanation: "Capacitors store energy in the electric field between two conductive plates."
    },
    {
        id: 12,
        text: "Bit Weighting",
        subtext: "What is the decimal value of binary 1000?",
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: "In binary, 1000 represents 2^3, which equals 8."
    },
    {
        id: 13,
        text: "The NAND Condition",
        subtext: "Which gate outputs 0 ONLY when all inputs are 1?",
        gateType: 'nand',
        options: ['AND', 'OR', 'NAND', 'XOR'],
        correctAnswer: 'NAND',
        explanation: "NAND is 'NOT AND'. Since AND is 1 for all 1s, NAND is 0 for all 1s."
    },
    {
        id: 14,
        text: "Flow Control",
        subtext: "What is the primary function of a diode?",
        options: ['Amplifies signal', 'Stores charge', 'Allows current in one direction', 'Increases voltage'],
        correctAnswer: 'Allows current in one direction',
        explanation: "A diode acts as a one-way valve, allowing current to flow in only one direction."
    },
    {
        id: 15,
        text: "Hexadecimal Sum",
        subtext: "What is the result of 5 + 5 in hexadecimal?",
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        explanation: "5 + 5 = 10. In hex, the value 10 is represented by 'A'."
    },
    {
        id: 16,
        text: "Exclusive Logic",
        subtext: "Which gate outputs 1 ONLY when both inputs are different?",
        gateType: 'xor',
        options: ['AND', 'XOR', 'OR', 'NOR'],
        correctAnswer: 'XOR',
        explanation: "The XOR (Exclusive OR) gate outputs 1 if exactly one input is 1.",
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
            navigate('/home');
        }
    };

    useEffect(() => {
        if (!isAnswered) {
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
    }, [selectedOption, isAnswered, question.gateType]);

    return (
        <div className="h-screen bg-background flex flex-col font-sans overflow-hidden relative selection:bg-indigo-500/10 text-foreground">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Progress Header - Floating & Minimal */}
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

            {/* Main Interactive Stage - Dark Minimalist */}
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
                        {/* Left: Content & Interaction */}
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

                            {/* Option Grid - Dark buttons */}
                            <div className="grid grid-cols-1 gap-3 max-w-md">
                                {question.options.map((option) => (
                                    <button
                                        key={option}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(option)}
                                        className={cn(
                                            "relative p-6 rounded-[24px] border transition-all text-left group overflow-hidden bg-white/5 backdrop-blur-sm",
                                            selectedOption === option
                                                ? "border-indigo-500 ring-4 ring-indigo-500/20 bg-indigo-500/10"
                                                : "border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10",
                                            isAnswered && option === question.correctAnswer && "border-emerald-500/50 bg-emerald-500/10 !text-emerald-400",
                                            isAnswered && selectedOption === option && selectedOption !== question.correctAnswer && "border-rose-500/50 bg-rose-500/10 !text-rose-400"
                                        )}
                                    >
                                        <div className="flex items-center relative z-10">
                                            <span className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center mr-5 font-heading font-bold text-sm border transition-all",
                                                selectedOption === option ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-indigo-400"
                                            )}>
                                                {option.charAt(0)}
                                            </span>
                                            <span className="font-heading font-bold text-xl tracking-tight">
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Visualization & Bot Guidance & Controls */}
                        <div className="flex flex-col space-y-8">
                            {/* Gate visualization Section */}
                            <div className="bg-white/5 rounded-[48px] p-8 border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl flex flex-col items-center justify-center min-h-[360px]">
                                {question.gateType && (
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
                                )}
                            </div>

                            {/* Bot & Integrated Controls Section */}
                            <div className="flex-1 flex flex-col items-center justify-between space-y-8 bg-white/5 rounded-[48px] p-10 border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all">
                                <VoltBot
                                    state={botState}
                                    message={botMessage}
                                    className="scale-110 !static"
                                />

                                {/* Integrated Action Button */}
                                <div className="w-full max-w-sm pt-8 border-t border-white/5">
                                    <button
                                        onClick={isAnswered ? handleContinue : handleCheck}
                                        disabled={!selectedOption}
                                        className={cn(
                                            "group relative w-full h-20 rounded-[2rem] font-heading font-black text-2xl flex items-center justify-center overflow-hidden transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl",
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
        </div>
    );
};
