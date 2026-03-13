"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import GameTitle from "@/components/ui/GameTitle";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/constants/languages";
import type { LocaleCode } from "lingo.dev/spec";
import { useLingoContext } from "@lingo.dev/compiler/react";

export default function OpeningScene() {
  const router = useRouter();
  const [panel, setPanel] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const { locale, setLocale } = useLingoContext();
  const [langOpen, setLangOpen] = useState(false);

  function goToPanel(n: number) {
    setPanel(n);
    setPanelKey((k) => k + 1);
  }

  const lines0 = [
    <>1193 AD. Foreign invaders sweep through northern India.</>,
    <>Nalanda — the greatest university the world had ever seen — is set on fire.</>,
    <>Nine million manuscripts. Ten thousand students. Two thousand teachers.</>,
    <>The fire burns for three months.</>,
    <>Every book, every scroll, every word of human knowledge — reduced to ash.</>,
    <>The world does not yet know what it has lost.</>,
  ];

  const lines1 = [
    <>My father described Nalanda like a second sky — so vast, so full of light.</>,
    <>He said walking its corridors felt like touching everything humanity had ever known.</>,
    <>Then the news reached our village. Foreign invaders. Fire. No survivors.</>,
    <>My father was one of the scholars who could not escape.</>,
    <>I left home the same day the news arrived.</>,
    <>Months later, I arrived at the gates. Nothing remained but ash and silence.</>,
    <>Nine million manuscripts. Gone. Every word my father ever read — gone.</>,
    <>But knowledge does not vanish. It moves. It hides. It waits.</>,
    <>Then it's my mission now — to gather what was lost, and rebuild Nalanda. For my father.</>,
  ];

  const selectedLang =
    LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE);

  async function handleSelectLanguage(code: LocaleCode) {
    if (code === locale) {
      setLangOpen(false);
      return;
    }
    await setLocale(code);
    setLangOpen(false);
  }

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

        {/* Title + language */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <GameTitle />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-gold-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              {selectedLang?.label ?? "English"}
              <span style={{ fontSize: "0.6rem" }}>{langOpen ? "▲" : "▼"}</span>
            </button>

            {langOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-gold)",
                  minWidth: "140px",
                  zIndex: 100,
                }}
              >
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    style={{
                      padding: "8px 14px",
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                      color: lang.code === selectedLang?.code ? "var(--accent-gold-light)" : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: lang.code === selectedLang?.code ? "var(--bg-secondary)" : "transparent",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = lang.code === selectedLang?.code ? "var(--bg-secondary)" : "transparent";
                      e.currentTarget.style.color = lang.code === selectedLang?.code ? "var(--accent-gold-light)" : "var(--text-muted)";
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
