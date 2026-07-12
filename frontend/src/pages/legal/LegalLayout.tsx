import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useColorScheme } from '../../hooks/useColorScheme';

export interface LegalSection {
  id: string;
  heading: string;
  paras?: string[];
  bullets?: string[];
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  /** Link to the sibling legal document. */
  sibling: { label: string; to: string };
}

const ACCENT = '#7A3FD0';

/**
 * Shared shell for the Privacy Policy and Terms of Service. Readable long-form
 * document with a sticky table of contents, theme-aware via the shared
 * useColorScheme store (never a local copy). Content is data-driven so both
 * pages stay visually identical.
 */
export const LegalLayout: React.FC<LegalLayoutProps> = ({ eyebrow, title, updated, intro, sections, sibling }) => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';

  const text = dark ? 'text-white' : 'text-[#1B1436]';
  const sub = dark ? 'text-[#B9AEDA]' : 'text-[#4A4560]';
  const faint = dark ? 'text-[#8E80B4]' : 'text-[#6B6191]';
  const card = dark
    ? 'border-[#4A3D7A] bg-[#151030] shadow-[5px_5px_0_#7A3FD0]'
    : 'border-[#1B1436] bg-white shadow-[5px_5px_0_#1B1436]';
  const rule = dark ? 'border-white/10' : 'border-[#1B1436]/12';

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0C0918]' : 'bg-[#F1ECFF]'} ${text}`}>
      <div className="mx-auto max-w-5xl px-5 pt-16 sm:px-6">
        <Link
          to="/"
          className={`inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold ${faint} hover:text-[#7A3FD0] transition-colors`}
        >
          <ArrowLeft size={13} /> Back to BitForBytes
        </Link>

        {/* Header card */}
        <header className={`mt-5 rounded-2xl border-[2.5px] ${card} px-6 py-7 sm:px-8`}>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
            <ShieldCheck size={14} /> {eyebrow}
          </span>
          <h1 className={`mt-4 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.1] tracking-tight ${text}`}>{title}</h1>
          <p className={`mt-2 font-mono text-[12px] ${faint}`}>Last updated: {updated}</p>
          <p className={`mt-4 max-w-[62ch] text-[15px] leading-relaxed ${sub}`}>{intro}</p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Table of contents */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <div className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${faint} mb-3`}>On this page</div>
            <ol className="space-y-1.5">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block text-[13px] leading-snug ${sub} hover:text-[#7A3FD0] transition-colors`}
                  >
                    <span className="font-mono text-[11px] tabular-nums" style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span>{' '}
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Body */}
          <article className="min-w-0">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 mb-9">
                <h2 className={`text-[19px] font-bold tracking-tight ${text}`}>
                  <span className="font-mono text-[14px] font-semibold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}. </span>
                  {s.heading}
                </h2>
                <div className={`mt-3 border-t ${rule} pt-4 space-y-3`}>
                  {s.paras?.map((p, j) => (
                    <p key={j} className={`text-[15px] leading-[1.7] ${sub}`}>{p}</p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-1 space-y-2 pl-1">
                      {s.bullets.map((b, j) => (
                        <li key={j} className={`flex gap-2.5 text-[15px] leading-[1.6] ${sub}`}>
                          <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: ACCENT }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            <div className={`mt-4 rounded-xl border-[2px] ${rule} border-dashed p-5`}>
              <p className={`text-[14px] leading-relaxed ${sub}`}>
                Questions about this document? Email{' '}
                <a href="mailto:info@bitforbytes.in" className="font-semibold underline underline-offset-2" style={{ color: ACCENT }}>info@bitforbytes.in</a>.
                {' '}See also our{' '}
                <Link to={sibling.to} className="font-semibold underline underline-offset-2" style={{ color: ACCENT }}>{sibling.label}</Link>.
              </p>
              <p className={`mt-3 font-mono text-[11px] ${faint}`}>© 2026 BitForBytes · learn to design real chips</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
