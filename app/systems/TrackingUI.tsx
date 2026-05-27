"use client";

/**
 * TrackingUI.tsx — Overlay HTML de tracking das criaturas
 *
 * Fica FORA do Canvas. Lê o creatureScreenBuffer via requestAnimationFrame.
 * Renderiza TrackingBoxes + linhas SVG conectando criaturas do mesmo tipo.
 *
 * ARQUITETURA DA COMUNICAÇÃO:
 *
 *   Canvas (R3F)                    módulo store              HTML overlay
 *   ─────────────────               ─────────────             ─────────────────
 *   PositionBroadcaster             creatureScreenBuffer      TrackingUI
 *   useFrame() →                 ─► Map<id, data>          ◄─ useEffect + RAF
 *   projeta 3D→2D                   broadcastSignal.frame     setState quando
 *   escreve no buffer               incrementado a cada        signal muda
 *                                   frame pelo broadcaster
 *
 * Por que RAF em vez de um evento?
 * O setState do React agendado dentro de RAF garante que a UI HTML
 * atualize em sincronia com o loop de animação. Sem jitter, sem lag.
 *
 * Por que não usar Zustand/Context?
 * Para esta arquitetura, um Map mútavel + sinal de versão é suficiente
 * e tem overhead praticamente zero. Zustand faria sentido se houvesse
 * múltiplos consumidores React independentes.
 */

import { useState, useEffect } from "react";
import { TrackingBox } from "../components/ui/TrackingBox";
import { creatureScreenBuffer, broadcastSignal } from "../store/creatureStore";
import type { CreatureScreenData, CreatureType } from "../types/creatures";

export function TrackingUI() {
  const [creatures, setCreatures] = useState<Map<string, CreatureScreenData>>(new Map());

  useEffect(() => {
    let rafId: number;
    let lastFrame = -1;

    function tick() {
      // Só re-renderiza se o broadcaster escreveu dados novos
      if (broadcastSignal.frame !== lastFrame) {
        lastFrame = broadcastSignal.frame;
        // Shallow copy do Map para disparar re-render
        setCreatures(new Map(creatureScreenBuffer));
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const entries = Array.from(creatures.entries());

  // Agrupamento por tipo para desenhar linhas de conexão
  const byType = new Map<CreatureType, { id: string; data: CreatureScreenData }[]>();
  entries.forEach(([id, data]) => {
    if (data.depth >= 1) return;  // atrás da câmera — ignora
    if (!byType.has(data.type)) byType.set(data.type, []);
    byType.get(data.type)!.push({ id, data });
  });

  // Criaturas visíveis para renderizar (depth < 1 = na frente da câmera)
  const visible = entries
    .filter(([, d]) => d.depth < 1)
    .sort((a, b) => b[1].depth - a[1].depth); // mais distante primeiro (z-order)

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* LINHAS SVG conectando criaturas do mesmo tipo */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {Array.from(byType.entries()).map(([, group]) => {
          if (group.length < 2) return null;
          const color = group[0].data.trackingColor;

          // Conecta cada criatura à próxima do mesmo tipo em linha
          return group.slice(0, -1).map(({ id, data: a }, i) => {
            const b = group[i + 1].data;
            return (
              <line
                key={`line-${id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={color}
                strokeWidth="0.6"
                strokeOpacity="0.35"
                strokeDasharray="3 6"  // tracejado sutil
              />
            );
          });
        })}
      </svg>

      {/* TRACKING BOXES */}
      {visible.map(([id, data]) => (
        <TrackingBox key={id} {...data} />
      ))}
    </div>
  );
}
