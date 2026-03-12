"use client";

import WordMatch from "./WordMatch";
import { WORD_PAIRS } from "@/constants/miniGames";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom III — Goryeo Dynasty · Korean
// Future game type: math_puzzle
export default function KoreaGame({ pairCount, onComplete }: Props) {
  const pairs = WORD_PAIRS.korea.slice(0, pairCount);
  return <WordMatch pairs={pairs} language="Korean" onComplete={onComplete} />;
}
