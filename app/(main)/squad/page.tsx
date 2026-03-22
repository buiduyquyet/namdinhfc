import PageHero from "@/components/PageHero";
import PlayerSection from "@/components/squad/PlayerSection";
import SquadStats from "@/components/squad/SquadStats";
import { Position } from "@/data/players";
import { getPayloadPlayers } from "@/lib/payload-api";

const POSITIONS: Position[] = ["goalkeeper", "defender", "midfielder", "forward"];

export default async function SquadPage() {
  const players = await getPayloadPlayers();
  // Calculate squad statistics
  const totalPlayers = players.length;
  const foreignPlayers = players.filter((p) => p.nationality !== "Việt Nam").length;
  const averageAge = Math.round(
    players.reduce((acc, p) => acc + p.age, 0) / players.length
  );
  const totalGoals = players.reduce(
    (acc, p) => acc + (p.stats?.goals || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="Đội Hình Tuyển Thủ"
        subtitle="Những chiến binh Thép đang chinh chiến tại đấu trường V.League"
        breadcrumbs={[{ label: "Đội Hình", href: "/squad" }]}
      />

      {/* Players Section */}
      <div className="container py-12 md:py-16">
        {POSITIONS.map((position) => {
          const playersInPosition = players.filter((p) => p.position === position);
          return (
            <PlayerSection
              key={position}
              position={position}
              players={playersInPosition}
            />
          );
        })}
      </div>

      {/* Squad Statistics */}
      <SquadStats
        totalPlayers={totalPlayers}
        foreignPlayers={foreignPlayers}
        averageAge={averageAge}
        totalGoals={totalGoals}
      />
    </main>
  );
}
