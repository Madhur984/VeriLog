export class AudioEngine {
  private ctx: AudioContext | null = null;
  private lastPlay = 0;
  private readonly GAP = 220;

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {}
  }

  private canPlay(): boolean {
    const now = performance.now();
    if (now - this.lastPlay < this.GAP) return false;
    this.lastPlay = now;
    return true;
  }

  private note(freq: number, vol: number, dur = 0.15, type: OscillatorType = 'sine') {
    this.init();
    if (!this.ctx || !this.canPlay()) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  begin() { this.note(420, 0.03, 0.4); }
  tick()  { this.note(660, 0.015, 0.08); }

  // New: Subtle hover sound for UI elements
  hover() { this.note(880, 0.008, 0.05, 'sine'); }

  // New: Continuous slide sound (throttled)
  slide(value: number) {
    this.init();
    if (!this.ctx || !this.canPlay()) return;
    const freq = 200 + (value * 400); // 200Hz to 600Hz
    this.note(freq, 0.005, 0.1, 'triangle');
  }

  // New: Scene transition whoosh
  transition() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.02, now + 0.1);
    g.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  snap() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    [440, 554, 659].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.035;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.025, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
    this.lastPlay = performance.now();
  }

  stabilize() { 
    // Multi-harmonic stabilization chord
    [528, 660, 792].forEach(f => this.note(f, 0.015, 1.2, 'sine'));
  }

  collapse() {
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(15, now + 1.5);
    g.gain.setValueAtTime(0.07, now);
    g.gain.linearRampToValueAtTime(0, now + 1.5);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
    this.lastPlay = performance.now();
  }
}
