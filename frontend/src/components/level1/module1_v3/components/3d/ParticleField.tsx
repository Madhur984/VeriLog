import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSignalStore } from '../../store/signalStore';
import { useSignalLabStore } from '../../store/signalLabStore';

export const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { amplitude: globalAmp, frequency: globalFreq, noise: globalNoise, waveType, scene } = useSignalStore();
  const labStore = useSignalLabStore();

  const count = 600;
  
  const [positions, types] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const typ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 12; // x
        pos[i * 3 + 1] = (Math.random() - 0.5) * 6; // y
        pos[i * 3 + 2] = (Math.random() - 0.5) * 3; // z
        typ[i] = Math.random();
    }
    return [pos, typ];
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_amplitude: { value: 0.3 },
        u_frequency: { value: 1.0 },
        u_noise: { value: 0.1 },
        u_waveType: { value: 0 },
        u_color: { value: new THREE.Color('#E6F9FF') }, // Near-white cyan
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_amplitude;
        uniform float u_frequency;
        uniform float u_noise;
        uniform float u_waveType;
        attribute float a_type;
        varying float vAlpha;

        void main() {
          vec3 pos = position;

          // INTERACTION-DRIVEN: Only move if amplitude/frequency/noise is active
          float t = u_time * 0.4;
          float phase = pos.x * u_frequency * 0.5 + t;
          
          float wave = 0.0;
          if (u_waveType < 0.5) wave = sin(phase);
          else if (u_waveType < 1.5) wave = sign(sin(phase));
          else wave = asin(sin(phase)) * 0.636;

          // Subtle interaction response (Proxy for interaction)
          pos.y += wave * (u_amplitude * 0.2); 
          pos.x += sin(t + pos.z) * (u_noise * 0.02);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = (1.2 + a_type) * (200.0 / -mvPosition.z);
          vAlpha = smoothstep(-3.0, 1.0, pos.z) * 0.25; // Subtle
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          gl_FragColor = vec4(u_color, 0.12 * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const currentAmp = useRef(0.3);
  const currentFreq = useRef(1.0);
  const currentNoise = useRef(0.1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    const targetAmp = scene === 11 ? labStore.amplitude : globalAmp;
    const targetFreq = scene === 11 ? labStore.frequency : globalFreq;
    const targetNoise = scene === 11 ? labStore.noise : globalNoise;

    currentAmp.current += (targetAmp - currentAmp.current) * 0.08;
    currentFreq.current += (targetFreq - currentFreq.current) * 0.06;
    currentNoise.current += (targetNoise - currentNoise.current) * 0.12;

    material.uniforms.u_time.value = t;
    material.uniforms.u_amplitude.value = currentAmp.current;
    material.uniforms.u_frequency.value = currentFreq.current;
    material.uniforms.u_noise.value = currentNoise.current;
    material.uniforms.u_waveType.value = waveType === 'sine' ? 0 : waveType === 'square' ? 1 : 2;

    if (scene === 12) {
        pointsRef.current.scale.multiplyScalar(0.98);
    } else {
        pointsRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-a_type"
          count={count}
          array={types}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
};
