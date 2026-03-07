/**
 * useVoltMonkeyMentorL2.ts — VoltMonkey Mentor for Level 2: Continuous vs Discrete
 *
 * Same architecture as useVoltMonkeyMentor.ts.
 * Scene contexts: 'analog' | 'digital' | 'comparison' | 'advanced' | 'quiz_l2'
 *
 * Response format: { obs, why, conclusion, tier }
 */

import { useCallback, useRef } from 'react';
import type { Tier, VoltMonkeyResponse } from './useVoltMonkeyMentor';

export type SceneCtxL2 = 'analog' | 'digital' | 'comparison' | 'advanced' | 'quiz_l2';

const MSG: Record<SceneCtxL2, Record<Tier, VoltMonkeyResponse[]>> = {
    analog: {
        sharp: [
            {
                obs: 'Potentiometer adjusted. LED brightness varied continuously.',
                why: 'The wiper divides total resistance — V_out = V_in × (R2 / (R1+R2)). Every position maps to a unique voltage in ℝ.',
                conclusion: 'Analog signals are defined on a continuous domain. No quantization. This is the native language of physics.',
                tier: 'sharp',
            },
            {
                obs: 'Analog ramp observed on oscilloscope.',
                why: 'As slider position changes, the voltage divider ratio shifts continuously. The oscilloscope captures this as a smooth curve — not steps.',
                conclusion: 'Any physical quantity — temperature, pressure, light — translates directly to an analog voltage. No encoding required.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Slider moved. LED brightness changed.',
                why: 'The potentiometer acts as a variable voltage divider. More resistance on one side = lower output voltage = dimmer LED.',
                conclusion: 'Analog signals can represent any value between min and max. Not just ON or OFF — everything in between.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Slider interaction detected.',
                why: 'Think of the potentiometer as two resistors whose values are linked. As one grows, the other shrinks. Output voltage = fraction of input voltage.',
                conclusion: 'Try this: set slider to 50%. What fraction of 5V do you see? Now 25%? 75%? The pattern is linear.',
                tier: 'struggling',
            },
        ],
    },
    digital: {
        sharp: [
            {
                obs: 'Switch toggled. Square wave output confirmed.',
                why: 'Digital systems collapse the infinitely fine analog domain into two abstractions: HIGH and LOW. All intermediate values are rejected by the input buffer.',
                conclusion: 'This deliberate information loss is the price of noise immunity. The gain: any signal regeneration device can perfectly reconstruct the original.',
                tier: 'sharp',
            },
            {
                obs: 'Noise applied. Output remained stable below threshold.',
                why: 'Noise margin = V_OH_min − V_IH_min. As long as noise amplitude < noise margin, the threshold comparator does not misinterpret the signal.',
                conclusion: 'This is why digital dominates long-distance transmission. Analog degrades with distance; digital is regenerated at each repeater node.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Switch toggled. LED behavior observed.',
                why: 'Unlike the potentiometer, the switch has no intermediate states. Output is either VCC or GND — nothing in between.',
                conclusion: 'Digital systems are designed around this binary constraint. The undefined zone (between LOW and HIGH) should never be occupied long-term.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Switch interaction detected.',
                why: 'The switch creates or breaks a path. When closed: current flows, LED on, voltage = HIGH. When open: no path, LED off, voltage = LOW.',
                conclusion: 'Notice there is no way to set LED to 50% brightness with just a switch. That is the fundamental difference from analog.',
                tier: 'struggling',
            },
        ],
    },
    comparison: [
        {
            obs: 'Noise slider increased. Analog signal degraded; digital remained stable.',
            why: 'Analog signals encode information in precise voltage levels. Any noise directly corrupts that information — there is no recovery mechanism.',
            conclusion: 'Digital systems tolerate noise up to the noise margin. Above that margin, regeneration circuitry (buffers) clean the signal.',
            tier: 'sharp',
        },
        {
            obs: 'Side-by-side comparison observed.',
            why: 'The core tradeoff: analog = infinite resolution, maximum noise sensitivity. Digital = 1-bit resolution per wire, near-perfect noise immunity.',
            conclusion: 'Modern ADCs convert analog → digital at sampling points for processing, then DACs restore analog at output. Best of both worlds.',
            tier: 'steady',
        },
        {
            obs: 'Comparison experiment completed.',
            why: 'When noise amplitude exceeds the analog signal resolution, information is permanently lost. In digital systems, thresholds prevent this loss until the margin is exceeded.',
            conclusion: 'This is why audio CDs (digital) do not degrade with copies while vinyl records (analog) accumulate noise with each play.',
            tier: 'struggling',
        },
    ].reduce((acc, msg) => {
        const t = msg.tier as Tier;
        acc[t] ??= [];
        acc[t].push(msg as VoltMonkeyResponse);
        return acc;
    }, {} as Record<Tier, VoltMonkeyResponse[]>),

    advanced: {
        sharp: [
            {
                obs: 'Signal regeneration demonstrated.',
                why: 'A digital buffer compares input to threshold, then drives output to the appropriate rail voltage. Information content is perfectly preserved; noise is discarded.',
                conclusion: 'This is why optical fiber networks span continents — regenerators every few km restore the bitstream exactly. Analog amplifiers would amplify noise along with signal.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Buffer restored clean square wave output.',
                why: 'The regenerator looks at the noisy input and makes a decision: above threshold = drive HIGH, below threshold = drive LOW. New clean signal out.',
                conclusion: 'Digital systems can be copied infinitely with zero degradation. This is why software exists — data is just numbers, perfectly reproducible.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Signal regenerator observed.',
                why: 'Notice: the noisy input had unpredictable voltage levels. The buffer converted that to a clean 0V or 5V. Why? Because it only cares about which side of the threshold the input is on.',
                conclusion: 'Regeneration is the superpower of digital. Every gate in a CPU regenerates its output — billions of times per second.',
                tier: 'struggling',
            },
        ],
    },
    quiz_l2: {
        sharp: [
            {
                obs: 'Correct classification.',
                why: 'The distinction is not about complexity — a temperature sensor with infinite resolution is analog; a key with two states is digital.',
                conclusion: 'Proceed.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Correct.',
                why: 'Consider the number of possible output states. Infinite (or very many) ≈ analog. Exactly two (or a small finite set) ≈ digital.',
                conclusion: 'Apply this framing to the next scenario.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Incorrect classification noted.',
                why: 'Ask: how many distinct values can this signal take? If the answer is effectively infinite → analog. If two (or a small set) → digital.',
                conclusion: 'Re-examine the scenario with this framework before selecting.',
                tier: 'struggling',
            },
        ],
    },
};

export function useVoltMonkeyMentorL2() {
    const answerHistory = useRef<boolean[]>([]);
    const usedIndices = useRef<Record<string, Set<number>>>({});

    const recordAnswer = useCallback((correct: boolean) => {
        answerHistory.current = [...answerHistory.current.slice(-2), correct];
    }, []);

    const getTier = useCallback((): Tier => {
        const hist = answerHistory.current;
        if (hist.length === 0) return 'steady';
        const correct = hist.filter(Boolean).length;
        if (correct === hist.length && hist.length >= 2) return 'sharp';
        if (correct >= hist.length * 0.6) return 'steady';
        return 'struggling';
    }, []);

    const getResponse = useCallback((ctx: SceneCtxL2): VoltMonkeyResponse => {
        const tier = getTier();
        const pool = MSG[ctx][tier] ?? MSG[ctx]['steady'];
        const key = `${ctx}-${tier}`;
        if (!usedIndices.current[key]) usedIndices.current[key] = new Set();
        const used = usedIndices.current[key];

        let available = pool.map((_, i) => i).filter(i => !used.has(i));
        if (available.length === 0) {
            used.clear();
            available = pool.map((_, i) => i);
        }

        const idx = available[Math.floor(Math.random() * available.length)];
        used.add(idx);
        return pool[idx];
    }, [getTier]);

    return { recordAnswer, getResponse, getTier };
}
