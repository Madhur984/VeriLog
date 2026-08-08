import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface VariableAnnotation {
  symbol: string;
  name: string;
  description: string;
  unit?: string;
  color?: string;
}

export interface DerivationStep {
  title: string;
  latex: string;
  explanation: string;
}

export interface TextbookEquationProps {
  /** LaTeX formula string or piecewise definition */
  math: string;
  /** Display mode (true for block centered textbook equation, false for inline) */
  block?: boolean;
  /** Optional title / label for the equation (e.g. "Equation 3.1: Unit Step Signal") */
  title?: string;
  /** Optional subtitle or context */
  subtitle?: string;
  /** Variable breakdown table/cards for proper engineering annotation */
  variables?: VariableAnnotation[];
  /** Optional step-by-step derivation accordion or list */
  steps?: DerivationStep[];
  /** Optional engineering note or tip callout */
  note?: string;
  /** Custom CSS classes */
  className?: string;
}

export const TextbookEquation: React.FC<TextbookEquationProps> = ({
  math,
  block = true,
  title,
  subtitle,
  variables,
  steps,
  note,
  className = '',
}) => {
  const renderedMath = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        trust: true,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return math;
    }
  }, [math, block]);

  if (!block) {
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedMath }}
      />
    );
  }

  return (
    <div className={`my-6 rounded-xl border border-slate-700/70 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 p-5 shadow-2xl backdrop-blur-md transition-all hover:border-cyan-500/40 ${className}`}>
      {/* Header Banner */}
      {(title || subtitle) && (
        <div className="mb-4 border-b border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            {title && (
              <h4 className="text-sm uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                {title}
              </h4>
            )}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <span className="self-start md:self-auto text-[10px] tracking-widest font-mono text-cyan-500/80 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
            TEXTBOOK SPEC 2.0
          </span>
        </div>
      )}

      {/* Main Formula Render Box */}
      <div className="relative group overflow-x-auto py-4 px-6 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-center min-h-[70px]">
        <div
          className="text-lg md:text-xl text-slate-100 tracking-wide select-all"
          dangerouslySetInnerHTML={{ __html: renderedMath }}
        />
      </div>

      {/* Variable Annotations */}
      {variables && variables.length > 0 && (
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Variable Notation & Definitions
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {variables.map((item, idx) => {
              const itemMath = katex.renderToString(item.symbol, { displayMode: false, throwOnError: false });
              return (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <span
                    className="px-2 py-1 rounded bg-cyan-950/70 border border-cyan-800/50 font-mono text-xs text-cyan-300 shrink-0"
                    dangerouslySetInnerHTML={{ __html: itemMath }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-medium text-slate-200 truncate">{item.name}</span>
                      {item.unit && <span className="text-[10px] text-slate-400 font-mono">[{item.unit}]</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step-by-Step Derivation */}
      {steps && steps.length > 0 && (
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Step-by-Step Mathematical Derivation
          </h5>
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const stepMath = katex.renderToString(step.latex, { displayMode: true, throwOnError: false });
              return (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-amber-300/90 border-b border-slate-800/60 pb-1.5">
                    <span>Step {idx + 1}: {step.title}</span>
                  </div>
                  <div className="overflow-x-auto py-2 text-center" dangerouslySetInnerHTML={{ __html: stepMath }} />
                  <p className="text-xs text-slate-300 bg-slate-900/70 p-2 rounded border border-slate-800/50 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Engineering Note */}
      {note && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-2 text-xs text-emerald-300">
          <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="font-semibold text-emerald-200">Engineering Note: </strong>
            <span>{note}</span>
          </div>
        </div>
      )}
    </div>
  );
};
