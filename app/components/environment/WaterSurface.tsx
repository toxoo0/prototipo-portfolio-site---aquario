"use client";

/**
 * WaterSurface.tsx — Superfície da água
 *
 * Simula o teto do aquário — a superfície vista de baixo.
 * Efeito: leve ondulação visual de opacidade + brilho.
 *
 * TÉCNICA:
 * - PlaneGeometry grande rotacionada horizontalmente (no topo)
 * - Material semi-transparente com cor azul-branca fria
 * - Opacidade animada levemente com sine wave → simula ondulação
 *
 * Adicionalmente: um SpotLight nasce daqui pra simular
 * os raios de sol penetrando a água.
 *
 * CONCEITO:
 * A superfície não é um shader de água complexo (isso viria depois).
 * É uma aproximação barata visualmente eficaz para dar
 * a sensação de estar dentro do aquário, olhando para cima.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

export function WaterSurface() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    // Oscilação sutil de opacidade = ondas na superfície
    matRef.current.opacity = 0.07 + Math.sin(clock.elapsedTime * 0.4) * 0.025;
  });

  return (
    <group>
      {/* Superfície da água */}
      {/* rotation [-PI/2, 0, 0]: plano vertical → horizontal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5.5, 0]}>
        <planeGeometry args={[40, 40, 1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#c8e8ff"
          transparent
          opacity={0.07}
          side={2}           /* DoubleSide — visível de baixo também */
          roughness={0.05}
          metalness={0.4}
          emissive="#6090c0"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Caustic highlight: plano ainda mais transparente logo abaixo */}
      {/* Simula a refração da luz na superfície */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
        <planeGeometry args={[30, 30, 1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.025}
          side={2}
          roughness={0.1}
          metalness={0.6}
          emissive="#8ab8ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
