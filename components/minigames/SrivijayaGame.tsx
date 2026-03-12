"use client";

import TileGlow from "./TileGlow";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom I — Srivijaya Empire · Indonesian
// Game: Memory of Fire (tile sequence recall — 3×3 → 4×4 → 5×5)
// pairCount is ignored — TileGlow uses fixed 3-stage progression
export default function SrivijayaGame({ onComplete }: Props) {
  return <TileGlow onComplete={onComplete} />;
}
