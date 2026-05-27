"use client";

/**
 * Fish.tsx — Um peixe individual
 *
 * ANATOMIA DO PEIXE (formas geométricas simples):
 *
 *   <group>          ← controlado pelo useSwimming (posição + rotação)
 *     <group>        ← rotacionado -90° em X para alinhar com o eixo de movimento
 *       corpo        ← ConeGeometry: cone alongado, ponta para frente
 *       cauda        ← ConeGeometry: cone menor, invertido atrás do corpo
 *     </group>
 *   </group>
 *
 * POR QUE DOIS GROUPS?
 * - O `useSwimming` usa `lookAt` no group externo para apontar na direção do movimento.
 * - `lookAt` faz o eixo +Z apontar para o alvo.
 * - `ConeGeometry` aponta para +Y por padrão.
 * - O group interno rotaciona o cone -90° em X, fazendo a ponta apontar para +Z.
 * - Assim: lookAt no externo ✓, cone orientado certo no interno ✓
 */

import { useSwimming } from "../hooks/useSwimming";

interface FishProps {
  color?: string;
  initialPosition?: [number, number, number];
  speed?: number;
  scale?: number;
  section?: string; // seção do portfolio que este peixe representa
}

export function Fish({
  color = "#7eb8d4",
  initialPosition = [0, 0, 0],
  speed = 1.2,
  scale = 1,
  section,
}: FishProps) {
  // O hook retorna a ref que anima o grupo externamente
  const swimRef = useSwimming({
    initialPosition,
    speed,
    bounds: { x: 8, y: 3, z: 6 },
    turnSpeed: 0.6 + Math.random() * 0.4, // cada peixe tem agilidade ligeiramente diferente
    changeInterval: 3 + Math.random() * 3,
  });

  return (
    // Group externo: posição e rotação controlados pelo useSwimming
    <group ref={swimRef}>
      {/* Group interno: alinha a geometria com o eixo de movimento */}
      {/* Math.PI / 2 = 90 graus — rotaciona o cone para apontar para +Z */}
      <group rotation={[Math.PI / 2, 0, 0]}>

        {/* CORPO: cone principal */}
        {/* ConeGeometry(raioBase, altura, segmentos) */}
        <mesh>
          <coneGeometry args={[0.12 * scale, 0.55 * scale, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.1}
            emissive={color}
            emissiveIntensity={0.08} // brilho sutil próprio — peixe não some no escuro
          />
        </mesh>

        {/* CAUDA: cone menor, invertido, posicionado atrás do corpo */}
        {/* position Z negativo = atrás (pois estamos no grupo rotacionado) */}
        <mesh position={[0, -0.35 * scale, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.09 * scale, 0.22 * scale, 4]} />
          <meshStandardMaterial
            color={color}
            roughness={0.5}
            metalness={0.05}
            emissive={color}
            emissiveIntensity={0.06}
            transparent
            opacity={0.9}
          />
        </mesh>

      </group>
    </group>
  );
}
