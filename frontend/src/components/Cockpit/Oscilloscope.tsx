import { Activity, Radio } from 'lucide-react';

export const Oscilloscope = () => {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 font-heading text-sm text-slate-600">
                <Activity className="w-4 h-4 mr-2 text-sky-600" />
                OSCILLOSCOPE
            </div>

            {/* Display Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col p-4">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Signals */}
                <div className="space-y-6 relative z-10 mt-4">
                    {/* Signal A */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                            <span>CLK_A</span>
                            <span className="text-emerald-600 font-bold">HIGH</span>
                        </div>
                        <div className="h-12 border border-slate-200 bg-slate-50/50 rounded relative overflow-hidden group">
                            {/* Mock Waveform */}
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,40 H20 V10 H60 V40 H100 V10 H140 V40 H180"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                />
                            </svg>
                            {/* Scanline */}
                            <div className="absolute inset-y-0 right-0 w-[2px] bg-amber-500 opacity-50 animate-[scan_2s_linear_infinite]" />
                        </div>
                    </div>

                    {/* Signal B */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                            <span>DATA_IN</span>
                            <span className="text-sky-600 font-bold">LOW</span>
                        </div>
                        <div className="h-12 border border-slate-200 bg-slate-50/50 rounded relative overflow-hidden">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,40 H80 V10 H120 V40 H200"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Footer */}
            <div className="h-12 border-t border-slate-200 bg-slate-50 flex items-center justify-between px-4 text-xs font-mono">
                <div className="flex items-center text-slate-500">
                    <Radio className="w-3 h-3 mr-2 animate-pulse text-rose-600" />
                    <span>LIVE CAPTURE</span>
                </div>
                <div className="text-slate-400">
                    T: 50ns/div
                </div>
            </div>
        </div>
    );
};
