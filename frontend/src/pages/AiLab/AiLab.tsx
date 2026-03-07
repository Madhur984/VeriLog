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
        <div className="min-h-screen bg-[#060a12] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1D24_1px,transparent_1px),linear-gradient(to_bottom,#1A1D24_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#1e3a8a,transparent)]" />
            </div>

            {/* Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <header className="mb-12 space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400 mb-2">
                        <Binary className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-mono tracking-[0.2em] uppercase font-bold">Research Division // AI Lab</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-blue-400">
                                CIRCUIT <span className="text-cyan-400">VISION</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-xl mt-4 leading-relaxed">
                                Neural processing engine for real-time hardware verification and biometric authentication.
                                Deploying ensemble ML models for digital forensics.
                            </p>
                        </div>

                        <div className="flex p-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl">
                            {(['vision', 'voice'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 relative overflow-hidden",
                                        activeTab === tab
                                            ? "text-white shadow-2xl"
                                            : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTabGlow"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
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
                                <div className="aspect-video bg-slate-950/50 rounded-3xl border border-white/5 overflow-hidden group relative flex items-center justify-center p-12">
                                    <div className="absolute inset-0 bg-grid-blueprint opacity-10" />

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
                                    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
                                    <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-xl" />
                                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-xl" />
                                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl" />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <MetricCard icon={Cpu} label="YOLOv8 Logic" value="Ready" active />
                                    <MetricCard icon={Activity} label="Latency" value="12ms" />
                                    <MetricCard icon={Binary} label="Confidence" value="98.2%" />
                                    <MetricCard icon={ShieldCheck} label="Compliance" value="Pass" />
                                </div>
                            </div>

                            <aside className="lg:col-span-4 space-y-6">
                                <div className="p-8 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/5 space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-cyan-400" />
                                        Scanning Engine
                                    </h3>
                                    <div className="space-y-4">
                                        <ProgressItem label="Character Recognition" value={85} color="bg-blue-500" />
                                        <ProgressItem label="Layout Structuring" value={42} color="bg-cyan-500" />
                                        <ProgressItem label="Compliance Audit" value={10} color="bg-slate-700" />
                                    </div>
                                    <hr className="border-white/5" />
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Models</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Surya OCR', 'Layout-Gemma', 'Vision-v4', 'Rule-Base'].map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400">
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
                            <div className="lg:col-span-2 p-12 bg-slate-950/50 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-8 relative">
                                <div className="absolute inset-0 bg-dot-blueprint opacity-5" />

                                <div className="relative">
                                    <div className="w-48 h-48 bg-cyan-500/5 rounded-full border border-cyan-500/20 flex items-center justify-center">
                                        <div className="w-40 h-40 bg-cyan-500/10 rounded-full border border-cyan-500/30 flex items-center justify-center">
                                            <Mic className="w-16 h-16 text-cyan-400 animate-pulse" />
                                        </div>
                                    </div>
                                    {/* Waveform Visualization Overlay would go here */}
                                </div>

                                <div className="max-w-md">
                                    <h3 className="text-3xl font-black mb-4 italic tracking-tight uppercase">Live <span className="text-blue-500">Analyze</span></h3>
                                    <p className="text-slate-500 italic">Streaming multilingual audio payload to ensemble ML validators. Real-time pitch and spectral analysis active.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button className="px-10 py-4 bg-cyan-500 text-[#060a12] font-black rounded-2xl hover:bg-cyan-400 transition-all flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        START SESSION
                                    </button>
                                    <button className="px-10 py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all border border-white/10">
                                        UPLOAD CLIP
                                    </button>
                                </div>
                            </div>

                            <aside className="space-y-6">
                                <div className="p-8 bg-blue-900/10 rounded-3xl border border-blue-500/20">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black italic uppercase tracking-tighter text-blue-400">Deepfake Risk</h3>
                                        <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold">CRITICAL</span>
                                    </div>
                                    <div className="text-6xl font-black text-white mb-2">84<span className="text-blue-500 text-2xl tracking-normal">%</span></div>
                                    <p className="text-slate-400 text-sm">Synthetic signature detected in higher spectral bands. Probability of clone: High.</p>
                                </div>

                                <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5 space-y-4">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Spectral Metrics</h3>
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
            "p-5 rounded-2xl border transition-all duration-300",
            active ? "bg-blue-500/10 border-blue-500/30" : "bg-slate-900/30 border-white/5"
        )}>
            <Icon className={cn("w-5 h-5 mb-3", active ? "text-blue-400" : "text-slate-500")} />
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
            <div className="text-lg font-black text-white leading-none tracking-tight">{value}</div>
        </div>
    );
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
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
            <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
            <span className={cn("text-xs font-mono font-bold", active ? "text-blue-400" : "text-slate-300")}>{value}</span>
        </div>
    );
}
