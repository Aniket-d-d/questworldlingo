import type { KingdomId } from "@/types";

type KingdomField = "name" | "location" | "language" | "artifact" | "scholarName" | "historicalHook";

interface KingdomTextProps {
  id: KingdomId;
  field: KingdomField;
}

export default function KingdomText({ id, field }: KingdomTextProps) {
  if (field === "name") {
    switch (id) {
      case "srivijaya": return <>Srivijaya Empire</>;
      case "japan":     return <>Heian Japan</>;
      case "korea":     return <>Goryeo Dynasty</>;
      case "china":     return <>Song Dynasty</>;
      case "tibet":     return <>Tibetan Empire</>;
    }
  }

  if (field === "location") {
    switch (id) {
      case "srivijaya": return <>Sumatra, Indonesia</>;
      case "japan":     return <>Kyoto, Japan</>;
      case "korea":     return <>Korea</>;
      case "china":     return <>Hangzhou, China</>;
      case "tibet":     return <>Lhasa, Tibet</>;
    }
  }

  if (field === "language") {
    switch (id) {
      case "srivijaya": return <>Indonesian</>;
      case "japan":     return <>Japanese</>;
      case "korea":     return <>Korean</>;
      case "china":     return <>Chinese</>;
      case "tibet":     return <>Tibetan</>;
    }
  }

  if (field === "artifact") {
    switch (id) {
      case "srivijaya": return <>Nalanda-Srivijaya Correspondence</>;
      case "japan":     return <>The Lotus Sutra Commentary</>;
      case "korea":     return <>Tripitaka Koreana Excerpt</>;
      case "china":     return <>Dream Pool Essays</>;
      case "tibet":     return <>Nalanda&apos;s Original Manuscripts</>;
    }
  }

  if (field === "scholarName") {
    switch (id) {
      case "srivijaya": return <>Dharmakirti of Srivijaya</>;
      case "japan":     return <>Master Kukai</>;
      case "korea":     return <>Monk Uicheon</>;
      case "china":     return <>Shen Kuo</>;
      case "tibet":     return <>Sakya Pandita</>;
    }
  }

  if (field === "historicalHook") {
    switch (id) {
      case "srivijaya": return <>King Balaputradeva funded a monastery at Nalanda. Srivijayan monks studied there for generations.</>;
      case "japan":     return <>Japanese monks revered Nalanda almost as a holy place. Kukai and Ennin traced their knowledge back to Nalanda&apos;s teachings.</>;
      case "korea":     return <>The Tripitaka Koreana — 81,000 wooden blocks containing the entire Buddhist canon — was being carved in this era. Much of it traces to Nalanda.</>;
      case "china":     return <>Chinese monk Xuanzang spent 17 years at Nalanda and brought back 657 texts. The Chinese revered Nalanda mythologically.</>;
      case "tibet":     return <>Tibetan monks who studied at Nalanda carried thousands of manuscripts back before the fire. Tibet preserved Nalanda&apos;s own soul.</>;
    }
  }

  return null;
}
