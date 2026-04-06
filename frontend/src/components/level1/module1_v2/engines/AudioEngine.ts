/**
 * AudioEngine.ts
 * 
 * Apple-level refined Audio Engine for Module 1.
 * Principles:
 * - Silence is default. Pure reactive sound.
 * - Reactive sine tones + harmonic overtones on arrival.
 * - No looping background loops.
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private lastPlayTime: number = 0;
  private breathingGap: number = 250; // ms

  constructor() {}

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private canPlay(): boolean {
    const now = performance.now();
    if (now - this.lastPlayTime < this.breathingGap) return false;
    this.lastPlayTime = now;
    return true;
  }

  private playTone(freq: number, volume: number = 0.1, type: OscillatorType = 'sine', duration: number = 0.3) {
    this.init();
    if (!this.ctx || !this.canPlay()) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Envelope Design (PRD Spec)
    const attack = 0.02; // 20ms
    const decay = duration * 0.3;   // 100ms
    const release = duration * 0.5; // 150ms

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(volume * 0.1, this.ctx.currentTime + attack + decay);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + attack + decay + release);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + attack + decay + release + 0.1);
  }

  public playTick() {
    this.playTone(800, 0.015, 'sine', 0.1); 
  }

  public playWaveChange(params: { frequency: number; amplitude: number }) {
    const baseFreq = 440;
    const targetFreq = baseFreq + params.frequency * 40;
    const vol = params.amplitude * 0.04;
    this.playTone(targetFreq, vol, 'sine', 0.15);
  }

  /**
   * Refined Arrival Sound: Sine Tone + Harmonic Overtone
   */
  public playArrival() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const tones = [440, 880]; // Sine + Harmonic Overtone
    const volumes = [0.08, 0.02]; // Subtle -35dB for overtone

    tones.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(volumes[i], now + 0.1);
        g.gain.exponentialRampToValueAtTime(0.00001, now + 0.8);
        osc.connect(g);
        g.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 1.2);
    });
  }

  public playSuccess() {
    this.init();
    if (!this.ctx) return;
    
    // Warm harmonic pulse
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        g.gain.setValueAtTime(0, now + i * 0.05);
        g.gain.linearRampToValueAtTime(0.04, now + i * 0.05 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.5);
        osc.connect(g);
        g.connect(this.ctx!.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + 0.6);
    });
  }

  public playError() {
    this.init();
    if (!this.ctx) return;
    
    // Soft glitch
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    g.gain.setValueAtTime(0.02, now);
    g.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.1);
  }

  public playCollapse() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(1, now + 1.2);
    g.gain.setValueAtTime(0.08, now);
    g.gain.linearRampToValueAtTime(0, now + 1.2);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 1.3);
  }
}
