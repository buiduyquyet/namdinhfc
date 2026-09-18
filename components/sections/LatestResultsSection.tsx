import SectionTitle from "@/components/SectionTitle";
import MatchCard from "@/components/MatchCard";
import { getLatestResults } from "@/lib/matches-api";

export default async function LatestResultsSection() {
  const latestResults = await getLatestResults(3);

  // Chưa có kết quả nào thì ẩn hẳn section thay vì hiện khối rỗng
  if (latestResults.length === 0) return null;

  return (
    <section className="home-section home-results-section">
      <div className="container">
        <SectionTitle
          variant="editorial"
          title="Kết quả gần đây"
          action={{ label: "Tất cả kết quả", href: "/fixtures?tab=results" }}
        />
        <div className="home-results-grid">
          {latestResults.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
