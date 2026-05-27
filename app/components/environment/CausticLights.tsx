"use client";

/**
 * CausticLights.tsx — Simulação de luz cáustica
 *
 * Cáusticas são os padrões de luz em movimento que a água projeta
 * no fundo e nas rochas de um aquário quando luz atravessa a superfície.
 *
 * TÉCNICA:
 * 3 PointLights com posições animadas por funções sine/cosine defasadas.
 * Como o movimento é lento e suave, o resultado parece luz oscilando.
 * Cada luz tem cor e intensidade levemente diferente — mais natural.
 *
 * CONCEITO THREE.JS: PointLight com `decay: 2` respeita a lei do inverso
 * do quadrado — cai proporcionalmente ao quadrado da distância.
 * Com distance 10-15, a luz mal alcança o fundo mas cria manchas sutis.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CausticLights() {
  const l1 = useRef<THREE.PointLight>(null!);
  const l2 = useRef<THREE.PointLight>(null!);
  const l3 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Movimento elíptico lento — 3 fases diferentes (não síncronos)
    if (l1.current) {
      l1.current.position.x = Math.sin(t * 0.28) * 4.5;
      l1.current.position.z = Math.cos(t * 0.22) * 3.5;
    }
    if (l2.current) {
      l2.current.position.x = Math.sin(t * 0.19 + 2.1) * 3.0;
      l2.current.position.z = Math.cos(t * 0.31 + 1.3) * 4.0;
    }
    if (l3.current) {
      l3.current.position.x = Math.sin(t * 0.14 + 4.2) * 5.5;
      l3.current.position.z = Math.cos(t * 0.18 + 3.7) * 3.0;
    }
  });

  return (
    <>
      {/* Cáustica principal — azul-gelo */}
      <pointLight
        ref={l1}
        position={[0, 5.5, 0]}
        intensity={2.5}
        color="#90c8ff"
        distance={16}
        decay={2}
      />
      {/* Cáustica secundária — branco-azul */}
      <pointLight
        ref={l2}
        position={[0, 5.2, 0]}
        intensity={1.5}
        color="#b8d8ff"
        distance={12}
        decay={2}
      />
      {/* Cáustica terciária — azul suave */}
      <pointLight
        ref={l3}
        position={[0, 5.8, 0]}
        intensity={1.2}
        color="#6898d8"
        distance={20}
        decay={2}
      />
    </>
  );
}
