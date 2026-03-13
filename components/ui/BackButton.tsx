"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href = "/game" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      style={{
        alignSelf: "flex-start",
        padding: "6px 14px",
        border: "1px solid var(--border-gold)",
        background: "transparent",
        color: "var(--text-muted)",
        fontFamily: "var(--font-cinzel)",
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s",
        marginBottom: "16px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-gold)";
        e.currentTarget.style.color = "var(--accent-gold-light)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-gold)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      ← World Map
    </button>
  );
}
