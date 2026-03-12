"use client";

import { useState, useEffect } from "react";
import { Kingdom } from "@/types";
import { TRAVEL_LORE } from "@/constants/scholars";

interface TravelLoreProps {
  kingdom: Kingdom;
  onComplete: () => void;
}

export default function TravelLore({ kingdom, onComplete }: TravelLoreProps) {
  const lines = TRAVEL_LORE[kingdom.id] ?? [];
  const [lineIndex, setLineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => advanceLine(), 3500);
    return () => clearTimeout(timer);
  }, [lineIndex]);

  function advanceLine() {
    if (lineIndex < lines.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setLineIndex((i) => i + 1);
        setVisible(true);
      }, 500);
    } else {
      onComplete();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6 cursor-pointer"
      onClick={advanceLine}
    >
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Kingdom label */}
        <p
          className="text-[var(--accent-gold)] text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Travelling to · {kingdom.name}
        </p>

        {/* Lore line */}
        <p
          className="text-2xl md:text-3xl leading-relaxed italic transition-opacity duration-500"
          style={{
            fontFamily: "var(--font-crimson)",
            color: "var(--text-primary)",
            opacity: visible ? 1 : 0,
          }}
        >
          {lines[lineIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {lines.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i <= lineIndex
                    ? "var(--accent-gold)"
                    : "var(--border-gold)",
              }}
            />
          ))}
        </div>

        <p className="text-[var(--text-muted)] text-xs tracking-wide">
          Click to continue
        </p>
      </div>

      {/* Skip */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="fixed bottom-6 right-6 text-[var(--text-muted)] text-xs tracking-widest uppercase hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        Skip →
      </button>
    </div>
  );
}
