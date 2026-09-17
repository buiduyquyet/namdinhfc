import type { Metadata } from "next";

import LeagueTable from "@/components/LeagueTable";
import PageHero from "@/components/PageHero";
import PanelCard from "@/components/PanelCard";
import FixtureFilters, {
  DEFAULT_STANDINGS_COMPETITION,
  type FixtureTab,
} from "@/components/fixtures/FixtureFilters";
import MatchMonthGroup from "@/components/fixtures/MatchMonthGroup";
import type { Competition } from "@/data/matches";
import { isCompetition } from "@/lib/competition";
import { getMatches, groupMatchesByMonth } from "@/lib/matches-api";
import { getLeagueStandings } from "@/lib/standings-api";

export const metadata: Metadata = {
  title: "Lịch Thi Đấu",
  description:
    "Lịch thi đấu, kết quả và bảng xếp hạng mới nhất của CLB Thép Xanh Nam Định tại V.League 1, Cúp Quốc Gia và AFC Champions League Two.",
};

interface FixturesPageProps {
  searchParams: Promise<{ tab?: string; competition?: string }>;
}

function parseTab(value?: string): FixtureTab {
  return value === "results" || value === "standings" ? value : "upcoming";
}

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState = ({ title, message }: EmptyStateProps) => (
  <div className="text-center py-16">
    <p className="font-heading font-bold text-xl text-secondary mb-2">{title}</p>
    <p className="text-gray-500">{message}</p>
  </div>
);

interface StandingsTabProps {
  competition: Competition;
}

async function StandingsTab({ competition }: StandingsTabProps) {
  const standings = await getLeagueStandings(competition);

  if (!standings || standings.entries.length === 0) {
    return (
      <EmptyState
        title="Chưa có bảng xếp hạng"
        message={`Bảng xếp hạng ${competition} đang được cập nhật. Vui lòng quay lại sau.`}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PanelCard
        title={`${standings.competition} · ${standings.season}`}
        caption={standings.matchday ? `Cập nhật sau vòng ${standings.matchday}` : undefined}
      >
        <LeagueTable teams={standings.entries} />
      </PanelCard>
    </div>
  );
}

interface MatchesTabProps {
  tab: Exclude<FixtureTab, "standings">;
  competition?: Competition;
}

async function MatchesTab({ tab, competition }: MatchesTabProps) {
  const matches = await getMatches({
    group: tab === "results" ? "finished" : "upcoming",
    competition,
  });
  const groups = groupMatchesByMonth(matches);

  if (groups.length === 0) {
    return (
      <EmptyState
        title={tab === "results" ? "Chưa có kết quả nào" : "Chưa có lịch thi đấu"}
        message={
          competition
            ? `Không có trận nào ở giải ${competition}. Thử chọn "Tất cả giải".`
            : "Nội dung đang được cập nhật. Vui lòng quay lại sau."
        }
      />
    );
  }

  return groups.map((group) => (
    <MatchMonthGroup key={group.key} monthKey={group.key} matches={group.matches} />
  ));
}

export default async function FixturesPage({ searchParams }: FixturesPageProps) {
  const { tab: rawTab, competition: rawCompetition } = await searchParams;

  const tab = parseTab(rawTab);
  const parsedCompetition = isCompetition(rawCompetition) ? rawCompetition : undefined;
  // Bảng xếp hạng luôn thuộc về một giải cụ thể
  const competition =
    tab === "standings" ? (parsedCompetition ?? DEFAULT_STANDINGS_COMPETITION) : parsedCompetition;

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Lịch Thi Đấu"
        subtitle="Lịch thi đấu, kết quả và bảng xếp hạng của Thép Xanh Nam Định"
        breadcrumbs={[{ label: "Lịch Thi Đấu", href: "/fixtures" }]}
      />

      <section className="section">
        <div className="container">
          <FixtureFilters tab={tab} competition={competition} />

          {tab === "standings" ? (
            <StandingsTab competition={competition ?? DEFAULT_STANDINGS_COMPETITION} />
          ) : (
            <MatchesTab tab={tab} competition={competition} />
          )}
        </div>
      </section>
    </main>
  );
}
