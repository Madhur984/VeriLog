import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Share2, Briefcase, IndianRupee, GraduationCap, TrendingUp } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { getModuleHistory } from '../lib/moduleHistory';

/**
 * The Silicon India Map: a stylized, interactive map of India's semiconductor
 * ecosystem. Click a city to see who designs chips there, what roles look
 * like, and which BitforBytes skills those roles lean on. If you have opened
 * modules, the map highlights the companies your progress matches.
 *
 * Honesty note: role counts and packages are indicative snapshots compiled
 * from public postings and reports, not a live feed. The page says so.
 */

type Track = 'dsd' | 'verilog' | 'be';

const TRACKS: Record<Track, { label: string; route: string; color: string }> = {
  dsd:     { label: 'Digital System Design', route: '/dsd/1',               color: '#A78BFA' },
  verilog: { label: 'Verilog',               route: '/module/5',             color: '#F472B6' },
  be:      { label: 'Basic Electronics',     route: '/basic-electronics/1',  color: '#60A5FA' },
};

// Equirectangular projection: real longitude/latitude -> SVG coordinates, so the
// country outline and every city dot share one consistent geographic frame and
// the cities always land in the right place. India spans roughly 68-97 E and
// 8-37 N; the 13.8 vs 15 scale bakes in the cos(latitude) longitude correction.
const project = (lng: number, lat: number): [number, number] => [
  +((lng - 67) * 13.8).toFixed(1),
  +((38 - lat) * 15).toFixed(1),
];

interface City { id: string; name: string; lng: number; lat: number }

// Real city coordinates (lng, lat); projected to the map at render time.
const CITIES: City[] = [
  { id: 'ncr',       name: 'Delhi NCR (Noida)', lng: 77.32, lat: 28.55 },
  { id: 'mohali',    name: 'Mohali',            lng: 76.72, lat: 30.70 },
  { id: 'ahmedabad', name: 'Ahmedabad/Sanand',  lng: 72.58, lat: 23.02 },
  { id: 'dholera',   name: 'Dholera',           lng: 72.20, lat: 22.25 },
  { id: 'pune',      name: 'Pune',              lng: 73.86, lat: 18.52 },
  { id: 'hyderabad', name: 'Hyderabad',         lng: 78.49, lat: 17.39 },
  { id: 'bengaluru', name: 'Bengaluru',         lng: 77.59, lat: 12.97 },
  { id: 'chennai',   name: 'Chennai',           lng: 80.27, lat: 13.08 },
  { id: 'kolkata',   name: 'Kolkata',           lng: 88.36, lat: 22.57 },
];

interface Company {
  name: string;
  cities: string[];      // city ids
  focus: string;
  roles: number;         // indicative open ECE roles
  pkg: string;           // indicative fresher-to-mid package band
  skills: Track[];
}

const COMPANIES: Company[] = [
  { name: 'Qualcomm',          cities: ['bengaluru', 'hyderabad', 'chennai', 'ncr'], focus: 'Mobile SoCs, modems, RF',                 roles: 320, pkg: '₹16-32 LPA', skills: ['dsd', 'verilog'] },
  { name: 'Intel',             cities: ['bengaluru'],                                focus: 'CPU design, validation, graphics',        roles: 210, pkg: '₹15-30 LPA', skills: ['dsd', 'verilog', 'be'] },
  { name: 'AMD',               cities: ['hyderabad', 'bengaluru'],                   focus: 'CPU/GPU design (largest site outside US)', roles: 180, pkg: '₹16-30 LPA', skills: ['dsd', 'verilog'] },
  { name: 'NVIDIA',            cities: ['bengaluru', 'hyderabad', 'pune'],           focus: 'GPU architecture, verification',          roles: 200, pkg: '₹18-38 LPA', skills: ['dsd', 'verilog'] },
  { name: 'Texas Instruments', cities: ['bengaluru'],                                focus: 'Analog and embedded processing',          roles: 120, pkg: '₹14-26 LPA', skills: ['be', 'dsd'] },
  { name: 'Samsung Semicon.',  cities: ['bengaluru', 'ncr'],                         focus: 'SoC IP, memory, modem',                   roles: 160, pkg: '₹15-28 LPA', skills: ['dsd', 'verilog'] },
  { name: 'MediaTek',          cities: ['ncr', 'bengaluru'],                         focus: 'Mobile and smart-device SoCs',            roles: 90,  pkg: '₹14-26 LPA', skills: ['dsd', 'verilog'] },
  { name: 'Micron',            cities: ['hyderabad', 'ahmedabad'],                   focus: 'Memory design + Sanand ATMP plant',       roles: 140, pkg: '₹12-24 LPA', skills: ['dsd', 'be'] },
  { name: 'Tata Electronics',  cities: ['dholera', 'ahmedabad'],                     focus: 'India\'s first major fab (Dholera)',      roles: 250, pkg: '₹8-18 LPA',  skills: ['be', 'dsd'] },
  { name: 'Synopsys',          cities: ['bengaluru', 'ncr', 'hyderabad'],            focus: 'EDA tools, IP, AI for chip design',       roles: 130, pkg: '₹15-28 LPA', skills: ['verilog', 'dsd'] },
  { name: 'Cadence',           cities: ['ncr', 'bengaluru', 'pune'],                 focus: 'EDA tools and verification IP',           roles: 110, pkg: '₹15-28 LPA', skills: ['verilog', 'dsd'] },
  { name: 'NXP',               cities: ['ncr', 'bengaluru'],                         focus: 'Automotive and secure connectivity',      roles: 80,  pkg: '₹13-24 LPA', skills: ['dsd', 'be'] },
  { name: 'Marvell',           cities: ['pune', 'bengaluru'],                        focus: 'Data-center silicon, networking',         roles: 70,  pkg: '₹16-30 LPA', skills: ['dsd', 'verilog'] },
  { name: 'SCL',               cities: ['mohali'],                                   focus: 'Govt. fab, space-grade chips (ISRO)',     roles: 40,  pkg: '₹8-15 LPA',  skills: ['be', 'dsd'] },
  { name: 'Western Digital',   cities: ['bengaluru', 'kolkata'],                     focus: 'Storage controllers and firmware',        roles: 60,  pkg: '₹13-24 LPA', skills: ['dsd', 'verilog'] },
];

// A real, geographically-projected outline of India. Each vertex is an actual
// [lng, lat] point on the national boundary, run through the SAME projection as
// the cities, then smoothed into a flowing coastline. Traced clockwise from the
// northwest (Kashmir) -> Himalaya -> northeast -> east coast -> Kanyakumari (the
// southern tip) -> west coast -> Gujarat -> Pakistan border -> back to Kashmir.
const INDIA_BOUNDARY: [number, number][] = [
  // north: Kashmir, along the Himalaya to Arunachal
  [74.2, 34.5], [75.9, 35.5], [77.8, 35.3], [78.9, 34.2], [80.1, 32.6], [81.5, 30.3],
  [83.4, 29.3], [85.6, 28.3], [88.1, 27.9], [89.7, 28.1], [91.7, 27.7], [94.2, 28.6],
  [96.0, 28.3], [97.0, 27.6],
  // northeast: down the Myanmar border
  [96.0, 26.9], [95.0, 26.5], [94.5, 25.1], [94.1, 23.8], [93.3, 22.3],
  // around Bangladesh, down to the Bengal coast
  [92.1, 23.5], [91.1, 24.1], [89.8, 25.3], [88.3, 26.5], [88.0, 24.6], [88.7, 22.0],
  // east coast down to the southern tip
  [86.6, 21.0], [85.1, 19.6], [83.5, 18.0], [82.2, 16.6], [80.3, 15.6], [80.2, 13.3],
  [79.9, 11.7], [79.3, 10.3], [78.1, 9.1], [77.5, 8.08],
  // west coast up through Kerala and the Konkan to Mumbai
  [76.3, 8.9], [75.6, 11.9], [74.4, 13.9], [73.7, 15.8], [73.1, 17.9], [72.9, 19.2],
  // Gujarat: the Saurashtra peninsula and Kutch
  [72.9, 20.6], [72.2, 21.5], [70.9, 20.8], [69.4, 21.8], [68.6, 23.0], [68.4, 23.9],
  [70.8, 24.2],
  // Pakistan border up through Rajasthan and Punjab back to Kashmir
  [71.0, 27.2], [72.6, 28.9], [74.0, 30.2], [74.6, 32.6],
];

// Turn the boundary into a smooth closed path: quadratic curves through the
// midpoint of each edge (real vertices as control points) read as a coastline
// rather than a jagged polygon.
function smoothClosedPath(pts: [number, number][]): string {
  const mid = (a: [number, number], b: [number, number]): [number, number] =>
    [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const n = pts.length;
  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${start[0].toFixed(1)} ${start[1].toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const c = pts[i];
    const m = mid(c, pts[(i + 1) % n]);
    d += `Q ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)} `;
  }
  return d + 'Z';
}

const INDIA_PATH = smoothClosedPath(INDIA_BOUNDARY.map(([lng, lat]) => project(lng, lat)));

const ACCENT = '#38BDF8';

export const SiliconMap: React.FC = () => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';
  const [activeCity, setActiveCity] = useState<string | null>('bengaluru');
  const [toast, setToast] = useState<string | null>(null);

  // which tracks has this visitor actually started? (from local module history)
  const startedTracks = useMemo<Set<Track>>(() => {
    const started = new Set<Track>();
    try {
      for (const item of getModuleHistory()) {
        if (item.id.startsWith('dsd/')) started.add('dsd');
        else if (item.id.startsWith('module/')) started.add('verilog');
        else if (item.id.startsWith('basic-electronics/')) started.add('be');
      }
    } catch { /* no history */ }
    return started;
  }, []);

  const matchedCompanies = useMemo(
    () => COMPANIES.filter((co) => co.skills.some((s) => startedTracks.has(s))),
    [startedTracks],
  );

  const cityRoles = (cityId: string) =>
    COMPANIES.filter((co) => co.cities.includes(cityId)).reduce((acc, co) => acc + co.roles, 0);

  const activeCompanies = activeCity
    ? COMPANIES.filter((co) => co.cities.includes(activeCity))
    : COMPANIES;

  const share = async () => {
    const caption =
      "India's semiconductor job map: which companies hire ECE, in which city, and the skills each role leans on. BitforBytes breaks it down.";
    try {
      if (navigator.share) {
        await navigator.share({ text: caption, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${caption} ${window.location.href}`);
      setToast('Caption and link copied. Paste it on LinkedIn.');
    } catch {
      setToast('Sharing is blocked in this browser.');
    }
    window.setTimeout(() => setToast(null), 3200);
  };

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';
  const card = dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg';

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0A0B12]' : 'bg-white'} ${text}`}>
      <div className="mx-auto max-w-6xl px-5 pt-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
            <MapPin size={14} /> The Silicon India Map
          </span>
          <h1 className={`mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight ${text}`}>
            Where India designs its chips.
          </h1>
          <p className={`mt-4 text-lg leading-relaxed ${sub}`}>
            Tap a city to see who builds silicon there, what roles pay, and which BitforBytes
            track each role leans on.
          </p>
          <button
            onClick={() => void share()}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
            style={{ background: ACCENT }}
          >
            <Share2 size={14} /> Share this map
          </button>
        </div>

        {/* progress banner */}
        <div className={`mx-auto mt-10 max-w-3xl rounded-3xl border-2 p-5 text-center ${dark ? 'bg-sky-500/5' : 'bg-sky-50'}`}
             style={{ borderColor: `${ACCENT}44` }}>
          {startedTracks.size > 0 ? (
            <p className={`text-sm leading-relaxed ${text}`}>
              <strong style={{ color: ACCENT }}>Your progress is already on this map.</strong>{' '}
              You have started {startedTracks.size} of 3 skill tracks, which moves you closer to
              roles at <strong>{matchedCompanies.length} of {COMPANIES.length} companies</strong> shown here,
              including {matchedCompanies.slice(0, 3).map((c) => c.name).join(', ')}. Every module
              you finish lights up more of the map.
            </p>
          ) : (
            <p className={`text-sm leading-relaxed ${text}`}>
              <strong style={{ color: ACCENT }}>Start a module and watch this map change.</strong>{' '}
              Once you open your first lesson, the map shows which of these companies your new
              skills move you toward.{' '}
              <Link to="/portal" className="font-bold underline underline-offset-4" style={{ color: ACCENT }}>
                Open the workstation
              </Link>
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* the map */}
          <div className={`rounded-3xl border p-4 sm:p-6 ${card}`}>
            <svg viewBox="0 5 430 465" className="h-auto w-full" role="img" aria-label="Map of India with its semiconductor cities">
              <path d={INDIA_PATH} fill={dark ? 'rgba(56,189,248,0.06)' : 'rgba(56,189,248,0.08)'}
                    stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeOpacity={0.7} />
              {CITIES.map((c) => {
                const roles = cityRoles(c.id);
                if (roles === 0) return null;
                const [cx, cy] = project(c.lng, c.lat);
                const r = 6 + Math.min(12, roles / 90);
                const active = activeCity === c.id;
                return (
                  <g key={c.id} className="cursor-pointer" onClick={() => setActiveCity(active ? null : c.id)}>
                    <circle cx={cx} cy={cy} r={r + 7} fill={ACCENT} opacity={active ? 0.28 : 0.12} />
                    <circle cx={cx} cy={cy} r={r} fill={active ? ACCENT : dark ? '#0A0B12' : '#fff'}
                            stroke={ACCENT} strokeWidth="2.5" />
                    <text x={cx} y={cy - r - 10} textAnchor="middle" fontSize="12" fontFamily="monospace"
                          fontWeight="bold" fill={active ? ACCENT : dark ? '#94A3B8' : '#475569'}>
                      {c.name.split(' ')[0]}
                    </text>
                    <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="10" fontFamily="monospace"
                          fill={dark ? '#64748B' : '#94A3B8'}>
                      ~{roles} roles
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className={`mt-2 text-center font-mono text-[10px] ${sub}`}>
              Figures are indicative snapshots from public postings and reports, not a live feed.
            </p>
          </div>

          {/* the companies */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className={`text-lg font-extrabold ${text}`}>
                {activeCity ? CITIES.find((c) => c.id === activeCity)?.name : 'All locations'}
              </h2>
              {activeCity && (
                <button onClick={() => setActiveCity(null)} className={`text-xs font-bold underline underline-offset-4 ${sub}`}>
                  show all
                </button>
              )}
            </div>
            <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
              {activeCompanies.map((co) => {
                const matched = co.skills.some((s) => startedTracks.has(s));
                return (
                  <div key={co.name} className={`rounded-2xl border p-4 ${card}`}
                       style={matched ? { borderColor: `${ACCENT}66` } : undefined}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-[15px] font-extrabold ${text}`}>{co.name}</h3>
                      {matched && (
                        <span className="rounded-full px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-black"
                              style={{ background: ACCENT }}>
                          matches your progress
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 text-[13px] ${sub}`}>{co.focus}</p>
                    <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] ${sub}`}>
                      <span className="inline-flex items-center gap-1"><Briefcase size={11} /> ~{co.roles} open ECE roles</span>
                      <span className="inline-flex items-center gap-1"><IndianRupee size={11} /> {co.pkg}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {co.skills.map((s) => {
                        const t = TRACKS[s];
                        const have = startedTracks.has(s);
                        return (
                          <Link key={s} to={t.route}
                                className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide transition-all hover:opacity-80"
                                style={{
                                  borderColor: `${t.color}66`,
                                  background: have ? `${t.color}26` : 'transparent',
                                  color: t.color,
                                }}>
                            {have ? '✓ ' : ''}{t.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* the growth story */}
        <div className={`mt-12 rounded-3xl border p-6 sm:p-8 ${card}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            <TrendingUp size={13} /> The ecosystem is compounding
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['₹76,000 Cr', 'India Semiconductor Mission outlay backing fabs and design'],
              ['1st fab', 'Tata\'s Dholera plant, India\'s first major commercial fab'],
              ['ATMP live', 'Micron\'s Sanand assembly and test plant is operational'],
              ['20%+', 'of the world\'s chip design engineers already work from India'],
            ].map(([n, label]) => (
              <div key={label}>
                <div className="text-2xl font-extrabold" style={{ color: ACCENT }}>{n}</div>
                <p className={`mt-1 text-[13px] leading-relaxed ${sub}`}>{label}</p>
              </div>
            ))}
          </div>
          <p className={`mt-5 flex items-center gap-2 text-sm ${sub}`}>
            <GraduationCap size={15} />
            Every company on this map hires people who can do what the modules teach. Pick a
            skill chip above and start the track it links to.
          </p>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-sky-400/40 bg-slate-950 px-5 py-4 text-center text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default SiliconMap;
