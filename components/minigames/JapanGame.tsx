"use client";

import JapanKingsGame from "./JapanKingsGame";

interface Props {
  pairCount: number;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom II — Heian Japan · Japanese
// difficulty 1 = 4×4 × 3 rounds, 2 = 5×5 × 3 rounds, 3 = 6×6 × 3 rounds
export default function JapanGame({ difficulty, currentRound, totalRounds, onComplete }: Props) {
  return <JapanKingsGame difficulty={difficulty} currentRound={currentRound} totalRounds={totalRounds} onComplete={onComplete} />;
}
