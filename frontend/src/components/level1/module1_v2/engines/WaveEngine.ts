/**
 * WaveEngine.ts
 * 
 * Optimized 60FPS Waveform Engine for Signal Lab.
 * Refined for "Aliveness" and "Awareness" response.
 */

export type WaveType = 'sine' | 'square' | 'triangle' | 'pulse';

export interface WaveParameters {
  amplitude: number;
  frequency: number;
  phase: number;
  type: WaveType;
  noise: number;
}

export class WaveEngine {
  private currentParams: WaveParameters;
  private targetParams: WaveParameters;
  private points: { x: number; y: number }[] = [];
  private isRunning: boolean = false;
  private time: number = 0;
  private isFrozen: boolean = false;

  // Aliveness & Awareness variables
  private alivenessOffset: number = 0;
  private awarenessBoost: number = 0; // 0 to 1
  private firstInteractionBoost: number = 1.0;
  private hasInteracted: boolean = false;

  constructor(initialParams: WaveParameters) {
    this.currentParams = { ...initialParams };
    this.targetParams = { ...initialParams };
  }

  public setTarget(params: Partial<WaveParameters>) {
    this.targetParams = { ...this.targetParams, ...params };
    
    // First interaction boost trigger
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      this.firstInteractionBoost = 1.2;
      setTimeout(() => { this.firstInteractionBoost = 1.0; }, 500);
    }
  }

  public setFrozen(frozen: boolean) {
    this.isFrozen = frozen;
  }

  public triggerAwareness() {
    this.awarenessBoost = 1.0;
    // Fade awareness boost over 1000ms
    const fade = () => {
      this.awarenessBoost *= 0.95;
      if (this.awarenessBoost > 0.01) requestAnimationFrame(fade);
      else this.awarenessBoost = 0;
    };
    fade();
  }

  public start(callback: (points: { x: number; y: number }[], params: WaveParameters) => void) {
    this.isRunning = true;
    const step = () => {
      if (!this.isRunning) return;

      if (!this.isFrozen) {
        this.time += 0.02 * this.currentParams.frequency;
        
        // 1. Smooth LERP toward targets
        this.currentParams.amplitude += (this.targetParams.amplitude - this.currentParams.amplitude) * 0.2;
        this.currentParams.frequency += (this.targetParams.frequency - this.currentParams.frequency) * 0.2;
        this.currentParams.phase += (this.targetParams.phase - this.currentParams.phase) * 0.2;
        this.currentParams.noise += (this.targetParams.noise - this.currentParams.noise) * 0.2;
        this.currentParams.type = this.targetParams.type;

        // 2. Add Aliveness (±1-2% smooth fluctuation)
        this.alivenessOffset = Math.sin(Date.now() * 0.001) * 0.015;
        
        // 3. Awareness Boost (3% boost when UI activates)
        const activeAmp = this.currentParams.amplitude * (1 + this.alivenessOffset) * (1 + (this.awarenessBoost * 0.03)) * this.firstInteractionBoost;

        this.generatePoints(activeAmp);
      }
      
      callback(this.points, this.currentParams);
      requestAnimationFrame(step);
    };
    step();
  }

  public stop() {
    this.isRunning = false;
  }

  private generatePoints(activeAmp: number) {
    this.points = [];
    const resolution = 150;
    const width = 1000;
    
    for (let i = 0; i <= resolution; i++) {
        const x = (i / resolution) * width;
        const normalizedX = i / resolution;
        
        let y = 0;
        const t = this.time + this.currentParams.phase;
        const f = normalizedX * 10 * this.currentParams.frequency;

        switch (this.currentParams.type) {
            case 'sine':
                y = Math.sin(f + t);
                break;
            case 'square':
                y = Math.sin(f + t) >= 0 ? 1 : -1;
                break;
            case 'triangle':
                y = (2 / Math.PI) * Math.asin(Math.sin(f + t));
                break;
            case 'pulse':
                y = Math.sin(f + t) > 0.9 ? 1 : 0;
                break;
        }

        // Apply noise
        if (this.currentParams.noise > 0) {
            y += (Math.random() - 0.5) * this.currentParams.noise;
        }

        this.points.push({ x, y: y * activeAmp });
    }
  }

  public getPoints() { return this.points; }
  public getParams() { return this.currentParams; }
}
