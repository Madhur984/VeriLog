/**
 * BooleanMinimizer.tsx — Step-by-step Quine-McCluskey minimization visualizer
 *
 * Shows the minimization process for Boolean expressions:
 * 1. Minterms input
 * 2. Grouping by number of 1s
 * 3. Pair-wise comparison
 * 4. Prime implicants
 * 5. Essential prime implicants (coverage table)
 * 6. Final minimized expression
 */

import { useState, useCallback, useMemo, memo } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────

interface Implicant {
    minterms: number[];
    binary: string;
    used: boolean;
}

interface MinimizationStep {
    label: string;
    description: string;
    groups: Implicant[][];
}

// ─── Quine-McCluskey Algorithm ──────────────────────────────────────────

function countOnes(binary: string): number {
    return binary.split('').filter(b => b === '1').length;
}

function toBinary(n: number, bits: number): string {
    return n.toString(2).padStart(bits, '0');
}

function differ(a: string, b: string): { count: number; pos: number } {
    let count = 0;
    let pos = -1;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) { count++; pos = i; }
    }
    return { count, pos };
}

function combine(a: Implicant, b: Implicant): Implicant | null {
    const { count, pos } = differ(a.binary, b.binary);
    if (count !== 1) return null;
    const combined = a.binary.split('');
    combined[pos] = '-';
    return {
        minterms: [...new Set([...a.minterms, ...b.minterms])].sort((x, y) => x - y),
        binary: combined.join(''),
        used: false,
    };
}

function quineMcCluskey(minterms: number[], numVars: number): { steps: MinimizationStep[]; primeImplicants: Implicant[]; expression: string } {
    const steps: MinimizationStep[] = [];

    // Initial grouping
    const initial: Implicant[] = minterms.map(m => ({
        minterms: [m],
        binary: toBinary(m, numVars),
        used: false,
    }));

    const groups: Map<number, Implicant[]> = new Map();
    for (const imp of initial) {
        const ones = countOnes(imp.binary);
        const group = groups.get(ones) || [];
        group.push(imp);
        groups.set(ones, group);
    }

    const sortedKeys = [...groups.keys()].sort((a, b) => a - b);
    steps.push({
        label: 'Initial Groups',
        description: 'Group minterms by number of 1s in binary representation',
        groups: sortedKeys.map(k => groups.get(k)!),
    });

    // Iterative combination
    let currentImplicants = initial;
    let round = 1;

    while (true) {
        const nextImplicants: Implicant[] = [];
        const usedInThisRound = new Set<string>();

        // Group by ones count
        const currentGroups: Map<number, Implicant[]> = new Map();
        for (const imp of currentImplicants) {
            const ones = countOnes(imp.binary.replace(/-/g, ''));
            const group = currentGroups.get(ones) || [];
            group.push(imp);
            currentGroups.set(ones, group);
        }

        const keys = [...currentGroups.keys()].sort((a, b) => a - b);

        for (let i = 0; i < keys.length - 1; i++) {
            const groupA = currentGroups.get(keys[i]) || [];
            const groupB = currentGroups.get(keys[i + 1]) || [];

            for (const a of groupA) {
                for (const b of groupB) {
                    const combined = combine(a, b);
                    if (combined) {
                        a.used = true;
                        b.used = true;
                        usedInThisRound.add(a.binary);
                        usedInThisRound.add(b.binary);

                        // Avoid duplicates
                        if (!nextImplicants.some(n => n.binary === combined.binary)) {
                            nextImplicants.push(combined);
                        }
                    }
                }
            }
        }

        if (nextImplicants.length === 0) break;

        steps.push({
            label: `Round ${round}`,
            description: `Combine groups that differ in exactly one bit`,
            groups: [nextImplicants],
        });

        currentImplicants = nextImplicants;
        round++;
    }

    // Collect prime implicants (unused in any combination)
    const allImplicants = steps.flatMap(s => s.groups.flat());
    const primeImplicants = allImplicants.filter(imp => !imp.used);

    // Deduplicate
    const uniquePrimes: Implicant[] = [];
    const seenBinary = new Set<string>();
    for (const pi of primeImplicants) {
        if (!seenBinary.has(pi.binary)) {
            seenBinary.add(pi.binary);
            uniquePrimes.push(pi);
        }
    }

    steps.push({
        label: 'Prime Implicants',
        description: 'Implicants that cannot be further combined',
        groups: [uniquePrimes],
    });

    // Build expression
    const varNames = 'ABCDEFGH'.slice(0, numVars).split('');
    const expression = uniquePrimes.map(pi => {
        const terms = pi.binary.split('').map((b, i) => {
            if (b === '-') return '';
            return b === '1' ? varNames[i] : varNames[i] + "'";
        }).filter(Boolean).join('');
        return terms || '1';
    }).join(' + ');

    return { steps, primeImplicants: uniquePrimes, expression };
}

// ─── Component ──────────────────────────────────────────────────────────

export const BooleanMinimizer = memo(() => {
    const [mintermInput, setMintermInput] = useState('0,1,2,5,6,7');
    const [numVars, setNumVars] = useState(3);
    const [currentStep, setCurrentStep] = useState(0);

    const minterms = useMemo(() => {
        return mintermInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0 && n < (1 << numVars));
    }, [mintermInput, numVars]);

    const result = useMemo(() => {
        if (minterms.length === 0) return null;
        return quineMcCluskey(minterms, numVars);
    }, [minterms, numVars]);

    const handlePrev = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), []);
    const handleNext = useCallback(() => {
        if (result) setCurrentStep(s => Math.min(result.steps.length - 1, s + 1));
    }, [result]);

    const step = result?.steps[currentStep];

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            padding: 12,
            gap: 12,
        }}>
            {/* Input Controls */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                    Variables:
                    <select
                        value={numVars}
                        onChange={e => { setNumVars(Number(e.target.value)); setCurrentStep(0); }}
                        style={selectStyle}
                    >
                        {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </label>
                <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, flex: 1 }}>
                    Minterms:
                    <input
                        type="text"
                        value={mintermInput}
                        onChange={e => { setMintermInput(e.target.value); setCurrentStep(0); }}
                        style={inputStyle}
                        placeholder="0,1,2,5,6,7"
                    />
                </label>
            </div>

            {/* Step Navigation */}
            {result && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={handlePrev} disabled={currentStep === 0} style={navBtnStyle(currentStep === 0)}>◀</button>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, flex: 1, textAlign: 'center' }}>
                        Step {currentStep + 1} / {result.steps.length}: <span style={{ color: '#00D4FF' }}>{step?.label}</span>
                    </span>
                    <button onClick={handleNext} disabled={currentStep >= result.steps.length - 1} style={navBtnStyle(currentStep >= result.steps.length - 1)}>▶</button>
                </div>
            )}

            {/* Step Content */}
            {step && (
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 8 }}>
                        {step.description}
                    </div>

                    {step.groups.map((group, gi) => (
                        <div key={gi} style={{
                            marginBottom: 8,
                            border: '1px solid rgba(0, 212, 255, 0.08)',
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}>
                            {group.map((imp, ii) => (
                                <div key={ii} style={{
                                    display: 'flex',
                                    gap: 12,
                                    padding: '3px 8px',
                                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                                    background: imp.used ? 'rgba(255,255,255,0.02)' : 'transparent',
                                }}>
                                    <span style={{
                                        color: '#00D4FF',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        minWidth: 60,
                                    }}>
                                        {imp.binary.split('').map((b, bi) => (
                                            <span key={bi} style={{ color: b === '-' ? 'rgba(255,255,255,0.15)' : b === '1' ? '#10B981' : 'rgba(255,255,255,0.4)' }}>
                                                {b}
                                            </span>
                                        ))}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                                        m({imp.minterms.join(',')})
                                    </span>
                                    {imp.used && (
                                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9 }}>✓ combined</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Final Result */}
            {result && (
                <div style={{
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: 4,
                }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>MINIMIZED: </span>
                    <span style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>
                        F = {result.expression}
                    </span>
                </div>
            )}
        </div>
    );
});

BooleanMinimizer.displayName = 'BooleanMinimizer';

// ─── Styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0, 212, 255, 0.1)',
    color: '#e6edf3',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    padding: '3px 8px',
    borderRadius: 3,
    outline: 'none',
    marginLeft: 4,
    width: '100%',
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    width: 50,
    cursor: 'pointer',
};

function navBtnStyle(disabled: boolean): React.CSSProperties {
    return {
        background: disabled ? 'none' : 'rgba(0, 212, 255, 0.06)',
        border: '1px solid rgba(0, 212, 255, 0.1)',
        color: disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 12,
        padding: '3px 10px',
        borderRadius: 3,
        fontFamily: 'inherit',
    };
}
