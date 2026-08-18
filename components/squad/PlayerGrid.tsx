import Link from "next/link";

import PlayerCard from "@/components/PlayerCard";
import type { Player } from "@/data/players";

interface PlayerGridProps {
  players: Player[];
}

/** Lưới cầu thủ, mỗi card link sang trang chi tiết. Dùng chung ở `/squad` và trang cầu thủ. */
const PlayerGrid = ({ players }: PlayerGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {players.map((player, index) => (
      <Link
        key={player.id}
        href={`/squad/${player.slug}`}
        className="no-underline text-inherit"
      >
        <PlayerCard player={player} index={index} />
      </Link>
    ))}
  </div>
);

export default PlayerGrid;
