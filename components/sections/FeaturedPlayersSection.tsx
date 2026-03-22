import SectionTitle from "@/components/SectionTitle";
import PlayerCard from "@/components/PlayerCard";
import { getPayloadPlayers } from "@/lib/payload-api";
import Link from "next/link";

const gridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "1.5rem",
} as const;

export default async function FeaturedPlayersSection() {
  const allPlayers = await getPayloadPlayers();
  // Lấy ra 4 cầu thủ tượng trưng (có thể làm logic isFeatured sau)
  const featuredPlayers = allPlayers.slice(0, 4);

  return (
    <section id="doi-hinh" className="section">
      <div className="container">
        <SectionTitle
          title="Ngôi Sao Nổi Bật"
          subtitle="Những cầu thủ tài năng tạo nên sức mạnh của Thép Xanh Nam Định"
        />
        <div style={gridStyles}>
          {featuredPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={`/squad/${player.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <PlayerCard player={player} index={index} />
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/squad" className="btn btn-outline-dark">
            Xem Toàn Bộ Đội Hình
          </Link>
        </div>
      </div>
    </section>
  );
}
