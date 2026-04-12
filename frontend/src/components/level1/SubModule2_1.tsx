/**
 * SubModule2_1.tsx — Module 2: "Analog → Digital: The Translation Layer"
 *
 * 19-screen scroll-snap cinematic module following the same architecture as SubModule1_1.
 * Each screen is a full-viewport section tracked by IntersectionObserver.
 * Shared signal state flows down through M2Signal context.
 *
 * 4-Act Structure:
 *   ACT I   — Perception      (S00–S03)
 *   ACT II  — Control         (S04–S08)
 *   ACT III — Sampling        (S09–S13)
 *   ACT IV  — Quantization    (S14–S18)
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { useModuleLogic } from '../../hooks/useModuleLogic';
import { useColorScheme } from '../../hooks/useColorScheme';
import { M2Signal, DEFAULT_SIGNAL, T } from './module2/types';
import {
  M2_S00_Entry, M2_S01_SmoothVsStepped, M2_S02_DirectManipulation, M2_S03_Naming,
  M2_S04_AmplitudeControl, M2_S05_FrequencyControl, M2_S06_DigitalLimit,
  M2_S07_ContinuousDiscrete, M2_S08_Checkpoint1, M2_S09_SamplingIntro,
  M2_S10_SamplingRate, M2_S11_AliasingDiscovery, M2_S12_NyquistInsight,
  M2_S13_Checkpoint2, M2_S14_Quantization, M2_S15_DigitalFormed,
  M2_S16_FullPipeline, M2_S17_FinalCheckpoint, M2_S18_Closing,
} from './module2/screens';

const SCREEN_ORDER = [
  'm2_entry', 'm2_smooth_vs_stepped', 'm2_direct_manipulation', 'm2_naming',
  'm2_amplitude_control', 'm2_frequency_control', 'm2_digital_limit',
  'm2_continuous_discrete', 'm2_checkpoint_1',
  'm2_sampling_intro', 'm2_sampling_rate', 'm2_aliasing_discovery',
  'm2_nyquist_insight', 'm2_checkpoint_2',
  'm2_quantization', 'm2_digital_formed', 'm2_full_pipeline',
  'm2_final_checkpoint', 'm2_closing',
] as const;

const ACT_LABELS: Record<string, string> = {
  m2_entry: 'ACT I — PERCEPTION',
  m2_smooth_vs_stepped: 'ACT I — PERCEPTION',
  m2_direct_manipulation: 'ACT I — PERCEPTION',
  m2_naming: 'ACT I — PERCEPTION',
  m2_amplitude_control: 'ACT II — CONTROL',
  m2_frequency_control: 'ACT II — CONTROL',
  m2_digital_limit: 'ACT II — CONTROL',
  m2_continuous_discrete: 'ACT II — CONTROL',
  m2_checkpoint_1: 'ACT II — CHECKPOINT',
  m2_sampling_intro: 'ACT III — SAMPLING',
  m2_sampling_rate: 'ACT III — SAMPLING',
  m2_aliasing_discovery: 'ACT III — SAMPLING',
  m2_nyquist_insight: 'ACT III — SAMPLING',
  m2_checkpoint_2: 'ACT III — CHECKPOINT',
  m2_quantization: 'ACT IV — QUANTIZATION',
  m2_digital_formed: 'ACT IV — QUANTIZATION',
  m2_full_pipeline: 'ACT IV — QUANTIZATION',
  m2_final_checkpoint: 'ACT IV — CHECKPOINT',
  m2_closing: 'ACT IV — COMPLETE',
};

const ACT_COLORS: Record<string, string> = {
  'ACT I': T.signal,
  'ACT II': T.interact,
  'ACT III': '#8B5CF6',
  'ACT IV': T.success,
};

export const SubModule2_1: React.FC = () => {
  const { triggerHaptic, playSound } = useGlobalSensory();
  const [scheme, toggleTheme] = useColorScheme();
  const isDark = scheme === 'dark';

  const { activeScreenIndex, setActiveScreenIndex, progress } = useModuleLogic({
    screens: [...SCREEN_ORDER],
    initialState: 'intro',
  });

  // Theme-aware tokens injected as CSS variables
  const themeVars = useMemo(() => {
    if (isDark) {
      return {
        '--t-bg': '#020617',
        '--t-card': '#0F172A',
        '--t-surface': '#1E293B',
        '--t-border': 'rgba(148, 163, 184, 0.1)',
        '--t-text': '#F8FAFC',
        '--t-muted': '#94A3B8',
        '--t-signal': '#38BDF8',
        '--t-interact': '#FB923C',
        '--t-success': '#10B981',
        '--t-error': '#EF4444',
      };
    }
    return {
      '--t-bg': '#FFFFFF',
      '--t-card': '#F8FAFC',
      '--t-surface': '#F1F5F9',
      '--t-border': '#E2E8F0',
      '--t-text': '#0F172A',
      '--t-muted': '#64748B',
      '--t-signal': '#0EA5E9',
      '--t-interact': '#F97316',
      '--t-success': '#059669',
      '--t-error': '#DC2626',
    };
  }, [isDark]);

  const [signal, setSignal] = useState<M2Signal>(DEFAULT_SIGNAL as M2Signal);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef(false);

  const updateSignal = useCallback((updates: Partial<M2Signal>) => {
    setSignal((prev: M2Signal) => ({ ...prev, ...updates }));
  }, []);

  // IntersectionObserver — same pattern as SubModule1_1
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (scrollLockRef.current) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = SCREEN_ORDER.indexOf(entry.target.id as typeof SCREEN_ORDER[number]);
          if (idx !== -1 && idx !== activeScreenIndex) {
            setActiveScreenIndex(idx);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    SCREEN_ORDER.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeScreenIndex, setActiveScreenIndex]);

  // Soft scroll to next screen
  const scrollToNext = useCallback((currentIdx: number) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < SCREEN_ORDER.length) {
      scrollLockRef.current = true;
      const el = document.getElementById(SCREEN_ORDER[nextIdx]);
      el?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        scrollLockRef.current = false;
        setActiveScreenIndex(nextIdx);
      }, 900);
      triggerHaptic('medium');
      playSound('transition');
    }
  }, [setActiveScreenIndex, triggerHaptic, playSound]);

  const screenProps = (idx: number) => ({
    onNext: () => scrollToNext(idx),
    triggerHaptic,
    playSound,
    signal,
    updateSignal,
  });

  const activeScreenId = SCREEN_ORDER[activeScreenIndex];
  const actLabel = ACT_LABELS[activeScreenId] || '';
  const actKey = actLabel.split(' — ')[0];
  const actColor = ACT_COLORS[actKey] || T.signal;

  const progressPercent = Math.round(progress * 100);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      fontFamily: T.mono,
      ...(themeVars as React.CSSProperties)
    }}>

      {/* ── Progress Bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, zIndex: 100, background: T.border,
      }}>
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: '100%', background: actColor, transformOrigin: 'left' }}
        />
      </div>

      {/* ── Fixed Header HUD ── */}
      <div style={{
        position: 'fixed', top: 2, left: 0, right: 0,
        zIndex: 99, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${T.border}`,
        transition: 'background-color 0.3s, border-color 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: T.mono, fontSize: 9, fontWeight: 700, color: T.text, letterSpacing: '0.2em' }}>M02</span>
          <span style={{ width: 1, height: 12, background: T.border }} />
          <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Analog → Digital
          </span>
        </div>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={actLabel}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: actColor }} />
              <span style={{ fontFamily: T.mono, fontSize: 8, color: actColor, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                {actLabel}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Screen dots */}
            <div style={{ display: 'flex', gap: 4 }}>
              {SCREEN_ORDER.map((id, idx) => (
                <motion.button
                  key={id}
                  onClick={() => {
                    const el = document.getElementById(id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setActiveScreenIndex(idx);
                  }}
                  aria-label={`Go to screen ${idx + 1}`}
                  style={{
                    width: idx === activeScreenIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    border: 'none',
                    background: idx === activeScreenIndex ? actColor : (idx < activeScreenIndex ? `${actColor}60` : T.border),
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width 0.3s, background 0.3s',
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: '0.1em' }}>
              {progressPercent}%
            </span>
          </div>

          <span style={{ width: 1, height: 12, background: T.border }} />
          
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              color: T.muted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* ── Scrollable Screen Stack ── */}
      <div
        ref={containerRef}
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          paddingTop: 46,
          boxSizing: 'border-box',
        }}
      >
        {/* S00 — Entry */}
        <section id="m2_entry" style={sectionStyle}>
          <M2_S00_Entry {...screenProps(0)} />
        </section>

        {/* S01 — Smooth vs Stepped */}
        <section id="m2_smooth_vs_stepped" style={sectionStyle}>
          <M2_S01_SmoothVsStepped {...screenProps(1)} />
        </section>

        {/* S02 — Direct Manipulation */}
        <section id="m2_direct_manipulation" style={sectionStyle}>
          <M2_S02_DirectManipulation {...screenProps(2)} />
        </section>

        {/* S03 — Naming */}
        <section id="m2_naming" style={sectionStyle}>
          <M2_S03_Naming {...screenProps(3)} />
        </section>

        {/* S04 — Amplitude Control */}
        <section id="m2_amplitude_control" style={sectionStyle}>
          <M2_S04_AmplitudeControl {...screenProps(4)} />
        </section>

        {/* S05 — Frequency Control */}
        <section id="m2_frequency_control" style={sectionStyle}>
          <M2_S05_FrequencyControl {...screenProps(5)} />
        </section>

        {/* S06 — Digital Limit */}
        <section id="m2_digital_limit" style={sectionStyle}>
          <M2_S06_DigitalLimit {...screenProps(6)} />
        </section>

        {/* S07 — Continuous to Discrete */}
        <section id="m2_continuous_discrete" style={sectionStyle}>
          <M2_S07_ContinuousDiscrete {...screenProps(7)} />
        </section>

        {/* S08 — Checkpoint 1 */}
        <section id="m2_checkpoint_1" style={sectionStyle}>
          <M2_S08_Checkpoint1 {...screenProps(8)} />
        </section>

        {/* S09 — Sampling Intro */}
        <section id="m2_sampling_intro" style={sectionStyle}>
          <M2_S09_SamplingIntro {...screenProps(9)} />
        </section>

        {/* S10 — Sampling Rate */}
        <section id="m2_sampling_rate" style={sectionStyle}>
          <M2_S10_SamplingRate {...screenProps(10)} />
        </section>

        {/* S11 — Aliasing Discovery */}
        <section id="m2_aliasing_discovery" style={sectionStyle}>
          <M2_S11_AliasingDiscovery {...screenProps(11)} />
        </section>

        {/* S12 — Nyquist Insight */}
        <section id="m2_nyquist_insight" style={sectionStyle}>
          <M2_S12_NyquistInsight {...screenProps(12)} />
        </section>

        {/* S13 — Checkpoint 2 */}
        <section id="m2_checkpoint_2" style={sectionStyle}>
          <M2_S13_Checkpoint2 {...screenProps(13)} />
        </section>

        {/* S14 — Quantization */}
        <section id="m2_quantization" style={sectionStyle}>
          <M2_S14_Quantization {...screenProps(14)} />
        </section>

        {/* S15 — Digital Formed */}
        <section id="m2_digital_formed" style={sectionStyle}>
          <M2_S15_DigitalFormed {...screenProps(15)} />
        </section>

        {/* S16 — Full Pipeline */}
        <section id="m2_full_pipeline" style={sectionStyle}>
          <M2_S16_FullPipeline {...screenProps(16)} />
        </section>

        {/* S17 — Final Checkpoint */}
        <section id="m2_final_checkpoint" style={sectionStyle}>
          <M2_S17_FinalCheckpoint {...screenProps(17)} />
        </section>

        {/* S18 — Closing */}
        <section id="m2_closing" style={sectionStyle}>
          <M2_S18_Closing {...screenProps(18)} />
        </section>
      </div>
    </div>
  );
};

// Shared section styles
const sectionStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 46px)',
  width: '100%',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px 40px',
  boxSizing: 'border-box',
  background: T.bg,
  borderBottom: `1px solid ${T.border}`,
  transition: 'background-color 0.3s, border-color 0.3s',
};
