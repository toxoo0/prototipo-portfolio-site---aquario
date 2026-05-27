"use client";

/**
 * CreatureSystem.tsx — Gerenciador de todas as criaturas
 *
 * Define os 8 habitantes do aquário:
 *   2× peixe grande (Discus)  → Projetos grandes
 *   3× peixe médio (Tetra)    → Projetos artísticos/experimentais
 *   2× camarão                → About + Contato
 *   1× caramujo               → Seção TBD
 *
 * Cada criatura tem:
 *   - Tipo (determina componente + comportamento de natação)
 *   - Seção (nome futuro da navegação)
 *   - Cor do corpo (material 3D)
 *   - Cor do tracking (HUD overlay)
 *   - Posição inicial dispersa pelo espaço
 *   - Velocidade e escala individuais
 *
 * ARQUITETURA:
 * Este arquivo é o único que conhece todas as criaturas.
 * Os componentes de criatura se auto-registram no creatureStore.
 * O PositionBroadcaster projeta as posições.
 * O TrackingUI renderiza os overlays.
 * Nenhuma dessas peças sabe das outras — comunicam pelo store.
 */

import { LargeFish } from "../components/creatures/LargeFish";
import { SmallFish } from "../components/creatures/SmallFish";
import { Shrimp } from "../components/creatures/Shrimp";
import { Snail } from "../components/creatures/Snail";
import type { CreatureDef } from "../types/creatures";

// Paleta de cores do tracking HUD (inspirada no blob tracking — brilhante, fria)
// Cada tipo tem uma cor de categoria
const TRACKING_COLORS = {
  'large-fish': '#00d4ff',  // ciano
  'small-fish': '#ffaa44',  // âmbar
  'shrimp':     '#ff4455',  // vermelho vivo
  'snail':      '#cc55ff',  // violeta
};

// Paleta de cores dos corpos (tons mais sutis)
const BODY_COLORS = {
  'large-fish': '#3a8fc4',  // azul-aço
  'small-fish': '#c4823a',  // âmbar queimado
  'shrimp':     '#c43328',  // vermelho escuro
  'snail':      '#7744aa',  // violeta escuro
};

const CREATURES: CreatureDef[] = [
  // ── PEIXES GRANDES (Discus) ──
  {
    id: 'lf-1',
    type: 'large-fish',
    section: 'Projetos',
    color: BODY_COLORS['large-fish'],
    trackingColor: TRACKING_COLORS['large-fish'],
    initialPosition: [-5, 1, -1],
    speed: 0.75,
    scale: 1.0,
  },
  {
    id: 'lf-2',
    type: 'large-fish',
    section: 'Projetos',
    color: '#2a7aaa',          // variação de cor individual
    trackingColor: TRACKING_COLORS['large-fish'],
    initialPosition: [3.5, -0.5, 2],
    speed: 0.65,
    scale: 1.15,
  },

  // ── PEIXES MÉDIOS (Tetra/Barb) ──
  {
    id: 'sf-1',
    type: 'small-fish',
    section: 'Arte',
    color: BODY_COLORS['small-fish'],
    trackingColor: TRACKING_COLORS['small-fish'],
    initialPosition: [-2.5, 0.5, 3],
    speed: 1.4,
    scale: 0.85,
  },
  {
    id: 'sf-2',
    type: 'small-fish',
    section: 'Arte',
    color: '#b87030',          // variação mais escura
    trackingColor: TRACKING_COLORS['small-fish'],
    initialPosition: [4.5, 1, -0.5],
    speed: 1.6,
    scale: 0.9,
  },
  {
    id: 'sf-3',
    type: 'small-fish',
    section: 'Arte',
    color: '#d49040',          // variação mais clara
    trackingColor: TRACKING_COLORS['small-fish'],
    initialPosition: [-3.5, -0.5, 0.5],
    speed: 1.2,
    scale: 0.8,
  },

  // ── CAMARÕES ──
  {
    id: 'sh-1',
    type: 'shrimp',
    section: 'Sobre',
    color: BODY_COLORS['shrimp'],
    trackingColor: TRACKING_COLORS['shrimp'],
    initialPosition: [2.5, -3, 3.5],
    speed: 0.55,
    scale: 1.0,
  },
  {
    id: 'sh-2',
    type: 'shrimp',
    section: 'Contato',
    color: '#aa2822',          // variação mais escura
    trackingColor: TRACKING_COLORS['shrimp'],
    initialPosition: [-3, -3, -2],
    speed: 0.6,
    scale: 0.9,
  },

  // ── CARAMUJO ──
  {
    id: 'sn-1',
    type: 'snail',
    section: '???',
    color: BODY_COLORS['snail'],
    trackingColor: TRACKING_COLORS['snail'],
    initialPosition: [1, -3.8, 1.5],
    speed: 0.12,
    scale: 1.1,
  },
];

// Mapa de componente por tipo
const CREATURE_COMPONENTS = {
  'large-fish': LargeFish,
  'small-fish': SmallFish,
  'shrimp':     Shrimp,
  'snail':      Snail,
};

export function CreatureSystem() {
  return (
    <>
      {CREATURES.map((creature) => {
        const Component = CREATURE_COMPONENTS[creature.type];
        return (
          <Component
            key={creature.id}
            id={creature.id}
            section={creature.section}
            color={creature.color}
            trackingColor={creature.trackingColor}
            initialPosition={creature.initialPosition}
            speed={creature.speed}
            scale={creature.scale}
          />
        );
      })}
    </>
  );
}
