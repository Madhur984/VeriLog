import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { VoltBot } from '../components/ui/VoltBot';
import { LogicGateSVG } from '../components/ui/LogicGateSVG';
import { BreadboardCard } from '../components/ui/BreadboardCard';

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
    }
];

export const AssessmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [botState, setBotState] = useState<'idle' | 'speaking' | 'happy' | 'sad' | 'thinking'>('speaking');
    const [botMessage, setBotMessage] = useState("Dark mode engaged. Initiating high-fidelity logic scan.");

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
        <div className="min-h-screen bg-[#020617] flex flex-col font-sans overflow-hidden relative">
            {/* Laboratory Circuit Trace Background */}
            <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                    <path d="M0 100h200v200h200v-100h200v300h400" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <path d="M1000 300H800V100H600v200H400V0H0" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <path d="M200 1000V800H0m400 200V900h200v100m400-300V600h-200v200H0" fill="none" stroke="#1e293b" strokeWidth="1" />

                    {/* Glowing nodes */}
                    <circle cx="200" cy="100" r="3" fill="#0ea5e9" className="animate-pulse" />
                    <circle cx="400" cy="300" r="3" fill="#0ea5e9" className="animate-pulse [animation-delay:1s]" />
                    <circle cx="600" cy="200" r="3" fill="#0ea5e9" className="animate-pulse [animation-delay:2s]" />
                </svg>
            </div>

            {/* Progress Header */}
            <header className="relative z-20 max-w-5xl w-full mx-auto pt-8 px-6 flex items-center space-x-6">
                <button onClick={() => navigate('/home')} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-slate-800">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-500"
                    />
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-cyan-400 font-mono font-bold">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-sm">SYS_MOD_{currentStep + 1}</span>
                </div>
            </header>

            {/* Main Interactive Stage */}
            <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12 overflow-y-auto">
                <div className="flex-1 w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <BreadboardCard variant="minimal-round" title="Logic Analysis Junction // 0xAF">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-heading font-black text-white leading-[1.1] tracking-tight">
                                            {question.text}
                                        </h2>
                                        <p className="text-xl text-slate-400 font-medium">
                                            {question.subtext}
                                        </p>
                                    </div>

                                    {/* Component Display (SVG GATES) */}
                                    {question.gateType && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="relative flex justify-center"
                                        >
                                            <LogicGateSVG
                                                type={question.gateType}
                                                interactionState={isAnswered ? (isCorrect ? 'success' : 'error') : (selectedOption ? 'active' : 'idle')}
                                            />
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
                                                    "relative p-6 rounded-[28px] border-2 transition-all text-left group overflow-hidden",
                                                    selectedOption === option
                                                        ? "bg-primary/10 border-primary/50 text-white shadow-[0_0_20px_rgba(58,134,255,0.1)]"
                                                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60",
                                                    isAnswered && option === question.correctAnswer && "border-signal-digital/50 bg-signal-digital/10 !text-signal-digital",
                                                    isAnswered && selectedOption === option && selectedOption !== question.correctAnswer && "border-rose-500/50 bg-rose-500/10 !text-rose-400"
                                                )}
                                            >
                                                <div className="flex items-center relative z-10 transition-transform group-active:scale-95">
                                                    <span className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-mono font-bold text-lg border-2 transition-colors",
                                                        selectedOption === option ? "bg-cyan-500 border-cyan-400 text-slate-950" : "bg-slate-950 border-slate-800 text-slate-500"
                                                    )}>
                                                        {option.charAt(0)}
                                                    </span>
                                                    <span className="font-heading font-black text-xl tracking-tight uppercase">
                                                        {option}
                                                    </span>
                                                </div>
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
            <VoltBot state={botState} message={botMessage} className="fixed bottom-8 right-8 scale-90" />

            {/* Lab Control Bar */}
            <footer className={cn(
                "relative z-30 py-8 px-8 border-t-4 transition-all duration-500 backdrop-blur-md",
                isAnswered
                    ? (isCorrect ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30")
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
                                        isCorrect ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-rose-500 text-white shadow-rose-500/30"
                                    )}>
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "font-heading font-black text-2xl uppercase tracking-wider italic",
                                            isCorrect ? "text-emerald-400" : "text-rose-400"
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
                                ? "bg-cyan-500 text-slate-950 hover:shadow-cyan-500/20"
                                : (isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")
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
