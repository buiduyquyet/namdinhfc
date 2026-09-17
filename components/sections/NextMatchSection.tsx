import SectionTitle from "@/components/SectionTitle";
import MatchCard from "@/components/MatchCard";
import LeagueTable from "@/components/LeagueTable";
import PanelCard from "@/components/PanelCard";
import { getNextMatch } from "@/lib/matches-api";
import { getLeagueStandings } from "@/lib/standings-api";

/** Số dòng của bảng xếp hạng rút gọn — cao xấp xỉ thẻ trận kế tiếp bên cạnh. */
const STANDINGS_PREVIEW_ROWS = 5;

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex-1 flex items-center justify-center p-10 text-center">
    <p className="text-gray-500">{message}</p>
  </div>
);

export default async function NextMatchSection() {
  const [nextMatch, standings] = await Promise.all([getNextMatch(), getLeagueStandings()]);

  const standingsCaption = standings
    ? [`Mùa ${standings.season}`, standings.matchday ? `Sau vòng ${standings.matchday}` : ""]
        .filter(Boolean)
        .join(" · ")
    : undefined;

  return (
    <section id="lich-thi-dau" className="section">
      <div className="container">
        <SectionTitle
          title="Lịch Thi Đấu & Bảng Xếp Hạng"
          subtitle="Trận đấu tiếp theo và thứ hạng hiện tại của Thép Xanh Nam Định tại V.League"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PanelCard
            title="Trận kế tiếp"
            action={{ label: "Lịch thi đấu", href: "/fixtures" }}
          >
            {nextMatch ? (
              <MatchCard match={nextMatch} variant="featured" />
            ) : (
              <EmptyState message="Lịch thi đấu tiếp theo đang được cập nhật." />
            )}
          </PanelCard>

          <PanelCard
            title="Bảng xếp hạng"
            caption={standingsCaption}
            action={{ label: "Xem tất cả", href: "/fixtures#bang-xep-hang" }}
          >
            {standings && standings.entries.length > 0 ? (
              <LeagueTable teams={standings.entries} limit={STANDINGS_PREVIEW_ROWS} />
            ) : (
              <EmptyState message="Bảng xếp hạng đang được cập nhật." />
            )}
          </PanelCard>
        </div>
      </div>
    </section>
  );
}
