import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import { parseSOP, parsePOS } from '../../../../shared/utils/booleanEngine';
import type { CircuitForm, PhaseCState } from '../ModuleD1.types';

const PHASE_COLOR = '#22C55E';
const VARS = ['A', 'B', 'C'];

interface C1Props { 
  sceneIndex: number; 
  currentScene: number; 
  expressionInput: string;
  circuitMode: CircuitForm;
  signalTrace: PhaseCState['signalTrace'];
  onCircuitModeChange: (mode: CircuitForm) => void;
  onSignalTraceChange: (trace: PhaseCState['signalTrace']) => void;
}

const C1_TwoLevelRealisation: React.FC<C1Props> = ({ 
  sceneIndex, currentScene, expressionInput, circuitMode, signalTrace,
  onCircuitModeChange, onSignalTraceChange 
}) => {
  const isActive = currentScene === sceneIndex;
  
  const minterms = React.useMemo(() => parseSOP(expressionInput, VARS), [expressionInput]);
  const maxterms = React.useMemo(() => parsePOS(expressionInput, VARS), [expressionInput]);

  const toggleInput = (idx: number) => {
    const nextInputs = [...signalTrace.inputValues];
    nextInputs[idx] = !nextInputs[idx];
    onSignalTraceChange({ ...signalTrace, inputValues: nextInputs, active: true });
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="THE TWO-LEVEL STANDARD" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Physical <span className="text-green-500">Topology</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            All canonical logic maps to a mandatory 2-level structure. First level identifies the terms; second level collects them into the result.
          </p>
        </motion.div>

        {/* Interactive Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            {/* Logic Toggle Column */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-3 flex flex-col gap-4"
            >
                <div className="text-[10px] font-mono font-black italic text-green-500/60 uppercase tracking-widest mb-2">Select_Architecture</div>
                <button 
                    onClick={() => onCircuitModeChange('AND-OR')}
                    className={`group relative p-6 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left ${circuitMode === 'AND-OR' ? 'bg-green-500/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-transparent opacity-40 hover:opacity-70'}`}
                >
                    <span className="text-[10px] font-mono font-black italic uppercase tracking-widest text-green-500">SOP / HIGH_PATH</span>
                    <span className="text-xl font-mono font-black italic text-white uppercase">AND-OR COLLECTOR</span>
                    {circuitMode === 'AND-OR' && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                </button>
                <button 
                    onClick={() => onCircuitModeChange('OR-AND')}
                    className={`group relative p-6 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left ${circuitMode === 'OR-AND' ? 'bg-green-500/10 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-transparent opacity-40 hover:opacity-70'}`}
                >
                    <span className="text-[10px] font-mono font-black italic uppercase tracking-widest text-green-500">POS / LOW_PATH</span>
                    <span className="text-xl font-mono font-black italic text-white uppercase">OR-AND COLLECTOR</span>
                    {circuitMode === 'OR-AND' && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                </button>
            </motion.div>

            {/* Main Stage */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className="lg:col-span-6 bg-black/40 backdrop-blur-md rounded-[56px] border-2 border-green-500/10 p-12 shadow-2xl relative min-h-[500px] flex items-center justify-center overflow-hidden"
            >
                <div className="absolute top-8 left-12 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-black italic text-green-500/60 uppercase tracking-widest">Topology_Scanner // V7.2</span>
                </div>

                <CircuitCanvas
                    form={circuitMode}
                    minterms={circuitMode === 'AND-OR' ? minterms : undefined}
                    maxterms={circuitMode === 'OR-AND' ? maxterms : undefined}
                    variables={VARS}
                    inputValues={signalTrace.inputValues}
                    width={440}
                    height={340}
                />
            </motion.div>

            {/* Input Controller Column */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-3 flex flex-col gap-4"
            >
                <div className="text-[10px] font-mono font-black italic text-green-500/60 uppercase tracking-widest mb-2 text-right">Stimulus_Injection</div>
                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                    {VARS.map((v, i) => (
                        <button
                            key={v}
                            onClick={() => toggleInput(i)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${signalTrace.inputValues[i] ? 'bg-green-500/20 border-green-500/50 text-white' : 'bg-white/5 border-transparent text-white/30'}`}
                        >
                            <span className="text-xl font-mono font-black italic">{v}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-black ${signalTrace.inputValues[i] ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`}>
                                {signalTrace.inputValues[i] ? '1' : '0'}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-auto p-5 rounded-2xl bg-black/60 border border-green-500/20">
                    <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3 italic">Signal_Metrology</div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/40">Propagation</span>
                            <span className="text-green-500">2_CLKS</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/40">Gate_Cost</span>
                            <span className="text-green-500">{circuitMode === 'AND-OR' ? minterms.length + 1 : maxterms.length + 1}U</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="flex justify-center gap-12 w-full max-w-4xl opacity-30 text-[10px] font-mono font-black italic uppercase tracking-widest">
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                Double Negation Invariant
            </span>
            <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                Zero Cost Conversion
            </span>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C1_TwoLevelRealisation;
