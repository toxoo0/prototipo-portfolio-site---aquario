"use client";

/**
 * PlantCluster.tsx — Tufos de plantas aquáticas
 *
 * Referência: aquascape da referência — plantas verdes densas
 * nas bases das rochas, ondulando suavemente.
 *
 * TÉCNICA:
 * Cada tufo = 8-12 lâminas finas (PlaneGeometry) em leque.
 * Cada lâmina ondula com sine wave + phase offset individual.
 * DoubleSide material = visível dos dois lados.
 *
 * CONCEITO THREE.JS:
 * PlaneGeometry é um polígono plano. `side: THREE.DoubleSide` (= 2)
 * faz ele ser renderizado dos dois lados — importante pois
 * uma lâmina de planta vista de lado ficaria invisível com FrontSide.
 *
 * Usando useMemo para os dados de cada lâmina (fase, tamanho, posição)
 * para garantir consistência entre renders.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface BladeData {
  x: number;
  z: number;
  height: number;
  phase: number;
  yRot: number;     // rotação no Y (spread radial)
  opacity: number;
}

interface PlantBladeProps {
  data: BladeData;
  color: string;
}

// Uma lâmina individual de planta — ondula no useFrame
function PlantBlade({ data, color }: PlantBladeProps) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Ondulação: sine wave com phase individual → cada lâmina ondula diferente
    ref.current.rotation.z =
      Math.sin(clock.elapsedTime * 0.75 + data.phase) * 0.07;
  });

  return (
    <mesh
      ref={ref}
      position={[data.x, data.height / 2, data.z]}
      rotation={[0, data.yRot, 0]}
    >
      {/* args: [largura, altura, segmentos x, segmentos y] */}
      {/* 1 segmento em X, 3 em Y = pode dobrar verticalmente no futuro */}
      <planeGeometry args={[0.04, data.height, 1, 3]} />
      <meshStandardMaterial
        color={color}
        side={2}           /* THREE.DoubleSide = 2 */
        transparent
        opacity={data.opacity}
        roughness={0.85}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

// Gera os dados de um tufo com seed
function generateBlades(seed: number, count: number, maxHeight: number): BladeData[] {
  const rng = (n: number) => {
    const x = Math.sin(seed + n * 17.3) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: count }, (_, i) => ({
    x:       (rng(i * 4)     - 0.5) * 0.45,
    z:       (rng(i * 4 + 1) - 0.5) * 0.45,
    height:  maxHeight * (0.55 + rng(i * 4 + 2) * 0.45),
    phase:   rng(i * 4 + 3) * Math.PI * 2,
    yRot:    rng(i * 7)     * Math.PI * 2,
    opacity: 0.75 + rng(i * 3) * 0.2,
  }));
}

interface PlantClusterProps {
  position: [number, number, number];
  scale?: number;
  seed: number;
  bladeCount?: number;
  maxHeight?: number;
  color?: string;
}

// Um tufo de plantas no nível do chão
export function PlantCluster({
  position,
  scale = 1,
  seed,
  bladeCount = 10,
  maxHeight = 1.0,
  color = "#1c3d1e",
}: PlantClusterProps) {
  const blades = useMemo(
    () => generateBlades(seed, bladeCount, maxHeight),
    [seed, bladeCount, maxHeight]
  );

  return (
    <group position={position} scale={scale}>
      {blades.map((blade, i) => (
        <PlantBlade key={i} data={blade} color={color} />
      ))}
    </group>
  );
}

// Cena completa de plantas — posicionadas nas bases das rochas
export function PlantScene() {
  return (
    <group>
      {/* Plantas na base do cluster esquerdo */}
      <PlantCluster position={[-5.5, -4.0, -4]}   seed={10} bladeCount={12} maxHeight={1.2} scale={1.2} />
      <PlantCluster position={[-4.0, -4.0, -5.5]} seed={20} bladeCount={10} maxHeight={0.9} scale={1.0} />

      {/* Plantas na base do cluster direito */}
      <PlantCluster position={[4.5, -4.0, -5.5]}  seed={30} bladeCount={11} maxHeight={1.1} scale={1.1} />
      <PlantCluster position={[3.5, -4.0, -4.0]}  seed={40} bladeCount={9}  maxHeight={0.8} scale={0.9} />

      {/* Plantas no centro — tapete baixo */}
      <PlantCluster position={[0, -4.1, -3]}      seed={50} bladeCount={8}  maxHeight={0.6} scale={0.8} color="#152a14" />
      <PlantCluster position={[-2, -4.1, -1]}     seed={60} bladeCount={7}  maxHeight={0.55} scale={0.75} color="#152a14" />

      {/* Plantas nos cantos — fundo */}
      <PlantCluster position={[-7, -4.0, -8]}     seed={70} bladeCount={8}  maxHeight={0.8} scale={0.9} />
      <PlantCluster position={[6, -4.0, -8]}      seed={80} bladeCount={8}  maxHeight={0.8} scale={0.9} />
    </group>
  );
}
