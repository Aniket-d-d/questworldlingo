"use client";

import { useState } from "react";

interface PlayerSetupProps {
  onComplete: (name: string) => void;
}

export default function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div>
          <h1
            className="text-3xl font-bold text-[var(--accent-gold-light)] glow-gold mb-2"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Aryan&apos;s Quest
          </h1>
          <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}>
            The Road to Rebuild Nalanda
          </p>
        </div>

        <div className="border border-[var(--border-gold)] bg-[var(--bg-card)] p-8">
          <p
            className="text-[var(--text-secondary)] mb-6 leading-relaxed italic"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            The monk looks at you from the rubble of Nalanda.
            <br />
            <br />
            &ldquo;What is your name, young traveller?&rdquo;
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-gold)] text-[var(--text-primary)] px-4 py-3 text-center focus:outline-none focus:border-[var(--accent-gold)] transition-colors placeholder:text-[var(--text-muted)]"
              style={{ fontFamily: "var(--font-crimson)", fontSize: "1.1rem" }}
              maxLength={30}
              autoFocus
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 border border-[var(--accent-gold)] text-[var(--accent-gold-light)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all duration-300 tracking-widest uppercase text-sm cursor-pointer"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Begin Quest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
