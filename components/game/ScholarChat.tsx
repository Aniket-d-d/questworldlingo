"use client";

import { useState } from "react";
import { Kingdom, Verdict } from "@/types";
import { SCHOLAR_CONFIGS } from "@/constants/scholars";
import KingdomText from "./KingdomText";

interface ScholarChatProps {
  kingdom: Kingdom;
  onComplete: (verdict: Verdict) => void;
}

type ChatPhase = "question" | "typing" | "responding" | "done";

const MOCK_RESPONSES: Record<string, string> = {
  srivijaya:
    "Your words carry the weight of genuine purpose. The fire that consumed Nalanda was not merely physical — it extinguished the light of a thousand scholars. I see in you the ember that remains. The Correspondence shall travel with you.",
  japan:
    "Stillness before the answer reveals more than the answer itself. You have considered carefully. Kukai brought the Dharma here across vast seas. Perhaps you carry it back across the same waters.",
  korea:
    "We carved for sixteen years so that knowledge would not die. Your answer honours that work. The excerpt is yours — guard it with the same devotion.",
  china:
    "Xuanzang walked barefoot through deserts for seventeen years. Knowledge demands that price. You have shown you understand this. Take the Dream Pool Essays. Add its waters to Nalanda's well.",
  tibet:
    "We have kept these manuscripts for forty years, waiting for this moment. Waiting for you. Nalanda's soul never died — it waited here, in the cold and the silence, for someone who still mourned it. Take it home.",
};

export default function ScholarChat({ kingdom, onComplete }: ScholarChatProps) {
  const config = SCHOLAR_CONFIGS[kingdom.id];
  const [phase, setPhase] = useState<ChatPhase>("question");
  const [playerMessage, setPlayerMessage] = useState("");
  const [scholarResponse, setScholarResponse] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!playerMessage.trim()) {
      setError("Write your answer before submitting.");
      return;
    }
    setError("");
    setPhase("typing");

    // Simulate API delay — will be replaced with real Claude call
    setTimeout(() => {
      setScholarResponse(MOCK_RESPONSES[kingdom.id] ?? "Your words are heard.");
      setPhase("responding");
    }, 1500);
  }

  function handleContinue() {
    setPhase("done");
    // Mock verdict — will come from Claude API later
    onComplete("WORTHY");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-6">
        {/* Scholar header */}
        <div className="text-center mb-8">
          <p
            className="text-[var(--accent-gold)] text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <KingdomText id={kingdom.id} field="name" /> · Scholar Guardian
          </p>
          <h2
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {config?.name ?? "The Scholar"}
          </h2>
        </div>

        {/* Chat container */}
        <div className="border border-[var(--border-gold)] bg-[var(--bg-card)] p-6 space-y-6">
          {/* Scholar's question */}
          <div className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] mt-2 flex-shrink-0" />
            <div>
              <p
                className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {config?.name ?? "Scholar"}
              </p>
              <p
                className="text-[var(--text-primary)] text-lg leading-relaxed italic"
                style={{ fontFamily: "var(--font-crimson)" }}
              >
                &ldquo;{config?.question ?? "Speak, traveller."}&rdquo;
              </p>
            </div>
          </div>

          {/* Player message (shown after submit) */}
          {(phase === "typing" || phase === "responding" || phase === "done") && (
            <div className="flex gap-3 justify-end">
              <div className="max-w-md">
                <p
                  className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2 text-right"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Aryan
                </p>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-3">
                  <p
                    className="text-[var(--text-secondary)] leading-relaxed"
                    style={{ fontFamily: "var(--font-crimson)" }}
                  >
                    {playerMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scholar thinking */}
          {phase === "typing" && (
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] mt-2 flex-shrink-0" />
              <div className="flex items-center gap-1 pt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                    style={{
                      animation: `flicker 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scholar response */}
          {(phase === "responding" || phase === "done") && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] mt-2 flex-shrink-0" />
              <div>
                <p
                  className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {config?.name ?? "Scholar"}
                </p>
                <p
                  className="text-[var(--text-primary)] text-lg leading-relaxed italic"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  &ldquo;{scholarResponse}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input form */}
        {phase === "question" && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={playerMessage}
              onChange={(e) => {
                setPlayerMessage(e.target.value);
                setError("");
              }}
              placeholder="Type your answer in any language..."
              rows={4}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-gold)] text-[var(--text-primary)] px-4 py-3 focus:outline-none focus:border-[var(--accent-gold)] transition-colors resize-none placeholder:text-[var(--text-muted)]"
              style={{ fontFamily: "var(--font-crimson)", fontSize: "1.05rem" }}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 border border-[var(--accent-gold)] text-[var(--accent-gold-light)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300 tracking-widest uppercase text-sm cursor-pointer"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Speak Your Answer
            </button>
          </form>
        )}

        {/* Continue to challenge */}
        {phase === "responding" && (
          <button
            onClick={handleContinue}
            className="w-full py-3 border border-[var(--accent-gold)] text-[var(--accent-gold-light)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300 tracking-widest uppercase text-sm cursor-pointer animate-fade-in"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Accept the Challenge →
          </button>
        )}

        {/* Language hint */}
        {phase === "question" && (
          <p className="text-center text-[var(--text-muted)] text-xs">
            You may answer in any language — the scholar will respond in kind
          </p>
        )}
      </div>
    </div>
  );
}
