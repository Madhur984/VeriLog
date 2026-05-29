import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { NodeType } from '../../mure/core/SignalNode';
import { ArrowRight } from 'lucide-react';

export const CircuitComplexityDemo: React.FC<{ onComplete: () => void; isDarkMode?: boolean }> = ({ onComplete, isDarkMode = true }) => {
    const studio = useLogicStudio();

    // Build the complex circuit: F = A'BC + ABC + AB'C
    useEffect(() => {
        if (studio.canvasNodes.length > 0) return;

        // Switches
        const nA = studio.addNode(NodeType.SWITCH, 50, 100, { label: 'A' });
        const nB = studio.addNode(NodeType.SWITCH, 50, 300, { label: 'B' });
        const nC = studio.addNode(NodeType.SWITCH, 50, 500, { label: 'C' });

        // Inverters
        const notA = studio.addNode(NodeType.NOT, 200, 150);
        const notB = studio.addNode(NodeType.NOT, 200, 350);

        const engine = studio.getEngine();
        engine.connectNodes(nA, 0, notA, 0);
        engine.connectNodes(nB, 0, notB, 0);

        // Term 1: A'BC
        const and1 = studio.addNode(NodeType.AND, 400, 100);
        engine.connectNodes(notA, 0, and1, 0);
        engine.connectNodes(nB, 0, and1, 1);
        const and1_2 = studio.addNode(NodeType.AND, 550, 150);
        engine.connectNodes(and1, 0, and1_2, 0);
        engine.connectNodes(nC, 0, and1_2, 1);

        // Term 2: ABC
        const and2 = studio.addNode(NodeType.AND, 400, 300);
        engine.connectNodes(nA, 0, and2, 0);
        engine.connectNodes(nB, 0, and2, 1);
        const and2_2 = studio.addNode(NodeType.AND, 550, 350);
        engine.connectNodes(and2, 0, and2_2, 0);
        engine.connectNodes(nC, 0, and2_2, 1);

        // Term 3: AB'C
        const and3 = studio.addNode(NodeType.AND, 400, 500);
        engine.connectNodes(nA, 0, and3, 0);
        engine.connectNodes(notB, 0, and3, 1);
        const and3_2 = studio.addNode(NodeType.AND, 550, 550);
        engine.connectNodes(and3, 0, and3_2, 0);
        engine.connectNodes(nC, 0, and3_2, 1);

        // Or combine
        const or1 = studio.addNode(NodeType.OR, 750, 250);
        engine.connectNodes(and1_2, 0, or1, 0);
        engine.connectNodes(and2_2, 0, or1, 1);

        const orFinal = studio.addNode(NodeType.OR, 900, 400);
        engine.connectNodes(or1, 0, orFinal, 0);
        engine.connectNodes(and3_2, 0, orFinal, 1);

        // Output LED
        const led = studio.addNode(NodeType.LED, 1050, 400, { label: 'F' });
        engine.connectNodes(orFinal, 0, led, 0);

        studio.play();
    }, [studio]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto px-10">
            <div className="text-center mb-4">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyan-500 font-black mb-2 block">
                    Scene 5.1 - The Complexity Problem
                </span>
                <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
                    Boolean Expression Translation
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans font-medium max-w-2xl mx-auto leading-relaxed`}>
                    Notice how many gates are required to implement $F = A'BC + ABC + AB'C$<br />
                    More gates mean more heat, higher cost, and slower propagation delay.
                </p>
            </div>

            <div className={`relative w-full h-[650px] rounded-3xl border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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

                {/* Telemetry Panel */}
                <div className={`absolute top-4 right-4 p-4 rounded-2xl border backdrop-blur-xl min-w-[200px] transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200/50 shadow-lg'}`}>
                    <div className="font-mono text-[10px] text-cyan-500 font-bold uppercase tracking-[0.15em] mb-4">Circuit Metrics</div>
                    <div className="grid grid-cols-[1fr_auto] gap-y-3 gap-x-4 font-mono text-xs">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Total Gates</span>
                        <span className="text-rose-500 font-black text-right">11</span>

                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Logic Depth</span>
                        <span className="text-rose-500 font-black text-right">4 levels</span>

                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Est. Delay</span>
                        <span className="text-rose-500 font-black text-right">40 ns</span>
                    </div>
                </div>

                {/* Check button overlay */}
                <div className="absolute bottom-6 right-6 z-10">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className={`px-6 py-3 rounded-xl border font-mono text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 backdrop-blur-md transition-colors duration-300 ${
                            isDarkMode 
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20' 
                            : 'bg-cyan-50 border-cyan-200 text-cyan-600 hover:bg-cyan-100'
                        }`}
                    >
                        PROCEED TO K-MAP <ArrowRight size={16} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
