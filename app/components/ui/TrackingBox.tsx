"use client";

/**
 * TrackingBox.tsx — Caixa de tracking HUD individual
 *
 * Referência estética: blob tracking do TouchDesigner na referência visual.
 * - Retângulo com cantos destacados (não borda completa — só L's nos cantos)
 * - Label monoespaçado em cima ou embaixo
 * - Pulsação suave de opacidade
 * - Tom frio, digital, minimalista
 *
 * TÉCNICA CSS:
 * Os 4 "L" dos cantos são criados com 4 divs absolutos,
 * cada um com apenas 2 bordas (top+left, top+right, etc).
 * Este padrão é mais autêntico ao tracking visual do que uma borda completa.
 *
 * Tamanho da caixa varia por tipo de criatura para refletir seu tamanho visual.
 */

import type { CreatureScreenData } from "../../types/creatures";

const BOX_SIZE: Record<string, { w: number; h: number }> = {
  'large-fish': { w: 80, h: 64 },
  'small-fish': { w: 56, h: 44 },
  'shrimp':     { w: 48, h: 38 },
  'snail':      { w: 44, h: 40 },
};

const CORNER_SIZE = 8; // tamanho do "L" em pixels

export function TrackingBox({ x, y, section, type, trackingColor }: CreatureScreenData) {
  const { w, h } = BOX_SIZE[type] ?? { w: 56, h: 44 };
  const c = trackingColor;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      {/* CANTO superior esquerdo */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: CORNER_SIZE, height: CORNER_SIZE,
        borderTop: `1px solid ${c}`,
        borderLeft: `1px solid ${c}`,
        opacity: 0.9,
      }} />

      {/* CANTO superior direito */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: CORNER_SIZE, height: CORNER_SIZE,
        borderTop: `1px solid ${c}`,
        borderRight: `1px solid ${c}`,
        opacity: 0.9,
      }} />

      {/* CANTO inferior esquerdo */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: CORNER_SIZE, height: CORNER_SIZE,
        borderBottom: `1px solid ${c}`,
        borderLeft: `1px solid ${c}`,
        opacity: 0.9,
      }} />

      {/* CANTO inferior direito */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: CORNER_SIZE, height: CORNER_SIZE,
        borderBottom: `1px solid ${c}`,
        borderRight: `1px solid ${c}`,
        opacity: 0.9,
      }} />

      {/* LABEL — abaixo da caixa */}
      <div style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: 5,
        color: c,
        fontSize: 8,
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        opacity: 0.75,
        lineHeight: 1,
      }}>
        {section}
      </div>
    </div>
  );
}
