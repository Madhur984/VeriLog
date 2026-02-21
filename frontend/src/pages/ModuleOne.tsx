import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Zap, Lightbulb,
    Battery, CheckCircle2, AlertTriangle,
    Smartphone, Cpu, CarFront, Info,
    HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VoltBot } from '../components/ui/VoltBot';
import { cn } from '../lib/utils';
import { useColorScheme } from '../hooks/useColorScheme';
import { useUserStore } from '../stores/userStore';

/* ══════════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
 ══════════════════════════════════════════════════════════════════════ */

type Scene = 'intro' | 'lab' | 'quiz' | 'matching' | 'blanks' | 'diagnosis' | 'summary' | 'complete';

interface MatchItem {
    id: number;
    text: string;
    matchId: string;
}

interface MatchTarget {
    id: string;
    text: string;
}

/* ══════════════════════════════════════════════════════════════════════
   UTILITIES
 ══════════════════════════════════════════════════════════════════════ */

const SIGMA = (text: string) => <span className="font-mono text-blue-400">"{text}"</span>;

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTS
 ══════════════════════════════════════════════════════════════════════ */

export const ModuleOne: React.FC = () => {
    const navigate = useNavigate();
    const { firstName } = useUserStore();
    const [scheme] = useColorScheme();
    const isDark = scheme === 'dark';

    const [scene, setScene] = useState<Scene>('intro');
    const [step, setStep] = useState(0);

    // Theme tokens
    const t = {
        bg: isDark ? '#0f172a' : '#f8fafc',
        card: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f1f5f9' : '#0f172a',
        muted: isDark ? '#94a3b8' : '#64748b',
        border: isDark ? '#334155' : '#e2e8f0',
        accent: '#3b82f6',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
    };

    /* ── SCENE 1: INTRO ── */
    const introLines = [
        "Before logic. Before processors.",
        "There is one rule.",
        "Energy must return to its source.",
        "Let’s test your understanding."
    ];

    /* ── SCENE 2: LAB ── */
    const [wireConnected, setWireConnected] = useState(false);
    const [labDone, setLabDone] = useState(false);

    /* ── SCENE 3: QUIZ ── */
    const questions = [
        {
            q: "If voltage exists but no current flows, the circuit is:",
            options: ["Short circuit", "Open circuit", "High gain", "Amplified"],
            correct: 1,
            feedback: "Voltage alone does not guarantee flow."
        },
        {
            q: "If one wire in a working circuit breaks, what happens instantly?",
            options: ["Voltage increases", "Current stops", "Bulb dims slowly", "Battery drains faster"],
            correct: 1,
            feedback: "Current cannot partially flow in a broken loop."
        },
        {
            q: "In a simple bulb circuit, current:",
            options: ["Starts at bulb", "Is used up by bulb", "Flows in a closed loop", "Stays inside battery"],
            correct: 2,
            feedback: "This corrects common misunderstanding."
        }
    ];

    /* ── SCENE 4: MATCHING ── */
    const sourceItems: MatchItem[] = [
        { id: 1, text: "Source", matchId: "C" },
        { id: 2, text: "Load", matchId: "B" },
        { id: 3, text: "Open Circuit", matchId: "A" },
        { id: 4, text: "Closed Circuit", matchId: "D" },
        { id: 5, text: "Return Path", matchId: "E" },
    ];
    const targetItems: MatchTarget[] = [
        { id: "A", text: "Break in connection" },
        { id: "B", text: "Converts electrical energy" },
        { id: "C", text: "Provides potential difference" },
        { id: "D", text: "Continuous conducting loop" },
        { id: "E", text: "Completes the electrical cycle" },
    ];
    const [matches, setMatches] = useState<Record<number, string>>({});
    const [matchFeedback, setMatchFeedback] = useState<boolean | null>(null);

    /* ── SCENE 5: BLANKS ── */
    const [blankValue, setBlankValue] = useState("");
    const [blankFeedback, setBlankFeedback] = useState<boolean | null>(null);

    /* ── SCENE 6: DIAGNOSIS ── */
    const [diagnosisSelection, setDiagnosisSelection] = useState<number | null>(null);
    const [diagnosisFeedback, setDiagnosisFeedback] = useState<boolean | null>(null);

    /* ── NAVIGATION ── */
    const nextStep = () => {
        if (scene === 'intro') {
            if (step < introLines.length - 1) setStep(s => s + 1);
            else setScene('lab');
        } else if (scene === 'lab') {
            if (labDone) setScene('quiz');
        } else if (scene === 'quiz') {
            if (step < questions.length - 1) setStep(s => s + 1);
            else {
                setStep(0);
                setScene('matching');
            }
        } else if (scene === 'matching') {
            setScene('blanks');
        } else if (scene === 'blanks') {
            setScene('diagnosis');
        } else if (scene === 'diagnosis') {
            setScene('summary');
        } else if (scene === 'summary') {
            setScene('complete');
        }
    };

    const backStep = () => {
        // Limited back for sanity
        if (scene === 'quiz' && step > 0) setStep(s => s - 1);
        else if (scene === 'quiz') setScene('lab');
        else if (scene === 'matching') setScene('quiz');
        else if (scene === 'blanks') setScene('matching');
        else if (scene === 'diagnosis') setScene('blanks');
        else if (scene === 'summary') setScene('diagnosis');
    };

    console.log("Back available:", { backStep }); // Avoid unused warning

    /* ── HELPERS ── */
    const handleMatch = (itemId: number, targetId: string) => {
        setMatches(prev => ({ ...prev, [itemId]: targetId }));
    };

    const checkMatches = () => {
        const isCorrect = sourceItems.every(item => matches[item.id] === item.matchId);
        setMatchFeedback(isCorrect);
        if (isCorrect) setTimeout(nextStep, 1500);
    };

    const checkBlank = () => {
        const isCorrect = blankValue.toLowerCase().trim() === 'return';
        setBlankFeedback(isCorrect);
        if (isCorrect) setTimeout(nextStep, 1500);
    };

    const checkDiagnosis = (idx: number) => {
        setDiagnosisSelection(idx);
        const isCorrect = idx === 2; // Short circuit
        setDiagnosisFeedback(isCorrect);
        if (isCorrect) setTimeout(nextStep, 2000);
    };

    /* ── SCENE RENDERERS ── */

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate('/portal')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all hover:bg-slate-500/10" style={{ borderColor: t.border, color: t.muted }}>
                <ArrowLeft className="w-4 h-4" /> Exit Module
            </button>
            <div className="flex items-center gap-4">
                <div className="h-2 w-48 rounded-full overflow-hidden" style={{ background: t.border }}>
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.keys(SceneIndices).indexOf(scene) / (Object.keys(SceneIndices).length - 1)) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-mono" style={{ color: t.muted }}>Lvl 1: Closed Loops</span>
            </div>
        </div>
    );

    const SceneIndices: Record<Scene, number> = { intro: 0, lab: 1, quiz: 2, matching: 3, blanks: 4, diagnosis: 5, summary: 6, complete: 7 };

    return (
        <div className="min-h-screen w-full p-4 md:p-8 flex flex-col font-sans" style={{ background: t.bg, color: t.text }}>

            {scene !== 'intro' && scene !== 'complete' && renderHeader()}

            <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">

                    {/* SCENE 1: INTRO */}
                    {scene === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center gap-12 text-center"
                        >
                            <div className="relative">
                                <motion.div animate={{ scale: 1.5 }}>
                                    <VoltBot state="speaking" />
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-widest rounded-full border-2 border-white/20 shadow-xl"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    SIGMA
                                </motion.div>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <motion.h2
                                    key={step}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-3xl md:text-5xl font-bold tracking-tight italic"
                                >
                                    {SIGMA(introLines[step])}
                                </motion.h2>
                            </div>
                            <button
                                onClick={nextStep}
                                className="group mt-8 px-8 py-3 rounded-full bg-blue-600 text-white font-bold flex items-center gap-3 transition-all hover:bg-blue-700 hover:scale-105"
                            >
                                {step === introLines.length - 1 ? "ENTER LABORATORY" : "CONTINUE"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* SCENE 2: LAB */}
                    {scene === 'lab' && (
                        <motion.div
                            key="lab"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">The Circuit Lab</h1>
                                <p style={{ color: t.muted }}>Complete the path to energy's return.</p>
                            </div>

                            <div className="h-[400px] border-2 border-dashed rounded-3xl relative overflow-hidden flex items-center justify-center bg-black/5" style={{ borderColor: t.border }}>
                                {/* Virtual Circuit Board */}
                                <div className="relative w-full h-full flex items-center justify-center p-12">
                                    <div className="grid grid-cols-2 gap-32 items-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-8 rounded-3xl border-4 relative" style={{ borderColor: t.border, background: t.card }}>
                                                <Battery className="w-20 h-20 text-slate-400" />
                                                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-[10px] font-black text-red-500">+</div>
                                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-[10px] font-black text-blue-500">-</div>
                                            </div>
                                            <span className="text-xs font-black tracking-widest opacity-50 uppercase">ENERGY SOURCE</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-4 relative">
                                            <motion.div
                                                className="p-8 rounded-3xl border-4"
                                                style={{
                                                    borderColor: wireConnected ? t.success : t.border,
                                                    background: t.card,
                                                    boxShadow: wireConnected ? '0 0 50px rgba(34, 197, 94, 0.5)' : 'none'
                                                }}
                                                animate={wireConnected ? { scale: [1, 1.05, 1] } : {}}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Lightbulb className={cn("w-20 h-20 transition-all duration-700", wireConnected ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" : "text-slate-400")} />
                                            </motion.div>
                                            <span className="text-xs font-black tracking-widest opacity-50 uppercase">ENERGY LOAD</span>

                                            {/* Glow overlay */}
                                            {wireConnected && (
                                                <motion.div
                                                    className="absolute inset-0 bg-yellow-400/20 blur-[100px] -z-10 rounded-full"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Connection Line */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                        {/* Forward Path */}
                                        <motion.path
                                            d="M 330,200 L 460,200"
                                            stroke={wireConnected ? t.success : t.border}
                                            strokeWidth="6"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={wireConnected ? { pathLength: 1 } : { pathLength: 0.2 }}
                                        />

                                        {/* Magnetic Drop Box */}
                                        <g className="pointer-events-auto cursor-pointer" onClick={() => { setWireConnected(true); setLabDone(true); }}>
                                            <rect
                                                x="370" y="180" width="60" height="40"
                                                rx="12" fill={wireConnected ? t.success : t.accent}
                                                className="shadow-lg transition-colors border-2 border-white/20"
                                            />
                                            <motion.rect
                                                x="375" y="185" width="50" height="30"
                                                rx="10" stroke="white" strokeWidth="2" fill="none" opacity={0.3}
                                                animate={{ opacity: [0.1, 0.4, 0.1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            />
                                            <text x="400" y="205" textAnchor="middle" fill="white" className="text-[8px] font-black uppercase">SNAP</text>
                                        </g>

                                        {/* Return Path Visualization */}
                                        {wireConnected && (
                                            <motion.path
                                                d="M 460,240 Q 400,300 330,240"
                                                stroke={t.success}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray="4 4"
                                                animate={{ strokeDashoffset: [20, 0] }}
                                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            />
                                        )}
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 flex gap-6 items-center">
                                <div className="relative shrink-0">
                                    <VoltBot state={wireConnected ? "happy" : "thinking"} />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full shadow-lg border border-white/10">SIGMA</div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold flex items-center gap-2">
                                        MISSION FEEDBACK <Zap className="w-3 h-3 text-yellow-500" />
                                    </p>
                                    <p className="text-sm italic opacity-80">
                                        {wireConnected
                                            ? `Good, ${firstName || 'Engineer'}. You created a closed loop. Current now has a complete path. Energy is returning.`
                                            : "A bulb needs current, and current needs a path back to the battery. Snap the magnetic wire into place."}
                                    </p>
                                </div>
                            </div>

                            {labDone && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                                    <button onClick={nextStep} className="px-12 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-3">
                                        PROCEED TO QUIZ <ArrowRight />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* SCENE 3: QUIZ */}
                    {scene === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full max-w-2xl space-y-8"
                        >
                            <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-xl border border-slate-500/10">
                                <span className="text-xs uppercase font-black opacity-50">Checkpoint {step + 1}/{questions.length}</span>
                                <div className="flex gap-1">
                                    {questions.map((_, i) => (
                                        <div key={i} className={cn("h-1 w-8 rounded-full transition-all", i <= step ? "bg-blue-500" : "bg-slate-500/20")} />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold leading-tight">{questions[step].q}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions[step].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                if (idx === questions[step].correct) {
                                                    nextStep();
                                                }
                                            }}
                                            className="p-4 text-left rounded-2xl border-2 transition-all hover:bg-blue-500/5 hover:border-blue-500/50 group active:scale-[0.98]"
                                            style={{ borderColor: t.border, background: t.card }}
                                        >
                                            <span className="flex items-center gap-3 font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                {opt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-500/5 p-6 rounded-3xl border border-slate-500/10">
                                <div className="relative shrink-0">
                                    <VoltBot state="thinking" />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full shadow-lg border border-white/10">SIGMA</div>
                                </div>
                                <p className="text-sm opacity-70 italic">"Remember, the loop must be continuous for energy to flow."</p>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 4: MATCHING */}
                    {scene === 'matching' && (
                        <motion.div
                            key="matching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full space-y-12"
                        >
                            <div className="text-center">
                                <h1 className="text-3xl font-bold">Structural Thinking</h1>
                                <p style={{ color: t.muted }}>Match the components to their structural role.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                <div className="space-y-4">
                                    {sourceItems.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div
                                                className="flex-1 p-4 rounded-xl border-2 font-bold transition-all relative"
                                                style={{
                                                    borderColor: matches[item.id] ? t.accent : t.border,
                                                    background: t.card
                                                }}
                                            >
                                                {item.text}
                                                {matches[item.id] && (
                                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-mono">
                                                        {matches[item.id]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {targetItems.map(target => (
                                        <div key={target.id} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-mono font-black border border-blue-500/20">
                                                {target.id}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    // Simple cyclic matching for demo interaction
                                                    const nextUnmatched = sourceItems.find(s => !matches[s.id]);
                                                    if (nextUnmatched) handleMatch(nextUnmatched.id, target.id);
                                                }}
                                                className="flex-1 p-4 text-left rounded-xl border-2 text-sm transition-all hover:border-blue-500/30"
                                                style={{ borderColor: t.border, background: t.card }}
                                            >
                                                {target.text}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <button
                                    onClick={checkMatches}
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                                    disabled={Object.keys(matches).length < 5}
                                >
                                    VERIFY STRUCTURE
                                </button>
                                {matchFeedback === false && (
                                    <p className="text-red-500 text-sm font-bold animate-shake">Incorrect. Look closer at the definitions!</p>
                                )}
                                {matchFeedback === true && (
                                    <p className="text-green-500 text-sm font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" /> Spectacular! You are thinking structurally.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 5: BLANKS */}
                    {scene === 'blanks' && (
                        <motion.div key="blanks" className="w-full max-w-xl text-center space-y-12">
                            <div className="relative mx-auto w-fit">
                                <motion.div animate={{ scale: 1.2 }}>
                                    <VoltBot state="thinking" />
                                </motion.div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full shadow-lg border border-white/10">SIGMA</div>
                            </div>
                            <h2 className="text-3xl font-bold leading-relaxed">
                                In a working circuit, current must leave the source and <br />
                                <span className="relative inline-block px-4 py-1 mx-2 border-b-4 border-blue-500">
                                    <input
                                        type="text"
                                        placeholder="......"
                                        value={blankValue}
                                        onChange={e => setBlankValue(e.target.value)}
                                        className="bg-transparent border-none outline-none text-center w-32 font-mono uppercase tracking-widest text-blue-500 placeholder:opacity-30"
                                    />
                                </span>
                                to it.
                            </h2>
                            <button
                                onClick={checkBlank}
                                className="px-12 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:scale-105 transition-all"
                            >
                                CONFIRM CONCEPT
                            </button>
                            {blankFeedback === false && <p className="text-red-400 font-bold">Hint: "The loop must close. It must _____."</p>}
                        </motion.div>
                    )}

                    {/* SCENE 6: DIAGNOSIS */}
                    {scene === 'diagnosis' && (
                        <motion.div key="diagnosis" className="w-full space-y-12">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold">Safe Systems Diagnosis</h1>
                                <p style={{ color: t.muted }}>Pick the diagram that represents a dangerous failure.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Proper Loop', detail: 'Ideal path', icon: CheckCircle2, color: 'text-green-500' },
                                    { label: 'Open Loop', detail: 'Break in line', icon: AlertTriangle, color: 'text-amber-500' },
                                    { label: 'Short Circuit', detail: 'Bypasses load', icon: Zap, color: 'text-red-500' }
                                ].map((sys, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => checkDiagnosis(idx)}
                                        className={cn(
                                            "p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-6 group hover:scale-[1.02]",
                                            diagnosisSelection === idx ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/20" : ""
                                        )}
                                        style={{ borderColor: t.border, background: t.card }}
                                    >
                                        <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center p-3 transition-colors", sys.color)}>
                                            <sys.icon className="w-full h-full" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-black text-lg">{sys.label}</h3>
                                            <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{sys.detail}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {diagnosisFeedback !== null && (
                                <div className={cn("p-6 rounded-2xl border flex gap-6 items-center transition-all animate-in fade-in slide-in-from-bottom-4", diagnosisFeedback ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20")}>
                                    <div className="relative shrink-0">
                                        <VoltBot state={diagnosisFeedback ? "happy" : "sad"} />
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full shadow-lg border border-white/10">SIGMA</div>
                                    </div>
                                    <div>
                                        <p className="font-bold">{diagnosisFeedback ? "Correct!" : "Mistake."}</p>
                                        <p className="text-sm italic">
                                            {diagnosisFeedback
                                                ? "A short circuit allows excessive current. Engineering is not just about working systems — it's about safe systems."
                                                : "This is a failure, but is it the most 'dangerous' one? Re-examine the Short Circuit."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* SCENE 7: SUMMARY & TRIVIA */}
                    {scene === 'summary' && (
                        <motion.div key="summary" className="w-full space-y-12">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold italic tracking-tighter">SIGMA RECAP</h1>
                                <p style={{ color: t.muted }}>Return path integrity defines reliability.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: 'Smartphone', icon: Smartphone, desc: 'Ground line break = No power even if battery is full.' },
                                    { title: 'PCB Failure', icon: Cpu, desc: 'Microscopic trace snap = Entire motherboard fails.' },
                                    { title: 'Electric Vehicle', icon: CarFront, desc: 'Loose return path = Catastrophic pack failure.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl border border-slate-500/10 bg-slate-500/5 space-y-3">
                                        <item.icon className="w-6 h-6 text-blue-500" />
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-xs leading-relaxed opacity-60">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden group">
                                <Info className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-widest opacity-70">Project Trivia</h3>
                                    <p className="text-xl font-medium leading-normal">
                                        "Did you know? In early space missions, microscopic wiring faults caused system failures worth millions of dollars."
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button onClick={nextStep} className="px-12 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:scale-105 transition-all">
                                    FINISH JOURNEY
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* FINAL COMPLETION */}
                    {scene === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-12"
                        >
                            <div className="relative mx-auto w-fit">
                                <motion.div animate={{ scale: 2 }}>
                                    <VoltBot state="happy" />
                                </motion.div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[12px] font-black rounded-full shadow-lg border-2 border-white/20">SIGMA</div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black italic tracking-tight">"MODULE CLEARED"</h1>
                                <p className="text-lg opacity-60 max-w-md mx-auto">
                                    You now understand the foundation. Every digital system you will build rests on this rule.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-blue-500 font-bold tracking-widest uppercase text-xs">Aspirational Goal</p>
                                <p className="mt-2 text-sm italic">"Next, we introduce control."</p>
                            </div>
                            <button
                                onClick={() => navigate('/portal')}
                                className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:scale-105 transition-all border border-slate-700"
                            >
                                BACK TO STATION MAP
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* Hint overlay for impatient learners */}
            {scene !== 'intro' && scene !== 'complete' && (
                <div className="fixed bottom-8 left-8">
                    <button className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 hover:scale-110 transition-all">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};
