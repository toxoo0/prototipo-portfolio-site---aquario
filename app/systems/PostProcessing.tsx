"use client";

/**
 * PostProcessing.tsx — Efeitos de pós-processamento cinematográficos
 *
 * Ordem dos efeitos (importa para o resultado visual):
 * 1. Bloom  → objetos brilhantes vazam luz para os pixels ao redor
 * 2. Vignette → escurece as bordas (clássico efeito cinematográfico)
 *
 * CONCEITO — Pipeline de pós-processamento:
 * O Three.js renderiza a cena em uma textura (render target).
 * O EffectComposer aplica passes de shader sobre essa textura.
 * Cada "Effect" é um fragment shader que processa os pixels.
 * O resultado final é exibido na tela.
 *
 * BLOOM:
 * Extrai pixels acima do limiar de luminância (luminanceThreshold).
 * Aplica um blur gaussiano nesses pixels.
 * Soma o resultado borrado sobre a imagem original.
 * Efeito: objetos brilhantes "vazam" luz → peixes e partículas brilham.
 *
 * mipmapBlur: técnica moderna que usa o mipmap chain do Three.js
 * para um bloom mais suave e eficiente que o gaussian blur tradicional.
 *
 * VIGNETTE:
 * Escurece as bordas da tela com uma gradiente circular.
 * Cria a sensação de olhar através de um vidro/lente.
 */

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* BLOOM — brilho que vaza dos objetos luminosos */}
      <Bloom
        mipmapBlur                  /* bloom moderno, mais suave */
        intensity={1.8}             /* intensidade do glow */
        luminanceThreshold={0.25}   /* só brilha acima desta luminância */
        luminanceSmoothing={0.9}    /* suavidade da transição de limiar */
        radius={0.8}                /* raio do bloom */
      />

      {/* VIGNETTE — escurece as bordas para efeito cinematográfico */}
      <Vignette
        offset={0.3}                /* onde a escuridão começa (0=centro, 1=borda) */
        darkness={0.7}              /* quão escuro fica nas bordas */
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
