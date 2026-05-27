"use client";

/**
 * Shrimp.tsx — Camarão (Crystal Red Shrimp)
 *
 * Morfologia: corpo segmentado curvado, antenas longas finas,
 * pernas pequenas. Movimento mais errático e próximo ao fundo.
 *
 * TÉCNICA:
 * - Corpo: série de 4 esferas diminuindo em tamanho (segmentos)
 * - Antenas: cilindros muito finos inclinados para frente
 * - Movimento: yBias negativo forte (fica perto do fundo)
 *   turnSpeed alto (vira rápido, comportamento errático de camarão)
 *
 * Representa: seção About / Contato
 */

import { useEffect, useMemo } from "react";
import { useSwimming } from "../../hooks/useSwimming";
import { creatureRegistry } from "../../store/creatureStore";
import type { CreatureDef } from "../../types/creatures";

type ShrimpProps = Pick<CreatureDef, 'id' | 'section' | 'color' | 'trackingColor' | 'initialPosition' | 'speed' | 'scale'>

export function Shrimp({ id, section, color, trackingColor, initialPosition, speed, scale }: ShrimpProps) {
  // Offset de fase para antenas não serem síncronas
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const swimRef = useSwimming({
    initialPosition,
    speed,
    bounds: { x: 7, y: 1.5, z: 5 },
    turnSpeed: 1.8 + Math.random() * 0.8,   // vira rápido = comportamento errático
    changeInterval: 1.5 + Math.random() * 1.5,
    yBias: -3.0,         // forte pull para o fundo
    yBiasStrength: 0.3,
  });

  useEffect(() => {
    creatureRegistry.set(id, {
      ref: swimRef as { current: any },
      section,
      type: 'shrimp',
      color,
      trackingColor,
    });
    return () => { creatureRegistry.delete(id); };
  }, [id, swimRef, section, color, trackingColor]);

  // Segmentos do corpo: posições Y relativas (de frente para trás)
  // Cada segmento é menor que o anterior
  const segments = [
    { y: 0.18,  r: 0.065 },  // cabeça (maior)
    { y: 0.07,  r: 0.06  },
    { y: -0.03, r: 0.055 },
    { y: -0.12, r: 0.045 },  // cauda (menor)
    { y: -0.19, r: 0.03  },
  ];

  return (
    <group ref={swimRef} scale={scale}>
      {/* Rotaciona para que a frente aponte para +Z */}
      <group rotation={[Math.PI / 2, 0, 0]}>

        {/* CORPO SEGMENTADO */}
        {segments.map((seg, i) => (
          <mesh
            key={i}
            position={[0, seg.y, 0]}
            // Curvatura leve do corpo (shrimp curvam o abdômen)
            rotation={[i * 0.08, 0, 0]}
          >
            <sphereGeometry args={[seg.r, 8, 6]} />
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.05}
              emissive={color}
              emissiveIntensity={0.55}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}

        {/* ANTENAS — 2 cilindros finos inclinados para frente */}
        {[-0.035, 0.035].map((x, i) => (
          <mesh
            key={`antenna-${i}`}
            position={[x, 0.22, 0]}
            rotation={[0, 0, (i === 0 ? -0.35 : 0.35)]}
          >
            <cylinderGeometry args={[0.003, 0.001, 0.28, 4]} />
            <meshStandardMaterial
              color="#ffddcc"
              roughness={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* ANTENAS SECUNDÁRIAS — mais curtas */}
        {[-0.025, 0.025].map((x, i) => (
          <mesh
            key={`antenna2-${i}`}
            position={[x, 0.2, 0]}
            rotation={[0.2, 0, (i === 0 ? -0.6 : 0.6)]}
          >
            <cylinderGeometry args={[0.002, 0.001, 0.15, 4]} />
            <meshStandardMaterial
              color="#ffddcc"
              roughness={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}

      </group>
    </group>
  );
}
