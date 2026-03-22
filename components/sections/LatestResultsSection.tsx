import SectionTitle from "@/components/SectionTitle";
import MatchCard from "@/components/MatchCard";
import { finishedMatches } from "@/data/matches";
import Link from "next/link";

export default function LatestResultsSection() {
  const latestResults = finishedMatches.slice(0, 3);

  return (
    <section className="section-alt">
      <div className="container">
        <SectionTitle
          title="Kết Quả Gần Đây"
          subtitle="Những trận đấu mới nhất của đội bóng thành Nam"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestResults.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/fixtures" className="btn btn-outline-dark">
            Xem Tất Cả Lịch Thi Đấu
          </Link>
        </div>
      </div>
    </section>
  );
}
