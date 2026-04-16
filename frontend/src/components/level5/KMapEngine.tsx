import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export type VarCount = 2 | 3 | 4;

interface Props {
    variables: VarCount;
    targetMinterms: number[];
    mode?: 'map' | 'group';
    onFullyMapped?: () => void;
    onGroupsVerified?: (groups: string[][], expression: string) => void;
    onValidGroup?: () => void;
    onInvalidGroup?: () => void;
}

const COLORS = ['#00D4FF', '#10B981', '#F59E0B', '#A78BFA', '#F472B6', '#FB923C'];

const GRAY_1 = ['0', '1'];
const GRAY_2 = ['00', '01', '11', '10'];

function getAxisLabels(vars: VarCount) {
    if (vars === 2) return { rowVars: 'A', colVars: 'B', rows: GRAY_1, cols: GRAY_1 };
    if (vars === 3) return { rowVars: 'A', colVars: 'BC', rows: GRAY_1, cols: GRAY_2 };
    return { rowVars: 'AB', colVars: 'CD', rows: GRAY_2, cols: GRAY_2 };
}

const isPowerOf2 = (n: number) => n > 0 && (n & (n - 1)) === 0;

export const KMapEngine: React.FC<Props> = ({ variables, targetMinterms, mode = 'map', onFullyMapped, onGroupsVerified, onValidGroup, onInvalidGroup }) => {
    const { rowVars, colVars, rows, cols } = useMemo(() => getAxisLabels(variables), [variables]);
    const [mapState, setMapState] = useState<Record<string, 0 | 1>>({});
    const [confirmedGroups, setConfirmedGroups] = useState<string[][]>([]);
    const [draftGroup, setDraftGroup] = useState<string[]>([]);

    useEffect(() => {
        if (mode === 'group') {
            const nextMap: Record<string, 0 | 1> = {};
            targetMinterms.forEach(m => {
                const bin = m.toString(2).padStart(variables, '0');
                let rBin = '', cBin = '';
                if (variables === 2) { rBin = bin[0]; cBin = bin[1]; }
                if (variables === 3) { rBin = bin[0]; cBin = bin.slice(1); }
                if (variables === 4) { rBin = bin.slice(0, 2); cBin = bin.slice(2); }
                const rIdx = rows.indexOf(rBin);
                const cIdx = cols.indexOf(cBin);
                nextMap[`${rIdx}-${cIdx}`] = 1;
            });
            setMapState(nextMap);
        }
    }, [mode, targetMinterms, variables, rows, cols]);

    const isMapCompleted = useMemo(() => {
        const ones = Object.values(mapState).filter(v => v === 1).length;
        if (ones !== targetMinterms.length) return false;
        return targetMinterms.every(m => {
            const bin = m.toString(2).padStart(variables, '0');
            let rBin = '', cBin = '';
            if (variables === 2) { rBin = bin[0]; cBin = bin[1]; }
            else if (variables === 3) { rBin = bin[0]; cBin = bin.slice(1); }
            else { rBin = bin.slice(0, 2); cBin = bin.slice(2); }
            return mapState[`${rows.indexOf(rBin)}-${cols.indexOf(cBin)}`] === 1;
        });
    }, [mapState, targetMinterms, variables, rows, cols]);

    useEffect(() => {
        if (mode === 'map' && isMapCompleted && onFullyMapped) {
            const t = setTimeout(onFullyMapped, 500);
            return () => clearTimeout(t);
        }
    }, [mode, isMapCompleted, onFullyMapped]);

    const handleCellClick = (cellKey: string) => {
        if (mode !== 'group' || mapState[cellKey] !== 1) return;

        setDraftGroup(prev => {
            if (prev.includes(cellKey)) return prev.filter(c => c !== cellKey);
            return [...prev, cellKey];
        });
    };

    const validateGroup = (group: string[]) => {
        const size = group.length;
        if (!isPowerOf2(size)) return false;

        const bins = group.map(c => {
            const [r, cl] = c.split('-').map(Number);
            return rows[r] + cols[cl];
        });

        const bits = bins[0].length;
        let varying = 0;
        for (let i = 0; i < bits; i++) {
            const s = new Set(bins.map(b => b[i]));
            if (s.size === 2) varying++;
        }
        return varying === Math.log2(size);
    };

    const saveGroup = () => {
        if (draftGroup.length === 0) return;
        if (!validateGroup(draftGroup)) {
            onInvalidGroup?.();
            return;
        }
        setConfirmedGroups(prev => [...prev, draftGroup]);
        onValidGroup?.();
        setDraftGroup([]);
    };

    const clearDraft = () => setDraftGroup([]);
    const removeGroup = (idx: number) => setConfirmedGroups(prev => prev.filter((_, i) => i !== idx));


    const deriveTerm = useCallback((group: string[]) => {
        if (!group.length) return '';
        const bins = group.map(c => {
            const [r, cl] = c.split('-').map(Number);
            return rows[r] + cols[cl];
        });
        const bits = bins[0].length;
        const vars = variables === 2 ? ['A', 'B'] : variables === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
        let term = '';
        for (let i = 0; i < bits; i++) {
            const s = new Set(bins.map(b => b[i]));
            if (s.size === 1) {
                const bit = Array.from(s)[0];
                term += bit === '1' ? vars[i] : vars[i] + "'";
            }
        }
        return term || '1';
    }, [variables, rows, cols]);

    const expression = useMemo(() => confirmedGroups.map(deriveTerm).filter(Boolean).join(' + ') || '0', [confirmedGroups, deriveTerm]);

    useEffect(() => {
        if (mode === 'group') {
            const ones = Object.entries(mapState).filter(([_, v]) => v === 1).map(([k]) => k);
            if (ones.length && ones.every(c => confirmedGroups.some(g => g.includes(c)))) {
                const t = setTimeout(() => onGroupsVerified?.(confirmedGroups, expression), 500);
                return () => clearTimeout(t);
            }
        }
    }, [confirmedGroups, mapState, mode, onGroupsVerified, expression]);


    const renderGroupBlobs = () => {
        const cellSize = 64, offset = 6, gridX = 40;
        // Combine with draft group
        const allToRender = [...confirmedGroups.map((g, i) => ({ g, idx: i, isDraft: false })),
        ...(draftGroup.length ? [{ g: draftGroup, idx: -1, isDraft: true }] : [])];

        return allToRender.map(({ g: group, idx, isDraft }) => {
            const color = isDraft ? '#00D4FF' : COLORS[idx % COLORS.length];
            const cells = group.map(c => c.split('-').map(Number));
            const rs = Array.from(new Set(cells.map(c => c[0]))).sort((a, b) => a - b);
            const cs = Array.from(new Set(cells.map(c => c[1]))).sort((a, b) => a - b);

            const isRowWrap = rs.length > 1 && Math.max(...rs) - Math.min(...rs) + 1 !== rs.length;
            const isColWrap = cs.length > 1 && Math.max(...cs) - Math.min(...cs) + 1 !== cs.length;

            const rBlocks = isRowWrap ? [[Math.max(...rs), rows.length - 1], [0, Math.min(...rs)]] : [[Math.min(...rs), Math.max(...rs)]];
            const cBlocks = isColWrap ? [[Math.max(...cs), cols.length - 1], [0, Math.min(...cs)]] : [[Math.min(...cs), Math.max(...cs)]];

            return (
                <React.Fragment key={isDraft ? 'draft' : idx}>
                    {rBlocks.map(([rs_b, re_b], rbi) => cBlocks.map(([cs_b, ce_b], cbi) => (
                        <motion.rect key={`${idx}-${rbi}-${cbi}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            x={gridX + cs_b * cellSize + offset} y={rs_b * cellSize + offset}
                            width={(ce_b - cs_b + 1) * cellSize - offset * 2} height={(re_b - rs_b + 1) * cellSize - offset * 2} rx={12}
                            fill="none" stroke={color} strokeWidth={3} strokeDasharray={isDraft ? "4 4" : "0"}
                            style={{ pointerEvents: 'none', filter: `drop-shadow(0 0 6px ${color}80)` }}
                        />
                    )))}
                </React.Fragment>
            );
        });
    };

    return (
        <div className={`flex gap-12 justify-center items-start font-mono p-6 ${mode === 'group' ? 'select-none' : ''}`}>
            {/* Truth Table */}
            <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl transition-opacity duration-300 ${mode === 'group' ? 'opacity-50' : 'opacity-100'}`}>
                <div className="text-[10px] text-sky-500 uppercase tracking-widest font-bold mb-4">Truth Table</div>
                <div 
                    className="grid gap-2 text-center text-[13px] font-bold text-slate-800 dark:text-slate-200" 
                    style={{ gridTemplateColumns: `repeat(${variables}, 32px) 48px` }}
                >
                    {getAxisLabels(variables).rowVars.split('').concat(getAxisLabels(variables).colVars.split('')).map((v, i) => <div key={i}>{v}</div>)}
                    <div className="text-sky-500">F</div>
                    <div className="col-span-full h-[1px] bg-slate-200 dark:bg-slate-800 my-2" />
                    {Array.from({ length: Math.pow(2, variables) }).map((_, i) => {
                        const isTarget = targetMinterms.includes(i);
                        return (
                            <React.Fragment key={i}>
                                {i.toString(2).padStart(variables, '0').split('').map((bit, idx) => (
                                    <div key={idx} className={bit === '1' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}>{bit}</div>
                                ))}
                                <div 
                                    draggable={mode === 'map' && isTarget} 
                                    onDragStart={e => e.dataTransfer.setData('text/plain', '1')}
                                    className={`w-6 h-6 mx-auto rounded flex items-center justify-center transition-colors
                                        ${isTarget ? 'text-emerald-500 font-bold' : 'text-slate-400 dark:text-slate-600'}
                                        ${mode === 'map' && isTarget ? 'bg-emerald-500/10 cursor-grab hover:bg-emerald-500/20 active:cursor-grabbing' : 'cursor-default'}`
                                    }
                                >
                                    {isTarget ? '1' : '0'}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: K-Map & Group Manager */}
            <div className="flex flex-col gap-4">
                {/* K-MAP */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl relative transition-colors duration-300">
                    <div className="absolute top-3 right-4 text-[10px] text-sky-500 uppercase tracking-widest font-bold">K-MAP ({variables}-VAR)</div>
                    <div className="flex mb-2 relative">
                        <div className="w-[40px]" />
                        <div className="absolute -top-4 left-3 text-slate-400 dark:text-slate-500 text-xs font-bold">{rowVars} \ {colVars}</div>
                        {cols.map((c, i) => <div key={i} className="w-[64px] text-center text-slate-800 dark:text-slate-200 text-[13px] font-bold">{c}</div>)}
                    </div>
                    {rows.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-center">
                            <div className="w-[40px] text-right pr-3 text-slate-800 dark:text-slate-200 text-[13px] font-bold">{r}</div>
                            {cols.map((c, cIdx) => {
                                const cellKey = `${rIdx}-${cIdx}`;
                                const isDrafting = draftGroup.includes(cellKey);
                                const cellVal = mapState[cellKey];
                                return (
                                    <div key={cIdx} 
                                        onDragOver={e => mode === 'map' && e.preventDefault()} 
                                        onDrop={e => { if (mode === 'map' && e.dataTransfer.getData('text/plain') === '1') setMapState(p => ({ ...p, [cellKey]: 1 })) }}
                                        onClick={() => handleCellClick(cellKey)}
                                        className={`w-[64px] h-[64px] border border-slate-200 dark:border-slate-800 relative flex items-center justify-center text-xl font-black transition-all duration-200
                                            ${isDrafting ? 'bg-sky-500/10' : cellVal === 1 ? 'bg-emerald-500/5' : 'bg-slate-50 dark:bg-slate-900/50'}
                                            ${mode === 'group' && cellVal === 1 ? 'cursor-pointer hover:bg-emerald-500/10' : mode === 'map' ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50' : 'cursor-default'}
                                            ${cellVal === 1 ? 'text-emerald-500' : 'text-transparent'}
                                        `}
                                    >
                                        <div className="absolute top-1 right-1 text-[8px] text-slate-400 dark:text-slate-600 font-normal">{r}{c}</div>
                                        {cellVal ?? ''}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="absolute top-[32px] left-[32px] right-[32px] bottom-[32px] pointer-events-none">
                        <svg width="100%" height="100%" className="overflow-visible">{renderGroupBlobs()}</svg>
                    </div>
                </div>

                {/* Sub-panels */}
                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {mode === 'map' && isMapCompleted && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold shadow-lg">
                                <CheckCircle2 size={20} /> Mapping Complete
                            </motion.div>
                        )}
                        {mode === 'group' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 w-[280px] shadow-xl">
                                <div className="text-[10px] text-sky-500 uppercase tracking-widest font-bold mb-3">GROUP MANAGER</div>

                                {draftGroup.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="text-xs text-slate-800 dark:text-slate-200 font-bold">{draftGroup.length} Cells Selected</div>
                                        <div className="flex gap-2">
                                            <button onClick={saveGroup} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded text-[11px] font-black cursor-pointer transition-colors">SAVE GROUP</button>
                                            <button onClick={clearDraft} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-bold cursor-pointer transition-colors">CLEAR</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 dark:text-slate-500 italic">Click 1s to form a group...</div>
                                )}

                                {confirmedGroups.length > 0 && (
                                    <>
                                        <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-4" />
                                        <div className="text-[10px] text-sky-500 uppercase tracking-widest font-bold mb-3">DERIVED EXPRESSION</div>
                                        <div className="font-mono text-lg font-black text-slate-900 dark:text-white break-all">{expression}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 flex flex-col gap-1">
                                            {confirmedGroups.map((g, i) => (
                                                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded">
                                                    <span className="font-bold">Term {i + 1}: <span className="text-slate-800 dark:text-slate-200">{deriveTerm(g)}</span></span>
                                                    <button onClick={() => removeGroup(i)} className="bg-transparent hover:bg-rose-500/10 px-1.5 py-0.5 rounded border-none text-rose-500 cursor-pointer text-[10px] font-bold transition-colors">Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
