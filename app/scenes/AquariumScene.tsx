"use client";

/**
 * AquariumScene.tsx — Cena 3D completa
 *
 * ITERAÇÃO 2.1 — Fase Gráfica
 *
 * ILUMINAÇÃO MULTICAMADA:
 *
 * 1. SpotLight [2, 14, 4] — Sol atravessando a superfície
 *    Alto e descentrado para sombras naturais. Penumbra alta = luz difusa pela água.
 *
 * 2. CausticLights — 3 PointLights animados que simulam
 *    os padrões de luz refratada que a superfície projeta no fundo.
 *
 * 3. AmbientLight muito escura — fill mínimo para o aquário não ficar pitch black.
 *
 * 4. PointLights laterais azul-escuro — sensação de profundidade lateral.
 *
 * PÓS-PROCESSAMENTO:
 * - Bloom: os peixes e partículas com material emissivo brilham de verdade
 * - Vignette: bordas escuras = sensação cinematográfica de janela/vidro
 *
 * GOD RAYS: planos semi-transparentes com blending aditivo
 * emanando da posição do SpotLight — volumetric fake.
 *
 * COMPOSIÇÃO:
 * - Chão escuro (substrato)
 * - 5 clusters de rochas (31 rochas)
 * - 8 tufos de plantas (80 lâminas ondulando)
 * - Superfície da água animada
 * - God rays de luz diagonal
 * - 8 criaturas com morfologias distintas
 * - 180 partículas flutuantes
 */

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CreatureSystem } from "../systems/CreatureSystem";
import { ParticleSystem } from "../systems/ParticleSystem";
import { PositionBroadcaster } from "../systems/PositionBroadcaster";
import { PostProcessing } from "../systems/PostProcessing";
import { RockFormation } from "../components/environment/RockFormation";
import { PlantScene } from "../components/environment/PlantCluster";
import { WaterSurface } from "../components/environment/WaterSurface";
import { CausticLights } from "../components/environment/CausticLights";
import { GodRays } from "../components/environment/GodRays";

const BG = "#040810";

export function AquariumScene() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{
        position: [0, 0.5, 13],
        fov: 55,
        near: 0.1,
        far: 80,
      }}
      gl={{
        antialias: true,
        // Bloom funciona melhor com LinearSRGBColorSpace de output
        // e toneMapping no renderer (ACES filmic)
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      shadows
    >
      {/* ── ATMOSFERA ── */}
      <color attach="background" args={[BG]} />

      {/* Névoa: escurece objetos distantes = profundidade de aquário */}
      <fogExp2 attach="fog" args={[BG, 0.048]} />

      {/* ── ILUMINAÇÃO ── */}

      {/* 1. Fill ambiente mínimo — apenas para não ter pitch black total */}
      <ambientLight intensity={0.15} color="#0a1522" />

      {/* 2. SpotLight principal — sol atravessando a superfície da água */}
      <spotLight
        position={[2, 14, 4]}
        angle={0.38}
        penumbra={0.92}
        intensity={110}
        color="#b8d8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* 3. Cáusticas — padrões de luz animados */}
      <CausticLights />

      {/* 4. Luzes laterais azul-profundo — profundidade lateral */}
      <pointLight position={[-14, 2, 0]}  intensity={6}  color="#0a1840" distance={28} decay={2} />
      <pointLight position={[14, 3, -5]}  intensity={4}  color="#081430" distance={24} decay={2} />
      <pointLight position={[0, -1, -10]} intensity={3}  color="#0c1c2c" distance={18} decay={2} />

      {/* ── AMBIENTE ── */}

      {/* Chão — substrato escuro quase preto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#050806"
          roughness={0.98}
          metalness={0.0}
        />
      </mesh>

      {/* Raios de luz volumétrica (fake god rays) */}
      <GodRays />

      {/* Rochas vulcânicas */}
      <RockFormation />

      {/* Plantas aquáticas */}
      <PlantScene />

      {/* Superfície da água */}
      <WaterSurface />

      {/* ── CRIATURAS ── */}
      <CreatureSystem />

      {/* ── PARTÍCULAS ── */}
      <ParticleSystem />

      {/* ── SISTEMAS ── */}
      <PositionBroadcaster />

      {/* ── PÓS-PROCESSAMENTO ── */}
      {/* Deve ser o último filho do Canvas */}
      <PostProcessing />
    </Canvas>
  );
}
