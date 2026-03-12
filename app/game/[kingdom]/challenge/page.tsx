"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ kingdom: string }>;
}

export default function ChallengePage({ params }: PageProps) {
  const { kingdom } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] gap-6 px-6">
      <p
        className="text-[var(--accent-gold-light)] text-2xl"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        The Challenge
      </p>
      <p
        className="text-[var(--text-muted)] text-sm tracking-widest uppercase"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {kingdom} · Mini-game coming soon
      </p>
      <button
        onClick={() => router.push("/game")}
        className="mt-4 px-6 py-2 border border-[var(--border-gold)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold-light)] transition-all text-xs tracking-widest uppercase cursor-pointer"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        ← Back to World Map
      </button>
    </div>
  );
}
