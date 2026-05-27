"use client";

/**
 * LargeFish.tsx — Peixe grande (estilo Discus)
 *
 * Morfologia: corpo achatado e largo (disco),
 * nadadeira dorsal alongada, nadadeira anal, cauda em leque.
 *
 * Referência visual: Symphysodon (Discus) — peixe achatado lateralmente,
 * quase circular visto de frente.
 *
 * TÉCNICA GEOMÉTRICA:
 * - Corpo: SphereGeometry escalonada em [1.4, 0.18, 1.1] → disco oval
 * - Nadadeira dorsal: box fino escalonado e rotacionado no topo
 * - Cauda: ConeGeometry invertida, achatada
 * - Oscilação: sine wave na nadadeira caudal (efeito de batimento)
 *
 * Nada lentamente, muda direção de forma suave.
 * Habita o volume médio do aquário (y ≈ 0).
 */

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSwimming } from "../../hooks/useSwimming";
import { creatureRegistry } from "../../store/creatureStore";
import type { CreatureDef } from "../../types/creatures";

type LargeFishProps = Pick<CreatureDef, 'id' | 'section' | 'color' | 'trackingColor' | 'initialPosition' | 'speed' | 'scale'>

export function LargeFish({ id, section, color, trackingColor, initialPosition, speed, scale }: LargeFishProps) {
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const swimRef = useSwimming({
    initialPosition,
    speed,
    bounds: { x: 8, y: 2.5, z: 5.5 },
    turnSpeed: 0.3 + Math.random() * 0.2,
    changeInterval: 5 + Math.random() * 4,
    yBias: 0,          // nada no centro vertical
    yBiasStrength: 0.1,
  });

  // Ref para a nadadeira caudal — oscila separadamente
  const tailRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (tailRef.current) {
      // Batimento caudal: oscilação suave no eixo Y
      tailRef.current.rotation.y =
        Math.sin(clock.elapsedTime * 2.2 + phase) * 0.18;
    }
  });

  // Registra no store para o PositionBroadcaster rastrear
  useEffect(() => {
    creatureRegistry.set(id, {
      ref: swimRef as { current: any },
      section,
      type: 'large-fish',
      color,
      trackingColor,
    });
    return () => { creatureRegistry.delete(id); };
  }, [id, swimRef, section, color, trackingColor]);

  return (
    <group ref={swimRef} scale={scale}>
      {/* O grupo interno é rotacionado para alinhar a frente com +Z */}
      <group rotation={[Math.PI / 2, 0, 0]}>

        {/* CORPO: esfera achatada lateralmente = disco */}
        {/* scale Y muito pequeno = espessura do peixe Discus */}
        <mesh scale={[1.4, 0.18, 1.1]}>
          <sphereGeometry args={[0.55, 20, 14]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.2}
            emissive={color}
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* NADADEIRA DORSAL: plano fino no topo */}
        <mesh position={[0, 0, 0.52]} scale={[0.06, 0.42, 0.65]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.65}
            roughness={0.5}
            emissive={color}
            emissiveIntensity={0.08}
          />
        </mesh>

        {/* NADADEIRA ANAL: menor, abaixo */}
        <mesh position={[0, 0, -0.48]} scale={[0.05, 0.28, 0.45]}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.55}
            roughness={0.6}
          />
        </mesh>

        {/* CAUDA: grupo separado para animação */}
        <group ref={tailRef} position={[0, -0.7, 0]}>
          {/* Leque superior */}
          <mesh rotation={[0.3, 0, 0]} scale={[0.06, 0.38, 0.32]}>
            <sphereGeometry args={[1, 6, 4]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.7}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Leque inferior */}
          <mesh rotation={[-0.3, 0, 0]} scale={[0.06, 0.38, 0.32]}>
            <sphereGeometry args={[1, 6, 4]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.7}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>

      </group>
    </group>
  );
}

// Needed for useRef type
import type * as THREE from "three";
