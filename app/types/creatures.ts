/**
 * creatures.ts — Tipos compartilhados do sistema de criaturas
 *
 * Usado por: CreatureSystem, store, componentes de criaturas, TrackingUI
 */

// Os 4 tipos de criaturas — cada um mapeia para uma seção do portfolio
export type CreatureType = 'large-fish' | 'small-fish' | 'shrimp' | 'snail'

// Definição de uma criatura no sistema
export interface CreatureDef {
  id: string
  type: CreatureType
  section: string                        // nome da seção futura do portfolio
  color: string                          // cor do corpo (material 3D)
  trackingColor: string                  // cor do tracking HUD (mais vivo)
  initialPosition: [number, number, number]
  speed: number
  scale: number
}

// Dado projetado na tela — preenchido pelo PositionBroadcaster a cada frame
export interface CreatureScreenData {
  x: number          // pixel X na tela
  y: number          // pixel Y na tela
  depth: number      // profundidade normalizada (< 1 = visível)
  section: string
  type: CreatureType
  color: string
  trackingColor: string
}
