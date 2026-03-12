import { Kingdom } from "@/types";

export const MONK_DIALOGUE = {
  lines: [
    "My father described Nalanda like a second sky — so vast, so full of light.",
    "He said walking its corridors felt like touching everything humanity had ever known.",
    "Then the news reached our village. Foreign invaders. Fire. No survivors.",
    "My father was one of the scholars who could not escape.",
    "I left home the same day the news arrived.",
    "Months later, I arrived at the gates. Nothing remained but ash and silence.",
    "Nine million manuscripts. Gone. Every word my father ever read — gone.",
    "But knowledge does not vanish. It moves. It hides. It waits.",
    "I know where it went. And I am going to bring it all back — for him.",
  ],
  farewellLine: "I am going to bring it all back — for him.",
};

export const OPENING_NARRATION = [
  "1193 AD. Foreign invaders sweep through northern India.",
  "Nalanda — the greatest university the world had ever seen — is set on fire.",
  "Nine million manuscripts. Ten thousand students. Two thousand teachers.",
  "The fire burns for three months.",
  "Every book, every scroll, every word of human knowledge — reduced to ash.",
  "The world does not yet know what it has lost.",
];

export const KINGDOMS: Kingdom[] = [
  {
    id: "srivijaya",
    name: "Srivijaya Empire",
    location: "Sumatra, Indonesia",
    language: "Indonesian",
    historicalHook:
      "King Balaputradeva funded a monastery at Nalanda. Srivijayan monks studied there for generations.",
    artifact: "Nalanda-Srivijaya Correspondence",
    scholarName: "Dharmakirti of Srivijaya",
    miniGame: "memory_glow",
  },
  {
    id: "japan",
    name: "Heian Japan",
    location: "Kyoto, Japan",
    language: "Japanese",
    historicalHook:
      "Japanese monks revered Nalanda almost as a holy place. Kukai and Ennin traced their knowledge back to Nalanda's teachings.",
    artifact: "The Lotus Sutra Commentary",
    scholarName: "Master Kukai",
    miniGame: "tetris",
  },
  {
    id: "korea",
    name: "Goryeo Dynasty",
    location: "Korea",
    language: "Korean",
    historicalHook:
      "The Tripitaka Koreana — 81,000 wooden blocks containing the entire Buddhist canon — was being carved in this era. Much of it traces to Nalanda.",
    artifact: "Tripitaka Koreana Excerpt",
    scholarName: "Monk Uicheon",
    miniGame: "math_puzzle",
  },
  {
    id: "china",
    name: "Song Dynasty",
    location: "Hangzhou, China",
    language: "Chinese",
    historicalHook:
      "Chinese monk Xuanzang spent 17 years at Nalanda and brought back 657 texts. The Chinese revered Nalanda mythologically.",
    artifact: "Dream Pool Essays",
    scholarName: "Shen Kuo",
    miniGame: "memory_match",
  },
  {
    id: "tibet",
    name: "Tibetan Empire",
    location: "Lhasa, Tibet",
    language: "Tibetan",
    historicalHook:
      "Tibetan monks who studied at Nalanda carried thousands of manuscripts back before the fire. Tibet preserved Nalanda's own soul.",
    artifact: "Nalanda's Original Manuscripts",
    scholarName: "Sakya Pandita",
    miniGame: "bridges",
  },
];

export const SCHOLAR_QUESTION_TYPES = {
  justification: "Why do you deserve this manuscript?",
  knowledge: "What do you know of our civilization?",
  personal: "What do you miss most about Nalanda?",
} as const;
