import type { ReactNode } from "react";

export type KingdomId =
  | "srivijaya"
  | "japan"
  | "korea"
  | "china"
  | "tibet";

export type KingdomStatus = "locked" | "available" | "in_progress" | "completed";

export type Verdict = "WORTHY" | "NEUTRAL" | "UNWORTHY";

export type Difficulty = "easy" | "normal" | "hard";

export interface Kingdom {
  id: KingdomId;
  name: ReactNode;
  location: ReactNode;
  language: ReactNode;
  historicalHook: ReactNode;
  artifact: ReactNode;
  scholarName: ReactNode;
  miniGame: MiniGameType;
}

export type MiniGameType =
  | "memory_glow"
  | "kings"
  | "math_puzzle"
  | "memory_match"
  | "sudoku"
  | "bridges";

export interface Player {
  id: string;
  name: string;
  language: string;
  createdAt: string;
}

export interface Progress {
  playerId: string;
  kingdomId: KingdomId;
  status: KingdomStatus;
  attempts: number;
}

export interface Artifact {
  playerId: string;
  artifactId: KingdomId;
  collectedAt: string;
}

export interface ChatMessage {
  role: "user" | "scholar";
  content: string;
}

export interface ScholarChatResult {
  response: string;
  verdict: Verdict;
}

export interface GameState {
  player: Player | null;
  progress: Progress[];
  artifacts: Artifact[];
  wisdomTokens: number;
}
