"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KingdomStatus } from "@/types";
import { KINGDOMS } from "@/constants/story";
import Image from "next/image";
import KingdomCard from "./KingdomCard";
import PlayerSetup from "./PlayerSetup";

interface PlayerState {
  name: string;
  wisdomTokens: number;
  progress: Record<string, KingdomStatus>;
  artifacts: string[];
}

function getInitialProgress(): Record<string, KingdomStatus> {
  return {
    srivijaya: "available",
    japan: "locked",
    korea: "locked",
    china: "locked",
    mongolia: "locked",
    tibet: "locked",
  };
}

export default function WorldMap() {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aryansquest_player");
    if (saved) {
      try {
        setPlayer(JSON.parse(saved));
      } catch {
        localStorage.removeItem("aryansquest_player");
      }
    }
    setLoaded(true);
  }, []);

  function handlePlayerSetup(name: string) {
    const newPlayer: PlayerState = {
      name,
      wisdomTokens: 0,
      progress: getInitialProgress(),
      artifacts: [],
    };
    localStorage.setItem("aryansquest_player", JSON.stringify(newPlayer));
    setPlayer(newPlayer);
  }

  function handleKingdomClick(kingdomId: string) {
    router.push(`/game/${kingdomId}`);
  }

  if (!loaded) return null;

  if (!player) {
    return <PlayerSetup onComplete={handlePlayerSetup} />;
  }

  const completedCount = Object.values(player.progress).filter(
    (s) => s === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 md:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--border-gold)] pb-6">
          <div className="flex items-end gap-4">
            <Image src="/aryan.svg" alt="Aryan" width={70} height={112} />
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold text-[var(--accent-gold-light)] glow-gold"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Aryan&apos;s Quest
              </h1>
              <p className="text-[var(--text-muted)] text-sm mt-1 italic"
                style={{ fontFamily: "var(--font-crimson)" }}>
                Welcome, {player.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Progress */}
            <div className="text-center">
              <p className="text-[var(--accent-gold-light)] text-xl font-bold"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                {completedCount} / 6
              </p>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                Kingdoms
              </p>
            </div>

            {/* Wisdom Tokens */}
            <div className="text-center">
              <p className="text-[var(--accent-gold-light)] text-xl font-bold"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                {player.wisdomTokens}
              </p>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                Wisdom
              </p>
            </div>

            {/* Knowledge Chest */}
            <button
              onClick={() => router.push("/game/chest")}
              className="px-4 py-2 border border-[var(--border-gold)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold-light)] transition-all text-xs tracking-widest uppercase cursor-pointer"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Knowledge Chest
            </button>
          </div>
        </div>

        {/* Story reminder */}
        <div className="mb-8 text-center">
          <p
            className="text-[var(--text-muted)] text-sm italic max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            &ldquo;Don&apos;t mourn it. Rebuild it.&rdquo; — The Last Scholar of Nalanda
          </p>
        </div>

        {/* Kingdom grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KINGDOMS.map((kingdom) => (
            <KingdomCard
              key={kingdom.id}
              kingdom={kingdom}
              status={player.progress[kingdom.id] as KingdomStatus}
              artifactCollected={player.artifacts.includes(kingdom.id)}
              onClick={() => handleKingdomClick(kingdom.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[var(--text-muted)] text-xs mt-10 tracking-wide uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}>
          1203 AD · Six Kingdoms · One Purpose
        </p>
      </div>
    </div>
  );
}
