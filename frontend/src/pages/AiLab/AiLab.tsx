import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, Scan, ShieldCheck, Cpu, Activity,
    Upload, Binary
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AiLab() {
    const [activeTab, setActiveTab] = useState<'voice' | 'vision'>('vision');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-500/10 overflow-hidden relative">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#f0f9ff,transparent)]" />
            </div>

            {/* Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-20">
                {/* Header Section */}
                <header className="mb-12 space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400 mb-2">
                        <Binary className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-mono tracking-[0.2em] uppercase font-bold">Research Division // AI Lab</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
                                CIRCUIT <span className="text-sky-600">VISION</span>
                            </h1>
                            <p className="text-slate-500 text-lg max-w-xl mt-4 leading-relaxed">
                                Neural processing engine for real-time hardware verification and biometric authentication.
                                Deploying ensemble ML models for digital forensics.
                            </p>
                        </div>

                        <div className="flex p-1 bg-white border-2 border-edge shadow-brutal-sm rounded-2xl">
                            {(['vision', 'voice'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden",
                                        activeTab === tab
                                            ? "text-white shadow-xl"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTabGlow"
                                            className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-600"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tab === 'vision' ? <Scan className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                        {tab.toUpperCase()} ENGINE
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'vision' ? (
                        <motion.div
                            key="vision"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Vision Panel */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="min-h-[340px] sm:min-h-0 sm:aspect-video bg-white rounded-3xl border border-slate-200 overflow-hidden group relative flex items-center justify-center p-6 sm:p-12 shadow-sm">
                                    <div className="absolute inset-0 bg-grid-slate-100 opacity-50" />

                                    <div className="relative text-center space-y-6">
                                        <div className="w-24 h-24 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                            <Upload className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Drop Circuit Blueprint</h3>
                                            <p className="text-slate-500 text-sm">PNG, JPG or PDF up to 25MB • Automated Surya-OCR Processing</p>
                                        </div>
                                        <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                            Select Workspace
                                        </button>
                                    </div>

                                    {/* Scanning Corner Lines */}
                                    <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
                                    <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-xl" />
                                    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-xl" />
                                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl" />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <MetricCard icon={Cpu} label="YOLOv8 Logic" value="Ready" active />
                                    <MetricCard icon={Activity} label="Latency" value="12ms" />
                                    <MetricCard icon={Binary} label="Confidence" value="98.2%" />
                                    <MetricCard icon={ShieldCheck} label="Compliance" value="Pass" />
                                </div>
                            </div>

                            <aside className="lg:col-span-4 space-y-6">
                                <div className="p-8 bg-white rounded-3xl border border-border-soft shadow-neo space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-sky-600" />
                                        Scanning Engine
                                    </h3>
                                    <div className="space-y-4">
                                        <ProgressItem label="Character Recognition" value={85} color="bg-sky-600" />
                                        <ProgressItem label="Layout Structuring" value={42} color="bg-sky-400" />
                                        <ProgressItem label="Compliance Audit" value={10} color="bg-slate-200" />
                                    </div>
                                    <hr className="border-slate-100" />
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Models</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Surya OCR', 'Layout-Gemma', 'Vision-v4', 'Rule-Base'].map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="voice"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Voice Guards */}
                            <div className="lg:col-span-2 p-6 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-8 relative">
                                <div className="absolute inset-0 bg-dot-slate-200 opacity-20" />

                                <div className="relative">
                                    <div className="w-48 h-48 bg-sky-50 rounded-full border border-sky-100 flex items-center justify-center">
                                        <div className="w-40 h-40 bg-sky-100/50 rounded-full border border-sky-200 flex items-center justify-center">
                                            <Mic className="w-16 h-16 text-sky-600 animate-pulse" />
                                        </div>
                                    </div>
                                    {/* Waveform Visualization Overlay would go here */}
                                </div>

                                <div className="max-w-md">
                                    <h3 className="text-3xl font-black mb-4 italic tracking-tight uppercase text-slate-900">Live <span className="text-sky-600">Analyze</span></h3>
                                    <p className="text-slate-500 italic">Streaming multilingual audio payload to ensemble ML validators. Real-time pitch and spectral analysis active.</p>
                                </div>

                                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                                    <button className="px-6 sm:px-10 py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20">
                                        <Activity className="w-5 h-5" />
                                        START SESSION
                                    </button>
                                    <button className="px-6 sm:px-10 py-4 bg-white text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
                                        UPLOAD CLIP
                                    </button>
                                </div>
                            </div>

                            <aside className="space-y-6">
                                <div className="p-8 bg-sky-50 rounded-3xl border border-sky-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black italic uppercase tracking-tighter text-sky-600">Deepfake Risk</h3>
                                        <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold">CRITICAL</span>
                                    </div>
                                    <div className="text-6xl font-black text-slate-900 mb-2">84<span className="text-sky-600 text-2xl tracking-normal">%</span></div>
                                    <p className="text-slate-500 text-sm">Synthetic signature detected in higher spectral bands. Probability of clone: High.</p>
                                </div>

                                <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Spectral Metrics</h3>
                                    <MetricRow label="Zero Crossing" value="4.2k" />
                                    <MetricRow label="Centroid" value="1.8kHz" />
                                    <MetricRow label="RMS Energy" value="-12dB" />
                                    <MetricRow label="Clone Prob" value="0.84" active />
                                </div>
                            </aside>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, active = false }: { icon: any, label: string, value: string, active?: boolean }) {
    return (
        <div className={cn(
            "p-5 rounded-2xl border transition-all duration-300 shadow-sm",
            active ? "bg-sky-600 text-white border-sky-700 shadow-sky-600/10" : "bg-white border-slate-200"
        )}>
            <Icon className={cn("w-5 h-5 mb-3", active ? "text-white" : "text-sky-600")} />
            <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", active ? "text-sky-100" : "text-slate-400")}>{label}</div>
            <div className={cn("text-lg font-black leading-none tracking-tight", active ? "text-white" : "text-slate-900")}>{value}</div>
        </div>
    );
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-700">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={cn("h-full", color)}
                />
            </div>
        </div>
    );
}

function MetricRow({ label, value, active = false }: { label: string, value: string, active?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
            <span className={cn("text-xs font-mono font-bold", active ? "text-sky-600" : "text-slate-600")}>{value}</span>
        </div>
    );
}
