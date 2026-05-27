"use client";

/**
 * useSwimming.ts — Hook de movimento de natação
 * v3: corrige bug de yBias acumulativo + estabiliza lookAt
 *
 * BUG CORRIGIDO:
 * O yBias anterior usava `+=` que SOMAVA ao targetVel.y a cada frame.
 * A cada 60 frames/s isso explodia para valores absurdos → criaturas "saltando".
 *
 * FIX: yBias agora USA (define) o componente Y do targetVel proporcionalmente
 * à distância do nível desejado. Clampado dentro dos limites de velocidade.
 * Resultado: pull suave e contínuo, sem acumulação.
 *
 * TAMBÉM CORRIGIDO: lookAt normaliza a direção antes de calcular o target,
 * evitando instabilidade quando a velocidade muda rapidamente.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SwimmingOptions {
  speed?: number
  turnSpeed?: number
  changeInterval?: number
  bounds?: { x: number; y: number; z: number }
  initialPosition?: [number, number, number]
  yBias?: number         // altura preferida no aquário
  yBiasStrength?: number // 0-1, quão forte é o pull (default 0.4)
}

export function useSwimming(options: SwimmingOptions = {}) {
  const {
    speed = 1.2,
    turnSpeed = 0.8,
    changeInterval = 4,
    bounds = { x: 8, y: 3, z: 6 },
    initialPosition = [0, 0, 0],
    yBias,
    yBiasStrength = 0.4,
  } = options;

  const ref = useRef<THREE.Group>(null!);

  const pos = useRef(new THREE.Vector3(...initialPosition));

  const vel = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 2
    )
      .normalize()
      .multiplyScalar(speed)
  );

  const targetVel = useRef(vel.current.clone());
  const timer = useRef(Math.random() * changeInterval);

  // Dir normalizado reutilizável (sem GC)
  const lookDir = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    // — 1. TROCA DE DIREÇÃO —
    timer.current -= delta;
    if (timer.current <= 0) {
      targetVel.current.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 2
      )
        .normalize()
        .multiplyScalar(speed * (0.7 + Math.random() * 0.6));

      timer.current = changeInterval * (0.6 + Math.random() * 0.8);
    }

    // — 2. Y BIAS — CORRIGIDO: DEFINE (não soma) o componente Y
    // Pull proporcional à distância do nível preferido
    // Clampado a ±(speed * 0.7) para não dominar o movimento horizontal
    if (yBias !== undefined) {
      const yDiff = yBias - pos.current.y;
      const yCorrection = yDiff * yBiasStrength;
      targetVel.current.y = THREE.MathUtils.clamp(
        yCorrection,
        -speed * 0.75,
        speed * 0.75
      );
    }

    // — 3. LIMITES — com margem de 0.5 para steering mais suave
    const mx = bounds.x + 0.5, my = bounds.y + 0.5, mz = bounds.z + 0.5;
    if (pos.current.x > mx)  targetVel.current.x = -Math.abs(targetVel.current.x) * 1.1;
    if (pos.current.x < -mx) targetVel.current.x =  Math.abs(targetVel.current.x) * 1.1;
    if (pos.current.y > my)  targetVel.current.y = -Math.abs(targetVel.current.y) * 1.1;
    if (pos.current.y < -my) targetVel.current.y =  Math.abs(targetVel.current.y) * 1.1;
    if (pos.current.z > mz)  targetVel.current.z = -Math.abs(targetVel.current.z) * 1.1;
    if (pos.current.z < -mz) targetVel.current.z =  Math.abs(targetVel.current.z) * 1.1;

    // Clamp de posição: garante que nenhuma criatura saia completamente dos limites
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -mx - 1, mx + 1);
    pos.current.y = THREE.MathUtils.clamp(pos.current.y, -my - 1, my + 1);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -mz - 1, mz + 1);

    // — 4. INTERPOLAÇÃO SUAVE DE VELOCIDADE —
    vel.current.lerp(targetVel.current, delta * turnSpeed);

    // Clamp da velocidade final (previne qualquer valor extremo residual)
    const maxSpeed = speed * 2.0;
    if (vel.current.length() > maxSpeed) {
      vel.current.normalize().multiplyScalar(maxSpeed);
    }

    // — 5. MOVIMENTO —
    pos.current.addScaledVector(vel.current, delta);

    // — 6. ROTAÇÃO: lookAt com direção normalizada (CORRIGIDO) —
    // Usar .clone().normalize() evitava GC → agora reutiliza lookDir
    const velLen = vel.current.length();
    if (velLen > 0.05) {
      lookDir.current.copy(vel.current).divideScalar(velLen); // normalize in-place
      lookTarget.current.copy(pos.current).add(lookDir.current);
      mesh.position.copy(pos.current);
      mesh.lookAt(lookTarget.current);
    } else {
      mesh.position.copy(pos.current);
    }
  });

  return ref;
}
