import GamePageShell from "@/components/games/GamePageShell";
import DinoGame from "@/components/games/DinoGame";

export default function DinoPage() {
  return (
    <GamePageShell title="小恐龍" description="經典的無盡跑酷，跳過仙人掌，看看能撐多遠。">
      <DinoGame />
    </GamePageShell>
  );
}
