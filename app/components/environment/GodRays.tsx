"use client";

/**
 * GodRays.tsx — Raios de luz volumétrica
 *
 * Simula os "god rays" que aparecem quando luz do sol penetra a água —
 * colunas de luz diagonal visíveis no volume de água.
 *
 * TÉCNICA (fake volumetrics):
 * Planos grandes, semi-transparentes, com blending ADITIVO.
 * Blending aditivo: a cor resultante = cor do plano + cor do fundo.
 * Efeito: planos muito transparentes "adicionam" luz ao que está atrás.
 * Com opacidade 0.008-0.018, o resultado é extremamente sutil mas perceptível.
 *
 * Os planos são posicionados emanando do SpotLight [2, 14, 4]
 * em direção ao fundo do aquário, em ângulos ligeiramente diferentes.
 *
 * CONCEITO: depthWrite: false é obrigatório para materiais transparentes
 * com blending aditivo — evita que o plano "corte" objetos atrás dele.
 */

import { useMemo } from "react";
import * as THREE from "three";

interface RayProps {
  position: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
  width: number;
  height: number;
}

const RAY_MATERIAL_PROPS = {
  color: "#88bbee" as const,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: 2 as const, // THREE.DoubleSide
};

function Ray({ position, rotation, opacity, width, height }: RayProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial {...RAY_MATERIAL_PROPS} opacity={opacity} />
    </mesh>
  );
}

export function GodRays() {
  // Origem dos raios: SpotLight position [2, 14, 4]
  // Direção: para baixo e um pouco para o centro
  const rays: RayProps[] = useMemo(() => [
    // Raio central — mais largo, mais visível
    {
      position: [1.5, 6, -2],
      rotation: [0.25, 0.1, 0.02],
      opacity: 0.014,
      width: 4,
      height: 18,
    },
    // Raio lateral esquerdo
    {
      position: [-1.5, 5, -1],
      rotation: [0.3, -0.25, -0.08],
      opacity: 0.009,
      width: 3,
      height: 16,
    },
    // Raio lateral direito
    {
      position: [3.5, 5.5, -3],
      rotation: [0.2, 0.3, 0.1],
      opacity: 0.008,
      width: 2.5,
      height: 15,
    },
    // Raio fino central
    {
      position: [0.5, 7, -4],
      rotation: [0.18, 0.05, 0.0],
      opacity: 0.012,
      width: 1.5,
      height: 20,
    },
    // Raio traseiro largo
    {
      position: [2, 4, -6],
      rotation: [0.35, 0.15, 0.0],
      opacity: 0.007,
      width: 5,
      height: 14,
    },
  ], []);

  return (
    <group>
      {rays.map((ray, i) => (
        <Ray key={i} {...ray} />
      ))}
    </group>
  );
}
