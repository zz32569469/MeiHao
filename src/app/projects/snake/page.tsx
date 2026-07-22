import GamePageShell from "@/components/games/GamePageShell";
import SnakeGame from "@/components/games/SnakeGame";

export default function SnakePage() {
  return (
    <GamePageShell title="貪食蛇" description="吃到越多，蛇越長、速度越快，撞到自己或牆就結束。">
      <SnakeGame />
    </GamePageShell>
  );
}
