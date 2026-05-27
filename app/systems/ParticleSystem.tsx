"use client";

/**
 * ParticleSystem.tsx — Partículas flutuantes no aquário
 *
 * Simula: poeira aquática, bolhas minúsculas, microorganismos.
 * Efeito whimsical: o ambiente parece vivo e respirando.
 *
 * TÉCNICA THREE.JS:
 * `<points>` é o objeto Three.js para renderizar muitos pontos eficientemente.
 * Em vez de criar 200 meshes individuais (200 draw calls!),
 * um único `<points>` renderiza todos os pontos em 1 draw call.
 *
 * BufferGeometry + BufferAttribute:
 * - BufferGeometry armazena dados de geometria em arrays tipados (Float32Array)
 * - BufferAttribute é um atributo (posição, cor, etc.) desse array
 * - `needsUpdate = true` sinaliza ao Three.js que os dados mudaram
 *
 * PointsMaterial:
 * - `sizeAttenuation: true` = partículas menores quando mais distantes (perspectiva)
 * - `size` = tamanho em unidades do mundo quando `sizeAttenuation: false`,
 *            ou tamanho base em pixels quando `sizeAttenuation: true`
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 180;

export function ParticleSystem() {
  // Float32Array com 3 floats por partícula (x, y, z)
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;   // x: -10 a 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;   // y: -6 a 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;   // z: -8 a 8
    }
    return arr;
  }, []);

  // Velocidade individual de cada partícula (sobe a velocidades ligeiramente diferentes)
  const speeds = useMemo(
    () => Float32Array.from({ length: PARTICLE_COUNT }, () => 0.08 + Math.random() * 0.25),
    []
  );

  // Drift horizontal lento (partículas não sobem em linha reta)
  const drifts = useMemo(
    () => Float32Array.from({ length: PARTICLE_COUNT }, () => (Math.random() - 0.5) * 0.02),
    []
  );

  const geoRef = useRef<THREE.BufferGeometry>(null!);

  useFrame((_, delta) => {
    if (!geoRef.current) return;

    const pos = geoRef.current.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Sobe
      pos[i * 3 + 1] += speeds[i] * delta;
      // Drift leve para os lados
      pos[i * 3]     += drifts[i] * delta;

      // Quando chega ao topo, reseta no fundo
      if (pos[i * 3 + 1] > 6) {
        pos[i * 3 + 1] = -5.5;
        pos[i * 3]     = (Math.random() - 0.5) * 20;  // nova posição X
        pos[i * 3 + 2] = (Math.random() - 0.5) * 16;  // nova posição Z
      }
    }

    // Obrigatório: sinaliza ao Three.js que o buffer mudou
    geoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#c0dcff"
        transparent
        opacity={0.6}
        sizeAttenuation   /* menor quando distante = mais natural */
      />
    </points>
  );
}
