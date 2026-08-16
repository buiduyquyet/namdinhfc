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

  // Chỉ tính trung bình trên các cầu thủ đã khai ngày sinh (age > 0),
  // tránh chia cho 0 khi danh sách rỗng hoặc chưa ai có ngày sinh.
  const playersWithAge = players.filter((p) => p.age > 0);
  const averageAge = playersWithAge.length
    ? Math.round(
        playersWithAge.reduce((acc, p) => acc + p.age, 0) / playersWithAge.length
      )
    : 0;

  // Cùng cách tính với độ tuổi: chỉ lấy trung bình trên cầu thủ đã khai chiều cao
  const playersWithHeight = players.filter((p) => (p.height ?? 0) > 0);
  const averageHeight = playersWithHeight.length
    ? Math.round(
        playersWithHeight.reduce((acc, p) => acc + (p.height ?? 0), 0) /
          playersWithHeight.length
      )
    : 0;

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
        averageHeight={averageHeight}
      />
    </main>
  );
}
