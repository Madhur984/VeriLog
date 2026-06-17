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

// India's OFFICIAL national boundary - the full claimed map, including the whole
// of Jammu & Kashmir (POK / Gilgit-Baltistan in the northwest and Aksai Chin in
// the northeast, reaching ~37N). Built by unioning the official state polygons
// from the udit-001/india-maps-data dataset, then simplified. Every vertex is a
// real [lng, lat] point, projected through the SAME projection as the cities, so
// the shape is exact and each city lands in its true location.
const INDIA_BOUNDARY: [number, number][] = [
  [74.82, 12.85], [73.93, 15.43], [73.51, 15.94], [72.8, 18.91], [72.65, 19.84], [72.9, 20.58], [72.62, 21.1], [72.74, 21.47],
  [72.51, 21.94], [72.57, 22.18], [72.95, 22.29], [72.38, 22.31], [72.11, 21.2], [70.83, 20.69], [70.09, 21.11], [68.94, 22.31],
  [69.01, 22.44], [69.18, 22.21], [70.13, 22.55], [70.72, 23.19], [70.31, 23.22], [70.08, 22.92], [69.42, 22.81], [68.63, 23.17],
  [68.1, 23.68], [68.34, 23.97], [68.75, 23.97], [68.76, 24.3], [70.03, 24.17], [70.57, 24.42], [70.67, 24.22], [71.05, 24.36],
  [71.11, 24.68], [70.67, 25.4], [70.67, 25.68], [70.27, 25.71], [70.1, 25.94], [70.17, 26.55], [69.51, 26.74], [69.59, 27.18],
  [70.37, 28.01], [70.91, 27.71], [71.88, 27.91], [72.4, 28.78], [72.95, 29.03], [73.4, 29.95], [73.97, 30.19], [73.96, 30.49],
  [74.71, 31.07], [74.51, 31.13], [74.57, 31.84], [75.38, 32.18], [75.21, 32.42], [74.68, 32.49], [74.66, 32.79], [73.63, 33.09],
  [73.39, 34.37], [74.15, 35.1], [73.73, 35.22], [73.78, 35.52], [73.41, 35.56], [73.09, 35.88], [72.53, 35.92], [72.59, 36.26],
  [73.13, 36.69], [73.81, 36.72], [73.69, 36.91], [74.06, 36.81], [74.71, 37.08], [74.92, 36.91], [75.34, 37.05], [75.75, 36.59],
  [76.64, 36.18], [76.81, 35.84], [77.43, 35.52], [77.9, 35.47], [78.42, 35.78], [79.38, 36.0], [80.29, 35.61], [80.07, 34.71],
  [79.51, 34.47], [79.59, 34.28], [79.35, 34.04], [78.9, 33.98], [79.11, 33.62], [78.91, 33.57], [78.99, 33.33], [79.45, 33.26],
  [79.38, 33.08], [79.63, 32.74], [78.98, 32.34], [78.76, 32.65], [78.4, 32.53], [78.78, 31.99], [78.79, 31.3], [79.14, 31.43],
  [79.6, 30.93], [79.86, 30.97], [80.25, 30.74], [80.21, 30.58], [81.05, 30.21], [80.37, 29.74], [80.06, 28.84], [81.21, 28.36],
  [81.88, 27.86], [82.71, 27.7], [82.73, 27.49], [83.86, 27.34], [84.1, 27.52], [84.62, 27.34], [84.64, 27.05], [85.25, 26.75],
  [85.64, 26.85], [85.86, 26.57], [88.03, 26.39], [88.2, 27.94], [88.62, 28.1], [88.84, 27.99], [88.76, 27.57], [88.92, 27.32],
  [88.72, 27.14], [89.13, 26.81], [92.06, 26.85], [92.06, 27.4], [91.65, 27.48], [91.63, 27.8], [92.56, 27.82], [92.69, 28.13],
  [93.22, 28.34], [93.34, 28.64], [93.96, 28.71], [94.68, 29.33], [95.45, 29.03], [96.09, 29.46], [96.39, 29.25], [96.15, 29.05],
  [96.44, 29.03], [96.61, 28.79], [96.31, 28.38], [96.66, 28.46], [97.37, 28.22], [97.38, 27.91], [96.86, 27.63], [97.16, 27.14],
  [96.8, 27.35], [96.31, 27.29], [95.06, 26.45], [95.19, 26.07], [94.67, 25.45], [94.58, 25.21], [94.74, 25.04], [94.16, 23.85],
  [93.25, 24.02], [93.4, 23.93], [93.39, 23.22], [93.12, 23.01], [93.2, 22.28], [92.94, 22.02], [92.71, 22.15], [92.6, 22.01],
  [92.26, 23.73], [91.94, 23.69], [91.81, 23.06], [91.58, 22.97], [91.16, 23.59], [91.3, 24.0], [91.75, 24.25], [91.92, 24.11],
  [91.92, 24.34], [92.21, 24.51], [92.23, 24.9], [92.52, 24.88], [92.43, 25.03], [89.83, 25.3], [89.89, 25.95], [89.73, 26.17],
  [89.35, 26.01], [89.1, 26.39], [88.76, 26.33], [88.4, 26.64], [88.52, 26.36], [88.18, 26.15], [88.1, 25.83], [88.99, 25.27],
  [88.44, 25.2], [88.03, 24.69], [88.74, 24.25], [88.56, 23.71], [88.71, 23.23], [88.94, 23.21], [89.07, 21.95], [88.39, 21.9],
  [88.26, 21.56], [88.22, 22.1], [88.08, 22.26], [88.0, 22.24], [88.19, 22.1], [87.96, 21.83], [86.95, 21.36], [86.97, 20.79],
  [86.87, 20.78], [86.81, 20.74], [87.06, 20.71], [86.37, 19.98], [84.7, 19.12], [84.13, 18.31], [82.32, 17.06], [82.31, 16.56],
  [81.27, 16.28], [80.94, 15.72], [80.68, 15.89], [80.32, 15.72], [80.04, 15.01], [80.34, 13.28], [79.76, 11.62], [79.86, 10.28],
  [79.27, 10.23], [78.9, 9.47], [79.3, 9.25], [78.38, 9.09], [77.79, 8.16], [77.23, 8.18], [76.55, 8.9], [76.21, 10.19],
];

// The Line of Control in Jammu & Kashmir, drawn as a dashed internal line (from
// near Jammu in the south up toward Kargil). Simplified from public boundary data.
const LOC_LINE: [number, number][] = [
  [74.32, 32.82], [73.98, 32.98], [73.82, 33.01], [73.62, 33.23], [73.58, 33.65],
  [73.52, 34.01], [73.49, 34.15], [73.44, 34.48], [73.65, 34.68], [73.9, 34.84],
  [74.12, 35.1], [74.46, 35.12], [74.97, 34.81], [75.25, 34.72],
];

// Exact polyline through every real boundary vertex; Z closes the ring.
const INDIA_PATH =
  'M ' + INDIA_BOUNDARY.map(([lng, lat]) => project(lng, lat).join(' ')).join(' L ') + ' Z';
const LOC_PATH =
  'M ' + LOC_LINE.map(([lng, lat]) => project(lng, lat).join(' ')).join(' L ');

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
            <svg viewBox="0 0 432 460" className="h-auto w-full" role="img" aria-label="Official map of India with the Line of Control and its semiconductor cities">
              <path d={INDIA_PATH} fill={dark ? 'rgba(56,189,248,0.06)' : 'rgba(56,189,248,0.08)'}
                    stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeOpacity={0.7} />
              {/* Line of Control - dashed internal line in Jammu & Kashmir */}
              <path d={LOC_PATH} fill="none" stroke={ACCENT} strokeWidth="1.3" strokeDasharray="5 4"
                    strokeOpacity={0.6} strokeLinecap="round" />
              <text x={project(73.3, 33.8)[0]} y={project(73.3, 33.8)[1]} textAnchor="end"
                    fontSize="8.5" fontFamily="monospace" fill={dark ? '#94A3B8' : '#64748B'}>LoC</text>
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
              Official map of India; the dashed line marks the Line of Control. Figures are indicative
              snapshots from public postings and reports, not a live feed.
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
