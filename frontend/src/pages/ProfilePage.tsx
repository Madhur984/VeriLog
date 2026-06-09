import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Play, ChevronRight, Mail, Calendar, Clock, ShieldCheck, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getSession } from '../lib/auth';
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

const NODE_ACCENTS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#14b8a6'];

/**
 * Learner profile — opened from the portal profile card. Shows only real data
 * (Supabase account details + the learner's actual recorded module activity),
 * laid out as a two-column engineer dashboard.
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
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [session.kind]);

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

  // ── theme tokens ──
  const pageBg = isLight
    ? 'radial-gradient(ellipse 120% 90% at 50% 0%, #FFFFFF 0%, #EEF1F6 75%)'
    : 'radial-gradient(ellipse 120% 90% at 50% 0%, #0d1526 0%, #06090f 80%)';
  const card: React.CSSProperties = {
    background: isLight ? '#FFFFFF' : 'rgba(7,10,18,0.92)',
    border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(59,130,246,0.16)',
    boxShadow: isLight ? '0 12px 36px rgba(15,23,42,0.07)' : '0 24px 60px rgba(0,0,0,0.55)',
  };
  const heading = isLight ? 'text-slate-900' : 'text-white';
  const sub = isLight ? 'text-slate-500' : 'text-slate-400';
  const lineColor = isLight ? '#E8ECF2' : 'rgba(255,255,255,0.08)';
  const tileBg = isLight ? '#F8FAFC' : 'rgba(255,255,255,0.03)';
  const pillBtn = `inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
    isLight ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-white/[0.05] border border-white/10 text-slate-200 hover:bg-white/10'
  }`;
  const darkPill = 'inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';
  const sectionLabel = `text-[12px] font-black uppercase tracking-[0.2em] ${sub}`;

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
    <div className="relative min-h-[100svh] w-full overflow-hidden font-sans transition-colors duration-300" style={{ background: pageBg }}>
      {/* Dotted depth texture, fading toward the centre */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.05)'} 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 25%, transparent 25%, black 90%)',
          maskImage: 'radial-gradient(ellipse 75% 55% at 50% 25%, transparent 25%, black 90%)',
        }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 backdrop-blur-md"
        style={{ borderBottom: isLight ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/portal')} className={pillBtn}><ArrowLeft size={16} /> Portal</button>
        <div className="flex items-center gap-2">
          <Link to="/settings" className={pillBtn}><Settings size={15} /> Settings</Link>
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-8 py-8 space-y-6">
        {/* ── Identity header (clean, no banner) ── */}
        <motion.div {...fade(0)} className="rounded-3xl p-6 sm:p-7" style={card}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #4F46E5)' }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 bg-emerald-500"
                  style={{ borderColor: isLight ? '#FFFFFF' : '#0d1526' }} />
              </div>
              <div className="min-w-0">
                <h1 className={`truncate text-2xl font-extrabold tracking-tight ${heading}`}>{name}</h1>
                <p className={`truncate text-[14px] ${sub}`}>
                  {isGuest ? 'Guest learner · saved on this device' : (email || 'Signed-in learner')}
                </p>
                {shortId && <p className={`mt-0.5 font-mono text-[11px] ${sub}`}>ID · {shortId}</p>}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3 rounded-2xl px-5 py-3"
              style={{ background: isLight ? '#F1F5F9' : 'rgba(255,255,255,0.04)', border: `1px solid ${lineColor}` }}>
              <BookOpen size={20} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
              <div>
                <div className={`text-2xl font-extrabold leading-none tabular-nums ${heading}`}>{history.length}</div>
                <div className={`mt-1 text-[11px] font-semibold ${sub}`}>modules opened</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Account (real data) ── */}
        {isGuest ? (
          <motion.section {...fade(0.06)} className="rounded-2xl p-6" style={card}>
            <h2 className={sectionLabel}>Account</h2>
            <p className={`mt-3 text-[14px] ${sub}`}>You are browsing as a guest. Your activity is saved only on this device.</p>
            <button onClick={() => navigate('/login')} className={`${darkPill} mt-4`}>Create a free account</button>
          </motion.section>
        ) : (
          <motion.div {...fade(0.06)} className="grid gap-4 sm:grid-cols-3">
            {accountRows.filter((r) => r.label !== 'Email').map((r) => (
              <div key={r.label} className="rounded-2xl p-4" style={card}>
                <div className={`flex items-center gap-2 ${sub}`}>{r.icon}<span className="text-[11px] font-bold uppercase tracking-[0.12em]">{r.label}</span></div>
                <div className={`mt-1.5 truncate text-[16px] font-bold ${heading}`}>{r.value}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Continue where you left off ── */}
        {last && (
          <motion.section {...fade(0.12)} className="relative overflow-hidden rounded-2xl p-6" style={card}>
            <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: NODE_ACCENTS[0] }} />
            <h2 className={sectionLabel}>Continue where you left off</h2>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className={`truncate text-xl font-extrabold ${heading}`}>{last.label}</div>
                <div className={`text-[13px] ${sub}`}>Jump back into your last session</div>
              </div>
              <Link to={last.path} className={darkPill}><Play size={15} /> Resume</Link>
            </div>
          </motion.section>
        )}

        {/* ── Learning path (real activity) ── */}
        <motion.section {...fade(0.18)} className="rounded-2xl p-6" style={card}>
          <h2 className={sectionLabel}>Your learning path{history.length > 0 ? ` · ${history.length}` : ''}</h2>

          {history.length === 0 ? (
            <div className="mt-2 flex flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-300"><BookOpen size={28} /></span>
              <p className={`max-w-xs text-[14px] ${sub}`}>You haven't opened any modules yet. Start your first one and it joins your path here.</p>
              <Link to="/module/1" className={darkPill}><Play size={15} /> Start learning</Link>
            </div>
          ) : (
            <ol className="mt-4">
                  {history.map((m, i) => {
                    const accent = NODE_ACCENTS[i % NODE_ACCENTS.length];
                    const isFirst = i === 0;
                    return (
                      <li key={m.id} className="relative flex gap-4 pb-4 last:pb-0">
                        {i < history.length - 1 && (
                          <span className="absolute left-[13px] top-9 bottom-0 w-px" style={{ background: lineColor }} />
                        )}
                        <span className="relative z-10 mt-1.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${accent}26`, border: `2px solid ${accent}` }}>
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                        </span>
                        <Link to={m.path}
                          className="group flex flex-1 items-center justify-between gap-3 rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                          style={{
                            background: isLight ? `linear-gradient(100deg, ${accent}12, #FFFFFF 65%)` : `linear-gradient(100deg, ${accent}24, rgba(255,255,255,0.02) 65%)`,
                            border: `1px solid ${isLight ? accent + '33' : accent + '40'}`,
                          }}>
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent}22`, color: accent }}>
                              <BookOpen size={15} />
                            </span>
                            <div className="min-w-0">
                              <div className={`truncate text-[15px] font-bold ${heading}`}>{m.label}</div>
                              {isFirst && <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>Most recent</div>}
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
