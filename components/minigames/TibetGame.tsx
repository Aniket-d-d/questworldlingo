"use client";

import TibetBridgesGame from "./TibetBridgesGame";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
  // difficulty 1 = 4×4 × 3 rounds, 2 = 5×5 × 3 rounds, 3 = 6×6 × 3 rounds
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
}

// Kingdom V — Tibetan Empire · Tibetan
// Game: Island Bridges (Hashi)
export default function TibetGame({ onComplete, difficulty, currentRound, totalRounds }: Props) {
  return <TibetBridgesGame onComplete={onComplete} difficulty={difficulty} currentRound={currentRound} totalRounds={totalRounds} />;
}
