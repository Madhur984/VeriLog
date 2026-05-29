import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { NodeType } from '../../mure/core/SignalNode';
import { CheckCircle2, Zap, Cpu, Activity } from 'lucide-react';

export const OptimizationComparison: React.FC<{ onComplete: () => void; isDarkMode?: boolean }> = ({ onComplete, isDarkMode = true }) => {
    const studio = useLogicStudio();
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        if (studio.canvasNodes.length > 0) return;

        // Build the optimized circuit: F = C
        studio.addNode(NodeType.SWITCH, 100, 150, { label: 'A' });
        studio.addNode(NodeType.SWITCH, 100, 300, { label: 'B' });
        const nC = studio.addNode(NodeType.SWITCH, 100, 450, { label: 'C' });

        const led = studio.addNode(NodeType.LED, 600, 450, { label: 'F' });

        const engine = studio.getEngine();
        // The entire function simplifies to just C!
        engine.connectNodes(nC, 0, led, 0);

        studio.play();
        setTimeout(() => setIsSimulating(true), 500);

    }, [studio]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-10">
            <div className="text-center mb-4">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-emerald-500 font-black mb-2 block">
                    Scene 5.6 - The Power of Optimization
                </span>
                <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
                    From 11 Gates to 0
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans font-medium max-w-2xl mx-auto leading-relaxed`}>
                    The complex expression $F = A'BC + ABC + AB'C$ simplifies entirely to $F = C$.
                    Notice how changes in A or B have no effect on the output.
                    This is why hardware engineers use Karnaugh Maps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── Before (Unoptimized) Metrics ── */}
                <div className={`p-8 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Before Optimization</h3>

                    <div className="flex flex-col gap-4">
                        <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Cpu size={18} className="opacity-50" />
                                <span className="font-mono text-sm">Total Gates</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-rose-500">11</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Activity size={18} className="opacity-50" />
                                <span className="font-mono text-sm">Logic Depth</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-rose-500">4 levels</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Zap size={18} className="opacity-50" />
                                <span className="font-mono text-sm">Transistor Count</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-rose-500">66</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Activity size={18} className="opacity-50" />
                                <span className="font-mono text-sm">Est. Power (mW)</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-rose-500">142</span>
                        </div>
                    </div>
                </div>

                {/* ── After (Optimized) Metrics ── */}
                <div className={`p-8 rounded-3xl border relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(16,185,129,0.15) 0%, transparent 50%)' }} />
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-emerald-500 relative z-10">After Optimization</h3>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-100/50 border-emerald-200'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Cpu size={18} className="text-emerald-500" />
                                <span className="font-mono text-sm">Total Gates</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-emerald-500">0</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-100/50 border-emerald-200'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Activity size={18} className="text-emerald-500" />
                                <span className="font-mono text-sm">Logic Depth</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-emerald-500">0 levels</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-100/50 border-emerald-200'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Zap size={18} className="text-emerald-500" />
                                <span className="font-mono text-sm">Transistor Count</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-emerald-500">0*</span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-100/50 border-emerald-200'}`}>
                            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Activity size={18} className="text-emerald-500" />
                                <span className="font-mono text-sm">Est. Power (mW)</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-emerald-500">~0</span>
                        </div>
                    </div>
                    <div className={`text-[9px] text-right mt-3 font-mono ${isDarkMode ? 'text-emerald-500/50' : 'text-emerald-700/50'}`}>*Direct connection (wire only)</div>
                </div>
            </div>

            {/* Live Interactive Circuit */}
            <div className={`w-full h-[400px] rounded-3xl border relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-950 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-slate-50 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}>
                <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-md backdrop-blur-md border ${isDarkMode ? 'bg-slate-900/80 border-slate-700 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
                    <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-emerald-500">LIVE OPTIMIZED CIRCUIT: F = C</span>
                </div>

                {isSimulating && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="font-mono text-[10px] text-emerald-500 tracking-[0.1em] font-bold">SIMULATION ACTIVE</span>
                    </div>
                )}

                <StudioCanvas
                    nodes={studio.canvasNodes}
                    edges={studio.getNodeEdges()}
                    selectedNodeId={studio.selectedNodeId}
                    mode={studio.mode}
                    wireStart={studio.wireStart}
                    snapshot={studio.snapshot}
                    xrayEnabled={studio.xrayEnabled}
                    onSelectNode={studio.setSelectedNodeId}
                    onMoveNode={studio.moveNode}
                    onStartWire={studio.startWire}
                    onCompleteWire={studio.completeWire}
                    onCancelWire={studio.cancelWire}
                    onToggleProbe={studio.toggleProbe}
                    onRemoveNode={studio.removeNode}
                />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className={`px-8 py-4 rounded-xl font-mono text-sm font-black uppercase tracking-[0.15em] flex items-center gap-3 transition-colors duration-300 ${
                            isDarkMode ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)]' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg'
                        }`}
                    >
                        <CheckCircle2 size={20} />
                        COMPLETE LEVEL 5
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
