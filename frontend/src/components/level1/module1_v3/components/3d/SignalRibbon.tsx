import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSignalStore } from '../../store/signalStore';

interface RibbonProps {
  position?: [number, number, number];
  opacity?: number;
  isSecondary?: boolean;
}

export const SignalRibbon: React.FC<RibbonProps> = ({ 
  position = [0, 0, 0], 
  opacity = 1,
  isSecondary = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { amplitude, frequency, phase, secondaryPhase, noise, waveType, scene } = useSignalStore();

  const geometry = useMemo(() => new THREE.PlaneGeometry(6, 0.2, 512, 1), []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_amplitude: { value: 0.3 },
        u_frequency: { value: 1.0 },
        u_phase: { value: 0 },
        u_noise: { value: 0 },
        u_waveType: { value: 0 }, // 0: sine, 1: square, 2: triangle
        u_opacity: { value: opacity },
        u_color: { value: new THREE.Color('#00E5FF') },
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_amplitude;
        uniform float u_frequency;
        uniform float u_phase;
        uniform float u_noise;
        uniform float u_waveType;

        varying vec2 vUv;
        varying float vDepth;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float t = pos.x * u_frequency * 2.5 + u_time * 2.0 + u_phase;

          float wave = 0.0;
          if (u_waveType < 0.5) {
            wave = sin(t);
          } else if (u_waveType < 1.5) {
            wave = sign(sin(t));
          } else {
            wave = asin(sin(t)) * (2.0 / 3.14159);
          }

          // Add Noise
          float n = sin(pos.x * 50.0 + u_time * 10.0) * u_noise * 0.1;
          wave += n;

          pos.y += wave * u_amplitude;
          
          // Energy = thickness in Space
          float thickness = abs(wave) * u_amplitude * 0.3;
          pos.z += thickness;
          vDepth = thickness;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_opacity;
        uniform vec3 u_color;
        varying vec2 vUv;
        varying float vDepth;

        void main() {
          // Fade edges
          float edgeAlpha = smoothstep(0.5, 0.1, abs(vUv.y - 0.5));
          
          // Glow effect based on energy (depth)
          float glow = 0.8 + vDepth * 2.0;
          
          gl_FragColor = vec4(u_color * glow, u_opacity * edgeAlpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [opacity]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.u_time.value = t;
    mat.uniforms.u_amplitude.value = amplitude;
    mat.uniforms.u_frequency.value = frequency;
    mat.uniforms.u_phase.value = isSecondary ? secondaryPhase : phase;
    mat.uniforms.u_noise.value = noise;
    
    let typeVal = 0;
    if (waveType === 'square') typeVal = 1;
    if (waveType === 'triangle') typeVal = 2;
    mat.uniforms.u_waveType.value = typeVal;

    // S12 Collapse logic
    if (scene === 12) {
      meshRef.current.scale.x *= 0.985;
      meshRef.current.scale.y *= 0.975;
      if (meshRef.current.scale.x < 0.01) meshRef.current.visible = false;
    } else {
      meshRef.current.scale.set(1, 1, 1);
      meshRef.current.visible = true;
    }

    // Camera Parallax
    state.camera.position.x += (state.mouse.x * 0.4 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.mouse.y * 0.3 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} material={material} />
  );
};
