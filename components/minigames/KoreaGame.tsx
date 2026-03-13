"use client";

import KoreaMathGame from "./KoreaMathGame";

interface Props {
  pairCount: number;
  difficulty?: 1 | 2 | 3;
  onComplete: (score: number, total: number) => void;
}

// Kingdom III — Goryeo Dynasty · Korean
// difficulty 1 = 60s, 2 = 45s, 3 = 30s (all 3 levels every time)
export default function KoreaGame({ difficulty, onComplete }: Props) {
  return <KoreaMathGame difficulty={difficulty} onComplete={onComplete} />;
}
