"use client";

/**
 * RockFormation.tsx — Formações de rocha vulcânica
 *
 * Referência visual: aquascape da foto de referência —
 * rochas escuras formando composição triangular com vale central.
 *
 * COMPOSIÇÃO: 3 clusters
 *   - Esquerda: cluster maior, mais alto, define a "montanha" esquerda
 *   - Direita: cluster médio, ligeiramente recuado
 *   - Fundo centro: cluster pequeno, bem atrás para profundidade
 *
 * TÉCNICA:
 * Cada cluster = 5-7 caixas com scale/rotation aleatória mas seed fixo (useMemo).
 * BoxGeometry em vez de SphereGeometry = aparência mais angular e rochosa.
 * Material muito escuro, alta rugosidade = basalto vulcânico.
 *
 * CONCEITO THREE.JS: useMemo garante que os valores aleatórios
 * sejam gerados uma vez só (na montagem), não a cada re-render.
 */

import { useMemo } from "react";
import * as THREE from "three";

interface RockProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

// Gera os dados de um cluster de rochas com seed para consistência
function generateCluster(seed: number, count: number): RockProps[] {
  // Simple deterministic pseudo-random from seed
  const rng = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: count }, (_, i) => ({
    position: [
      (rng(i * 3)     - 0.5) * 2.2,  // x spread
      (rng(i * 3 + 1) - 0.5) * 0.8,  // y spread (menos vertical)
      (rng(i * 3 + 2) - 0.5) * 1.8,  // z spread
    ] as [number, number, number],
    rotation: [
      rng(i * 7)     * 1.2,
      rng(i * 7 + 1) * Math.PI * 2,
      rng(i * 7 + 2) * 0.8,
    ] as [number, number, number],
    scale: [
      0.5 + rng(i * 5)     * 1.4,  // largura
      0.7 + rng(i * 5 + 1) * 2.2,  // altura (rochas mais altas que largas)
      0.4 + rng(i * 5 + 2) * 1.0,  // profundidade
    ] as [number, number, number],
  }));
}

// Material de rocha vulcânica — muito escuro, rugoso
const ROCK_MATERIAL_PROPS = {
  color: "#0b0d0c",
  roughness: 0.95,
  metalness: 0.08,
  emissive: "#040504",
  emissiveIntensity: 1,
};

// Um bloco de rocha individual
function Rock({ position, rotation, scale }: RockProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {/* BoxGeometry = aparência angular, rochosa */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial {...ROCK_MATERIAL_PROPS} />
    </mesh>
  );
}

// Um cluster de rochas
function RockCluster({
  position,
  scale,
  seed,
  count = 6,
}: {
  position: [number, number, number];
  scale: number;
  seed: number;
  count?: number;
}) {
  const rocks = useMemo(() => generateCluster(seed, count), [seed, count]);

  return (
    <group position={position} scale={scale}>
      {rocks.map((rock, i) => (
        <Rock key={i} {...rock} />
      ))}
    </group>
  );
}

// Cena completa de rochas — 3 clusters
export function RockFormation() {
  return (
    <group>
      {/* CLUSTER ESQUERDO: o maior, forma a "montanha" esquerda */}
      <RockCluster
        position={[-5.5, -3.8, -5]}
        scale={1.6}
        seed={42}
        count={7}
      />

      {/* CLUSTER DIREITO: médio, ligeiramente recuado */}
      <RockCluster
        position={[4.8, -3.8, -6.5]}
        scale={1.3}
        seed={73}
        count={6}
      />

      {/* CLUSTER FUNDO: pequeno, bem atrás — cria profundidade */}
      <RockCluster
        position={[0.5, -4.0, -10]}
        scale={1.0}
        seed={15}
        count={5}
      />

      {/* PEDRAS MENORES: espalhadas no fundo para naturalizar */}
      <RockCluster
        position={[-2, -4.2, -2]}
        scale={0.5}
        seed={99}
        count={4}
      />
      <RockCluster
        position={[2.5, -4.2, 1]}
        scale={0.45}
        seed={33}
        count={3}
      />
    </group>
  );
}
