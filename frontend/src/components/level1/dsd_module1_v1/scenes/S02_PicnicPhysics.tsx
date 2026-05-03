import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Bug, Wind, ThumbsUp, ThumbsDown, Brain } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Var {
  key: 'R' | 'A' | 'W';
  name: string;
  hint: string;
  zero: string;
  one: string;
  Icon: React.FC<any>;
  color: string;
}

const VARS: Var[] = [
  { key: 'R', name: 'Rain',  hint: 'sky condition',   zero: 'Clear sky',   one: 'Rainclouds',  Icon: Cloud, color: '#38bdf8' },
  { key: 'A', name: 'Ants',  hint: 'ground condition',zero: 'Bug-free',    one: 'Ant invasion',Icon: Bug,   color: '#a78bfa' },
  { key: 'W', name: 'Wind',  hint: 'air condition',   zero: 'Calm',        one: 'Gale force',  Icon: Wind,  color: '#34d399' },
];

const benRule = (R: number, A: number, W: number) => (R + A + W) <= 1 ? 1 : 0;

export const S02_PicnicPhysics: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [state, setState] = useState({ R: 0, A: 0, W: 0 });
  const E = benRule(state.R, state.A, state.W);
  const badCount = state.R + state.A + state.W;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
        <section className="space-y-3">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
            Chapter 02 · The Physics
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
            The Physics of a Perfect Picnic
          </h2>
          <p className={`text-base ${subText}`}>
            Three observations decide Ben&apos;s mood today. Each is binary: <strong>0</strong> when
            friendly, <strong>1</strong> when hostile. Tap any tile to flip its state and watch the
            rule of the day evaluate Ben&apos;s enjoyment in real time.
          </p>
        </section>
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10"
          style={{ background: '#fef9f0' }}
        >
          <img src="/images/sketchbook/p02.png" alt="Variables and the rule of the day" className="w-full block" />
        </motion.div>
      </div>

      {/* Variable cards (interactive toggles) */}
      <div className="grid md:grid-cols-3 gap-5">
        {VARS.map((v, i) => {
          const value = state[v.key];
          const Icon = v.Icon;
          return (
            <motion.button
              key={v.key}
              initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onClick={() => setState(s => ({ ...s, [v.key]: 1 - value }))}
              className={`p-7 rounded-3xl border text-left transition-all ${cardBg} group hover:scale-[1.02]`}
              style={{
                borderColor: value ? v.color : undefined,
                boxShadow: value ? `0 0 30px ${v.color}33` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                     style={{ background: `${v.color}22`, color: v.color, border: `1.5px solid ${v.color}55` }}>
                  <Icon size={26} />
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">var</div>
                  <div className="font-mono text-3xl font-black" style={{ color: v.color }}>{v.key}</div>
                </div>
              </div>
              <h3 className={`text-2xl font-black mb-1 ${textColor}`}>{v.name}</h3>
              <p className={`text-xs uppercase tracking-widest opacity-40 mb-5 ${subText}`}>{v.hint}</p>

              <div className="space-y-2">
                <div className={`flex items-center gap-3 p-2 rounded-xl ${value === 0 ? '' : 'opacity-40'}`}
                     style={{ background: value === 0 ? `${v.color}12` : undefined }}>
                  <span className="font-mono text-xs font-black w-5 text-center" style={{ color: v.color }}>0</span>
                  <span className={`text-sm ${textColor}`}>{v.zero}</span>
                </div>
                <div className={`flex items-center gap-3 p-2 rounded-xl ${value === 1 ? '' : 'opacity-40'}`}
                     style={{ background: value === 1 ? `${v.color}12` : undefined }}>
                  <span className="font-mono text-xs font-black w-5 text-center" style={{ color: v.color }}>1</span>
                  <span className={`text-sm ${textColor}`}>{v.one}</span>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-mono uppercase tracking-widest opacity-40">
                Tap to flip · current = {value}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Brain + verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ rotate: badCount > 1 ? [0, -3, 3, 0] : 0 }}
              transition={{ duration: 0.4, repeat: badCount > 1 ? Infinity : 0, repeatDelay: 1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center border-2"
              style={{
                background: E ? '#10b98122' : '#f43f5e22',
                borderColor: E ? '#10b981' : '#f43f5e',
              }}
            >
              <Brain size={42} style={{ color: E ? '#10b981' : '#f43f5e' }} />
            </motion.div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">Ben&apos;s brain</span>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">Rule of the Day</div>
            <p className={`text-lg leading-relaxed ${textColor}`}>
              Ben enjoys the picnic <strong className="text-emerald-400">(E&nbsp;=&nbsp;1)</strong> if he faces{' '}
              <strong>NO MORE THAN ONE</strong> bad condition. Two or more bad conditions{' '}
              <strong className="text-rose-400">ruin the day entirely (E&nbsp;=&nbsp;0)</strong>.
            </p>
            <div className={`mt-3 font-mono text-xs ${subText}`}>
              Bad conditions right now: <strong>{badCount}</strong> of 3 → outcome{' '}
              {badCount <= 1 ? 'survivable' : 'ruined'}.
            </div>
          </div>

          <motion.div
            key={E}
            initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border-2"
            style={{
              background: E ? '#10b98115' : '#f43f5e15',
              borderColor: E ? '#10b981' : '#f43f5e',
            }}
          >
            {E ? <ThumbsUp size={32} className="text-emerald-400" /> : <ThumbsDown size={32} className="text-rose-400" />}
            <div className="text-center">
              <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">E =</div>
              <div className="text-3xl font-black" style={{ color: E ? '#10b981' : '#f43f5e' }}>{E}</div>
              <div className={`text-xs font-bold ${textColor}`}>{E ? 'Happy' : 'Miserable'}</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
