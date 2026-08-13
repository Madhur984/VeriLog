import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Play, ChevronRight, Mail, Calendar, Clock, ShieldCheck, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getSession, clearSession } from '../lib/auth';
import { useColorScheme } from '../hooks/useColorScheme';
import { getModuleHistory, getLastModule } from '../lib/moduleHistory';
import { ThemeToggle } from '../components/ThemeToggle';

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

const PROVIDER_LABEL: Record<string, string> = {
  google: 'Google', github: 'GitHub', linkedin: 'LinkedIn', linkedin_oidc: 'LinkedIn', email: 'Email',
};

// Multi-colour pops for the learning-path timeline (mirrors the coming-soon
// countdown's per-unit accent colours).
const NODE_ACCENTS = ['#7A3FD0', '#9A54E6', '#0FB6D6', '#10b981', '#FF7A1A', '#ec4899', '#ef4444', '#14b8a6'];

/**
 * Learner profile — opened from the portal profile card. Shows only real data
 * (Supabase account details + the learner's actual recorded module activity),
 * restyled to the BitForBytes neo-brutalist system (lavender substrate + soft
 * glow, white cards with thick ink borders + hard offset shadows, purple
 * accents, Space Grotesk + JetBrains Mono) to match /login and /settings.
 */
export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const session = getSession();
  const isGuest = session.kind === 'guest';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(session.kind === 'supabase');

  useEffect(() => {
    if (session.kind !== 'supabase') return;
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) {
        // Dead/expired session — send the user to a working sign-in instead of a hollow profile.
        clearSession();
        navigate('/login', { replace: true });
        return;
      }
      setUser(data.user);
      setLoading(false);
    });
    return () => { active = false; };
  }, [session.kind, navigate]);

  const name = (user?.user_metadata?.full_name as string) || session.displayName || 'Learner';
  const email = user?.email ?? null;
  const provider = (user?.app_metadata?.provider as string) || 'email';
  const history = getModuleHistory();
  const last = getLastModule();

  let shortId = '';
  try {
    const raw = isGuest ? (localStorage.getItem('guest_id') || '') : (user?.id || '');
    shortId = raw ? raw.replace(/-/g, '').slice(0, 8).toUpperCase() : '';
  } catch { /* ignore */ }

  // ── neo-brutalist class fragments (light + dark) ──
  const cardCls =
    'rounded-[18px] border-[3px] border-[#1B1436] bg-white shadow-[6px_6px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#151030] dark:shadow-[6px_6px_0_#7A3FD0]';
  const tileCls =
    'rounded-[14px] border-[2.5px] border-[#1B1436] bg-white shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#151030] dark:shadow-[4px_4px_0_#7A3FD0]';
  const pillBtn =
    'inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-white px-4 py-2 text-[13px] font-bold text-[#1B1436] shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-white dark:shadow-[3px_3px_0_#7A3FD0] dark:hover:shadow-[5px_5px_0_#7A3FD0]';
  const primaryBtn =
    'inline-flex flex-shrink-0 items-center gap-2 rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] px-5 py-2.5 text-[14px] font-bold text-white shadow-[4px_4px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[4px_4px_0_#3A2064]';
  const heading = 'text-[#1B1436] dark:text-white';
  const sub = 'text-[#4A3F63] dark:text-[#B9AEDA]';
  const sectionLabel = 'font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-[#6B5E86] dark:text-[#8E80B4]';

  const accountRows: Array<{ icon: React.ReactNode; label: string; value: string }> = [
    { icon: <Mail size={15} />, label: 'Email', value: loading ? 'Loading…' : (email || '—') },
    { icon: <ShieldCheck size={15} />, label: 'Signed in with', value: PROVIDER_LABEL[provider] || provider },
    { icon: <Calendar size={15} />, label: 'Member since', value: loading ? 'Loading…' : formatDate(user?.created_at) },
    { icon: <Clock size={15} />, label: 'Last sign-in', value: loading ? 'Loading…' : formatDate(user?.last_sign_in_at) },
  ];

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-[#F1ECFF] font-sans text-[#1B1436] transition-colors duration-300 dark:bg-[#0F0B1E] dark:text-white">
      {/* Soft top glow (matches the login / coming-soon substrate). */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[760px] bg-[radial-gradient(1200px_720px_at_50%_-12%,#E7DEFF,transparent_62%)] dark:bg-[radial-gradient(1200px_760px_at_50%_-14%,#241A45,transparent_60%)]" />

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b-[3px] border-[#1B1436] bg-[#F1ECFF]/85 px-4 py-4 backdrop-blur-md dark:border-[#4A3D7A] dark:bg-[#0F0B1E]/85 sm:px-8">
        <button onClick={() => navigate('/portal')} className={pillBtn}><ArrowLeft size={16} /> Portal</button>
        <div className="flex items-center gap-2">
          <Link to="/settings" className={pillBtn}><Settings size={15} /> Settings</Link>
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-8">
        {/* ── Identity header ── */}
        <motion.div {...fade(0)} className={`p-6 sm:p-7 ${cardCls}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] text-2xl font-black text-white shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[4px_4px_0_#3A2064]">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[2.5px] border-[#1B1436] bg-emerald-500 dark:border-[#4A3D7A]" />
              </div>
              <div className="min-w-0">
                <h1 className={`truncate text-2xl font-bold tracking-tight ${heading}`}>{name}</h1>
                <p className={`truncate text-[14px] ${sub}`}>
                  {isGuest ? 'Guest learner · saved on this device' : (email || 'Signed-in learner')}
                </p>
                {shortId && <p className={`mt-0.5 font-mono text-[11px] ${sub}`}>ID · {shortId}</p>}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3 rounded-2xl border-[2.5px] border-[#1B1436] bg-[#F1ECFF] px-5 py-3 shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:shadow-[4px_4px_0_#7A3FD0]">
              <BookOpen size={20} className="text-[#7A3FD0] dark:text-[#B98BFF]" />
              <div>
                <div className={`text-2xl font-extrabold leading-none tabular-nums ${heading}`}>{history.length}</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-[#6B5E86] dark:text-[#8E80B4]">modules opened</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Account (real data) ── */}
        {isGuest ? (
          <motion.section {...fade(0.06)} className={`p-6 ${cardCls}`}>
            <h2 className={sectionLabel}>Account</h2>
            <p className={`mt-3 text-[14px] ${sub}`}>You are browsing as a guest. Your activity is saved only on this device.</p>
            <button onClick={() => navigate('/login')} className={`${primaryBtn} mt-4`}>Create a free account</button>
          </motion.section>
        ) : (
          <motion.div {...fade(0.06)} className="grid gap-4 sm:grid-cols-3">
            {accountRows.filter((r) => r.label !== 'Email').map((r) => (
              <div key={r.label} className={`p-4 ${tileCls}`}>
                <div className={`flex items-center gap-2 ${sub}`}>{r.icon}<span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]">{r.label}</span></div>
                <div className={`mt-1.5 truncate text-[16px] font-bold ${heading}`}>{r.value}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Continue where you left off ── */}
        {last && (
          <motion.section {...fade(0.12)} className={`relative overflow-hidden p-6 ${cardCls}`}>
            <span className="absolute left-0 top-0 h-full w-2 bg-[#FF7A1A]" />
            <h2 className={sectionLabel}>Continue where you left off</h2>
            <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 max-w-full">
                <div className={`truncate text-xl font-extrabold ${heading}`}>{last.label}</div>
                <div className={`text-[13px] ${sub}`}>Jump back into your last session</div>
              </div>
              <Link to={last.path} className={primaryBtn}><Play size={15} /> Resume</Link>
            </div>
          </motion.section>
        )}

        {/* ── Learning path (real activity) ── */}
        <motion.section {...fade(0.18)} className={`p-6 ${cardCls}`}>
          <h2 className={sectionLabel}>Your learning path{history.length > 0 ? ` · ${history.length}` : ''}</h2>

          {history.length === 0 ? (
            <div className="mt-2 flex flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[2.5px] border-[#1B1436] bg-[#F1ECFF] text-[#7A3FD0] shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1440] dark:text-[#B98BFF] dark:shadow-[4px_4px_0_#7A3FD0]"><BookOpen size={28} /></span>
              <p className={`max-w-xs text-[14px] ${sub}`}>You haven't opened any modules yet. Start your first one and it joins your path here.</p>
              <Link to="/module/1" className={primaryBtn}><Play size={15} /> Start learning</Link>
            </div>
          ) : (
            <ol className="mt-4">
              {history.map((m, i) => {
                const accent = NODE_ACCENTS[i % NODE_ACCENTS.length];
                const isFirst = i === 0;
                return (
                  <li key={m.id} className="relative flex gap-4 pb-4 last:pb-0">
                    {i < history.length - 1 && (
                      <span className="absolute left-[13px] top-9 bottom-0 w-[2px] bg-[#1B1436]/15 dark:bg-white/15" />
                    )}
                    <span className="relative z-10 mt-1.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#1B1436] bg-white shadow-[2px_2px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#151030] dark:shadow-[2px_2px_0_#7A3FD0]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                    </span>
                    <Link to={m.path}
                      className="group flex flex-1 items-center justify-between gap-3 rounded-xl border-[2.5px] border-[#1B1436] px-4 py-3 shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_#1B1436] active:translate-x-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0] dark:hover:shadow-[5px_5px_0_#7A3FD0]"
                      style={{ background: isLight ? `${accent}14` : `${accent}22` }}>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-[2px] border-[#1B1436] dark:border-[#4A3D7A]" style={{ background: `${accent}2A`, color: accent }}>
                          <BookOpen size={15} />
                        </span>
                        <div className="min-w-0">
                          <div className={`truncate text-[15px] font-bold ${heading}`}>{m.label}</div>
                          {isFirst && <div className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>Most recent</div>}
                        </div>
                      </div>
                      <ChevronRight size={18} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: accent }} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePage;
