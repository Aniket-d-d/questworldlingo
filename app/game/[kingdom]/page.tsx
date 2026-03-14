"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KINGDOMS } from "@/constants/story";
import { SCHOLAR_CONFIGS } from "@/constants/scholars";
import { PAIRS_BY_VERDICT } from "@/constants/miniGames";
import { Verdict } from "@/types";
import PageShell from "@/components/ui/PageShell";
import GameHeader from "@/components/ui/GameHeader";
import BackButton from "@/components/ui/BackButton";
import { KINGDOM_GAMES } from "@/components/minigames";
import KingdomText from "@/components/game/KingdomText";

interface PageProps {
  params: Promise<{ kingdom: string }>;
}

interface ChatMessage {
  role: "scholar" | "player";
  text: string;
}

// Srivijaya — three choices the player picks from instead of free text
const SRIVIJAYA_CHOICES = [
  {
    level: 1 as const,
    text: "My father was a scholar at Nalanda. I seek to rebuild what he loved — for him, and for the world.",
    scholarResponse: "Your grief is real. Your purpose is clear. The fire that took Nalanda took many fathers, and it is right that a son should answer it with his whole life. I will give you the gentlest trial — prove your memory is worthy of what you carry.",
  },
  {
    level: 2 as const,
    text: "I travel to recover all manuscripts scattered after Nalanda's fall. This correspondence belongs with the rest.",
    scholarResponse: "A collector's purpose — honest, if measured. The correspondence has waited eight years; it can wait a little longer to test you. Show me your memory is equal to the task.",
  },
  {
    level: 3 as const,
    text: "Because I will not stop until Nalanda lives again. Whatever the cost.",
    scholarResponse: "Bold words from someone standing on ash. Your determination is clear — now let us see if your mind matches it. I will give you no mercy in this trial. Prove yourself.",
  },
];

const SRIVIJAYA_BETWEEN_ROUNDS: Record<number, string> = {
  1: "Your memory holds. The pattern remains clear in your mind — as it must. Once more.",
  2: "Again the tiles yield to you. One final trial. Do not let your mind waver now.",
};

const JAPAN_CHOICES = [
  {
    level: 1 as const,
    text: "I know only that Kukai crossed the sea to carry the Dharma back. I am here to honour that journey — and to bring Nalanda's manuscripts home.",
    scholarResponse: "Kukai's crossing was more than a voyage — it was a vow. You speak with the honest quietness of a novice who understands devotion. I will give you a trial fit for a beginning mind. Prove that honesty runs deeper than words.",
  },
  {
    level: 2 as const,
    text: "Kukai brought the esoteric teachings from Tang China, which itself drew from Nalanda. This manuscript sits at that crossing — India, China, Japan, bound by one thread.",
    scholarResponse: "You trace the lineage correctly. Three civilisations, one transmission — and you have followed it. A scholar's answer deserves a scholar's trial. Place your kings with care.",
  },
  {
    level: 3 as const,
    text: "Nalanda's fire did not stop the teachings. They moved through China, crossed the sea, and reached these islands. I will recover every surviving text — whatever the difficulty.",
    scholarResponse: "Determination alone does not illuminate a sutra. Let us see if your mind is as relentless as your will. I will give you no easy ground. Prove yourself on the hardest board.",
  },
];

const JAPAN_BETWEEN_ROUNDS: Record<number, string> = {
  1: "The board yields to you. Stillness and precision — Kukai would recognise both. Once more.",
  2: "Again the regions fall into order. One final trial. Do not let your focus break now.",
};

const KOREA_CHOICES = [
  {
    level: 1 as const,
    text: "Because Nalanda's wisdom lives in those blocks as much as in any Indian text. I am here to carry it home, not to claim it as mine.",
    scholarResponse: "Humility noted. I will give you sixty seconds — enough time for a careful mind. Three levels of arithmetic, each harder than the last. Begin when you are ready.",
  },
  {
    level: 2 as const,
    text: "Because preservation is only half the work. The other half is transmission. You carved so knowledge would not die — I am here to ensure it continues to travel.",
    scholarResponse: "A reasoned answer. Forty-five seconds. A scribe who copies without haste still copies precisely. Prove that your mind moves with equal care under pressure.",
  },
  {
    level: 3 as const,
    text: "Because I will not stop until every surviving text from Nalanda's lineage is gathered. This excerpt belongs in that gathering — and nothing will deter me.",
    scholarResponse: "Then you will not mind thirty seconds. We carved eighty-one thousand blocks under Mongol threat. You will solve three levels of arithmetic under time. Show me your resolve.",
  },
];

const CHINA_CHOICES = [
  {
    level: 1 as const,
    text: "Shen Kuo preserved these observations so others could build upon them. I come in that spirit — to collect, not to claim, and to carry the knowledge forward.",
    scholarResponse: "Humility is the beginning of scholarship. Shen Kuo himself would have approved of that answer. I will give you the gentlest grid — prove your mind is as ordered as your intention.",
  },
  {
    level: 2 as const,
    text: "The Dream Pool Essays survived because Shen Kuo understood that knowledge must be recorded in order to travel. I am here to continue that journey.",
    scholarResponse: "A scholar's answer. You understand the chain of transmission — India to Xuanzang, Xuanzang to Tang China, Tang to Song. Fit for a reasoned trial. Show me your precision.",
  },
  {
    level: 3 as const,
    text: "Xuanzang walked seventeen years for these texts. I will not stop until every surviving manuscript from Nalanda's lineage is gathered. Nothing will deter me.",
    scholarResponse: "Resolve is easy to claim. The hardest grid will reveal whether yours is genuine. I will give you no quarter. Prove yourself worthy of Xuanzang's example.",
  },
];

const CHINA_BETWEEN_ROUNDS: Record<number, string> = {
  1: "The grid yields to a clear mind. Shen Kuo recorded ten thousand observations with that same patience. Once more.",
  2: "Again the numbers settle into their proper place. One final trial. Do not let precision falter now.",
};

// Lookup maps for kingdoms that use the choice system
const KINGDOM_CHOICES: Record<string, typeof SRIVIJAYA_CHOICES> = {
  srivijaya: SRIVIJAYA_CHOICES,
  japan: JAPAN_CHOICES,
  korea: KOREA_CHOICES,
  china: CHINA_CHOICES,
};
// Only kingdoms that play multiple rounds (not Korea — Korea uses time pressure instead)
const KINGDOM_BETWEEN_ROUNDS: Record<string, Record<number, string>> = {
  srivijaya: SRIVIJAYA_BETWEEN_ROUNDS,
  japan: JAPAN_BETWEEN_ROUNDS,
  china: CHINA_BETWEEN_ROUNDS,
};

// Scholar's judgment after the player's first answer
const JUDGMENT_RESPONSES: Record<string, string> = {
  srivijaya: "Your words carry the weight of genuine purpose. The fire that consumed Nalanda was not merely physical — it extinguished the light of a thousand scholars. I see in you the ember that remains. Ask me anything while you prove yourself.",
  japan:     "Stillness before the answer reveals more than the answer itself. You have considered carefully. The Dharma crossed vast seas to reach us. Speak freely — I am listening.",
  korea:     "We carved for sixteen years so that knowledge would not die. Your answer honours that work. I will remain here as long as you have questions.",
  china:     "Xuanzang walked barefoot through deserts for seventeen years. Knowledge demands that price. You understand this. What more would you know?",
  tibet:     "We have kept these manuscripts for forty years, waiting for someone worthy. Your words suggest you may be that person. Ask what you wish.",
};

// Rotating free-chat responses (cycles round-robin)
const FREE_CHAT_RESPONSES: Record<string, string[]> = {
  srivijaya: [
    "The sea routes between Srivijaya and Nalanda carried more than spices — they carried entire lineages of thought.",
    "King Balaputradeva did not fund Nalanda out of charity. He knew that a kingdom's greatness is measured by what it preserves.",
    "The monks who returned from Nalanda were changed — not merely learned, but transformed. That is what a true university does.",
    "You remind me of a young novice I once taught. He asked too many questions as well. He became our greatest scholar.",
  ],
  japan: [
    "Kukai did not bring the Dharma to Japan. He brought the living method of inquiry. There is a difference.",
    "We say here: the brush does not lie. Whatever you write reveals the state of your mind. What does your quest reveal about yours?",
    "The mountains around Koya-san hold silence the way Nalanda held knowledge — completely, without reservation.",
    "Every copy of a text is an act of devotion. The copyist who does not understand that is merely a machine.",
  ],
  korea: [
    "Eighty-one thousand, two hundred and fifty-eight wooden blocks. Each one carved twice — once in faith, once in precision.",
    "The Mongols came with fire. We had already anticipated them. Knowledge carved in wood is harder to burn than knowledge written on paper.",
    "Uicheon travelled to China and returned with five thousand texts. I have read every one. Have you read even one with full attention?",
    "The act of carving slows the mind into true understanding. There is a reason we did not simply copy by hand.",
  ],
  china: [
    "Shen Kuo observed the magnetic compass, the camera obscura, the printed book — and still said the greatest invention was curiosity itself.",
    "The Dream Pool Essays was written not to impress scholars but to preserve observations that might otherwise be forgotten. That is its true purpose.",
    "Xuanzang's journey was seventeen years. Yours need not be so long — but it must be just as deliberate.",
    "We have a saying: a single drop of ink can set a thousand people thinking. The manuscripts of Nalanda were an ocean.",
  ],
  tibet: [
    "When the smoke rose above Nalanda, we had already received word. The texts arrived here before the ash had settled.",
    "Sakya Pandita said: a text that is not read is already half destroyed. We do not merely preserve — we study, every day.",
    "The mountains are not obstacles. They are a filter. Only those who truly need the knowledge climb them.",
    "We have texts here that exist nowhere else on earth. That knowledge will not be lost again. Not while we draw breath.",
  ],
};

// Scholar's message when the player completes the game
const GAME_COMPLETE_RESPONSES: Record<string, string> = {
  srivijaya: "You have proven your memory runs as deep as your purpose. Those tiles — that is the same discipline a scribe uses to memorise nine million manuscripts. I am satisfied. The Nalanda-Srivijaya Correspondence is yours. Collect it from before you.",
  japan:     "The patterns you recalled — that is the same mind that transcribes a sutra without a single error across five hundred pages. You have earned the Lotus Sutra Commentary. It awaits you.",
  korea:     "Precision and memory. You have both. The Tripitaka Koreana Excerpt recognises you as worthy. Take it — it has waited long enough.",
  china:     "Shen Kuo would have approved. You observed, you remembered, you reproduced. The Dream Pool Essays belongs with you now. Claim it.",
  tibet:     "The monks who carried these texts across the Himalayas had minds exactly like yours — precise, fearless, devoted. Take Nalanda's Original Manuscripts. You have earned them.",
};

type ChatPhase = "question" | "free_chat";

export default function KingdomPage({ params }: PageProps) {
  const { kingdom: kingdomSlug } = use(params);
  const router = useRouter();

  const kingdom = KINGDOMS.find((k) => k.id === kingdomSlug);
  const config = SCHOLAR_CONFIGS[kingdomSlug];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("question");
  const [freeChatTurn, setFreeChatTurn] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [artifactCollected, setArtifactCollected] = useState(false);
  const [verdict] = useState<Verdict>("WORTHY");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [playerName, setPlayerName] = useState("");

  // Choice-gated difficulty + 3-round tracking (Srivijaya & Japan)
  const [chosenDifficulty, setChosenDifficulty] = useState<1 | 2 | 3 | null>(null);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const TOTAL_ROUNDS = 3;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("aryansquest_player") ?? "{}");
      setPlayerName(saved?.name ?? "");
    } catch {
      setPlayerName("");
    }
  }, []);

  useEffect(() => {
    if (!kingdom) router.replace("/game");
  }, [kingdom, router]);

  useEffect(() => {
    if (config) {
      setTimeout(() => {
        setMessages([{ role: "scholar", text: config.question }]);
      }, 600);
    }
  }, [config]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (!kingdom || !config) return null;

  const pairCount = PAIRS_BY_VERDICT[verdict] ?? 4;
  const KingdomGame = KINGDOM_GAMES[kingdomSlug] ?? null;
  const avatarFrame = config.avatarFrame ?? "boxed";
  const avatarBorder =
    avatarFrame === "boxed" ? "1px solid var(--border-gold)" : "none";
  const avatarBackground =
    avatarFrame === "boxed" ? "var(--bg-card)" : "transparent";

  function addScholarMessage(text: string, onDone?: () => void) {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "scholar", text }]);
      setTyping(false);
      onDone?.();
    }, 1500);
  }

  function handleSend() {
    if (!input.trim() || typing) return;

    const playerMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "player", text: playerMsg }]);

    if (chatPhase === "question") {
      addScholarMessage(
        JUDGMENT_RESPONSES[kingdomSlug] ?? "Your words are heard. Speak freely.",
        () => setChatPhase("free_chat"),
      );
    } else {
      // Free chat — cycle through responses
      const pool = FREE_CHAT_RESPONSES[kingdomSlug] ?? ["I am listening."];
      const reply = pool[freeChatTurn % pool.length];
      setFreeChatTurn((t) => t + 1);
      addScholarMessage(reply);
    }
  }

  function handleGameComplete(score: number, _total: number) {
    // Choice-gated kingdoms: play 3 rounds before completing
    const betweenRounds = KINGDOM_BETWEEN_ROUNDS[kingdomSlug];
    if (betweenRounds && chosenDifficulty !== null) {
      const nextRound = roundsCompleted + 1;
      if (nextRound < TOTAL_ROUNDS) {
        setRoundsCompleted(nextRound);
        setGameKey((k) => k + 1);
        addScholarMessage(betweenRounds[nextRound] ?? "Once more.");
        return;
      }
    }

    setGameComplete(true);

    // Save progress and tokens (artifact saved on explicit Collect)
    try {
      const saved = JSON.parse(localStorage.getItem("aryansquest_player") ?? "{}");
      if (saved.progress) {
        saved.progress[kingdomSlug] = "completed";
        saved.wisdomTokens = (saved.wisdomTokens ?? 0) + score;
        localStorage.setItem("aryansquest_player", JSON.stringify(saved));
      }
    } catch { /* ignore */ }

    // Scholar appreciates in chat
    setTimeout(() => {
      addScholarMessage(
        GAME_COMPLETE_RESPONSES[kingdomSlug] ?? "You have proven yourself worthy. Collect your manuscript.",
      );
    }, 600);
  }

  function handleCollect() {
    try {
      const saved = JSON.parse(localStorage.getItem("aryansquest_player") ?? "{}");
      if (!saved.artifacts) saved.artifacts = [];
      if (!saved.progress) saved.progress = {};

      if (!saved.artifacts.includes(kingdomSlug)) saved.artifacts.push(kingdomSlug);

      // Unlock next kingdom in sequence after collecting the artifact
      const currentIndex = KINGDOMS.findIndex((k) => k.id === kingdomSlug);
      if (currentIndex >= 0 && currentIndex < KINGDOMS.length - 1) {
        const nextId = KINGDOMS[currentIndex + 1].id;
        if (saved.progress[nextId] === "locked" || !saved.progress[nextId]) {
          saved.progress[nextId] = "available";
        }
      }
      localStorage.setItem("aryansquest_player", JSON.stringify(saved));
    } catch { /* ignore */ }

    setArtifactCollected(true);
    setTimeout(() => router.push("/game"), 1800);
  }

  return (
    <PageShell style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "unset" }}>
      <GameHeader playerName={playerName} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "16px 32px 24px", gap: "0" }}>

        {/* ── Left — Scholar chat ── */}
        <div style={{ width: "38%", flexShrink: 0, display: "flex", flexDirection: "column", paddingRight: "32px", paddingBottom: "100px", borderRight: "1px solid var(--border-gold)" }}>

          {/* Scholar identity */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-gold)",
              marginBottom: "4px",
            }}>
              <KingdomText id={kingdom.id} field="name" /> · Scholar Guardian
            </p>
            <h2 style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}>
              {config.name}
            </h2>
            <p style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "2px",
            }}>
              <KingdomText id={kingdom.id} field="location" /> · {config.era}
            </p>
          </div>

          {/* Scholar avatar */}
          <div style={{
            width: `${config.avatarBoxSize ?? 64}px`,
            height: `${config.avatarBoxSize ?? 64}px`,
            border: avatarBorder,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
            background: avatarBackground,
          }}>
            {config.avatarSrc ? (
              <Image
                src={config.avatarSrc}
                alt={config.name}
                width={config.avatarSize ?? 48}
                height={config.avatarSize ?? 48}
                style={{ objectFit: "contain" }}
                priority
              />
            ) : (
              <span style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.6rem",
                color: "var(--accent-gold)",
                opacity: 0.7,
              }}>
                {config.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Chat messages (excluded from translation for now) */}
          <div data-lingo-skip style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px", marginBottom: "14px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "player" ? "flex-end" : "flex-start",
                gap: "3px",
              }}>
                <p style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>
                  {msg.role === "scholar" ? config.name.split(" ")[0] : "Aryan"}
                </p>
                <div style={{
                  maxWidth: "92%",
                  padding: "10px 14px",
                  border: `1px solid ${msg.role === "scholar" ? "var(--border-gold)" : "var(--border-color)"}`,
                  background: msg.role === "scholar" ? "var(--bg-card)" : "var(--bg-secondary)",
                  borderRadius: msg.role === "scholar" ? "0 8px 8px 8px" : "8px 0 8px 8px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    color: msg.role === "scholar" ? "var(--text-primary)" : "var(--text-secondary)",
                    fontStyle: msg.role === "scholar" ? "italic" : "normal",
                  }}>
                    {msg.role === "scholar" ? `"${msg.text}"` : msg.text}
                  </p>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {config.name.split(" ")[0]}
                </p>
                <div style={{ padding: "10px 14px", border: "1px solid var(--border-gold)", background: "var(--bg-card)", borderRadius: "0 8px 8px 8px", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      backgroundColor: "var(--text-muted)",
                      animation: `flicker 1s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input — choice buttons for choice-gated kingdoms, free text otherwise */}
          {!artifactCollected ? (
            KINGDOM_CHOICES[kingdomSlug] && chatPhase === "question" && chosenDifficulty === null ? (
              // Three choice buttons
              <div data-lingo-skip style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {KINGDOM_CHOICES[kingdomSlug].map((choice) => (
                  <button
                    key={choice.level}
                    disabled={typing}
                    onClick={() => {
                      if (typing) return;
                      setChosenDifficulty(choice.level);
                      setMessages((m) => [...m, { role: "player", text: choice.text }]);
                      addScholarMessage(choice.scholarResponse, () => setChatPhase("free_chat"));
                    }}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      border: "1px solid var(--border-gold)",
                      background: "var(--bg-card)",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-crimson)",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      cursor: typing ? "not-allowed" : "pointer",
                      opacity: typing ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { if (!typing) { e.currentTarget.style.borderColor = "var(--accent-gold)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <form data-lingo-skip onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={chatPhase === "question" ? "Answer the scholar..." : "Ask the scholar anything..."}
                  rows={3}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-gold)",
                    color: "var(--text-primary)",
                    padding: "10px 14px",
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.95rem",
                    resize: "none",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-gold)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-gold)"; }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  style={{
                    padding: "10px",
                    border: "1px solid var(--accent-gold)",
                    background: "transparent",
                    color: "var(--accent-gold-light)",
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                    opacity: input.trim() && !typing ? 1 : 0.5,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (input.trim() && !typing) { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
                >
                  Speak →
                </button>
              </form>
            )
          ) : (
            <p data-lingo-skip style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
              textAlign: "center",
              textTransform: "uppercase",
            }}>
              Returning to World Map...
            </p>
          )}
        </div>

        {/* ── Right — Game or Artifact ── */}
        <div style={{ flex: 1, paddingLeft: "40px", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <BackButton />

          {!gameComplete ? (
            // Locked until player picks a choice (for choice-gated kingdoms)
            KINGDOM_CHOICES[kingdomSlug] && chosenDifficulty === null ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px" }}>
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "1.6rem", color: "var(--border-gold)" }}>⊘</p>
                <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center" }}>
                  The Trial Awaits
                </p>
                <p style={{ fontFamily: "var(--font-crimson)", fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", maxWidth: "280px" }}>
                  Answer {config.name.split(" ")[0]}&apos;s question to unlock your trial.
                </p>
              </div>
            ) : KingdomGame ? (
              <>
                {/* Round counter for multi-round kingdoms (not Korea) */}
                {KINGDOM_BETWEEN_ROUNDS[kingdomSlug] && chosenDifficulty !== null && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-gold)" }}>
                      Round {roundsCompleted + 1} of {TOTAL_ROUNDS}
                    </p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                        <div key={i} style={{
                          width: "20px", height: "4px", borderRadius: "2px",
                          backgroundColor: i < roundsCompleted ? "var(--accent-gold)" : i === roundsCompleted ? "var(--accent-gold-light)" : "var(--border-gold)",
                          transition: "background-color 0.4s",
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <KingdomGame
                  key={gameKey}
                  pairCount={pairCount}
                  {...(KINGDOM_CHOICES[kingdomSlug] && chosenDifficulty !== null ? {
                    difficulty: chosenDifficulty,
                    ...(KINGDOM_BETWEEN_ROUNDS[kingdomSlug] ? { currentRound: roundsCompleted + 1, totalRounds: TOTAL_ROUNDS } : {}),
                  } : {})}
                  onComplete={handleGameComplete}
                />
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <p style={{ fontFamily: "var(--font-crimson)", color: "var(--text-muted)", fontStyle: "italic" }}>
                  No challenge data available.
                </p>
              </div>
            )
          ) : (
            // Artifact panel
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animation: "panelFadeIn 0.6s ease forwards",
            }}>
              {/* Decorative glyph */}
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "2.5rem",
                color: "var(--accent-gold)",
                opacity: 0.5,
                marginBottom: "24px",
                letterSpacing: "0.1em",
              }}>
                ✦
              </p>

              {/* Labels */}
              <p style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--accent-gold)",
                marginBottom: "10px",
              }}>
                Manuscript Recovered
              </p>

              {/* Artifact name */}
              <h3 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                lineHeight: 1.4,
                marginBottom: "8px",
                maxWidth: "340px",
              }}>
                <KingdomText id={kingdom.id} field="artifact" />
              </h3>

              <p style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
                marginBottom: "32px",
              }}>
                <KingdomText id={kingdom.id} field="name" /> · <KingdomText id={kingdom.id} field="language" />
              </p>

              {/* Collect button */}
              {!artifactCollected ? (
                <button
                  onClick={handleCollect}
                  style={{
                    padding: "14px 40px",
                    border: "1px solid var(--accent-gold)",
                    background: "transparent",
                    color: "var(--accent-gold-light)",
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-gold)"; e.currentTarget.style.color = "var(--bg-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent-gold-light)"; }}
                >
                  Collect Manuscript →
                </button>
              ) : (
                <p style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "0.75rem",
                  color: "var(--accent-gold)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  animation: "panelFadeIn 0.4s ease forwards",
                }}>
                  ✦ Added to Knowledge Chest
                </p>
              )}
            </div>
          )}

        </div>

      </div>
    </PageShell>
  );
}
