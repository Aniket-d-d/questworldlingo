"use client";

import { useState } from "react";
import Image from "next/image";
import GameTitle from "@/components/ui/GameTitle";
import PageShell from "@/components/ui/PageShell";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/constants/languages";
import type { LocaleCode } from "lingo.dev/spec";
import { useLingoContext } from "@lingo.dev/compiler/react";

interface PlayerSetupProps {
  onComplete: (name: string) => void;
}

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<"empty" | "too_long" | null>(null);
  const { locale, setLocale } = useLingoContext();
  const [langOpen, setLangOpen] = useState(false);

  const selectedLang =
    LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE);

  async function handleSelectLanguage(code: LocaleCode) {
    if (code === locale) { setLangOpen(false); return; }
    await setLocale(code);
    window.location.reload();
  }

  const ERROR_MESSAGES = {
    empty: <>Please enter your name.</>,
    too_long: <>Name must be 30 characters or less.</>,
  } as const;

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("empty");
      return;
    }
    if (trimmed.length > 30) {
      setError("too_long");
      return;
    }
    onComplete(trimmed);
  }

  return (
    <PageShell style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "28px 48px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <GameTitle />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0", border: "none", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-cinzel)", fontSize: "0.7rem", letterSpacing: "0.1em", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-gold-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              {selectedLang?.label ?? "English"}
              <span style={{ fontSize: "0.6rem" }}>{langOpen ? "▲" : "▼"}</span>
            </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "var(--bg-card)", border: "1px solid var(--border-gold)", minWidth: "140px", zIndex: 100 }}>
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    style={{ padding: "8px 14px", fontFamily: "var(--font-cinzel)", fontSize: "0.7rem", letterSpacing: "0.08em", color: lang.code === selectedLang?.code ? "var(--accent-gold-light)" : "var(--text-muted)", cursor: "pointer", transition: "all 0.2s", backgroundColor: lang.code === selectedLang?.code ? "var(--bg-secondary)" : "transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-secondary)"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = lang.code === selectedLang?.code ? "var(--bg-secondary)" : "transparent"; e.currentTarget.style.color = lang.code === selectedLang?.code ? "var(--accent-gold-light)" : "var(--text-muted)"; }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
                setError(null);
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
                {ERROR_MESSAGES[error]}
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
