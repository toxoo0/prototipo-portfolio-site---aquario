"use client";

/**
 * PositionBroadcaster.tsx — Projeta posições 3D em coordenadas 2D de tela
 *
 * ROLE: Único componente que conhece tanto o mundo Three.js quanto o store.
 * Roda dentro do Canvas (acessa useFrame, useThree).
 * Escreve no creatureScreenBuffer (lido pelo TrackingUI fora do Canvas).
 *
 * CONCEITO THREE.JS — Projeção de coordenadas:
 * Three.js usa um sistema NDC (Normalized Device Coordinates):
 *   - X: -1 (esquerda) a +1 (direita)
 *   - Y: -1 (baixo) a +1 (cima)  ← invertido em relação ao CSS!
 *   - Z: -1 (perto) a +1 (longe)
 *
 * `vector.project(camera)` converte mundo 3D → NDC.
 * Depois convertemos NDC → pixels CSS:
 *   px = (ndcX * 0.5 + 0.5) * screenWidth
 *   py = (-ndcY * 0.5 + 0.5) * screenHeight   ← Y invertido!
 *
 * Otimização: reutilizamos um único Vector3 (posHelper) para
 * todas as projeções no frame — sem alocar objetos novos = sem GC.
 *
 * Retorna null: é um componente "invisible" que apenas atualiza o store.
 */

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { creatureRegistry, creatureScreenBuffer, broadcastSignal } from "../store/creatureStore";

export function PositionBroadcaster() {
  const { camera, size } = useThree();

  // Vector3 reutilizável — criado uma vez, zero GC por frame
  const posHelper = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    creatureRegistry.forEach((reg, id) => {
      const group = reg.ref.current;
      if (!group) return;

      // Pega a posição mundial (world position) do grupo
      // getWorldPosition escreve no posHelper sem criar novo objeto
      group.getWorldPosition(posHelper as any);

      // Project: mundo 3D → NDC (-1 a +1)
      posHelper.project(camera);

      // NDC → pixels CSS
      const x = (posHelper.x * 0.5 + 0.5) * size.width;
      const y = (-posHelper.y * 0.5 + 0.5) * size.height;  // Y invertido!
      const depth = posHelper.z;

      creatureScreenBuffer.set(id, {
        x,
        y,
        depth,
        section: reg.section,
        type: reg.type,
        color: reg.color,
        trackingColor: reg.trackingColor,
      });
    });

    // Incrementa o sinal — TrackingUI detecta que há dados novos
    broadcastSignal.frame++;
  });

  // Sem render visual — apenas atualiza o store
  return null;
}
