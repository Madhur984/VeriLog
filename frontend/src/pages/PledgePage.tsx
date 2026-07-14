import React, { useState } from 'react';
import { Flag, BadgeCheck, Users, Share2, Mail, Sparkles } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { SOCIAL_LINKS } from './landing/landingRoutes';

/**
 * The India ECE Pledge + the Alumni Wall.
 *
 * The pledge is identity, not paperwork: one sentence, taken once, stored
 * locally, rewarded with a badge and the community channel. The wall starts
 * honestly empty: real outcomes only, submitted by real students, no
 * fabricated success stories.
 */

const PLEDGE_KEY = 'bfb_pledge_taken';
const ACCENT = '#F472B6';
const GOLD = '#F59E0B';

function readPledge(): string | null {
  try { return localStorage.getItem(PLEDGE_KEY); } catch { return null; }
}

export const PledgePage: React.FC = () => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';
  const [takenOn, setTakenOn] = useState<string | null>(readPledge);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const takePledge = () => {
    const date = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem(PLEDGE_KEY, date); } catch { /* private mode */ }
    setTakenOn(date);
  };

  const sharePledge = async () => {
    const caption =
      "I took the India ECE Pledge on BitForBytes: I am building India's semiconductor future. One module at a time.";
    try {
      if (navigator.share) {
        await navigator.share({ text: caption, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${caption} ${window.location.href}`);
      notify('Pledge copied. Paste it on LinkedIn or WhatsApp.');
    } catch {
      notify('Sharing is blocked in this browser.');
    }
  };

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';
  const card = dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg';

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0A0B12]' : 'bg-white'} ${text}`}>
      <div className="mx-auto max-w-4xl px-5 pt-20 sm:px-6">
        {/* ── the pledge ── */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            <Flag size={14} /> The India ECE Pledge
          </span>
          <h1 className={`mt-6 text-[clamp(1.9rem,4.4vw,3.2rem)] font-extrabold leading-[1.15] tracking-tight ${text}`}>
            "I am building India's semiconductor future.
            <span className="block" style={{ color: ACCENT }}>One module at a time."</span>
          </h1>
          <p className={`mt-5 text-lg leading-relaxed ${sub}`}>
            Optional. One sentence. But the people who say it out loud tend to be the
            ones who finish.
          </p>

          {takenOn ? (
            <div className="mx-auto mt-8 max-w-sm rounded-3xl border-2 p-6"
                 style={{ borderColor: `${GOLD}66`, background: dark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.07)' }}>
              <BadgeCheck size={36} className="mx-auto" style={{ color: GOLD }} />
              <div className="mt-2 font-mono text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                India Builder
              </div>
              <p className={`mt-1 text-sm ${sub}`}>Pledge taken on {takenOn}</p>
              <button
                onClick={() => void sharePledge()}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
                style={{ background: GOLD }}
              >
                <Share2 size={13} /> Tell people
              </button>
            </div>
          ) : (
            <button
              onClick={takePledge}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[16px] font-bold text-white transition-all active:scale-[0.98]"
              style={{ background: ACCENT, boxShadow: `0 14px 38px -12px ${ACCENT}AA` }}
            >
              <Flag size={17} /> Take the pledge
            </button>
          )}
        </div>

        {/* ── what pledgers get ── */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            [BadgeCheck, 'The India Builder badge', 'Shows on this page now, and on your profile as the community features roll out.'],
            [Users, 'The India Building channel', 'The community space where pledgers share builds, doubts and offers. Lives on our Discord.'],
            [Sparkles, 'The public wall', 'Pledgers who share an outcome get listed on the Engineers Building India wall below.'],
          ].map(([Icon, title, body]) => {
            const I = Icon as React.FC<{ size?: number; className?: string }>;
            return (
              <div key={title as string} className={`rounded-3xl border p-5 ${card}`}>
                <I size={20} className="text-pink-400" />
                <h3 className={`mt-3 text-[15px] font-extrabold ${text}`}>{title as string}</h3>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${sub}`}>{body as string}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer"
             className="font-mono text-xs font-bold uppercase tracking-widest underline underline-offset-4"
             style={{ color: ACCENT }}>
            Join the community channel
          </a>
        </div>

        {/* ── the alumni wall ── */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Engineers Building India
            </span>
            <h2 className={`mt-3 text-[clamp(1.6rem,3.6vw,2.4rem)] font-extrabold leading-[1.12] tracking-tight ${text}`}>
              The Alumni Wall
            </h2>
            <p className={`mt-3 text-base leading-relaxed ${sub}`}>
              Real outcomes only. As BitForBytes students land roles, their stories go up
              here, name, college, company, tracks completed. The wall is just opening,
              and the founding spots are empty on purpose: one of them is yours.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* founding slots: honest placeholders, no fabricated stories */}
            {[1, 2, 3].map((n) => (
              <div key={n}
                   className={`flex flex-col rounded-3xl border-2 border-dashed p-5 ${
                     dark ? 'border-white/15' : 'border-slate-300'
                   }`}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                  Founding spot #{n}
                </span>
                <p className={`mt-3 text-[15px] font-bold leading-snug ${text}`}>
                  Your Name, Your College
                  <span className={`block font-normal ${sub}`}>to Your Dream Team</span>
                </p>
                <p className={`mt-2 text-[12px] ${sub}`}>Completed: the tracks you finish</p>
                <p className={`mt-auto pt-3 font-mono text-[11px] ${sub}`}>This card is waiting for you.</p>
              </div>
            ))}
          </div>

          <div className={`mx-auto mt-8 max-w-xl rounded-3xl border p-6 text-center ${card}`}>
            <Mail size={20} className="mx-auto text-pink-400" />
            <h3 className={`mt-2 text-[15px] font-extrabold ${text}`}>Landed something? Get on the wall.</h3>
            <p className={`mt-1.5 text-[13px] leading-relaxed ${sub}`}>
              Send your name, college, the role you landed and the tracks you completed.
              We verify and post it, and your story becomes the proof for the next student.
            </p>
            <a
              href={`${SOCIAL_LINKS.email}?subject=Alumni%20Wall%3A%20my%20outcome`}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
              style={{ background: ACCENT }}
            >
              <Mail size={13} /> Share your outcome
            </a>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-pink-400/40 bg-slate-950 px-5 py-4 text-center text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default PledgePage;
