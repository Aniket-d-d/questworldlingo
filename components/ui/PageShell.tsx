"use client";

import { useState, useEffect, ReactNode } from "react";

const EMBERS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + i * 7.5}%`,
  size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
  duration: 4 + (i % 4),
  delay: i * 0.6,
}));

interface PageShellProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PageShell({ children, className = "", style }: PageShellProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        opacity: loaded ? 1 : 0,
        transition: "opacity 1.2s ease",
        position: "relative",
        ...style,
      }}
    >
      {/* ── Full-screen amber glow at bottom ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50,
        background: "linear-gradient(to top, rgba(139,37,0,0.22) 0%, rgba(139,37,0,0.06) 35%, transparent 65%)",
      }} />

      {/* ── Ember particles ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {EMBERS.map((e) => (
          <div
            key={e.id}
            style={{
              position: "absolute",
              left: e.left,
              bottom: "15%",
              width: `${e.size}px`,
              height: `${e.size}px`,
              borderRadius: "50%",
              backgroundColor: "#c9922a",
              animation: `emberFloat ${e.duration}s ease-out ${e.delay}s infinite`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
