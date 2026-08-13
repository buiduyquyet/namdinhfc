import SectionTitle from "@/components/SectionTitle";
import MatchCard from "@/components/MatchCard";
import LeagueTable from "@/components/LeagueTable";
import { leagueTable } from "@/data/league-table";
import { getNextMatch } from "@/lib/matches-api";

export default async function NextMatchSection() {
  const nextMatch = await getNextMatch();

  return (
    <section id="lich-thi-dau" className="section">
      <div className="container">
        <SectionTitle
          title="Trận Đấu Sắp Tới"
          subtitle="Đừng bỏ lỡ trận đấu tiếp theo của Thép Xanh Nam Định tại V.League"
        />
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="flex-1 basis-100 min-w-[320px]">
            {nextMatch ? (
              <MatchCard match={nextMatch} variant="featured" title="Trận kế tiếp" />
            ) : (
              <div className="card h-full flex items-center justify-center p-10 text-center">
                <p className="text-gray-500">
                  Lịch thi đấu tiếp theo đang được cập nhật.
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 basis-100 min-w-[320px]">
            <LeagueTable teams={leagueTable} />
          </div>
        </div>
      </div>
    </section>
  );
}
