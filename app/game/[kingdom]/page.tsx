"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { KINGDOMS } from "@/constants/story";
import { Verdict, KingdomId } from "@/types";
import TravelLore from "@/components/game/TravelLore";
import ScholarChat from "@/components/game/ScholarChat";

type KingdomPhase = "lore" | "chat" | "redirecting";

interface PageProps {
  params: Promise<{ kingdom: string }>;
}

export default function KingdomPage({ params }: PageProps) {
  const { kingdom: kingdomSlug } = use(params);
  const router = useRouter();
  const [phase, setPhase] = useState<KingdomPhase>("lore");

  const kingdom = KINGDOMS.find((k) => k.id === kingdomSlug);

  useEffect(() => {
    if (!kingdom) {
      router.replace("/game");
    }
  }, [kingdom, router]);

  if (!kingdom) return null;

  function handleLoreComplete() {
    setPhase("chat");
  }

  function handleChatComplete(verdict: Verdict) {
    setPhase("redirecting");
    // Save verdict to localStorage for mini-game difficulty
    const key = `aryansquest_verdict_${kingdom!.id}`;
    localStorage.setItem(key, verdict);
    // Redirect to mini-game
    router.push(`/game/${kingdom!.id}/challenge`);
  }

  if (phase === "lore") {
    return <TravelLore kingdom={kingdom} onComplete={handleLoreComplete} />;
  }

  if (phase === "chat") {
    return <ScholarChat kingdom={kingdom} onComplete={handleChatComplete} />;
  }

  // Redirecting state
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <p
        className="text-[var(--text-muted)] text-sm tracking-widest uppercase animate-flicker"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        Preparing the Challenge...
      </p>
    </div>
  );
}
