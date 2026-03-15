"use client";

import { useState } from "react";
import Image from "next/image";
import GameTitle from "./GameTitle";
import AboutGameModal from "./AboutGameModal";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/constants/languages";
import type { LocaleCode } from "lingo.dev/spec";
import { useLingoContext } from "@lingo.dev/compiler/react";

interface GameHeaderProps {
  playerName?: string;
  style?: React.CSSProperties;
}

export default function GameHeader({ playerName, style }: GameHeaderProps) {
  const { locale, setLocale } = useLingoContext();
  const [langOpen, setLangOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const selectedLang =
    LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE);

  async function handleSelectLanguage(code: LocaleCode) {
    if (code === locale) {
      setLangOpen(false);
      return;
    }
    await setLocale(code);
    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "28px 48px 0",
        ...style,
      }}
    >
      {/* Left — character + name + language */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <Image src="/aryan.svg" alt="Aryan" width={64} height={102} />
        <div style={{ paddingTop: "6px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {playerName && (
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              Hello,
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {playerName && (
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.1rem",
                color: "var(--accent-gold-light)",
                letterSpacing: "0.08em",
              }}>
                {playerName}
              </p>
            )}

            {/* Language dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
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
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-gold)",
                  minWidth: "120px",
                  zIndex: 100,
                }}>
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
      </div>

      {/* Right — about button + game title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => setAboutOpen(true)}
          style={{
            padding: "8px 18px",
            border: "1px solid var(--border-gold)",
            background: "transparent",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          About Game
        </button>
        <GameTitle />
      </div>

      {aboutOpen && <AboutGameModal onClose={() => setAboutOpen(false)} />}
    </div>
  );
}
