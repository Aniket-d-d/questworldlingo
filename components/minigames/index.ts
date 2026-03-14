import SrivijayaGame from "./SrivijayaGame";
import JapanGame from "./JapanGame";
import KoreaGame from "./KoreaGame";
import ChinaGame from "./ChinaGame";
import TibetGame from "./TibetGame";

interface GameProps {
  pairCount: number;
  onComplete: (score: number, total: number) => void;
  difficulty?: 1 | 2 | 3;
  currentRound?: number;
  totalRounds?: number;
}

type GameComponent = (props: GameProps) => React.ReactElement | null;

export const KINGDOM_GAMES: Record<string, GameComponent> = {
  srivijaya: SrivijayaGame,
  japan: JapanGame,
  korea: KoreaGame,
  china: ChinaGame,
  tibet: TibetGame,
};
