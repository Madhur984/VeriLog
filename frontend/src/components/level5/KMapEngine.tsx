import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

export type VarCount = 2 | 3 | 4;

interface Props {
    variables: VarCount;
    targetMinterms: number[];
    mode?: 'map' | 'group';
    onFullyMapped?: () => void;
    onGroupsVerified?: (groups: string[][], expression: string) => void;
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

export const KMapEngine: React.FC<Props> = ({ variables, targetMinterms, mode = 'map', onFullyMapped, onGroupsVerified }) => {
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
            // Visual feedback could be added here
            return;
        }
        setConfirmedGroups(prev => [...prev, draftGroup]);
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
            const color = isDraft ? T.accent : COLORS[idx % COLORS.length];
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
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'flex-start', fontFamily: T.mono, padding: 24, userSelect: mode === 'group' ? 'none' : 'auto' }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', opacity: mode === 'group' ? 0.5 : 1 }}>
                <div style={{ fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Truth Table</div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${variables}, 32px) 48px`, gap: 8, textAlign: 'center', fontSize: 13 }}>
                    {getAxisLabels(variables).rowVars.split('').concat(getAxisLabels(variables).colVars.split('')).map((v, i) => <div key={i}>{v}</div>)}
                    <div style={{ color: T.accent }}>F</div>
                    <div style={{ gridColumn: '1 / -1', height: 1, background: T.border, margin: '8px 0' }} />
                    {Array.from({ length: Math.pow(2, variables) }).map((_, i) => (
                        <React.Fragment key={i}>
                            {i.toString(2).padStart(variables, '0').split('').map((bit, idx) => <div key={idx} style={{ color: bit === '1' ? T.text : T.muted }}>{bit}</div>)}
                            <div draggable={mode === 'map' && targetMinterms.includes(i)} onDragStart={e => e.dataTransfer.setData('text/plain', '1')}
                                style={{ color: targetMinterms.includes(i) ? T.success : T.muted, background: mode === 'map' && targetMinterms.includes(i) ? 'rgba(16,185,129,0.1)' : 'transparent', borderRadius: 4, width: 24, height: 24, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: mode === 'map' && targetMinterms.includes(i) ? 'grab' : 'default' }}>
                                {targetMinterms.includes(i) ? '1' : '0'}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 10, color: T.accent, letterSpacing: '0.15em' }}>K-MAP ({variables}-VAR)</div>
                    <div style={{ display: 'flex', marginBottom: 8, position: 'relative' }}>
                        <div style={{ width: 40 }} />
                        <div style={{ position: 'absolute', top: -16, left: 12, color: T.muted, fontSize: 12 }}>{rowVars} \ {colVars}</div>
                        {cols.map((c, i) => <div key={i} style={{ width: 64, textAlign: 'center', color: T.text, fontSize: 13 }}>{c}</div>)}
                    </div>
                    {rows.map((r, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 40, textAlign: 'right', paddingRight: 12, color: T.text, fontSize: 13 }}>{r}</div>
                            {cols.map((c, cIdx) => {
                                const cellKey = `${rIdx}-${cIdx}`;
                                const isDrafting = draftGroup.includes(cellKey);
                                return (
                                    <div key={cIdx} onDragOver={e => mode === 'map' && e.preventDefault()} onDrop={e => { if (mode === 'map' && e.dataTransfer.getData('text/plain') === '1') setMapState(p => ({ ...p, [cellKey]: 1 })) }}
                                        onClick={() => handleCellClick(cellKey)}
                                        style={{
                                            width: 64, height: 64, border: `1px solid ${T.border}`,
                                            background: isDrafting ? 'rgba(0,212,255,0.1)' : (mapState[cellKey] === 1 ? 'rgba(16,185,129,0.05)' : T.surface),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700,
                                            color: mapState[cellKey] === 1 ? T.success : 'transparent', cursor: (mode === 'group' && mapState[cellKey] === 1) ? 'pointer' : (mode === 'map' ? 'pointer' : 'default'), transition: 'all 0.1s ease', position: 'relative'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 4, right: 4, fontSize: 8, color: T.muted, fontWeight: 400 }}>{r}{c}</div>
                                        {mapState[cellKey] ?? ''}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div style={{ position: 'absolute', top: 32, left: 32, right: 32, bottom: 32, pointerEvents: 'none' }}>
                        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>{renderGroupBlobs()}</svg>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <AnimatePresence>
                        {mode === 'map' && isMapCompleted && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{ padding: '12px 24px', background: 'rgba(16,185,129,0.1)', border: '1px solid #10B981', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, color: '#10B981', fontSize: 14 }}>
                                <CheckCircle2 size={20} /> Mapping Complete
                            </motion.div>
                        )}
                        {mode === 'group' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, width: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                                <div style={{ fontSize: 10, color: T.accent, letterSpacing: '0.15em', marginBottom: 12 }}>GROUP MANAGER</div>

                                {draftGroup.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div style={{ fontSize: 12, color: T.text }}>{draftGroup.length} Cells Selected</div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={saveGroup} style={{ flex: 1, padding: '8px', background: T.success, border: 'none', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>SAVE GROUP</button>
                                            <button onClick={clearDraft} style={{ flex: 1, padding: '8px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, color: T.text, fontSize: 11, cursor: 'pointer' }}>CLEAR</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: 12, color: T.muted, fontStyle: 'italic' }}>Click 1s to form a group...</div>
                                )}

                                {confirmedGroups.length > 0 && (
                                    <>
                                        <div style={{ height: 1, background: T.border, margin: '16px 0' }} />
                                        <div style={{ fontSize: 10, color: T.accent, letterSpacing: '0.15em', marginBottom: 12 }}>DERIVED EXPRESSION</div>
                                        <div style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 700, color: T.text, wordBreak: 'break-all' }}>{expression}</div>
                                        <div style={{ fontSize: 10, color: T.muted, marginTop: 12 }}>
                                            {confirmedGroups.map((g, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <span>Term {i + 1}: {deriveTerm(g)}</span>
                                                    <button onClick={() => removeGroup(i)} style={{ background: 'none', border: 'none', color: T.error || '#ef4444', cursor: 'pointer', fontSize: 10 }}>Remove</button>
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
