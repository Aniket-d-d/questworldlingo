interface AryanCharacterProps {
  size?: number;
  className?: string;
}

export default function AryanCharacter({ size = 200, className = "" }: AryanCharacterProps) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── Glow beneath feet ── */}
      <ellipse cx="100" cy="312" rx="40" ry="6" fill="#c9922a" opacity="0.15" />

      {/* ── Sandals ── */}
      <rect x="78" y="298" width="22" height="7" rx="2" fill="#7a5c2e" />
      <rect x="100" y="298" width="22" height="7" rx="2" fill="#7a5c2e" />
      <line x1="89" y1="298" x2="89" y2="294" stroke="#a07840" strokeWidth="1.5" />
      <line x1="111" y1="298" x2="111" y2="294" stroke="#a07840" strokeWidth="1.5" />

      {/* ── Legs / Dhoti ── */}
      {/* Left leg */}
      <path d="M88 230 L82 298" stroke="#c9922a" strokeWidth="12" strokeLinecap="round" />
      {/* Right leg */}
      <path d="M112 230 L118 298" stroke="#c9922a" strokeWidth="12" strokeLinecap="round" />

      {/* ── Dhoti wrap ── */}
      <path
        d="M75 190 Q80 220 82 250 Q90 240 100 242 Q110 240 118 250 Q120 220 125 190 Z"
        fill="#c9922a"
        opacity="0.9"
      />
      {/* Dhoti fold lines */}
      <path d="M88 195 Q90 215 88 235" stroke="#a07030" strokeWidth="0.8" opacity="0.6" />
      <path d="M100 192 Q100 215 100 238" stroke="#a07030" strokeWidth="0.8" opacity="0.6" />
      <path d="M112 195 Q110 215 112 235" stroke="#a07030" strokeWidth="0.8" opacity="0.6" />
      {/* Dhoti waist band */}
      <rect x="75" y="187" width="50" height="5" rx="1" fill="#a07030" />

      {/* ── Torso / Kurta ── */}
      <path
        d="M78 145 Q72 165 75 190 L125 190 Q128 165 122 145 Q110 135 100 134 Q90 135 78 145 Z"
        fill="#1a1410"
        stroke="#4a3520"
        strokeWidth="1"
      />
      {/* Kurta centre seam */}
      <line x1="100" y1="140" x2="100" y2="188" stroke="#4a3520" strokeWidth="1" opacity="0.8" />
      {/* Kurta collar detail */}
      <path d="M93 140 Q100 148 107 140" stroke="#c9922a" strokeWidth="1.2" fill="none" />

      {/* ── Uttariya (shoulder cloth) ── */}
      <path
        d="M78 145 Q65 155 60 170 Q65 175 72 170 Q76 160 82 155"
        fill="#8b2500"
        opacity="0.85"
      />
      <path
        d="M78 145 Q70 158 65 172"
        stroke="#c43c00"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />

      {/* ── Left arm ── */}
      <path d="M78 148 Q68 165 65 185" stroke="#c8a882" strokeWidth="10" strokeLinecap="round" />
      {/* Left hand */}
      <circle cx="64" cy="188" r="6" fill="#c8a882" />

      {/* ── Right arm (holding satchel strap) ── */}
      <path d="M122 148 Q132 165 135 182" stroke="#c8a882" strokeWidth="10" strokeLinecap="round" />
      {/* Right hand */}
      <circle cx="136" cy="185" r="6" fill="#c8a882" />

      {/* ── Satchel / bag ── */}
      <rect x="128" y="180" width="24" height="22" rx="3" fill="#5a3a1a" stroke="#a07030" strokeWidth="1" />
      <line x1="128" y1="191" x2="152" y2="191" stroke="#a07030" strokeWidth="0.8" />
      {/* Strap */}
      <path d="M136 185 Q145 175 140 160 Q135 148 126 148" stroke="#7a5020" strokeWidth="2" fill="none" />
      {/* Bag clasp */}
      <rect x="137" y="187" width="6" height="4" rx="1" fill="#c9922a" />

      {/* ── Neck ── */}
      <rect x="94" y="128" width="12" height="18" rx="4" fill="#c8a882" />

      {/* ── Head ── */}
      <ellipse cx="100" cy="108" rx="24" ry="26" fill="#c8a882" />

      {/* ── Hair ── */}
      {/* Main hair mass */}
      <path
        d="M76 100 Q78 78 100 76 Q122 78 124 100 Q122 88 114 84 Q106 80 100 80 Q94 80 86 84 Q78 88 76 100 Z"
        fill="#1a0f00"
      />
      {/* Hair tuft / tied back */}
      <path d="M114 84 Q120 80 122 76 Q118 74 114 78" fill="#1a0f00" />
      <circle cx="120" cy="78" r="3" fill="#1a0f00" />
      {/* Hair tie */}
      <circle cx="120" cy="78" r="2" fill="#c9922a" />

      {/* ── Face features ── */}
      {/* Eyes */}
      <ellipse cx="91" cy="108" rx="4" ry="3.5" fill="#0f0a05" />
      <ellipse cx="109" cy="108" rx="4" ry="3.5" fill="#0f0a05" />
      {/* Eye whites */}
      <ellipse cx="91" cy="107.5" rx="3.5" ry="3" fill="white" opacity="0.9" />
      <ellipse cx="109" cy="107.5" rx="3.5" ry="3" fill="white" opacity="0.9" />
      {/* Pupils */}
      <circle cx="92" cy="108" r="2" fill="#0f0a05" />
      <circle cx="110" cy="108" r="2" fill="#0f0a05" />
      {/* Eye shine */}
      <circle cx="93" cy="107" r="0.7" fill="white" opacity="0.8" />
      <circle cx="111" cy="107" r="0.7" fill="white" opacity="0.8" />
      {/* Eyebrows */}
      <path d="M87 103 Q91 101 95 103" stroke="#1a0f00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M105 103 Q109 101 113 103" stroke="#1a0f00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M98 112 Q100 116 102 112" stroke="#a07860" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Mouth — slight determined expression */}
      <path d="M93 120 Q100 124 107 120" stroke="#9a6858" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── Forehead tilak (mark) ── */}
      <ellipse cx="100" cy="98" rx="1.5" ry="3" fill="#c9922a" opacity="0.9" />

      {/* ── Earrings ── */}
      <circle cx="76" cy="112" r="2.5" fill="#c9922a" opacity="0.8" />
      <circle cx="124" cy="112" r="2.5" fill="#c9922a" opacity="0.8" />
    </svg>
  );
}
