import SectionTitle from "@/components/SectionTitle";
import MatchCard from "@/components/MatchCard";
import LeagueTable from "@/components/LeagueTable";
import { nextMatch } from "@/data/matches";
import { leagueTable } from "@/data/league-table";

export default function NextMatchSection() {
  if (!nextMatch) return null;

  return (
    <section id="lich-thi-dau" className="section">
      <div className="container">
        <SectionTitle
          title="Trận Đấu Sắp Tới"
          subtitle="Đừng bỏ lỡ trận đấu tiếp theo của Thép Xanh Nam Định tại V.League"
        />
        <div
          className="flex flex-wrap lg:flex-nowrap justify-between gap-6"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {/* Left: Next Match */}
          <div
            style={{
              flex: "1 1 400px",
              minWidth: "320px",
            }}
          >
            <MatchCard match={nextMatch} variant="featured" />
          </div>

          {/* Right: League Table */}
          <div
            style={{
              flex: "1 1 400px",
              minWidth: "320px",
            }}
          >
            <LeagueTable teams={leagueTable} />
          </div>
        </div>
      </div>
    </section>
  );
}
