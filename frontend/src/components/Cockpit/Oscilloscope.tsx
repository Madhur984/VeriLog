import { Activity, Radio } from 'lucide-react';

export const Oscilloscope = () => {
    return (
        <div className="flex flex-col h-full bg-deep-void">
            {/* Header */}
            <div className="h-10 bg-panel-grey border-b border-bezel-grey flex items-center px-4 font-heading text-sm text-slate-300">
                <Activity className="w-4 h-4 mr-2 text-signal-blue" />
                OSCILLOSCOPE
            </div>

            {/* Display Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col p-4">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Signals */}
                <div className="space-y-6 relative z-10 mt-4">
                    {/* Signal A */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                            <span>CLK_A</span>
                            <span className="text-terminal-green">HIGH</span>
                        </div>
                        <div className="h-12 border border-bezel-grey bg-black/40 rounded relative overflow-hidden group">
                            {/* Mock Waveform */}
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,40 H20 V10 H60 V40 H100 V10 H140 V40 H180"
                                    fill="none"
                                    stroke="#00DC82"
                                    strokeWidth="2"
                                    className="drop-shadow-[0_0_5px_rgba(0,220,130,0.5)]"
                                />
                            </svg>
                            {/* Scanline */}
                            <div className="absolute inset-y-0 right-0 w-[2px] bg-xp-gold opacity-50 animate-[scan_2s_linear_infinite]" />
                        </div>
                    </div>

                    {/* Signal B */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                            <span>DATA_IN</span>
                            <span className="text-signal-blue">LOW</span>
                        </div>
                        <div className="h-12 border border-bezel-grey bg-black/40 rounded relative overflow-hidden">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,40 H80 V10 H120 V40 H200"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    className="drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Footer */}
            <div className="h-12 border-t border-bezel-grey bg-panel-grey flex items-center justify-between px-4 text-xs font-mono">
                <div className="flex items-center text-slate-400">
                    <Radio className="w-3 h-3 mr-2 animate-pulse text-bug-red" />
                    <span>LIVE CAPTURE</span>
                </div>
                <div className="text-slate-500">
                    T: 50ns/div
                </div>
            </div>
        </div>
    );
};
