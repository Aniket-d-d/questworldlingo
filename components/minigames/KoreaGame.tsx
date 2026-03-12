"use client";

import KoreaMathGame from "./KoreaMathGame";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom III — Goryeo Dynasty · Korean
// Game: 3-level arithmetic challenge
export default function KoreaGame({ onComplete }: Props) {
  return <KoreaMathGame onComplete={onComplete} />;
}
