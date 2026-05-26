# Operational Amplifiers and Oscillators

Reference for B.Tech analog electronics — op-amp applications, active filters, oscillators, signal generators.

## 1. The Ideal Op-Amp

### 1.1 Assumed properties
- Open-loop gain $A \to \infty$.
- Input impedance $Z_{in} \to \infty$ (no input current).
- Output impedance $Z_{out} \to 0$.
- Bandwidth $\to \infty$.
- Slew rate $\to \infty$.
- $V_{out} = 0$ when $V^+ = V^-$.

### 1.2 Two golden rules (with negative feedback)
1. **No current flows into either input** ($I^+ = I^- = 0$).
2. **The op-amp drives output so $V^+ = V^-$** (virtual short).

These collapse all linear op-amp analysis to circuit theory + KCL/KVL.

### 1.3 Real op-amp non-idealities (typical 741)
- Open-loop gain $A_v \sim 10^5$ at DC, falls to 1 at $f_T \approx 1$ MHz (gain-bandwidth product).
- $V_{OS}$ (input offset voltage) ~1–5 mV.
- $I_B$ (input bias current) ~80 nA (BJT input); pA (FET input).
- Slew rate ~0.5 V/µs (741); much higher in modern parts.
- CMRR ~80–100 dB.
- PSRR ~80 dB.

## 2. Standard Op-Amp Circuits

### 2.1 Inverting amplifier
$$V_{out} = -\frac{R_f}{R_{in}} V_{in}$$
- Input impedance = $R_{in}$ (low).
- The inverting input is a **virtual ground** (when $V^+ = 0$).

### 2.2 Non-inverting amplifier
$$V_{out} = \left(1 + \frac{R_f}{R_g}\right) V_{in}$$
- Input impedance very high (≈ op-amp $Z_{in}$).
- Min gain = 1 (voltage follower / buffer when $R_f = 0$ or $R_g = \infty$).

### 2.3 Voltage follower (buffer)
$$V_{out} = V_{in}$$
- Used for impedance matching — high $Z_{in}$, low $Z_{out}$.

### 2.4 Summing amplifier (inverting)
$$V_{out} = -R_f \left(\frac{V_1}{R_1} + \frac{V_2}{R_2} + \cdots \right)$$
- If all $R_i = R$: $V_{out} = -(R_f/R) \sum V_i$.
- Used in audio mixers, DACs.

### 2.5 Differential amplifier
With $R_1 = R_2$ at input legs and $R_f = R_g$ in feedback:
$$V_{out} = \frac{R_f}{R_1}(V_2 - V_1)$$
- Rejects common-mode signal. Used in instrumentation front-ends.

### 2.6 Instrumentation amplifier
- 3 op-amps: two buffers + one diff stage.
- Single resistor $R_G$ sets gain: $A_v = 1 + 2R_F/R_G$.
- High input impedance + high CMRR + easy gain control.

### 2.7 Integrator
$$V_{out} = -\frac{1}{RC}\int V_{in}\,dt$$
- DC stability problem: input bias and offset cause output drift. Add $R_f$ across $C$ for practical integrators (limits DC gain to $R_f/R_{in}$).

### 2.8 Differentiator
$$V_{out} = -RC \frac{dV_{in}}{dt}$$
- Noisy at high frequency. Add $R_s$ in series with $C$ for practical use.

### 2.9 Comparator
- No feedback (open-loop). Output = ± saturation depending on input polarity.
- Hysteresis added via positive feedback (Schmitt trigger).

### 2.10 Schmitt trigger (inverting)
- Two thresholds, $V_{TH}$ and $V_{TL}$, set by feedback divider.
- Hysteresis width $V_H = V_{TH} - V_{TL}$ rejects noise on slow signals.

### 2.11 Logarithmic / antilog amplifier
- Diode or transistor in the feedback path.
- $V_{out} \propto \ln(V_{in})$ (log) or $V_{out} \propto \exp(V_{in})$ (antilog).
- Building blocks for analog multipliers/dividers.

## 3. Active Filters

### 3.1 First-order low-pass (inverting)
- $C_f$ across $R_f$. Cutoff $f_c = 1/(2\pi R_f C_f)$.
- Passband gain $-R_f/R_{in}$, roll-off -20 dB/decade above $f_c$.

### 3.2 First-order high-pass
- Coupling cap $C$ in series with input, $R_f$ feedback.
- Cutoff $f_c = 1/(2\pi R_{in} C)$.

### 3.3 Second-order Sallen-Key low-pass
- 2 R's + 2 C's + non-inverting op-amp.
- Cutoff $f_c = 1/(2\pi\sqrt{R_1 R_2 C_1 C_2})$.
- Q controllable by component ratios.
- Common topologies: Butterworth (maximally flat), Chebyshev (sharper rolloff with passband ripple), Bessel (linear phase).

### 3.4 Band-pass / band-reject
- BPF: cascade HP + LP, or use Sallen-Key BP topology.
- BRF (notch): typically twin-T network with op-amp.

## 4. Oscillator Fundamentals

### 4.1 Barkhausen criteria for sinusoidal oscillation
1. **Magnitude**: $|A \beta| = 1$ (loop gain unity at oscillation frequency).
2. **Phase**: $\angle (A \beta) = 0°$ (or $360°$).

In practice startup needs $|A\beta| > 1$; gain is reduced to 1 by saturation or AGC for steady amplitude.

### 4.2 Classification
- **RC oscillators**: audio frequencies (< 1 MHz). Phase-shift, Wien-bridge.
- **LC oscillators**: RF (MHz–GHz). Hartley, Colpitts, Clapp.
- **Crystal oscillators**: ultra-stable. Quartz crystal as resonator.
- **Relaxation oscillators**: non-sinusoidal (square, triangle). 555 timer, op-amp Schmitt + RC.

## 5. RC Oscillators

### 5.1 Phase-shift oscillator (RC ladder)
- 3 RC stages provide 180° at:
$$f = \frac{1}{2\pi RC \sqrt{6}}$$
- Op-amp inverting gain must be at least 29 to compensate ladder attenuation.

### 5.2 Wien-bridge oscillator
- Series RC + parallel RC network in positive feedback of non-inverting op-amp.
- $f = 1/(2\pi RC)$.
- Non-inverting gain must be exactly 3 (use a thermistor or JFET for AGC to lock amplitude).

## 6. LC Oscillators

### 6.1 General LC tank
$$f = \frac{1}{2\pi\sqrt{LC}}$$

### 6.2 Hartley oscillator
- Tapped inductor (or two series inductors) + capacitor.
- $f = 1/(2\pi\sqrt{L_T C})$ where $L_T = L_1 + L_2 + 2M$.

### 6.3 Colpitts oscillator
- Single inductor + two series capacitors (tapped).
- $f = 1/(2\pi\sqrt{L C_{eq}})$ with $C_{eq} = C_1 C_2 / (C_1 + C_2)$.

### 6.4 Clapp oscillator
- Colpitts variant with extra series cap $C_3$ to improve stability against transistor capacitance.

### 6.5 Crystal oscillator
- Quartz crystal modeled as series RLC with parallel $C_0$ (electrode capacitance).
- Series resonance $f_s = 1/(2\pi\sqrt{LC_s})$.
- Parallel (anti) resonance $f_p$ slightly higher.
- $Q$ factors > $10^4$; frequency stability ppm-level.

## 7. 555 Timer (popular IC)

### 7.1 Astable (square wave)
$$f = \frac{1.44}{(R_A + 2R_B)C}$$
Duty cycle:
$$D = \frac{R_A + R_B}{R_A + 2R_B}$$
Always > 50% in basic astable (use diode bypass for 50%).

### 7.2 Monostable (one-shot)
$$T = 1.1\,R\,C$$

### 7.3 Bistable
Schmitt-trigger-like flip-flop using the threshold/trigger comparators.

## 8. DAC / ADC

### 8.1 R-2R ladder DAC
- Resistor network divides reference. $V_{out} = -V_{ref} \cdot D / 2^n$ for $n$-bit input $D$.
- Only two resistor values → easy to match.

### 8.2 Weighted-resistor DAC
- Powers-of-2 weighted resistors. Hard to match for high $n$.

### 8.3 ADC types
| Type | Speed | Resolution | Notes |
|------|-------|------------|-------|
| Flash | very fast | low (≤ 8 bit usually) | $2^n - 1$ comparators |
| SAR (successive approx) | medium | 8–18 bit | most common general-purpose |
| Sigma-Delta | slow | high (16–24 bit) | oversampling + noise shaping |
| Dual-slope (integrating) | very slow | high | DMM, line-cycle rejection |
| Pipelined | fast | medium-high | multi-stage SAR-like |

### 8.4 Sampling and quantization
- **Nyquist**: $f_s \ge 2 f_{max}$.
- Aliasing: frequencies above $f_s/2$ fold into the band. Use anti-alias LP filter.
- Quantization SNR for $n$-bit ADC, full-scale sine: $\text{SNR} \approx 6.02 n + 1.76$ dB.

## 9. Common pitfalls

1. **Virtual short only holds with negative feedback**. In a comparator (open-loop or positive feedback), $V^+ \ne V^-$ in general.
2. **Op-amp slew rate** limits output for large amplitude high-frequency signals. Distortion at $A V_{pk} \cdot 2\pi f > \text{SR}$.
3. **Barkhausen requires both magnitude and phase** — students often check only one.
4. **Wien-bridge gain = 3 exactly** — too low won't start, too high distorts. AGC is mandatory in practice.
5. **Crystal frequency drift** is tiny but real (ppm/°C). Quartz crystals are mechanical, not just electrical.
6. **555 duty cycle > 50%** in standard astable — needs a diode workaround for true 50%.
7. **Integrator drift** — small DC offset or bias current saturates the output over time. Always add a feedback resistor in practice.
8. **Anti-alias filter is mandatory** before any ADC — even a slow ADC sees aliased noise without one.
