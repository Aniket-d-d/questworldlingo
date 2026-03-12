"use client";

import JapanKingsGame from "./JapanKingsGame";

interface Props {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
}

// Kingdom II — Heian Japan · Japanese
// Game: King-placement puzzle
export default function JapanGame({ onComplete }: Props) {
  return <JapanKingsGame onComplete={onComplete} />;
}
