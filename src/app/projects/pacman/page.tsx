import GamePageShell from "@/components/games/GamePageShell";
import PacmanGame from "@/components/games/PacmanGame";

export default function PacmanPage() {
  return (
    <GamePageShell title="小精靈" description="簡化版小精靈，吃光所有豆子過關，小心兩隻鬼魂。">
      <PacmanGame />
    </GamePageShell>
  );
}
