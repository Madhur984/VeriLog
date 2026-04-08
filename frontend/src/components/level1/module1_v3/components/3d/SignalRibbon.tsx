import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSignalStore, SignalMode } from '../../store/signalStore';


interface RibbonProps {
  position?: [number, number, number];
  opacity?: number;
}

const MODE_MAP: Record<SignalMode, number> = {
  analog: 0,
  digital: 1,
  periodic: 2,
  aperiodic: 3,
  deterministic: 4,
  random: 5,
  step: 6,
  impulse: 7,
  ramp: 8,
  sinc: 9,
  triangular: 10,
  rectangular: 11
};

export const SignalRibbon: React.FC<RibbonProps> = ({ 
  position = [0, 0, 0], 
  opacity = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { amplitude: globalAmp, frequency: globalFreq, phase, noise: globalNoise, signalMode, scene } = useSignalStore();


  const geometry = useMemo(() => new THREE.PlaneGeometry(8, 0.4, 512, 1), []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_amplitude: { value: 0.3 },
        u_frequency: { value: 1.0 },
        u_phase: { value: 0 },
        u_noise: { value: 0 },
        u_signalMode: { value: 0 },
        u_opacity: { value: opacity },
        u_coreColor: { value: new THREE.Color('#E6F9FF') },
        u_accentColor: { value: new THREE.Color('#00E5FF') },
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_amplitude;
        uniform float u_frequency;
        uniform float u_phase;
        uniform float u_noise;
        uniform float u_signalMode;
        varying vec2 vUv;
        varying float vWave;

        #define PI 3.14159265359

        float getWave(float x, float t) {
          float p = x * u_frequency * 2.5 + t * 2.0 + u_phase;
          float wave = 0.0;
          
          if (u_signalMode < 0.5) { // Analog
            wave = sin(p);
          } else if (u_signalMode < 1.5) { // Digital
            wave = sign(sin(p));
          } else if (u_signalMode < 2.5) { // Periodic
            wave = sin(p); 
          } else if (u_signalMode < 3.5) { // Aperiodic
            wave = sin(p) * sin(p * 0.13) + cos(p * 0.21);
          } else if (u_signalMode < 4.5) { // Deterministic
            wave = sin(p);
          } else if (u_signalMode < 5.5) { // Random
            wave = fract(sin(p * 12.9898 + t) * 43758.5453);
          } else if (u_signalMode < 6.5) { // Step
            wave = x > 0.0 ? 1.0 : -1.0;
          } else if (u_signalMode < 7.5) { // Impulse
            wave = exp(-pow((x - sin(t)*2.0) * 20.0, 2.0)) * 2.0; 
          } else if (u_signalMode < 8.5) { // Ramp
            wave = mod(p, PI * 2.0) / PI - 1.0;
          } else if (u_signalMode < 9.5) { // Sinc
            float sx = (x * 10.0 + t);
            wave = sx == 0.0 ? 1.0 : sin(sx)/sx;
          } else if (u_signalMode < 10.5) { // Triangular
            wave = asin(sin(p)) * (2.0/PI);
          } else if (u_signalMode < 11.5) { // Rectangular
            wave = sign(sin(p));
          }

          float n = sin(x * 60.0 + t * 5.0) * u_noise * 0.05;
          return (wave + n) * u_amplitude;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = getWave(pos.x, u_time);
          pos.y += wave;
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
          float core = smoothstep(0.015, 0.0, dist);
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

  const currentAmp = useRef(0.3);
  const currentFreq = useRef(1.0);
  const currentNoise = useRef(0.1);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    const targetAmp = globalAmp;
    const targetFreq = globalFreq;
    const targetNoise = globalNoise;


    currentAmp.current += (targetAmp - currentAmp.current) * 0.08;
    currentFreq.current += (targetFreq - currentFreq.current) * 0.08;
    currentNoise.current += (targetNoise - currentNoise.current) * 0.08;

    mat.uniforms.u_time.value = t;
    mat.uniforms.u_amplitude.value = currentAmp.current;
    mat.uniforms.u_frequency.value = currentFreq.current;
    mat.uniforms.u_phase.value = phase;
    mat.uniforms.u_noise.value = currentNoise.current;
    mat.uniforms.u_signalMode.value = MODE_MAP[signalMode];

    // S12 Collapse logic
    if (scene === 12) {
      meshRef.current.scale.x *= 0.985;
      meshRef.current.scale.y *= 0.975;
      if (meshRef.current.scale.x < 0.01) meshRef.current.visible = false;
    } else {
      meshRef.current.scale.set(1, 1, 1);
      meshRef.current.visible = true;
    }

    state.camera.position.x += (state.mouse.x * 0.1 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.mouse.y * 0.1 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} material={material} renderOrder={1} />
  );
};
