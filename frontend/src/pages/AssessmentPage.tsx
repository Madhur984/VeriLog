import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ResistorBot } from '../components/ui/ResistorBot';
import { LogicGate3D } from '../components/ui/LogicGate3D';

interface Question {
    id: number;
    text: string;
    subtext?: string;
    gateType?: 'and' | 'or' | 'nand' | 'nor' | 'not';
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Identify the expression",
        subtext: "Y = (A \cdot B)' represents which logic gate symbol?",
        gateType: 'nand',
        options: ['AND', 'OR', 'NAND', 'NOR'],
        correctAnswer: 'NAND',
        explanation: "AND followed by NOT is NAND. (A \cdot B)' is the algebraic form."
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
    }
];

import { BreadboardCard } from '../components/ui/BreadboardCard';

export const AssessmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [botState, setBotState] = useState<'idle' | 'speaking' | 'happy' | 'sad' | 'thinking'>('speaking');
    const [botMessage, setBotMessage] = useState("Welcome, Cadet! Let's test your logic circuits.");

    const question = QUESTIONS[currentStep];

    const handleCheck = () => {
        if (!selectedOption) return;

        const correct = selectedOption === question.correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setBotState('happy');
            setBotMessage("Binary Perfection! Signal flow confirmed.");
        } else {
            setBotState('sad');
            setBotMessage(`Logic error detected. ${question.explanation}`);
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

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans overflow-hidden relative">
            {/* Laboratory Circuit Trace Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                    <path d="M0 100h200v200h200v-100h200v300h400" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="10 5" />
                    <path d="M1000 300H800V100H600v200H400V0H0" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="10 5" />
                    <path d="M200 1000V800H0m400 200V900h200v100m400-300V600h-200v200H0" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="10 5" />
                    <circle cx="200" cy="100" r="4" fill="#22d3ee" />
                    <circle cx="400" cy="300" r="4" fill="#22d3ee" />
                    <circle cx="600" cy="200" r="4" fill="#22d3ee" />
                    <circle cx="800" cy="300" r="4" fill="#22d3ee" />
                </svg>
            </div>

            {/* Progress Header */}
            <header className="relative z-20 max-w-5xl w-full mx-auto pt-8 px-6 flex items-center space-x-6">
                <button onClick={() => navigate('/home')} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-white/10">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-500"
                    />
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-2xl border border-white/5 text-cyan-400 font-mono font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm">MODULE {currentStep + 1}</span>
                </div>
            </header>

            {/* Main Interactive Stage */}
            <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12 overflow-y-auto">
                <div className="flex-1 w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <BreadboardCard title="Laboratory Junction // 0x42">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-heading font-black text-slate-900 leading-[1.1] tracking-tight">
                                            {question.text}
                                        </h2>
                                        <p className="text-xl text-slate-500 font-medium">
                                            {question.subtext}
                                        </p>
                                    </div>

                                    {/* Component Display */}
                                    {question.gateType && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative"
                                        >
                                            <LogicGate3D type={question.gateType} />
                                            <div className="absolute top-4 right-4 bg-slate-900 px-3 py-1 rounded-lg">
                                                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">3D_MODEL_VIEW</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Option Selection Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {question.options.map((option) => (
                                            <button
                                                key={option}
                                                disabled={isAnswered}
                                                onClick={() => setSelectedOption(option)}
                                                className={cn(
                                                    "relative p-6 rounded-2xl border-4 transition-all text-left group overflow-hidden",
                                                    selectedOption === option
                                                        ? "bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                                                    isAnswered && option === question.correctAnswer && "border-signal-success/40 bg-signal-success/5 !text-signal-success",
                                                    isAnswered && selectedOption === option && selectedOption !== question.correctAnswer && "border-signal-error/40 bg-signal-error/5 !text-signal-error"
                                                )}
                                            >
                                                <div className="flex items-center relative z-10 transition-transform group-active:scale-95">
                                                    <span className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-mono font-bold text-lg border-2 transition-colors",
                                                        selectedOption === option ? "bg-cyan-500 border-cyan-400 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-400"
                                                    )}>
                                                        {String.fromCharCode(65 + question.options.indexOf(option))}
                                                    </span>
                                                    <span className="font-heading font-black text-xl tracking-tight">
                                                        {option}
                                                    </span>
                                                </div>
                                                {/* Selected Glow Effect */}
                                                {selectedOption === option && (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </BreadboardCard>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Assistant Overlay (Corner Fixed) */}
            <ResistorBot state={botState} message={botMessage} />

            {/* Lab Control Bar */}
            <footer className={cn(
                "relative z-30 py-8 px-8 border-t-4 transition-all duration-500 backdrop-blur-md",
                isAnswered
                    ? (isCorrect ? "bg-signal-success/10 border-signal-success/30" : "bg-signal-error/10 border-signal-error/30")
                    : "bg-slate-900/80 border-slate-800"
            )}>
                <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
                    <div className="flex-1">
                        <AnimatePresence>
                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center space-x-5"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                        isCorrect ? "bg-signal-success text-white shadow-signal-success/30" : "bg-signal-error text-white shadow-signal-error/30"
                                    )}>
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "font-heading font-black text-2xl uppercase tracking-wider italic",
                                            isCorrect ? "text-signal-success" : "text-signal-error"
                                        )}>
                                            {isCorrect ? "SYSTEM_OPTIMAL" : "CIRCUIT_BREAKER_TRIPPED"}
                                        </p>
                                        <p className="font-mono text-sm text-slate-400 font-bold">
                                            {isCorrect ? "SYNC COMPLETE // 100% SIGNAL STRENGTH" : `REPAIR PATH: ${question.correctAnswer}`}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={isAnswered ? handleContinue : handleCheck}
                        disabled={!selectedOption}
                        className={cn(
                            "relative group px-14 py-5 rounded-2xl font-heading font-black text-2xl flex items-center overflow-hidden transition-all active:scale-95 shadow-2xl disabled:opacity-50",
                            !isAnswered
                                ? "bg-cyan-500 text-slate-900 hover:shadow-cyan-500/20"
                                : (isCorrect ? "bg-signal-success text-white" : "bg-signal-error text-white")
                        )}
                    >
                        <span className="relative z-10 flex items-center">
                            {isAnswered ? "NEXT_MODULE" : "INIT_CHECK"}
                            <ChevronRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </div>
            </footer>
        </div>
    );
};
