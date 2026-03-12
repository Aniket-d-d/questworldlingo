"use client";

import WordMatch from "./WordMatch";
import { WORD_PAIRS } from "@/constants/miniGames";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom VI — Tibetan Empire · Tibetan
// Future game type: sudoku
export default function TibetGame({ pairCount, onComplete }: Props) {
  const pairs = WORD_PAIRS.tibet.slice(0, pairCount);
  return <WordMatch pairs={pairs} language="Tibetan" onComplete={onComplete} />;
}
