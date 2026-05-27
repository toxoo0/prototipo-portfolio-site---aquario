/**
 * creatureStore.ts — Bridge entre o mundo 3D (R3F) e o HTML overlay
 *
 * ARQUITETURA:
 * Este módulo é a única camada de comunicação entre o Canvas WebGL e a UI HTML.
 *
 * Como funciona:
 *   1. Cada criatura se registra aqui ao montar (ref, section, type, color)
 *   2. PositionBroadcaster (dentro do Canvas) lê o registry, projeta posições 3D→2D
 *      e escreve no creatureScreenBuffer a cada frame
 *   3. TrackingUI (fora do Canvas) lê o buffer via requestAnimationFrame
 *      e renderiza as caixas de tracking HTML
 *
 * Sem zustand. Sem Context. Sem eventos.
 * Apenas um Map mútavel — leitura/escrita síncrona, zero overhead.
 */

import type { CreatureType, CreatureScreenData } from '../types/creatures'

// Tipo mínimo para o registro — evita importar THREE.Group aqui
export interface CreatureRegistration {
  ref: { current: { getWorldPosition: (v: { set: (x: number, y: number, z: number) => void } & object) => void } | null }
  section: string
  type: CreatureType
  color: string
  trackingColor: string
}

// Registry: criaturas se registram ao montar, removem ao desmontar
export const creatureRegistry = new Map<string, CreatureRegistration>()

// Buffer de saída: PositionBroadcaster escreve as posições 2D projetadas
export const creatureScreenBuffer = new Map<string, CreatureScreenData>()

// Sinal de atualização: incrementado a cada frame pelo PositionBroadcaster
// TrackingUI compara com seu último valor para saber se precisa re-renderizar
export const broadcastSignal = { frame: 0 }
