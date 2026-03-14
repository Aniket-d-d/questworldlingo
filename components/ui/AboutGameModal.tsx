"use client";

import { useState } from "react";
import Image from "next/image";
import { SCHOLAR_CONFIGS } from "@/constants/scholars";

const KINGDOM_ORDER = ["aryan", "srivijaya", "japan", "korea", "china", "tibet"];

const ARTIFACTS: Record<string, string> = {
  srivijaya: "Nalanda-Srivijaya Correspondence",
  japan: "The Lotus Sutra Commentary",
  korea: "Tripitaka Koreana Excerpt",
  china: "Dream Pool Essays",
  tibet: "Nalanda's Original Manuscripts",
};

const KINGDOM_LABELS: Record<string, string> = {
  aryan: "Nalanda, India",
  srivijaya: "Srivijaya Empire",
  japan: "Heian Japan",
  korea: "Goryeo Dynasty",
  china: "Song Dynasty",
  tibet: "Tibetan Empire",
};

const CHARACTER_BIOS: Record<string, string> = {
  aryan:
    "Aryan is a young student who survived the burning of Nalanda University in 1203 AD — one of the greatest acts of destruction in the history of human knowledge. With the library still smouldering behind him, he made a vow: to travel across the known world and recover every fragment of Nalanda's lost wisdom. Armed with nothing but curiosity and resolve, he boards ships, crosses mountain passes, and walks through foreign courts — earning the trust of scholars who have guarded these texts for generations.",
  srivijaya:
    "A senior Buddhist monk and scholar of the Srivijaya Empire, Dharmakirti guards the ancient correspondence exchanged between Nalanda University and King Balaputradeva — the Srivijayan king who once funded an entire monastery at Nalanda. Srivijayan monks studied there for generations, and Dharmakirti carries that legacy with calm authority and deep reverence.",
  japan:
    "A scholar in the tradition of Master Kukai — the legendary monk who brought Nalanda's wisdom from Tang China to the temples of Kyoto. Japanese monks revered Nalanda almost as a holy place, and this guardian of the Lotus Sutra Commentary speaks with Zen-like precision: few words, deep meaning. He values discipline above all.",
  korea:
    "A monk of the Goryeo Dynasty, guardian of an excerpt from the Tripitaka Koreana — 81,258 wooden blocks containing the entire Buddhist canon, much of it tracing back to Nalanda. His order spent 16 years carving this knowledge while the Mongols closed in around them. He speaks with fierce pride and demands that visitors prove themselves worthy of such sacrifice.",
  china:
    "A scholar at the Imperial Academy in Hangzhou, in the spirit of Shen Kuo — scientist, statesman, and author of the Dream Pool Essays. He guards knowledge that connects back to the monk Xuanzang, who walked from China to Nalanda 600 years ago and spent 17 years there before carrying 657 Sanskrit texts home. He speaks with the precision of a scientist and the breadth of an encyclopedist.",
  tibet:
    "The great Tibetan scholar-monk Sakya Pandita, guardian of Nalanda's Original Manuscripts — texts carried by Tibetan monks from Nalanda to Lhasa before the fire consumed everything. Tibet alone preserved Nalanda's soul. He has been waiting, high in the mountains, for someone worthy enough to make the final journey. He speaks with profound compassion and ancient wisdom.",
};

const GAMES: Record<string, string> = {
  srivijaya: "Tile Memory",
  japan: "Kings Placement",
  korea: "Arithmetic Sprint",
  china: "Sudoku",
  tibet: "Island Bridges",
};

interface Props {
  onClose: () => void;
}

export default function AboutGameModal({ onClose }: Props) {
  const [tab, setTab] = useState<"info" | "characters">("info");
  const [selectedKingdom, setSelectedKingdom] = useState<string>("aryan");

  const selected = SCHOLAR_CONFIGS[selectedKingdom] ?? null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "88vh",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-gold)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          borderBottom: "1px solid var(--border-gold)",
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent-gold-light)",
          }}>
            About the Game
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "1.2rem",
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px 8px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-gold-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            ✕
          </button>
        </div>

        {/* Tab toggle */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border-gold)",
          flexShrink: 0,
        }}>
          {(["info", "characters"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "12px 32px",
                background: tab === t ? "var(--accent-gold)" : "transparent",
                color: tab === t ? "var(--bg-primary)" : "var(--text-muted)",
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: tab === t ? 700 : 400,
              }}
            >
              {t === "info" ? "Info" : "Characters"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>

          {/* ── INFO TAB ── */}
          {tab === "info" && (
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>

              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent-gold-light)",
                marginBottom: "20px",
              }}>
                Created for the Lingo.dev Hackathon #3
              </p>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}>
                Quest World Lingo was built as part of Hackathon #3 hosted by{" "}
                <span style={{ color: "var(--accent-gold-light)", fontStyle: "italic" }}>Lingo.dev</span> — a platform that
                makes localizing apps beautifully simple. A huge thank you to the Lingo.dev team for the inspiration and the tools.
              </p>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}>
                The idea behind this game is simple: puzzle games are for everyone — kids, adults, anyone who enjoys a good
                mental challenge. But I wanted to go a step further and weave real history into the gameplay. Every kingdom
                you visit, every scholar you meet, every artifact you collect is rooted in actual historical events from 1203 AD —
                the year Nalanda University was destroyed.
              </p>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}>
                The story follows Aryan, a young student from the ruins of Nalanda, who travels across five kingdoms of
                medieval Asia to recover lost knowledge. Along the way, players solve puzzles, meet historical scholars,
                and piece together a forgotten world.
              </p>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}>
                Each scholar is powered by a live AI — when you choose to speak freely, you are having a real conversation
                with{" "}
                <span style={{ color: "var(--accent-gold-light)", fontStyle: "italic" }}>Google Gemini</span>. The scholar
                reads your tone and attitude to decide the difficulty of your trial — humble and genuine earns an easy game,
                rude or dismissive earns the hardest one. After your level is set, you can keep talking: ask anything about
                the empire, its history, its scholars, or the world of 1203 AD. The scholar will answer in whatever language
                you write in.
              </p>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}>
                If you have a language selected from the dropdown, the scholar's responses are translated in real time using
                the{" "}
                <span style={{ color: "var(--accent-gold-light)", fontStyle: "italic" }}>Lingo.dev Runtime SDK</span> —
                so the conversation stays in your chosen language even when the AI responds. The rest of the game UI is
                translated at build time using the Lingo.dev Compiler.
              </p>

              <div style={{
                borderLeft: "2px solid var(--border-gold)",
                paddingLeft: "20px",
                marginBottom: "20px",
              }}>
                <p style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}>
                  A note on language
                </p>
                <p style={{
                  fontFamily: "var(--font-crimson)",
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                }}>
                  The core gameplay — world map, kingdom cards, puzzle games, and scholar dialogue — is fully available
                  in multiple languages powered by Lingo.dev. The manuscript excerpts and historical significance notes
                  in the Knowledge Chest, as well as this About Game page, are in English only. This was a deliberate
                  technical choice: the game content that players interact with most is translated, while the deeper
                  reference material and meta information were scoped to English to keep the project focused.
                </p>
              </div>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                lineHeight: 1.8,
              }}>
                Five kingdoms. Five games. One purpose. Rebuild Nalanda.
              </p>

            </div>
          )}

          {/* ── CHARACTERS TAB ── */}
          {tab === "characters" && (
            <div>

              {/* Small selector cards */}
              <div style={{
                display: "flex",
                gap: "12px",
                marginBottom: "32px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}>
                {KINGDOM_ORDER.map((kid) => {
                  const isAryan = kid === "aryan";
                  const s = isAryan ? null : SCHOLAR_CONFIGS[kid];
                  const avatarSrc = isAryan ? "/aryan.svg" : (s?.avatarSrc ?? "/aryan.svg");
                  const avatarAlt = isAryan ? "Aryan" : (s?.name ?? kid);
                  const isSelected = selectedKingdom === kid;
                  return (
                    <button
                      key={kid}
                      onClick={() => setSelectedKingdom(kid)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 16px",
                        border: `1px solid ${isSelected ? "var(--accent-gold)" : "var(--border-gold)"}`,
                        background: isSelected ? "var(--bg-secondary)" : "var(--bg-card)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        minWidth: "90px",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = "var(--accent-gold)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = "var(--border-gold)";
                      }}
                    >
                      <Image
                        src={avatarSrc}
                        alt={avatarAlt}
                        width={40}
                        height={64}
                        style={{ objectFit: "contain" }}
                      />
                      <span style={{
                        fontFamily: "var(--font-cinzel)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.1em",
                        color: isSelected ? "var(--accent-gold-light)" : "var(--text-muted)",
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: 1.4,
                        maxWidth: "80px",
                      }}>
                        {isAryan ? "Aryan" : KINGDOM_LABELS[kid]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected character detail */}
              {(() => {
                const isAryan = selectedKingdom === "aryan";
                const avatarSrc = isAryan ? "/aryan.svg" : (selected?.avatarSrc ?? "/aryan.svg");
                const displayName = isAryan ? "Aryan" : selected?.name ?? "";
                const era = isAryan ? "1203 AD" : selected?.era ?? "";
                return (
              <div style={{
                display: "flex",
                gap: "32px",
                alignItems: "flex-start",
                border: "1px solid var(--border-gold)",
                background: "var(--bg-card)",
                padding: "32px",
              }}>
                {/* Left — large image */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  gap: "12px",
                }}>
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    width={100}
                    height={160}
                    style={{ objectFit: "contain" }}
                  />
                  <p style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.12em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}>
                    {era}
                  </p>
                </div>

                {/* Right — profile */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "1.1rem",
                    color: "var(--accent-gold-light)",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}>
                    {displayName}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}>
                    {isAryan ? "Player Character · Nalanda, India" : KINGDOM_LABELS[selectedKingdom]}
                  </p>

                  <p style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--border-gold)",
                    paddingBottom: "16px",
                  }}>
                    {CHARACTER_BIOS[selectedKingdom]}
                  </p>

                  {isAryan ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                          Mission
                        </p>
                        <p style={{ fontFamily: "var(--font-crimson)", fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
                          Recover the lost knowledge of Nalanda from five kingdoms across medieval Asia.
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                          Kingdoms to visit
                        </p>
                        <p style={{ fontFamily: "var(--font-crimson)", fontSize: "1rem", color: "var(--text-secondary)" }}>
                          Srivijaya · Heian Japan · Goryeo Korea · Song China · Tibet
                        </p>
                      </div>
                    </div>
                  ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Guardian of
                      </p>
                      <p style={{ fontFamily: "var(--font-crimson)", fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        {ARTIFACTS[selectedKingdom]}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Their Challenge
                      </p>
                      <p style={{ fontFamily: "var(--font-crimson)", fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
                        &ldquo;{selected?.question}&rdquo;
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Puzzle Game
                      </p>
                      <p style={{ fontFamily: "var(--font-crimson)", fontSize: "1rem", color: "var(--text-secondary)" }}>
                        {GAMES[selectedKingdom]}
                      </p>
                    </div>
                  </div>
                  )}
                </div>
              </div>
                );
              })()}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
