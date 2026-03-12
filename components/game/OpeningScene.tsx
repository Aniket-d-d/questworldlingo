"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPENING_NARRATION, MONK_DIALOGUE } from "@/constants/story";
import PageShell from "@/components/ui/PageShell";
import GameTitle from "@/components/ui/GameTitle";

export default function OpeningScene() {
  const router = useRouter();
  const [panel, setPanel] = useState(0);
  const [panelKey, setPanelKey] = useState(0);

  function goToPanel(n: number) {
    setPanel(n);
    setPanelKey((k) => k + 1);
  }

  const lines0 = OPENING_NARRATION;
  const lines1 = MONK_DIALOGUE.lines;

  return (
    <PageShell style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", minHeight: "unset" }}>

      {/* ── Left — Aryan SVG ── */}
      <div style={{ width: "38%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/aryan.svg"
          alt="Aryan"
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom" }}
        />
        {/* Right edge fade */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "100px",
          background: "linear-gradient(to right, transparent, var(--bg-primary))",
        }} />
      </div>

      {/* ── Right — sliding panels ── */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* Radial amber glow behind text */}
        <div style={{
          position: "absolute",
          top: "50%", left: "40%",
          transform: "translate(-50%, -50%)",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,146,42,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Slide track */}
        <div style={{
          display: "flex",
          width: "200%",
          transform: `translateX(${panel === 0 ? "0%" : "-50%"})`,
          transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
        }}>

          {/* Panel 1 — Historical narration */}
          <div style={{ width: "50%", flexShrink: 0, padding: "0 60px 0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p className="stagger-line" style={{ fontFamily: "var(--font-crimson)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-gold)", marginBottom: "24px", animationDelay: "0s" }}>
              1193 — 1203 AD
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
              {lines0.map((line, i) => (
                <p
                  key={`p0-${i}`}
                  className="stagger-line"
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "1.3rem",
                    lineHeight: 1.8,
                    color: "var(--text-primary)",
                    fontStyle: "italic",
                    animationDelay: `${0.1 + i * 0.1}s`,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
            <button
              className="stagger-line"
              onClick={() => goToPanel(1)}
              style={{
                alignSelf: "flex-start",
                padding: "12px 32px",
                border: "1px solid var(--accent-gold)",
                color: "var(--accent-gold-light)",
                background: "transparent",
                fontFamily: "var(--font-crimson)",
                fontSize: "0.9rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                transition: "all 0.3s",
                animationDelay: `${0.1 + lines0.length * 0.1}s`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            >
              Continue →
            </button>
          </div>

          {/* Panel 2 — Aryan's thoughts */}
          <div style={{ width: "50%", flexShrink: 0, padding: "0 60px 0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p
              key={`label-${panelKey}`}
              className="stagger-line"
              style={{ fontFamily: "var(--font-crimson)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-gold)", marginBottom: "24px", animationDelay: "0s" }}
            >
              Aryan, at the Gates of Nalanda
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
              {lines1.map((line, i) => (
                <p
                  key={`p1-${panelKey}-${i}`}
                  className="stagger-line"
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: i === lines1.length - 1 ? "1.6rem" : "1.3rem",
                    lineHeight: 1.8,
                    color: i === lines1.length - 1 ? "var(--accent-gold-light)" : "var(--text-primary)",
                    fontStyle: "italic",
                    fontWeight: i === lines1.length - 1 ? 600 : 400,
                    animationDelay: `${0.1 + i * 0.08}s`,
                  }}
                >
                  &ldquo;{line}&rdquo;
                </p>
              ))}
            </div>
            <div
              key={`btns-${panelKey}`}
              className="stagger-line"
              style={{ display: "flex", gap: "16px", animationDelay: `${0.1 + lines1.length * 0.08}s` }}
            >
              <button
                onClick={() => goToPanel(0)}
                style={{
                  padding: "12px 24px",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-muted)",
                  background: "transparent",
                  fontFamily: "var(--font-crimson)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                ← Back
              </button>
              <button
                onClick={() => router.push("/game")}
                style={{
                  padding: "12px 32px",
                  border: "1px solid var(--accent-gold)",
                  color: "var(--accent-gold-light)",
                  background: "transparent",
                  fontFamily: "var(--font-crimson)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
              >
                Begin the Journey →
              </button>
            </div>
          </div>

        </div>

        {/* Skip button */}
        <button
          onClick={() => router.push("/game")}
          style={{
            position: "absolute", bottom: "28px", right: "60px",
            background: "transparent", border: "none",
            color: "var(--text-muted)", fontFamily: "var(--font-crimson)",
            fontSize: "1.1rem", letterSpacing: "0.1em", cursor: "pointer", transition: "color 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          Skip to World Map →
        </button>

        {/* Panel dots */}
        <div style={{ position: "absolute", bottom: "32px", left: "24px", display: "flex", gap: "8px" }}>
          {[0, 1].map((i) => (
            <div key={i} onClick={() => goToPanel(i)} style={{
              width: i === panel ? "24px" : "8px", height: "8px", borderRadius: "4px",
              backgroundColor: i === panel ? "var(--accent-gold)" : "var(--border-gold)",
              cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Title */}
        <GameTitle style={{ position: "absolute", top: "32px", right: "60px" }} />

      </div>
    </PageShell>
  );
}
