"use client";

import TileGlow from "./TileGlow";

interface Props {
  pairCount: number;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom I — Srivijaya Empire · Memory of Fire
// difficulty 1 = 3×3 × 3 rounds, 2 = 4×4 × 3 rounds, 3 = 5×5 × 3 rounds
export default function SrivijayaGame({ difficulty, currentRound, totalRounds, onComplete }: Props) {
  return <TileGlow difficulty={difficulty} currentRound={currentRound} totalRounds={totalRounds} onComplete={onComplete} />;
}
