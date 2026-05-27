"use client";

/**
 * SmallFish.tsx — Peixe médio (tetras, barbs, peixinhos coloridos)
 *
 * Morfologia: corpo alongado, fusiforme, mais rápido e ágil que o Discus.
 * Referência: Tetras, Barbs pequenos.
 *
 * Versão melhorada do Fish.tsx original:
 * - Corpo mais orgânico (dois cones + junção)
 * - Oscilação de cauda mais pronunciada
 * - Nadadeira dorsal fina
 */

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSwimming } from "../../hooks/useSwimming";
import { creatureRegistry } from "../../store/creatureStore";
import type { CreatureDef } from "../../types/creatures";
import type * as THREE from "three";

type SmallFishProps = Pick<CreatureDef, 'id' | 'section' | 'color' | 'trackingColor' | 'initialPosition' | 'speed' | 'scale'>

export function SmallFish({ id, section, color, trackingColor, initialPosition, speed, scale }: SmallFishProps) {
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const swimRef = useSwimming({
    initialPosition,
    speed,
    bounds: { x: 8, y: 2.8, z: 5.5 },
    turnSpeed: 0.7 + Math.random() * 0.5,
    changeInterval: 2.5 + Math.random() * 2.5,
    yBias: -0.5,
    yBiasStrength: 0.08,
  });

  const tailRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (tailRef.current) {
      // Batimento mais rápido que o peixe grande
      tailRef.current.rotation.y =
        Math.sin(clock.elapsedTime * 3.5 + phase) * 0.22;
    }
  });

  useEffect(() => {
    creatureRegistry.set(id, {
      ref: swimRef as { current: any },
      section,
      type: 'small-fish',
      color,
      trackingColor,
    });
    return () => { creatureRegistry.delete(id); };
  }, [id, swimRef, section, color, trackingColor]);

  return (
    <group ref={swimRef} scale={scale}>
      <group rotation={[Math.PI / 2, 0, 0]}>

        {/* CORPO FRONTAL: cone com ponta para cima (= frente do peixe) */}
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.1, 0.38, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.35}
            metalness={0.1}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* CORPO TRASEIRO: cone invertido, mais grosso na junção */}
        <mesh position={[0, -0.12, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.1}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* NADADEIRA DORSAL */}
        <mesh position={[0, 0.06, 0.09]} scale={[0.025, 0.18, 0.22]}>
          <sphereGeometry args={[1, 6, 4]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.6}
            roughness={0.5}
          />
        </mesh>

        {/* CAUDA com animação */}
        <group ref={tailRef} position={[0, -0.42, 0]}>
          <mesh rotation={[0.2, 0, 0]} scale={[0.025, 0.28, 0.18]}>
            <sphereGeometry args={[1, 5, 4]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.75}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </mesh>
          <mesh rotation={[-0.2, 0, 0]} scale={[0.025, 0.28, 0.18]}>
            <sphereGeometry args={[1, 5, 4]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.75}
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
