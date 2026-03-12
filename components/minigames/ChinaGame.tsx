"use client";

import WordMatch from "./WordMatch";
import { WORD_PAIRS } from "@/constants/miniGames";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom IV — Song Dynasty · Chinese
// Future game type: memory_match
export default function ChinaGame({ pairCount, onComplete }: Props) {
  const pairs = WORD_PAIRS.china.slice(0, pairCount);
  return <WordMatch pairs={pairs} language="Chinese" onComplete={onComplete} />;
}
