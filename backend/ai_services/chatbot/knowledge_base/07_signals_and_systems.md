# Signals and Systems

Reference for B.Tech signals and systems coursework — continuous and discrete time, transforms, sampling.

## 1. Classification of signals

### 1.1 Continuous vs discrete time
- Continuous-time (CT): $x(t)$, $t \in \mathbb{R}$.
- Discrete-time (DT): $x[n]$, $n \in \mathbb{Z}$.

### 1.2 Other classifications
- **Periodic vs aperiodic**: $x(t) = x(t+T)$ for some $T$.
- **Even vs odd**: $x(-t) = x(t)$ vs $x(-t) = -x(t)$.
- **Energy vs power**:
  - $E = \int |x(t)|^2 dt$. Finite $E$ → energy signal.
  - $P = \lim_{T\to\infty} \frac{1}{2T}\int_{-T}^{T} |x(t)|^2 dt$. Finite nonzero $P$ → power signal.
- **Deterministic vs random**.

### 1.3 Standard signals
- Unit impulse $\delta(t)$: $\int \delta(t) dt = 1$, $x(t) \delta(t-t_0) = x(t_0) \delta(t-t_0)$.
- Unit step $u(t)$: 0 for $t<0$, 1 for $t>0$. $du/dt = \delta(t)$.
- Ramp $r(t) = t \cdot u(t)$.
- Exponential $e^{st}$ where $s = \sigma + j\omega$.
- Sinusoid $A \cos(\omega t + \phi)$, frequency $\omega = 2\pi f$.

## 2. System properties

- **Linear**: superposition holds. $T\{ax_1 + bx_2\} = aT\{x_1\} + bT\{x_2\}$.
- **Time-invariant**: delay in → same delay out.
- **Causal**: output at $t$ depends only on input at $t' \le t$.
- **Stable (BIBO)**: bounded input → bounded output. Equivalent: $\int |h(t)| dt < \infty$ for LTI.
- **Memoryless**: output depends only on present input.

## 3. LTI system response

### 3.1 Convolution
- CT: $y(t) = x(t) * h(t) = \int x(\tau) h(t-\tau) d\tau$.
- DT: $y[n] = x[n] * h[n] = \sum_k x[k] h[n-k]$.
- Commutative, associative, distributive over addition.
- $x(t) * \delta(t-t_0) = x(t-t_0)$.

### 3.2 Impulse response
- $h(t)$ for CT, $h[n]$ for DT — completely characterizes an LTI system.
- Step response = integral (CT) or cumulative sum (DT) of $h$.

## 4. Fourier Series (periodic signals)

### 4.1 Trigonometric form
$$x(t) = a_0 + \sum_{n=1}^\infty [a_n \cos(n\omega_0 t) + b_n \sin(n\omega_0 t)]$$
where $\omega_0 = 2\pi/T$.

### 4.2 Exponential form
$$x(t) = \sum_{n=-\infty}^{\infty} c_n e^{j n \omega_0 t}, \quad c_n = \frac{1}{T} \int_T x(t) e^{-j n \omega_0 t} dt$$

### 4.3 Dirichlet conditions for convergence
- $x(t)$ has finite number of maxima/minima in any period.
- Finite number of discontinuities, each finite.
- Absolutely integrable over a period.

### 4.4 Parseval's theorem
$$\frac{1}{T}\int_T |x(t)|^2 dt = \sum_{n} |c_n|^2$$

## 5. Fourier Transform (aperiodic signals)

### 5.1 Definitions
$$X(j\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt$$
$$x(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega$$

### 5.2 Key properties
| Property | Time domain | Frequency domain |
|----------|-------------|------------------|
| Linearity | $a x_1 + b x_2$ | $a X_1 + b X_2$ |
| Time shift | $x(t - t_0)$ | $X(j\omega) e^{-j\omega t_0}$ |
| Frequency shift | $x(t) e^{j\omega_0 t}$ | $X(j(\omega - \omega_0))$ |
| Scaling | $x(at)$ | $\frac{1}{|a|} X(j\omega/a)$ |
| Convolution | $x_1 * x_2$ | $X_1 X_2$ |
| Multiplication | $x_1 x_2$ | $\frac{1}{2\pi} X_1 * X_2$ |
| Differentiation | $dx/dt$ | $j\omega X(j\omega)$ |
| Integration | $\int x(\tau) d\tau$ | $X/(j\omega) + \pi X(0)\delta(\omega)$ |
| Conjugation | $x^*(t)$ | $X^*(-j\omega)$ |

### 5.3 Common pairs
- $\delta(t) \leftrightarrow 1$.
- $1 \leftrightarrow 2\pi \delta(\omega)$.
- $e^{-at} u(t),\, a>0 \leftrightarrow 1/(a + j\omega)$.
- $\text{rect}(t/T) \leftrightarrow T \text{sinc}(\omega T / 2\pi)$.
- $\cos(\omega_0 t) \leftrightarrow \pi[\delta(\omega-\omega_0) + \delta(\omega+\omega_0)]$.

## 6. Laplace Transform

### 6.1 Definition
$$X(s) = \int_{0^-}^{\infty} x(t) e^{-st} dt, \quad s = \sigma + j\omega$$
(one-sided / unilateral form; common in circuit analysis).

### 6.2 Region of convergence (ROC)
- The set of $s$ for which the integral converges.
- For causal signals, ROC is a right half-plane $\text{Re}(s) > \sigma_0$.

### 6.3 Properties
- Linearity, time shift ($e^{-s t_0}$), frequency shift ($X(s-a)$), differentiation ($sX(s) - x(0^-)$), integration ($X(s)/s$), convolution ($X_1 X_2$).
- **Initial value**: $x(0^+) = \lim_{s\to\infty} sX(s)$.
- **Final value**: $\lim_{t\to\infty} x(t) = \lim_{s\to 0} sX(s)$ (only if all poles in left half-plane except possibly simple at origin).

### 6.4 Standard pairs
- $u(t) \leftrightarrow 1/s$.
- $e^{-at} u(t) \leftrightarrow 1/(s+a)$.
- $t^n u(t) \leftrightarrow n!/s^{n+1}$.
- $\sin(\omega_0 t) u(t) \leftrightarrow \omega_0/(s^2 + \omega_0^2)$.
- $\cos(\omega_0 t) u(t) \leftrightarrow s/(s^2 + \omega_0^2)$.

### 6.5 Transfer function $H(s) = Y(s)/X(s)$
- Poles in left half-plane → stable.
- Zeros and poles characterize the system response.

## 7. Z-Transform (discrete-time)

### 7.1 Definition
$$X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n}$$
Unilateral: starts from $n=0$.

### 7.2 ROC characteristics
- For right-sided sequence: ROC is exterior of a circle ($|z| > r$).
- For left-sided: interior.
- Must include the unit circle for the DTFT to exist.
- For causal stable LTI: all poles inside the unit circle.

### 7.3 Standard pairs
- $\delta[n] \leftrightarrow 1$.
- $u[n] \leftrightarrow z/(z-1) = 1/(1-z^{-1})$.
- $a^n u[n] \leftrightarrow z/(z-a) = 1/(1-az^{-1})$.

### 7.4 Properties
- Linearity, time shift ($z^{-k}$), convolution ($X_1 X_2$).
- Initial value: $x[0] = \lim_{z\to\infty} X(z)$.
- Final value: $\lim_{n\to\infty} x[n] = \lim_{z\to 1} (z-1) X(z)$ (if applicable).

## 8. Sampling Theorem

### 8.1 Statement
A bandlimited signal with maximum frequency $f_m$ can be perfectly reconstructed from samples taken at rate $f_s \ge 2 f_m$ (Nyquist rate).

### 8.2 Aliasing
- Sampling below Nyquist rate folds high frequencies into the baseband.
- Avoid with anti-aliasing low-pass filter at $f_s/2$ before sampling.

### 8.3 Reconstruction
- Ideal: low-pass filter of bandwidth $f_s/2$ on the sampled signal.
- Practical: zero-order hold (rectangular) + analog smoothing filter.

## 9. Discrete Fourier Transform (DFT)

### 9.1 Definition
$$X[k] = \sum_{n=0}^{N-1} x[n] e^{-j 2\pi kn/N}, \quad k = 0, 1, \ldots, N-1$$

### 9.2 Properties
- Periodic with period $N$ in both $n$ and $k$.
- Circular convolution (NOT linear): $x_1 \circledast x_2 \leftrightarrow X_1[k] X_2[k]$.
- For linear convolution via DFT, zero-pad to $N \ge N_1 + N_2 - 1$.

### 9.3 FFT
- Fast algorithm computing DFT in $O(N \log N)$ vs naive $O(N^2)$.
- Requires $N$ = power of 2 for radix-2 (most common).

## 10. Basic Modulation (Communication)

### 10.1 Amplitude Modulation (AM)
- $s(t) = A_c[1 + m\cos(\omega_m t)]\cos(\omega_c t)$.
- $m$ = modulation index, $0 \le m \le 1$ to avoid over-modulation.
- Bandwidth $= 2 f_m$.
- Power: total $P = P_c(1 + m^2/2)$. Efficiency $\eta = m^2/(2+m^2)$, max 33% at $m=1$.

### 10.2 Frequency Modulation (FM)
- $s(t) = A_c \cos(\omega_c t + \beta \sin(\omega_m t))$.
- Modulation index $\beta = \Delta f / f_m$.
- **Carson's rule** bandwidth: $BW \approx 2(\Delta f + f_m) = 2 f_m (\beta + 1)$.

### 10.3 Pulse Code Modulation (PCM)
- Sample → quantize → encode to binary.
- Bit rate $R = n f_s$ for $n$-bit samples.
- SNR (sinusoidal full-scale): $\approx 6.02n + 1.76$ dB.

## 11. Common pitfalls

1. **DFT is periodic and finite** — confusing it with DTFT (which is continuous in $\omega$) is a classic error.
2. **ROC must include unit circle** for DTFT to exist from Z-transform.
3. **Final value theorem** applies only if the system is stable AND $sX(s)$ has no poles in the closed right half-plane (Laplace) or $(z-1)X(z)$ has no poles outside the unit circle (Z).
4. **Convolution is NOT multiplication in the time domain** — flip-shift-multiply-sum.
5. **Sampling aliasing**: alias frequency $f_a = |f - k f_s|$ for the integer $k$ that brings it into $[0, f_s/2]$.
6. **AM is power-inefficient** — most power is in the carrier, not the sidebands.
