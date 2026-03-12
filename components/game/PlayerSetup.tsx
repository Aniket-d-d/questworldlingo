"use client";

import { useState } from "react";
import Image from "next/image";
import GameTitle from "@/components/ui/GameTitle";
import PageShell from "@/components/ui/PageShell";

interface PlayerSetupProps {
  onComplete: (name: string) => void;
}

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (trimmed.length > 30) {
      setError("Name must be 30 characters or less.");
      return;
    }
    onComplete(trimmed);
  }

  return (
    <PageShell style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "28px 48px 0",
      }}>
        <GameTitle />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px 80px",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Character + greeting */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "40px" }}>
            <Image src="/aryan.svg" alt="Aryan" width={72} height={115} />
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              marginTop: "20px",
              textAlign: "center",
              lineHeight: 1.7,
            }}>
              The monk looks at you from the rubble of Nalanda.
            </p>
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "1.15rem",
              color: "var(--text-primary)",
              fontStyle: "italic",
              marginTop: "10px",
              textAlign: "center",
              lineHeight: 1.7,
            }}>
              &ldquo;What is your name, young traveller?&rdquo;
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              maxLength={30}
              autoFocus
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
                padding: "14px 20px",
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                textAlign: "center",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; }}
            />

            {error && (
              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.9rem",
                color: "#c0392b",
                textAlign: "center",
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: "14px",
                border: "1px solid var(--accent-gold)",
                background: "transparent",
                color: "var(--accent-gold-light)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: name.trim() ? "pointer" : "not-allowed",
                opacity: name.trim() ? 1 : 0.5,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => { if (name.trim()) { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            >
              Begin Quest
            </button>
          </form>

        </div>
      </div>
    </PageShell>
  );
}
