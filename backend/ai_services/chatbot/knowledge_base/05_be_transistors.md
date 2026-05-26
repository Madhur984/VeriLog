# Transistors — BJT, JFET, MOSFET

Reference for B.Tech analog electronics. Notation per Sedra/Smith.

## 1. Bipolar Junction Transistor (BJT)

### 1.1 Structure
- Two PN junctions back-to-back. Three terminals: **Emitter (E)**, **Base (B)**, **Collector (C)**.
- NPN: emitter and collector are n-type, base is thin p-type. Conventional current flows IN to collector and base, OUT of emitter.
- PNP: opposite doping and current directions.

### 1.2 Modes of operation
| Mode | EB junction | CB junction | Use |
|------|-------------|-------------|-----|
| Cut-off | reverse | reverse | OFF (switch) |
| Active (forward) | forward | reverse | amplification |
| Saturation | forward | forward | ON (switch) |
| Reverse-active | reverse | forward | rarely used |

### 1.3 DC current relations (active region)
- $I_E = I_B + I_C$ (KCL).
- $\alpha = I_C / I_E$ (common-base current gain). Typically 0.95–0.999.
- $\beta = I_C / I_B$ (common-emitter current gain, $h_{FE}$). Typically 50–500.
- $\beta = \alpha/(1-\alpha)$, $\alpha = \beta/(\beta+1)$.

### 1.4 Active region equations
$$I_C = I_S \exp(V_{BE}/V_T)$$
- $I_S$: scale current (very small, ~$10^{-15}$ A).
- $V_{BE} \approx 0.7$ V Si in active.
- **Early effect**: $I_C$ has small slope vs $V_{CE}$. Output resistance $r_o = V_A / I_C$ where $V_A$ = Early voltage.

### 1.5 Configurations (common-X = X grounded for signal)

| Config | $A_v$ | $A_i$ | $R_{in}$ | $R_{out}$ | Phase | Use |
|--------|------|------|----------|-----------|-------|-----|
| Common-Emitter (CE) | high (-) | high | medium | high | 180° | voltage amp |
| Common-Base (CB) | high (+) | ≈1 | low | high | 0° | high-freq, impedance match |
| Common-Collector (CC, emitter follower) | ≈1 | high | high | low | 0° | buffer |

### 1.6 Biasing
Goal: place Q-point in middle of load line for max symmetric swing.

| Biasing | Stability | Notes |
|---------|-----------|-------|
| Fixed-bias | poor | $V_{CC}$ → $R_B$ → base. Sensitive to $\beta$. |
| Collector-feedback | better | $R_B$ from collector to base. |
| **Voltage-divider (self-bias)** | best | $R_1, R_2$ set $V_B$; $R_E$ adds local feedback. Industry standard. |

For voltage-divider:
- $V_B \approx V_{CC} \cdot R_2/(R_1+R_2)$ (if base current negligible).
- $V_E = V_B - V_{BE}$.
- $I_E = V_E/R_E$.
- $I_C \approx I_E$.
- $V_{CE} = V_{CC} - I_C(R_C + R_E)$.

### 1.7 Small-signal model (hybrid-π)
- $g_m = I_C / V_T$ (transconductance). At $I_C = 1$ mA: $g_m \approx 38.6$ mS.
- $r_\pi = \beta / g_m = V_T / I_B$.
- $r_o = V_A / I_C$.
- For CE amp with $R_E$ bypassed: $A_v = -g_m R_C$ (or $-R_C/r_e$ where $r_e = V_T/I_E \approx 26\,\Omega$ at 1 mA).
- With unbypassed $R_E$: $A_v \approx -R_C/R_E$ (gain-stabilized).

### 1.8 h-parameters (alternative small-signal)
$h_{ie}$ (input impedance), $h_{re}$ (reverse voltage), $h_{fe}$ (forward current = $\beta$), $h_{oe}$ (output admittance). Mostly used in older textbooks.

### 1.9 Frequency response
- **Low-frequency** cutoff set by coupling/bypass capacitors.
- **High-frequency** cutoff set by parasitic capacitances ($C_\pi$, $C_\mu$). Miller effect multiplies $C_\mu$ by $(1+|A_v|)$ at the input.
- **Unity-gain bandwidth** $f_T = g_m / (2\pi (C_\pi + C_\mu))$.

## 2. JFET (Junction FET)

### 2.1 Structure
- Channel (n or p) between source and drain.
- Gate junction is **reverse-biased** to control channel width.
- High input impedance (gate is reverse PN junction).

### 2.2 Regions
- **Cut-off**: $V_{GS} \le V_P$ (pinch-off).
- **Ohmic (triode)**: $V_{DS} < V_{GS} - V_P$. Resistor-like.
- **Saturation (active)**: $V_{DS} \ge V_{GS} - V_P$.

### 2.3 Drain current (saturation)
$$I_D = I_{DSS}\left(1 - \frac{V_{GS}}{V_P}\right)^2$$
- $I_{DSS}$: drain current with $V_{GS} = 0$.
- $V_P$: pinch-off (negative for n-channel).

### 2.4 Transconductance
$$g_m = -\frac{2I_{DSS}}{V_P}\left(1 - \frac{V_{GS}}{V_P}\right) = \frac{2}{|V_P|}\sqrt{I_{DSS} I_D}$$

## 3. MOSFET (Metal-Oxide-Semiconductor FET)

### 3.1 Types
- **Enhancement-mode** (E-MOSFET): no channel at $V_{GS}=0$; channel forms when $V_{GS} > V_{TH}$. Most common in digital and modern analog.
- **Depletion-mode**: channel exists at $V_{GS}=0$; can be enhanced or depleted.

### 3.2 NMOS regions (enhancement, $V_{GS} > V_{TH}$)

**Cut-off** ($V_{GS} < V_{TH}$): $I_D \approx 0$.

**Triode (linear)** ($V_{DS} < V_{GS} - V_{TH}$):
$$I_D = \mu_n C_{ox} \frac{W}{L}\left[(V_{GS}-V_{TH})V_{DS} - \frac{V_{DS}^2}{2}\right]$$

**Saturation (active)** ($V_{DS} \ge V_{GS} - V_{TH}$):
$$I_D = \frac{1}{2}\mu_n C_{ox} \frac{W}{L}(V_{GS}-V_{TH})^2 (1 + \lambda V_{DS})$$
- $\lambda$: channel-length modulation (small, ~0.01–0.05 V⁻¹).
- $k_n = \mu_n C_{ox} W/L$ is the transconductance parameter.

PMOS: same shape with sign flips. $V_{TH} < 0$, $V_{GS} < V_{TH}$ to turn on.

### 3.3 Transconductance
$$g_m = \mu_n C_{ox} \frac{W}{L}(V_{GS}-V_{TH}) = \sqrt{2 \mu_n C_{ox} \frac{W}{L} I_D}$$

### 3.4 CMOS inverter
- One PMOS + one NMOS in series between $V_{DD}$ and GND. Common gate (input), common drain (output).
- High input impedance, near-zero static power, rail-to-rail swing.
- Power: $P = C_L V_{DD}^2 f$ (dynamic) + $V_{DD} I_{leak}$ (static).
- Noise margins: $NM_H = V_{OH} - V_{IH}$, $NM_L = V_{IL} - V_{OL}$.

## 4. MOSFET vs BJT

| Property | BJT | MOSFET |
|----------|-----|--------|
| Controlled by | base current | gate voltage |
| Input impedance | moderate ($r_\pi$) | very high (oxide) |
| Transconductance | high ($I_C/V_T$) | lower (depends on $W/L$, $V_{ov}$) |
| Drift with temp | $V_{BE}$ ↓ 2 mV/°C, $\beta$ varies | threshold drift, mobility falls |
| Switching speed | fast | very fast, no minority storage |
| Saturation drop | $V_{CE(sat)} \approx 0.2$ V | $V_{DS(on)} = I_D R_{DS(on)}$ (can be < mV) |
| Dominant use | analog (some), discrete | digital, power, modern analog |

## 5. Amplifier classes (power)

| Class | Conduction angle | Efficiency (max) | Distortion | Use |
|-------|------------------|------------------|------------|-----|
| A     | 360°             | 25% (RC), 50% (transformer) | very low | small signal |
| B     | 180° (push-pull) | 78.5%           | crossover | audio output |
| AB    | slightly > 180°  | ~70%            | low       | audio output (typical) |
| C     | < 180°           | up to ~90%      | high (tuned) | RF amplifiers |
| D     | switching (PWM)  | > 90%           | low (post-filter) | modern audio, motor drives |

## 6. Differential pair

- Two identical BJTs (or MOSFETs) with common emitter/source through a tail current source.
- Differential gain $A_d = g_m R_C$ (BJT) or $g_m R_D$ (MOSFET).
- Common-mode gain $A_{cm} \approx -R_C / (2R_{tail})$ → very small if $R_{tail}$ large (current source).
- **CMRR** = $|A_d / A_{cm}|$. Want it as high as possible.
- Building block of op-amps, comparators.

## 7. Common pitfalls

1. **Beta dependence in fixed bias** — Q-point shifts wildly with temperature and unit-to-unit β variation. Always use voltage-divider with emitter degeneration in real designs.
2. **MOSFET triode vs saturation** — students forget to check $V_{DS}$ against $V_{ov} = V_{GS} - V_{TH}$. In saturation only.
3. **Miller effect** — at high frequency, $C_\mu$ (or $C_{gd}$) at the input is multiplied by $(1+|A_v|)$. Dominates the high-frequency roll-off in CE/CS stages.
4. **PMOS vs NMOS sign conventions** — flip the signs but keep the magnitudes. $V_{TH,p} < 0$, conducts when $V_{GS} < V_{TH,p}$ (more negative).
5. **BJT $V_{CE(sat)}$ is NOT zero** — about 0.2 V in saturation. Matters in switching loss calculations.
6. **Crossover distortion** in Class B — addressed by Class AB with small idling current through both transistors.
