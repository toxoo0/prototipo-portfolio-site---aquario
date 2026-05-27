"use client";

/**
 * FishSystem.tsx — Gerencia os 4 peixes do portfolio
 *
 * Cada peixe representa uma seção navegável.
 * Por enquanto apenas instancia os peixes com posições e cores diferentes.
 * Futuramente: labels, hover, click navigation.
 *
 * As posições iniciais são espalhadas pelo espaço para não coincidirem.
 * As cores são variações de azul frio — visual escuro e coeso.
 */

import { Fish } from "../components/Fish";

// Definição de cada peixe/seção
// Futuramente aqui virá: label, rota, ícone
const FISH_DATA = [
  {
    id: "about",
    section: "About",
    color: "#88bbee",       // azul claro
    initialPosition: [-5, 1, -2] as [number, number, number],
    speed: 1.0,
    scale: 1.1,
  },
  {
    id: "projects",
    section: "Projetos",
    color: "#6699cc",       // azul médio
    initialPosition: [3, -1, 2] as [number, number, number],
    speed: 1.3,
    scale: 1.0,
  },
  {
    id: "contact",
    section: "Contato",
    color: "#aad4e8",       // azul acinzentado claro
    initialPosition: [-2, 2, 4] as [number, number, number],
    speed: 0.9,
    scale: 0.9,
  },
  {
    id: "experiments",
    section: "Experimentos",
    color: "#4a88bb",       // azul escuro
    initialPosition: [5, 0, -4] as [number, number, number],
    speed: 1.5,
    scale: 1.2,
  },
] as const;

export function FishSystem() {
  return (
    <>
      {FISH_DATA.map((fish) => (
        <Fish
          key={fish.id}
          color={fish.color}
          initialPosition={fish.initialPosition}
          speed={fish.speed}
          scale={fish.scale}
          section={fish.section}
        />
      ))}
    </>
  );
}
