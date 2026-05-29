import React from 'react';

export type Bit = 0 | 1;

export type Lit = { sym: string; bar?: boolean };

export interface Term {
  literals: Lit[];
  color: string;
  hidden?: boolean;
}

export interface CleanInput {
  sym: string;
  meaning?: string;
  accent: string;
  value: Bit;
}

export interface CleanCircuitProps {
  topic: string;
  subtitle?: string;
  inputs: CleanInput[];
  terms: Term[];
  finalOp?: 'OR' | 'AND';
  outputSym?: string;
  isDark: boolean;
  /** if provided, renders a fixed POS-style: Y = (groupA) · (groupB)' etc */
  posOverride?: { label: string; value: Bit };
}

const evalLit = (l: Lit, inputs: CleanInput[]): Bit => {
  const inp = inputs.find((i) => i.sym === l.sym);
  if (!inp) return 0;
  return l.bar ? ((inp.value ? 0 : 1) as Bit) : inp.value;
};

const evalTerm = (t: Term, inputs: CleanInput[]): Bit => {
  if (t.literals.length === 0) return 0;
  return t.literals.every((l) => evalLit(l, inputs) === 1) ? 1 : 0;
};

const litLabel = (l: Lit) => l.sym + (l.bar ? '′' : '');

export const CleanCircuit: React.FC<CleanCircuitProps> = ({
  topic,
  subtitle,
  inputs,
  terms,
  finalOp = 'OR',
  outputSym = 'F',
  isDark,
  posOverride,
}) => {
  const visibleTerms = terms.filter((t) => !t.hidden);
  const termValues = visibleTerms.map((t) => evalTerm(t, inputs));
  const out: Bit = posOverride
    ? posOverride.value
    : finalOp === 'OR'
      ? (termValues.includes(1) ? 1 : 0) as Bit
      : (termValues.every((v) => v === 1) ? 1 : 0) as Bit;

  // ─── Layout constants ───
  const N = inputs.length;
  const M = visibleTerms.length;

  const padTop = 56;
  const railSpacing = 36;
  const railLeft = 60;
  const railRight = railLeft + (N - 1) * railSpacing;

  const rowStart = padTop + 30;
  const rowHeight = 78;
  const lastRowY = rowStart + (M - 1) * rowHeight;
  const railBottom = lastRowY + 32;
  const totalH = railBottom + 40;

  const wireStartX = railRight + 30;       // horizontal wires start here
  const andX = 380;                        // AND gate left edge
  const andW = 36;
  const andRightX = andX + andW + 4;       // tip + a bit of stub
  const orX = 540;                         // OR gate left edge
  const orW = 76;
  const orMidY = (rowStart + lastRowY) / 2;
  const outX = orX + orW;
  const boxX = outX + 50;
  const boxW = 70;
  const boxY = orMidY - 22;
  const totalW = boxX + boxW + 20;

  const subText = isDark ? '#94a3b8' : '#64748b';
  const dim = isDark ? '#475569' : '#cbd5e1';
  const railFill = isDark ? '#0a0e1a' : '#fff';
  const wirePos = '#fb7185';
  const wireGold = '#fbbf24';
  const orStroke = '#22c55e';

  const railColor = (inp: CleanInput) =>
    inp.value ? inp.accent : dim;
  const railGlow = (inp: CleanInput) =>
    inp.value ? `drop-shadow(0 0 4px ${inp.accent}cc)` : 'none';

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full h-auto">
      {/* Topic banner */}
      <g>
        <rect x="20" y="14" width={totalW - 40} height="28" rx="6"
              fill={isDark ? 'rgba(167,139,250,0.10)' : 'rgba(167,139,250,0.08)'}
              stroke="#a78bfa" strokeOpacity="0.4" />
        <text x="32" y="32" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#a78bfa">
          TOPIC · {topic}
        </text>
        {subtitle && (
          <text x={totalW - 32} y="32" textAnchor="end" fontSize="10" fontFamily="monospace" fill={subText}>
            {subtitle}
          </text>
        )}
      </g>

      {/* Input rails */}
      {inputs.map((inp, i) => {
        const x = railLeft + i * railSpacing;
        return (
          <g key={inp.sym}>
            <text x={x} y={padTop - 4} textAnchor="middle" fontSize="12" fontWeight="bold"
                  fontFamily="monospace" fill={inp.accent}>
              {inp.sym}={inp.value}
            </text>
            <line x1={x} y1={padTop} x2={x} y2={railBottom}
                  stroke={railColor(inp)} strokeWidth="2"
                  style={{ filter: railGlow(inp) }} />
          </g>
        );
      })}

      {/* Each term row */}
      {visibleTerms.map((term, ti) => {
        const rowY = rowStart + ti * rowHeight;
        const tv = termValues[ti];
        const isMulti = term.literals.length > 1;
        const litCount = term.literals.length;

        // Spread each literal vertically inside this row
        const spread = Math.max(0, (litCount - 1) * 8);
        const litY = (li: number) =>
          rowY - spread / 2 + li * (litCount > 1 ? spread / (litCount - 1) : 0);

        return (
          <g key={ti}>
            {/* Row baseline guide (subtle) */}
            <line x1={wireStartX} y1={rowY} x2={andX - 30} y2={rowY}
                  stroke={dim} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />

            {/* Wires from each rail */}
            {term.literals.map((lit, li) => {
              const inpIdx = inputs.findIndex((i) => i.sym === lit.sym);
              if (inpIdx < 0) return null;
              const inp = inputs[inpIdx];
              const railX = railLeft + inpIdx * railSpacing;
              const yL = litY(li);
              const litVal = evalLit(lit, inputs);
              const litColor = litVal ? wirePos : dim;
              const litGlow = litVal ? 'drop-shadow(0 0 3px rgba(251,113,133,0.6))' : 'none';
              const stub = lit.bar ? andX - 18 : andX - 4;

              return (
                <g key={li}>
                  {/* Tap dot on rail */}
                  <circle cx={railX} cy={yL} r="3" fill={inp.accent} />
                  {/* From rail to gate */}
                  <line x1={railX} y1={yL} x2={stub} y2={yL}
                        stroke={litColor} strokeWidth="1.6"
                        style={{ filter: litGlow }} />
                  {/* NOT bubble */}
                  {lit.bar && (
                    <>
                      <polygon points={`${andX - 28},${yL - 6} ${andX - 28},${yL + 6} ${andX - 18},${yL}`}
                              fill={railFill} stroke={wirePos} strokeWidth="1.4" />
                      <circle cx={andX - 16} cy={yL} r="2.4" fill={railFill} stroke={wirePos} strokeWidth="1.4" />
                      <line x1={andX - 13} y1={yL} x2={andX - 4} y2={yL}
                            stroke={litColor} strokeWidth="1.6"
                            style={{ filter: litGlow }} />
                      <text x={andX - 36} y={yL - 6} fontSize="8" fontFamily="monospace" fill={wirePos}>
                        {lit.sym}′
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* AND gate or pass-through */}
            {isMulti ? (
              <g>
                <path
                  d={`M ${andX} ${rowY - 22} L ${andX + andW * 0.55} ${rowY - 22} A 22 22 0 0 1 ${andX + andW * 0.55} ${rowY + 22} L ${andX} ${rowY + 22} Z`}
                  fill={railFill} stroke={wireGold} strokeWidth="2"
                />
                <text x={andX + 4} y={rowY + 4} fontSize="10" fontFamily="monospace"
                      fill={wireGold} fontWeight="bold">AND</text>
                <line x1={andRightX} y1={rowY} x2={orX - 4} y2={rowY}
                      stroke={tv ? wireGold : dim} strokeWidth="2"
                      style={{ filter: tv ? 'drop-shadow(0 0 3px rgba(251,191,36,0.6))' : 'none' }} />
                <text x={andRightX + 6} y={rowY - 6} fontSize="10" fontFamily="monospace"
                      fill={term.color} fontWeight="bold">
                  {term.literals.map(litLabel).join('')}={tv}
                </text>
              </g>
            ) : (
              <g>
                {/* Single-literal pass-through to OR */}
                <line x1={andX - 4} y1={rowY} x2={orX - 4} y2={rowY}
                      stroke={tv ? term.color : dim} strokeWidth="2"
                      style={{ filter: tv ? `drop-shadow(0 0 3px ${term.color}aa)` : 'none' }} />
                <text x={andX + 30} y={rowY - 6} fontSize="10" fontFamily="monospace"
                      fill={term.color} fontWeight="bold">
                  {term.literals.map(litLabel).join('') || '-'}={tv}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Final OR gate (or AND if finalOp='AND') spanning all term outputs */}
      {(() => {
        const top = rowStart - 24;
        const bot = lastRowY + 24;
        const stroke = finalOp === 'OR' ? orStroke : wireGold;
        if (finalOp === 'OR') {
          return (
            <g>
              <path
                d={`M ${orX} ${top}
                    Q ${orX + 22} ${orMidY} ${orX} ${bot}
                    Q ${orX + orW - 18} ${bot - 6} ${outX} ${orMidY}
                    Q ${orX + orW - 18} ${top + 6} ${orX} ${top} Z`}
                fill={railFill} stroke={stroke} strokeWidth="2.5"
              />
              <text x={orX + 22} y={orMidY + 5} fontSize="13" fontFamily="monospace"
                    fontWeight="bold" fill={stroke}>OR</text>
            </g>
          );
        }
        return (
          <g>
            <path
              d={`M ${orX} ${top} L ${orX + orW * 0.5} ${top} A ${(bot - top) / 2} ${(bot - top) / 2} 0 0 1 ${orX + orW * 0.5} ${bot} L ${orX} ${bot} Z`}
              fill={railFill} stroke={stroke} strokeWidth="2.5"
            />
            <text x={orX + 14} y={orMidY + 5} fontSize="13" fontFamily="monospace"
                  fontWeight="bold" fill={stroke}>AND</text>
          </g>
        );
      })()}

      {/* Output wire + box */}
      <line x1={outX} y1={orMidY} x2={boxX - 2} y2={orMidY}
            stroke={out ? wirePos : dim} strokeWidth="3"
            style={{ filter: out ? 'drop-shadow(0 0 6px rgba(251,113,133,0.7))' : 'none' }} />
      <rect x={boxX} y={boxY} width={boxW} height="44" rx="8"
            fill={out ? wirePos : 'none'} stroke={wirePos} strokeWidth="2.5"
            style={{ filter: out ? 'drop-shadow(0 0 14px rgba(251,113,133,0.65))' : 'none' }} />
      <text x={boxX + boxW / 2} y={orMidY + 6} textAnchor="middle"
            fontSize="16" fontFamily="monospace" fontWeight="bold"
            fill={out ? '#000' : wirePos}>
        {outputSym}={out}
      </text>

      {/* Bottom legend */}
      <g transform={`translate(20, ${railBottom + 14})`}>
        <circle cx={6} cy={6} r={5} fill={wirePos} opacity="0.8" />
        <text x={16} y={10} fontSize="9" fontFamily="monospace" fill={subText}>
          glowing line = logic 1
        </text>
        <circle cx={140} cy={6} r={5} fill="none" stroke={wirePos} strokeWidth="1.4" />
        <text x={150} y={10} fontSize="9" fontFamily="monospace" fill={subText}>
          ○ = NOT (inverter)
        </text>
        <text x={260} y={10} fontSize="9" fontFamily="monospace" fill={wireGold}>AND</text>
        <text x={290} y={10} fontSize="9" fontFamily="monospace" fill={subText}>= product</text>
        <text x={350} y={10} fontSize="9" fontFamily="monospace" fill={orStroke}>OR</text>
        <text x={370} y={10} fontSize="9" fontFamily="monospace" fill={subText}>= sum</text>
      </g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers for building common circuit shapes
// ─────────────────────────────────────────────────────────────────────────
export const lit = (sym: string): Lit => ({ sym });
export const not = (sym: string): Lit => ({ sym, bar: true });
export const term = (literals: Lit[], color: string): Term => ({ literals, color });

// Custom POS-style schematic: (A+B) · C  variant
export interface PosSchematicProps {
  topic: string;
  inputs: CleanInput[];
  /** First OR group of literals */
  orGroup: Lit[];
  /** AND-tied second branch (single literal, possibly barred) */
  secondLit: Lit;
  outputSym?: string;
  isDark: boolean;
}

export const PosCircuit: React.FC<PosSchematicProps> = ({
  topic,
  inputs,
  orGroup,
  secondLit,
  outputSym = 'Y',
  isDark,
}) => {
  const orVal: Bit = orGroup.some((l) => evalLit(l, inputs) === 1) ? 1 : 0;
  const secondVal = evalLit(secondLit, inputs);
  const out: Bit = (orVal && secondVal) ? 1 : 0;

  const padTop = 56;
  const railSpacing = 36;
  const railLeft = 60;
  const railBottom = 290;
  const totalH = 340;
  const totalW = 760;

  const dim = isDark ? '#475569' : '#cbd5e1';
  const subText = isDark ? '#94a3b8' : '#64748b';
  const railFill = isDark ? '#0a0e1a' : '#fff';
  const wirePos = '#fb7185';
  const wireGold = '#fbbf24';
  const orStroke = '#22c55e';

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full h-auto">
      {/* Topic banner */}
      <rect x="20" y="14" width={totalW - 40} height="28" rx="6"
            fill={isDark ? 'rgba(167,139,250,0.10)' : 'rgba(167,139,250,0.08)'}
            stroke="#a78bfa" strokeOpacity="0.4" />
      <text x="32" y="32" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#a78bfa">
        TOPIC · {topic}
      </text>

      {/* Input rails */}
      {inputs.map((inp, i) => {
        const x = railLeft + i * railSpacing;
        return (
          <g key={inp.sym}>
            <text x={x} y={padTop - 4} textAnchor="middle" fontSize="12" fontWeight="bold"
                  fontFamily="monospace" fill={inp.accent}>
              {inp.sym}={inp.value}
            </text>
            <line x1={x} y1={padTop} x2={x} y2={railBottom}
                  stroke={inp.value ? inp.accent : dim} strokeWidth="2"
                  style={{ filter: inp.value ? `drop-shadow(0 0 4px ${inp.accent}cc)` : 'none' }} />
          </g>
        );
      })}

      {/* OR gate (top branch) */}
      {(() => {
        const orX = 320;
        const orW = 70;
        const orY1 = 90;
        const orY2 = 170;
        const midY = (orY1 + orY2) / 2;
        return (
          <g>
            {orGroup.map((l, i) => {
              const idx = inputs.findIndex((inp) => inp.sym === l.sym);
              if (idx < 0) return null;
              const inp = inputs[idx];
              const railX = railLeft + idx * railSpacing;
              const yIn = orY1 + 18 + i * 24;
              const v = evalLit(l, inputs);
              const c = v ? inp.accent : dim;
              return (
                <g key={i}>
                  <circle cx={railX} cy={yIn} r="3" fill={inp.accent} />
                  <line x1={railX} y1={yIn} x2={l.bar ? orX - 16 : orX - 2} y2={yIn}
                        stroke={c} strokeWidth="1.6"
                        style={{ filter: v ? 'drop-shadow(0 0 3px rgba(251,113,133,0.6))' : 'none' }} />
                  {l.bar && (
                    <>
                      <circle cx={orX - 12} cy={yIn} r="2.4" fill={railFill} stroke={wirePos} strokeWidth="1.4" />
                      <line x1={orX - 9} y1={yIn} x2={orX - 2} y2={yIn} stroke={c} strokeWidth="1.6" />
                    </>
                  )}
                </g>
              );
            })}
            <path d={`M ${orX} ${orY1} Q ${orX + 22} ${midY} ${orX} ${orY2}
                      Q ${orX + orW - 18} ${orY2 - 4} ${orX + orW} ${midY}
                      Q ${orX + orW - 18} ${orY1 + 4} ${orX} ${orY1} Z`}
                  fill={railFill} stroke={orStroke} strokeWidth="2.5" />
            <text x={orX + 18} y={midY + 5} fontSize="13" fontFamily="monospace"
                  fontWeight="bold" fill={orStroke}>OR</text>
            <line x1={orX + orW} y1={midY} x2={500} y2={midY}
                  stroke={orVal ? orStroke : dim} strokeWidth="2.5"
                  style={{ filter: orVal ? 'drop-shadow(0 0 4px rgba(34,197,94,0.7))' : 'none' }} />
            <text x={orX + orW + 8} y={midY - 6} fontSize="10" fontFamily="monospace"
                  fill={orStroke} fontWeight="bold">
              ({orGroup.map(litLabel).join('+')})={orVal}
            </text>
          </g>
        );
      })()}

      {/* Second branch: single literal (possibly barred) into AND */}
      {(() => {
        const idx = inputs.findIndex((inp) => inp.sym === secondLit.sym);
        if (idx < 0) return null;
        const inp = inputs[idx];
        const railX = railLeft + idx * railSpacing;
        const yIn = 230;
        const v = evalLit(secondLit, inputs);
        const c = v ? inp.accent : dim;
        return (
          <g>
            <circle cx={railX} cy={yIn} r="3" fill={inp.accent} />
            <line x1={railX} y1={yIn} x2={secondLit.bar ? 360 - 16 : 500} y2={yIn}
                  stroke={c} strokeWidth="1.6"
                  style={{ filter: v ? 'drop-shadow(0 0 3px rgba(251,113,133,0.6))' : 'none' }} />
            {secondLit.bar && (
              <>
                <polygon points={`${360 - 24},${yIn - 6} ${360 - 24},${yIn + 6} ${360 - 16},${yIn}`}
                        fill={railFill} stroke={wirePos} strokeWidth="1.4" />
                <circle cx={360 - 12} cy={yIn} r="2.4" fill={railFill} stroke={wirePos} strokeWidth="1.4" />
                <line x1={360 - 9} y1={yIn} x2={500} y2={yIn} stroke={c} strokeWidth="1.6"
                      style={{ filter: v ? 'drop-shadow(0 0 3px rgba(251,113,133,0.6))' : 'none' }} />
                <text x={360 - 30} y={yIn - 8} fontSize="9" fontFamily="monospace" fill={wirePos}>
                  {secondLit.sym}′
                </text>
              </>
            )}
          </g>
        );
      })()}

      {/* AND gate combining top OR with bottom literal */}
      {(() => {
        const andX = 500;
        const andW = 40;
        const top = 110;
        const bot = 240;
        const midY = (top + bot) / 2;
        return (
          <g>
            <path d={`M ${andX} ${top} L ${andX + andW * 0.55} ${top} A ${(bot - top) / 2} ${(bot - top) / 2} 0 0 1 ${andX + andW * 0.55} ${bot} L ${andX} ${bot} Z`}
                  fill={railFill} stroke={wireGold} strokeWidth="2.5" />
            <text x={andX + 6} y={midY + 5} fontSize="13" fontFamily="monospace"
                  fontWeight="bold" fill={wireGold}>AND</text>

            {/* Output line + box */}
            <line x1={andX + andW} y1={midY} x2={620} y2={midY}
                  stroke={out ? wirePos : dim} strokeWidth="3"
                  style={{ filter: out ? 'drop-shadow(0 0 6px rgba(251,113,133,0.7))' : 'none' }} />
            <rect x="620" y={midY - 22} width="70" height="44" rx="8"
                  fill={out ? wirePos : 'none'} stroke={wirePos} strokeWidth="2.5"
                  style={{ filter: out ? 'drop-shadow(0 0 14px rgba(251,113,133,0.65))' : 'none' }} />
            <text x="655" y={midY + 6} textAnchor="middle"
                  fontSize="16" fontFamily="monospace" fontWeight="bold"
                  fill={out ? '#000' : wirePos}>
              {outputSym}={out}
            </text>
          </g>
        );
      })()}

      {/* Footer legend */}
      <text x="20" y={totalH - 10} fontSize="9" fontFamily="monospace" fill={subText}>
        Pattern · OR group → AND with second factor (factored / POS-style)
      </text>
    </svg>
  );
};
