import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSignalStore } from '../../store/signalStore';
import { useSignalLabStore } from '../../store/signalLabStore';

interface RibbonProps {
  position?: [number, number, number];
  opacity?: number;
}

export const SignalRibbon: React.FC<RibbonProps> = ({ 
  position = [0, 0, 0], 
  opacity = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { amplitude: globalAmp, frequency: globalFreq, phase, noise: globalNoise, waveType, scene } = useSignalStore();
  const labStore = useSignalLabStore();

  // CORE DESIGN: 0.08 height for precision look
  const geometry = useMemo(() => new THREE.PlaneGeometry(8, 0.4, 512, 1), []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_amplitude: { value: 0.3 },
        u_frequency: { value: 1.0 },
        u_phase: { value: 0 },
        u_noise: { value: 0 },
        u_waveType: { value: 0 },
        u_opacity: { value: opacity },
        u_coreColor: { value: new THREE.Color('#E6F9FF') }, // Near-white cyan
        u_accentColor: { value: new THREE.Color('#00E5FF') }, // Accent cyan
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_amplitude;
        uniform float u_frequency;
        uniform float u_phase;
        uniform float u_noise;
        uniform float u_waveType;
        varying vec2 vUv;
        varying float vWave;

        float getWave(float x, float t) {
          float phase = x * u_frequency * 2.5 + t * 2.0 + u_phase;
          float wave = 0.0;
          if (u_waveType < 0.5) wave = sin(phase);
          else if (u_waveType < 1.5) wave = sign(sin(phase));
          else wave = asin(sin(phase)) * 0.636;
          
          float n = sin(x * 60.0 + t * 5.0) * u_noise * 0.05; // Tight noise
          return (wave + n) * u_amplitude;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = getWave(pos.x, u_time);
          pos.y += wave;
          
          // Added subtle depth for 'controlled' feel, reduced as requested
          pos.z += abs(wave) * u_amplitude * 0.08; 
          
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_opacity;
        uniform vec3 u_coreColor;
        uniform vec3 u_accentColor;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          float dist = abs(vUv.y - 0.5);

          // Precision Core: Sharp and thin
          float core = smoothstep(0.015, 0.0, dist);
          
          // Tight, low-opacity glow
          float glow = smoothstep(0.06, 0.01, dist);

          vec3 color = mix(u_accentColor * 0.4, u_coreColor, core);
          float alpha = (core * 0.95 + glow * 0.15) * u_opacity;

          gl_FragColor = vec4(color, max(alpha, 0.6));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [opacity]);

  // Inertia values for controlled feel
  const currentAmp = useRef(0.3);
  const currentFreq = useRef(1.0);
  const currentNoise = useRef(0.1);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    const isLab = scene === 11;
    const targetAmp = isLab ? labStore.amplitude : globalAmp;
    const targetFreq = isLab ? labStore.frequency : globalFreq;
    const targetNoise = isLab ? labStore.noise : globalNoise;

    // Direct smoothing at 0.08 for stability
    currentAmp.current += (targetAmp - currentAmp.current) * 0.08;
    currentFreq.current += (targetFreq - currentFreq.current) * 0.08;
    currentNoise.current += (targetNoise - currentNoise.current) * 0.08;

    mat.uniforms.u_time.value = t;
    mat.uniforms.u_amplitude.value = currentAmp.current;
    mat.uniforms.u_frequency.value = currentFreq.current;
    mat.uniforms.u_phase.value = phase;
    mat.uniforms.u_noise.value = currentNoise.current;
    mat.uniforms.u_waveType.value = waveType === 'sine' ? 0 : waveType === 'square' ? 1 : 2;

    // S12 Collapse logic
    if (scene === 12) {
      meshRef.current.scale.x *= 0.985;
      meshRef.current.scale.y *= 0.975;
      if (meshRef.current.scale.x < 0.01) meshRef.current.visible = false;
    } else {
      meshRef.current.scale.set(1, 1, 1);
      meshRef.current.visible = true;
    }

    // Camera Parallax: Very subtle
    state.camera.position.x += (state.mouse.x * 0.1 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.mouse.y * 0.1 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} material={material} renderOrder={1} />
  );
};


