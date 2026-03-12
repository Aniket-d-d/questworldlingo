"use client";

import WordMatch from "./WordMatch";
import { WORD_PAIRS } from "@/constants/miniGames";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom V — Mongol Empire · Mongolian
// Future game type: chess
export default function MongoliaGame({ pairCount, onComplete }: Props) {
  const pairs = WORD_PAIRS.mongolia.slice(0, pairCount);
  return <WordMatch pairs={pairs} language="Mongolian" onComplete={onComplete} />;
}
