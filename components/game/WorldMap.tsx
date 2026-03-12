"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KingdomStatus } from "@/types";
import { KINGDOMS } from "@/constants/story";
import KingdomCard from "./KingdomCard";
import PlayerSetup from "./PlayerSetup";
import PageShell from "@/components/ui/PageShell";
import GameHeader from "@/components/ui/GameHeader";

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
    <PageShell>
      <GameHeader playerName={player.name} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* ── Stats bar ── */}
        <div
          className="stagger-line"
          style={{
            display: "flex", gap: "48px", alignItems: "center", justifyContent: "center",
            padding: "20px 48px", border: "1px solid var(--border-gold)",
            marginBottom: "48px", animationDelay: "0.3s",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "2rem", fontWeight: 700, color: "var(--accent-gold-light)" }}>
              {completedCount} / {KINGDOMS.length}
            </p>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>
              Kingdoms
            </p>
          </div>
          <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-gold)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "2rem", fontWeight: 700, color: "var(--accent-gold-light)" }}>
              {player.wisdomTokens}
            </p>
            <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>
              Wisdom Tokens
            </p>
          </div>
          <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-gold)" }} />
          <button
            onClick={() => router.push("/game/chest")}
            style={{
              padding: "10px 28px",
              border: "1px solid var(--border-gold)",
              color: "var(--text-secondary)",
              background: "transparent",
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            Knowledge Chest
          </button>
        </div>

        {/* ── Kingdom grid ── */}
        <div
          className="stagger-line"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "20px",
            width: "100%",
            animationDelay: "0.5s",
          }}
        >
          {KINGDOMS.map((kingdom) => (
            <div
              key={kingdom.id}
              style={{
                gridColumn:
                  kingdom.id === "srivijaya"
                    ? "1 / span 2"
                    : kingdom.id === "japan"
                    ? "3 / span 2"
                    : kingdom.id === "korea"
                    ? "5 / span 2"
                    : kingdom.id === "china"
                    ? "2 / span 2"
                    : kingdom.id === "tibet"
                    ? "4 / span 2"
                    : undefined,
                gridRow:
                  kingdom.id === "china" || kingdom.id === "tibet" ? "2" : "1",
              }}
            >
              <KingdomCard
                kingdom={kingdom}
                status={player.progress[kingdom.id] as KingdomStatus}
                artifactCollected={player.artifacts.includes(kingdom.id)}
                onClick={() => handleKingdomClick(kingdom.id)}
              />
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <p
          className="stagger-line"
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginTop: "56px",
            animationDelay: "0.6s",
          }}
        >
          1203 AD · Five Kingdoms · One Purpose
        </p>

      </div>
    </PageShell>
  );
}
