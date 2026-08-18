import PlayerGrid from "@/components/squad/PlayerGrid";
import { Player, Position, positionLabels } from "@/data/players";

interface PlayerSectionProps {
  position: Position;
  players: Player[];
}

const PlayerSection = ({
  position,
  players,
}: PlayerSectionProps) => {
  if (players.length === 0) return null;

  return (
    <section className="mb-12 md:mb-16 last:mb-0">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-secondary uppercase tracking-tight shrink-0">
          {positionLabels[position]}
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-full shrink-0">
          {players.length} Cầu thủ
        </span>
      </div>

      {/* Players Grid */}
      <PlayerGrid players={players} />
    </section>
  );
};

export default PlayerSection;
