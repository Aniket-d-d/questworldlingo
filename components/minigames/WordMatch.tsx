"use client";

import { useState, useEffect } from "react";
import { WordPair } from "@/constants/miniGames";

interface WordMatchProps {
  pairs: WordPair[];
  language: string;
  onComplete: (score: number, total: number) => void;
}

export default function WordMatch({ pairs, language, onComplete }: WordMatchProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{ id: string; correct: boolean } | null>(null);
  const [shuffledMeanings, setShuffledMeanings] = useState<WordPair[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Shuffle meanings on mount
    setShuffledMeanings([...pairs].sort(() => Math.random() - 0.5));
  }, [pairs]);

  function handleWordClick(id: string) {
    if (matched.has(id) || flash) return;
    setSelectedWord(id);
  }

  function handleMeaningClick(id: string) {
    if (matched.has(id) || flash || !selectedWord) return;

    if (selectedWord === id) {
      // Correct match
      const newMatched = new Set(matched).add(id);
      setMatched(newMatched);
      setFlash({ id, correct: true });
      setSelectedWord(null);

      setTimeout(() => {
        setFlash(null);
        if (newMatched.size === pairs.length) {
          setCompleted(true);
          setTimeout(() => onComplete(newMatched.size, pairs.length), 800);
        }
      }, 600);
    } else {
      // Wrong match
      setFlash({ id: selectedWord, correct: false });
      setTimeout(() => {
        setFlash(null);
        setSelectedWord(null);
      }, 700);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "6px",
        }}>
          The Manuscript Challenge
        </p>
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "1rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}>
          Match each {language} word with its meaning
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
        {pairs.map((p) => (
          <div key={p.id} style={{
            flex: 1, height: "3px",
            backgroundColor: matched.has(p.id) ? "var(--accent-gold)" : "var(--border-gold)",
            transition: "background-color 0.4s",
          }} />
        ))}
      </div>

      {/* Word columns */}
      <div style={{ display: "flex", gap: "24px", flex: 1 }}>

        {/* Left — foreign words */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "4px",
          }}>
            {language}
          </p>
          {pairs.map((pair) => {
            const isMatched = matched.has(pair.id);
            const isSelected = selectedWord === pair.id;
            const isFlashing = flash?.id === pair.id;

            return (
              <button
                key={pair.id}
                onClick={() => handleWordClick(pair.id)}
                disabled={isMatched}
                style={{
                  padding: "14px 20px",
                  border: `1px solid ${
                    isMatched ? "var(--accent-gold)" :
                    isSelected ? "var(--accent-gold-light)" :
                    isFlashing && !flash?.correct ? "#8b2500" :
                    "var(--border-gold)"
                  }`,
                  background: isMatched
                    ? "rgba(201,146,42,0.08)"
                    : isSelected
                    ? "rgba(201,146,42,0.05)"
                    : "transparent",
                  color: isMatched
                    ? "var(--accent-gold)"
                    : isSelected
                    ? "var(--accent-gold-light)"
                    : "var(--text-primary)",
                  fontFamily: "var(--font-crimson)",
                  fontSize: "1.1rem",
                  cursor: isMatched ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.25s",
                  boxShadow: isMatched ? "0 0 12px rgba(201,146,42,0.15)" : "none",
                  opacity: isMatched ? 0.7 : 1,
                }}
              >
                {pair.word}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", backgroundColor: "var(--border-gold)", alignSelf: "stretch" }} />

        {/* Right — English meanings (shuffled) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "4px",
          }}>
            English
          </p>
          {shuffledMeanings.map((pair) => {
            const isMatched = matched.has(pair.id);

            return (
              <button
                key={pair.id}
                onClick={() => handleMeaningClick(pair.id)}
                disabled={isMatched || !selectedWord}
                style={{
                  padding: "14px 20px",
                  border: `1px solid ${isMatched ? "var(--accent-gold)" : "var(--border-gold)"}`,
                  background: isMatched ? "rgba(201,146,42,0.08)" : "transparent",
                  color: isMatched ? "var(--accent-gold)" : !selectedWord ? "var(--text-muted)" : "var(--text-primary)",
                  fontFamily: "var(--font-crimson)",
                  fontSize: "1.1rem",
                  cursor: isMatched || !selectedWord ? "default" : "pointer",
                  textAlign: "left",
                  transition: "all 0.25s",
                  boxShadow: isMatched ? "0 0 12px rgba(201,146,42,0.15)" : "none",
                  opacity: isMatched ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isMatched && selectedWord) {
                    e.currentTarget.style.borderColor = "var(--accent-gold-light)";
                    e.currentTarget.style.color = "var(--accent-gold-light)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMatched) {
                    e.currentTarget.style.borderColor = "var(--border-gold)";
                    e.currentTarget.style.color = selectedWord ? "var(--text-primary)" : "var(--text-muted)";
                  }
                }}
              >
                {pair.meaning}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      {!completed && (
        <p style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          fontStyle: "italic",
          marginTop: "20px",
          textAlign: "center",
        }}>
          {selectedWord ? "Now select the matching meaning →" : "Select a word to begin"}
        </p>
      )}

      {/* Completion */}
      {completed && (
        <div style={{
          marginTop: "20px",
          padding: "16px",
          border: "1px solid var(--accent-gold)",
          textAlign: "center",
          animation: "panelFadeIn 0.5s ease forwards",
        }}>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.9rem",
            color: "var(--accent-gold-light)",
            letterSpacing: "0.1em",
          }}>
            Manuscript Unlocked
          </p>
        </div>
      )}
    </div>
  );
}
