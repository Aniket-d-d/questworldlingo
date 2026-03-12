"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KINGDOMS } from "@/constants/story";
import PageShell from "@/components/ui/PageShell";
import GameHeader from "@/components/ui/GameHeader";
import BackButton from "@/components/ui/BackButton";

interface PlayerState {
  name: string;
  wisdomTokens: number;
  artifacts: string[];
}

const MANUSCRIPT_DETAILS: Record<string, { excerpt: string; significance: string }> = {
  srivijaya: {
    excerpt:
      "\"The monastery at Nalanda receives your gifts with humility. The monks of Srivijaya have kept the flame of the Dharma burning across the seas...\"",
    significance:
      "Proves the direct bond between Srivijaya's royal patronage and Nalanda's golden age.",
  },
  japan: {
    excerpt:
      "\"The ten stages of the mind ascend like the mountain — each peak reveals another beyond it. This is the teaching of Nalanda...\"",
    significance:
      "Kukai's synthesis of Nalanda's esoteric teachings into the Shingon school of Buddhism.",
  },
  korea: {
    excerpt:
      "\"Block 14,372: Thus I have heard. The Tathagata spoke to the assembled monks at Nalanda...\"",
    significance:
      "One of 81,258 woodblocks preserving the entire Buddhist canon — carved to protect it from fire.",
  },
  china: {
    excerpt:
      "\"The resonance tube, suspended in the well, receives the trembling of the earth before the eye can see it...\"",
    significance:
      "Shen Kuo's scientific observations, informed by the analytical tradition that Nalanda exemplified.",
  },
  mongolia: {
    excerpt:
      "\"The sky is round above, the earth is flat below. Between them moves the man on horseback who carries knowledge from place to place...\"",
    significance:
      "The oldest Mongolian literary work — recording how oral tradition preserved what fire could not reach.",
  },
  tibet: {
    excerpt:
      "\"These pages were carried by three monks across the Himalayas. They walked for forty days. Two did not return.\"",
    significance:
      "Nalanda's original manuscripts, copied and smuggled to Lhasa before the final burning.",
  },
};

export default function ChestPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aryansquest_player");
      if (saved) setPlayer(JSON.parse(saved));
      else router.replace("/game");
    } catch {
      router.replace("/game");
    }
  }, [router]);

  if (!player) return null;

  const collectedCount = player.artifacts.length;
  const selectedKingdom = KINGDOMS.find((k) => k.id === selected);
  const selectedDetails = selected ? MANUSCRIPT_DETAILS[selected] : null;
  const isCollected = selected ? player.artifacts.includes(selected) : false;

  return (
    <PageShell style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "unset" }}>
      <GameHeader playerName={player.name} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "16px 48px 32px", gap: "40px" }}>

        {/* ── Left — manuscript list ── */}
        <div style={{ width: "42%", flexShrink: 0, display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-gold)",
              marginBottom: "6px",
            }}>
              The Knowledge Chest
            </p>
            <h2 style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}>
              Recovered Manuscripts
            </h2>
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}>
              {collectedCount} of 6 artifacts recovered
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
            {KINGDOMS.map((k) => (
              <div key={k.id} style={{
                flex: 1, height: "3px",
                backgroundColor: player.artifacts.includes(k.id) ? "var(--accent-gold)" : "var(--border-gold)",
                transition: "background-color 0.4s",
              }} />
            ))}
          </div>

          {/* Manuscript list */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
            {KINGDOMS.map((kingdom) => {
              const collected = player.artifacts.includes(kingdom.id);
              const isActive = selected === kingdom.id;

              return (
                <button
                  key={kingdom.id}
                  onClick={() => setSelected(isActive ? null : kingdom.id)}
                  style={{
                    padding: "16px 20px",
                    border: `1px solid ${isActive ? "var(--accent-gold)" : "var(--border-gold)"}`,
                    background: isActive ? "rgba(201,146,42,0.06)" : "var(--bg-card)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = "var(--accent-gold)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = "var(--border-gold)";
                  }}
                >
                  {/* Status icon */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                    border: `1px solid ${collected ? "var(--accent-gold)" : "var(--border-color)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: collected ? "var(--accent-gold)" : "var(--text-muted)",
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-cinzel)",
                    background: collected ? "rgba(201,146,42,0.08)" : "transparent",
                  }}>
                    {collected ? "✦" : "·"}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-cinzel)",
                      fontSize: "0.75rem",
                      color: collected ? "var(--accent-gold-light)" : "var(--text-muted)",
                      letterSpacing: "0.06em",
                      marginBottom: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {collected ? kingdom.artifact : "???"}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-crimson)",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}>
                      {kingdom.name} · {kingdom.language}
                    </p>
                  </div>

                  {collected && (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.65rem", fontFamily: "var(--font-cinzel)" }}>
                      {isActive ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ width: "1px", backgroundColor: "var(--border-gold)", alignSelf: "stretch", flexShrink: 0 }} />

        {/* ── Right — detail panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingLeft: "8px" }}>

          <BackButton />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {!selected && (
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "2rem",
                color: "var(--border-gold)",
                marginBottom: "16px",
                letterSpacing: "0.1em",
              }}>
                ✦
              </p>
              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}>
                Select a manuscript to read its excerpt
              </p>
            </div>
          )}

          {selected && !isCollected && (
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.5rem",
                color: "var(--text-muted)",
                marginBottom: "16px",
                opacity: 0.4,
              }}>
                🔒
              </p>
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
                Not Yet Recovered
              </p>
              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}>
                Complete {selectedKingdom?.name} to unlock this manuscript.
              </p>
            </div>
          )}

          {selected && isCollected && selectedKingdom && selectedDetails && (
            <div style={{ animation: "panelFadeIn 0.4s ease forwards" }}>

              {/* Manuscript name */}
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent-gold)",
                marginBottom: "8px",
              }}>
                {selectedKingdom.name} · {selectedKingdom.language}
              </p>
              <h3 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "24px",
                lineHeight: 1.4,
              }}>
                {selectedKingdom.artifact}
              </h3>

              {/* Excerpt */}
              <div style={{
                padding: "20px 24px",
                border: "1px solid var(--border-gold)",
                background: "var(--bg-card)",
                marginBottom: "20px",
                position: "relative",
              }}>
                <span style={{
                  position: "absolute",
                  top: "-1px",
                  left: "16px",
                  background: "var(--bg-primary)",
                  padding: "0 8px",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                }}>
                  Excerpt
                </span>
                <p style={{
                  fontFamily: "var(--font-crimson)",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                }}>
                  {selectedDetails.excerpt}
                </p>
              </div>

              {/* Significance */}
              <div style={{
                padding: "16px 20px",
                borderLeft: "2px solid var(--accent-gold)",
                marginBottom: "20px",
              }}>
                <p style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                  marginBottom: "6px",
                }}>
                  Historical Significance
                </p>
                <p style={{
                  fontFamily: "var(--font-crimson)",
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  color: "var(--text-muted)",
                }}>
                  {selectedDetails.significance}
                </p>
              </div>

              {/* Language badge */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{
                  padding: "6px 16px",
                  border: "1px solid var(--border-gold)",
                  background: "var(--bg-card)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <span style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}>
                    Language
                  </span>
                  <span style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.7rem",
                    color: "var(--accent-gold-light)",
                    letterSpacing: "0.06em",
                  }}>
                    {selectedKingdom.language}
                  </span>
                </div>
                <div style={{
                  padding: "6px 16px",
                  border: "1px solid var(--border-gold)",
                  background: "var(--bg-card)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <span style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}>
                    Scholar
                  </span>
                  <span style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.7rem",
                    color: "var(--accent-gold-light)",
                    letterSpacing: "0.06em",
                  }}>
                    {selectedKingdom.scholarName}
                  </span>
                </div>
              </div>

            </div>
          )}

          </div>
        </div>

      </div>

      {/* Wisdom tokens footer */}
      <div style={{
        padding: "12px 48px",
        borderTop: "1px solid var(--border-gold)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}>
        <span style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          Wisdom Tokens Earned
        </span>
        <span style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "0.9rem",
          color: "var(--accent-gold-light)",
          fontWeight: 700,
        }}>
          {player.wisdomTokens}
        </span>
      </div>
    </PageShell>
  );
}
