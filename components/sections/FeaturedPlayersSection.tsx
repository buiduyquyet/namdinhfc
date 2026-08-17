import SectionTitle from "@/components/SectionTitle";
import PlayerCarousel from "@/components/PlayerCarousel";
import { getFeaturedPlayers } from "@/lib/payload-api";
import Link from "next/link";

export default async function FeaturedPlayersSection() {
  const featuredPlayers = await getFeaturedPlayers();

  // Chưa tick cầu thủ nổi bật nào thì ẩn hẳn section thay vì hiện khối rỗng
  if (featuredPlayers.length === 0) return null;

  return (
    <section id="doi-hinh" className="section">
      <div className="container">
        <SectionTitle
          title="Ngôi Sao Nổi Bật"
          subtitle="Những cầu thủ tài năng tạo nên sức mạnh của Thép Xanh Nam Định"
        />
        <PlayerCarousel players={featuredPlayers} />

        <div className="text-center mt-10">
          <Link href="/squad" className="btn btn-outline-dark">
            Xem Toàn Bộ Đội Hình
          </Link>
        </div>
      </div>
    </section>
  );
}
