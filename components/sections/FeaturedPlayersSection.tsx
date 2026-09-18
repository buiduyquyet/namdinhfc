import SectionTitle from "@/components/SectionTitle";
import PlayerCarousel from "@/components/PlayerCarousel";
import { getFeaturedPlayers } from "@/lib/payload-api";

export default async function FeaturedPlayersSection() {
  const featuredPlayers = await getFeaturedPlayers();

  // Chưa tick cầu thủ nổi bật nào thì ẩn hẳn section thay vì hiện khối rỗng
  if (featuredPlayers.length === 0) return null;

  return (
    <section id="doi-hinh" className="home-section">
      <div className="container">
        <SectionTitle
          variant="editorial"
          eyebrow="Những gương mặt thành Nam"
          title="Ngôi sao nổi bật"
          action={{ label: "Toàn bộ đội hình", href: "/squad" }}
        />
        <PlayerCarousel players={featuredPlayers} />

      </div>
    </section>
  );
}
