"use client";

import { Kingdom, KingdomStatus } from "@/types";
import KingdomText from "./KingdomText";

interface KingdomCardProps {
  kingdom: Kingdom;
  status: KingdomStatus;
  artifactCollected: boolean;
  onClick: () => void;
}

const STATUS_STYLES: Record<KingdomStatus, string> = {
  locked: "cursor-not-allowed",
  available: "cursor-pointer hover:border-[var(--accent-gold)] hover:bg-[var(--bg-secondary)]",
  in_progress: "cursor-pointer border-[var(--accent-gold)] bg-[var(--bg-secondary)]",
  completed: "cursor-pointer border-green-800 bg-[var(--bg-secondary)] opacity-80",
};

const STATUS_DOT_COLOR: Record<KingdomStatus, string> = {
  locked: "bg-[var(--text-muted)]",
  available: "bg-[var(--accent-gold)]",
  in_progress: "bg-yellow-400",
  completed: "bg-green-500",
};

const KINGDOM_NUMBERS: Record<string, string> = {
  srivijaya: "I",
  japan: "II",
  korea: "III",
  china: "IV",
  tibet: "V",
};

export default function KingdomCard({
  kingdom,
  status,
  artifactCollected,
  onClick,
}: KingdomCardProps) {
  return (
    <div
      onClick={status !== "locked" ? onClick : undefined}
      className={`relative border border-[var(--border-gold)] bg-[var(--bg-card)] transition-all duration-300 ${STATUS_STYLES[status]}`}
      style={{ padding: "32px 36px" }}
    >
      {/* Kingdom number */}
      <span
        className="absolute top-3 right-4 text-[var(--text-muted)] text-xs"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {KINGDOM_NUMBERS[kingdom.id]}
      </span>

      {/* Artifact collected badge */}
      {artifactCollected && (
        <span className="absolute top-3 left-3 text-green-500 text-xs">✦</span>
      )}

      {/* Status dot + label */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${STATUS_DOT_COLOR[status]}`} />
        <span
          className="text-xs tracking-widest uppercase text-[var(--text-muted)]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          {status === "locked" ? <>Locked</> : status === "available" ? <>Available</> : status === "in_progress" ? <>In Progress</> : <>Completed</>}
        </span>
      </div>

      {/* Kingdom name */}
      <h3
        className="text-lg font-semibold text-[var(--accent-gold-light)] mb-1 leading-tight"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        <KingdomText id={kingdom.id} field="name" />
      </h3>

      {/* Location */}
      <p className="text-[var(--text-muted)] text-sm mb-3 italic">
        <KingdomText id={kingdom.id} field="location" />
      </p>

      {/* Artifact */}
      <div className="border-t border-[var(--border-color)] pt-3">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1"
          style={{ fontFamily: "var(--font-cinzel)" }}>
          Manuscript
        </p>
        <p className="text-sm text-[var(--text-secondary)]"><KingdomText id={kingdom.id} field="artifact" /></p>
      </div>

      {/* Language */}
      <div className="mt-3">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-cinzel)" }}>
          Language · <KingdomText id={kingdom.id} field="language" />
        </p>
      </div>

      {/* Locked overlay */}
      {status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl opacity-50">🔒</span>
        </div>
      )}
    </div>
  );
}
