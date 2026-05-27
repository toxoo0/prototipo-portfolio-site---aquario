"use client";

/**
 * Snail.tsx — Caramujo (Turban Snail)
 *
 * Morfologia: concha esférica/cónica no topo, corpo mole rastejando abaixo.
 * Referência: Turban snail roxo/branco xadrez da referência visual.
 *
 * Comportamento: MUITO lento, praticamente estático.
 * Fica quase colado no fundo. Muda de direção raramente.
 *
 * TÉCNICA:
 * - Concha: esfera levemente achatada no topo
 * - Corpo: esfera menor achatada embaixo (rastejo)
 * - Espiral da concha: representada como uma série de anéis (toro pequeno)
 *
 * Representa: seção ainda indefinida ("???")
 */

import { useEffect } from "react";
import { useSwimming } from "../../hooks/useSwimming";
import { creatureRegistry } from "../../store/creatureStore";
import type { CreatureDef } from "../../types/creatures";

type SnailProps = Pick<CreatureDef, 'id' | 'section' | 'color' | 'trackingColor' | 'initialPosition' | 'speed' | 'scale'>

export function Snail({ id, section, color, trackingColor, initialPosition, speed, scale }: SnailProps) {
  const swimRef = useSwimming({
    initialPosition,
    speed,
    bounds: { x: 7, y: 0.3, z: 4.5 },
    turnSpeed: 0.2,               // muito lento para virar
    changeInterval: 10 + Math.random() * 8, // muda direção raramente
    yBias: -3.8,                  // quase colado no fundo
    yBiasStrength: 0.5,           // pull muito forte para o fundo
  });

  useEffect(() => {
    creatureRegistry.set(id, {
      ref: swimRef as { current: any },
      section,
      type: 'snail',
      color,
      trackingColor,
    });
    return () => { creatureRegistry.delete(id); };
  }, [id, swimRef, section, color, trackingColor]);

  return (
    <group ref={swimRef} scale={scale}>

      {/* CONCHA: esfera ligeiramente achatada no topo */}
      {/* Sem rotação especial — snail não precisa de lookAt orientado */}
      <mesh position={[0, 0.05, 0]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.22, 14, 10]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.25}
          emissive={color}
          emissiveIntensity={0.38}
        />
      </mesh>

      {/* ESPIRAL DA CONCHA: anel pequeno no topo para sugerir espiral */}
      <mesh position={[0, 0.16, 0]} scale={[0.6, 0.3, 0.6]}>
        <torusGeometry args={[0.1, 0.035, 6, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* CORPO (pé do caramujo): hemisfera achatada embaixo */}
      <mesh position={[0, -0.1, 0]} scale={[1.1, 0.22, 1.1]}>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial
          color="#1a2a18"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

    </group>
  );
}
