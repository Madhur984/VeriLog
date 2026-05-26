# Semiconductors and Diodes

Reference for B.Tech basic electronics. Numerical constants from standard textbooks (Boylestad, Sedra/Smith).

## 1. Semiconductor Basics

### 1.1 Energy bands
- **Insulator**: large band gap ($E_g > 3$ eV), e.g. diamond.
- **Conductor**: overlapping conduction and valence bands.
- **Semiconductor**: small gap. Si $E_g \approx 1.12$ eV, Ge $\approx 0.67$ eV, GaAs $\approx 1.42$ eV (all at 300 K).

### 1.2 Intrinsic vs extrinsic
- **Intrinsic**: pure semiconductor. Electron concentration $n_i$ = hole concentration $p_i$.
  - Si $n_i \approx 1.5 \times 10^{10}$ cm⁻³ at 300 K.
- **Extrinsic**: doped.
  - **n-type**: pentavalent donor (P, As, Sb). Majority = electrons. $n \approx N_D$.
  - **p-type**: trivalent acceptor (B, Al, Ga, In). Majority = holes. $p \approx N_A$.
- **Mass-action law**: $np = n_i^2$ (always, at equilibrium).

### 1.3 Charge carriers and currents
- **Drift current**: $J_{drift} = q(n\mu_n + p\mu_p)E$.
- **Diffusion current**: $J_{n,diff} = qD_n \frac{dn}{dx}$, $J_{p,diff} = -qD_p \frac{dp}{dx}$.
- **Einstein relation**: $\frac{D}{\mu} = V_T = \frac{kT}{q} \approx 25.85$ mV at 300 K.
- Mobility: $\mu_n > \mu_p$ in Si (about 1350 vs 480 cm²/V·s at low doping).

### 1.4 Fermi level
- Intrinsic: midway in the gap.
- n-type: closer to conduction band.
- p-type: closer to valence band.
- At equilibrium across a junction, Fermi level is flat.

## 2. PN Junction Diode

### 2.1 Formation
At the metallurgical junction, electrons from n diffuse to p, holes diffuse from p to n. Ionized impurities form a **depletion region** with a built-in field opposing further diffusion. Equilibrium reached at the **built-in potential**:
$$V_{bi} = V_T \ln\left(\frac{N_A N_D}{n_i^2}\right)$$

Typical $V_{bi} \approx 0.6$–$0.7$ V for Si, $\approx 0.2$–$0.3$ V for Ge.

### 2.2 I-V characteristic (Shockley equation)
$$I = I_s \left[\exp\left(\frac{V_D}{nV_T}\right) - 1\right]$$
- $I_s$: reverse saturation current (~nA–pA in Si, ~µA in Ge).
- $n$: ideality factor (1 ideal, 1–2 practical).
- $V_T$: thermal voltage.

### 2.3 Operating regions
- **Forward bias** ($V_D > 0$, typically > 0.6 V for Si): conducts. **Cut-in voltage** $V_\gamma \approx 0.7$ V Si, 0.3 V Ge.
- **Reverse bias** ($V_D < 0$): tiny reverse saturation current $I_s$ flows.
- **Breakdown**: large reverse current at $V_Z$ (Zener < 5 V) or avalanche (> 5 V).

### 2.4 Models
| Model | Use case |
|-------|----------|
| Ideal (switch) | Quick analysis: ON = short, OFF = open |
| Constant-voltage drop | $V_D = 0.7$ V when ON |
| Piecewise linear | $V_D = V_\gamma + r_D I_D$ |
| Shockley (exponential) | Precise small-signal/large-signal |

### 2.5 Dynamic / small-signal resistance
$$r_d = \frac{nV_T}{I_D}$$
At $I_D = 1$ mA, $V_T = 25.85$ mV, $n = 1$: $r_d \approx 26$ Ω.

### 2.6 Temperature dependence
- $V_\gamma$ drops by ~2 mV per °C rise.
- $I_s$ doubles roughly every 10 °C.
- $n_i^2 \propto T^3 \exp(-E_g/kT)$.

## 3. Rectifiers

### 3.1 Half-wave rectifier
- Single diode + load. Conducts only on positive half.
- **DC output** (no filter): $V_{dc} = V_m/\pi$, $I_{dc} = I_m/\pi$.
- **RMS**: $V_{rms} = V_m/2$.
- **Ripple factor** $\gamma = \sqrt{(V_{rms}/V_{dc})^2 - 1} = 1.21$.
- **Rectification efficiency** $\eta = 40.6\%$ max.
- **PIV** (peak inverse voltage) = $V_m$.

### 3.2 Full-wave (center-tap)
- 2 diodes + center-tapped transformer.
- $V_{dc} = 2V_m/\pi$, $V_{rms} = V_m/\sqrt{2}$.
- Ripple factor $\gamma = 0.48$.
- $\eta = 81.2\%$ max.
- PIV per diode = $2V_m$.

### 3.3 Full-wave (bridge)
- 4 diodes. No center tap needed (smaller transformer).
- Same $V_{dc}$ and ripple as center-tap.
- PIV per diode = $V_m$ (advantage over center-tap).
- Two diode drops in conduction path (≈ 1.4 V lost in Si).

### 3.4 Capacitor filter
- C in parallel with load smooths output.
- Ripple voltage (peak-to-peak): $V_r = \frac{I_{dc}}{fC}$ (half-wave) or $\frac{I_{dc}}{2fC}$ (full-wave).
- Larger C → smaller ripple, larger surge current at startup.

### 3.5 Other filter types
- LC (choke + cap): better regulation, used in higher-power supplies.
- π-filter (CLC or CRC): low ripple.

## 4. Diode Applications

### 4.1 Clipper (limiter)
- Series or shunt diode + reference voltage clips output above/below a level.
- Positive clipper: removes positive peak above $V_R + V_\gamma$.
- Negative clipper: mirror.
- Biased clippers shift the clipping threshold.

### 4.2 Clamper (DC restorer)
- Capacitor + diode shifts entire waveform up or down by adding a DC level.
- Positive clamper: pushes signal so the lowest point sits at ~$+V_\gamma$ above ground.
- Negative clamper: signal max pinned near ground.

### 4.3 Voltage multipliers
- **Half-wave doubler**: $V_{out} \approx 2V_m$.
- **Full-wave doubler**: same magnitude, less ripple.
- **Tripler, quadrupler**: extend chain. Used in CRT, ion generators.

## 5. Special Diodes

### 5.1 Zener diode
- Heavily doped, operated in reverse breakdown.
- **Zener breakdown** ($V_Z < 5$ V): tunneling. Negative TC.
- **Avalanche breakdown** ($V_Z > 5$ V): impact ionization. Positive TC.
- ~5–6 V Zeners have near-zero TC (sweet spot).
- **Voltage regulator** circuit:
  - $R_s$ from supply $V_s$ to Zener.
  - Load $R_L$ across Zener.
  - Conditions for regulation: $I_{Z,min} \le I_Z \le I_{Z,max}$.
  - Worst cases: max load (min $I_Z$), min load (max $I_Z$).

### 5.2 LED
- Forward-biased p-n in direct-bandgap material (GaAs, GaN, GaP).
- $V_F$ depends on color: red ~1.8 V, green ~2.2 V, blue/white ~3.0–3.4 V.
- Always use a current-limiting resistor.

### 5.3 Photodiode
- Reverse-biased; current proportional to incident light.
- Used in optocouplers, fiber receivers.

### 5.4 Schottky diode
- Metal–semiconductor junction. $V_\gamma \approx 0.2$–0.3 V.
- Very fast switching (no minority carrier storage). Used in switching supplies, RF.

### 5.5 Varactor (varicap)
- Reverse-biased junction; depletion capacitance varies with reverse voltage.
- Used in VCOs, tuning circuits.

### 5.6 Tunnel diode
- Heavy doping → narrow depletion region → tunneling at low forward V.
- Shows **negative differential resistance** in part of forward curve. Used in oscillators, fast switches.

### 5.7 PIN, Gunn, IMPATT
- PIN: intrinsic layer for high-voltage / RF switching.
- Gunn, IMPATT: microwave generation.

## 6. Switching characteristics

- **Reverse recovery time** $t_{rr}$: time for diode to stop conducting after forward → reverse transition. Critical at high frequencies.
- Schottky has near-zero $t_{rr}$ (no minority storage).

## 7. Common pitfalls

1. Confusing **PIV per diode** in bridge vs center-tap — bridge is BETTER (= $V_m$), center-tap is $2V_m$.
2. Forgetting two diode drops in a bridge rectifier — output peak is $V_m - 2V_\gamma$, not $V_m - V_\gamma$.
3. **Ripple factor** is dimensionless; lower is better. Half-wave 1.21 vs full-wave 0.48 → full-wave is much smoother.
4. **Zener regulation fails** if $R_s$ is too small (current exceeds $I_{Z,max}$) or load is too heavy (current drops below $I_{Z,min}$).
5. Diode is a **non-linear** element — superposition does NOT apply across it.
6. Reverse saturation current is exponentially temperature-dependent; reverse leakage is not constant.
