"use client";

import TibetBridgesGame from "./TibetBridgesGame";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom V — Tibetan Empire · Tibetan
// Game: Island Bridges (Hashi)
export default function TibetGame({ onComplete }: Props) {
  return <TibetBridgesGame onComplete={onComplete} />;
}
