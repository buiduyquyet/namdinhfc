import PageHero from "@/components/PageHero";
import ClubHistory from "@/components/about/ClubHistory";
import Timeline from "@/components/about/Timeline";
import StadiumSection from "@/components/about/StadiumSection";
import SectionTitle from "@/components/about/SectionTitle";
import { clubInfo, timeline, clubStats } from "@/data/club-info";

// Transform timeline data to match component interface
const timelineEvents = timeline.map((event) => ({
  year: event.year.toString(),
  title: event.title,
  description: event.description,
  type: event.type.toUpperCase(),
}));

const stadiumStats = [
  { value: "30.000", label: "Chỗ ngồi" },
  { value: "2003", label: "Khánh thành" },
  { value: "Hạng 1", label: "Tiêu chuẩn" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        title="Giới Thiệu Câu Lạc Bộ"
        subtitle="Hào khí Đông A - Bản sắc của một chảo lửa huyền thoại"
        breadcrumbs={[{ label: "Giới Thiệu", href: "/about" }]}
      />

      {/* History Section */}
      <ClubHistory
        clubStats={{
          founded: clubStats.founded.toString(),
          titles: clubStats.titles,
          stadiumCapacity: clubStats.stadiumCapacity,
        }}
        clubInfo={{
          founded: clubInfo.founded.toString(),
          history: "",
          description: "",
        }}
      />

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <SectionTitle
            title="Hành Trình"
            highlight="Lịch Sử"
            subtitle="Những mốc son đánh dấu chặng đường phát triển của Thép Xanh Nam Định"
          />
          <Timeline events={timelineEvents} />
        </div>
      </section>

      {/* Stadium Section */}
      <StadiumSection
        title="Thiên Trường"
        subtitle='Được mệnh danh là "Chảo lửa" của bóng đá Việt Nam, Thiên Trường luôn là điểm tựa tinh thần vững chắc cho các cầu thủ Thép Xanh Nam Định.'
        stats={stadiumStats}
      />
    </main>
  );
}
