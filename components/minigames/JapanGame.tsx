"use client";

import WordMatch from "./WordMatch";
import { WORD_PAIRS } from "@/constants/miniGames";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom II — Heian Japan · Japanese
// Future game type: tetris
export default function JapanGame({ pairCount, onComplete }: Props) {
  const pairs = WORD_PAIRS.japan.slice(0, pairCount);
  return <WordMatch pairs={pairs} language="Japanese" onComplete={onComplete} />;
}
