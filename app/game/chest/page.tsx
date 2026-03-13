"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KINGDOMS } from "@/constants/story";
import PageShell from "@/components/ui/PageShell";
import GameHeader from "@/components/ui/GameHeader";
import BackButton from "@/components/ui/BackButton";
import KingdomText from "@/components/game/KingdomText";

interface PlayerState {
  name: string;
  wisdomTokens: number;
  artifacts: string[];
}

const manuscriptDetails: Record<string, { excerpt: string; significance: string }> = {
  srivijaya: {
    excerpt: `”At the request of His Majesty the Maharaja Balaputradeva, lord of Suvarnadvipa, King Devapala of the Pala Empire has granted five villages in the district of Rajagriha for the perpetual upkeep of the monastery at Nalanda. The monks of Srivijaya have studied at Nalanda for three generations, learning the Vajrayana doctrines of emptiness and dependent origination as expounded by the great masters of this house. The monk Yijing of China, who spent ten years in Palembang, wrote that he found there more than a thousand monks who followed the same rules and methods as Nalanda itself. The teaching of Nagarjuna lives here still: that all phenomena arise not from self-nature but from the web of conditions. This wisdom, born at Nalanda, traveled south across the Bay of Bengal, and in Srivijaya became the foundation upon which a thousand scholars now build their understanding.”`,
    significance: `The Nalanda Copper Plate Grant of Devapala (860 CE), discovered at Nalanda in 1921, is the only known royal inscription recording a foreign king — Balaputradeva of Srivijaya — funding a monastery at Nalanda. The Chinese pilgrim Yijing praised Srivijaya’s scholarship so highly that he advised all monks traveling to Nalanda to study there first. This correspondence is the documentary proof of Nalanda’s reach across the maritime Silk Road.`,
  },
  japan: {
    excerpt: `”What is enlightenment? It is to know one’s own mind as it truly is. The infant’s mind knows not good from evil — this is the first stage. The mind that reaches toward virtue is the second. But the tenth and highest stage is this: to recognise that the ground of all mind and all phenomena is the great Body-Mind of the universe — the Dharmakaya Mahavairocana. Nalanda transmitted not doctrine alone. It transmitted the direct pointing at this: your own mind, in its fountainhead, is already the Buddha. Kukai carried this across ten thousand li of sea and mountain, and planted it here in Japan so it would not be lost.”`,
    significance: `Kukai (Kobo Daishi, 774-835) studied Sanskrit under Prajna, a Nalanda-trained scholar, and received the esoteric transmission from Huiguo — the lineage of Nalanda’s Vajrayana tradition. His Jujushinron (Ten Stages of the Mind, 830 CE) is the culminating philosophical statement of Japanese Buddhism, grounding the Shingon school in the Mahavairocana Sutra. It remains the most systematic Buddhist philosophical work Japan has produced.`,
  },
  korea: {
    excerpt: `”Thus have I heard. At one time the Buddha was in the land of the Magadha states, in a place of initial enlightenment, just having realised the way of complete, unsurpassed awakening. The ground was adamantine, adorned with arrays of wish-fulfilling gems — lotus flowers springing up everywhere, completely covering the world. The Enlightenment Tree was tall and imposing. Under it the Bodhisattvas had gathered like clouds, each having come from distant lands to be present at this moment. Consider: if all things are mutually arising, and if each thing contains the reflection of all others — as a jewel reflects every jewel in Indra’s Net — then the destruction of any one thing diminishes the whole universe. This is why we carve.”`,
    significance: `The Tripitaka Koreana is the most complete and textually accurate collection of the Buddhist canon in existence — 81,258 woodblocks, 52 million carved characters. Monk Uicheon (1055-1101) spent decades collecting Buddhist texts from across Asia, many ultimately tracing back to Nalanda’s libraries. The opening passage here is from the Avatamsaka Sutra (Flower Garland Sutra), the first and most revered text in the collection, teaching the doctrine of Indra’s Net — the infinite interdependence of all phenomena.`,
  },
  china: {
    excerpt: `”The monk Xuanzang walked from this land to Nalanda and returned with six hundred and fifty-seven texts. Among them was the Yogacarabhumi — the Stages of Yogic Practice — which Silabhadra of Nalanda taught him across fifteen months of daily instruction. The great Abbot was one hundred years old. Xuanzang was thirty. What Nalanda gave him was not merely religion but method: observe without assumption, reason without bias, record with precision. I have followed this method. I find that the needle, suspended on thread, does not point true south — it inclines slightly east. The earth itself has a declination that no ancient text recorded. What Nalanda knew was that the world yields its secrets only to those who look at it directly.”`,
    significance: `Shen Kuo’s Mengxi Bitan (Dream Pool Essays, 1088 CE) is the world’s first encyclopaedia of natural science — recording the magnetic compass, magnetic declination, fossil theory, movable-type printing, and pharmaceutical botany. Xuanzang’s monumental translation of 657 Nalanda texts into Chinese established the intellectual tradition of rigorous inquiry that defined Song Dynasty scholarship. Shen Kuo explicitly credits the analytical frameworks of Buddhist logic — refined at Nalanda — as foundational to his scientific method.`,
  },
  tibet: {
    excerpt: `”These pages came to us before the smoke was visible on the horizon. Three monks carried them across the Himalayas — texts from Nagarjuna, from Dharmakirti, from Asanga. Nagarjuna taught: nothing exists from its own side. All things are empty of inherent existence — what a thing is depends entirely on what knows it. Asanga taught: the storehouse consciousness holds the seeds of all experience, and liberation is the recognition of what was always already free. Nalanda knew this most deeply of all institutions the world has ever built. Nine million manuscripts. Three months of burning. And yet — what cannot be burned is here. The lineage is unbroken. We have been waiting forty years for someone to come and carry it forward.”`,
    significance: `When Bakhtiyar Khilji burned Nalanda in 1193 CE, the library burned for three months — nine million manuscripts. Tibetan monks had been collecting and translating Nalanda texts for four centuries. The Tengyur (Commentaries) preserves the complete works of Nalanda’s greatest masters: Nagarjuna, Asanga, Vasubandhu, Dharmakirti, Chandrakirti, Shantideva, and Atisha. Sakya Pandita (1182-1251), guardian of these texts in 1203 CE, was fluent in Sanskrit, mastered all five great sciences, and was considered the last direct heir of the Nalanda philosophical tradition.`,
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
  const selectedDetails = selected ? manuscriptDetails[selected] : null;
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
              {collectedCount} of {KINGDOMS.length} artifacts recovered
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
                      {collected ? <KingdomText id={kingdom.id} field="artifact" /> : "???"}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-crimson)",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}>
                      <KingdomText id={kingdom.id} field="name" /> · <KingdomText id={kingdom.id} field="language" />
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
                <KingdomText id={selectedKingdom.id} field="name" /> · <KingdomText id={selectedKingdom.id} field="language" />
              </p>
              <h3 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "24px",
                lineHeight: 1.4,
              }}>
                <KingdomText id={selectedKingdom.id} field="artifact" />
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
                <p data-lingo-skip style={{
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
                <p data-lingo-skip style={{
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
                    <KingdomText id={selectedKingdom.id} field="language" />
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
                    <KingdomText id={selectedKingdom.id} field="scholarName" />
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
