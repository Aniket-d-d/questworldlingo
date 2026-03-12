interface GameTitleProps {
  align?: "left" | "right";
  style?: React.CSSProperties;
}

export default function GameTitle({ align = "right", style }: GameTitleProps) {
  return (
    <div style={{ textAlign: align, ...style }}>
      <h1 style={{
        fontFamily: "var(--font-cinzel)",
        fontSize: "1.5rem",
        fontWeight: 700,
        background: "linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light), var(--accent-gold))",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shimmer 4s linear infinite",
      }}>
        Aryan&apos;s Quest
      </h1>
      <p style={{
        fontFamily: "var(--font-crimson)",
        fontSize: "0.85rem",
        color: "var(--text-muted)",
        fontStyle: "italic",
        marginTop: "2px",
      }}>
        The Road to Rebuild Nalanda
      </p>
    </div>
  );
}
