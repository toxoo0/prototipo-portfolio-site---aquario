/**
 * page.tsx — Entry point
 *
 * Dois layers sobrepostos:
 *   1. AquariumScene → canvas WebGL (fundo)
 *   2. TrackingUI    → overlay HTML (frente, pointer-events: none)
 *
 * O wrapper `position: relative` é necessário para o
 * `position: absolute` do TrackingUI funcionar corretamente.
 */
import { AquariumScene } from "./scenes/AquariumScene";
import { TrackingUI } from "./systems/TrackingUI";

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <AquariumScene />
      <TrackingUI />
    </div>
  );
}
