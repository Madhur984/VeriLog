import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Wrench, Lightbulb, LightbulbOff, Cpu } from 'lucide-react';
import { GATE_META } from '../../utils/gateMeta';
import { getGateIcon } from './GateIcons';

export const GateIntro: React.FC<{isActive: boolean, isDarkMode: boolean}> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
    const bgCard = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            <section className="text-center space-y-4">
                <motion.span
                    initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    Digital Electronics — Chapter 4.1
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Logic Gates 101</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    The fundamental building blocks of computers.
                </p>
            </section>

            <div className={`p-10 rounded-[2rem] border ${bgCard}`}>
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-6 ${subTextColor}`}>The Absolute Simplest Explanation</h3>
                <p className={`text-base leading-relaxed opacity-80 ${textColor} mb-6`}>
                    You don’t need an electronics background. Just imagine you’re making <strong>decisions</strong> based on yes/no questions. That’s what logic gates do – they take one or more <strong>yes/no (1/0) inputs</strong> and produce a <strong>yes/no output</strong> following a fixed rule.
                </p>
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}>
                    <p className={`text-sm leading-relaxed opacity-70 ${textColor}`}>
                        Think of them as tiny <strong>decision‑making machines</strong> inside every computer, phone, and digital watch. They are the reason your calculator can add numbers, your phone can lock with a passcode, and your game console knows when you pressed a button.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl border ${bgCard}`}>
                    <Zap className="text-emerald-500 mb-4" size={24} />
                    <h4 className={`font-bold mb-2 ${textColor}`}>Basic Gates</h4>
                    <p className={`text-sm opacity-60 ${textColor}`}>AND, OR, NOT. The 'ABC' of digital logic.</p>
                </div>
                <div className={`p-6 rounded-3xl border ${bgCard}`}>
                    <Wrench className="text-amber-500 mb-4" size={24} />
                    <h4 className={`font-bold mb-2 ${textColor}`}>Universal Gates</h4>
                    <p className={`text-sm opacity-60 ${textColor}`}>NAND, NOR. Can build ANY computer chip.</p>
                </div>
                <div className={`p-6 rounded-3xl border ${bgCard}`}>
                    <Target className="text-rose-500 mb-4" size={24} />
                    <h4 className={`font-bold mb-2 ${textColor}`}>Exclusive Gates</h4>
                    <p className={`text-sm opacity-60 ${textColor}`}>XOR, XNOR. The difference & equality checkers.</p>
                </div>
            </div>
        </div>
    );
};

const THEORY_CONTENT: Record<string, { category: string; desc: React.ReactNode; properties: string[]; humanExample: React.ReactNode }> = {
    'AND': {
        category: 'Basic Gate',
        desc: <>
            An AND gate is used to perform logical Multiplication of binary input. The Output state is high (1) <strong>only if BOTH</strong> inputs are high (1).<br/><br/>
            The Boolean Expression is exactly like multiplication (<strong className="text-sky-400">X = A.B</strong>).
        </>,
        properties: [
            "Accepts two or more input values.",
            "Output is logic 1 ONLY when all inputs are logic 1.",
            "Output is logic 0 if ANY input is logic 0."
        ],
        humanExample: <>
            <strong>Going for a picnic.</strong><br/>
            Condition A: Is it sunny? (1)<br/>
            Condition B: Is it not raining? (1)<br/>
            You go <strong>ONLY if both are true</strong>. If one is false, you stay home.
        </>
    },
    'OR': {
        category: 'Basic Gate',
        desc: <>
            The OR GATE is used for logical addition. The Output state is high (1) if <strong>ANY</strong> of its inputs are high (1).<br/><br/>
            The Boolean Expression is denoted by a plus sign (<strong className="text-sky-400">X = A + B</strong>).
        </>,
        properties: [
            "Accepts two or more input lines.",
            "Output is low logic 0 ONLY when all inputs are 0.",
            "If even one input is 1, the output is 1."
        ],
        humanExample: <>
            <strong>Eating dessert.</strong><br/>
            Option A: Do we have chocolate? (1)<br/>
            Option B: Do we have ice cream? (1)<br/>
            You are happy (1) as long as you get <strong>at least one</strong> of them.
        </>
    },
    'NOT': {
        category: 'Basic Gate',
        desc: <>
            A NOT gate performs logical inversion. Also known as an inverter—it just flips the input to the exact opposite!<br/><br/>
            The Boolean Expression is denoted by a bar or prime (<strong className="text-sky-400">Y = A’ or Y = Ā</strong>).
        </>,
        properties: [
            "Takes strictly ONLY one input.",
            "Output is always the complemented logical state."
        ],
        humanExample: <>
            <strong>The contrarian friend.</strong><br/>
            If you say Yes (1), they say No (0).<br/>
            If you say No (0), they say Yes (1).
        </>
    },
    'NAND': {
        category: 'Universal Gate',
        desc: <>
            A NAND gate is an AND gate followed immediately by a NOT gate. It outputs the exact opposite of an AND gate.<br/><br/>
            The Boolean Expression is (<strong className="text-sky-400">X = (A.B)’</strong>).
        </>,
        properties: [
            "Output is low (0) ONLY when all inputs are high (1).",
            "It is a Universal Gate: you can build ANY digital circuit using ONLY NAND gates."
        ],
        humanExample: <>
            <strong>The strict bouncer.</strong><br/>
            You only get kicked out (0) if you wear sneakers (A=1) AND a hat (B=1). For any other combo, you are allowed in (1).
        </>
    },
    'NOR': {
        category: 'Universal Gate',
        desc: <>
            A NOR gate is an OR gate followed by a NOT gate. It outputs the exact opposite of an OR gate.<br/><br/>
            The Boolean Expression is (<strong className="text-sky-400">X = (A + B)’</strong>).
        </>,
        properties: [
            "Accepts two or more inputs.",
            "High logic (1) occurs ONLY when all inputs are low (0).",
            "Also a Universal Gate."
        ],
        humanExample: <>
            <strong>Complete peace and quiet.</strong><br/>
            Noise source A: Dog barking (1)?<br/>
            Noise source B: TV playing (1)?<br/>
            You achieve peace (1) ONLY if neither is happening (A=0 and B=0).
        </>
    },
    'XOR': {
        category: 'Exclusive Gate',
        desc: <>
            XOR (Exclusive-OR) performs exclusive addition. It is literally a difference checker—it outputs 1 if the inputs are different!<br/><br/>
            The Boolean Expression is (<strong className="text-sky-400">X = A’B + AB’</strong>) or A ⊕ B.
        </>,
        properties: [
            "Accepts exactly two inputs.",
            "Output is high ONLY when inputs are dissimilar (0,1 or 1,0)."
        ],
        humanExample: <>
            <strong>A two-way hallway light switch.</strong><br/>
            If both switches are down, the light is off (0). If you flip ONE switch, the light turns on (1). If you flip both switches, it turns off again (0)!
        </>
    },
    'XNOR': {
        category: 'Exclusive Gate',
        desc: <>
            XNOR (Exclusive-NOR) is the equality checker. It outputs 1 ONLY if both inputs are exactly the same.<br/><br/>
            The Boolean Expression is (<strong className="text-sky-400">Y = A ⊙ B</strong>).
        </>,
        properties: [
            "Takes exactly two inputs.",
            "High logic (1) occurs when inputs are similar (either both 0, or both 1)."
        ],
        humanExample: <>
            <strong>Matching outfits.</strong><br/>
            Person A wore a red shirt (1) and Person B wore a red shirt (1)? Match! (1).<br/>
            If one wore blue (0) and one wore red (1)? No match! (0).
        </>
    }
};

export const GateDetail: React.FC<{ gateId: string, isActive: boolean, isDarkMode: boolean }> = ({ gateId, isActive, isDarkMode }) => {
    // Interactive visual
    const [inA, setInA] = useState(0);
    const [inB, setInB] = useState(0);

    const gate = GATE_META[gateId as keyof typeof GATE_META];
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
    const bgCard = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';

    // Figure out actual output
    let output = 0;
    if (gate.inputs === 1) {
        output = gate.evaluate([inA === 1]) ? 1 : 0;
    } else {
        output = gate.evaluate([inA === 1, inB === 1]) ? 1 : 0;
    }

    const GateContent = THEORY_CONTENT[gateId];

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            {/* Header */}
             <section className="text-center space-y-4">
                <motion.span
                    initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    {GateContent?.category || 'Logic Gate'}
                </motion.span>
                <div className="flex items-center justify-center gap-6">
                    <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>{gate.id} Gate</h2>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg"
                         style={{ background: gate.accentBg, borderColor: `${gate.color}40` }}>
                        {getGateIcon(gate.id, 32, gate.color)}
                    </div>
                </div>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor} pt-4`}>
                    "{gate.humanRule}"
                </p>
            </section>

            {/* Interactive Visual Builder (The "Grind" tool) */}
            <div className={`p-8 md:p-12 rounded-[2.5rem] border ${bgCard} flex flex-col md:flex-row items-center justify-between gap-12`}>
                <div className="flex-1 space-y-6 w-full">
                    <h3 className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 ${subTextColor}`}>
                        <Zap size={16} /> Interactive logic runner
                    </h3>
                    <p className={`text-sm opacity-70 leading-relaxed ${textColor}`}>
                        Click the inputs below to toggle their states between 0 (OFF) and 1 (ON). Watch how the output reacts based on the <strong>{gate.id}</strong> gate's rule!
                    </p>
                    <div className="flex flex-col gap-4 max-w-[200px] mt-8">
                        <div className="flex items-center justify-between">
                            <span className={`font-mono font-bold ${textColor}`}>Input A:</span>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setInA(1-inA)} 
                                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black transition-all ${inA ? 'bg-sky-500 text-white shadow-[0_0_20px_#0ea5e9]' : 'bg-slate-200/20 text-slate-400'}`}>
                                {inA}
                            </motion.button>
                        </div>
                        {gate.inputs === 2 && (
                        <div className="flex items-center justify-between">
                            <span className={`font-mono font-bold ${textColor}`}>Input B:</span>
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setInB(1-inB)} 
                                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black transition-all ${inB ? 'bg-sky-500 text-white shadow-[0_0_20px_#0ea5e9]' : 'bg-slate-200/20 text-slate-400'}`}>
                                {inB}
                            </motion.button>
                        </div>
                        )}
                    </div>
                </div>

                {/* Output Display */}
                <div className={`flex flex-col items-center justify-center p-12 rounded-[2rem] border min-w-[280px] w-full md:w-auto transition-all`}
                     style={{
                         backgroundColor: output ? `${gate.color}15` : (isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                         borderColor: output ? gate.color : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                         boxShadow: output ? `0 0 40px ${gate.color}20` : 'none'
                     }}>
                    <div className="mb-8 relative transition-all">
                        {output ? <Lightbulb size={80} style={{ color: gate.color, filter: `drop-shadow(0 0 20px ${gate.color})` }} /> 
                                : <LightbulbOff size={80} className="opacity-20 flex" style={{ color: textColor }} />}
                    </div>
                    <div className={`font-mono text-xs uppercase tracking-widest mb-4 opacity-60 ${textColor}`}>Output Y</div>
                    <div className="text-7xl font-black" style={{ color: output ? gate.color : (isDarkMode ? '#4b5563' : '#9ca3af') }}>
                        {output}
                    </div>
                </div>
            </div>

            {/* Real Life Example & Theory side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    {/* Layman Example */}
                    <div className={`p-8 rounded-3xl border ${bgCard}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-3 ${textColor}`}>
                            <Brain size={20} className="text-emerald-500" />
                            Real Life Example
                        </h4>
                        <div className={`text-sm opacity-80 leading-relaxed ${textColor}`}>
                            {GateContent?.humanExample}
                        </div>
                    </div>

                    {/* Official Truth Table linked to State */}
                    <div className={`p-8 rounded-3xl border ${bgCard}`}>
                        <h4 className={`font-black uppercase tracking-widest text-sm mb-6 flex justify-between items-center ${textColor}`}>
                            Truth Table <span style={{ color: gate.color, textTransform: 'none' }} className="font-mono text-xs px-3 py-1 rounded bg-black/20">{gate.equation}</span>
                        </h4>
                        <div className={`rounded-xl overflow-hidden font-mono text-sm border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <div className={`grid py-3 border-b ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`} style={{ gridTemplateColumns: gate.inputs === 2 ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                                <span className={`text-center font-bold opacity-60 ${textColor}`}>A</span>
                                {gate.inputs === 2 && <span className={`text-center font-bold opacity-60 ${textColor}`}>B</span>}
                                <span className={`text-center font-bold opacity-60 ${textColor}`}>Y</span>
                            </div>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {gate.getTruthTable().map((row: any, i: number) => {
                                const isActiveRow = (gate.inputs === 1 && row.inputs[0] === (inA === 1)) || (gate.inputs === 2 && row.inputs[0] === (inA === 1) && row.inputs[1] === (inB === 1));
                                return (
                                <div key={i} className={`grid py-3 border-b last:border-0 transition-colors duration-300 ${isActiveRow ? (isDarkMode ? 'bg-sky-500/20 shadow-inner' : 'bg-sky-100') : ''} ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`} style={{ gridTemplateColumns: gate.inputs === 2 ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                                    <span className={`text-center ${row.inputs[0] ? textColor : 'opacity-40 ' + textColor} ${isActiveRow ? 'font-bold': ''}`}>{row.inputs[0] ? '1' : '0'}</span>
                                    {gate.inputs === 2 && <span className={`text-center ${row.inputs[1] ? textColor : 'opacity-40 ' + textColor} ${isActiveRow ? 'font-bold': ''}`}>{row.inputs[1] ? '1' : '0'}</span>}
                                    <span className={`text-center font-black transition-all ${isActiveRow ? 'scale-110 drop-shadow-md' : ''}`} style={{ color: row.output ? gate.color : (isDarkMode ? '#64748B' : '#94A3B8') }}>{row.output ? '1' : '0'}</span>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* Formal Theory Box */}
                <div className={`p-8 rounded-3xl border ${bgCard} sticky top-24`}>
                    <h4 className={`font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2 ${textColor}`}>
                        <Wrench size={18} className="text-amber-500" />
                        Formal Properties
                    </h4>
                    <div className={`text-sm leading-relaxed opacity-80 ${textColor} mb-8 space-y-4`}>
                        {GateContent?.desc}
                    </div>
                    <div className={`font-mono text-xs p-5 rounded-2xl leading-loose ${isDarkMode ? 'bg-black/40 shadow-inner' : 'bg-gray-50 border border-gray-100'}`}>
                        {GateContent?.properties?.map((p, i) => (
                            <div key={i} className={`flex items-start gap-3 mb-2 last:mb-0 ${textColor}`}>
                                <span className="text-sky-400 font-bold mt-1 text-[8px]">■</span>
                                <span className="flex-1 opacity-90">{p}</span>
                            </div>
                        ))}
                    </div>

                    {/* Engineering Silicon Fact */}
                    <div className="mt-8 pt-6 border-t border-dashed" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                        <h4 className={`font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2 ${textColor}`}>
                            <Cpu size={14} className="text-purple-500" />
                            Hardware Engineering Note
                        </h4>
                        <p className={`text-xs opacity-70 leading-relaxed font-mono ${textColor}`}>
                            {gate.cmosNote}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
